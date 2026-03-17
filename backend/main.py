import fastapi
import fastapi.middleware.cors
from pydantic import BaseModel
import random
import time
from typing import Optional
from datetime import datetime

app = fastapi.FastAPI(
    title="Quiz Master API",
    description="Professional Quiz Game Backend",
    version="2.0.0"
)

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Comprehensive Quiz Questions Database with Difficulty Levels
QUESTIONS = [
    # Geography - Easy
    {
        "id": 1,
        "question": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "correct_answer": 2,
        "category": "Geography",
        "difficulty": "easy"
    },
    {
        "id": 2,
        "question": "Which continent is Brazil located in?",
        "options": ["Africa", "South America", "Europe", "Asia"],
        "correct_answer": 1,
        "category": "Geography",
        "difficulty": "easy"
    },
    {
        "id": 3,
        "question": "What is the largest ocean on Earth?",
        "options": ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        "correct_answer": 3,
        "category": "Geography",
        "difficulty": "easy"
    },
    # Geography - Medium
    {
        "id": 4,
        "question": "Which country has the longest coastline in the world?",
        "options": ["Russia", "Canada", "Australia", "Indonesia"],
        "correct_answer": 1,
        "category": "Geography",
        "difficulty": "medium"
    },
    {
        "id": 5,
        "question": "What is the smallest country in the world?",
        "options": ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        "correct_answer": 1,
        "category": "Geography",
        "difficulty": "medium"
    },
    # Geography - Hard
    {
        "id": 6,
        "question": "What is the capital of Mongolia?",
        "options": ["Astana", "Ulaanbaatar", "Bishkek", "Dushanbe"],
        "correct_answer": 1,
        "category": "Geography",
        "difficulty": "hard"
    },
    
    # Science - Easy
    {
        "id": 7,
        "question": "Which planet is known as the Red Planet?",
        "options": ["Venus", "Mars", "Jupiter", "Saturn"],
        "correct_answer": 1,
        "category": "Science",
        "difficulty": "easy"
    },
    {
        "id": 8,
        "question": "What is H2O commonly known as?",
        "options": ["Oxygen", "Hydrogen", "Water", "Carbon Dioxide"],
        "correct_answer": 2,
        "category": "Science",
        "difficulty": "easy"
    },
    {
        "id": 9,
        "question": "What is the chemical symbol for gold?",
        "options": ["Go", "Gd", "Au", "Ag"],
        "correct_answer": 2,
        "category": "Science",
        "difficulty": "easy"
    },
    # Science - Medium
    {
        "id": 10,
        "question": "What is the largest organ in the human body?",
        "options": ["Heart", "Liver", "Brain", "Skin"],
        "correct_answer": 3,
        "category": "Science",
        "difficulty": "medium"
    },
    {
        "id": 11,
        "question": "Which element has the atomic number 1?",
        "options": ["Helium", "Hydrogen", "Oxygen", "Carbon"],
        "correct_answer": 1,
        "category": "Science",
        "difficulty": "medium"
    },
    {
        "id": 12,
        "question": "What is the speed of light in vacuum (approximately)?",
        "options": ["300,000 km/s", "150,000 km/s", "500,000 km/s", "200,000 km/s"],
        "correct_answer": 0,
        "category": "Science",
        "difficulty": "medium"
    },
    # Science - Hard
    {
        "id": 13,
        "question": "What is the Schwarzschild radius formula used to calculate?",
        "options": ["Star brightness", "Black hole event horizon", "Planet orbit", "Galaxy rotation"],
        "correct_answer": 1,
        "category": "Science",
        "difficulty": "hard"
    },
    
    # History - Easy
    {
        "id": 14,
        "question": "What year did World War II end?",
        "options": ["1943", "1944", "1945", "1946"],
        "correct_answer": 2,
        "category": "History",
        "difficulty": "easy"
    },
    {
        "id": 15,
        "question": "Who was the first President of the United States?",
        "options": ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        "correct_answer": 2,
        "category": "History",
        "difficulty": "easy"
    },
    # History - Medium
    {
        "id": 16,
        "question": "In which year did the Titanic sink?",
        "options": ["1910", "1912", "1914", "1916"],
        "correct_answer": 1,
        "category": "History",
        "difficulty": "medium"
    },
    {
        "id": 17,
        "question": "Who was the first woman to win a Nobel Prize?",
        "options": ["Mother Teresa", "Marie Curie", "Rosalind Franklin", "Dorothy Hodgkin"],
        "correct_answer": 1,
        "category": "History",
        "difficulty": "medium"
    },
    # History - Hard
    {
        "id": 18,
        "question": "What year was the Treaty of Westphalia signed?",
        "options": ["1618", "1638", "1648", "1658"],
        "correct_answer": 2,
        "category": "History",
        "difficulty": "hard"
    },
    
    # Nature - Easy
    {
        "id": 19,
        "question": "What is the largest mammal in the world?",
        "options": ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        "correct_answer": 1,
        "category": "Nature",
        "difficulty": "easy"
    },
    {
        "id": 20,
        "question": "How many legs does a spider have?",
        "options": ["6", "8", "10", "12"],
        "correct_answer": 1,
        "category": "Nature",
        "difficulty": "easy"
    },
    # Nature - Medium
    {
        "id": 21,
        "question": "What is the tallest tree species in the world?",
        "options": ["Giant Sequoia", "Coast Redwood", "Douglas Fir", "Eucalyptus"],
        "correct_answer": 1,
        "category": "Nature",
        "difficulty": "medium"
    },
    {
        "id": 22,
        "question": "Which animal has the longest lifespan?",
        "options": ["Elephant", "Tortoise", "Bowhead Whale", "Greenland Shark"],
        "correct_answer": 3,
        "category": "Nature",
        "difficulty": "medium"
    },
    # Nature - Hard
    {
        "id": 23,
        "question": "What is the only mammal capable of true flight?",
        "options": ["Flying Squirrel", "Bat", "Sugar Glider", "Colugo"],
        "correct_answer": 1,
        "category": "Nature",
        "difficulty": "hard"
    },
    
    # Art & Culture - Easy
    {
        "id": 24,
        "question": "Who painted the Mona Lisa?",
        "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        "correct_answer": 2,
        "category": "Art & Culture",
        "difficulty": "easy"
    },
    {
        "id": 25,
        "question": "Which country is the Eiffel Tower located in?",
        "options": ["Italy", "Spain", "France", "Germany"],
        "correct_answer": 2,
        "category": "Art & Culture",
        "difficulty": "easy"
    },
    # Art & Culture - Medium
    {
        "id": 26,
        "question": "Who composed the Four Seasons?",
        "options": ["Mozart", "Beethoven", "Vivaldi", "Bach"],
        "correct_answer": 2,
        "category": "Art & Culture",
        "difficulty": "medium"
    },
    {
        "id": 27,
        "question": "Which art movement was Salvador Dali associated with?",
        "options": ["Impressionism", "Surrealism", "Cubism", "Expressionism"],
        "correct_answer": 1,
        "category": "Art & Culture",
        "difficulty": "medium"
    },
    # Art & Culture - Hard
    {
        "id": 28,
        "question": "What year was Shakespeare's Hamlet first performed?",
        "options": ["1599", "1600", "1601", "1602"],
        "correct_answer": 2,
        "category": "Art & Culture",
        "difficulty": "hard"
    },
    
    # Technology - Easy
    {
        "id": 29,
        "question": "What does CPU stand for?",
        "options": ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Unit"],
        "correct_answer": 1,
        "category": "Technology",
        "difficulty": "easy"
    },
    {
        "id": 30,
        "question": "Who founded Microsoft?",
        "options": ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"],
        "correct_answer": 1,
        "category": "Technology",
        "difficulty": "easy"
    },
    # Technology - Medium
    {
        "id": 31,
        "question": "What year was the first iPhone released?",
        "options": ["2005", "2006", "2007", "2008"],
        "correct_answer": 2,
        "category": "Technology",
        "difficulty": "medium"
    },
    {
        "id": 32,
        "question": "What programming language was created by Guido van Rossum?",
        "options": ["Java", "Ruby", "Python", "JavaScript"],
        "correct_answer": 2,
        "category": "Technology",
        "difficulty": "medium"
    },
    # Technology - Hard
    {
        "id": 33,
        "question": "What is the time complexity of QuickSort in the average case?",
        "options": ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
        "correct_answer": 1,
        "category": "Technology",
        "difficulty": "hard"
    },
    
    # Sports - Easy
    {
        "id": 34,
        "question": "How many players are on a soccer team on the field?",
        "options": ["9", "10", "11", "12"],
        "correct_answer": 2,
        "category": "Sports",
        "difficulty": "easy"
    },
    {
        "id": 35,
        "question": "Which sport uses a shuttlecock?",
        "options": ["Tennis", "Badminton", "Squash", "Table Tennis"],
        "correct_answer": 1,
        "category": "Sports",
        "difficulty": "easy"
    },
    # Sports - Medium
    {
        "id": 36,
        "question": "How many Grand Slam tournaments are there in tennis?",
        "options": ["3", "4", "5", "6"],
        "correct_answer": 1,
        "category": "Sports",
        "difficulty": "medium"
    },
    {
        "id": 37,
        "question": "Which country has won the most FIFA World Cups?",
        "options": ["Germany", "Argentina", "Brazil", "Italy"],
        "correct_answer": 2,
        "category": "Sports",
        "difficulty": "medium"
    },
    # Sports - Hard
    {
        "id": 38,
        "question": "In which year were women first allowed to compete in the Olympic Games?",
        "options": ["1896", "1900", "1904", "1908"],
        "correct_answer": 1,
        "category": "Sports",
        "difficulty": "hard"
    },
    
    # Entertainment - Easy
    {
        "id": 39,
        "question": "What is the name of Harry Potter's owl?",
        "options": ["Errol", "Hedwig", "Pigwidgeon", "Scabbers"],
        "correct_answer": 1,
        "category": "Entertainment",
        "difficulty": "easy"
    },
    {
        "id": 40,
        "question": "Which movie features the quote 'May the Force be with you'?",
        "options": ["Star Trek", "Star Wars", "Interstellar", "Alien"],
        "correct_answer": 1,
        "category": "Entertainment",
        "difficulty": "easy"
    },
    # Entertainment - Medium
    {
        "id": 41,
        "question": "Who directed the movie 'Inception'?",
        "options": ["Steven Spielberg", "Christopher Nolan", "James Cameron", "Ridley Scott"],
        "correct_answer": 1,
        "category": "Entertainment",
        "difficulty": "medium"
    },
    {
        "id": 42,
        "question": "Which TV series features a character named Walter White?",
        "options": ["The Wire", "Breaking Bad", "Better Call Saul", "Dexter"],
        "correct_answer": 1,
        "category": "Entertainment",
        "difficulty": "medium"
    },
    # Entertainment - Hard
    {
        "id": 43,
        "question": "What was the first feature-length animated film ever released?",
        "options": ["Snow White", "El Apostol", "Fantasia", "Bambi"],
        "correct_answer": 1,
        "category": "Entertainment",
        "difficulty": "hard"
    },
]

# Difficulty multipliers for scoring
DIFFICULTY_MULTIPLIERS = {
    "easy": 1,
    "medium": 2,
    "hard": 3
}

# Time bonus thresholds (seconds)
TIME_BONUS_THRESHOLDS = {
    "fast": 5,      # Under 5 seconds = bonus
    "medium": 10,   # Under 10 seconds = smaller bonus
}

# Store game sessions and leaderboard
game_sessions: dict[str, dict] = {}
leaderboard: list[dict] = []


class AnswerRequest(BaseModel):
    session_id: str
    question_id: int
    answer_index: int
    time_taken: float  # Seconds taken to answer


class StartGameRequest(BaseModel):
    num_questions: int = 10
    category: Optional[str] = None
    difficulty: Optional[str] = None
    player_name: str = "Anonymous"


class LeaderboardEntry(BaseModel):
    player_name: str
    session_id: str


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "version": "2.0.0"}


@app.get("/categories")
async def get_categories():
    """Get all available quiz categories with question counts"""
    categories = {}
    for q in QUESTIONS:
        cat = q["category"]
        if cat not in categories:
            categories[cat] = {"total": 0, "easy": 0, "medium": 0, "hard": 0}
        categories[cat]["total"] += 1
        categories[cat][q["difficulty"]] += 1
    
    return {
        "categories": [
            {"name": cat, "counts": counts}
            for cat, counts in categories.items()
        ]
    }


@app.get("/difficulties")
async def get_difficulties():
    """Get available difficulty levels"""
    return {
        "difficulties": [
            {"name": "easy", "multiplier": 1, "label": "Easy"},
            {"name": "medium", "multiplier": 2, "label": "Medium"},
            {"name": "hard", "multiplier": 3, "label": "Hard"},
            {"name": "mixed", "multiplier": None, "label": "Mixed"}
        ]
    }


@app.post("/game/start")
async def start_game(request: StartGameRequest):
    """Start a new quiz game session with optional filters"""
    session_id = f"session_{int(time.time())}_{random.randint(1000, 9999)}"
    
    # Filter questions based on category and difficulty
    filtered_questions = QUESTIONS.copy()
    
    if request.category and request.category != "all":
        filtered_questions = [q for q in filtered_questions if q["category"] == request.category]
    
    if request.difficulty and request.difficulty != "mixed":
        filtered_questions = [q for q in filtered_questions if q["difficulty"] == request.difficulty]
    
    # Ensure we have enough questions
    num_questions = min(request.num_questions, len(filtered_questions))
    if num_questions == 0:
        raise fastapi.HTTPException(
            status_code=400,
            detail="No questions available for the selected filters"
        )
    
    # Select random questions for this game
    selected_questions = random.sample(filtered_questions, num_questions)
    
    game_sessions[session_id] = {
        "questions": selected_questions,
        "current_index": 0,
        "score": 0,
        "answers": [],
        "completed": False,
        "player_name": request.player_name,
        "streak": 0,
        "max_streak": 0,
        "started_at": time.time(),
        "total_time": 0,
        "category": request.category,
        "difficulty": request.difficulty
    }
    
    first_question = selected_questions[0]
    return {
        "session_id": session_id,
        "total_questions": num_questions,
        "current_question": {
            "id": first_question["id"],
            "question": first_question["question"],
            "options": first_question["options"],
            "category": first_question["category"],
            "difficulty": first_question["difficulty"],
            "question_number": 1,
            "time_limit": 30  # 30 seconds per question
        },
        "player_name": request.player_name
    }


@app.post("/game/answer")
async def submit_answer(request: AnswerRequest):
    """Submit an answer with time tracking and scoring"""
    session = game_sessions.get(request.session_id)
    
    if not session:
        raise fastapi.HTTPException(status_code=404, detail="Game session not found")
    
    if session["completed"]:
        raise fastapi.HTTPException(status_code=400, detail="Game already completed")
    
    current_question = session["questions"][session["current_index"]]
    
    # Check if the answer is correct
    is_correct = request.answer_index == current_question["correct_answer"]
    
    # Calculate points
    base_points = 100
    difficulty_multiplier = DIFFICULTY_MULTIPLIERS.get(current_question["difficulty"], 1)
    time_bonus = 0
    streak_bonus = 0
    
    if is_correct:
        # Time bonus
        if request.time_taken < TIME_BONUS_THRESHOLDS["fast"]:
            time_bonus = 50
        elif request.time_taken < TIME_BONUS_THRESHOLDS["medium"]:
            time_bonus = 25
        
        # Streak bonus
        session["streak"] += 1
        if session["streak"] > session["max_streak"]:
            session["max_streak"] = session["streak"]
        
        if session["streak"] >= 3:
            streak_bonus = (session["streak"] - 2) * 25  # +25 for 3 streak, +50 for 4, etc.
        
        points = (base_points * difficulty_multiplier) + time_bonus + streak_bonus
        session["score"] += points
    else:
        session["streak"] = 0
        points = 0
    
    session["total_time"] += request.time_taken
    
    # Store the answer
    session["answers"].append({
        "question_id": current_question["id"],
        "question": current_question["question"],
        "user_answer": request.answer_index,
        "correct_answer": current_question["correct_answer"],
        "is_correct": is_correct,
        "time_taken": request.time_taken,
        "points_earned": points,
        "difficulty": current_question["difficulty"]
    })
    
    # Move to next question
    session["current_index"] += 1
    
    response = {
        "is_correct": is_correct,
        "correct_answer": current_question["correct_answer"],
        "points_earned": points,
        "time_bonus": time_bonus,
        "streak_bonus": streak_bonus,
        "current_streak": session["streak"],
        "current_score": session["score"]
    }
    
    # Check if game is over
    if session["current_index"] >= len(session["questions"]):
        session["completed"] = True
        session["ended_at"] = time.time()
        response["game_over"] = True
        response["final_score"] = session["score"]
        response["total_questions"] = len(session["questions"])
    else:
        next_question = session["questions"][session["current_index"]]
        response["game_over"] = False
        response["next_question"] = {
            "id": next_question["id"],
            "question": next_question["question"],
            "options": next_question["options"],
            "category": next_question["category"],
            "difficulty": next_question["difficulty"],
            "question_number": session["current_index"] + 1,
            "time_limit": 30
        }
    
    return response


@app.get("/game/{session_id}/results")
async def get_results(session_id: str):
    """Get detailed results for a completed game"""
    session = game_sessions.get(session_id)
    
    if not session:
        raise fastapi.HTTPException(status_code=404, detail="Game session not found")
    
    if not session["completed"]:
        raise fastapi.HTTPException(status_code=400, detail="Game not completed yet")
    
    correct_count = sum(1 for a in session["answers"] if a["is_correct"])
    total_questions = len(session["questions"])
    
    # Calculate statistics
    avg_time = session["total_time"] / total_questions if total_questions > 0 else 0
    
    # Build detailed results
    detailed_results = []
    for answer in session["answers"]:
        question = next(q for q in session["questions"] if q["id"] == answer["question_id"])
        detailed_results.append({
            "question": question["question"],
            "category": question["category"],
            "difficulty": question["difficulty"],
            "options": question["options"],
            "user_answer": answer["user_answer"],
            "correct_answer": answer["correct_answer"],
            "is_correct": answer["is_correct"],
            "time_taken": answer["time_taken"],
            "points_earned": answer["points_earned"]
        })
    
    return {
        "player_name": session["player_name"],
        "score": session["score"],
        "correct_count": correct_count,
        "total_questions": total_questions,
        "percentage": round((correct_count / total_questions) * 100, 1),
        "max_streak": session["max_streak"],
        "total_time": round(session["total_time"], 1),
        "average_time": round(avg_time, 1),
        "category": session["category"],
        "difficulty": session["difficulty"],
        "details": detailed_results
    }


@app.post("/leaderboard/add")
async def add_to_leaderboard(entry: LeaderboardEntry):
    """Add a completed game to the leaderboard"""
    session = game_sessions.get(entry.session_id)
    
    if not session:
        raise fastapi.HTTPException(status_code=404, detail="Game session not found")
    
    if not session["completed"]:
        raise fastapi.HTTPException(status_code=400, detail="Game not completed yet")
    
    correct_count = sum(1 for a in session["answers"] if a["is_correct"])
    
    leaderboard_entry = {
        "player_name": entry.player_name,
        "score": session["score"],
        "correct_count": correct_count,
        "total_questions": len(session["questions"]),
        "max_streak": session["max_streak"],
        "total_time": round(session["total_time"], 1),
        "category": session["category"] or "All",
        "difficulty": session["difficulty"] or "Mixed",
        "timestamp": datetime.now().isoformat()
    }
    
    leaderboard.append(leaderboard_entry)
    
    # Sort by score descending
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    
    # Keep only top 100
    if len(leaderboard) > 100:
        leaderboard.pop()
    
    # Find rank
    rank = next(
        (i + 1 for i, e in enumerate(leaderboard) if e["player_name"] == entry.player_name and e["score"] == session["score"]),
        None
    )
    
    return {"rank": rank, "entry": leaderboard_entry}


@app.get("/leaderboard")
async def get_leaderboard(limit: int = 10, category: Optional[str] = None):
    """Get the top scores from the leaderboard"""
    filtered = leaderboard
    
    if category and category != "all":
        filtered = [e for e in leaderboard if e["category"] == category]
    
    return {
        "entries": filtered[:limit],
        "total_entries": len(filtered)
    }


@app.get("/stats")
async def get_stats():
    """Get overall quiz statistics"""
    total_games = len([s for s in game_sessions.values() if s["completed"]])
    total_questions_answered = sum(
        len(s["answers"]) for s in game_sessions.values()
    )
    
    if total_games > 0:
        avg_score = sum(
            s["score"] for s in game_sessions.values() if s["completed"]
        ) / total_games
    else:
        avg_score = 0
    
    return {
        "total_games_played": total_games,
        "total_questions_answered": total_questions_answered,
        "average_score": round(avg_score, 1),
        "total_questions_available": len(QUESTIONS),
        "categories_count": len(set(q["category"] for q in QUESTIONS))
    }
