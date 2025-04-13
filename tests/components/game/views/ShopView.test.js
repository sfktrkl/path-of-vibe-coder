import { mount } from "@vue/test-utils";
import ShopView from "@views/ShopView.vue";

describe("ShopView.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ShopView);
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays correct title and message", () => {
    expect(wrapper.find("h3").text()).toBe("Shop");
    expect(wrapper.find("p").text()).toBe("Coming soon...");
  });
});
