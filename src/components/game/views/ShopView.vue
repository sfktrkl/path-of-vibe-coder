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
import ShopItem from "@items/ShopItem.vue";
import dataMixin from "@mixins/dataMixin";

export default {
  name: "ShopView",
  components: {
    ShopItem,
  },
  mixins: [dataMixin],
  props: {
    gameState: {
      type: Object,
      required: true,
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
