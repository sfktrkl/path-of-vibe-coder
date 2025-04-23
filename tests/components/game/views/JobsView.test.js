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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    gameStateMock.isJobUnlocked.mockReturnValue(false);

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

  it("displays jobs by category when unlocked", () => {
    // Mock some jobs as unlocked
    const unlockedJobs = Object.values(jobs).slice(0, 3);
    gameStateMock.isJobUnlocked.mockImplementation((jobId) =>
      unlockedJobs.some((job) => job.id === jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);
    expect(jobItems.length).toBe(unlockedJobs.length);

    // Verify each displayed job is unlocked
    Object.values(newWrapper.vm.jobsByCategory)
      .flat()
      .forEach((job) => {
        if (job.id !== "everyday_normal_guy") {
          expect(gameStateMock.isJobUnlocked(job.id)).toBe(true);
        }
      });
  });

  it("capitalizes category names", () => {
    // Mock some jobs as unlocked to see categories
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const categories = Object.keys(newWrapper.vm.jobsByCategory);
    categories.forEach((category) => {
      const displayedCategory = newWrapper
        .text()
        .includes(category.charAt(0).toUpperCase() + category.slice(1));
      expect(displayedCategory).toBe(true);
    });
  });

  it("filters jobs based on unlock status", () => {
    // Mock some jobs as unlocked
    const unlockedJobs = Object.values(jobs).slice(0, 3);
    gameStateMock.isJobUnlocked.mockImplementation((jobId) =>
      unlockedJobs.some((job) => job.id === jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);
    expect(jobItems.length).toBe(unlockedJobs.length);

    // Verify each displayed job is unlocked
    Object.values(newWrapper.vm.jobsByCategory)
      .flat()
      .forEach((job) => {
        if (job.id !== "everyday_normal_guy") {
          expect(gameStateMock.isJobUnlocked(job.id)).toBe(true);
        }
      });
  });

  it("hides empty categories", () => {
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

  it("updates when unlock status changes", async () => {
    // Initially only starting job
    expect(wrapper.findAllComponents(JobItem).length).toBe(1);

    // Mock some jobs as becoming unlocked
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    await wrapper.setProps({
      gameState: { ...gameStateMock },
    });

    // Should now show all jobs
    expect(wrapper.findAllComponents(JobItem).length).toBe(
      Object.keys(jobs).length
    );
  });

  it("displays jobs in correct categories", () => {
    // Mock jobs from different categories as unlocked
    const unlockedJobs = Object.values(jobs).slice(0, 3);
    gameStateMock.isJobUnlocked.mockImplementation((jobId) =>
      unlockedJobs.some((job) => job.id === jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Get unique categories from unlocked jobs
    const expectedCategories = [
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
});
