import { mount } from "@vue/test-utils";
import ShopItem from "@items/ShopItem.vue";

// Mock the style import
jest.mock("@styles/item-styles.css", () => ({}));

describe("ShopItem", () => {
  let wrapper;
  const mockItem = {
    id: "test_item",
    name: "Test Item",
    description: "A test item description",
    price: 100,
    stats: {
      salaryMultiplier: 1.5,
      learningSpeedMultiplier: 1.2,
      skillTimeMultiplier: 0.8,
      initialJobProgress: 10,
    },
    requiredItems: [],
  };

  const gameStateMock = {
    hasItem: jest.fn(),
    purchaseItem: jest.fn(),
    money: 1000,
  };

  beforeEach(() => {
    gameStateMock.hasItem.mockReset().mockReturnValue(false);
    gameStateMock.purchaseItem.mockReset().mockReturnValue(true);
    wrapper = mount(ShopItem, {
      propsData: {
        item: mockItem,
        gameState: gameStateMock,
      },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays item information correctly", () => {
    expect(wrapper.find(".item-name").text()).toBe(mockItem.name);
    expect(wrapper.find(".item-description").text()).toBe(mockItem.description);
  });

  it("displays stats correctly", () => {
    const stats = wrapper.findAll(".stat");
    expect(stats.length).toBe(Object.keys(mockItem.stats).length);

    // Check salary multiplier stat
    const salaryStat = stats.at(0);
    expect(salaryStat.find(".stat-name").text()).toBe("Salary Boost:");
    expect(salaryStat.find(".stat-value").text()).toBe("+50%");

    // Check learning speed stat
    const learningStat = stats.at(1);
    expect(learningStat.find(".stat-name").text()).toBe("Learning Speed:");
    expect(learningStat.find(".stat-value").text()).toBe("+20%");

    // Check skill time stat
    const skillTimeStat = stats.at(2);
    expect(skillTimeStat.find(".stat-name").text()).toBe("Skill Time:");
    expect(skillTimeStat.find(".stat-value").text()).toBe("-20%");

    // Check job progress stat
    const jobProgressStat = stats.at(3);
    expect(jobProgressStat.find(".stat-name").text()).toBe("Job Progress:");
    expect(jobProgressStat.find(".stat-value").text()).toBe("+10%");
  });

  it("shows owned badge when item is owned", async () => {
    gameStateMock.hasItem.mockReturnValue(true);
    await wrapper.setProps({
      item: mockItem,
      gameState: { ...gameStateMock },
    });

    expect(wrapper.find(".owned-badge").exists()).toBe(true);
    expect(wrapper.find(".owned-badge").text()).toBe("Owned");
  });

  it("shows affordable badge when can afford", async () => {
    gameStateMock.hasItem.mockReturnValue(false);
    gameStateMock.money = 1000;
    await wrapper.setProps({
      item: mockItem,
      gameState: { ...gameStateMock },
    });

    expect(wrapper.find(".affordable-badge").exists()).toBe(true);
    expect(wrapper.find(".affordable-badge").text()).toBe("$100");
  });

  it("shows unaffordable badge when cannot afford", async () => {
    gameStateMock.hasItem.mockReturnValue(false);
    gameStateMock.money = 50;
    await wrapper.setProps({
      item: mockItem,
      gameState: { ...gameStateMock },
    });

    expect(wrapper.find(".unaffordable-badge").exists()).toBe(true);
    expect(wrapper.find(".unaffordable-badge").text()).toBe("$100");
  });

  it("shows locked badge when requirements not met", async () => {
    const mockItem = {
      id: "test_item",
      name: "Test Item",
      description: "Test Description",
      price: 100,
      stats: { learning: 1.5 },
      requiredItems: ["required_item"],
    };

    const mockGameState = {
      money: 1000,
      hasItem: jest.fn().mockReturnValue(false),
      canAfford: jest.fn().mockReturnValue(true),
    };

    const wrapper = mount(ShopItem, {
      propsData: {
        item: mockItem,
        gameState: mockGameState,
      },
    });

    await wrapper.vm.$nextTick();
    expect(mockGameState.hasItem).toHaveBeenCalledWith("required_item");
    expect(wrapper.find(".locked-badge").exists()).toBe(true);
    expect(wrapper.find(".locked-badge").text()).toBe("Requirements");
  });

  it("calls purchaseItem when clicked and available", async () => {
    gameStateMock.hasItem.mockReturnValue(false);
    gameStateMock.money = 1000;
    await wrapper.setProps({
      item: mockItem,
      gameState: { ...gameStateMock },
    });

    await wrapper.trigger("click");
    expect(gameStateMock.purchaseItem).toHaveBeenCalledWith(mockItem.id);
  });

  it("does not call purchaseItem when clicked and not available", async () => {
    gameStateMock.hasItem.mockReturnValue(true);
    await wrapper.setProps({
      item: mockItem,
      gameState: { ...gameStateMock },
    });

    await wrapper.trigger("click");
    expect(gameStateMock.purchaseItem).not.toHaveBeenCalled();
  });

  it("applies correct classes based on item state", async () => {
    gameStateMock.hasItem.mockReturnValue(false);
    gameStateMock.money = 1000;
    await wrapper.setProps({
      item: mockItem,
      gameState: { ...gameStateMock },
    });

    expect(wrapper.classes()).toContain("item-base");
    expect(wrapper.classes()).toContain("affordable");
    expect(wrapper.classes()).toContain("available");
    expect(wrapper.classes()).not.toContain("owned");
  });
});
