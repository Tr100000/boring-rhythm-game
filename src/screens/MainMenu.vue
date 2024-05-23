<script setup lang="ts">
import { useScreenStore } from "../stores/screen";
import fscreen from "fscreen";

const store = useScreenStore();

async function load() {
  fscreen.requestFullscreen(document.documentElement);
  store.setScreen("load");
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
  margin-bottom: 24px;
}

button {
  font-size: 1.2em;
}
</style>
