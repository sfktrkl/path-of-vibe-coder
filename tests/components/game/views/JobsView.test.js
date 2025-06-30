import { mount } from "@vue/test-utils";
import JobsView from "@views/JobsView.vue";
import { jobs } from "@data/jobs";
import JobItem from "@items/JobItem.vue";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("JobsView.vue", () => {
  let wrapper;
  const gameStateMock = {
    isJobUnlocked: jest.fn().mockReturnValue(false),
    getCurrentJob: jest.fn().mockReturnValue(null),
    setCurrentJob: jest.fn(),
    getCurrentJobProgress: jest.fn().mockReturnValue(0),
    getAIPathUnlocked: jest.fn().mockReturnValue(false),
    getExistencePathUnlocked: jest.fn().mockReturnValue(false),
    isRevealLockedActive: jest.fn().mockReturnValue(false),
    isCompleteVisionActive: jest.fn().mockReturnValue(false),
    isTranscendenceFocusActive: jest.fn().mockReturnValue(false),
    hasSkill: jest.fn().mockReturnValue(false),
    isPureExistenceActive: jest.fn().mockReturnValue(false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    gameStateMock.isJobUnlocked.mockReturnValue(false);
    gameStateMock.getCurrentJob.mockReturnValue(null);
    gameStateMock.getCurrentJobProgress.mockReturnValue(0);
    gameStateMock.getAIPathUnlocked.mockReturnValue(false);
    gameStateMock.getExistencePathUnlocked.mockReturnValue(false);
    gameStateMock.isRevealLockedActive.mockReturnValue(false);
    gameStateMock.isCompleteVisionActive.mockReturnValue(false);
    gameStateMock.isTranscendenceFocusActive.mockReturnValue(false);
    gameStateMock.hasSkill.mockReturnValue(false);

    wrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays starting job when no jobs are unlocked", () => {
    const startingJob = Object.values(jobs).find(
      (job) => job.id === "everyday_normal_guy"
    );
    const jobItems = wrapper.findAllComponents(JobItem);

    expect(jobItems.length).toBe(1);
    expect(wrapper.vm.jobsByCategory[startingJob.category]).toContainEqual(
      startingJob
    );
  });

  it("displays and filters jobs based on unlock status", () => {
    // Mock specific jobs as unlocked
    const unlockedJobs = Object.values(jobs).slice(0, 3);
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) =>
        jobId === "everyday_normal_guy" ||
        unlockedJobs.some((job) => job.id === jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);
    // Should show starting job plus unlocked jobs
    expect(jobItems.length).toBe(unlockedJobs.length);

    // Verify each displayed job is either starting job or unlocked
    Object.values(newWrapper.vm.jobsByCategory)
      .flat()
      .forEach((job) => {
        expect(
          job.id === "everyday_normal_guy" ||
            gameStateMock.isJobUnlocked(job.id)
        ).toBe(true);
      });
  });

  it("displays category names with proper capitalization", () => {
    // Mock all jobs as unlocked to see all categories
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Test with some known category names
    const testCases = [
      { input: "web_development", expected: "Web Development" },
      { input: "basic", expected: "Basic" },
      { input: "vibe", expected: "Vibe" },
    ];

    testCases.forEach(({ input, expected }) => {
      const formattedName = newWrapper.vm.formatCategoryName(input);
      expect(formattedName).toBe(expected);
    });
  });

  it("hides categories that have no available jobs", () => {
    // Mock only one job in one category as unlocked
    const jobInCategory = Object.values(jobs).find(
      (job) => job.category !== "basic" && job.id !== "everyday_normal_guy"
    );
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) => jobId === "everyday_normal_guy" || jobId === jobInCategory.id
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const categories = Object.keys(newWrapper.vm.jobsByCategory);
    // Should only show the starting job category and the category with the unlocked job
    expect(categories).toContain("basic"); // Starting job category
    expect(categories).toContain(jobInCategory.category);
    expect(categories.length).toBe(2);
  });

  it("updates displayed jobs when unlock status changes", async () => {
    // Initially only starting job
    expect(wrapper.findAllComponents(JobItem).length).toBe(1);

    // Mock all jobs as becoming unlocked
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    await wrapper.setProps({
      gameState: { ...gameStateMock },
    });

    // Should now show all jobs that would be displayed by jobsByCategory
    const expectedJobCount = Object.values(wrapper.vm.jobsByCategory).flat()
      .length;
    expect(wrapper.findAllComponents(JobItem).length).toBe(expectedJobCount);
  });

  it("groups jobs by their respective categories", () => {
    // Mock jobs from different categories as unlocked
    const unlockedJobs = Object.values(jobs).slice(0, 3);
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) =>
        jobId === "everyday_normal_guy" ||
        unlockedJobs.some((job) => job.id === jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Get unique categories from unlocked jobs plus starting job
    const expectedCategories = [
      "basic", // Starting job category
      ...new Set(unlockedJobs.map((job) => job.category)),
    ];

    // Verify all expected categories are displayed
    expectedCategories.forEach((category) => {
      expect(Object.keys(newWrapper.vm.jobsByCategory)).toContain(category);
    });

    // Verify jobs are in their correct categories
    Object.entries(newWrapper.vm.jobsByCategory).forEach(
      ([category, jobList]) => {
        jobList.forEach((job) => {
          expect(job.category).toBe(category);
        });
      }
    );
  });

  it("displays all jobs when revealLocked feature is active", () => {
    // Mock revealLocked as active
    gameStateMock.isRevealLockedActive.mockReturnValue(true);

    // Mock all jobs as locked (except starting job)
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) => jobId === "everyday_normal_guy"
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);

    // Should show all jobs when revealLocked is active, regardless of unlock status
    expect(jobItems.length).toBe(Object.keys(jobs).length);

    // Verify all jobs are displayed
    Object.values(jobs).forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
  });

  it("displays locked jobs with requirements when revealLocked is active", () => {
    // Mock revealLocked as active
    gameStateMock.isRevealLockedActive.mockReturnValue(true);

    // Mock some skills as learned to test requirement display
    const learnedSkills = Object.values(jobs)
      .slice(0, 2)
      .map((job) => job.requiredSkills?.[0])
      .filter(Boolean);
    gameStateMock.hasSkill.mockImplementation((skillId) =>
      learnedSkills.includes(skillId)
    );

    // Mock all jobs as locked (except starting job)
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) => jobId === "everyday_normal_guy"
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);

    // Should show all jobs
    expect(jobItems.length).toBe(Object.keys(jobs).length);

    // Check that jobs with requirements show them
    const jobsWithRequirements = Object.values(jobs).filter(
      (job) => job.requiredSkills?.length > 0 || job.requiredJobs?.length > 0
    );

    jobsWithRequirements.forEach((job) => {
      const jobItem = jobItems.find((item) => item.props("job").id === job.id);
      expect(jobItem.exists()).toBe(true);

      // The job should be marked as locked
      expect(jobItem.props("job")).toEqual(job);
    });
  });

  it("shows AI path and existence path jobs when revealLocked is active, even if paths are locked", () => {
    // Mock revealLocked as active but paths as locked
    gameStateMock.isRevealLockedActive.mockReturnValue(true);
    gameStateMock.getAIPathUnlocked.mockReturnValue(false);
    gameStateMock.getExistencePathUnlocked.mockReturnValue(false);

    // Mock all jobs as locked (except starting job)
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) => jobId === "everyday_normal_guy"
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);

    // Should show all jobs including AI path and existence path jobs
    expect(jobItems.length).toBe(Object.keys(jobs).length);

    // Verify AI path jobs are shown
    const aiPathJobs = Object.values(jobs).filter(
      (job) => job.requiresAIPath === true
    );
    aiPathJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });

    // Verify existence path jobs are shown
    const existenceJobs = Object.values(jobs).filter(
      (job) => job.category === "existence"
    );
    existenceJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
  });

  it("shows only AI path jobs and senior/architect jobs in vibe category when AI path is unlocked", () => {
    // Mock AI path as unlocked
    gameStateMock.getAIPathUnlocked.mockReturnValue(true);

    // Mock specific jobs as unlocked
    const webArchitect = Object.values(jobs).find(
      (job) => job.id === "web_architect"
    );
    const seniorWebDev = Object.values(jobs).find(
      (job) => job.id === "senior_web_dev"
    );
    const vibeArchitect = Object.values(jobs).find(
      (job) => job.id === "vibe_architect"
    );
    const startingJob = Object.values(jobs).find(
      (job) => job.id === "everyday_normal_guy"
    );

    // Set senior job as current to test the case where both senior and architect jobs are shown
    gameStateMock.getCurrentJob.mockReturnValue(seniorWebDev.id);

    gameStateMock.isJobUnlocked.mockImplementation((jobId) =>
      [
        webArchitect.id,
        seniorWebDev.id,
        vibeArchitect.id,
        startingJob.id,
      ].includes(jobId)
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Get all displayed jobs
    const displayedJobs = Object.values(newWrapper.vm.jobsByCategory).flat();

    // Verify each displayed job is in the correct category
    displayedJobs.forEach((job) => {
      if (job.id === "everyday_normal_guy") {
        expect(newWrapper.vm.jobsByCategory["basic"]).toContainEqual(job);
      } else if (job.requiresAIPath) {
        // AI path jobs should stay in their original categories
        expect(newWrapper.vm.jobsByCategory[job.category]).toContainEqual(job);
      } else if (job.id.includes("_architect") || job.id.includes("senior_")) {
        // Non-AI path architect and senior jobs should be in vibe category
        expect(newWrapper.vm.jobsByCategory["vibe"]).toContainEqual(job);
      }
    });

    // Verify vibe category contains both senior and architect jobs when senior is selected
    const vibeJobs = newWrapper.vm.jobsByCategory["vibe"] || [];
    expect(vibeJobs).toContainEqual(webArchitect);
    expect(vibeJobs).toContainEqual(seniorWebDev);

    // Verify vibe_architect is in its original category (vibe)
    expect(newWrapper.vm.jobsByCategory["vibe"]).toContainEqual(vibeArchitect);
  });

  it("shows both senior and architect jobs when senior job is selected when AI path is unlocked", () => {
    // Mock AI path as unlocked
    gameStateMock.getAIPathUnlocked.mockReturnValue(true);

    // Get specific jobs from the data
    const seniorWebDev = Object.values(jobs).find(
      (job) => job.id === "senior_web_dev"
    );
    const webArchitect = Object.values(jobs).find(
      (job) => job.id === "web_architect"
    );
    const startingJob = Object.values(jobs).find(
      (job) => job.id === "everyday_normal_guy"
    );

    // Mock these jobs as unlocked and set senior job as current
    gameStateMock.isJobUnlocked.mockImplementation((jobId) =>
      [seniorWebDev.id, webArchitect.id, startingJob.id].includes(jobId)
    );
    gameStateMock.getCurrentJob.mockReturnValue(seniorWebDev.id);

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Verify both jobs are in vibe category
    const vibeJobs = newWrapper.vm.jobsByCategory["vibe"] || [];
    expect(vibeJobs).toContainEqual(seniorWebDev);
    expect(vibeJobs).toContainEqual(webArchitect);
  });

  it("does not display existence jobs without AI path and existence path", () => {
    // Mock all jobs as unlocked, but both paths locked
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    gameStateMock.getAIPathUnlocked.mockReturnValue(false);
    gameStateMock.getExistencePathUnlocked.mockReturnValue(false);
    gameStateMock.isRevealLockedActive.mockReturnValue(false);

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Existence jobs should not be displayed
    const displayedJobs = Object.values(newWrapper.vm.jobsByCategory).flat();
    const existenceJobs = Object.values(jobs).filter(
      (j) => j.category === "existence"
    );
    existenceJobs.forEach((job) => {
      expect(displayedJobs).not.toContainEqual(job);
    });
  });

  it("shows both AI path and existence path jobs if both are unlocked", () => {
    // Mock all jobs as unlocked, both paths unlocked
    gameStateMock.isJobUnlocked.mockReturnValue(true);
    gameStateMock.getAIPathUnlocked.mockReturnValue(true);
    gameStateMock.getExistencePathUnlocked.mockReturnValue(true);

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    // Both AI path and existence jobs should be displayed
    const displayedJobs = Object.values(newWrapper.vm.jobsByCategory).flat();
    const aiJobs = Object.values(jobs).filter((j) => j.requiresAIPath);
    const existenceJobs = Object.values(jobs).filter(
      (j) => j.category === "existence"
    );
    aiJobs.forEach((job) => {
      expect(displayedJobs).toContainEqual(job);
    });
    existenceJobs.forEach((job) => {
      expect(displayedJobs).toContainEqual(job);
    });
  });

  it("shows all jobs when completeVision is active, overriding any other conditions", () => {
    // Mock completeVision as active but all other conditions as locked
    gameStateMock.isCompleteVisionActive.mockReturnValue(true);
    gameStateMock.isRevealLockedActive.mockReturnValue(false);
    gameStateMock.getAIPathUnlocked.mockReturnValue(false);
    gameStateMock.getExistencePathUnlocked.mockReturnValue(false);

    // Mock all jobs as locked (except starting job)
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) => jobId === "everyday_normal_guy"
    );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);

    // Should show ALL jobs regardless of any conditions
    expect(jobItems.length).toBe(Object.keys(jobs).length);

    // Verify all jobs are shown, including AI path, existence path, and regular jobs
    Object.values(jobs).forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
  });

  it("shows only jobs with transcendenceFocus ability when transcendence focus is active, regardless of other features", () => {
    // Mock transcendence focus as active
    gameStateMock.isTranscendenceFocusActive = jest.fn().mockReturnValue(true);
    gameStateMock.isCompleteVisionActive.mockReturnValue(true);
    gameStateMock.isRevealLockedActive.mockReturnValue(true);
    // All jobs are locked except starting job
    // gameStateMock.isJobUnlocked.mockImplementation(
    //   (jobId) => jobId === "everyday_normal_guy"
    // );

    const newWrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });

    const jobItems = newWrapper.findAllComponents(JobItem);
    // Only jobs with transcendenceFocus ability and the starting job should be shown
    const expectedJobs = Object.values(jobs).filter(
      (job) =>
        job.abilities?.transcendenceFocus === true ||
        job.id === "everyday_normal_guy"
    );
    expect(jobItems.length).toBe(expectedJobs.length);
    expectedJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
    // No other jobs should be shown
    jobItems.forEach((item) => {
      const job = item.props("job");
      expect(
        job.abilities?.transcendenceFocus === true ||
          job.id === "everyday_normal_guy"
      ).toBe(true);
    });
  });
});

describe("JobsView.vue feature combinations (transcendence, complete vision, reveal locked)", () => {
  const gameStateMock = {
    isJobUnlocked: jest.fn().mockReturnValue(false),
    getCurrentJob: jest.fn().mockReturnValue(null),
    setCurrentJob: jest.fn(),
    getCurrentJobProgress: jest.fn().mockReturnValue(0),
    getAIPathUnlocked: jest.fn().mockReturnValue(false),
    getExistencePathUnlocked: jest.fn().mockReturnValue(false),
    isRevealLockedActive: jest.fn().mockReturnValue(false),
    isCompleteVisionActive: jest.fn().mockReturnValue(false),
    isTranscendenceFocusActive: jest.fn().mockReturnValue(false),
    hasSkill: jest.fn().mockReturnValue(false),
    isPureExistenceActive: jest.fn().mockReturnValue(false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    gameStateMock.isJobUnlocked.mockReturnValue(false);
    gameStateMock.getCurrentJob.mockReturnValue(null);
    gameStateMock.getCurrentJobProgress.mockReturnValue(0);
    gameStateMock.getAIPathUnlocked.mockReturnValue(false);
    gameStateMock.getExistencePathUnlocked.mockReturnValue(false);
    gameStateMock.isRevealLockedActive.mockReturnValue(false);
    gameStateMock.isCompleteVisionActive.mockReturnValue(false);
    gameStateMock.isTranscendenceFocusActive.mockReturnValue(false);
    gameStateMock.hasSkill.mockReturnValue(false);
  });

  const allJobs = Object.values(jobs);
  const startingJob = allJobs.find((job) => job.id === "everyday_normal_guy");
  const transcendenceJobs = allJobs.filter(
    (job) => job.abilities?.transcendenceFocus === true
  );
  // Use a realistic set of unlocked jobs (basic category jobs that don't require AI path)
  const unlockedJobs = allJobs
    .filter(
      (job) =>
        job.category === "basic" &&
        !job.requiresAIPath &&
        job.id !== startingJob.id
    )
    .slice(0, 2); // Take first 2 basic jobs

  function mountWithFeatures({
    transcendence = false,
    completeVision = false,
    revealLocked = false,
    unlocked = unlockedJobs.map((j) => j.id),
  }) {
    gameStateMock.isTranscendenceFocusActive.mockReturnValue(transcendence);
    gameStateMock.isCompleteVisionActive.mockReturnValue(completeVision);
    gameStateMock.isRevealLockedActive.mockReturnValue(revealLocked);
    gameStateMock.isJobUnlocked.mockImplementation(
      (jobId) => jobId === startingJob.id || unlocked.includes(jobId)
    );
    return mount(JobsView, { propsData: { gameState: gameStateMock } });
  }

  it("shows only unlocked jobs and starting job when no features are active", () => {
    const wrapper = mountWithFeatures({});
    const jobItems = wrapper.findAllComponents(JobItem);
    const expectedJobs = [startingJob, ...unlockedJobs];

    // Check that we have the expected number of jobs
    expect(jobItems.length).toBe(expectedJobs.length);

    // Check that each expected job is present
    expectedJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });

    // Check that no unexpected jobs are present
    jobItems.forEach((item) => {
      const job = item.props("job");
      expect(expectedJobs.some((expected) => expected.id === job.id)).toBe(
        true
      );
    });
  });

  it("shows all jobs and starting job when only revealLocked is active", () => {
    const wrapper = mountWithFeatures({ revealLocked: true });
    const jobItems = wrapper.findAllComponents(JobItem);
    const expectedJobs = allJobs;
    expect(jobItems.length).toBe(expectedJobs.length);
    expectedJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
  });

  it("shows all jobs and starting job when only completeVision is active", () => {
    const wrapper = mountWithFeatures({ completeVision: true });
    const jobItems = wrapper.findAllComponents(JobItem);
    const expectedJobs = allJobs;
    expect(jobItems.length).toBe(expectedJobs.length);
    expectedJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
  });

  it("shows all jobs and starting job when both completeVision and revealLocked are active", () => {
    const wrapper = mountWithFeatures({
      completeVision: true,
      revealLocked: true,
    });
    const jobItems = wrapper.findAllComponents(JobItem);
    const expectedJobs = allJobs;
    expect(jobItems.length).toBe(expectedJobs.length);
    expectedJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
  });

  it("shows only transcendence jobs and starting job when only transcendenceFocus is active", () => {
    const wrapper = mountWithFeatures({ transcendence: true });
    const jobItems = wrapper.findAllComponents(JobItem);
    const expectedJobs = [startingJob, ...transcendenceJobs];
    expect(jobItems.length).toBe(expectedJobs.length);
    expectedJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
    // No other jobs should be shown
    jobItems.forEach((item) => {
      const job = item.props("job");
      expect(
        job.abilities?.transcendenceFocus === true || job.id === startingJob.id
      ).toBe(true);
    });
  });

  it("shows only transcendence jobs and starting job when all features are active", () => {
    const wrapper = mountWithFeatures({
      transcendence: true,
      completeVision: true,
      revealLocked: true,
    });
    const jobItems = wrapper.findAllComponents(JobItem);
    const expectedJobs = [startingJob, ...transcendenceJobs];
    expect(jobItems.length).toBe(expectedJobs.length);
    expectedJobs.forEach((job) => {
      expect(jobItems.some((item) => item.props("job").id === job.id)).toBe(
        true
      );
    });
    // No other jobs should be shown
    jobItems.forEach((item) => {
      const job = item.props("job");
      expect(
        job.abilities?.transcendenceFocus === true || job.id === startingJob.id
      ).toBe(true);
    });
  });
});
