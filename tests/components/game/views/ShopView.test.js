import { mount } from "@vue/test-utils";
import ShopView from "@views/ShopView.vue";
import { items } from "@data/items";
import ShopItem from "@items/ShopItem.vue";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("ShopView.vue", () => {
  let wrapper;
  const gameStateMock = {
    hasItem: jest.fn().mockReturnValue(false),
    isItemAvailable: jest.fn().mockReturnValue(false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    gameStateMock.hasItem.mockReturnValue(false);
    gameStateMock.isItemAvailable.mockReturnValue(false);

    wrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays item categories", () => {
    // Mock all items as available
    gameStateMock.isItemAvailable.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const categories = Object.keys(newWrapper.vm.itemsByCategory);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("formats category names correctly", () => {
    // Mock all items as available
    gameStateMock.isItemAvailable.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const categories = Object.keys(newWrapper.vm.itemsByCategory);
    categories.forEach((category) => {
      const formattedName = newWrapper.vm.formatCategoryName(category);
      expect(formattedName).not.toBe(category); // Should be formatted
      expect(formattedName.length).toBeGreaterThan(0);
    });
  });

  it("renders ShopItem components for available items", () => {
    // Mock all items as available
    gameStateMock.isItemAvailable.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const shopItems = newWrapper.findAllComponents(ShopItem);
    expect(shopItems.length).toBe(Object.keys(items).length);
  });

  it("groups items by category", () => {
    // Mock all items as available
    gameStateMock.isItemAvailable.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const itemsByCategory = newWrapper.vm.itemsByCategory;
    Object.entries(itemsByCategory).forEach(([category, categoryItems]) => {
      categoryItems.forEach((item) => {
        expect(item.category).toBe(category);
      });
    });
  });

  it("handles unknown categories gracefully", () => {
    // Mock all items as available
    gameStateMock.isItemAvailable.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const unknownCategory = "unknown_category";
    const formattedName = newWrapper.vm.formatCategoryName(unknownCategory);
    expect(formattedName).toBe(unknownCategory);
  });

  it("updates when gameState changes", async () => {
    // Initially no items available
    gameStateMock.isItemAvailable.mockReturnValue(false);
    const initialWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });
    expect(Object.keys(initialWrapper.vm.itemsByCategory).length).toBe(0);

    // Make all items available
    gameStateMock.isItemAvailable.mockReturnValue(true);
    await initialWrapper.setProps({ gameState: { ...gameStateMock } });

    expect(
      Object.keys(initialWrapper.vm.itemsByCategory).length
    ).toBeGreaterThan(0);
  });

  it("filters out items that don't meet requirements", () => {
    // Mock specific items as available
    const availableItems = Object.values(items).slice(0, 3);
    gameStateMock.isItemAvailable.mockImplementation((itemId) =>
      availableItems.some((item) => item.id === itemId)
    );

    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const displayedItems = Object.values(newWrapper.vm.itemsByCategory).flat();
    expect(displayedItems.length).toBe(availableItems.length);
    displayedItems.forEach((item) => {
      expect(availableItems).toContainEqual(
        expect.objectContaining({ id: item.id })
      );
    });
  });

  it("hides categories with no available items", () => {
    // Mock items from only one category as available
    const category = Object.values(items)[0].category;
    gameStateMock.isItemAvailable.mockImplementation(
      (itemId) => items[itemId].category === category
    );

    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const categories = Object.keys(newWrapper.vm.itemsByCategory);
    expect(categories).toContain(category);
    expect(categories.length).toBe(1);
  });

  it("shows correct number of items after filtering", () => {
    // Mock specific items as available
    const availableItems = Object.values(items).slice(0, 3);
    gameStateMock.isItemAvailable.mockImplementation((itemId) =>
      availableItems.some((item) => item.id === itemId)
    );

    const newWrapper = mount(ShopView, {
      propsData: { gameState: gameStateMock },
    });

    const shopItems = newWrapper.findAllComponents(ShopItem);
    expect(shopItems.length).toBe(availableItems.length);
  });
});
