import { mount } from "@vue/test-utils";
import GameHeader from "@/components/layout/GameHeader.vue";

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
    title: "Test Game",
    money: 1000,
    currentLearning: null,
    currentJob: null,
    jobProgress: 0,
    getLearningProgress: () => 0,
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
    expect(wrapper.find("h1").text()).toBe("Test Game");
    expect(wrapper.find(".money").text()).toBe("$1000");
  });

  test("renders navigation buttons", () => {
    const navButtons = wrapper.findAll(".nav-button");
    expect(navButtons).toHaveLength(3);
    expect(navButtons[0].text()).toBe("Jobs");
    expect(navButtons[1].text()).toBe("Skills");
    expect(navButtons[2].text()).toBe("Shop");
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
});
