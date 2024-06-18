<script setup lang="ts">
import { StyleValue, computed } from "vue";
import { useGameStore } from "../stores/game";

const gameStore = useGameStore();

const scoreStyle = computed<StyleValue>(() => {
  return { width: `${gameStore.getScorePercentage() * 100}%` };
});
const scoreInnerStyle = computed<StyleValue>(() => {
  return { animationDuration: `${gameStore.getScorePercentage() * 2}s` };
});

function update() {
  const scoreContainer = document.getElementById("scoreContainer")!;
  const scoreInner = document.getElementById("scoreInner")!;
  document.querySelector("#root p")!.textContent =
    `${gameStore.score > 0 ? Math.ceil((scoreInner.scrollWidth / scoreContainer.scrollWidth) * gameStore.score) : gameStore.score}`;
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
</script>

<template>
  <div id="root">
    <p></p>
    <div id="scoreBackground">
      <div id="scoreContainer" :style="scoreStyle">
        <div id="scoreInner" :style="scoreInnerStyle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#root {
  display: flex;
  flex-direction: column;
}

#scoreBackground,
#scoreBackground div {
  margin: 0;
  padding: 0;
  height: 8px;
}

#scoreBackground {
  width: 80vw;
  background-color: black;
  overflow: visible;
}

#scoreInner {
  animation-name: inner;
  animation-timing-function: linear;
  animation-delay: 1s;
  animation-fill-mode: both;
  background-color: #106ecc;
}

p {
  margin: 0;
  padding: 0;
  text-align: left;
  font-size: 1.5em;
}

@keyframes inner {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>
