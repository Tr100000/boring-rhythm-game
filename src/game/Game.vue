<script setup lang="ts">
import * as Tone from "tone";
import { onMounted, ref } from "vue";
import {
  scheduleAllPhrases,
  setupBeat,
  setupClap,
  setupMetronome,
} from "../sounds";
import { initTiming, score, displayedText } from "../timing";
import Phrase from "./Phrase.vue";
import ScoreText from "./ScoreText.vue";

const audioStarted = ref<boolean>(false);
const phrase = ref<InstanceType<typeof Phrase>>();
const scoreDialog = ref<HTMLDialogElement>();

function start() {
  setupMetronome();
  setupBeat();
  setupClap();

  initTiming();
  scheduleAllPhrases(phraseChangeCallback, noteHighlightCallback);

  Tone.getTransport().start("+0.1");
  audioStarted.value = true;

  Tone.getTransport().schedule((time) => {
    Tone.getDraw().schedule(() => {
      scoreDialog.value!.showModal();
    }, time);
  }, "12:2");
}

onMounted(() => {
  setTimeout(start, 1);
});

function phraseChangeCallback(value: string) {
  phrase.value!.setInnerHTML(value);
}

function noteHighlightCallback(noteIndex: number, highlight: boolean) {
  const notes = phrase.value!.querySelectorAll(".Note");
  const note = notes[noteIndex];
  if (highlight) {
    note.classList.add("highlighted-note");
  } else {
    note.classList.remove("highlighted-note");
  }
}
</script>

<template>
  <Phrase ref="phrase" />
  <div id="text">
    <ScoreText v-for="t in displayedText" :text="t.text" :color="t.color" />
  </div>
  <dialog ref="scoreDialog">
    <p>Score: {{ score }}</p>
  </dialog>
</template>

<style scoped>
#text {
  position: fixed;
  transform: translateY(-80px);
  display: flex;
  justify-content: center;
}
</style>
