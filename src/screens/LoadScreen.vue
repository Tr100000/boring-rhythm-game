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

function onLoadError(reason: any) {
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
      <div id="progressInner" :style="progressStyle"></div>
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
  background-color: rgb(16, 110, 204);
}

dialog[open] {
  opacity: 1;
  transform: scale(1);

  ::backdrop {
    background-color: (0 0 0 / 25%);

    @starting-style {
      background-color: transparent;
    }
  }

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}

dialog {
  opacity: 0;
  transform: scale(0.95);
  transition: all 200ms ease-out allow-discrete;

  ::backdrop {
    background-color: transparent;
    transition: all 200ms ease-out allow-discrete;
  }
}
</style>
