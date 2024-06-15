<script setup lang="ts">
import * as Tone from "tone";
import { onMounted, ref } from "vue";
import {
  getTotalPhraseLength,
  scheduleAllPhrases,
  setupBeat,
  setupClap,
  setupMetronome,
} from "../sounds";
import { initTiming, displayedText } from "../timing";
import Phrase from "./Phrase.vue";
import { useGameStore } from "../stores/game";

const gameStore = useGameStore();

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

  Tone.getTransport().schedule(
    (time) => {
      Tone.getDraw().schedule(() => {
        scoreDialog.value!.showModal();
      }, time);
    },
    `${getTotalPhraseLength() * 2}:1`,
  );
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
  if (!note) {
    console.warn("No note found for highlighting!");
    return;
  }
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
    <p v-for="t in displayedText" :class="t.class">{{ t.text }}</p>
  </div>
  <dialog ref="scoreDialog">
    <p>Score: {{ gameStore.score }}</p>
  </dialog>
</template>

<style scoped>
#text {
  position: fixed;
  transform: translateY(-80px);
  display: flex;
  justify-content: center;

  p {
    position: absolute;
    text-align: center;
    font-size: 2em;
    bottom: 0;
    animation: 500ms linear 0s forwards fade;

    &.perfect {
      color: gold;
    }
    &.good {
      color: lime;
    }
    &.ok {
      color: turquoise;
    }
    &.miss {
      color: red;
    }
  }
}

@keyframes fade {
  to {
    transform: translateY(-40px);
    filter: opacity(0);
  }
}
</style>
