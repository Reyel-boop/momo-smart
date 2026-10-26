/**
 * Momo's Quest: an adventurer and Momo, the golden-retriever super pet,
 * battle monsters with elemental skills — Water, Fire, Air and Earth —
 * powered by correct answers. Each monster is weak to one element (hidden
 * until it's hit with it), three right in a row unleash Momo's Bark, and a
 * wrong answer costs a heart. Lose all hearts and the hero faints.
 *
 * Two modes share these rules: a unit quest (five monsters, the Jelly King
 * last) and a class's Boss Level (the Shadow Dragon in three phases, with a
 * timer on its later phases and questions from every unit).
 *
 * The rules live here so the screen and the server agree on every result.
 */

export const QUEST_LIVES = 5;
/** Correct answers in a row before Momo's Bark joins the attack. */
export const COMBO_FOR_SUPER = 3;

export type Element = "water" | "fire" | "air" | "earth";
export const ELEMENTS: Element[] = ["water", "fire", "air", "earth"];

export const ELEMENT_INFO: Record<
  Element,
  { name: string; icon: string; skill: string; bark: string; color: string }
> = {
  water: {
    name: "Water",
    icon: "💧",
    skill: "Aqua Wave",
    bark: "Tidal Bark",
    color: "#38bdf8",
  },
  fire: {
    name: "Fire",
    icon: "🔥",
    skill: "Fire Bolt",
    bark: "Inferno Bark",
    color: "#f97316",
  },
  air: {
    name: "Air",
    icon: "🌪️",
    skill: "Wind Blade",
    bark: "Gale Bark",
    color: "#4ade80",
  },
  earth: {
    name: "Earth",
    icon: "🪨",
    skill: "Stone Spike",
    bark: "Quake Bark",
    color: "#a16207",
  },
};

export type EnemyKind =
  "pink" | "leaf" | "bat" | "ghost" | "boss" | "dragon" | "dragon2" | "dragon3";

export type Enemy = {
  kind: EnemyKind;
  name: string;
  hp: number;
  weak: Element;
  /** Seconds to answer while fighting this enemy (none = no timer). */
  seconds?: number;
};

export type QuestRules = {
  mode: "quest" | "boss";
  enemies: Enemy[];
  lives: number;
};

export const QUEST: QuestRules = {
  mode: "quest",
  lives: QUEST_LIVES,
  enemies: [
    { kind: "pink", name: "Pinky Jelly", hp: 2, weak: "water" },
    { kind: "leaf", name: "Leafy Jelly", hp: 2, weak: "fire" },
    { kind: "bat", name: "Bubble Bat", hp: 3, weak: "earth" },
    { kind: "ghost", name: "Ghosty", hp: 3, weak: "air" },
    { kind: "boss", name: "Jelly King", hp: 5, weak: "fire" },
  ],
};

/** The Boss Level: one dragon, three phases, each a little meaner. */
export const BOSS: QuestRules = {
  mode: "boss",
  lives: QUEST_LIVES,
  enemies: [
    { kind: "dragon", name: "Shadow Dragon", hp: 5, weak: "earth" },
    {
      kind: "dragon2",
      name: "Shadow Dragon · Enraged",
      hp: 6,
      weak: "water",
      seconds: 20,
    },
    {
      kind: "dragon3",
      name: "Shadow Dragon · True Form",
      hp: 7,
      weak: "air",
      seconds: 15,
    },
  ],
};

/** Kept for screens that only show the unit quest's line-up. */
export const QUEST_ENEMIES = QUEST.enemies;

/** Unit quests a class needs won before its Boss Level opens. */
export const BOSS_UNLOCK_WINS = 3;

/** Mana: earned by correct answers, spent on skills. */
export const SP_START = 3;
export const SP_MAX = 6;
/** Casting an element skill without answering the question. */
export const CAST_COST = 3;
/** Momo's Healing Paw: one heart back. */
export const HEAL_COST = 4;

export type QuestState = {
  enemy: number;
  enemyHp: number;
  lives: number;
  sp: number;
  streak: number;
  correct: number;
  wrong: number;
  won: boolean;
  dead: boolean;
};

export const startState = (rules: QuestRules = QUEST): QuestState => ({
  enemy: 0,
  enemyHp: rules.enemies[0]!.hp,
  lives: rules.lives,
  sp: SP_START,
  streak: 0,
  correct: 0,
  wrong: 0,
  won: false,
  dead: false,
});

/**
 * One turn: answering the question (with the selected element), casting
 * an element skill instead of answering, or Momo healing a heart.
 */
export type Move =
  | { kind: "answer"; correct: boolean; element: Element }
  | { kind: "cast"; element: Element }
  | { kind: "heal" };

export function canCast(state: QuestState) {
  return state.sp >= CAST_COST;
}
export function canHeal(state: QuestState, rules: QuestRules = QUEST) {
  return state.sp >= HEAL_COST && state.lives < rules.lives;
}

/** Damage dealt to the current enemy, moving on when it falls. */
function hit(state: QuestState, damage: number, rules: QuestRules) {
  let enemy = state.enemy;
  let enemyHp = state.enemyHp - damage;
  const defeated = enemyHp <= 0;
  let won = false;
  if (defeated) {
    enemy += 1;
    won = enemy >= rules.enemies.length;
    enemyHp = won ? 0 : rules.enemies[enemy]!.hp;
  }
  return { enemy, enemyHp, won, defeated };
}

/** The next state after one turn, and what it did. */
export function step(state: QuestState, move: Move, rules: QuestRules = QUEST) {
  const none = {
    state,
    damage: 0,
    defeated: false,
    weak: false,
    bark: false,
    ok: false,
  };
  if (state.won || state.dead) return none;

  if (move.kind === "heal") {
    if (!canHeal(state, rules)) return none;
    return {
      ...none,
      ok: true,
      state: { ...state, sp: state.sp - HEAL_COST, lives: state.lives + 1 },
    };
  }

  if (move.kind === "cast") {
    if (!canCast(state)) return none;
    const weak = rules.enemies[state.enemy]!.weak === move.element;
    const damage = 1 + (weak ? 1 : 0);
    const h = hit(state, damage, rules);
    return {
      state: {
        ...state,
        enemy: h.enemy,
        enemyHp: h.enemyHp,
        won: h.won,
        sp: state.sp - CAST_COST,
        // Skipping a question breaks the answer streak.
        streak: 0,
      },
      damage,
      defeated: h.defeated,
      weak,
      bark: false,
      ok: true,
    };
  }

  if (!move.correct) {
    const lives = state.lives - 1;
    return {
      ...none,
      ok: true,
      state: {
        ...state,
        lives,
        streak: 0,
        wrong: state.wrong + 1,
        dead: lives <= 0,
      },
    };
  }
  const streak = state.streak + 1;
  const bark = streak >= COMBO_FOR_SUPER;
  const weak = rules.enemies[state.enemy]!.weak === move.element;
  // 1 for the skill, +1 when it hits the weakness, +1 when Momo barks.
  const damage = 1 + (weak ? 1 : 0) + (bark ? 1 : 0);
  const h = hit(state, damage, rules);
  return {
    state: {
      ...state,
      enemy: h.enemy,
      enemyHp: h.enemyHp,
      won: h.won,
      streak,
      correct: state.correct + 1,
      sp: Math.min(SP_MAX, state.sp + 1),
    },
    damage,
    defeated: h.defeated,
    weak,
    bark,
    ok: true,
  };
}

/** Replays a whole battle from its moves. */
export function replay(moves: Move[], rules: QuestRules = QUEST) {
  let state = startState(rules);
  for (const move of moves) {
    if (state.won || state.dead) break;
    state = step(state, move, rules).state;
  }
  return state;
}

/** Stars for a win: up to 3 for a unit quest, up to 5 for the Boss Level. */
export function questStars(state: QuestState, rules: QuestRules = QUEST) {
  if (!state.won) return 0;
  if (rules.mode === "boss") return Math.max(1, 5 - state.wrong);
  return state.wrong <= 1 ? 3 : state.wrong <= 3 ? 2 : 1;
}
