import { Lesson } from '../app/models/lesson.model';

export const SAMPLE_DATA: Lesson[] = [
  {
    "id": "lesson_1760958558437_jtltduqjk",
    "name_zh": "",
    "name_vi": "Chào hỏi",
    "description": "Bài học Chào hỏi",
    "order": 1,
    "categories": [
      {
        "id": "category_1760958558437_dnzc45tfm",
        "lessonId": "lesson_1760958558437_jtltduqjk",
        "type": "vocabulary",
        "name": "Từ vựng",
        "description": "Bài tập Từ vựng",
        "order": 1,
        "exercises": [
          {
            "id": "ex_1760958558437_536wj8kfu",
            "categoryId": "",
            "type": "vocabulary",
            "question": "你好",
            "description": "",
            "answer": "Xin chào1",
            "explanation": "",
            "pinyin": "nǐ hǎo"
          },
          {
            "id": "ex_1760958558437_5mu6do0rg",
            "categoryId": "",
            "type": "vocabulary",
            "question": "谢谢",
            "description": "",
            "answer": "Cảm ơn1",
            "explanation": "",
            "pinyin": "xiè xie"
          }
        ]
      },
      {
        "id": "category_1760958558437_n07ajlm6z",
        "lessonId": "lesson_1760958558437_jtltduqjk",
        "type": "grammar",
        "name": "Ngữ pháp",
        "description": "Bài tập Ngữ pháp",
        "order": 2,
        "exercises": [
          {
            "id": "ex_1760958558437_twokw47de",
            "categoryId": "",
            "type": "grammar",
            "question": "Câu có động từ \"是\" (shì)",
            "description": "Cấu trúc câu cơ bản với động từ \"là\"1",
            "answer": "",
            "explanation": "Đây là một trong những cấu trúc câu cơ bản và quan trọng nhất trong tiếng Hán.",
            "content": "Động từ '是' (shì) - 'là' được dùng để nối hai danh từ, đại từ hoặc cụm danh từ, biểu thị sự tương đồng hoặc xác định.\r\r\n\r\r\nCấu trúc cơ bản: **Chủ ngữ + 是 + Tân ngữ**.\r\r\n\r\r\nĐây là một trong những cấu trúc câu cơ bản và quan trọng nhất trong tiếng Hán. Nó tương đương với động từ \"to be\" trong tiếng Anh.\r\r\n\r\r\nCách sử dụng: Dùng để giới thiệu bản thân, nghề nghiệp, quốc tịch, hoặc xác định mối quan hệ giữa các sự vật, sự việc.\r\r\n\r\r\nDạng phủ định là '不是' (bú shì), trong đó '不' (bù) khi đứng trước một từ mang thanh 4 sẽ biến điệu thành thanh 2 (bú).\r\r\n\r\r\nPhân tích cấu trúc:\r\r\n- **Chủ ngữ (Subject)**: Người hoặc vật thực hiện hành động (ví dụ: 我, 他).\r\r\n- **Vị ngữ (Predicate)**: Phần mô tả chủ ngữ, ở đây là '是 + Tân ngữ'.\r\r\n- **Tân ngữ (Object)**: Đối tượng được đề cập đến (ví dụ: 法国人, 老师).\r\r\n\r\r\nĐiểm quan trọng:\r\r\n- Không dùng '是' với tính từ (dùng 很 thay thế)\r\r\n- '是' luôn đứng sau chủ ngữ và trước tân ngữ\r\r\n- Trong câu hỏi, thêm 吗 ở cuối câu",
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
        "id": "category_1760958558437_jcrd2mgyg",
        "lessonId": "lesson_1760958558437_jtltduqjk",
        "type": "test",
        "name": "Kiểm tra",
        "description": "Bài tập Kiểm tra",
        "order": 3,
        "exercises": [
          {
            "id": "ex_1760958558437_vvagkrpyx",
            "categoryId": "",
            "type": "multiple_choice",
            "question": "你好 nghĩa là gì?1",
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
            "id": "ex_1760958558438_34wm4vxn7",
            "categoryId": "",
            "type": "input",
            "question": "Viết pinyin của từ \"Cảm ơn\"",
            "description": "",
            "answer": "xiè xie",
            "explanation": "谢谢 có pinyin là xiè xie",
            "placeholder": "Nhập pinyin..."
          },
          {
            "id": "ex_1760958558438_u4b3shza0",
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
        "id": "category_1760958558438_kf0y2lqrc",
        "lessonId": "lesson_1760958558437_jtltduqjk",
        "type": "review",
        "name": "Ôn tập",
        "description": "Bài tập Ôn tập",
        "order": 4,
        "exercises": [
          {
            "id": "ex_1760958558438_eszrbsn9h",
            "categoryId": "",
            "type": "flashcard",
            "question": "你好",
            "description": "Chào hỏi thông thường",
            "answer": "Xin chào1",
            "explanation": "",
            "pinyin": "nǐ hǎo"
          },
          {
            "id": "ex_1760958558438_ptey7quq1",
            "categoryId": "",
            "type": "flashcard",
            "question": "谢谢",
            "description": "Diễn đạt lòng biết ơn",
            "answer": "Cảm ơn1",
            "explanation": "",
            "pinyin": "xiè xie"
          }
        ]
      },
      {
        "id": "category_1760958558438_rp8iwr2w7",
        "lessonId": "lesson_1760958558437_jtltduqjk",
        "type": "writing",
        "name": "Luyện viết",
        "description": "Bài tập Luyện viết",
        "order": 5,
        "exercises": [
          {
            "id": "ex_1760958558438_4szoj2ay4",
            "categoryId": "",
            "type": "writing",
            "question": "Luyện viết chữ \"你好\"1",
            "description": "Học viết chữ chào hỏi cơ bản",
            "answer": "你好",
            "explanation": "",
            "character": "你好",
            "pinyin": "nǐ hǎo",
            "meaning": "Xin chào"
          },
          {
            "id": "ex_1760958558438_ha1bkjion",
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
        "id": "category_1760958558438_qz7g0reeu",
        "lessonId": "lesson_1760958558437_jtltduqjk",
        "type": "speaking",
        "name": "Luyện nói",
        "description": "Bài tập Luyện nói",
        "order": 6,
        "exercises": [
          {
            "id": "ex_1760958558438_2xp4nywoe",
            "categoryId": "",
            "type": "speaking",
            "question": "你好",
            "description": "Chào hỏi cơ bản",
            "answer": "Xin chào1",
            "explanation": "",
            "pinyin": "nǐ hǎo"
          },
          {
            "id": "ex_1760958558438_28ud3lhgo",
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
        "id": "category_1760958558438_wejj5zny6",
        "lessonId": "lesson_1760958558437_jtltduqjk",
        "type": "dialogue",
        "name": "Hội thoại",
        "description": "Bài tập Hội thoại",
        "order": 7,
        "exercises": [
          {
            "id": "dialogue_1760958558438_efsaaphm2",
            "categoryId": "",
            "type": "dialogue",
            "context": "Bài khóa 1",
            "lines": [
              {
                "speaker": "小明",
                "text": "你好",
                "pinyin": "nǐ hǎo",
                "translation": "Xin chào1"
              },
              {
                "speaker": "小红",
                "text": "你好你好",
                "pinyin": "nǐ hǎo nǐ hǎo",
                "translation": "Xin chào, xin chào"
              },
              {
                "speaker": "小明",
                "text": "我叫小明",
                "pinyin": "wǒ jiào Xiǎo Míng",
                "translation": "Tôi tên là Tiểu Minh"
              },
              {
                "speaker": "小红",
                "text": "我叫小红",
                "pinyin": "wǒ jiào Xiǎo Hóng",
                "translation": "Tôi tên là Tiểu Hồng"
              }
            ]
          },
          {
            "id": "dialogue_1760958558438_0fbhhtubq",
            "categoryId": "",
            "type": "dialogue",
            "context": "Bài khóa 2",
            "lines": [
              {
                "speaker": "小明",
                "text": "你好",
                "pinyin": "nǐ hǎo",
                "translation": "Xin chào1"
              },
              {
                "speaker": "小红",
                "text": "你好你好",
                "pinyin": "nǐ hǎo nǐ hǎo",
                "translation": "Xin chào, xin chào"
              },
              {
                "speaker": "小明",
                "text": "我叫小明",
                "pinyin": "wǒ jiào Xiǎo Míng",
                "translation": "Tôi tên là Tiểu Minh"
              },
              {
                "speaker": "小红",
                "text": "我叫小红",
                "pinyin": "wǒ jiào Xiǎo Hóng",
                "translation": "Tôi tên là Tiểu Hồng"
              }
            ]
          }
        ]
      }
    ]
  }
];
