<template>
  <GameHeader />
  <div class="main-content">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import GameHeader from "./components/GameHeader.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    GameHeader,
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

.main-content {
  margin-top: 80px;
  padding: 20px;
}
</style>
