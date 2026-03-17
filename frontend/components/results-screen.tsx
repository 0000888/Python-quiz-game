"use client";

import { Trophy, RotateCcw, CheckCircle, XCircle, Flame, Clock, Target, Share2 } from "lucide-react";
import type { GameResults } from "@/lib/types";

interface ResultsScreenProps {
  results: GameResults;
  onPlayAgain: () => void;
}

export function ResultsScreen({ results, onPlayAgain }: ResultsScreenProps) {
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-easy", bg: "bg-easy/10", message: "Outstanding!" };
    if (percentage >= 80) return { grade: "A", color: "text-easy", bg: "bg-easy/10", message: "Excellent!" };
    if (percentage >= 70) return { grade: "B", color: "text-primary", bg: "bg-primary/10", message: "Great job!" };
    if (percentage >= 60) return { grade: "C", color: "text-warning", bg: "bg-warning/10", message: "Good effort!" };
    if (percentage >= 50) return { grade: "D", color: "text-warning", bg: "bg-warning/10", message: "Keep practicing!" };
    return { grade: "F", color: "text-destructive", bg: "bg-destructive/10", message: "Try again!" };
  };

  const gradeInfo = getGrade(results.percentage);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-easy";
      case "medium": return "text-warning";
      case "hard": return "text-destructive";
      default: return "text-primary";
    }
  };

  const handleShare = async () => {
    const text = `I scored ${results.score.toLocaleString()} points (${results.percentage}%) on Quiz Master Pro! Can you beat my score?`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <header className="text-center flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-warning/10 flex items-center justify-center animate-bounce-in">
          <Trophy className="w-10 h-10 text-warning" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">Quiz Complete!</h1>
          <p className="text-muted-foreground">
            Great game, <span className="text-foreground font-medium">{results.player_name}</span>!
          </p>
        </div>
      </header>

      {/* Score Card */}
      <div className="glass rounded-2xl p-8 text-center flex flex-col gap-6">
        <div className={`inline-flex mx-auto px-6 py-3 rounded-2xl ${gradeInfo.bg}`}>
          <span className={`text-6xl md:text-7xl font-bold ${gradeInfo.color}`}>
            {gradeInfo.grade}
          </span>
        </div>
        
        <p className="text-lg text-muted-foreground">{gradeInfo.message}</p>

        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl md:text-5xl font-bold font-mono text-primary">
            {results.score.toLocaleString()}
          </span>
          <span className="text-lg text-muted-foreground">points</span>
        </div>

        <div className="text-muted-foreground">
          <span className="text-foreground font-semibold">{results.correct_count}</span>
          {" / "}
          <span>{results.total_questions}</span>
          {" correct "}
          <span className="text-primary">({results.percentage}%)</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="glass rounded-xl p-4 md:p-5 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-warning" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold">{results.max_streak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>
        <div className="glass rounded-xl p-4 md:p-5 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold">{results.average_time}s</div>
            <div className="text-xs text-muted-foreground">Avg. Time</div>
          </div>
        </div>
        <div className="glass rounded-xl p-4 md:p-5 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold">{Math.round(results.percentage)}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="glass rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Question Summary</h2>
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
          {results.details.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                result.is_correct
                  ? "bg-easy/5 border-easy/20"
                  : "bg-destructive/5 border-destructive/20"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.is_correct ? (
                  <div className="w-8 h-8 rounded-full bg-easy/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-easy" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="w-4 h-4 text-destructive" />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${getDifficultyColor(result.difficulty)}`}>
                      {result.difficulty.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {result.category}
                    </span>
                  </div>
                  <p className="font-medium text-sm leading-relaxed">{result.question}</p>
                  <div className="text-xs flex flex-col gap-1">
                    <p className="text-muted-foreground">
                      Your answer: <span className={result.is_correct ? "text-easy font-medium" : "text-destructive font-medium"}>
                        {result.options[result.user_answer]}
                      </span>
                    </p>
                    {!result.is_correct && (
                      <p className="text-easy font-medium">
                        Correct: {result.options[result.correct_answer]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span>{result.time_taken.toFixed(1)}s</span>
                    {result.points_earned > 0 && (
                      <span className="text-primary font-medium">+{result.points_earned} pts</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-card border border-border text-foreground rounded-xl font-semibold hover:bg-card-hover transition-all"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-hover transition-all btn-glow"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
}
