import * as Tone from "tone";
import { ref } from "vue";

export const loadedAudio = new Map<string, Tone.ToneAudioBuffer>();

export class LoadTask<T> implements PromiseLike<T> {
  promise;
  status = ref<"waiting" | "success" | "error">("waiting");

  result: T | undefined;
  error: any;

  constructor(promise: Promise<T>) {
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

  public getProgressValue(): number {
    return +(this.status.value == "success");
  }
}

export function loadAudio(
  url: string,
  loadedUrl: string = url,
): Promise<Tone.ToneAudioBuffer> {
  return new Promise((resolve) => {
    new Tone.ToneAudioBuffer(url, (buffer) => {
      loadedAudio.set(loadedUrl, buffer);
      resolve(buffer);
    });
  });
}

export function createLoadTasks(
  onLoadFinished?: (value: any[]) => void,
  onLoadError?: (reason: any) => void,
) {
  const tasks: LoadTask<any>[] = [];
  tasks.push(
    new LoadTask(loadAudio("/audio/metronome_high.ogg")),
    new LoadTask(loadAudio("/audio/metronome_low.ogg")),
    new LoadTask(loadAudio("/audio/metronome_high_alt.ogg")),
    new LoadTask(loadAudio("/audio/metronome_low_alt.ogg")),
    new LoadTask(loadAudio("/audio/beat.ogg")),
    new LoadTask(loadAudio("/audio/clap.ogg")),
  );
  tasks.push(new LoadTask(Tone.start()));

  //tasks.forEach((task) => task.then(() => console.log(tasks.indexOf(task))));

  Promise.all(tasks).then(onLoadFinished, onLoadError);

  return tasks;
}
