import { ref, watch } from "vue";
import "../styles/themes/ai.css";
import ParticleSystem from "./particle-system.js";

class ThemeManager {
  constructor(gameState) {
    this.currentTheme = ref("normal");
    this.gameState = gameState;
    this.matrixBg = null;
    this.particleSystem = null;

    this.initialize();
  }

  initialize() {
    // Watch for AI path unlock state changes
    watch(
      () => this.gameState.aiPathUnlocked,
      (unlocked) => {
        if (unlocked) {
          this.activateAITheme();
        } else {
          this.deactivateAITheme();
        }
      },
      { immediate: true }
    );
  }

  activateAITheme() {
    this.currentTheme.value = "ai";
    document.body.classList.add("theme-ai");
    this.addMatrixBackground();

    // Initialize and start particle system only for AI theme
    if (!this.particleSystem) {
      this.particleSystem = new ParticleSystem();
    }

    // Wait for the container to be available
    this.waitForContainer(() => {
      this.particleSystem.start();
    });
  }

  deactivateAITheme() {
    this.currentTheme.value = "normal";
    document.body.classList.remove("theme-ai");
    this.removeMatrixBackground();

    // Stop and cleanup particle system when deactivating AI theme
    if (this.particleSystem) {
      this.particleSystem.stop();
    }
  }

  waitForContainer(callback) {
    const checkContainer = () => {
      const container = document.querySelector(".particle-background");
      if (container) {
        callback();
      } else {
        setTimeout(checkContainer, 100);
      }
    };
    checkContainer();
  }

  addMatrixBackground() {
    this.matrixBg = document.createElement("div");
    this.matrixBg.className = "matrix-bg";
    document.body.appendChild(this.matrixBg);
  }

  removeMatrixBackground() {
    if (this.matrixBg) {
      this.matrixBg.remove();
      this.matrixBg = null;
    }
  }

  getCurrentTheme() {
    return this.currentTheme.value;
  }
}

export default ThemeManager;
