<template>
  <div class="app-container">
    <div class="particle-background" />
    <GameHeader
      :currentView="currentView"
      :gameState="gameState"
      @view-change="handleViewChange"
    />
    <main class="main-content">
      <GameContent
        :currentView="currentView"
        :gameState="gameState"
        @update-game-state="handleGameStateUpdate"
        @reset-game="resetGameState"
      />
    </main>
  </div>
</template>

<script>
import GameHeader from "@layout/GameHeader.vue";
import GameContent from "@layout/GameContent.vue";
import GameState from "@models/GameState.js";
import GameTimer from "@models/GameTimer.js";
import GameCheat from "@utils/GameCheat.js";
import ThemeManager from "@styles/theme-manager.js";

export default {
  name: "App",
  components: {
    GameHeader,
    GameContent,
  },
  data() {
    return {
      currentView: "job",
      gameState: new GameState(),
      gameTimer: null,
      gameCheat: null,
      themeManager: null,
    };
  },
  methods: {
    handleViewChange(view) {
      this.currentView = view;
    },
    handleGameStateUpdate(newState) {
      // Stop the current timer
      if (this.gameTimer) {
        this.gameTimer.stop();
      }

      // Update the game state
      this.gameState = newState;

      // Reinitialize the timer with the new state
      this.gameTimer = new GameTimer(this.gameState);
      this.gameTimer.start();

      // Reinitialize game cheats
      this.gameCheat = new GameCheat(this.gameState);

      // Reinitialize theme manager
      this.themeManager = new ThemeManager(this.gameState);
    },
    resetGameState() {
      // Deactivate current theme and cleanup before reset
      if (this.themeManager) {
        this.themeManager.deactivateTheme();
      }

      // Create a new game state
      const newState = new GameState();
      this.handleGameStateUpdate(newState);
    },
  },
  created() {
    // Load saved game state if exists
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      try {
        this.gameState = GameState.decode(savedState);
      } catch (error) {
        console.error("Failed to load saved game state:", error);
      }
    }

    // Initialize and start the game timer
    this.gameTimer = new GameTimer(this.gameState);
    this.gameTimer.start();

    // Initialize game cheats
    this.gameCheat = new GameCheat(this.gameState);

    // Initialize theme manager
    this.themeManager = new ThemeManager(this.gameState);
  },
  beforeUnmount() {
    // Stop the timer when the component is destroyed
    if (this.gameTimer) {
      this.gameTimer.stop();
    }
  },
  watch: {
    gameState: {
      handler(newState) {
        // Save game state whenever it changes
        localStorage.setItem("gameState", newState.encode());
      },
      deep: true,
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
  min-height: 100vh;
  background-color: #1a252f;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
}

.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>
