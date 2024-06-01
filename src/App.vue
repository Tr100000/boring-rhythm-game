<script setup lang="ts">
import Debug from "./game/Debug.vue";
import Game from "./game/Game.vue";
import LoadScreen from "./screens/LoadScreen.vue";
import MainMenu from "./screens/MainMenu.vue";
import { useModeStore } from "./stores/mode";
import { useScreenStore } from "./stores/screen";

const screenStore = useScreenStore();
const modeStore = useModeStore();
</script>

<template>
  <MainMenu v-if="screenStore.currentScreen == 'menu'" />
  <LoadScreen v-if="screenStore.currentScreen == 'load'" />
  <Game
    v-if="
      screenStore.currentScreen == 'game' && modeStore.currentMode == 'play'
    "
  />
  <Debug
    v-if="
      screenStore.currentScreen == 'game' && modeStore.currentMode == 'debug'
    "
  />
</template>
