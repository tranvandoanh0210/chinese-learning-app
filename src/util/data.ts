import { Lesson } from '../app/models/lesson.model';

export const SAMPLE_DATA: Lesson[] = [
  {
    "id": "lesson_1760953095829_vg9xz0izs",
    "name_zh": "",
    "name_vi": "Chào hỏi",
    "description": "Bài học Chào hỏi",
    "order": 1,
    "categories": [
      {
        "id": "category_1760953095829_lxpl00tns",
        "lessonId": "lesson_1760953095829_vg9xz0izs",
        "type": "vocabulary",
        "name": "Từ vựng",
        "description": "Bài tập Từ vựng",
        "order": 1,
        "exercises": [
          {
            "id": "ex_1760953095829_i0y9jlypf",
            "categoryId": "",
            "type": "vocabulary",
            "question": "你好",
            "description": "",
            "answer": "Xin chào",
            "explanation": "",
            "pinyin": "nǐ hǎo"
          },
          {
            "id": "ex_1760953095829_pv2cp63lv",
            "categoryId": "",
            "type": "vocabulary",
            "question": "谢谢",
            "description": "",
            "answer": "Cảm ơn",
            "explanation": "",
            "pinyin": "xiè xie"
          }
        ]
      },
      {
        "id": "category_1760953095829_uje601t40",
        "lessonId": "lesson_1760953095829_vg9xz0izs",
        "type": "grammar",
        "name": "Ngữ pháp",
        "description": "Bài tập Ngữ pháp",
        "order": 2,
        "exercises": [
          {
            "id": "ex_1760953095829_0dop38m87",
            "categoryId": "",
            "type": "grammar",
            "question": "Câu có động từ \"是\" (shì)",
            "description": "Cấu trúc câu cơ bản với động từ \"là\"",
            "answer": "",
            "explanation": "Đây là một trong những cấu trúc câu cơ bản và quan trọng nhất trong tiếng Hán.",
            "content": "Động từ '是' (shì) - 'là' được dùng để nối hai danh từ, đại từ hoặc cụm danh từ, biểu thị sự tương đồng hoặc xác định.\n\nCấu trúc cơ bản: **Chủ ngữ + 是 + Tân ngữ**.\n\nĐây là một trong những cấu trúc câu cơ bản và quan trọng nhất trong tiếng Hán. Nó tương đương với động từ \"to be\" trong tiếng Anh.\n\nCách sử dụng: Dùng để giới thiệu bản thân, nghề nghiệp, quốc tịch, hoặc xác định mối quan hệ giữa các sự vật, sự việc.\n\nDạng phủ định là '不是' (bú shì), trong đó '不' (bù) khi đứng trước một từ mang thanh 4 sẽ biến điệu thành thanh 2 (bú).\n\nPhân tích cấu trúc:\n- **Chủ ngữ (Subject)**: Người hoặc vật thực hiện hành động (ví dụ: 我, 他).\n- **Vị ngữ (Predicate)**: Phần mô tả chủ ngữ, ở đây là '是 + Tân ngữ'.\n- **Tân ngữ (Object)**: Đối tượng được đề cập đến (ví dụ: 法国人, 老师).\n\nĐiểm quan trọng:\n- Không dùng '是' với tính từ (dùng 很 thay thế)\n- '是' luôn đứng sau chủ ngữ và trước tân ngữ\n- Trong câu hỏi, thêm 吗 ở cuối câu",
            "examples": [
              "我是学生 (wǒ shì xuéshēng) Tôi là học sinh",
              "他是老师 (tā shì lǎoshī) Anh ấy là giáo viên",
              "这不是书 (zhè bú shì shū) Đây không phải là sách",
              "你是中国人吗？(nǐ shì zhōngguó rén ma?) Bạn là người Trung Quốc phải không?"
            ]
          }
        ]
      },
      {
        "id": "category_1760953095829_4xtewx23d",
        "lessonId": "lesson_1760953095829_vg9xz0izs",
        "type": "test",
        "name": "Kiểm tra",
        "description": "Bài tập Kiểm tra",
        "order": 3,
        "exercises": [
          {
            "id": "ex_1760953095829_0mqrvhmpy",
            "categoryId": "",
            "type": "multiple_choice",
            "question": "你好 nghĩa là gì?",
            "description": "",
            "answer": "Xin chào",
            "explanation": "你好 có nghĩa là Xin chào",
            "options": [
              "Cảm ơn",
              "Xin chào",
              "Tạm biệt",
              "Xin lỗi"
            ]
          },
          {
            "id": "ex_1760953095829_omo36by5z",
            "categoryId": "",
            "type": "input",
            "question": "Viết pinyin của từ \"Cảm ơn\"",
            "description": "",
            "answer": "xiè xie",
            "explanation": "谢谢 có pinyin là xiè xie",
            "placeholder": "Nhập pinyin..."
          },
          {
            "id": "ex_1760953095829_tcvornuw1",
            "categoryId": "",
            "type": "multiple_choice",
            "question": "Từ nào dùng để chào hỏi?",
            "description": "",
            "answer": "你好",
            "explanation": "你好 dùng để chào hỏi",
            "options": [
              "谢谢",
              "你好",
              "再见",
              "对不起"
            ]
          }
        ]
      },
      {
        "id": "category_1760953095829_wefmbv0z0",
        "lessonId": "lesson_1760953095829_vg9xz0izs",
        "type": "review",
        "name": "Ôn tập",
        "description": "Bài tập Ôn tập",
        "order": 4,
        "exercises": [
          {
            "id": "ex_1760953095829_cgwf21bps",
            "categoryId": "",
            "type": "flashcard",
            "question": "你好",
            "description": "Chào hỏi thông thường",
            "answer": "Xin chào",
            "explanation": "",
            "pinyin": "nǐ hǎo"
          },
          {
            "id": "ex_1760953095829_2f02idshy",
            "categoryId": "",
            "type": "flashcard",
            "question": "谢谢",
            "description": "Diễn đạt lòng biết ơn",
            "answer": "Cảm ơn",
            "explanation": "",
            "pinyin": "xiè xie"
          }
        ]
      },
      {
        "id": "category_1760953095829_kbggrfy8o",
        "lessonId": "lesson_1760953095829_vg9xz0izs",
        "type": "speaking",
        "name": "Luyện nói",
        "description": "Bài tập Luyện nói",
        "order": 5,
        "exercises": [
          {
            "id": "ex_1760953095829_6b8xplbdy",
            "categoryId": "",
            "type": "speaking",
            "question": "你好",
            "description": "Chào hỏi cơ bản",
            "answer": "Xin chào",
            "explanation": "",
            "pinyin": "nǐ hǎo"
          },
          {
            "id": "ex_1760953095829_z9jnsbf3e",
            "categoryId": "",
            "type": "speaking",
            "question": "谢谢",
            "description": "Cảm ơn",
            "answer": "Cảm ơn",
            "explanation": "",
            "pinyin": "xiè xie"
          }
        ]
      },
      {
        "id": "category_1760953095829_us2bz108g",
        "lessonId": "lesson_1760953095829_vg9xz0izs",
        "type": "writing",
        "name": "Luyện viết",
        "description": "Bài tập Luyện viết",
        "order": 6,
        "exercises": [
          {
            "id": "ex_1760953095829_029560q80",
            "categoryId": "",
            "type": "writing",
            "question": "Luyện viết chữ \"你好\"",
            "description": "Học viết chữ chào hỏi cơ bản",
            "answer": "你好",
            "explanation": "",
            "character": "你好",
            "pinyin": "nǐ hǎo",
            "meaning": "Xin chào"
          },
          {
            "id": "ex_1760953095829_fryb4js4z",
            "categoryId": "",
            "type": "writing",
            "question": "Luyện viết chữ \"你好\"",
            "description": "Học viết chữ chào hỏi cơ bản",
            "answer": "你好",
            "explanation": "",
            "character": "你好",
            "pinyin": "nǐ hǎo",
            "meaning": "Xin chào"
          }
        ]
      },
      {
        "id": "category_1760953095829_ao61e8k28",
        "lessonId": "lesson_1760953095829_vg9xz0izs",
        "type": "dialogue",
        "name": "Hội thoại",
        "description": "Bài tập Hội thoại",
        "order": 7,
        "exercises": []
      }
    ]
  }
];
