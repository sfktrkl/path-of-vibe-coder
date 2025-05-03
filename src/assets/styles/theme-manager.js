import { watch } from "vue";
import "../styles/themes/ai.css";
import ParticleSystem from "./particle-system.js";

class ThemeManager {
  constructor(gameState) {
    this.currentTheme = "normal";
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
    this.currentTheme = "ai";
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
    this.currentTheme = "normal";
    document.body.classList.remove("theme-ai");
    this.removeMatrixBackground();

    // Stop and cleanup particle system when deactivating AI theme
    if (this.particleSystem) {
      this.particleSystem.stop();
    }
  }

  deactivateTheme() {
    const currentTheme = this.currentTheme;

    // Handle different theme deactivations
    switch (currentTheme) {
      case "ai":
        document.body.classList.remove("theme-ai");
        this.removeMatrixBackground();
        if (this.particleSystem) {
          this.particleSystem.stop();
        }
        break;
      // Add cases for other themes here if needed
    }

    // Reset to normal theme
    this.currentTheme = "normal";
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
    return this.currentTheme;
  }
}

export default ThemeManager;
