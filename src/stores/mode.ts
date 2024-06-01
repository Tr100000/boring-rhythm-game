import { defineStore } from "pinia";
import { ref } from "vue";

export const useModeStore = defineStore("mode", () => {
  const currentMode = ref<Mode>("menu");

  function setMode(mode: Mode) {
    currentMode.value = mode;
  }

  return { currentMode, setMode };
});

export type Mode = "menu" | "play" | "debug";
