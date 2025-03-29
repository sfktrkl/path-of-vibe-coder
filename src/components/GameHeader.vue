<template>
  <header class="game-header">
    <div class="character-info">
      <div class="title">Title: {{ characterTitle }}</div>
      <div class="money">Money: ${{ money }}</div>
    </div>
  </header>
</template>

<script>
export default {
  name: "GameHeader",
  data() {
    return {
      characterTitle: "Junior Developer",
      money: 1000,
    };
  },
};
</script>

<style scoped>
.game-header {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.character-info {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  font-size: 1.2rem;
}

.title,
.money {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>
