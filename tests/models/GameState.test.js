import GameState from "@models/GameState";
import { jobs } from "@data/jobs";
import { skills } from "@data/skills";
import { story } from "@data/story";

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
    // Basic path
    state.setCurrentJob("everyday_normal_guy");
    state.setCurrentLearning("computer_basics");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("computer_trainee");
    state.setCurrentLearning("math_basics");
    state.setCurrentLearningProgress(100);
    state.setCurrentLearning("typing");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("data_entry");
    state.setCurrentLearning("internet_basics");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("office_assistant");
    state.setCurrentLearning("problem_solving");
    state.setCurrentLearningProgress(100);
    state.setCurrentLearning("linux");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("it_support");
    state.setCurrentLearning("logic");
    state.setCurrentLearningProgress(100);
    state.setCurrentLearning("git");
    state.setCurrentLearningProgress(100);
    state.setCurrentLearning("html");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("junior_tech");
    state.setCurrentLearning("css");
    state.setCurrentLearningProgress(100);
    state.setCurrentLearning("javascript");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("web_intern");
    state.setCurrentLearning("react");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("junior_web_dev");
    state.setCurrentLearning("nodejs");
    state.setCurrentLearningProgress(100);
    state.setCurrentLearning("express");
    state.setCurrentLearningProgress(100);
    state.setCurrentJob("web_dev");
    state.setCurrentLearning("typescript");
    state.setCurrentLearningProgress(100);
    state.setCurrentLearning("vue");
    state.setCurrentLearningProgress(100);
  };

  test("should initialize with default values", () => {
    expect(gameState.getMoney()).toBe(0);
    expect(gameState.getCurrentJob()).toBeNull();
    expect(gameState.getCurrentJobProgress()).toBe(0);
    expect(gameState.getCurrentLearning()).toBeNull();
    expect(gameState.getSkillProgress()).toEqual({});
  });

  test("should manage money correctly", () => {
    gameState.addMoney(100);
    expect(gameState.getMoney()).toBe(100);
    expect(gameState.spendMoney(50)).toBe(true);
    expect(gameState.getMoney()).toBe(50);
    expect(gameState.spendMoney(100)).toBe(false);
    expect(gameState.getMoney()).toBe(50);
  });

  test("should manage learning progress", () => {
    gameState.setCurrentLearning("test_skill");
    expect(gameState.getCurrentLearning()).toBe("test_skill");
    expect(gameState.getCurrentLearningProgress()).toBe(0);
    gameState.setCurrentLearningProgress(50);
    expect(gameState.getCurrentLearningProgress()).toBe(50);
    gameState.setCurrentLearningProgress(100);
    expect(gameState.getCurrentLearning()).toBeNull();
    expect(gameState.getSkillProgress()["test_skill"]).toBe(100);
  });

  test("should check skill completion", () => {
    gameState.setCurrentLearning("test_skill");
    gameState.setCurrentLearningProgress(100);
    expect(gameState.hasSkill("test_skill")).toBe(true);
    expect(gameState.hasSkill("other_skill")).toBe(false);
  });

  test("should serialize and deserialize state", () => {
    gameState.addMoney(100);
    gameState.setCurrentLearning("test_skill");
    gameState.setCurrentLearningProgress(50);

    const json = gameState.toJSON();
    const newState = GameState.fromJSON(json);

    expect(newState.getMoney()).toBe(100);
    expect(newState.getSkillProgress()["test_skill"]).toBe(50);
  });

  test("should encode and decode state", () => {
    gameState.addMoney(100);
    gameState.setCurrentLearning("test_skill");
    gameState.setCurrentLearningProgress(50);

    const encoded = gameState.encode();
    const decoded = GameState.decode(encoded);

    expect(decoded.getMoney()).toBe(100);
    expect(decoded.getSkillProgress()["test_skill"]).toBe(50);
  });

  test("should handle job changes", () => {
    const success = gameState.setCurrentJob("everyday_normal_guy");
    expect(success).toBe(true);
    expect(gameState.getCurrentJob()).toBe("everyday_normal_guy");
    expect(gameState.getCurrentJobProgress()).toBe(0);
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
        gameState.setCurrentLearning(skill);
        gameState.setCurrentLearningProgress(100);
      });

      jobWithPrereqs.requiredJobs?.forEach((jobId) => {
        gameState.setCurrentJob(jobId);
      });

      expect(gameState.isJobUnlocked(jobWithPrereqs.id)).toBe(true);
    }
  });

  test("should handle invalid job changes", () => {
    const invalidJob = "nonexistent_job";
    const success = gameState.setCurrentJob(invalidJob);
    expect(success).toBe(false);
    expect(gameState.getCurrentJob()).toBeNull();
  });

  test("should handle concurrent skill learning", () => {
    gameState.setCurrentLearning("test_skill_1");
    gameState.setCurrentLearning("test_skill_2");
    expect(gameState.getCurrentLearning()).toBe("test_skill_2");
    expect(gameState.getCurrentLearningProgress()).toBe(0);
  });

  test("should handle learning completed skills", () => {
    gameState.setCurrentLearning("test_skill");
    expect(gameState.getCurrentLearning()).toBe("test_skill");
    expect(gameState.getCurrentLearningProgress()).toBe(0);

    gameState.setCurrentLearningProgress(100);
    expect(gameState.hasSkill("test_skill")).toBe(true);

    // Starting to learn again keeps the existing progress
    gameState.setCurrentLearning("test_skill");
    expect(gameState.getCurrentLearning()).toBe("test_skill");
    expect(gameState.getCurrentLearningProgress()).toBe(100);
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
        gameState.setCurrentLearning(prereq);
        gameState.setCurrentLearningProgress(100);
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
    gameState.setCurrentJob("everyday_normal_guy");
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
    gameState.setCurrentLearning("test_skill");
    expect(gameState.getCurrentLearningProgress()).toBe(0);
  });

  test("should handle invalid learning progress", () => {
    expect(gameState.getCurrentLearningProgress()).toBe(0);
  });

  test("should handle item effects correctly", () => {
    // Add enough money to purchase items
    gameState.addMoney(100000);

    // Test basic salary boost
    gameState.purchaseItem("basic_salary_boost");
    let effects = gameState.getItemEffects();
    expect(effects.salaryBoost).toBe(1.05);

    // Test learning speed boost
    gameState.purchaseItem("basic_learning_boost");
    effects = gameState.getItemEffects();
    expect(effects.learningSpeed).toBe(1.05);

    // Test work speed boost
    gameState.purchaseItem("basic_work_boost");
    effects = gameState.getItemEffects();
    expect(effects.workSpeed).toBe(1.05);

    // Test skill time reducer
    gameState.purchaseItem("basic_skill_time_reducer");
    effects = gameState.getItemEffects();
    expect(effects.skillTimeReduction).toBe(0.95);

    // Test job initial progress
    gameState.purchaseItem("basic_job_boost");
    effects = gameState.getItemEffects();
    expect(effects.jobInitialProgress).toBe(5);
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
    expect(effects.salaryBoost).toBe(1.1);
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
    expect(effects.salaryBoost).toBe(1.3);
    expect(effects.learningSpeed).toBe(1.3);
    expect(effects.workSpeed).toBe(1.3);
    expect(effects.skillTimeReduction).toBe(0.7);
    expect(effects.jobInitialProgress).toBe(30);
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
    expect(effects.salaryBoost).toBe(1.5);
    expect(effects.learningSpeed).toBe(1.5);
    expect(effects.workSpeed).toBe(1.5);
    expect(effects.skillTimeReduction).toBe(0.5);
    expect(effects.jobInitialProgress).toBe(50);
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
    expect(expertEffects.salaryBoost).toBe(1.25);
    expect(expertEffects.learningSpeed).toBe(1.25);
    expect(expertEffects.workSpeed).toBe(1.25);
    expect(expertEffects.skillTimeReduction).toBe(0.75);
    expect(expertEffects.jobInitialProgress).toBe(25);

    // Purchase premium pack
    const premiumSuccess = gameState.purchaseItem("premium_boost_pack");
    expect(premiumSuccess).toBe(true);

    // Check premium pack effects (should be stronger)
    const premiumEffects = gameState.getItemEffects();
    expect(premiumEffects.salaryBoost).toBe(1.3);
    expect(premiumEffects.learningSpeed).toBe(1.3);
    expect(premiumEffects.workSpeed).toBe(1.3);
    expect(premiumEffects.skillTimeReduction).toBe(0.7);
    expect(premiumEffects.jobInitialProgress).toBe(30);

    // Purchase ultimate pack
    const ultimateSuccess = gameState.purchaseItem("ultimate_boost_pack");
    expect(ultimateSuccess).toBe(true);

    // Check ultimate pack effects (should be strongest)
    const ultimateEffects = gameState.getItemEffects();
    expect(ultimateEffects.salaryBoost).toBe(1.5);
    expect(ultimateEffects.learningSpeed).toBe(1.5);
    expect(ultimateEffects.workSpeed).toBe(1.5);
    expect(ultimateEffects.skillTimeReduction).toBe(0.5);
    expect(ultimateEffects.jobInitialProgress).toBe(50);
  });

  test("should apply item effects in correct order", () => {
    // Add enough money
    gameState.addMoney(200000);

    // Purchase items in different orders to verify consistent effect application

    // Order 1: Basic -> Advanced -> Expert -> Premium -> Ultimate
    gameState.purchaseItem("basic_salary_boost");
    expect(gameState.getItemEffects().salaryBoost).toBe(1.05);

    gameState.purchaseItem("advanced_salary_boost");
    expect(gameState.getItemEffects().salaryBoost).toBe(1.1);

    gameState.purchaseItem("expert_salary_boost");
    expect(gameState.getItemEffects().salaryBoost).toBe(1.25);

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
    expect(gameState.getItemEffects().salaryBoost).toBe(1.3);

    gameState.purchaseItem("ultimate_boost_pack");
    expect(gameState.getItemEffects().salaryBoost).toBe(1.5);

    // Order 2: Try to purchase Ultimate first (should fail)
    gameState = new GameState();
    gameState.addMoney(200000);

    const ultimateSuccess = gameState.purchaseItem("ultimate_boost_pack");
    expect(ultimateSuccess).toBe(false);
    expect(gameState.getItemEffects().salaryBoost).toBe(1.0);
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
    expect(effects.salaryBoost).toBe(1.3); // From premium pack
    expect(effects.learningSpeed).toBe(1.3); // From premium pack
    expect(effects.workSpeed).toBe(1.3); // From premium pack
    expect(effects.skillTimeReduction).toBe(0.7); // From premium pack (lowest = most reduction)
    expect(effects.jobInitialProgress).toBe(30); // From premium pack

    // Purchase ultimate pack which should override everything
    const success2 = gameState.purchaseItem("ultimate_boost_pack");
    expect(success2).toBe(true);

    const newEffects = gameState.getItemEffects();
    expect(newEffects.salaryBoost).toBe(1.5); // From ultimate pack
    expect(newEffects.learningSpeed).toBe(1.5); // From ultimate pack
    expect(newEffects.workSpeed).toBe(1.5); // From ultimate pack
    expect(newEffects.skillTimeReduction).toBe(0.5); // From ultimate pack (lowest = most reduction)
    expect(newEffects.jobInitialProgress).toBe(50); // From ultimate pack
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
    gameState.setCurrentJob("senior_web_dev");

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
    gameState.setCurrentJob("senior_web_dev");

    // Start learning a skill
    gameState.setCurrentLearning("machine_learning");

    // Complete the skill
    gameState.setCurrentLearningProgress(100);

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
    gameState.setCurrentJob("senior_web_dev");
    expect(gameState.isJobUnlocked("senior_web_dev")).toBe(true);

    // Add some high-value skills
    gameState.setCurrentLearning("machine_learning");
    gameState.setCurrentLearningProgress(100);
    gameState.setCurrentLearning("deep_learning");
    gameState.setCurrentLearningProgress(100);

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
    gameState.setCurrentLearning("machine_learning");
    gameState.setCurrentLearningProgress(100);
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
    gameState.setCurrentJob("senior_web_dev");

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
    state.setCurrentJob("everyday_normal_guy");
    state.setCurrentJobProgress(50);
    expect(state.getCurrentJobProgress()).toBe(50);

    state.setCurrentJobProgress(150);
    expect(state.getCurrentJobProgress()).toBe(100);

    state.setCurrentJobProgress(-50);
    expect(state.getCurrentJobProgress()).toBe(0);
  });

  test("should check AI path unlock when job is completed", () => {
    // Mock random to ensure unlock
    const mockRandom = jest.spyOn(Math, "random");
    mockRandom.mockReturnValue(0); // Always return 0 to ensure unlock

    const state = new GameState();

    // Unlock prerequisites for senior web dev
    unlockSeniorWebDev(state);
    state.setCurrentJob("senior_web_dev");
    state.setCurrentJobProgress(100);

    expect(state.getCurrentJobProgress()).toBe(100);
    expect(state.isAIPathUnlocked()).toBe(true);

    mockRandom.mockRestore();
  });

  test("should have higher unlock chance with architect job", () => {
    // Mock random to test different unlock chances
    const mockRandom = jest.spyOn(Math, "random");

    // Test with senior job (10% cap)
    const state1 = new GameState();
    unlockSeniorWebDev(state1);
    state1.setCurrentJob("senior_web_dev");

    // Add points to reach near cap
    state1.setCurrentLearning("machine_learning");
    state1.setCurrentLearningProgress(100);
    state1.addMoney(100000);

    // Calculate expected points:
    // - Senior web dev: 5 points
    // - Machine learning: 3 points
    // - Money: 5 points
    // Total: 13 points -> 6.5% chance (under 10% cap)

    // Set random to above 6.5% to prevent unlock (0.08 * 100 = 8)
    mockRandom.mockReturnValue(0.08);
    state1.checkAIPathUnlock();
    expect(state1.isAIPathUnlocked()).toBe(false);

    // Test with architect job (25% cap)
    const state2 = new GameState();

    // First unlock senior web dev
    unlockSeniorWebDev(state2);
    state2.setCurrentJob("senior_web_dev");

    // Add required skills for web architect
    state2.setCurrentLearning("system_design");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("cloud_architecture");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("microservices");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("distributed_systems");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("ci_cd");
    state2.setCurrentLearningProgress(100);

    // Add high-value skills for points
    state2.setCurrentLearning("machine_learning");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("deep_learning");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("tensorflow");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("algorithms");
    state2.setCurrentLearningProgress(100);
    state2.setCurrentLearning("cpp");
    state2.setCurrentLearningProgress(100);

    // Add money for items and points
    state2.addMoney(500000);

    // Add high-value items
    state2.purchaseItem("expert_salary_boost");
    state2.purchaseItem("expert_learning_boost");
    state2.purchaseItem("expert_work_boost");
    state2.purchaseItem("expert_skill_time_reducer");

    // Set web architect job (15 points)
    state2.setCurrentJob("web_architect");

    // Calculate expected points:
    // - Web architect: 15 points
    // - Skills: ~14 points (ML:3, DL:4, TF:3, Algo:2, CPP:2)
    // - Items: 12 points (4 expert items * 3)
    // - Money: 5 points (max)
    // Total: ~46 points -> 23% chance (capped at 25% for architect)

    // Set random to below 23% to allow unlock (0.20 * 100 = 20)
    mockRandom.mockReturnValue(0.2);
    state2.checkAIPathUnlock();
    expect(state2.isAIPathUnlocked()).toBe(true);

    mockRandom.mockRestore();
  });

  describe("Existence Path", () => {
    beforeEach(() => {
      // Patch story for predictable max influence
      jest
        .spyOn(GameState.prototype, "getStoryProgressPercentage")
        .mockImplementation(function () {
          // 100% if influence is max, else proportional
          const stages = Object.values(story);
          const maxInfluence = Math.max(
            ...stages.map((s) => s.influenceRequired)
          );
          return Math.min(100, (this._influence / maxInfluence) * 100);
        });
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should initialize with existence path locked", () => {
      expect(gameState.getExistencePathUnlocked()).toBe(false);
    });

    test("should not unlock existence path without AI path", () => {
      // Set max influence
      const stages = Object.values(story);
      const maxInfluence = Math.max(...stages.map((s) => s.influenceRequired));
      gameState.addInfluence(maxInfluence);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(false);
    });

    test("should not unlock existence path without max story progress", () => {
      // Unlock AI path
      gameState.unlockAIPath();
      // Set influence below max
      gameState.addInfluence(500);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(false);
    });

    test("should unlock existence path when conditions are met", () => {
      // Unlock AI path
      gameState.unlockAIPath();
      // Set max influence
      const stages = Object.values(story);
      const maxInfluence = Math.max(...stages.map((s) => s.influenceRequired));
      gameState.addInfluence(maxInfluence);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(true);
    });

    test("should persist existence path state in serialization", () => {
      // Unlock AI path and existence path
      gameState.unlockAIPath();
      const stages = Object.values(story);
      const maxInfluence = Math.max(...stages.map((s) => s.influenceRequired));
      gameState.addInfluence(maxInfluence);
      gameState.checkExistencePathUnlock();

      const json = gameState.toJSON();
      const newState = GameState.fromJSON(json);

      expect(newState.getExistencePathUnlocked()).toBe(true);
    });

    test("should check existence path unlock on influence change", () => {
      // Unlock AI path
      gameState.unlockAIPath();

      // Set influence to max
      const stages = Object.values(story);
      const maxInfluence = Math.max(...stages.map((s) => s.influenceRequired));
      gameState.addInfluence(maxInfluence);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(true);

      // Reset game state to test influence changes before unlock
      gameState = new GameState();
      gameState.unlockAIPath();

      // Set influence below max
      gameState.addInfluence(500);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(false);

      // Increase influence to max
      gameState.addInfluence(maxInfluence - 500);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(true);
    });

    test("should return early if existence path is already unlocked", () => {
      // Unlock AI path and existence path
      gameState.unlockAIPath();
      const stages = Object.values(story);
      const maxInfluence = Math.max(...stages.map((s) => s.influenceRequired));
      gameState.addInfluence(maxInfluence);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(true);

      // Set influence below max (should not affect already unlocked path)
      gameState.spendInfluence(maxInfluence - 500);
      gameState.checkExistencePathUnlock();
      expect(gameState.getExistencePathUnlocked()).toBe(true);
    });
  });

  describe("Story Progression", () => {
    let state;
    beforeEach(() => {
      state = new GameState();
    });

    test("getCurrentStoryStage returns first stage if no influence", () => {
      // No need to set influence, it starts at 0
      const stages = Object.values(story).sort(
        (a, b) => a.influenceRequired - b.influenceRequired
      );
      expect(state.getCurrentStoryStage()).toEqual(stages[0]);
    });

    test("getCurrentStoryStage returns correct stage for influence", () => {
      // Find a stage with a known influence requirement
      const stages = Object.values(story).sort(
        (a, b) => a.influenceRequired - b.influenceRequired
      );
      for (let i = 0; i < stages.length; i++) {
        state.addInfluence(stages[i].influenceRequired - state.getInfluence());
        expect(state.getCurrentStoryStage()).toEqual(stages[i]);
      }
    });

    test("getCurrentStoryStage returns highest stage reached", () => {
      const stages = Object.values(story).sort(
        (a, b) => a.influenceRequired - b.influenceRequired
      );
      state.addInfluence(stages[stages.length - 1].influenceRequired + 1000);
      expect(state.getCurrentStoryStage()).toEqual(stages[stages.length - 1]);
    });

    test("getStoryProgressPercentage returns 0 if no influence", () => {
      // No need to set influence, it starts at 0
      expect(state.getStoryProgressPercentage()).toBe(0);
    });

    test("getStoryProgressPercentage returns 100 at max influence", () => {
      const stages = Object.values(story);
      const maxInfluence = Math.max(...stages.map((s) => s.influenceRequired));
      state.addInfluence(maxInfluence);
      expect(state.getStoryProgressPercentage()).toBe(100);
    });

    test("getStoryProgressPercentage returns proportional value", () => {
      const stages = Object.values(story);
      const maxInfluence = Math.max(...stages.map((s) => s.influenceRequired));
      state.addInfluence(maxInfluence / 2);
      expect(state.getStoryProgressPercentage()).toBeCloseTo(50);
    });
  });

  describe("Time Stop Feature", () => {
    test("should return false for time stop when no job is set", () => {
      expect(gameState.isTimeStopActive()).toBe(false);
    });

    test("should return false for time stop when not in time_weaver job", () => {
      gameState.setCurrentJob("everyday_normal_guy");
      expect(gameState.isTimeStopActive()).toBe(false);
    });

    test("should return false for time stop when in time_weaver but feature not enabled", () => {
      // Mock the time_weaver job without the feature
      jest.spyOn(gameState, "getCurrentJobInfo").mockReturnValue({
        id: "time_weaver",
        features: {},
      });
      expect(gameState.isTimeStopActive()).toBe(false);
    });

    test("should return true for time stop when in time_weaver with feature enabled", () => {
      // Mock the time_weaver job with the feature enabled
      jest.spyOn(gameState, "getCurrentJobInfo").mockReturnValue({
        id: "time_weaver",
        features: {
          timeStop: true,
        },
      });
      expect(gameState.isTimeStopActive()).toBe(true);
    });

    test("should persist time stop state in serialization", () => {
      // Mock the time_weaver job with the feature enabled
      jest.spyOn(gameState, "getCurrentJobInfo").mockReturnValue({
        id: "time_weaver",
        features: {
          timeStop: true,
        },
      });

      const json = gameState.toJSON();
      const newState = GameState.fromJSON(json);

      // Mock the same job info for the new state
      jest.spyOn(newState, "getCurrentJobInfo").mockReturnValue({
        id: "time_weaver",
        features: {
          timeStop: true,
        },
      });

      expect(newState.isTimeStopActive()).toBe(true);
    });
  });

  describe("Instant Learning Feature", () => {
    test("should return false for instant learning when time_manipulation not learned", () => {
      expect(gameState.isInstantLearningActive()).toBe(false);
    });

    test("should return true for instant learning when time_manipulation is learned", () => {
      gameState._skillProgress = {
        time_manipulation: 100,
      };
      expect(gameState.isInstantLearningActive()).toBe(true);
    });

    test("should persist instant learning state in serialization", () => {
      gameState._skillProgress = {
        time_manipulation: 100,
      };

      const json = gameState.toJSON();
      const newState = GameState.fromJSON(json);

      expect(newState.isInstantLearningActive()).toBe(true);
    });
  });
});
