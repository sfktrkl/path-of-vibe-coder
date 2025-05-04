<template>
  <div
    :class="[
      'item-base',
      {
        owned: gameState.hasItem(item.id),
        affordable: canAfford,
      },
    ]"
    @click="
      !gameState.hasItem(item.id) && canAfford ? purchaseItem(item.id) : null
    "
  >
    <div class="item-info">
      <span class="item-name">{{ item.name }}</span>
      <span class="item-description">{{ item.description }}</span>
      <div class="item-stats">
        <div v-for="(value, effect) in item.stats" :key="effect" class="stat">
          <span class="stat-name">{{ formatEffectName(effect) }}:</span>
          <span class="stat-value">{{ formatEffectValue(effect, value) }}</span>
        </div>
      </div>
    </div>
    <div class="item-status">
      <span v-if="gameState.hasItem(item.id)" class="status-badge owned-badge"
        >Owned</span
      >
      <span v-else-if="canAfford" class="status-badge affordable-badge"
        >${{ item.price }}</span
      >
      <span v-else class="status-badge unaffordable-badge"
        >${{ item.price }}</span
      >
    </div>
  </div>
</template>

<script>
import "@styles/item-styles.css";
import dataMixin from "@mixins/dataMixin";

export default {
  name: "ShopItem",
  mixins: [dataMixin],
  props: {
    item: {
      type: Object,
      required: true,
    },
    gameState: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canAfford() {
      return this.gameState.getMoney() >= this.item.price;
    },
  },
  methods: {
    purchaseItem(itemId) {
      this.gameState.purchaseItem(itemId);
    },
  },
};
</script>
