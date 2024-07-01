import * as Tone from "tone";
import { beatSoundPlayer } from "./sounds";

export class PhraseData {
  measures: number = 1;
  notes: Note[] = [];
  svg: string = "";

  scheduleNotes(time: Tone.Unit.Time) {
    Tone.getTransport().schedule((time) => {
      this.notes.forEach((note) => beatSoundPlayer.start(time + note.start));
    }, time);
  }

  scheduleNoteHighlights(
    time: Tone.Unit.Time,
    domCallback: (noteIndex: number, highlight: boolean) => void,
  ) {
    Tone.getTransport().schedule((time) => {
      this.notes.forEach((note, i) => {
        Tone.getDraw().schedule(
          () => domCallback(this.notes.indexOf(note), true),
          time + note.start + Tone.Time(0.01).valueOf() * +!i,
        );
        Tone.getDraw().schedule(
          () => domCallback(this.notes.indexOf(note), false),
          time + note.end,
        );
      });
    }, time);
  }
}

export class PhraseJson {
  measures!: number;
  timeSignature?: number[];
  notes!: (Note | number)[];
  events?: PhraseEvent[];
}
export type Note = { start: number; end: number };
export type PhraseEvent = TimeSignatureEvent;
export type PhraseEventBase<T extends string> = {
  type: T;
  time: number | undefined;
};
export type TimeSignatureEvent = PhraseEventBase<"timeSignature"> & {
  timeSignature: number[];
};
