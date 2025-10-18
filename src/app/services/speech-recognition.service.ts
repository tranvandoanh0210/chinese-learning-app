import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  private recognition: any;
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

    if (this.isSupported) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'zh-CN';
    }
  }

  startListening(): Observable<SpeechRecognitionResult> {
    return new Observable((observer) => {
      if (!this.isSupported) {
        observer.error(new Error('Speech recognition not supported'));
        return;
      }

      const handleResult = (event: any) => {
        const result = event.results[event.resultIndex];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        const isFinal = result.isFinal;

        observer.next({
          transcript,
          confidence,
          isFinal,
        });

        if (isFinal) {
          // Don't complete here, let onend handle it
        }
      };

      const handleError = (event: any) => {
        observer.error(new Error(`Speech recognition error: ${event.error}`));
      };

      const handleEnd = () => {
        observer.complete();
      };

      this.recognition.addEventListener('result', handleResult);
      this.recognition.addEventListener('error', handleError);
      this.recognition.addEventListener('end', handleEnd);

      this.recognition.start();

      // Cleanup function
      return () => {
        this.recognition.removeEventListener('result', handleResult);
        this.recognition.removeEventListener('error', handleError);
        this.recognition.removeEventListener('end', handleEnd);
        this.recognition.stop();
      };
    });
  }

  stopListening(): void {
    if (this.isSupported && this.recognition) {
      this.recognition.stop();
    }
  }

  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  setLanguage(lang: string): void {
    if (this.isSupported) {
      this.recognition.lang = lang;
    }
  }
}
