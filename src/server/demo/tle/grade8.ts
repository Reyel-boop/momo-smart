import type { DemoSubject } from "../grade10";
import { q, TLE_DEPARTMENT, tleLesson } from "./common";

/** TLE 8: exploratory course, building on TLE 7 in each strand. */
export const TLE8: DemoSubject = {
  key: "TLE8",
  code: "TLE 8",
  name: "TLE 8 – Exploratory",
  department: TLE_DEPARTMENT,
  description:
    "Hands-on skills across the four strands: computer use, food safety, plant propagation and basic wiring.",
  colorToken: "amber",
  units: [
    {
      title: "ICT: Computer Operations",
      description: "Using the computer well, and using the internet safely.",
      lessons: [
        tleLesson(
          "Basic Computer Operations and File Management",
          "Starting up, shutting down and organizing files.",
          "2g3Do_c0mV0",
          `## Starting and shutting down
- **Booting** is starting the computer. A **cold boot** starts from power off; a **warm boot (restart)** reloads the system without cutting power.
- Always **shut down** through the operating system (Start → Shut down). Pulling the plug can **corrupt files**.

## The desktop
- **Icons** — shortcuts to programs and files
- **Taskbar** — shows open programs; **Start menu** opens everything else
- **Window controls** — minimize, maximize/restore, close

## Files and folders
- A **file** holds data: a document, picture or song. Its **extension** tells the type: .docx, .xlsx, .jpg, .mp3, .pdf.
- A **folder** holds files and other folders (**subfolders**).
- The **path** shows where a file is: **C:\\Users\\Ana\\Documents\\TLE\\Report.docx**

## File management tasks
- **Create** folders with clear names (e.g. *TLE 8 – Quarter 1*)
- **Copy** (Ctrl+C) keeps the original; **Cut** (Ctrl+X) moves it; **Paste** (Ctrl+V)
- **Rename** (F2), **Delete** (goes to the Recycle Bin), **Restore** from the Recycle Bin
- **Search** when you forget where a file is

## Good habits
- Use meaningful file names and dates.
- Keep **backups** on a flash drive or cloud storage.
- Scan flash drives with **antivirus** before opening files.`,
          "Shut down through the operating system, not by unplugging. Organize files in clearly named folders and keep backups.",
          [
            "What is the difference between a cold boot and a warm boot?",
            "What is the difference between copy and cut?",
            "Why should you keep a backup of important files?",
          ],
        ),
        tleLesson(
          "Internet Safety and Netiquette",
          "Protecting yourself and respecting others online.",
          "0-9X110ln_I",
          `## Online threats
- **Malware** — harmful software: **viruses**, **worms**, **trojans**, **spyware**, **ransomware**
- **Phishing** — fake messages or sites that trick you into giving passwords or bank details
- **Identity theft** — someone uses your personal information
- **Cyberbullying** — harassment through social media or messages

## Protecting yourself
- Use **strong passwords** (long, with letters, numbers and symbols) and don't share them.
- Turn on **two-factor authentication**.
- Don't click links or download files from unknown senders.
- Keep your **operating system and antivirus updated**.
- Don't post your **address, phone number, school schedule** or location publicly.
- Think before you post — the internet **never forgets** (your **digital footprint**).

## Netiquette: rules of good online behavior
- Remember the **human** on the other side of the screen.
- Don't type in **ALL CAPS** — it reads as shouting.
- Respect others' **privacy**; don't share their photos without permission.
- **Check facts** before sharing; don't spread fake news.
- Give **credit** for others' work.
- Be **kind**, even when you disagree.

## Laws to know
The **Cybercrime Prevention Act of 2012 (RA 10175)** punishes hacking, online libel and identity theft. The **Data Privacy Act (RA 10173)** protects personal information.`,
          "Use strong passwords, avoid suspicious links and protect personal information. Netiquette means respectful, honest behavior online.",
          [
            "What is phishing?",
            "Give three rules of netiquette.",
            "What law punishes cybercrimes in the Philippines?",
          ],
        ),
      ],
      quiz: [
        q(
          "What is the safest way to turn off a computer?",
          [
            "Unplug it",
            "Press and hold the power button",
            "Use Shut down in the operating system",
            "Turn off the monitor",
          ],
          2,
          "Shutting down through the operating system closes programs and saves system data properly; cutting power can corrupt files.",
        ),
        q(
          "Which keyboard shortcut pastes a copied file?",
          ["Ctrl + C", "Ctrl + X", "Ctrl + V", "Ctrl + Z"],
          2,
          "Ctrl + V pastes. Ctrl + C copies, Ctrl + X cuts and Ctrl + Z undoes.",
        ),
        q(
          "A message says your account will be closed unless you enter your password on a link. This is…",
          ["Netiquette", "Phishing", "A firewall", "A backup"],
          1,
          "Phishing uses fake, urgent messages to trick people into giving away passwords or personal information.",
        ),
        q(
          "Which is the strongest password?",
          ["123456", "password", "juan2010", "M0mo!Sm4rt#2026"],
          3,
          "A strong password is long and mixes uppercase, lowercase, numbers and symbols, so it is hard to guess or crack.",
        ),
        q(
          "Typing a whole message in ALL CAPS is considered…",
          ["polite", "shouting", "more secure", "required in emails"],
          1,
          "In netiquette, all caps reads as shouting and can seem rude or aggressive.",
        ),
      ],
    },
    {
      title: "Home Economics: Food Safety and Sanitation",
      description: "Clean tools and safe food.",
      lessons: [
        tleLesson(
          "Cleaning and Sanitizing Kitchen Tools",
          "Removing dirt and killing germs.",
          "N2aFM4DtU-I",
          `## Cleaning vs. sanitizing
- **Cleaning** removes visible **dirt, grease and food** using water and detergent.
- **Sanitizing** reduces **germs** to a safe level using **heat** or **chemicals**.
You must **clean first, then sanitize** — germs hide under dirt.

## Cleaning agents
- **Detergents** — general cleaning
- **Solvent cleaners (degreasers)** — remove grease
- **Acid cleaners** — remove mineral deposits (scale)
- **Abrasive cleaners** — scrub stubborn stains (not for non-stick pans)

## Sanitizing methods
- **Heat:** soak in water at least **77 °C (171 °F)** for 30 seconds, or use a dishwasher.
- **Chemical:** chlorine (bleach) solution, iodine or quaternary ammonium, mixed at the right strength.

## The three-compartment sink
1. **Wash** — hot water and detergent
2. **Rinse** — clean water
3. **Sanitize** — hot water or sanitizer solution
Then **air-dry** — towels can spread germs.

## Storage
Store clean tools **off the floor** in a clean, dry place; store cups and bowls **upside down**.`,
          "Cleaning removes dirt; sanitizing kills germs. Wash, rinse, sanitize, then air-dry tools before storing them in a clean, dry place.",
          [
            "What is the difference between cleaning and sanitizing?",
            "List the three compartments of a sink in order.",
            "Why are tools air-dried instead of wiped with a towel?",
          ],
        ),
        tleLesson(
          "Food Safety and Hazards",
          "Keeping food safe from farm to table.",
          "pd6geHihHOg",
          `## Food hazards
- **Biological** — bacteria, viruses, parasites and molds (the most common cause of food poisoning)
- **Chemical** — cleaning agents, pesticides, too much additive
- **Physical** — hair, glass, stones, bones, metal pieces

## The danger zone
Bacteria multiply fastest between **5 °C and 60 °C** (41–140 °F). Keep **cold food cold** and **hot food hot**, and don't leave cooked food at room temperature for more than **2 hours**.

## Four keys to safe food
- **Clean** — wash hands for 20 seconds, wash surfaces and tools
- **Separate** — keep raw meat away from ready-to-eat food
- **Cook** — cook food thoroughly (chicken to 74 °C inside)
- **Chill** — refrigerate leftovers promptly

## Personal hygiene of food handlers
Short, clean nails; hair net or cap; clean apron; no jewelry; don't handle food when sick; cover cuts.

## HACCP
**Hazard Analysis and Critical Control Points** is a system used by food businesses to find the points where hazards can enter and control them — for example, checking the cooking temperature.

## Key points
Most food poisoning comes from **poor hygiene, cross-contamination and wrong temperatures**.`,
          "Food hazards are biological, chemical or physical. Keep food out of the 5–60 °C danger zone and follow clean, separate, cook and chill.",
          [
            "Give an example of a physical food hazard.",
            "What is the temperature danger zone?",
            "What are the four keys to safe food?",
          ],
        ),
      ],
      quiz: [
        q(
          "What is the correct order?",
          [
            "Sanitize, then clean",
            "Clean, then sanitize",
            "Only sanitize",
            "Only rinse",
          ],
          1,
          "Dirt and grease shield germs from the sanitizer, so tools must be cleaned first and sanitized after.",
        ),
        q(
          "After the wash and rinse sinks, the third sink is for…",
          ["drying", "sanitizing", "soaking overnight", "peeling"],
          1,
          "The three-compartment sink goes wash → rinse → sanitize, and then tools are air-dried.",
        ),
        q(
          "A strand of hair found in soup is what kind of hazard?",
          ["Biological", "Chemical", "Physical", "Allergic"],
          2,
          "Foreign objects such as hair, glass or stones are physical hazards.",
        ),
        q(
          "The temperature danger zone where bacteria grow fastest is…",
          ["below 0 °C", "5 °C to 60 °C", "above 100 °C", "exactly 37 °C only"],
          1,
          "Bacteria multiply quickly between 5 °C and 60 °C, so food should be kept colder or hotter than this range.",
        ),
        q(
          "Why should raw meat be kept away from cooked food?",
          [
            "To keep the flavor",
            "To avoid cross-contamination",
            "To save refrigerator space",
            "To keep the color",
          ],
          1,
          "Juices from raw meat can carry bacteria to food that won't be cooked again; separating them prevents cross-contamination.",
        ),
      ],
    },
    {
      title: "Agri-Fishery Arts: Plant Propagation and Planting",
      description: "Producing new plants and preparing the soil.",
      lessons: [
        tleLesson(
          "Plant Propagation",
          "Sexual and asexual ways of producing new plants.",
          "jAKfatbrd_0",
          `## What is propagation?
**Plant propagation** is producing new plants from a parent plant.

## Sexual propagation (by seed)
- Uses **seeds**, formed when pollen fertilizes the ovule.
- **Advantages:** cheap, easy, produces many plants, seeds store well.
- **Disadvantages:** offspring may **differ** from the parent; some plants take long to bear fruit.
- Used for: rice, corn, vegetables like pechay, tomato and eggplant.

## Asexual (vegetative) propagation
Uses a part of the plant — stem, root or leaf. The new plant is **identical** to the parent.
- **Cutting** — a stem piece is planted to grow roots (kangkong, cassava, malunggay, roses)
- **Layering / marcotting** — roots are made to grow on a branch still attached to the parent (santol, chico, lanzones)
- **Grafting** — a **scion** (upper part) is joined to a **rootstock** (lower part) (mango, avocado)
- **Budding** — a single bud is joined to a rootstock (citrus, rubber)
- **Specialized parts** — **tubers** (potato), **bulbs** (onion), **runners** (strawberry), **suckers** (banana)

## Advantages of asexual propagation
- Keeps the **good traits** of the parent
- Plants **bear fruit earlier**
- Works for plants that produce few or no seeds (banana, pineapple)

## Key points
Choose seeds for many cheap plants; choose vegetative methods to keep a variety's quality.`,
          "Sexual propagation uses seeds; asexual propagation uses stems, roots or leaves (cutting, marcotting, grafting, budding) to produce plants identical to the parent.",
          [
            "What is the main difference between sexual and asexual propagation?",
            "Give an example of a plant propagated by marcotting.",
            "What are the scion and the rootstock in grafting?",
          ],
        ),
        tleLesson(
          "Preparing the Soil and Planting",
          "Land preparation, growing media and planting systems.",
          "yHbmER08koI",
          `## Land preparation
- **Clearing** — remove weeds, stones and debris
- **Plowing** — turn and loosen the soil to a depth of 15–20 cm
- **Harrowing** — break clods and level the field
- **Furrowing / making beds** — form rows or plots for planting

## Growing media for seedlings
A good mix holds water but drains well: commonly **1 part garden soil, 1 part sand, 1 part compost** (or carbonized rice hull). It should be free of pests and diseases.

## Methods of planting
- **Direct seeding** — seeds are sown right in the field (corn, mungbean)
  - **Broadcasting** — scattering seeds evenly
  - **Drilling** — dropping seeds in a continuous row
  - **Hill method** — a few seeds per hole at set distances
- **Transplanting** — seedlings are raised first, then moved to the field (rice, tomato, eggplant)

## Planting systems
- **Square** — equal distance between rows and between plants
- **Rectangular** — rows farther apart than plants in the row
- **Quincunx** — four plants in a square with a fifth in the center
- **Triangular / hexagonal** — fits more plants in an area

## Key points
Good soil preparation gives roots room to grow, controls weeds and helps water drain.`,
          "Prepare land by clearing, plowing, harrowing and furrowing. Seeds can be sown directly or raised as seedlings and transplanted.",
          [
            "Why is the soil harrowed after plowing?",
            "What is the difference between direct seeding and transplanting?",
            "Describe the quincunx planting system.",
          ],
        ),
      ],
      quiz: [
        q(
          "Which method of propagation produces plants identical to the parent?",
          ["Sowing seeds", "Cross-pollination", "Marcotting", "Broadcasting"],
          2,
          "Marcotting is asexual: the new plant grows from a branch of the parent, so it has exactly the same traits.",
        ),
        q(
          "In grafting, the upper part that will become the crown is the…",
          ["rootstock", "scion", "runner", "tuber"],
          1,
          "The scion is the upper part joined onto the rootstock, which supplies the roots.",
        ),
        q(
          "Banana is usually propagated using…",
          ["seeds", "suckers", "leaves", "bulbs"],
          1,
          "Bananas grown for food produce few or no viable seeds, so farmers plant the suckers that grow at the base of the mother plant.",
        ),
        q(
          "Which land preparation step breaks clods and levels the field?",
          ["Clearing", "Plowing", "Harrowing", "Irrigating"],
          2,
          "Harrowing comes after plowing; it breaks the clods the plow leaves and levels the soil.",
        ),
        q(
          "Scattering seeds evenly over the field is called…",
          ["drilling", "hill planting", "broadcasting", "transplanting"],
          2,
          "Broadcasting is the method of scattering seeds across the whole area.",
        ),
      ],
    },
    {
      title: "Industrial Arts: Basic Wiring",
      description: "Reading electrical plans and joining wires.",
      lessons: [
        tleLesson(
          "Electrical Symbols and Plans",
          "Reading the language of electrical drawings.",
          "TJ1U_jN2TnA",
          `## Why symbols?
Electrical plans use standard **symbols** so any electrician can understand where outlets, switches, lights and wires go. In the Philippines, plans follow the **Philippine Electrical Code (PEC)**.

## Common symbols
- **Lighting outlet / ceiling light** — a circle with a cross or a plain circle
- **Single-pole switch** — **S**
- **Three-way switch** — **S₃** (controls a light from two places)
- **Duplex convenience outlet** — a circle with two parallel lines
- **Panelboard** — a rectangle with diagonal shading
- **Home run to panel** — an arrow showing the wire returns to the panel
- **Wiring concealed in ceiling or wall** — a solid line; **concealed in floor** — a dashed line
- **Ground** — three lines decreasing in size

## Kinds of electrical diagrams
- **Pictorial diagram** — a realistic drawing of parts
- **Schematic diagram** — uses symbols to show how parts are connected
- **Wiring (line) diagram** — shows actual wire runs on a floor plan
- **Single-line diagram** — shows the power distribution from the meter to circuits

## Reading a plan
Find the **legend** first, then trace each circuit from the **panelboard** to every outlet and switch it feeds.

## Key points
Reading plans correctly prevents wrong connections and wasted materials.`,
          "Electrical plans use standard symbols (S for a switch, circles for lights and outlets). Always read the legend first, then trace circuits from the panelboard.",
          [
            "What does the symbol S₃ mean?",
            "What is the difference between a schematic and a pictorial diagram?",
            "Why should you read the legend first?",
          ],
        ),
        tleLesson(
          "Wire Splices and Joints",
          "Joining conductors strongly and safely.",
          "yScMj9gBWG4",
          `## Why splice?
A **splice** or **joint** connects two or more wires so current flows through without heat or loose contact. A good splice is **mechanically strong**, **electrically sound** and **well insulated**.

## Steps
- **Skin** the insulation with a knife or stripper at a shallow angle (like sharpening a pencil) so you don't nick the wire.
- **Clean** the bare conductor.
- **Twist** the wires tightly following the joint's pattern.
- **Solder** if required, then **tape** with electrical tape, overlapping each turn by half.

## Common splices and joints
- **Rattail (pigtail) joint** — joins wires inside a junction box; ends twisted together
- **Western Union short-tie splice** — joins two wires end to end; strong, for lines under tension
- **Western Union long-tie splice**
- **Tap (T) joint** — joins a branch wire to a main wire that continues
- **Knotted tap joint** — a tap with an extra knot for strength
- **Fixture joint** — joins a fixture wire to a branch circuit wire
- **Britannia splice** — for large, solid conductors

## Insulating
Wrap tape starting on the insulation of one side, across the joint, to the insulation of the other side, and back.

## Key points
A loose splice gets **hot** and can cause a **fire**. Work only on circuits that are switched off.`,
          "A good splice is strong, conducts well and is well insulated. Common joints include the rattail, Western Union and tap joints.",
          [
            "What three qualities make a good splice?",
            "Which joint is used inside junction boxes?",
            "Why is a loose splice dangerous?",
          ],
        ),
      ],
      quiz: [
        q(
          "In an electrical plan, the symbol S stands for a…",
          ["socket", "single-pole switch", "service entrance", "solder joint"],
          1,
          "S is the standard symbol for a single-pole switch; S₃ is a three-way switch.",
        ),
        q(
          "A three-way switch (S₃) lets you…",
          [
            "control three lights at once",
            "control one light from two places",
            "use three outlets",
            "change the voltage",
          ],
          1,
          "A pair of three-way switches controls one light from two locations, such as the top and bottom of a staircase.",
        ),
        q(
          "Which diagram uses symbols to show how parts are connected?",
          [
            "Pictorial diagram",
            "Schematic diagram",
            "Floor plan only",
            "Photograph",
          ],
          1,
          "A schematic diagram uses standard symbols to show connections, not how the parts look.",
        ),
        q(
          "Which joint connects a branch wire to a main wire that continues?",
          [
            "Rattail joint",
            "Tap joint",
            "Western Union splice",
            "Britannia splice",
          ],
          1,
          "A tap (T) joint branches off a continuing main wire. A rattail joins wire ends in a box; a Western Union joins two wires end to end.",
        ),
        q(
          "Why must insulation be skinned at a shallow angle?",
          [
            "To make it look neat",
            "To avoid nicking the conductor",
            "To save tape",
            "To make the wire longer",
          ],
          1,
          "Cutting straight down can nick the copper, which weakens the wire and creates a hot spot when current flows.",
        ),
      ],
    },
  ],
};
