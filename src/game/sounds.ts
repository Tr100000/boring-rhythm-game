import * as Tone from "tone";
import { loadedAudio } from "../load";

export const metronomeLoops: Tone.Loop[] = [];
export function setupMetronome() {
  if (metronomeLoops) {
    metronomeLoops.forEach((loop) => loop.stop());
  }

  const metronomeHigh = new Tone.Player({
    url: loadedAudio.get("/audio/metronome_high_alt.ogg"),
  }).toDestination();
  const metronomeLow = new Tone.Player({
    url: loadedAudio.get("/audio/metronome_low_alt.ogg"),
  }).toDestination();

  for (let i = 0; i < 4; i++) {
    metronomeLoops[i] = new Tone.Loop((time) => {
      (!i ? metronomeHigh : metronomeLow).start(time);
    }, "1m").start(Tone.Time("4n").valueOf() * i);
  }
}

export function setupClap() {
  const clap = new Tone.Player({
    url: loadedAudio.get("/audio/clap.ogg"),
  }).toDestination();
  document.addEventListener("pointerdown", () => {
    clap.start(Tone.getContext().currentTime);
  });
}
