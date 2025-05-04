<template>
  <div class="shop-view">
    <div v-for="(items, category) in itemsByCategory" :key="category">
      <h4>{{ formatCategoryName(category) }}</h4>
      <div class="items-list">
        <ShopItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          :game-state="gameState"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { items } from "@data/items";
import ShopItem from "@items/ShopItem.vue";

export default {
  name: "ShopView",
  components: {
    ShopItem,
  },
  props: {
    gameState: {
      type: Object,
      required: true,
    },
  },
  computed: {
    itemsByCategory() {
      const categories = {};
      Object.values(items).forEach((item) => {
        // Check if item is available using GameState method
        if (this.gameState.isItemAvailable(item.id)) {
          if (!categories[item.category]) {
            categories[item.category] = [];
          }
          categories[item.category].push(item);
        }
      });

      // Filter out empty categories
      return Object.fromEntries(
        Object.entries(categories).filter(([, items]) => items.length > 0)
      );
    },
  },
  methods: {
    formatCategoryName(category) {
      return category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
};
</script>

<style scoped>
.shop-view {
  overflow-x: hidden;
}

h4 {
  color: #ffffff;
  margin-top: 16px;
  margin-bottom: 8px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
</style>
