import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise, VocabularyExercise, isVocabularyExercise } from '../../../models/exercise.model';
import { SpeechService } from '../../../services/speech.service';
import { ProgressService } from '../../../services/progress.service';

@Component({
  selector: 'app-vocabulary-exercise',
  templateUrl: './vocabulary-exercise.component.html',
  styleUrls: ['./vocabulary-exercise.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class VocabularyExerciseComponent implements OnDestroy {
  @Input() exercises: Exercise[] = [];
  @Input() lessonId!: string;
  @Output() completed = new EventEmitter<any>();
  isSpeaking = false;
  constructor(private speechService: SpeechService, private progressService: ProgressService) {}
  ngOnDestroy() {
    this.speechService.stop();
  }
  getVocabularyExercises(): VocabularyExercise[] {
    return this.exercises.filter((ex) => isVocabularyExercise(ex)) as VocabularyExercise[];
  }

  async playChineseAudio(text: string | undefined, exercise: VocabularyExercise): Promise<void> {
    if (this.isSpeaking) {
      this.stopAudio();
      return;
    }

    this.isSpeaking = true;
    try {
      if (text) await this.speechService.speakChinese(text);
      this.completeVocabulary(exercise);
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

  completeVocabulary(exercise: VocabularyExercise): void {
    if (!this.isExerciseCompleted(exercise)) {
      this.completed.emit({
        exerciseId: exercise.id,
        type: exercise.type,
        completed: true,
        data: {
          playedAll: true,
          completedAt: new Date(),
        },
      });
    }
  }
  isExerciseCompleted(exercise: VocabularyExercise): boolean {
    return this.progressService.isExerciseCompleted(
      this.lessonId,
      exercise.categoryId,
      exercise.id
    );
  }
}
