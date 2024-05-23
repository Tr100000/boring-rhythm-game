<script setup lang="ts">
import * as Tone from "tone";
import { setupBeat, setupClap, setupMetronome } from "./sounds";
import { ref } from "vue";

const audioStarted = ref<boolean>(false);

function start() {
  setupMetronome();
  setupBeat();
  setupClap();
  Tone.getTransport().start("+0.1");
  audioStarted.value = true;
}

start();
</script>

<template>
  <div></div>
</template>
