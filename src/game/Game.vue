<script setup lang="ts">
import * as Tone from "tone";
import { ref } from "vue";
import { setupBeat, setupClap, setupMetronome } from "./sounds";

const audioStarted = ref<boolean>(false);
const sheetMusic = ref<HTMLDivElement>();

function start() {
  setupMetronome();
  setupBeat();
  setupClap();
  Tone.getTransport().start("+0.1");
  audioStarted.value = true;

  fetch("/levels/6.svg").then((blob) =>
    blob.text().then((text) => (sheetMusic.value!.innerHTML = text)),
  );
}

start();
</script>

<template>
  <div v-if="audioStarted" ref="sheetMusic"></div>
</template>

<style scoped>
div {
  fill: var(--color);
}
</style>
