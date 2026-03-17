"use client";

import { Brain, Play, Trophy, Zap, Target, Clock, Sparkles } from "lucide-react";
import type { Category, Difficulty, LeaderboardEntry } from "@/lib/types";

interface StartScreenProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  selectedQuestionCount: number;
  setSelectedQuestionCount: (count: number) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (difficulty: Difficulty) => void;
  categories: Category[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  onStart: () => void;
  onPlaySound: (type: "click") => void;
}

export function StartScreen({
  playerName,
  setPlayerName,
  selectedQuestionCount,
  setSelectedQuestionCount,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  categories,
  leaderboard,
  isLoading,
  onStart,
  onPlaySound,
}: StartScreenProps) {
  const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
    { value: "easy", label: "Easy", color: "bg-easy/10 text-easy border-easy/40 hover:bg-easy/20" },
    { value: "medium", label: "Medium", color: "bg-warning/10 text-warning border-warning/40 hover:bg-warning/20" },
    { value: "hard", label: "Hard", color: "bg-destructive/10 text-destructive border-destructive/40 hover:bg-destructive/20" },
    { value: "mixed", label: "Mixed", color: "bg-primary/10 text-primary border-primary/40 hover:bg-primary/20" },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-10">
      {/* Hero Section */}
      <header className="text-center flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse-glow">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center animate-float">
            <Sparkles className="w-3 h-3 text-background" />
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Quiz Master Pro
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
            Test your knowledge across multiple categories and climb the leaderboard
          </p>
        </div>
      </header>

      {/* Features Row */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="glass rounded-xl p-4 flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs md:text-sm font-medium text-muted-foreground">8 Categories</span>
        </div>
        <div className="glass rounded-xl p-4 flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <span className="text-xs md:text-sm font-medium text-muted-foreground">Streak Bonus</span>
        </div>
        <div className="glass rounded-xl p-4 flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs md:text-sm font-medium text-muted-foreground">Time Bonus</span>
        </div>
      </div>

      {/* Game Settings Card */}
      <div className="glass rounded-2xl p-6 md:p-8 flex flex-col gap-6">
        {/* Player Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            maxLength={20}
          />
        </div>

        {/* Number of Questions */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">Questions</label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => {
                  onPlaySound("click");
                  setSelectedQuestionCount(num);
                }}
                className={`py-3 rounded-xl font-semibold text-sm transition-all border ${
                  selectedQuestionCount === num
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 text-foreground border-border hover:border-muted-foreground"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">Category</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategory("all");
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/50 text-foreground border-border hover:border-muted-foreground"
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  onPlaySound("click");
                  setSelectedCategory(cat.name);
                }}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all truncate border ${
                  selectedCategory === cat.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 text-foreground border-border hover:border-muted-foreground"
                }`}
                title={`${cat.name} (${cat.counts.total} questions)`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">Difficulty</label>
          <div className="grid grid-cols-4 gap-2">
            {difficultyOptions.map((diff) => (
              <button
                key={diff.value}
                onClick={() => {
                  onPlaySound("click");
                  setSelectedDifficulty(diff.value);
                }}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  selectedDifficulty === diff.value
                    ? diff.color
                    : "bg-background/50 text-foreground border-border hover:border-muted-foreground"
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={isLoading || !playerName.trim()}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Play className="w-5 h-5" />
        )}
        Start Quiz
      </button>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="glass rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            <h2 className="font-semibold">Top Players</h2>
          </div>
          <div className="flex flex-col gap-2">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? "bg-warning/20 text-warning" :
                    index === 1 ? "bg-muted-foreground/20 text-muted-foreground" :
                    index === 2 ? "bg-warning/10 text-warning/70" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium">{entry.player_name}</span>
                </div>
                <span className="font-mono font-semibold text-primary">{entry.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
