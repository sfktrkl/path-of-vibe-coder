import { mount } from "@vue/test-utils";
import ProgressBar from "@items/ProgressBar.vue";

describe("ProgressBar", () => {
  const createWrapper = (propsData = {}) => {
    return mount(ProgressBar, {
      props: {
        label: "Test Progress",
        progress: 50,
        type: "learning",
        ...propsData,
      },
    });
  };

  it("renders label correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".progress-info span").text()).toBe("Test Progress");
  });

  it("displays correct progress width", () => {
    const wrapper = createWrapper({ progress: 75 });
    const progressBar = wrapper.find(".progress");
    expect(progressBar.attributes("style")).toContain("width: 75%");
  });

  it("applies correct class for job type", () => {
    const wrapper = createWrapper({ type: "job" });
    expect(wrapper.find(".progress").classes()).toContain("job-progress");
  });

  it("applies default learning class when type is learning", () => {
    const wrapper = createWrapper({ type: "learning" });
    expect(wrapper.find(".progress").classes()).not.toContain("job-progress");
  });

  it("validates type prop correctly", () => {
    const wrapper = createWrapper({});
    expect(wrapper.vm.$options.props.type.validator("invalid")).toBe(false);
    expect(wrapper.vm.$options.props.type.validator("learning")).toBe(true);
    expect(wrapper.vm.$options.props.type.validator("job")).toBe(true);
  });

  it("applies glowing class when story type is complete and at 100% progress", () => {
    const wrapper = createWrapper({
      type: "story",
      isComplete: true,
      progress: 100,
    });
    expect(wrapper.find(".progress-container").classes()).toContain("glowing");
  });

  it("does not apply glowing class when story type is complete but not at 100% progress", () => {
    const wrapper = createWrapper({
      type: "story",
      isComplete: true,
      progress: 99,
    });
    expect(wrapper.find(".progress-container").classes()).not.toContain(
      "glowing"
    );
  });

  it("does not apply glowing class when story type is not complete", () => {
    const wrapper = createWrapper({
      type: "story",
      isComplete: false,
      progress: 100,
    });
    expect(wrapper.find(".progress-container").classes()).not.toContain(
      "glowing"
    );
  });

  it("does not apply glowing class for non-story types even when complete and at 100%", () => {
    const wrapper = createWrapper({
      type: "learning",
      isComplete: true,
      progress: 100,
    });
    expect(wrapper.find(".progress-container").classes()).not.toContain(
      "glowing"
    );
  });

  it("emits story-complete-click when story progress is clicked and complete", async () => {
    const wrapper = createWrapper({
      type: "story",
      isComplete: true,
    });
    await wrapper.find(".progress-container").trigger("click");
    expect(wrapper.emitted("story-complete-click")).toBeTruthy();
  });

  it("does not emit story-complete-click when story progress is clicked but not complete", async () => {
    const wrapper = createWrapper({
      type: "story",
      isComplete: false,
    });
    await wrapper.find(".progress-container").trigger("click");
    expect(wrapper.emitted("story-complete-click")).toBeFalsy();
  });

  it("applies story-progress class for story type", () => {
    const wrapper = createWrapper({ type: "story" });
    expect(wrapper.find(".progress").classes()).toContain("story-progress");
  });

  it("validates isComplete prop type", () => {
    const wrapper = createWrapper({});
    expect(wrapper.vm.$options.props.isComplete.type).toBe(Boolean);
  });

  describe("Hover behavior", () => {
    it("shows hover label only for story type at 100% progress and complete", async () => {
      const wrapper = createWrapper({
        type: "story",
        progress: 100,
        isComplete: true,
        label: "Normal Label",
        hoverLabel: "Hover Label",
      });

      // Initially shows normal label
      expect(wrapper.find(".label").text()).toBe("Normal Label");

      // On hover, shows hover label
      await wrapper.trigger("mouseenter");
      expect(wrapper.find(".label").text()).toBe("Hover Label");

      // On mouse leave, shows normal label again
      await wrapper.trigger("mouseleave");
      expect(wrapper.find(".label").text()).toBe("Normal Label");
    });

    it("does not show hover label for story type at 100% progress but not complete", async () => {
      const wrapper = createWrapper({
        type: "story",
        progress: 100,
        isComplete: false,
        label: "Normal Label",
        hoverLabel: "Hover Label",
      });

      await wrapper.trigger("mouseenter");
      expect(wrapper.find(".label").text()).toBe("Normal Label");
    });

    it("does not show hover label for story type below 100% progress even when complete", async () => {
      const wrapper = createWrapper({
        type: "story",
        progress: 99,
        isComplete: true,
        label: "Normal Label",
        hoverLabel: "Hover Label",
      });

      await wrapper.trigger("mouseenter");
      expect(wrapper.find(".label").text()).toBe("Normal Label");
    });

    it("does not show hover label for non-story types even at 100% progress and complete", async () => {
      const wrapper = createWrapper({
        type: "job",
        progress: 100,
        isComplete: true,
        label: "Normal Label",
        hoverLabel: "Hover Label",
      });

      await wrapper.trigger("mouseenter");
      expect(wrapper.find(".label").text()).toBe("Normal Label");
    });

    it("validates hoverLabel prop type", () => {
      const wrapper = createWrapper({});
      expect(wrapper.vm.$options.props.hoverLabel.type).toBe(String);
    });
  });
});
