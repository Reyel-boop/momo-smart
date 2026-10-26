/**
 * Momo's Quest: Momo, the golden-retriever superhero, battles a line of
 * enemies using a unit's questions. A correct answer is an attack; three in
 * a row power up a Super Bark that hits twice as hard. A wrong answer costs
 * Momo a heart, and after five Momo faints and the quest starts over.
 *
 * The rules live here so the screen and the server agree on every result.
 */

export const QUEST_LIVES = 5;
/** Correct answers in a row before attacks become Super Barks. */
export const COMBO_FOR_SUPER = 3;

export type EnemyKind = "bug" | "slime" | "bat" | "ghost" | "boss";

export const QUEST_ENEMIES: Array<{
  kind: EnemyKind;
  name: string;
  hp: number;
}> = [
  { kind: "bug", name: "Bug Bot", hp: 2 },
  { kind: "slime", name: "Glitch Slime", hp: 2 },
  { kind: "bat", name: "Spam Bat", hp: 3 },
  { kind: "ghost", name: "Error Ghost", hp: 3 },
  { kind: "boss", name: "King Virus", hp: 5 },
];

export type QuestState = {
  enemy: number;
  enemyHp: number;
  lives: number;
  streak: number;
  correct: number;
  wrong: number;
  won: boolean;
  dead: boolean;
};

export const startState = (): QuestState => ({
  enemy: 0,
  enemyHp: QUEST_ENEMIES[0]!.hp,
  lives: QUEST_LIVES,
  streak: 0,
  correct: 0,
  wrong: 0,
  won: false,
  dead: false,
});

/** The next state after one answer, and what the attack did. */
export function step(state: QuestState, correct: boolean) {
  if (state.won || state.dead) return { state, damage: 0, defeated: false };
  if (!correct) {
    const lives = state.lives - 1;
    return {
      state: {
        ...state,
        lives,
        streak: 0,
        wrong: state.wrong + 1,
        dead: lives <= 0,
      },
      damage: 0,
      defeated: false,
    };
  }
  const streak = state.streak + 1;
  const damage = streak >= COMBO_FOR_SUPER ? 2 : 1;
  let enemy = state.enemy;
  let enemyHp = state.enemyHp - damage;
  const defeated = enemyHp <= 0;
  let won = false;
  if (defeated) {
    enemy += 1;
    won = enemy >= QUEST_ENEMIES.length;
    enemyHp = won ? 0 : QUEST_ENEMIES[enemy]!.hp;
  }
  return {
    state: {
      ...state,
      enemy,
      enemyHp,
      streak,
      correct: state.correct + 1,
      won,
    },
    damage,
    defeated,
  };
}

/** Replays a whole quest from its answers (true = correct). */
export function replay(answers: boolean[]) {
  let state = startState();
  for (const correct of answers) {
    if (state.won || state.dead) break;
    state = step(state, correct).state;
  }
  return state;
}

/** Stars for a won quest: fewer hearts lost, more stars. */
export function questStars(state: QuestState) {
  if (!state.won) return 0;
  return state.wrong <= 1 ? 3 : state.wrong <= 3 ? 2 : 1;
}
