import { ref, watch } from "vue";
import "../styles/themes/ai.css";

class ThemeManager {
  constructor(gameState) {
    this.currentTheme = ref("normal");
    this.gameState = gameState;
    this.matrixBg = null;

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
  }

  deactivateAITheme() {
    this.currentTheme.value = "normal";
    document.body.classList.remove("theme-ai");
    this.removeMatrixBackground();
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
