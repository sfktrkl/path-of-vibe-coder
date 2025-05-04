import { mount } from "@vue/test-utils";
import SkillsView from "@views/SkillsView.vue";
import { skills } from "@data/skills";
import SkillItem from "@items/SkillItem.vue";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("SkillsView.vue", () => {
  let wrapper;
  const gameStateMock = {
    hasSkill: jest.fn().mockReturnValue(false),
    getCurrentLearning: jest.fn().mockReturnValue(null),
    getCurrentLearningProgress: jest.fn().mockReturnValue(0),
    isSkillAvailable: jest.fn().mockReturnValue(false),
    getAIPathUnlocked: jest.fn().mockReturnValue(false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    gameStateMock.hasSkill.mockReturnValue(false);
    gameStateMock.getCurrentLearningProgress.mockReturnValue(0);
    gameStateMock.isSkillAvailable.mockReturnValue(false);
    gameStateMock.getAIPathUnlocked.mockReturnValue(false);

    wrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays basic skills without prerequisites when AI path is not unlocked", () => {
    const basicSkills = Object.values(skills).filter(
      (skill) => skill.prerequisites.length === 0
    );

    // Mock isSkillAvailable to return true for basic skills
    gameStateMock.isSkillAvailable.mockImplementation((skillId) => {
      const skill = skills[skillId];
      return skill.prerequisites.length === 0;
    });

    const newWrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });

    const skillItems = newWrapper.findAllComponents(SkillItem);

    // Should only show available skills without prerequisites
    expect(skillItems.length).toBe(basicSkills.length);
    basicSkills.forEach((skill) => {
      expect(
        skillItems.some((item) => item.props("skill").id === skill.id)
      ).toBe(true);
    });
  });

  it("only displays available AI path skills when AI path is unlocked", () => {
    // Mock AI path as unlocked
    gameStateMock.getAIPathUnlocked.mockReturnValue(true);

    // Mock some AI path skills as available
    const aiPathSkills = Object.values(skills).filter(
      (skill) => skill.requiresAIPath === true
    );
    const availableAiSkills = aiPathSkills.slice(0, 2);

    gameStateMock.isSkillAvailable.mockImplementation((skillId) => {
      return availableAiSkills.some((skill) => skill.id === skillId);
    });

    const newWrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });

    const skillItems = newWrapper.findAllComponents(SkillItem);

    // Should only show available AI path skills
    expect(skillItems.length).toBe(availableAiSkills.length);
    availableAiSkills.forEach((skill) => {
      expect(
        skillItems.some((item) => item.props("skill").id === skill.id)
      ).toBe(true);
    });
  });

  it("filters skills based on prerequisites", () => {
    // Mock some basic skills as learned
    const basicSkills = Object.values(skills).filter(
      (skill) => skill.prerequisites.length === 0
    );
    const learnedBasicSkills = basicSkills.slice(0, 2);

    gameStateMock.hasSkill.mockImplementation((skillId) =>
      learnedBasicSkills.some((skill) => skill.id === skillId)
    );
    gameStateMock.isSkillAvailable.mockImplementation((skillId) => {
      const skill = skills[skillId];
      return (
        skill.prerequisites.length === 0 || // Basic skills
        skill.prerequisites.every((prereq) => gameStateMock.hasSkill(prereq))
      );
    });

    const newWrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });

    const skillItems = newWrapper.findAllComponents(SkillItem);
    // Should show basic skills plus skills with met prerequisites
    const expectedSkills = Object.values(skills).filter(
      (skill) =>
        skill.prerequisites.length === 0 || // Basic skills
        skill.prerequisites.every((prereq) => gameStateMock.hasSkill(prereq))
    );
    expect(skillItems.length).toBe(expectedSkills.length);
  });

  it("sorts skills with learned ones at the bottom", () => {
    // Mock some skills as learned
    const learnedSkills = Object.values(skills).slice(0, 3);
    gameStateMock.hasSkill.mockImplementation((skillId) =>
      learnedSkills.some((skill) => skill.id === skillId)
    );

    const newWrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });

    const sortedSkills = newWrapper.vm.sortedSkills;
    const learnedIndices = learnedSkills.map((skill) =>
      sortedSkills.findIndex((s) => s.id === skill.id)
    );

    // All learned skills should be at the end
    learnedIndices.forEach((index) => {
      expect(index).toBeGreaterThan(
        sortedSkills.length - learnedSkills.length - 1
      );
    });
  });

  it("includes currently learning skill", () => {
    const learningSkill = Object.values(skills).find(
      (skill) => skill.prerequisites.length > 0
    );
    const newWrapper = mount(SkillsView, {
      propsData: {
        gameState: {
          ...gameStateMock,
          getCurrentLearning: jest.fn().mockReturnValue(learningSkill.id),
        },
      },
    });

    // The learning skill should be in the list even if prerequisites aren't met
    expect(
      newWrapper.vm.sortedSkills.some((skill) => skill.id === learningSkill.id)
    ).toBe(true);
  });

  it("updates skill availability when prerequisites are met", async () => {
    // Start with no skills learned
    const skillWithPrereqs = Object.values(skills).find(
      (skill) => skill.prerequisites.length > 0
    );

    // Initially the skill should not be available
    let skillItems = wrapper.findAllComponents(SkillItem);
    expect(
      skillItems.some((item) => item.props("skill").id === skillWithPrereqs.id)
    ).toBe(false);

    // Mock prerequisites as learned
    gameStateMock.hasSkill.mockImplementation((skillId) =>
      skillWithPrereqs.prerequisites.includes(skillId)
    );
    gameStateMock.isSkillAvailable.mockReturnValue(true);
    await wrapper.setProps({ gameState: { ...gameStateMock } });

    // Now the skill should be available
    skillItems = wrapper.findAllComponents(SkillItem);
    expect(
      skillItems.some((item) => item.props("skill").id === skillWithPrereqs.id)
    ).toBe(true);
  });

  it("handles skills with multiple prerequisites", () => {
    const skillWithMultiplePrereqs = Object.values(skills).find(
      (skill) => skill.prerequisites.length > 1
    );

    // Mock only one prerequisite as learned
    const firstPrereq = skillWithMultiplePrereqs.prerequisites[0];
    gameStateMock.hasSkill.mockImplementation(
      (skillId) => skillId === firstPrereq
    );
    gameStateMock.isSkillAvailable.mockReturnValue(false);

    const firstWrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });

    // Skill should not be available with only one prerequisite
    let skillItems = firstWrapper.findAllComponents(SkillItem);
    expect(
      skillItems.some(
        (item) => item.props("skill").id === skillWithMultiplePrereqs.id
      )
    ).toBe(false);

    // Mock all prerequisites as learned
    gameStateMock.hasSkill.mockImplementation((skillId) =>
      skillWithMultiplePrereqs.prerequisites.includes(skillId)
    );
    gameStateMock.isSkillAvailable.mockReturnValue(true);

    const secondWrapper = mount(SkillsView, {
      propsData: { gameState: gameStateMock },
    });

    // Skill should be available with all prerequisites
    skillItems = secondWrapper.findAllComponents(SkillItem);
    expect(
      skillItems.some(
        (item) => item.props("skill").id === skillWithMultiplePrereqs.id
      )
    ).toBe(true);
  });
});
