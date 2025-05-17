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

  it("applies glowing class when story type is complete", () => {
    const wrapper = createWrapper({
      type: "story",
      isComplete: true,
    });
    expect(wrapper.find(".progress-container").classes()).toContain("glowing");
  });

  it("does not apply glowing class when story type is not complete", () => {
    const wrapper = createWrapper({
      type: "story",
      isComplete: false,
    });
    expect(wrapper.find(".progress-container").classes()).not.toContain(
      "glowing"
    );
  });

  it("does not apply glowing class for non-story types even when complete", () => {
    const wrapper = createWrapper({
      type: "learning",
      isComplete: true,
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

  it("displays tooltip when provided", () => {
    const tooltip = "Test tooltip";
    const wrapper = createWrapper({ tooltip });
    expect(wrapper.find(".progress-container").attributes("title")).toBe(
      tooltip
    );
  });

  it("applies story-progress class for story type", () => {
    const wrapper = createWrapper({ type: "story" });
    expect(wrapper.find(".progress").classes()).toContain("story-progress");
  });

  it("validates isComplete prop type", () => {
    const wrapper = createWrapper({});
    expect(wrapper.vm.$options.props.isComplete.type).toBe(Boolean);
  });

  it("validates tooltip prop type", () => {
    const wrapper = createWrapper({});
    expect(wrapper.vm.$options.props.tooltip.type).toBe(String);
  });
});
