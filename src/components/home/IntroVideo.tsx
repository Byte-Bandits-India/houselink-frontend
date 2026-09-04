"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { getIntroVideoConfig, type IntroVideoItem } from "@/lib/api";
import { useHomeFilter } from "@/contexts/HomeFilterContext";

function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/assets/")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_API_URL || "http://localhost:4000";
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

interface IntroVideoProps {
  city?: string;
}

export default function IntroVideo({ city: propCity }: IntroVideoProps) {
  const { filters: homeFilters } = useHomeFilter();
  const activeCity = propCity !== undefined ? propCity : homeFilters.city;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videosList, setVideosList] = useState<IntroVideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [defaultVideoSrc, setDefaultVideoSrc] = useState<string>("");
  const [defaultPosterSrc, setDefaultPosterSrc] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;

    async function loadConfig() {
      try {
        const res = await getIntroVideoConfig(activeCity);
        if (!isCancelled) {
          if (res.success && res.data) {
            if (res.data.enabled === false) {
              setEnabled(false);
              return;
            }
            setEnabled(true);

            if (Array.isArray(res.data.videos) && res.data.videos.length > 0) {
              setVideosList(res.data.videos);
            } else {
              setVideosList([]);
              if (res.data.videoUrl) {
                setDefaultVideoSrc(resolveMediaUrl(res.data.videoUrl));
              } else {
                setDefaultVideoSrc("");
              }
              if (res.data.posterUrl) {
                setDefaultPosterSrc(resolveMediaUrl(res.data.posterUrl));
              } else {
                setDefaultPosterSrc("");
              }
            }
            setCurrentIndex(0);
          } else {
            setEnabled(false);
            setVideosList([]);
            setDefaultVideoSrc("");
            setDefaultPosterSrc("");
            setCurrentIndex(0);
          }
        }
      } catch (err) {
        console.debug("Intro video config load error:", err);
        if (!isCancelled) {
          setVideosList([]);
          setDefaultVideoSrc("");
          setDefaultPosterSrc("");
        }
      }
    }

    loadConfig();

    return () => {
      isCancelled = true;
    };
  }, [activeCity]);

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
    if (videoRef.current && currentVideoSrc) {
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

  if (!enabled || !currentVideoSrc) return null;

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
          poster={currentPosterSrc || undefined}
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
