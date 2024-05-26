<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps<{
  text: string;
}>();

const element = ref<HTMLParagraphElement>();

onMounted(() => {
  setTimeout(() => {
    element.value!.classList.add("fading");
  }, 1);
});
</script>
<template>
  <p ref="element">{{ text }}</p>
</template>

<style scoped>
p {
  position: absolute;
  text-align: center;
  font-size: 2em;
  bottom: 0;
  opacity: 1;
  transition: all 500ms linear;
}
p.fading {
  bottom: 40px;
  opacity: 0;
}
</style>
