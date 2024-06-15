import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameStore = defineStore("game", () => {
  const isDebug = ref(false);
  const mode = ref<GameMode>();
  const score = ref(0);

  function getPhraseCount() {
    switch (mode.value) {
      case "impossible":
        return 6;
      case "easy":
        return 1;
      default:
        return 0;
    }
  }

  function addScore(add: number) {
    score.value += add;
  }

  return { isDebug, mode, score, getPhraseCount, addScore };
});

export type GameMode = "easy" | "impossible";
