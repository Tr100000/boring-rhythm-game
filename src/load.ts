import * as Tone from "tone";
import { ref } from "vue";
import { Note, PhraseData, PhraseJson } from "./phrase";
import { GameMode, useGameStore } from "./stores/game";

export const loadedAudio = new Map<string, Tone.ToneAudioBuffer>();
export const loadedPhrases = new Map<GameMode, PhraseData[]>();
loadedPhrases.set("easy", []);
loadedPhrases.set("impossible", []);

export class LoadTask<T> implements PromiseLike<T> {
  status = ref<"waiting" | "success" | "error">("waiting");

  result: T | undefined;
  error: any;

  constructor(public promise: Promise<T>) {
    this.promise = promise;
    promise
      .then((value) => {
        this.result = value;
        this.status.value = "success";
      })
      .catch((reason) => {
        this.error = reason;
        this.status.value = "error";
        console.error(reason);
      });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  onFulfilled(callback: (value: T) => void): this {
    this.then(callback);
    return this;
  }

  public getProgressValue(): number {
    return +(this.status.value == "success");
  }
}

export class GroupLoadTask<T> extends LoadTask<T[]> {
  constructor(public childTasks: LoadTask<T>[]) {
    super(Promise.all(childTasks));
  }

  public getProgressValue(): number {
    return this.childTasks.reduce(
      (accumulator, task) =>
        accumulator + task.getProgressValue() / this.childTasks.length,
      0,
    );
  }
}

function processUrl(url: string) {
  return URL.canParse(url) || import.meta.env.DEV
    ? url
    : "/boring-rhythm-game" + url;
}

export function loadAudio(
  url: string,
  name: string,
): LoadTask<Tone.ToneAudioBuffer> {
  return new LoadTask(
    new Promise((resolve) => {
      new Tone.ToneAudioBuffer(processUrl(url), (buffer) => {
        loadedAudio.set(name, buffer);
        resolve(buffer);
        console.log(`Loaded ${name} sound from ${url}`);
      });
    }),
  );
}

export function fileLoadTask(url: string): LoadTask<string> {
  return new LoadTask(
    new Promise((resolve) => {
      fetch(processUrl(url)).then((r) => r.text().then(resolve));
    }),
  );
}

export function fileLoadTaskWithProcessing(
  url: string,
  processFunction: (value: string) => void,
): LoadTask<string> {
  return new LoadTask(
    new Promise((resolve) => {
      fetch(processUrl(url)).then((r) =>
        r.text().then((value) => {
          processFunction(value);
          resolve(value);
        }),
      );
    }),
  );
}

export function loadAllPhrases(): LoadTask<string>[] {
  const gameStore = useGameStore();
  const tasks: LoadTask<string>[] = [];
  for (let i = 1; i <= gameStore.getPhraseCount(); i++) {
    loadedPhrasesForCurrent()[i] = new PhraseData();
    tasks.push(
      fileLoadTaskWithProcessing(
        `/phrases/${gameStore.mode}/${i}.json`,
        (value) => {
          const json = JSON.parse(value) as PhraseJson;
          const getNoteStart = (note: Note | number) => {
            return typeof note === "number" ? note : note.start;
          };
          const phrase = loadedPhrasesForCurrent()[i];
          phrase.measures = json.measures;
          phrase.notes = json.notes.map((note, index, array) => {
            if (typeof note === "number") {
              return {
                start: note / 2,
                end:
                  index < array.length - 1
                    ? getNoteStart(array[index + 1]) / 2
                    : 2,
              };
            } else {
              return { start: note.start / 2, end: note.end / 2 };
            }
          });
          console.log(`Loaded phrase ${i} playback data`);
        },
      ),
      fileLoadTaskWithProcessing(
        `/phrases/${gameStore.mode}/${i}.svg`,
        (value) => {
          loadedPhrasesForCurrent()[i].svg = value;
          console.log(`Loaded phrase ${i} image data`);
        },
      ),
    );
  }
  return tasks;
}

export function createLoadTasks(
  onLoadFinished?: (value: any[]) => void,
  onLoadError?: (reason: any) => void,
) {
  try {
    const tasks: LoadTask<any>[] = [
      new GroupLoadTask([
        loadAudio("/audio/metronome_high.mp3", "metronome_high"),
        loadAudio("/audio/metronome_low.mp3", "metronome_low"),
        loadAudio("https://tonejs.github.io/audio/berklee/conga_4.mp3", "beat"),
        loadAudio("/audio/clap.mp3", "clap"),
      ]),
      new GroupLoadTask(loadAllPhrases()),
      new LoadTask(Tone.start()),
    ];

    Promise.all(tasks).then(onLoadFinished, onLoadError);
    return tasks;
  } catch (e: any) {
    if (onLoadError) {
      onLoadError(e);
    }
    return [];
  }
}

export function loadedPhrasesForCurrent() {
  return loadedPhrases.get(useGameStore().mode!)!;
}
