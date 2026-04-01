"use client";

import { useRouter } from "next/navigation";
import settingsIcon from "@/assets/settings.webp";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div
        className={`bg-[#e0f4d9]/90 rounded-[8px] border-4 border-black p-12 shadow-[4px_4px_0_black] flex flex-col items-center gap-8 w-full max-w-md`}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={settingsIcon.src}
            alt="Settings"
            className="w-24 h-24 object-contain drop-shadow-md"
          />
          <span
            className="font-black text-2xl tracking-widest text-white text-center"
            style={{ WebkitTextStroke: "1.5px black", textShadow: "0px 2px 0px black" }}
          >
            SETTINGS
          </span>
        </div>

        {/* Divider */}
        <div className="w-full border-t-[3px] border-black/20" />

        {/* Log Out button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-black text-lg tracking-widest rounded-[6px] border-[3px] border-black shadow-[3px_3px_0_black] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
          style={{ WebkitTextStroke: "0.5px black", textShadow: "0px 1px 0px black" }}
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
}
