import GameState from "@/models/GameState";

describe("GameState", () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  test("should initialize with default values", () => {
    expect(gameState.money).toBe(0);
    expect(gameState.title).toBe("Everyday Normal Guy");
    expect(gameState.currentJob).toBeNull();
    expect(gameState.jobProgress).toBe(0);
    expect(gameState.currentLearning).toBeNull();
    expect(gameState.skillProgress).toEqual({});
  });

  test("should manage money correctly", () => {
    gameState.addMoney(100);
    expect(gameState.money).toBe(100);

    const success = gameState.spendMoney(50);
    expect(success).toBe(true);
    expect(gameState.money).toBe(50);

    const failure = gameState.spendMoney(100);
    expect(failure).toBe(false);
    expect(gameState.money).toBe(50);
  });

  test("should manage learning progress", () => {
    gameState.startLearning("test_skill");
    expect(gameState.currentLearning).toBe("test_skill");
    expect(gameState.getLearningProgress()).toBe(0);

    gameState.updateLearningProgress(50);
    expect(gameState.getLearningProgress()).toBe(50);

    gameState.updateLearningProgress(60);
    expect(gameState.currentLearning).toBeNull();
    expect(gameState.skillProgress["test_skill"]).toBe(110);
  });

  test("should check skill completion", () => {
    expect(gameState.hasSkill("test_skill")).toBe(false);

    gameState.startLearning("test_skill");
    gameState.updateLearningProgress(100);

    expect(gameState.hasSkill("test_skill")).toBe(true);
  });

  test("should serialize and deserialize state", () => {
    gameState.addMoney(100);
    gameState.startLearning("test_skill");
    gameState.updateLearningProgress(50);

    const json = gameState.toJSON();
    const newState = GameState.fromJSON(json);

    expect(newState.money).toBe(100);
    expect(newState.skillProgress["test_skill"]).toBe(50);
  });

  test("should encode and decode state", () => {
    gameState.addMoney(100);
    gameState.startLearning("test_skill");
    gameState.updateLearningProgress(50);

    const encoded = gameState.encode();
    const decoded = GameState.decode(encoded);

    expect(decoded.money).toBe(100);
    expect(decoded.skillProgress["test_skill"]).toBe(50);
  });
});
