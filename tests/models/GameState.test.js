import GameState from "@models/GameState";
import { jobs } from "@data/jobs";
import { skills } from "@data/skills";

describe("GameState", () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  test("should initialize with default values", () => {
    expect(gameState.money).toBe(0);
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
    expect(gameState.skillProgress["test_skill"]).toBe(100);
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

  test("should handle job changes", () => {
    const success = gameState.setJob("everyday_normal_guy");
    expect(success).toBe(true);
    expect(gameState.currentJob).toBe("everyday_normal_guy");
    expect(gameState.jobProgress).toBe(0);
  });

  test("should check job unlock conditions", () => {
    // Starting job should always be unlocked
    expect(gameState.isJobUnlocked("everyday_normal_guy")).toBe(true);

    // Other jobs should be locked until prerequisites are met
    const jobWithPrereqs = Object.values(jobs).find(
      (job) => job.requiredSkills?.length > 0 || job.requiredJobs?.length > 0
    );
    if (jobWithPrereqs) {
      expect(gameState.isJobUnlocked(jobWithPrereqs.id)).toBe(false);

      // Unlock prerequisites
      jobWithPrereqs.requiredSkills?.forEach((skill) => {
        gameState.startLearning(skill);
        gameState.updateLearningProgress(100);
      });

      jobWithPrereqs.requiredJobs?.forEach((jobId) => {
        gameState.setJob(jobId);
      });

      expect(gameState.isJobUnlocked(jobWithPrereqs.id)).toBe(true);
    }
  });

  test("should handle invalid job changes", () => {
    const invalidJob = "nonexistent_job";
    const success = gameState.setJob(invalidJob);
    expect(success).toBe(false);
    expect(gameState.currentJob).toBeNull();
  });

  test("should handle concurrent skill learning", () => {
    gameState.startLearning("test_skill_1");
    gameState.startLearning("test_skill_2");
    expect(gameState.currentLearning).toBe("test_skill_2");
    expect(gameState.getLearningProgress()).toBe(0);
  });

  test("should handle learning completed skills", () => {
    gameState.startLearning("test_skill");
    expect(gameState.currentLearning).toBe("test_skill");
    expect(gameState.getLearningProgress()).toBe(0);

    gameState.updateLearningProgress(100);
    expect(gameState.hasSkill("test_skill")).toBe(true);

    // Starting to learn again keeps the existing progress
    gameState.startLearning("test_skill");
    expect(gameState.currentLearning).toBe("test_skill");
    expect(gameState.getLearningProgress()).toBe(100);
  });

  test("should handle skill prerequisites", () => {
    const skillWithPrereqs = Object.values(skills).find(
      (skill) => skill.prerequisites?.length > 0
    );
    if (skillWithPrereqs) {
      const availableSkills = gameState.getAvailableSkills();
      expect(availableSkills).not.toContainEqual(skillWithPrereqs);

      // Learn prerequisites
      skillWithPrereqs.prerequisites.forEach((prereq) => {
        gameState.startLearning(prereq);
        gameState.updateLearningProgress(100);
      });

      const newAvailableSkills = gameState.getAvailableSkills();
      expect(newAvailableSkills).toContainEqual(skillWithPrereqs);
    }
  });

  test("should get available jobs", () => {
    const availableJobs = gameState.getAvailableJobs();
    expect(availableJobs).toBeDefined();
    expect(Array.isArray(availableJobs)).toBe(true);
  });

  test("should get current job info", () => {
    gameState.setJob("everyday_normal_guy");
    const jobInfo = gameState.getCurrentJobInfo();
    expect(jobInfo).toEqual(jobs.everyday_normal_guy);
  });

  test("should get jobs by category", () => {
    const jobsByCategory = gameState.getJobsByCategory();
    expect(jobsByCategory).toBeDefined();
    expect(Object.keys(jobsByCategory).length).toBeGreaterThan(0);
  });

  test("should get available skills", () => {
    const availableSkills = gameState.getAvailableSkills();
    expect(availableSkills).toBeDefined();
  });

  test("should get skills by category", () => {
    const skillsByCategory = gameState.getSkillsByCategory();
    expect(skillsByCategory).toBeDefined();
    expect(Object.keys(skillsByCategory).length).toBeGreaterThan(0);
  });

  test("should handle invalid skill progress", () => {
    expect(gameState.getSkillProgress("nonexistent_skill")).toBe(0);
  });

  test("should handle invalid learning progress", () => {
    expect(gameState.getLearningProgress()).toBe(0);
  });

  test("should handle item effects correctly", () => {
    // Add enough money to purchase items
    gameState.addMoney(100000);

    // Test basic salary boost
    gameState.purchaseItem("basic_salary_boost");
    let effects = gameState.getItemEffects();
    expect(effects.salaryMultiplier).toBe(1.1);

    // Test learning speed boost
    gameState.purchaseItem("basic_learning_boost");
    effects = gameState.getItemEffects();
    expect(effects.learningSpeedMultiplier).toBe(1.1);

    // Test work speed boost
    gameState.purchaseItem("basic_work_boost");
    effects = gameState.getItemEffects();
    expect(effects.workSpeedMultiplier).toBe(1.1);

    // Test skill time reducer
    gameState.purchaseItem("basic_skill_time_reducer");
    effects = gameState.getItemEffects();
    expect(effects.skillTimeMultiplier).toBe(0.9);

    // Test job initial progress
    gameState.purchaseItem("basic_job_boost");
    effects = gameState.getItemEffects();
    expect(effects.initialJobProgress).toBe(10);
  });

  test("should handle item requirements correctly", () => {
    // Add enough money to purchase items
    gameState.addMoney(100000);

    // Try to purchase advanced item without basic
    const success = gameState.purchaseItem("advanced_salary_boost");
    expect(success).toBe(false);
    expect(gameState.hasItem("advanced_salary_boost")).toBe(false);

    // Purchase basic item first
    gameState.purchaseItem("basic_salary_boost");
    expect(gameState.hasItem("basic_salary_boost")).toBe(true);

    // Now should be able to purchase advanced
    const success2 = gameState.purchaseItem("advanced_salary_boost");
    expect(success2).toBe(true);
    expect(gameState.hasItem("advanced_salary_boost")).toBe(true);
  });

  test("should handle item effects stacking correctly", () => {
    // Add enough money to purchase items
    gameState.addMoney(100000);

    // Purchase basic and advanced salary boosts
    gameState.purchaseItem("basic_salary_boost");
    gameState.purchaseItem("advanced_salary_boost");

    const effects = gameState.getItemEffects();
    // Advanced should override basic
    expect(effects.salaryMultiplier).toBe(1.25);
  });

  test("should handle premium pack requirements", () => {
    // Add enough money to purchase items
    gameState.addMoney(100000);

    // Try to purchase premium pack without prerequisites
    const success = gameState.purchaseItem("premium_boost_pack");
    expect(success).toBe(false);
    expect(gameState.hasItem("premium_boost_pack")).toBe(false);

    // Purchase all required items in order
    // Salary boost chain
    gameState.purchaseItem("basic_salary_boost");
    gameState.purchaseItem("advanced_salary_boost");
    gameState.purchaseItem("expert_salary_boost");

    // Learning boost chain
    gameState.purchaseItem("basic_learning_boost");
    gameState.purchaseItem("advanced_learning_boost");
    gameState.purchaseItem("expert_learning_boost");

    // Work boost chain
    gameState.purchaseItem("basic_work_boost");
    gameState.purchaseItem("advanced_work_boost");
    gameState.purchaseItem("expert_work_boost");

    // Skill time reducer chain
    gameState.purchaseItem("basic_skill_time_reducer");
    gameState.purchaseItem("advanced_skill_time_reducer");
    gameState.purchaseItem("expert_skill_time_reducer");

    // Job boost chain
    gameState.purchaseItem("basic_job_boost");
    gameState.purchaseItem("advanced_job_boost");
    gameState.purchaseItem("expert_job_boost");

    // Now should be able to purchase premium pack
    const success2 = gameState.purchaseItem("premium_boost_pack");
    expect(success2).toBe(true);
    expect(gameState.hasItem("premium_boost_pack")).toBe(true);

    // Verify the effects
    const effects = gameState.getItemEffects();
    expect(effects.salaryMultiplier).toBe(1.2);
    expect(effects.learningSpeedMultiplier).toBe(1.2);
    expect(effects.workSpeedMultiplier).toBe(1.2);
    expect(effects.skillTimeMultiplier).toBe(0.8);
    expect(effects.initialJobProgress).toBe(20);
  });
});
