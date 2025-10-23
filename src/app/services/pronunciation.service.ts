import { Injectable } from '@angular/core';

export interface PronunciationResult {
  accuracy: number;
  feedback: string;
  matches: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PronunciationService {
  assessPronunciation(userSpeech: string, expectedText: string): PronunciationResult {
    // Simple pronunciation assessment algorithm
    // In a real app, you might use a more sophisticated approach or external API

    const userWords = this.normalizeText(userSpeech).split('');
    const expectedWords = this.normalizeText(expectedText).split('');

    let matches = 0;
    const minLength = Math.min(userWords.length, expectedWords.length);

    for (let i = 0; i < minLength; i++) {
      if (this.isSimilar(userWords[i], expectedWords[i])) {
        matches++;
      }
    }

    const accuracy = (matches / expectedWords.length) * 100;

    return {
      accuracy: Math.round(accuracy),
      feedback: this.generateFeedback(accuracy),
      matches: accuracy >= 90,
    };
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[.,!?;]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  private isSimilar(word1: string, word2: string): boolean {
    // Simple similarity check - in real app, use more advanced algorithm
    return word1 === word2 || this.levenshteinDistance(word1, word2) <= 1;
  }

  private levenshteinDistance(a: string, b: string): number {
    // Simple Levenshtein distance for similarity measurement
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  private generateFeedback(accuracy: number): string {
    if (accuracy >= 90) {
      return '🎉 Phát âm xuất sắc! Rất chính xác!';
    }
    // else if (accuracy >= 80) {
    //   return '👍 Phát âm tốt! Có thể cải thiện thêm một chút.';
    // } else if (accuracy >= 70) {
    //   return '👌 Phát âm khá tốt! Hãy luyện tập thêm.';
    // } else if (accuracy >= 60) {
    //   return '💡 Cần cải thiện! Hãy nghe kỹ và thử lại.';
    // }
    else {
      return 'Hãy nghe mẫu và thử lại.';
    }
  }
}
