"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { verifyAndUseTicket } from "@/actions/tickets";
import { Camera, CameraOff, Bolt, Check } from "lucide-react";
import type { VerificationResult } from "@/types";

type DisplayState = "idle" | "scanning" | "success" | "used" | "invalid";

function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback((freq: number, duration: number, times = 1) => {
    try {
      const ctx = getCtx();
      for (let i = 0; i < times; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * (duration + 0.05) / 1000);
        gain.gain.setValueAtTime(0.5, ctx.currentTime + i * (duration + 0.05) / 1000);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * (duration + 0.05) / 1000 + duration / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * (duration + 0.05) / 1000);
        osc.stop(ctx.currentTime + i * (duration + 0.05) / 1000 + duration / 1000);
      }
    } catch {
    }
  }, [getCtx]);

  const playSuccess = useCallback(() => playBeep(880, 200), [playBeep]);
  const playError = useCallback(() => playBeep(280, 250, 2), [playBeep]);

  return { playSuccess, playError };
}

export function QRScanner() {
  const [display, setDisplay] = useState<DisplayState>("idle");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const flashTrackRef = useRef<MediaStreamTrack | null>(null);
  const scannerContainerId = "qr-reader-element";
  const { playSuccess, playError } = useSound();

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const processCode = async (code: string) => {
    setIsProcessing(true);
    try {
      const res = await verifyAndUseTicket(code);
      setResult(res);
      if (res.status === "SUCCESS") {
        setDisplay("success");
        playSuccess();
      } else if (res.status === "ALREADY_USED") {
        setDisplay("used");
        playError();
      } else {
        setDisplay("invalid");
        playError();
      }
    } catch {
      setResult({ status: "INVALID", message: "Erreur de vérification" });
      setDisplay("invalid");
      playError();
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFlash = async () => {
    if (!flashTrackRef.current) return;
    try {
      await flashTrackRef.current.applyConstraints({
        advanced: [{ torch: !flashOn } as unknown as MediaTrackConstraintSet],
      });
      setFlashOn(!flashOn);
    } catch {
    }
  };

  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop().catch(() => {});
      }
      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded) => {
          scanner.stop().catch(() => {});
          processCode(decoded);
        },
        () => {}
      );
      setDisplay("scanning");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        const track = stream.getVideoTracks()[0];
        flashTrackRef.current = track;
      } catch {
      }
    } catch {
      alert("Impossible d'accéder à la caméra. Utilisez la saisie manuelle.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
    }
    if (flashTrackRef.current) {
      flashTrackRef.current.stop();
      flashTrackRef.current = null;
    }
    setFlashOn(false);
    setDisplay("idle");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      stopScanner();
      processCode(manualCode.trim());
    }
  };

  const resetScanner = () => {
    setDisplay("idle");
    setResult(null);
    setManualCode("");
    setFlashOn(false);
    if (flashTrackRef.current) {
      flashTrackRef.current.stop();
      flashTrackRef.current = null;
    }
  };

  const nextTicket = () => {
    setDisplay("idle");
    setResult(null);
    setManualCode("");
    setFlashOn(false);
    if (flashTrackRef.current) {
      flashTrackRef.current.stop();
      flashTrackRef.current = null;
    }
    startScanner();
  };

  const flashClass = (() => {
    if (display === "success") return "flash-green";
    if (display === "invalid" || display === "used") return "flash-red";
    return "";
  })();

  return (
    <div className={`min-h-screen bg-black ${flashClass}`}>
      <style jsx global>{`
        @keyframes flashGreen {
          0% { background-color: rgba(34, 197, 94, 0.9); }
          100% { background-color: transparent; }
        }
        @keyframes flashRed {
          0% { background-color: rgba(239, 68, 68, 0.9); }
          100% { background-color: transparent; }
        }
        .flash-green {
          animation: flashGreen 0.6s ease-out;
        }
        .flash-red {
          animation: flashRed 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(250, 204, 21, 0); }
        }
        .pulse-glow {
          animation: pulseGlow 1.5s infinite;
        }
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .scan-line {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #facc15, transparent);
          animation: scanLine 2s linear infinite;
        }
      `}</style>

      <div className="flex flex-col min-h-screen">
        <header className="px-4 py-3 flex items-center justify-between border-b border-zinc-800">
          <h1 className="font-display text-lg font-bold text-gala-400">Contrôle d&apos;accès</h1>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Scanner</span>
        </header>

        <div className="flex-1 flex flex-col">
          {display === "idle" && !isProcessing && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-zinc-600" />
                </div>
                <p className="text-zinc-400 text-sm">Prêt à scanner les tickets</p>
              </div>

              <button
                onClick={startScanner}
                className="w-full max-w-xs py-5 rounded-2xl bg-gala-600 text-white font-bold text-lg shadow-lg shadow-gala-600/30 active:scale-95 transition-transform"
              >
                <Camera className="w-6 h-6 inline mr-2" />
                Activer la caméra
              </button>

              <div className="w-full max-w-xs border-t border-zinc-800 pt-6">
                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <p className="text-sm text-zinc-500 text-center">Saisie manuelle</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="UUID du ticket"
                      className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:border-gala-500 focus:outline-none text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!manualCode.trim()}
                      className="px-5 py-3 rounded-xl bg-zinc-800 text-white font-medium disabled:opacity-40 active:scale-95 transition-transform"
                    >
                      OK
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {display === "scanning" && !isProcessing && (
            <div className="flex-1 flex flex-col">
              <div className="relative flex-1 flex items-center justify-center bg-zinc-950">
                <div id={scannerContainerId} className="w-full max-w-sm mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-2xl border-2 border-gala-500/50 pulse-glow relative">
                    <div className="scan-line" />
                  </div>
                </div>
                <p className="absolute bottom-24 text-gala-400 text-sm font-medium animate-pulse">
                  Scannez le QR code...
                </p>
              </div>
              <div className="px-4 py-4 flex gap-3">
                {flashTrackRef.current && (
                  <button
                    onClick={toggleFlash}
                    className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      flashOn ? "bg-gala-600 text-white" : "bg-zinc-900 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    <Bolt className={`w-5 h-5 ${flashOn ? "text-yellow-300" : ""}`} />
                    Flash
                  </button>
                )}
                <button
                  onClick={stopScanner}
                  className="flex-1 py-4 rounded-xl bg-red-600/20 text-red-400 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CameraOff className="w-5 h-5" />
                  Arrêter
                </button>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full border-4 border-gala-500 border-t-transparent animate-spin" />
              <p className="text-gala-400 text-lg font-medium">Vérification...</p>
            </div>
          )}

          {display === "success" && result && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in-up">
              <div className="w-full max-w-sm bg-emerald-600 rounded-3xl p-8 text-center shadow-xl shadow-emerald-600/30">
                <div className="w-24 h-24 mx-auto rounded-full bg-emerald-400/20 flex items-center justify-center mb-6">
                  <Check className="w-12 h-12 text-emerald-200" />
                </div>
                <div className="text-4xl font-black text-white mb-4 tracking-tight">ACCÈS<br />AUTORISÉ</div>
                <div className="w-16 h-0.5 bg-emerald-400/50 mx-auto mb-4" />
                <p className="text-emerald-100 text-xl font-bold">{result.buyer}</p>
                <p className="text-emerald-200/80 text-sm mt-2">{result.category}</p>
              </div>
              <button
                onClick={nextTicket}
                className="mt-8 w-full max-w-xs py-5 rounded-2xl bg-gala-600 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Scanner le billet suivant
              </button>
            </div>
          )}

          {display === "used" && result && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in-up">
              <div className="w-full max-w-sm bg-yellow-600 rounded-3xl p-8 text-center shadow-xl shadow-yellow-600/30">
                <div className="w-24 h-24 mx-auto rounded-full bg-yellow-400/20 flex items-center justify-center mb-6">
                  <span className="text-4xl">⚠️</span>
                </div>
                <div className="text-3xl font-black text-white mb-4">DÉJÀ<br />SCANNÉ</div>
                <div className="w-16 h-0.5 bg-yellow-400/50 mx-auto mb-4" />
                <p className="text-yellow-100 text-lg font-bold">{result.buyer}</p>
                <p className="text-yellow-200/80 text-sm mt-2">{result.category}</p>
                {result.date && (
                  <p className="text-yellow-200/60 text-xs mt-3">
                    {new Date(result.date).toLocaleString("fr-FR")}
                  </p>
                )}
              </div>
              <button
                onClick={nextTicket}
                className="mt-8 w-full max-w-xs py-5 rounded-2xl bg-gala-600 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Scanner le billet suivant
              </button>
            </div>
          )}

          {display === "invalid" && result && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in-up">
              <div className="w-full max-w-sm bg-red-600 rounded-3xl p-8 text-center shadow-xl shadow-red-600/30">
                <div className="w-24 h-24 mx-auto rounded-full bg-red-400/20 flex items-center justify-center mb-6">
                  <span className="text-4xl">✕</span>
                </div>
                <div className="text-3xl font-black text-white mb-4">TICKET<br />INVALIDE</div>
                <div className="w-16 h-0.5 bg-red-400/50 mx-auto mb-4" />
                <p className="text-red-100 text-lg">{result.message}</p>
              </div>
              <button
                onClick={nextTicket}
                className="mt-8 w-full max-w-xs py-5 rounded-2xl bg-gala-600 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Scanner le billet suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
