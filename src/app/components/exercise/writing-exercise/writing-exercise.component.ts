import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Exercise, WritingExercise, isWritingExercise } from '../../../models/exercise.model';
import { CommonModule } from '@angular/common';

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
  isCompleted: boolean;
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
export class WritingExerciseComponent implements AfterViewInit, OnDestroy {
  @Input() exercises: Exercise[] = [];
  @Output() completed = new EventEmitter<any>();
  @ViewChildren('writingCanvas') canvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  private canvasStates: CanvasState[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private readonly SIMILARITY_THRESHOLD = 0.7;
  isCompleted: boolean = false;
  ngAfterViewInit() {
    this.initializeCanvases();
    this.setupResizeObserver();
  }
  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
  // Canvas Methods (giữ nguyên từ code trước)
  private initializeCanvases(): void {
    this.canvasRefs.forEach((canvasRef, index) => {
      const canvas = canvasRef.nativeElement;
      this.setupCanvasSize(canvas);
      const ctx = canvas.getContext('2d')!;

      this.initializeCanvasContext(ctx);

      this.canvasStates[index] = {
        canvas,
        ctx,
        isDrawing: false,
        isCompleted: false,
        currentStrokes: [],
        strokeHistory: [],
        redoHistory: [],
      };
    });
  }
  private setupCanvasSize(canvas: HTMLCanvasElement): void {
    const container = canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';

    const scale = window.devicePixelRatio || 1;
    canvas.width = containerWidth * scale;
    canvas.height = containerHeight * scale;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const canvas = entry.target as HTMLCanvasElement;
        const index = this.getCanvasIndex(canvas);
        if (index !== -1) {
          this.setupCanvasSize(canvas);
          this.redrawCanvas(index);
        }
      });
    });

    this.canvasRefs.forEach((canvasRef) => {
      const container = canvasRef.nativeElement.parentElement;
      if (container) {
        this.resizeObserver?.observe(container);
      }
    });
  }
  private getCanvasIndex(canvas: HTMLCanvasElement): number {
    return this.canvasStates.findIndex((state) => state.canvas === canvas);
  }
  private initializeCanvasContext(ctx: CanvasRenderingContext2D): void {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
  }

  // Drawing Methods (giữ nguyên)
  onMouseDown(event: MouseEvent, index: number): void {
    event.preventDefault();
    const pos = this.getCanvasCoordinates(event, index);
    this.startDrawing(pos, index);
  }

  onMouseMove(event: MouseEvent, index: number): void {
    event.preventDefault();
    if (this.canvasStates[index]?.isDrawing) {
      const pos = this.getCanvasCoordinates(event, index);
      this.draw(pos, index);
    }
  }

  onMouseUp(index: number): void {
    this.stopDrawing(index);
  }
  onMouseLeave(index: number): void {
    this.stopDrawing(index);
  }

  onTouchStart(event: TouchEvent, index: number): void {
    event.preventDefault();
    const pos = this.getTouchCoordinates(event, index);
    this.startDrawing(pos, index);
  }

  onTouchMove(event: TouchEvent, index: number): void {
    event.preventDefault();
    if (this.canvasStates[index]?.isDrawing) {
      const pos = this.getTouchCoordinates(event, index);
      this.draw(pos, index);
    }
  }

  onTouchEnd(index: number): void {
    this.stopDrawing(index);
  }

  private getCanvasCoordinates(event: MouseEvent, index: number): Point {
    const state = this.canvasStates[index];
    if (!state) return { x: 0, y: 0 };

    const rect = state.canvas.getBoundingClientRect();
    const scaleX = state.canvas.width / (rect.width * window.devicePixelRatio);
    const scaleY = state.canvas.height / (rect.height * window.devicePixelRatio);

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }
  private getTouchCoordinates(event: TouchEvent, index: number): Point {
    const state = this.canvasStates[index];
    if (!state || event.touches.length === 0) return { x: 0, y: 0 };

    const rect = state.canvas.getBoundingClientRect();
    const scaleX = state.canvas.width / (rect.width * window.devicePixelRatio);
    const scaleY = state.canvas.height / (rect.height * window.devicePixelRatio);

    return {
      x: (event.touches[0].clientX - rect.left) * scaleX,
      y: (event.touches[0].clientY - rect.top) * scaleY,
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
    setTimeout(() => {
      state.isCompleted = true;
    }, 500);
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
    state.isCompleted = false;
    this.redrawCanvas(index);
  }

  redoStroke(index: number): void {
    const state = this.canvasStates[index];
    if (!state || state.redoHistory.length === 0) return;

    state.currentStrokes = state.redoHistory.pop()!;
    this.saveToHistory(index);
    state.isCompleted = false;
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

    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

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

  // Public Methods
  getWritingExercises(): WritingExercise[] {
    return this.exercises.filter((ex) => this.isWritingExercise(ex)) as WritingExercise[];
  }

  private isWritingExercise(exercise: Exercise): exercise is WritingExercise {
    return exercise.type === 'writing';
  }

  canUndo(index: number): boolean {
    const state = this.canvasStates[index];
    return state ? state.strokeHistory.length > 0 : false;
  }

  canRedo(index: number): boolean {
    const state = this.canvasStates[index];
    return state ? state.redoHistory.length > 0 : false;
  }
  isAllCharacterCompleted(): boolean {
    return this.canvasStates.every((state) => state?.isCompleted);
  }
  completeWriting(): void {
    this.isCompleted = true;
    this.completed.emit({
      type: 'writing',
      completed: true,
      data: [
        {
          completionDate: new Date(),
        },
      ],
    });
  }
  @HostListener('window:resize')
  onWindowResize(): void {
    setTimeout(() => {
      this.canvasRefs.forEach((canvasRef, index) => {
        this.setupCanvasSize(canvasRef.nativeElement);
        this.redrawCanvas(index);
      });
    }, 100);
  }
}
