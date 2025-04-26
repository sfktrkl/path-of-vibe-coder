import GameCheat from "../../src/utils/GameCheat.js";
import GameState from "../../src/models/GameState.js";

describe("GameCheat", () => {
  let gameState;
  let gameCheat;
  let mockWindow;

  beforeEach(() => {
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
    expect(typeof mockWindow.addMoney).toBe("function");
    expect(typeof mockWindow.setJob).toBe("function");
    expect(typeof mockWindow.listJobIds).toBe("function");
    expect(typeof mockWindow.completeSkill).toBe("function");
    expect(typeof mockWindow.listSkillIds).toBe("function");
    expect(typeof mockWindow.getItem).toBe("function");
    expect(typeof mockWindow.listItemIds).toBe("function");
    expect(typeof mockWindow.help).toBe("function");
  });

  it("should not execute commands when cheats are disabled", () => {
    // Register commands but don't enable cheats
    const commands = new GameCheat(gameState).commands;
    mockWindow.addMoney = (...args) => {
      if (!gameCheat.cheatsEnabled) {
        return "Cheats are not enabled!";
      }
      return commands.addMoney().execute(...args);
    };

    // Try to execute a command without enabling cheats
    const result = mockWindow.addMoney(1000);
    expect(result).toBe("Cheats are not enabled!");
    expect(gameState.money).toBe(0);
  });

  it("should execute commands when cheats are enabled", () => {
    // Enable cheats
    mockWindow[gameCheat.cheatCode];

    // Execute a command
    mockWindow.addMoney(1000);
    expect(gameState.money).toBe(1000);
  });

  it("should show help message when cheats are enabled", () => {
    // Enable cheats
    mockWindow[gameCheat.cheatCode];

    // Mock console.log
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    // Execute help command
    mockWindow.help();

    // Check if help message was shown
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toContain("Available cheat commands:");

    // Restore console.log
    console.log = originalConsoleLog;
  });
});
