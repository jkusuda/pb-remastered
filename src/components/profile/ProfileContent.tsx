"use client";

import { useState } from "react";
import ProfileNav from "./ProfileNav";
import TrainerCard from "./TrainerCard";
import CollectionTab from "./tabs/CollectionTab";
import FriendsTab from "./tabs/FriendsTab";
import { User, Pokemon, Friend } from "@/types";
import { BORDER, PIXEL } from "@/lib/styles";

const TAB_TITLES: Record<string, string> = {
  collection:   "COLLECTION",
  friends:      "FRIENDS",
  stats:        "STATS",
  achievements: "ACHIEVEMENTS",
  settings:     "SETTINGS",
};

type FriendWithUser = Friend & { friend: Pick<User, "trainer_name" | "avatar_id" | "level"> };

export default function ProfileContent({
  initialTab,
  pokemon,
  friends,
  user,
  favoritePokemon,
}: {
  initialTab: string;
  pokemon: Pokemon[];
  friends: FriendWithUser[];
  user: User;
  favoritePokemon: Pokemon | null;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <>
      {/* ── Left sidebar ─────────────────────────────── */}
      <div className={`w-2/5 flex flex-col border-r-[4px] ${BORDER}`}>
        <TrainerCard user={user} favoritePokemon={favoritePokemon} />
        <ProfileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ── Right panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${PIXEL} text-lg text-[#3a5a00]`}>{TAB_TITLES[activeTab]}</h2>
          {activeTab === "collection" && (
            <span className={`${PIXEL} text-[9px] text-[#4a6600]`}>{pokemon.length} / 151</span>
          )}
        </div>

        {activeTab === "collection" && <CollectionTab pokemon={pokemon} />}
        {activeTab === "friends"    && <FriendsTab friends={friends} />}
        {(activeTab === "stats" || activeTab === "achievements" || activeTab === "settings") && (
          <div className={`flex-1 rounded-xl border-[2px] ${BORDER}/20 bg-[#c8e070]/30 flex items-center justify-center`}>
            <span className={`${PIXEL} text-[9px] text-[#3a5a00]/40`}>COMING SOON</span>
          </div>
        )}
      </div>
    </>
  );
}
