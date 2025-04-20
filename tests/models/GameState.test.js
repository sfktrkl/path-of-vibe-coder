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
});
