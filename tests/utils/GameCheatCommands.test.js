import GameCheatCommands from "../../src/utils/GameCheatCommands.js";
import GameState from "../../src/models/GameState.js";
import { jobs } from "../../src/data/jobs.js";
import { skills } from "../../src/data/skills.js";
import { items } from "../../src/data/items.js";

describe("GameCheatCommands", () => {
  let gameState;
  let commands;
  let originalConsoleLog;

  beforeEach(() => {
    gameState = new GameState();
    commands = new GameCheatCommands(gameState);
    originalConsoleLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  describe("addMoney", () => {
    it("should add money to game state", () => {
      commands.addMoney().execute(1000);
      expect(gameState.money).toBe(1000);
    });
  });

  describe("setMoney", () => {
    it("should set money to specific amount", () => {
      commands.setMoney().execute(5000);
      expect(gameState.money).toBe(5000);
    });

    it("should handle zero amount", () => {
      commands.setMoney().execute(0);
      expect(gameState.money).toBe(0);
    });
  });

  describe("setJobProgress", () => {
    it("should set progress for current job", () => {
      // Set a current job first
      const jobId = Object.keys(jobs)[0];
      gameState.currentJob = jobId;

      commands.setJobProgress().execute(75);
      expect(gameState.jobProgress).toBe(75);
    });

    it("should not set progress if no job is selected", () => {
      gameState.currentJob = null;
      commands.setJobProgress().execute(50);
      expect(console.log).toHaveBeenCalledWith("No job is currently selected!");
    });

    it("should not set progress outside valid range", () => {
      const jobId = Object.keys(jobs)[0];
      gameState.currentJob = jobId;
      commands.setJobProgress().execute(150);
      expect(console.log).toHaveBeenCalledWith(
        "Progress must be between 0 and 100!"
      );
    });
  });

  describe("setSkillProgress", () => {
    it("should set progress for current skill", () => {
      // Set a current skill first
      const skillId = Object.keys(skills)[0];
      gameState.currentLearning = skillId;

      commands.setSkillProgress().execute(60);
      expect(gameState.skillProgress[skillId]).toBe(60);
    });

    it("should not set progress if no skill is being learned", () => {
      gameState.currentLearning = null;
      commands.setSkillProgress().execute(50);
      expect(console.log).toHaveBeenCalledWith(
        "No skill is currently being learned!"
      );
    });

    it("should not set progress outside valid range", () => {
      const skillId = Object.keys(skills)[0];
      gameState.currentLearning = skillId;
      commands.setSkillProgress().execute(-10);
      expect(console.log).toHaveBeenCalledWith(
        "Progress must be between 0 and 100!"
      );
    });
  });

  describe("setJob", () => {
    it("should set job and handle requirements", () => {
      // Get a job that has requirements
      const jobWithRequirements = Object.values(jobs).find(
        (job) => job.requiredSkills.length > 0 || job.requiredJobs.length > 0
      );
      expect(jobWithRequirements).toBeDefined();

      // Execute setJob
      commands.setJob().execute(jobWithRequirements.id);

      // Check if job was set
      expect(gameState.currentJob).toBe(jobWithRequirements.id);

      // Check if required skills were completed
      jobWithRequirements.requiredSkills.forEach((skillId) => {
        expect(gameState.hasSkill(skillId)).toBe(true);
      });
    });

    it("should not set job if it doesn't exist", () => {
      commands.setJob().execute("non_existent_job");
      expect(console.log).toHaveBeenCalledWith(
        "Job non_existent_job not found!"
      );
    });
  });

  describe("completeSkill", () => {
    it("should complete skill and handle prerequisites", () => {
      // Get a skill that has prerequisites
      const skillWithPrerequisites = Object.values(skills).find(
        (skill) => skill.prerequisites.length > 0
      );
      expect(skillWithPrerequisites).toBeDefined();

      // Execute completeSkill
      commands.completeSkill().execute(skillWithPrerequisites.id);

      // Check if skill was completed
      expect(gameState.hasSkill(skillWithPrerequisites.id)).toBe(true);

      // Check if prerequisites were completed
      skillWithPrerequisites.prerequisites.forEach((prerequisiteId) => {
        expect(gameState.hasSkill(prerequisiteId)).toBe(true);
      });
    });

    it("should not complete skill if it doesn't exist", () => {
      commands.completeSkill().execute("non_existent_skill");
      expect(console.log).toHaveBeenCalledWith(
        "Skill non_existent_skill not found!"
      );
    });
  });

  describe("getItem", () => {
    it("should get item and handle requirements", () => {
      // Get an item that has requirements
      const itemWithRequirements = Object.values(items).find(
        (item) => item.requiredItems.length > 0
      );
      expect(itemWithRequirements).toBeDefined();

      // Execute getItem
      commands.getItem().execute(itemWithRequirements.id);

      // Check if item was added
      expect(gameState.hasItem(itemWithRequirements.id)).toBe(true);

      // Check if required items were added
      itemWithRequirements.requiredItems.forEach((requiredItemId) => {
        expect(gameState.hasItem(requiredItemId)).toBe(true);
      });
    });

    it("should not get item if it doesn't exist", () => {
      commands.getItem().execute("non_existent_item");
      expect(console.log).toHaveBeenCalledWith(
        "Item non_existent_item not found!"
      );
    });
  });

  describe("listJobIds", () => {
    it("should list all job IDs by category", () => {
      commands.listJobIds().execute();

      expect(console.log).toHaveBeenCalled();
      const output = console.log.mock.calls[0][0];
      expect(output).toContain("Available Job IDs:");

      // Check if all job categories are listed
      const categories = new Set(
        Object.values(jobs).map((job) => job.category)
      );
      categories.forEach((category) => {
        expect(output).toContain(`[${category}]`);
      });
    });
  });

  describe("listSkillIds", () => {
    it("should list all skill IDs by category", () => {
      commands.listSkillIds().execute();

      expect(console.log).toHaveBeenCalled();
      const output = console.log.mock.calls[0][0];
      expect(output).toContain("Available Skill IDs:");

      // Check if all skill categories are listed
      const categories = new Set(
        Object.values(skills).map((skill) => skill.category)
      );
      categories.forEach((category) => {
        expect(output).toContain(`[${category}]`);
      });
    });
  });

  describe("listItemIds", () => {
    it("should list all item IDs by category", () => {
      commands.listItemIds().execute();

      expect(console.log).toHaveBeenCalled();
      const output = console.log.mock.calls[0][0];
      expect(output).toContain("Available Item IDs:");

      // Check if all item categories are listed
      const categories = new Set(
        Object.values(items).map((item) => item.category)
      );
      categories.forEach((category) => {
        expect(output).toContain(`[${category}]`);
      });
    });
  });
});
