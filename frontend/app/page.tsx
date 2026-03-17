"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Trophy, Flame, ArrowRight } from "lucide-react";
import { StartScreen } from "@/components/start-screen";
import { QuestionCard } from "@/components/question-card";
import { ResultsScreen } from "@/components/results-screen";
import { Timer } from "@/components/timer";
import { useSound } from "@/hooks/use-sound";
import type { GameState, Difficulty, Category, Question, AnswerResult, GameResults, LeaderboardEntry } from "@/lib/types";

export default function QuizGame() {
  const { playSound } = useSound();
  
  // Game state
  const [gameState, setGameState] = useState<GameState>("start");
  const [sessionId, setSessionId] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  
  // Settings
  const [playerName, setPlayerName] = useState("");
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("mixed");
  
  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  // Refs for timer
  const questionStartTime = useRef<number>(0);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, leaderboardRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/leaderboard?limit=10"),
        ]);
        
        const categoriesData = await categoriesRes.json();
        const leaderboardData = await leaderboardRes.json();
        
        setCategories(categoriesData.categories || []);
        setLeaderboard(leaderboardData.entries || []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    
    fetchData();
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    playSound("click");
    
    try {
      const response = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_questions: selectedQuestionCount,
          category: selectedCategory === "all" ? null : selectedCategory,
          difficulty: selectedDifficulty === "mixed" ? null : selectedDifficulty,
          player_name: playerName.trim() || "Anonymous",
        }),
      });
      
      const data = await response.json();
      
      setSessionId(data.session_id);
      setTotalQuestions(data.total_questions);
      setCurrentQuestion(data.current_question);
      setScore(0);
      setStreak(0);
      setGameState("playing");
      setIsPaused(false);
      setTimeLeft(30);
      questionStartTime.current = Date.now();
    } catch (error) {
      console.error("Failed to start game:", error);
    }
    
    setIsLoading(false);
  };

  const submitAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion || isLoading) return;
    
    const timeTaken = (Date.now() - questionStartTime.current) / 1000;
    setSelectedAnswer(answerIndex);
    setIsPaused(true);
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: currentQuestion.id,
          answer_index: answerIndex,
          time_taken: timeTaken,
        }),
      });
      
      const result: AnswerResult = await response.json();
      setAnswerResult(result);
      setScore(result.current_score);
      setStreak(result.current_streak);
      
      // Play appropriate sound
      if (result.is_correct) {
        if (result.current_streak >= 3) {
          playSound("streak");
        } else {
          playSound("correct");
        }
      } else {
        playSound("wrong");
      }
      
      if (result.game_over) {
        setTimeout(async () => {
          playSound("complete");
          
          // Fetch detailed results
          const resultsResponse = await fetch(`/api/game/${sessionId}/results`);
          const resultsData: GameResults = await resultsResponse.json();
          setGameResults(resultsData);
          
          // Add to leaderboard
          await fetch("/api/leaderboard/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              player_name: playerName.trim() || "Anonymous",
              session_id: sessionId,
            }),
          });
          
          // Refresh leaderboard
          const leaderboardRes = await fetch("/api/leaderboard?limit=10");
          const leaderboardData = await leaderboardRes.json();
          setLeaderboard(leaderboardData.entries || []);
          
          setGameState("result");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
    
    setIsLoading(false);
  };

  const handleTimeUp = useCallback(() => {
    if (selectedAnswer === null && currentQuestion) {
      submitAnswer(-1);
    }
  }, [selectedAnswer, currentQuestion]);

  const nextQuestion = () => {
    if (answerResult?.next_question) {
      playSound("click");
      setCurrentQuestion(answerResult.next_question);
      setSelectedAnswer(null);
      setAnswerResult(null);
      setIsPaused(false);
      setTimeLeft(30);
      questionStartTime.current = Date.now();
    }
  };

  const resetGame = () => {
    playSound("click");
    setGameState("start");
    setSessionId("");
    setCurrentQuestion(null);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setGameResults(null);
    setIsPaused(false);
    setTimeLeft(30);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-xl">
        {/* Start Screen */}
        {gameState === "start" && (
          <StartScreen
            playerName={playerName}
            setPlayerName={setPlayerName}
            selectedQuestionCount={selectedQuestionCount}
            setSelectedQuestionCount={setSelectedQuestionCount}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            categories={categories}
            leaderboard={leaderboard}
            isLoading={isLoading}
            onStart={startGame}
            onPlaySound={playSound}
          />
        )}

        {/* Playing Screen */}
        {gameState === "playing" && currentQuestion && (
          <div className="flex flex-col gap-6">
            {/* Game Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Timer
                  duration={30}
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                  onTimeUp={handleTimeUp}
                  isPaused={isPaused}
                />
                <div className="flex flex-col gap-1.5">
                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestion.question_number} of {totalQuestions}
                  </div>
                  <div className="h-2 w-28 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${(currentQuestion.question_number / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {streak >= 3 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20 animate-pulse">
                    <Flame className="w-4 h-4 text-warning" />
                    <span className="text-sm font-bold text-warning">{streak}x</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="font-mono font-bold text-primary">{score.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              answerResult={answerResult}
              isLoading={isLoading}
              onAnswer={submitAnswer}
            />

            {/* Next Button */}
            {answerResult && !answerResult.game_over && (
              <button
                onClick={nextQuestion}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary-hover transition-all animate-fade-in btn-glow"
              >
                Next Question
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            
            {answerResult && answerResult.game_over && (
              <div className="text-center py-6 animate-fade-in">
                <div className="inline-flex items-center gap-3 px-5 py-3 glass rounded-xl">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-muted-foreground font-medium">Calculating results...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {gameState === "result" && gameResults && (
          <ResultsScreen
            results={gameResults}
            onPlayAgain={resetGame}
          />
        )}
      </div>
    </main>
  );
}
