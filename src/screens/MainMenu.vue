<script setup lang="ts">
import { useScreenStore } from "../stores/screen";

const store = useScreenStore();

async function load() {
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
