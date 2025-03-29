<template>
  <div class="game-container">
    <h1>Path of Vibe Coder</h1>
    <div class="game-content">
      <!-- Game content will go here -->
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
};
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.game-content {
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}
</style>
