import { mount } from "@vue/test-utils";
import GameContent from "@layout/GameContent.vue";

// Mock the view components
jest.mock("@views/SkillsView.vue", () => ({
  name: "SkillsView",
  props: ["gameState"],
  template: "<div class='skills-view'>Skills View</div>",
}));

jest.mock("@views/JobsView.vue", () => ({
  name: "JobsView",
  props: ["gameState"],
  template: "<div class='jobs-view'>Jobs View</div>",
}));

jest.mock("@views/ShopView.vue", () => ({
  name: "ShopView",
  template: "<div class='shop-view'>Shop View</div>",
}));

describe("GameContent.vue", () => {
  let wrapper;
  const mockGameState = {
    title: "Test Game",
    money: 1000,
  };

  beforeEach(() => {
    wrapper = mount(GameContent, {
      props: {
        currentView: "job",
        gameState: mockGameState,
      },
    });
  });

  test("renders view title", () => {
    expect(wrapper.find("h2").text()).toBe("Career Path");
  });

  test("renders JobsView when currentView is 'job'", () => {
    expect(wrapper.find(".jobs-view").exists()).toBe(true);
    expect(wrapper.find(".skills-view").exists()).toBe(false);
    expect(wrapper.find(".shop-view").exists()).toBe(false);
  });

  test("renders SkillsView when currentView is 'skills'", async () => {
    await wrapper.setProps({ currentView: "skills" });
    expect(wrapper.find(".skills-view").exists()).toBe(true);
    expect(wrapper.find(".jobs-view").exists()).toBe(false);
    expect(wrapper.find(".shop-view").exists()).toBe(false);
  });

  test("renders ShopView when currentView is 'shop'", async () => {
    await wrapper.setProps({ currentView: "shop" });
    expect(wrapper.find(".shop-view").exists()).toBe(true);
    expect(wrapper.find(".jobs-view").exists()).toBe(false);
    expect(wrapper.find(".skills-view").exists()).toBe(false);
  });

  test("passes gameState prop to child components", async () => {
    await wrapper.setProps({ currentView: "skills" });
    const skillsView = wrapper.findComponent({ name: "SkillsView" });
    expect(skillsView.props("gameState")).toEqual(mockGameState);
  });
});
