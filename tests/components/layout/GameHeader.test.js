import { mount } from "@vue/test-utils";
import GameHeader from "@layout/GameHeader.vue";

// Mock the skills and jobs data
jest.mock("@data/skills", () => ({
  skills: {
    test_skill: { name: "Test Skill" },
  },
}));

jest.mock("@data/jobs", () => ({
  jobs: {
    test_job: { name: "Test Job" },
  },
}));

describe("GameHeader.vue", () => {
  let wrapper;
  const mockGameState = {
    money: 1000,
    currentLearning: null,
    currentJob: null,
    jobProgress: 0,
    getLearningProgress: () => 0,
    getItemEffects: () => ({
      salaryMultiplier: 1,
      learningSpeedMultiplier: 1,
      workSpeedMultiplier: 1,
      skillTimeMultiplier: 1,
      initialJobProgress: 0,
    }),
  };

  beforeEach(() => {
    wrapper = mount(GameHeader, {
      props: {
        currentView: "job",
        gameState: mockGameState,
      },
    });
  });

  test("renders header with title and money", () => {
    expect(wrapper.find("h1").text()).toBe("Path of Vibe Coder");
    expect(wrapper.find(".money").text()).toBe("$1000");
  });

  test("renders navigation buttons", () => {
    const navButtons = wrapper.findAll(".nav-button");
    expect(navButtons).toHaveLength(4);
    expect(navButtons[0].text()).toBe("Jobs");
    expect(navButtons[1].text()).toBe("Skills");
    expect(navButtons[2].text()).toBe("Shop");
    expect(navButtons[3].text()).toBe("Save/Load");
  });

  test("highlights active navigation button", () => {
    const jobButton = wrapper.find(".nav-button");
    expect(jobButton.classes()).toContain("active");
  });

  test("emits view-change event when navigation button is clicked", async () => {
    const skillsButton = wrapper.findAll(".nav-button")[1];
    await skillsButton.trigger("click");
    expect(wrapper.emitted("view-change")[0][0]).toBe("skills");
  });

  test("emits view-change event for save/load button", async () => {
    const saveLoadButton = wrapper.findAll(".nav-button")[3];
    await saveLoadButton.trigger("click");
    expect(wrapper.emitted("view-change")[0][0]).toBe("save");
  });

  test("shows learning progress bar when learning a skill", async () => {
    await wrapper.setProps({
      gameState: {
        ...mockGameState,
        currentLearning: "test_skill",
        getLearningProgress: () => 50,
      },
    });
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(1);
    expect(wrapper.text()).toContain("Learning: Test Skill");
  });

  test("shows job progress bar when working", async () => {
    await wrapper.setProps({
      gameState: {
        ...mockGameState,
        currentJob: "test_job",
        jobProgress: 75,
      },
    });
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(1);
    expect(wrapper.text()).toContain("Working: Test Job");
  });

  test("shows both progress bars when learning and working", async () => {
    await wrapper.setProps({
      gameState: {
        ...mockGameState,
        currentLearning: "test_skill",
        currentJob: "test_job",
        jobProgress: 75,
        getLearningProgress: () => 50,
      },
    });
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(1);
    expect(wrapper.text()).toContain("Learning: Test Skill");
    expect(wrapper.text()).toContain("Working: Test Job");
  });

  test("displays item effects correctly when effects exist", async () => {
    await wrapper.setProps({
      gameState: {
        ...mockGameState,
        currentJob: "test_job",
        getItemEffects: () => ({
          salaryMultiplier: 1.5,
          learningSpeedMultiplier: 1.25,
          workSpeedMultiplier: 1.1,
          skillTimeMultiplier: 0.8,
          initialJobProgress: 15,
        }),
      },
    });

    const effectsDiv = wrapper.find(".item-effects");
    expect(effectsDiv.exists()).toBe(true);

    const effectText = effectsDiv.text();
    expect(effectText).toContain("Salary Boost:+50%");
    expect(effectText).toContain("Learning Speed:+25%");
    expect(effectText).toContain("Work Speed:+10%");
    expect(effectText).toContain("Skill Time Reduction:+20%");
    expect(effectText).toContain("Job Initial Progress:+15%");
  });

  test("does not display item effects section when no effects present", async () => {
    await wrapper.setProps({
      gameState: {
        ...mockGameState,
        currentJob: "test_job",
        getItemEffects: () => null,
      },
    });

    const effectsDiv = wrapper.find(".item-effects");
    expect(effectsDiv.exists()).toBe(false);
  });

  test("does not display item effects when no current job", async () => {
    await wrapper.setProps({
      gameState: {
        ...mockGameState,
        currentJob: null,
        getItemEffects: () => ({
          salaryMultiplier: 1.5,
          learningSpeedMultiplier: 1.25,
        }),
      },
    });

    const effectsDiv = wrapper.find(".item-effects");
    expect(effectsDiv.exists()).toBe(false);
  });
});
