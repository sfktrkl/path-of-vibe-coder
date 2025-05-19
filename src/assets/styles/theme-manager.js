import { watch } from "vue";
import "../styles/themes/ai.css";
import "../styles/themes/existence.css";
import ParticleSystem from "./particle-system.js";

class ThemeManager {
  constructor(gameState) {
    this.currentTheme = "normal";
    this.gameState = gameState;
    this.matrixBg = null;
    this.particleSystem = null;
    this.existenceBg = null;

    this.initialize();
  }

  initialize() {
    // Watch for AI path unlock state changes
    watch(
      () => this.gameState.getAIPathUnlocked(),
      (unlocked) => {
        if (unlocked && !this.gameState.getExistencePathUnlocked()) {
          this.activateAITheme();
        } else if (!unlocked) {
          this.deactivateAITheme();
        }
      },
      { immediate: true }
    );

    // Watch for existence path unlock state changes
    watch(
      () => this.gameState.getExistencePathUnlocked(),
      (unlocked) => {
        if (unlocked) {
          this.activateExistenceTheme();
        } else if (this.gameState.getAIPathUnlocked()) {
          this.activateAITheme();
        } else {
          this.deactivateTheme();
        }
      },
      { immediate: true }
    );
  }

  activateAITheme() {
    if (this.currentTheme === "existence") {
      this.deactivateExistenceTheme();
    }
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

  activateExistenceTheme() {
    // Deactivate AI theme first if it's active
    if (this.currentTheme === "ai") {
      this.deactivateAITheme();
    }

    // Stop particle system if it's running
    if (this.particleSystem) {
      this.particleSystem.stop();
    }

    this.currentTheme = "existence";
    document.body.classList.add("theme-existence");
    this.addExistenceBackground();
  }

  deactivateExistenceTheme() {
    this.currentTheme = "normal";
    document.body.classList.remove("theme-existence");
    this.removeExistenceBackground();

    // Stop particle system if it's running
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
      case "existence":
        document.body.classList.remove("theme-existence");
        this.removeExistenceBackground();
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

  addExistenceBackground() {
    // Create existence background element
    this.existenceBg = document.createElement("div");
    this.existenceBg.className = "existence-bg";
    document.body.appendChild(this.existenceBg);

    // Create existence particles container
    const particlesContainer = document.createElement("div");
    particlesContainer.className = "existence-particles";
    document.body.appendChild(particlesContainer);
  }

  removeExistenceBackground() {
    if (this.existenceBg) {
      this.existenceBg.remove();
      this.existenceBg = null;
    }

    const particlesContainer = document.querySelector(".existence-particles");
    if (particlesContainer) {
      particlesContainer.remove();
    }

    if (this.particleSystem) {
      this.particleSystem.stop();
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

export default ThemeManager;
