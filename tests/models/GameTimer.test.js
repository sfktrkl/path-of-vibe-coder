import GameTimer from "@models/GameTimer";

// Mock the data modules
jest.mock("@data/skills", () => ({
  skills: {
    test_skill: {
      timeRequired: 10,
    },
  },
}));

jest.mock("@data/jobs", () => ({
  jobs: {
    test_job: {
      timeRequired: 10,
      salary: 100,
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
});
