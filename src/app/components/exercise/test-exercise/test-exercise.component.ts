import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exercise, InputExercise, MultipleChoiceExercise } from '../../../models/exercise.model';
import { CommonModule } from '@angular/common';
import { isInputExercise, isMultipleChoiceExercise } from '../../../models/exercise.model';
import { ProgressService } from '../../../services/progress.service';

@Component({
  selector: 'app-test-exercise',
  templateUrl: './test-exercise.component.html',
  styleUrls: ['./test-exercise.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TestExerciseComponent {
  @Input() exercises: Exercise[] = [];
  @Output() completed = new EventEmitter<any>();

  currentIndex = 0;
  userAnswers: (UserAnswer | null)[] = [];
  showResults = false;
  testStarted = false;

  // Timer properties
  elapsedTime: TestTimer = { minutes: 0, seconds: 0, totalSeconds: 0 };
  private timerInterval: any;
  private startTime: number = 0;

  get currentExercise(): Exercise {
    return this.exercises[this.currentIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentIndex === this.exercises.length - 1;
  }

  get correctCount(): number {
    return this.userAnswers.filter((answer) => answer?.isCorrect).length;
  }

  get incorrectCount(): number {
    return this.userAnswers.filter((answer) => answer && !answer.isCorrect).length;
  }

  ngOnInit() {
    this.initializeTest();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private initializeTest(): void {
    this.userAnswers = new Array(this.exercises.length).fill(null);
    this.elapsedTime = { minutes: 0, seconds: 0, totalSeconds: 0 };
  }

  startTest(): void {
    this.testStarted = true;
    this.startTimer();
  }

  startTimer(): void {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - this.startTime) / 1000);

      this.elapsedTime = {
        totalSeconds: diff,
        minutes: Math.floor(diff / 60),
        seconds: diff % 60,
      };
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(time: TestTimer): string {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds
      .toString()
      .padStart(2, '0')}`;
  }

  isMultipleChoiceExercise(exercise: Exercise): exercise is MultipleChoiceExercise {
    return isMultipleChoiceExercise(exercise);
  }

  isInputExercise(exercise: Exercise): exercise is InputExercise {
    return isInputExercise(exercise);
  }

  getMultipleChoiceOptions(exercise: MultipleChoiceExercise): string[] {
    return exercise.options || [];
  }

  getInputPlaceholder(exercise: InputExercise): string {
    return exercise.placeholder || 'Nhập đáp án của bạn...';
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getUserAnswer(index: number): string {
    return this.userAnswers[index]?.userAnswer || '';
  }

  getAnsweredCount(): number {
    return this.userAnswers.filter((answer) => answer !== null && answer.userAnswer !== '').length;
  }

  selectOption(option: string): void {
    if (!this.showResults) {
      if (!this.userAnswers[this.currentIndex]) {
        this.userAnswers[this.currentIndex] = {
          exerciseId: this.currentExercise.id,
          userAnswer: option,
          isCorrect: false,
          isAnswered: true,
        };
      } else {
        this.userAnswers[this.currentIndex]!.userAnswer = option;
      }
      this.checkAnswer(this.currentIndex);
    }
  }

  updateInputAnswer(event: any): void {
    if (!this.showResults) {
      const value = event.target.value;
      if (!this.userAnswers[this.currentIndex]) {
        this.userAnswers[this.currentIndex] = {
          exerciseId: this.currentExercise.id,
          userAnswer: value,
          isCorrect: false,
          isAnswered: true,
        };
      } else {
        this.userAnswers[this.currentIndex]!.userAnswer = value;
      }
    }
  }

  checkAnswer(index: number): void {
    const exercise = this.exercises[index];
    const userAnswer = this.userAnswers[index];

    if (userAnswer && exercise && exercise.answer) {
      const validAnswers = exercise.answer.split('|').map((ans: string) => ans.trim());
      const userAns = (userAnswer.userAnswer || '').trim();
      userAnswer.isCorrect = validAnswers.includes(userAns);
    }
  }

  isAnswerCorrect(index: number): boolean {
    return this.userAnswers[index]?.isCorrect || false;
  }

  nextQuestion(): void {
    if (this.currentIndex < this.exercises.length - 1) {
      this.currentIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submitTest(): void {
    this.stopTimer();
    // Check all answers before showing results
    this.exercises.forEach((_, index) => {
      this.checkAnswer(index);
    });
    this.showResults = true;
    this.testStarted = false;
    this.completed.emit({
      type: 'test',
      completed: true,
      data: [
        {
          total: this.exercises.length,
          correct: this.correctCount,
          incorrect: this.incorrectCount,
          timeSpent: this.formatTime(this.elapsedTime),
          score: this.getPoint(),
          completionDate: new Date(),
        },
      ],
    });
  }
  restartTest(): void {
    this.currentIndex = 0;
    this.userAnswers = new Array(this.exercises.length).fill(null);
    this.showResults = false;
    this.testStarted = false;
    this.elapsedTime = { minutes: 0, seconds: 0, totalSeconds: 0 };
  }

  getPercentage(): number {
    return Math.round((this.correctCount / this.exercises.length) * 100);
  }
  getPoint(): number {
    return (this.correctCount / this.exercises.length) * 10;
  }
}
