'use client';

import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * 65-second welcome tutorial in German (Lucy Fennek voice via ElevenLabs,
 * composed with Hyperframes + GSAP, rendered at 1920×1080 30fps).
 *
 * Sits immediately after the hero. Auto-loads but does NOT autoplay — the
 * user clicks the central play button. Inline custom controls so the
 * branded look is preserved (no default Chromium controls).
 */
export default function WelcomeVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMuted] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="bg-black py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow + headline */}
        <div className="max-w-3xl mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-4">
            In 60 Sekunden verstanden
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
            So arbeitet <span className="text-blue">PermitWatchDog.</span>
          </h2>
          <p className="font-body text-lg text-zinc-400 mt-6 leading-relaxed">
            Ein kompakter Rundgang durch unsere Vier-Schichten-Doktrin,
            den nächtlichen Bauamt-Scan und die fertige E-Mail in Ihrem Outlook.
          </p>
        </div>

        {/* Video player */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_60px_rgba(22,84,255,0.12)] group">
          <video
            ref={videoRef}
            src="/videos/welcome-tutorial.mp4"
            poster="/images/step_04_draft.png"
            className="absolute inset-0 w-full h-full object-cover bg-black"
            preload="metadata"
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />

          {/* Center play button overlay — shows when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              aria-label="Welcome-Video abspielen"
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/30 z-10"
            >
              <span className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue text-white shadow-[0_0_60px_rgba(22,84,255,0.6)] group-hover:scale-105 transition-transform">
                <Play className="w-10 h-10 md:w-12 md:h-12 ml-1" fill="currentColor" strokeWidth={0} />
              </span>
            </button>
          )}

          {/* Bottom-right minimal controls — visible while playing */}
          {isPlaying && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={togglePlay}
                aria-label="Pause"
                className="w-10 h-10 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-full border border-white/20 hover:bg-black/90 transition-colors"
              >
                <Pause className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Ton einschalten' : 'Ton aus'}
                className="w-10 h-10 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-full border border-white/20 hover:bg-black/90 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Subtle metadata strip */}
        <div className="mt-6 flex items-center justify-between text-xs font-body tracking-widest uppercase text-zinc-500">
          <span>Dauer · 1:05</span>
          <span>Deutsch · KI-Stimme</span>
        </div>
      </div>
    </section>
  );
}
