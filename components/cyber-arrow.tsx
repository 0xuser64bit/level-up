import { ChevronsUp } from "lucide-react";
import { useEffect, useState } from "react";

export const CyberArrow = () => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150);
      }
    }, 1000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 opacity-30 blur-md animate-pulse rounded-full"></div>

      <div
        className={`relative z-10 rounded-full overflow-hidden
                   ${glitching ? "-translate-y-[4px]" : ""}`}
      >
        <div className="absolute inset-0 scan-line z-20 pointer-events-none"></div>

        <ChevronsUp
          className={`h-6 w-6 md:h-14 md:w-14 text-cyber-blue stroke-2
                     ${glitching ? "text-cyber-yellow" : "text-cyber-blue"}`}
          style={{
            filter: glitching
              ? "drop-shadow(0 0 2px #fcee09) brightness(1.2)"
              : "drop-shadow(0 0 2px #0cffe1)",
          }}
        />
      </div>
    </div>
  );
};
