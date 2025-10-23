import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Exercise, SpeakingExercise, isSpeakingExercise } from '../../../models/exercise.model';
import { PronunciationResult, PronunciationService } from '../../../services/pronunciation.service';
import { SpeechRecognitionService } from '../../../services/speech-recognition.service';
import { SpeechService } from '../../../services/speech.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressService } from '../../../services/progress.service';
interface SpeakingState {
  isPlaying: boolean;
  isRecording: boolean;
  userSpeech: string;
  result?: PronunciationResult;
  isCompleted: boolean;
}

@Component({
  selector: 'app-speaking-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './speaking-exercise.component.html',
  styleUrls: ['./speaking-exercise.component.css'],
})
export class SpeakingExerciseComponent implements OnDestroy {
  @Input() exercises: Exercise[] = [];
  @Input() lessonId!: string;
  @Output() completed = new EventEmitter<any>();

  currentIndex = 0;
  speakingStates: SpeakingState[] = [];
  private recognitionSubscription: any;
  errorMessage: string | null = null;
  showErrorDialog = false;
  constructor(
    private progressService: ProgressService,
    private speechService: SpeechService,
    private speechRecognitionService: SpeechRecognitionService,
    private pronunciationService: PronunciationService
  ) {}

  ngOnInit() {
    this.initializeStates();
  }

  ngOnDestroy() {
    this.stopRecording();
    if (this.recognitionSubscription) {
      this.recognitionSubscription.unsubscribe();
    }
  }

  private initializeStates(): void {
    const speakingExercises = this.getSpeakingExercises();
    this.speakingStates = speakingExercises.map(() => ({
      isPlaying: false,
      isRecording: false,
      userSpeech: '',
      isCompleted: false,
    }));
  }

  getSpeakingExercises(): SpeakingExercise[] {
    return this.exercises.filter((ex) => isSpeakingExercise(ex)) as SpeakingExercise[];
  }

  get currentExercise(): SpeakingExercise | undefined {
    const exercises = this.getSpeakingExercises();
    return exercises[this.currentIndex];
  }

  get isLastExercise(): boolean {
    return this.currentIndex === this.getSpeakingExercises().length - 1;
  }

  getSpeakingState(index: number): SpeakingState {
    if (!this.speakingStates[index]) {
      this.speakingStates[index] = {
        isPlaying: false,
        isRecording: false,
        userSpeech: '',
        isCompleted: false,
      };
    }
    return this.speakingStates[index];
  }

  getCurrentState(): SpeakingState {
    return this.getSpeakingState(this.currentIndex);
  }

  updateCurrentState(updates: Partial<SpeakingState>): void {
    const currentState = this.getCurrentState();
    this.speakingStates[this.currentIndex] = { ...currentState, ...updates };
  }

  getRecordButtonText(): string {
    const state = this.getCurrentState();
    if (state.isRecording) return 'Đang ghi âm...';
    if (state.result?.matches) return 'Phát âm tốt!';
    if (state.result && !state.result.matches) return 'Thử lại';
    return 'Nhấn để nói';
  }
  getCategoryProgressPercentage(): number {
    const progress = this.progressService.getCategoryProgress(
      this.lessonId || '',
      this.currentExercise?.categoryId || ''
    );
    return progress?.exercises.filter((exercise) => exercise.completed).length ?? 0;
  }

  async playSampleAudio(text: string | undefined): Promise<void> {
    this.updateCurrentState({ isPlaying: true });
    try {
      if (text) await this.speechService.speakChinese(text);
    } catch (error) {
      console.error('Error playing sample audio:', error);
    } finally {
      this.updateCurrentState({ isPlaying: false });
    }
  }

  async playVietnameseAudio(text: string | undefined): Promise<void> {
    this.updateCurrentState({ isPlaying: true });
    try {
      if (text) await this.speechService.speakVietnamese(text);
    } catch (error) {
      console.error('Error playing Vietnamese audio:', error);
    } finally {
      this.updateCurrentState({ isPlaying: false });
    }
  }

  toggleRecording(expectedText: string | undefined): void {
    const state = this.getCurrentState();

    if (state.isRecording) {
      this.stopRecording();
    } else if (expectedText) {
      this.startRecording(expectedText);
    }
  }

  startRecording(expectedText: string): void {
    this.stopRecording(); // Stop any ongoing recording

    this.updateCurrentState({
      isRecording: true,
      userSpeech: '',
      result: undefined,
    });

    this.recognitionSubscription = this.speechRecognitionService.startListening().subscribe({
      next: (result: any) => {
        this.updateCurrentState({ userSpeech: result.transcript });

        if (result.isFinal) {
          this.assessPronunciation(expectedText, result.transcript);
        }
      },
      error: (error: any) => {
        console.error('Speech recognition error:', error);
        this.errorMessage =
          'Không thể khởi động ghi âm. Vui lòng kiểm tra micro hoặc quyền truy cập.\n' + error;
        this.showErrorDialog = true;
        this.updateCurrentState({ isRecording: false });
      },
      complete: () => {
        this.updateCurrentState({ isRecording: false });
      },
    });
  }

  stopRecording(): void {
    this.speechRecognitionService.stopListening();
    if (this.recognitionSubscription) {
      this.recognitionSubscription.unsubscribe();
      this.recognitionSubscription = null;
    }
  }

  private assessPronunciation(expectedText: string, userSpeech: string): void {
    const result = this.pronunciationService.assessPronunciation(userSpeech, expectedText);
    this.updateCurrentState({ result });

    if (result.matches) {
      this.updateCurrentState({ isCompleted: true });
      this.speakingExerciseComplete();
    }
  }

  tryAgain(): void {
    this.updateCurrentState({
      isPlaying: false,
      isRecording: false,
      userSpeech: '',
      result: undefined,
      isCompleted: false,
    });
  }

  nextExercise(): void {
    if (this.currentIndex < this.getSpeakingExercises().length - 1) {
      this.currentIndex++;
      this.stopRecording();
    }
  }

  previousExercise(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.stopRecording();
    }
  }

  goToExercise(index: number): void {
    if (index >= 0 && index < this.getSpeakingExercises().length) {
      this.currentIndex = index;
      this.stopRecording();
    }
  }
  closeErrorDialog(): void {
    this.showErrorDialog = false;
    this.errorMessage = null;
  }
  speakingExerciseComplete(): void {
    if (this.currentExercise) {
      this.completed.emit({
        exerciseId: this.currentExercise.id,
        type: this.currentExercise.type,
        completed: true,
      });
    }
  }
  isExerciseCompleted(exercise: SpeakingExercise): boolean {
    return this.progressService.isExerciseCompleted(
      this.lessonId,
      exercise.categoryId,
      exercise.id
    );
  }
}
