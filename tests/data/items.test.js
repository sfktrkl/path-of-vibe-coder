import { items } from "@data/items";

describe("Items Data Validation", () => {
  // Test that all items have required fields
  test("all items have required fields", () => {
    Object.values(items).forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("category");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("requiredItems");
      expect(item).toHaveProperty("stats");
    });
  });

  // Test that all required items exist
  test("all required items exist", () => {
    Object.values(items).forEach((item) => {
      item.requiredItems.forEach((itemId) => {
        expect(items[itemId]).toBeDefined();
      });
    });
  });

  // Test that all items have unique IDs
  test("all items have unique IDs", () => {
    const ids = Object.values(items).map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  // Test that each category is used by at least two items
  test("each category is used by at least two items", () => {
    const categoryUsage = {};
    Object.values(items).forEach((item) => {
      categoryUsage[item.category] = (categoryUsage[item.category] || 0) + 1;
    });

    Object.entries(categoryUsage).forEach(([, count]) => {
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  // Test that all items have positive price
  test("all items have positive price", () => {
    Object.values(items).forEach((item) => {
      expect(item.price).toBeGreaterThan(0);
    });
  });

  // Test that each stat type is used by at least two items
  test("each stat type is used by at least two items", () => {
    const statUsage = {};
    Object.values(items).forEach((item) => {
      Object.keys(item.stats).forEach((stat) => {
        statUsage[stat] = (statUsage[stat] || 0) + 1;
      });
    });

    Object.entries(statUsage).forEach(([, count]) => {
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  // Test that prerequisites don't create circular dependencies
  test("no circular dependencies in required items", () => {
    const visited = new Set();
    const recursionStack = new Set();

    function hasCycle(itemId) {
      if (!visited.has(itemId)) {
        visited.add(itemId);
        recursionStack.add(itemId);

        const item = items[itemId];
        for (const reqItemId of item.requiredItems) {
          if (!visited.has(reqItemId) && hasCycle(reqItemId)) {
            return true;
          } else if (recursionStack.has(reqItemId)) {
            return true;
          }
        }
      }
      recursionStack.delete(itemId);
      return false;
    }

    Object.keys(items).forEach((itemId) => {
      expect(hasCycle(itemId)).toBe(false);
    });
  });

  // Test that all items are reachable from basic items
  test("all items are reachable from basic items", () => {
    const basicItems = Object.values(items).filter(
      (item) => item.requiredItems.length === 0
    );
    expect(basicItems.length).toBeGreaterThan(0);

    const reachable = new Set(basicItems.map((item) => item.id));

    function markReachable(itemId) {
      if (reachable.has(itemId)) return;
      reachable.add(itemId);
      const item = items[itemId];
      item.requiredItems.forEach(markReachable);
    }

    Object.keys(items).forEach(markReachable);
    expect(reachable.size).toBe(Object.keys(items).length);
  });

  // Test that item progression makes sense (price increases)
  test("item progression has increasing prices", () => {
    Object.values(items).forEach((item) => {
      item.requiredItems.forEach((reqItemId) => {
        const reqItem = items[reqItemId];
        expect(item.price).toBeGreaterThan(reqItem.price);
      });
    });
  });

  // Test that multipliers are valid
  test("multipliers are valid", () => {
    Object.values(items).forEach((item) => {
      Object.entries(item.stats).forEach(([stat, value]) => {
        if (stat.includes("Multiplier")) {
          expect(value).toBeGreaterThan(0);
        }
        if (stat === "skillTimeReduction") {
          expect(value).toBeLessThanOrEqual(1);
        }
      });
    });
  });
});
