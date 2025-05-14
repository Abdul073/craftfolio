'use client';

import lottie from "lottie-web";
import { useEffect, useRef } from "react";

const ArrowLottie = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run this effect when the ref is available and we're in the browser
    if (containerRef.current) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        autoplay: false,
        loop: false,
        path: "/arrow-lottie2.json",
      });

      setTimeout(() => {
        animation.play();
      }, 1000);

      return () => animation.destroy();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-40 w-full max-w-32 lg:scale-150 scale-125"
    ></div>
  );
};

export default ArrowLottie;