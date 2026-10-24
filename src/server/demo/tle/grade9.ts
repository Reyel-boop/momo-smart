import type { DemoSubject } from "../grade10";
import { q, TLE_DEPARTMENT, tleLesson } from "./common";
import { computerProgramming } from "./programming";

/** TLE 9 specialized majors: one course per strand. */
export const TLE9: DemoSubject[] = [
  computerProgramming(9),
  {
    key: "TLE9-COOK",
    code: "TLE 9-COOK",
    name: "TLE 9 – Home Economics: Cookery",
    department: TLE_DEPARTMENT,
    description: "Preparing appetizers and egg dishes (TESDA Cookery NC II).",
    colorToken: "orange",
    units: [
      {
        title: "Preparing Appetizers",
        description: "Kinds of appetizers and how to prepare and present them.",
        lessons: [
          tleLesson(
            "Kinds of Appetizers",
            "What appetizers are and how they are classified.",
            "X6L7YMbPQ1I",
            `## What is an appetizer?
An **appetizer** is a small portion of food served **before the main course** to stimulate the appetite. It should be **small, attractive and tasty**, never filling.

## Classification of appetizers
- **Cocktails** — fruit, seafood or juice served chilled (shrimp cocktail, fruit cocktail)
- **Canapés** — bite-sized: a **base** (bread, cracker, toast), a **spread** (butter, cheese), a **topping** and a **garnish**
- **Hors d'oeuvres** — small savory bites eaten with fingers or picks (lumpiang shanghai, stuffed eggs)
- **Relishes / crudités** — raw or pickled vegetables (carrot sticks, cucumber, atchara)
- **Dips** — sauces served with chips, crackers or vegetables
- **Salads** — light salads in small portions
- **Soups** — small servings of light soup

## Qualities of a good appetizer
- Small enough for **one or two bites**
- **Contrasting** flavors and colors
- Served at the right **temperature** — cold items cold, hot items hot
- Neatly **garnished**

## Key points
An appetizer opens the meal: it should make the guest hungry, not full.`,
            "Appetizers are small dishes served before the main course. Kinds include cocktails, canapés, hors d'oeuvres, relishes, dips, salads and soups.",
            [
              "What is the purpose of an appetizer?",
              "Name the four parts of a canapé.",
              "Give an example of a relish.",
            ],
          ),
          tleLesson(
            "Preparing and Presenting Appetizers",
            "Mise en place, hygiene and attractive plating.",
            "4VqJ4QCw73c",
            `## Mise en place
French for **"everything in its place."** Before cooking, prepare all tools and ingredients: wash, cut, measure and arrange them. This saves time and prevents mistakes.

## Preparing appetizers
- Keep **cold appetizers cold** (below 5 °C) until serving and **hot appetizers hot** (above 60 °C).
- Assemble canapés **close to serving time** so the base stays crisp; use a spread to keep moisture away from the bread.
- Cut ingredients into **uniform, bite-size** pieces.
- Taste and adjust seasoning.

## Principles of presentation
- **Color** — combine contrasting colors (green herbs on red tomatoes)
- **Height and balance** — arrange food to give shape, not flat piles
- **Neatness** — clean plate rims; no drips
- **Odd numbers** — groups of 3 or 5 look more natural
- **Garnish** — edible and related to the dish (parsley, lemon slices, carrot flowers)

## Serving
Use the right plate size; leave space between items; serve on chilled plates for cold appetizers.

## Storage
Cover and refrigerate leftovers within 2 hours; **don't** reuse appetizers left on a buffet in the danger zone.`,
            "Mise en place means preparing everything before cooking. Keep cold items cold and hot items hot, cut pieces uniformly and present with color, height and garnish.",
            [
              "What does mise en place mean?",
              "Why should canapés be assembled close to serving time?",
              "Give two principles of food presentation.",
            ],
          ),
        ],
        quiz: [
          q(
            "An appetizer is served…",
            [
              "after dessert",
              "before the main course",
              "only at breakfast",
              "as the main course",
            ],
            1,
            "Appetizers come first, to stimulate the appetite before the main course.",
          ),
          q(
            "A small piece of bread or cracker with a spread, topping and garnish is a…",
            ["dip", "relish", "canapé", "cocktail"],
            2,
            "A canapé has four parts: base, spread, topping and garnish.",
          ),
          q(
            "Carrot sticks, cucumber and atchara served before a meal are…",
            ["relishes", "canapés", "soups", "cocktails"],
            0,
            "Relishes (crudités) are raw or pickled vegetables served as appetizers.",
          ),
          q(
            "What does mise en place mean?",
            [
              "Serve immediately",
              "Everything in its place",
              "Cook slowly",
              "Wash the dishes",
            ],
            1,
            "Mise en place is the habit of preparing every tool and ingredient before starting to cook.",
          ),
          q(
            "Why are canapés assembled close to serving time?",
            [
              "So the base stays crisp",
              "To make them heavier",
              "To save garnish",
              "So they become warm",
            ],
            0,
            "Toppings release moisture; assembling late keeps the bread or cracker from becoming soggy.",
          ),
        ],
      },
      {
        title: "Preparing Egg Dishes",
        description: "Egg structure, quality and cooking methods.",
        lessons: [
          tleLesson(
            "Egg Structure and Quality",
            "Parts of the egg and how to tell a fresh one.",
            "3S9woaOaQ0s",
            `## Parts of the egg
- **Shell** — about 11% of the egg; porous, so it absorbs odors
- **Shell membranes** — two thin layers inside the shell
- **Air cell** — a pocket at the wide end; it **grows larger** as the egg ages
- **Albumen (egg white)** — about 58%; mostly water and protein
- **Chalazae** — twisted cords that hold the yolk in the center; prominent in fresh eggs
- **Yolk** — about 31%; contains fat, protein, vitamins A and D and iron

## Nutritional value
Eggs are an affordable source of **complete protein**, vitamins and minerals.

## Testing freshness
- **Water test:** a fresh egg **sinks and lies flat**; an older egg tilts or stands up; a stale egg **floats** (its air cell is large).
- **Break test:** a fresh egg has a **thick, firm white** and a **high, round yolk**; an old egg spreads thin with a flat yolk.
- **Candling:** holding the egg to a light shows the air cell size and any spots.

## Egg grades and sizes
Eggs are sold by size (jumbo, extra large, large, medium, small, peewee) based on weight.

## Storage
Refrigerate with the **wide end up**, away from strong-smelling food; use within 3–5 weeks.`,
            "An egg has a shell, membranes, air cell, albumen, chalazae and yolk. Fresh eggs sink in water and have a firm white and a high yolk.",
            [
              "What holds the yolk in the center of the egg?",
              "How does the water test show an egg's freshness?",
              "Why should eggs be stored away from strong odors?",
            ],
          ),
          tleLesson(
            "Egg Cooking Methods",
            "Dry-heat and moist-heat ways to cook eggs.",
            "MoSjCqNU5lE",
            `## Principle of cooking eggs
Egg protein **coagulates** (sets) with heat. Cook eggs at **moderate heat** — too much heat makes the white rubbery and the yolk dry and green-ringed.

## Moist-heat methods
- **Hard-cooked (boiled)** — simmer 10–12 minutes, then cool in cold water. Overcooking makes a **green ring** around the yolk.
- **Soft-cooked** — 3–5 minutes; the yolk stays runny.
- **Poached** — cracked into gently simmering water with a little vinegar; the white sets around a soft yolk.
- **Coddled** — cooked in a covered cup set in hot water.

## Dry-heat methods
- **Fried** — sunny side up, over easy, over hard
- **Scrambled** — beaten and stirred over low heat until soft curds form
- **Omelet** — beaten eggs cooked flat and folded, with fillings (Spanish omelet, tortang talong)
- **Baked (shirred)** — cooked in a dish in the oven
- **Soufflé** — beaten egg whites folded into a base and baked until puffed

## Uses of egg in cooking
**Binding** (meatballs), **leavening** (sponge cake), **thickening** (custards), **emulsifying** (mayonnaise), **coating** (breading), **glazing** (brushed on bread).

## Key points
Low to moderate heat and correct timing give tender eggs.`,
            "Egg protein sets with heat; cook at moderate heat. Moist-heat methods include boiling and poaching; dry-heat methods include frying, scrambling and omelets.",
            [
              "What causes the green ring around a boiled yolk?",
              "Give one moist-heat and one dry-heat egg method.",
              "Name two uses of eggs in cooking.",
            ],
          ),
        ],
        quiz: [
          q(
            "Which part of the egg grows larger as the egg gets older?",
            ["Yolk", "Chalazae", "Air cell", "Shell"],
            2,
            "As an egg ages, moisture escapes through the shell and the air cell at the wide end gets bigger.",
          ),
          q(
            "In the water test, a stale egg will…",
            ["sink and lie flat", "float", "break", "change color"],
            1,
            "A stale egg has a large air cell, which makes it float. Fresh eggs sink and lie flat.",
          ),
          q(
            "A green ring around the yolk of a boiled egg is caused by…",
            ["using cold water", "overcooking", "a fresh egg", "adding salt"],
            1,
            "Overcooking causes iron in the yolk to react with sulfur in the white, forming the green ring.",
          ),
          q(
            "Cracking an egg into gently simmering water is called…",
            ["frying", "poaching", "baking", "scrambling"],
            1,
            "Poaching cooks the egg out of its shell in gently simmering liquid.",
          ),
          q(
            "In mayonnaise, the egg acts as an…",
            ["emulsifier", "leavener", "coating", "glaze"],
            0,
            "Egg yolk contains lecithin, which holds oil and vinegar together in an emulsion.",
          ),
        ],
      },
    ],
  },

  {
    key: "TLE9-ACP",
    code: "TLE 9-ACP",
    name: "TLE 9 – Agri-Fishery Arts: Agricultural Crop Production",
    department: TLE_DEPARTMENT,
    description: "Nursery operations and crop establishment (TESDA ACP NC I).",
    colorToken: "emerald",
    units: [
      {
        title: "Nursery Operations",
        description: "Setting up a nursery and raising healthy seedlings.",
        lessons: [
          tleLesson(
            "Establishing a Nursery",
            "Choosing a site and building a nursery.",
            "8BHMkkMJeGc",
            `## What is a nursery?
A **nursery** is a place where seedlings and young plants are raised and cared for until they are ready for transplanting.

## Choosing the site
- **Near a water source**
- **Good drainage** — not flooded during rains
- **Partial shade** and protection from strong wind
- Accessible for bringing in materials and taking out seedlings
- Free from pests, weeds and animals (fenced)

## Kinds of nurseries
- **Temporary** — for one season, made of local materials
- **Permanent** — for continuous production, with sturdy structures

## Facilities
- **Seedbeds** or **seed boxes** and **seedling trays** (plug trays)
- **Shed / net house** with UV plastic or shade net to protect from heavy rain and sun
- **Potting area** for preparing growing media
- **Hardening area** — where seedlings are gradually exposed to full sun
- **Water supply** and a **storage room** for tools

## Growing media
A clean, loose mix of **garden soil, sand and compost** (or **carbonized rice hull**), sometimes sterilized to kill disease organisms.

## Key points
A good nursery produces **strong, uniform, disease-free seedlings** — the foundation of a good harvest.`,
            "A nursery raises seedlings until transplanting. Choose a site near water, well-drained and protected; include seedbeds, a shed, a potting area and a hardening area.",
            [
              "Give three things to consider when choosing a nursery site.",
              "What is the hardening area for?",
              "What makes a good growing medium?",
            ],
          ),
          tleLesson(
            "Seed Germination and Seedling Care",
            "Getting seeds to sprout and seedlings to grow strong.",
            "3KNwDYH05vs",
            `## Germination
**Germination** is the sprouting of a seed into a seedling. It needs:
- **Water** — softens the seed coat and starts growth
- **Air (oxygen)** — for respiration
- **Right temperature** — most vegetables 20–30 °C
- Some seeds need **light** or **darkness**

## Seed testing
Before planting, test a sample: put **100 seeds** on a moist cloth or seed box; after several days count the sprouts.
**Germination % = (seeds that germinated ÷ seeds tested) × 100**
Example: 85 of 100 sprouted → **85%** germination.

## Sowing in the seedbed or tray
- Sow at a depth **about 2–3 times the seed's size**.
- Water gently with a **fine sprinkler** so seeds don't wash away.
- Cover with mulch or paper until they sprout.

## Caring for seedlings
- **Watering** — morning or late afternoon; keep moist, not soggy
- **Thinning** — remove weak, crowded seedlings
- **Pricking** — moving young seedlings to individual pots or cells
- **Fertilizing** — light doses of a balanced fertilizer
- **Pest and disease control** — watch for **damping-off** (seedlings rot at the stem base)
- **Hardening off** — reduce water and gradually expose seedlings to full sun 1–2 weeks before transplanting

## Key points
Healthy seedlings recover quickly after transplanting.`,
            "Seeds need water, air and the right temperature to germinate. Test germination, sow at the proper depth, and harden seedlings off before transplanting.",
            [
              "What three conditions do seeds need to germinate?",
              "If 90 of 100 seeds sprout, what is the germination percentage?",
              "What is hardening off?",
            ],
          ),
        ],
        quiz: [
          q(
            "Which is the best site for a nursery?",
            [
              "A low area that floods",
              "Near a water source with good drainage",
              "Far from any road and water",
              "Under a dense tree with no light",
            ],
            1,
            "Seedlings need regular watering and must not sit in floodwater, so a site near water with good drainage is best.",
          ),
          q(
            "Gradually exposing seedlings to full sun before transplanting is called…",
            ["pricking", "thinning", "hardening off", "damping-off"],
            2,
            "Hardening off toughens seedlings so they can survive field conditions after transplanting.",
          ),
          q(
            "If 80 out of 100 seeds sprout, the germination percentage is…",
            ["8%", "20%", "80%", "100%"],
            2,
            "(80 ÷ 100) × 100 = 80% germination.",
          ),
          q(
            "Removing weak and crowded seedlings to give others space is…",
            ["thinning", "hardening", "watering", "mulching"],
            0,
            "Thinning removes extra seedlings so the remaining ones get enough light, water and nutrients.",
          ),
          q(
            "A disease that makes seedlings rot at the base of the stem is…",
            ["blight", "damping-off", "rust", "mosaic"],
            1,
            "Damping-off is caused by soil fungi in wet, crowded conditions and kills young seedlings at the stem base.",
          ),
        ],
      },
      {
        title: "Crop Establishment",
        description: "Transplanting seedlings and applying fertilizer.",
        lessons: [
          tleLesson(
            "Transplanting Seedlings",
            "Moving seedlings to the field with little shock.",
            "qgHqh9s8C8Q",
            `## What is transplanting?
**Transplanting** is moving seedlings from the nursery to their permanent place in the field. Rice, tomato, eggplant, pepper and cabbage are usually transplanted.

## When are seedlings ready?
Usually at **3–5 true leaves** or about **3–4 weeks** old (depends on the crop), and after hardening off.

## Steps
- **Water the seedlings** a few hours before so the soil holds around the roots.
- **Prepare the holes** in the field at the right **distance of planting** (e.g. tomato: 50 cm between plants, 75–100 cm between rows).
- **Lift seedlings** carefully with a ball of soil; hold them by the **leaves, not the stem**.
- **Plant** at the same depth as in the nursery (a little deeper for tomato), firm the soil around the roots.
- **Water** right after planting.

## Best time
**Late afternoon or on a cloudy day**, so seedlings recover overnight without hot sun.

## Reducing transplant shock
- Keep roots moist and covered while moving.
- Provide temporary shade if hot.
- Replace dead seedlings (**replanting**) within a week.

## Key points
Careful handling of roots is the key to fast recovery and uniform growth.`,
            "Transplant hardened seedlings at 3–5 true leaves, in the late afternoon, holding them by the leaves and keeping a ball of soil around the roots. Water right after.",
            [
              "At what stage are seedlings usually ready for transplanting?",
              "Why are seedlings held by the leaves instead of the stem?",
              "Why is late afternoon the best time to transplant?",
            ],
          ),
          tleLesson(
            "Fertilizer Application",
            "Feeding crops the right nutrients in the right way.",
            "vO2aasQuyV0",
            `## Plant nutrients
- **Macronutrients:** **Nitrogen (N)** for leafy growth, **Phosphorus (P)** for roots and flowers, **Potassium (K)** for fruit quality and disease resistance
- **Secondary:** calcium, magnesium, sulfur
- **Micronutrients:** iron, zinc, boron and others in small amounts

## Kinds of fertilizer
- **Organic** — compost, animal manure, vermicast; improves soil but releases nutrients slowly
- **Inorganic (commercial)** — fast-acting. The label shows **N-P-K** percentages:
  - **Urea 46-0-0** — nitrogen
  - **Complete 14-14-14** — equal N, P and K
  - **Muriate of potash 0-0-60** — potassium

## Methods of application
- **Broadcasting** — spreading evenly over the field
- **Band / side-dressing** — in a line beside the plants
- **Ring method** — in a circle around a tree, under the leaf edge
- **Basal** — mixed into the soil before planting
- **Foliar** — sprayed on leaves in liquid form
- **Fertigation** — dissolved in irrigation water

## Computing fertilizer
Amount = **nutrient needed ÷ % nutrient in fertilizer**.
Example: 46 kg N needed using urea (46% N) → 46 ÷ 0.46 = **100 kg urea**.

## Key points
Too much fertilizer **burns** plants and pollutes water — follow a **soil test** and recommended rates.`,
            "N is for leaves, P for roots and flowers, K for fruit and resistance. Fertilizer labels show N-P-K; apply by broadcasting, side-dressing, ring, basal or foliar methods.",
            [
              "Which nutrient promotes leafy growth?",
              "What do the numbers 14-14-14 mean?",
              "How many kg of urea (46% N) supply 23 kg of nitrogen?",
            ],
          ),
        ],
        quiz: [
          q(
            "Seedlings should be held by the…",
            ["stem", "roots", "leaves", "flowers"],
            2,
            "A bruised stem can kill the seedling, but a damaged leaf can be replaced, so seedlings are held by the leaves.",
          ),
          q(
            "The best time to transplant seedlings is…",
            [
              "noon on a sunny day",
              "late afternoon or a cloudy day",
              "during a typhoon",
              "midnight",
            ],
            1,
            "Cool conditions reduce water loss, letting seedlings recover from transplant shock overnight.",
          ),
          q(
            "Which nutrient mainly promotes green, leafy growth?",
            ["Nitrogen", "Phosphorus", "Potassium", "Calcium"],
            0,
            "Nitrogen is a building block of chlorophyll and protein, so it drives leafy growth.",
          ),
          q(
            "A fertilizer labeled 0-0-60 supplies mainly…",
            ["nitrogen", "phosphorus", "potassium", "organic matter"],
            2,
            "The three numbers are N-P-K; 0-0-60 means 60% potassium (muriate of potash).",
          ),
          q(
            "Applying fertilizer in a circle around a fruit tree is the…",
            [
              "broadcast method",
              "ring method",
              "foliar method",
              "basal method",
            ],
            1,
            "The ring method places fertilizer in a circle under the leaf edge, where the feeder roots are.",
          ),
        ],
      },
    ],
  },

  {
    key: "TLE9-EIM",
    code: "TLE 9-EIM",
    name: "TLE 9 – Industrial Arts: Electrical Installation and Maintenance",
    department: TLE_DEPARTMENT,
    description:
      "Circuits, Ohm's law and installing wiring devices (EIM NC II).",
    colorToken: "indigo",
    units: [
      {
        title: "Electrical Circuits",
        description: "Series and parallel circuits and Ohm's law.",
        lessons: [
          tleLesson(
            "Series and Parallel Circuits",
            "Two basic ways to connect loads.",
            "hb8Lj76BNZE",
            `## Parts of a circuit
A **circuit** is a complete path for current: a **source** (battery, outlet), **conductors** (wires), a **load** (lamp, motor), and a **control** (switch). An **open circuit** has a break, so no current flows; a **short circuit** lets current bypass the load — dangerous.

## Series circuit
Loads are connected **end to end in one path**.
- The **same current** flows through every load.
- The source voltage is **divided** among the loads.
- Total resistance **adds up**: R_T = R₁ + R₂ + R₃
- **If one lamp burns out, all go off** (like old Christmas lights).

## Parallel circuit
Loads are connected **across the same two points**, each on its own branch.
- Every load gets the **full voltage**.
- The total current is the **sum** of the branch currents.
- Total resistance is **smaller than the smallest** branch: 1/R_T = 1/R₁ + 1/R₂ + …
- **If one lamp burns out, the others stay on.**

## Which is used in houses?
**Parallel** — every outlet and light gets 220 V and can be switched independently.

## Series–parallel
A combination of both, used in many electronic devices.

## Key points
Switches and fuses are wired in **series** with what they control or protect.`,
            "In series, one path carries the same current and one failure stops all loads. In parallel, each load gets full voltage and works independently, which is why houses are wired in parallel.",
            [
              "What happens in a series circuit when one lamp burns out?",
              "Why are houses wired in parallel?",
              "What is a short circuit?",
            ],
          ),
          tleLesson(
            "Ohm's Law and Electrical Quantities",
            "Voltage, current, resistance and power.",
            "uQcUXB8YBb8",
            `## Electrical quantities
- **Voltage (V)** — the electrical "push," measured in **volts**. Philippine homes use **220–230 V**.
- **Current (I)** — the flow of electrons, measured in **amperes (A)**.
- **Resistance (R)** — opposition to current, measured in **ohms (Ω)**.
- **Power (P)** — the rate energy is used, measured in **watts (W)**.

## Ohm's Law
**V = I × R**, so **I = V / R** and **R = V / I**.
A memory aid is the triangle with V on top and I and R below.

**Example:** A 220 V circuit has a 44 Ω heater. I = 220 / 44 = **5 A**.

## Power
**P = V × I**
**Example:** A 1,100 W iron on 220 V draws I = 1,100 / 220 = **5 A**.

## Energy and the electric bill
**Energy (kWh) = power (kW) × time (h)**
**Example:** A 100 W bulb on for 10 hours uses 0.1 kW × 10 h = **1 kWh**. At ₱12/kWh, that costs **₱12**.

## Why it matters
Ohm's law tells you the current a load will draw, so you can choose the right **wire size** and **breaker rating**. A circuit drawing more current than its rating will **overheat**.

## Key points
More voltage → more current; more resistance → less current.`,
            "Ohm's law: V = I × R. Power: P = V × I. Energy in kWh = kW × hours; the electric bill is based on kWh used.",
            [
              "What current flows through a 55 Ω load on 220 V?",
              "How much current does a 660 W appliance draw on 220 V?",
              "How many kWh does a 200 W TV use in 5 hours?",
            ],
          ),
        ],
        quiz: [
          q(
            "In a series circuit, if one lamp burns out…",
            [
              "the others get brighter",
              "all the lamps go off",
              "nothing changes",
              "only the next lamp goes off",
            ],
            1,
            "A series circuit has only one path, so a break anywhere stops the current to every lamp.",
          ),
          q(
            "Houses are wired in parallel because…",
            [
              "it uses less wire",
              "each load gets full voltage and works independently",
              "it increases resistance",
              "it is required for batteries",
            ],
            1,
            "In parallel, every outlet gets the full 220 V and one appliance can be off without affecting the others.",
          ),
          q(
            "Using Ohm's law, a 220 V source across 44 Ω gives a current of…",
            ["2 A", "5 A", "9,680 A", "0.2 A"],
            1,
            "I = V ÷ R = 220 ÷ 44 = 5 A.",
          ),
          q(
            "The unit of electrical resistance is the…",
            ["volt", "ampere", "ohm", "watt"],
            2,
            "Resistance is measured in ohms (Ω). Volts measure voltage, amperes current and watts power.",
          ),
          q(
            "A 1,000 W appliance used for 3 hours consumes…",
            ["3 kWh", "0.3 kWh", "300 kWh", "1,003 kWh"],
            0,
            "Energy = 1 kW × 3 h = 3 kWh.",
          ),
        ],
      },
      {
        title: "Installing Wiring Devices",
        description: "Switches, outlets and testing with a multitester.",
        lessons: [
          tleLesson(
            "Installing Switches and Outlets",
            "Wiring a switch-controlled lamp and a convenience outlet.",
            "U56UBNHN1UE",
            `## Wiring devices
- **Switch** — opens and closes the circuit to a load. Kinds: **single-pole** (one location), **three-way** (two locations), **four-way** (three or more locations).
- **Convenience outlet** — where appliances plug in; **duplex** outlets have two receptacles. Use **grounded (3-prong)** outlets for appliances with metal bodies.
- **Lamp holder (receptacle)** — holds the bulb.

## Conductors
- **Line (hot / live)** — carries current from the source
- **Neutral** — returns current to the source
- **Ground** — a safety path, usually green or bare

## Rule for switches
The switch must be on the **line (hot) wire**, never the neutral. Then, when it's off, the lamp holder is truly dead and safe to touch.

## Wiring a lamp with a single-pole switch
- Line → switch → lamp holder → neutral
- Connect the neutral to the **shell (screw part)** of the lamp holder and the switched line to the **center contact**.

## Wiring an outlet
- Line to the **brass (darker) screw**, neutral to the **silver screw**, ground to the **green screw**.
- In the Philippines, outlets are wired in **parallel** off the branch circuit.

## Steps
Turn off the breaker → mount boxes → pull wires → strip ends → connect to terminals (loop clockwise around screws) → mount devices → turn on and test.`,
            "The switch goes on the line (hot) wire. On outlets: line to the brass screw, neutral to the silver screw, ground to the green screw.",
            [
              "Why must the switch be connected to the line wire?",
              "Which screw of an outlet receives the neutral wire?",
              "What kind of switch controls a lamp from two locations?",
            ],
          ),
          tleLesson(
            "Using the Multitester",
            "Measuring voltage, resistance and continuity.",
            "SitoeibtiAo",
            `## The multitester
A **multitester (multimeter)** measures several quantities. It can be **analog** (needle and scale) or **digital** (number display).

## Parts
- **Display / scale**
- **Selector switch** — chooses the quantity and range
- **Test probes** — **red (+)** and **black (−/COM)**
- **Zero-ohm adjust knob** (analog)

## Measuring AC voltage (outlet)
- Set to **ACV**, range **higher** than the expected voltage (e.g. 250 V for 220 V).
- Insert probes into the outlet slots; read the value.

## Measuring resistance / continuity
- **Turn off the power** first — never measure resistance on a live circuit.
- Set to **Ω (ohms)**; on analog meters, short the probes and adjust to **zero**.
- Touch the probes to the component or wire ends.
- **Continuity:** near **0 Ω** (or a beep) means the path is complete; **infinite (OL)** means it is open — for example a broken wire or blown fuse.

## Safety rules
- Start at the **highest range** if you don't know the value.
- Never set the meter to **ohms or current** while measuring voltage — it can be destroyed.
- Hold probes by the insulated part only.
- Turn the selector to **OFF** or the highest ACV range after use.

## Key points
The multitester tells you whether a circuit is live, complete or faulty before you touch it.`,
            "Set the multitester to ACV for outlets and to Ω for resistance and continuity (power off). Start at the highest range and hold probes by the insulation.",
            [
              "Which setting do you use to check a 220 V outlet?",
              "Why must power be off when measuring resistance?",
              "What reading shows that a wire is broken?",
            ],
          ),
        ],
        quiz: [
          q(
            "A switch should be connected to the…",
            ["neutral wire", "line (hot) wire", "ground wire", "lamp shell"],
            1,
            "Switching the hot wire cuts the live current, so the fixture is safe when the switch is off.",
          ),
          q(
            "Which switch controls one lamp from two different locations?",
            ["Single-pole", "Three-way", "Push button", "Pull chain"],
            1,
            "A pair of three-way switches lets you turn a light on or off from two places.",
          ),
          q(
            "On a convenience outlet, the neutral wire goes to the…",
            ["brass screw", "silver screw", "green screw", "center contact"],
            1,
            "The silver (light-colored) screw is for the neutral; brass is for the line and green for ground.",
          ),
          q(
            "To check whether an outlet has 220 V, set the multitester to…",
            ["Ω (ohms)", "DCA", "ACV", "hFE"],
            2,
            "Household outlets supply alternating current, so the AC voltage (ACV) setting is used, at a range above 220 V.",
          ),
          q(
            "A continuity test on a wire reads infinite resistance (OL). This means…",
            [
              "the wire is good",
              "the wire is broken (open)",
              "the wire is live",
              "the meter is in ACV",
            ],
            1,
            "Infinite resistance means there is no complete path, so the wire or component is open.",
          ),
        ],
      },
    ],
  },
];
