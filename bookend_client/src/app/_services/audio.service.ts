import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Duration } from 'luxon';
import { AudioStreamState } from '../_models/audioStreamState';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject();
  private audioObject = new Audio();
  private audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];
  private state: AudioStreamState = {
    playing: false,
    playable: false,
    error: false,
    totalDuration: undefined,
    currentTime: undefined,
    readableCurrentTime: '',
    readableTotalDuration: '',
  };
  private stateChange: BehaviorSubject<AudioStreamState> = new BehaviorSubject(
    this.state
  );

  constructor() { }

  playStream(url: string) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObject.play();
  }

  pause() {
    this.audioObject.pause();
  }

  stop() {
    this.stop$.next(null); // I don't know if this is right
  }

  seekTo(seconds: number) {
    this.audioObject.currentTime = seconds;
  }

  formatTime(time: number, format: string = "hh:mm:ss") {
    var dur = Duration.fromObject({ seconds: time});
    return (dur.hours == 0) ? dur.toFormat('mm:ss') : dur.toFormat('hh:mm:ss');
  }

  getState(): Observable<AudioStreamState> {
    return this.stateChange.asObservable();
  }

  private streamObservable(url: string) {
    return new Observable(observer => {
      this.audioObject.src = url;
      this.audioObject.load();
      // this.audioObject.play();

      const eventHandler = (e: Event) => {
        this.updateStateEvents(e);
        observer.next(e);
      };

      this.addEvents(this.audioObject, this.audioEvents, eventHandler);
      return () => {
        this.audioObject.pause();
        this.audioObject.currentTime = 0;
        this.removeEvents(this.audioObject, this.audioEvents, eventHandler);
        this.resetState();
      };
    });
  }

  private addEvents(audioObject: HTMLAudioElement, events: string[], eventHandler: EventListener) {
    events.forEach(event => {
      audioObject.addEventListener(event, eventHandler);
    });
  }

  private removeEvents(audioObject: HTMLAudioElement, events: string[], eventHandler: EventListener) {
    events.forEach(event => {
      audioObject.removeEventListener(event, eventHandler);
    });
  }

  private updateStateEvents(e: Event): void {
    switch (e.type) {
      case "canplay":
        this.state.totalDuration = this.audioObject.duration;
        this.state.readableTotalDuration = this.formatTime(this.state.totalDuration);
        this.state.playable = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObject.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }

    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      playing: false,
      playable: false,
      error: false,
      totalDuration: undefined,
      currentTime: undefined,
      readableCurrentTime: '',
      readableTotalDuration: '',
    };
  }
}
