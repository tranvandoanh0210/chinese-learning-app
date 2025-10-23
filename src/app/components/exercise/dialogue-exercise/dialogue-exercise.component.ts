import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Exercise,
  DialogueExercise,
  isDialogueExercise,
  DialogueLine,
} from '../../../models/exercise.model';
import { SpeechService } from '../../../services/speech.service';
import { ProgressService } from '../../../services/progress.service';

@Component({
  selector: 'app-dialogue-exercise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialogue-exercise.component.html',
  styleUrls: ['./dialogue-exercise.component.css'],
})
export class DialogueExerciseComponent {
  @Input() exercises: Exercise[] = [];
  @Input() lessonId!: string;
  @Output() completed = new EventEmitter<any>();

  isPlaying = false;

  constructor(private speechService: SpeechService, private progressService: ProgressService) {}

  getDialogueExercises(): DialogueExercise[] {
    return this.exercises.filter((ex) => isDialogueExercise(ex)) as DialogueExercise[];
  }

  async playLineAudio(text: string): Promise<void> {
    this.isPlaying = true;
    try {
      await this.speechService.speakChinese(text);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      this.isPlaying = false;
    }
  }

  async playAllDialogue(lines: DialogueLine[]): Promise<void> {
    this.isPlaying = true;

    try {
      for (const line of lines) {
        await this.speechService.speakChinese(line.text);
        // Wait a bit between lines for natural conversation pace
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('Error playing dialogue:', error);
    } finally {
      this.isPlaying = false;
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  markAsCompleted(exercise: DialogueExercise): void {
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
  isExerciseCompleted(exercise: DialogueExercise): boolean {
    return this.progressService.isExerciseCompleted(
      this.lessonId,
      exercise.categoryId,
      exercise.id
    );
  }
}
