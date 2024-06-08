<script setup lang="ts">
import { StyleValue, computed, ref } from "vue";
import { LoadTask, createLoadTasks } from "../load";
import { useScreenStore } from "../stores/screen";

const screenStore = useScreenStore();
const tasks = ref<LoadTask<any>[]>(
  createLoadTasks(onLoadFinished, onLoadError),
);
const startTime = ref<number>(Date.now());
const errorDialog = ref<HTMLDialogElement>();

const currentState = computed(() => {
  if (!tasks.value) return "waiting";
  if (tasks.value.every((task) => task.status == "success")) {
    return "success";
  } else {
    return "waiting";
  }
});
const progress = computed(() => {
  if (!tasks.value) return 0;
  return (
    tasks.value.filter((task) => task.status == "success").length /
    tasks.value.length
  );
});
const progressStyle = computed<StyleValue>(() => {
  return { width: progress.value * 100 + "%" };
});
const progressClass = computed(() => `progress-${currentState.value}`);

function onLoadFinished() {
  const delta = Date.now() - startTime.value;
  console.log(`Finished loading in ${delta}ms`);
  setTimeout(() => {
    screenStore.setScreen("game");
  }, 500);
}

function onLoadError(reason: any) {
  console.error(reason);
  errorDialog.value!.showModal();
  errorDialog.value!.querySelector("p")!.innerHTML = reason;
}

function reload() {
  location.reload();
}
</script>

<template>
  <div id="root">
    <div id="progress">
      <div
        id="progressInner"
        :style="progressStyle"
        :class="progressClass"
      ></div>
    </div>
    <dialog ref="errorDialog">
      <p></p>
      <button autofocus @click="reload">Reload</button>
    </dialog>
  </div>
</template>

<style scoped>
#root {
  width: min(80vw, 900px);
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
  background-color: #106ecc;

  &.progress-error {
    background-color: red;
  }
}
</style>
