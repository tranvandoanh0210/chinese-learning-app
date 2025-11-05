import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Exercise,
  VocabularyExercise,
  GrammarExercise,
  MultipleChoiceExercise,
  InputExercise,
  FlashcardExercise,
  DialogueExercise,
  WritingExercise,
  SpeakingExercise,
} from '../../../models/exercise.model';
import { Lesson, Category } from '../../../models/lesson.model';
import { AdminService } from '../../../services/admin.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ExerciseFormComponent implements OnInit {
  lesson: Lesson | undefined;
  category: Category | undefined;
  exercise: Partial<Exercise> = {
    type: 'vocabulary',
    question: '',
    answer: '',
    explanation: '',
  };

  isEditMode = false;
  lessonId: string = '';
  categoryId: string = '';
  exerciseId: string | null = null;
  loading = false;

  // All available exercise types với đầy đủ thông tin
  allExerciseTypes: {
    value: Exercise['type'];
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: 'vocabulary',
      label: 'Từ vựng',
      icon: '📖',
      description: 'Học từ vựng với pinyin và nghĩa',
    },
    { value: 'grammar', label: 'Ngữ pháp', icon: '📚', description: 'Bài tập ngữ pháp với ví dụ' },
    {
      value: 'multiple_choice',
      label: 'Trắc nghiệm',
      icon: '🔘',
      description: 'Câu hỏi nhiều lựa chọn',
    },
    { value: 'input', label: 'Nhập liệu', icon: '⌨️', description: 'Bài tập điền từ/câu' },
    { value: 'speaking', label: 'Luyện nói', icon: '🎤', description: 'Bài tập phát âm và nói' },
    { value: 'flashcard', label: 'Flashcard', icon: '🎴', description: 'Thẻ học từ vựng' },
    { value: 'dialogue', label: 'Hội thoại', icon: '💬', description: 'Đoạn hội thoại nhiều lượt' },
    { value: 'writing', label: 'Luyện viết', icon: '✍️', description: 'Bài tập viết chữ Hán' },
  ];

  // Exercise types available based on category type
  availableExerciseTypes: {
    value: Exercise['type'];
    label: string;
    icon: string;
    description: string;
  }[] = [];

  // Kiểm tra xem có thể edit exercise type hay không
  canEditExerciseType = false;

  // Dynamic form data
  formData: any = {
    // Vocabulary
    pinyin: '',

    // Grammar
    content: '',
    examples: [''],

    // Multiple Choice
    options: ['', ''],

    // Input
    placeholder: '',

    // Flashcard
    description: '',

    // Dialogue
    context: '',
    lines: [{ speaker: '', text: '', pinyin: '', translation: '' }],
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.lessonId = params['lessonId'];
      this.categoryId = params['categoryId'];
      this.exerciseId = params['exerciseId'];
      this.isEditMode = !!this.exerciseId;

      this.lesson = this.dataService.getLessonById(this.lessonId);
      if (this.lesson) {
        this.category = this.lesson.categories.find((cat) => cat.id === this.categoryId);
        if (this.category) {
          this.setupExerciseTypesByCategory();
          this.setDefaultExerciseType();

          if (this.isEditMode && this.exerciseId) {
            this.loadExercise();
          } else {
            this.initializeNewExercise();
          }
        }
      }
    });
  }

  // Thiết lập exercise types dựa trên category type
  private setupExerciseTypesByCategory(): void {
    if (!this.category) return;

    const categoryExerciseMap: { [key: string]: Exercise['type'][] } = {
      vocabulary: ['vocabulary'],
      grammar: ['grammar'],
      speaking: ['speaking'],
      test: ['multiple_choice', 'input'],
      review: ['flashcard'],
      writing: ['writing'],
      dialogue: ['dialogue'],
    };

    const allowedTypes = categoryExerciseMap[this.category.type] || ['vocabulary'];
    this.availableExerciseTypes = this.allExerciseTypes.filter((type) =>
      allowedTypes.includes(type.value)
    );

    // Cho phép edit exercise type chỉ khi:
    // 1. Không phải edit mode (đang tạo mới)
    // 2. Category có nhiều hơn 1 exercise type (ví dụ: test)
    this.canEditExerciseType = !this.isEditMode && this.availableExerciseTypes.length > 1;
  }

  // Set default exercise type dựa trên category - SỬ DỤNG Exercise['type']
  private setDefaultExerciseType(): void {
    if (!this.category) return;

    const defaultTypeMap: { [key: string]: Exercise['type'] } = {
      vocabulary: 'vocabulary',
      grammar: 'grammar',
      speaking: 'speaking',
      test: 'multiple_choice', // Mặc định là multiple_choice cho test
      review: 'flashcard',
      writing: 'writing',
      dialogue: 'dialogue',
    };

    const defaultType = defaultTypeMap[this.category.type];

    // Đảm bảo type safety bằng cách kiểm tra và gán đúng type
    if (defaultType) {
      this.exercise.type = defaultType;
    } else {
      this.exercise.type = 'vocabulary'; // Fallback
    }
  }

  // Khởi tạo exercise mới
  private initializeNewExercise(): void {
    this.formData = {
      pinyin: '',
      content: '',
      examples: [''],
      options: ['', ''],
      placeholder: '',
      description: '',
      context: '',
      lines: [{ speaker: '', text: '', pinyin: '', translation: '' }],
    };
  }

  loadExercise(): void {
    if (this.category && this.exerciseId) {
      const exercise = this.category.exercises.find((ex) => ex.id === this.exerciseId);
      if (exercise) {
        this.exercise = { ...exercise };
        this.loadFormData(exercise);

        // Khi edit, không cho phép thay đổi exercise type
        this.canEditExerciseType = false;
      }
    }
  }

  loadFormData(exercise: Exercise): void {
    // Reset form data
    this.formData = {
      pinyin: '',
      content: '',
      examples: [''],
      options: ['', ''],
      placeholder: '',
      description: '',
      context: '',
      lines: [{ speaker: '', text: '', pinyin: '', translation: '' }],
    };

    // Load specific data based on exercise type
    switch (exercise.type) {
      case 'vocabulary':
        const vocab = exercise as VocabularyExercise;
        this.formData.pinyin = vocab.pinyin || '';
        break;

      case 'grammar':
        const grammar = exercise as GrammarExercise;
        this.formData.content = grammar.content || '';
        this.formData.examples = grammar.examples?.length ? [...grammar.examples] : [''];
        break;

      case 'multiple_choice':
        const mc = exercise as MultipleChoiceExercise;
        this.formData.options = mc.options?.length ? [...mc.options] : ['', ''];
        break;

      case 'input':
        const input = exercise as InputExercise;
        this.formData.placeholder = input.placeholder || '';
        break;

      case 'flashcard':
        const flashcard = exercise as FlashcardExercise;
        this.formData.pinyin = flashcard.pinyin || '';
        break;

      case 'dialogue':
        const dialogue = exercise as DialogueExercise;
        this.formData.context = dialogue.context || '';
        this.formData.lines = dialogue.lines?.length
          ? dialogue.lines.map((line) => ({ ...line }))
          : [{ speaker: '', text: '', pinyin: '', translation: '' }];
        break;

      case 'writing':
        const writing = exercise as WritingExercise;
        this.formData.pinyin = writing.pinyin || '';
        break;

      case 'speaking':
        const speaking = exercise as SpeakingExercise;
        this.formData.pinyin = speaking.pinyin || '';
        break;
    }
  }

  onTypeChange(): void {
    // Reset form data khi type thay đổi
    this.initializeNewExercise();
  }

  // Array management methods
  addExample(): void {
    this.formData.examples.push('');
  }

  removeExample(index: number): void {
    if (this.formData.examples.length > 1) {
      this.formData.examples.splice(index, 1);
    }
  }

  addOption(): void {
    this.formData.options.push('');
  }

  removeOption(index: number): void {
    if (this.formData.options.length > 2) {
      this.formData.options.splice(index, 1);
    }
  }

  addDialogueLine(): void {
    this.formData.lines.push({ speaker: '', text: '', pinyin: '', translation: '' });
  }

  removeDialogueLine(index: number): void {
    if (this.formData.lines.length > 1) {
      this.formData.lines.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  saveExercise(): void {
    if (!this.exercise.question?.trim()) {
      alert('Vui lòng nhập câu hỏi');
      return;
    }

    if (!this.category) {
      alert('Không tìm thấy danh mục');
      return;
    }

    // Đảm bảo exercise type tồn tại
    if (!this.exercise.type) {
      alert('Loại bài tập không hợp lệ');
      return;
    }

    this.loading = true;

    const baseExercise = {
      id: this.exerciseId || this.generateId('ex'),
      categoryId: this.categoryId,
      type: this.exercise.type,
      question: this.exercise.question,
      answer: this.exercise.answer,
      explanation: this.exercise.explanation,
    };

    let exercise: Exercise;

    switch (this.exercise.type) {
      case 'vocabulary':
        exercise = {
          ...baseExercise,
          type: 'vocabulary',
          pinyin: this.formData.pinyin,
        } as VocabularyExercise;
        break;

      case 'grammar':
        exercise = {
          ...baseExercise,
          type: 'grammar',
          content: this.formData.content,
          examples: this.formData.examples.filter((ex: string) => ex.trim()),
        } as GrammarExercise;
        break;

      case 'multiple_choice':
        exercise = {
          ...baseExercise,
          type: 'multiple_choice',
          options: this.formData.options.filter((opt: string) => opt.trim()),
        } as MultipleChoiceExercise;
        break;

      case 'input':
        exercise = {
          ...baseExercise,
          type: 'input',
          placeholder: this.formData.placeholder,
        } as InputExercise;
        break;

      case 'speaking':
        exercise = {
          ...baseExercise,
          type: 'speaking',
          pinyin: this.formData.pinyin,
        } as SpeakingExercise;
        break;

      case 'flashcard':
        exercise = {
          ...baseExercise,
          type: 'flashcard',
          pinyin: this.formData.pinyin,
          description: this.formData.description,
        } as FlashcardExercise;
        break;

      case 'dialogue':
        exercise = {
          ...baseExercise,
          type: 'dialogue',
          context: this.formData.context,
          lines: this.formData.lines.filter(
            (line: any) => line.speaker.trim() && line.text.trim() && line.translation.trim()
          ),
        } as DialogueExercise;
        break;

      case 'writing':
        exercise = {
          ...baseExercise,
          type: 'writing',
          pinyin: this.formData.pinyin,
        } as WritingExercise;
        break;

      default:
        // Fallback to vocabulary nếu có lỗi
        exercise = {
          ...baseExercise,
          type: 'vocabulary',
          pinyin: this.formData.pinyin,
        } as VocabularyExercise;
    }

    if (this.isEditMode && this.exerciseId) {
      this.adminService.updateExercise(this.lessonId, this.categoryId, this.exerciseId, exercise);
    } else {
      this.adminService.addExercise(this.lessonId, this.categoryId, exercise);
    }

    setTimeout(() => {
      this.loading = false;
      this.router.navigate([
        '/admin/lessons',
        this.lessonId,
        'categories',
        this.categoryId,
        'exercises',
      ]);
    }, 500);
  }

  cancel(): void {
    this.router.navigate([
      '/admin/lessons',
      this.lessonId,
      'categories',
      this.categoryId,
      'exercises',
    ]);
  }

  getExerciseTypeIcon(type: string): string {
    const typeConfig = this.allExerciseTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.icon : '📝';
  }

  getExerciseTypeLabel(type: string): string {
    const typeConfig = this.allExerciseTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.label : type;
  }

  getExerciseTypeDescription(type: string): string {
    const typeConfig = this.allExerciseTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.description : '';
  }

  // Helper để hiển thị thông báo về giới hạn exercise type
  getExerciseTypeHelpText(): string {
    if (this.availableExerciseTypes.length === 1) {
      return `Danh mục "${this.getCategoryTypeName()}" chỉ hỗ trợ loại bài tập "${this.getExerciseTypeLabel(
        this.availableExerciseTypes[0].value
      )}"`;
    } else {
      return `Danh mục "${this.getCategoryTypeName()}" hỗ trợ ${
        this.availableExerciseTypes.length
      } loại bài tập`;
    }
  }

  getCategoryTypeName(): string {
    if (!this.category) return '';

    const nameMap: { [key: string]: string } = {
      vocabulary: 'Từ vựng',
      grammar: 'Ngữ pháp',
      dialogue: 'Hội thoại',
      writing: 'Luyện viết',
      test: 'Kiểm tra',
      review: 'Ôn tập',
      speaking: 'Luyện nói',
    };

    return nameMap[this.category.type] || this.category.type;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
