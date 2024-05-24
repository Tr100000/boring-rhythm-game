import * as Tone from "tone";
import { loadedAudio } from "../load";

let metronomeRepeat: number;
export function setupMetronome() {
  const metronomeHigh = new Tone.Player({
    url: loadedAudio.get("/audio/metronome_high_alt.ogg"),
  }).toDestination();
  const metronomeLow = new Tone.Player({
    url: loadedAudio.get("/audio/metronome_low_alt.ogg"),
  }).toDestination();

  metronomeRepeat = Tone.getTransport().scheduleRepeat(
    (time) => {
      for (let i = 0; i < 4; i++) {
        (!i ? metronomeHigh : metronomeLow).start(
          time + Tone.Time("4n").valueOf() * i,
        );
      }
    },
    "1m",
    0,
  );
}

export let beatSoundPlayer: SoundPlayer;
export function setupBeat() {
  beatSoundPlayer = new SoundPlayer(loadedAudio.get("/audio/beat.ogg"));
}

export let clapSoundPlayer: SoundPlayer;
export function setupClap() {
  clapSoundPlayer = new SoundPlayer(loadedAudio.get("/audio/clap.ogg"));

  document.addEventListener("pointerdown", () => clapSoundPlayer.play());
  document.addEventListener("keydown", (e) => {
    if (!(e.repeat || e.altKey || e.ctrlKey || e.shiftKey)) {
      clapSoundPlayer.play();
    }
  });
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
