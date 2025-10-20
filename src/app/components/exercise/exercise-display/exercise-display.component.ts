import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../../models/lesson.model';
import { VocabularyExerciseComponent } from '../vocabulary-exercise/vocabulary-exercise.component';
import { TestExerciseComponent } from '../test-exercise/test-exercise.component';
import { GrammarExerciseComponent } from '../grammar-exercise/grammar-exercise.component';
import { ReviewExerciseComponent } from '../review-exercise/review-exercise.component';
import { CommonModule } from '@angular/common';
import { SpeakingExerciseComponent } from '../speaking-exercise/speaking-exercise.component';
import { WritingExerciseComponent } from '../writing-exercise/writing-exercise.component';
import { DialogueExerciseComponent } from '../dialogue-exercise/dialogue-exercise.component';

@Component({
  selector: 'app-exercise-display',
  templateUrl: './exercise-display.component.html',
  styleUrls: ['./exercise-display.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    VocabularyExerciseComponent,
    TestExerciseComponent,
    GrammarExerciseComponent,
    ReviewExerciseComponent,
    SpeakingExerciseComponent,
    WritingExerciseComponent,
    DialogueExerciseComponent,
  ],
})
export class ExerciseDisplayComponent {
  @Input() category!: Category;
  @Output() exerciseCompleted = new EventEmitter<any>();

  onCompleted(result: any) {
    this.exerciseCompleted.emit(result);
  }
}
