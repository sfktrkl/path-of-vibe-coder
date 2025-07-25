<template>
  <div class="save-load-view">
    <div class="save-load-container">
      <div class="save-load-section">
        <h2>Save</h2>
        <button class="save-button" @click="saveGame">Save Game</button>
        <div
          v-if="saveMessage"
          class="message"
          :class="{ success: saveSuccess }"
        >
          {{ saveMessage }}
        </div>
        <div v-if="saveCode" class="save-code">
          <p>Save Code:</p>
          <div class="code-display">{{ saveCode }}</div>
          <button class="copy-button" @click="copyCode">Copy Code</button>
        </div>
      </div>

      <div class="save-load-section">
        <h2>Load</h2>
        <div class="load-input">
          <input
            type="text"
            v-model="loadCode"
            placeholder="Enter save code"
            class="code-input"
          />
          <button class="load-button" @click="loadGame">Load Game</button>
        </div>
        <div
          v-if="loadMessage"
          class="message"
          :class="{ success: loadSuccess }"
        >
          {{ loadMessage }}
        </div>
      </div>

      <div class="save-load-section">
        <h2>Reset</h2>
        <button
          class="reset-button"
          :class="{ 'confirm-reset': isConfirmingReset }"
          @click="handleResetClick"
        >
          {{
            isConfirmingReset ? "Click again to confirm reset" : "Reset Game"
          }}
        </button>
        <div
          v-if="resetMessage"
          class="message"
          :class="{ success: resetSuccess }"
        >
          {{ resetMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameState from "@models/GameState.js";

export default {
  name: "SaveLoadView",
  props: {
    gameState: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saveMessage: "",
      saveSuccess: false,
      loadMessage: "",
      loadSuccess: false,
      saveCode: "",
      loadCode: "",
      resetMessage: "",
      resetSuccess: false,
      isConfirmingReset: false,
      resetTimeout: null,
    };
  },
  methods: {
    saveGame() {
      try {
        const encodedState = this.gameState.encode();
        this.saveCode = encodedState;
        this.saveMessage = "Game saved successfully!";
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveMessage = "";
        }, 3000);
      } catch (error) {
        this.saveMessage = "Error saving game: " + error.message;
        this.saveSuccess = false;
      }
    },
    loadGame() {
      try {
        if (!this.loadCode) {
          this.loadMessage = "Please enter a save code!";
          this.loadSuccess = false;
          return;
        }

        // Try to decode the save code
        const decodedState = GameState.decode(this.loadCode);

        // Check if decode failed or state is invalid
        if (!decodedState) {
          this.loadMessage = "Invalid save code!";
          this.loadSuccess = false;
          return;
        }

        // Emit the decoded state
        this.$emit("load-game", decodedState);
        this.loadMessage = "Game loaded successfully!";
        this.loadSuccess = true;
        setTimeout(() => {
          this.loadMessage = "";
        }, 3000);
      } catch (error) {
        this.loadMessage = "Invalid save code!";
        this.loadSuccess = false;
      }
    },
    copyCode() {
      if (this.saveCode) {
        navigator.clipboard.writeText(this.saveCode);
        this.saveMessage = "Code copied to clipboard!";
        this.saveSuccess = true;
        setTimeout(() => {
          this.saveMessage = "";
        }, 3000);
      }
    },
    resetGame() {
      this.$emit("reset-game");
      this.resetMessage = "Game has been reset!";
      this.resetSuccess = true;
      setTimeout(() => {
        this.resetMessage = "";
      }, 3000);
    },
    handleResetClick() {
      if (!this.isConfirmingReset) {
        // First click - enter confirmation state
        this.isConfirmingReset = true;
        // Reset confirmation after 3 seconds
        this.resetTimeout = setTimeout(() => {
          this.isConfirmingReset = false;
        }, 3000);
      } else {
        // Second click - actually reset
        clearTimeout(this.resetTimeout);
        this.isConfirmingReset = false;
        this.resetGame();
      }
    },
  },
};
</script>

<style scoped>
.save-load-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.save-load-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.save-load-section {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h2 {
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
}

.save-button,
.load-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  transform-origin: center;
}

.save-button:hover,
.load-button:hover {
  background-color: #27ae60;
  transform: scale(0.98);
}

.reset-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  transform-origin: center;
}

.reset-button.confirm-reset {
  background-color: #c0392b;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.reset-button:hover {
  background-color: #c0392b;
  transform: scale(0.98);
}

.message {
  padding: 0.75rem;
  border-radius: 4px;
  background-color: #e74c3c;
  color: white;
}

.message.success {
  background-color: #2ecc71;
}

.save-code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.save-code p {
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  font-size: 0.9rem;
}

.code-display {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  color: #2ecc71;
  margin-bottom: 0.5rem;
  word-break: break-all;
}

.copy-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  transform-origin: center;
}

.copy-button:hover {
  background-color: #2980b9;
  transform: scale(0.98);
}

.load-input {
  display: flex;
  gap: 0.5rem;
}

.code-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

.code-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.warning-text {
  color: #e74c3c;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .save-load-view {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .save-load-container {
    padding: 0.5rem;
  }

  .save-load-section {
    padding: 1rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  .save-button,
  .load-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .load-input {
    flex-direction: column;
  }

  .code-input {
    width: 100%;
  }
}
</style>
