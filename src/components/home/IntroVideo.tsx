"use client";

import { introVideoConfig } from "./Options";

export default function IntroVideo() {
  const videoId = "EehVfDnkkGg";
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&showinfo=0&autohide=1`;

  return (
    <section
      className="bg-whiteBG w-full overflow-hidden"
      id="intro-video-section"
    >
      {/* 80dvh full-width background video container with controls cropped out */}
      <div className="relative w-full h-[90dvh] overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={introVideoConfig.youtubeTitle || "Houselink Intro Video"}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[56.25vw] min-h-[80dvh] min-w-[calc(80dvh*16/9)] scale-[1.3] pointer-events-none border-0 select-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          tabIndex={-1}
        />
      </div>
    </section>
  );
}
