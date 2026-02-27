"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { User, Pokemon } from "@/types";
import { BORDER, PIXEL } from "@/lib/styles";

const TRAINER_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

export default function TrainerCard({
  user,
  favoritePokemon,
}: {
  user: User;
  favoritePokemon: Pokemon | null;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const partnerName = favoritePokemon ? `#${favoritePokemon.pokedex_number}` : null;

  return (
    <>
      <div className="h-3/5 relative p-6 flex flex-col overflow-hidden">
        {/* Name + partner */}
        <div className="mb-4">
          <h1 className={`${PIXEL} text-2xl text-[#3a5a00] leading-tight truncate`}>
            {user.trainer_name.toUpperCase()}
          </h1>
          {partnerName && (
            <p className={`${PIXEL} text-[10px] text-[#4a6600] mt-1`}>
              &amp; {partnerName}
            </p>
          )}
        </div>

        {/* Avatar + art area */}
        <div className="flex-1 relative flex items-end justify-center pb-6">
          <div className="relative flex flex-col items-center">
            {/* Trainer sprite — bigger, no circle container */}
            <img
              src={`${TRAINER_BASE}/${user.avatar_id}.png`}
              alt={`Avatar ${user.avatar_id}`}
              className="w-72 h-72 object-contain relative z-10"
              style={{ imageRendering: "pixelated" }}
            />
            {/* Elliptical shadow platform */}
            <div
              className="w-52 h-6 rounded-full -mt-4 relative z-0"
              style={{
                background: "radial-gradient(ellipse at center, rgba(58,90,0,0.35) 0%, rgba(58,90,0,0.12) 60%, transparent 100%)",
              }}
            />
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditOpen(true)}
            className={`absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#d4ed7a] border-[2px] ${BORDER} flex items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,0.12)] hover:bg-white transition-colors`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a5a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          currentName={user.trainer_name}
          currentAvatarId={user.avatar_id}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
