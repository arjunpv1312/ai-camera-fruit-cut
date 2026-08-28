import { useState, useEffect } from 'react';
import type {
  Achievement,
  BladeStyle,
  ColorblindMode,
  GameMode,
  GameStats,
  HandData,
  HandSkin,
  Language,
  MathDifficulty,
  MathQuestion,
  QuizPack,
  UserProgress,
  WeaponType,
} from './types/game';
import { CameraTracker } from './components/CameraTracker';
import { GameCanvas } from './components/GameCanvas';
import { HUDOverlay } from './components/HUDOverlay';
import { GameControls } from './components/GameControls';
import { GameOverModal } from './components/GameOverModal';
import { NutritionModal } from './components/NutritionModal';
import { TeacherQuizEditor } from './components/TeacherQuizEditor';
import { AnalyticsModal } from './components/AnalyticsModal';
import { TutorialModal } from './components/TutorialModal';
import { audioEngine } from './utils/audioEngine';
import { addXp, loadUserProgress, saveUserProgress } from './utils/progression';
import { loadSessionState, saveSessionState } from './utils/sessionStore';

export function App() {
  const initialSession = loadSessionState();

  // User Progression & Preferences
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [currentLang, setCurrentLang] = useState<Language>(initialSession.currentLang);
  const [colorblindMode, setColorblindMode] = useState<ColorblindMode>(initialSession.colorblindMode);
  const [showFps, setShowFps] = useState<boolean>(initialSession.showFps);

  // Game Settings State (Restored from cache / session storage on refresh)
  const [gameMode, setGameMode] = useState<GameMode>(initialSession.gameMode);
  const [currentWeapon, setCurrentWeapon] = useState<WeaponType>(initialSession.currentWeapon);
  const [mathDifficulty, setMathDifficulty] = useState<MathDifficulty>(initialSession.mathDifficulty);
  const [bladeStyle, setBladeStyle] = useState<BladeStyle>(initialSession.bladeStyle);
  const [activeQuizPack, setActiveQuizPack] = useState<QuizPack | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(initialSession.isCameraActive);
  const [isMuted, setIsMuted] = useState<boolean>(initialSession.isMuted);

  // Always keep Web Audio engine mute state synced with React state
  useEffect(() => {
    audioEngine.setMuted(isMuted);
  }, [isMuted]);

  // Save session state to localStorage on any change so page refresh restores exact condition
  useEffect(() => {
    saveSessionState({
      gameMode,
      currentWeapon,
      mathDifficulty,
      bladeStyle,
      currentLang,
      colorblindMode,
      showFps,
      isCameraActive,
      isMuted,
    });
  }, [
    gameMode,
    currentWeapon,
    mathDifficulty,
    bladeStyle,
    currentLang,
    colorblindMode,
    showFps,
    isCameraActive,
    isMuted,
  ]);

  // Gameplay State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [handsData, setHandsData] = useState<HandData[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [currentMathQuestion, setCurrentMathQuestion] = useState<MathQuestion | null>(null);

  // Modals State
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showEncyclopedia, setShowEncyclopedia] = useState<boolean>(false);
  const [showTeacherQuiz, setShowTeacherQuiz] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Start Game Action
  const handleStartGame = () => {
    audioEngine.playButtonClick();
    setIsPlaying(true);
    setIsPaused(false);
    setShowMenu(false);
    setShowGameOver(false);
    setScore(0);
    setLives(3);
    setCombo(0);
  };

  // Return to Main Menu anytime
  const handleGoHome = () => {
    audioEngine.playButtonClick();
    setIsPlaying(false);
    setIsPaused(false);
    setShowGameOver(false);
    setShowMenu(true);
  };

  // Restart / Reset Round
  const handleResetRound = () => {
    audioEngine.playButtonClick();
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
      setIsPaused(false);
      setScore(0);
      setLives(3);
      setCombo(0);
    }, 50);
  };

  // GameOver handler
  const handleGameOver = (stats: GameStats, newAchievements: Achievement[]) => {
    setIsPlaying(false);
    setLastStats(stats);
    setAchievements(newAchievements);
    setShowGameOver(true);

    // Update Progress & XP
    const { updated } = addXp(progress, stats.xpEarned || 100);
    updated.totalFruitsCut += stats.fruitsCut;
    if (stats.score > updated.highScore) updated.highScore = stats.score;
    setProgress(updated);
    saveUserProgress(updated);
  };

  // Toggle Hand Skin
  const handleSelectSkin = (skin: HandSkin) => {
    const updated = { ...progress, activeSkin: skin };
    setProgress(updated);
    saveUserProgress(updated);
  };

  // Toggle Colorblind Modes
  const handleToggleColorblind = () => {
    const modes: ColorblindMode[] = ['none', 'high_contrast', 'deuteranopia', 'protanopia'];
    const nextIdx = (modes.indexOf(colorblindMode) + 1) % modes.length;
    setColorblindMode(modes[nextIdx]);
  };

  // Toggle Mute Audio
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  };

  // Toggle Pause
  const handleTogglePause = () => {
    audioEngine.playButtonClick();
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 60 FPS HTML5 Game Canvas */}
      <GameCanvas
        handsData={handsData}
        gameMode={gameMode}
        currentWeapon={currentWeapon}
        activeSkin={progress.activeSkin}
        colorblindMode={colorblindMode}
        showFps={showFps}
        activeQuizPack={activeQuizPack}
        isPlaying={isPlaying}
        isPaused={isPaused}
        bladeStyle={bladeStyle}
        mathDifficulty={mathDifficulty}
        onGameOver={handleGameOver}
        onQuestionChange={setCurrentMathQuestion}
        onComboUpdate={setCombo}
        onScoreUpdate={setScore}
        onLivesUpdate={setLives}
      />

      {/* AI Webcam Dual Hands Tracker Component */}
      <CameraTracker
        onHandsMove={setHandsData}
        onCameraStatusChange={() => {}}
        isCameraActive={isCameraActive}
        setIsCameraActive={setIsCameraActive}
      />

      {/* Live HUD Overlay when playing */}
      {isPlaying && !showMenu && !showGameOver && (
        <HUDOverlay
          score={score}
          lives={lives}
          gameMode={gameMode}
          currentWeapon={currentWeapon}
          currentLang={currentLang}
          progress={progress}
          colorblindMode={colorblindMode}
          showFps={showFps}
          onSelectWeapon={setCurrentWeapon}
          onChangeLanguage={setCurrentLang}
          onToggleColorblind={handleToggleColorblind}
          onToggleFps={() => setShowFps(!showFps)}
          combo={combo}
          isMuted={isMuted}
          isPaused={isPaused}
          currentMathQuestion={currentMathQuestion}
          onToggleMute={handleToggleMute}
          onTogglePause={handleTogglePause}
          onOpenEncyclopedia={() => setShowEncyclopedia(true)}
          onOpenAnalytics={() => setShowAnalytics(true)}
          onOpenTeacherQuiz={() => setShowTeacherQuiz(true)}
          onGoHome={handleGoHome}
          onResetRound={handleResetRound}
        />
      )}

      {/* Main Menu Modal */}
      {showMenu && (
        <GameControls
          gameMode={gameMode}
          setGameMode={setGameMode}
          mathDifficulty={mathDifficulty}
          setMathDifficulty={setMathDifficulty}
          bladeStyle={bladeStyle}
          setBladeStyle={setBladeStyle}
          currentLang={currentLang}
          progress={progress}
          onSelectSkin={handleSelectSkin}
          isCameraActive={isCameraActive}
          setIsCameraActive={setIsCameraActive}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onStartGame={handleStartGame}
          onOpenEncyclopedia={() => setShowEncyclopedia(true)}
          onOpenAnalytics={() => setShowAnalytics(true)}
          onOpenTeacherQuiz={() => setShowTeacherQuiz(true)}
          onOpenTutorial={() => setShowTutorial(true)}
        />
      )}

      {/* Game Over Summary Screen */}
      {showGameOver && lastStats && (
        <GameOverModal
          stats={lastStats}
          achievements={achievements}
          onPlayAgain={handleStartGame}
          onGoHome={handleGoHome}
        />
      )}

      {/* Fruit Nutrition Encyclopedia Modal */}
      {showEncyclopedia && <NutritionModal onClose={() => setShowEncyclopedia(false)} />}

      {/* Teacher Quiz Creator Modal */}
      {showTeacherQuiz && (
        <TeacherQuizEditor
          onClose={() => setShowTeacherQuiz(false)}
          onSelectQuizToPlay={(pack) => {
            setActiveQuizPack(pack);
            setGameMode('teacher_quiz');
            setShowTeacherQuiz(false);
            handleStartGame();
          }}
        />
      )}

      {/* Learning Analytics Dashboard Modal */}
      {showAnalytics && <AnalyticsModal progress={progress} onClose={() => setShowAnalytics(false)} />}

      {/* Interactive Air Hands Tutorial Modal */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
export default App;
