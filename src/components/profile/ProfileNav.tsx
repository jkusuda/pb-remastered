"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { label: "COLLECTION", tab: "collection" },
  { label: "FRIENDS", tab: "friends" },
  { label: "STATS", tab: "stats" },
  { label: "ACHIEVEMENTS", tab: "achievements" },
  { label: "SETTINGS", tab: "settings" },
];

const btnClass = (isActive: boolean) =>
  `py-3 px-2 text-center font-black tracking-widest uppercase text-[10px] tracking-wide rounded-lg border-[3px] shadow-[3px_3px_0_rgba(0,0,0,0.15)] transition-all duration-75 hover:-translate-y-px hover:shadow-[4px_4px_0_rgba(0,0,0,0.15)] active:translate-y-px active:shadow-[1px_1px_0_rgba(0,0,0,0.15)] ${isActive ? "bg-[#3a5a00] border-[#2a4400] text-white" : `bg-[#c8e070] border-black text-[#3a5a00]`
  }`;

export default function ProfileNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}) {
  return (
    <div className={`h-2/5 border-t-4 border-black p-5 grid grid-cols-2 gap-3 content-center`}>
      {NAV_ITEMS.map(({ label, tab }) =>
        onTabChange ? (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={btnClass(activeTab === tab)}
          >
            {label}
          </button>
        ) : (
          <Link key={tab} href={`/profile?tab=${tab}`} className={btnClass(activeTab === tab)}>
            {label}
          </Link>
        )
      )}

      {/* POKÉDEX always navigates to /pokedex */}
      <Link
        href="/pokedex"
        className={btnClass(false)}
      >
        POKÉDEX
      </Link>
    </div>
  );
}
