import { Lesson } from '../app/models/lesson.model';

export const SAMPLE_DATA: Lesson[] = [
  {
    id: 'lesson-1',
    name_zh: '问候',
    name_vi: 'Chào hỏi',
    description: 'Học cách chào hỏi cơ bản trong tiếng Trung',
    order: 1,
    categories: [
      {
        id: 'cat-1-1',
        lessonId: 'lesson-1',
        type: 'vocabulary',
        name: 'Từ vựng',
        description: 'Học từ vựng chào hỏi',
        order: 1,
        exercises: [
          {
            id: 'ex-1-1-1',
            categoryId: 'cat-1-1',
            type: 'vocabulary',
            question: '你好',
            answer: 'Xin chào',
            pinyin: 'nǐ hǎo',
          },
          {
            id: 'ex-1-1-2',
            categoryId: 'cat-1-1',
            type: 'vocabulary',
            question: '谢谢',
            answer: 'Cảm ơn',
            pinyin: 'xiè xie',
          },
        ],
      },
      {
        id: 'cat-1-2',
        lessonId: 'lesson-1',
        type: 'grammar',
        name: 'Ngữ pháp',
        description: 'Ngữ pháp cơ bản',
        order: 2,
        exercises: [
          {
            id: 'ex-1-2-1',
            categoryId: 'cat-1-2',
            type: 'grammar',
            question: 'Câu có động từ "是" (shì)',
            description: 'Cấu trúc câu cơ bản với động từ "là"',
            explanation:
              'Đây là một trong những cấu trúc câu cơ bản và quan trọng nhất trong tiếng Hán.',
            content: `Động từ '是' (shì) - 'là' được dùng để nối hai danh từ, đại từ hoặc cụm danh từ, biểu thị sự tương đồng hoặc xác định.

Cấu trúc cơ bản: **Chủ ngữ + 是 + Tân ngữ**.

Đây là một trong những cấu trúc câu cơ bản và quan trọng nhất trong tiếng Hán. Nó tương đương với động từ "to be" trong tiếng Anh.

Cách sử dụng: Dùng để giới thiệu bản thân, nghề nghiệp, quốc tịch, hoặc xác định mối quan hệ giữa các sự vật, sự việc.

Dạng phủ định là '不是' (bú shì), trong đó '不' (bù) khi đứng trước một từ mang thanh 4 sẽ biến điệu thành thanh 2 (bú).

Phân tích cấu trúc:
- **Chủ ngữ (Subject)**: Người hoặc vật thực hiện hành động (ví dụ: 我, 他).
- **Vị ngữ (Predicate)**: Phần mô tả chủ ngữ, ở đây là '是 + Tân ngữ'.
- **Tân ngữ (Object)**: Đối tượng được đề cập đến (ví dụ: 法国人, 老师).

Điểm quan trọng:
- Không dùng '是' với tính từ (dùng 很 thay thế)
- '是' luôn đứng sau chủ ngữ và trước tân ngữ
- Trong câu hỏi, thêm 吗 ở cuối câu`,
            examples: [
              '我是学生 (wǒ shì xuéshēng) Tôi là học sinh',
              '他是老师 (tā shì lǎoshī) Anh ấy là giáo viên',
              '这不是书 (zhè bú shì shū) Đây không phải là sách',
              '你是中国人吗？(nǐ shì zhōngguó rén ma?) Bạn là người Trung Quốc phải không?',
            ],
          },
        ],
      },
      {
        id: 'cat-1-3',
        lessonId: 'lesson-1',
        type: 'test',
        name: 'Kiểm tra',
        description: 'Bài kiểm tra tổng hợp',
        order: 3,
        exercises: [
          {
            id: 'ex-1-3-1',
            categoryId: 'cat-1-3',
            type: 'multiple_choice',
            question: '你好 nghĩa là gì?',
            options: ['Cảm ơn', 'Xin chào', 'Tạm biệt', 'Xin lỗi'],
            answer: 'Xin chào',
            explanation: '你好 có nghĩa là Xin chào',
          },
          {
            id: 'ex-1-3-2',
            categoryId: 'cat-1-3',
            type: 'input',
            question: 'Viết pinyin của từ "Cảm ơn"',
            answer: 'xiè xie',
            explanation: '谢谢 có pinyin là xiè xie',
            placeholder: 'Nhập pinyin...',
          },
          {
            id: 'ex-1-3-3',
            categoryId: 'cat-1-3',
            type: 'multiple_choice',
            question: 'Từ nào dùng để chào hỏi?',
            options: ['谢谢', '你好', '再见', '对不起'],
            answer: '你好',
            explanation: '你好 dùng để chào hỏi',
          },
        ],
      },
      {
        id: 'cat-1-4',
        lessonId: 'lesson-1',
        type: 'review',
        name: 'Ôn tập',
        description: 'Flashcard ôn tập',
        order: 4,
        exercises: [
          {
            id: 'ex-1-4-1',
            categoryId: 'cat-1-4',
            type: 'flashcard',
            question: '你好',
            answer: 'Xin chào',
            description: 'Chào hỏi thông thường',
            pinyin: 'nǐ hǎo',
          },
          {
            id: 'ex-1-4-2',
            categoryId: 'cat-1-4',
            type: 'flashcard',
            question: '谢谢',
            answer: 'Cảm ơn',
            description: 'Diễn đạt lòng biết ơn',
            pinyin: 'xiè xie',
          },
        ],
      },
      {
        id: 'cat-1-5',
        lessonId: 'lesson-1',
        type: 'speaking',
        name: 'Luyện nói',
        description: 'Luyện phát âm tiếng Trung',
        order: 5,
        exercises: [
          {
            id: 'ex-1-5-1',
            categoryId: 'cat-1-5',
            type: 'speaking',
            question: '你好',
            description: 'Chào hỏi cơ bản',
            answer: 'Xin chào',
            pinyin: 'nǐ hǎo',
          },
          {
            id: 'ex-1-5-2',
            categoryId: 'cat-1-5',
            type: 'speaking',
            question: '谢谢',
            description: 'Cảm ơn',
            answer: 'Cảm ơn',
            pinyin: 'xiè xie',
          },
        ],
      },
      {
        id: 'cat-1-6',
        lessonId: 'lesson-1',
        type: 'writing',
        name: 'Luyện viết',
        description: 'Luyện viết tiếng Trung',
        order: 6,
        exercises: [
          {
            id: 'ex-1-6-1',
            categoryId: 'cat-1-6',
            type: 'writing',
            question: 'Luyện viết chữ "你好"',
            answer: '你好',
            character: '你好',
            pinyin: 'nǐ hǎo',
            meaning: 'Xin chào',
          },
        ],
      },
      {
        id: 'cat-1-7',
        lessonId: 'lesson-1',
        type: 'dialogue',
        name: 'Bài khóa',
        description: 'Bài khóa tiếng Trung',
        order: 7,
        exercises: [
          {
            id: 'ex-1-7-1',
            categoryId: 'cat-1-7',
            type: 'dialogue',
            lines: [
              {
                speaker: '小明',
                text: '你好',
                pinyin: 'nǐ hǎo',
                translation: 'Xin chào',
              },
              {
                speaker: '小红',
                text: '你好你好',
                pinyin: 'nǐ hǎo nǐ hǎo',
                translation: 'Xin chào, xin chào',
              },
              {
                speaker: '小明',
                text: '我叫小明',
                pinyin: 'wǒ jiào Xiǎo Míng',
                translation: 'Tôi tên là Tiểu Minh',
              },
              {
                speaker: '小红',
                text: '我叫小红',
                pinyin: 'wǒ jiào Xiǎo Hóng',
                translation: 'Tôi tên là Tiểu Hồng',
              },
            ],
          },
        ],
      },
    ],
  },
];
