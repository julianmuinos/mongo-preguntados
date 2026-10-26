import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CATEGORIES, QUESTIONS } from './data/questions';
import Header from './components/Header';
import Wheel from './components/Wheel';
import QuestionCard from './components/QuestionCard';
import ExplanationModal from './components/ExplanationModal';
import CrownPickerModal from './components/CrownPickerModal';
import GameOverModal from './components/GameOverModal';
import RulesModal from './components/RulesModal';
import { soundManager } from './utils/audio';

// Safe localStorage access (CL-8)
const STORAGE_KEYS = {
  HIGH_SCORE: 'mongo_preguntados_high_score',
  SOUND: 'mongo_preguntados_sound',
};

const getStoredNumber = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? Number(val) : fallback;
  } catch {
    return fallback;
  }
};

const getStoredBoolean = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val === 'true' : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  // Global Persisted Settings
  const [highScore, setHighScore] = useState(() => getStoredNumber(STORAGE_KEYS.HIGH_SCORE, 0));
  const [soundEnabled, setSoundEnabled] = useState(() => getStoredBoolean(STORAGE_KEYS.SOUND, false));
  const [showRules, setShowRules] = useState(false);

  // Sync sound manager with state
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
    } catch {
      // Ignore localStorage errors
    }
  }, [soundEnabled]);

  // Game Phases: 'start' | 'wheel' | 'crown_picker' | 'question' | 'feedback' | 'game_over' | 'victory'
  const [gamePhase, setGamePhase] = useState('start');

  // Core Game State
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [crowns, setCrowns] = useState([]); // array of category IDs
  const [isSpinning, setIsSpinning] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Power-ups (1 use each per match)
  const [powerUps, setPowerUps] = useState({
    fiftyFifty: true,
    extraTime: true,
    skip: true,
  });

  // Current Question State
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isCrownQuestion, setIsCrownQuestion] = useState(false);
  const [hiddenOptionIndices, setHiddenOptionIndices] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null); // 'correct' | 'wrong' | 'timeout'
  const [pointsEarned, setPointsEarned] = useState(0);
  const [wonCrownInTurn, setWonCrownInTurn] = useState(false);

  // Question tracking to avoid repeats (CL-1)
  const usedQuestionIdsRef = useRef(new Set());
  const lastQuestionIdPerCatRef = useRef({});

  // Performance statistics for end screen (RF-23)
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    byCategory: {}, // { [catId]: { asked: 0, correct: 0 } }
  });

  // Toggle Sound (RF-27)
  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Start / Restart Match (RF-2, RF-24)
  const startNewGame = useCallback(() => {
    setLives(3);
    setScore(0);
    setStreak(0);
    setCrowns([]);
    setIsSpinning(false);
    setIsNewHighScore(false);
    setPowerUps({ fiftyFifty: true, extraTime: true, skip: true });
    usedQuestionIdsRef.current = new Set();
    lastQuestionIdPerCatRef.current = {};
    setStats({
      totalQuestions: 0,
      correctAnswers: 0,
      byCategory: {},
    });
    setGamePhase('wheel');
  }, []);

  // Question Selector with repetition avoidance (CL-1)
  const pickQuestionForCategory = useCallback((category) => {
    const allForCat = QUESTIONS.filter((q) => q.category === category.id);
    let available = allForCat.filter((q) => !usedQuestionIdsRef.current.has(q.id));

    // If all questions for this category have been used, reset pool without repeating the very last one
    if (available.length === 0) {
      const lastId = lastQuestionIdPerCatRef.current[category.id];
      available = allForCat.filter((q) => q.id !== lastId);
      // Remove this category's IDs from used pool
      allForCat.forEach((q) => usedQuestionIdsRef.current.delete(q.id));
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available[randomIndex];

    usedQuestionIdsRef.current.add(chosen.id);
    lastQuestionIdPerCatRef.current[category.id] = chosen.id;
    return chosen;
  }, []);

  // Launch Question Card
  const launchQuestion = useCallback((category, forCrown = false) => {
    const q = pickQuestionForCategory(category);
    setCurrentCategory(category);
    setCurrentQuestion(q);
    setIsCrownQuestion(forCrown);
    setHiddenOptionIndices([]);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setGamePhase('question');
  }, [pickQuestionForCategory]);

  // When wheel finishes spinning (RF-6, RF-13)
  const handleSpinEnd = (selectedCategory) => {
    // If player already reached 3 streak, check if they should pick a crown instead
    if (streak >= 3 && crowns.length < CATEGORIES.length) {
      handlePromptCrownPicker();
      return;
    }
    launchQuestion(selectedCategory, false);
  };

  // Crown Picker Trigger (RF-13, CL-7)
  const handlePromptCrownPicker = () => {
    const missingCrownIds = CATEGORIES.map((c) => c.id).filter((id) => !crowns.includes(id));
    if (missingCrownIds.length === 1) {
      // Auto-pick the last remaining crown (CL-7)
      const lastCat = CATEGORIES.find((c) => c.id === missingCrownIds[0]);
      launchQuestion(lastCat, true);
    } else {
      setGamePhase('crown_picker');
    }
  };

  // Selection from Crown Picker Modal
  const handleSelectCrownCategory = (category) => {
    launchQuestion(category, true);
  };

  // Record stats helper
  const recordStat = (catId, isCorrect) => {
    setStats((prev) => {
      const catData = prev.byCategory[catId] || { asked: 0, correct: 0 };
      return {
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        byCategory: {
          ...prev.byCategory,
          [catId]: {
            asked: catData.asked + 1,
            correct: catData.correct + (isCorrect ? 1 : 0),
          },
        },
      };
    });
  };

  // Option Selected by Player (RF-8, RF-9, RF-10)
  const handleSelectOption = useCallback((optionIndex, secondsLeft) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionIndex(optionIndex);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    recordStat(currentCategory.id, isCorrect);

    if (isCorrect) {
      // Calculate score: easy=100, med=200, adv=300 + 5 * seconds
      const diffMultiplier = { facil: 100, medio: 200, avanzado: 300 }[currentQuestion.difficulty] || 150;
      const earned = diffMultiplier + secondsLeft * 5;
      const newScore = score + earned;
      setScore(newScore);
      setPointsEarned(earned);

      // Check high score (RF-25)
      if (newScore > highScore) {
        setHighScore(newScore);
        setIsNewHighScore(true);
        try {
          localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(newScore));
        } catch {
          // Ignore error
        }
      }

      // Check Crown Win (RF-14)
      if (isCrownQuestion && !crowns.includes(currentCategory.id)) {
        const newCrowns = [...crowns, currentCategory.id];
        setCrowns(newCrowns);
        setWonCrownInTurn(true);
        soundManager.playCrown();
        // Regain 1 life (max 3)
        setLives((prev) => Math.min(3, prev + 1));
        // Reset streak after winning crown
        setStreak(0);

        // Check Victory Condition (RF-21, CL-12)
        if (newCrowns.length === CATEGORIES.length) {
          setTimeout(() => {
            setFeedbackStatus('correct');
            setGamePhase('feedback');
          }, 600);
          return;
        }
      } else {
        setWonCrownInTurn(false);
        soundManager.playCorrect();
        setStreak((prev) => prev + 1);
      }

      setTimeout(() => {
        setFeedbackStatus('correct');
        setGamePhase('feedback');
      }, 700);
    } else {
      // Wrong answer (RF-10)
      soundManager.playWrong();
      setPointsEarned(0);
      setWonCrownInTurn(false);
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);

      setTimeout(() => {
        setFeedbackStatus('wrong');
        setGamePhase('feedback');
      }, 700);
    }
  }, [isAnswered, currentQuestion, currentCategory, score, highScore, isCrownQuestion, crowns, lives]);

  // Timeout Event (RF-11, CL-2)
  const handleTimeout = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionIndex(null);
    soundManager.playWrong();
    recordStat(currentCategory.id, false);

    setPointsEarned(0);
    setWonCrownInTurn(false);
    setStreak(0);
    const newLives = lives - 1;
    setLives(newLives);

    setTimeout(() => {
      setFeedbackStatus('timeout');
      setGamePhase('feedback');
    }, 500);
  }, [isAnswered, currentCategory, lives]);

  // Power-up: 50/50 (RF-17, CL-4, CL-5)
  const handleUseFiftyFifty = () => {
    if (!powerUps.fiftyFifty || isAnswered || hiddenOptionIndices.length > 0) return;
    setPowerUps((prev) => ({ ...prev, fiftyFifty: false }));

    const wrongIndices = [0, 1, 2, 3].filter((idx) => idx !== currentQuestion.correctIndex);
    // Shuffle and pick 2 to hide
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    const toHide = shuffledWrong.slice(0, 2);
    setHiddenOptionIndices(toHide);
  };

  // Power-up: Extra Time (+15s) (RF-18, CL-4)
  const handleUseExtraTime = () => {
    if (!powerUps.extraTime || isAnswered) return;
    setPowerUps((prev) => ({ ...prev, extraTime: false }));
  };

  // Power-up: Skip (RF-19, CL-13)
  const handleUseSkip = () => {
    if (!powerUps.skip || isAnswered) return;
    setPowerUps((prev) => ({ ...prev, skip: false }));
    // Return to wheel without penalty
    setGamePhase('wheel');
  };

  // Continue after feedback modal
  const handleContinueAfterFeedback = () => {
    // Check Victory (RF-21)
    if (crowns.length === CATEGORIES.length) {
      setGamePhase('victory');
      return;
    }

    // Check Defeat (RF-22)
    if (lives <= 0) {
      setGamePhase('game_over');
      return;
    }

    // Check if player has 3 streak ready for Crown
    if (streak >= 3 && crowns.length < CATEGORIES.length) {
      handlePromptCrownPicker();
      return;
    }

    // Otherwise back to Wheel
    setGamePhase('wheel');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col flex-1 pb-8">
        {/* Header Bar */}
        {gamePhase !== 'start' && (
          <Header
            lives={lives}
            score={score}
            streak={streak}
            crowns={crowns}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {/* Phase 1: Start Screen (RF-1) */}
        {gamePhase === 'start' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 animate-fadeIn">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#00684A] via-[#00ED64] to-[#4eed8a] flex items-center justify-center text-5xl shadow-2xl glow-emerald mb-6 border-2 border-white/40">
              🍃
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-2">
              Mongo<span className="text-emerald-400">Preguntados</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
              El juego de trivia oficial basado en la guía teórica de <strong>MongoDB y Mongoose</strong>. ¿Podrás conquistar las 6 coronas?
            </p>

            {/* High Score Badge */}
            {highScore > 0 && (
              <div className="mb-8 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-bold inline-flex items-center gap-2">
                <span>🏆 Récord Actual:</span>
                <span className="text-emerald-400 font-black text-sm">{highScore} pts</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={startNewGame}
                className="py-4 px-8 rounded-2xl font-black text-base uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#00ED64] to-[#4eed8a] hover:from-[#4eed8a] hover:to-[#00ED64] shadow-xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                🎮 Jugar Ahora
              </button>
              <button
                onClick={() => setShowRules(true)}
                className="py-4 px-6 rounded-2xl font-bold text-sm text-slate-300 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:text-white transition-all cursor-pointer"
              >
                📖 Cómo se juega
              </button>
            </div>

            {/* Category Badges Preview */}
            <div className="mt-12 flex flex-wrap justify-center gap-2 max-w-md">
              {CATEGORIES.map((c) => (
                <span
                  key={c.id}
                  className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 border border-slate-800 text-slate-400 flex items-center gap-1"
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Phase 2: Wheel Phase (RF-3, RF-4, RF-5) */}
        {gamePhase === 'wheel' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 animate-fadeIn">
            {streak >= 3 && crowns.length < CATEGORIES.length && (
              <div className="mb-4 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center gap-2 animate-bounce">
                <span>👑</span>
                <span>¡Racha desbloqueada! Girando por una oportunidad de Corona.</span>
              </div>
            )}

            <Wheel
              onSpinEnd={handleSpinEnd}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
              disabled={lives <= 0}
            />
          </div>
        )}

        {/* Phase 3: Question Phase (RF-6, RF-7, RF-8, RF-9, RF-10) */}
        {gamePhase === 'question' && currentQuestion && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 animate-fadeIn">
            <QuestionCard
              question={currentQuestion}
              category={currentCategory}
              isCrownQuestion={isCrownQuestion}
              onSelectOption={handleSelectOption}
              onTimeout={handleTimeout}
              onUseFiftyFifty={handleUseFiftyFifty}
              onUseExtraTime={handleUseExtraTime}
              onUseSkip={handleUseSkip}
              powerUps={powerUps}
              hiddenOptionIndices={hiddenOptionIndices}
              selectedOptionIndex={selectedOptionIndex}
              isAnswered={isAnswered}
            />
          </div>
        )}

        {/* Crown Picker Modal (RF-13, CL-7) */}
        {gamePhase === 'crown_picker' && (
          <CrownPickerModal
            availableCrownIds={CATEGORIES.map((c) => c.id).filter((id) => !crowns.includes(id))}
            onSelectCategory={handleSelectCrownCategory}
          />
        )}

        {/* Explanation Feedback Modal (RF-12) */}
        {gamePhase === 'feedback' && (
          <ExplanationModal
            status={feedbackStatus}
            question={currentQuestion}
            category={currentCategory}
            pointsEarned={pointsEarned}
            wonCrown={wonCrownInTurn}
            onContinue={handleContinueAfterFeedback}
          />
        )}

        {/* Victory & Defeat Modals (RF-21, RF-22, RF-23, RF-24) */}
        {(gamePhase === 'game_over' || gamePhase === 'victory') && (
          <GameOverModal
            isVictory={gamePhase === 'victory'}
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            stats={stats}
            crowns={crowns}
            onRestart={startNewGame}
          />
        )}

        {/* Rules & Help Modal (RF-1) */}
        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-3 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950/40">
        ITBA · Full Stack Developer · Basado en el Manual de MongoDB v9.0 y Mongoose v9.x
      </footer>
    </div>
  );
}
