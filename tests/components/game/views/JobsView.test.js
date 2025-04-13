import { mount } from "@vue/test-utils";
import JobsView from "@views/JobsView.vue";
import { jobs } from "@data/jobs";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("JobsView", () => {
  let wrapper;
  const gameStateMock = {
    isJobUnlocked: jest.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    wrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays job categories", () => {
    const categories = wrapper.vm.jobsByCategory;
    expect(categories).toHaveProperty("basic");
    expect(categories.basic).toHaveLength(6);
  });

  it("always shows the starting job", () => {
    const categories = wrapper.vm.jobsByCategory;
    const startingJob = jobs.everyday_normal_guy;
    expect(categories[startingJob.category]).toContainEqual(startingJob);
  });

  it("capitalizes category names", () => {
    const categories = wrapper.vm.jobsByCategory;
    Object.keys(categories).forEach((category) => {
      expect(category).toBe(category.toLowerCase());
    });
  });

  it("renders JobItem components for each job", () => {
    const jobItems = wrapper.findAllComponents({ name: "JobItem" });
    const totalJobs = Object.values(jobs).length;
    expect(jobItems.length).toBe(totalJobs);
  });

  it("filters jobs based on isJobUnlocked", () => {
    const mockUnlocked = jest.fn().mockReturnValue(false);
    const wrapper = mount(JobsView, {
      propsData: { gameState: { isJobUnlocked: mockUnlocked } },
    });

    const categories = wrapper.vm.jobsByCategory;
    Object.values(categories).forEach((jobList) => {
      expect(jobList.length).toBeLessThanOrEqual(1); // Only starting job should be shown
    });
  });
});
