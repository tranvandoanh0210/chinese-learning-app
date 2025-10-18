import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise, GrammarExercise, isGrammarExercise } from '../../../models/exercise.model';

@Component({
  selector: 'app-grammar-exercise',
  templateUrl: './grammar-exercise.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./grammar-exercise.component.css'],
})
export class GrammarExerciseComponent {
  @Input() exercises: Exercise[] = [];
  @Output() completed = new EventEmitter<any>();

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

  getStructure(exercise: GrammarExercise): string {
    // Extract structure from content or use default
    const structureMatch = exercise.content?.match(/Cấu trúc.*?:?\s*\*\*(.*?)\*\*/);
    return structureMatch ? structureMatch[1] : '';
  }

  getStructureExplanation(exercise: GrammarExercise): string {
    // Extract structure explanation
    const content = exercise.content || '';
    if (content.includes('Cấu trúc cơ bản:')) {
      const parts = content.split('Cấu trúc cơ bản:');
      return parts[1]?.split('\n\n')[0] || '';
    }
    return '';
  }

  getUsageNotes(exercise: GrammarExercise): string | null {
    // Extract usage notes from content
    const content = exercise.content || '';
    if (content.includes('Cách sử dụng:')) {
      const parts = content.split('Cách sử dụng:');
      return parts[1]?.split('\n\n')[0] || null;
    }
    return null;
  }

  getNegativeForm(exercise: GrammarExercise): string | null {
    // Extract negative form from content
    const content = exercise.content || '';
    if (content.includes('Dạng phủ định')) {
      const parts = content.split('Dạng phủ định');
      return 'Dạng phủ định' + (parts[1]?.split('\n\n')[0] || '');
    }
    return null;
  }

  getStructureAnalysis(exercise: GrammarExercise): string | null {
    // Extract structure analysis from content
    const content = exercise.content || '';
    if (content.includes('Phân tích cấu trúc:')) {
      const parts = content.split('Phân tích cấu trúc:');
      return parts[1]?.split('\n\n')[0] || null;
    }
    return null;
  }

  getKeyPoints(exercise: GrammarExercise): string | null {
    // Extract key points from content
    const content = exercise.content || '';
    if (content.includes('Điểm quan trọng:')) {
      const parts = content.split('Điểm quan trọng:');
      return parts[1]?.split('\n\n')[0] || null;
    }
    return null;
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

  getDifficultyClass(exercise: GrammarExercise): string {
    switch (exercise.difficulty) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return 'difficulty-easy';
    }
  }

  getDifficultyText(exercise: GrammarExercise): string {
    switch (exercise.difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return 'Cơ bản';
    }
  }

  markAsCompleted(exercise: GrammarExercise): void {
    // In a real app, you would save this to a service
    console.log('Marked as completed:', exercise.id);

    // Emit completion event
    this.completed.emit({
      exerciseId: exercise.id,
      type: 'grammar',
      status: 'completed',
    });
  }
}
