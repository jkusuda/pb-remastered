"use client";

import statsIcon from "@/assets/stats.png";

export default function GlobalStatsPage() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className={`bg-[#e0f4d9]/90 rounded-[8px] border-4 border-black p-10 shadow-[4px_4px_0_black] flex flex-col items-center gap-4`}>
        <img src={statsIcon.src} alt="Stats" className="w-20 h-20 object-contain drop-shadow-md opacity-60" />
        <span
          className="font-black text-2xl tracking-widest text-white text-center"
          style={{ WebkitTextStroke: "1.5px black", textShadow: "0px 2px 0px black" }}
        >
          GLOBAL STATS
        </span>
        <span className="font-bold text-sm text-black/50 tracking-wide">COMING SOON</span>
      </div>
    </div>
  );
}
