<script setup lang="ts">
import * as Tone from "tone";
import { setupClap, setupMetronome } from "./sounds";
import { ref } from "vue";

const audioStarted = ref<boolean>(false);

function start() {
  setupMetronome();
  setupClap();
  Tone.getTransport().start("+0.1");
  audioStarted.value = true;
}
</script>

<template>
  <div>
    <button :disabled="audioStarted" @click="start">Audio</button>
  </div>
</template>
