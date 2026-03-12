import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  playMusic (audioElement: HTMLAudioElement) {
    audioElement.play();
  }

  pauseMusic (audioElement: HTMLAudioElement) {
    audioElement.pause();
  }
  
}
