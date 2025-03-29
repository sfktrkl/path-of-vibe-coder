<template>
  <div class="app-container">
    <GameHeader @view-change="handleViewChange" />
    <main class="main-content">
      <GameContent :current-view="currentView" />
    </main>
  </div>
</template>

<script>
import GameHeader from "./components/GameHeader.vue";
import GameContent from "./components/GameContent.vue";

export default {
  name: "App",
  components: {
    GameHeader,
    GameContent,
  },
  data() {
    return {
      currentView: "job",
    };
  },
  methods: {
    handleViewChange(view) {
      this.currentView = view;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  padding-top: 120px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
