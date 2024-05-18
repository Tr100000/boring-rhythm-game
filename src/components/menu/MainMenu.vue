<script setup lang="ts">
import * as Tone from "tone";

async function load() {
  await Tone.start();
  console.log("Audio ready!");

  new Tone.Synth().toDestination().triggerAttackRelease("C4", "4n");
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
