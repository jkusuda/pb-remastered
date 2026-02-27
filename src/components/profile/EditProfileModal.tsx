"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { BORDER, PIXEL } from "@/lib/styles";

const TRAINER_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

const AVATAR_OPTIONS = [
  "ash", "red", "ethan", "lyra", "kris", "brendan", "may", "lucas", "dawn", "hilbert", "hilda",
];

export default function EditProfileModal({
  currentName,
  currentAvatarId,
  onClose,
}: {
  currentName: string;
  currentAvatarId: string;
  onClose: () => void;
}) {
  const [trainerName, setTrainerName] = useState(currentName);
  const [avatarId, setAvatarId] = useState(currentAvatarId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  async function handleSave() {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not logged in"); setLoading(false); return; }

    const { error } = await supabase
      .from("users")
      .update({ trainer_name: trainerName.trim(), avatar_id: avatarId })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
    } else {
      router.refresh();
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-[#d4ed7a] rounded-2xl border-[3px] border-[#3a5a00] shadow-[6px_6px_0_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b-[3px] ${BORDER} bg-[#c8e070]`}>
          <h2 className={`${PIXEL} text-sm text-[#3a5a00]`}>EDIT PROFILE</h2>
          <button onClick={onClose} className="text-[#3a5a00] hover:text-black transition-colors text-lg">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Trainer name */}
          <div>
            <label className={`${PIXEL} text-[9px] text-[#3a5a00] block mb-2`}>TRAINER NAME</label>
            <input
              type="text"
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              maxLength={16}
              className={`w-full px-4 py-3 rounded-xl border-[2px] ${BORDER} bg-white font-['DM_Sans'] text-sm outline-none focus:border-[#6b9fff] transition-colors`}
            />
          </div>

          {/* Avatar picker */}
          <div>
            <label className={`${PIXEL} text-[9px] text-[#3a5a00] block mb-2`}>AVATAR</label>
            <div className="grid grid-cols-6 gap-2 p-4 bg-[#c8e070] rounded-xl border-[2px] border-[#3a5a00]/20 max-h-64 overflow-y-auto">
              {AVATAR_OPTIONS.map((id) => (
                <button
                  key={id}
                  onClick={() => setAvatarId(id)}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all ${
                    avatarId === id
                      ? "bg-[#3a5a00] border-[2px] border-[#2a4400] scale-110"
                      : "bg-[#d4ed7a]/60 border-[2px] border-transparent hover:border-[#3a5a00]/40"
                  }`}
                >
                  <img
                    src={`${TRAINER_BASE}/${id}.png`}
                    alt={id}
                    className="w-12 h-12 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </button>
              ))}
            </div>
            <p className="font-['DM_Sans'] text-xs text-[#4a6600] mt-1">Selected: {avatarId}</p>
          </div>

          {error && <p className="font-['DM_Sans'] text-xs text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-3 ${PIXEL} text-[10px] text-[#3a5a00] bg-[#c8e070] border-[3px] ${BORDER} rounded-xl shadow-[3px_3px_0_rgba(0,0,0,0.1)] hover:-translate-y-px transition-all`}
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !trainerName.trim()}
              className={`flex-1 py-3 ${PIXEL} text-[10px] text-white bg-[#3a5a00] border-[3px] border-[#2a4400] rounded-xl shadow-[3px_3px_0_rgba(0,0,0,0.15)] hover:-translate-y-px transition-all disabled:opacity-50`}
            >
              {loading ? "..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
