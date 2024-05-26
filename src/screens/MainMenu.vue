<script setup lang="ts">
import { Mode, useModeStore } from "../stores/mode";
import { useScreenStore } from "../stores/screen";

const showExtraModes = import.meta.env.DEV;

const screenStore = useScreenStore();
const modeStore = useModeStore();

async function load(mode: Mode) {
  screenStore.setScreen("load");
  modeStore.setMode(mode);
}
</script>

<template>
  <div>
    <h1>Boring Rhythm Game</h1>
    <button @click="load('play')">Play</button>
    <button v-if="showExtraModes" @click="load('view')">View</button>
  </div>
</template>

<style scoped>
h1 {
  margin-top: 0;
  margin-bottom: 24px;
}

button {
  font-size: 1.2em;
  margin: 4px;
}
</style>
