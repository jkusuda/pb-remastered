"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { BORDER } from "@/lib/styles";

const TRAINER_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

const AVATAR_OPTIONS = [
  "ash", "red", "ethan", "lyra", "kris", "brendan", "may", "lucas", "dawn", "hilbert", "hilda",
];

type Props = {
  currentName: string;
  currentAvatarId: string;
  onClose: () => void;
};

export default function EditProfileModal({ currentName, currentAvatarId, onClose }: Props) {
  const [trainerName, setTrainerName] = useState(currentName);
  const [avatarId, setAvatarId]       = useState(currentAvatarId);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const router   = useRouter();
  const supabase = useMemo(() => createClient(), []);

  async function handleSave() {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not logged in"); return; }

      const { error: dbError } = await supabase
        .from("users")
        .update({ trainer_name: trainerName.trim(), avatar_id: avatarId })
        .eq("id", user.id);

      if (dbError) {
        setError(dbError.message);
      } else {
        router.refresh();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative z-10 w-full max-w-lg mx-4 bg-[#e0f4d9] rounded-[8px] border-[4px] ${BORDER} shadow-[4px_4px_0_black] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b-[4px] ${BORDER} bg-[#9dcd9d]`}>
          <h2 
            className="font-black text-xl text-white uppercase tracking-widest"
            style={{ WebkitTextStroke: "1px black", textShadow: "0 2px 0 black" }}
          >
            EDIT PROFILE
          </h2>
          <button onClick={onClose} className="font-black text-xl text-black hover:opacity-70 transition-opacity">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Trainer name */}
          <div>
            <label className="font-black text-[13px] text-black block mb-2 tracking-wide uppercase">TRAINER NAME</label>
            <input
              type="text"
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              maxLength={16}
              className={`w-full px-4 py-3 rounded-[8px] border-[4px] ${BORDER} bg-white font-bold text-sm outline-none focus:border-black/50 transition-colors shadow-inner`}
            />
          </div>

          {/* Avatar picker */}
          <div>
            <label className="font-black text-[13px] text-black block mb-2 tracking-wide uppercase">AVATAR</label>
            <div className={`grid grid-cols-6 gap-2 p-4 bg-[#9dcd9d]/30 rounded-[8px] border-[4px] ${BORDER} max-h-64 overflow-y-auto shadow-inner`}>
              {AVATAR_OPTIONS.map((id) => (
                <button
                  key={id}
                  onClick={() => setAvatarId(id)}
                  className={`w-16 h-16 rounded-[8px] flex items-center justify-center transition-all ${
                    avatarId === id
                      ? `bg-[#9dcd9d] border-[4px] ${BORDER} shadow-[2px_2px_0_black] scale-110`
                      : "bg-white/50 border-[4px] border-transparent hover:border-black/20"
                  }`}
                >
                  <img
                    src={`${TRAINER_BASE}/${id}.png`}
                    alt={id}
                    className="w-12 h-12 object-contain drop-shadow-md"
                    style={{ imageRendering: "pixelated" }}
                  />
                </button>
              ))}
            </div>
            <p className="font-bold text-sm text-black/70 mt-3 uppercase tracking-wide">Selected: <span className="text-black">{avatarId}</span></p>
          </div>

          {error && <p className="font-bold text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={onClose}
              className={`flex-1 py-3 font-black text-[15px] tracking-wide text-black bg-[#9dcd9d] border-[4px] ${BORDER} rounded-[8px] shadow-[4px_4px_0_black] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all`}
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !trainerName.trim()}
              className={`flex-1 py-3 font-black text-[15px] tracking-wide text-black bg-white border-[4px] ${BORDER} rounded-[8px] shadow-[4px_4px_0_black] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:shadow-[4px_4px_0_black]`}
            >
              {loading ? "..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

