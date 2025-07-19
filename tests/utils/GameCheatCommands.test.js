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

  describe("setMoney", () => {
    it("should set money to specific amount", () => {
      commands.setMoney().execute(5000);
      expect(gameState.getMoney()).toBe(5000);
    });

    it("should handle zero amount", () => {
      commands.setMoney().execute(0);
      expect(gameState.getMoney()).toBe(0);
    });
  });

  describe("setInfluence", () => {
    it("should set influence to specific amount", () => {
      commands.setInfluence().execute(500);
      expect(gameState.getInfluence()).toBe(500);
    });

    it("should handle zero amount", () => {
      commands.setInfluence().execute(0);
      expect(gameState.getInfluence()).toBe(0);
    });

    it("should override existing influence", () => {
      // First add some influence
      gameState.addInfluence(100);
      // Then set to a different amount
      commands.setInfluence().execute(200);
      expect(gameState.getInfluence()).toBe(200);
    });
  });

  describe("setCurrentJobProgress", () => {
    it("should set progress for current job", () => {
      // Set a current job first
      const jobId = Object.keys(jobs)[0];
      gameState.setCurrentJob(jobId);

      commands.setCurrentJobProgress().execute(75);
      expect(gameState.getCurrentJobProgress()).toBe(75);
    });

    it("should not set progress if no job is selected", () => {
      gameState.setCurrentJob(null);
      commands.setCurrentJobProgress().execute(50);
      expect(console.log).toHaveBeenCalledWith("No job is currently selected!");
    });

    it("should not set progress outside valid range", () => {
      const jobId = Object.keys(jobs)[0];
      gameState.setCurrentJob(jobId);
      commands.setCurrentJobProgress().execute(150);
      expect(console.log).toHaveBeenCalledWith(
        "Progress must be between 0 and 100!"
      );
    });
  });

  describe("setCurrentLearningProgress", () => {
    it("should set progress for current skill", () => {
      // Set a current skill first
      const skillId = Object.keys(skills)[0];
      gameState.setCurrentLearning(skillId);

      commands.setCurrentLearningProgress().execute(60);
      expect(gameState.getCurrentLearningProgress()).toBe(60);
    });

    it("should not set progress if no skill is being learned", () => {
      gameState.setCurrentLearning(null);
      commands.setCurrentLearningProgress().execute(50);
      expect(console.log).toHaveBeenCalledWith(
        "No skill is currently being learned!"
      );
    });

    it("should not set progress outside valid range", () => {
      const skillId = Object.keys(skills)[0];
      gameState.setCurrentLearning(skillId);
      commands.setCurrentLearningProgress().execute(-10);
      expect(console.log).toHaveBeenCalledWith(
        "Progress must be between 0 and 100!"
      );
    });
  });

  describe("setCurrentJob", () => {
    it("should set job and handle requirements", () => {
      // Get a job that has requirements
      const jobWithRequirements = Object.values(jobs).find(
        (job) => job.requiredSkills.length > 0 || job.requiredJobs.length > 0
      );
      expect(jobWithRequirements).toBeDefined();

      // Execute setJob
      commands.setCurrentJob().execute(jobWithRequirements.id);

      // Check if job was set
      expect(gameState.getCurrentJob()).toBe(jobWithRequirements.id);

      // Check if required skills were completed
      jobWithRequirements.requiredSkills.forEach((skillId) => {
        expect(gameState.hasSkill(skillId)).toBe(true);
      });
    });

    it("should not set job if it doesn't exist", () => {
      commands.setCurrentJob().execute("non_existent_job");
      expect(console.log).toHaveBeenCalledWith(
        "Job non_existent_job not found!"
      );
    });

    it("should unlock AI path if setting a job that requires it", () => {
      // Find a job that requires AI path
      const aiJob = Object.values(jobs).find(
        (job) => job.requiresAIPath === true
      );
      expect(aiJob).toBeDefined();
      // Ensure AI path is locked
      expect(gameState.getAIPathUnlocked()).toBe(false);
      // Set the job using the cheat command
      commands.setCurrentJob().execute(aiJob.id);
      // AI path should now be unlocked
      expect(gameState.getAIPathUnlocked()).toBe(true);
      // The job should be set
      expect(gameState.getCurrentJob()).toBe(aiJob.id);
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

  describe("listJobs", () => {
    it("should list all job IDs by category", () => {
      commands.listJobs().execute();

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

  describe("listSkills", () => {
    it("should list all skill IDs by category", () => {
      commands.listSkills().execute();

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

  describe("listItems", () => {
    it("should list all item IDs by category", () => {
      commands.listItems().execute();

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

  describe("listFeatures", () => {
    it("should list all skill features with their descriptions", () => {
      commands.listFeatures().execute();

      expect(console.log).toHaveBeenCalled();
      const output = console.log.mock.calls[0][0];
      expect(output).toContain("Available Skill Features:");

      // Check if all features from skills are listed
      const expectedFeatures = [
        "instantLearning",
        "revealLocked",
        "completeVision",
        "instantJobMastery",
        "transcendReset",
      ];

      expectedFeatures.forEach((feature) => {
        expect(output).toContain(feature);
      });
    });

    it("should show which skills provide each feature", () => {
      commands.listFeatures().execute();

      const output = console.log.mock.calls[0][0];

      // Check that features show their associated skills
      expect(output).toContain("instantLearning:");
      expect(output).toContain("Time Manipulation");

      expect(output).toContain("revealLocked:");
      expect(output).toContain("Reality Styling");

      expect(output).toContain("completeVision:");
      expect(output).toContain("Game Mechanics");

      expect(output).toContain("instantJobMastery:");
      expect(output).toContain("Existence Mastery");

      expect(output).toContain("transcendReset:");
      expect(output).toContain("Existence Transcendence");
    });
  });

  describe("enableFeature", () => {
    it("should enable a valid feature", () => {
      commands.enableFeature().execute("instantLearning");

      expect(gameState.hasFeature("instantLearning")).toBe(true);
      expect(console.log).toHaveBeenCalledWith(
        "Feature 'instantLearning' enabled!"
      );
    });

    it("should not enable invalid feature", () => {
      commands.enableFeature().execute("invalidFeature");

      expect(console.log).toHaveBeenCalledWith(
        "Feature 'invalidFeature' not found in any skill!"
      );
      expect(console.log).toHaveBeenCalledWith(
        "Use listFeatures() to see available features."
      );
    });

    it("should handle all valid features", () => {
      const validFeatures = [
        "instantLearning",
        "revealLocked",
        "completeVision",
        "instantJobMastery",
        "transcendReset",
      ];

      validFeatures.forEach((feature) => {
        commands.enableFeature().execute(feature);
        expect(gameState.hasFeature(feature)).toBe(true);
      });
    });
  });

  describe("disableFeature", () => {
    it("should disable a valid feature", () => {
      // First enable the feature
      gameState.addFeature("instantLearning");
      expect(gameState.hasFeature("instantLearning")).toBe(true);

      // Then disable it
      commands.disableFeature().execute("instantLearning");

      expect(gameState.hasFeature("instantLearning")).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        "Feature 'instantLearning' disabled!"
      );
    });

    it("should not disable invalid feature", () => {
      commands.disableFeature().execute("invalidFeature");

      expect(console.log).toHaveBeenCalledWith(
        "Feature 'invalidFeature' not found in any skill!"
      );
      expect(console.log).toHaveBeenCalledWith(
        "Use listFeatures() to see available features."
      );
    });

    it("should handle disabling non-existent features gracefully", () => {
      // Try to disable a feature that doesn't exist
      commands.disableFeature().execute("nonExistentFeature");

      expect(console.log).toHaveBeenCalledWith(
        "Feature 'nonExistentFeature' not found in any skill!"
      );
      expect(console.log).toHaveBeenCalledWith(
        "Use listFeatures() to see available features."
      );
    });
  });

  describe("listCurrentFeatures", () => {
    it("should list currently enabled features", () => {
      // Enable some features
      gameState.addFeature("instantLearning");
      gameState.addFeature("revealLocked");

      commands.listCurrentFeatures().execute();

      expect(console.log).toHaveBeenCalledWith("Currently Enabled Features:");
      expect(console.log).toHaveBeenCalledWith("  - instantLearning");
      expect(console.log).toHaveBeenCalledWith("  - revealLocked");
    });

    it("should show message when no features are enabled", () => {
      commands.listCurrentFeatures().execute();

      expect(console.log).toHaveBeenCalledWith(
        "No features are currently enabled!"
      );
    });

    it("should list all enabled features in order", () => {
      // Enable features in different order
      gameState.addFeature("completeVision");
      gameState.addFeature("instantLearning");
      gameState.addFeature("revealLocked");

      commands.listCurrentFeatures().execute();

      // Should list all features (order may vary due to Set iteration)
      expect(console.log).toHaveBeenCalledWith("Currently Enabled Features:");
      expect(console.log).toHaveBeenCalledWith("  - completeVision");
      expect(console.log).toHaveBeenCalledWith("  - instantLearning");
      expect(console.log).toHaveBeenCalledWith("  - revealLocked");
    });
  });

  describe("listAbilities", () => {
    it("should list all job abilities with their descriptions", () => {
      commands.listAbilities().execute();

      expect(console.log).toHaveBeenCalled();
      const output = console.log.mock.calls[0][0];
      expect(output).toContain("Available Job Abilities:");

      // Check if all abilities from jobs are listed
      const expectedAbilities = [
        "timeStop",
        "existenceParticles",
        "transcendenceFocus",
        "pureExistence",
      ];

      expectedAbilities.forEach((ability) => {
        expect(output).toContain(ability);
      });
    });

    it("should show which jobs provide each ability", () => {
      commands.listAbilities().execute();

      const output = console.log.mock.calls[0][0];

      // Check that abilities show their associated jobs
      expect(output).toContain("timeStop:");
      expect(output).toContain("Time Weaver");

      expect(output).toContain("existenceParticles:");
      expect(output).toContain("Reality Stylist");

      expect(output).toContain("transcendenceFocus:");
      expect(output).toContain("Existence Master");

      expect(output).toContain("pureExistence:");
      expect(output).toContain("Existence Transcendent");
    });
  });

  describe("enableAbility", () => {
    it("should enable a valid ability", () => {
      commands.enableAbility().execute("timeStop");

      expect(gameState.hasAbility("timeStop")).toBe(true);
      expect(console.log).toHaveBeenCalledWith("Ability 'timeStop' enabled!");
    });

    it("should not enable invalid ability", () => {
      commands.enableAbility().execute("invalidAbility");

      expect(console.log).toHaveBeenCalledWith(
        "Ability 'invalidAbility' not found in any job!"
      );
      expect(console.log).toHaveBeenCalledWith(
        "Use listAbilities() to see available abilities."
      );
    });

    it("should handle all valid abilities", () => {
      const validAbilities = [
        "timeStop",
        "existenceParticles",
        "transcendenceFocus",
        "pureExistence",
      ];

      validAbilities.forEach((ability) => {
        commands.enableAbility().execute(ability);
        expect(gameState.hasAbility(ability)).toBe(true);
      });
    });
  });

  describe("disableAbility", () => {
    it("should disable a valid ability", () => {
      // First enable the ability
      gameState.addAbility("timeStop");
      expect(gameState.hasAbility("timeStop")).toBe(true);

      // Then disable it
      commands.disableAbility().execute("timeStop");

      expect(gameState.hasAbility("timeStop")).toBe(false);
      expect(console.log).toHaveBeenCalledWith("Ability 'timeStop' disabled!");
    });

    it("should not disable invalid ability", () => {
      commands.disableAbility().execute("invalidAbility");

      expect(console.log).toHaveBeenCalledWith(
        "Ability 'invalidAbility' not found in any job!"
      );
      expect(console.log).toHaveBeenCalledWith(
        "Use listAbilities() to see available abilities."
      );
    });

    it("should handle disabling non-existent abilities gracefully", () => {
      // Try to disable an ability that doesn't exist
      commands.disableAbility().execute("nonExistentAbility");

      expect(console.log).toHaveBeenCalledWith(
        "Ability 'nonExistentAbility' not found in any job!"
      );
      expect(console.log).toHaveBeenCalledWith(
        "Use listAbilities() to see available abilities."
      );
    });
  });

  describe("listCurrentAbilities", () => {
    it("should list currently enabled abilities", () => {
      // Enable some abilities
      gameState.addAbility("timeStop");
      gameState.addAbility("existenceParticles");

      commands.listCurrentAbilities().execute();

      expect(console.log).toHaveBeenCalledWith("Currently Enabled Abilities:");
      expect(console.log).toHaveBeenCalledWith("  - timeStop");
      expect(console.log).toHaveBeenCalledWith("  - existenceParticles");
    });

    it("should show message when no abilities are enabled", () => {
      commands.listCurrentAbilities().execute();

      expect(console.log).toHaveBeenCalledWith(
        "No abilities are currently enabled!"
      );
    });

    it("should list all enabled abilities in order", () => {
      // Enable abilities in different order
      gameState.addAbility("pureExistence");
      gameState.addAbility("timeStop");
      gameState.addAbility("existenceParticles");

      commands.listCurrentAbilities().execute();

      // Should list all abilities (order may vary due to Set iteration)
      expect(console.log).toHaveBeenCalledWith("Currently Enabled Abilities:");
      expect(console.log).toHaveBeenCalledWith("  - pureExistence");
      expect(console.log).toHaveBeenCalledWith("  - timeStop");
      expect(console.log).toHaveBeenCalledWith("  - existenceParticles");
    });
  });

  describe("listItemEffects", () => {
    it("should list all item effect keys with their types and descriptions", () => {
      commands.listItemEffects().execute();
      expect(console.log).toHaveBeenCalled();
      const output = console.log.mock.calls[0][0];
      // Check for all effect keys
      expect(output).toContain("salaryBoost");
      expect(output).toContain("learningSpeed");
      expect(output).toContain("workSpeed");
      expect(output).toContain("skillTimeReduction");
      expect(output).toContain("jobInitialProgress");
      expect(output).toContain("influenceBoost");
      // Check for types
      expect(output).toContain("increase");
      expect(output).toContain("reduction");
      // Check for descriptions
      expect(output).toContain("Increases salary earned from jobs");
      expect(output).toContain("Reduces time required to learn skills");
    });
  });

  describe("setItemEffect", () => {
    it("should set a valid custom item effect", () => {
      commands.setItemEffect().execute("salaryBoost", 2.5);
      expect(gameState.getItemEffects().salaryBoost).toBe(2.5);
      expect(console.log).toHaveBeenCalledWith(
        "Set custom item effect 'salaryBoost' to 2.5."
      );
    });

    it("should not set an invalid effect name", () => {
      commands.setItemEffect().execute("invalidEffect", 1.5);
      expect(console.log).toHaveBeenCalledWith(
        "Invalid effect name 'invalidEffect'. Use listItemEffects() to see valid effect names."
      );
    });

    it("should not set a non-number value", () => {
      commands.setItemEffect().execute("salaryBoost", "notANumber");
      expect(console.log).toHaveBeenCalledWith("Value must be a number.");
    });

    it("should clear a custom item effect override when value is null", () => {
      // Set a custom effect first
      commands.setItemEffect().execute("salaryBoost", 2.5);
      expect(gameState.getItemEffects().salaryBoost).toBe(2.5);
      // Clear the override
      commands.setItemEffect().execute("salaryBoost", null);
      expect(console.log).toHaveBeenCalledWith(
        "Custom item effect override for 'salaryBoost' has been cleared."
      );
      // Should revert to default (no items owned, so 1)
      expect(gameState.getItemEffects().salaryBoost).toBe(1);
    });
  });
});
