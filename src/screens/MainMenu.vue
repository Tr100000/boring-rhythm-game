<script setup lang="ts">
import { useModeStore } from "../stores/mode";
import { useScreenStore } from "../stores/screen";

const screenStore = useScreenStore();
const modeStore = useModeStore();

async function load(e: MouseEvent) {
  screenStore.setScreen("load");
  modeStore.setMode(e.shiftKey && e.metaKey ? "view" : "play");
}
</script>

<template>
  <div>
    <h1>Boring Rhythm Game</h1>
    <button @click="load">Play</button>
  </div>
</template>

<style scoped>
h1 {
  margin-top: 0;
  margin-bottom: 20px;
}

button {
  font-size: 1.2em;
  margin: 4px;
}
</style>
