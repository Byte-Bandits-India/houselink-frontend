"use client";

import { useEffect, useRef, useState } from "react";
import { introVideoConfig } from "./Options";
import { getIntroVideoConfig } from "@/lib/api";

function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/assets/")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_API_URL || "http://localhost:4000";
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("/assets/videos/homePage.mp4");
  const [posterSrc, setPosterSrc] = useState<string>(introVideoConfig.posterImage);
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await getIntroVideoConfig();
        if (res.success && res.data) {
          if (res.data.enabled === false) {
            setEnabled(false);
            return;
          }
          if (res.data.videoUrl) {
            setVideoSrc(resolveMediaUrl(res.data.videoUrl));
          }
          if (res.data.posterUrl) {
            setPosterSrc(resolveMediaUrl(res.data.posterUrl));
          }
        }
      } catch (err) {
        // Fallback to default asset
        console.debug("Intro video config fallback:", err);
      }
    }
    loadConfig();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay handled silently
      });
    }
  }, [videoSrc]);

  if (!enabled) return null;

  return (
    <section
      className="bg-whiteBG w-full overflow-hidden"
      id="intro-video-section"
    >
      <div className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90dvh] overflow-hidden bg-black select-none">
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </section>
  );
}
