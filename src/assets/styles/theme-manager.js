import { ref, watch } from "vue";
import "../styles/themes/ai.css";

const currentTheme = ref("normal");

export function useThemeManager(gameState) {
  // Watch for AI path unlock state changes
  watch(
    () => gameState.aiPathUnlocked,
    (unlocked) => {
      if (unlocked) {
        currentTheme.value = "ai";
        document.body.classList.add("theme-ai");

        // Add matrix background
        const matrixBg = document.createElement("div");
        matrixBg.className = "matrix-bg";
        document.body.appendChild(matrixBg);
      } else {
        currentTheme.value = "normal";
        document.body.classList.remove("theme-ai");

        // Remove AI-specific elements
        const matrixBg = document.querySelector(".matrix-bg");
        if (matrixBg) matrixBg.remove();
      }
    },
    { immediate: true }
  );

  return {
    currentTheme,
  };
}
