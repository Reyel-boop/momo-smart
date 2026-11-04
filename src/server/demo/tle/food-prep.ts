/**
 * Food Preparation — the TLE: FCS sector for Grade 9 or 10, from DepEd's
 * Budget of Work: the hot and cold kitchen, salads, stocks and soups (weeks
 * 1–5), then baking, bread and business ideas (weeks 6–10). Each lesson has a
 * lecture video, a written lecture, a class activity and a self-check, and
 * every unit five Unit Questions and five more for Live Quiz.
 */
import type { DemoSubject, DemoUnit } from "../grade10";
import { q, tleLesson, TLE_DEPARTMENT } from "./common";

const UNITS: DemoUnit[] = [
  {
    title: "Kitchen Operations and Basic Culinary Preparation",
    description:
      "Hot and cold kitchens, the brigade system, safety, recipes and costing, cutting, salads, stocks and soups.",
    lessons: [
      tleLesson(
        "Hot Kitchen and Cold Kitchen",
        "Two parts of a professional kitchen and what each does.",
        "cdlFTjOLpDM",
        `## Two kitchens
- **Hot kitchen** — where food is **cooked with heat**
- **Cold kitchen** (*garde manger*) — where **cold foods** are prepared

## How they differ
| | Hot kitchen | Cold kitchen |
|---|---|---|
| Foods | Soups, sauces, meats, fried dishes | Salads, cold cuts, sandwiches, desserts |
| Equipment | Stoves, ovens, grills, fryers | Refrigerators, slicers, cold tables |
| Main hazards | Burns, hot oil, fire | Cuts, spoilage from warm temperatures |
| Key concern | Cooking food thoroughly | Keeping food cold and clean |

## How they work together
A single plate often uses both: the **hot kitchen** grills the fish, and the **cold kitchen** prepares the salad on the side. Both must finish at the **same time**, so good communication matters.

## Keeping temperatures safe
Bacteria grow fastest between about **5 °C and 60 °C**. Keep hot food hot and cold food cold.`,
        `## Compare the Kitchens
Make a table of foods and equipment found in the hot and cold kitchens.

## Kitchen Sort
Sort a list of dishes into hot kitchen, cold kitchen or both.`,
        [
          "What is prepared in the cold kitchen?",
          "Give two hazards in a hot kitchen.",
          "Why must the two kitchens communicate?",
        ],
      ),
      tleLesson(
        "The Kitchen Brigade System",
        "Who does what in a professional kitchen.",
        "5PllNZMo0l8",
        `## What is the brigade system?
The **kitchen brigade** organizes kitchen staff into clear roles. It was developed by the French chef **Georges Auguste Escoffier**, and it is still used today.

## Main positions
| Position | Role |
|---|---|
| **Executive chef** | Leads the kitchen; plans menus and costs |
| **Sous chef** | Second in command |
| **Chef de partie** | Runs one station |
| **Commis** | Junior cook, helps a station |
| **Kitchen helper** | Washes and does basic preparation |

## Stations
- **Saucier** — sauces and sautéed food
- **Poissonnier** — fish
- **Rôtisseur** — roasted foods
- **Entremetier** — vegetables and soups
- **Garde manger** — cold foods
- **Pâtissier** — pastries and desserts

## Why it works
Everyone knows their **job**, who to **report to**, and how to work as **one team**. Orders move quickly, and quality stays the same.

Small restaurants combine roles. One cook may do several stations, but the same jobs still need to be done.`,
        `## Brigade Chart
Draw an organizational chart of a kitchen brigade.

## Who Am I?
Write clues for three positions, and let classmates guess each one.`,
        [
          "Who developed the kitchen brigade?",
          "What does a sous chef do?",
          "What does the pâtissier make?",
        ],
      ),
      tleLesson(
        "Occupational Safety and Health in Kitchen Operations",
        "Preventing accidents in the busiest room of all.",
        "Dw_w1QS1wNQ",
        `## Why OSH matters
**Occupational safety and health (OSH)** protects workers from injury and sickness. A kitchen has knives, fire, hot oil, wet floors and heavy loads. **RA 11058** requires employers and workers to keep workplaces safe.

## Common hazards and how to prevent them
- **Cuts** — keep knives sharp; cut away from you; never catch a falling knife
- **Burns** — use dry pot holders; turn handles inward; lower food gently into hot oil
- **Slips** — wipe spills at once; wear closed, non-slip shoes
- **Fires** — never leave cooking unattended; keep towels away from flames
- **Electric shock** — keep hands dry; don't use damaged cords
- **Strains** — lift with your legs; ask for help

## If oil catches fire
**Turn off the heat. Cover the pan with a lid. Never use water.** Water makes burning oil spread.

## Personal hygiene
Clean uniform, hair tied and covered, short nails, no jewelry. Wash hands often. Don't work with food when sick.

## Be ready
Know the location of the **first aid kit**, **fire extinguisher** and **exits**. Report all accidents.`,
        `## Hazard Spotting
Look at a picture of a kitchen, circle the hazards, and write how to fix them.

## Safety Rules
In groups, make a list of the ten most important safety rules for your school kitchen.`,
        [
          "What does OSH stand for?",
          "Why should you never use water on an oil fire?",
          "How can you prevent slips in the kitchen?",
        ],
      ),
      tleLesson(
        "Recipes and Recipe Costing",
        "Understanding a recipe and computing what it costs.",
        "wLn6FnS145Y",
        `## Parts of a recipe
- **Title** — the name of the dish
- **Yield** — how much it makes, or how many servings
- **Ingredients** — with exact amounts
- **Equipment** — tools needed
- **Procedure** — numbered steps
- **Cooking time and temperature**

A **standardized recipe** gives the same result every time.

## Recipe costing
1. List every ingredient and the amount used.
2. Find the cost of each amount.
3. Add them up for the **total recipe cost**.
4. Divide by the servings for the **cost per serving**.

**Cost of amount used = (amount used ÷ amount bought) × price**

## Example: vegetable soup, 6 servings
| Ingredient | Used | Cost |
|---|---|---|
| Carrots | 250 g of a ₱80/kg pack | ₱20 |
| Potatoes | 500 g of a ₱90/kg pack | ₱45 |
| Stock and seasoning | — | ₱25 |
| **Total** | | **₱90** |

- **Cost per serving:** ₱90 ÷ 6 = **₱15**

## Setting the price
**Food cost percent = cost per serving ÷ selling price × 100**

If you want a food cost of 30%: selling price = ₱15 ÷ 0.30 = **₱50**.`,
        `## Recipe Card
Write a recipe with all of its parts for a dish you know.

## Costing Worksheet
Compute the total cost, cost per serving and selling price of your recipe, using real market prices.`,
        [
          "What is the yield of a recipe?",
          "A recipe costs ₱120 and serves 8. What is the cost per serving?",
          "What is the selling price of a ₱20 serving at a 40% food cost?",
        ],
      ),
      tleLesson(
        "Cutting Techniques",
        "Safe knife skills and the classic cuts.",
        "W-cwpSElLP0",
        `## Knife safety
- Use a **sharp** knife; dull knives slip.
- Put a damp towel under the cutting board so that it doesn't move.
- Use the **claw grip**: curl your fingertips inward, and let the knife rest against your knuckles.
- Carry a knife **pointing down**, by your side.
- Never put knives in a sink of soapy water.
- Never try to catch a falling knife.

## Classic cuts
| Cut | Description |
|---|---|
| **Julienne** | Thin matchsticks, about 3 mm |
| **Bâtonnet** | Thicker sticks, about 6 mm |
| **Brunoise** | Tiny cubes, about 3 mm |
| **Small dice** | Cubes, about 6 mm |
| **Medium dice** | Cubes, about 12 mm |
| **Chiffonade** | Thin ribbons of leafy greens |
| **Mince** | Very finely chopped, such as garlic |
| **Slice** | Thin, even pieces |

## Why equal cuts matter
Pieces of the same size **cook evenly** and **look better**.

## Steps to practice
1. Wash and peel the vegetable.
2. **Square it off** so that it sits flat.
3. Cut into planks.
4. Stack the planks, and cut them into sticks.
5. Line up the sticks, and cut them into cubes.

Use the trimmings for stock, so that nothing goes to waste.`,
        `## Knife Skills Practice
Under your teacher's supervision, cut carrots or potatoes into julienne, bâtonnet and small dice. Your teacher checks your grip and the evenness of your cuts.`,
        [
          "Describe the claw grip.",
          "What is the difference between julienne and brunoise?",
          "Why should pieces be the same size?",
        ],
      ),
      tleLesson(
        "Preparing Salads and Salad Dressings",
        "Fresh, safe and attractive salads.",
        "-XFEJ5BZOM8",
        `## Parts of a salad
- **Base** — lettuce or other greens
- **Body** — the main ingredients
- **Garnish** — adds color and interest
- **Dressing** — adds flavor

## Kinds of salads
- **Green salad** — mainly leafy greens
- **Vegetable salad** — such as coleslaw, or ensaladang talong
- **Fruit salad**
- **Protein salad** — chicken, tuna or egg
- **Pasta or potato salad**

## Salad dressings
- **Vinaigrette** — oil and vinegar, usually **3 parts oil to 1 part vinegar**
- **Mayonnaise-based** — creamy; thousand island, ranch
- **Cooked dressing** — thickened with heat

An **emulsion** is a mix of oil and water liquids that usually separate. Shake a vinaigrette just before using it.

## Guidelines
1. **Wash** greens well in clean, cold water.
2. **Dry** them, because dressing won't stick to wet leaves.
3. **Tear or cut** into bite-size pieces.
4. **Keep it cold** until serving.
5. **Dress the salad just before serving**, so that it doesn't wilt.
6. Arrange neatly, with good color.

## Safety
Wash your hands, use a clean board that wasn't used for raw meat, and keep creamy salads refrigerated. Don't leave them out for more than two hours.`,
        `## Salad Laboratory
Under your teacher's supervision, prepare a salad and a dressing, following safety standards.

## Plate It
Draw how you would arrange your salad, and label its base, body, garnish and dressing.`,
        [
          "What are the four parts of a salad?",
          "What is the usual ratio of a vinaigrette?",
          "Why should a salad be dressed just before serving?",
        ],
      ),
      tleLesson(
        "Stocks",
        "The flavorful liquid behind soups and sauces.",
        "ZV76b_-PMjw",
        `## What is a stock?
A **stock** (*fond* in French, meaning "base") is a clear, flavored liquid made by simmering bones, vegetables and seasonings in water. It is the base of many soups and sauces.

## Parts of a stock
- **Major ingredient** — bones or vegetables
- **Mirepoix** — chopped onion, carrot and celery; commonly 2 parts onion, 1 part carrot, 1 part celery
- **Bouquet garni** — herbs tied together: thyme, bay leaf and parsley
- **Liquid** — cold water

## Types of stocks
| Stock | Made from |
|---|---|
| **White stock** | Chicken, beef or veal bones, not browned |
| **Brown stock** | Roasted bones with tomato |
| **Fish stock** (*fumet*) | Fish bones |
| **Vegetable stock** | Vegetables only |

## Steps in making a stock
1. Start with **cold water**, and cover the bones.
2. Bring it to a **simmer**. Don't boil hard, or the stock turns cloudy.
3. **Skim** the foam often.
4. Add the mirepoix and the herbs.
5. **Simmer**: about 30 minutes to 1 hour for fish or vegetables, and 3 to 4 hours for chicken.
6. **Strain**, and **cool quickly** in an ice bath.
7. **Refrigerate**, label and date.

No salt is added, because stocks are reduced later.`,
        `## Stock Comparison
Make a table of the four types of stocks, their ingredients and uses.

## Stock Making
Under your teacher's supervision, make a small batch of chicken or vegetable stock.`,
        [
          "What is mirepoix?",
          "Why start a stock with cold water?",
          "What is the difference between white and brown stock?",
        ],
      ),
      tleLesson(
        "Preparing Soups",
        "Clear, thick and special soups.",
        "2d38Rho8lyU",
        `## Types of soups
**Clear soups**
- **Broth** — simple seasoned stock with meat or vegetables
- **Bouillon** — strained, clear broth
- **Consommé** — a rich broth clarified until very clear

**Thick soups**
- **Cream soup** — thickened, with milk or cream
- **Purée** — thickened by its own blended vegetables or beans
- **Bisque** — rich, creamy shellfish soup
- **Chowder** — chunky, hearty soup

**Special soups**
- **Cold soups** — such as gazpacho
- **National soups** — our **sinigang**, **tinola**, **nilaga** and **molo**

## Steps in making a soup
1. Prepare and cut your ingredients.
2. **Sauté** onions and garlic.
3. Add the **stock**, and bring it to a simmer.
4. Add ingredients in order, with the ones that take longest going first.
5. **Season** near the end, and taste.
6. Serve **hot in warm bowls**, or cold in chilled bowls.

## Garnish
A little parsley, croutons or spring onions adds color and texture.

## Safety
Soup burns badly, so move pots carefully. Use a clean spoon each time you taste. Cool leftovers quickly, and reheat until steaming.`,
        `## Kitchen Operations and Basic Culinary Preparation
Learn the functions of hot and cold kitchens, safety practices, kitchen brigade roles, recipe components and basic costing, and prepare salads, stocks and soups while applying proper cutting techniques and safety standards.

For this lesson, prepare a soup using your stock, following the safety standards.`,
        [
          "Give the two main groups of soups.",
          "What is a purée soup?",
          "Give three Filipino soups.",
        ],
      ),
    ],
    quiz: [
      q(
        "Salads and cold cuts are prepared in the…",
        ["Cold kitchen", "Hot kitchen", "Dining room", "Bakery only"],
        0,
        "The cold kitchen, or garde manger, handles cold foods.",
      ),
      q(
        "Who is second in command in the kitchen?",
        ["Sous chef", "Commis", "Kitchen helper", "Pâtissier"],
        0,
        "The sous chef assists the executive chef.",
      ),
      q(
        "A pan of oil catches fire. What should you do?",
        [
          "Turn off the heat and cover it with a lid",
          "Pour water on it",
          "Carry it outside",
          "Fan the flames",
        ],
        0,
        "Covering cuts off the air. Water makes burning oil spread.",
      ),
      q(
        "Thin matchstick cuts are called…",
        ["Julienne", "Brunoise", "Chiffonade", "Mince"],
        0,
        "Julienne cuts are thin sticks, about 3 mm wide.",
      ),
      q(
        "Why shouldn't a stock be boiled hard?",
        [
          "It turns cloudy",
          "It turns sweet",
          "It freezes",
          "It loses its color",
        ],
        0,
        "A gentle simmer keeps a stock clear.",
      ),
    ],
    bank: [
      q(
        "The kitchen brigade was developed by…",
        [
          "Auguste Escoffier",
          "Per Henrik Ling",
          "Julia Child",
          "Louis Pasteur",
        ],
        0,
        "The French chef Escoffier organized the modern kitchen.",
      ),
      q(
        "A recipe costs ₱150 and serves 5. The cost per serving is…",
        ["₱15", "₱30", "₱50", "₱75"],
        1,
        "₱150 ÷ 5 = ₱30.",
      ),
      q(
        "Mirepoix is made of…",
        [
          "Onion, carrot and celery",
          "Rice, beans and corn",
          "Oil and vinegar",
          "Milk and flour",
        ],
        0,
        "Mirepoix gives flavor to stocks and soups.",
      ),
      q(
        "A basic vinaigrette is usually…",
        [
          "3 parts oil to 1 part vinegar",
          "1 part oil to 3 parts vinegar",
          "All vinegar",
          "All mayonnaise",
        ],
        0,
        "The classic ratio is three to one.",
      ),
      q(
        "Which is a clear soup?",
        ["Consommé", "Bisque", "Chowder", "Cream of mushroom"],
        0,
        "Consommé is clarified until it is very clear.",
      ),
    ],
  },
  {
    title: "Baking and Bread",
    description:
      "Baked products, ingredients and substitutes, oven temperatures, mixing methods, types of bread, and business ideas in baking.",
    lessons: [
      tleLesson(
        "Types of Baked Products",
        "Breads, cakes, pastries and cookies.",
        "I5iCUoIn7Lk",
        `## Main groups
- **Yeast breads** — pandesal, loaf bread, ensaymada
- **Quick breads** — muffins, banana bread, pancakes
- **Cakes** — butter cakes and foam cakes such as chiffon
- **Pastries** — pies, tarts, puff pastry, éclairs
- **Cookies** — drop, rolled, bar and sliced cookies

## Cakes
- **Butter cakes** — have a high fat content, and are rich and moist
- **Foam cakes** — get their lightness from beaten eggs: sponge, chiffon, angel cake

## Pastries
- **Short pastry** — tender and crumbly, used for pies and tarts
- **Puff pastry** — many thin layers
- **Choux** — hollow pastry for cream puffs

## Cookies
- **Drop** — scooped onto a tray
- **Rolled** — rolled and cut
- **Bar** — baked in a pan and sliced
- **Icebox** — chilled, then sliced

## Filipino favorites
Pandesal, monay, ensaymada, hopia, Spanish bread, polvoron, mamon, and egg pie.`,
        `## Bakery Survey
Visit or recall a bakery, list ten of its products, and group them by type.

## Product Chart
Make a chart of baked products with examples and their main features.`,
        [
          "Give the five main groups of baked products.",
          "What makes foam cakes light?",
          "Give four Filipino baked products.",
        ],
      ),
      tleLesson(
        "Baking Ingredients and Their Substitutes",
        "What each ingredient does, and what can replace it.",
        "96hiTNeLSEk",
        `## Main ingredients
- **Flour** — gives structure; **bread flour** has more protein than **cake flour**
- **Sugar** — sweetens, browns and keeps products soft
- **Fat** (butter, margarine, oil, shortening) — adds tenderness and flavor
- **Eggs** — add structure, moisture and color
- **Liquid** (water, milk) — binds and activates ingredients
- **Salt** — adds flavor, and controls yeast
- **Leavening** — makes products rise

## Leavening agents
- **Yeast** — a living organism that makes gas slowly
- **Baking powder** — works with moisture and heat
- **Baking soda** — needs an acid, such as calamansi juice or buttermilk

## Common substitutes
| Ingredient | Substitute |
|---|---|
| 1 cup cake flour | 1 cup all-purpose flour minus 2 tbsp, plus 2 tbsp cornstarch |
| 1 cup buttermilk | 1 cup milk plus 1 tbsp vinegar or calamansi juice |
| 1 tsp baking powder | ¼ tsp baking soda plus ½ tsp cream of tartar |
| 1 cup butter | 1 cup margarine |
| 1 cup milk | ½ cup evaporated milk plus ½ cup water |

## Measuring
Baking is exact. Weigh ingredients or level your cups. Too much flour gives dry products, and too much leavening makes them fall.`,
        `## Ingredient Functions
Make a table of baking ingredients and what each one does.

## Substitute Solutions
Your recipe needs buttermilk and cake flour, but you have neither. Write what you would use and how much.`,
        [
          "What does fat do in baking?",
          "What must baking soda have to work?",
          "What can replace 1 cup of buttermilk?",
        ],
      ),
      tleLesson(
        "Oven Temperatures and Mixing Methods",
        "How hot to bake, and how to combine ingredients.",
        "GME9g4nXaBA",
        `## Oven temperatures
Always **preheat** your oven. Times vary, so follow your recipe and check for doneness.

| Product | Temperature |
|---|---|
| Sponge and chiffon cakes | 160–175 °C |
| Butter cakes | 175–190 °C |
| Cookies | 175–190 °C |
| Muffins | 190–205 °C |
| Yeast breads | 175–205 °C |
| Puff pastry | 200–220 °C |

## Mixing methods
- **Creaming** — beat fat and sugar until light, add eggs, then flour and liquids in turns. *Butter cakes, cookies.*
- **Muffin** — mix dry ingredients, mix wet ingredients, then combine **just until moist**, since overmixing makes them tough. *Muffins, pancakes.*
- **Biscuit** — cut cold fat into flour, then add liquid. *Scones, biscuits, pie crust.*
- **Foaming** — beat eggs until thick, then gently fold in flour. *Sponge cakes.*
- **Straight dough** — mix all ingredients at once. *Yeast bread.*
- **Sponge dough** — mix part of the flour with yeast first, then add the rest. *Soft breads.*

## Key terms
- **Folding** — gently turning a mix to keep air in
- **Kneading** — working dough to develop gluten

## Checking doneness
Bread sounds hollow when tapped. A toothpick comes out clean from a cake.`,
        `## Match the Method
Match baked products to their mixing methods, and give their oven temperatures.

## Muffin Trial
Under your teacher's supervision, bake muffins using the muffin method.`,
        [
          "Why must you preheat the oven?",
          "Give the steps of the creaming method.",
          "What happens if muffin batter is overmixed?",
        ],
      ),
      tleLesson(
        "Types of Bread",
        "Quick breads, yeast breads and what makes them different.",
        "uQ7sqQBB4j8",
        `## Two big groups
- **Quick breads** rise with **baking powder or baking soda**, so they need no waiting. *Banana bread, muffins, pancakes, scones.*
- **Yeast breads** rise with **yeast** and need time. *Pandesal, loaf bread, ensaymada.*

## Kinds of yeast dough
- **Lean dough** — low in fat and sugar; crusty. *Baguette, crusty rolls.*
- **Rich dough** — high in fat, sugar and eggs; soft. *Ensaymada, brioche.*
- **Laminated dough** — butter folded in layers. *Croissant, Danish.*

## Popular breads
| Bread | Notes |
|---|---|
| **Pandesal** | Soft rolls with fine crumbs |
| **Monay** | Dense and slightly sweet |
| **Spanish bread** | Rolled, with a sweet filling |
| **Ensaymada** | Soft, coiled, with butter and sugar |
| **Loaf bread** | Sliced bread for sandwiches |
| **Baguette** | French, long and crusty |

## Key ingredients
Bread flour for strong **gluten**, yeast for rising, water or milk, salt for flavor and control, sugar to feed the yeast, and fat for softness.`,
        `## Bread Comparison
Make a table comparing quick breads and yeast breads: leavening, time and examples.

## Dough Sort
Sort a list of breads into lean, rich and laminated doughs.`,
        [
          "What is the difference between quick and yeast breads?",
          "What is a rich dough?",
          "Why is bread flour used for yeast bread?",
        ],
      ),
      tleLesson(
        "Preparing a Bread Product",
        "From dough to golden loaf.",
        "giy8zNCeX2I",
        `## The twelve steps, simplified
1. **Scale** — measure all ingredients.
2. **Mix** — combine them into a dough.
3. **Knead** — push, fold and turn the dough for about 10 minutes, until smooth and stretchy.
4. **First rise** — cover it, and let it double in size.
5. **Punch down** — gently press out the gas.
6. **Divide** — cut into equal pieces.
7. **Round** — shape into balls.
8. **Rest** — let the dough relax for about 10 minutes.
9. **Shape** — form the final product.
10. **Proof** — let shaped dough rise again.
11. **Bake** — in a preheated oven until golden.
12. **Cool** — on a wire rack before packing.

## Testing the dough
**Windowpane test:** stretch a small piece. If it forms a thin sheet without tearing, the gluten is ready.

**Poke test:** press a proofed dough. If it slowly springs back, it is ready.

## Common problems
| Problem | Likely cause |
|---|---|
| Doesn't rise | Old yeast, or water that was too hot |
| Dense | Under-kneaded or under-proofed |
| Collapsed | Over-proofed |
| Pale crust | Oven too cool |

## Safety
Use dry oven mitts, pull the rack out rather than reaching in, and stand aside as you open the oven.`,
        `## Basic Bread and Baking Techniques
Learn the types of baked products, baking ingredients, oven temperatures, mixing methods and types of bread, and prepare a simple bread product following proper procedures.

For this lesson, bake pandesal or another simple bread, and record any problems you met.`,
        [
          "Why is dough kneaded?",
          "What is the windowpane test?",
          "What might cause dough not to rise?",
        ],
      ),
      tleLesson(
        "Conceptualizing Business Ideas in Baking",
        "Turning your baking skills into a small business.",
        "b2vxwSAYpfE",
        `## Finding an idea
Think about what you **bake well**, what **people want**, and what's **missing** in your community.

*Examples: pandesal delivery, cupcakes for birthdays, healthy banana muffins, ube cheese pandesal for the school canteen.*

## Parts of a business concept
- **Product** — what you will sell
- **Target market** — who will buy it
- **Unique selling point** — why they should buy from you
- **Pricing** — cost plus markup
- **Place** — where you will sell
- **Promotion** — how people will find out

## Pricing example
Banana muffins, one batch of 12:
- Ingredients and packaging: **₱180**
- Gas and electricity: **₱36**
- Total: **₱216**; unit cost: **₱18**
- At a 50% markup: **₱27** per muffin. Round it to **₱28**.

## Name and brand
Choose a name that is easy to remember, and make a simple logo.

## Requirements
A real food business needs a **business name registration**, **barangay and mayor's permits**, a **sanitary permit** and **health certificates**.

## Start small
Test your product with friends and family, listen to their comments, and improve before growing.`,
        `## My Baking Business Concept
Create a business idea for a baking venture, including the type of product, target market, pricing and marketing plan.

Apply your creativity, entrepreneurship and recipe knowledge in a real-world context, then present your concept to the class.`,
        [
          "What are the parts of a business concept?",
          "What is a unique selling point?",
          "Name three requirements for a food business.",
        ],
      ),
    ],
    quiz: [
      q(
        "Banana bread rises because of…",
        ["Baking powder or soda", "Yeast only", "Salt", "Vinegar alone"],
        0,
        "Banana bread is a quick bread.",
      ),
      q(
        "Baking soda needs which of these to work?",
        ["An acid", "Salt", "Cold water", "Yeast"],
        0,
        "It reacts with an acid such as calamansi juice or buttermilk.",
      ),
      q(
        "Which method beats fat and sugar first?",
        ["Creaming", "Muffin", "Biscuit", "Foaming"],
        0,
        "The creaming method is used for butter cakes and cookies.",
      ),
      q(
        "Ensaymada is made from what kind of dough?",
        ["Rich dough", "Lean dough", "Choux", "Batter"],
        0,
        "Rich doughs are high in fat, sugar and eggs.",
      ),
      q(
        "The rise of shaped dough before baking is called…",
        ["Proofing", "Scaling", "Rounding", "Cooling"],
        0,
        "Proofing is the final rise.",
      ),
    ],
    bank: [
      q(
        "Which is a foam cake?",
        ["Chiffon cake", "Pound cake", "Fruit cake", "Muffin"],
        0,
        "Chiffon gets its lightness from beaten eggs.",
      ),
      q(
        "Which flour has the most protein?",
        ["Bread flour", "Cake flour", "Cornstarch", "Rice flour"],
        0,
        "High protein makes strong gluten.",
      ),
      q(
        "How do you know that bread is done?",
        [
          "It sounds hollow when tapped",
          "It sticks to the pan",
          "It smells sour",
          "It feels cold",
        ],
        0,
        "A hollow sound shows that the inside is baked.",
      ),
      q(
        "A batch of 12 costs ₱240. The unit cost is…",
        ["₱12", "₱20", "₱24", "₱30"],
        1,
        "₱240 ÷ 12 = ₱20.",
      ),
      q(
        "Bread doesn't rise, and the water was very hot. The likely cause is…",
        [
          "The yeast was killed",
          "Too little salt",
          "The oven was hot",
          "Too much kneading",
        ],
        0,
        "Very hot water kills yeast.",
      ),
    ],
  },
];

export const foodPreparation: DemoSubject = {
  key: "TLE9-PREP",
  code: "TLE 9-PREP",
  name: "TLE 9–10 – FCS: Food Preparation",
  department: TLE_DEPARTMENT,
  description:
    "Kitchen operations, salads, stocks, soups, bread and baking businesses — a one-term TLE: FCS sector for Grade 9 or 10.",
  colorToken: "orange",
  units: UNITS,
};
