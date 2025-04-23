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

    const categories = Object.keys(newWrapper.vm.jobsByCategory);
    categories.forEach((category) => {
      const capitalizedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
      const displayedCategory = newWrapper.text().includes(capitalizedCategory);
      expect(displayedCategory).toBe(true);
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
});
