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
    // Reset all mocks
    jest.clearAllMocks();
    mockGameState.hasItem.mockReturnValue(false);

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
    // Mock meeting all requirements to show items
    mockGameState.hasItem.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      props: {
        gameState: mockGameState,
      },
    });
    const categories = newWrapper.vm.itemsByCategory;
    expect(Object.keys(categories).length).toBeGreaterThan(0);
  });

  it("formats category names correctly", () => {
    const formattedName = wrapper.vm.formatCategoryName("salary");
    expect(formattedName).toBe("Salary Boosts");
  });

  it("renders ShopItem components for available items", () => {
    // Mock meeting all requirements
    mockGameState.hasItem.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      props: {
        gameState: mockGameState,
      },
    });

    const shopItems = newWrapper.findAllComponents(ShopItem);
    expect(shopItems.length).toBe(Object.keys(items).length); // All items should be shown
  });

  it("groups items by category", () => {
    // Mock meeting all requirements
    mockGameState.hasItem.mockReturnValue(true);
    const newWrapper = mount(ShopView, {
      props: {
        gameState: mockGameState,
      },
    });

    const categories = newWrapper.vm.itemsByCategory;
    Object.entries(categories).forEach(([category, categoryItems]) => {
      categoryItems.forEach((item) => {
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

  it("filters out items that don't meet requirements", () => {
    // Initially, show only items with no requirements
    const noRequirementItems = Object.values(items).filter(
      (item) => item.requiredItems.length === 0
    );
    expect(Object.keys(wrapper.vm.itemsByCategory).length).toBeGreaterThan(0);
    expect(wrapper.findAllComponents(ShopItem).length).toBe(
      noRequirementItems.length
    );

    // Mock meeting requirements for an item with requirements
    const itemWithRequirements = Object.values(items).find(
      (item) => item.requiredItems.length > 0
    );
    mockGameState.hasItem.mockImplementation((itemId) =>
      itemWithRequirements.requiredItems.includes(itemId)
    );
    const newWrapper = mount(ShopView, {
      props: {
        gameState: mockGameState,
      },
    });

    // Should show the item with met requirements plus items with no requirements
    expect(newWrapper.findAllComponents(ShopItem).length).toBe(
      noRequirementItems.length + 1
    );
    expect(
      newWrapper.vm.itemsByCategory[itemWithRequirements.category]
    ).toContainEqual(expect.objectContaining({ id: itemWithRequirements.id }));
  });

  it("hides categories with no available items", () => {
    // Initially, only categories with no-requirement items should be shown
    const noRequirementCategories = [
      ...new Set(
        Object.values(items)
          .filter((item) => item.requiredItems.length === 0)
          .map((item) => item.category)
      ),
    ];
    expect(Object.keys(wrapper.vm.itemsByCategory).length).toBe(
      noRequirementCategories.length
    );

    // Mock meeting requirements for items in a new category
    const categoryWithRequirements = Object.values(items).find(
      (item) => item.requiredItems.length > 0
    ).category;
    const categoryItems = Object.values(items).filter(
      (item) => item.category === categoryWithRequirements
    );

    mockGameState.hasItem.mockImplementation((itemId) =>
      categoryItems.some((item) => item.requiredItems.includes(itemId))
    );
    const newWrapper = mount(ShopView, {
      props: {
        gameState: mockGameState,
      },
    });

    // Should show the new category plus categories with no-requirement items
    expect(Object.keys(newWrapper.vm.itemsByCategory)).toContain(
      categoryWithRequirements
    );
    noRequirementCategories.forEach((category) => {
      expect(Object.keys(newWrapper.vm.itemsByCategory)).toContain(category);
    });
  });

  it("shows correct number of items after filtering", () => {
    // Get base number of items (ones with no requirements)
    const noRequirementItems = Object.values(items).filter(
      (item) => item.requiredItems.length === 0
    );

    // Mock meeting requirements for half of the items that have requirements
    const itemsWithRequirements = Object.values(items).filter(
      (item) => item.requiredItems.length > 0
    );
    const halfIndex = Math.floor(itemsWithRequirements.length / 2);
    const availableItems = itemsWithRequirements.slice(0, halfIndex);

    mockGameState.hasItem.mockImplementation((itemId) =>
      availableItems.some((item) => item.requiredItems.includes(itemId))
    );

    const newWrapper = mount(ShopView, {
      props: {
        gameState: mockGameState,
      },
    });

    // Should show no-requirement items plus half of the items with requirements
    const expectedTotal = noRequirementItems.length + halfIndex;
    const shopItems = newWrapper.findAllComponents(ShopItem);
    expect(shopItems.length).toBe(expectedTotal);

    // Verify specific items
    const allExpectedItems = [...noRequirementItems, ...availableItems];
    Object.values(newWrapper.vm.itemsByCategory)
      .flat()
      .forEach((item) => {
        expect(allExpectedItems).toContainEqual(
          expect.objectContaining({ id: item.id })
        );
      });
  });
});
