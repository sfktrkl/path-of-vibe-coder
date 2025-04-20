import { mount } from "@vue/test-utils";
import ShopView from "@views/ShopView.vue";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("ShopView.vue", () => {
  let wrapper;
  const mockGameState = {
    money: 1000,
    spendMoney: jest.fn(),
    hasItem: jest.fn().mockReturnValue(false),
    purchaseItem: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(ShopView, {
      props: {
        gameState: mockGameState,
      },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("shop-view");
  });
});
