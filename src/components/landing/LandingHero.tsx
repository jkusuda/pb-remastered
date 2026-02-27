"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PokeballIcon from "@/components/ui/PokeballIcon";

const SPRITES = [
  { id: 25,  cls: "sprite-1" },
  { id: 133, cls: "sprite-2" },
  { id: 52,  cls: "sprite-3" },
  { id: 39,  cls: "sprite-4" },
];

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export default function LandingHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  return (
    <div className={`flex flex-col items-center gap-3 relative opacity-0 translate-y-6 transition-all duration-500 ease-out ${mounted ? "opacity-100 translate-y-0" : ""}`}>
      <div className="relative">
        {SPRITES.map(({ id, cls }) => (
          <img
            key={id}
            className={`sprite ${cls}`}
            src={`${SPRITE_BASE}/${id}.png`}
            alt=""
          />
        ))}
        <h1 className="title">POKEBROWSER</h1>
      </div>

      <p className="font-['DM_Sans'] text-base text-[#4a6600] font-medium tracking-wide mt-1">
        Pokémon appear as you browse. Catch them all.
      </p>

      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        <a
          href="/download"
          className="inline-flex items-center gap-2.5 px-9 py-[14px] font-['Press_Start_2P'] text-[13px] tracking-widest text-white bg-[#6b9fff] border-[3px] border-[#3a6fdd] rounded-full shadow-[4px_4px_0_#2255bb] transition-all duration-75 no-underline hover:bg-[#82aeff] hover:shadow-[6px_6px_0_#2255bb] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0_#2255bb] active:translate-x-0.5 active:translate-y-0.5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          DOWNLOAD NOW
        </a>
        <button
          onClick={() => (isLoggedIn ? router.push("/pokedex") : router.push("/?modal=login"))}
          className="inline-flex items-center gap-2.5 px-9 py-[14px] font-['Press_Start_2P'] text-[13px] tracking-widest text-white bg-[#ff6b6b] border-[3px] border-[#dd3a3a] rounded-full shadow-[4px_4px_0_#bb2222] transition-all duration-75 cursor-pointer hover:bg-[#ff8282] hover:shadow-[6px_6px_0_#bb2222] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0_#bb2222] active:translate-x-0.5 active:translate-y-0.5"
        >
          <PokeballIcon />
          VIEW POKÉDEX
        </button>
      </div>
    </div>
  );
}
