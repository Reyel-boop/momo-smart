import type { DemoSubject } from "../grade10";
import { q, TLE_DEPARTMENT, tleLesson } from "./common";

/** TLE 10 specialized majors: one course per strand. */
export const TLE10: DemoSubject[] = [
  {
    key: "TLE10-CSS",
    code: "TLE 10-CSS",
    name: "TLE 10 – ICT: Computer Systems Servicing",
    department: TLE_DEPARTMENT,
    description:
      "Setting up networks and maintaining computer systems (TESDA CSS NC II, Cores 2–4).",
    colorToken: "blue",
    units: [
      {
        title: "Computer Networking",
        description: "Network types, topologies and network cables.",
        lessons: [
          tleLesson(
            "Network Types and Topologies",
            "How computers are connected and arranged.",
            "zbqrNg4C98U",
            `## What is a network?
A **computer network** is two or more devices connected to **share resources** — files, printers and the internet.

## Types by size
- **PAN** (Personal Area Network) — your phone and earbuds via Bluetooth
- **LAN** (Local Area Network) — a room, building or school
- **WLAN** — a wireless LAN using Wi-Fi
- **MAN** (Metropolitan Area Network) — a city
- **WAN** (Wide Area Network) — countries; **the internet** is the largest WAN

## Topologies (physical layout)
- **Bus** — all devices on one main cable; cheap but one break stops the network
- **Star** — every device connects to a central **switch**; the most common today; one cable failure affects only one device, but the switch is a single point of failure
- **Ring** — devices form a circle; data passes from one to the next
- **Mesh** — devices connect to many others; very reliable but costly
- **Tree / hybrid** — star networks connected together

## Network devices
- **Switch** — connects devices within a LAN
- **Router** — connects different networks (LAN to the internet) and assigns IP addresses
- **Access point** — gives wireless access
- **Modem** — connects to the internet service provider
- **NIC** (network interface card) — the port in each computer

## Key points
Most schools and offices use a **star** LAN with switches, connected to the internet through a router.`,
            "Networks share resources. By size: PAN, LAN, MAN, WAN. Common topologies are bus, star, ring and mesh; star with a central switch is the most common.",
            [
              "What is the difference between a LAN and a WAN?",
              "Why is the star topology the most common?",
              "What is the job of a router?",
            ],
          ),
          tleLesson(
            "Making a Network Cable",
            "Crimping UTP cables in straight-through and crossover.",
            "Uw8FSXx4dnU",
            `## UTP cable
**Unshielded Twisted Pair (UTP)** cable has **4 pairs (8 wires)** twisted to reduce interference. Common categories: **Cat5e** (1 Gbps) and **Cat6**. Maximum length per run: **100 meters**. The connector is **RJ45**.

## Tools
- **Crimping tool** — cuts, strips and crimps
- **UTP cable stripper**
- **LAN cable tester**
- RJ45 connectors and boots

## Color codes
**T568B:** white-orange, orange, white-green, blue, white-blue, green, white-brown, brown
**T568A:** white-green, green, white-orange, blue, white-blue, orange, white-brown, brown

## Kinds of cable
- **Straight-through** — **same standard on both ends** (B–B). Connects **different devices**: PC to switch, switch to router.
- **Crossover** — **A on one end, B on the other**. Connects **similar devices**: PC to PC, switch to switch. (Many modern ports auto-detect, but CSS assessments still require both.)

## Steps
- Strip about **2.5 cm** of the outer jacket.
- Untwist and arrange the wires in the color order; **flatten and trim** them evenly.
- Push them fully into the RJ45 with the clip facing **down**, wires reaching the end.
- **Crimp** firmly.
- **Test** with the LAN tester — all 8 lights should blink in order (1–8 for straight-through).

## Key points
One wire in the wrong position breaks the connection — always test before installing.`,
            "UTP cables use RJ45 connectors and T568A/B color codes. Straight-through (same standard both ends) joins different devices; crossover (A to B) joins similar devices.",
            [
              "What is the maximum length of one UTP cable run?",
              "When do you use a crossover cable?",
              "What tool checks whether a cable was crimped correctly?",
            ],
          ),
        ],
        quiz: [
          q(
            "A network covering one school building is a…",
            ["PAN", "LAN", "MAN", "WAN"],
            1,
            "A Local Area Network covers a small area such as a room, building or campus.",
          ),
          q(
            "In which topology does every device connect to a central switch?",
            ["Bus", "Ring", "Star", "Mesh"],
            2,
            "In a star topology all devices connect to a central switch or hub.",
          ),
          q(
            "Which device connects a school LAN to the internet?",
            ["Switch", "Router", "Crimping tool", "Monitor"],
            1,
            "A router connects different networks, such as the LAN and the internet, and directs traffic between them.",
          ),
          q(
            "A straight-through cable is used to connect…",
            [
              "PC to PC",
              "switch to switch",
              "PC to switch",
              "router to router",
            ],
            2,
            "Straight-through cables connect different kinds of devices, such as a computer to a switch.",
          ),
          q(
            "What is the maximum recommended length of one UTP cable run?",
            ["10 m", "50 m", "100 m", "1,000 m"],
            2,
            "Ethernet over UTP is rated for up to 100 meters; beyond that the signal weakens.",
          ),
        ],
      },
      {
        title: "Maintaining Computer Systems",
        description: "Preventive maintenance and troubleshooting.",
        lessons: [
          tleLesson(
            "Preventive Maintenance",
            "Keeping computers working before they break.",
            "5yWh6AcvUCM",
            `## What is preventive maintenance?
**Preventive maintenance** is regular, scheduled care that **prevents** problems, lengthens the life of equipment and reduces downtime and repair costs.

## Hardware maintenance
- **Clean dust** from fans, heat sinks and vents with **compressed air** — dust causes overheating.
- Clean keyboards and mice; wipe monitors with a **lint-free cloth** (no glass cleaner on LCDs).
- Check cables and connectors for damage.
- Keep computers in a **cool, dry, well-ventilated** place.
- Use an **AVR** or **UPS** to protect against power fluctuations and brownouts.

## Software maintenance
- Install **OS and application updates**.
- Keep **antivirus** updated and run scans.
- **Disk Cleanup** — remove temporary files.
- **Defragment** hard disk drives (not SSDs).
- Remove unused programs and startup items.
- Schedule regular **backups**.

## Maintenance schedule
- **Daily:** shut down properly, check for virus alerts
- **Weekly:** scan for viruses, clean temporary files
- **Monthly:** clean dust, check updates
- **Yearly:** full inspection and replacement of worn parts

## Keep records
A **maintenance log** lists the date, work done and parts replaced for each computer.

## Key points
An hour of prevention saves days of repair.`,
            "Preventive maintenance is scheduled care: cleaning dust, updating software, scanning for viruses, backing up and keeping a maintenance log.",
            [
              "Why is dust harmful to a computer?",
              "Give two software maintenance tasks.",
              "What does a UPS protect against?",
            ],
          ),
          tleLesson(
            "Troubleshooting Computer Problems",
            "A step-by-step way to find and fix faults.",
            "A6m1p8QWfKc",
            `## The six-step troubleshooting process
- **1. Identify the problem** — ask the user what happened, when, and what changed; back up data.
- **2. Establish a theory of probable cause** — start with the **simplest and most likely** cause.
- **3. Test the theory** — if it's wrong, form a new one.
- **4. Plan and implement the solution.**
- **5. Verify** that the system works fully, and add preventive measures.
- **6. Document** the problem, the solution and the result.

## Common problems and likely causes
- **No power at all** — unplugged cord, faulty outlet, bad power supply
- **Powers on but no display** — loose monitor cable, unseated RAM, faulty video card
- **Continuous beeps at start-up** — RAM or video problem (check the beep codes)
- **Very slow** — malware, too many startup programs, full disk, low RAM
- **Overheating / sudden shutdown** — dusty fan, failed cooler, dried thermal paste
- **"No bootable device"** — wrong boot order or failed drive
- **No internet** — unplugged cable, wrong network settings, router problem

## Useful tools
Task Manager, Device Manager, Event Viewer, multimeter, POST card, spare known-good parts.

## Key points
Check the **simple things first** (cables, power, settings) before opening the computer.`,
            "Troubleshoot in six steps: identify, theorize, test, fix, verify and document. Check simple causes like cables and power first.",
            [
              "What is the first step of troubleshooting?",
              "What might cause a computer to power on with no display?",
              "Why should the solution be documented?",
            ],
          ),
        ],
        quiz: [
          q(
            "What is the main purpose of preventive maintenance?",
            [
              "To repair broken parts",
              "To prevent problems before they happen",
              "To install games",
              "To replace the computer",
            ],
            1,
            "Preventive maintenance is regular care done to avoid failures and extend the life of equipment.",
          ),
          q(
            "Which tool is best for removing dust inside a computer?",
            [
              "Wet rag",
              "Vacuum with metal nozzle",
              "Compressed air",
              "Hair dryer",
            ],
            2,
            "Compressed air blows dust out of fans and heat sinks without touching or charging the parts.",
          ),
          q(
            "What is the first step in the troubleshooting process?",
            [
              "Replace the motherboard",
              "Identify the problem",
              "Document the solution",
              "Verify functionality",
            ],
            1,
            "You must understand the problem, by questioning the user and observing, before you can find its cause.",
          ),
          q(
            "A computer turns on but shows no display. A likely cause is…",
            [
              "a loose monitor cable or unseated RAM",
              "a slow internet connection",
              "too many desktop icons",
              "an expired antivirus",
            ],
            0,
            "No display with power usually points to the video path: monitor cable, RAM seating or the video card.",
          ),
          q(
            "A computer shuts down suddenly when it gets hot. What should be checked first?",
            [
              "The keyboard",
              "The dust in the fans and heat sink",
              "The printer",
              "The wallpaper",
            ],
            1,
            "Overheating shutdowns are most often caused by dust blocking airflow through fans and heat sinks.",
          ),
        ],
      },
    ],
  },

  {
    key: "TLE10-COOK",
    code: "TLE 10-COOK",
    name: "TLE 10 – Home Economics: Cookery",
    department: TLE_DEPARTMENT,
    description: "Starch, cereal and vegetable dishes (TESDA Cookery NC II).",
    colorToken: "orange",
    units: [
      {
        title: "Preparing Starch and Cereal Dishes",
        description: "Kinds of starch and cereal and how to cook them.",
        lessons: [
          tleLesson(
            "Starch and Cereal Products",
            "Grains, starches and their nutritional value.",
            "NJ5A8CSfLCs",
            `## Cereals and starches
**Cereals** are grains from the grass family: **rice, corn, wheat, oats, barley**. **Starch** is the main carbohydrate stored in grains, roots and tubers (cassava, potato, gabi, kamote).

## Structure of a grain
- **Bran** — outer layer; fiber and B vitamins
- **Germ** — the embryo; fats, vitamin E
- **Endosperm** — the largest part; starch and protein
**Whole grains** keep all three parts; **refined grains** (white rice, white flour) keep mostly the endosperm.

## Common products
- **Rice** — long grain, medium grain, short (glutinous / malagkit); brown and white
- **Corn** — corn grits, cornstarch, cornmeal
- **Wheat** — flour, pasta, bread, noodles
- **Oats** — rolled oats, oatmeal

## Starch as a thickener
When heated in liquid, starch granules absorb water and swell — **gelatinization** — thickening sauces, soups and puddings (e.g., cornstarch in sweet and sour sauce, ginataang bilo-bilo).

## Nutritional value
Starch and cereals are the main source of **energy (carbohydrates)**; whole grains also give **fiber**, B vitamins and minerals.

## Storage
Keep dry grains in **airtight containers** in a cool, dry place to prevent weevils and molds.`,
            "Cereals (rice, corn, wheat, oats) have bran, germ and endosperm. Starch thickens liquids through gelatinization and is the main source of energy.",
            [
              "Name the three parts of a cereal grain.",
              "What is gelatinization?",
              "How should dry grains be stored?",
            ],
          ),
          tleLesson(
            "Cooking Rice and Pasta",
            "Methods and doneness tests for rice and pasta dishes.",
            "Fo71zOJ-o4M",
            `## Cooking rice
- **Wash** rice once or twice to remove dirt (too much washing loses nutrients).
- Use about **1 part rice to 1½–2 parts water** depending on the variety; or the "first knuckle" method.
- **Absorption method:** bring to a boil, lower the heat, cover and simmer until the water is absorbed (15–20 min), then rest 5 minutes.
- **Pilaf method:** sauté rice in fat first, then add hot stock (e.g., Spanish rice).
- **Risotto method:** add hot stock gradually while stirring — creamy texture.
Rice dishes: sinangag, arroz caldo, paella, bibingka, champorado.

## Cooking pasta
- Use plenty of water: about **4 liters per 500 g** of pasta, with salt.
- Add pasta to **rapidly boiling water** and stir so it doesn't stick.
- Cook **al dente** — Italian for "to the tooth": tender but still firm when bitten.
- **Drain** and toss with sauce right away (don't rinse unless making a cold salad).

## Kinds of pasta
- **Long:** spaghetti, linguine, fettuccine
- **Short / tubular:** macaroni, penne, rigatoni
- **Shapes:** farfalle (bow tie), fusilli (spiral)
- **Filled:** ravioli, tortellini

## Key points
Overcooked rice and pasta become mushy; follow ratios and test doneness.`,
            "Cook rice by absorption, pilaf or risotto methods with the right water ratio. Boil pasta in plenty of salted water until al dente.",
            [
              "What does al dente mean?",
              "How is the pilaf method different from the absorption method?",
              "Why should pasta be added to rapidly boiling water?",
            ],
          ),
        ],
        quiz: [
          q(
            "Which part of the grain contains most of the starch?",
            ["Bran", "Germ", "Endosperm", "Husk"],
            2,
            "The endosperm is the largest part of the grain and stores the starch.",
          ),
          q(
            "When starch absorbs water and swells while heating, this is called…",
            [
              "caramelization",
              "gelatinization",
              "fermentation",
              "emulsification",
            ],
            1,
            "Gelatinization is the swelling of starch granules in hot liquid, which thickens sauces and soups.",
          ),
          q(
            "Pasta cooked 'al dente' is…",
            [
              "very soft",
              "tender but still firm to the bite",
              "raw in the center",
              "fried until crisp",
            ],
            1,
            "Al dente means 'to the tooth' — cooked through but still slightly firm.",
          ),
          q(
            "Sautéing rice in fat before adding hot stock is the…",
            [
              "absorption method",
              "pilaf method",
              "steaming method",
              "boiling method",
            ],
            1,
            "The pilaf method toasts the rice in fat first, then cooks it in stock.",
          ),
          q(
            "Which is a whole-grain product?",
            ["White flour", "Polished white rice", "Brown rice", "Cornstarch"],
            2,
            "Brown rice keeps its bran and germ, so it is a whole grain; the others are refined.",
          ),
        ],
      },
      {
        title: "Preparing Vegetable Dishes",
        description: "Kinds of vegetables and how to cook them well.",
        lessons: [
          tleLesson(
            "Classification of Vegetables",
            "Grouping vegetables by the plant part eaten.",
            "09HwsUUoW9o",
            `## Classification by plant part
- **Leaves** — pechay, kangkong, cabbage, lettuce, malunggay
- **Stems** — asparagus, celery, ubod (palm heart)
- **Roots** — carrot, radish (labanos), singkamas
- **Tubers** — potato, gabi, ube
- **Bulbs** — onion, garlic, leeks
- **Flowers** — cauliflower, broccoli, squash flowers, katuray
- **Fruits** — tomato, eggplant, ampalaya, squash, okra, sayote
- **Seeds / legumes** — sitaw, bataw, mongo, patani, green peas
- **Fungi** — mushrooms (not true vegetables but cooked as one)

## Classification by color and nutrients
- **Green** — chlorophyll; vitamins A, C, iron, calcium
- **Yellow / orange** — carotene (vitamin A)
- **Red** — lycopene and anthocyanin
- **White** — flavones (onion, cauliflower)

## Market forms
**Fresh, frozen, canned and dried.**

## Choosing quality vegetables
Firm, crisp and bright in color; free from bruises, wilting, holes and decay; heavy for their size.

## Key points
Knowing the plant part helps you choose the right cooking time — leaves cook fast, roots and tubers need longer.`,
            "Vegetables are classified by the part eaten: leaves, stems, roots, tubers, bulbs, flowers, fruits and seeds. Choose firm, bright, unbruised vegetables.",
            [
              "Give an example of a tuber and a bulb.",
              "What pigment gives carrots their orange color?",
              "Name three signs of a quality vegetable.",
            ],
          ),
          tleLesson(
            "Vegetable Cooking Methods",
            "Keeping color, texture and nutrients when cooking vegetables.",
            "b7qU7DYuxW8",
            `## Principles of cooking vegetables
- Cook **as short a time as possible** — nutrients and color are lost with long cooking.
- Cook in **small amounts of water**, or steam — vitamins B and C dissolve in water.
- Cut into **uniform pieces** so they cook evenly.
- Cook **as close to serving time** as possible.
- **Green vegetables:** cook uncovered for the first few minutes to let acids escape and keep them bright green; **don't add baking soda** (it destroys vitamins and makes them mushy).

## Moist-heat methods
- **Boiling** — in salted water (e.g., nilagang mais)
- **Blanching** — brief boiling then shocking in ice water; sets color
- **Steaming** — keeps most nutrients
- **Simmering / braising** — pinakbet, ginataang gulay

## Dry-heat methods
- **Sautéing / stir-frying** — quick cooking in a little oil over high heat (chopsuey, ginisang ampalaya)
- **Deep-frying** — tempura, okoy
- **Roasting / grilling / baking** — inihaw na talong, roasted squash

## Signs of doneness
**Tender-crisp** — tender but still slightly firm, with bright color.

## Key points
Choose the method by the vegetable: tough roots for braising or roasting, tender leaves for quick sautéing or steaming.`,
            "Cook vegetables briefly in little water to save nutrients and color. Moist-heat methods include boiling, blanching and steaming; dry-heat methods include sautéing, frying and roasting.",
            [
              "Why should vegetables be cooked in small amounts of water?",
              "What is blanching?",
              "Why should baking soda not be added to green vegetables?",
            ],
          ),
        ],
        quiz: [
          q(
            "Onion and garlic are classified as…",
            ["roots", "tubers", "bulbs", "seeds"],
            2,
            "Onions and garlic are bulbs: short underground stems surrounded by fleshy leaves.",
          ),
          q(
            "Which vegetable is eaten as a flower?",
            ["Carrot", "Cauliflower", "Potato", "Sitaw"],
            1,
            "Cauliflower and broccoli are clusters of flower buds.",
          ),
          q(
            "Why should vegetables be cooked in only a small amount of water?",
            [
              "To save gas only",
              "Because vitamins B and C dissolve in water",
              "To make them heavier",
              "To change their color",
            ],
            1,
            "Water-soluble vitamins leach into the cooking water, so less water and shorter cooking keep more nutrients.",
          ),
          q(
            "Briefly boiling vegetables and then plunging them into ice water is…",
            ["braising", "blanching", "roasting", "deep-frying"],
            1,
            "Blanching sets color and texture; the ice bath stops the cooking.",
          ),
          q(
            "Chopsuey is cooked by which method?",
            ["Stir-frying / sautéing", "Deep-frying", "Baking", "Poaching"],
            0,
            "Chopsuey is quickly stir-fried in a little oil over high heat, keeping vegetables tender-crisp.",
          ),
        ],
      },
    ],
  },

  {
    key: "TLE10-ACP",
    code: "TLE 10-ACP",
    name: "TLE 10 – Agri-Fishery Arts: Agricultural Crop Production",
    department: TLE_DEPARTMENT,
    description:
      "Crop care, harvesting and postharvest handling (TESDA ACP NC I).",
    colorToken: "emerald",
    units: [
      {
        title: "Crop Care and Maintenance",
        description: "Watering and protecting crops from pests and diseases.",
        lessons: [
          tleLesson(
            "Irrigation and Watering",
            "Giving crops the right water at the right time.",
            "jIGoEJuebNQ",
            `## Why irrigate?
Plants need water to absorb nutrients, make food (photosynthesis) and stay cool. **Irrigation** supplies water when rainfall is not enough.

## Methods of irrigation
- **Surface / furrow irrigation** — water flows in furrows between rows (corn, vegetables)
- **Basin / flood irrigation** — the field is flooded (lowland rice)
- **Sprinkler irrigation** — water sprayed like rain; good for uneven land
- **Drip (trickle) irrigation** — water drips directly at the roots through tubes; **saves the most water**
- **Manual** — watering cans and hoses for small gardens

## When to water
- **Early morning or late afternoon** — less water lost to evaporation
- Check soil moisture: if the soil **2–3 cm deep** is dry, it's time to water
- Seedlings and flowering/fruiting crops need regular water

## Signs of water problems
- **Too little:** wilting, leaf curling, dry soil, poor fruit set
- **Too much:** yellow leaves, root rot, waterlogged soil

## Other care practices
**Mulching** keeps moisture in the soil; **weeding** removes plants that compete for water; **cultivation** loosens the soil so water soaks in.

## Key points
Water deeply but not too often; drip irrigation and mulch conserve water during dry months.`,
            "Irrigation methods include furrow, flood, sprinkler and drip. Water early morning or late afternoon, and use mulch to keep moisture in the soil.",
            [
              "Which irrigation method saves the most water?",
              "Why is noon a poor time to water crops?",
              "Give two signs of overwatering.",
            ],
          ),
          tleLesson(
            "Pest and Disease Management",
            "Protecting crops with integrated pest management.",
            "-acyh86f3kE",
            `## Pests and diseases
- **Insect pests** — **chewing** (caterpillars, beetles, grasshoppers) eat leaves; **sucking** (aphids, leafhoppers, whiteflies) suck sap
- **Other pests** — rats, snails, birds, weeds
- **Diseases** — caused by **fungi** (leaf spot, damping-off, rust), **bacteria** (bacterial wilt) and **viruses** (mosaic, tungro in rice)

## Signs and symptoms
Holes in leaves, wilting, spots, yellowing, curling, stunted growth, rotting fruit.

## Integrated Pest Management (IPM)
IPM combines methods to keep pests **below damaging levels** while protecting people and the environment.
- **Cultural control** — crop rotation, proper spacing, clean fields, resistant varieties, correct planting time
- **Mechanical / physical control** — handpicking, traps, nets, sticky traps
- **Biological control** — natural enemies: ladybugs, spiders, Trichogramma wasps, frogs
- **Chemical control** — pesticides as the **last resort**, at the right dose, with PPE

## Natural / organic pesticides
Neem, chili-garlic spray, and makabuhay extracts can repel some insects.

## Safe pesticide use
Read the label, wear PPE, spray with the wind, follow the **pre-harvest interval** (days between last spray and harvest) and never wash containers in rivers.

## Key points
Monitor the field regularly — early detection makes control easier and cheaper.`,
            "Pests may chew or suck; diseases are caused by fungi, bacteria and viruses. IPM combines cultural, mechanical, biological and, as a last resort, chemical control.",
            [
              "What is the difference between chewing and sucking insects?",
              "Give an example of biological control.",
              "Why are pesticides the last resort in IPM?",
            ],
          ),
        ],
        quiz: [
          q(
            "Which irrigation method delivers water directly to the roots and saves the most water?",
            ["Flood", "Furrow", "Drip", "Sprinkler"],
            2,
            "Drip irrigation releases water slowly at the root zone, so very little is lost to runoff or evaporation.",
          ),
          q(
            "The best time to water crops is…",
            [
              "noon",
              "early morning or late afternoon",
              "midnight only",
              "during heavy rain",
            ],
            1,
            "Cooler times of day mean less evaporation, so more water reaches the roots.",
          ),
          q(
            "Aphids and leafhoppers are examples of…",
            ["chewing insects", "sucking insects", "fungi", "weeds"],
            1,
            "Aphids and leafhoppers pierce plants and suck their sap.",
          ),
          q(
            "Releasing ladybugs to eat aphids is an example of…",
            [
              "chemical control",
              "biological control",
              "cultural control",
              "irrigation",
            ],
            1,
            "Biological control uses natural enemies to keep pest numbers down.",
          ),
          q(
            "In Integrated Pest Management, chemical pesticides are used…",
            [
              "first, before anything else",
              "as the last resort",
              "every day",
              "never under any condition",
            ],
            1,
            "IPM uses safer methods first and turns to pesticides only when needed, to protect health and the environment.",
          ),
        ],
      },
      {
        title: "Harvest and Postharvest",
        description: "Harvesting at the right time and handling the produce.",
        lessons: [
          tleLesson(
            "Harvesting Crops",
            "Maturity indices and harvesting methods.",
            "JO3MxwZ08yM",
            `## Harvesting at the right time
Harvesting too early gives poor flavor and low yield; too late causes over-ripening, pest damage and losses.

## Maturity indices (signs a crop is ready)
- **Days from planting** — e.g. pechay about 30 days, corn 90–110 days
- **Color** — tomato turning from green to pink/red; rice panicles 80–85% straw-colored
- **Size and shape** — eggplant full-sized and glossy
- **Firmness / texture** — sound when tapped (watermelon)
- **Drying of leaves** — onion tops falling over
- **Sugar content** — measured with a refractometer (mango, pineapple)

## Methods of harvesting
- **Manual (hand) harvesting** — picking, cutting, pulling, digging; gentle and selective (vegetables, fruits)
- **Mechanical harvesting** — combine harvesters, diggers; fast for large fields (rice, corn)

## Good practices
- Harvest during the **cool part of the day** (early morning).
- Use **clean, sharp tools** and clean containers.
- Handle gently — **bruises** lead to rotting.
- Keep harvested produce in the **shade**.
- Don't overfill containers.

## Key points
Quality cannot be improved after harvest — it can only be **kept**. Harvest at the right maturity and handle with care.`,
            "Harvest at the right maturity using indices such as days, color, size and firmness. Harvest in the cool morning, handle gently and keep produce shaded.",
            [
              "Give three maturity indices.",
              "Why should crops be harvested early in the morning?",
              "What is the difference between manual and mechanical harvesting?",
            ],
          ),
          tleLesson(
            "Postharvest Handling",
            "Keeping quality from the field to the market.",
            "l5hPjtyO27s",
            `## Why postharvest handling matters
In the Philippines, a large share of fruits and vegetables is **lost after harvest** through bruising, rotting, wilting and pests. Good postharvest handling reduces these losses and increases income.

## Postharvest operations
- **Cleaning / washing** — remove soil and dirt
- **Sorting** — separate damaged and diseased produce from good ones
- **Grading** — group by **size, color, shape and quality** (Class A, B, C)
- **Trimming** — remove unwanted leaves and roots
- **Curing** — drying the outer skin of onions, garlic and root crops to heal wounds and lengthen storage
- **Drying** — reducing grain moisture to about **14%** for rice and corn
- **Packing** — in clean crates or cartons with padding and ventilation
- **Storage** — cool, dry, ventilated; cold storage for perishables
- **Transport** — avoid overloading, cover from sun and rain

## Causes of postharvest losses
Mechanical damage (bruises, cuts), high temperature, water loss, pests and diseases, poor packaging.

## Value adding
Processing increases value and shelf life: dried mangoes, banana chips, atchara, tomato sauce.

## Key points
Keep produce **cool, clean and gently handled** at every step.`,
            "Postharvest operations include cleaning, sorting, grading, curing, drying, packing, storage and transport. Keep produce cool, clean and gently handled.",
            [
              "What is the difference between sorting and grading?",
              "Why are onions cured before storage?",
              "To what moisture content should rice grain be dried?",
            ],
          ),
        ],
        quiz: [
          q(
            "Signs that tell when a crop is ready to harvest are called…",
            [
              "maturity indices",
              "pest symptoms",
              "planting systems",
              "soil tests",
            ],
            0,
            "Maturity indices such as color, size, days from planting and firmness show when to harvest.",
          ),
          q(
            "The best time of day to harvest vegetables is…",
            ["noon", "early morning", "mid-afternoon", "any hot time"],
            1,
            "Early morning is cool, so produce holds more water and stays fresh longer.",
          ),
          q(
            "Grouping harvested produce by size and quality is called…",
            ["washing", "grading", "curing", "planting"],
            1,
            "Grading groups produce into classes by size, color and quality so it can be priced fairly.",
          ),
          q(
            "Drying the outer skin of onions to lengthen storage life is…",
            ["curing", "sorting", "blanching", "irrigating"],
            0,
            "Curing dries and heals the outer layers of onions, garlic and root crops so they store longer.",
          ),
          q(
            "Palay (rice grain) should be dried to about what moisture content before storage?",
            ["5%", "14%", "30%", "50%"],
            1,
            "At about 14% moisture, grain resists molds and insects in storage.",
          ),
        ],
      },
    ],
  },

  {
    key: "TLE10-EIM",
    code: "TLE 10-EIM",
    name: "TLE 10 – Industrial Arts: Electrical Installation and Maintenance",
    department: TLE_DEPARTMENT,
    description:
      "Residential wiring, testing and maintenance (TESDA EIM NC II).",
    colorToken: "indigo",
    units: [
      {
        title: "Residential Wiring",
        description: "Wiring methods, materials and lighting circuits.",
        lessons: [
          tleLesson(
            "Wiring Methods and Materials",
            "How wires are run and protected in a house.",
            "d54BRK54PQM",
            `## The Philippine Electrical Code
Residential wiring must follow the **Philippine Electrical Code (PEC)**, which sets the rules for wire sizes, protection and installation.

## Service entrance and distribution
Power enters from the utility line → **kWh meter** → **main breaker** → **panelboard**, where **branch circuits** each have their own **circuit breaker** (lighting, outlets, aircon, range).

## Wiring methods
- **Exposed (knob-and-tube / cleat)** — old; not recommended
- **Rigid metal conduit (RMC) / IMC** — strong; for exposed or outdoor work
- **PVC conduit** — common in houses; light and rust-proof
- **Flexible metal conduit** — for connections to motors and equipment
- **Molding / raceway** — surface wiring on finished walls
- **Concealed** — inside walls and ceilings in conduit

## Wires and sizes
- Common types: **THHN / THWN** (building wire)
- Sizes in mm² (or AWG): **2.0 mm²** for lighting, **3.5 mm²** for convenience outlets, **5.5 mm²** or larger for aircon and range
- The bigger the load, the **bigger the wire** and breaker

## Boxes and fittings
**Utility boxes** for switches and outlets, **junction boxes** for splices, **octagonal boxes** for lights, couplings, connectors and locknuts.

## Key points
Every splice must be inside a box, every circuit protected by a correctly rated breaker.`,
            "Wiring follows the PEC: meter → main breaker → panelboard → branch circuits. Wires are run in conduit (often PVC) and sized to the load: 2.0 mm² lighting, 3.5 mm² outlets.",
            [
              "What is the purpose of the panelboard?",
              "What wire size is commonly used for convenience outlets?",
              "Why must splices be inside a box?",
            ],
          ),
          tleLesson(
            "Installing a Lighting Circuit",
            "From plan to working lamp.",
            "TwNc95O1PjQ",
            `## Read the plan first
Identify the lamps, switches, outlets and the circuit they belong to. Prepare a **bill of materials** (wire, conduit, boxes, devices).

## Typical NC II wiring task
One lamp controlled by a **single-pole switch**, another controlled by **two three-way switches**, plus convenience outlets.

## Steps
- **Turn off and lock out** the power.
- **Mount** boxes and run **conduit** according to the plan.
- **Pull wires** through the conduit — use the correct colors where available (e.g. red/black for line, white for neutral, green for ground).
- **Make connections in boxes**: splice with the right joint, tape or use wire connectors.
- **Wire the switches on the line**, the neutral directly to the lamp holders.
- **Three-way circuit:** line to the **common** of the first S₃, two **travelers** between the S₃ switches, and from the common of the second S₃ to the lamp.
- **Install devices** and covers.
- **Test** before energizing: continuity and insulation tests.
- **Energize** and check every switch and outlet.

## Workmanship
Neat, straight conduit runs; secure boxes; no exposed copper outside terminals; clean work area.

## Key points
In the NC II assessment, **safety, correctness and neatness** are all checked.`,
            "Plan, turn off power, mount boxes and conduit, pull wires, connect with switches on the line, then test before energizing. Three-way circuits use a common and two travelers.",
            [
              "What is a bill of materials?",
              "In a three-way circuit, what connects the two switches?",
              "Why test the circuit before energizing it?",
            ],
          ),
        ],
        quiz: [
          q(
            "Residential wiring in the Philippines must follow the…",
            [
              "Philippine Electrical Code",
              "Building Height Act",
              "Cybercrime Law",
              "Clean Air Act",
            ],
            0,
            "The Philippine Electrical Code (PEC) sets the standards for safe electrical installations.",
          ),
          q(
            "Where are branch-circuit breakers located?",
            [
              "In the kWh meter",
              "In the panelboard",
              "In the lamp holder",
              "In the switch",
            ],
            1,
            "The panelboard divides power into branch circuits, each protected by its own breaker.",
          ),
          q(
            "Which wire size is commonly used for lighting circuits?",
            ["2.0 mm²", "14.0 mm²", "0.5 mm²", "22 mm²"],
            0,
            "Lighting loads are light, so 2.0 mm² wire is commonly used; outlets usually use 3.5 mm².",
          ),
          q(
            "In a three-way switch circuit, the wires between the two switches are called…",
            ["neutrals", "travelers", "grounds", "feeders"],
            1,
            "The two traveler wires run between the three-way switches so either one can switch the lamp.",
          ),
          q(
            "What should be done before energizing a newly wired circuit?",
            [
              "Paint the walls",
              "Test it for continuity and insulation",
              "Remove the breakers",
              "Wet the wires",
            ],
            1,
            "Testing first finds short circuits and wrong connections before power can cause damage or injury.",
          ),
        ],
      },
      {
        title: "Testing and Maintenance",
        description: "Testing installations and fixing electrical faults.",
        lessons: [
          tleLesson(
            "Testing Electrical Installations",
            "Continuity, insulation and polarity checks.",
            "Gj_oCl70WWw",
            `## Why test?
Testing confirms that a new or repaired installation is **safe and correct** before it is energized.

## Tests (with power OFF)
- **Continuity test** — checks that each conductor forms a complete path from end to end, using the ohmmeter or continuity tester (near 0 Ω = good).
- **Insulation resistance test** — checks that current can't leak between conductors or to ground, using a **megger (insulation tester)**; readings should be **high** (in megohms).
- **Short-circuit check** — line and neutral should **not** show continuity with all loads removed.

## Tests (with power ON, carefully)
- **Polarity test** — confirms the **line** goes to switches and to the outlet's line slot; uses a voltmeter or test light.
- **Voltage test** — confirms correct voltage (about 220–230 V) at outlets.
- **Function test** — every switch controls the right lamp; every outlet works.

## Tools
Multitester, megger, test light / non-contact voltage tester, outlet tester.

## Recording results
Write results in a **test report**: circuit, test done, reading, pass/fail, date and tester's name.

## Key points
Never skip testing — a hidden short or reversed polarity can cause shock or fire later.`,
            "With power off, test continuity, insulation resistance (with a megger) and for shorts. With power on, test polarity, voltage and function. Record results in a test report.",
            [
              "What instrument tests insulation resistance?",
              "What does a polarity test check?",
              "Why should line and neutral show no continuity with loads removed?",
            ],
          ),
          tleLesson(
            "Electrical Troubleshooting",
            "Finding and fixing common electrical faults.",
            "zdrUX6_LGmE",
            `## A systematic approach
- **Gather information** — what stopped working, when, what changed
- **Inspect visually** — burnt marks, smell, loose wires, tripped breakers
- **Isolate** the problem to one circuit or device
- **Test** with the right instrument
- **Repair**, then **test again** and record the work

## Common faults
- **Open circuit** — broken wire or loose connection; the load doesn't work. Find it with a **continuity test**.
- **Short circuit** — line touches neutral; the **breaker trips immediately** or fuse blows. Look for damaged insulation.
- **Ground fault** — line touches a metal box or appliance body; can shock users. Proper **grounding** and **GFCI / RCD** breakers protect people.
- **Overload** — too many loads on one circuit; the breaker trips after a while. Move loads to another circuit.
- **Loose connection** — flickering lights, warm outlets, burning smell; tighten and replace damaged parts.

## Lamp not lighting — checklist
Bulb → lamp holder → switch → wires/splices → breaker.

## Maintenance
Regular inspection of outlets, switches, cords and the panelboard; tightening terminals; replacing worn devices; keeping panels clear of dust and obstructions.

## Key points
**Never reset a breaker repeatedly** — it trips for a reason. Find the cause first.`,
            "Troubleshoot systematically: gather information, inspect, isolate, test, repair and retest. Common faults are open circuits, short circuits, ground faults, overloads and loose connections.",
            [
              "What usually happens when there is a short circuit?",
              "How is an overload different from a short circuit?",
              "Why shouldn't a breaker be reset again and again?",
            ],
          ),
        ],
        quiz: [
          q(
            "Which instrument is used to test insulation resistance?",
            ["Megger", "Test light", "Hammer", "Clamp only"],
            0,
            "A megger (insulation tester) applies a high test voltage to measure insulation resistance in megohms.",
          ),
          q(
            "A continuity test is done with the power…",
            ["ON", "OFF", "at half voltage", "on the neutral only"],
            1,
            "Continuity and resistance tests use the meter's own battery; doing them on a live circuit is dangerous and can damage the meter.",
          ),
          q(
            "A breaker trips immediately when switched on. The most likely cause is…",
            ["an open circuit", "a short circuit", "a dim bulb", "low demand"],
            1,
            "A short circuit draws a very large current at once, so the breaker trips immediately.",
          ),
          q(
            "A breaker trips after several appliances run for a while. This is most likely…",
            [
              "an overload",
              "an open circuit",
              "correct polarity",
              "a good splice",
            ],
            0,
            "Too many loads on one circuit gradually exceed its rating, which trips the breaker after some time.",
          ),
          q(
            "Flickering lights and a warm outlet usually point to…",
            [
              "a loose connection",
              "a new bulb",
              "correct wiring",
              "low humidity",
            ],
            0,
            "Loose connections arc and heat up, causing flickering and warm devices — a fire risk that must be fixed.",
          ),
        ],
      },
    ],
  },
];
