import { mount } from "@vue/test-utils";
import JobsView from "@views/JobsView.vue";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("JobsView", () => {
  let wrapper;
  const gameStateMock = {
    isJobUnlocked: jest.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    wrapper = mount(JobsView, {
      propsData: { gameState: gameStateMock },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays job categories", () => {
    const categories = wrapper.vm.jobsByCategory;
    expect(categories).toHaveProperty("basic");
    expect(categories.basic).toHaveLength(6);
  });
});
