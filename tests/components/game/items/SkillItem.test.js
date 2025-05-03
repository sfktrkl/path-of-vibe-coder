import { mount } from "@vue/test-utils";
import SkillItem from "@items/SkillItem.vue";
import { skills } from "@data/skills";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("SkillItem", () => {
  const mockGameState = {
    hasSkill: jest.fn(),
    setCurrentLearning: jest.fn(),
    getCurrentLearning: jest.fn().mockReturnValue(null),
    getCurrentLearningProgress: jest.fn().mockReturnValue(50),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createWrapper = (
    skillId,
    hasSkill = false,
    isAvailable = true,
    isLearning = false
  ) => {
    mockGameState.hasSkill.mockReturnValue(hasSkill);
    mockGameState.getCurrentLearning.mockReturnValue(
      isLearning ? skillId : null
    );

    return mount(SkillItem, {
      props: {
        skill: skills[skillId],
        gameState: mockGameState,
        isAvailable,
      },
    });
  };

  it("renders skill information correctly", () => {
    const wrapper = createWrapper("computer_basics");
    expect(wrapper.find(".item-name").text()).toBe("Computer Basics");
    expect(wrapper.find(".item-description").text()).toBe(
      "Understanding how to use a computer"
    );
  });

  it("shows learned badge when skill is learned", () => {
    const wrapper = createWrapper("computer_basics", true);
    expect(wrapper.find(".learned-badge").text()).toBe("Learned");
  });

  it("shows available badge when skill is available", () => {
    const wrapper = createWrapper("computer_basics", false, true);
    expect(wrapper.find(".available-badge").text()).toBe("Available");
  });

  it("shows locked badge when skill is not available", () => {
    const wrapper = createWrapper("computer_basics", false, false);
    expect(wrapper.find(".locked-badge").text()).toBe("Locked");
  });

  it("shows progress bar when skill is being learned", () => {
    const wrapper = createWrapper("computer_basics", false, true, true);
    expect(wrapper.find(".progress-bar").exists()).toBe(true);
    expect(wrapper.find(".progress").attributes("style")).toContain(
      "width: 50%"
    );
  });

  it("calls setCurrentLearning when clicked and skill is available", () => {
    const wrapper = createWrapper("computer_basics", false, true);
    wrapper.trigger("click");
    expect(mockGameState.setCurrentLearning).toHaveBeenCalledWith(
      "computer_basics"
    );
  });

  it("does not call setCurrentLearning when clicked and skill is already learned", () => {
    const wrapper = createWrapper("computer_basics", true, true);
    wrapper.trigger("click");
    expect(mockGameState.setCurrentLearning).not.toHaveBeenCalled();
  });

  it("applies correct classes based on skill state", () => {
    const wrapper = createWrapper("computer_basics", true, true);
    expect(wrapper.classes()).toContain("learned");
    expect(wrapper.classes()).toContain("item-base");

    const availableWrapper = createWrapper("computer_basics", false, true);
    expect(availableWrapper.classes()).toContain("available");

    const learningWrapper = createWrapper("computer_basics", false, true, true);
    expect(learningWrapper.classes()).toContain("learning");
  });

  it("handles empty skill data", () => {
    const wrapper = mount(SkillItem, {
      props: {
        skill: { id: "test", name: "", description: "" },
        gameState: mockGameState,
        isAvailable: true,
      },
    });
    expect(wrapper.find(".item-name").text()).toBe("");
    expect(wrapper.find(".item-description").text()).toBe("");
  });
});
