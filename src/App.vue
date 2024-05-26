<script setup lang="ts">
import Game from "./game/Game.vue";
import View from "./game/View.vue";
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
  <View
    v-if="
      screenStore.currentScreen == 'game' && modeStore.currentMode == 'view'
    "
  />
</template>
