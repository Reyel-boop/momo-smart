/**
 * TLE 8 – Agriculture and Fishery Arts, following the First Term of DepEd's
 * Grade 8 TLE (AFA / FCS / IA) Three-Term Budget of Work (updated April 7,
 * 2026): one unit per week, one lesson per learning competency. Each lesson
 * has a lecture video, a written lecture, activities and a self-check; every
 * unit has five Unit Questions.
 */
import type { DemoLesson, DemoSubject, DemoUnit } from "../grade10";
import { q, TLE_DEPARTMENT } from "./common";

/**
 * The lecture video for each lesson (YouTube id). Each was checked to exist
 * and allow embedding, and chosen for covering the lesson’s topic — mostly
 * Grade 8 TLE (MATATAG) lessons recorded by Filipino teachers.
 */
export const AFA_VIDEOS: Record<string, string> = {
  "Aquaculture and Fisheries": "BAfmTUoZSus", // TLE 8 Aquaculture and Fisheries — maestrider_phine
  "Career and Business Opportunities in Fisheries": "S-WYcnjbqWw", // Career and Business Opportunities — Teacher Julie
  "Phases of Fish Culture": "_xFWpxotxfU", // Phases of Fish Culture — maestrider_phine
  "Common Fishes According to Their Habitat": "LvU1cypiZiw", // Classification of Fish According to their Habitat — maestrider_phine
  "Republic Act 10654": "n9Zju_74f8I", // Republic Act 10654 — ICF Online
  "Fish Species in the Philippines": "QYf5JNfM6fY", // Aquaculture and Fish Capture — Teacher Julie
  "Occupational Safety and Health Hazards in Fisheries": "7-vWIm4_JEE", // OSH hazards in Fisheries — maestrider_phine
  "Organic Aquaculture": "8H8TEsJnbWY", // Advantages and Disadvantages of Organic Aquaculture — maestrider_phine
  "Aquaculture Methods and Practices": "myMd1HEUADg", // Aquaculture Methods and Practices — maestrider_phine
  "Area and Depth Requirements of Aquaculture Facilities": "VSNMXJMmqP0", // Freshwater & Brackish Water Environment — maestrider_phine
  "Tools and Equipment in Aquaculture": "jaHEXF7LOTk", // Tools and Equipment Used in Aquaculture — maestrider_phine
  "Fishing Gears Used for Catching Fish": "bxbHUYXQuNo", // Fishing Gears Used for Catching Fish — maestrider_phine
  "Making a Simple Hand Line": "B4vogz3SOkw", // How To Rig a Fishing Hand Line — DropForgedSurvival
  "Basic Fishing Bait Methods": "m2wY-K9WRfg", // Basic Fishing Bait Methods — maestrider_phine
  "Post-Harvest Handling Activities": "JTJKosn3N40", // Post Harvest Handling Activities — maestrider_phine
  "Sorting, Grading and Storing Fish": "HUraP73QxHQ", // Fish harvest and post harvest treatment — WorldFish
  "The Importance of Food Processing": "ln5WK51Bwi4", // Importance of Food Processing — maestrider_phine
  "Food Processing as a Career and a Business": "CFv9rQiNP_8", // Food Processing: Importance, Opportunities — Teacher Aisa
  "Raw Materials in Food Processing": "LXpUWXa0nvU", // Classification of Ingredients Used in Food Processing — maestrider_phine
  "Ingredients Used in Food Processing": "waoqCZh419o", // Ingredients Used for Food Processing — maestrider_phine
  "Methods of Food Processing": "CCagCEj2ck0", // Different Methods of Food Processing — eFiles2GO
  "Tools and Equipment in Food Processing": "SlhnrHfrHAo", // Tools and Equipment in Food Processing — maestrider_phine
  "Quantification in Food Processing": "Jbb8Z25Yzvc", // Recipe Quantification and Standard Weight Percentage — maestrider_phine
  "Packaging Materials for Processed Food": "heeEZzfhEX0", // Packaging and Labeling of Food Products — maestrider_phine
  "Designing a Label for Processed Food": "OZOIEYQ0axo", // Food labelling — BBC Bitesize for Teachers
};

const lesson = (
  title: string,
  summary: string,
  lecture: string,
  reading: string,
  questions: string[],
): DemoLesson => ({
  title,
  summary,
  reading,
  questions,
  lecture: { videoId: AFA_VIDEOS[title] ?? "", lecture },
});

const UNITS: DemoUnit[] = [
  // Week 1
  {
    title: "Introduction to Aquaculture and Fisheries",
    description:
      "Aquaculture and fisheries, their careers, the phases of fish culture, and fishes by habitat.",
    lessons: [
      lesson(
        "Aquaculture and Fisheries",
        "How we get fish: catching it, or farming it.",
        `## Fisheries
**Fisheries** is the catching of fish and other aquatic animals from the wild — seas, rivers and lakes. It is like **hunting**: fishers go where the fish are.
- **Municipal fishing** — small boats (bancas) in waters near the shore
- **Commercial fishing** — larger vessels farther out at sea

## Aquaculture
**Aquaculture** is the **farming** of fish, crustaceans (shrimp, crabs), mollusks (oysters, mussels) and seaweeds in controlled areas such as ponds, cages and tanks. It is like **farming on land**: the farmer stocks, feeds, protects and harvests.

## How they are related
- Both supply **fish for food**, income and jobs
- Wild catches are limited and many fishing grounds are **overfished**, so aquaculture grows to meet demand
- Aquaculture often depends on fisheries — for example wild-caught fry and fish meal for feeds
- Both are guided by the **Bureau of Fisheries and Aquatic Resources (BFAR)**

## A short background
Fish farming is thousands of years old — carp were raised in ancient China. In the Philippines, **bangus (milkfish)** has been raised in brackish-water fishponds for centuries, and today the country is among the world's leading aquaculture producers, especially of **seaweeds**, bangus, tilapia and shrimp.

## Key points
Fisheries **catches** fish from the wild; aquaculture **raises** them. Together they feed the country.`,
        "Make a Venn diagram comparing fisheries and aquaculture. List three fish or seafood your family eats and say whether each was most likely caught or farmed.",
        [
          "What is the difference between fisheries and aquaculture?",
          "Why is aquaculture growing around the world?",
          "Which government agency is in charge of fisheries in the Philippines?",
        ],
      ),
      lesson(
        "Career and Business Opportunities in Fisheries",
        "Jobs and businesses in fishing and fish farming.",
        `## Careers
- **Fishpond technician / caretaker** — feeds fish, checks water and stock
- **Hatchery technician** — breeds fish and raises fry
- **Fisherman / boat crew** and **fishing boat captain**
- **Fish processor** — cleans, dries, smokes and packs fish
- **Aquaculturist / fisheries technologist** — plans and manages farms (BS Fisheries)
- **Fisheries extension worker** (BFAR, local government) — teaches farmers and fisherfolk
- **Quality inspector** — checks freshness and safety of fish
- **Researcher** and **marine biologist**

## Business opportunities
- **Tilapia, bangus or hito (catfish) grow-out** in ponds or cages
- **Fingerling production** — selling young fish to other farmers
- **Seaweed farming** and **mussel or oyster farming**
- **Fish processing** — tuyo, daing, tinapa, fish balls, bottled sardines
- **Fish feed** and **fishing supplies** stores
- **Fish trading** — buying from farms and selling in markets

## What you need
Knowledge of fish care, honesty, hard work, simple bookkeeping and the right **permits** (from the LGU and BFAR). TESDA offers courses such as **Aquaculture NC II** and **Fish Capture NC II**.

## Key points
Fisheries offers jobs from the farm to the market — and many can start as small family businesses.`,
        "Interview a fish vendor, fishpond worker or fisherfolk in your community (or research one online): what do they do, what skills do they need, and how do they earn? Present a career profile.",
        [
          "Give three careers in fisheries and what each person does.",
          "What business could a family start with a small fishpond?",
          "Which TESDA qualification is related to fish farming?",
        ],
      ),
      lesson(
        "Phases of Fish Culture",
        "From egg to market-size fish.",
        `## The phases
**1. Hatchery (breeding)**
- Healthy mature fish called **broodstock** (or breeders) are spawned
- Eggs hatch into **larvae**, which are fed tiny natural food (plankton) until they become **fry**

**2. Nursery**
- **Fry** are raised in small ponds, tanks or **hapa nets** until they become **fingerlings** (finger-sized)
- They need clean water, protection from predators, and fine feed

**3. Grow-out**
- **Fingerlings** are stocked in bigger ponds, cages or pens and fed until they reach **marketable size**
- Farmers watch water quality, feeding, growth and fish health

**4. Harvest and post-harvest**
- Fish are caught, sorted, iced and brought to market

## Example: tilapia
Breeders spawn → fry in a nursery hapa for about 3–4 weeks → fingerlings stocked in a grow-out pond for about 4 months → harvested at around 200–300 grams each.

## Key points
Hatchery → nursery → grow-out → harvest. Each phase needs different care, and good care in the early phases means more fish survive to harvest.`,
        "Draw the life cycle of a farmed fish (bangus or tilapia) showing the hatchery, nursery and grow-out phases with what happens in each.",
        [
          "What are broodstock?",
          "In which phase do fry become fingerlings?",
          "What happens in the grow-out phase?",
        ],
      ),
      lesson(
        "Common Fishes According to Their Habitat",
        "Freshwater, brackish water and marine fishes.",
        `## Freshwater fishes
Live in **fresh water** (almost no salt): rivers, lakes, ponds, rice fields.
- **Tilapia**, **carp**, **hito (catfish)**, **dalag (mudfish)**, **gourami**, **ayungin**
- Endemic to the Philippines: **tawilis** (Taal Lake — the world's only freshwater sardine) and **sinarapan** (Lake Buhi — one of the world's smallest fishes)

## Brackish-water fishes
Live where **fresh water mixes with seawater**: river mouths (estuaries), mangroves and coastal fishponds.
- **Bangus (milkfish)**, **sugpo (tiger prawn)**, **alimango (mud crab)**, **apahap (sea bass)**
- Many can tolerate changes in salinity

## Marine fishes
Live in **salt water**: seas and oceans, coral reefs.
- **Lapu-lapu (grouper)**, **maya-maya (snapper)**, **tuna**, **galunggong (round scad)**, **tamban (sardine)**, **tanigue**
- Also **seaweeds**, **tahong (mussels)** and **talaba (oysters)** grow in marine and brackish coastal waters

## Salinity
**Salinity** is the amount of salt in water, in parts per thousand (ppt): fresh water about 0–0.5 ppt, brackish water about 0.5–30 ppt, seawater about 35 ppt.

## Key points
A fish's habitat tells you where it lives and where it can be farmed — freshwater fish in fresh ponds and lakes, brackish fish in coastal ponds, marine fish in the sea.`,
        "Make a three-column chart (freshwater, brackish, marine) and list at least five fishes or seafood in each, with their local names.",
        [
          "What is brackish water?",
          "Give two freshwater and two marine fishes.",
          "Why is tawilis special?",
        ],
      ),
    ],
    quiz: [
      q(
        "Raising fish in ponds, cages or tanks is called…",
        ["fisheries", "aquaculture", "agriculture", "horticulture"],
        1,
        "Aquaculture is the farming of fish and other aquatic organisms in controlled areas.",
      ),
      q(
        "Which phase raises fingerlings until they reach marketable size?",
        ["Hatchery", "Nursery", "Grow-out", "Spawning"],
        2,
        "In the grow-out phase, fingerlings are fed until they are big enough to sell.",
      ),
      q(
        "Bangus (milkfish) is commonly raised in…",
        [
          "brackish-water fishponds",
          "mountain springs",
          "only the deep ocean",
          "desert ponds",
        ],
        0,
        "Bangus tolerates salinity changes and is traditionally farmed in coastal brackish ponds.",
      ),
      q(
        "Which is a freshwater fish?",
        ["Lapu-lapu", "Tuna", "Tilapia", "Galunggong"],
        2,
        "Tilapia lives in fresh water; lapu-lapu, tuna and galunggong are marine fishes.",
      ),
      q(
        "Which agency manages fisheries in the Philippines?",
        ["DepEd", "BFAR", "DPWH", "PAGASA"],
        1,
        "The Bureau of Fisheries and Aquatic Resources (BFAR) manages the country's fisheries.",
      ),
    ],
  },
  // Week 2
  {
    title: "Fisheries Law, Species, Safety and Organic Aquaculture",
    description:
      "RA 10654, fish species in the Philippines, OSH hazards in fisheries, and organic aquaculture.",
    lessons: [
      lesson(
        "Republic Act 10654",
        "The law that protects the country's fisheries.",
        `## What is RA 10654?
**Republic Act No. 10654** (2015) amended the **Philippine Fisheries Code of 1998 (RA 8550)**. Its purpose is to **prevent, deter and eliminate illegal, unreported and unregulated (IUU) fishing**, so fish remain for future generations.

## Important provisions
- **Municipal waters** — waters up to **15 kilometers** from the shoreline are managed by the city or municipality and are reserved mainly for **municipal (small-scale) fisherfolk**
- **Licenses and permits** — fishing vessels and fishers must be registered and licensed
- **Prohibited fishing methods**:
  - using **explosives** (dynamite) or **noxious and poisonous substances** (cyanide)
  - **electrofishing**
  - using **fine-mesh nets** that catch young fish
  - **muro-ami** and other methods that destroy coral reefs
- **Protected areas** — fishing in **fish sanctuaries** and marine protected areas is not allowed
- **Protected species** — catching or selling endangered species (such as sea turtles and whale sharks) is prohibited
- **Closed seasons** — fishing for some species is stopped during spawning season
- **Higher penalties** — large fines, confiscation of catch and gear, and imprisonment
- **Monitoring** — vessel monitoring, catch reports and the participation of **FARMCs** (Fisheries and Aquatic Resources Management Councils)

## Why it matters
Illegal fishing destroys reefs, kills young fish and takes fish away from honest small fishers.

## Key points
RA 10654 strengthens the Fisheries Code: protect municipal waters, use legal gear, respect sanctuaries and protected species.`,
        'Read selected sections of RA 10654 with your group. Make a poster of "Bawal" (prohibited) fishing practices and explain why each is harmful.',
        [
          "Which law did RA 10654 amend?",
          "How far from the shoreline do municipal waters extend?",
          "Name three fishing methods prohibited by law.",
        ],
      ),
      lesson(
        "Fish Species in the Philippines",
        "The fishes and seafood that feed the nation.",
        `## A rich fishing nation
The Philippines lies in the **Coral Triangle**, the center of marine biodiversity in the world, with thousands of fish species.

## Important farmed species
- **Bangus (milkfish, *Chanos chanos*)** — the most widely farmed fish, often called the national fish
- **Tilapia** — the main freshwater farmed fish
- **Sugpo (tiger prawn)** and **hipon (shrimp)**
- **Seaweeds** (*Kappaphycus*, *Eucheuma*) — a top export, used for carrageenan
- **Tahong (green mussel)** and **talaba (oyster)**
- **Hito (catfish)**, **carp**, **lapu-lapu (grouper)** and **alimango (mud crab)**

## Important captured species
- **Galunggong (round scad)** — a staple fish for many families
- **Tamban (sardines)**, **tuna** (General Santos City is the "Tuna Capital"), **tulingan (frigate tuna)**, **dilis (anchovy)**, **pusit (squid)**

## Endemic and protected species
- **Tawilis** (Taal Lake) and **sinarapan** (Lake Buhi) — found only in the Philippines
- **Whale shark (butanding)** and **sea turtles** — protected by law

## Key points
Knowing our fish species helps us farm, catch and protect them wisely.`,
        "Make an illustrated catalog of 10 Philippine fish species: local name, common name, habitat, and whether it is farmed, caught or protected.",
        [
          "Which fish is often called the national fish of the Philippines?",
          "Why is the Philippines so rich in marine species?",
          "Give one endemic and one protected species.",
        ],
      ),
      lesson(
        "Occupational Safety and Health Hazards in Fisheries",
        "The dangers of fisheries work and how to prevent accidents.",
        `## What is OSH?
**Occupational Safety and Health (OSH)** protects workers from injury and illness at work. Fisheries is among the most dangerous jobs because people work **on water**, with **sharp tools** and **heavy loads**, in **all kinds of weather**.

## Kinds of hazards
- **Physical** — drowning, slipping on wet surfaces, falling overboard, strong waves, too much sun (heat stroke), noise from engines
- **Mechanical** — hooks, knives, fish spines and fins, winches and moving engine parts
- **Chemical** — fuel, lubricants, pond chemicals, disinfectants (misusing chemicals such as formalin on fish is also illegal and dangerous)
- **Biological** — bacteria and parasites from fish and water, stings (stonefish, jellyfish), bites, infected wounds
- **Ergonomic** — lifting heavy nets and boxes, bending for long periods
- **Electrical** — pumps and aerators near water

## Safety practices
- Wear a **life vest** on boats; never fish alone; check the **weather**
- Use **PPE**: boots with good grip, gloves, hat and long sleeves
- Handle hooks and knives carefully; keep a **first-aid kit**
- Lift with your legs, not your back; ask for help with heavy loads
- Keep electrical equipment dry and grounded
- Wash hands after handling fish and chemicals

## Key points
Identify the hazard, use the right protection, and never take shortcuts with safety on the water.`,
        "Hazard hunt: look at a picture of a fishing boat or fishpond and list the hazards you see, the kind of hazard, and how to control each one.",
        [
          "Give one example each of a physical, biological and chemical hazard in fisheries.",
          "Why must fishers wear a life vest?",
          "How should you lift a heavy box of fish?",
        ],
      ),
      lesson(
        "Organic Aquaculture",
        "Raising fish naturally — its benefits and limits.",
        `## What is organic aquaculture?
**Organic aquaculture** raises fish and other aquatic organisms **without synthetic chemicals, antibiotics, growth hormones or genetically modified organisms**, using natural feeds and caring for the environment and the animals' welfare. In the Philippines, organic production follows the **Organic Agriculture Act (RA 10068, amended by RA 11511)** and needs **certification**.

## Practices
- **Organic or natural feeds** (plankton, organic pellets, kitchen and farm by-products that are safe)
- **Lower stocking density** — fewer fish per area, so they are less stressed
- **Natural disease prevention** — clean water, good pond preparation, herbal remedies
- **Organic fertilizers** (composted manure) to grow natural food in ponds
- **Integrated systems** — rice-fish culture, or using pond water to irrigate vegetables

## Advantages
- **Safer, chemical-free** fish for consumers
- **Less pollution** of rivers and seas; healthier ecosystems
- **Higher price** — organic products sell at a premium
- Better **animal welfare**

## Disadvantages
- **Lower yield** because of lower stocking density
- **Higher costs** for organic feeds and for certification
- **More labor** and careful management
- **Higher risk** of losses from disease, since antibiotics can't be used
- **Longer growing time**

## Key points
Organic aquaculture trades higher volume for safer food and a cleaner environment.`,
        "Make a T-chart of the advantages and disadvantages of organic aquaculture, then write whether you would choose it for a small family fishpond and why.",
        [
          "What substances are not used in organic aquaculture?",
          "Give two advantages and two disadvantages of organic aquaculture.",
          "Why do organic fish usually sell at a higher price?",
        ],
      ),
    ],
    quiz: [
      q(
        "RA 10654 amended which law?",
        [
          "The Philippine Fisheries Code of 1998 (RA 8550)",
          "The Clean Air Act",
          "The Labor Code",
          "The Data Privacy Act",
        ],
        0,
        "RA 10654 (2015) amended RA 8550 to fight illegal, unreported and unregulated fishing.",
      ),
      q(
        "Which fishing method is prohibited by law?",
        [
          "Hook and line",
          "Using dynamite or cyanide",
          "Using a legal gill net with the right mesh",
          "Fish farming in ponds",
        ],
        1,
        "Explosives and poisonous substances destroy reefs and kill young fish, so they are banned.",
      ),
      q(
        "Which fish is the most widely farmed in the Philippines and often called the national fish?",
        ["Tuna", "Bangus (milkfish)", "Galunggong", "Lapu-lapu"],
        1,
        "Bangus (Chanos chanos) is the country's most widely farmed fish.",
      ),
      q(
        "A fish spine pricking your hand is what kind of hazard?",
        ["Electrical", "Mechanical/physical", "Chemical", "Noise"],
        1,
        "Sharp spines, hooks and knives are mechanical (physical) hazards.",
      ),
      q(
        "Which is a DISADVANTAGE of organic aquaculture?",
        [
          "Chemical-free fish",
          "Less pollution",
          "Lower yield and higher costs",
          "Higher selling price",
        ],
        2,
        "Lower stocking densities and organic feeds mean smaller harvests and higher costs.",
      ),
    ],
  },
  // Week 3
  {
    title: "Aquaculture Methods and Facilities",
    description:
      "Aquaculture methods and practices, and the area and depth requirements of facilities.",
    lessons: [
      lesson(
        "Aquaculture Methods and Practices",
        "The systems and facilities used to farm fish.",
        `## By intensity
- **Extensive** — few fish per area; fish eat **natural food** grown by sunlight and fertilizer; low cost, low yield (traditional bangus ponds)
- **Semi-intensive** — more fish; natural food **plus supplemental feeds**; moderate cost and yield
- **Intensive** — many fish per area; **complete commercial feeds**, **aeration** and close water management; high cost, high yield, higher risk

## By facility
- **Fishponds** — earthen ponds with dikes and gates; fresh or brackish water
- **Fish cages** — net enclosures **floating** in lakes, rivers or the sea (tilapia in Laguna de Bay and Taal Lake; bangus in sea cages)
- **Fish pens** — net enclosures **fixed to the bottom** with poles in shallow water
- **Tanks** — concrete, plastic or canvas; good for hatcheries and small farms
- **Raceways** — long channels with flowing water
- **Recirculating aquaculture systems (RAS)** — tanks with water filtered and reused

## Selected practices
- **Monoculture** — one species only
- **Polyculture** — several compatible species together (bangus + tilapia + shrimp)
- **Integrated aquaculture** — combined with farming: **rice-fish culture**, chicken or duck over fishponds, **aquaponics** (fish + vegetables)
- **Aquasilviculture** — fish or crabs raised among mangroves, protecting the forest

## Key points
Choose the method by species, water source, capital and skill — from simple extensive ponds to high-tech intensive tanks.`,
        "Choose one aquaculture method and make a model or labeled drawing of it. Explain what species fit it and why.",
        [
          "What is the difference between extensive and intensive aquaculture?",
          "What is the difference between a fish cage and a fish pen?",
          "What is polyculture? Give an example.",
        ],
      ),
      lesson(
        "Area and Depth Requirements of Aquaculture Facilities",
        "Planning the size and water depth of ponds and cages.",
        `## Choosing a site
- Reliable supply of **clean water** (fresh, brackish or sea)
- **Clay or clay-loam soil** that holds water (for earthen ponds)
- Safe from **floods** and pollution; accessible by road; near markets
- For cages: good **water current** and enough depth, away from river mouths that bring silt

## Pond parts and sizes
- **Nursery ponds** — small, about a few hundred square meters, for fry
- **Grow-out ponds** — larger, often 1,000 to 10,000 m² (0.1 to 1 hectare)
- **Dikes** (embankments), **gates** for water in and out, and a **catch basin** for harvesting

## Typical water depths
- **Nursery ponds:** about 0.5–1.0 m
- **Grow-out fishponds:** about 1.0–1.5 m for tilapia; brackish bangus ponds are often 0.5–1.0 m
- **Fish cages:** the bottom of the net should hang well above the lake or sea floor (at least 1–2 m clearance) so wastes are carried away and fish stay healthy
- Too **shallow** → water heats up, weeds grow, predators enter; too **deep** → poor sunlight for natural food, hard to harvest

## Computing area and volume
- **Area** of a rectangular pond = **length × width**
- **Water volume** = **length × width × depth**

Example: a pond 20 m long and 15 m wide, filled to 1.2 m:
- Area = 20 × 15 = **300 m²**
- Volume = 300 × 1.2 = **360 m³**

## Stocking
The number of fish to stock depends on the area and method. At 3 tilapia fingerlings per m², a 300 m² pond takes 300 × 3 = **900 fingerlings**.

## Key points
Plan the site, size and depth before digging — the right area and depth keep fish healthy and make management easy.`,
        "Measure (or use given dimensions of) a pond or tank. Compute its area, water volume and how many fingerlings it can hold at a given stocking rate.",
        [
          "Why should a fishpond not be too shallow?",
          "A pond is 25 m by 10 m and 1 m deep. Compute its area and volume.",
          "What kind of soil is best for earthen ponds?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which method uses many fish per area, complete feeds and aeration?",
        ["Extensive", "Semi-intensive", "Intensive", "Organic"],
        2,
        "Intensive culture stocks the most fish and relies on full feeding and aeration.",
      ),
      q(
        "A net enclosure that FLOATS in a lake or the sea is a…",
        ["fish pen", "fish cage", "raceway", "dike"],
        1,
        "Fish cages float; fish pens are fixed to the bottom with poles.",
      ),
      q(
        "Raising bangus, tilapia and shrimp together in one pond is…",
        ["monoculture", "polyculture", "aquasilviculture", "hatchery"],
        1,
        "Polyculture raises several compatible species together.",
      ),
      q(
        "A pond is 20 m long and 15 m wide. What is its area?",
        ["35 m²", "300 m²", "150 m²", "3,000 m²"],
        1,
        "Area = length × width = 20 × 15 = 300 m².",
      ),
      q(
        "A pond of 300 m² is filled to 1.2 m. What is the water volume?",
        ["301.2 m³", "250 m³", "360 m³", "3,600 m³"],
        2,
        "Volume = area × depth = 300 × 1.2 = 360 m³.",
      ),
    ],
  },
  // Week 4
  {
    title: "Tools, Equipment and Fishing Gears",
    description:
      "The tools and equipment used in aquaculture and the gears used to catch fish.",
    lessons: [
      lesson(
        "Tools and Equipment in Aquaculture",
        "What fish farmers use and how to care for it.",
        `## Handling and harvesting
- **Scoop net (salok)** — small net with a handle for catching a few fish
- **Seine net** — long net dragged through the pond to harvest
- **Hapa net** — fine net enclosure for nursing fry
- **Basins, pails and plastic crates** — carrying fish
- **Fish transport bags with oxygen** — moving live fry and fingerlings

## Water quality
- **Thermometer** — water temperature
- **pH meter or test kit** — acidity (fish prefer about pH 6.5–8.5)
- **Dissolved oxygen (DO) meter** — oxygen in the water
- **Refractometer or salinometer** — salinity in brackish and sea water
- **Secchi disk** — water clarity (how much plankton)

## Feeding and growth
- **Weighing scale** — weighing feeds and sample fish
- **Feeding trays** and **feed scoops**
- **Measuring board** — measuring fish length

## Pond equipment
- **Aerators and air pumps** — add oxygen
- **Water pumps** — fill and drain ponds
- **Shovels, hoes, wheelbarrows** — pond preparation and dike repair
- **Banca (small boat)** — for cages and large ponds

## Care and maintenance
Wash and dry nets after use and mend holes; rinse meters with clean water and store them properly; check pumps and aerators regularly and keep them dry and grounded; keep tools in a clean, dry storage area.

## Key points
The right tool, used properly and maintained well, saves fish, time and money.`,
        "Make a tools and equipment chart: picture, name, use, and how to maintain it. Group them into handling, water quality, feeding and pond equipment.",
        [
          "What is a hapa net used for?",
          "Which instrument measures the salinity of water?",
          "How should nets be cared for after use?",
        ],
      ),
      lesson(
        "Fishing Gears Used for Catching Fish",
        "The gears fishers use, from simple lines to big nets.",
        `## Hook and line
- **Hand line** — a line, hook and sinker held by hand
- **Rod and reel** — a pole with a reel to cast and retrieve
- **Multiple hook and line / long line** — many hooks on one main line

## Nets
- **Gill net (pukot)** — a wall of net; fish are caught by the gills; mesh size decides the size of fish caught
- **Cast net (dala/laya)** — a round net thrown by hand over fish in shallow water
- **Beach seine** — a long net pulled to shore
- **Lift net (bagnet/basnig)** — lowered under lights at night and lifted with the fish
- **Purse seine** and **trawl** — large commercial nets used from big vessels (trawling is restricted in municipal waters)

## Traps and barriers
- **Fish pot / trap (bubo)** — a basket trap fish enter but can't leave
- **Fish corral (baklad)** — fences of bamboo and net that guide fish into a catching chamber
- **Crab lift nets (bintol)**

## Responsible fishing
Use **legal gears** with the **right mesh size**, so young fish escape and grow. Never use explosives, poison or fine-mesh nets.

## Key points
Gears are chosen by the fish targeted, the place, and the law — use the gear that catches fish without destroying the future catch.`,
        "Make a picture dictionary of 8 fishing gears used in your area, with local names, how each works, and the fish it catches.",
        [
          "How does a gill net catch fish?",
          "What is a fish corral (baklad)?",
          "Why does the mesh size of a net matter?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which instrument measures the acidity of pond water?",
        ["Secchi disk", "pH meter", "Weighing scale", "Scoop net"],
        1,
        "A pH meter or test kit measures how acidic or basic the water is.",
      ),
      q(
        "A fine net enclosure used to nurse fry is a…",
        ["hapa net", "trawl", "purse seine", "fish corral"],
        0,
        "Hapa nets hold fry safely in a pond or tank during the nursery phase.",
      ),
      q(
        "A round net thrown by hand over fish in shallow water is a…",
        ["gill net", "cast net (dala)", "long line", "fish pot"],
        1,
        "The cast net (dala/laya) is thrown so it spreads and sinks over the fish.",
      ),
      q(
        "Why should nets have the right mesh size?",
        [
          "So they look nice",
          "So young fish can escape and grow",
          "So they float",
          "So they are cheaper",
        ],
        1,
        "Proper mesh lets juveniles escape, protecting future catches.",
      ),
      q(
        "A basket trap that fish can enter but not leave is a…",
        ["bubo (fish pot)", "bagnet", "seine", "rod and reel"],
        0,
        "The bubo is a fish pot or trap with a funnel entrance.",
      ),
    ],
  },
  // Week 5
  {
    title: "Making a Simple Hand Line",
    description: "Making a hand line safely, step by step.",
    lessons: [
      lesson(
        "Making a Simple Hand Line",
        "Rigging a hand line following safety precautions.",
        `## Materials
- **Monofilament fishing line** (for example 10–20 lb test for small fish)
- **Hooks** of a size that fits the target fish
- **Sinker** (weight) to take the bait down
- **Swivel** to keep the line from twisting (optional)
- **Float (bobber)** for fishing near the surface (optional)
- **Line holder** — a wooden frame, a plastic spool, or a used bottle or can
- **Line cutter or small scissors**

## Steps
- **Wind** 20–30 m of line around the holder; tie the end firmly to it
- Tie a **swivel** to the free end with an **improved clinch knot** (thread the line through the eye, twist 5–7 times, pass the end back through the loop, wet and pull tight)
- Tie about 30–50 cm of line (the **leader**) to the other end of the swivel
- Tie the **hook** to the leader with an improved clinch knot
- Attach the **sinker** above the swivel (or about 20–30 cm above the hook)
- Add a **float** if you want the bait to stay off the bottom
- **Trim** the extra line ends neatly

## Using the hand line
Bait the hook, unwind some line, toss or lower it into the water, and hold the line between your fingers to feel the bite. When a fish bites, pull firmly and wind the line back steadily.

## Safety precautions
- Keep hooks **covered** or stuck in the holder when not in use
- **Never** cut line with your teeth — use a cutter
- Wet knots before tightening so the line doesn't burn and weaken
- Wrap the line around the holder, **not** around your fingers or hand
- Watch out for people around you when tossing the line
- Collect cut line and old hooks — never leave them in the water or on the shore

## Key points
Wind, tie, attach, trim — and handle hooks and line safely. A well-made hand line is cheap, simple and effective.`,
        "Make your own simple hand line following the steps and safety precautions. Your teacher will check the knots, the parts and how safely you worked (performance task).",
        [
          "List the materials needed for a hand line.",
          "Why should you never cut fishing line with your teeth?",
          "What does the swivel do?",
        ],
      ),
    ],
    quiz: [
      q(
        "What part takes the bait down into the water?",
        ["Float", "Sinker", "Swivel", "Holder"],
        1,
        "The sinker's weight carries the bait down.",
      ),
      q(
        "What does a swivel do?",
        [
          "Keeps the line from twisting",
          "Makes the line float",
          "Sharpens the hook",
          "Catches bait",
        ],
        0,
        "A swivel turns freely so the line doesn't twist.",
      ),
      q(
        "What is the safest way to cut fishing line?",
        [
          "With your teeth",
          "With a line cutter",
          "By burning it",
          "By pulling hard",
        ],
        1,
        "Use a cutter; biting line can hurt teeth and lips.",
      ),
      q(
        "Why wet a knot before pulling it tight?",
        [
          "To make it slippery forever",
          "So friction doesn't heat and weaken the line",
          "To clean the hook",
          "To make the fish come",
        ],
        1,
        "Wetting reduces friction heat that can weaken monofilament.",
      ),
      q(
        "What should be done with old hooks and cut line?",
        [
          "Throw them in the water",
          "Leave them on the shore",
          "Collect and dispose of them properly",
          "Give them to the fish",
        ],
        2,
        "Discarded line and hooks injure people and wildlife, so they must be disposed of properly.",
      ),
    ],
  },
  // Week 6
  {
    title: "Bait Methods and Post-Harvest Handling",
    description: "Using bait to catch fish, and handling fish after harvest.",
    lessons: [
      lesson(
        "Basic Fishing Bait Methods",
        "Natural and artificial baits and how to use them.",
        `## Natural bait
Real food that fish eat:
- **Worms** (earthworms, sea worms) — good for most freshwater and many marine fish
- **Small shrimp, squid strips and small fish** (live or dead) — for marine and predatory fish
- **Dough or bread** — for tilapia and carp
- **Insects** — crickets, larvae

## Artificial bait (lures)
Made to look or move like food:
- **Jigs** — weighted hooks with feathers or soft bodies moved up and down
- **Spoons and spinners** — metal lures that flash and wobble
- **Soft plastic lures** — look like worms or small fish
- **Squid jigs (pang-pusit)** for squid

## Methods
- **Bottom fishing** — the bait rests near the bottom with a sinker
- **Float fishing** — a float holds the bait at a chosen depth and shows the bite
- **Jigging** — moving a lure up and down
- **Trolling** — pulling a lure behind a moving boat
- **Chumming** — scattering small bits of food to attract fish to the area

## Tips
Match the bait to the fish; keep live bait fresh and alive; hide the hook point inside soft bait; change bait when it gets washed out.

## Key points
The right bait in the right place at the right depth brings the fish to your hook.`,
        "Try (or demonstrate) two bait methods. Record which bait and method attracted more fish or bites, and explain why.",
        [
          "What is the difference between natural bait and a lure?",
          "What is chumming?",
          "Which bait would you use for tilapia?",
        ],
      ),
      lesson(
        "Post-Harvest Handling Activities",
        "Keeping fish fresh from the water to the table.",
        `## Why it matters
Fish **spoil quickly** in our warm climate — bacteria and enzymes break down the flesh within hours. Good post-harvest handling keeps fish **fresh, safe and valuable**.

## Post-harvest activities
- **Harvesting** carefully — avoid bruising and crushing
- **Washing** in clean water to remove mud, slime and blood
- **Killing quickly** and (for some fish) **bleeding and gutting** to slow spoilage
- **Chilling immediately** with **ice** — the most important step
- **Sorting** by species and **grading** by size and quality
- **Packing** in clean, insulated containers with enough ice
- **Transporting** quickly, shaded from the sun
- **Storing** chilled or frozen until sold or processed

## Rules of good handling
- Keep fish **cold, clean and careful** (the 3 C's)
- Use **clean** boxes, tools and water
- Never leave fish in the **sun**
- Never use **formalin** or other chemicals to make fish look fresh — it is illegal and dangerous to health

## Key points
Ice early, handle gently, keep everything clean — fresh fish sells better and is safer to eat.`,
        "Make a flowchart of post-harvest handling from harvest to market, with one safety or quality tip for each step.",
        [
          "Why do fish spoil quickly in the Philippines?",
          "What are the 3 C's of fish handling?",
          "Why is using formalin on fish prohibited?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which is an artificial bait?",
        ["Earthworm", "Squid strip", "Metal spoon lure", "Bread dough"],
        2,
        "Spoons, jigs and soft plastics are artificial lures.",
      ),
      q(
        "Scattering small bits of food to attract fish is called…",
        ["trolling", "chumming", "jigging", "seining"],
        1,
        "Chumming draws fish to the area where you are fishing.",
      ),
      q(
        "The most important step to keep harvested fish fresh is…",
        [
          "leaving them in the sun",
          "chilling them with ice right away",
          "adding formalin",
          "keeping them in a closed bag without ice",
        ],
        1,
        "Ice slows the bacteria and enzymes that spoil fish.",
      ),
      q(
        "Which are the 3 C's of fish handling?",
        [
          "Cold, clean, careful",
          "Cook, cut, carry",
          "Cheap, cool, close",
          "Count, catch, cast",
        ],
        0,
        "Keep fish cold, keep everything clean, and handle with care.",
      ),
      q(
        "Using formalin to make fish look fresh is…",
        [
          "recommended",
          "illegal and harmful to health",
          "required by BFAR",
          "a kind of bait",
        ],
        1,
        "Formalin is toxic; using it on food is prohibited.",
      ),
    ],
  },
  // Week 7
  {
    title: "Sorting, Grading and Storing Fish",
    description:
      "Sorting, grading and storing fish following safety precautions.",
    lessons: [
      lesson(
        "Sorting, Grading and Storing Fish",
        "Preparing fish for market and keeping them fresh.",
        `## Sorting
Separate the catch by **species** (bangus with bangus, tilapia with tilapia) and remove **damaged, sick or spoiled** fish and trash.

## Grading
Group fish by **size** (small, medium, large — often by weight per kilo) and by **quality/freshness**:
- **Fresh fish:** bright, clear, bulging **eyes**; bright red **gills**; shiny skin and firm scales; **firm** flesh that springs back when pressed; a mild, fresh sea or pond **smell**
- **Stale fish:** cloudy, sunken eyes; brown or gray gills; dull skin; soft flesh that stays dented; sour or strong smell
Graded fish sell at fair prices — buyers pay more for big, fresh fish.

## Storing
- **Icing** — in an insulated box, layer **ice – fish – ice**, with ice also under and over the fish; in hot weather use about **1 kg ice for every 1 kg fish**, adding more as it melts
- Keep fish chilled at about **0–4 °C**; drain melted water
- **Freezing** at **–18 °C or colder** for longer storage
- Follow **First In, First Out (FIFO)** — sell or use older stock first
- Label boxes with species, size grade and date

## Safety precautions
Wear gloves and boots; watch out for spines and fins; lift boxes properly; keep the area clean and drained so no one slips; wash hands and tools after work.

## Key points
Sort by species, grade by size and freshness, store cold — and work safely.`,
        "Using actual or pictured fish, sort them by species, grade them by size and freshness using a checklist, and show how to pack them in ice (performance task).",
        [
          "Give three signs of fresh fish.",
          "How do you pack fish in an ice box?",
          "What does FIFO mean?",
        ],
      ),
    ],
    quiz: [
      q(
        "Separating fish by species is called…",
        ["grading", "sorting", "icing", "freezing"],
        1,
        "Sorting groups fish by kind; grading groups them by size and quality.",
      ),
      q(
        "Which is a sign of FRESH fish?",
        [
          "Cloudy, sunken eyes",
          "Bright red gills and firm flesh",
          "Soft flesh that stays dented",
          "Sour smell",
        ],
        1,
        "Fresh fish have bright red gills, clear eyes and firm flesh.",
      ),
      q(
        "How should fish be layered in an ice box?",
        [
          "Fish only, ice on the side",
          "Ice – fish – ice, with ice under and over the fish",
          "Ice only at the top",
          "No ice, just water",
        ],
        1,
        "Layering ice around the fish chills them evenly.",
      ),
      q(
        "For long storage, fish are frozen at…",
        ["10 °C", "4 °C", "–18 °C or colder", "25 °C"],
        2,
        "Freezing at –18 °C or below keeps fish for weeks or months.",
      ),
      q(
        "FIFO means…",
        [
          "Fish In, Fish Out",
          "First In, First Out",
          "Freeze It, Fry It Often",
          "Fresh Ice, Fresh Ocean",
        ],
        1,
        "First In, First Out — older stock is sold or used first.",
      ),
    ],
  },
  // Week 8
  {
    title: "Introduction to Food Processing",
    description:
      "Why we process food, careers and businesses, raw materials and ingredients.",
    lessons: [
      lesson(
        "The Importance of Food Processing",
        "Why raw food is turned into processed products.",
        `## What is food processing?
**Food processing** changes raw farm and fishery products into food that **lasts longer**, is **safer**, **easier to use** and often **more valuable** — for example, fresh fish into **tuyo**, **tinapa** or **bottled sardines**, and fruits into **jam**.

## Why it is important
- **Preservation** — keeps food from spoiling, so it can be stored and transported
- **Food security** — food is available even when out of season or during calamities
- **Less waste** — surplus harvests aren't thrown away
- **Food safety** — proper processing kills harmful microorganisms
- **Added value and income** — processed products sell at higher prices
- **Convenience** — ready-to-cook or ready-to-eat food saves time
- **Variety** — new flavors and products
- **Jobs and livelihood** for communities

## What spoils food?
**Microorganisms** (bacteria, molds, yeasts), **enzymes** inside the food, and **air, heat and moisture**. Processing methods work by removing water, adding salt or sugar or acid, using heat, or keeping food cold.

## Key points
Food processing preserves food, keeps it safe, reduces waste, and turns harvests into income.`,
        "List five processed foods in your home and identify the raw material each came from and why it was processed.",
        [
          "What is food processing?",
          "Give three reasons why food processing is important.",
          "What causes food to spoil?",
        ],
      ),
      lesson(
        "Food Processing as a Career and a Business",
        "Jobs and small businesses in food processing.",
        `## Careers
- **Food processor / production worker** — prepares, processes and packs food
- **Food technologist** — develops and improves products (BS Food Technology)
- **Quality control (QC) inspector** — checks safety and quality
- **Packaging and labeling specialist**
- **Food safety officer** and **sanitarian**
- **Entrepreneur** with a home-based food business

TESDA offers **Food Processing NC II**, covering fish, meat, fruits and vegetables.

## Business opportunities
- **Fish products** — tuyo, daing, tinapa (smoked fish), bagoong, patis, fish balls, bottled sardines, fish crackers
- **Fruit and vegetable products** — jams, jellies, preserves, atchara (pickled papaya), banana chips, dried mangoes
- **Meat products** — tocino, longganisa, tapa
- **Pasalubong** products for tourists

## Starting small
Start with a product you know, use quality raw materials, keep strict cleanliness, compute costs and prices, design an attractive label, and get the proper permits (**business permit**, and **FDA** registration as the business grows).

## Key points
Food processing can be a career in industry or a business you start at home — quality and cleanliness make it succeed.`,
        "Plan a small processed-food business: product, raw materials, target customers, price and a catchy brand name.",
        [
          "Give two careers in food processing.",
          "Give three processed fish products that can be sold.",
          "Which TESDA qualification covers food processing?",
        ],
      ),
      lesson(
        "Raw Materials in Food Processing",
        "The main products that are processed.",
        `## What are raw materials?
**Raw materials** are the main, unprocessed products that become the processed food.

## Kinds of raw materials
- **Fish and other seafood** — galunggong, tamban, bangus, dilis, squid, shrimp, mussels
- **Meat and poultry** — pork, beef, chicken
- **Fruits** — mango, papaya, banana, pineapple, calamansi
- **Vegetables** — papaya, cucumber, carrots, ampalaya
- **Root crops and grains** — cassava, sweet potato, rice, corn
- **Eggs and milk** — salted eggs, pastillas

## Choosing good raw materials
- **Fresh** and in good condition — no bruises, rot or bad smell
- **Right maturity** — for example ripe mangoes for jam, green papaya for atchara
- **Clean** and from safe sources
- **Uniform size** for even processing
- Bought **in season** for lower cost

## Why quality matters
Processing can't fix bad raw materials — spoiled fish makes poor and unsafe tuyo. "**Garbage in, garbage out**."

## Key points
Good products start with fresh, clean, mature and uniform raw materials.`,
        "Visit a market (or use pictures) and identify raw materials suitable for processing. For each, note the signs of good quality.",
        [
          "What are raw materials in food processing?",
          "Give four characteristics of good raw materials.",
          "Which raw material is used for atchara?",
        ],
      ),
      lesson(
        "Ingredients Used in Food Processing",
        "What is added to raw materials, and why.",
        `## Classes of ingredients
- **Main ingredient** — the raw material (fish, fruit, meat)
- **Curing and preserving agents**:
  - **Salt** — draws out water and stops bacteria (tuyo, bagoong, salted eggs)
  - **Sugar** — preserves fruits in high concentration (jams, candied fruits)
  - **Vinegar (acid)** — pickling (atchara, paksiw)
  - **Approved preservatives** — used only in allowed amounts
- **Flavorings and spices** — garlic, onion, pepper, chili, ginger, bay leaf, soy sauce
- **Binders and extenders** — flour, starch, eggs (fish balls, nuggets)
- **Coloring** — natural colors such as annatto (atsuete)
- **Oil** — for frying and for bottled fish (sardines in oil)
- **Water** — clean and potable only

## Using ingredients properly
- Measure **accurately** — too much salt makes products inedible; too little lets them spoil
- Use **food-grade** ingredients only
- Store ingredients in **clean, dry, labeled** containers
- List all ingredients on the label in **descending order of weight**

## Key points
Ingredients preserve, flavor and bind processed food — use the right kind in the right amount.`,
        "Classify the ingredients of three recipes (for example tinapa, atchara and fish balls) into main ingredient, preservatives, flavorings and binders.",
        [
          "How does salt preserve food?",
          "What ingredient is used in pickling?",
          "Why must ingredients be measured accurately?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which is a main reason for processing food?",
        [
          "To make it spoil faster",
          "To preserve it and make it safe",
          "To make it heavier",
          "To remove all flavor",
        ],
        1,
        "Processing preserves food, keeps it safe and adds value.",
      ),
      q(
        "Tinapa is fish that has been…",
        ["pickled", "smoked", "frozen", "candied"],
        1,
        "Tinapa is smoked fish, a popular processed product.",
      ),
      q(
        "Which is a sign of a GOOD raw material?",
        [
          "Bruised and soft",
          "Fresh, clean and at the right maturity",
          "Strong bad smell",
          "Mixed sizes and rotten parts",
        ],
        1,
        "Fresh, clean, mature and uniform raw materials make good products.",
      ),
      q(
        "Vinegar in atchara works as a…",
        ["binder", "pickling (acid) preservative", "coloring", "extender"],
        1,
        "Acid from vinegar keeps microorganisms from growing in pickled food.",
      ),
      q(
        "Flour and eggs in fish balls act as…",
        ["preservatives", "binders/extenders", "coloring", "raw material"],
        1,
        "Binders hold the mixture together and extenders add volume.",
      ),
    ],
  },
  // Week 9
  {
    title: "Food Processing Methods, Tools and Equipment",
    description:
      "Processing methods following industry standards, and the tools used.",
    lessons: [
      lesson(
        "Methods of Food Processing",
        "Ways of preserving food, following industry standards.",
        `## Removing water
- **Drying** — sun drying or using a **solar or mechanical dryer**; dried fish (**daing, tuyo, danggit**), dried mangoes
- **Smoking** — **hot smoking** cooks and flavors fish (tinapa); **cold smoking** flavors at low heat

## Adding salt, sugar or acid
- **Salting** — **dry salting** (rubbing with salt) or **brine salting** (soaking in salt water); salted fish, salted eggs
- **Sugar concentration** — jams, jellies, marmalades, candied fruits
- **Pickling** — vinegar or acid (atchara, pickled vegetables)
- **Fermentation** — useful microorganisms and salt change the food (**bagoong**, **patis**, **burong isda**)

## Using heat
- **Canning and bottling** — food sealed in containers and heated (sterilized), often in a **pressure canner**, to kill microorganisms (sardines, tuna)
- **Pasteurization** — mild heating (milk, juices)

## Using cold
- **Chilling** (0–4 °C) and **freezing** (–18 °C or colder)

## Industry standards
- **Good Manufacturing Practices (GMP)** — clean facilities, clean workers, safe water, pest control, proper storage
- **Personal hygiene** — hairnet, apron, clean hands and nails, no jewelry, no working while sick
- **Correct times, temperatures and measurements** for every method
- **Food safety and labeling rules** of the **FDA Philippines**

## Key points
Every method fights spoilage by removing water, adding salt/sugar/acid, heating, or chilling — always done cleanly and to standard.`,
        "Demonstrate (or describe step by step) one processing method such as salting, drying or pickling, following GMP and hygiene rules.",
        [
          "What is the difference between dry salting and brine salting?",
          "Give two fermented fish products.",
          "What are Good Manufacturing Practices (GMP)?",
        ],
      ),
      lesson(
        "Tools and Equipment in Food Processing",
        "What food processors use, and how to maintain it.",
        `## Measuring
- **Weighing scale** — ingredients and products
- **Measuring cups and spoons** — dry and liquid ingredients
- **Thermometer** — cooking, smoking and storage temperatures
- **Refractometer** — sugar concentration (°Brix) in jams and syrups
- **Salinometer** — salt concentration of brine

## Preparing
- **Knives** and **cutting boards** (separate ones for raw fish and cooked food)
- **Basins, colanders, strainers**, **peelers**, **graters**
- **Mixing bowls** and **wooden spoons**

## Processing
- **Stove**, **casseroles and kettles** (stainless steel)
- **Pressure canner / pressure cooker** — canning and bottling
- **Smokehouse or smoker** — tinapa
- **Solar dryer** or **mechanical dryer**
- **Freezer and refrigerator**

## Packaging
- **Bottles and jars with lids**, **can sealer**, **heat sealer** for plastic bags, **vacuum sealer**

## Care and maintenance
- **Wash** with soap and water right after use, **rinse**, **sanitize**, and **dry** completely
- **Store** in a clean, dry, covered place
- **Sharpen** knives regularly and store them safely
- **Check** pressure canners (gauge, gasket, safety valve) before use
- **Calibrate** scales and thermometers
- Unplug electrical equipment before cleaning

## Key points
Accurate, clean, well-kept tools make safe, consistent products.`,
        "Make an inventory of food processing tools in your school kitchen (or from pictures): name, use, and how to clean and store each one.",
        [
          "What does a refractometer measure?",
          "Why should separate cutting boards be used for raw fish and cooked food?",
          "Give three steps in cleaning tools after use.",
        ],
      ),
    ],
    quiz: [
      q(
        "Bagoong and patis are made by…",
        ["freezing", "fermentation", "canning", "drying only"],
        1,
        "They are fermented with salt over time.",
      ),
      q(
        "Soaking fish in salt water is…",
        ["dry salting", "brine salting", "smoking", "pasteurization"],
        1,
        "Brine salting soaks the food in a salt solution.",
      ),
      q(
        "Which equipment is used to sterilize sealed jars of fish?",
        ["Refractometer", "Pressure canner", "Salinometer", "Cutting board"],
        1,
        "A pressure canner reaches high temperatures that kill microorganisms in sealed containers.",
      ),
      q(
        "GMP stands for…",
        [
          "Good Manufacturing Practices",
          "General Market Prices",
          "Great Meal Preparation",
          "Government Money Program",
        ],
        0,
        "Good Manufacturing Practices are standards for clean, safe food production.",
      ),
      q(
        "Which tool measures the sugar concentration of jam?",
        ["Thermometer", "Refractometer", "Salinometer", "Weighing scale"],
        1,
        "A refractometer reads sugar content in degrees Brix.",
      ),
    ],
  },
  // Week 10
  {
    title: "Quantification, Packaging and Labeling",
    description:
      "Computing recipe quantities, choosing packaging, and designing labels.",
    lessons: [
      lesson(
        "Quantification in Food Processing",
        "Computing ingredient amounts, yields and percentages.",
        `## Why quantify?
**Quantification** means measuring and computing the exact amounts of ingredients so every batch tastes the same, costs are correct, and products are safe.

## Recipe yield and conversion
A recipe for 2 kg of fish needs 300 g of salt. How much salt for 5 kg?
- **Conversion factor** = desired amount ÷ original amount = 5 ÷ 2 = **2.5**
- New salt = 300 g × 2.5 = **750 g**

## Standard weight percentage
Shows each ingredient as a share of the whole formula:
**Percentage = (weight of ingredient ÷ total weight of all ingredients) × 100**

Example — brine for salting:
- Water 1,000 g, salt 250 g → total 1,250 g
- Salt % = 250 ÷ 1,250 × 100 = **20%**

## Product yield
**Yield % = (weight of finished product ÷ weight of raw material) × 100**
Example: 10 kg fresh fish became 4 kg dried fish → 4 ÷ 10 × 100 = **40%** yield.

## Costing (simple)
Add the cost of all ingredients, packaging and other expenses, then divide by the number of packs to get the **cost per pack**; add a markup to set the selling price.

## Measuring correctly
Use a **weighing scale** for accuracy (weight is better than volume for dry ingredients); level off dry measures; read liquid measures at eye level.

## Key points
Measure, compute and record — consistent amounts mean consistent, safe and profitable products.`,
        "Given a tinapa or tuyo recipe, compute the ingredients for a bigger batch, the salt percentage, and the product yield (performance task).",
        [
          "A recipe uses 200 g sugar for 1 kg fruit. How much sugar for 3 kg?",
          "Compute the salt % in a brine of 900 g water and 100 g salt.",
          "8 kg of fresh fish became 3.2 kg of dried fish. What is the yield %?",
        ],
      ),
      lesson(
        "Packaging Materials for Processed Food",
        "Choosing the right container for each product.",
        `## Why package?
Packaging **protects** food from dirt, air, moisture, light and damage; **preserves** freshness; makes products **easy to carry, store and sell**; and carries the **label**.

## Common packaging materials
- **Glass bottles and jars** — bottled sardines, bagoong, jams, atchara; airtight and reusable, but breakable and heavy
- **Metal cans (tin)** — canned fish; strong and airtight, needs a can sealer
- **Plastic bags (polyethylene, polypropylene)** — dried fish, chips; light and cheap; seal with a heat sealer
- **Vacuum packs** — air removed; keeps smoked and dried fish longer
- **Laminated pouches and foil** — block light and air
- **Paper, cartons and boxes** — outer packaging and pasalubong boxes

## Levels of packaging
- **Primary** — touches the food (the jar, the plastic bag)
- **Secondary** — groups products (a box of 12 jars)
- **Tertiary** — for shipping (a big carton or pallet)

## Choosing packaging
Match it to the product (oily, wet, dry or fragile), the shelf life needed, the cost, and how it will be sold. Use only **food-grade** and **clean** materials; sterilize jars before filling.

## Key points
Good packaging protects the food, keeps it fresh, and helps it sell.`,
        "Match five processed products with the best packaging material and explain your choice.",
        [
          "Give three reasons for packaging food.",
          "What packaging would you use for bottled sardines? For dried fish?",
          "What is the difference between primary and secondary packaging?",
        ],
      ),
      lesson(
        "Designing a Label for Processed Food",
        "What a food label must say, and how to make it attractive.",
        `## What a label must show
Based on Philippine **FDA** labeling rules, a processed-food label should include:
- **Product name** (what it is — "Smoked Bangus") and **brand name**
- **Net content / net weight** (for example 250 g)
- **List of ingredients** in **descending order** of weight
- **Name and address** of the manufacturer or distributor
- **Date marking** — **Best before** or **Expiry** date, and the **lot or batch number**
- **Storage instructions** ("Keep refrigerated", "Store in a cool, dry place")
- **Nutrition facts** (for registered products)
- **Allergen information** (contains fish, shellfish, eggs…)
- **Country of origin** ("Product of the Philippines")

## Designing the label
- An **eye-catching** brand name and logo
- **Clear, readable** fonts; important information easy to find
- **Colors and pictures** that match the product
- **Honest** — no false or misleading claims
- **Right size** for the container

## Sample layout
Front: brand, logo, product name, picture, net weight. Back: ingredients, manufacturer, best-before date, lot number, storage instructions, nutrition facts.

## Key points
A good label informs, protects the buyer, follows the rules — and sells the product.`,
        "Design a sample label for a processed food product (for example your smoked fish or dried fish). Include all the required information and an attractive design (performance task).",
        [
          "List five pieces of information required on a food label.",
          "In what order are ingredients listed?",
          "What is the difference between a best-before date and an expiry date?",
        ],
      ),
    ],
    quiz: [
      q(
        "A recipe uses 300 g salt for 2 kg fish. How much salt for 5 kg?",
        ["600 g", "750 g", "500 g", "1,500 g"],
        1,
        "Conversion factor 5 ÷ 2 = 2.5; 300 g × 2.5 = 750 g.",
      ),
      q(
        "A brine has 1,000 g water and 250 g salt. What is the salt percentage?",
        ["25%", "20%", "250%", "12.5%"],
        1,
        "250 ÷ (1,000 + 250) × 100 = 250 ÷ 1,250 × 100 = 20%.",
      ),
      q(
        "Which packaging touches the food directly?",
        ["Primary", "Secondary", "Tertiary", "Shipping carton"],
        0,
        "Primary packaging, like the jar or bag, is in direct contact with the food.",
      ),
      q(
        "On a label, ingredients are listed…",
        [
          "in alphabetical order",
          "from the least to the most",
          "in descending order of weight",
          "in any order",
        ],
        2,
        "The ingredient with the greatest weight comes first.",
      ),
      q(
        "Which is REQUIRED on a processed food label?",
        [
          "The seller's favorite color",
          "Net weight and best-before date",
          "A joke",
          "The price of fish today",
        ],
        1,
        "Net content and date marking are required label information.",
      ),
    ],
  },
];

/** TLE 8 – Agriculture and Fishery Arts. */
export const agricultureAndFisheryArts8: DemoSubject = {
  key: "TLE8-AFA",
  code: "TLE 8-AFA",
  name: "TLE 8 – Agriculture and Fishery Arts",
  department: TLE_DEPARTMENT,
  description:
    "Aquaculture, fisheries, fish handling and food processing (DepEd Budget of Work, Grade 8, First Term).",
  colorToken: "emerald",
  units: UNITS,
};
