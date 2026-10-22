/**
 * Grade 10 curriculum for the demo school: the five core subjects with their
 * units, following the DepEd Grade 10 learning competencies by quarter.
 *
 * Each lesson gets a short reading and a self-check, so a student opening a
 * unit always has something to read and questions to answer. Science unit 4
 * is the exception: its lessons are written out in full in seed.ts (video,
 * lab protocol, timed assessment), so it is listed here without lessons.
 */

export type DemoLesson = {
  title: string;
  summary: string;
  reading: string;
  questions: string[];
};

export type DemoUnit = {
  title: string;
  description: string;
  lessons: DemoLesson[];
};

export type DemoSubject = {
  key: "MATH" | "SCI" | "FIL" | "ENG" | "AP";
  code: string;
  name: string;
  department: string;
  description: string;
  colorToken: string;
  units: DemoUnit[];
};

const lesson = (
  title: string,
  summary: string,
  reading: string,
  questions: string[],
): DemoLesson => ({ title, summary, reading, questions });

export const GRADE10_SUBJECTS: DemoSubject[] = [
  {
    key: "MATH",
    code: "MATH 10",
    name: "Mathematics 10",
    department: "Mathematics",
    description:
      "Sequences, polynomials, circles, coordinate geometry, combinatorics, probability and statistics.",
    colorToken: "indigo",
    units: [
      {
        title: "Arithmetic Sequences and Series",
        description: "Patterns, the nth term, arithmetic means and sums.",
        lessons: [
          lesson(
            "Generating Patterns",
            "Finding the next terms and the rule of a sequence.",
            "A sequence is a list of numbers that follow a rule. In an arithmetic sequence each term is found by adding the same number, the common difference d, to the term before it: 3, 7, 11, 15, … has d = 4.",
            [
              "What is the common difference of 5, 12, 19, 26, …?",
              "Give the next three terms of 40, 34, 28, …",
              "Is 2, 4, 8, 16, … arithmetic? Explain.",
            ],
          ),
          lesson(
            "The nth Term and Arithmetic Series",
            "Using aₙ = a₁ + (n − 1)d and Sₙ = n/2 (a₁ + aₙ).",
            "The nth term of an arithmetic sequence is aₙ = a₁ + (n − 1)d. The sum of the first n terms is Sₙ = n/2 (a₁ + aₙ). Example: the sum of the first 20 positive odd numbers is 20/2 (1 + 39) = 400.",
            [
              "Find the 25th term of 4, 9, 14, …",
              "Insert three arithmetic means between 6 and 26.",
              "Find the sum of the first 30 terms of 2, 5, 8, …",
            ],
          ),
        ],
      },
      {
        title: "Geometric Sequences and Series",
        description: "Common ratio, geometric means, finite and infinite sums.",
        lessons: [
          lesson(
            "Geometric Sequences",
            "Multiplying by a common ratio r.",
            "In a geometric sequence each term is the previous term multiplied by the common ratio r. The nth term is aₙ = a₁ · rⁿ⁻¹. Example: 3, 6, 12, 24, … has r = 2.",
            [
              "Find r for 81, 27, 9, …",
              "Find the 7th term of 2, 6, 18, …",
              "Insert two geometric means between 5 and 135.",
            ],
          ),
          lesson(
            "Geometric Series",
            "Finite sums and sums to infinity.",
            "The sum of the first n terms is Sₙ = a₁(1 − rⁿ)/(1 − r) for r ≠ 1. When |r| < 1 the infinite series has the sum S = a₁/(1 − r).",
            [
              "Find the sum of the first 6 terms of 1, 3, 9, …",
              "Find the sum to infinity of 12, 6, 3, …",
            ],
          ),
        ],
      },
      {
        title: "Polynomials and Polynomial Division",
        description:
          "Long and synthetic division, the Remainder and Factor Theorems.",
        lessons: [
          lesson(
            "Dividing Polynomials",
            "Long division and synthetic division.",
            "Polynomials can be divided like whole numbers. Synthetic division is a shortcut when the divisor is of the form x − c: write the coefficients, bring down, multiply by c and add.",
            [
              "Divide x³ − 2x² + 4x − 8 by x − 2 using synthetic division.",
              "What is the quotient of (2x² + 7x + 3) ÷ (x + 3)?",
            ],
          ),
          lesson(
            "Remainder and Factor Theorems",
            "P(c) is the remainder; x − c is a factor when P(c) = 0.",
            "Remainder Theorem: when P(x) is divided by x − c, the remainder is P(c). Factor Theorem: x − c is a factor of P(x) exactly when P(c) = 0.",
            [
              "Find the remainder when x³ + 4x − 5 is divided by x − 1.",
              "Is x + 2 a factor of x³ + 8? Show why.",
            ],
          ),
        ],
      },
      {
        title: "Polynomial Equations and Functions",
        description:
          "Roots of polynomial equations and graphs of polynomial functions.",
        lessons: [
          lesson(
            "Polynomial Equations",
            "Finding the roots with the Rational Root Theorem.",
            "A polynomial equation of degree n has at most n real roots. The Rational Root Theorem lists the possible rational roots as ± (factors of the constant term)/(factors of the leading coefficient).",
            [
              "Solve x³ − 6x² + 11x − 6 = 0.",
              "List the possible rational roots of 2x³ + x² − 7x − 6 = 0.",
            ],
          ),
          lesson(
            "Graphs of Polynomial Functions",
            "Leading coefficient test, intercepts and turning points.",
            "The degree and leading coefficient decide the end behavior of the graph. The x-intercepts are the real zeros, and a zero of even multiplicity touches the axis instead of crossing it.",
            [
              "Describe the end behavior of y = −2x⁴ + x − 1.",
              "Sketch y = (x − 1)²(x + 2) and label its intercepts.",
            ],
          ),
        ],
      },
      {
        title: "Circles: Arcs, Chords and Angles",
        description:
          "Central and inscribed angles, arcs, chords, tangents and secants.",
        lessons: [
          lesson(
            "Arcs and Central Angles",
            "Minor and major arcs, arc measure and arc length.",
            "A central angle has its vertex at the center of the circle; its measure equals the measure of its intercepted arc. Arc length = (θ/360°) · 2πr.",
            [
              "A central angle measures 72°. What is the measure of its arc?",
              "Find the length of a 90° arc in a circle of radius 14 cm.",
            ],
          ),
          lesson(
            "Inscribed Angles, Tangents and Secants",
            "Angle relationships inside and outside a circle.",
            "An inscribed angle is half the measure of its intercepted arc. A tangent is perpendicular to the radius at the point of tangency.",
            [
              "An inscribed angle intercepts a 110° arc. Find the angle.",
              "Why is an angle inscribed in a semicircle always 90°?",
            ],
          ),
        ],
      },
      {
        title: "Coordinate Geometry",
        description:
          "Distance and midpoint formulas and the equation of a circle.",
        lessons: [
          lesson(
            "Distance and Midpoint",
            "Proving geometric properties with coordinates.",
            "Distance: d = √((x₂ − x₁)² + (y₂ − y₁)²). Midpoint: ((x₁ + x₂)/2, (y₁ + y₂)/2).",
            [
              "Find the distance between (2, −1) and (8, 7).",
              "Find the midpoint of the segment joining (−4, 6) and (10, 2).",
            ],
          ),
          lesson(
            "Equation of a Circle",
            "Standard form (x − h)² + (y − k)² = r².",
            "A circle with center (h, k) and radius r has the equation (x − h)² + (y − k)² = r². Completing the square turns the general form into standard form.",
            [
              "Write the equation of the circle with center (3, −2) and radius 5.",
              "Find the center and radius of x² + y² − 6x + 4y − 12 = 0.",
            ],
          ),
        ],
      },
      {
        title: "Permutations and Combinations",
        description: "Counting arrangements and selections.",
        lessons: [
          lesson(
            "Permutations",
            "Arrangements where order matters.",
            "The number of permutations of n objects taken r at a time is P(n, r) = n!/(n − r)!. Circular arrangements of n objects: (n − 1)!.",
            [
              "How many ways can 4 students be seated in a row of 4 chairs?",
              "How many 3-digit codes can be made from 1–9 with no repetition?",
            ],
          ),
          lesson(
            "Combinations",
            "Selections where order does not matter.",
            "The number of combinations of n objects taken r at a time is C(n, r) = n!/(r!(n − r)!).",
            [
              "How many ways can a committee of 3 be chosen from 10 students?",
              "Explain the difference between a permutation and a combination.",
            ],
          ),
        ],
      },
      {
        title: "Probability and Measures of Position",
        description: "Compound events, quartiles, deciles and percentiles.",
        lessons: [
          lesson(
            "Probability of Compound Events",
            "Union, intersection, independent and dependent events.",
            "P(A or B) = P(A) + P(B) − P(A and B). For independent events, P(A and B) = P(A) · P(B).",
            [
              "A die is rolled. Find P(even or greater than 4).",
              "Two coins are tossed. Find P(both heads).",
            ],
          ),
          lesson(
            "Quartiles, Deciles and Percentiles",
            "Locating positions in a data set.",
            "Quartiles divide ordered data into 4 equal parts, deciles into 10 and percentiles into 100. For ungrouped data, the position of Qₖ is k(n + 1)/4.",
            [
              "Find Q₁ and Q₃ of 4, 7, 9, 10, 12, 15, 18, 20.",
              "What does it mean to score at the 85th percentile?",
            ],
          ),
        ],
      },
    ],
  },
  {
    key: "SCI",
    code: "SCI 10",
    name: "Science 10",
    department: "Science",
    description:
      "Earth and space, force and energy, living things and their environment, and matter.",
    colorToken: "emerald",
    units: [
      {
        title: "Plate Tectonics",
        description:
          "Earthquakes, volcanoes and the movement of lithospheric plates.",
        lessons: [
          lesson(
            "Distribution of Volcanoes and Earthquakes",
            "Why the Philippines sits on the Pacific Ring of Fire.",
            "Most earthquakes, volcanoes and mountain ranges are found along plate boundaries. The Philippines lies on the Pacific Ring of Fire, where the Philippine Sea Plate and the Eurasian Plate meet.",
            [
              "What is the Ring of Fire?",
              "Name two active Philippine volcanoes.",
            ],
          ),
          lesson(
            "Plate Boundaries",
            "Divergent, convergent and transform boundaries.",
            "At divergent boundaries plates move apart; at convergent boundaries they collide and one may subduct; at transform boundaries they slide past each other.",
            [
              "What landform forms where an oceanic plate subducts under a continental plate?",
              "Give an example of a transform fault.",
            ],
          ),
        ],
      },
      {
        title: "Electromagnetic Spectrum",
        description: "Properties and uses of electromagnetic waves.",
        lessons: [
          lesson(
            "Electromagnetic Waves",
            "From radio waves to gamma rays.",
            "Electromagnetic waves travel at 3 × 10⁸ m/s in a vacuum. In order of increasing frequency: radio, microwave, infrared, visible light, ultraviolet, X-rays and gamma rays.",
            [
              "Which EM wave has the longest wavelength?",
              "Give one practical use of infrared radiation.",
            ],
          ),
          lesson(
            "Effects of EM Radiation",
            "Benefits and hazards to living things.",
            "Higher-frequency radiation carries more energy. Ultraviolet causes sunburn, and X-rays and gamma rays can damage cells, so exposure must be limited.",
            [
              "Why should X-ray exposure be limited?",
              "How can you protect yourself from UV radiation?",
            ],
          ),
        ],
      },
      {
        title: "Light: Mirrors and Lenses",
        description: "Reflection, refraction and image formation.",
        lessons: [
          lesson(
            "Images in Mirrors",
            "Plane, concave and convex mirrors.",
            "Plane mirrors form upright, virtual images the same size as the object. Concave mirrors can form real or virtual images; convex mirrors always form smaller, upright, virtual images.",
            [
              "Why are convex mirrors used as side mirrors on vehicles?",
              "Describe the image formed by a plane mirror.",
            ],
          ),
          lesson(
            "Lenses",
            "Converging and diverging lenses.",
            "A convex (converging) lens brings light rays together at a focal point. A concave (diverging) lens spreads them apart. The lens equation is 1/f = 1/dₒ + 1/dᵢ.",
            [
              "What kind of lens corrects farsightedness?",
              "An object is 30 cm from a lens with f = 10 cm. Where is the image?",
            ],
          ),
        ],
      },
      {
        title: "Biomolecules and Cellular Energy",
        description:
          "Carbohydrates, lipids, proteins and nucleic acids, and how cells release energy from glucose.",
        lessons: [],
      },
      {
        title: "Electricity and Magnetism",
        description: "Electromagnetic induction, motors and generators.",
        lessons: [
          lesson(
            "Magnetic Fields from Currents",
            "Oersted's discovery and electromagnets.",
            "An electric current produces a magnetic field around the wire. Coiling the wire around an iron core makes an electromagnet whose strength grows with current and number of turns.",
            [
              "How can you make an electromagnet stronger?",
              "Give two uses of electromagnets.",
            ],
          ),
          lesson(
            "Motors and Generators",
            "Turning electricity into motion and back.",
            "A motor converts electrical energy into mechanical energy. A generator does the reverse, using electromagnetic induction: a changing magnetic field induces a current in a coil.",
            [
              "What energy conversion happens in a generator?",
              "Why does moving a magnet inside a coil produce current?",
            ],
          ),
        ],
      },
      {
        title: "Reproductive, Endocrine and Nervous Systems",
        description:
          "Hormones, feedback mechanisms and coordination in the body.",
        lessons: [
          lesson(
            "Hormones and Reproduction",
            "The menstrual cycle and the role of hormones.",
            "Hormones such as FSH, LH, estrogen and progesterone regulate the menstrual cycle. Testosterone controls male reproductive development.",
            [
              "Which hormone triggers ovulation?",
              "What is the role of progesterone?",
            ],
          ),
          lesson(
            "Feedback Mechanisms",
            "How the body maintains homeostasis.",
            "Negative feedback reverses a change (for example, insulin lowers high blood sugar). Positive feedback amplifies a change (for example, oxytocin during childbirth).",
            [
              "Give one example of negative feedback.",
              "Which glands work with the nervous system to keep homeostasis?",
            ],
          ),
        ],
      },
      {
        title: "Heredity: Inheritance and Variation",
        description: "DNA, RNA, protein synthesis and mutations.",
        lessons: [
          lesson(
            "DNA and RNA",
            "Structure and replication of genetic material.",
            "DNA is a double helix of nucleotides with bases A, T, G and C; A pairs with T and G with C. RNA is single-stranded and uses U instead of T.",
            [
              "Write the complementary strand of ATG-CCA-TTG.",
              "Give two differences between DNA and RNA.",
            ],
          ),
          lesson(
            "Protein Synthesis and Mutation",
            "Transcription, translation and changes in DNA.",
            "In transcription, DNA is copied into mRNA. In translation, ribosomes read mRNA codons to build a protein. A mutation is a change in the DNA sequence.",
            [
              "Where does translation take place?",
              "How can a mutation affect a protein?",
            ],
          ),
        ],
      },
      {
        title: "Biodiversity and Evolution",
        description: "Evidence of evolution and natural selection.",
        lessons: [
          lesson(
            "Evidence of Evolution",
            "Fossils, homologous structures and DNA.",
            "Fossils, homologous structures, embryology and DNA comparisons all show that living things share common ancestors.",
            [
              "What are homologous structures? Give an example.",
              "How do fossils support evolution?",
            ],
          ),
          lesson(
            "Natural Selection",
            "Darwin's theory and adaptation.",
            "Individuals with traits that suit their environment survive and reproduce more, so those traits become more common over generations.",
            [
              "Explain natural selection in your own words.",
              "Why are some bacteria now resistant to antibiotics?",
            ],
          ),
        ],
      },
      {
        title: "Gas Laws",
        description:
          "Boyle's, Charles's, Gay-Lussac's and the combined gas law.",
        lessons: [
          lesson(
            "Boyle's and Charles's Laws",
            "Pressure, volume and temperature relationships.",
            "Boyle's Law: at constant temperature, P₁V₁ = P₂V₂. Charles's Law: at constant pressure, V₁/T₁ = V₂/T₂, with temperature in kelvin.",
            [
              "A gas at 2 atm occupies 6 L. What is its volume at 3 atm?",
              "Why must temperature be in kelvin in Charles's Law?",
            ],
          ),
          lesson(
            "Combined and Ideal Gas Laws",
            "PV = nRT.",
            "The combined gas law is P₁V₁/T₁ = P₂V₂/T₂. The ideal gas law PV = nRT relates pressure, volume, moles and temperature.",
            [
              "Find the volume of 1 mol of gas at STP.",
              "What does R stand for in PV = nRT?",
            ],
          ),
        ],
      },
      {
        title: "Chemical Reactions",
        description:
          "Balancing equations, types of reactions and reaction rates.",
        lessons: [
          lesson(
            "Balancing Chemical Equations",
            "The Law of Conservation of Mass.",
            "Atoms are neither created nor destroyed in a reaction, so both sides of a chemical equation must have the same number of each atom.",
            ["Balance: H₂ + O₂ → H₂O.", "Balance: Fe + O₂ → Fe₂O₃."],
          ),
          lesson(
            "Factors Affecting Reaction Rate",
            "Temperature, concentration, surface area and catalysts.",
            "Reactions go faster at higher temperature, higher concentration, larger surface area, or with a catalyst.",
            [
              "Why does food spoil faster outside the refrigerator?",
              "What does a catalyst do?",
            ],
          ),
        ],
      },
    ],
  },
  {
    key: "FIL",
    code: "FIL 10",
    name: "Filipino 10",
    department: "Filipino",
    description:
      "Panitikang pandaigdig: Mediterranean, Kanluranin, Africa at Persia, at ang El Filibusterismo.",
    colorToken: "rose",
    units: [
      {
        title: "Mitolohiya ng Mediterranean",
        description: "Mga diyos at diyosa ng Greece at Rome.",
        lessons: [
          lesson(
            "Cupid at Psyche",
            "Isang mitolohiya mula sa Rome.",
            "Ang mitolohiya ay mga kuwento tungkol sa mga diyos at diyosa na nagpapaliwanag ng mga pangyayari sa daigdig. Sa 'Cupid at Psyche', sinubok ang tiwala at pag-ibig ni Psyche.",
            [
              "Ano ang naging pagsubok ni Psyche?",
              "Anong aral ang makukuha sa mitolohiya?",
            ],
          ),
          lesson(
            "Pokus ng Pandiwa: Tagaganap at Layon",
            "Gramatika sa pagsasalaysay.",
            "Nasa pokus na tagaganap ang pandiwa kapag ang paksa ang gumagawa ng kilos (hal. Nagbasa si Ana ng aklat). Nasa pokus na layon kapag ang paksa ang tumatanggap ng kilos (hal. Binasa ni Ana ang aklat).",
            [
              "Tukuyin ang pokus: 'Isinulat ni Jose ang liham.'",
              "Gumawa ng pangungusap na nasa pokus na tagaganap.",
            ],
          ),
        ],
      },
      {
        title: "Parabula at Sanaysay",
        description: "Mga aral mula sa parabula at sanaysay ng Mediterranean.",
        lessons: [
          lesson(
            "Ang Parabula ng Banga",
            "Pag-unawa sa simbolismo ng parabula.",
            "Ang parabula ay maikling kuwentong may aral na kadalasang hango sa Bibliya. Gumagamit ito ng mga simbolo upang ipahayag ang mensahe.",
            [
              "Ano ang sinisimbolo ng banga?",
              "Iugnay ang aral ng parabula sa iyong buhay.",
            ],
          ),
          lesson(
            "Sanaysay: Alegorya ng Yungib",
            "Pagsusuri ng sanaysay ni Plato.",
            "Ang sanaysay ay akdang naglalahad ng kuro-kuro ng may-akda. Sa 'Alegorya ng Yungib', ipinakita ni Plato ang kahalagahan ng edukasyon at katotohanan.",
            [
              "Ano ang kinakatawan ng yungib?",
              "Bakit mahalaga ang edukasyon ayon sa sanaysay?",
            ],
          ),
        ],
      },
      {
        title: "Epiko at Nobela ng Mediterranean",
        description: "Ang mga bayani at tauhan sa epiko at nobela.",
        lessons: [
          lesson(
            "Epiko: Ang Iliad at Odyssey",
            "Mga katangian ng epikong bayani.",
            "Ang epiko ay mahabang tulang pasalaysay tungkol sa kabayanihan ng pangunahing tauhan na may kakaibang lakas at kapangyarihan.",
            [
              "Ano ang mga katangian ni Odysseus bilang bayani?",
              "Paano naiiba ang epiko sa maikling kuwento?",
            ],
          ),
          lesson(
            "Nobela: Ang Kuba ng Notre Dame",
            "Pagsusuri ng tauhan at tagpuan.",
            "Ang nobela ay mahabang akdang piksiyon na may maraming tauhan at kabanata. Sa 'Ang Kuba ng Notre Dame', ipinakita ang pagtanggap sa kapwa sa kabila ng kaanyuan.",
            [
              "Ilarawan si Quasimodo.",
              "Anong isyung panlipunan ang makikita sa nobela?",
            ],
          ),
        ],
      },
      {
        title: "Panitikang Kanluranin: Anekdota at Tula",
        description: "Anekdota, tula at mga elemento nito.",
        lessons: [
          lesson(
            "Anekdota",
            "Maikling salaysay ng isang tunay na pangyayari.",
            "Ang anekdota ay maikling kuwento ng isang kawili-wili o nakatutuwang pangyayari sa buhay ng isang tao, na may aral o mensahe.",
            [
              "Ano ang layunin ng anekdota?",
              "Magbahagi ng isang anekdota mula sa iyong karanasan.",
            ],
          ),
          lesson(
            "Mga Elemento ng Tula",
            "Sukat, tugma, talinghaga at tono.",
            "Ang tula ay may sukat (bilang ng pantig), tugma (pagkakatulad ng tunog sa dulo), talinghaga at tono na nagpapahayag ng damdamin.",
            [
              "Ano ang pagkakaiba ng sukat at tugma?",
              "Sumulat ng isang saknong na may tugma.",
            ],
          ),
        ],
      },
      {
        title: "Dula at Maikling Kuwento ng Kanluranin",
        description: "Mga akda mula sa France, England at Amerika.",
        lessons: [
          lesson(
            "Dula: Romeo at Juliet",
            "Mga elemento ng dula.",
            "Ang dula ay akdang itinatanghal sa entablado. Mayroon itong tagpuan, tauhan, diyalogo at banghay.",
            [
              "Ano ang naging dahilan ng trahedya nina Romeo at Juliet?",
              "Paano naiiba ang dula sa nobela?",
            ],
          ),
          lesson(
            "Maikling Kuwento: Ang Kuwintas",
            "Pagsusuri ng banghay at tunggalian.",
            "Sa 'Ang Kuwintas' ni Guy de Maupassant, ipinakita ang epekto ng pagnanais sa karangyaan. Ang banghay ay may simula, tunggalian, kasukdulan at wakas.",
            [
              "Ano ang tunggalian sa kuwento?",
              "Ano ang aral na iniwan ng kuwento?",
            ],
          ),
        ],
      },
      {
        title: "Panitikan ng Africa at Persia",
        description: "Mitolohiya, tula at epiko ng Africa at Persia.",
        lessons: [
          lesson(
            "Mitolohiya ng Africa",
            "Mga paniniwala at kultura ng Africa.",
            "Ang mga mitolohiya ng Africa ay nagpapakita ng paggalang sa kalikasan at mga ninuno, at ipinapaliwanag ang pinagmulan ng daigdig.",
            [
              "Paano ipinakita ang kultura ng Africa sa mitolohiya?",
              "Ihambing ito sa mitolohiyang Pilipino.",
            ],
          ),
          lesson(
            "Epiko ng Persia: Rustam at Sohrab",
            "Ang trahedya ng mag-ama.",
            "Sa epikong 'Rustam at Sohrab', hindi nakilala ng mandirigmang si Rustam ang sarili niyang anak na si Sohrab hanggang sa huli.",
            [
              "Ano ang naging trahedya sa epiko?",
              "Anong pagpapahalaga ang itinuturo nito?",
            ],
          ),
        ],
      },
      {
        title: "El Filibusterismo: Kaligirang Pangkasaysayan",
        description: "Ang pagkakasulat at layunin ng nobela ni Rizal.",
        lessons: [
          lesson(
            "Ang Pagkakasulat ng El Filibusterismo",
            "Mga pangyayari sa buhay ni Rizal.",
            "Inilathala ni Jose Rizal ang El Filibusterismo noong 1891 sa Ghent, Belgium, sa tulong ni Valentin Ventura. Inialay niya ito sa tatlong paring martir na GOMBURZA.",
            [
              "Kanino inialay ni Rizal ang El Filibusterismo?",
              "Sino ang tumulong sa pagpapalimbag nito?",
            ],
          ),
          lesson(
            "Mga Unang Kabanata",
            "Sa Ibabaw ng Kubyerta.",
            "Nagsisimula ang nobela sa bapor Tabo, kung saan makikita ang iba't ibang uri ng tao sa lipunan, at ipinakilala si Simoun, ang mag-aalahas.",
            ["Ano ang sinisimbolo ng bapor Tabo?", "Sino si Simoun?"],
          ),
        ],
      },
      {
        title: "El Filibusterismo: Mga Tauhan at Aral",
        description: "Pagsusuri ng mga tauhan at mensahe ng nobela.",
        lessons: [
          lesson(
            "Mga Tauhan",
            "Simoun, Basilio, Isagani at iba pa.",
            "Si Simoun ay si Crisostomo Ibarra na nagbalik upang maghiganti. Si Basilio ay isang mag-aaral ng medisina, at si Isagani ay isang makatang may matayog na pangarap para sa bayan.",
            [
              "Paano nagbago si Ibarra bilang si Simoun?",
              "Ihambing sina Basilio at Isagani.",
            ],
          ),
          lesson(
            "Ang Aral ng Nobela",
            "Kalayaan, edukasyon at pagbabago.",
            "Ipinakita ng nobela na ang tunay na pagbabago ay hindi makakamit sa pamamagitan ng paghihiganti kundi ng edukasyon at malinis na layunin.",
            [
              "Ano ang pangunahing mensahe ng El Filibusterismo?",
              "Paano ito naiuugnay sa kasalukuyang lipunan?",
            ],
          ),
        ],
      },
    ],
  },
  {
    key: "ENG",
    code: "ENG 10",
    name: "English 10",
    department: "English",
    description:
      "World literature, reading for information, argumentation, research and public speaking.",
    colorToken: "blue",
    units: [
      {
        title: "Myths and Legends of the World",
        description: "Reading and analyzing world mythology.",
        lessons: [
          lesson(
            "Greek and Roman Myths",
            "Gods, heroes and the values they teach.",
            "Myths explain natural events and human behavior through stories of gods and heroes. The myth of Prometheus, who stole fire for humankind, shows sacrifice and defiance.",
            ["Why was Prometheus punished?", "What value does the myth teach?"],
          ),
          lesson(
            "Comparing Myths Across Cultures",
            "Creation stories from different countries.",
            "Many cultures have creation myths, from the Greek Chaos to the Philippine legend of Malakas and Maganda. Comparing them shows what each culture values.",
            [
              "Compare one Greek myth with a Philippine legend.",
              "What do creation myths have in common?",
            ],
          ),
        ],
      },
      {
        title: "Reading for Information",
        description: "Textual aids, note-taking and summarizing.",
        lessons: [
          lesson(
            "Using Textual Aids",
            "Graphs, tables, headings and illustrations.",
            "Textual aids such as headings, tables, graphs and pictures help readers understand and remember information quickly.",
            [
              "How does a graph help you understand data?",
              "List three textual aids found in your Science book.",
            ],
          ),
          lesson(
            "Note-Taking and Summarizing",
            "Getting the main idea.",
            "A good summary keeps the main idea and key details in your own words and leaves out examples and repetitions.",
            [
              "Summarize a news article in three sentences.",
              "What should a summary leave out?",
            ],
          ),
        ],
      },
      {
        title: "Evaluating Arguments",
        description: "Claims, evidence, reasoning and propaganda techniques.",
        lessons: [
          lesson(
            "Claims and Evidence",
            "Claims of fact, value and policy.",
            "A claim of fact states something that can be proven, a claim of value judges something as good or bad, and a claim of policy proposes an action.",
            [
              "Identify the type of claim: 'The school should ban single-use plastics.'",
              "What makes evidence credible?",
            ],
          ),
          lesson(
            "Propaganda Techniques",
            "Bandwagon, testimonial, name-calling and more.",
            "Advertisers and speakers use propaganda techniques such as bandwagon ('everyone is buying it') and testimonial (a celebrity endorsement) to persuade.",
            [
              "Give an example of a bandwagon advertisement.",
              "Why should readers be careful with testimonials?",
            ],
          ),
        ],
      },
      {
        title: "Writing a Persuasive Essay",
        description: "Planning, drafting and revising an argument.",
        lessons: [
          lesson(
            "Structure of an Argumentative Essay",
            "Introduction, body, counterclaim and conclusion.",
            "An argumentative essay states a clear position, supports it with reasons and evidence, answers a counterclaim and ends with a strong conclusion.",
            [
              "Write a thesis statement on a school issue.",
              "Why include a counterclaim?",
            ],
          ),
          lesson(
            "Transitional Devices",
            "Connecting ideas smoothly.",
            "Transitions such as 'furthermore', 'however', 'as a result' and 'in conclusion' show how ideas relate to each other.",
            [
              "Use 'however' in a sentence about online classes.",
              "List three transitions that show cause and effect.",
            ],
          ),
        ],
      },
      {
        title: "Research Report Writing",
        description: "Gathering, citing and presenting information.",
        lessons: [
          lesson(
            "Finding Reliable Sources",
            "Evaluating websites and references.",
            "Reliable sources have a known author, are recent, and are published by trusted organizations. Check facts in more than one source.",
            [
              "What makes a website reliable?",
              "Why should you check more than one source?",
            ],
          ),
          lesson(
            "Citing Sources",
            "Avoiding plagiarism with APA style.",
            "Citing sources gives credit to authors and lets readers find your references. APA style lists the author, year, title and source.",
            [
              "What is plagiarism?",
              "Write an APA reference for a book you have read.",
            ],
          ),
        ],
      },
      {
        title: "Literary Criticism",
        description: "Approaches to analyzing literature.",
        lessons: [
          lesson(
            "Formalist and Moralist Approaches",
            "Looking at form and at moral lessons.",
            "The formalist approach studies the text itself: plot, character, setting and language. The moralist approach asks what the text teaches about right and wrong.",
            [
              "Analyze a short story using the moralist approach.",
              "What does a formalist critic focus on?",
            ],
          ),
          lesson(
            "Feminist and Marxist Approaches",
            "Gender and social class in literature.",
            "The feminist approach examines how women are portrayed. The Marxist approach looks at power, money and social class in a text.",
            [
              "How are women portrayed in a story you have read?",
              "Give an example of class conflict in literature.",
            ],
          ),
        ],
      },
      {
        title: "Speech Writing and Delivery",
        description: "Informative and persuasive speeches.",
        lessons: [
          lesson(
            "Writing a Speech",
            "Purpose, audience and organization.",
            "A good speech has a clear purpose, suits its audience, and follows an introduction–body–conclusion structure with a memorable opening.",
            [
              "Write an attention-getting opening for a speech on climate change.",
              "Why is knowing your audience important?",
            ],
          ),
          lesson(
            "Delivering a Speech",
            "Voice, gestures and eye contact.",
            "Effective delivery uses clear pronunciation, varied pitch and pace, natural gestures and eye contact with the audience.",
            [
              "List three tips for overcoming stage fright.",
              "Why is eye contact important?",
            ],
          ),
        ],
      },
      {
        title: "Formal and Informal Language",
        description: "Choosing the right register.",
        lessons: [
          lesson(
            "Register and Context",
            "When to be formal or informal.",
            "Formal language is used in essays, reports and official letters. Informal language is used with friends and in casual messages.",
            [
              "Rewrite 'Gonna be late, sorry!' in formal English.",
              "Give two situations that need formal language.",
            ],
          ),
          lesson(
            "Writing a Formal Letter",
            "Parts and conventions.",
            "A formal letter has a heading, inside address, salutation, body, complimentary close and signature, and uses polite, direct language.",
            [
              "Write the salutation for a letter to your principal.",
              "What is the complimentary close?",
            ],
          ),
        ],
      },
    ],
  },
  {
    key: "AP",
    code: "AP 10",
    name: "Araling Panlipunan 10",
    department: "Araling Panlipunan",
    description:
      "Kontemporaryong isyu: kapaligiran, ekonomiya, kasarian, karapatang pantao at pagkamamamayan.",
    colorToken: "orange",
    units: [
      {
        title: "Mga Suliraning Pangkapaligiran",
        description: "Climate change, polusyon at pagkasira ng likas na yaman.",
        lessons: [
          lesson(
            "Climate Change",
            "Mga sanhi at epekto ng pagbabago ng klima.",
            "Ang climate change ay ang pangmatagalang pagbabago ng klima dahil sa pagdami ng greenhouse gases mula sa pagsusunog ng fossil fuels at pagputol ng kagubatan.",
            [
              "Ano ang pangunahing sanhi ng climate change?",
              "Magbigay ng dalawang epekto nito sa Pilipinas.",
            ],
          ),
          lesson(
            "Suliranin sa Solid Waste",
            "RA 9003 at wastong pamamahala ng basura.",
            "Ang Ecological Solid Waste Management Act (RA 9003) ay nag-uutos ng paghihiwalay ng basura, pag-recycle at pagkakaroon ng Materials Recovery Facility sa bawat barangay.",
            [
              "Ano ang itinatakda ng RA 9003?",
              "Paano ka makatutulong sa wastong pamamahala ng basura?",
            ],
          ),
        ],
      },
      {
        title: "Disaster Risk Reduction and Management",
        description: "Paghahanda bago, habang at pagkatapos ng kalamidad.",
        lessons: [
          lesson(
            "Mga Uri ng Kalamidad",
            "Bagyo, lindol, baha at pagputok ng bulkan.",
            "Ang Pilipinas ay madalas tamaan ng kalamidad dahil sa lokasyon nito sa Pacific Ring of Fire at sa daanan ng bagyo.",
            [
              "Bakit madalas tamaan ng kalamidad ang Pilipinas?",
              "Ano ang laman ng isang go bag?",
            ],
          ),
          lesson(
            "Community-Based DRRM",
            "RA 10121 at ang papel ng pamayanan.",
            "Sa ilalim ng RA 10121, ang bawat pamayanan ay may plano sa pagbabawas ng panganib: hazard assessment, paghahanda, pagtugon at rehabilitasyon.",
            [
              "Ano ang apat na yugto ng DRRM?",
              "Paano makatutulong ang kabataan sa DRRM?",
            ],
          ),
        ],
      },
      {
        title: "Globalisasyon",
        description: "Mga anyo at epekto ng globalisasyon.",
        lessons: [
          lesson(
            "Konsepto ng Globalisasyon",
            "Ekonomiko, teknolohikal at kultural na globalisasyon.",
            "Ang globalisasyon ay ang mabilis na pagdaloy ng produkto, serbisyo, ideya at tao sa iba't ibang bansa dahil sa teknolohiya at kalakalan.",
            [
              "Magbigay ng halimbawa ng globalisasyong kultural.",
              "Ano ang papel ng teknolohiya sa globalisasyon?",
            ],
          ),
          lesson(
            "Epekto ng Globalisasyon",
            "Mabuti at di-mabuting epekto.",
            "Nagdudulot ang globalisasyon ng mas maraming trabaho at produkto, ngunit maaari ring magdulot ng kompetisyon sa lokal na industriya at kontraktuwalisasyon.",
            [
              "Magbigay ng isang mabuti at isang di-mabuting epekto ng globalisasyon.",
              "Paano mapoprotektahan ang lokal na industriya?",
            ],
          ),
        ],
      },
      {
        title: "Paggawa at Migrasyon",
        description: "Isyu sa paggawa, unemployment at OFW.",
        lessons: [
          lesson(
            "Mga Isyu sa Paggawa",
            "Kontraktuwalisasyon at mababang sahod.",
            "Kabilang sa mga isyu sa paggawa ang kontraktuwalisasyon (endo), mababang pasahod, kawalan ng seguridad sa trabaho at unemployment.",
            [
              "Ano ang kontraktuwalisasyon?",
              "Bakit mahalaga ang seguridad sa trabaho?",
            ],
          ),
          lesson(
            "Migrasyon",
            "Mga Overseas Filipino Worker at ang epekto nito.",
            "Maraming Pilipino ang nangingibang-bansa upang maghanap ng mas magandang trabaho. Nakatutulong ang remittances sa ekonomiya, ngunit may epekto ito sa pamilya.",
            [
              "Ano ang push at pull factors ng migrasyon?",
              "Ano ang epekto ng migrasyon sa pamilyang Pilipino?",
            ],
          ),
        ],
      },
      {
        title: "Mga Isyu sa Kasarian",
        description: "Gender, sexuality at diskriminasyon.",
        lessons: [
          lesson(
            "Kasarian at Sekswalidad",
            "Sex, gender at gender roles.",
            "Ang sex ay biyolohikal na katangian, samantalang ang gender ay ang mga papel at gawaing itinakda ng lipunan sa babae at lalaki.",
            [
              "Ano ang pagkakaiba ng sex at gender?",
              "Magbigay ng halimbawa ng gender role sa inyong pamilya.",
            ],
          ),
          lesson(
            "Diskriminasyon at Karahasan",
            "Mga batas na nagtatanggol sa kababaihan at LGBTQ+.",
            "Ang Magna Carta of Women (RA 9710) at ang Safe Spaces Act (RA 11313) ay nagtatanggol laban sa diskriminasyon at panliligalig.",
            [
              "Ano ang layunin ng Safe Spaces Act?",
              "Paano mo maipapakita ang paggalang sa lahat ng kasarian?",
            ],
          ),
        ],
      },
      {
        title: "Karapatang Pantao",
        description: "Ang mga karapatan at ang pagtatanggol dito.",
        lessons: [
          lesson(
            "Ang Universal Declaration of Human Rights",
            "Mga karapatang likas sa bawat tao.",
            "Ang UDHR (1948) ay naglalahad ng mga karapatang dapat tamasahin ng lahat ng tao, gaya ng karapatan sa buhay, kalayaan at edukasyon.",
            [
              "Kailan pinagtibay ang UDHR?",
              "Magbigay ng tatlong karapatang pantao.",
            ],
          ),
          lesson(
            "Bill of Rights",
            "Artikulo III ng Saligang Batas ng 1987.",
            "Ang Bill of Rights ay nagtatanggol sa mga mamamayan laban sa pang-aabuso ng pamahalaan, kabilang ang kalayaan sa pananalita at karapatan sa due process.",
            [
              "Saang bahagi ng Saligang Batas matatagpuan ang Bill of Rights?",
              "Bakit mahalaga ang karapatan sa due process?",
            ],
          ),
        ],
      },
      {
        title: "Pagkamamamayan",
        description: "Mga katangian at tungkulin ng isang mamamayan.",
        lessons: [
          lesson(
            "Konsepto ng Pagkamamamayan",
            "Jus sanguinis at jus soli.",
            "Sinusunod ng Pilipinas ang jus sanguinis: Pilipino ang anak ng magulang na Pilipino. Ang mga mamamayan ay may karapatan at tungkulin sa bayan.",
            [
              "Ano ang jus sanguinis?",
              "Magbigay ng dalawang tungkulin ng mamamayan.",
            ],
          ),
          lesson(
            "Aktibong Mamamayan",
            "Pakikilahok sa pamayanan.",
            "Ang aktibong mamamayan ay nakikilahok sa mga gawain ng pamayanan, bumoboto nang may kaalaman at tumutulong sa kapwa.",
            [
              "Paano ka magiging aktibong mamamayan bilang mag-aaral?",
              "Bakit mahalaga ang pagboto?",
            ],
          ),
        ],
      },
      {
        title: "Pakikilahok at Mabuting Pamamahala",
        description: "Gawaing pansibiko, pulitikal at good governance.",
        lessons: [
          lesson(
            "Pakikilahok na Pulitikal",
            "Eleksyon, plebisito at people's initiative.",
            "Maaaring makilahok ang mamamayan sa pamamagitan ng pagboto, pagsali sa plebisito, people's initiative at pagbabantay sa pamahalaan.",
            ["Ano ang plebisito?", "Paano nakikilahok ang kabataan sa SK?"],
          ),
          lesson(
            "Mabuting Pamamahala",
            "Transparency, accountability at paglaban sa korapsyon.",
            "Ang mabuting pamamahala ay may transparency, accountability at pakikilahok ng mamamayan. Nilalabanan nito ang korapsyon.",
            [
              "Ano ang ibig sabihin ng accountability?",
              "Paano malalabanan ang korapsyon?",
            ],
          ),
        ],
      },
    ],
  },
];
