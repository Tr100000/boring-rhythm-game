import * as Tone from "tone";
import { ref } from "vue";
import { loadedPhrasesForCurrent } from "./load";
import { clapSoundPlayer } from "./sounds";
import { useGameStore } from "./stores/game";

export const perfectTime = 0.1;
export const perfectScore = 100;
export const goodTime = 0.15;
export const goodScore = 50;
export const okTime = 0.25;
export const okScore = 25;
export const missScore = -50;

export const perfectText: Text = { text: "Perfect!", class: "perfect" };
export const goodText: Text = { text: "Good", class: "good" };
export const okText: Text = { text: "OK", class: "ok" };
export const missText: Text = { text: "Miss!", class: "miss" };

export let notes: NoteTiming[] = [];
export let displayedText = ref<Text[]>([]);

export function clap() {
  clapSoundPlayer.play();
  const currentTime = getCurrentTime().valueOf();
  const prevNote = notes
    .filter((note) => note.time < currentTime && !note.done)
    .at(-1);
  const nextNote = notes
    .filter((note) => note.time > currentTime && !note.done)
    .at(0);
  const note = prevNote?.done ? nextNote : prevNote;

  const gameStore = useGameStore();

  if (note) {
    const timeOffset = currentTime - note.time;
    console.log(timeOffset);
    note.done = true;

    if (Math.abs(timeOffset) < perfectTime) {
      addText(perfectText);
      gameStore.addScore(perfectScore);
    } else if (Math.abs(timeOffset) < goodTime) {
      addText(goodText);
      gameStore.addScore(goodScore);
    } else if (Math.abs(timeOffset) < okTime) {
      addText(okText);
      gameStore.addScore(okScore);
    } else {
      addText(missText);
      gameStore.addScore(missScore);
      note.done = false;
    }
  } else {
    addText(missText);
    gameStore.addScore(missScore);
  }
}

export function addText(text: Text) {
  displayedText.value.push(text);
}

export function initTiming() {
  const currentLoadedPhrases = loadedPhrasesForCurrent();
  let time = 0;
  for (let i = 1; i < currentLoadedPhrases.length; i++) {
    const phrase = currentLoadedPhrases[i];
    time += phrase.measures * 2;
    notes.push(
      ...phrase.notes.map((note) => {
        return { time: time + note.start, done: false } as NoteTiming;
      }),
    );
    time += phrase.measures * 2;
  }
}

export function getCurrentTime() {
  return Tone.Time(Tone.getTransport().position);
}

export type NoteTiming = {
  time: number;
  done: boolean;
};

export type Text = {
  text: string;
  class: string;
};
