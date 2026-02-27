"use client";

import { useRouter } from "next/navigation";

export default function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  const btnClass =
    "flex items-center gap-2 px-7 py-[10px] font-['Press_Start_2P'] text-xs tracking-widest text-[#4a6600] bg-white/90 border-[3px] border-white/60 rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-all duration-75 cursor-pointer hover:bg-white hover:shadow-[6px_6px_0_rgba(0,0,0,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_rgba(0,0,0,0.15)] active:translate-x-0.5 active:translate-y-0.5";

  return (
    <nav className="fixed top-4 left-4 right-4 flex justify-end items-center z-[100] px-4 py-2">
      {isLoggedIn ? (
        <button onClick={() => router.push("/profile")} className={btnClass}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          VIEW PROFILE
        </button>
      ) : (
        <button onClick={() => router.push("/?modal=login")} className={btnClass}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          LOGIN
        </button>
      )}
    </nav>
  );
}
