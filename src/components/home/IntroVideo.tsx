"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { introVideoConfig } from "./Options";
import { getIntroVideoConfig, type IntroVideoItem } from "@/lib/api";

function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/assets/")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_API_URL || "http://localhost:4000";
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videosList, setVideosList] = useState<IntroVideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [defaultVideoSrc, setDefaultVideoSrc] = useState<string>("/assets/videos/homePage.mp4");
  const [defaultPosterSrc, setDefaultPosterSrc] = useState<string>(introVideoConfig.posterImage);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await getIntroVideoConfig();
        if (res.success && res.data) {
          if (res.data.enabled === false) {
            setEnabled(false);
            return;
          }

          if (Array.isArray(res.data.videos) && res.data.videos.length > 0) {
            setVideosList(res.data.videos);
          } else {
            if (res.data.videoUrl) {
              setDefaultVideoSrc(resolveMediaUrl(res.data.videoUrl));
            }
            if (res.data.posterUrl) {
              setDefaultPosterSrc(resolveMediaUrl(res.data.posterUrl));
            }
          }
        }
      } catch (err) {
        console.debug("Intro video config fallback:", err);
      }
    }
    loadConfig();
  }, []);

  const activeVideos = useMemo(() => {
    return [...videosList]
      .filter((v) => v.status === "active")
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [videosList]);

  const currentVideoItem = activeVideos.length > 0 ? activeVideos[currentIndex % activeVideos.length] : null;

  const currentVideoSrc = currentVideoItem
    ? resolveMediaUrl(currentVideoItem.videoUrl)
    : defaultVideoSrc;

  const currentPosterSrc = currentVideoItem?.posterUrl
    ? resolveMediaUrl(currentVideoItem.posterUrl)
    : defaultPosterSrc;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay handled silently
      });
    }
  }, [currentVideoSrc]);

  const handleVideoEnded = () => {
    if (activeVideos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % activeVideos.length);
    }
  };

  if (!enabled) return null;

  return (
    <section
      className="bg-whiteBG w-full overflow-hidden"
      id="intro-video-section"
    >
      <div className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90dvh] overflow-hidden bg-black select-none">
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={currentVideoSrc}
          poster={currentPosterSrc}
          autoPlay
          loop={activeVideos.length <= 1}
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Optional video indicator badge if multiple videos exist */}
        {activeVideos.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-[11px] font-medium pointer-events-none">
            <span>Video {currentIndex + 1} of {activeVideos.length}</span>
            <div className="flex items-center gap-1 ml-1">
              {activeVideos.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentIndex ? "bg-white w-3" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
