<script setup lang="ts">
import { StyleValue, computed, ref } from "vue";
import { LoadTask, createLoadTasks } from "../load";
import { useScreenStore } from "../stores/screen";

const screenStore = useScreenStore();
const tasks = ref<LoadTask<any>[]>(
  createLoadTasks(onLoadFinished),
);
const startTime = ref<number>(Date.now());

const currentState = computed(() => {
  if (tasks.value.every((task) => task.status == "success")) {
    return "success";
  } else if (tasks.value.some((task) => task.status == "error")) {
    return "error";
  } else {
    return "waiting";
  }
});
const progress = computed(() => {
  return (
    tasks.value.filter((task) => task.status == "success").length /
    tasks.value.length
  );
});
const progressStyle = computed(() => {
  const style: StyleValue = {};
  style.width = progress.value * 100 + "%";
  if (currentState.value == "error") {
    style.backgroundColor = "red";
  } else if (currentState.value == "success") {
    style.backgroundColor = "green";
  }
  return style;
});

function onLoadFinished() {
  const delta = Date.now() - startTime.value;
  console.log(`Finished loading in ${delta}ms`);
  setTimeout(() => {
    screenStore.setScreen("game");
  }, 500);
}
</script>

<template>
  <div id="root">
    <div id="progress">
      <div id="progressInner" :style="progressStyle"></div>
    </div>
  </div>
</template>

<style scoped>
#root {
  width: 80vw;
}

#progress {
  height: 8px;
  background-color: black;
}

#progressInner {
  margin: 0;
  padding: 0;
  height: 100%;
  border-radius: inherit;
  transition: width 100ms ease-out;
  background-color: rgb(16, 110, 204);
}
</style>
