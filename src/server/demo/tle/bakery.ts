/**
 * Bakery Operations, Grade 11 — a Technical-Professional elective of DepEd's
 * Strengthened Senior High School Curriculum (Bread and Pastry Production
 * NC II). One unit per quarter: breads, pastries, cakes and petit fours;
 * one lesson per learning competency or content group, each with a written
 * lecture, an activity and a self-check, and every unit with five Unit
 * Questions and five more for Live Quiz. Lessons have no video yet;
 * teachers can attach one from the Courses page.
 */
import type { DemoLesson, DemoSubject, DemoUnit } from "../grade10";
import { q, TLE_DEPARTMENT } from "./common";

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
  lecture: { videoId: "", lecture },
});

const UNITS: DemoUnit[] = [
  // Quarter 1
  {
    title: "Fundamentals of Baking Bread",
    description:
      "The baking industry, tools, ingredients, conversions and costing, bread making, food safety, and packaging and marketing.",
    lessons: [
      lesson(
        "Overview of the Baking Industry",
        "History, careers, baking terms, and trends in baking.",
        `## A short history
- Ancient **Egyptians** discovered that dough left out **fermented** and rose — the first leavened bread, around 3000 BC.
- The **Romans** built public bakeries and mills; bakers formed guilds.
- The **Industrial Revolution** brought mills, commercial yeast and ovens that made bread for whole cities.
- In the **Philippines**, the Spanish brought wheat bread; Filipinos made it their own — **pandesal**, ensaymada, monay, Spanish bread and hopia are sold in every *panaderya*.

## Careers and business opportunities
- **Baker** — mixes, shapes and bakes breads and pastries
- **Artisan baker** — hand-crafted, traditional breads like sourdough and baguettes
- **Cake decorator** — designs and finishes cakes for events
- **Entrepreneur** — runs a home bakery, panaderya or online shop
- **Food vlogger / food influencer** — shares recipes and reviews online
- Graduates can take the **Bread and Pastry Production NC II** assessment from TESDA.

## Baking terms to know
- **Leavening** — making gas in a dough or batter so it rises
- **Gluten** — the stretchy protein network formed from wheat flour and water
- **Fermentation** — yeast changing sugar into gas and alcohol
- **Proofing** — the final rise of shaped dough before baking
- **Punching** — gently pressing the air out of risen dough

## Trends and innovations
Artisan and sourdough breads, healthier options (whole grain, less sugar, gluten-free), plant-based baking, and selling online with eye-catching packaging.`,
        "Visit or recall a panaderya in your community. List five products it sells and the career roles you think it needs to run.",
        [
          "Who first discovered leavened bread?",
          "Give three careers in the baking industry.",
          "What does proofing mean?",
        ],
      ),
      lesson(
        "Baking Tools and Equipment",
        "Measuring, mixing, baking and finishing tools.",
        `## Measuring tools
- **Dry measuring cups** — for flour and sugar; level off with a spatula
- **Liquid measuring cup** (250 and 500 ml) — read at eye level
- **Measuring spoons** — small amounts like salt, yeast and baking powder
- **Weighing scale** (2 kg and 10 kg) — the most accurate way to measure

## Mixing and preparation tools
- **Mixing bowls**, **wire whisk**, **wooden spoons** and **rubber scraper**
- **Flour sifter** and **strainer** — remove lumps and add air
- **Rolling pin** — flattens dough
- **Dough cutter / scraper** — divides dough and cleans tables
- **Pastry brush** — spreads egg wash and butter

## Bakeware
Sheet pans, loaf pans, muffin pans, round and rectangular pans, pie pans, and tart pans.

## Finishing tools
**Palette knife**, **cake turntable**, **piping bags**, **decorating tips** and **couplers**.

## Equipment
- **Commercial mixer** with paddle, whip and dough hook
- **Mechanical dough roller** — sheets dough evenly
- **Deck oven** — bakes directly on hot stone or steel decks
- **Proofer**, **refrigerator** and **freezer**, **gas range**

## Care of tools
Wash, dry and store tools after use; check equipment before using it; report broken tools.`,
        "Make a picture inventory of 10 baking tools at home or in the lab. For each, write its use and how to clean and store it.",
        [
          "Why is a weighing scale more accurate than measuring cups?",
          "What is a dough cutter used for?",
          "Name the three common attachments of a commercial mixer.",
        ],
      ),
      lesson(
        "Baking Ingredients and Substitutes",
        "What each ingredient does, its nutrition, and choosing quality ingredients.",
        `## Dry ingredients
- **Flour** — gives structure. **Bread flour** (high protein, strong gluten) for breads; **cake flour** (low protein) for tender cakes; **all-purpose flour** in between.
- **Sugar** — sweetens, browns the crust, keeps products moist, and feeds yeast.
- **Salt** — adds flavor and controls yeast so dough does not over-ferment.
- **Leaveners** — **yeast** (biological), **baking powder** and **baking soda** (chemical).

## Liquid ingredients
- **Water** — forms gluten and dissolves ingredients
- **Milk** — adds flavor, color and nutrition
- **Eggs** — structure, richness, color and emulsifying
- **Fats** (butter, margarine, shortening, oil, lard) — tenderize ("shorten" gluten) and add flavor

## Flavorings
Vanilla and other extracts, cocoa and chocolate, spices like cinnamon, fruits and nuts.

## Nutrition
Flour gives carbohydrates; eggs and milk give protein, calcium and vitamins; whole-wheat flour adds fiber.

## Choosing quality ingredients
Check **expiry dates**, look for clean, dry, lump-free flour and sugar, fresh-smelling fats, and clean, uncracked eggs. Store in airtight containers in a cool, dry place.

## Common substitutes
- 1 cup buttermilk → 1 cup milk + 1 tbsp vinegar or lemon juice
- 1 cup cake flour → 1 cup all-purpose flour minus 2 tbsp, plus 2 tbsp cornstarch
- Butter ↔ margarine in most recipes`,
        "Compare the labels of bread flour, all-purpose flour and cake flour (or look them up). Record the protein content and say which product each is best for.",
        [
          "Why is bread flour used for breads?",
          "Give two functions of sugar in baking.",
          "What can replace 1 cup of buttermilk?",
        ],
      ),
      lesson(
        "Conversions, Measuring and Product Costing",
        "Converting units and temperatures, resizing recipes, measuring, and costing.",
        `## Measuring methods
- **Flour** — sift, spoon lightly into the cup, then level. Never pack or tap.
- **Brown sugar** — pack firmly.
- **Liquids** — clear cup on a flat surface, read at **eye level**.
- **Fats** — press into the cup to remove air, or weigh.
- In bakeries, ingredients are **weighed** for accuracy.

## Conversions
- 1 cup = 16 tablespoons; 1 tablespoon = 3 teaspoons
- 1 kilogram = 1,000 grams; 1 cup ≈ 240 ml
- **Oven temperature:** °C = (°F − 32) × 5 ÷ 9. So 350 °F ≈ 177 °C (bakers use 175–180 °C).

## Recipe quantification and reduction
Find the **conversion factor**: new yield ÷ old yield. Multiply every ingredient by it.
*Example:* a recipe makes 24 rolls; you need 60. Factor = 60 ÷ 24 = 2.5, so 500 g flour becomes 1,250 g.

## Baker's percentage
Every ingredient is written as a percentage of the **flour weight (100%)**. With 1,000 g flour and 60% water, use 600 g water.

## Product costing
1. Cost each ingredient used (price ÷ package size × amount used)
2. Add them up = **total ingredient cost**
3. Add **packaging, labor, gas and electricity** (overhead)
4. Divide by the number of pieces = **cost per piece**
5. Add your **markup** (e.g. 30–50%) to set the **selling price**`,
        "A pandesal recipe uses 1 kg flour (₱55), 100 g sugar (₱7), 20 g salt (₱1), 10 g yeast (₱8), 50 g butter (₱20) and makes 50 pieces. Compute the cost per piece and a selling price with a 40% markup.",
        [
          "Convert 400 °F to Celsius.",
          "What is the conversion factor to turn a 12-piece recipe into 30 pieces?",
          "In baker's percentage, which ingredient is always 100%?",
        ],
      ),
      lesson(
        "Bread Products and Mixing Methods",
        "Quick breads, yeast breads and the ways to mix bread dough.",
        `## Two kinds of bread
- **Quick breads** — leavened by **baking powder or soda**, so no waiting for yeast: muffins, banana bread, biscuits, scones, pancakes.
- **Yeast breads** — leavened by **yeast** and fermentation: pandesal, loaf bread, ensaymada, Spanish bread, baguette.

## Mixing methods for yeast dough
- **Straight dough method** — all ingredients mixed at once, then fermented. Simple and fast.
- **Modified straight dough** — fat and sugar are creamed first, then the rest is added; used for rich, sweet doughs.
- **Sponge dough method** — part of the flour, water and yeast is fermented first (the **sponge**), then mixed with the rest; gives better flavor and volume.
- **No-knead method** — a wet dough rests for many hours so gluten forms on its own.
- **Sourdough starter** — wild yeast and lactic acid bacteria kept alive in flour and water; gives a tangy flavor.
- **Autolyse** — flour and water rest 20–60 minutes before salt and yeast, for easier kneading and better texture.

## Steps in making yeast bread
Scaling → mixing and kneading → first fermentation → punching → dividing and rounding → shaping (make-up) → proofing → baking → cooling.

## Signs of good bread
Good volume, even golden-brown crust, soft fine crumb, pleasant yeasty smell and taste.`,
        "Bake (or watch a demonstration of) one quick bread and one yeast bread. Compare their mixing time, rising time and texture in a table.",
        [
          "What leavens a quick bread?",
          "How is the sponge dough method different from the straight dough method?",
          "List the steps of yeast bread making in order.",
        ],
      ),
      lesson(
        "Contemporary Bread-making Techniques",
        "Tangzhong, yudane, and gluten-free and sugar-less breads.",
        `## Tangzhong method
A small part of the flour is **cooked with water or milk** (about 1 part flour to 5 parts liquid) into a thick paste at about **65 °C**, cooled, then added to the dough. The cooked starch holds more water, so bread stays **soft and moist longer** — the secret of Japanese milk bread (shokupan).

## Yudane method
A portion of the flour is mixed with **boiling water** (about equal weights) and left to rest, often overnight. It also **gelatinizes** the starch, giving a soft, chewy, moist crumb.

## Gluten-free alternatives
For people with **celiac disease** or gluten sensitivity: rice flour, cassava flour, corn flour, almond flour, oat flour (certified gluten-free). Binders such as **xanthan gum**, psyllium husk or eggs replace the stretch of gluten.

## Sugar-less and healthier alternatives
- Replace part of the sugar with **ripe banana, dates or honey** (natural sugars), or sugar substitutes like stevia.
- Use **whole-wheat, rye or multigrain** flour for more fiber.
- Remember: sugar also feeds yeast and browns the crust, so expect a paler, slower-rising bread.`,
        "Make a comparison chart: regular, tangzhong and gluten-free bread — ingredients, method, texture and who would buy each.",
        [
          "What makes tangzhong bread stay soft longer?",
          "How is yudane different from tangzhong?",
          "What replaces gluten in gluten-free bread?",
        ],
      ),
      lesson(
        "Food Safety, Sanitation and Risk Assessment",
        "Cleaning, sanitizing, waste disposal, personal hygiene and hazard control.",
        `## Cleaning and sanitizing
- **Cleaning** removes visible dirt and food with soap and water.
- **Sanitizing / disinfecting** reduces germs to safe levels (hot water, or a mild bleach solution — about 1 tbsp bleach per gallon of water).
- Steps: scrape → wash → rinse → sanitize → air-dry.
- Clean surfaces and equipment **before and after** use and between raw and ready-to-eat foods.

## Waste disposal
Separate **biodegradable** (dough scraps, eggshells), **recyclable** (cartons, bottles) and **residual** waste. Use covered bins and empty them daily to keep pests away.

## Personal hygiene
- Wash hands for **20 seconds** before work, after using the toilet, touching the face or handling raw eggs.
- Wear a **clean uniform, apron and hairnet**; no jewelry; keep nails short.
- Do not work when sick.

## Risk assessment and hazard control
- A **hazard** can cause harm; a **risk** is the chance it will.
- **Biological** (bacteria, molds), **chemical** (cleaning agents near food), **physical** (glass, hair, metal), and **workplace** hazards (burns from ovens, cuts, slips, mixer accidents).
- Control: identify the hazard → assess how likely and how serious → control it (oven mitts, dry floors, mixer guards, labels, first-aid kit) → review.`,
        "Do a hazard hunt in the baking lab. List five hazards, rate each as low, medium or high risk, and write a control measure for each.",
        [
          "What is the difference between cleaning and sanitizing?",
          "Give one example each of a biological, chemical and physical hazard.",
          "How long should you wash your hands?",
        ],
      ),
      lesson(
        "Packaging and Marketing Bakery Products",
        "Packaging, labelling, storage, marketing and pricing.",
        `## Packaging
Good packaging **protects** the product, keeps it **fresh**, and **attracts** buyers. Common materials: plastic bread bags, paper bags, boxes, clamshell containers, and eco-friendly kraft paper.

## Labelling
A label should show the **product name**, **ingredients** (and allergens like wheat, egg, milk, nuts), **net weight**, **date made and best-before date**, **price**, and the **maker's name and address**.

## Storage requirements
- Breads — cool, dry place at room temperature; eat within 2–3 days, or freeze.
- Cream- or custard-filled products — **refrigerate**.
- Cool baked goods completely before packing, or moisture will cause **mold**.

## Marketing strategies (the 4 Ps)
- **Product** — quality, variety, a "best seller"
- **Price** — based on cost plus markup, compared with competitors
- **Place** — store, school canteen, online shop, deliveries
- **Promotion** — social media posts, samples, bundles, loyalty cards

## Costing review
Selling price = cost per piece + markup. Know your **break-even point**: the number of pieces you must sell to cover all costs.`,
        "Design the package and label for a bakery product you would sell, and write one social-media post to promote it.",
        [
          "List four things a bakery label must show.",
          "Why must bread cool before packaging?",
          "What are the 4 Ps of marketing?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which flour is best for making breads?",
        ["Cake flour", "Bread flour", "Pastry flour", "Rice flour"],
        1,
        "Bread flour is high in protein, so it forms strong gluten that traps gas and gives bread volume.",
      ),
      q(
        "In the sponge dough method, what is fermented first?",
        [
          "All the ingredients at once",
          "Part of the flour, water and yeast",
          "The sugar and fat",
          "The salt and water",
        ],
        1,
        "A sponge of some flour, water and yeast ferments first, then is mixed with the rest — giving better flavor and volume.",
      ),
      q(
        "A recipe makes 20 pieces. What is the conversion factor to make 50?",
        ["0.4", "2", "2.5", "30"],
        2,
        "Conversion factor = new yield ÷ old yield = 50 ÷ 20 = 2.5.",
      ),
      q(
        "Glass in a loaf of bread is what kind of hazard?",
        ["Biological", "Chemical", "Physical", "Ergonomic"],
        2,
        "Foreign objects like glass, metal and hair are physical hazards.",
      ),
      q(
        "Which bread is leavened by baking powder, not yeast?",
        ["Pandesal", "Banana bread", "Ensaymada", "Baguette"],
        1,
        "Banana bread is a quick bread, leavened by chemical leaveners such as baking powder or soda.",
      ),
    ],
    bank: [
      q(
        "What does the tangzhong method cook before adding it to the dough?",
        [
          "The yeast and sugar",
          "Part of the flour with water or milk",
          "The eggs and butter",
          "The whole dough",
        ],
        1,
        "A flour-and-liquid paste is cooked to about 65 °C so the starch holds more water and the bread stays soft.",
      ),
      q(
        "In baker's percentage, flour is always…",
        ["10%", "50%", "100%", "Whatever is heaviest"],
        2,
        "Every ingredient is a percentage of the flour weight, which is set at 100%.",
      ),
      q(
        "Why is salt added to bread dough?",
        [
          "To make it sweet",
          "To flavor it and control yeast",
          "To make it rise faster",
          "To color the crust",
        ],
        1,
        "Salt adds flavor and slows the yeast so the dough does not over-ferment.",
      ),
      q(
        "Which of these should a bakery label include?",
        [
          "The baker's favorite color",
          "Ingredients and allergens",
          "The oven brand",
          "The recipe steps",
        ],
        1,
        "Labels list ingredients and allergens, net weight, dates, price and the maker.",
      ),
      q(
        "350 °F is about how many degrees Celsius?",
        ["120 °C", "150 °C", "177 °C", "350 °C"],
        2,
        "(350 − 32) × 5 ÷ 9 ≈ 177 °C.",
      ),
    ],
  },
  // Quarter 2
  {
    title: "Pastry Products",
    description:
      "Kinds and quality of pastry, crusts, fillings and coatings, traditional and contemporary pastries, and costing.",
    lessons: [
      lesson(
        "Introduction to Pastry",
        "Where pastry came from, its kinds and common products.",
        `## What is pastry?
**Pastry** is a dough of **flour, fat and liquid** (often with sugar or eggs) used for pies, tarts, puffs and flaky breakfast goods. The **fat** is the key: how it is mixed in decides whether a pastry is crumbly, flaky or puffy.

## Origin
- Ancient Egyptians, Greeks and Romans wrapped food in flour-and-oil dough.
- Medieval European cooks made pie crusts ("coffins") to bake and carry meat.
- French and Austrian bakers of the 1600s–1800s created **puff pastry**, **croissants** and **choux** — the base of modern pastry shops.
- Filipino favorites: **empanada**, **egg pie**, **buko pie**, **mamon tostado**, **otap**.

## Common pastry products
Pies, tarts, cream puffs and éclairs, croissants, Danish, turnovers, empanadas, baklava.

## Pastry by-products
Leftover trimmings of puff or pie dough are re-rolled and baked into **palmiers**, **cheese straws**, cinnamon twists and tart shells — so nothing goes to waste.

## Key rule
Keep pastry **cold**: cold fat makes flaky layers; warm fat melts into the flour and gives a tough, greasy crust.`,
        "List five pastry products sold in your area. For each, guess the kind of pastry it uses and its filling.",
        [
          "What three ingredients make up a basic pastry?",
          "Why should pastry dough be kept cold?",
          "Give two products that can be made from pastry trimmings.",
        ],
      ),
      lesson(
        "Kinds of Pastry and Pastry Quality",
        "Short-crust, filo, choux, flaky and puff pastry, and how to judge quality.",
        `## Kinds of pastry
- **Short-crust pastry** — fat rubbed into flour; **crumbly and tender**. Used for pies, tarts, quiches.
- **Filo (phyllo) pastry** — paper-thin sheets brushed with butter and layered; **crisp**. Used for baklava and spring-roll-like pastries.
- **Choux pastry (pâte à choux)** — cooked on the stove (water, butter, flour, eggs), then baked; **steam** puffs it hollow. Used for cream puffs, éclairs, profiteroles.
- **Flaky pastry** — pieces of fat left in the dough, folded a few times; **flaky layers**. Used for pie tops and turnovers.
- **Puff pastry** — butter **laminated** (rolled and folded) into dough many times; rises into hundreds of layers from steam.

## Laminated doughs
Yeast dough laminated with butter: **French pastry (croissant)** and **Danish pastry**.

## Judging quality
- **Appearance** — even golden color, good shape, neat edges
- **Taste** — buttery, not greasy, no raw-flour taste
- **Texture and mouthfeel** — flaky, crisp or tender as the kind should be
- **Composition** — right balance of crust and filling, filling set and not runny`,
        "Make a chart of the five kinds of pastry: how the fat is added, the texture, and two products of each.",
        [
          "What makes choux pastry hollow inside?",
          "How is puff pastry different from short-crust pastry?",
          "Name the four qualities used to judge pastry.",
        ],
      ),
      lesson(
        "Crusts, Fillings and Coatings",
        "Kinds of crust and filling, and how to finish pastries.",
        `## Kinds of crust
- **Single crust** — bottom only (custard pie, egg pie)
- **Double crust** — bottom and top (apple pie, buko pie)
- **Lattice** — strips woven on top
- **Crumb crust** — crushed graham or cookies with butter (cheesecake, refrigerator pies)
- **Blind baking** — baking an empty shell (with weights) before a cooked or cold filling

## Fillings and their functions
Fillings add **flavor, moisture, texture and variety**.
- **Cream filling** — pastry cream (milk, sugar, eggs, starch); in éclairs and cream pies
- **Fruit filling** — fresh, canned or dried fruit thickened with starch (apple, pineapple, buko)
- **Custard filling** — eggs and milk set by baking (egg pie, egg tart)
- **Chiffon filling** — a light filling lightened with **whipped egg whites or cream** and set with gelatin

## Coatings and finishes
- **Glaze** and **fruit glaze** — thin, shiny syrup or jam brushed on top
- **Caramel coating** — cooked sugar
- **Icing / frosting**
- **Chocolate, nut, sugar and coconut coatings**
- **Egg wash** — beaten egg brushed before baking for a golden shine`,
        "Plan a pie: choose the crust, filling and finish. Write the ingredients and why each choice suits the pie.",
        [
          "What is blind baking?",
          "How is a chiffon filling made light?",
          "What does an egg wash do?",
        ],
      ),
      lesson(
        "Traditional and Contemporary Pastries",
        "Croissants, Danish, baklava, tarts and pies, healthy options, and new hybrid pastries.",
        `## Traditional pastry products
- **Croissant** — crescent of laminated yeast dough; flaky outside, soft and layered inside
- **Danish** — laminated dough with sweeter dough, filled with fruit, custard or cheese
- **Baklava** — layers of filo with chopped nuts, soaked in syrup or honey
- **Tarts** — open, shallow crust with filling (egg tart, fruit tart)
- **Pies** — deeper crust, single or double (apple pie, buko pie, empanada)

## Gluten-free and healthy alternatives
Crusts from almond, rice or oat flour; less sugar; fruit-sweetened fillings; whole-grain crusts.

## Plant-based and vegan pastries
No animal products: **plant butter or coconut oil** instead of butter, **plant milk** (soy, oat, coconut) instead of milk, and **flaxseed "eggs"** or aquafaba (chickpea water) instead of eggs.

## Contemporary hybrids
- **Cronut** — croissant dough fried like a doughnut, filled and glazed
- **Cruffin** — croissant dough baked in a muffin tin
- **Brookie** — brownie and cookie baked together
- **Crookie** — a croissant stuffed with cookie dough`,
        "Invent your own hybrid pastry. Name it, list its two parent pastries, and sketch how it looks.",
        [
          "What pastry is used to make baklava?",
          "What can replace eggs in vegan pastry?",
          "What is a cronut?",
        ],
      ),
      lesson(
        "Costing and Marketing Pastry Products",
        "Costing, packaging, storage and selling pastries.",
        `## Costing pastries
Pastries use expensive ingredients (butter, cream, nuts), so cost carefully:
1. Cost the **crust** and the **filling** separately, then add any coating.
2. Add packaging (boxes, liners, labels) and overhead.
3. Divide by the yield for the **cost per piece**, then add your markup.

## Packaging
Pastries are **delicate**: use rigid boxes or clamshells, paper liners and inserts so they don't crush. Clear windows show off the product.

## Labelling and storage
- Label ingredients and **allergens** (wheat, egg, milk, nuts), dates, weight and price.
- Cream, custard and chiffon fillings must be **refrigerated** and sold within 1–2 days.
- Unfilled baked shells keep crisp in airtight containers.
- Unbaked laminated dough can be **frozen**.

## Marketing ideas
Sell **assorted boxes** for gifts and events, offer **pre-orders** for holidays, post attractive photos online, and give tasting samples.`,
        "Compute the cost and selling price of 12 egg tarts using current market prices, and design a gift box for them.",
        [
          "Why should crust and filling be costed separately?",
          "Which pastry fillings must be refrigerated?",
          "Give two ways to market pastries.",
        ],
      ),
    ],
    quiz: [
      q(
        "Which pastry is cooked on the stove before baking and puffs hollow?",
        ["Short-crust", "Filo", "Choux", "Flaky"],
        2,
        "Choux paste is cooked first, then baked; steam puffs it hollow for cream puffs and éclairs.",
      ),
      q(
        "Rolling and folding butter into dough many times is called…",
        ["Creaming", "Laminating", "Blind baking", "Proofing"],
        1,
        "Lamination builds the many butter-and-dough layers of puff pastry, croissants and Danish.",
      ),
      q(
        "Which filling is set by baking eggs and milk?",
        ["Fruit filling", "Custard filling", "Chiffon filling", "Cream cheese"],
        1,
        "Custard fillings set when the egg protein coagulates in the oven, as in egg pie.",
      ),
      q(
        "Baklava is made with which pastry?",
        ["Puff pastry", "Choux pastry", "Filo pastry", "Short-crust pastry"],
        2,
        "Baklava layers thin filo sheets with nuts and soaks them in syrup or honey.",
      ),
      q(
        "Why should pastry dough be kept cold?",
        [
          "So it bakes faster",
          "So the fat stays solid and makes flaky layers",
          "So it is sweeter",
          "So the yeast works faster",
        ],
        1,
        "Cold, solid fat creates layers and flakiness; melted fat gives a tough, greasy crust.",
      ),
    ],
    bank: [
      q(
        "A crust made of crushed graham crackers and butter is a…",
        ["Lattice crust", "Crumb crust", "Double crust", "Puff crust"],
        1,
        "Crumb crusts are pressed from crushed crackers or cookies with butter.",
      ),
      q(
        "A croissant stuffed with cookie dough is a…",
        ["Cronut", "Cruffin", "Brookie", "Crookie"],
        3,
        "A crookie combines a croissant and a cookie.",
      ),
      q(
        "What is brushed on pastry before baking for a golden shine?",
        ["Egg wash", "Fondant", "Ganache", "Water only"],
        0,
        "Beaten egg (egg wash) browns and gives pastry a glossy finish.",
      ),
      q(
        "In vegan pastry, butter can be replaced with…",
        ["Lard", "Coconut oil or plant butter", "Cream", "Ghee"],
        1,
        "Plant fats such as coconut oil or plant butter keep pastry free of animal products.",
      ),
      q(
        "Baking an empty pie shell before filling it is called…",
        ["Blind baking", "Docking", "Glazing", "Scaling"],
        0,
        "Blind baking sets the crust so a wet or cold filling won't make it soggy.",
      ),
    ],
  },
  // Quarter 3
  {
    title: "Cakes and Cake Products",
    description:
      "Cake ingredients and classes, quality, mixing techniques, frostings and glazes, decorating trends and mini cakes.",
    lessons: [
      lesson(
        "Fundamentals of Cake Production",
        "What makes a cake, and what each ingredient does.",
        `## Characteristics of cake products
Cakes are **sweet, tender** baked goods with a **fine, soft crumb**. Compared with bread they have more **sugar, fat and eggs** and use **soft (cake) flour**, so little gluten forms.

## Ingredients and their roles
Bakers group cake ingredients by what they do:
- **Tougheners / structure builders** — flour, eggs (whites especially), milk solids
- **Tenderizers** — sugar, fat, egg yolks, leaveners
- **Moisteners** — water, milk, eggs, syrups
- **Driers** — flour, cocoa, milk solids, starches
- **Leaveners** — baking powder, baking soda, air beaten into eggs or fat, and steam
- **Flavorings** — vanilla, chocolate, citrus zest, ube, pandan

A good formula **balances** these: too much sugar or fat and the cake falls; too much flour and it is dry and tough.

## Basic steps
Prepare pans and preheat the oven → scale ingredients → mix by the right method → pan and bake → test (a toothpick comes out clean; the top springs back) → cool → finish.`,
        "Sort the ingredients of a chocolate cake recipe into tougheners, tenderizers, moisteners, driers and leaveners.",
        [
          "Why is cake flour used for cakes?",
          "Name two tenderizers in a cake.",
          "How can you tell a cake is done?",
        ],
      ),
      lesson(
        "Classifying Cakes and Judging Their Quality",
        "Shortened, unshortened, rich and chiffon cakes, and quality standards.",
        `## Classes of cakes
- **Shortened (butter) cakes** — contain solid **fat** (butter, shortening); usually made by creaming. Pound cake, butter cake, chocolate cake, cupcakes.
- **Unshortened (foam) cakes** — little or no fat; leavened by **air whipped into eggs**. Sponge cake, angel food cake, jelly rolls (brazo de Mercedes uses meringue).
- **Rich cakes** — very high in fat, sugar and eggs; dense and moist. Fruitcake, pound cake, cheesecake.
- **Chiffon cakes** — a **combination**: oil and yolks like a shortened cake, folded with **meringue** like a foam cake; light and moist. Filipino favorites: mamon, chiffon, ube chiffon.

## Quality of cakes
- **Appearance** — even, level or slightly rounded top; uniform color; no cracks or sinking
- **Taste** — sweet and well-flavored, no bitter or eggy taste
- **Texture and mouthfeel** — fine, even crumb; soft and moist, not gummy or dry
- **Composition** — even layers and frosting, fillings in proportion

## Common faults
A sunken center (underbaked or too much leavening), tunnels (overmixing), a dry cake (overbaking or too much flour).`,
        "Taste-test two different classes of cake. Rate each on appearance, taste, texture and composition using a 1–5 scale.",
        [
          "What leavens an unshortened cake?",
          "Why is a chiffon cake called a combination cake?",
          "Give one cause of a sunken cake.",
        ],
      ),
      lesson(
        "Cake Mixing Techniques",
        "Creaming, reverse creaming, whipping, folding and the sponge method.",
        `## Creaming method
**Fat and sugar are beaten together** until light and fluffy, trapping air; eggs are added one at a time, then dry ingredients alternately with liquid. Used for **butter cakes** and cookies.

## Reverse creaming (two-stage) method
Dry ingredients and sugar are mixed first, then the **fat is mixed into the flour**, then the liquids. Coating the flour with fat limits gluten, giving a very **fine, tender** crumb.

## Whipping method
**Eggs (whole, yolks or whites) are whipped with sugar** to a thick foam that holds the air. Used for sponge and angel food cakes.

## Sponge method
Whole eggs and sugar are **warmed and whipped** until thick and pale (the "ribbon stage"), then flour is **folded** in gently. Makes light sponge cakes and rolls.

## Folding
A gentle way of combining a light mixture (meringue, whipped cream) with a heavier one using a spatula: **cut down the middle, sweep along the bottom, turn over**, rotating the bowl — so the air is not lost. Essential for chiffon cakes.

## Storing cakes
Cool completely, wrap well; store unfrosted cakes at room temperature 2–3 days or frozen; cakes with cream or cream-cheese frosting go in the refrigerator.`,
        "Make two small batches of cake — one by creaming and one by whipping — and compare their height and crumb.",
        [
          "What is beaten together first in the creaming method?",
          "Why does reverse creaming make a tender cake?",
          "Describe how to fold meringue into batter.",
        ],
      ),
      lesson(
        "Frostings, Icings and Glazes",
        "Kinds, functions and ingredients of cake coverings.",
        `## Functions
Frostings and icings **decorate**, add **flavor and sweetness**, keep the cake **moist** by sealing it, and hold layers together.

## Kinds of frosting and icing
- **Buttercream** — butter and/or shortening beaten with confectioners' sugar or sugar syrup. Smooth, easy to pipe.
- **Boiled icing (Italian meringue)** — hot sugar syrup poured into whipping egg whites. White, glossy, fluffy.
- **Fondant** — sugar paste rolled into a smooth sheet to cover cakes, or a poured fondant for glazing.
- **Fudge icing** — rich and heavy, cooked from sugar, butter and chocolate.
- **Royal icing** — egg whites (or meringue powder) and confectioners' sugar; dries **hard** — for cookies, flowers and fine piping.

## Glazes
Thin, shiny coatings: **ganache** (chocolate and cream), sugar glaze, fruit or jam glaze.

## Main ingredients
Confectioners' (powdered) sugar, butter or shortening, egg whites, cream, chocolate, flavorings and food coloring.

## Tips
Frost only a **cool** cake; do a thin **crumb coat** first, chill, then apply the final coat.`,
        "Prepare a small batch of buttercream and of boiled icing. Compare their taste, texture and how well they pipe.",
        [
          "Which icing dries hard and is used for fine piping?",
          "How is boiled icing made?",
          "What is a crumb coat for?",
        ],
      ),
      lesson(
        "Cake Decorating Trends and Mini Cakes",
        "Edible garnishes, drip cakes, minimalist designs, and classic and modern mini cakes.",
        `## Trends in cake decorating
- **Edible garnishes** — fresh flowers (safe, pesticide-free), fruits, herbs, edible gold leaf, chocolate shards
- **Drip cakes** — ganache or colored glaze dripping down the sides
- **Minimalist designs** — smooth or textured frosting with one simple accent; "bento" lunch-box cakes
- Buttercream piping in Korean and Russian tip flowers

## Mini cakes
Small, single-serve cakes for parties and gift boxes.
- **Size and shape** — 2–4 inches; round, square, heart, or cups
- **Ingredients** — the same batters, often sponge, chiffon or butter cake
- **Decorations** — piped buttercream, fondant toppers, fruit, sprinkles
- **Varieties** — cupcakes, mini bundt cakes, cake pops, petit gâteaux, mousse cups, mini cheesecakes
- **Flavors** — classic vanilla and chocolate, and local flavors: **ube, pandan, mango, calamansi, buko**

## Classical vs contemporary
**Classical** mini cakes keep traditional shapes and flavors (vanilla cupcake with buttercream swirl). **Contemporary** ones play with new shapes, mirror glazes, unusual flavors and minimalist styling.`,
        "Design a set of six mini cakes for a school event: draw them, name their flavors and decorations, and compute their cost.",
        [
          "What is a drip cake?",
          "Give three varieties of mini cakes.",
          "Name two local flavors popular in Filipino cakes.",
        ],
      ),
    ],
    quiz: [
      q(
        "A cake leavened mainly by air whipped into eggs, with little or no fat, is…",
        ["Shortened", "Unshortened", "Rich", "Pound"],
        1,
        "Unshortened (foam) cakes like sponge and angel food rely on whipped eggs, not fat.",
      ),
      q(
        "In the creaming method, what is beaten together first?",
        [
          "Flour and eggs",
          "Fat and sugar",
          "Milk and flour",
          "Eggs and baking powder",
        ],
        1,
        "Creaming beats fat and sugar until light, trapping air for butter cakes.",
      ),
      q(
        "Which icing dries hard and is used for fine piping and cookie decorating?",
        ["Buttercream", "Fudge icing", "Royal icing", "Whipped cream"],
        2,
        "Royal icing (egg whites and confectioners' sugar) sets hard.",
      ),
      q(
        "A chiffon cake combines oil and yolks with…",
        ["Yeast", "Folded meringue", "Puff pastry", "Ganache"],
        1,
        "Chiffon cakes fold whipped whites (meringue) into an oil-and-yolk batter, making them light and moist.",
      ),
      q(
        "Ganache is made of…",
        [
          "Butter and sugar",
          "Chocolate and cream",
          "Egg whites and sugar",
          "Flour and milk",
        ],
        1,
        "Ganache is a rich mixture of chocolate and heavy cream.",
      ),
    ],
    bank: [
      q(
        "Why is cake flour preferred for cakes?",
        [
          "It has more protein",
          "It has less protein, so the cake is tender",
          "It is cheaper",
          "It contains yeast",
        ],
        1,
        "Low-protein cake flour forms little gluten, giving a soft, fine crumb.",
      ),
      q(
        "Hot sugar syrup poured into whipping egg whites makes…",
        ["Royal icing", "Boiled icing", "Fondant", "Fudge icing"],
        1,
        "Boiled icing is an Italian meringue: whites whipped while hot syrup is added.",
      ),
      q(
        "Mixing the fat into the flour before adding liquids is the…",
        [
          "Creaming method",
          "Reverse creaming method",
          "Sponge method",
          "Straight dough method",
        ],
        1,
        "Reverse creaming coats the flour with fat to limit gluten and make a fine crumb.",
      ),
      q(
        "A thin first layer of frosting that traps crumbs is called a…",
        ["Crumb coat", "Drip coat", "Glaze", "Egg wash"],
        0,
        "The crumb coat is chilled before the final, clean layer of frosting.",
      ),
      q(
        "Which is a common cause of tunnels in a cake?",
        [
          "Overmixing",
          "Using cake flour",
          "Cooling on a rack",
          "Greasing the pan",
        ],
        0,
        "Overmixing develops gluten and forms long holes (tunnels) in the crumb.",
      ),
    ],
  },
  // Quarter 4
  {
    title: "Traditional and Contemporary Petit Fours",
    description:
      "The functions, kinds and characteristics of petit fours, current trends, and producing traditional and modern petit fours.",
    lessons: [
      lesson(
        "Petit Fours: Functions, Ingredients and Kinds",
        "What petit fours are, why they are served, and their main kinds.",
        `## What are petit fours?
**Petit four** is French for "**small oven**." Long ago, these bite-sized treats were baked in the cooling oven after the big breads and cakes were done. Today, petit fours are **small, elegant, one- or two-bite** cakes, pastries and confections.

## Functions
- Served at **receptions, weddings, debuts and teas**
- End a fine meal with **coffee or tea**
- Make attractive **gift boxes** and dessert platters
- Show off a baker's **skill and precision**

## Common ingredients
Sponge or butter cake (often almond sponge), almond paste and **marzipan**, **fondant**, chocolate, buttercream, jams and fruit fillings, nuts, and cookie doughs.

## Kinds of petit fours
- **Petit fours glacés** — "iced": small layered cakes coated in **poured fondant** or chocolate
- **Petit fours secs** — "dry": small cookies such as macarons, tuiles, sablés, meringues
- **Petit fours salés** — "savory": mini quiches, cheese puffs, savory tartlets
- **Fruit or jelly-filled** petit fours — cakes or tartlets with jam or fruit jelly
- **Marzipan** petit fours — shaped and colored almond paste

## Characteristics
Uniform **size**, neat **shape**, smooth finish, delicate decoration, and balanced flavor in a small bite.`,
        "Find pictures of the five kinds of petit fours and make a labeled poster showing one example of each.",
        [
          "What does 'petit four' mean?",
          "What is the difference between petit fours glacés and petit fours secs?",
          "Give two occasions where petit fours are served.",
        ],
      ),
      lesson(
        "Traditional and Modern Petit Fours and Trends",
        "Comparing classic and modern petit fours, and new trends.",
        `## Traditional vs modern
| | Traditional | Modern |
|---|---|---|
| **Size** | about 1–1½ inch, one bite | still small, sometimes bigger "two-bite" pieces |
| **Shape** | squares, rectangles, diamonds | domes, spheres, geometric molds |
| **Ingredients** | almond sponge, marzipan, fondant, jam | mousse, ganache, mirror glaze, local fruits |
| **Decorations** | piped royal icing, candied violets | gold leaf, chocolate décor, minimal accents |
| **Varieties** | glacés, secs, marzipan | entremets bites, mini tarts, macaron towers |
| **Flavors** | almond, vanilla, raspberry, chocolate | matcha, ube, mango, calamansi, salted caramel |

## Trends in making petit fours
- **3-D printed molds** — custom shapes and logos for events
- **Unique flavors** — local fruits, spices, floral notes
- **Designs** — mirror glazes, marbling, painted cocoa butter
- **Healthy ingredients** — less sugar, nut flours, fruit purées, gluten-free bases

## Quality reminders
Every piece in a set should be the **same size**, cleanly cut and neatly finished — guests eat them with their fingers in one or two bites.`,
        "Design a set of six modern petit fours using at least two Filipino flavors. Describe the size, shape and decoration of each.",
        [
          "Give two differences between traditional and modern petit fours.",
          "How are 3-D printed molds used in petit fours?",
          "Why must petit fours in a set be the same size?",
        ],
      ),
      lesson(
        "Producing Traditional Petit Fours",
        "Making iced, dry, savory, fruit-filled and marzipan petit fours.",
        `## Petit fours glacés (iced)
1. Bake a thin **sheet sponge** (often almond).
2. Layer with **jam or buttercream**; top with a thin sheet of **marzipan**.
3. Chill and press flat, then cut into **uniform squares or diamonds** with a hot, clean knife.
4. Coat with warm **poured fondant** (about 37–40 °C) or tempered chocolate on a rack.
5. Finish with a small piped design.

## Petit fours secs (dry)
Small cookies piped or cut uniformly: **macarons**, **tuiles**, **sablés**, **langues de chat**, meringue kisses. Bake on lined trays and store airtight.

## Petit fours salés (savory)
**Mini quiches**, **cheese gougères** (savory choux), **savory tartlets** and puff-pastry bites. Serve warm or at room temperature.

## Jelly or fruit-filled petit fours
Mini tartlet shells or cake squares filled with **fruit jam, jelly or curd**; finished with a fruit glaze.

## Marzipan petit fours
**Marzipan** (almond paste and sugar) is colored and shaped into mini fruits, flowers or animals, or rolled and cut into layered pieces.

## Storage and presentation
Keep cream items chilled; serve on platters or in **paper cups** in neat rows, and pack in rigid boxes with dividers.`,
        "In groups, produce one tray of petit fours glacés or secs. Evaluate size uniformity, finish and taste using a checklist.",
        [
          "What coating is poured over petit fours glacés?",
          "Give two examples of petit fours secs.",
          "What is marzipan made of?",
        ],
      ),
    ],
    quiz: [
      q(
        "'Petit four' is French for…",
        ["Little cake", "Small oven", "Sweet bite", "Four pieces"],
        1,
        "They were first baked in the cooling 'small oven' after the main baking.",
      ),
      q(
        "Petit fours secs are…",
        ["Iced cakes", "Dry, small cookies", "Savory bites", "Marzipan shapes"],
        1,
        "'Sec' means dry: small cookies such as macarons, tuiles and sablés.",
      ),
      q(
        "Mini quiches and cheese puffs are examples of…",
        [
          "Petit fours glacés",
          "Petit fours secs",
          "Petit fours salés",
          "Marzipan petit fours",
        ],
        2,
        "'Salé' means salty or savory.",
      ),
      q(
        "Marzipan is made mainly of…",
        [
          "Almond paste and sugar",
          "Flour and butter",
          "Egg whites only",
          "Chocolate and cream",
        ],
        0,
        "Marzipan is a sweet almond paste that can be colored and shaped.",
      ),
      q(
        "Which is a current trend in making petit fours?",
        [
          "Using only one flavor",
          "3-D printed molds",
          "Making them very large",
          "Skipping decoration",
        ],
        1,
        "3-D printed molds let bakers make custom shapes and logos.",
      ),
    ],
    bank: [
      q(
        "Petit fours glacés are usually coated with…",
        [
          "Poured fondant or chocolate",
          "Egg wash",
          "Flour",
          "Royal icing only",
        ],
        0,
        "Glacé means iced: they are coated in poured fondant or chocolate.",
      ),
      q(
        "Why are petit fours cut with a hot, clean knife?",
        [
          "To cook them more",
          "For clean, even edges",
          "To melt the filling",
          "To make them sweeter",
        ],
        1,
        "A hot, clean knife cuts neat, uniform pieces.",
      ),
      q(
        "Which is a dry petit four?",
        [
          "Mini quiche",
          "Macaron",
          "Iced sponge square",
          "Fruit tartlet with cream",
        ],
        1,
        "Macarons are small cookies — petit fours secs.",
      ),
      q(
        "Petit fours are often served…",
        [
          "As a main dish",
          "At receptions and with coffee or tea",
          "Only for breakfast",
          "Frozen",
        ],
        1,
        "They are elegant bites for receptions, weddings, teas and after dinner.",
      ),
      q(
        "A modern petit four flavor using local fruit could be…",
        ["Plain vanilla", "Mango or calamansi", "Almond only", "Unflavored"],
        1,
        "Modern petit fours often feature local flavors such as mango, calamansi and ube.",
      ),
    ],
  },
];

export const bakeryOperations11: DemoSubject = {
  key: "TLE11-BAKE",
  code: "TLE 11-BAKE",
  name: "Bakery Operations 11",
  department: TLE_DEPARTMENT,
  description:
    "Breads, pastries, cakes and petit fours — the Grade 11 Technical-Professional elective (Bread and Pastry Production NC II).",
  colorToken: "amber",
  units: UNITS,
};
