/**
 * "Unit Questions" for the Grade 10 demo: five multiple-choice questions per
 * unit, answered after the unit's short discussion (its lessons). Indexed by
 * subject, then unit position, in the same order as GRADE10_SUBJECTS.
 *
 * `answer` is the 0-based index of the correct choice; `why` is shown to the
 * student after submitting.
 */
import type { DemoSubject } from "./grade10";

export type QuizItem = {
  q: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  why: string;
};

const item = (
  q: string,
  choices: [string, string, string, string],
  answer: 0 | 1 | 2 | 3,
  why: string,
): QuizItem => ({ q, choices, answer, why });

export const UNIT_QUIZZES: Record<DemoSubject["key"], QuizItem[][]> = {
  MATH: [
    // 1 Arithmetic Sequences and Series
    [
      item(
        "What is the common difference of 5, 12, 19, 26, …?",
        ["5", "6", "7", "12"],
        2,
        "12 − 5 = 7, and every term goes up by 7.",
      ),
      item(
        "What is the 10th term of 3, 7, 11, 15, …?",
        ["39", "40", "43", "36"],
        0,
        "a₁₀ = 3 + (10 − 1)(4) = 39.",
      ),
      item(
        "Which sequence is arithmetic?",
        ["2, 4, 8, 16", "1, 4, 9, 16", "10, 7, 4, 1", "1, 1, 2, 3"],
        2,
        "10, 7, 4, 1 subtracts 3 each time.",
      ),
      item(
        "What is the sum of the first 20 positive odd numbers?",
        ["200", "400", "380", "420"],
        1,
        "S₂₀ = 20/2 (1 + 39) = 400.",
      ),
      item(
        "What is the arithmetic mean of 6 and 26?",
        ["10", "16", "20", "32"],
        1,
        "(6 + 26) / 2 = 16.",
      ),
    ],
    // 2 Geometric Sequences and Series
    [
      item(
        "What is the common ratio of 81, 27, 9, …?",
        ["3", "−3", "1/3", "9"],
        2,
        "27 ÷ 81 = 1/3.",
      ),
      item(
        "What is the 6th term of 2, 6, 18, …?",
        ["486", "162", "1458", "324"],
        0,
        "a₆ = 2 · 3⁵ = 486.",
      ),
      item(
        "Which sequence is geometric?",
        ["3, 6, 9, 12", "5, 10, 20, 40", "1, 3, 6, 10", "2, 5, 8, 11"],
        1,
        "5, 10, 20, 40 multiplies by 2 each time.",
      ),
      item(
        "What is the sum to infinity of 12, 6, 3, …?",
        ["18", "21", "24", "36"],
        2,
        "S = 12 / (1 − 1/2) = 24.",
      ),
      item(
        "What is the geometric mean of 4 and 9?",
        ["6", "6.5", "13", "36"],
        0,
        "√(4 · 9) = 6.",
      ),
    ],
    // 3 Polynomials and Polynomial Division
    [
      item(
        "What is the remainder when x³ + 4x − 5 is divided by x − 1?",
        ["−5", "0", "1", "5"],
        1,
        "P(1) = 1 + 4 − 5 = 0.",
      ),
      item(
        "Which is a factor of x² − 9?",
        ["x − 9", "x + 9", "x − 3", "x² + 3"],
        2,
        "x² − 9 = (x − 3)(x + 3).",
      ),
      item(
        "In synthetic division by x − 2, which number is written in the box?",
        ["−2", "2", "0", "1"],
        1,
        "For x − c we use c, so c = 2.",
      ),
      item(
        "What is the quotient of (2x² + 7x + 3) ÷ (x + 3)?",
        ["2x + 1", "2x − 1", "x + 1", "2x + 3"],
        0,
        "(x + 3)(2x + 1) = 2x² + 7x + 3.",
      ),
      item(
        "The Factor Theorem says x − c is a factor of P(x) when:",
        ["P(c) = 1", "P(0) = c", "P(c) = 0", "P(−c) = 0"],
        2,
        "A zero remainder means x − c divides P(x) exactly.",
      ),
    ],
    // 4 Polynomial Equations and Functions
    [
      item(
        "What are the roots of x³ − 6x² + 11x − 6 = 0?",
        ["1, 2, 3", "−1, −2, −3", "1, 3, 6", "2, 3, 6"],
        0,
        "(x − 1)(x − 2)(x − 3) = 0.",
      ),
      item(
        "How many roots at most does a polynomial equation of degree 4 have?",
        ["2", "3", "4", "5"],
        2,
        "A degree-n polynomial has at most n roots.",
      ),
      item(
        "The graph of y = −2x⁴ + x − 1 falls on both ends because:",
        [
          "the degree is odd",
          "the leading coefficient is negative and the degree is even",
          "the constant is −1",
          "it has no roots",
        ],
        1,
        "Even degree with a negative leading coefficient: both ends go down.",
      ),
      item(
        "At a zero of even multiplicity, the graph:",
        [
          "crosses the x-axis",
          "touches the x-axis and turns",
          "has no intercept",
          "is undefined",
        ],
        1,
        "Even multiplicity makes the graph bounce off the axis.",
      ),
      item(
        "Which is a possible rational root of 2x³ + x² − 7x − 6 = 0?",
        ["3/2", "5", "7/2", "4"],
        0,
        "Possible roots are ±(factors of 6)/(factors of 2); 3/2 is one of them.",
      ),
    ],
    // 5 Circles
    [
      item(
        "A central angle measures 72°. Its intercepted arc measures:",
        ["36°", "72°", "144°", "288°"],
        1,
        "A central angle equals its intercepted arc.",
      ),
      item(
        "An inscribed angle intercepts a 110° arc. The angle measures:",
        ["55°", "110°", "220°", "70°"],
        0,
        "An inscribed angle is half its arc.",
      ),
      item(
        "An angle inscribed in a semicircle is always:",
        ["45°", "60°", "90°", "180°"],
        2,
        "It intercepts a 180° arc, so it measures 90°.",
      ),
      item(
        "A tangent line is ___ to the radius at the point of tangency.",
        ["parallel", "perpendicular", "equal", "opposite"],
        1,
        "The radius meets the tangent at a right angle.",
      ),
      item(
        "What is the length of a 90° arc in a circle of radius 14 cm? (π ≈ 22/7)",
        ["11 cm", "22 cm", "44 cm", "88 cm"],
        1,
        "(90/360) · 2 · (22/7) · 14 = 22 cm.",
      ),
    ],
    // 6 Coordinate Geometry
    [
      item(
        "What is the distance between (2, −1) and (8, 7)?",
        ["8", "10", "12", "14"],
        1,
        "√(6² + 8²) = √100 = 10.",
      ),
      item(
        "What is the midpoint of (−4, 6) and (10, 2)?",
        ["(3, 4)", "(7, 4)", "(3, 8)", "(6, 2)"],
        0,
        "((−4 + 10)/2, (6 + 2)/2) = (3, 4).",
      ),
      item(
        "Which is the equation of the circle with center (3, −2) and radius 5?",
        [
          "(x − 3)² + (y + 2)² = 25",
          "(x + 3)² + (y − 2)² = 25",
          "(x − 3)² + (y + 2)² = 5",
          "x² + y² = 25",
        ],
        0,
        "(x − h)² + (y − k)² = r² with h = 3, k = −2, r = 5.",
      ),
      item(
        "The circle x² + y² = 49 has radius:",
        ["49", "7", "14", "24.5"],
        1,
        "r² = 49, so r = 7.",
      ),
      item(
        "What is the center of (x + 1)² + (y − 4)² = 9?",
        ["(1, −4)", "(−1, 4)", "(1, 4)", "(−1, −4)"],
        1,
        "x + 1 = x − (−1) and y − 4, so the center is (−1, 4).",
      ),
    ],
    // 7 Permutations and Combinations
    [
      item(
        "In how many ways can 4 students sit in a row of 4 chairs?",
        ["4", "16", "24", "256"],
        2,
        "4! = 24.",
      ),
      item("What is P(5, 2)?", ["10", "20", "25", "60"], 1, "5!/3! = 20."),
      item(
        "What is C(10, 3)?",
        ["30", "120", "720", "1000"],
        1,
        "10!/(3! · 7!) = 120.",
      ),
      item(
        "Choosing a committee of 3 from a class is a:",
        [
          "permutation, because order matters",
          "combination, because order does not matter",
          "circular permutation",
          "probability",
        ],
        1,
        "Members of a committee have no order.",
      ),
      item(
        "In how many ways can 6 people sit around a round table?",
        ["720", "120", "36", "6"],
        1,
        "Circular permutation: (6 − 1)! = 120.",
      ),
    ],
    // 8 Probability and Measures of Position
    [
      item(
        "Two coins are tossed. What is P(both heads)?",
        ["1/2", "1/3", "1/4", "3/4"],
        2,
        "HH is 1 of 4 outcomes.",
      ),
      item(
        "A die is rolled. What is P(even or greater than 4)?",
        ["1/2", "2/3", "5/6", "1/3"],
        1,
        "Even {2, 4, 6} or >4 {5, 6} gives {2, 4, 5, 6} = 4/6 = 2/3.",
      ),
      item(
        "Events A and B are independent when:",
        [
          "P(A and B) = P(A) + P(B)",
          "P(A and B) = P(A) · P(B)",
          "P(A) = P(B)",
          "they cannot happen together",
        ],
        1,
        "That is the multiplication rule for independent events.",
      ),
      item(
        "Quartiles divide ordered data into how many equal parts?",
        ["2", "4", "10", "100"],
        1,
        "Quartiles split data into four parts.",
      ),
      item(
        "Scoring at the 85th percentile means:",
        [
          "you got 85% of the items",
          "85% of scores are at or below yours",
          "you ranked 85th",
          "15% scored lower",
        ],
        1,
        "A percentile tells the share of scores at or below yours.",
      ),
    ],
  ],
  SCI: [
    // 1 Plate Tectonics
    [
      item(
        "Most earthquakes and volcanoes occur:",
        [
          "in the middle of plates",
          "along plate boundaries",
          "only in oceans",
          "near the poles",
        ],
        1,
        "Plate interactions at boundaries cause most of them.",
      ),
      item(
        "The Philippines lies on the:",
        [
          "Mid-Atlantic Ridge",
          "Pacific Ring of Fire",
          "Himalayan Belt",
          "San Andreas Fault",
        ],
        1,
        "It sits where the Philippine Sea and Eurasian plates meet.",
      ),
      item(
        "At a divergent boundary, plates:",
        ["collide", "move apart", "slide past each other", "do not move"],
        1,
        "Divergent means moving apart.",
      ),
      item(
        "Which forms where an oceanic plate subducts under a continental plate?",
        [
          "Rift valley",
          "Volcanic mountain range and trench",
          "Mid-ocean ridge",
          "Transform fault",
        ],
        1,
        "Subduction makes a trench and a volcanic arc.",
      ),
      item(
        "The San Andreas Fault is an example of a:",
        [
          "divergent boundary",
          "convergent boundary",
          "transform boundary",
          "hot spot",
        ],
        2,
        "Its plates slide past each other.",
      ),
    ],
    // 2 Electromagnetic Spectrum
    [
      item(
        "Which EM wave has the longest wavelength?",
        ["Gamma rays", "Visible light", "Radio waves", "X-rays"],
        2,
        "Radio waves have the longest wavelength and lowest frequency.",
      ),
      item(
        "All EM waves travel in a vacuum at:",
        ["340 m/s", "3 × 10⁸ m/s", "3 × 10⁶ m/s", "different speeds"],
        1,
        "All EM waves move at the speed of light in a vacuum.",
      ),
      item(
        "Which EM wave is used in TV remote controls?",
        ["Infrared", "Ultraviolet", "Gamma", "X-ray"],
        0,
        "Remotes send infrared signals.",
      ),
      item(
        "Which radiation causes sunburn?",
        ["Radio", "Microwave", "Ultraviolet", "Infrared"],
        2,
        "UV radiation damages skin cells.",
      ),
      item(
        "Why should X-ray exposure be limited?",
        [
          "It is too cold",
          "High-energy radiation can damage cells",
          "It is too slow",
          "It cannot pass through skin",
        ],
        1,
        "X-rays carry enough energy to harm living tissue.",
      ),
    ],
    // 3 Light: Mirrors and Lenses
    [
      item(
        "A plane mirror forms an image that is:",
        [
          "real and inverted",
          "virtual, upright and the same size",
          "smaller and real",
          "larger and inverted",
        ],
        1,
        "Plane mirrors make upright virtual images of the same size.",
      ),
      item(
        "Why are convex mirrors used as vehicle side mirrors?",
        [
          "They magnify",
          "They give a wider field of view",
          "They form real images",
          "They are cheaper",
        ],
        1,
        "Convex mirrors show a wider area.",
      ),
      item(
        "A convex lens:",
        [
          "spreads light rays apart",
          "brings light rays to a focus",
          "blocks light",
          "reflects light",
        ],
        1,
        "It is a converging lens.",
      ),
      item(
        "Farsightedness is corrected with a:",
        ["concave lens", "convex lens", "plane mirror", "prism"],
        1,
        "A converging lens helps focus near objects.",
      ),
      item(
        "An object is 30 cm from a lens with f = 10 cm. The image distance is:",
        ["15 cm", "20 cm", "10 cm", "30 cm"],
        0,
        "1/10 = 1/30 + 1/dᵢ, so dᵢ = 15 cm.",
      ),
    ],
    // 4 Biomolecules and Cellular Energy
    [
      item(
        "Which biomolecule is the main source of quick energy?",
        ["Lipids", "Carbohydrates", "Nucleic acids", "Proteins"],
        1,
        "Carbohydrates like glucose are broken down first for energy.",
      ),
      item(
        "Where does glycolysis take place?",
        ["Nucleus", "Mitochondria", "Cytoplasm", "Ribosome"],
        2,
        "Glycolysis happens in the cytoplasm.",
      ),
      item(
        "What is the net ATP yield of glycolysis per glucose?",
        ["2", "4", "36", "38"],
        0,
        "4 ATP made − 2 ATP used = 2 net.",
      ),
      item(
        "The monomers of proteins are:",
        ["glucose", "fatty acids", "amino acids", "nucleotides"],
        2,
        "Proteins are chains of amino acids.",
      ),
      item(
        "Most ATP in cellular respiration is made by the:",
        [
          "electron transport chain",
          "glycolysis",
          "Krebs cycle alone",
          "nucleus",
        ],
        0,
        "Oxidative phosphorylation in the ETC makes most ATP.",
      ),
    ],
    // 5 Electricity and Magnetism
    [
      item(
        "An electric current in a wire produces a:",
        ["magnetic field", "sound wave", "chemical reaction", "light only"],
        0,
        "Oersted showed currents create magnetic fields.",
      ),
      item(
        "Which makes an electromagnet stronger?",
        [
          "Fewer coils",
          "More current and more coils",
          "Removing the iron core",
          "Using plastic wire",
        ],
        1,
        "More turns and current strengthen the field.",
      ),
      item(
        "A generator converts:",
        [
          "electrical to mechanical energy",
          "mechanical to electrical energy",
          "heat to light",
          "chemical to sound",
        ],
        1,
        "Generators turn motion into electricity.",
      ),
      item(
        "Moving a magnet inside a coil produces current. This is called:",
        [
          "static electricity",
          "electromagnetic induction",
          "conduction",
          "radiation",
        ],
        1,
        "A changing magnetic field induces current.",
      ),
      item(
        "An electric motor converts:",
        [
          "electrical to mechanical energy",
          "mechanical to electrical energy",
          "light to heat",
          "sound to electricity",
        ],
        0,
        "Motors use electricity to make motion.",
      ),
    ],
    // 6 Reproductive, Endocrine and Nervous Systems
    [
      item(
        "Which hormone triggers ovulation?",
        ["Insulin", "LH", "Adrenaline", "Thyroxine"],
        1,
        "A surge of luteinizing hormone releases the egg.",
      ),
      item(
        "Insulin lowering high blood sugar is an example of:",
        ["positive feedback", "negative feedback", "reflex arc", "mutation"],
        1,
        "Negative feedback reverses a change.",
      ),
      item(
        "Which gland is called the master gland?",
        ["Thyroid", "Pituitary", "Adrenal", "Pancreas"],
        1,
        "The pituitary controls many other glands.",
      ),
      item(
        "Progesterone mainly:",
        [
          "prepares and maintains the uterine lining",
          "controls blood sugar",
          "speeds up heart rate",
          "makes sperm",
        ],
        0,
        "It keeps the uterus ready for pregnancy.",
      ),
      item(
        "The basic unit of the nervous system is the:",
        ["nephron", "neuron", "alveolus", "villus"],
        1,
        "Neurons carry nerve impulses.",
      ),
    ],
    // 7 Heredity
    [
      item(
        "In DNA, adenine pairs with:",
        ["cytosine", "guanine", "thymine", "uracil"],
        2,
        "A pairs with T; G pairs with C.",
      ),
      item(
        "Which base is found in RNA but not DNA?",
        ["Thymine", "Uracil", "Adenine", "Guanine"],
        1,
        "RNA uses uracil instead of thymine.",
      ),
      item(
        "Copying DNA into mRNA is called:",
        ["translation", "transcription", "replication", "mutation"],
        1,
        "Transcription makes mRNA from DNA.",
      ),
      item(
        "Translation takes place in the:",
        ["nucleus", "ribosome", "cell membrane", "vacuole"],
        1,
        "Ribosomes read mRNA to build proteins.",
      ),
      item(
        "A change in the DNA sequence is a:",
        ["codon", "mutation", "gene pool", "phenotype"],
        1,
        "Mutations alter the DNA sequence.",
      ),
    ],
    // 8 Biodiversity and Evolution
    [
      item(
        "Structures with the same origin but different functions are:",
        ["analogous", "homologous", "vestigial", "fossils"],
        1,
        "A human arm and a bat wing are homologous.",
      ),
      item(
        "Who proposed the theory of natural selection?",
        ["Mendel", "Darwin", "Newton", "Pasteur"],
        1,
        "Charles Darwin.",
      ),
      item(
        "Natural selection means organisms with helpful traits:",
        [
          "die out",
          "survive and reproduce more",
          "stop changing",
          "become smaller",
        ],
        1,
        "Their traits become more common over generations.",
      ),
      item(
        "Antibiotic-resistant bacteria are an example of:",
        [
          "natural selection",
          "photosynthesis",
          "spontaneous generation",
          "hibernation",
        ],
        0,
        "Resistant bacteria survive and multiply.",
      ),
      item(
        "Fossils support evolution because they show:",
        [
          "only living species",
          "changes in organisms over time",
          "weather patterns",
          "soil types",
        ],
        1,
        "The fossil record shows gradual change.",
      ),
    ],
    // 9 Gas Laws
    [
      item(
        "Boyle's Law relates:",
        [
          "volume and temperature",
          "pressure and volume",
          "pressure and temperature",
          "moles and volume",
        ],
        1,
        "At constant temperature, P₁V₁ = P₂V₂.",
      ),
      item(
        "A gas at 2 atm occupies 6 L. At 3 atm (same temperature) its volume is:",
        ["4 L", "9 L", "3 L", "12 L"],
        0,
        "2 × 6 = 3 × V₂, so V₂ = 4 L.",
      ),
      item(
        "In gas-law problems temperature must be in:",
        ["Celsius", "Fahrenheit", "Kelvin", "any unit"],
        2,
        "Gas laws need absolute temperature.",
      ),
      item(
        "In PV = nRT, n stands for:",
        ["number of molecules", "number of moles", "pressure", "volume"],
        1,
        "n is the amount of gas in moles.",
      ),
      item(
        "One mole of gas at STP occupies about:",
        ["11.2 L", "22.4 L", "44.8 L", "1 L"],
        1,
        "Molar volume at STP is 22.4 L.",
      ),
    ],
    // 10 Chemical Reactions
    [
      item(
        "Which equation is balanced?",
        [
          "H₂ + O₂ → H₂O",
          "2H₂ + O₂ → 2H₂O",
          "H₂ + 2O₂ → H₂O",
          "2H₂ + 2O₂ → H₂O",
        ],
        1,
        "4 H and 2 O on each side.",
      ),
      item(
        "Balancing equations follows the Law of:",
        [
          "Conservation of Mass",
          "Universal Gravitation",
          "Inertia",
          "Definite Proportions only",
        ],
        0,
        "Atoms are neither created nor destroyed.",
      ),
      item(
        "Which speeds up a reaction without being used up?",
        ["Inhibitor", "Catalyst", "Product", "Solvent"],
        1,
        "Catalysts lower the activation energy.",
      ),
      item(
        "Food spoils faster at room temperature because:",
        [
          "higher temperature speeds up reactions",
          "cold speeds up reactions",
          "air is heavier",
          "light stops reactions",
        ],
        0,
        "Reactions go faster when it is warmer.",
      ),
      item(
        "Powdered sugar dissolves faster than a sugar cube because of greater:",
        ["mass", "surface area", "color", "density"],
        1,
        "More surface area means more contact.",
      ),
    ],
  ],
  FIL: [
    // 1 Mitolohiya ng Mediterranean
    [
      item(
        "Ano ang mitolohiya?",
        [
          "Kuwento ng mga diyos at diyosa",
          "Talambuhay ng bayani",
          "Balita sa pahayagan",
          "Liham pangangalakal",
        ],
        0,
        "Ang mitolohiya ay kuwento tungkol sa mga diyos at diyosa.",
      ),
      item(
        "Sino ang diyos ng pag-ibig sa mitolohiyang Romano?",
        ["Jupiter", "Cupid", "Neptune", "Mars"],
        1,
        "Si Cupid ang diyos ng pag-ibig.",
      ),
      item(
        "Ano ang pangunahing pagsubok ni Psyche?",
        [
          "Tiwala sa asawang hindi niya nakikita",
          "Pakikidigma",
          "Paghahanap ng kayamanan",
          "Paglalakbay sa dagat",
        ],
        0,
        "Sinubok ang kanyang tiwala kay Cupid.",
      ),
      item(
        "'Binasa ni Ana ang aklat.' Anong pokus ng pandiwa?",
        ["Tagaganap", "Layon", "Ganapan", "Sanhi"],
        1,
        "Ang aklat (layon) ang paksa ng pangungusap.",
      ),
      item(
        "'Nagbasa si Ana ng aklat.' Anong pokus ng pandiwa?",
        ["Tagaganap", "Layon", "Tagatanggap", "Kagamitan"],
        0,
        "Si Ana (tagaganap) ang paksa.",
      ),
    ],
    // 2 Parabula at Sanaysay
    [
      item(
        "Ang parabula ay kuwentong:",
        [
          "may aral at kadalasang hango sa Bibliya",
          "tungkol sa mga hayop lamang",
          "puno ng katatawanan",
          "walang aral",
        ],
        0,
        "Nagtuturo ito ng aral, kadalasang mula sa Bibliya.",
      ),
      item(
        "Sino ang sumulat ng 'Alegorya ng Yungib'?",
        ["Aristotle", "Plato", "Homer", "Socrates"],
        1,
        "Isinulat ito ni Plato.",
      ),
      item(
        "Ano ang sanaysay?",
        [
          "Akdang naglalahad ng kuro-kuro ng may-akda",
          "Tulang may sukat",
          "Dulang itinatanghal",
          "Kuwentong-bayan",
        ],
        0,
        "Inilalahad nito ang pananaw ng may-akda.",
      ),
      item(
        "Sa 'Alegorya ng Yungib', ang paglabas sa yungib ay sumisimbolo sa:",
        [
          "kahirapan",
          "pagkamit ng kaalaman at katotohanan",
          "digmaan",
          "pagtulog",
        ],
        1,
        "Ang liwanag sa labas ay katotohanan at edukasyon.",
      ),
      item(
        "Ang ginagamit ng parabula upang ipahayag ang mensahe ay:",
        ["simbolo", "tugma", "sukat", "diyalogo lamang"],
        0,
        "Gumagamit ito ng mga simbolo.",
      ),
    ],
    // 3 Epiko at Nobela
    [
      item(
        "Ang epiko ay:",
        [
          "mahabang tulang pasalaysay tungkol sa kabayanihan",
          "maikling tula",
          "liham",
          "balita",
        ],
        0,
        "Tumatalakay ito sa kabayanihan ng pangunahing tauhan.",
      ),
      item(
        "Sino ang bayani ng 'Odyssey'?",
        ["Achilles", "Odysseus", "Hector", "Zeus"],
        1,
        "Si Odysseus ang naglakbay pauwi sa Ithaca.",
      ),
      item(
        "Sino ang kuba sa 'Ang Kuba ng Notre Dame'?",
        ["Quasimodo", "Frollo", "Phoebus", "Gringoire"],
        0,
        "Si Quasimodo ang kampanero ng katedral.",
      ),
      item(
        "Ang nobela ay naiiba sa maikling kuwento dahil ito ay:",
        [
          "mas mahaba at may maraming kabanata",
          "walang tauhan",
          "laging tula",
          "walang banghay",
        ],
        0,
        "Mahaba ito at nahahati sa mga kabanata.",
      ),
      item(
        "Anong isyu ang makikita sa 'Ang Kuba ng Notre Dame'?",
        [
          "Pagtanggap sa kapwa anuman ang kaanyuan",
          "Pagbabayad ng buwis",
          "Pagtatanim",
          "Paglalakbay sa buwan",
        ],
        0,
        "Itinuturo nito ang pagtanggap sa iba.",
      ),
    ],
    // 4 Anekdota at Tula
    [
      item(
        "Ang anekdota ay:",
        [
          "maikling salaysay ng kawili-wiling pangyayari sa buhay ng tao",
          "mahabang nobela",
          "awit",
          "talumpati",
        ],
        0,
        "Maikli ito at batay sa tunay na pangyayari.",
      ),
      item(
        "Ang sukat sa tula ay tumutukoy sa:",
        [
          "bilang ng pantig sa bawat taludtod",
          "pagkakatulad ng tunog sa dulo",
          "damdamin",
          "pamagat",
        ],
        0,
        "Ang sukat ay bilang ng pantig.",
      ),
      item(
        "Ang tugma ay:",
        [
          "pagkakatulad ng tunog sa dulo ng taludtod",
          "bilang ng saknong",
          "tauhan",
          "tagpuan",
        ],
        0,
        "Magkatunog ang huling pantig ng mga taludtod.",
      ),
      item(
        "Ang saknong ay:",
        [
          "grupo ng mga taludtod",
          "isang salita",
          "pamagat ng tula",
          "may-akda",
        ],
        0,
        "Binubuo ito ng ilang taludtod.",
      ),
      item(
        "Ang talinghaga sa tula ay:",
        [
          "matalinghaga o di-tuwirang pagpapahayag",
          "bilang ng pantig",
          "pangalan ng makata",
          "uri ng papel",
        ],
        0,
        "Gumagamit ito ng mga tayutay at simbolo.",
      ),
    ],
    // 5 Dula at Maikling Kuwento ng Kanluranin
    [
      item(
        "Sino ang sumulat ng 'Romeo at Juliet'?",
        [
          "William Shakespeare",
          "Guy de Maupassant",
          "Victor Hugo",
          "Jose Rizal",
        ],
        0,
        "Isinulat ito ni William Shakespeare.",
      ),
      item(
        "Sino ang sumulat ng 'Ang Kuwintas'?",
        ["Guy de Maupassant", "Shakespeare", "Homer", "Plato"],
        0,
        "Isinulat ito ni Guy de Maupassant.",
      ),
      item(
        "Ang bahagi ng banghay na pinakamataas ang tensiyon ay ang:",
        ["simula", "kasukdulan", "wakas", "tagpuan"],
        1,
        "Ang kasukdulan ang rurok ng kuwento.",
      ),
      item(
        "Ano ang aral ng 'Ang Kuwintas'?",
        [
          "Masama ang labis na paghahangad sa karangyaan",
          "Mabuti ang pagsisinungaling",
          "Huwag mag-aral",
          "Laging maglakbay",
        ],
        0,
        "Nawala ang lahat kay Mathilde dahil sa luho.",
      ),
      item(
        "Ang dula ay akdang:",
        [
          "itinatanghal sa entablado",
          "inaawit lamang",
          "binabasa sa radyo lamang",
          "walang diyalogo",
        ],
        0,
        "Isinusulat ito para itanghal.",
      ),
    ],
    // 6 Panitikan ng Africa at Persia
    [
      item(
        "Sino ang mag-ama sa epiko ng Persia?",
        [
          "Rustam at Sohrab",
          "Romeo at Juliet",
          "Cupid at Psyche",
          "Simoun at Basilio",
        ],
        0,
        "Sina Rustam at Sohrab ng 'Shahnameh'.",
      ),
      item(
        "Ano ang trahedya sa 'Rustam at Sohrab'?",
        [
          "Napatay ng ama ang sariling anak nang hindi niya nakilala",
          "Nawala ang kuwintas",
          "Lumubog ang barko",
          "Nasunog ang palasyo",
        ],
        0,
        "Huli na nang makilala ni Rustam si Sohrab.",
      ),
      item(
        "Ipinapakita ng mga mitolohiya ng Africa ang paggalang sa:",
        [
          "kalikasan at mga ninuno",
          "makabagong teknolohiya",
          "pera",
          "palakasan",
        ],
        0,
        "Mahalaga sa kanila ang kalikasan at ninuno.",
      ),
      item(
        "Ang epiko ng Persia na kinabibilangan ng 'Rustam at Sohrab' ay ang:",
        ["Shahnameh", "Iliad", "Biag ni Lam-ang", "Ramayana"],
        0,
        "Bahagi ito ng Shahnameh ni Ferdowsi.",
      ),
      item(
        "Ano ang maaaring ihambing sa mitolohiya ng Africa?",
        ["Mitolohiyang Pilipino", "Resipe", "Mapa", "Talaarawan"],
        0,
        "Parehong nagpapaliwanag ng pinagmulan ng daigdig.",
      ),
    ],
    // 7 El Filibusterismo: Kaligirang Pangkasaysayan
    [
      item(
        "Kailan inilathala ang El Filibusterismo?",
        ["1887", "1891", "1896", "1898"],
        1,
        "Inilathala ito noong 1891.",
      ),
      item(
        "Saan inilathala ang El Filibusterismo?",
        ["Madrid", "Ghent, Belgium", "Maynila", "Hong Kong"],
        1,
        "Sa Ghent, Belgium.",
      ),
      item(
        "Sino ang tumulong kay Rizal sa pagpapalimbag nito?",
        [
          "Valentin Ventura",
          "Marcelo H. del Pilar",
          "Andres Bonifacio",
          "Apolinario Mabini",
        ],
        0,
        "Pinahiram siya ni Valentin Ventura ng pera.",
      ),
      item(
        "Kanino inialay ang El Filibusterismo?",
        ["GOMBURZA", "Kay Leonor Rivera", "Sa kanyang ina", "Sa mga Kastila"],
        0,
        "Inialay ito sa tatlong paring martir.",
      ),
      item(
        "Ano ang sinisimbolo ng bapor Tabo?",
        [
          "Ang pamahalaan at lipunan noon",
          "Isang tunay na barko lamang",
          "Ang kalikasan",
          "Ang simbahan lamang",
        ],
        0,
        "Mabagal at magulo, tulad ng pamahalaan noon.",
      ),
    ],
    // 8 El Filibusterismo: Mga Tauhan at Aral
    [
      item(
        "Sino talaga si Simoun?",
        ["Crisostomo Ibarra", "Basilio", "Isagani", "Padre Florentino"],
        0,
        "Si Simoun ay ang nagbalik na si Ibarra.",
      ),
      item(
        "Si Basilio ay isang:",
        ["mag-aaral ng medisina", "mag-aalahas", "pari", "sundalo"],
        0,
        "Nag-aral siya ng medisina.",
      ),
      item(
        "Si Isagani ay kilala bilang isang:",
        ["makata", "mangangalakal", "gobernador", "magsasaka"],
        0,
        "Isa siyang makatang makabayan.",
      ),
      item(
        "Ano ang layunin ni Simoun sa nobela?",
        [
          "Maghiganti at magpasimula ng himagsikan",
          "Maging pari",
          "Mag-aral sa Europa",
          "Magtayo ng paaralan",
        ],
        0,
        "Ginamit niya ang yaman para sa paghihiganti.",
      ),
      item(
        "Ayon sa nobela, ang tunay na pagbabago ay makakamit sa:",
        [
          "edukasyon at malinis na layunin",
          "paghihiganti",
          "karahasan",
          "pagtakas",
        ],
        0,
        "Ito ang aral ni Padre Florentino sa wakas.",
      ),
    ],
  ],
  ENG: [
    // 1 Myths and Legends
    [
      item(
        "Why was Prometheus punished?",
        [
          "He stole fire for humankind",
          "He lost a war",
          "He lied to Hera",
          "He left Olympus",
        ],
        0,
        "Zeus punished him for giving fire to humans.",
      ),
      item(
        "Myths are stories that usually:",
        [
          "explain natural events through gods and heroes",
          "report today's news",
          "give recipes",
          "list historical dates",
        ],
        0,
        "Myths explain the world through gods and heroes.",
      ),
      item(
        "Malakas and Maganda is a:",
        [
          "Philippine creation legend",
          "Greek myth",
          "Roman epic",
          "modern novel",
        ],
        0,
        "It tells how the first Filipinos came from a bamboo.",
      ),
      item(
        "Who is the king of the Greek gods?",
        ["Zeus", "Apollo", "Hermes", "Ares"],
        0,
        "Zeus rules from Mount Olympus.",
      ),
      item(
        "Comparing myths across cultures shows:",
        [
          "what each culture values",
          "which culture is best",
          "only differences",
          "nothing useful",
        ],
        0,
        "Myths reflect each culture's beliefs.",
      ),
    ],
    // 2 Reading for Information
    [
      item(
        "Which is a textual aid?",
        ["A graph", "A rhyme", "A metaphor", "A plot"],
        0,
        "Graphs help readers understand information.",
      ),
      item(
        "A good summary:",
        [
          "keeps the main idea in your own words",
          "copies every sentence",
          "adds your opinion",
          "includes all examples",
        ],
        0,
        "Summaries are short and in your own words.",
      ),
      item(
        "Headings in a text help readers:",
        [
          "find and organize information",
          "rhyme words",
          "end the story",
          "add characters",
        ],
        0,
        "They show what each part is about.",
      ),
      item(
        "Which should a summary leave out?",
        [
          "The main idea",
          "Key details",
          "Minor examples and repetitions",
          "The topic",
        ],
        2,
        "Details that do not support the main idea are dropped.",
      ),
      item(
        "A table is most useful for:",
        [
          "comparing data",
          "telling a story",
          "writing a poem",
          "giving a speech",
        ],
        0,
        "Tables organize data for comparison.",
      ),
    ],
    // 3 Evaluating Arguments
    [
      item(
        "'The school should ban single-use plastics' is a claim of:",
        ["fact", "value", "policy", "emotion"],
        2,
        "It proposes an action.",
      ),
      item(
        "'Manila is the capital of the Philippines' is a claim of:",
        ["fact", "value", "policy", "opinion"],
        0,
        "It can be proven true.",
      ),
      item(
        "'Everyone is buying this phone, so should you!' uses:",
        ["bandwagon", "testimonial", "name-calling", "glittering generalities"],
        0,
        "It appeals to joining the crowd.",
      ),
      item(
        "A celebrity endorsing a product is:",
        ["bandwagon", "testimonial", "plain folks", "card stacking"],
        1,
        "Testimonial uses a famous person.",
      ),
      item(
        "Credible evidence comes from:",
        [
          "reliable, verifiable sources",
          "rumors",
          "anonymous posts",
          "guesses",
        ],
        0,
        "Evidence must be checkable and trustworthy.",
      ),
    ],
    // 4 Writing a Persuasive Essay
    [
      item(
        "The sentence that states your position is the:",
        ["thesis statement", "conclusion", "title", "counterclaim"],
        0,
        "The thesis states your main argument.",
      ),
      item(
        "Why include a counterclaim?",
        [
          "To answer the opposing view and strengthen your argument",
          "To change your position",
          "To make the essay longer",
          "To confuse readers",
        ],
        0,
        "Rebutting it shows you considered both sides.",
      ),
      item(
        "Which transition shows contrast?",
        ["However", "Furthermore", "As a result", "First"],
        0,
        "'However' introduces an opposing idea.",
      ),
      item(
        "Which transition shows cause and effect?",
        ["As a result", "In addition", "For example", "Similarly"],
        0,
        "'As a result' links a cause to its effect.",
      ),
      item(
        "A strong conclusion should:",
        [
          "restate the thesis and end with a call to action",
          "introduce a new topic",
          "list sources",
          "repeat the title",
        ],
        0,
        "It wraps up and leaves an impact.",
      ),
    ],
    // 5 Research Report Writing
    [
      item(
        "Which source is most reliable?",
        [
          "A government or university website",
          "An anonymous blog",
          "A social media rumor",
          "A meme",
        ],
        0,
        "Known, trusted publishers are more reliable.",
      ),
      item(
        "Plagiarism is:",
        [
          "using others' work without giving credit",
          "citing sources",
          "summarizing",
          "taking notes",
        ],
        0,
        "Always credit the original author.",
      ),
      item(
        "APA style lists:",
        [
          "author, year, title and source",
          "only the title",
          "only the website",
          "the reader's name",
        ],
        0,
        "These help readers find the source.",
      ),
      item(
        "Why check more than one source?",
        [
          "To confirm the facts",
          "To copy more text",
          "To make the report longer",
          "It is not needed",
        ],
        0,
        "Cross-checking confirms accuracy.",
      ),
      item(
        "A research report should be written in:",
        ["formal language", "slang", "text-message style", "emoji"],
        0,
        "Reports use formal, objective language.",
      ),
    ],
    // 6 Literary Criticism
    [
      item(
        "The formalist approach focuses on:",
        [
          "the text itself: plot, character and language",
          "the author's life",
          "money and power",
          "gender roles",
        ],
        0,
        "Formalists study the work's form.",
      ),
      item(
        "The moralist approach asks:",
        [
          "what the text teaches about right and wrong",
          "how many pages it has",
          "where it was printed",
          "who bought it",
        ],
        0,
        "It looks for moral lessons.",
      ),
      item(
        "The feminist approach examines:",
        [
          "how women are portrayed",
          "the price of the book",
          "the setting only",
          "rhyme scheme",
        ],
        0,
        "It focuses on gender and women's roles.",
      ),
      item(
        "The Marxist approach looks at:",
        [
          "social class and power",
          "rhyme and meter",
          "the author's childhood",
          "illustrations",
        ],
        0,
        "It studies class conflict.",
      ),
      item(
        "Analyzing literature through approaches helps readers:",
        [
          "understand deeper meanings",
          "memorize the text",
          "skip reading",
          "change the ending",
        ],
        0,
        "Each lens reveals different meanings.",
      ),
    ],
    // 7 Speech Writing and Delivery
    [
      item(
        "Before writing a speech, first identify your:",
        ["purpose and audience", "costume", "microphone", "applause"],
        0,
        "Purpose and audience shape the content.",
      ),
      item(
        "Which is a good attention-getter?",
        [
          "A surprising fact or question",
          "Reading your outline",
          "Apologizing",
          "Long silence",
        ],
        0,
        "It hooks the audience.",
      ),
      item(
        "Eye contact helps a speaker:",
        [
          "connect with the audience",
          "forget the speech",
          "speak faster",
          "avoid questions",
        ],
        0,
        "It builds trust and engagement.",
      ),
      item(
        "Varying pitch and pace makes a speech:",
        ["more engaging", "harder to hear", "shorter", "formal only"],
        0,
        "Variety keeps listeners interested.",
      ),
      item(
        "An informative speech mainly aims to:",
        [
          "teach or explain",
          "entertain only",
          "sell a product",
          "attack someone",
        ],
        0,
        "It gives the audience knowledge.",
      ),
    ],
    // 8 Formal and Informal Language
    [
      item(
        "Which is formal?",
        [
          "I would like to request a meeting.",
          "Gonna meet ya later!",
          "Sup?",
          "BRB",
        ],
        0,
        "Formal language is polite and complete.",
      ),
      item(
        "Formal language is used in:",
        [
          "official letters and reports",
          "chats with friends",
          "jokes",
          "text messages to family",
        ],
        0,
        "Official writing needs formal register.",
      ),
      item(
        "The 'complimentary close' of a letter is:",
        ["Respectfully yours,", "Dear Sir:", "the date", "the address"],
        0,
        "It comes before the signature.",
      ),
      item(
        "Which salutation suits a letter to your principal?",
        ["Dear Ma'am:", "Hey!", "Yo Principal,", "Hi bestie,"],
        0,
        "A respectful salutation fits formal letters.",
      ),
      item(
        "Choosing language for the situation is called using the right:",
        ["register", "rhyme", "plot", "meter"],
        0,
        "Register is the level of formality.",
      ),
    ],
  ],
  AP: [
    // 1 Mga Suliraning Pangkapaligiran
    [
      item(
        "Ano ang pangunahing sanhi ng climate change?",
        [
          "Pagdami ng greenhouse gases",
          "Paglakas ng hangin",
          "Pag-ikot ng buwan",
          "Pagdami ng isda",
        ],
        0,
        "Ang fossil fuels at deforestation ay nagpaparami ng greenhouse gases.",
      ),
      item(
        "Anong batas ang tungkol sa wastong pamamahala ng basura?",
        ["RA 9003", "RA 10121", "RA 9710", "RA 11313"],
        0,
        "Ecological Solid Waste Management Act.",
      ),
      item(
        "Ano ang MRF?",
        [
          "Materials Recovery Facility",
          "Mobile Rescue Force",
          "Main Road Fund",
          "Marine Research Facility",
        ],
        0,
        "Lugar ito ng paghihiwalay at pag-recycle ng basura.",
      ),
      item(
        "Alin ang epekto ng climate change sa Pilipinas?",
        [
          "Mas malalakas na bagyo",
          "Pagdami ng snow",
          "Pagkawala ng araw",
          "Paglamig ng dagat",
        ],
        0,
        "Lumalakas ang mga bagyo dahil sa mas mainit na karagatan.",
      ),
      item(
        "Ano ang maitutulong ng mag-aaral sa suliranin sa basura?",
        [
          "Paghihiwalay ng nabubulok at di-nabubulok",
          "Pagsusunog ng plastik",
          "Pagtatapon sa ilog",
          "Pagbili ng mas maraming plastik",
        ],
        0,
        "Ang segregation ay itinatakda ng RA 9003.",
      ),
    ],
    // 2 DRRM
    [
      item(
        "Bakit madalas tamaan ng kalamidad ang Pilipinas?",
        [
          "Nasa Pacific Ring of Fire at daanan ng bagyo",
          "Malayo sa dagat",
          "Walang bundok",
          "Malamig ang klima",
        ],
        0,
        "Ang lokasyon nito ang dahilan.",
      ),
      item(
        "Anong batas ang tungkol sa DRRM?",
        ["RA 10121", "RA 9003", "RA 9710", "RA 7610"],
        0,
        "Philippine DRRM Act of 2010.",
      ),
      item(
        "Alin ang dapat laman ng go bag?",
        [
          "Tubig, pagkain, flashlight at first aid kit",
          "Laruan lamang",
          "Mabibigat na appliances",
          "Walang laman",
        ],
        0,
        "Mga pangunahing pangangailangan sa loob ng 72 oras.",
      ),
      item(
        "Ang unang yugto ng community-based DRRM ay:",
        ["Hazard assessment", "Rehabilitasyon", "Pagtugon", "Pagdiriwang"],
        0,
        "Tinutukoy muna ang mga panganib.",
      ),
      item(
        "Ano ang gagawin habang may lindol?",
        [
          "Duck, cover and hold",
          "Tumakbo sa hagdan",
          "Sumilong sa ilalim ng puno",
          "Gumamit ng elevator",
        ],
        0,
        "Ito ang tamang gawin habang yumayanig.",
      ),
    ],
    // 3 Globalisasyon
    [
      item(
        "Ano ang globalisasyon?",
        [
          "Mabilis na daloy ng produkto, ideya at tao sa iba't ibang bansa",
          "Pagsasara ng hangganan",
          "Pag-iwas sa kalakalan",
          "Pagbabawal sa internet",
        ],
        0,
        "Dulot ito ng teknolohiya at kalakalan.",
      ),
      item(
        "Alin ang halimbawa ng globalisasyong kultural?",
        [
          "Pagkahilig sa K-pop",
          "Pagtatanim ng palay",
          "Pangingisda",
          "Paglalaba",
        ],
        0,
        "Lumalaganap ang kultura ng ibang bansa.",
      ),
      item(
        "Ano ang papel ng teknolohiya sa globalisasyon?",
        [
          "Pinabibilis ang komunikasyon at kalakalan",
          "Pinababagal ang kalakalan",
          "Walang epekto",
          "Pinipigil ang palitan",
        ],
        0,
        "Ang internet ay nag-uugnay sa mundo.",
      ),
      item(
        "Alin ang di-mabuting epekto ng globalisasyon?",
        [
          "Kompetisyon sa lokal na industriya",
          "Mas maraming produkto",
          "Mas mabilis na komunikasyon",
          "Bagong trabaho",
        ],
        0,
        "Nahihirapan ang maliliit na lokal na negosyo.",
      ),
      item(
        "Ang multinational corporation ay:",
        [
          "kompanyang may operasyon sa maraming bansa",
          "maliit na tindahan",
          "ahensiya ng gobyerno",
          "paaralan",
        ],
        0,
        "Halimbawa nito ang mga pandaigdigang tatak.",
      ),
    ],
    // 4 Paggawa at Migrasyon
    [
      item(
        "Ano ang kontraktuwalisasyon o 'endo'?",
        [
          "Paulit-ulit na maikling kontrata nang walang regularisasyon",
          "Permanenteng trabaho",
          "Pagreretiro",
          "Pag-aaral",
        ],
        0,
        "Hindi nagiging regular ang manggagawa.",
      ),
      item(
        "Ano ang 'remittance'?",
        [
          "Perang ipinadadala ng OFW sa pamilya",
          "Buwis ng gobyerno",
          "Utang sa bangko",
          "Sahod ng guro",
        ],
        0,
        "Malaki ang ambag nito sa ekonomiya.",
      ),
      item(
        "Alin ang 'pull factor' ng migrasyon?",
        [
          "Mas mataas na sahod sa ibang bansa",
          "Kawalan ng trabaho sa sariling bayan",
          "Kalamidad",
          "Kaguluhan",
        ],
        0,
        "Ito ang humihila sa tao papunta sa ibang bansa.",
      ),
      item(
        "Alin ang 'push factor' ng migrasyon?",
        [
          "Kawalan ng trabaho sa sariling bansa",
          "Magandang klima sa ibang bansa",
          "Mataas na sahod sa ibang bansa",
          "Libreng pabahay sa ibang bansa",
        ],
        0,
        "Ito ang nagtutulak sa tao na umalis.",
      ),
      item(
        "Ano ang epekto ng migrasyon sa pamilya?",
        [
          "Pagkakalayo ng magulang at anak",
          "Laging magkasama ang pamilya",
          "Walang epekto",
          "Pagbaba ng kita",
        ],
        0,
        "May emosyonal na epekto ang pagkakalayo.",
      ),
    ],
    // 5 Mga Isyu sa Kasarian
    [
      item(
        "Ano ang pagkakaiba ng sex at gender?",
        [
          "Ang sex ay biyolohikal; ang gender ay itinakda ng lipunan",
          "Pareho sila",
          "Ang gender ay biyolohikal",
          "Walang kaugnayan sa lipunan ang gender",
        ],
        0,
        "Ang gender ay mga papel na itinakda ng lipunan.",
      ),
      item(
        "Anong batas ang Magna Carta of Women?",
        ["RA 9710", "RA 11313", "RA 9003", "RA 10121"],
        0,
        "RA 9710 ay nagtatanggol sa karapatan ng kababaihan.",
      ),
      item(
        "Anong batas ang Safe Spaces Act?",
        ["RA 11313", "RA 9710", "RA 7877", "RA 8353"],
        0,
        "Nilalabanan nito ang panliligalig sa pampublikong lugar.",
      ),
      item(
        "Ang gender role ay:",
        [
          "gawaing inaasahan ng lipunan sa babae o lalaki",
          "kulay ng damit",
          "pangalan",
          "edad",
        ],
        0,
        "Itinatakda ito ng kultura at lipunan.",
      ),
      item(
        "Paano maipapakita ang paggalang sa lahat ng kasarian?",
        [
          "Pantay na pakikitungo at pag-iwas sa panunukso",
          "Panlalait",
          "Pag-iwas sa kanila",
          "Pagbibiro tungkol sa kasarian",
        ],
        0,
        "Ang paggalang ay pantay na pagtrato.",
      ),
    ],
    // 6 Karapatang Pantao
    [
      item(
        "Kailan pinagtibay ang Universal Declaration of Human Rights?",
        ["1948", "1898", "1987", "2001"],
        0,
        "Pinagtibay ito ng UN noong 1948.",
      ),
      item(
        "Saan matatagpuan ang Bill of Rights sa Saligang Batas ng 1987?",
        ["Artikulo III", "Artikulo I", "Artikulo VII", "Artikulo XIV"],
        0,
        "Artikulo III ang Bill of Rights.",
      ),
      item(
        "Alin ang karapatang pantao?",
        [
          "Karapatan sa buhay at edukasyon",
          "Karapatang manakit",
          "Karapatang hindi magbayad ng utang",
          "Karapatang mandaya",
        ],
        0,
        "Ang buhay at edukasyon ay likas na karapatan.",
      ),
      item(
        "Ang 'due process' ay karapatan sa:",
        [
          "patas na proseso ng batas",
          "libreng pagkain",
          "pagboto lamang",
          "paglalakbay sa ibang bansa",
        ],
        0,
        "Walang mapaparusahan nang walang patas na paglilitis.",
      ),
      item(
        "Aling ahensiya ang nagbabantay sa karapatang pantao sa Pilipinas?",
        ["Commission on Human Rights", "COMELEC", "DepEd", "BIR"],
        0,
        "Ang CHR ang nag-iimbestiga ng paglabag.",
      ),
    ],
    // 7 Pagkamamamayan
    [
      item(
        "Ano ang jus sanguinis?",
        [
          "Pagkamamamayan batay sa dugo o magulang",
          "Batay sa lugar ng kapanganakan",
          "Batay sa yaman",
          "Batay sa edad",
        ],
        0,
        "Ito ang sinusunod ng Pilipinas.",
      ),
      item(
        "Ano ang jus soli?",
        [
          "Pagkamamamayan batay sa lugar ng kapanganakan",
          "Batay sa magulang",
          "Batay sa relihiyon",
          "Batay sa trabaho",
        ],
        0,
        "Sinusunod ito ng ilang bansa tulad ng USA.",
      ),
      item(
        "Alin ang tungkulin ng mamamayan?",
        [
          "Sumunod sa batas at magbayad ng buwis",
          "Lumabag sa batas",
          "Umiwas sa pagboto",
          "Sirain ang ari-arian ng bayan",
        ],
        0,
        "Bahagi ito ng pagiging mabuting mamamayan.",
      ),
      item(
        "Ang aktibong mamamayan ay:",
        [
          "nakikilahok sa gawain ng pamayanan",
          "walang pakialam",
          "laging nagrereklamo lamang",
          "umiiwas sa tungkulin",
        ],
        0,
        "Siya ay tumutulong at nakikilahok.",
      ),
      item(
        "Sa anong edad maaaring bumoto sa pambansang halalan sa Pilipinas?",
        ["18", "15", "21", "16"],
        0,
        "Labingwalong taong gulang pataas.",
      ),
    ],
    // 8 Pakikilahok at Mabuting Pamamahala
    [
      item(
        "Ano ang plebisito?",
        [
          "Pagboto ng mamamayan sa isang panukala o pagbabago sa batas",
          "Uri ng buwis",
          "Pagpupulong ng pamilya",
          "Paligsahan",
        ],
        0,
        "Direktang pinagpapasyahan ito ng mamamayan.",
      ),
      item(
        "Ano ang SK?",
        [
          "Sangguniang Kabataan",
          "Samahang Kalakal",
          "Sangay ng Kalusugan",
          "Serbisyong Kultural",
        ],
        0,
        "Ito ang konseho ng kabataan sa barangay.",
      ),
      item(
        "Ang 'accountability' ay nangangahulugang:",
        [
          "pananagutan ng opisyal sa kanyang gawain",
          "pagtatago ng impormasyon",
          "pagliban sa trabaho",
          "pagbibigay ng regalo",
        ],
        0,
        "Dapat managot ang opisyal sa publiko.",
      ),
      item(
        "Ang 'transparency' sa pamahalaan ay:",
        [
          "bukas na pagbabahagi ng impormasyon sa publiko",
          "paglilihim",
          "pagtaas ng buwis",
          "pagsasara ng tanggapan",
        ],
        0,
        "Nakikita ng publiko ang mga desisyon.",
      ),
      item(
        "Paano malalabanan ang korapsyon?",
        [
          "Pagbabantay at pakikilahok ng mamamayan",
          "Pagwawalang-bahala",
          "Pagbibigay ng lagay",
          "Pagtatago ng ebidensya",
        ],
        0,
        "Ang aktibong mamamayan ay nagbabantay sa pamahalaan.",
      ),
    ],
  ],
};
