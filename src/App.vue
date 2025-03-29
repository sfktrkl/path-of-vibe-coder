<template>
  <GameHeader />
</template>

<script>
import GameHeader from "./components/GameHeader.vue";

export default {
  name: "App",
  components: {
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
</style>
