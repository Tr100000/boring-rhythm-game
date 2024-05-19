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
    <button @click="load">Play</button>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 1rem;
}
</style>
