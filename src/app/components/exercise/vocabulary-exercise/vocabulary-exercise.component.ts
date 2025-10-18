import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise, VocabularyExercise, isVocabularyExercise } from '../../../models/exercise.model';
import { SpeechService } from '../../../services/speech.service';

@Component({
  selector: 'app-vocabulary-exercise',
  templateUrl: './vocabulary-exercise.component.html',
  styleUrls: ['./vocabulary-exercise.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class VocabularyExerciseComponent implements OnDestroy {
  @Input() exercises: Exercise[] = [];
  @Output() completed = new EventEmitter<any>();
  isSpeaking = false;
  constructor(private speechService: SpeechService) {}
  ngOnDestroy() {
    this.speechService.stop();
  }
  getVocabularyExercises(): VocabularyExercise[] {
    return this.exercises.filter((ex) => isVocabularyExercise(ex)) as VocabularyExercise[];
  }

  async playChineseAudio(text: string): Promise<void> {
    if (this.isSpeaking) {
      this.stopAudio();
      return;
    }

    this.isSpeaking = true;
    try {
      await this.speechService.speakChinese(text);
    } catch (error) {
    } finally {
      this.isSpeaking = false;
    }
  }

  async playVietnameseAudio(text: string): Promise<void> {
    if (this.isSpeaking) return;

    this.isSpeaking = true;
    try {
      await this.speechService.speakVietnamese(text);
    } catch (error) {
    } finally {
      this.isSpeaking = false;
    }
  }

  stopAudio(): void {
    this.speechService.stop();
    this.isSpeaking = false;
  }
}
