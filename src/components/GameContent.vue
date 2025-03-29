<template>
  <div class="game-content">
    <h2>Character Information</h2>
    <!-- Character information will be displayed here -->
  </div>
</template>

<script>
export default {
  name: "GameContent",
};
</script>

<style scoped>
.game-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 0 auto;
}

h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 16px;
}
</style>
