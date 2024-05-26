<script setup lang="ts">
import * as Tone from "tone";
import { onMounted, ref } from "vue";
import { loadedPhrases } from "../load";
import { schedulePhrase, setupBeat, setupMetronome } from "../sounds";
import Phrase from "./Phrase.vue";

const currentPhrase = ref(0);
const phrase = ref<InstanceType<typeof Phrase>>();

setupMetronome();
setupBeat();

onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") {
      switchPhrase(currentPhrase.value - 1);
    } else if (e.key == "ArrowRight") {
      switchPhrase(currentPhrase.value + 1);
    } else if (e.key == " " && Tone.getTransport().state != "started") {
      schedulePhrase(
        currentPhrase.value,
        0,
        () => {},
        noteHighlightCallback,
        false,
      );
      Tone.getTransport().start("+0.1", 0);
      Tone.getTransport().schedule((time) => {
        Tone.getTransport().stop(time);
        Tone.getTransport().cancel();
      }, "1:0");
    } else {
      const num = Number.parseInt(e.key);
      if (num) {
        switchPhrase(num);
      }
    }
  });
});

function switchPhrase(index: number) {
  if (
    index >= 1 &&
    index < loadedPhrases.length &&
    Tone.getTransport().state != "started"
  ) {
    currentPhrase.value = index;
    phrase.value!.setInnerHTML(loadedPhrases[index].svg);
  }
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

onMounted(() => {
  setTimeout(() => switchPhrase(1), 1);
});
</script>

<template>
  <Phrase ref="phrase" />
  <p>{{ currentPhrase }}</p>
</template>

<style scoped>
p {
  position: absolute;
  top: 0;
  left: 0;
  margin: 8px;
}
</style>
