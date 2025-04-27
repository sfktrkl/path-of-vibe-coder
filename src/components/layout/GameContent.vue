<template>
  <div class="game-content">
    <h2>{{ viewTitle }}</h2>
    <SkillsView v-if="currentView === 'skills'" :game-state="gameState" />
    <JobsView v-if="currentView === 'job'" :game-state="gameState" />
    <ShopView v-if="currentView === 'shop'" :game-state="gameState" />
    <SaveLoadView v-if="currentView === 'save'" :gameState="gameState" />
  </div>
</template>

<script>
import SaveLoadView from "@views/SaveLoadView.vue";
import SkillsView from "@views/SkillsView.vue";
import JobsView from "@views/JobsView.vue";
import ShopView from "@views/ShopView.vue";
import viewMixin from "@mixins/viewMixin";

export default {
  name: "GameContent",
  components: {
    SkillsView,
    JobsView,
    ShopView,
    SaveLoadView,
  },
  mixins: [viewMixin],
  props: {
    currentView: {
      type: String,
      required: true,
    },
    gameState: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.game-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  background-color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 24px;
  overflow-x: hidden;
}

h2 {
  margin-top: 0;
  color: #ffffff;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
}
</style>
