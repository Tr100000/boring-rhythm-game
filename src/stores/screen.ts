import { defineStore } from "pinia";
import { ref } from "vue";

export const useScreenStore = defineStore("screen", () => {
  const currentScreen = ref<Screen>("menu");

  function setScreen(screen: Screen) {
    currentScreen.value = screen;
  }

  return { currentScreen, setScreen };
});

export type Screen = "menu" | "load" | "game";
