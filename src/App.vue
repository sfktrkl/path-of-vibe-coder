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
/* Add some global styles for better layout */
body {
  margin: 0;
  padding: 0;
  background-color: #1a252f;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1a252f;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  margin-top: 140px; /* Move padding to margin-top */
}
</style>
