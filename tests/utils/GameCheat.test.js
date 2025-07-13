import GameState from "@models/GameState.js";
import GameCheat from "@utils/GameCheat.js";

describe("GameCheat", () => {
  let gameState;
  let gameCheat;
  let mockWindow;
  let originalConsoleLog;

  beforeEach(() => {
    // Mock console.log before any test setup
    originalConsoleLog = console.log;
    console.log = jest.fn();

    // Create a mock window object
    mockWindow = {
      console: console,
    };
    global.window = mockWindow;

    gameState = new GameState();
    gameCheat = new GameCheat(gameState);
  });

  afterEach(() => {
    // Clean up
    delete global.window;
    console.log = originalConsoleLog;
  });

  it("should initialize with cheats disabled", () => {
    expect(gameCheat.cheatsEnabled).toBe(false);
  });

  it("should enable cheats when cheat code is accessed", () => {
    // Access the cheat code property
    const result = mockWindow[gameCheat.cheatCode];

    expect(gameCheat.cheatsEnabled).toBe(true);
    expect(result).toBe(
      "Cheats enabled! Type 'help' in console for available commands."
    );
  });

  it("should register all cheat commands to window object", () => {
    // Enable cheats
    mockWindow[gameCheat.cheatCode];

    // Check if all commands are registered
    expect(typeof mockWindow.setMoney).toBe("function");
    expect(typeof mockWindow.setInfluence).toBe("function");
    expect(typeof mockWindow.setCurrentJobProgress).toBe("function");
    expect(typeof mockWindow.setCurrentLearningProgress).toBe("function");
    expect(typeof mockWindow.setCurrentJob).toBe("function");
    expect(typeof mockWindow.listJobs).toBe("function");
    expect(typeof mockWindow.completeSkill).toBe("function");
    expect(typeof mockWindow.listSkills).toBe("function");
    expect(typeof mockWindow.getItem).toBe("function");
    expect(typeof mockWindow.listItems).toBe("function");
    expect(typeof mockWindow.listFeatures).toBe("function");
    expect(typeof mockWindow.enableFeature).toBe("function");
    expect(typeof mockWindow.disableFeature).toBe("function");
    expect(typeof mockWindow.listCurrentFeatures).toBe("function");
    expect(typeof mockWindow.listAbilities).toBe("function");
    expect(typeof mockWindow.enableAbility).toBe("function");
    expect(typeof mockWindow.disableAbility).toBe("function");
    expect(typeof mockWindow.listCurrentAbilities).toBe("function");
    expect(typeof mockWindow.help).toBe("function");
  });

  it("should not execute commands when cheats are disabled", () => {
    // Register commands but don't enable cheats
    const commands = new GameCheat(gameState).commands;
    mockWindow.setMoney = (...args) => {
      if (!gameCheat.cheatsEnabled) {
        return "Cheats are not enabled!";
      }
      return commands.setMoney().execute(...args);
    };

    // Try to execute a command without enabling cheats
    const result = mockWindow.setMoney(1000);
    expect(result).toBe("Cheats are not enabled!");
    expect(gameState.getMoney()).toBe(0);
  });

  it("should execute commands when cheats are enabled", () => {
    // Enable cheats
    mockWindow[gameCheat.cheatCode];

    // Execute a command
    mockWindow.setMoney(1000);
    expect(gameState.getMoney()).toBe(1000);
  });

  it("should show help message when cheats are enabled", () => {
    // Enable cheats
    mockWindow[gameCheat.cheatCode];

    // Execute help command
    mockWindow.help();

    // Check if help message was shown
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toContain("Available cheat commands:");
  });
});
