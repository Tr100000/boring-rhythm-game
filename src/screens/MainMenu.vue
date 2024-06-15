<script setup lang="ts">
import { ref } from "vue";
import { GameMode, useGameStore } from "../stores/game";
import { useScreenStore } from "../stores/screen";

const currentStep = ref(0);

const screenStore = useScreenStore();
const gameStore = useGameStore();

async function load(mode: GameMode, e: MouseEvent) {
  gameStore.mode = mode;
  gameStore.isDebug = e.shiftKey && e.metaKey;
  screenStore.setScreen("load");
}
</script>

<template>
  <div id="links">
    <a href="https://github.com/Tr100000/boring-rhythm-game">
      <img alt="Source" src="/images/github-mark-white.svg" />
    </a>
  </div>
  <div id="title" v-if="currentStep == 0">
    <h1>Boring Rhythm Game</h1>
    <button @click="currentStep++">Play</button>
  </div>
  <div id="mode-select" v-if="currentStep == 1">
    <button @click="(e) => load('easy', e)">Easy</button>
    <button @click="(e) => load('impossible', e)">Impossible</button>
  </div>
</template>

<style scoped>
div {
  &#links {
    position: fixed;
    top: 1em;
    right: 1em;
  }

  &#mode-select {
    display: flex;
    flex-direction: column;
  }
}

a img {
  width: 1.5em;
  height: 1.5em;
  opacity: 50%;
  transition: opacity 500ms;

  &:hover {
    opacity: 75%;
  }
}

h1 {
  margin-top: 0;
  margin-bottom: 20px;
}

button {
  margin: 4px;
}
</style>
