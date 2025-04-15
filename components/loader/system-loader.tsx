export default function SystemLoader({ hunterLevel }: { hunterLevel: string }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0f0e17 0%, #1b1a2e 50%, #2e1a47 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#000_70%)]"></div>
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-16 bg-blue-500/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0,
              animation: `fadeInOut ${2 + Math.random() * 3}s infinite ${
                Math.random() * 2
              }s`,
            }}
          ></div>
        ))}
      </div>
      <div className="relative text-center z-10 p-8 backdrop-blur-sm bg-black/40 border border-highlight/20 rounded-md animate-[pulse-border_4s_infinite]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-highlight/30 to-transparent absolute top-0 left-0 animate-[scanline_4s_linear_infinite]"></div>
        </div>
        <div className="text-highlight text-2xl md:text-5xl font-mono tracking-widest mb-4 relative">
          <span className="inline-block animate-[glitch_5s_infinite] bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            SYSTEM
          </span>
          <span className="inline-block ml-3 animate-[glitch_7s_infinite_1s] text-highlight">
            CALIBRATING
          </span>
        </div>
        <div className="w-72 md:w-80 h-1.5 mx-auto bg-gray-800/50 rounded-full overflow-hidden mb-6 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
            style={{
              width: "60%",
              animation: "progress 3s ease-in-out infinite",
            }}
          ></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs md:text-sm text-blue-400 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="animate-[pulse_2s_infinite]">
              STATUS: ANALYZING HUNTER RANK
            </span>
          </div>
          <div className="text-xs md:text-sm text-purple-400 font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></span>
            <span className="animate-[pulse_2.2s_infinite_0.3s]">
              VALIDATING PERMISSION: LEVEL {hunterLevel.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="mt-6 p-1.5 border border-highlight/30 inline-block rounded-md relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-xs text-highlight/80 font-mono uppercase tracking-widest animate-pulse">
            GATE OPENING
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-highlight/50 group-hover:w-full transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
}
