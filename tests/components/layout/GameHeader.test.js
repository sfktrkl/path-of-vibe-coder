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
    expect(progressBars).toHaveLength(1);
    expect(wrapper.text()).toContain("Learning: Test Skill");
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
    expect(progressBars).toHaveLength(1);
    expect(wrapper.text()).toContain("Working: Test Job");
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
    expect(progressBars).toHaveLength(1);
    expect(wrapper.text()).toContain("Learning: Test Skill");
    expect(wrapper.text()).toContain("Working: Test Job");
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
});
