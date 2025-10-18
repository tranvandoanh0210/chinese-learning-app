interface UserAnswer {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
  isAnswered: boolean;
}
interface TestTimer {
  minutes: number;
  seconds: number;
  totalSeconds: number;
}
