<script setup lang="ts">
import Debug from "./game/Debug.vue";
import Game from "./game/Game.vue";
import Results from "./game/Results.vue";
import LoadScreen from "./screens/LoadScreen.vue";
import MainMenu from "./screens/MainMenu.vue";
import { useGameStore } from "./stores/game";
import { useScreenStore } from "./stores/screen";

const screenStore = useScreenStore();
const gameStore = useGameStore();
</script>

<template>
  <MainMenu v-if="screenStore.currentScreen == 'menu'" />
  <LoadScreen v-if="screenStore.currentScreen == 'load'" />
  <Game v-if="screenStore.currentScreen == 'game' && !gameStore.isDebug" />
  <Debug v-if="screenStore.currentScreen == 'game' && gameStore.isDebug" />
  <Results v-if="screenStore.currentScreen == 'results'" />
</template>
