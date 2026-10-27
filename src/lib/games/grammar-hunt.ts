/**
 * Grammar Hunt, the English game: each sentence has one wrong word. The
 * student taps it, then picks the correction from three choices. Five
 * sentences per level, each level on one grammar skill and themed to a
 * unit of English 10.
 *
 * Sentences are written with the wrong word in braces: "Zeus {rule} the
 * gods." Scoring lives here so the server can score a level from the taps.
 */

export type GrammarSentence = {
  /** The sentence split into words; `wrong` is the index of the error. */
  words: string[];
  wrong: number;
  /** The correct word first, then two wrong ones (shuffled on screen). */
  fixes: [string, string, string];
  why: string;
};

export type GrammarLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  /** The grammar skill, shown before the level. */
  skill: string;
  sentences: GrammarSentence[];
};

const s = (
  text: string,
  fixes: [string, string, string],
  why: string,
): GrammarSentence => {
  const words = text.split(" ");
  const wrong = words.findIndex((w) => w.includes("{"));
  return {
    words: words.map((w) => w.replace(/[{}]/g, "")),
    wrong,
    fixes,
    why,
  };
};

export const GRAMMAR_LEVELS: GrammarLevel[] = [
  {
    id: "grammar-1",
    unit: 1,
    unitTitle: "Myths and Legends of the World",
    title: "Gods Agree",
    skill: "Subject–verb agreement",
    sentences: [
      s(
        "Zeus {rule} the gods from Mount Olympus.",
        ["rules", "ruling", "rulers"],
        "A singular subject (Zeus) takes a verb ending in -s: rules.",
      ),
      s(
        "The Greek myths {explains} how the world began.",
        ["explain", "explaining", "explanation"],
        "A plural subject (myths) takes the base verb: explain.",
      ),
      s(
        "Each of the heroes {have} a special weapon.",
        ["has", "having", "haves"],
        "“Each” is singular, so it takes has.",
      ),
      s(
        "Neither Hercules nor his friends {was} afraid.",
        ["were", "be", "being"],
        "With neither…nor, the verb agrees with the nearer subject (friends): were.",
      ),
      s(
        "The story of Pandora's box {teach} us about curiosity.",
        ["teaches", "teaching", "teachers"],
        "The subject is “story” (singular), not “box”: teaches.",
      ),
    ],
  },
  {
    id: "grammar-2",
    unit: 2,
    unitTitle: "Reading for Information",
    title: "Time Travel",
    skill: "Verb tenses",
    sentences: [
      s(
        "Yesterday, the class {write} a summary of the article.",
        ["wrote", "writes", "written"],
        "“Yesterday” calls for the simple past: wrote.",
      ),
      s(
        "She has {went} to the library twice this week.",
        ["gone", "go", "going"],
        "After has, use the past participle: gone.",
      ),
      s(
        "The article {say} that sea levels are rising.",
        ["says", "saying", "sayed"],
        "A singular subject in the present takes says.",
      ),
      s(
        "While I was {read} the graph, the bell rang.",
        ["reading", "reads", "readed"],
        "The past progressive is was + -ing: was reading.",
      ),
      s(
        "By next week, we {finish} the research.",
        ["will have finished", "finished", "finishing"],
        "“By next week” calls for the future perfect: will have finished.",
      ),
    ],
  },
  {
    id: "grammar-3",
    unit: 3,
    unitTitle: "Evaluating Arguments",
    title: "Pronoun Patrol",
    skill: "Pronouns",
    sentences: [
      s(
        "{Him} and I disagreed with the writer's claim.",
        ["He", "His", "Himself"],
        "A subject needs a subject pronoun: He.",
      ),
      s(
        "The writer and {me} checked the evidence.",
        ["I", "mine", "myself"],
        "It's part of the subject, so use I.",
      ),
      s(
        "The debate team presented {it's} best argument.",
        ["its", "it", "its'"],
        "Its (no apostrophe) shows possession. It's means it is.",
      ),
      s(
        "Between you and {I,} that claim lacks evidence.",
        ["me,", "mine,", "myself,"],
        "After a preposition (between), use the object pronoun: me.",
      ),
      s(
        "The judges gave the trophy to {we} debaters.",
        ["us", "our", "ourselves"],
        "After to, use the object pronoun: us.",
      ),
    ],
  },
  {
    id: "grammar-4",
    unit: 4,
    unitTitle: "Writing a Persuasive Essay",
    title: "Word Twins",
    skill: "Commonly confused words",
    sentences: [
      s(
        "Plastic waste has a huge {affect} on marine life.",
        ["effect", "affection", "effective"],
        "Effect is the noun (a result); affect is usually the verb.",
      ),
      s(
        "Students should bring {there} own tumblers.",
        ["their", "they're", "theirs"],
        "Their shows ownership. There is a place; they're means they are.",
      ),
      s(
        "Recycling is better {then} burning trash.",
        ["than", "them", "the"],
        "Use than to compare. Then is about time.",
      ),
      s(
        "{Your} going to love this proposal.",
        ["You're", "You", "Yours"],
        "You're means you are. Your shows ownership.",
      ),
      s(
        "The new rule will {loose} its power if no one follows it.",
        ["lose", "lost", "loosen"],
        "Lose means to stop having something. Loose means not tight.",
      ),
    ],
  },
  {
    id: "grammar-5",
    unit: 5,
    unitTitle: "Research Report Writing",
    title: "Preposition Points",
    skill: "Prepositions",
    sentences: [
      s(
        "The survey was conducted {in} March 3, 2026.",
        ["on", "at", "by"],
        "Use on with a specific date.",
      ),
      s(
        "The results are shown {at} Table 2.",
        ["in", "on", "by"],
        "Data appears in a table.",
      ),
      s(
        "The students are interested {on} climate research.",
        ["in", "at", "of"],
        "The phrase is interested in.",
      ),
      s(
        "The data was collected {since} three weeks.",
        ["for", "ago", "until"],
        "Use for with a length of time; since needs a starting point.",
      ),
      s(
        "The report depends {in} reliable sources.",
        ["on", "at", "with"],
        "The phrase is depends on.",
      ),
    ],
  },
  {
    id: "grammar-6",
    unit: 8,
    unitTitle: "Formal and Informal Language",
    title: "Formal Makeover",
    skill: "Formal language",
    sentences: [
      s(
        "The results were {super} important to the study.",
        ["very", "mega", "totally"],
        "Super is informal. Very fits formal writing.",
      ),
      s(
        "We are {gonna} present the findings tomorrow.",
        ["going to", "gotta", "wanna"],
        "Gonna is spoken slang. Write going to.",
      ),
      s(
        "The experiment had {tons} of errors.",
        ["a number", "loads", "heaps"],
        "Tons is informal. Write a number of errors.",
      ),
      s(
        "{Kids} under twelve were not surveyed.",
        ["Children", "Kiddos", "Lil'uns"],
        "Kids is informal. Write children.",
      ),
      s(
        "The speaker's argument was {kinda} weak.",
        ["rather", "sorta", "kinda'"],
        "Kinda is informal. Rather or somewhat fits formal writing.",
      ),
    ],
  },
];

/** Stars from mistakes (wrong words tapped plus wrong fixes picked). */
export function grammarStars(mistakes: number) {
  return mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
}

/**
 * Scores a level from, per sentence, every word tapped and the fixes picked
 * (index into `fixes`, 0 = correct). Null when a sentence wasn't fixed.
 */
export function scoreGrammar(
  level: GrammarLevel,
  taps: number[][],
  picks: number[][],
) {
  const n = level.sentences.length;
  if (taps.length !== n || picks.length !== n) return null;
  const fixed = level.sentences.every(
    (sentence, i) =>
      taps[i]!.includes(sentence.wrong) && picks[i]!.at(-1) === 0,
  );
  if (!fixed) return null;
  const mistakes =
    level.sentences.reduce(
      (sum, sentence, i) =>
        sum + taps[i]!.filter((t) => t !== sentence.wrong).length,
      0,
    ) + picks.reduce((sum, p) => sum + p.filter((x) => x !== 0).length, 0);
  return { mistakes, stars: grammarStars(mistakes) };
}
