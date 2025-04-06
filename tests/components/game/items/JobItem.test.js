import { mount } from "@vue/test-utils";
import JobItem from "@items/JobItem.vue";
import { jobs } from "@data/jobs";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("JobItem", () => {
  const mockGameState = {
    isJobUnlocked: jest.fn(),
    setJob: jest.fn(),
    currentJob: "everyday_normal_guy",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createWrapper = (jobId, isUnlocked = true) => {
    mockGameState.isJobUnlocked.mockReturnValue(isUnlocked);

    return mount(JobItem, {
      props: {
        job: jobs[jobId],
        gameState: mockGameState,
      },
    });
  };

  it("renders job information correctly", () => {
    const wrapper = createWrapper("everyday_normal_guy");
    expect(wrapper.find(".item-name").text()).toBe("Everyday Normal Guy");
    expect(wrapper.find(".item-description").text()).toBe(
      "Just a regular person trying to make it in the tech world"
    );
    expect(wrapper.find(".job-salary").text()).toBe("$500");
  });

  it("applies correct classes based on job state", () => {
    const wrapper = createWrapper("everyday_normal_guy");
    expect(wrapper.classes()).toContain("unlocked");
    expect(wrapper.classes()).toContain("current");
  });

  it("calls setJob when clicked and job is unlocked", () => {
    const wrapper = createWrapper("everyday_normal_guy");
    wrapper.trigger("click");
    expect(mockGameState.setJob).toHaveBeenCalledWith("everyday_normal_guy");
  });

  it("does not call setJob when clicked and job is locked", () => {
    const wrapper = createWrapper("everyday_normal_guy", false);
    wrapper.trigger("click");
    expect(mockGameState.setJob).not.toHaveBeenCalled();
  });
});
