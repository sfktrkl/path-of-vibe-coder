import { mount } from "@vue/test-utils";
import JobItem from "@items/JobItem.vue";
import { jobs } from "@data/jobs";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("JobItem", () => {
  const mockGameState = {
    isJobUnlocked: jest.fn(),
    setCurrentJob: jest.fn(),
    getCurrentJob: jest.fn().mockReturnValue(null),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGameState.getCurrentJob.mockReturnValue(null);
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

  describe("Job Information Display", () => {
    it("renders job information correctly", () => {
      const wrapper = createWrapper("everyday_normal_guy");
      expect(wrapper.find(".item-name").text()).toBe("Everyday Normal Guy");
      expect(wrapper.find(".item-description").text()).toBe(
        "Just a regular person trying to make it in the tech world"
      );
      expect(wrapper.find(".job-salary").text()).toBe("$2");
    });

    it("displays salary correctly for different jobs", () => {
      // Test low salary job
      let wrapper = createWrapper("everyday_normal_guy");
      expect(wrapper.find(".job-salary").text()).toBe("$2");

      // Test medium salary job
      wrapper = createWrapper("senior_web_dev");
      expect(wrapper.find(".job-salary").text()).toBe("$8000");

      // Test high salary job
      wrapper = createWrapper("world_dominator");
      expect(wrapper.find(".job-salary").text()).toBe("$100000");
    });

    it("does not show influence gain for jobs without influenceGain", () => {
      // Test several jobs that don't have influence gain
      const noInfluenceJobs = [
        "everyday_normal_guy",
        "computer_trainee",
        "senior_web_dev",
        "senior_devops",
      ];

      noInfluenceJobs.forEach((jobId) => {
        const wrapper = createWrapper(jobId);
        expect(wrapper.find(".job-influence").exists()).toBe(false);
      });
    });

    it("shows influence gain for jobs with influenceGain", () => {
      // Test jobs that have influence gain
      const influenceJobs = [
        { id: "digital_consciousness_engineer", gain: 5 },
        { id: "consciousness_architect", gain: 10 },
        { id: "reality_engineer", gain: 5 },
        { id: "matrix_architect", gain: 10 },
        { id: "bio_digital_engineer", gain: 5 },
        { id: "bio_digital_architect", gain: 10 },
        { id: "quantum_engineer", gain: 20 },
        { id: "dimension_controller", gain: 30 },
        { id: "reality_master", gain: 50 },
        { id: "world_dominator", gain: 100 },
      ];

      influenceJobs.forEach(({ id, gain }) => {
        const wrapper = createWrapper(id);
        const influenceElement = wrapper.find(".job-influence");
        expect(influenceElement.exists()).toBe(true);
        expect(influenceElement.text()).toBe(`⚡${gain}`);
      });
    });
  });

  describe("Job State and Interaction", () => {
    it("applies correct classes based on job state", () => {
      mockGameState.getCurrentJob.mockReturnValue("everyday_normal_guy");
      const wrapper = createWrapper("everyday_normal_guy");
      expect(wrapper.classes()).toContain("unlocked");
      expect(wrapper.classes()).toContain("current");
    });

    it("calls setCurrentJob when clicked and job is unlocked and not current", () => {
      mockGameState.getCurrentJob.mockReturnValue("different_job");
      const wrapper = createWrapper("everyday_normal_guy");
      wrapper.trigger("click");
      expect(mockGameState.setCurrentJob).toHaveBeenCalledWith(
        "everyday_normal_guy"
      );
    });

    it("does not call setCurrentJob when clicked and job is locked", () => {
      const wrapper = createWrapper("everyday_normal_guy", false);
      wrapper.trigger("click");
      expect(mockGameState.setCurrentJob).not.toHaveBeenCalled();
    });

    it("does not call setCurrentJob when clicked and job is current", () => {
      mockGameState.getCurrentJob.mockReturnValue("everyday_normal_guy");
      const wrapper = createWrapper("everyday_normal_guy");
      wrapper.trigger("click");
      expect(mockGameState.setCurrentJob).not.toHaveBeenCalled();
    });
  });
});
