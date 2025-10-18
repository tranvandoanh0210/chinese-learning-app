import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private synth: SpeechSynthesis;
  private isSupported: boolean;

  constructor() {
    this.synth = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
  }

  speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      lang?: string;
      voice?: SpeechSynthesisVoice;
    } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set options
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || 'zh-CN';

      // Try to find a Chinese voice
      if (!options.voice) {
        const voices = this.getVoices();
        const chineseVoice = voices.find(
          (voice) => voice.lang.startsWith('zh') || voice.lang.includes('Chinese')
        );
        if (chineseVoice) {
          utterance.voice = chineseVoice;
        }
      } else {
        utterance.voice = options.voice;
      }

      // Handle events
      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synth.speak(utterance);
    });
  }

  stop(): void {
    if (this.isSupported) {
      this.synth.cancel();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  // Method specifically for Chinese text
  async speakChinese(text: string, pinyin?: string): Promise<void> {
    return this.speak(text, {
      lang: 'zh-CN',
      rate: 0.7,
    });
  }

  // Method for Vietnamese text
  async speakVietnamese(text: string): Promise<void> {
    return this.speak(text, {
      lang: 'vi-VN',
      rate: 0.8,
    });
  }
}
