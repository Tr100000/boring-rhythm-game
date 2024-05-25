import * as Tone from "tone";
import { beatSoundPlayer } from "./sounds";

export class PhraseData {
  notes!: number[];
  svg!: string;

  scheduleNotes(time: Tone.Unit.Time) {
    Tone.getTransport().schedule((time) => {
      this.notes.forEach((note) => beatSoundPlayer.start(time + note));
    }, time);
  }

  scheduleNoteHighlights(
    time: Tone.Unit.Time,
    domCallback: (noteIndex: number) => void,
  ) {
    Tone.getTransport().schedule((time) => {
      [...this.notes, 2].forEach((note, i) => {
        Tone.getDraw().schedule(
          () => domCallback(this.notes.indexOf(note)),
          time + note + Tone.Time(0.01).valueOf() * +!i,
        );
      });
    }, time);
  }
}

export class PhraseJson {
  timeSignature?: number[];
  notes!: number[];
}
