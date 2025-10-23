import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise, GrammarExercise, isGrammarExercise } from '../../../models/exercise.model';
import { ProgressService } from '../../../services/progress.service';

@Component({
  selector: 'app-grammar-exercise',
  templateUrl: './grammar-exercise.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./grammar-exercise.component.css'],
})
export class GrammarExerciseComponent {
  @Input() exercises: Exercise[] = [];
  @Input() lessonId!: string;
  @Output() completed = new EventEmitter<any>();

  constructor(private progressService: ProgressService) {}
  getGrammarExercises(): GrammarExercise[] {
    return this.exercises.filter((ex) => isGrammarExercise(ex)) as GrammarExercise[];
  }

  formatContent(content: string): string {
    // Format bold text surrounded by **
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Format Chinese text in brackets
    formatted = formatted.replace(/『(.*?)』/g, '<span class="chinese-text">$1</span>');

    // Format pinyin in parentheses
    formatted = formatted.replace(/\((.*?)\)/g, '<span class="pinyin-text">($1)</span>');

    // Replace line breaks with paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = '<p>' + formatted + '</p>';

    return formatted;
  }

  getChineseExample(example: string): string {
    // Extract Chinese text from example
    const chineseMatch = example.match(/^(.*?)\s*[\(（]/);
    return chineseMatch ? chineseMatch[1].trim() : example;
  }

  getPinyinExample(example: string): string {
    // Extract pinyin from example
    const pinyinMatch = example.match(/[\(（](.*?)[\)）]/);
    return pinyinMatch ? pinyinMatch[1] : '';
  }

  getVietnameseExample(example: string): string {
    // Extract Vietnamese translation from example
    const parts = example.split(')');
    return parts.length > 1 ? parts[1].trim() : '';
  }
  markAsCompleted(exercise: GrammarExercise): void {
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
  isExerciseCompleted(exercise: GrammarExercise): boolean {
    return this.progressService.isExerciseCompleted(
      this.lessonId,
      exercise.categoryId,
      exercise.id
    );
  }
}
