// XP thresholds for each level (index = level number)
// Level 1 starts at 0 XP, Level 2 at 100, etc.
const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  300,   // Level 3
  600,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2100,  // Level 7
  2800,  // Level 8
  3600,  // Level 9
  4500,  // Level 10
  5500,  // Level 11
  6600,  // Level 12
  7800,  // Level 13
  9100,  // Level 14
  10500, // Level 15
  12000, // Level 16
  13600, // Level 17
  15300, // Level 18
  17100, // Level 19
  19000, // Level 20
];

export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPForLevel(level: number): number {
  return LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)] ?? 0;
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXP(xp);
  if (level >= MAX_LEVEL) {
    return { current: 0, needed: 0, percentage: 100 };
  }
  const currentLevelXP = LEVEL_THRESHOLDS[level - 1];
  const nextLevelXP = LEVEL_THRESHOLDS[level];
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  return { current, needed, percentage: Math.floor((current / needed) * 100) };
}

// XP rewards
export const XP_PER_CATCH = 25;
export const XP_NEW_SPECIES_BONUS = 100;
