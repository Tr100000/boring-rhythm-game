<script setup lang="ts">
import { StyleValue, computed, ref } from "vue";

const currentState = ref<"working" | "error" | "finished">("working");
const value = ref(0);

const style = computed(() => {
  const innerStyle: StyleValue = {};
  innerStyle.width = value.value * 100 + "%";
  if (currentState.value == "error") {
    innerStyle.backgroundColor = "red";
  } else if (currentState.value == "finished") {
    innerStyle.backgroundColor = "green";
  }
  return innerStyle;
});

function setValue(newValue: number) {
  value.value = newValue;
}

function finish() {
  value.value = 1;
  currentState.value = "finished";
}

function fail() {
  value.value = 1;
  currentState.value = "error";
}

function reset() {
  value.value = 0;
  currentState.value = "working";
}

function getState() {
  return currentState.value;
}

defineExpose({
  setValue,
  finish,
  fail,
  reset,
  getState,
});
</script>

<template>
  <div id="progress">
    <div id="inner" :style></div>
  </div>
</template>

<style scoped>
#progress {
  height: 8px;
  background-color: black;
}

#inner {
  margin: 0;
  padding: 0;
  height: 100%;
  border-radius: inherit;
  transition: width 100ms ease-out;
  background-color: rgb(16, 110, 204);
}
</style>
