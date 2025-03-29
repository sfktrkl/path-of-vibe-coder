<template>
  <div class="app-container">
    <GameHeader />
    <main class="main-content">
      <GameContent />
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
  padding-top: 80px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
