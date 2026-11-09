/** Unit Activities for Mathematics, Science and English. */
import { a, type UnitActivity } from "./kit";

export const CORE: Record<string, UnitActivity> = {
  // ------------------------------------------------------------- Math 10
  "Arithmetic Sequences and Series": a(
    "Savings Ladder",
    "Use an arithmetic sequence to plan real savings.",
    [
      "Pretend you save ₱10 on day 1 and add ₱5 more each day (₱10, ₱15, ₱20 …).",
      "Write the amounts for days 1 to 7 and find the common difference.",
      "Use the formula Sₙ = n/2 (a₁ + aₙ) to find your total savings after 7 days.",
    ],
    "Your 7 amounts, the common difference, and your total with the solution.",
  ),
  "Geometric Sequences and Series": a(
    "Chain Message",
    "See how fast a geometric sequence grows.",
    [
      "One person forwards a message to 3 friends, and each of them forwards it to 3 more.",
      "Write how many people get the message on rounds 1 to 5, and find the common ratio.",
      "Use Sₙ = a₁(1 − rⁿ)/(1 − r) to find the total number of people after 5 rounds.",
    ],
    "The 5 terms, the ratio, and the total with your solution.",
  ),
  "Polynomials and Polynomial Division": a(
    "Divide and Check",
    "Practice synthetic division and the Remainder Theorem.",
    [
      "Divide x³ − 2x² + 4x − 8 by (x − 2) using synthetic division.",
      "Write the quotient and the remainder.",
      "Check the remainder by substituting x = 2 into the polynomial (Remainder Theorem).",
    ],
    "Your synthetic division, the quotient and remainder, and your check.",
  ),
  "Polynomial Equations and Functions": a(
    "Find the Roots",
    "Find and check the roots of a polynomial equation.",
    [
      "Solve x³ − 6x² + 11x − 6 = 0. Hint: try x = 1 first.",
      "Use synthetic division to factor it fully and list all three roots.",
      "Pick one root and substitute it to show it makes the equation equal 0.",
    ],
    "The factors, the three roots, and your check.",
  ),
  "Circles: Arcs, Chords and Angles": a(
    "Circle Around Us",
    "Spot circle parts in everyday objects.",
    [
      "Find a round object at home or school (plate, clock, wheel) and draw it as a circle.",
      "On your drawing, label the center, a radius, a diameter, a chord and an arc.",
      "Draw a central angle of 60° and write the measure of its intercepted arc.",
    ],
    "A photo of your labeled drawing, plus the arc measure.",
  ),
  "Coordinate Geometry": a(
    "Map My Barangay",
    "Use the distance and midpoint formulas on a simple map.",
    [
      "On graph paper, plot your house at (1, 2) and your school at (7, 10).",
      "Use the distance formula to find how far apart they are (1 unit = 100 m).",
      "Find the midpoint — a good place for a waiting shed!",
    ],
    "Your graph, the distance in meters, and the midpoint with solutions.",
  ),
  "Permutations and Combinations": a(
    "Class Officers",
    "Tell permutations and combinations apart using your class.",
    [
      "From 6 classmates, how many ways can you choose a President, Vice President and Secretary? (permutation)",
      "From the same 6, how many ways can you choose a 3-member cleaning team? (combination)",
      "In one sentence, explain why the two answers are different.",
    ],
    "Both answers with solutions and your one-sentence explanation.",
  ),
  "Probability and Measures of Position": a(
    "Score Survey",
    "Find quartiles from real data.",
    [
      "List 9 quiz scores (yours and classmates', or make them up) and arrange them in order.",
      "Find Q1, Q2 (the median) and Q3.",
      "If you pick one score at random, what is the probability it is above Q3?",
    ],
    "Your ordered list, the three quartiles, and the probability.",
  ),

  // ----------------------------------------------------------- Science 10
  "Plate Tectonics": a(
    "Map the Plates",
    "Connect plate boundaries to events in the Philippines.",
    [
      "Draw a simple map of the Philippines (or print one) and mark one trench and one volcano.",
      "Name the plate boundary type (convergent, divergent or transform) near each.",
      "Write one sentence on what event each can cause (earthquake, volcano, tsunami).",
    ],
    "A photo of your map with labels and your two sentences.",
  ),
  "Electromagnetic Spectrum": a(
    "EM Waves at Home",
    "Find electromagnetic waves you use every day.",
    [
      "Look around your home and list 5 things that use EM waves (radio, cellphone, remote, microwave, light bulb …).",
      "Beside each, write which type of wave it uses.",
      "Arrange your list from the longest wavelength to the shortest.",
    ],
    "Your list of 5 with wave types, arranged by wavelength.",
  ),
  "Light: Mirrors and Lenses": a(
    "Spoon Mirror",
    "See how concave and convex mirrors form images.",
    [
      "Look at your face on the inside (concave) and the back (convex) of a shiny spoon.",
      "Write whether each image is upright or inverted, and larger or smaller.",
      "Name one real use of a concave mirror and one of a convex mirror.",
    ],
    "Your observations for both sides and the two real uses.",
  ),
  "Biomolecules and Cellular Energy": a(
    "Plate of Biomolecules",
    "Find the four biomolecules in a real meal.",
    [
      "Pick one meal you ate today (for example rice, egg, vegetables).",
      "For each food, write if it is mainly carbohydrate, protein, lipid or contains nucleic acid.",
      "Write one sentence on why your body needs carbohydrates for energy.",
    ],
    "Your meal list with biomolecules and your sentence.",
  ),
  "Electricity and Magnetism": a(
    "Magnet Hunt",
    "Find where magnets and electricity work together at home.",
    [
      "Find 3 things at home that use magnets or motors (electric fan, speaker, ref door …).",
      "For each, write what the magnet or motor does.",
      "Draw a simple electromagnet: a nail, wire coil and battery, and label the parts.",
    ],
    "Your list of 3 and a photo of your labeled drawing.",
  ),
  "Reproductive, Endocrine and Nervous Systems": a(
    "Body Messengers",
    "Compare how hormones and nerves send messages.",
    [
      "Make a two-column table: Nervous System and Endocrine System.",
      "Write 3 differences (speed, messenger, how long the effect lasts).",
      "Give one real example of each, like pulling your hand from a hot pan or growing taller.",
    ],
    "A photo or typed copy of your table with examples.",
  ),
  "Heredity: Inheritance and Variation": a(
    "Family Traits",
    "Use a Punnett square on a real trait.",
    [
      "Pick a trait like dimples (D = dimples, d = none).",
      "Make a Punnett square for two parents who are both Dd.",
      "Write the chance (in %) that a child will have dimples.",
    ],
    "Your Punnett square and the percentage with a short explanation.",
  ),
  "Biodiversity and Evolution": a(
    "Adapt to Survive",
    "Explain how adaptations help living things survive.",
    [
      "Choose 2 animals or plants found in the Philippines (tarsier, mangrove, carabao …).",
      "For each, write one adaptation and how it helps it survive.",
      "Write one way people can protect biodiversity in your area.",
    ],
    "Your two examples with adaptations and your one action.",
  ),
  "Gas Laws": a(
    "Balloon Lab",
    "Observe a gas law with a balloon or plastic bottle.",
    [
      "Blow up a balloon (or close an empty plastic bottle) and put it in the sun or near warm water for 5 minutes.",
      "Then cool it in shade or cold water. Write what happens to its size or shape.",
      "Name the gas law you observed (Charles's Law) and explain it in one sentence.",
    ],
    "Your observations and the gas law with your explanation.",
  ),
  "Chemical Reactions": a(
    "Kitchen Chemistry",
    "Spot signs of chemical reactions at home.",
    [
      "Find 3 changes at home: cooking an egg, rusting iron, burning wood, baking soda + vinegar …",
      "For each, write the sign of a reaction you see (gas, color change, heat, new substance).",
      "Say which one is the fastest and which is the slowest.",
    ],
    "Your 3 reactions with signs, and your fastest/slowest answer.",
  ),

  // ----------------------------------------------------------- English 10
  "Myths and Legends of the World": a(
    "Myth Retold",
    "Retell a myth in your own words.",
    [
      "Choose a myth or legend you know (Greek, Norse or a Philippine legend).",
      "Write a short retelling in 5 to 7 sentences: beginning, problem, ending.",
      "Add one sentence on the lesson or value the story teaches.",
    ],
    "Your 5–7 sentence retelling and the lesson.",
  ),
  "Reading for Information": a(
    "Find the Facts",
    "Pull key facts from an informational text.",
    [
      "Read any short news article, product label or school notice.",
      "Write 3 key facts from it and the main idea in one sentence.",
      "Write one question you still have after reading.",
    ],
    "The title or source, your 3 facts, the main idea and your question.",
  ),
  "Evaluating Arguments": a(
    "Fact or Opinion?",
    "Judge whether a claim is supported.",
    [
      "Find an ad, post or speech that tries to convince people.",
      "Write the claim and list the reasons or evidence given.",
      "Decide if the argument is strong or weak, and explain why in 2 sentences.",
    ],
    "The claim, its evidence and your 2-sentence judgment.",
  ),
  "Writing a Persuasive Essay": a(
    "Convince Me",
    "Write a short persuasive paragraph.",
    [
      "Choose a school issue, like longer recess or less plastic in the canteen.",
      "Write a clear position statement and 2 reasons with examples.",
      "End with a call to action.",
    ],
    "One persuasive paragraph (6–8 sentences).",
  ),
  "Research Report Writing": a(
    "Mini Research",
    "Practice the steps of a research report.",
    [
      "Pick a simple topic (for example: how much water your family uses in a day).",
      "Write a research question and gather 2 facts from a source or by observing.",
      "Write a 3-sentence conclusion and cite your source.",
    ],
    "Your question, 2 facts, conclusion and source.",
  ),
  "Literary Criticism": a(
    "Through a Lens",
    "Read a story using one critical approach.",
    [
      "Pick a story or song you like.",
      "Choose one lens: moral, feminist, Marxist or historical.",
      "Write 4 to 5 sentences explaining what the story shows through that lens.",
    ],
    "The title, the lens you used, and your 4–5 sentences.",
  ),
  "Speech Writing and Delivery": a(
    "One-Minute Speech",
    "Write and deliver a short speech.",
    [
      "Write a one-minute speech (about 100 words) on a topic you care about.",
      "Include a hook, a main point with an example, and a closing line.",
      "Practice it aloud twice, with eye contact and clear pauses.",
    ],
    "Your speech text (an audio or video recording is a bonus).",
  ),
  "Formal and Informal Language": a(
    "Switch the Tone",
    "Change messages between formal and informal language.",
    [
      "Write a short informal text to a friend asking to borrow a book.",
      "Rewrite the same request as a formal letter to your teacher or librarian.",
      "List 3 words or phrases you changed and why.",
    ],
    "Both messages and your list of 3 changes.",
  ),
};
