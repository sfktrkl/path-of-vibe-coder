import { mount } from "@vue/test-utils";
import ShopView from "@views/ShopView.vue";

describe("ShopView.vue", () => {
  it("renders correctly", () => {
    const wrapper = mount(ShopView);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("h3").text()).toBe("Shop");
    expect(wrapper.find("p").text()).toBe("Coming soon...");
  });
});
