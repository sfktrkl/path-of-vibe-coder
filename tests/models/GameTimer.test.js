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
      currentLearning: null,
      currentJob: null,
      jobProgress: 0,
      addMoney: jest.fn(),
      updateLearningProgress: jest.fn(),
      getLearningProgress: jest.fn().mockReturnValue(0),
      getItemEffects: () => ({
        salaryMultiplier: 1,
        learningSpeedMultiplier: 1,
        workSpeedMultiplier: 1,
        skillTimeMultiplier: 1,
        initialJobProgress: 0,
      }),
      setJob(jobId) {
        this.currentJob = jobId;
        this.jobProgress = 0;
        const effects = this.getItemEffects();
        if (effects.initialJobProgress > 0) {
          this.jobProgress = effects.initialJobProgress;
        }
        return true;
      },
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
    mockGameState.currentLearning = "test_skill";
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.updateLearningProgress).toHaveBeenCalled();
  });

  test("should update job progress and pay salary", () => {
    mockGameState.currentJob = "test_job";
    mockGameState.jobProgress = 90;
    mockGameState.getItemEffects = () => ({
      salaryMultiplier: 1,
      learningSpeedMultiplier: 1,
      workSpeedMultiplier: 1,
      skillTimeMultiplier: 1,
      initialJobProgress: 0,
    });

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.addMoney).toHaveBeenCalledWith(100);
    expect(mockGameState.jobProgress).toBe(0);
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
    mockGameState.currentLearning = "test_skill";
    mockGameState.currentJob = "test_job";
    mockGameState.jobProgress = 0;
    mockGameState.getItemEffects = () => ({
      salaryMultiplier: 1,
      learningSpeedMultiplier: 1,
      workSpeedMultiplier: 1,
      skillTimeMultiplier: 1,
      initialJobProgress: 0,
    });

    timer.start();
    jest.advanceTimersByTime(1000);

    expect(mockGameState.updateLearningProgress).toHaveBeenCalled();
    expect(mockGameState.jobProgress).toBeGreaterThan(0);
  });

  test("should handle different progress rates", () => {
    mockGameState.currentLearning = "test_skill";
    mockGameState.currentJob = "test_job";
    mockGameState.getItemEffects = () => ({
      salaryMultiplier: 1,
      learningSpeedMultiplier: 2,
      workSpeedMultiplier: 2,
      skillTimeMultiplier: 0.8,
      initialJobProgress: 0,
    });

    timer.start();
    jest.advanceTimersByTime(1000);

    expect(mockGameState.updateLearningProgress).toHaveBeenCalled();
    expect(mockGameState.jobProgress).toBeGreaterThan(0);
  });

  test("should handle invalid skill IDs", () => {
    mockGameState.currentLearning = "nonexistent_skill";
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.updateLearningProgress).not.toHaveBeenCalled();
  });

  test("should handle invalid job IDs", () => {
    mockGameState.currentJob = "nonexistent_job";
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
    mockGameState.currentLearning = "test_skill";
    timer.start();

    // Advance by 1 second (10% progress)
    jest.advanceTimersByTime(1000);
    expect(mockGameState.updateLearningProgress).toHaveBeenCalled();

    // Advance by another second (another 10% progress)
    jest.advanceTimersByTime(1000);
    expect(mockGameState.updateLearningProgress).toHaveBeenCalled();
  });

  test("should handle time gaps between updates", () => {
    mockGameState.currentJob = "test_job";
    mockGameState.getItemEffects = () => ({
      salaryMultiplier: 1,
      learningSpeedMultiplier: 1,
      workSpeedMultiplier: 1,
      skillTimeMultiplier: 1,
      initialJobProgress: 0,
    });

    timer.start();
    jest.advanceTimersByTime(1000);
    timer.stop();
    jest.advanceTimersByTime(5000);
    timer.start();

    expect(mockGameState.jobProgress).toBeGreaterThan(0);
  });

  describe("item effects", () => {
    test("salary multiplier should increase job reward", () => {
      mockGameState.currentJob = "test_job";
      mockGameState.jobProgress = 99;
      mockGameState.getItemEffects = () => ({
        salaryMultiplier: 2,
        learningSpeedMultiplier: 1,
        workSpeedMultiplier: 1,
        skillTimeMultiplier: 1,
        initialJobProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000);
      expect(mockGameState.addMoney).toHaveBeenCalledWith(200); // 100 * 2
    });

    test("learning speed multiplier should increase learning progress", () => {
      mockGameState.currentLearning = "test_skill";
      mockGameState.getItemEffects = () => ({
        salaryMultiplier: 1,
        learningSpeedMultiplier: 2,
        workSpeedMultiplier: 1,
        skillTimeMultiplier: 1,
        initialJobProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000);

      // With 10s required time, base progress is 10% per second
      // With 2x multiplier, should be 20% per second
      expect(mockGameState.updateLearningProgress).toHaveBeenCalledWith(20);
    });

    test("work speed multiplier should increase job progress", () => {
      mockGameState.currentJob = "test_job";
      mockGameState.jobProgress = 0;
      mockGameState.getItemEffects = () => ({
        salaryMultiplier: 1,
        learningSpeedMultiplier: 1,
        workSpeedMultiplier: 2,
        skillTimeMultiplier: 1,
        initialJobProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000);

      // With 10s required time, base progress is 10% per second
      // With 2x multiplier, should be 20% per second
      expect(mockGameState.jobProgress).toBe(20);
    });

    test("skill time multiplier should reduce required learning time", () => {
      mockGameState.currentLearning = "test_skill";
      mockGameState.getItemEffects = () => ({
        salaryMultiplier: 1,
        learningSpeedMultiplier: 1,
        workSpeedMultiplier: 1,
        skillTimeMultiplier: 0.5, // 50% time reduction
        initialJobProgress: 0,
      });

      timer.start();
      jest.advanceTimersByTime(1000);

      // With 10s required time and 0.5 time multiplier:
      // - Effective time required is 5s
      // - Base progress should be 20% per second (100/5)
      expect(mockGameState.updateLearningProgress).toHaveBeenCalledWith(20);
    });

    test("initial job progress should start jobs with progress", () => {
      mockGameState.getItemEffects = () => ({
        salaryMultiplier: 1,
        learningSpeedMultiplier: 1,
        workSpeedMultiplier: 1,
        skillTimeMultiplier: 1,
        initialJobProgress: 50, // 50% initial progress
      });

      // Start the job - this should trigger initial progress
      mockGameState.setJob("test_job");
      timer.start();

      // Initial progress should be applied
      expect(mockGameState.jobProgress).toBe(50);

      // Progress should continue from there
      jest.advanceTimersByTime(1000);
      // With 10s required time, base progress is 10% per second
      expect(mockGameState.jobProgress).toBe(60);
    });

    test("all effects should work together", () => {
      mockGameState.getItemEffects = () => ({
        salaryMultiplier: 2,
        learningSpeedMultiplier: 2,
        workSpeedMultiplier: 2,
        skillTimeMultiplier: 0.5,
        initialJobProgress: 20,
      });

      // Start the job - this should trigger initial progress
      mockGameState.setJob("test_job");
      mockGameState.currentLearning = "test_skill";
      timer.start();

      // Check initial job progress
      expect(mockGameState.jobProgress).toBe(20);

      jest.advanceTimersByTime(1000);

      // Check learning progress (base 10% * 2 speed * 2 time reduction = 40%)
      expect(mockGameState.updateLearningProgress).toHaveBeenCalledWith(40);

      // Check job progress (20% initial + base 10% * 2 speed = 40%)
      expect(mockGameState.jobProgress).toBe(40);

      // Complete the job
      mockGameState.jobProgress = 99;
      jest.advanceTimersByTime(1000);

      // Check salary (100 * 2)
      expect(mockGameState.addMoney).toHaveBeenCalledWith(200);

      // Job should restart with initial progress
      expect(mockGameState.jobProgress).toBe(20);
    });

    test("job should restart with initial progress after completion", () => {
      mockGameState.getItemEffects = () => ({
        salaryMultiplier: 1,
        learningSpeedMultiplier: 1,
        workSpeedMultiplier: 1,
        skillTimeMultiplier: 1,
        initialJobProgress: 30,
      });

      // Start the job
      mockGameState.setJob("test_job");
      timer.start();

      // Verify initial progress
      expect(mockGameState.jobProgress).toBe(30);

      // Complete the job
      mockGameState.jobProgress = 99;
      jest.advanceTimersByTime(1000);

      // Check salary was paid
      expect(mockGameState.addMoney).toHaveBeenCalledWith(100);

      // Job should restart with initial progress
      expect(mockGameState.jobProgress).toBe(30);

      // Progress should continue from initial progress
      jest.advanceTimersByTime(1000);
      expect(mockGameState.jobProgress).toBe(40); // 30% initial + 10% progress
    });
  });
});
