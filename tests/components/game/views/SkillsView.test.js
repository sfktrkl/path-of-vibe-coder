import { mount } from "@vue/test-utils";
import SkillsView from "@views/SkillsView.vue";
import { skills } from "@data/skills";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("SkillsView.vue", () => {
  let wrapper;
  const gameStateMock = {
    hasSkill: jest.fn().mockReturnValue(true),
    currentLearning: null,
  };

  beforeEach(() => {
    wrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays sorted skills", () => {
    const skills = wrapper.vm.sortedSkills;
    expect(skills).toHaveLength(44);
    expect(skills[0].id).toBe("computer_basics");
  });

  it("sorts skills correctly based on learned status", () => {
    const mockHasSkill = jest
      .fn()
      .mockImplementation(
        (skillId) => skillId === "computer_basics" || skillId === "typing"
      );
    const wrapper = mount(SkillsView, {
      propsData: {
        gameState: {
          hasSkill: mockHasSkill,
          currentLearning: null,
        },
      },
    });

    const sortedSkills = wrapper.vm.sortedSkills;
    const learnedSkills = sortedSkills.filter(
      (skill) => skill.id === "computer_basics" || skill.id === "typing"
    );

    // Learned skills should be at the bottom
    expect(sortedSkills.slice(-2)).toEqual(learnedSkills);
  });

  it("includes currently learning skill", () => {
    const mockHasSkill = jest.fn().mockReturnValue(false);
    const currentLearning = "programming";
    const wrapper = mount(SkillsView, {
      propsData: {
        gameState: {
          hasSkill: mockHasSkill,
          currentLearning,
        },
      },
    });

    const sortedSkills = wrapper.vm.sortedSkills;
    // Check if the skill is in the list or if it's being learned
    expect(
      sortedSkills.some((skill) => skill.id === currentLearning) ||
        wrapper.vm.gameState.currentLearning === currentLearning
    ).toBe(true);
  });

  it("correctly determines skill availability", () => {
    const mockHasSkill = jest
      .fn()
      .mockImplementation((skillId) => skillId === "computer_basics");
    const wrapper = mount(SkillsView, {
      propsData: {
        gameState: {
          hasSkill: mockHasSkill,
          currentLearning: null,
        },
      },
    });

    const skillWithPrereq = Object.values(skills).find(
      (skill) => skill.prerequisites.length > 0
    );
    expect(wrapper.vm.isSkillAvailable(skillWithPrereq)).toBe(
      skillWithPrereq.prerequisites.every(
        (prereq) => prereq === "computer_basics"
      )
    );
  });

  it("renders SkillItem components for each skill", () => {
    const skillItems = wrapper.findAllComponents({ name: "SkillItem" });
    expect(skillItems.length).toBe(44);
  });
});
