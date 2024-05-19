<script setup lang="ts">
import Game from "./screens/Game.vue";
import LoadScreen from "./screens/LoadScreen.vue";
import MainMenu from "./screens/MainMenu.vue";
import { useScreenStore } from "./stores/screen";

const store = useScreenStore();
</script>

<template>
  <MainMenu v-if="store.currentScreen == 'menu'" />
  <LoadScreen v-if="store.currentScreen == 'load'" />
  <Game v-if="store.currentScreen == 'game'" />
</template>
