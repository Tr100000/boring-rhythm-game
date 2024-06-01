import * as Tone from "tone";
import { ref } from "vue";
import { loadedPhrases } from "./load";
import { clapSoundPlayer } from "./sounds";

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
      addText(perfectText);
      score += perfectScore;
    } else if (Math.abs(timeOffset) < goodTime) {
      addText(goodText);
      score += goodScore;
    } else if (Math.abs(timeOffset) < okTime) {
      addText(okText);
      score += okScore;
    } else {
      addText(missText);
      score += missScore;
      note.done = false;
    }
  } else {
    addText(missText);
    score += missScore;
  }
}

export function addText(text: Text) {
  displayedText.value.push(text);
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

export type Text = {
  text: string;
  class: string;
};
