import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exercise, FlashcardExercise, isFlashcardExercise } from '../../../models/exercise.model';
import { SpeechService } from '../../../services/speech.service';
import { ProgressService } from '../../../services/progress.service';

@Component({
  selector: 'app-review-exercise',
  templateUrl: './review-exercise.component.html',
  styleUrls: ['./review-exercise.component.css'],
})
export class ReviewExerciseComponent {
  @Input() exercises: Exercise[] = [];
  @Input() lessonId!: string;
  @Output() completed = new EventEmitter<any>();
  isSpeaking = false;

  currentIndex = 0;
  isFlipped = false;
  constructor(private speechService: SpeechService, private progressService: ProgressService) {}
  ngOnDestroy() {
    this.speechService.stop();
  }
  getFlashcardExercises(): FlashcardExercise[] {
    return this.exercises.filter((ex) => isFlashcardExercise(ex)) as FlashcardExercise[];
  }

  get currentFlashcardExercise(): FlashcardExercise | undefined {
    const flashcards = this.getFlashcardExercises();
    return flashcards[this.currentIndex];
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  nextCard() {
    const flashcards = this.getFlashcardExercises();
    if (this.currentIndex < flashcards.length - 1) {
      if (this.currentFlashcardExercise) this.markAsCompleted(this.currentFlashcardExercise);
      this.currentIndex++;
      this.isFlipped = false;
      if (this.currentIndex === flashcards.length - 1) {
        this.markAsCompleted(flashcards[flashcards.length - 1]);
      }
    }
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.isFlipped = false;
    }
  }
  async playChineseAudio(text: string | undefined): Promise<void> {
    if (this.isSpeaking) {
      this.stopAudio();
      return;
    }

    this.isSpeaking = true;
    try {
      if (text) await this.speechService.speakChinese(text);
    } catch (error) {
    } finally {
      this.isSpeaking = false;
    }
  }
  stopAudio(): void {
    this.speechService.stop();
    this.isSpeaking = false;
  }
  markAsCompleted(exercise: FlashcardExercise): void {
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
  isExerciseCompleted(exercise: FlashcardExercise): boolean {
    return this.progressService.isExerciseCompleted(
      this.lessonId,
      exercise.categoryId,
      exercise.id
    );
  }
}
