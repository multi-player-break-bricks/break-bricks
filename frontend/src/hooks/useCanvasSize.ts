import { useEffect, useState } from "react";

export function useCanvasSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [canvasSize, setCanvasSize] = useState(0);
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setCanvasSize(Math.min(window.innerWidth, window.innerHeight) - 40);
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return Math.min(Math.max(canvasSize, 0), 700);
}
