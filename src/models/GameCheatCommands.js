export default class GameCheatCommands {
  constructor(gameState) {
    this.gameState = gameState;
  }

  addMoney() {
    return {
      description: "addMoney(amount: number) - Add money to your balance",
      execute: (amount) => {
        this.gameState.addMoney(amount);
        return `Added ${amount} money!`;
      },
    };
  }

  setJob() {
    return {
      description: "setJob(jobId: string) - Set your current job",
      execute: (jobId) => {
        const success = this.gameState.setJob(jobId);
        return success
          ? `Set job to ${jobId}!`
          : `Failed to set job to ${jobId}!`;
      },
    };
  }

  completeSkill() {
    return {
      description: "completeSkill(skillId: string) - Complete a skill",
      execute: (skillId) => {
        this.gameState.startLearning(skillId);
        this.gameState.updateLearningProgress(100);
        return `Completed skill ${skillId}!`;
      },
    };
  }

  help() {
    return {
      description: "help() - Show this help message",
      execute: () => {
        const commands = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
          .filter(
            (prop) => prop !== "constructor" && typeof this[prop] === "function"
          )
          .map((method) => this[method]().description)
          .join("\n");
        console.log(`Available cheat commands:\n${commands}`);
        return "Help message";
      },
    };
  }
}
