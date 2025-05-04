import { mount } from "@vue/test-utils";
import JobsView from "@views/JobsView.vue";
import { jobs } from "@data/jobs";
import JobItem from "@items/JobItem.vue";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("JobsView.vue", () => {
  let wrapper;
  const gameStateMock = {
    isJobUnlocked: jest.fn().mockReturnValue(false),
    getCurrentJob: jest.fn().mockReturnValue(null),
    setCurrentJob: jest.fn(),
    getCurrentJobProgress: jest.fn().mockReturnValue(0),
    getAIPathUnlocked: jest.fn().mockReturnValue(false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    gameStateMock.isJobUnlocked.mockReturnValue(false);
    gameStateMock.getCurrentJob.mockReturnValue(null);
    gameStateMock.getCurrentJobProgress.mockReturnValue(0);
    gameStateMock.getAIPathUnlocked.mockReturnValue(false);

    wrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays starting job when no jobs are unlocked", () => {
    const startingJob = Object.values(jobs).find(
      (job) => job.id === "everyday_normal_guy"
    );
    const jobItems = wrapper.findAllComponents(JobItem);

    expect(jobItems.length).toBe(1);
    expect(wrapper.vm.jobsByCategory[startingJob.category]).toContainEqual(
      startingJob
    );
  });

  it("displays and filters jobs based on unlock status", () => {
    // Mock specific jobs as unlocked
    const unlockedJobs = Object.values(jobs).slice(0, 3);
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) =>
        jobId === "everyday_normal_guy" ||
        unlockedJobs.some((job) => job.id === jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);
    // Should show starting job plus unlocked jobs
    expect(jobItems.length).toBe(unlockedJobs.length);

    // Verify each displayed job is either starting job or unlocked
    Object.values(newWrapper.vm.jobsByCategory)
      .flat()
      .forEach((job) => {
        expect(
          job.id === "everyday_normal_guy" ||
            gameStateMock.isJobUnlocked(job.id)
        ).toBe(true);
      });
  });

  it("displays category names with proper capitalization", () => {
    // Mock all jobs as unlocked to see all categories
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Test with some known category names
    const testCases = [
      { input: "web_development", expected: "Web Development" },
      { input: "basic", expected: "Basic" },
      { input: "vibe", expected: "Vibe" },
    ];

    testCases.forEach(({ input, expected }) => {
      const formattedName = newWrapper.vm.formatCategoryName(input);
      expect(formattedName).toBe(expected);
    });
  });

  it("hides categories that have no available jobs", () => {
    // Mock only one job in one category as unlocked
    const jobInCategory = Object.values(jobs).find(
      (job) => job.category !== "basic" && job.id !== "everyday_normal_guy"
    );
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) => jobId === "everyday_normal_guy" || jobId === jobInCategory.id
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const categories = Object.keys(newWrapper.vm.jobsByCategory);
    // Should only show the starting job category and the category with the unlocked job
    expect(categories).toContain("basic"); // Starting job category
    expect(categories).toContain(jobInCategory.category);
    expect(categories.length).toBe(2);
  });

  it("updates displayed jobs when unlock status changes", async () => {
    // Initially only starting job
    expect(wrapper.findAllComponents(JobItem).length).toBe(1);

    // Mock all jobs as becoming unlocked
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    await wrapper.setProps({
      gameState: { ...gameStateMock },
    });

    // Should now show all jobs
    expect(wrapper.findAllComponents(JobItem).length).toBe(
      Object.keys(jobs).length
    );
  });

  it("groups jobs by their respective categories", () => {
    // Mock jobs from different categories as unlocked
    const unlockedJobs = Object.values(jobs).slice(0, 3);
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) =>
        jobId === "everyday_normal_guy" ||
        unlockedJobs.some((job) => job.id === jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Get unique categories from unlocked jobs plus starting job
    const expectedCategories = [
      "basic", // Starting job category
      ...new Set(unlockedJobs.map((job) => job.category)),
    ];

    // Verify all expected categories are displayed
    expectedCategories.forEach((category) => {
      expect(Object.keys(newWrapper.vm.jobsByCategory)).toContain(category);
    });

    // Verify jobs are in their correct categories
    Object.entries(newWrapper.vm.jobsByCategory).forEach(
      ([category, jobList]) => {
        jobList.forEach((job) => {
          expect(job.category).toBe(category);
        });
      }
    );
  });

  it("shows only AI path jobs and senior/architect jobs in vibe category when AI path is unlocked", () => {
    // Mock AI path as unlocked
    gameStateMock.getAIPathUnlocked.mockReturnValue(true);

    // Mock specific jobs as unlocked
    const webArchitect = Object.values(jobs).find(
      (job) => job.id === "web_architect"
    );
    const seniorWebDev = Object.values(jobs).find(
      (job) => job.id === "senior_web_dev"
    );
    const vibeArchitect = Object.values(jobs).find(
      (job) => job.id === "vibe_architect"
    );
    const startingJob = Object.values(jobs).find(
      (job) => job.id === "everyday_normal_guy"
    );

    // Set senior job as current to test the case where both senior and architect jobs are shown
    gameStateMock.getCurrentJob.mockReturnValue(seniorWebDev.id);

    gameStateMock.isJobUnlocked.mockImplementation((jobId) =>
      [
        webArchitect.id,
        seniorWebDev.id,
        vibeArchitect.id,
        startingJob.id,
      ].includes(jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Get all displayed jobs
    const displayedJobs = Object.values(newWrapper.vm.jobsByCategory).flat();

    // Verify each displayed job is in the correct category
    displayedJobs.forEach((job) => {
      if (job.id === "everyday_normal_guy") {
        expect(newWrapper.vm.jobsByCategory["basic"]).toContainEqual(job);
      } else if (job.requiresAIPath) {
        // AI path jobs should stay in their original categories
        expect(newWrapper.vm.jobsByCategory[job.category]).toContainEqual(job);
      } else if (job.id.includes("_architect") || job.id.includes("senior_")) {
        // Non-AI path architect and senior jobs should be in vibe category
        expect(newWrapper.vm.jobsByCategory["vibe"]).toContainEqual(job);
      }
    });

    // Verify vibe category contains both senior and architect jobs when senior is selected
    const vibeJobs = newWrapper.vm.jobsByCategory["vibe"] || [];
    expect(vibeJobs).toContainEqual(webArchitect);
    expect(vibeJobs).toContainEqual(seniorWebDev);

    // Verify vibe_architect is in its original category (vibe)
    expect(newWrapper.vm.jobsByCategory["vibe"]).toContainEqual(vibeArchitect);
  });

  it("shows both senior and architect jobs when senior job is selected when AI path is unlocked", () => {
    // Mock AI path as unlocked
    gameStateMock.getAIPathUnlocked.mockReturnValue(true);

    // Get specific jobs from the data
    const seniorWebDev = Object.values(jobs).find(
      (job) => job.id === "senior_web_dev"
    );
    const webArchitect = Object.values(jobs).find(
      (job) => job.id === "web_architect"
    );
    const startingJob = Object.values(jobs).find(
      (job) => job.id === "everyday_normal_guy"
    );

    // Mock these jobs as unlocked and set senior job as current
    gameStateMock.isJobUnlocked.mockImplementation((jobId) =>
      [seniorWebDev.id, webArchitect.id, startingJob.id].includes(jobId)
    );
    gameStateMock.getCurrentJob.mockReturnValue(seniorWebDev.id);

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Verify both jobs are in vibe category
    const vibeJobs = newWrapper.vm.jobsByCategory["vibe"] || [];
    expect(vibeJobs).toContainEqual(seniorWebDev);
    expect(vibeJobs).toContainEqual(webArchitect);
  });
});
