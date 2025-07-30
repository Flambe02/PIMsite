export type CheckupStep = 'hero' | 'questions' | 'summary';
export type CheckupBlock = 'resilience' | 'income' | 'wellbeing' | 'future' | 'budget';

export interface CheckupAnswer {
  questionId: string;
  answer: string | number;
  block: CheckupBlock;
}

export interface CheckupScore {
  block: CheckupBlock;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface CheckupResult {
  id?: string;
  userId: string;
  checkupDate: Date;
  answers: CheckupAnswer[];
  scores: CheckupScore[];
  globalScore: number;
  comments: Record<string, string>;
  country: string;
  language: string;
  version: string;
} 