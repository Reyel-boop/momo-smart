/**
 * Food and Beverage Processing — the TLE: AFA sector for Grade 9 or 10, from
 * DepEd's Budget of Work: processing and selling foods (weeks 1–5), then fruit
 * juices and beverages (weeks 6–10). Each lesson has a lecture video, a
 * written lecture, a class activity and a self-check, and every unit five
 * Unit Questions and five more for Live Quiz.
 */
import type { DemoSubject, DemoUnit } from "../grade10";
import { q, tleLesson, TLE_DEPARTMENT } from "./common";

const UNITS: DemoUnit[] = [
  {
    title: "Processing and Selling Foods",
    description:
      "Economic potential, raw materials, preservation methods, packaging and labeling, costing, marketing, and selling.",
    lessons: [
      tleLesson(
        "Economic Demands and Potentials in the Area",
        "Finding out what your community needs and can produce.",
        "Je525QD5984",
        `## Why start here?
A processed food only earns money if people **want to buy it** and you can **get the raw materials**. Studying your area first prevents wasted effort.

## Demand and potential
- **Economic demand** — what people want and can afford to buy
- **Economic potential** — what your area can produce or sell well

## Questions to ask
- **What grows here?** Mangoes, bananas, fish, coconut, calamansi?
- **What is in surplus?** Extra harvests that go to waste are cheap raw materials.
- **What do people buy?** Check markets, stores and canteens.
- **Who are the buyers?** Students, tourists, families, stores.
- **Who else sells it?** Know your competitors and their prices.

## A simple market survey
1. Decide what you want to learn.
2. Write five short questions.
3. Ask at least 20 people.
4. Count the answers.
5. Choose the product with good demand and available materials.

## Example
A coastal town has plenty of fish, and tourists look for pasalubong. **Dried fish and bottled sardines** could be good products. An upland town with many mangoes could make **dried mangoes and jam**.

The Department of Trade and Industry and the Department of Science and Technology help small food businesses in many towns.`,
        `## Community Product Map
Draw a simple map of your community, and mark the raw materials and products found in each place.

## Mini Market Survey
Survey at least 20 people on what processed foods they buy. Present your results, and suggest one product.`,
        [
          "What is the difference between economic demand and potential?",
          "Why are surplus harvests a good raw material?",
          "Give the steps of a simple market survey.",
        ],
      ),
      tleLesson(
        "Selecting, Receiving and Handling Raw Materials",
        "Good products start with good ingredients.",
        "Vp2GktckLWI",
        `## Why it matters
Processing can't make bad raw materials good. Spoiled materials cause **poor products** and **food poisoning**.

## Selecting
- **Fruits and vegetables** — firm, right color, no rot or bruises
- **Fish** — bright, clear eyes; red gills; firm flesh; fresh smell
- **Meat** — bright color, firm, no bad smell
- **Eggs** — clean, uncracked shells
- **Salt, sugar, vinegar** — clean, food grade, sealed

## Receiving
1. **Check the order** against the delivery receipt.
2. **Inspect** the quality and the expiry dates.
3. **Check the temperature** of chilled and frozen goods.
4. **Weigh** the items.
5. **Reject** whatever isn't acceptable.
6. **Record** the delivery.

## Handling and storing
- **Wash** fruits and vegetables with clean water.
- Keep **raw meat and fish** away from other foods.
- **Refrigerate** perishables quickly, at 5 °C or below.
- **Dry goods** go in a cool, dry place, off the floor.
- **FIFO** — "first in, first out": use older stock first.
- Label containers with the date.

## Personal hygiene
Wash your hands, wear a clean apron and hairnet, and don't handle food when sick.`,
        `## Quality Check
Examine samples or pictures of raw materials, and sort them into accept or reject. Explain why.

## Receiving Log
Fill out a simple receiving log for a delivery of raw materials.`,
        [
          "What are the signs of fresh fish?",
          "What does FIFO mean?",
          "List the steps in receiving raw materials.",
        ],
      ),
      tleLesson(
        "Pickling and Fermentation",
        "Using acid and helpful microbes to preserve food.",
        "JzPDmDYyBRU",
        `## Why process food?
Processing **slows spoilage**, adds value, and reduces waste. Spoilage comes mostly from **microorganisms** and enzymes, which need water, warmth and food. Preservation takes these conditions away.

## Pickling
**Pickling** preserves food in **acid**, such as vinegar. *Examples: atchara (papaya), pickled mango, pickled onions.*

**Steps in making atchara**
1. **Sterilize** jars in boiling water for 10 minutes.
2. **Wash, peel and shred** the papaya.
3. **Salt** it, then squeeze out the liquid and rinse.
4. **Boil** vinegar, sugar and salt to make the brine.
5. **Pack** the papaya, carrots and ginger into the jars.
6. **Pour** in the hot brine until the vegetables are covered.
7. **Seal**, then cool and label.

## Fermentation
**Fermentation** uses helpful microorganisms to change food.
- **Lactic acid** — burong mangga, burong isda
- **Acetic acid** — coconut or sugarcane vinegar
- **Salt fermentation** — bagoong, patis
- **Nata de coco** — coconut water turned into a gel

## Safety
Use clean tools and jars. Keep food **under the brine**. Throw away anything with an odd smell, mold, or a swollen lid. **When in doubt, throw it out.**`,
        `## Atchara Making
Under your teacher's supervision, prepare atchara following the steps and safety practices in this lesson.

## Fermented Foods Hunt
List the fermented foods in your home or market, and say what kind of fermentation each one uses.`,
        [
          "What preserves food in pickling?",
          "How do you sterilize jars?",
          "Give three Filipino fermented foods.",
        ],
      ),
      tleLesson(
        "Sugar Preservation",
        "Making jams, jellies and preserves.",
        "V_A8f2_TcgY",
        `## How sugar preserves
A high amount of sugar **pulls water out** of microorganisms, so they can't grow.

## Products
- **Jam** — crushed fruit cooked with sugar
- **Jelly** — clear fruit juice cooked with sugar, which gels
- **Marmalade** — jelly with citrus peel
- **Preserves** — whole or large pieces of fruit in syrup
- **Candied fruit** — fruit soaked in sugar until firm, then dried

## What makes it set
Jam needs four things: **fruit, sugar, pectin** and **acid**. Pectin is a natural gel found in fruits such as guava and calamansi peel.

## Steps in making mango jam
1. **Sterilize** the jars.
2. **Wash, peel and chop** ripe mangoes.
3. **Cook** the fruit, stirring.
4. **Add sugar** and calamansi juice.
5. **Boil** while stirring, until thick.
6. **Test** it: put a drop on a cold plate. It should wrinkle when pushed.
7. **Pour** into hot jars, leaving a little space at the top.
8. **Seal**, cool and label.

## Safety
Boiling sugar is **hotter than boiling water** and sticks to skin. Stir with a long spoon, wear an apron, keep younger children away, and never leave the pot alone.`,
        `## Jam Making
Under your teacher's supervision, make a small batch of fruit jam using a fruit available in your area.

## Compare the Products
Make a table comparing jam, jelly, marmalade and preserves.`,
        [
          "How does sugar preserve food?",
          "What four things does jam need?",
          "How do you test if jam is ready?",
        ],
      ),
      tleLesson(
        "Salting, Curing and Smoking",
        "Traditional ways of preserving fish and meat.",
        "-bZXf-C1IVA",
        `## Salting
**Salt** pulls water out of food. *Examples: tuyo, daing, salted eggs.*

- **Dry salting** — rub salt onto the food. *Daing.*
- **Brining** — soak the food in salt water. *Salted eggs.*

## Curing
**Curing** preserves meat with salt, sugar and curing mix. *Examples: tocino, tapa, longganisa, ham.*

Curing salts must be measured exactly, because too much is **harmful**. Follow a tested recipe, and let an adult handle them.

## Smoking
**Smoking** dries and flavors food with smoke. *Example: tinapa.*

## Steps in making tinapa
1. Clean the fish.
2. **Soak** in brine.
3. **Drain** and arrange on trays or racks.
4. **Smoke** using hardwood or coconut husks until golden.
5. **Cool**, pack and label.

## Tools and materials
Knives, cutting boards, basins, weighing scale, drying racks, smoke house or drum, thermometer, gloves.

## Safety
- Dry food on **clean, raised racks**, covered from flies.
- Work with fire outdoors or in a ventilated area.
- Use clean water and food-grade salt.
- Store products in a cool, dry place.`,
        `## Salted Eggs
Under your teacher's supervision, prepare salted eggs by brining or with a clay and salt coating. Record the days and the results.

## Product Table
List five local salted, cured or smoked products, and the method used for each.`,
        [
          "How does salt preserve food?",
          "What is the difference between dry salting and brining?",
          "Why must curing salts be measured exactly?",
        ],
      ),
      tleLesson(
        "Packaging and Labeling",
        "Protecting a product, and telling buyers about it.",
        "O-H2sgEcW58",
        `## Why package?
Packaging **protects** food, **keeps it fresh**, makes it **easy to carry**, and helps it **sell**.

## Packaging materials
| Material | Good for |
|---|---|
| Glass jars | Jams, pickles, bottled fish |
| Plastic pouches | Dried foods, snacks |
| Tin cans | Canned goods |
| Paper and cartons | Outer boxes |
| Vacuum-sealed plastic | Meat, fish |

## What goes on the label
- **Product name**
- **Net weight or volume**
- **List of ingredients**, from most to least
- **Name and address** of the maker
- **Expiry or best-before date**
- **Lot or batch number**
- **Nutrition facts** and **allergen** warnings
- **Storage instructions**

## Rules
In the Philippines, the **Food and Drug Administration (FDA)** regulates processed foods, and the **Consumer Act (RA 7394)** requires truthful labels. A food business needs a **License to Operate** and product registration.

## Good design
Use a clear name, a readable font, attractive colors and a simple logo. Never make false claims such as "cures diabetes".`,
        `## Label Design
Design a label for a processed food, with all the required information.

## Packaging Choice
Choose the best packaging for three products, and explain your choices.`,
        [
          "Give four reasons for packaging food.",
          "List six items required on a label.",
          "Which agency regulates processed foods?",
        ],
      ),
      tleLesson(
        "Product Costing of Processed Foods",
        "Finding out what a product costs, and how to price it.",
        "QYT8asMeiyE",
        `## Why compute costs?
If you don't know your costs, you may be selling at a loss without knowing it.

## Parts of the cost
- **Direct materials** — ingredients and packaging
- **Direct labor** — pay for the work
- **Overhead** — electricity, gas, water, rent

## Formulas
- **Total cost** = materials + labor + overhead
- **Unit cost** = total cost ÷ number of units
- **Selling price** = unit cost + markup
- **Profit** = sales − total cost

## Example: 30 jars of mango jam
| Item | Cost |
|---|---|
| Ingredients | ₱300 |
| Jars and labels | ₱210 |
| Labor | ₱120 |
| Gas and water | ₱30 |
| **Total cost** | **₱660** |

- **Unit cost:** ₱660 ÷ 30 = **₱22** per jar
- **Markup of 50%:** ₱22 × 0.50 = ₱11
- **Selling price:** ₱22 + ₱11 = **₱33** per jar
- **Profit if all are sold:** ₱11 × 30 = **₱330**

## Setting the price
Also consider what **competitors** charge and what **customers** can pay.`,
        `## Costing Worksheet
Compute the total cost, unit cost, selling price and profit for a product you made in class.

## Price Check
Compare your price with the same product in stores. Would you change it? Explain.`,
        [
          "What are the three parts of product cost?",
          "A batch costs ₱400 and makes 20 units. What is the unit cost?",
          "What is the selling price of a ₱30 item at a 40% markup?",
        ],
      ),
      tleLesson(
        "Marketing Processed Foods",
        "Getting the right product to the right buyers.",
        "RFS8xDZT2Bc",
        `## What is marketing?
**Marketing** is finding out what customers want, and letting them know you have it.

## The four P's
- **Product** — quality, packaging and what makes it special
- **Price** — fair to you and to the buyer
- **Place** — where it is sold: market stalls, sari-sari stores, online
- **Promotion** — how people hear about it

## Know your target market
Who will buy? Students want cheap snacks. Tourists want pasalubong. Busy families want ready-to-eat foods.

## Promotion strategies
- **Free tastes** at school fairs and markets
- **Social media** posts with clear photos and prices
- **Word of mouth** from happy customers
- **Discounts** and bundles
- **Posters and flyers**
- **Trade fairs** and local government events

## Your selling point
A **unique selling point (USP)** is what makes your product different: "made with local calamansi", "no preservatives", or "from our own community".

## Be honest
Advertise truthfully. Never claim what your product can't deliver.`,
        `## Four P's Plan
Create a simple four P's marketing plan for one processed food.

## Make a Post
Design a poster or social media post that promotes your product and its unique selling point.`,
        [
          "What are the four P's?",
          "What is a unique selling point?",
          "Give three ways of promoting a product.",
        ],
      ),
      tleLesson(
        "Selling Finished Products",
        "Serving customers and keeping track of sales.",
        "wHkhrL9JYII",
        `## Before selling
- Check the **quality** and the expiry dates.
- Arrange products neatly.
- Put up **clear prices**.
- Prepare **change** and a sales record.
- Wear clean clothes and keep your stall clean.

## Steps in a sale
1. **Greet** the customer with a smile.
2. **Ask** what they are looking for.
3. **Describe** the product and what makes it good.
4. **Offer a taste**, if allowed.
5. **Close** the sale: state the total clearly.
6. **Receive payment** and count the change in front of the customer.
7. **Pack** the item.
8. **Thank** the customer.

## Keep records
| Date | Product | Units sold | Price | Total |
|---|---|---|---|---|
| Mar 5 | Mango jam | 12 | ₱33 | ₱396 |
| Mar 5 | Atchara | 8 | ₱40 | ₱320 |

Add up the sales, subtract the costs, and you have your **profit**.

## After selling
Store unsold products properly, check their dates, and note which products sold best. Listen to customer comments, and improve.`,
        `## School Selling Day
With your teacher's approval, sell your finished products in school. Record your sales, and compute your profit.

## Role Play
In pairs, act out a sale from greeting to thanks.`,
        [
          "List the steps in a sale.",
          "Why should change be counted in front of the customer?",
          "How do you compute profit?",
        ],
      ),
    ],
    quiz: [
      q(
        "What people want and can afford to buy is called…",
        ["Economic demand", "Overhead", "Fermentation", "Net weight"],
        0,
        "Economic demand is what buyers want and can pay for.",
      ),
      q(
        "FIFO means…",
        [
          "First in, first out",
          "Fresh is fine only",
          "Food in, food out",
          "Fish in fresh oil",
        ],
        0,
        "Use older stock first so that nothing expires.",
      ),
      q(
        "Atchara is preserved mainly by…",
        ["Vinegar", "Smoke", "Freezing", "Oil"],
        0,
        "Atchara is pickled in a vinegar brine.",
      ),
      q(
        "Which must jam have in order to set?",
        [
          "Pectin, acid and sugar",
          "Salt and smoke",
          "Vinegar and oil",
          "Yeast and flour",
        ],
        0,
        "Pectin, acid and sugar together form the gel.",
      ),
      q(
        "A batch costs ₱600 and makes 30 jars. The unit cost is…",
        ["₱10", "₱20", "₱30", "₱60"],
        1,
        "₱600 ÷ 30 = ₱20.",
      ),
    ],
    bank: [
      q(
        "Fresh fish have…",
        [
          "Bright, clear eyes",
          "Cloudy, sunken eyes",
          "Gray gills",
          "Soft flesh",
        ],
        0,
        "Clear eyes and red gills are signs of freshness.",
      ),
      q(
        "Tinapa is made by…",
        ["Smoking", "Pickling", "Freezing", "Boiling only"],
        0,
        "Tinapa is smoked fish.",
      ),
      q(
        "Ingredients on a label are listed…",
        [
          "From most to least",
          "From least to most",
          "In alphabetical order",
          "By color",
        ],
        0,
        "The largest amount comes first.",
      ),
      q(
        "Which of the four P's is about where a product is sold?",
        ["Place", "Price", "Product", "Promotion"],
        0,
        "Place covers where customers can buy the product.",
      ),
      q(
        "A swollen jar lid means you should…",
        [
          "Throw the product out",
          "Sell it fast",
          "Reheat it and eat it",
          "Add more sugar",
        ],
        0,
        "A swollen lid can mean dangerous spoilage.",
      ),
    ],
  },
  {
    title: "Fruit Juices and Beverages",
    description:
      "Types of juices and beverages, methods of juice processing, safe processing, and selling.",
    lessons: [
      tleLesson(
        "Types of Fruit Juices and Beverages",
        "From pure juice to nectars and drinks.",
        "4jFUJmhYB8A",
        `## Kinds of fruit beverages
- **Pure juice** — pressed from fruit, with nothing added
- **Juice from concentrate** — juice with its water removed, and later added back
- **Nectar** — fruit pulp or juice with water and sugar added; thicker
- **Juice drink** — mostly water and sugar, with only some juice
- **Squash** — strong fruit syrup, diluted before drinking
- **Syrup or cordial** — very sweet, diluted before drinking
- **Puree** — blended fruit pulp
- **Smoothie** — blended fruit, often with milk or yogurt

## Philippine favorites
**Calamansi** juice, **buko** (young coconut) juice, **mango** nectar, **pineapple** juice, **dalandan** juice, **guyabano** nectar, **sago't gulaman**, **salabat** (ginger tea).

## Choosing fruit
Use ripe, sound fruit with strong flavor. Fruit that is too ugly for the market, but isn't rotten, is a good cheap raw material.

## Why make juice?
Juice processing **uses up surplus fruit**, **adds value** and creates a product that is easy to sell. A kilo of calamansi can earn more as bottled juice concentrate than as fresh fruit.`,
        `## Beverage Chart
Make a chart of the types of fruit beverages, with an example of each.

## Label Detective
Read the labels of three juice products. Decide whether each is a pure juice, nectar or juice drink, and explain how you can tell.`,
        [
          "What is the difference between a juice and a nectar?",
          "What is a juice drink?",
          "Give three local fruit beverages.",
        ],
      ),
      tleLesson(
        "Methods of Juice Processing",
        "How fruit becomes a safe, bottled beverage.",
        "QwRaCYlB6Ts",
        `## The basic steps
1. **Select** ripe, sound fruit.
2. **Wash** it well in clean water.
3. **Peel and prepare** the fruit.
4. **Extract** the juice.
5. **Strain** out seeds and pulp.
6. **Mix** with water and sugar, if the recipe calls for it.
7. **Pasteurize** by heating.
8. **Fill** clean, sterilized bottles.
9. **Seal** the bottles.
10. **Cool, label and store.**

## Ways of extracting juice
- **Squeezing** — calamansi and citrus
- **Pressing** — apples, grapes
- **Blending** — mango, guyabano
- **Boiling, then straining** — tougher fruit

## Preservation methods
- **Pasteurization** — heating just enough to kill harmful germs, then cooling
- **Bottling while hot** — filling and sealing hot juice, then cooling
- **Chilling and freezing** — slows spoilage
- **Adding sugar or acid** — helps preserve; follow a tested recipe
- **Concentration** — removing water

## Keeping the quality
Heat too long, and flavor and vitamin C are lost; heat too little, and the juice spoils. Follow a **tested recipe** for times and temperatures, and use a thermometer.`,
        `## Flowchart
Draw a flowchart of juice processing from fruit to labeled bottle.

## Method Match
Match each fruit to its best way of extracting juice, and explain why.`,
        [
          "List the basic steps in juice processing.",
          "What is pasteurization?",
          "Why follow a tested recipe for heating times?",
        ],
      ),
      tleLesson(
        "Processing Fruit Juices with Occupational Health and Safety",
        "Making juice safely, for you and for your customers.",
        "56RL3puJkkM",
        `## Occupational Health and Safety
**OHS** protects workers from injury and illness. In the Philippines, **RA 11058** requires safe workplaces.

## Hazards in juice processing
| Hazard | Control |
|---|---|
| Cuts from knives | Sharp knives, cutting boards, focus |
| Burns from hot liquid | Long spoons, pot holders, apron |
| Slips on wet floors | Wipe spills, wear closed shoes |
| Electric shock | Dry hands, check cords |
| Broken glass | Check bottles, sweep carefully |

## Keeping the juice safe
- **Wash hands** and wear a hairnet and apron.
- Use **clean water** and sanitized tools.
- Sterilize bottles in boiling water.
- Keep raw fruit away from finished juice.
- Check for **cracked bottles**.
- Label and date every batch.

## Practice: calamansi juice concentrate
1. Sterilize bottles and caps.
2. Wash the calamansi. Cut and squeeze.
3. Strain out the seeds.
4. Boil water and sugar to make a syrup.
5. Add the juice, and heat it. Follow your teacher's temperature and time.
6. Fill the hot bottles, and seal them.
7. Cool the bottles, then label them.
8. Clean the work area.

## Quality check
Look for the right **color, clarity, smell and taste**. Reject bottles that are leaking, cloudy where they shouldn't be, or bulging.`,
        `## Juice Processing Practice
Under your teacher's supervision, process a local fruit into bottled juice, following Occupational Health and Safety standards.

## Hazard Hunt
Before starting, walk through the work area, and list the hazards and how to control them.`,
        [
          "What does OHS mean?",
          "Give three hazards in juice processing and their controls.",
          "What should you check for in the finished juice?",
        ],
      ),
      tleLesson(
        "Selling Finished Juice Products",
        "Pricing, displaying and selling your beverages.",
        "wHkhrL9JYII",
        `## Getting ready
- Compute the **unit cost** and the **selling price**.
- Check bottles for leaks and proper labels.
- Keep drinks **cold** in a clean cooler.
- Check that your **expiry dates** are clear.

## Example: calamansi juice
| Item | Cost |
|---|---|
| Ingredients | ₱180 |
| Bottles and labels | ₱200 |
| Labor | ₱100 |
| Gas and water | ₱20 |
| **Total for 20 bottles** | **₱500** |

- **Unit cost:** ₱500 ÷ 20 = **₱25**
- **At a 60% markup:** ₱25 × 1.60 = **₱40** per bottle
- **If all are sold:** ₱40 × 20 = ₱800; profit = ₱800 − ₱500 = **₱300**

## Selling tips
- Sell where people are thirsty: school fairs, sports events, canteens.
- Offer **small sample cups**.
- Tell customers what's special: "made from fresh local fruit, with no artificial color."
- Remind them to **keep it cold**, and when to finish it.

## After selling
Record sales and leftovers, collect comments, and plan your next batch. Throw out any juice that has passed its date. Never sell spoiled products to avoid a loss.`,
        `## Juice Selling Activity
With your teacher's approval, sell your finished juice. Record your sales, and compute the profit.

## Group Report
Report what sold well, what customers said, and what you would change next time.`,
        [
          "How should bottled juice be kept while selling?",
          "A bottle costs ₱20 to make. What is the price at a 50% markup?",
          "What must you do with juice past its date?",
        ],
      ),
    ],
    quiz: [
      q(
        "A thick drink made from fruit pulp, water and sugar is…",
        ["A nectar", "Pure juice", "Vinegar", "Brine"],
        0,
        "Nectar has pulp, water and sugar, and is thicker than juice.",
      ),
      q(
        "Which way of extracting juice suits calamansi?",
        ["Squeezing", "Smoking", "Salting", "Fermenting"],
        0,
        "Citrus fruits are simply squeezed.",
      ),
      q(
        "Pasteurization means…",
        [
          "Heating just enough to kill harmful germs",
          "Adding plenty of salt",
          "Freezing for a year",
          "Mixing in vinegar",
        ],
        0,
        "It makes juice safe while keeping most of its flavor.",
      ),
      q(
        "Which is the right control for wet floors?",
        [
          "Wipe spills and wear closed shoes",
          "Work faster",
          "Add more water",
          "Wear slippers",
        ],
        0,
        "Dry floors and proper shoes prevent slips.",
      ),
      q(
        "A batch of 20 bottles costs ₱500. The unit cost is…",
        ["₱20", "₱25", "₱50", "₱100"],
        1,
        "₱500 ÷ 20 = ₱25.",
      ),
    ],
    bank: [
      q(
        "A squash must be…",
        [
          "Diluted before drinking",
          "Frozen before drinking",
          "Fermented before drinking",
          "Cooked with meat",
        ],
        0,
        "Squash is a strong fruit syrup.",
      ),
      q(
        "What comes right after washing the fruit?",
        ["Peeling and preparing", "Labeling", "Sealing", "Selling"],
        0,
        "The fruit is prepared before the juice is extracted.",
      ),
      q(
        "RA 11058 is about…",
        [
          "Occupational safety and health",
          "Solid waste",
          "Fisheries",
          "Traffic",
        ],
        0,
        "RA 11058 protects workers' safety and health.",
      ),
      q(
        "Too much heating of juice can…",
        [
          "Lose flavor and vitamin C",
          "Add more vitamin C",
          "Make more juice",
          "Grow more germs",
        ],
        0,
        "Heat harms flavor and vitamin C, so time and temperature matter.",
      ),
      q(
        "A bulging bottle should be…",
        ["Rejected", "Sold quickly", "Given to a friend", "Opened and tasted"],
        0,
        "Bulging can mean spoilage, so the bottle is rejected.",
      ),
    ],
  },
];

export const foodAndBeverageProcessing: DemoSubject = {
  key: "TLE9-FBP",
  code: "TLE 9-FBP",
  name: "TLE 9–10 – AFA: Food and Beverage Processing",
  department: TLE_DEPARTMENT,
  description:
    "Processing, packaging and selling foods and fruit juices — a one-term TLE: AFA sector for Grade 9 or 10.",
  colorToken: "emerald",
  units: UNITS,
};
