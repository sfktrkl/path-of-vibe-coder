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
});
