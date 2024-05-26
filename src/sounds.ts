import * as Tone from "tone";
import { loadedAudio, loadedPhrases } from "./load";
import { clap } from "./timing";

let metronomeHigh: Tone.Player;
let metronomeLow: Tone.Player;
export function setupMetronome() {
  const metronomeVolume = -4;

  metronomeHigh = new Tone.Player({
    url: loadedAudio.get("metronome_high"),
  }).toDestination();
  metronomeHigh.volume.value = metronomeVolume;
  metronomeLow = new Tone.Player({
    url: loadedAudio.get("metronome_low"),
  }).toDestination();
  metronomeLow.volume.value = metronomeVolume;
}

export function scheduleMetronome(time: Tone.Unit.Time, count = 4) {
  Tone.getTransport().schedule((time) => {
    for (let i = 0; i < count; i++) {
      (!(i % 4) ? metronomeHigh : metronomeLow).start(
        time + Tone.Time("4n").valueOf() * i,
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
  loadedPhrases.forEach((_phrase, i) => {
    const time = `${(i - 1) * 2}:0`;
    schedulePhrase(i, time, domCallback, noteHighlightDomCallback);
  });
  domCallback(loadedPhrases[1].svg);
}

export function schedulePhrase(
  index: number,
  time: Tone.Unit.Time,
  domCallback: (svg: string) => void,
  noteHighlightDomCallback: (noteIndex: number, highlight: boolean) => void,
  scheduleRepeat = true,
) {
  const phrase = loadedPhrases[index];

  phrase.scheduleNotes(time);
  phrase.scheduleNoteHighlights(time, noteHighlightDomCallback);
  scheduleMetronome(time, 4 * (+scheduleRepeat + 1));
  Tone.getTransport().schedule((time) => {
    Tone.getDraw().schedule(() => domCallback(phrase.svg), time);
  }, time);
}

class SoundPlayer {
  players: Tone.Player[] = [];

  constructor(public url?: string | AudioBuffer | Tone.ToneAudioBuffer) {
    this.url = url;
    this.addPlayer();
  }

  play() {
    const availablePlayers = this.players.filter(
      (player) => player.state == "stopped",
    );
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
