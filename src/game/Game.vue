<script setup lang="ts">
import * as Tone from "tone";
import { onMounted, ref } from "vue";
import {
  scheduleAllPhrases,
  setupBeat,
  setupClap,
  setupMetronome,
} from "../sounds";

const audioStarted = ref<boolean>(false);
const phrase = ref<HTMLDivElement>();

function start() {
  setupMetronome();
  setupBeat();
  setupClap();

  scheduleAllPhrases(phraseChangeCallback, noteHighlightCallback);

  Tone.getTransport().start("+0.1");
  audioStarted.value = true;
}

onMounted(() => {
  setTimeout(start, 1);
});

function phraseChangeCallback(value: string) {
  phrase.value!.innerHTML = value;
}

function noteHighlightCallback(noteIndex: number) {
  const notes = phrase.value!.querySelectorAll(".Note");
  notes.forEach((note, i) => {
    if (i == noteIndex) {
      note.classList.add("highlighted-note");
    } else {
      note.classList.remove("highlighted-note");
    }
  });
}
</script>

<template>
  <div ref="phrase" id="phrase"></div>
</template>

<style scoped>
#phrase {
  width: 80vw;
  max-width: 100%;
  height: 80vh;
  max-height: 100%;
}

div {
  fill: var(--color);
}
</style>

<style>
.highlighted-note {
  fill: blue;
  color: blue;
}
</style>
