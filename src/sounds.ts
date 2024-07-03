import * as Tone from "tone";
import { loadedAudio, loadedPhrasesForCurrent } from "./load";
import { PhraseData } from "./phrase";
import { clap } from "./timing";

let metronomeHigh: Tone.Player;
let metronomeLow: Tone.Player;
export function setupMetronome() {
  const metronomeVolume = -8;

  metronomeHigh = new Tone.Player({
    url: loadedAudio.get("metronome_high"),
  }).toDestination();
  metronomeHigh.volume.value = metronomeVolume;
  metronomeLow = new Tone.Player({
    url: loadedAudio.get("metronome_low"),
  }).toDestination();
  metronomeLow.volume.value = metronomeVolume;
}

export function scheduleMetronome(time: Tone.Unit.Time, measures = 1, timeSignature = [4, 4]) {
  Tone.getTransport().schedule((time) => {
    for (let i = 0; i < timeSignature[0] * measures; i++) {
      (!(i % timeSignature[0]) ? metronomeHigh : metronomeLow).start(
        time + Tone.Time(`${timeSignature[1]}n`).valueOf() * i,
      );
    }
  }, time);
}

export let beatSoundPlayer: Tone.Player;
export function setupBeat() {
  beatSoundPlayer = new Tone.Player({
    url: loadedAudio.get("beat"),
  }).toDestination();
}

export let clapSoundPlayer: SoundPlayer;
export function setupClap() {
  clapSoundPlayer = new SoundPlayer(loadedAudio.get("clap"));

  document.addEventListener("pointerdown", () => clap());
  document.addEventListener("keydown", (e) => {
    if (!(e.repeat || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey)) {
      clap();
    }
  });
}

export function scheduleAllPhrases(
  domCallback: (svg: string) => void,
  noteHighlightDomCallback: (noteIndex: number, highlight: boolean) => void,
) {
  let time = 0;
  for (let i = 1; i < loadedPhrasesForCurrent().length; i++) {
    const phrase = loadedPhrasesForCurrent()[i];
    schedulePhrase(phrase, `${time}:0`, domCallback, noteHighlightDomCallback);
    time += phrase.measures * 2;
  }
  domCallback(loadedPhrasesForCurrent()[1].svg);
}

export function schedulePhrase(
  phrase: PhraseData,
  time: Tone.Unit.Time,
  domCallback: (svg: string) => void,
  noteHighlightDomCallback: (noteIndex: number, highlight: boolean) => void,
  scheduleRepeat = true,
) {
  phrase.scheduleNotes(time);
  phrase.scheduleNoteHighlights(time, noteHighlightDomCallback);
  scheduleMetronome(time, (1 + +scheduleRepeat) * phrase.measures);
  Tone.getTransport().schedule((time) => {
    Tone.getDraw().schedule(() => domCallback(phrase.svg), time);
  }, time);
}

export function getTotalPhraseLength() {
  return loadedPhrasesForCurrent().reduce((accumulator, phrase) => accumulator + phrase.measures, 0);
}

class SoundPlayer {
  players: Tone.Player[] = [];

  constructor(public url?: string | AudioBuffer | Tone.ToneAudioBuffer) {
    this.url = url;
    this.addPlayer();
  }

  play() {
    const availablePlayers = this.players.filter((player) => player.state == "stopped");
    if (availablePlayers.length == 0) {
      availablePlayers.push(this.addPlayer());
    }
    availablePlayers[0].start(Tone.getContext().currentTime);
  }

  addPlayer(): Tone.Player {
    const player = new Tone.Player({ url: this.url }).toDestination();
    this.players.push(player);
    return player;
  }
}
