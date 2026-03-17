"use client";

import { CheckCircle, XCircle, Zap, Flame } from "lucide-react";
import type { Question, AnswerResult } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  answerResult: AnswerResult | null;
  isLoading: boolean;
  onAnswer: (index: number) => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  answerResult,
  isLoading,
  onAnswer,
}: QuestionCardProps) {
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-easy/10 text-easy";
      case "medium":
        return "bg-warning/10 text-warning";
      case "hard":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getOptionStyle = (index: number) => {
    if (selectedAnswer === null) {
      return "bg-card hover:bg-card-hover border-border hover:border-primary/50 cursor-pointer";
    }

    if (answerResult) {
      if (index === answerResult.correct_answer) {
        return "bg-easy/10 border-easy text-foreground";
      }
      if (index === selectedAnswer && !answerResult.is_correct) {
        return "bg-destructive/10 border-destructive text-foreground animate-shake";
      }
    }

    return "bg-card border-border opacity-40 cursor-not-allowed";
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Question Card */}
      <div className="glass rounded-2xl p-6 md:p-8 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getDifficultyStyle(question.difficulty)}`}>
            {question.category}
          </span>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getDifficultyStyle(question.difficulty)}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-balance leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 stagger-children">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            disabled={selectedAnswer !== null || isLoading}
            className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${getOptionStyle(index)}`}
          >
            <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-background/80 text-sm font-bold shrink-0 border border-border">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1 font-medium text-sm md:text-base">{option}</span>
            {answerResult && index === answerResult.correct_answer && (
              <CheckCircle className="w-6 h-6 text-easy shrink-0 animate-bounce-in" />
            )}
            {answerResult && index === selectedAnswer && !answerResult.is_correct && (
              <XCircle className="w-6 h-6 text-destructive shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Answer Feedback */}
      {answerResult && (
        <div className={`p-5 rounded-xl animate-fade-in border ${
          answerResult.is_correct 
            ? "bg-easy/5 border-easy/30" 
            : "bg-destructive/5 border-destructive/30"
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {answerResult.is_correct ? (
                <div className="w-10 h-10 rounded-full bg-easy/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-easy" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
              )}
              <span className={`font-semibold text-lg ${answerResult.is_correct ? "text-easy" : "text-destructive"}`}>
                {answerResult.is_correct ? "Correct!" : "Incorrect"}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {answerResult.points_earned > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10">
                  <span className="font-mono font-bold text-primary">+{answerResult.points_earned}</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              )}
              
              {answerResult.time_bonus > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">+{answerResult.time_bonus}</span>
                </div>
              )}
              
              {answerResult.current_streak >= 3 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/10">
                  <Flame className="w-4 h-4 text-warning" />
                  <span className="text-sm font-bold text-warning">{answerResult.current_streak}x</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
