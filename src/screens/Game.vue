<script setup lang="ts">
import * as Tone from "tone";
import { loadedAudio } from "../load";

function start() {
  const metronomeHigh = new Tone.Player({
    url: loadedAudio.get("/audio/metronome_high.ogg"),
  }).toDestination();
  const metronomeLow = new Tone.Player({
    url: loadedAudio.get("/audio/metronome_low.ogg"),
  }).toDestination();

  for (let i = 0; i < 4; i++) {
    new Tone.Loop((time) => {
      (!i ? metronomeHigh : metronomeLow).start(time);
    }, "1m").start(Tone.Time("4n").valueOf() * i);
  }
  Tone.getTransport().start();
}
</script>

<template>
  <div>
    <button @click="start">Audio</button>
  </div>
</template>
