import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Exercise, WritingExercise, isWritingExercise } from '../../../models/exercise.model';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  isCompleted: boolean;
}
interface CanvasState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean;
  currentStrokes: Stroke[];
  strokeHistory: Stroke[][];
  redoHistory: Stroke[][];
}
@Component({
  selector: 'app-writing-exercise',
  templateUrl: './writing-exercise.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./writing-exercise.component.css'],
})
export class WritingExerciseComponent {
  @Input() exercises: Exercise[] = [];
  @Output() completed = new EventEmitter<any>();
  @ViewChildren('writingCanvas') canvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  private canvasStates: CanvasState[] = [];
  ngAfterViewInit() {
    this.initializeCanvases();
  }

  private initializeCanvases(): void {
    this.canvasRefs.forEach((canvasRef, index) => {
      const canvas = canvasRef.nativeElement;
      const ctx = canvas.getContext('2d')!;

      this.initializeCanvasContext(ctx);

      this.canvasStates[index] = {
        canvas,
        ctx,
        isDrawing: false,
        currentStrokes: [],
        strokeHistory: [],
        redoHistory: [],
      };
    });
  }

  private initializeCanvasContext(ctx: CanvasRenderingContext2D): void {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2c3e50';
  }

  getWritingExercises(): WritingExercise[] {
    return this.exercises.filter((ex) => isWritingExercise(ex)) as WritingExercise[];
  }

  getStrokeGif(character: string): string {
    return `assets/writing-guides/${character}.gif`;
  }

  // Các phương thức xử lý sự kiện với index
  onMouseDown(event: MouseEvent, index: number): void {
    this.startDrawing(this.getMousePos(event, index), index);
  }

  onMouseMove(event: MouseEvent, index: number): void {
    if (this.canvasStates[index]?.isDrawing) {
      this.draw(this.getMousePos(event, index), index);
    }
  }

  onMouseUp(index: number): void {
    this.stopDrawing(index);
  }

  onTouchStart(event: TouchEvent, index: number): void {
    event.preventDefault();
    const touch = event.touches[0];
    this.startDrawing(this.getTouchPos(touch, index), index);
  }

  onTouchMove(event: TouchEvent, index: number): void {
    event.preventDefault();
    if (this.canvasStates[index]?.isDrawing) {
      const touch = event.touches[0];
      this.draw(this.getTouchPos(touch, index), index);
    }
  }

  onTouchEnd(index: number): void {
    this.stopDrawing(index);
  }

  private getMousePos(event: MouseEvent, index: number): Point {
    const canvas = this.canvasStates[index].canvas;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private getTouchPos(touch: Touch, index: number): Point {
    const canvas = this.canvasStates[index].canvas;
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  private startDrawing(pos: Point, index: number): void {
    const state = this.canvasStates[index];
    if (!state) return;

    state.isDrawing = true;
    state.currentStrokes.push({
      points: [pos],
      isCompleted: false,
    });

    state.ctx.beginPath();
    state.ctx.moveTo(pos.x, pos.y);
  }

  private draw(pos: Point, index: number): void {
    const state = this.canvasStates[index];
    if (!state?.isDrawing || !state.currentStrokes.length) return;

    const currentStroke = state.currentStrokes[state.currentStrokes.length - 1];
    currentStroke.points.push(pos);

    state.ctx.lineTo(pos.x, pos.y);
    state.ctx.stroke();
  }

  private stopDrawing(index: number): void {
    const state = this.canvasStates[index];
    if (!state?.isDrawing || !state.currentStrokes.length) return;

    state.isDrawing = false;
    const currentStroke = state.currentStrokes[state.currentStrokes.length - 1];
    currentStroke.isCompleted = true;

    this.saveToHistory(index);
    state.redoHistory = [];
  }

  private saveToHistory(index: number): void {
    const state = this.canvasStates[index];
    if (!state) return;

    state.strokeHistory.push(JSON.parse(JSON.stringify(state.currentStrokes)));
  }

  undoStroke(index: number): void {
    const state = this.canvasStates[index];
    if (!state || state.strokeHistory.length === 0) return;

    state.redoHistory.push(JSON.parse(JSON.stringify(state.currentStrokes)));
    state.strokeHistory.pop();

    if (state.strokeHistory.length > 0) {
      state.currentStrokes = JSON.parse(
        JSON.stringify(state.strokeHistory[state.strokeHistory.length - 1])
      );
    } else {
      state.currentStrokes = [];
    }

    this.redrawCanvas(index);
  }

  redoStroke(index: number): void {
    const state = this.canvasStates[index];
    if (!state || state.redoHistory.length === 0) return;

    state.currentStrokes = state.redoHistory.pop()!;
    this.saveToHistory(index);
    this.redrawCanvas(index);
  }

  clearCanvas(index: number): void {
    const state = this.canvasStates[index];
    if (!state) return;

    state.currentStrokes = [];
    state.strokeHistory = [];
    state.redoHistory = [];
    this.redrawCanvas(index);
  }

  private redrawCanvas(index: number): void {
    const state = this.canvasStates[index];
    if (!state) return;

    // Clear canvas
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    // Redraw all strokes
    state.currentStrokes.forEach((stroke) => {
      if (stroke.points.length > 0) {
        state.ctx.beginPath();
        state.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let i = 1; i < stroke.points.length; i++) {
          state.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }

        state.ctx.stroke();
      }
    });
  }

  canUndo(index: number): boolean {
    const state = this.canvasStates[index];
    return state ? state.strokeHistory.length > 0 : false;
  }

  canRedo(index: number): boolean {
    const state = this.canvasStates[index];
    return state ? state.redoHistory.length > 0 : false;
  }

  completeWriting(exercise: WritingExercise): void {
    this.completed.emit({
      exerciseId: exercise.id,
      type: 'writing',
      status: 'completed',
    });
  }
}
