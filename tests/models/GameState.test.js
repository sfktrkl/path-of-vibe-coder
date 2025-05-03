import GameState from "@models/GameState";
import { jobs } from "@data/jobs";
import { skills } from "@data/skills";

describe("GameState", () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
    // Mock Date.now
    const mockDate = new Date("2024-01-01");
    Date.now = jest.fn(() => mockDate.getTime());
  });

  afterEach(() => {
    // Clean up Date.now mock
    if (Date.now.mockRestore) {
      Date.now.mockRestore();
    }
  });

  // Helper function to unlock senior web dev prerequisites
  const unlockSeniorWebDev = (state) => {
    state.setJob("everyday_normal_guy");
    state.startLearning("computer_basics");
    state.updateLearningProgress(100);
    state.setJob("computer_trainee");
    state.startLearning("typing");
    state.updateLearningProgress(100);
    state.setJob("data_entry");
    state.startLearning("internet_basics");
    state.updateLearningProgress(100);
    state.setJob("office_assistant");
    state.startLearning("problem_solving");
    state.updateLearningProgress(100);
    state.startLearning("linux");
    state.updateLearningProgress(100);
    state.setJob("it_support");
    state.startLearning("logic");
    state.updateLearningProgress(100);
    state.startLearning("git");
    state.updateLearningProgress(100);
    state.startLearning("html");
    state.updateLearningProgress(100);
    state.setJob("junior_tech");
    state.startLearning("css");
    state.updateLearningProgress(100);
    state.startLearning("javascript");
    state.updateLearningProgress(100);
    state.setJob("web_intern");
    state.startLearning("react");
    state.updateLearningProgress(100);
    state.setJob("junior_web_dev");
    state.startLearning("nodejs");
    state.updateLearningProgress(100);
    state.startLearning("express");
    state.updateLearningProgress(100);
    state.setJob("web_dev");
    state.startLearning("typescript");
    state.updateLearningProgress(100);
  };

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
    expect(effects.salaryMultiplier).toBe(1.05);

    // Test learning speed boost
    gameState.purchaseItem("basic_learning_boost");
    effects = gameState.getItemEffects();
    expect(effects.learningSpeedMultiplier).toBe(1.05);

    // Test work speed boost
    gameState.purchaseItem("basic_work_boost");
    effects = gameState.getItemEffects();
    expect(effects.workSpeedMultiplier).toBe(1.05);

    // Test skill time reducer
    gameState.purchaseItem("basic_skill_time_reducer");
    effects = gameState.getItemEffects();
    expect(effects.skillTimeMultiplier).toBe(0.95);

    // Test job initial progress
    gameState.purchaseItem("basic_job_boost");
    effects = gameState.getItemEffects();
    expect(effects.initialJobProgress).toBe(5);
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
    expect(effects.salaryMultiplier).toBe(1.1);
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
    expect(effects.salaryMultiplier).toBe(1.3);
    expect(effects.learningSpeedMultiplier).toBe(1.3);
    expect(effects.workSpeedMultiplier).toBe(1.3);
    expect(effects.skillTimeMultiplier).toBe(0.7);
    expect(effects.initialJobProgress).toBe(30);
  });

  test("should handle ultimate pack requirements and effects", () => {
    // Add enough money to purchase items
    gameState.addMoney(200000);

    // Try to purchase ultimate pack without premium pack
    const success = gameState.purchaseItem("ultimate_boost_pack");
    expect(success).toBe(false);
    expect(gameState.hasItem("ultimate_boost_pack")).toBe(false);

    // Purchase all prerequisites for premium pack
    const prerequisites = [
      "basic_salary_boost",
      "advanced_salary_boost",
      "expert_salary_boost",
      "basic_learning_boost",
      "advanced_learning_boost",
      "expert_learning_boost",
      "basic_work_boost",
      "advanced_work_boost",
      "expert_work_boost",
      "basic_skill_time_reducer",
      "advanced_skill_time_reducer",
      "expert_skill_time_reducer",
      "basic_job_boost",
      "advanced_job_boost",
      "expert_job_boost",
    ];

    prerequisites.forEach((item) => {
      gameState.purchaseItem(item);
    });

    // Purchase premium pack
    gameState.purchaseItem("premium_boost_pack");

    // Now should be able to purchase ultimate pack
    const success2 = gameState.purchaseItem("ultimate_boost_pack");
    expect(success2).toBe(true);
    expect(gameState.hasItem("ultimate_boost_pack")).toBe(true);

    // Verify the effects - ultimate pack should override premium pack
    const effects = gameState.getItemEffects();
    expect(effects.salaryMultiplier).toBe(1.5);
    expect(effects.learningSpeedMultiplier).toBe(1.5);
    expect(effects.workSpeedMultiplier).toBe(1.5);
    expect(effects.skillTimeMultiplier).toBe(0.5);
    expect(effects.initialJobProgress).toBe(50);
  });

  test("should ensure combo packs are more powerful than individual items", () => {
    // Add enough money
    gameState.addMoney(200000);

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

    // Check individual expert effects
    const expertEffects = gameState.getItemEffects();
    expect(expertEffects.salaryMultiplier).toBe(1.25);
    expect(expertEffects.learningSpeedMultiplier).toBe(1.25);
    expect(expertEffects.workSpeedMultiplier).toBe(1.25);
    expect(expertEffects.skillTimeMultiplier).toBe(0.75);
    expect(expertEffects.initialJobProgress).toBe(25);

    // Purchase premium pack
    const premiumSuccess = gameState.purchaseItem("premium_boost_pack");
    expect(premiumSuccess).toBe(true);

    // Check premium pack effects (should be stronger)
    const premiumEffects = gameState.getItemEffects();
    expect(premiumEffects.salaryMultiplier).toBe(1.3);
    expect(premiumEffects.learningSpeedMultiplier).toBe(1.3);
    expect(premiumEffects.workSpeedMultiplier).toBe(1.3);
    expect(premiumEffects.skillTimeMultiplier).toBe(0.7);
    expect(premiumEffects.initialJobProgress).toBe(30);

    // Purchase ultimate pack
    const ultimateSuccess = gameState.purchaseItem("ultimate_boost_pack");
    expect(ultimateSuccess).toBe(true);

    // Check ultimate pack effects (should be strongest)
    const ultimateEffects = gameState.getItemEffects();
    expect(ultimateEffects.salaryMultiplier).toBe(1.5);
    expect(ultimateEffects.learningSpeedMultiplier).toBe(1.5);
    expect(ultimateEffects.workSpeedMultiplier).toBe(1.5);
    expect(ultimateEffects.skillTimeMultiplier).toBe(0.5);
    expect(ultimateEffects.initialJobProgress).toBe(50);
  });

  test("should apply item effects in correct order", () => {
    // Add enough money
    gameState.addMoney(200000);

    // Purchase items in different orders to verify consistent effect application

    // Order 1: Basic -> Advanced -> Expert -> Premium -> Ultimate
    gameState.purchaseItem("basic_salary_boost");
    expect(gameState.getItemEffects().salaryMultiplier).toBe(1.05);

    gameState.purchaseItem("advanced_salary_boost");
    expect(gameState.getItemEffects().salaryMultiplier).toBe(1.1);

    gameState.purchaseItem("expert_salary_boost");
    expect(gameState.getItemEffects().salaryMultiplier).toBe(1.25);

    // Purchase all prerequisites for premium pack
    const prerequisites = [
      "basic_learning_boost",
      "advanced_learning_boost",
      "expert_learning_boost",
      "basic_work_boost",
      "advanced_work_boost",
      "expert_work_boost",
      "basic_skill_time_reducer",
      "advanced_skill_time_reducer",
      "expert_skill_time_reducer",
      "basic_job_boost",
      "advanced_job_boost",
      "expert_job_boost",
    ];

    prerequisites.forEach((item) => {
      gameState.purchaseItem(item);
    });

    gameState.purchaseItem("premium_boost_pack");
    expect(gameState.getItemEffects().salaryMultiplier).toBe(1.3);

    gameState.purchaseItem("ultimate_boost_pack");
    expect(gameState.getItemEffects().salaryMultiplier).toBe(1.5);

    // Order 2: Try to purchase Ultimate first (should fail)
    gameState = new GameState();
    gameState.addMoney(200000);

    const ultimateSuccess = gameState.purchaseItem("ultimate_boost_pack");
    expect(ultimateSuccess).toBe(false);
    expect(gameState.getItemEffects().salaryMultiplier).toBe(1.0);
  });

  test("should get highest effect values from multiple items", () => {
    // Add enough money to purchase items
    gameState.addMoney(200000);

    // Purchase items in random order with different values
    gameState.purchaseItem("basic_salary_boost"); // 1.05
    gameState.purchaseItem("expert_learning_boost"); // 1.25
    gameState.purchaseItem("advanced_work_boost"); // 1.10
    gameState.purchaseItem("expert_skill_time_reducer"); // 0.75
    gameState.purchaseItem("advanced_job_boost"); // 10

    // Purchase prerequisite items for premium pack in correct order
    // Salary chain
    gameState.purchaseItem("basic_salary_boost");
    gameState.purchaseItem("advanced_salary_boost");
    gameState.purchaseItem("expert_salary_boost");

    // Learning chain
    gameState.purchaseItem("basic_learning_boost");
    gameState.purchaseItem("advanced_learning_boost");
    gameState.purchaseItem("expert_learning_boost");

    // Work chain
    gameState.purchaseItem("basic_work_boost");
    gameState.purchaseItem("advanced_work_boost");
    gameState.purchaseItem("expert_work_boost");

    // Skill time chain
    gameState.purchaseItem("basic_skill_time_reducer");
    gameState.purchaseItem("advanced_skill_time_reducer");
    gameState.purchaseItem("expert_skill_time_reducer");

    // Job boost chain
    gameState.purchaseItem("basic_job_boost");
    gameState.purchaseItem("advanced_job_boost");
    gameState.purchaseItem("expert_job_boost");

    // Now purchase premium pack
    const premiumSuccess = gameState.purchaseItem("premium_boost_pack"); // 1.30, 1.30, 1.30, 0.70, 30
    expect(premiumSuccess).toBe(true);

    const effects = gameState.getItemEffects();

    // Should get highest values for each effect
    expect(effects.salaryMultiplier).toBe(1.3); // From premium pack
    expect(effects.learningSpeedMultiplier).toBe(1.3); // From premium pack
    expect(effects.workSpeedMultiplier).toBe(1.3); // From premium pack
    expect(effects.skillTimeMultiplier).toBe(0.7); // From premium pack (lowest = most reduction)
    expect(effects.initialJobProgress).toBe(30); // From premium pack

    // Purchase ultimate pack which should override everything
    const success2 = gameState.purchaseItem("ultimate_boost_pack");
    expect(success2).toBe(true);

    const newEffects = gameState.getItemEffects();
    expect(newEffects.salaryMultiplier).toBe(1.5); // From ultimate pack
    expect(newEffects.learningSpeedMultiplier).toBe(1.5); // From ultimate pack
    expect(newEffects.workSpeedMultiplier).toBe(1.5); // From ultimate pack
    expect(newEffects.skillTimeMultiplier).toBe(0.5); // From ultimate pack (lowest = most reduction)
    expect(newEffects.initialJobProgress).toBe(50); // From ultimate pack
  });

  test("should handle AI path unlock requirements", () => {
    // Initially AI path should be locked
    expect(gameState.isAIPathUnlocked()).toBe(false);

    // Mock random to ensure unlock
    const mockRandom = jest.spyOn(Math, "random");
    mockRandom.mockReturnValue(0); // Always return 0 to ensure unlock

    // Try to unlock without senior job (should fail)
    gameState.checkAIPathUnlock();
    expect(gameState.isAIPathUnlocked()).toBe(false);

    // Unlock prerequisites for senior web dev
    unlockSeniorWebDev(gameState);
    gameState.setJob("senior_web_dev");

    expect(gameState.isJobUnlocked("senior_web_dev")).toBe(true);

    // Try to unlock with just senior job (low chance)
    gameState.checkAIPathUnlock();
    expect(gameState.isAIPathUnlocked()).toBe(true); // Should unlock since Math.random is mocked to 0

    mockRandom.mockRestore();
  });

  test("should check AI path unlock on skill completion", () => {
    // Mock random to ensure unlock doesn't happen
    const mockRandom = jest.spyOn(Math, "random");
    mockRandom.mockReturnValue(1); // Always return 1 to ensure no unlock

    // Unlock prerequisites for senior web dev
    unlockSeniorWebDev(gameState);
    gameState.setJob("senior_web_dev");

    // Start learning a skill
    gameState.startLearning("machine_learning");

    // Complete the skill
    gameState.updateLearningProgress(100);

    // Should have triggered AI path check
    expect(gameState.isAIPathUnlocked()).toBe(false);

    mockRandom.mockRestore();
  });

  test("should calculate AI path points correctly", () => {
    // Mock random to ensure unlock doesn't happen
    const mockRandom = jest.spyOn(Math, "random");
    mockRandom.mockReturnValue(1); // Always return 1 to ensure no unlock

    // Unlock prerequisites for senior web dev
    unlockSeniorWebDev(gameState);
    gameState.setJob("senior_web_dev");
    expect(gameState.isJobUnlocked("senior_web_dev")).toBe(true);

    // Add some high-value skills
    gameState.startLearning("machine_learning");
    gameState.updateLearningProgress(100);
    gameState.startLearning("deep_learning");
    gameState.updateLearningProgress(100);

    // Add some high-value items
    gameState.addMoney(100000);
    gameState.purchaseItem("expert_salary_boost");
    gameState.purchaseItem("expert_learning_boost");

    // Add money for bonus points
    gameState.addMoney(100000);

    // Check AI path unlock
    gameState.checkAIPathUnlock();

    // Should not be unlocked due to random chance
    expect(gameState.isAIPathUnlocked()).toBe(false);

    mockRandom.mockRestore();
  });

  test("should not check AI path unlock without senior job", () => {
    // Start with no senior job
    expect(gameState.isJobUnlocked("senior_web_dev")).toBe(false);

    // Add some high-value skills and items
    gameState.startLearning("machine_learning");
    gameState.updateLearningProgress(100);
    gameState.addMoney(100000);
    gameState.purchaseItem("expert_salary_boost");

    // Try to check AI path unlock
    gameState.checkAIPathUnlock();

    // Should not be unlocked without senior job
    expect(gameState.isAIPathUnlocked()).toBe(false);
  });

  test("should return early if AI path is already unlocked", () => {
    // Mock random to ensure unlock
    const mockRandom = jest.spyOn(Math, "random");
    mockRandom.mockReturnValue(0); // Always return 0 to ensure unlock

    // Unlock prerequisites for senior web dev
    unlockSeniorWebDev(gameState);
    gameState.setJob("senior_web_dev");

    // First check should unlock
    const firstCheck = gameState.checkAIPathUnlock();
    expect(firstCheck).toBe(true);
    expect(gameState.isAIPathUnlocked()).toBe(true);

    // Mock random to ensure no unlock (to verify early return)
    mockRandom.mockReturnValue(1);

    // Second check should return true immediately without running the full check
    const secondCheck = gameState.checkAIPathUnlock();
    expect(secondCheck).toBe(true);
    expect(gameState.isAIPathUnlocked()).toBe(true);

    mockRandom.mockRestore();
  });

  test("should update job progress within bounds", () => {
    const state = new GameState();
    state.setJob("everyday_normal_guy");
    state.setJobProgress("everyday_normal_guy", 50);
    expect(state.jobProgress).toBe(50);

    state.setJobProgress("everyday_normal_guy", 150);
    expect(state.jobProgress).toBe(100);

    state.setJobProgress("everyday_normal_guy", -50);
    expect(state.jobProgress).toBe(0);
  });

  test("should check AI path unlock when job is completed", () => {
    // Mock random to ensure unlock
    const mockRandom = jest.spyOn(Math, "random");
    mockRandom.mockReturnValue(0); // Always return 0 to ensure unlock

    const state = new GameState();

    // Unlock prerequisites for senior web dev
    unlockSeniorWebDev(state);
    state.setJob("senior_web_dev");
    state.setJobProgress("senior_web_dev", 100);

    expect(state.jobProgress).toBe(100);
    expect(state.isAIPathUnlocked()).toBe(true);

    mockRandom.mockRestore();
  });
});
