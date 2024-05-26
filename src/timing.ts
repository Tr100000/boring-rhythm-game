import * as Tone from "tone";
import { loadedPhrases } from "./load";
import { clapSoundPlayer } from "./sounds";
import { ref } from "vue";

export const perfectTime = 0.1;
export const perfectScore = 100;
export const goodTime = 0.15;
export const goodScore = 50;
export const okTime = 0.25;
export const okScore = 25;
export const missScore = -50;

export let notes: NoteTiming[] = [];
export let text = ref<string[]>([]);
export let score = 0;

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

  if (note) {
    const timeOffset = getCurrentTime().valueOf() - note.time;
    note.done = true;

    if (Math.abs(timeOffset) < perfectTime) {
      text.value.push("Perfect!");
      score += perfectScore;
    } else if (Math.abs(timeOffset) < goodTime) {
      text.value.push("Good");
      score += goodScore;
    } else if (Math.abs(timeOffset) < okTime) {
      text.value.push("OK");
      score += okScore;
    } else {
      text.value.push("Miss!");
      score += missScore;
      note.done = false;
    }
  } else {
    text.value.push("Miss!");
    score += missScore;
  }
}

export function initTiming() {
  loadedPhrases.forEach((phrase, index) => {
    notes.push(
      ...phrase.notes.map((note) => {
        return { time: note.start + index * 4 - 2, done: false } as NoteTiming;
      }),
    );
  });
}

export function getCurrentTime() {
  return Tone.Time(Tone.getTransport().position);
}

export type NoteTiming = {
  time: number;
  done: boolean;
};
