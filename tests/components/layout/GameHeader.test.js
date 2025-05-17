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
    influence_job: {
      name: "Influence Job",
      influenceGain: 5,
      id: "influence_job",
    },
    no_influence_job: {
      name: "No Influence Job",
      id: "no_influence_job",
    },
  },
}));

describe("GameHeader.vue", () => {
  let wrapper;
  const mockGameState = {
    getMoney: () => 1000,
    getInfluence: () => 50,
    getCurrentLearning: () => null,
    getCurrentJob: () => null,
    getCurrentJobProgress: () => 0,
    getCurrentLearningProgress: () => 0,
    isJobUnlocked: (jobId) => jobId === "influence_job",
    getItemEffects: () => ({
      salaryBoost: 1,
      learningSpeed: 1,
      workSpeed: 1,
      skillTimeReduction: 1,
      jobInitialProgress: 0,
    }),
    getCurrentStoryStage: () => ({
      message: "Sometimes I feel bored... there must be more...",
      influenceRequired: 1000,
    }),
    getStoryProgressPercentage: () => 5,
    checkExistencePathUnlock: () => false,
    getExistencePathUnlocked: () => false,
    getAIPathUnlocked: () => false,
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
    const learningGameState = {
      ...mockGameState,
      getCurrentLearning: () => "test_skill",
      getCurrentLearningProgress: () => 50,
    };
    await wrapper.setProps({
      gameState: learningGameState,
    });
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(2);
    expect(wrapper.text()).toContain("Learning: Test Skill");
    expect(wrapper.text()).toContain(
      "Sometimes I feel bored... there must be more..."
    );
  });

  test("shows job progress bar when working", async () => {
    const workingGameState = {
      ...mockGameState,
      getCurrentJob: () => "test_job",
      getCurrentJobProgress: () => 75,
    };
    await wrapper.setProps({
      gameState: workingGameState,
    });
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(2);
    expect(wrapper.text()).toContain("Working: Test Job");
    expect(wrapper.text()).toContain(
      "Sometimes I feel bored... there must be more..."
    );
  });

  test("shows both progress bars when learning and working", async () => {
    const bothGameState = {
      ...mockGameState,
      getCurrentLearning: () => "test_skill",
      getCurrentJob: () => "test_job",
      getCurrentJobProgress: () => 75,
      getCurrentLearningProgress: () => 50,
    };
    await wrapper.setProps({
      gameState: bothGameState,
    });
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(2);
    expect(wrapper.text()).toContain("Learning: Test Skill");
    expect(wrapper.text()).toContain("Working: Test Job");
    expect(wrapper.text()).toContain(
      "Sometimes I feel bored... there must be more..."
    );
  });

  test("shows story progress bar when influence conditions are met", () => {
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(1);
    expect(wrapper.text()).toContain(
      "Sometimes I feel bored... there must be more..."
    );
  });

  test("hides story progress bar when influence conditions are not met", async () => {
    const noInfluenceGameState = {
      ...mockGameState,
      getInfluence: () => 0,
      isJobUnlocked: () => false,
    };
    await wrapper.setProps({
      gameState: noInfluenceGameState,
    });
    const progressBars = wrapper.findAll(".progress-bars");
    expect(progressBars).toHaveLength(0);
  });

  test("displays item effects correctly when effects exist", async () => {
    const effectsGameState = {
      ...mockGameState,
      getCurrentJob: () => "test_job",
      getItemEffects: () => ({
        salaryBoost: 1.5,
        learningSpeed: 1.25,
        workSpeed: 1.1,
        skillTimeReduction: 0.8,
        jobInitialProgress: 15,
      }),
    };
    await wrapper.setProps({
      gameState: effectsGameState,
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
    const noEffectsGameState = {
      ...mockGameState,
      getCurrentJob: () => "test_job",
      getItemEffects: () => null,
    };
    await wrapper.setProps({
      gameState: noEffectsGameState,
    });

    const effectsDiv = wrapper.find(".item-effects");
    expect(effectsDiv.exists()).toBe(false);
  });

  test("does not display item effects when no current job", async () => {
    const noJobGameState = {
      ...mockGameState,
      getCurrentJob: () => null,
      getItemEffects: () => ({
        salaryBoost: 1.5,
        learningSpeed: 1.25,
      }),
    };
    await wrapper.setProps({
      gameState: noJobGameState,
    });

    const effectsDiv = wrapper.find(".item-effects");
    expect(effectsDiv.exists()).toBe(false);
  });

  describe("Money and Influence Display", () => {
    test("displays money correctly", () => {
      expect(wrapper.find(".money").text()).toBe("$1000");
    });

    test("displays money with different amounts", async () => {
      const richGameState = {
        ...mockGameState,
        getMoney: () => 1000000,
      };
      await wrapper.setProps({
        gameState: richGameState,
      });
      expect(wrapper.find(".money").text()).toBe("$1000000");
    });

    test("shows influence when influence-gaining job is unlocked", () => {
      expect(wrapper.find(".influence").exists()).toBe(true);
      expect(wrapper.find(".influence").text()).toBe("⚡50");
    });

    test("hides influence when no influence-gaining jobs are unlocked", async () => {
      const noInfluenceGameState = {
        ...mockGameState,
        getInfluence: () => 0,
        isJobUnlocked: () => false,
      };
      await wrapper.setProps({
        gameState: noInfluenceGameState,
      });
      expect(wrapper.find(".influence").exists()).toBe(false);
    });

    test("shows influence even when value is 0 if influence-gaining job is unlocked", async () => {
      const zeroInfluenceGameState = {
        ...mockGameState,
        getInfluence: () => 0,
        isJobUnlocked: (jobId) => jobId === "influence_job",
      };
      await wrapper.setProps({
        gameState: zeroInfluenceGameState,
      });
      expect(wrapper.find(".influence").exists()).toBe(true);
      expect(wrapper.find(".influence").text()).toBe("⚡0");
    });

    test("hides influence when only non-influence-gaining jobs are unlocked", async () => {
      const noInfluenceJobsGameState = {
        ...mockGameState,
        getInfluence: () => 0,
        isJobUnlocked: (jobId) => jobId === "no_influence_job",
      };
      await wrapper.setProps({
        gameState: noInfluenceJobsGameState,
      });
      expect(wrapper.find(".influence").exists()).toBe(false);
    });

    test("displays influence with different amounts when influence-gaining job is unlocked", async () => {
      const highInfluenceGameState = {
        ...mockGameState,
        getInfluence: () => 1000,
        isJobUnlocked: (jobId) => jobId === "influence_job",
      };
      await wrapper.setProps({
        gameState: highInfluenceGameState,
      });
      expect(wrapper.find(".influence").exists()).toBe(true);
      expect(wrapper.find(".influence").text()).toBe("⚡1000");
    });

    test("shows influence if either condition is met (influence-gaining jobs OR influence > 0)", async () => {
      // Case 1: Has influence-gaining job but zero influence
      const case1GameState = {
        ...mockGameState,
        getInfluence: () => 0,
        isJobUnlocked: (jobId) => jobId === "influence_job",
      };
      await wrapper.setProps({
        gameState: case1GameState,
      });
      expect(wrapper.find(".influence").exists()).toBe(true);
      expect(wrapper.find(".influence").text()).toBe("⚡0");

      // Case 2: No influence-gaining jobs but has influence
      const case2GameState = {
        ...mockGameState,
        getInfluence: () => 50,
        isJobUnlocked: () => false,
      };
      await wrapper.setProps({
        gameState: case2GameState,
      });
      expect(wrapper.find(".influence").exists()).toBe(true);
      expect(wrapper.find(".influence").text()).toBe("⚡50");
    });
  });

  describe("Story Progress and Existence Path", () => {
    const createStoryGameState = (overrides = {}) => ({
      ...mockGameState,
      getInfluence: () => 1000, // Max influence
      getAIPathUnlocked: () => true,
      getExistencePathUnlocked: () => false,
      getCurrentStoryStage: () => ({
        message: "Sometimes I feel bored... there must be more...",
        influenceRequired: 1000,
      }),
      getStoryProgressPercentage: () => 100,
      checkExistencePathUnlock: jest.fn(() => true),
      unlockExistencePath: jest.fn(),
      ...overrides,
    });

    test("shows story progress bar with correct hover label when story is complete", async () => {
      const storyGameState = createStoryGameState();
      await wrapper.setProps({
        gameState: storyGameState,
      });

      const progressBar = wrapper.findComponent({ name: "ProgressBar" });
      expect(progressBar.exists()).toBe(true);
      expect(progressBar.props("type")).toBe("story");
      expect(progressBar.props("isComplete")).toBe(true);
      expect(progressBar.props("label")).toBe(
        "Sometimes I feel bored... there must be more..."
      );
      expect(progressBar.props("hoverLabel")).toBe("Transcend into existence");
    });

    test("shows story message as label when story is not complete", async () => {
      const gameState = createStoryGameState({
        getStoryProgressPercentage: () => 50,
        checkExistencePathUnlock: () => false,
        getCurrentStoryStage: () => ({
          message: "Sometimes I feel bored... there must be more...",
          influenceRequired: 1000,
        }),
      });
      wrapper = mount(GameHeader, {
        props: { currentView: "job", gameState },
      });
      const progressBar = wrapper.findComponent({ name: "ProgressBar" });
      expect(progressBar.props("isComplete")).toBe(false);
      expect(progressBar.props("label")).toBe(
        "Sometimes I feel bored... there must be more..."
      );
      expect(progressBar.props("hoverLabel")).toBe("");
    });

    test("shows glowing effect only when story is complete and at 100% progress", async () => {
      const storyGameState = createStoryGameState({
        getStoryProgressPercentage: () => 100,
        checkExistencePathUnlock: () => true,
      });
      await wrapper.setProps({
        gameState: storyGameState,
      });

      const progressBar = wrapper.findComponent({ name: "ProgressBar" });
      expect(progressBar.props("isComplete")).toBe(true);
      expect(progressBar.props("progress")).toBe(100);
      expect(progressBar.classes()).toContain("glowing");
    });

    test("does not show glowing effect when story is complete but not at 100% progress", async () => {
      const storyGameState = createStoryGameState({
        getStoryProgressPercentage: () => 99,
        checkExistencePathUnlock: () => true,
      });
      await wrapper.setProps({
        gameState: storyGameState,
      });

      const progressBar = wrapper.findComponent({ name: "ProgressBar" });
      expect(progressBar.props("isComplete")).toBe(true);
      expect(progressBar.props("progress")).toBe(99);
      expect(progressBar.classes()).not.toContain("glowing");
    });

    test("does not show glowing effect when story is not complete", async () => {
      const gameState = createStoryGameState({
        getStoryProgressPercentage: () => 100,
        checkExistencePathUnlock: () => false,
      });
      wrapper = mount(GameHeader, {
        props: { currentView: "job", gameState },
      });
      const progressBar = wrapper.findComponent({ name: "ProgressBar" });
      expect(progressBar.props("isComplete")).toBe(false);
      expect(progressBar.props("progress")).toBe(100);
      expect(progressBar.classes()).not.toContain("glowing");
    });

    test("does not show glowing effect when AI path is not unlocked", async () => {
      const gameState = createStoryGameState({
        getAIPathUnlocked: () => false,
        checkExistencePathUnlock: () => false,
        getStoryProgressPercentage: () => 100,
      });
      wrapper = mount(GameHeader, {
        props: { currentView: "job", gameState },
      });
      const progressBar = wrapper.findComponent({ name: "ProgressBar" });
      expect(progressBar.props("isComplete")).toBe(false);
      expect(progressBar.props("progress")).toBe(100);
      expect(progressBar.classes()).not.toContain("glowing");
    });

    test("does not show glowing effect when existence path is already unlocked", async () => {
      const gameState = createStoryGameState({
        getExistencePathUnlocked: () => true,
        checkExistencePathUnlock: () => false,
        getStoryProgressPercentage: () => 100,
      });
      wrapper = mount(GameHeader, {
        props: { currentView: "job", gameState },
      });
      const progressBar = wrapper.findComponent({ name: "ProgressBar" });
      expect(progressBar.props("isComplete")).toBe(false);
      expect(progressBar.props("progress")).toBe(100);
      expect(progressBar.classes()).not.toContain("glowing");
    });
  });
});
