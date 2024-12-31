import lottie from "lottie-web";
import { useEffect, useRef } from "react";

export const AudioWaveSpinner = () => {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      animationContainer.current &&
      animationContainer?.current?.childNodes?.length === 0
    ) {
      lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/audio-wave.json",
      });
    }
  }, []);

  return (
    <div ref={animationContainer} className="w-10 h-10 overflow-hidden"></div>
  );
};
