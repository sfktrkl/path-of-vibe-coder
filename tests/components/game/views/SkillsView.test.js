import { mount } from "@vue/test-utils";
import SkillsView from "@views/SkillsView.vue";

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
});
