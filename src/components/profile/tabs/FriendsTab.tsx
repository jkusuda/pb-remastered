import { Friend, User } from "@/types";

const TRAINER_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

type FriendWithUser = Friend & { friend: Pick<User, "trainer_name" | "avatar_id" | "level"> };

export default function FriendsTab({ friends }: { friends: FriendWithUser[] }) {
  const accepted = friends.filter((f) => f.status === "accepted");
  const pending = friends.filter((f) => f.status === "pending");

  if (friends.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className={`font-black tracking-widest uppercase text-[9px] text-[#3a5a00]/40 text-center leading-relaxed`}>
          NO FRIENDS YET<br />ADD ONE BY FRIEND CODE!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-6">
      {accepted.length > 0 && (
        <section>
          <h3 className={`font-black tracking-widest uppercase text-[9px] text-[#3a5a00] mb-3`}>FRIENDS ({accepted.length})</h3>
          <div className="flex flex-col gap-2">
            {accepted.map((f) => (
              <FriendRow key={f.id} friend={f} />
            ))}
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section>
          <h3 className={`font-black tracking-widest uppercase text-[9px] text-[#4a6600] mb-3`}>PENDING ({pending.length})</h3>
          <div className="flex flex-col gap-2">
            {pending.map((f) => (
              <FriendRow key={f.id} friend={f} pending />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FriendRow({ friend, pending }: { friend: FriendWithUser; pending?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 bg-[#c8e070]/50 rounded-xl border-2 border-black/20`}>
      <img
        src={`${TRAINER_BASE}/${friend.friend.avatar_id}.png`}
        alt={friend.friend.trainer_name}
        className="w-12 h-12 object-contain shrink-0"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm text-[#3a5a00] truncate`}>
          {friend.friend.trainer_name}
        </p>
        <p className={`font-black tracking-widest uppercase text-[7px] text-[#4a6600] mt-0.5`}>
          LVL {friend.friend.level}
        </p>
      </div>
      {pending && (
        <span className={`font-black tracking-widest uppercase text-[7px] text-[#4a6600] bg-[#d4ed7a] px-2 py-1 rounded-lg border border-[#3a5a00]/30`}>
          PENDING
        </span>
      )}
    </div>
  );
}
