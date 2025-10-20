import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {
  Exercise,
  VocabularyExercise,
  GrammarExercise,
  DialogueExercise,
  WritingExercise,
  MultipleChoiceExercise,
  InputExercise,
  SpeakingExercise,
  FlashcardExercise,
} from '../models/exercise.model';
import { Category, Lesson } from '../models/lesson.model';

export interface ExcelImportResult {
  success: boolean;
  lessons: Lesson[];
  errors: string[];
  warnings: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  async exportToExcel(lessons: Lesson[]): Promise<void> {
    const workbook = XLSX.utils.book_new();

    lessons.forEach((lesson) => {
      // Tạo sheet cho từng category type
      const categoryTypes = this.getUniqueCategoryTypes(lesson);
      categoryTypes.forEach((categoryType) => {
        const sheetData = this.prepareSheetData(lesson, categoryType);
        if (sheetData.length > 0) {
          const sheetName = `${lesson.name_vi} - ${this.getCategoryTypeName(categoryType)}`;
          const worksheet = this.createStyledWorksheet(sheetData, sheetName);
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        }
      });
    });

    XLSX.writeFile(workbook, 'chinese-learning-data.xlsx');
  }
  // Hàm tạo worksheet với styling
  private createStyledWorksheet(data: any[], sheetName: string): XLSX.WorkSheet {
    // Tạo worksheet từ data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Tính toán range của worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z1');

    // Style cho header row (row 1)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[cellAddress]) {
        // Thêm style cho header cell
        worksheet[cellAddress].s = {
          font: {
            bold: true,
            color: { rgb: 'FFFFFF' },
          },
          fill: {
            fgColor: { rgb: '4472C4' }, // Màu xanh đậm
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        };
      }
    }

    // Style cho data rows (từ row 2 trở đi)
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: {
              color: { rgb: '000000' },
            },
            fill: {
              fgColor: { rgb: row % 2 === 0 ? 'D9E1F2' : 'FFFFFF' }, // Zebra striping
            },
            alignment: {
              vertical: 'top',
              wrapText: true, // Cho phép text wrap
            },
            border: {
              top: { style: 'thin', color: { rgb: 'B4C6E7' } },
              left: { style: 'thin', color: { rgb: 'B4C6E7' } },
              bottom: { style: 'thin', color: { rgb: 'B4C6E7' } },
              right: { style: 'thin', color: { rgb: 'B4C6E7' } },
            },
          };
        }
      }
    }

    // Set column width ~300 (đơn vị là character width)
    const colWidth = 40; // ~300 pixels tương đương với 40 character width
    if (!worksheet['!cols']) {
      worksheet['!cols'] = [];
    }

    for (let col = range.s.c; col <= range.e.c; col++) {
      worksheet['!cols'][col] = { width: colWidth };
    }

    // Set row height cho header
    if (!worksheet['!rows']) {
      worksheet['!rows'] = [];
    }
    worksheet['!rows'][0] = { hpt: 25 }; // Header row height

    return worksheet;
  }

  async importFromExcel(file: File): Promise<ExcelImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      const errors: string[] = [];
      const warnings: string[] = [];

      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const lessons = this.parseWorkbook(workbook, errors, warnings);

          resolve({
            success: errors.length === 0,
            lessons,
            errors,
            warnings,
          });
        } catch (error) {
          resolve({
            success: false,
            lessons: [],
            errors: ['Lỗi đọc file: ' + error],
            warnings: [],
          });
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  private parseWorkbook(workbook: XLSX.WorkBook, errors: string[], warnings: string[]): Lesson[] {
    const lessonsMap = new Map<string, Lesson>();
    const sheetNames = workbook.SheetNames;

    sheetNames.forEach((sheetName: string) => {
      try {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Parse sheet name để lấy lesson name và category type
        const { lessonName, categoryType } = this.parseSheetName(sheetName);

        if (!lessonName || !categoryType) {
          warnings.push(`Sheet "${sheetName}" không theo định dạng chuẩn, bỏ qua`);
          return;
        }

        if (!lessonsMap.has(lessonName)) {
          lessonsMap.set(lessonName, this.createEmptyLesson(lessonName));
        }

        const lesson = lessonsMap.get(lessonName)!;
        const category = this.findOrCreateCategory(lesson, categoryType);
        const exercises = this.parseExercises(data, categoryType, errors, sheetName);

        category.exercises.push(...exercises);
      } catch (error) {
        errors.push(`Lỗi xử lý sheet ${sheetName}: ${error}`);
      }
    });

    return Array.from(lessonsMap.values());
  }

  private parseSheetName(sheetName: string): { lessonName: string; categoryType: string } {
    // Sheet name format: "Lesson Name - Category Type"
    const parts = sheetName.split(' - ');
    if (parts.length !== 2) {
      return { lessonName: '', categoryType: '' };
    }

    return {
      lessonName: parts[0].trim(),
      categoryType: this.normalizeCategoryType(parts[1].trim()),
    };
  }

  private normalizeCategoryType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'Từ vựng': 'vocabulary',
      'Ngữ pháp': 'grammar',
      'Hội thoại': 'dialogue',
      'Luyện viết': 'writing',
      'Kiểm tra': 'test',
      'Ôn tập': 'review',
      'Luyện nói': 'speaking',
      vocabulary: 'vocabulary',
      grammar: 'grammar',
      dialogue: 'dialogue',
      writing: 'writing',
      test: 'test',
      review: 'review',
      speaking: 'speaking',
    };

    return typeMap[type] || type.toLowerCase();
  }

  private createEmptyLesson(lessonName: string): Lesson {
    return {
      id: this.generateId('lesson'),
      name_zh: '', // Có thể để empty hoặc tự động generate
      name_vi: lessonName,
      description: `Bài học ${lessonName}`,
      order: 1, // Sẽ được tính toán sau
      categories: [],
    };
  }

  private findOrCreateCategory(lesson: Lesson, categoryType: string): Category {
    let category = lesson.categories.find((cat) => cat.type === categoryType);

    if (!category) {
      category = {
        id: this.generateId('category'),
        lessonId: lesson.id,
        type: categoryType as any,
        name: this.getCategoryTypeName(categoryType),
        description: `Bài tập ${this.getCategoryTypeName(categoryType)}`,
        order: lesson.categories.length + 1,
        exercises: [],
      };
      lesson.categories.push(category);
    }

    return category;
  }

  private parseExercises(
    data: any[],
    categoryType: string,
    errors: string[],
    sheetName: string
  ): Exercise[] {
    const exercises: Exercise[] = [];

    data.forEach((row, index) => {
      try {
        const baseExercise = {
          id: this.generateId('ex'),
          categoryId: '', // Sẽ được set sau
          type: categoryType,
          question: row.question || '',
          description: row.description || '',
          answer: row.answer || '',
          explanation: row.explanation || '',
        };

        let exercise: Exercise | null;

        switch (categoryType) {
          case 'vocabulary':
            exercise = {
              ...baseExercise,
              type: 'vocabulary',
              pinyin: row.pinyin || '',
            } as VocabularyExercise;
            break;

          case 'grammar':
            exercise = {
              ...baseExercise,
              type: 'grammar',
              content: row.content || '',
              examples: row.examples ? row.examples.split('|') : [],
            } as GrammarExercise;
            break;

          case 'test':
            // QUAN TRỌNG: Xử lý test exercises dựa trên type
            exercise = this.parseTestExercise(row, baseExercise, errors, sheetName, index);
            if (!exercise) return; // Nếu không parse được thì bỏ qua
            break;

          case 'review':
            exercise = {
              ...baseExercise,
              type: 'flashcard',
              pinyin: row.pinyin || '',
            } as FlashcardExercise;
            break;

          case 'speaking':
            exercise = {
              ...baseExercise,
              type: 'speaking',
              pinyin: row.pinyin || '',
            } as SpeakingExercise;
            break;

          case 'writing':
            exercise = {
              ...baseExercise,
              type: 'writing',
              character: row.character || '',
              pinyin: row.pinyin || '',
              meaning: row.meaning || '',
            } as WritingExercise;
            break;

          case 'dialogue':
            // Xử lý đặc biệt cho dialogue - sẽ xử lý riêng
            return;

          // case 'flashcard':
          //   exercise = {
          //     ...baseExercise,
          //     type: 'flashcard',
          //     pinyin: row.pinyin || '',
          //   } as FlashcardExercise;
          //   break;

          default:
            errors.push(
              `Sheet ${sheetName} - Dòng ${index + 2}: Loại exercise không hỗ trợ: ${categoryType}`
            );
            return;
        }

        if (exercise) {
          exercises.push(exercise);
        }
      } catch (error) {
        errors.push(`Sheet ${sheetName} - Dòng ${index + 2}: ${error}`);
      }
    });

    return exercises;
  }

  // Thêm hàm parseTestExercise
  private parseTestExercise(
    row: any,
    baseExercise: any,
    errors: string[],
    sheetName: string,
    index: number
  ): Exercise | null {
    const exerciseType = row.type || 'multiple_choice'; // Mặc định là multiple_choice

    switch (exerciseType) {
      case 'multiple_choice':
        if (!row.options) {
          errors.push(
            `Sheet ${sheetName} - Dòng ${index + 2}: Multiple choice exercise thiếu options`
          );
          return null;
        }
        return {
          ...baseExercise,
          type: 'multiple_choice',
          options: row.options.split('|').map((opt: string) => opt.trim()),
        } as MultipleChoiceExercise;

      case 'input':
        return {
          ...baseExercise,
          type: 'input',
          placeholder: row.placeholder || '',
        } as InputExercise;

      case 'vocabulary':
        return {
          ...baseExercise,
          type: 'vocabulary',
          pinyin: row.pinyin || '',
        } as VocabularyExercise;

      default:
        errors.push(
          `Sheet ${sheetName} - Dòng ${index + 2}: Loại test exercise không hỗ trợ: ${exerciseType}`
        );
        return null;
    }
  }

  // Xử lý đặc biệt cho Dialogue (cần group theo context)
  private parseDialogueSheet(data: any[], sheetName: string, errors: string[]): Exercise[] {
    const dialogues = new Map<string, DialogueExercise>();

    data.forEach((row, index) => {
      try {
        if (!row.context || !row.speaker || !row.text) {
          errors.push(`Sheet ${sheetName} - Dòng ${index + 2}: Thiếu context, speaker hoặc text`);
          return;
        }

        const context = row.context;
        if (!dialogues.has(context)) {
          dialogues.set(context, {
            id: this.generateId('dialogue'),
            categoryId: '', // Sẽ set sau
            type: 'dialogue',
            question: context,
            description: `Hội thoại: ${context}`,
            answer: 'Hội thoại hoàn thành',
            explanation: '',
            lines: [],
          });
        }

        const dialogue = dialogues.get(context)!;
        dialogue.lines.push({
          speaker: row.speaker,
          text: row.text,
          pinyin: row.pinyin || '',
          translation: row.translation || '',
        });
      } catch (error) {
        errors.push(`Sheet ${sheetName} - Dòng ${index + 2}: ${error}`);
      }
    });

    return Array.from(dialogues.values());
  }

  private getUniqueCategoryTypes(lesson: Lesson): string[] {
    const types = lesson.categories.map((cat) => cat.type);
    return [...new Set(types)];
  }

  private prepareSheetData(lesson: Lesson, categoryType: string): any[] {
    const category = lesson.categories.find((cat) => cat.type === categoryType);
    if (!category) return [];

    return category.exercises
      .map((exercise) => {
        const baseData = {
          question: exercise.question,
          description: exercise.description,
          answer: exercise.answer,
        };

        switch (categoryType) {
          case 'vocabulary':
            const vocab = exercise as VocabularyExercise;
            return { ...baseData, pinyin: vocab.pinyin };

          case 'grammar':
            const grammar = exercise as GrammarExercise;
            return {
              ...baseData,
              explanation: grammar.explanation,
              content: grammar.content,
              examples: grammar.examples?.join('|'),
            };
          case 'test':
            return this.prepareTestExerciseData(exercise, baseData);

          case 'review':
            const review = exercise as FlashcardExercise;
            return {
              ...baseData,
              pinyin: review.pinyin,
            };

          case 'speaking':
            const speaking = exercise as SpeakingExercise;
            return {
              ...baseData,
              pinyin: speaking.pinyin,
            };

          case 'writing':
            const writing = exercise as WritingExercise;
            return {
              ...baseData,
              character: writing.character,
              pinyin: writing.pinyin,
              meaning: writing.meaning,
            };

          case 'dialogue':
            // Xử lý đặc biệt - mỗi line là 1 row
            return this.prepareDialogueData(exercise as DialogueExercise);

          default:
            return baseData;
        }
      })
      .flat();
  }
  private prepareTestExerciseData(exercise: Exercise, baseData: any): any {
    switch (exercise.type) {
      case 'multiple_choice':
        const mc = exercise as MultipleChoiceExercise;
        return {
          ...baseData,
          type: 'multiple_choice', // Thêm type để phân biệt khi import
          options: mc.options?.join('|') || '',
          explanation: mc.explanation || '',
        };

      case 'input':
        const input = exercise as InputExercise;
        return {
          ...baseData,
          type: 'input', // Thêm type để phân biệt khi import
          placeholder: input.placeholder || '',
          explanation: input.explanation || '',
        };
      default:
        return {
          ...baseData,
          type: exercise.type,
        };
    }
  }
  private prepareDialogueData(dialogue: DialogueExercise): any[] {
    return dialogue.lines.map((line) => ({
      speaker: line.speaker,
      text: line.text,
      pinyin: line.pinyin,
      translation: line.translation,
    }));
  }

  private getCategoryTypeName(type: string): string {
    const nameMap: { [key: string]: string } = {
      vocabulary: 'Từ vựng',
      grammar: 'Ngữ pháp',
      dialogue: 'Hội thoại',
      writing: 'Luyện viết',
      test: 'Kiểm tra',
      review: 'Ôn tập',
      speaking: 'Luyện nói',
    };

    return nameMap[type] || type;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
