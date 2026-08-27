import { useState } from 'react';
import type {
  Achievement,
  BladeStyle,
  GameMode,
  GameStats,
  HandData,
  MathDifficulty,
  MathQuestion,
  WeaponType,
} from './types/game';
import { CameraTracker } from './components/CameraTracker';
import { GameCanvas } from './components/GameCanvas';
import { HUDOverlay } from './components/HUDOverlay';
import { GameControls } from './components/GameControls';
import { GameOverModal } from './components/GameOverModal';
import { NutritionModal } from './components/NutritionModal';
import { audioEngine } from './utils/audioEngine';

export function App() {
  // Game Settings State
  const [gameMode, setGameMode] = useState<GameMode>('arcade');
  const [currentWeapon, setCurrentWeapon] = useState<WeaponType>('katana');
  const [mathDifficulty, setMathDifficulty] = useState<MathDifficulty>('easy');
  const [bladeStyle, setBladeStyle] = useState<BladeStyle>('electric');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Gameplay State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [handsData, setHandsData] = useState<HandData[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [currentMathQuestion, setCurrentMathQuestion] = useState<MathQuestion | null>(null);

  // Modals & Summary State
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showEncyclopedia, setShowEncyclopedia] = useState<boolean>(false);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Start game action
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

  // GameOver handler
  const handleGameOver = (stats: GameStats, newAchievements: Achievement[]) => {
    setIsPlaying(false);
    setLastStats(stats);
    setAchievements(newAchievements);
    setShowGameOver(true);
  };

  // Toggle Mute Audio
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
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
          onSelectWeapon={setCurrentWeapon}
          combo={combo}
          isMuted={isMuted}
          isPaused={isPaused}
          currentMathQuestion={currentMathQuestion}
          onToggleMute={handleToggleMute}
          onTogglePause={handleTogglePause}
          onOpenEncyclopedia={() => setShowEncyclopedia(true)}
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
          isCameraActive={isCameraActive}
          setIsCameraActive={setIsCameraActive}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onStartGame={handleStartGame}
          onOpenEncyclopedia={() => setShowEncyclopedia(true)}
        />
      )}

      {/* Game Over Summary Screen */}
      {showGameOver && lastStats && (
        <GameOverModal
          stats={lastStats}
          achievements={achievements}
          onPlayAgain={handleStartGame}
          onGoHome={() => {
            setShowGameOver(false);
            setShowMenu(true);
          }}
        />
      )}

      {/* Fruit Nutrition Encyclopedia Modal */}
      {showEncyclopedia && <NutritionModal onClose={() => setShowEncyclopedia(false)} />}
    </div>
  );
}
export default App;
