import GameCheatCommands from "./GameCheatCommands.js";

export default class GameCheat {
  constructor(gameState) {
    this.gameState = gameState;
    this.cheatsEnabled = false;
    this.cheatCode = "GmG4X9PGOXs";
    this.commands = new GameCheatCommands(gameState);
    this.setupConsoleListener();
  }

  setupConsoleListener() {
    Object.defineProperty(window, this.cheatCode, {
      get: () => {
        this.enableCheats();
        return "Cheats enabled! Type 'help' in console for available commands.";
      },
    });
  }

  enableCheats() {
    this.cheatsEnabled = true;

    // Add all commands to window object
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.commands))
      .filter(
        (prop) =>
          prop !== "constructor" && typeof this.commands[prop] === "function"
      )
      .forEach((methodName) => {
        const command = this.commands[methodName]();
        window[methodName] = (...args) => {
          if (!this.cheatsEnabled) return "Cheats are not enabled!";
          return command.execute(...args);
        };
      });

    // Show help message
    this.commands.help().execute();
  }
}
