import type { DemoLecture } from "./types";

/** Science 10 lectures, keyed by lesson title (see grade10.ts and seed.ts). */
export const SCIENCE_LECTURES: Record<string, DemoLecture> = {
  "Distribution of Volcanoes and Earthquakes": {
    videoId: "_kxuoHdXmQI",
    lecture: `## A pattern on the map
When scientists plot earthquake epicenters, active volcanoes and major mountain ranges on a world map, they do not appear at random. They form **long, narrow belts**, and those belts mark the **edges of the lithospheric plates**.

## The Pacific Ring of Fire
About **75% of the world's active volcanoes** and most of its strongest earthquakes lie along the **Pacific Ring of Fire**, a horseshoe of plate boundaries around the Pacific Ocean.

## Why the Philippines is active
The Philippines sits on the Ring of Fire between the **Philippine Sea Plate** and the **Eurasian Plate**. Along the **Philippine Trench** and the **Manila Trench**, one plate sinks (subducts) under another.
- This produces volcanoes such as **Mayon, Taal and Pinatubo**.
- The **Philippine Fault Zone** runs about 1,200 km from Luzon to Mindanao and causes many strong earthquakes, like the 1990 Luzon earthquake.

## Earthquake terms
- **Focus:** the point inside the Earth where the rupture starts
- **Epicenter:** the point on the surface directly above the focus
- **Magnitude** measures the energy released; **intensity** describes the effects at a place.

## Key points
- Earthquakes, volcanoes and mountain ranges are evidence that plates move.
- Living on the Ring of Fire is why earthquake and volcano drills matter in every Filipino school.`,
  },

  "Plate Boundaries": {
    videoId: "-eeM1Qw2PGo",
    lecture: `## Plate tectonics
The **lithosphere** (crust and uppermost mantle) is broken into large **plates** that move a few centimeters a year, carried by **convection currents** in the mantle. Where plates meet, we find **plate boundaries**.

## Divergent boundaries — plates move apart
- Magma rises and forms new crust.
- Under the ocean this builds **mid-ocean ridges** (the Mid-Atlantic Ridge); on land it forms **rift valleys** (the East African Rift).
- Produces shallow earthquakes and gentle volcanic activity.

## Convergent boundaries — plates collide
- **Oceanic–continental:** the denser oceanic plate **subducts**, forming a trench and a chain of volcanoes on land (the Andes).
- **Oceanic–oceanic:** one plate subducts and forms a trench and a **volcanic island arc** — this is how much of the Philippines formed.
- **Continental–continental:** neither sinks, so the crust crumples into **high mountains** (the Himalayas).
- Produces the strongest and deepest earthquakes.

## Transform boundaries — plates slide past
- Crust is neither made nor destroyed.
- Rocks lock, then slip suddenly, causing earthquakes. Example: the **San Andreas Fault** in California.

## Key points
- New crust is made at divergent boundaries and destroyed at subduction zones.
- The type of boundary predicts the landforms and hazards found there.`,
  },

  "Electromagnetic Waves": {
    videoId: "CQV8PWRBhDc",
    lecture: `## What are EM waves?
**Electromagnetic waves** are made of electric and magnetic fields vibrating at right angles to each other. Unlike sound, they **need no medium** — they can travel through empty space. That is how sunlight reaches Earth.

In a vacuum all EM waves travel at the **speed of light, c = 3 × 10⁸ m/s**.

## The wave equation
**c = f λ** — speed = frequency × wavelength.

Since c is fixed, a **higher frequency** means a **shorter wavelength**.

**Example:** An FM station broadcasts at 100 MHz. λ = c/f = (3 × 10⁸)/(1 × 10⁸) = **3 m**.

## The electromagnetic spectrum
From longest wavelength (lowest frequency, lowest energy) to shortest:
- **Radio waves** — AM/FM radio, TV
- **Microwaves** — cellphones, Wi-Fi, microwave ovens
- **Infrared** — remote controls, heat, thermal cameras
- **Visible light** — red, orange, yellow, green, blue, indigo, violet (ROYGBIV)
- **Ultraviolet** — sterilizing, vitamin D, sunburn
- **X-rays** — medical imaging
- **Gamma rays** — cancer treatment, sterilizing equipment

A memory aid: **"Raging Martians Invaded Venus Using X-ray Guns."**

## Key points
- James Clerk Maxwell predicted EM waves; Heinrich Hertz first produced and detected them.
- Energy increases with frequency: E = hf.`,
  },

  "Effects of EM Radiation": {
    videoId: "Q3m-RraIn1A",
    lecture: `## Energy and frequency
The higher the frequency of an EM wave, the more energy each photon carries. High-energy radiation (UV, X-rays, gamma rays) is **ionizing**: it can knock electrons off atoms and damage DNA in cells.

## Benefits and hazards
- **Radio waves:** communication. Generally considered safe at normal levels.
- **Microwaves:** cooking, phones, satellite links. Strong exposure heats body tissue.
- **Infrared:** remote controls, night vision, warmth. Too much can burn skin.
- **Visible light:** sight and photosynthesis. Very bright light can damage the eyes — never look at the Sun.
- **Ultraviolet:** helps the skin make vitamin D and kills germs. Overexposure causes **sunburn, skin cancer and cataracts**.
- **X-rays:** show bones and teeth. Repeated exposure can damage cells, so technicians use **lead aprons and shields**.
- **Gamma rays:** kill cancer cells and sterilize medical tools. Very dangerous to healthy cells.

## Staying safe
- Use **sunscreen**, hats and sunglasses, and avoid the midday sun (10 a.m. to 3 p.m.).
- Have X-rays only when a doctor recommends them.
- Keep a safe distance from strong sources and limit exposure time.

## Key points
- Radiation is not automatically harmful; risk depends on the **type, intensity and length of exposure**.
- Ozone in the atmosphere absorbs much of the Sun's harmful UV radiation.`,
  },

  "Images in Mirrors": {
    videoId: "_HAfRsX6v0Q",
    lecture: `## The law of reflection
When light bounces off a surface, the **angle of incidence equals the angle of reflection**, both measured from the normal (a line perpendicular to the surface).

## Plane mirrors
A flat mirror forms an image that is:
- **Upright** and **virtual** (light does not really meet there)
- The **same size** as the object
- As far **behind** the mirror as the object is in front
- **Laterally inverted** (left and right are switched) — that's why AMBULANCE is printed backwards on ambulances.

## Curved (spherical) mirrors
- **Concave mirror** — curves inward, like the inside of a spoon. It **converges** light to a focal point F.
- **Convex mirror** — bulges outward. It **diverges** light.

## Images in a concave mirror
- Object **beyond C** (center of curvature): real, inverted, smaller
- Object **at C**: real, inverted, same size
- Object **between C and F**: real, inverted, larger
- Object **at F**: no image formed
- Object **between F and the mirror**: virtual, upright, larger (makeup mirrors)

## Images in a convex mirror
Always **virtual, upright and smaller**, giving a wide field of view. That is why they are used as side mirrors and in store corners.

## Mirror equation
**1/f = 1/dₒ + 1/dᵢ** and magnification **M = −dᵢ/dₒ**.`,
  },

  Lenses: {
    videoId: "CJ6aB5ULqa0",
    lecture: `## Refraction
A lens works by **refraction** — light bends as it passes from air into glass and back. The shape of the lens decides how the light bends.

## Two kinds of lenses
- **Convex (converging) lens:** thicker in the middle. Brings parallel rays together at the **focal point**.
- **Concave (diverging) lens:** thinner in the middle. Spreads rays apart; they appear to come from a focal point on the same side as the object.

## Images formed by a convex lens
- Object far beyond **2F**: real, inverted, smaller (cameras, the eye)
- Object **between F and 2F**: real, inverted, larger (projectors)
- Object **inside F**: virtual, upright, larger (magnifying glass)

A **concave lens** always forms a virtual, upright, smaller image.

## The lens equation
**1/f = 1/dₒ + 1/dᵢ**, magnification **M = −dᵢ/dₒ**

**Example:** An object is 30 cm from a convex lens with f = 10 cm.
- 1/dᵢ = 1/10 − 1/30 = 2/30, so dᵢ = **15 cm**
- M = −15/30 = −0.5: the image is real, inverted and half the size.

## Lenses and the eye
- **Nearsightedness (myopia):** the image forms in front of the retina. Corrected with a **concave** lens.
- **Farsightedness (hyperopia):** the image forms behind the retina. Corrected with a **convex** lens.

## Key points
- Power of a lens = 1/f (in meters), measured in diopters.`,
  },

  "Magnetic Fields from Currents": {
    videoId: "v7hWt9F3WcY",
    lecture: `## Oersted's discovery
In 1820 **Hans Christian Oersted** noticed that a compass needle moved when a nearby wire carried current. This showed that **an electric current produces a magnetic field** — the beginning of electromagnetism.

## The field around a wire
The magnetic field forms **circles around the wire**. Use the **right-hand rule**: point your thumb in the direction of the current, and your curled fingers show the direction of the field.

## Coils and solenoids
Winding the wire into a coil (a **solenoid**) adds up the fields from every loop. The coil behaves like a **bar magnet** with a north and south pole.

## Electromagnets
Putting an **iron core** inside the coil makes an **electromagnet**. Its strength increases when you:
- Increase the **current**
- Increase the **number of turns** in the coil
- Use a **soft iron core**

Unlike a permanent magnet, an electromagnet can be **switched on and off** and its strength can be adjusted.

## Uses
- Electric bells and doorbells
- Speakers and headphones
- Junkyard cranes that lift scrap metal
- Relays and circuit breakers
- MRI machines in hospitals

## Key points
- Moving charges create magnetic fields.
- Reversing the current reverses the poles of an electromagnet.`,
  },

  "Motors and Generators": {
    videoId: "1f_AzGLciWg",
    lecture: `## The motor effect
A wire carrying current inside a magnetic field feels a **force**. If the wire is shaped into a loop that can rotate, the forces on its two sides push in opposite directions and make it **spin**.

## Electric motors
A **motor** changes **electrical energy into mechanical energy**.
- **Coil (armature):** carries the current and rotates
- **Magnets:** provide the magnetic field
- **Commutator:** reverses the current every half turn so the coil keeps spinning in one direction
- **Brushes:** connect the commutator to the power supply

Electric fans, washing machines, electric jeepneys and toy cars all use motors.

## Electromagnetic induction
In 1831 **Michael Faraday** discovered that a **changing magnetic field induces a current** in a coil. Moving a magnet in and out of a coil makes the current flow — the faster the motion, the greater the current.

## Generators
A **generator** changes **mechanical energy into electrical energy** — the reverse of a motor. A turbine spins a coil inside a magnetic field (or spins magnets inside coils), inducing an alternating current.

Power plants turn their generators with steam (coal, geothermal), falling water (hydroelectric dams like Magat and San Roque) or wind (Bangui wind farm).

## Transformers
Transformers use induction to **step voltage up or down** so power can travel long distances efficiently.

## Key points
- Motor: electricity → motion. Generator: motion → electricity.`,
  },

  "Hormones and Reproduction": {
    videoId: "F3zx9AHTjy8",
    lecture: `## The endocrine system
The **endocrine system** uses **hormones** — chemical messengers released into the blood — to control growth, metabolism and reproduction. Key glands include the **hypothalamus, pituitary, thyroid, adrenal glands, pancreas, ovaries and testes**.

## Control center
The **hypothalamus** signals the **pituitary gland**, the "master gland", which releases:
- **FSH (follicle-stimulating hormone)** — stimulates egg development in females and sperm production in males
- **LH (luteinizing hormone)** — triggers ovulation in females and testosterone production in males

## Female reproductive hormones
- **Estrogen** (from the ovaries) — develops female traits and thickens the uterine lining
- **Progesterone** (from the corpus luteum) — maintains the uterine lining for pregnancy

## The menstrual cycle (about 28 days)
- **Days 1–5, menstruation:** the uterine lining sheds
- **Follicular phase:** FSH makes a follicle grow; estrogen rises and rebuilds the lining
- **Around day 14, ovulation:** a surge of LH releases the egg
- **Luteal phase:** the corpus luteum makes progesterone. If no fertilization happens, progesterone drops and a new cycle begins.

## Male reproductive hormones
**Testosterone** (from the testes) causes male traits at puberty — deeper voice, facial hair, muscle growth — and supports sperm production.

## Key points
- Hormones travel in the blood and affect only cells with matching receptors.
- Reproduction depends on hormones working in the right amounts at the right times.`,
  },

  "Feedback Mechanisms": {
    videoId: "NBnH9voxO8I",
    lecture: `## Homeostasis
**Homeostasis** is the body's ability to keep its internal conditions — temperature, blood sugar, water, hormone levels — stable even when the outside changes. Feedback mechanisms make this possible.

## Negative feedback: reverse the change
In **negative feedback**, the response **opposes** the original change and brings it back to normal. Most body controls work this way.
- **Blood sugar:** after a meal, glucose rises → the pancreas releases **insulin** → cells take in glucose → blood sugar falls. When it drops too low, **glucagon** raises it again.
- **Body temperature:** when you are hot, you sweat and blood vessels widen; when cold, you shiver.
- **Menstrual cycle:** high estrogen and progesterone signal the hypothalamus and pituitary to **lower** FSH and LH.

## Positive feedback: amplify the change
In **positive feedback**, the response **increases** the change until an event is completed.
- **Childbirth:** contractions push the baby against the cervix → **oxytocin** is released → stronger contractions → more oxytocin, until birth.
- **The LH surge** before ovulation is driven by rising estrogen.
- **Blood clotting:** clotting factors activate more clotting factors.

## When feedback fails
Disorders appear when feedback breaks down. In **diabetes**, the body does not make enough insulin or does not respond to it, so blood sugar stays high.

## Key points
- Negative feedback keeps things stable; positive feedback pushes a process to finish.
- The nervous and endocrine systems work together to coordinate these responses.`,
  },

  "DNA and RNA": {
    videoId: "JQByjprj_mA",
    lecture: `## DNA: the genetic blueprint
**DNA (deoxyribonucleic acid)** carries the instructions for building and running every living thing. It is found in the **nucleus** of cells, packed into **chromosomes**.

## Structure of DNA
- DNA is a **double helix** — a twisted ladder (Watson and Crick, 1953, using Rosalind Franklin's X-ray images).
- Each building block, a **nucleotide**, has a **sugar (deoxyribose)**, a **phosphate** and a **nitrogen base**.
- The sides of the ladder are sugar and phosphate; the rungs are base pairs.
- **Base pairing:** **A pairs with T**, and **G pairs with C**.

**Example:** If one strand reads ATG CCA, the other reads **TAC GGT**.

## DNA replication
Before a cell divides, it copies its DNA.
- The enzyme **helicase** unzips the two strands.
- **DNA polymerase** adds matching nucleotides to each strand.
- Each new DNA molecule has one old and one new strand (**semi-conservative** replication).

## RNA
**RNA (ribonucleic acid)** helps turn DNA's instructions into proteins.
- **Single-stranded**
- Sugar is **ribose**
- Uses **uracil (U)** instead of thymine, so **A pairs with U**
- Types: **mRNA** (messenger), **tRNA** (transfer), **rRNA** (ribosomal)

## Key points
- DNA stores information; RNA carries and uses it.
- The order of bases is the genetic code.`,
  },

  "Protein Synthesis and Mutation": {
    videoId: "oefAI2x2CQM",
    lecture: `## From gene to protein
A **gene** is a section of DNA that codes for a protein. Proteins build tissues, act as enzymes and carry signals. Making a protein takes two steps.

## Step 1: Transcription (in the nucleus)
- RNA polymerase reads one DNA strand and builds a matching **mRNA**.
- DNA TAC GGA → mRNA **AUG CCU**

## Step 2: Translation (at the ribosome)
- The ribosome reads mRNA three bases at a time. Each triplet is a **codon**.
- **tRNA** molecules carry amino acids; each has an **anticodon** that matches a codon.
- Amino acids join into a chain that folds into a protein.
- **AUG** is the start codon (methionine). **UAA, UAG, UGA** are stop codons.

## Mutations
A **mutation** is a change in the DNA sequence.
- **Substitution (point mutation):** one base is replaced. It may change one amino acid — in **sickle-cell anemia**, a single substitution changes the shape of hemoglobin.
- **Insertion or deletion:** a base is added or removed, causing a **frameshift** that changes every codon after it.
- **Chromosomal mutations:** large parts of chromosomes are deleted, duplicated or moved. **Down syndrome** results from an extra chromosome 21.

## Causes
Mutations can happen by chance during replication or be caused by **mutagens** such as UV light, X-rays, cigarette smoke and some chemicals.

## Key points
- DNA → mRNA → protein is called the **central dogma**.
- Not all mutations are harmful; some are neutral and a few are helpful, which drives variation.`,
  },

  "Evidence of Evolution": {
    videoId: "BEGeaKAH0ic",
    lecture: `## What is evolution?
**Evolution** is the change in the inherited traits of populations over many generations. Several independent lines of evidence show that living things share **common ancestors**.

## Fossil record
- **Fossils** are preserved remains or traces of past organisms.
- Deeper rock layers usually hold older fossils, showing how life changed over time.
- **Transitional fossils** such as *Archaeopteryx* (part reptile, part bird) and *Tiktaalik* (fish with limb-like fins) link major groups.

## Comparative anatomy
- **Homologous structures:** same basic bone structure, different functions — the arm of a human, the wing of a bat, the flipper of a whale. They point to a common ancestor.
- **Analogous structures:** same function, different origin — the wings of a bird and an insect.
- **Vestigial structures:** organs with little or no use now, like the human tailbone and the leg bones of whales.

## Comparative embryology
Early embryos of fish, chickens and humans look very similar — all have tails and pharyngeal pouches — suggesting shared ancestry.

## Molecular evidence
Comparing **DNA and proteins** shows how closely species are related. Humans and chimpanzees share about **98–99%** of their DNA; the more similar the sequences, the more recent the common ancestor.

## Key points
- Each line of evidence supports the others.
- Evolution explains both the unity and the diversity of life.`,
  },

  "Natural Selection": {
    videoId: "7VM9YxmULuo",
    lecture: `## Darwin's idea
**Charles Darwin**, after his voyage on HMS *Beagle* and studying the finches of the Galápagos Islands, proposed in 1859 that species change through **natural selection**. Alfred Russel Wallace reached the same idea independently.

## How natural selection works (VIST)
- **Variation:** individuals in a population differ in their traits.
- **Inheritance:** many of these traits are passed from parents to offspring.
- **Selection:** more offspring are born than can survive; those with traits better suited to the environment survive and reproduce more.
- **Time:** over many generations, the helpful traits become more common.

## Examples
- **Peppered moths:** during England's industrial revolution, soot darkened tree bark. Dark moths were harder for birds to see, so they became more common.
- **Darwin's finches:** beak shapes match the food on each island — thick beaks for seeds, thin beaks for insects.
- **Antibiotic resistance:** when antibiotics are misused, the few resistant bacteria survive and multiply. This is why you must finish the full course of your medicine.

## Adaptation
An **adaptation** is an inherited trait that improves survival and reproduction: the camouflage of a leaf insect, the thick fur of polar animals.

## Key points
- Individuals do not evolve; **populations** do.
- Natural selection acts on variation that already exists; it does not create traits on demand.`,
  },

  "Boyle's and Charles's Laws": {
    videoId: "FYiu61k-xIY",
    lecture: `## Describing a gas
A gas is described by its **pressure (P)**, **volume (V)**, **temperature (T)** and **amount (n)**. The **kinetic molecular theory** says gas particles move constantly and randomly; pressure comes from their collisions with the container walls.

## Boyle's Law (constant temperature)
Pressure and volume are **inversely proportional**: squeeze a gas into half the volume and its pressure doubles.

**P₁V₁ = P₂V₂**

**Example:** A gas occupies 6.0 L at 1.0 atm. What is its volume at 3.0 atm?
- V₂ = (1.0 × 6.0)/3.0 = **2.0 L**

Everyday example: pushing the plunger of a sealed syringe gets harder as the air is compressed.

## Charles's Law (constant pressure)
Volume and **absolute temperature** are **directly proportional**: heat a gas and it expands.

**V₁/T₁ = V₂/T₂**

Temperature **must be in kelvin**: K = °C + 273.

**Example:** A balloon holds 2.0 L at 27 °C. What is its volume at 77 °C?
- T₁ = 300 K, T₂ = 350 K
- V₂ = 2.0 × 350/300 = **2.33 L**

Everyday example: a balloon left in a hot car gets bigger; one put in the freezer shrinks.

## Key points
- Boyle: P up, V down. Charles: T up, V up.
- Never use °C in gas-law calculations.`,
  },

  "Combined and Ideal Gas Laws": {
    videoId: "BxUS1K7xu30",
    lecture: `## Gay-Lussac's Law (constant volume)
Pressure is directly proportional to absolute temperature: **P₁/T₁ = P₂/T₂**. That is why aerosol cans warn you not to heat them.

## The combined gas law
Putting Boyle's, Charles's and Gay-Lussac's laws together, for a fixed amount of gas:

**P₁V₁/T₁ = P₂V₂/T₂**

**Example:** A gas has V = 4.0 L at 1.0 atm and 300 K. Find V at 2.0 atm and 450 K.
- V₂ = (1.0 × 4.0 × 450)/(300 × 2.0) = **3.0 L**

## Avogadro's Law
At constant temperature and pressure, volume is proportional to the number of moles: **V₁/n₁ = V₂/n₂**. At STP (0 °C, 1 atm), one mole of any gas occupies about **22.4 L**.

## The ideal gas law
**PV = nRT**
- R = **0.0821 L·atm/(mol·K)**
- T in kelvin

**Example:** What volume do 2.0 mol of oxygen occupy at 1.0 atm and 300 K?
- V = nRT/P = (2.0)(0.0821)(300)/1.0 = **49.3 L**

## Real-life uses
Car airbags inflate with gas from a fast chemical reaction; scuba divers must ascend slowly because the gas in their bodies expands as pressure drops.

## Key points
- Cancel any quantity that stays constant, then solve.
- Real gases behave most like ideal gases at high temperature and low pressure.`,
  },

  "Balancing Chemical Equations": {
    videoId: "e_C-V5vJv80",
    lecture: `## Chemical equations
A chemical equation shows **reactants → products**. Example: hydrogen + oxygen → water.

## Law of Conservation of Mass
Antoine Lavoisier showed that **mass is neither created nor destroyed** in a reaction. Atoms are only rearranged, so **each kind of atom must appear the same number of times on both sides**.

## Coefficients vs. subscripts
- **Subscripts** (the small numbers in H₂O) tell what the substance is. **Never change them.**
- **Coefficients** (the big numbers in front) tell how many molecules. These are what you adjust.

## Steps
- Write the correct formulas.
- Count the atoms of each element on both sides.
- Add coefficients one element at a time; leave H and O for last.
- Recount and use the smallest whole-number coefficients.

## Worked examples
**H₂ + O₂ → H₂O**
- O: 2 on the left, 1 on the right → put 2 in front of H₂O.
- H is now 4 on the right → put 2 in front of H₂.
- **2H₂ + O₂ → 2H₂O**

**CH₄ + O₂ → CO₂ + H₂O** (burning methane)
- C is balanced. H: 4 on the left → 2H₂O.
- O on the right: 2 + 2 = 4 → 2O₂.
- **CH₄ + 2O₂ → CO₂ + 2H₂O**

## Key points
- A balanced equation has equal atoms of each element on both sides.
- Types of reactions: combination, decomposition, single and double displacement, combustion, acid–base.`,
  },

  "Factors Affecting Reaction Rate": {
    videoId: "FGO4wucnvi8",
    lecture: `## Reaction rate
The **reaction rate** is how fast reactants turn into products. Some reactions are very fast (fireworks), others very slow (rusting).

## Collision theory
Particles react only when they **collide** with **enough energy** (the **activation energy**) and the **right orientation**. Anything that increases effective collisions speeds up the reaction.

## Factors that change the rate
- **Temperature:** higher temperature makes particles move faster and collide harder and more often. Food spoils slower in the refrigerator.
- **Concentration (or pressure for gases):** more particles in the same space means more collisions. Fire burns faster in pure oxygen.
- **Surface area:** smaller pieces expose more particles. Powdered sugar dissolves faster than a sugar cube; kindling catches fire faster than a log.
- **Catalyst:** a substance that **lowers the activation energy** without being used up. Enzymes like amylase in saliva are biological catalysts; catalytic converters in cars clean exhaust.
- **Nature of the reactants:** some substances are simply more reactive — sodium reacts violently with water, gold does not.

## Applications
- Cooking food in small pieces and at high heat makes it cook faster.
- Preservatives and refrigeration slow down spoilage.
- Factories use catalysts to make products quickly and cheaply.

## Key points
- More collisions or more energetic collisions → faster reaction.
- A catalyst speeds up a reaction but is not consumed.`,
  },

  "Intro to Energetics": {
    videoId: "1Dx7LDwINLU",
    lecture: `## Biomolecules
Living things are built from four groups of large organic molecules, the **biomolecules**.
- **Carbohydrates** — sugars and starches (rice, bread). Main source of quick energy. Monomer: **monosaccharides** like glucose.
- **Lipids** — fats, oils, waxes. Long-term energy storage, insulation and cell membranes. Built from **fatty acids and glycerol**.
- **Proteins** — muscles, enzymes, hormones and antibodies. Monomer: **amino acids**.
- **Nucleic acids** — DNA and RNA. Store and carry genetic information. Monomer: **nucleotides**.

## Energy in cells
Cells run on **ATP (adenosine triphosphate)**. Breaking off a phosphate (ATP → ADP + P) releases energy for movement, active transport and building molecules.

## Enzymes
**Enzymes** are proteins that speed up reactions by lowering the activation energy. Each enzyme fits a specific **substrate**, like a lock and key. Enzymes work best at certain temperatures and pH; too much heat **denatures** them.

## Photosynthesis and respiration
- **Photosynthesis** (in chloroplasts) stores the Sun's energy in glucose:
  6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
- **Cellular respiration** (in mitochondria) releases that energy as ATP:
  C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP

## Key points
- Food tests: iodine turns starch blue-black; Benedict's solution shows simple sugars; Biuret reagent turns violet with protein.
- The two processes form a cycle: the products of one are the reactants of the other.`,
  },

  "Glycolysis and the Citric Acid Cycle": {
    videoId: "eJ9Zjc-jdys",
    lecture: `## Cellular respiration in stages
Cells break down glucose step by step so its energy can be captured as ATP instead of being lost as heat. The stages are **glycolysis**, the **Krebs (citric acid) cycle** and the **electron transport chain**.

## Glycolysis — in the cytoplasm
- One glucose (6 carbons) is split into **two pyruvate** (3 carbons each).
- Uses 2 ATP, makes 4 ATP: a **net gain of 2 ATP**.
- Makes **2 NADH**, which carry high-energy electrons.
- Does **not** need oxygen.

## Link reaction
If oxygen is present, each pyruvate enters the **mitochondrion** and is changed into **acetyl-CoA**, releasing CO₂.

## Krebs (citric acid) cycle — in the mitochondrial matrix
- Acetyl-CoA joins a 4-carbon molecule to form **citric acid**, which is broken down step by step back to the 4-carbon molecule.
- Per glucose (two turns): **2 ATP, 6 NADH, 2 FADH₂** and **4 CO₂**.
- The CO₂ you breathe out comes from here.

## Without oxygen: fermentation
- **Lactic acid fermentation** in muscles during hard exercise (causes the burning feeling).
- **Alcoholic fermentation** in yeast makes ethanol and CO₂ — used to make bread rise and to make vinegar and *tuba*.
- Fermentation yields only the 2 ATP from glycolysis.

## Key points
- Glycolysis happens in all living cells; the Krebs cycle needs mitochondria and oxygen.
- Most of the energy is still held in NADH and FADH₂ — it is released in the next stage.`,
  },

  "Electron Transport Chain": {
    videoId: "zJNx1DDqIVo",
    lecture: `## Where most ATP is made
The **electron transport chain (ETC)** is on the **inner membrane of the mitochondrion** (the cristae). It produces most of the ATP from one glucose molecule.

## How it works
- **NADH and FADH₂** from glycolysis and the Krebs cycle drop off high-energy electrons.
- The electrons pass along a chain of proteins, losing a little energy at each step.
- That energy pumps **hydrogen ions (H⁺)** across the membrane, building up a **concentration gradient**.
- **Oxygen is the final electron acceptor**: it combines with electrons and H⁺ to form **water**. Without oxygen, the chain stops.

## Chemiosmosis
- The H⁺ ions flow back through an enzyme called **ATP synthase**, which spins like a turbine.
- This flow joins ADP and phosphate into **ATP**. This is called **oxidative phosphorylation**.

## The energy total
- Glycolysis: 2 ATP
- Krebs cycle: 2 ATP
- Electron transport chain: about **32–34 ATP**
- Total: about **36–38 ATP per glucose** (modern estimates are closer to 30–32)

## Why it matters
- We need to breathe oxygen because it accepts the electrons at the end of the chain.
- Cyanide is deadly because it blocks the chain, stopping ATP production.

## Key points
- Aerobic respiration is far more efficient than fermentation (about 36 ATP vs 2).`,
  },
};
