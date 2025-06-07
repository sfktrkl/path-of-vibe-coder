import GameTimer from "@models/GameTimer";

// Mock the data modules
jest.mock("@data/skills", () => ({
  skills: {
    test_skill: {
      timeRequired: 10,
    },
    test_skill_2: {
      timeRequired: 20,
    },
  },
}));

jest.mock("@data/jobs", () => ({
  jobs: {
    test_job: {
      timeRequired: 10,
      salary: 100,
    },
    test_job_2: {
      timeRequired: 20,
      salary: 200,
    },
  },
}));

describe("GameTimer", () => {
  let timer;
  let mockGameState;

  beforeEach(() => {
    jest.useFakeTimers();
    mockGameState = {
      getCurrentLearning: jest.fn().mockReturnValue(null),
      getCurrentJob: jest.fn().mockReturnValue(null),
      getCurrentJobProgress: jest.fn().mockReturnValue(0),
      addMoney: jest.fn(),
      setCurrentLearningProgress: jest.fn(),
      getCurrentLearningProgress: jest.fn().mockReturnValue(0),
      getCurrentSkillInfo: jest.fn().mockReturnValue(null),
      getCurrentJobInfo: jest.fn().mockReturnValue(null),
      setCurrentJobProgress: jest.fn(),
      isTimeStopActive: jest.fn().mockReturnValue(false),
      getItemEffects: () => ({
        salaryBoost: 1,
        learningSpeed: 1,
        workSpeed: 1,
        skillTimeReduction: 1,
        jobInitialProgress: 0,
      }),
      setCurrentJob: jest.fn().mockImplementation(function (jobId) {
        this.getCurrentJob.mockReturnValue(jobId);
        this.getCurrentJobProgress.mockReturnValue(0);
        const effects = this.getItemEffects();
        if (effects.jobInitialProgress > 0) {
          this.getCurrentJobProgress.mockReturnValue(
            effects.jobInitialProgress
          );
        }
        return true;
      }),
    };
    timer = new GameTimer(mockGameState);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should initialize with default values", () => {
    expect(timer.isRunning).toBe(false);
    expect(timer.timer).toBeNull();
    expect(timer.lastUpdate).toBeNull();
  });

  test("should start timer", () => {
    timer.start();
    expect(timer.isRunning).toBe(true);
    expect(timer.timer).not.toBeNull();
    expect(timer.lastUpdate).not.toBeNull();
  });

  test("should stop timer", () => {
    timer.start();
    timer.stop();
    expect(timer.isRunning).toBe(false);
    expect(timer.timer).toBeNull();
  });

  test("should update learning progress", () => {
    mockGameState.getCurrentLearning.mockReturnValue("test_skill");
    mockGameState.getCurrentSkillInfo.mockReturnValue({
      id: "test_skill",
      timeRequired: 10,
    });

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(10);
  });

  test("should update job progress and pay salary", () => {
    mockGameState.getCurrentJob.mockReturnValue("test_job");
    mockGameState.getCurrentJobInfo.mockReturnValue({
      id: "test_job",
      timeRequired: 10,
      salary: 100,
    });

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(10);
  });

  test("should pause and resume timer", () => {
    timer.start();
    timer.pause();
    expect(timer.isRunning).toBe(false);
    timer.resume();
    expect(timer.isRunning).toBe(true);
  });

  test("should get current state", () => {
    const state = timer.getState();
    expect(state).toEqual({
      isRunning: false,
      currentLearning: null,
      currentJob: null,
      learningProgress: 0,
      jobProgress: 0,
    });
  });

  test("should handle learning and working simultaneously", () => {
    mockGameState.getCurrentLearning.mockReturnValue("test_skill");
    mockGameState.getCurrentSkillInfo.mockReturnValue({
      id: "test_skill",
      timeRequired: 10,
    });

    mockGameState.getCurrentJob.mockReturnValue("test_job");
    mockGameState.getCurrentJobInfo.mockReturnValue({
      id: "test_job",
      timeRequired: 10,
      salary: 100,
    });

    timer.start();
    jest.advanceTimersByTime(1000);

    expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(10);
    expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(10);
  });

  test("should handle different progress rates", () => {
    mockGameState.getCurrentLearning.mockReturnValue("test_skill");
    mockGameState.getCurrentSkillInfo.mockReturnValue({
      id: "test_skill",
      timeRequired: 20,
    });

    mockGameState.getCurrentJob.mockReturnValue("test_job");
    mockGameState.getCurrentJobInfo.mockReturnValue({
      id: "test_job",
      timeRequired: 5,
      salary: 100,
    });

    timer.start();
    jest.advanceTimersByTime(1000);

    expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(5);
    expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(20);
  });

  test("should handle invalid skill IDs", () => {
    mockGameState.getCurrentLearning.mockReturnValue("nonexistent_skill");
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.setCurrentLearningProgress).not.toHaveBeenCalled();
  });

  test("should handle invalid job IDs", () => {
    mockGameState.getCurrentJob.mockReturnValue("nonexistent_job");
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.addMoney).not.toHaveBeenCalled();
  });

  test("should handle rapid start/stop cycles", () => {
    for (let i = 0; i < 10; i++) {
      timer.start();
      timer.stop();
    }
    expect(timer.isRunning).toBe(false);
    expect(timer.timer).toBeNull();
  });

  test("should calculate progress over time", () => {
    // Mock a skill that takes 10 seconds
    mockGameState.getCurrentLearning.mockReturnValue("test_skill");
    mockGameState.getCurrentSkillInfo.mockReturnValue({
      id: "test_skill",
      timeRequired: 10,
    });

    // Mock current progress values
    mockGameState.getCurrentLearningProgress
      .mockReturnValueOnce(0) // First call returns 0
      .mockReturnValueOnce(10); // Second call returns 10 (after first update)

    timer.start();
    // Advance by 1 second (10% progress)
    jest.advanceTimersByTime(1000);
    expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(10);

    // Advance by another second (another 10% progress)
    jest.advanceTimersByTime(1000);
    expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(20);
  });

  test("should handle time gaps between updates", () => {
    // Mock a job that takes 10 seconds
    mockGameState.getCurrentJob.mockReturnValue("test_job");
    mockGameState.getCurrentJobInfo.mockReturnValue({
      id: "test_job",
      timeRequired: 10,
      salary: 100,
    });

    // Mock current progress values
    mockGameState.getCurrentJobProgress
      .mockReturnValueOnce(0) // First call returns 0
      .mockReturnValueOnce(10); // Second call returns 10 (after first update)

    timer.start();
    jest.advanceTimersByTime(2000); // 2 seconds = 20% progress
    expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(20);
  });

  describe("item effects", () => {
    test("salary multiplier should increase job reward", () => {
      // Mock a job that takes 10 seconds and pays 100
      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 1, // 1 second to complete
        salary: 100,
      });

      // Set 2x salary multiplier
      mockGameState.getItemEffects = () => ({
        salaryBoost: 2,
        learningSpeed: 1,
        workSpeed: 1,
        skillTimeReduction: 1,
        jobInitialProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000); // Complete the job
      expect(mockGameState.addMoney).toHaveBeenCalledWith(200); // 100 * 2
    });

    test("learning speed multiplier should increase learning progress", () => {
      // Mock a skill that takes 10 seconds
      mockGameState.getCurrentLearning.mockReturnValue("test_skill");
      mockGameState.getCurrentSkillInfo.mockReturnValue({
        id: "test_skill",
        timeRequired: 10,
      });

      // Set 2x learning speed
      mockGameState.getItemEffects = () => ({
        salaryBoost: 1,
        learningSpeed: 2,
        workSpeed: 1,
        skillTimeReduction: 1,
        jobInitialProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000);
      expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(20); // 10% * 2
    });

    test("work speed multiplier should increase job progress", () => {
      // Mock a job that takes 10 seconds
      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 10,
        salary: 100,
      });

      // Set 2x work speed
      mockGameState.getItemEffects = () => ({
        salaryBoost: 1,
        learningSpeed: 1,
        workSpeed: 2,
        skillTimeReduction: 1,
        jobInitialProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000);
      expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(20); // 10% * 2
    });

    test("skill time multiplier should reduce required learning time", () => {
      // Mock a skill that takes 10 seconds
      mockGameState.getCurrentLearning.mockReturnValue("test_skill");
      mockGameState.getCurrentSkillInfo.mockReturnValue({
        id: "test_skill",
        timeRequired: 10,
      });

      // Set 0.5x skill time (2x faster)
      mockGameState.getItemEffects = () => ({
        salaryBoost: 1,
        learningSpeed: 1,
        workSpeed: 1,
        skillTimeReduction: 0.5,
        jobInitialProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000);
      expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(20); // 10% / 0.5
    });

    test("initial job progress should start jobs with progress", () => {
      // Mock a job that takes 10 seconds
      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 10,
        salary: 100,
      });

      // Set 50% initial progress
      mockGameState.getItemEffects = () => ({
        salaryBoost: 1,
        learningSpeed: 1,
        workSpeed: 1,
        skillTimeReduction: 1,
        jobInitialProgress: 50,
      });

      mockGameState.getCurrentJobProgress.mockReturnValue(50); // Initial progress
      timer.start();
      jest.advanceTimersByTime(1000);
      expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(60); // 50% + 10%
    });

    test("all effects should work together", () => {
      // Mock both a job and a skill
      mockGameState.getCurrentLearning.mockReturnValue("test_skill");
      mockGameState.getCurrentSkillInfo.mockReturnValue({
        id: "test_skill",
        timeRequired: 10,
      });

      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 10,
        salary: 100,
      });

      // Set all effects
      mockGameState.getItemEffects = () => ({
        salaryBoost: 2,
        learningSpeed: 2,
        workSpeed: 2,
        skillTimeReduction: 0.5,
        jobInitialProgress: 20,
      });

      mockGameState.getCurrentJobProgress.mockReturnValue(20); // Initial progress
      timer.start();
      jest.advanceTimersByTime(1000);

      // Check learning progress (base 10% * 2 speed * 2 time reduction = 40%)
      expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(40);

      // Check job progress (20% initial + base 10% * 2 speed = 40%)
      expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(40);
    });

    test("job should restart with initial progress after completion", () => {
      // Mock a job that takes 2 seconds
      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 2,
        salary: 100,
      });

      // Set 30% initial progress
      mockGameState.getItemEffects = () => ({
        salaryBoost: 1,
        learningSpeed: 1,
        workSpeed: 1,
        skillTimeReduction: 1,
        jobInitialProgress: 30,
      });

      mockGameState.getCurrentJobProgress.mockReturnValue(90);
      timer.start();
      jest.advanceTimersByTime(1000);

      // Job should complete and pay salary
      expect(mockGameState.addMoney).toHaveBeenCalledWith(100);

      // Job should restart with initial progress
      expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(30);
    });
  });

  describe("Time Stop Feature", () => {
    test("should not update progress when time stop is active", () => {
      // Set up learning and job
      mockGameState.getCurrentLearning.mockReturnValue("test_skill");
      mockGameState.getCurrentSkillInfo.mockReturnValue({
        id: "test_skill",
        timeRequired: 10,
      });
      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 10,
        salary: 100,
      });

      // Enable time stop
      mockGameState.isTimeStopActive.mockReturnValue(true);

      timer.start();
      jest.advanceTimersByTime(1000);

      // Verify no progress was made
      expect(mockGameState.setCurrentLearningProgress).not.toHaveBeenCalled();
      expect(mockGameState.setCurrentJobProgress).not.toHaveBeenCalled();
      expect(mockGameState.addMoney).not.toHaveBeenCalled();
    });

    test("should resume progress when time stop is disabled", () => {
      // Set up learning and job
      mockGameState.getCurrentLearning.mockReturnValue("test_skill");
      mockGameState.getCurrentSkillInfo.mockReturnValue({
        id: "test_skill",
        timeRequired: 10,
      });
      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 10,
        salary: 100,
      });

      // Start with time stop active
      mockGameState.isTimeStopActive.mockReturnValue(true);
      timer.start();
      jest.advanceTimersByTime(1000);

      // Verify no progress was made
      expect(mockGameState.setCurrentLearningProgress).not.toHaveBeenCalled();
      expect(mockGameState.setCurrentJobProgress).not.toHaveBeenCalled();

      // Disable time stop
      mockGameState.isTimeStopActive.mockReturnValue(false);
      jest.advanceTimersByTime(1000);

      // Verify progress resumed
      expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(10);
      expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(10);
    });

    test("should maintain timer state during time stop", () => {
      timer.start();
      expect(timer.isRunning).toBe(true);

      // Enable time stop
      mockGameState.isTimeStopActive.mockReturnValue(true);
      jest.advanceTimersByTime(1000);

      // Timer should still be running
      expect(timer.isRunning).toBe(true);
      expect(timer.timer).not.toBeNull();
    });

    test("should handle time stop with all effects", () => {
      // Set up learning and job with effects
      mockGameState.getCurrentLearning.mockReturnValue("test_skill");
      mockGameState.getCurrentSkillInfo.mockReturnValue({
        id: "test_skill",
        timeRequired: 10,
      });
      mockGameState.getCurrentJob.mockReturnValue("test_job");
      mockGameState.getCurrentJobInfo.mockReturnValue({
        id: "test_job",
        timeRequired: 10,
        salary: 100,
      });

      // Set up effects
      mockGameState.getItemEffects = jest.fn().mockReturnValue({
        salaryBoost: 2,
        learningSpeed: 2,
        workSpeed: 2,
        skillTimeReduction: 0.5,
        jobInitialProgress: 20,
        influenceBoost: 1,
      });

      // Set initial job progress
      mockGameState.getCurrentJobProgress.mockReturnValue(20);

      // Enable time stop
      mockGameState.isTimeStopActive.mockReturnValue(true);
      timer.start();
      jest.advanceTimersByTime(1000);

      // Verify no progress was made despite effects
      expect(mockGameState.setCurrentLearningProgress).not.toHaveBeenCalled();
      expect(mockGameState.setCurrentJobProgress).not.toHaveBeenCalled();
      expect(mockGameState.addMoney).not.toHaveBeenCalled();

      // Disable time stop
      mockGameState.isTimeStopActive.mockReturnValue(false);
      jest.advanceTimersByTime(1000);

      // Calculate expected values:
      // Learning: base 10% * 2 speed * 2 time reduction = 40%
      // Job: 20% initial + (base 10% * 2 speed) = 40%
      expect(mockGameState.setCurrentLearningProgress).toHaveBeenCalledWith(40);
      expect(mockGameState.setCurrentJobProgress).toHaveBeenCalledWith(40);

      // Verify effects were applied correctly
      expect(mockGameState.getItemEffects).toHaveBeenCalled();
    });
  });
});
