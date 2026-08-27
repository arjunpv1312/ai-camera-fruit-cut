import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Eye, EyeOff, Sparkles } from 'lucide-react';
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
  const [showPreview, setShowPreview] = useState<boolean>(true);
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

      if (!window.Hands || !window.Camera) {
        setErrorMessage('MediaPipe scripts loading... Please wait.');
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
      {/* Camera PIP Box */}
      {isCameraActive && (
        <div
          className={`relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/85 backdrop-blur-md shadow-2xl transition-all duration-300 ${
            showPreview ? 'w-52 h-40' : 'w-52 h-10'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border-b border-slate-700/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Dual AI Hands ({handsCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                title={showPreview ? 'Minimize Camera' : 'Expand Camera'}
              >
                {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Video Preview */}
          {showPreview && (
            <div className="relative w-full h-[calc(100%-2.25rem)] bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover transform -scale-x-100"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                width={208}
                height={124}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Loading Spinner */}
              {isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-sky-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="text-[10px] font-medium text-slate-300">Starting Dual AI Camera...</span>
                </div>
              )}

              {/* Hand Detection Status Pill */}
              {!isInitializing && (
                <div
                  className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md ${
                    handsCount > 0
                      ? 'bg-emerald-500/80 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-amber-500/80 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {handsCount > 0 ? (
                    <span>{handsCount === 2 ? '👐 Dual Hands Active' : '🖐️ 1 Hand Active'}</span>
                  ) : (
                    <span>Raise Hands in Air 🖐️</span>
                  )}
                </div>
              )}
            </div>
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
        <span>{isCameraActive ? 'Dual AI Camera ON' : 'Use Dual Air Hands'}</span>
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
