/**
 * Word Scramble, a word puzzle for every subject: each level has six key
 * words of a unit, each shown as a clue and its letters scrambled into
 * tiles. The student taps the tiles in order to spell the word. A hint
 * locks in the next letter but counts as a mistake, like a wrong guess.
 *
 * Every subject has its own set of levels (see ~/lib/games/catalog); the
 * screen and the scoring are shared. Scoring lives here so the server can
 * score a level from the guesses alone.
 */

export type ScrambleWord = { id: string; word: string; clue: string };

export type ScrambleLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  words: ScrambleWord[];
};

const level = (
  id: string,
  unit: number,
  unitTitle: string,
  title: string,
  pairs: [string, string][],
): ScrambleLevel => ({
  id,
  unit,
  unitTitle,
  title,
  words: pairs.map(([word, clue], i) => ({ id: `${id}.${i}`, word, clue })),
});

/** TLE: ICT Computer Programming. */
export const WORDS_CP: ScrambleLevel[] = [
  level("wcode-1", 1, "Boot Camp", "Web Words", [
    ["HTML", "The language used to build web pages"],
    ["BROWSER", "The app that opens web pages, like Chrome"],
    ["TAG", "A keyword in angle brackets, like <p>"],
    ["EDITOR", "The program where you type your code"],
    ["WEBSITE", "A group of web pages under one name"],
    ["INTERNET", "The worldwide network that links computers"],
  ]),
  level("wcode-2", 3, "Text Wizard", "Text Tags", [
    ["HEADING", "A title made with <h1> to <h6>"],
    ["PARAGRAPH", "A block of text made with <p>"],
    ["BOLD", "Thick, heavy text"],
    ["ITALIC", "Slanted text, made with <em> or <i>"],
    ["COMMENT", "A note in the code that the browser doesn't show"],
    ["ELEMENT", "An opening tag, its content and its closing tag together"],
  ]),
  level("wcode-3", 5, "Links & Forms", "Click and Type", [
    ["LINK", "Click it to go to another page"],
    ["ANCHOR", "The full name of the <a> tag"],
    ["HREF", "The attribute that holds a link's address"],
    ["FORM", "Collects what the user types and sends it"],
    ["INPUT", "A box where the user types"],
    ["BUTTON", "Click it to submit a form"],
  ]),
  level("wcode-4", 7, "CSS Academy", "Style Rules", [
    ["SELECTOR", "Picks which elements a CSS rule styles"],
    ["PROPERTY", "What you change in CSS, like width or font-size"],
    ["VALUE", "What you set a property to, like red or 20px"],
    ["CLASS", "A name many elements can share, styled with a dot"],
    ["STYLESHEET", "A .css file full of style rules"],
    ["COLOR", "The CSS property that changes the text's tint"],
  ]),
  level("wcode-5", 9, "Box Lab", "Inside the Box", [
    ["MARGIN", "Space outside an element's border"],
    ["PADDING", "Space between the content and the border"],
    ["BORDER", "The line around a box"],
    ["WIDTH", "How wide a box is"],
    ["FLEXBOX", "A layout that lines items up in a row or a column"],
    ["DISPLAY", "The property that makes a box block, inline or flex"],
  ]),
];

/** TLE: ICT Telecommunications (contact center services). */
export const WORDS_TEL: ScrambleLevel[] = [
  level("wtel-1", 2, "Inbound & Outbound", "On the Floor", [
    ["INBOUND", "A call the customer makes to the company"],
    ["OUTBOUND", "A call the agent makes to the customer"],
    ["AGENT", "The person who answers customer calls"],
    ["CUSTOMER", "The person who calls for help"],
    ["HEADSET", "Earphones with a microphone"],
    ["QUEUE", "Callers waiting in line to be answered"],
  ]),
  level("wtel-2", 4, "Phone Etiquette", "Mind Your Manners", [
    ["GREETING", "The first thing you say when you answer"],
    ["EMPATHY", "Showing you understand how the customer feels"],
    ["HOLD", "Asking the caller to wait for a moment"],
    ["POLITE", "Respectful and courteous"],
    ["APOLOGY", "Saying sorry for the trouble"],
    ["CLOSING", "How you end the call"],
  ]),
  level("wtel-3", 5, "Beat the Metrics", "By the Numbers", [
    ["METRICS", "Numbers that measure how well agents work"],
    ["RESOLUTION", "Fixing the customer's problem"],
    ["SURVEY", "Questions after a call about how it went"],
    ["QUALITY", "How well a call followed the standards"],
    ["TARGET", "The goal number to reach"],
    ["ABANDON", "When a caller hangs up before being answered"],
  ]),
  level("wtel-4", 7, "Follow the Procedure", "By the Book", [
    ["ESCALATE", "Pass the call to a higher level of support"],
    ["TICKET", "A record of the customer's issue"],
    ["VERIFY", "Check that the caller really owns the account"],
    ["PROCEDURE", "The steps to follow for a task"],
    ["SUPERVISOR", "The team leader who takes escalated calls"],
    ["TROUBLESHOOT", "Find and fix the cause of a problem"],
  ]),
  level("wtel-5", 8, "Full Call Flow", "Start to Finish", [
    ["PROBING", "Asking questions to understand the problem"],
    ["CONFIRM", "Repeat details back to make sure they're right"],
    ["SOLUTION", "The fix you offer the customer"],
    ["RECAP", "A short summary before ending the call"],
    ["TRANSFER", "Send the call to another department"],
    ["DOCUMENT", "Write notes about the call in the system"],
  ]),
];

/** Mathematics 10. */
export const WORDS_MATH: ScrambleLevel[] = [
  level("wmath-1", 1, "Arithmetic Sequences and Series", "Add It On", [
    ["SEQUENCE", "A list of numbers in a certain order"],
    ["TERM", "Each number in a sequence"],
    ["DIFFERENCE", "What is added each step: the common ___"],
    ["SERIES", "The sum of the terms of a sequence"],
    ["ARITHMETIC", "A sequence that adds the same number each time"],
    ["MEANS", "The terms between two given terms: arithmetic ___"],
  ]),
  level("wmath-2", 2, "Geometric Sequences and Series", "Times Again", [
    ["GEOMETRIC", "A sequence that multiplies by the same number each time"],
    ["RATIO", "What you multiply by each step: the common ___"],
    ["INFINITE", "A series that goes on forever"],
    ["FIBONACCI", "1, 1, 2, 3, 5, 8 … each term adds the two before it"],
    ["HARMONIC", "A sequence of the reciprocals of an arithmetic sequence"],
    ["FINITE", "A sequence with a last term"],
  ]),
  level(
    "wmath-3",
    3,
    "Polynomials and Polynomial Division",
    "Divide and Conquer",
    [
      ["POLYNOMIAL", "An expression like 3x² + 2x − 5"],
      ["DEGREE", "The highest exponent in a polynomial"],
      ["DIVIDEND", "The polynomial being divided"],
      ["REMAINDER", "What is left over after dividing"],
      ["SYNTHETIC", "The shortcut division that uses only the coefficients"],
      ["COEFFICIENT", "The number in front of a variable"],
    ],
  ),
  level("wmath-4", 4, "Polynomial Equations and Functions", "Root Words", [
    ["ROOT", "A value of x that makes the polynomial equal zero"],
    ["FACTOR", "x − a is one of these when P(a) = 0"],
    ["ZERO", "Another name for a root of a function"],
    ["GRAPH", "A picture of a function on the plane"],
    ["TURNING", "A point where the graph changes direction: ___ point"],
    ["INTERCEPT", "Where a graph crosses an axis"],
  ]),
  level("wmath-5", 5, "Circles: Arcs, Chords and Angles", "Round and Round", [
    ["RADIUS", "From the center of a circle to its edge"],
    ["DIAMETER", "A chord that passes through the center"],
    ["CHORD", "A segment that joins two points on a circle"],
    ["ARC", "A part of a circle's edge"],
    ["TANGENT", "A line that touches a circle at exactly one point"],
    ["SECANT", "A line that cuts a circle at two points"],
  ]),
];

/** Science 10. */
export const WORDS_SCI: ScrambleLevel[] = [
  level("wsci-1", 1, "Plate Tectonics", "Shaky Ground", [
    ["EARTHQUAKE", "Shaking of the ground when rocks suddenly move"],
    ["VOLCANO", "A mountain where magma comes out"],
    ["TRENCH", "A deep valley in the ocean floor where a plate sinks"],
    ["MAGMA", "Melted rock under the ground"],
    ["EPICENTER", "The point on the surface right above an earthquake's focus"],
    ["PLATE", "A huge moving slab of Earth's crust"],
  ]),
  level("wsci-2", 2, "Electromagnetic Spectrum", "Ride the Wave", [
    ["RADIO", "The longest waves, used for broadcasting"],
    ["MICROWAVE", "Waves that heat food and carry phone signals"],
    ["INFRARED", "Waves we feel as heat"],
    ["ULTRAVIOLET", "Rays from the sun that cause sunburn"],
    ["GAMMA", "The most energetic rays, from nuclear reactions"],
    ["WAVELENGTH", "The distance from one crest to the next"],
  ]),
  level("wsci-3", 3, "Light: Mirrors and Lenses", "Bend and Bounce", [
    ["MIRROR", "A shiny surface that reflects light"],
    ["LENS", "Curved clear glass that bends light"],
    ["REFLECTION", "Light bouncing off a surface"],
    ["REFRACTION", "Light bending as it enters a new material"],
    ["CONCAVE", "Curved inward, like the inside of a spoon"],
    ["CONVEX", "Curved outward, like the back of a spoon"],
  ]),
  level("wsci-4", 4, "Biomolecules and Cellular Energy", "Food for Cells", [
    ["PROTEIN", "Made of amino acids; builds muscles"],
    ["CARBOHYDRATE", "Sugars and starches that give quick energy"],
    ["LIPID", "Fats and oils"],
    ["ENZYME", "A protein that speeds up reactions in the body"],
    ["GLUCOSE", "The simple sugar cells use for energy"],
    ["DNA", "The nucleic acid that carries genetic information"],
  ]),
  level("wsci-5", 7, "Heredity: Inheritance and Variation", "Family Traits", [
    ["GENE", "A piece of DNA that controls a trait"],
    ["DOMINANT", "The trait that shows when only one copy is present"],
    ["RECESSIVE", "The trait hidden unless two copies are present"],
    ["ALLELE", "One version of a gene"],
    ["GENOTYPE", "The pair of alleles, like Tt"],
    ["MUTATION", "A change in DNA"],
  ]),
];

/** Araling Panlipunan 10. */
export const WORDS_AP: ScrambleLevel[] = [
  level("wap-1", 1, "Mga Suliraning Pangkapaligiran", "Alagaan ang Kalikasan", [
    ["BASURA", "Mga bagay na itinatapon dahil hindi na ginagamit"],
    ["POLUSYON", "Pagdumi ng hangin, tubig o lupa"],
    ["BAHA", "Pag-apaw ng tubig sa lupa dahil sa malakas na ulan"],
    ["KAGUBATAN", "Malawak na lupaing puno ng mga puno"],
    ["KLIMA", "Pangmatagalang kalagayan ng panahon sa isang lugar"],
    ["MINAHAN", "Lugar kung saan hinuhukay ang ginto at iba pang mineral"],
  ]),
  level("wap-2", 2, "Disaster Risk Reduction and Management", "Laging Handa", [
    ["BAGYO", "Malakas na hangin at ulan na nabubuo sa karagatan"],
    ["LINDOL", "Biglaang pagyanig ng lupa"],
    [
      "SAKUNA",
      "Pangyayaring nagdudulot ng malaking pinsala sa buhay at ari-arian",
    ],
    ["PANGANIB", "Hazard sa wikang Filipino"],
    ["PAGLIKAS", "Pag-alis sa mapanganib na lugar papunta sa ligtas na lugar"],
    ["KAHANDAAN", "Pagiging handa bago pa dumating ang sakuna"],
  ]),
  level("wap-3", 3, "Globalisasyon", "Iisang Mundo", [
    [
      "GLOBALISASYON",
      "Pag-uugnayan ng mga bansa sa kalakalan, kultura at teknolohiya",
    ],
    ["KALAKALAN", "Palitan ng mga produkto at serbisyo"],
    ["INTERNET", "Network na nag-uugnay sa mga kompyuter sa buong mundo"],
    [
      "OUTSOURCING",
      "Pagkuha ng serbisyo mula sa ibang kompanya, tulad ng call center",
    ],
    ["MULTINASYONAL", "Kompanyang may sangay sa maraming bansa"],
    ["TEKNOLOHIYA", "Mga makabagong kagamitan at kaalaman"],
  ]),
  level("wap-4", 4, "Paggawa at Migrasyon", "Trabaho at Paglipat", [
    ["MIGRASYON", "Paglipat ng tao mula sa isang lugar papunta sa iba"],
    ["OFW", "Pilipinong nagtatrabaho sa ibang bansa"],
    ["KONTRAKTWAL", "Manggagawang may takdang panahon lamang ang trabaho"],
    ["SAHOD", "Bayad sa manggagawa kapalit ng kanyang trabaho"],
    ["UNYON", "Samahan ng mga manggagawa"],
    ["IMIGRANTE", "Taong pumasok at nanirahan sa ibang bansa"],
  ]),
  level("wap-5", 6, "Karapatang Pantao", "Karapatan Ko", [
    ["KARAPATAN", "Mga bagay na nararapat sa bawat tao"],
    ["KONSTITUSYON", "Ang pinakamataas na batas ng bansa"],
    ["DIGNIDAD", "Halaga at paggalang na nararapat sa bawat tao"],
    ["KALAYAAN", "Kakayahang kumilos at magpasya nang malaya"],
    ["BOTO", "Paraan ng pagpili ng mga pinuno sa halalan"],
    ["MAMAMAYAN", "Kasapi ng isang bansa"],
  ]),
];

/** English 10. */
export const WORDS_ENG: ScrambleLevel[] = [
  level("weng-1", 1, "Myths and Legends of the World", "Gods and Heroes", [
    ["MYTH", "An old story that explains nature or the gods"],
    ["LEGEND", "A story about a hero that may be based on real events"],
    ["HERO", "The brave main character of an epic"],
    ["ZEUS", "King of the Greek gods"],
    ["OLYMPUS", "The mountain home of the Greek gods"],
    ["QUEST", "A long journey to find or win something"],
  ]),
  level("weng-2", 3, "Evaluating Arguments", "Prove It", [
    ["CLAIM", "The main point a writer wants you to accept"],
    ["EVIDENCE", "Facts that support a claim"],
    ["BIAS", "An unfair leaning toward one side"],
    ["FALLACY", "An error in reasoning"],
    ["OPINION", "What someone believes; it can't be proven"],
    ["FACT", "Something that can be proven true"],
  ]),
  level("weng-3", 4, "Writing a Persuasive Essay", "Convince Me", [
    ["THESIS", "One sentence that states the essay's main argument"],
    ["PERSUADE", "To convince someone"],
    ["COUNTERCLAIM", "The argument of the opposing side"],
    ["CONCLUSION", "The last paragraph that sums it all up"],
    ["TRANSITION", "A word like however or therefore that links ideas"],
    ["AUDIENCE", "The people you are writing for"],
  ]),
  level("weng-4", 5, "Research Report Writing", "Cite It Right", [
    ["SOURCE", "Where you get your information"],
    ["CITATION", "Credit given to a source in your text"],
    ["PLAGIARISM", "Copying someone's work without giving credit"],
    ["SUMMARY", "A short version of a text in your own words"],
    ["PARAPHRASE", "Restating one idea in your own words"],
    ["OUTLINE", "A plan of the main points before you write"],
  ]),
  level("weng-5", 8, "Formal and Informal Language", "Say It Right", [
    ["FORMAL", "Language for school, work and letters"],
    ["INFORMAL", "Language for friends and chats"],
    ["SLANG", "Very casual words that come and go"],
    ["CONTRACTION", "A short form like don't or it's"],
    ["TONE", "The writer's attitude toward the topic"],
    ["JARGON", "Special words used by one group or job"],
  ]),
];

/** Filipino 10. */
export const WORDS_FIL: ScrambleLevel[] = [
  level("wfil-1", 1, "Mitolohiya ng Mediterranean", "Mga Diyos ng Olympus", [
    ["MITOLOHIYA", "Mga kuwento tungkol sa mga diyos at diyosa"],
    ["ZEUS", "Hari ng mga diyos ng Gresya"],
    ["DIYOSA", "Babaeng diyos"],
    ["OLYMPUS", "Bundok na tirahan ng mga diyos ng Gresya"],
    ["TAUHAN", "Mga gumaganap sa isang kuwento"],
    ["HERA", "Asawa ni Zeus, diyosa ng pag-aasawa"],
  ]),
  level("wfil-2", 2, "Parabula at Sanaysay", "Aral at Tayutay", [
    ["PARABULA", "Maikling kuwentong may aral, hango sa Bibliya"],
    ["SANAYSAY", "Akdang naglalahad ng kuro-kuro ng may-akda"],
    ["ARAL", "Mahalagang mensahe o leksiyon ng akda"],
    [
      "TAYUTAY",
      "Di-karaniwang paggamit ng salita para maging masining ang pahayag",
    ],
    ["SIMILI", "Paghahambing na gumagamit ng tulad ng o parang"],
    ["METAPORA", "Tuwirang paghahambing nang walang tulad ng o parang"],
  ]),
  level("wfil-3", 3, "Epiko at Nobela ng Mediterranean", "Kuwento ng Bayani", [
    ["EPIKO", "Mahabang tulang pasalaysay tungkol sa kabayanihan"],
    ["BAYANI", "Matapang na pangunahing tauhang may pambihirang lakas"],
    ["NOBELA", "Mahabang kuwentong may maraming kabanata"],
    ["KABANATA", "Isang bahagi o yugto ng nobela"],
    ["BANGHAY", "Pagkakasunod-sunod ng mga pangyayari sa kuwento"],
    ["TAGPUAN", "Lugar at panahon ng kuwento"],
  ]),
  level(
    "wfil-4",
    4,
    "Panitikang Kanluranin: Anekdota at Tula",
    "Tula at Anekdota",
    [
      [
        "ANEKDOTA",
        "Maikling kuwento ng nakatutuwang pangyayari sa buhay ng isang tao",
      ],
      ["TULA", "Akdang may sukat at tugma"],
      ["SAKNONG", "Grupo ng mga taludtod sa tula"],
      ["TALUDTOD", "Isang linya ng tula"],
      ["TUGMA", "Pagkakapareho ng tunog sa dulo ng mga taludtod"],
      ["SUKAT", "Bilang ng pantig sa bawat taludtod"],
    ],
  ),
  level(
    "wfil-5",
    8,
    "El Filibusterismo: Mga Tauhan at Aral",
    "Tauhan ng El Fili",
    [
      ["RIZAL", "Sumulat ng El Filibusterismo"],
      ["SIMOUN", "Mayamang mag-aalahas na nagbabalatkayo"],
      ["BASILIO", "Mag-aaral ng medisina na anak ni Sisa"],
      ["GHENT", "Lungsod sa Belgium kung saan inilimbag ang El Fili"],
      ["ISAGANI", "Makatang pamangkin ni Padre Florentino"],
      ["TALES", "Kabesang ___, magsasakang inagawan ng lupa"],
    ],
  ),
];

/** TLE exploratory and the other TLE strands. */
export const WORDS_TLE: ScrambleLevel[] = [
  level("wtle-1", 1, "ICT: Computer Operations", "Computer Parts", [
    ["MONITOR", "The screen that shows the computer's output"],
    ["KEYBOARD", "The device you type on"],
    ["MOUSE", "The pointing device you click"],
    ["PROCESSOR", "The brain of the computer, also called the CPU"],
    ["MEMORY", "RAM: where the computer keeps what it's working on"],
    ["PRINTER", "Puts your documents on paper"],
  ]),
  level(
    "wtle-2",
    2,
    "Home Economics: Food Safety and Sanitation",
    "Clean Kitchen",
    [
      ["SANITIZE", "Reduce germs on a surface to a safe level"],
      ["APRON", "Worn to keep your clothes clean while cooking"],
      ["BACTERIA", "Tiny germs that can spoil food"],
      ["SPATULA", "A flat tool for flipping or spreading"],
      ["COLANDER", "A bowl with holes for draining pasta"],
      ["HAIRNET", "Keeps your hair out of the food"],
    ],
  ),
  level(
    "wtle-3",
    3,
    "Agri-Fishery Arts: Plant Propagation and Planting",
    "Farm Day",
    [
      ["SHOVEL", "A tool for digging and moving soil"],
      ["RAKE", "A tool with teeth for leveling soil"],
      ["SEEDLING", "A young plant grown from a seed"],
      ["COMPOST", "Rotted plant waste that feeds the soil"],
      ["FERTILIZER", "Adds nutrients to help plants grow"],
      ["IRRIGATION", "Supplying water to crops"],
    ],
  ),
  level("wtle-4", 4, "Industrial Arts: Basic Wiring", "Wire It Up", [
    ["PLIERS", "A tool to grip, bend and cut wires"],
    ["SCREWDRIVER", "A tool that turns screws"],
    ["MULTITESTER", "Measures voltage, current and resistance"],
    ["CIRCUIT", "A complete path for electricity"],
    ["SWITCH", "Turns a circuit on or off"],
    ["INSULATOR", "A material that doesn't carry electricity, like rubber"],
  ]),
];

export const SCRAMBLE_LEVELS: ScrambleLevel[] = [
  ...WORDS_CP,
  ...WORDS_TEL,
  ...WORDS_MATH,
  ...WORDS_SCI,
  ...WORDS_AP,
  ...WORDS_ENG,
  ...WORDS_FIL,
  ...WORDS_TLE,
];

/** A word's letters in a fixed shuffled order, never the word itself. */
export function scrambleOf(word: ScrambleWord) {
  const hash = (i: number) => {
    let h = 7;
    for (const ch of `${word.id}:${i}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  };
  const letters = [...word.word];
  const order = letters.map((_, i) => i).sort((a, b) => hash(a) - hash(b));
  let out = order.map((i) => letters[i]!);
  // Rotate until it's no longer the answer (unless every letter is the same).
  for (let k = 0; k < out.length && out.join("") === word.word; k++) {
    out = [...out.slice(1), out[0]!];
  }
  return out;
}

/** Stars from mistakes (wrong guesses plus hints). */
export function scrambleStars(mistakes: number) {
  return mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
}

/**
 * Scores a finished level from, per word, every full guess spelled (the
 * last one right) and the hints taken. Null when a word wasn't solved or a
 * guess doesn't use the word's letters.
 */
export function scoreScramble(
  level: ScrambleLevel,
  answers: { guesses: string[]; hints: number }[],
) {
  if (answers.length !== level.words.length) return null;
  const sorted = (s: string) => [...s].sort().join("");
  let mistakes = 0;
  for (const [i, w] of level.words.entries()) {
    const { guesses, hints } = answers[i]!;
    if (guesses.at(-1) !== w.word) return null;
    if (guesses.some((g) => sorted(g) !== sorted(w.word))) return null;
    if (hints > w.word.length - 1) return null;
    mistakes += guesses.length - 1 + hints;
  }
  return { mistakes, stars: scrambleStars(mistakes) };
}
