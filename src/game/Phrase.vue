<script setup lang="ts">
import { ref } from "vue";

const phrase = ref<HTMLDivElement>();

function setInnerHTML(value: string) {
  phrase.value!.innerHTML = value;
}

function querySelectorAll(
  selector: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string,
) {
  return phrase.value!.querySelectorAll(selector);
}

function getInnerSVG() {
  return phrase.value!.querySelector("svg");
}

defineExpose({
  phrase,
  setInnerHTML,
  querySelectorAll,
  getInnerSVG,
});
</script>

<template>
  <div id="phrase" ref="phrase"></div>
</template>

<style scoped>
#phrase {
  width: 80vw;
  max-width: 100%;
  height: 80vh;
  max-height: 100%;
  fill: var(--color);
}
</style>
<style>
.highlighted-note {
  fill: var(--note-highlight-color);
  color: var(--note-highlight-color);
}
</style>
