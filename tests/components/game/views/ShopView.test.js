import { mount } from "@vue/test-utils";
import ShopView from "@views/ShopView.vue";
import { items } from "@data/items";
import ShopItem from "@items/ShopItem.vue";

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

  it("displays item categories", () => {
    const categories = wrapper.vm.itemsByCategory;
    expect(Object.keys(categories).length).toBeGreaterThan(0);
  });

  it("formats category names correctly", () => {
    const formattedName = wrapper.vm.formatCategoryName("salary");
    expect(formattedName).toBe("Salary Boosts");
  });

  it("renders ShopItem components for each item", () => {
    const shopItems = wrapper.findAllComponents(ShopItem);
    const totalItems = Object.values(items).length;
    expect(shopItems.length).toBe(totalItems);
  });

  it("groups items by category", () => {
    const categories = wrapper.vm.itemsByCategory;
    Object.entries(categories).forEach(([category, items]) => {
      items.forEach((item) => {
        expect(item.category).toBe(category);
      });
    });
  });

  it("handles unknown categories gracefully", () => {
    const formattedName = wrapper.vm.formatCategoryName("unknown");
    expect(formattedName).toBe("unknown");
  });

  it("updates when gameState changes", async () => {
    const newGameState = {
      ...mockGameState,
      money: 2000,
    };
    await wrapper.setProps({ gameState: newGameState });
    expect(wrapper.vm.gameState.money).toBe(2000);
  });

  it("displays correct number of items per category", () => {
    const categories = wrapper.vm.itemsByCategory;
    Object.entries(categories).forEach(([category, items]) => {
      const expectedCount = Object.values(items).filter(
        (item) => item.category === category
      ).length;
      expect(items.length).toBe(expectedCount);
    });
  });
});
