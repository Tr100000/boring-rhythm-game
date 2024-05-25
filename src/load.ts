import * as Tone from "tone";
import { ref } from "vue";
import { PhraseData, PhraseJson } from "./phrase";

export const loadedAudio = new Map<string, Tone.ToneAudioBuffer>();
export const loadedPhrases: PhraseData[] = [];

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
    return (
      this.childTasks.filter((task) => task.status.value == "success").length /
      this.childTasks.length
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
  const phraseCount = 6;
  const tasks: LoadTask<string>[] = [];
  for (let i = 1; i <= phraseCount; i++) {
    loadedPhrases[i] = new PhraseData();
    tasks.push(
      fileLoadTaskWithProcessing(`/phrases/${i}.json`, (value) => {
        const json = JSON.parse(value) as PhraseJson;
        loadedPhrases[i].notes = json.notes.map((note) => note / 2);
      }),
      fileLoadTaskWithProcessing(`/phrases/${i}.svg`, (value) => {
        loadedPhrases[i].svg = value;
      }),
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
        loadAudio("/audio/metronome_high.ogg", "metronome_high"),
        loadAudio("/audio/metronome_low.ogg", "metronome_low"),
        loadAudio("https://tonejs.github.io/audio/berklee/conga_4.mp3", "beat"),
        loadAudio("/audio/clap.ogg", "clap"),
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
