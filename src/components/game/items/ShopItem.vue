<template>
  <div
    :class="[
      'item-base',
      {
        owned: gameState.hasItem(item.id),
        affordable: canAfford,
        available: isAvailable,
      },
    ]"
    @click="
      !gameState.hasItem(item.id) && canAfford && isAvailable
        ? purchaseItem(item.id)
        : null
    "
  >
    <div class="item-info">
      <span class="item-name">{{ item.name }}</span>
      <span class="item-description">{{ item.description }}</span>
      <div class="item-stats">
        <div v-for="(value, stat) in item.stats" :key="stat" class="stat">
          <span class="stat-name">{{ formatStatName(stat) }}:</span>
          <span class="stat-value">{{ formatStatValue(stat, value) }}</span>
        </div>
      </div>
    </div>
    <div class="item-status">
      <span v-if="gameState.hasItem(item.id)" class="status-badge owned-badge"
        >Owned</span
      >
      <span v-else-if="!isAvailable" class="status-badge locked-badge"
        >Requirements</span
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

export default {
  name: "ShopItem",
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
      return this.gameState.money >= this.item.price;
    },
    isAvailable() {
      return this.item.requiredItems.every((requiredItem) =>
        this.gameState.hasItem(requiredItem)
      );
    },
  },
  methods: {
    purchaseItem(itemId) {
      this.gameState.purchaseItem(itemId);
    },
    formatStatName(stat) {
      const names = {
        salaryMultiplier: "Salary Boost",
        learningSpeedMultiplier: "Learning Speed",
        workSpeedMultiplier: "Work Speed",
        skillTimeMultiplier: "Skill Time",
        initialJobProgress: "Job Progress",
      };
      return names[stat] || stat;
    },
    formatStatValue(stat, value) {
      if (stat.includes("Multiplier")) {
        const percentage = ((value - 1) * 100).toFixed(0);
        return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
      } else if (stat === "skillTimeMultiplier") {
        const percentage = ((1 - value) * 100).toFixed(0);
        return `-${percentage}%`;
      } else if (stat === "initialJobProgress") {
        return `+${value}%`;
      }
      return value;
    },
  },
};
</script>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  width: 100px;
  text-align: center;
  display: inline-block;
}

.owned-badge {
  background-color: #4a4a4a;
  color: #888;
}

.affordable-badge {
  background-color: #2ecc71;
  color: white;
}

.unaffordable-badge {
  background-color: #e74c3c;
  color: white;
}

.locked-badge {
  background-color: #f39c12;
  color: white;
}

.item-stats {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.stat-name {
  color: #888;
}

.stat-value {
  color: #2ecc71;
  font-weight: 500;
}
</style>
