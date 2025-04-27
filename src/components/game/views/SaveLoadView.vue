<template>
  <div class="save-load-view">
    <div class="save-load-container">
      <div class="save-load-section">
        <h2>Save Game</h2>
        <button class="save-button" @click="saveGame">Save Current Game</button>
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
        <h2>Load Game</h2>
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

        const gameData = GameState.decode(this.loadCode);

        if (!gameData) {
          this.loadMessage = "Invalid save code!";
          this.loadSuccess = false;
          return;
        }

        this.$emit("load-game", gameData);
        this.loadMessage = "Game loaded successfully!";
        this.loadSuccess = true;
        setTimeout(() => {
          this.loadMessage = "";
        }, 3000);
      } catch (error) {
        this.loadMessage = "Error loading game: " + error.message;
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
}

.save-button:hover,
.load-button:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
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
}

.copy-button:hover {
  background-color: #2980b9;
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
