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
      getLearningProgress: jest.fn().mockReturnValue(0),
      jobProgress: 0,
      updateLearningProgress: jest.fn(),
      addMoney: jest.fn(),

      getItemEffects: jest.fn().mockReturnValue({
        learningSpeedMultiplier: 1,
        workProgressMultiplier: 1,
        salaryMultiplier: 1,
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
    mockGameState.currentLearning = "test_skill";
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(mockGameState.updateLearningProgress).toHaveBeenCalled();
  });

  test("should update job progress and pay salary", () => {
    mockGameState.currentJob = "test_job";
    mockGameState.jobProgress = 99;
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
    mockGameState.jobProgress = 50;

    timer.start();
    jest.advanceTimersByTime(1000);

    expect(mockGameState.updateLearningProgress).toHaveBeenCalled();
    expect(mockGameState.jobProgress).toBeGreaterThan(50);
  });

  test("should handle different progress rates", () => {
    mockGameState.currentLearning = "test_skill_2"; // 20s required
    mockGameState.currentJob = "test_job_2"; // 20s required

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
    timer.start();

    const now = Date.now();
    jest.setSystemTime(now + 1000); // Jump 1 second ahead

    timer.update();
    expect(mockGameState.jobProgress).toBeGreaterThan(0);
  });
});
