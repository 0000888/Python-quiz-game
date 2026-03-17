export type GameState = "start" | "playing" | "result";
export type Difficulty = "easy" | "medium" | "hard" | "mixed";

export interface Category {
  name: string;
  counts: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
  difficulty: string;
  question_number: number;
  time_limit: number;
}

export interface GameSession {
  session_id: string;
  total_questions: number;
  current_question: Question;
  player_name: string;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: number;
  points_earned: number;
  time_bonus: number;
  streak_bonus: number;
  current_streak: number;
  current_score: number;
  game_over: boolean;
  final_score?: number;
  total_questions?: number;
  next_question?: Question;
}

export interface DetailedResult {
  question: string;
  category: string;
  difficulty: string;
  options: string[];
  user_answer: number;
  correct_answer: number;
  is_correct: boolean;
  time_taken: number;
  points_earned: number;
}

export interface GameResults {
  player_name: string;
  score: number;
  correct_count: number;
  total_questions: number;
  percentage: number;
  max_streak: number;
  total_time: number;
  average_time: number;
  category: string | null;
  difficulty: string | null;
  details: DetailedResult[];
}

export interface LeaderboardEntry {
  player_name: string;
  score: number;
  correct_count: number;
  total_questions: number;
  max_streak: number;
  total_time: number;
  category: string;
  difficulty: string;
  timestamp: string;
}
