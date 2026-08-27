import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Sparkles } from 'lucide-react';
import type { HandData, Point } from '../types/game';

interface CameraTrackerProps {
  onHandsMove: (hands: HandData[]) => void;
  onCameraStatusChange: (active: boolean) => void;
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
}

export const CameraTracker: React.FC<CameraTrackerProps> = ({
  onHandsMove,
  onCameraStatusChange,
  isCameraActive,
  setIsCameraActive,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handsCount, setHandsCount] = useState<number>(0);

  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!isCameraActive) {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function initMediaPipe() {
      setIsInitializing(true);
      setErrorMessage(null);

      // Wait for CDN scripts if still loading
      let retries = 0;
      while ((!window.Hands || !window.Camera) && retries < 25) {
        await new Promise((r) => setTimeout(r, 200));
        retries++;
        if (!isMounted) return;
      }

      if (!window.Hands || !window.Camera) {
        setErrorMessage('Webcam AI ready in Mouse / Touch mode (scripts offline).');
        setIsInitializing(false);
        setIsCameraActive(false);
        onCameraStatusChange(false);
        return;
      }

      try {
        const hands = new window.Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        // Dual Hand AI Tracking
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (!isMounted) return;

          const canvasCtx = canvasRef.current?.getContext('2d');
          if (canvasCtx && canvasRef.current) {
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            setHandsCount(results.multiHandLandmarks.length);
            const detectedHands: HandData[] = [];

            results.multiHandLandmarks.forEach((landmarks: any[], idx: number) => {
              const label = results.multiHandedness?.[idx]?.label === 'Left' ? 'Right' : 'Left'; // Mirrored

              // Index Tip is landmark 8, Palm center is landmark 9, Wrist is 0
              const indexTipRaw = landmarks[8];
              const palmCenterRaw = landmarks[9];
              const wristRaw = landmarks[0];

              if (indexTipRaw && palmCenterRaw && wristRaw) {
                // Mirrored coordinates for natural air controls
                const indexTip: Point = { x: 1 - indexTipRaw.x, y: indexTipRaw.y };
                const palmCenter: Point = { x: 1 - palmCenterRaw.x, y: palmCenterRaw.y };
                const wrist: Point = { x: 1 - wristRaw.x, y: wristRaw.y };

                // Gesture Detection: Fist vs Open Palm
                // Distances between fingertips (8, 12, 16, 20) and wrist (0)
                const d8 = Math.hypot(landmarks[8].x - wristRaw.x, landmarks[8].y - wristRaw.y);
                const d12 = Math.hypot(landmarks[12].x - wristRaw.x, landmarks[12].y - wristRaw.y);
                const d16 = Math.hypot(landmarks[16].x - wristRaw.x, landmarks[16].y - wristRaw.y);
                const isFist = d8 < 0.22 && d12 < 0.22 && d16 < 0.22;
                const isOpenPalm = d8 > 0.35 && d12 > 0.35 && d16 > 0.35;

                const convertedLandmarks: Point[] = landmarks.map((pt: any) => ({
                  x: 1 - pt.x,
                  y: pt.y,
                }));

                detectedHands.push({
                  handIndex: idx,
                  label,
                  indexTip,
                  palmCenter,
                  wrist,
                  landmarks: convertedLandmarks,
                  isFist,
                  isOpenPalm,
                  velocity: { x: 0, y: 0 },
                });

                // Render hand skeleton on preview window
                if (canvasCtx && canvasRef.current) {
                  const w = canvasRef.current.width;
                  const h = canvasRef.current.height;

                  // Draw connecting lines
                  canvasCtx.strokeStyle = idx === 0 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(244, 63, 94, 0.7)';
                  canvasCtx.lineWidth = 2.5;

                  landmarks.forEach((pt: any) => {
                    canvasCtx.beginPath();
                    canvasCtx.arc((1 - pt.x) * w, pt.y * h, 3, 0, Math.PI * 2);
                    canvasCtx.fillStyle = idx === 0 ? '#38bdf8' : '#f43f5e';
                    canvasCtx.fill();
                  });

                  // Draw glowing weapon gauntlet tip
                  canvasCtx.fillStyle = '#ffea00';
                  canvasCtx.shadowColor = '#ffab00';
                  canvasCtx.shadowBlur = 10;
                  canvasCtx.beginPath();
                  canvasCtx.arc((1 - indexTipRaw.x) * w, indexTipRaw.y * h, 7, 0, Math.PI * 2);
                  canvasCtx.fill();
                  canvasCtx.shadowBlur = 0;
                }
              }
            });

            onHandsMove(detectedHands);
          } else {
            setHandsCount(0);
            onHandsMove([]);
          }
        });

        handsRef.current = hands;

        if (videoRef.current) {
          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && handsRef.current) {
                await handsRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });

          await camera.start();
          cameraRef.current = camera;
          setIsInitializing(false);
          onCameraStatusChange(true);
        }
      } catch (err: any) {
        console.error('Camera Init Error:', err);
        setErrorMessage('Webcam unavailable. Switched to Mouse mode.');
        setIsInitializing(false);
        setIsCameraActive(false);
        onCameraStatusChange(false);
      }
    }

    initMediaPipe();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isCameraActive]);

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
    onCameraStatusChange(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 select-none">
      {/* Hidden video element for MediaPipe AI processing (Face NEVER shown on screen) */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
        autoPlay
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} className="hidden" style={{ display: 'none' }} />

      {/* Futuristic HUD Hand Tracking Status Badge */}
      {isCameraActive && (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-lg shadow-xl text-xs font-bold font-outfit">
          <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          {isInitializing ? (
            <div className="flex items-center gap-1.5 text-amber-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Calibrating AI Hands...</span>
            </div>
          ) : handsCount > 0 ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <span>{handsCount === 2 ? '👐 Dual Hands Air Tracking' : '🖐️ 1 Hand Air Tracking'}</span>
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <span>Raise Hands in Air 🖐️</span>
            </span>
          )}
        </div>
      )}

      {/* Camera Toggle Button */}
      <button
        onClick={() => setIsCameraActive(!isCameraActive)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md shadow-lg ${
          isCameraActive
            ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/25 ring-2 ring-sky-300/40'
            : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 border border-slate-700/60'
        }`}
      >
        {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4 text-rose-400" />}
        <span>{isCameraActive ? 'AI Hands Vision Active' : 'Enable AI Air Hands'}</span>
      </button>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-2.5 max-w-xs rounded-xl bg-rose-950/90 border border-rose-700/60 text-rose-200 text-xs shadow-xl animate-fade-in">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
