/**
 * TLE 7 Agriculture and Fishery Arts — the First Term of DepEd's Grade 7
 * Budget of Work (AFA / FCS / IA). Each lesson has a lecture video, a written
 * lecture, the Budget of Work's activities and a self-check, and every unit
 * five Unit Questions and five more for Live Quiz. Each unit's last lesson
 * carries a performance task.
 */
import type { DemoSubject, DemoUnit } from "../grade10";
import { q, tleLesson, TLE_DEPARTMENT } from "./common";

const UNITS: DemoUnit[] = [
  {
    title: "Careers, Tools and Farm Safety",
    description:
      "Careers and businesses in agriculture, tools and equipment, safety procedures, and hazards and risks on the farm.",
    lessons: [
      tleLesson(
        "Careers and Business in Agriculture",
        "The jobs and businesses that agriculture makes possible.",
        "HxDtq4wV790",
        `## Why agriculture matters
**Agriculture** is growing crops and raising animals for food and other products. Every meal you eat began with someone's work on a farm or at sea.

## Careers in agriculture
- **Farmer** — grows crops or raises animals
- **Agriculturist** — studies and improves how crops are grown
- **Veterinarian** — keeps farm animals healthy
- **Agricultural technician** — tests soil and helps farmers use new methods
- **Farm manager** — plans and runs a farm's work and money
- **Agricultural engineer** — designs farm machines and irrigation
- **Extension worker** — teaches farmers in the community

## Business opportunities
- **Vegetable gardening** — selling fresh produce in the market
- **Poultry raising** — selling eggs and chicken
- **Plant nursery** — selling seedlings and ornamental plants
- **Organic fertilizer** — making and selling compost
- **Farm supply store** — selling seeds, tools and feeds
- **Farm tourism** — welcoming visitors to learn and pick fruit

## Starting a simple farm business
Ask four questions: **What** will I sell? **Who** will buy it? **How much** will it cost to produce? **Where** will I sell it?`,
        `## Agriculture Career Spotlight
In groups, read short career descriptions and share one agriculture career with the class. Explain what the job involves.

## My First Farm Business
In small groups, choose an agriculture business, decide what to sell and who will buy it, then present your idea.`,
        [
          "Give three careers in agriculture.",
          "What does an extension worker do?",
          "What four questions help you plan a farm business?",
        ],
      ),
      tleLesson(
        "Agricultural Tools, Implements and Equipment",
        "Telling tools, implements and equipment apart, and what each is for.",
        "A-Bs1Leq8cc",
        `## Three groups
- **Tools** — light and used by hand
- **Implements** — pulled by an animal or a machine
- **Equipment** — machines that run on fuel or electricity

## Common hand tools
- **Bolo** — cuts branches and tall grass
- **Grub hoe** — breaks hard soil
- **Spading fork** — loosens soil and lifts roots
- **Shovel** — scoops and moves soil
- **Rake** — levels soil and gathers leaves
- **Trowel** — digs small holes and moves seedlings
- **Pruning shears** — cut small branches
- **Sprinkler** or **watering can** — waters plants

## Common implements
- **Plow** — turns the soil over
- **Harrow** — breaks soil clumps and levels the field
- **Cart** — carries loads

## Common equipment
- **Tractor** — pulls implements over large fields
- **Water pump** — brings water to the crops
- **Knapsack sprayer** — sprays plants
- **Thresher** — separates grain from stalks

## Choosing the right item
Think about the **job**, the **size of the farm** and the **cost**. A trowel suits a school garden; a tractor suits a wide rice field.`,
        `## Sort the Farm Items
In groups, sort picture or word cards into three categories: tools, implements and equipment.

## Farm Item Show and Tell
Select one farm item. Explain whether it is a tool, implement or equipment, and why.

## Name That Farm Tool
Name each tool or piece of equipment shown and say one use.

## Match the Tool to Its Use
Match picture cards of tools and equipment to cards showing their correct uses.`,
        [
          "What is the difference between a tool and an implement?",
          "Give two examples of farm equipment.",
          "What is a harrow used for?",
        ],
      ),
      tleLesson(
        "Safety Procedures in Farm Operations",
        "Working safely with tools, chemicals, machines and the sun.",
        "9V-i9H0Er0w",
        `## Why safety comes first
Farm work uses sharp tools, heavy machines, chemicals and animals. Most injuries can be prevented when workers follow simple rules.

## Personal protective equipment (PPE)
- **Boots** — protect feet from cuts and wet ground
- **Gloves** — protect hands from thorns and chemicals
- **Hat and long sleeves** — protect you from the sun
- **Mask and goggles** — protect your lungs and eyes when spraying

## Safe use of tools
- Carry sharp tools **pointing down**.
- Never leave a tool lying on the ground; someone could step on it.
- Check that handles are tight before use.
- Clean tools and return them to storage after work.

## Safe use of chemicals
- Read the **label** first, and follow it.
- Only trained adults mix and spray pesticides.
- Don't eat, drink or touch your face while handling chemicals.
- Store chemicals locked up, in their original containers.
- Wash your hands well after work.

## Working in the field
- Drink plenty of **water** and rest in the shade.
- Work in pairs and tell someone where you are.
- Lift with your **legs**, not your back.
- Know where the **first aid kit** is. Report every injury to your teacher.`,
        `## Farm Safety Scenario Talk
Read or view farm scenarios and say what is unsafe and how it can be done safely.

## Safety Rules Poster
In groups, create a poster showing key farm safety rules and present it to the class.`,
        [
          "Name three kinds of PPE used on a farm.",
          "How should a sharp tool be carried?",
          "Why must you read a chemical's label first?",
        ],
      ),
      tleLesson(
        "Hazards and Risks in Farm Operations",
        "Spotting what can harm you, and how likely it is.",
        "etHR_B_qreY",
        `## Hazard and risk
- A **hazard** is anything that can cause harm. *Example: a sharp bolo.*
- A **risk** is the chance that harm will happen, and how bad it could be. *Example: a deep cut if the bolo is left on the ground.*

## Kinds of farm hazards
- **Physical** — sharp tools, machines, slippery ground, heat, noise
- **Chemical** — pesticides, fertilizers, fuel
- **Biological** — bites, germs from animals, moldy feed, snakes and insects
- **Ergonomic** — heavy lifting, bending for long hours

## Ranking the risk
Ask: how **likely** is it, and how **serious** would it be?

| Level | Meaning | Example |
|---|---|---|
| Low | Unlikely, and only minor harm | A small scratch from dry grass |
| Medium | May happen, and needs treatment | A sprained ankle on wet soil |
| High | Likely or very serious | Breathing in pesticide with no mask |

## Controlling risks
1. **Remove** the hazard if you can.
2. **Replace** it with something safer, such as organic pest control.
3. **Guard** it: fences, covers and locked storage.
4. **Train** workers and follow rules.
5. **Wear PPE** as the last line of protection.`,
        `## Farm Hazard Hunt
Observe farm pictures or short descriptions and list the hazards and possible risks shown.

## Risk Ranking Activity
In groups, sort farm hazards into low, medium and high risk, and explain your choices.`,
        [
          "What is the difference between a hazard and a risk?",
          "Give one example each of a physical and a chemical hazard.",
          "Why is PPE the last line of protection?",
        ],
      ),
    ],
    quiz: [
      q(
        "A plow pulled by a carabao is an example of…",
        ["A hand tool", "An implement", "Farm equipment", "A farm product"],
        1,
        "Implements are pulled by an animal or a machine.",
      ),
      q(
        "Which tool is best for moving small seedlings?",
        ["Grub hoe", "Trowel", "Harrow", "Bolo"],
        1,
        "A trowel digs small holes and moves seedlings without damaging them.",
      ),
      q(
        "Who should mix and spray pesticides?",
        [
          "Any student who is free",
          "Only trained adults",
          "The youngest worker",
          "Anyone without gloves",
        ],
        1,
        "Pesticides are dangerous, so only trained adults handle them.",
      ),
      q(
        "A bolo left on the ground is…",
        ["A hazard", "A business", "An implement", "A product"],
        0,
        "A hazard is anything that can cause harm.",
      ),
      q(
        "Which is a biological hazard?",
        ["Fuel", "Heavy lifting", "A snake bite", "Loud noise"],
        2,
        "Biological hazards come from living things: bites, germs and molds.",
      ),
    ],
    bank: [
      q(
        "Who keeps farm animals healthy?",
        ["Extension worker", "Veterinarian", "Technician", "Engineer"],
        1,
        "A veterinarian treats and protects animals.",
      ),
      q(
        "Which is a business in agriculture?",
        [
          "Selling compost",
          "Repairing phones",
          "Driving a bus",
          "Writing software",
        ],
        0,
        "Organic fertilizer is a product of farm waste that can be sold.",
      ),
      q(
        "A tractor is classified as…",
        ["Tool", "Implement", "Equipment", "PPE"],
        2,
        "Equipment runs on fuel or electricity.",
      ),
      q(
        "Which protects your lungs when spraying?",
        ["Boots", "Hat", "Mask", "Rake"],
        2,
        "A mask keeps you from breathing in spray.",
      ),
      q(
        "A risk that is likely and very serious is ranked…",
        ["Low", "Medium", "High", "None"],
        2,
        "High risks are likely or very serious, and are handled first.",
      ),
    ],
  },
  {
    title: "Crop Production",
    description:
      "Planting and caring for crops, farm waste, composting and foliar fertilizer, and harvesting.",
    lessons: [
      tleLesson(
        "Agricultural Practices in Crop Production",
        "Preparing the soil, planting and watering.",
        "yHbmER08koI",
        `## Steps in growing crops
1. **Choose the crop** — one that suits your soil, climate and market.
2. **Prepare the land** — clear weeds and stones, then loosen the soil.
3. **Make plots** — raised beds help water drain.
4. **Add organic matter** — mix in compost to feed the soil.
5. **Plant** — sow seeds or transplant seedlings.
6. **Water** — early in the morning or late in the afternoon.

## Direct seeding and transplanting
- **Direct seeding** — seeds go straight into the plot. *Examples: corn, mongo, okra.*
- **Transplanting** — seedlings grow in a nursery first. *Examples: tomato, eggplant, pechay.*

## Planting well
- **Depth** — a seed is usually planted about two to three times as deep as its width.
- **Spacing** — leave room so that plants don't compete for sun, water and food.
- **Alignment** — straight rows make weeding and harvesting easier.

## Crop management
**Weeding** removes plants that steal water and food. **Mulching** means covering soil with dry leaves or straw to keep it moist and stop weeds.`,
        `## School Garden Practice
In groups, prepare soil, plant seeds and water crops in the school garden or in containers.

## Crop Care Demonstration
Watch your teacher demonstrate proper crop care, then practice weeding and mulching on planted crops.`,
        [
          "List the steps in growing crops.",
          "What is the difference between direct seeding and transplanting?",
          "Why is mulching useful?",
        ],
      ),
      tleLesson(
        "Care and Maintenance of Crops",
        "Watering, feeding, weeding and protecting crops.",
        "jIGoEJuebNQ",
        `## Daily and weekly care
- **Watering** — keep soil moist, not flooded
- **Weeding** — pull weeds before they grow large
- **Fertilizing** — feed plants with compost or foliar fertilizer
- **Cultivating** — loosen the top soil so that air and water reach the roots
- **Staking** — support tall or climbing plants such as tomato and ampalaya
- **Thinning** — remove extra seedlings so that the strong ones have room

## Pests and diseases
| Problem | Sign | What to do |
|---|---|---|
| Insects | Holes in leaves | Pick them off, use natural sprays |
| Too much water | Yellow leaves, rotting roots | Water less, improve drainage |
| Too little food | Pale, small plants | Add compost |
| Fungus | Spots or powder on leaves | Remove sick leaves, give more space |

## Integrated pest management
**IPM** means using several safe methods first: healthy soil, clean plots, helpful insects, crop rotation and hand-picking. Chemicals are the last choice.

## Keep records
Note the planting date, the watering and the problems you see. Your records help you do better next planting.`,
        `## Crop Care Checklist
Use a checklist to observe crops, and tick the care practices needed or already done.

## Problem-and-Solution Discussion
Discuss crop problem pictures and suggest the correct care or maintenance action.`,
        [
          "Name four practices in caring for crops.",
          "What can yellow leaves and rotting roots mean?",
          "What does IPM mean?",
        ],
      ),
      tleLesson(
        "Farm Waste Processing",
        "Turning what is left over into something useful.",
        "WyDBzmWgBVA",
        `## What is farm waste?
**Farm waste** is anything left over from farm work: crop residues, weeds, manure, spoiled produce, plastic sacks and empty containers.

## Biodegradable and non-biodegradable
- **Biodegradable** — rots naturally. *Leaves, rice straw, manure, fruit peels.*
- **Non-biodegradable** — doesn't rot easily. *Plastic, glass, metal.*

## Ways of processing farm waste
- **Composting** — turns plant waste and manure into fertilizer
- **Mulching** — uses dry leaves and straw to cover soil
- **Animal feed** — uses clean vegetable trimmings
- **Vermicomposting** — lets African night crawler worms turn waste into rich compost
- **Recycling** — gives plastics and metal to collectors

## Why it matters
Processing waste **saves money** on fertilizer, keeps the farm **clean**, reduces flies and bad smells, and **protects** rivers. Burning farm waste pollutes the air, so choose composting instead.

## Handle pesticide containers with care
Empty chemical containers are never reused for food or water. Follow the label and the local rules on disposal.`,
        `## Farm Waste Sorting Activity
Sort pictures or samples of farm waste into biodegradable and non-biodegradable groups.

## Simple Composting Demonstration
Watch your teacher make compost from farm waste, and explain each step.`,
        [
          "Give three examples of biodegradable farm waste.",
          "Name three ways of processing farm waste.",
          "Why is composting better than burning?",
        ],
      ),
      tleLesson(
        "Basket Composting and Foliar Fertilizer",
        "Making your own compost and liquid fertilizer.",
        "I11Dsop69fA",
        `## Basket composting
Basket composting turns organic waste into compost inside a basket or a bamboo cage.

**What you need:** a basket, dry leaves or straw (browns), vegetable and fruit waste (greens), garden soil and water.

1. Put a layer of **browns** at the bottom.
2. Add a layer of **greens**.
3. Sprinkle **soil** over them.
4. Repeat the layers until the basket is full.
5. **Water** lightly. It should feel like a squeezed sponge.
6. **Cover** the basket.
7. **Turn** the mixture about once a week.
8. The compost is ready in about **one to two months**, when it is dark and crumbly and smells like soil.

## Foliar fertilizer
**Foliar fertilizer** is a liquid sprayed on leaves. A simple one is **fermented plant juice (FPJ)**.

1. Chop young, healthy plant shoots such as kangkong or banana shoots.
2. Mix with an equal weight of **brown sugar or molasses**.
3. Put in a clean jar and cover with paper, tied loosely, so that gas can escape.
4. Keep in a cool, shady place for about **seven days**.
5. Strain the liquid.
6. **Dilute** with plenty of water before spraying. A common mix is 2 tablespoons per liter.

Never use the concentrate undiluted, since it can burn leaves. And don't drink or taste it.`,
        `## Basket Composting
Layer biodegradable waste in a basket, add water, cover, and allow it to decompose over time.

## Foliar Fertilizer Fermentation
Mix plant materials in a container, cover, and let it ferment for several days before use.`,
        [
          "What are browns and greens?",
          "How do you know compost is ready?",
          "Why must foliar fertilizer be diluted?",
        ],
      ),
      tleLesson(
        "Harvesting and Post-Harvest Practices",
        "Picking crops at the right time and keeping them fresh.",
        "l5hPjtyO27s",
        `## When to harvest
Harvest at the right **maturity**. Too early gives poor taste; too late means tough or spoiled crops. Look at the size, color and firmness, and count the days from planting. Harvest in the **cool of the morning**.

## How to harvest
- Use clean, sharp tools for cutting.
- Handle crops gently, because bruises spoil quickly.
- Leave a short stem on fruits such as eggplant.
- Put crops in clean baskets or crates, not on bare ground.

## Post-harvest practices
**Post-harvest** means everything done between harvest and selling.

1. **Cleaning** — remove soil and damaged leaves
2. **Sorting** — separate good crops from damaged ones
3. **Grading** — group by size and quality
4. **Packing** — use clean, airy crates
5. **Storing** — keep in a cool, shaded, dry place
6. **Transporting** — move crops carefully and quickly

## Why it matters
A large share of harvests can be lost through rough handling and heat. Good post-harvest care means **less waste**, **better prices** and **safer food**.`,
        `## Harvesting Simulation
Practice cutting or picking crop samples carefully, simulating real harvesting.

## Post-Harvest Handling Demonstration
Watch your teacher sort, clean and store harvested crops, then practice the steps.

## Performance Tasks
**Individual: Personal Crop Bed Planting.** Prepare a small plot or container garden, following proper soil preparation, fertilization and planting techniques for a chosen crop. Ensure correct spacing, depth and alignment.

**Group: Crop Maintenance Project.** In small groups, maintain a crop plot by watering, weeding, mulching and controlling pests. Document the growth of your crops over a set period.`,
        [
          "Why is morning the best time to harvest?",
          "List the post-harvest steps.",
          "What is grading?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which crop is usually transplanted?",
        ["Corn", "Mongo", "Tomato", "Okra"],
        2,
        "Tomato seedlings are first grown in a nursery.",
      ),
      q(
        "Mulching helps by…",
        [
          "Keeping soil moist and stopping weeds",
          "Making the seeds grow faster than usual",
          "Removing all insects from the farm",
          "Adding water directly to the leaves",
        ],
        0,
        "A cover of dry leaves or straw holds moisture and shades out weeds.",
      ),
      q(
        "Which is non-biodegradable?",
        ["Rice straw", "Manure", "Plastic sack", "Fruit peels"],
        2,
        "Plastic doesn't rot easily.",
      ),
      q(
        "Compost is ready when it is…",
        [
          "Wet and smells sour",
          "Dark, crumbly and smells like soil",
          "Bright green",
          "Full of whole leaves",
        ],
        1,
        "Finished compost is dark and crumbly, with an earthy smell.",
      ),
      q(
        "Grouping harvested crops by size and quality is called…",
        ["Mulching", "Grading", "Thinning", "Staking"],
        1,
        "Grading sorts produce by size and quality.",
      ),
    ],
    bank: [
      q(
        "The best time to water crops is…",
        [
          "Noon",
          "Early morning or late afternoon",
          "At midnight",
          "Only when it rains",
        ],
        1,
        "Less water is lost to the sun at these times.",
      ),
      q(
        "Removing extra seedlings is called…",
        ["Thinning", "Staking", "Grading", "Hilling"],
        0,
        "Thinning gives the strong seedlings room to grow.",
      ),
      q(
        "In IPM, chemicals are…",
        [
          "The first choice",
          "The last choice",
          "Used every day",
          "Mixed with compost",
        ],
        1,
        "IPM uses safer methods first.",
      ),
      q(
        "FPJ stands for…",
        [
          "Farm Product Juice",
          "Fermented Plant Juice",
          "Fresh Pest Juice",
          "Fruit Pulp Jar",
        ],
        1,
        "Fermented plant juice is a simple foliar fertilizer.",
      ),
      q(
        "Why handle crops gently?",
        [
          "Bruises spoil quickly",
          "They weigh less that way",
          "It makes them ripen slower",
          "It adds more vitamins",
        ],
        0,
        "Damaged produce rots quickly and sells for less.",
      ),
    ],
  },
  {
    title: "Poultry and Livestock",
    description:
      "Breeds, tools and equipment, housing, feeding, waste management, and the products of poultry and livestock.",
    lessons: [
      tleLesson(
        "Breeds of Farm Animals",
        "Common breeds of poultry and livestock in the Philippines.",
        "RYIFrGnaxik",
        `## Poultry and livestock
- **Poultry** — birds raised for meat and eggs
- **Livestock** — animals such as pigs, goats and cattle raised for meat, milk or work

A **breed** is a group of animals of one kind with similar traits that pass on to their young.

## Common breeds
| Animal | Breed | Known for |
|---|---|---|
| Chicken | White Leghorn | Many eggs |
| Chicken | Rhode Island Red | Eggs and meat |
| Chicken | Darag | Native; hardy |
| Duck | Pateros duck (itik) | Eggs for balut |
| Pig | Landrace, Large White | Long bodies, large litters |
| Pig | Duroc | Fast growth, reddish coat |
| Goat | Anglo-Nubian | Milk and meat |
| Goat | Boer | Meat |
| Cattle | Brahman | Heat tolerance, meat |
| Carabao | Philippine carabao | Farm work |
| Carabao | Murrah | Milk |

## Choosing a breed
Think about your **purpose** (meat, eggs, milk or work), the **climate**, the **feed** you can provide, and the **market**. Native breeds cost less to keep and resist disease, while improved breeds produce more but need better care.`,
        `## Breed Identification Cards
Match pictures of farm animals to their correct breed using identification cards.

## Farm Animal Observation
Observe farm animals (live or in pictures) and record their breed based on key characteristics.`,
        [
          "What is the difference between poultry and livestock?",
          "Name a breed of chicken raised for eggs.",
          "What should you consider in choosing a breed?",
        ],
      ),
      tleLesson(
        "Poultry and Livestock Materials, Tools and Equipment",
        "What you need to feed, water and care for animals.",
        "cnzHzWN5I7M",
        `## Feeding and watering
- **Feeder** — holds feed without wasting it
- **Waterer** or **drinker** — gives clean water
- **Feed scoop** — measures feed
- **Weighing scale** — weighs feed and animals

## Housing and brooding
- **Brooder** — keeps chicks warm in their first weeks
- **Heat lamp** — gives the brooder its heat
- **Nest box** — gives hens a clean place to lay
- **Crate** — holds and moves birds
- **Litter** — rice hulls or sawdust on the floor

## Cleaning
Shovels, brooms, wheelbarrows, sprayers and **foot baths**, which stop germs from entering on people's shoes.

## Health
- **Syringe and needle** — given only by a trained person
- **Thermometer** — checks for fever
- **Ear tags** — identify each animal
- **Record book** — tracks feeding, health and sales

## Use and care
Clean feeders and waterers **every day**. Disinfect tools between animals. Repair broken equipment. Store feeds in a dry place, away from rats and chemicals.`,
        `## Materials and Equipment Matching
Match pictures or real items of tools and equipment to their correct use.

## Equipment Demonstration and Practice
Watch your teacher demonstrate each item, then practice using or explaining its function correctly.`,
        [
          "What does a brooder do?",
          "What is a foot bath for?",
          "How often should waterers be cleaned?",
        ],
      ),
      tleLesson(
        "Housing Requirements for Poultry and Livestock",
        "Space, air, floors and feeding areas that keep animals healthy.",
        "T33AGIm01q0",
        `## Why housing matters
Good housing protects animals from **heat, rain, predators and disease**, and makes daily work easier. Healthy, comfortable animals grow better.

## Key features of good housing
- **Location** — high, dry ground, away from homes and water sources
- **Orientation** — the long side generally faces north and south, so that direct sun doesn't enter
- **Ventilation** — open sides or wire walls let fresh air flow
- **Roof** — high, strong and with a wide overhang to keep out rain
- **Floor** — dry and easy to clean, sloped so that water drains away
- **Space** — enough room for each animal; crowding spreads disease
- **Feeding and watering areas** — easy to reach and easy to clean
- **Drainage and waste area** — carries waste away from the animals
- **Fence** — keeps out dogs, rats and strangers

## Examples
- **Poultry house** — wire walls, litter floor, roosts and nest boxes for layers
- **Pig pen** — concrete floor, feeding trough, water nipple and a drain
- **Goat house** — raised slatted floor, so that droppings fall through
- **Cattle shed** — roofed area with a manger, plus a place to graze

## Biosecurity
Limit visitors, use a foot bath, and keep new animals apart from the rest for a time.`,
        `## Housing Diagram Drawing
Draw and label diagrams of poultry or livestock housing showing space, ventilation and feeding arrangements.

## Model Housing Construction
Build a simple model to show the layout and features of animal housing.`,
        [
          "Give five features of good animal housing.",
          "Why is good ventilation important?",
          "Why does a goat house have a slatted floor?",
        ],
      ),
      tleLesson(
        "Feeding Management for Poultry and Livestock",
        "Giving the right feed, in the right amount, at the right time.",
        "XBSbiMzoUYE",
        `## Why feeding management matters
Feed is usually the **biggest cost** of raising animals. Feeding well helps animals grow, stay healthy and produce more. The **Philippine National Standard (PNS)** sets good practices for feeds and feeding.

## What feed provides
- **Carbohydrates and fats** — energy
- **Protein** — growth
- **Vitamins and minerals** — health
- **Water** — the most important of all; always keep it clean and available

## Feeds by stage
| Animal | Stage | Feed |
|---|---|---|
| Chicken | Young | Chick starter |
| Chicken | Growing | Grower |
| Chicken | Laying | Layer mash |
| Pig | Young | Starter |
| Pig | Growing | Grower, then finisher |
| Goat, cattle | All ages | Grass and legumes, with some concentrate |

## Good feeding practices
- Feed at the **same times** every day.
- Change feeds **slowly**, over several days.
- Measure feed; don't guess.
- Remove old and moldy feed.
- Store feed off the floor, in a dry place.
- Keep records of what each group eats.`,
        `## Feed Chart Creation
Create a chart showing recommended feed types, quantities and frequency for poultry or livestock.

## Feeding Simulation Activity
Simulate feeding schedules by distributing the right feed types and amounts to model animals or pictures.`,
        [
          "What do animals get from protein?",
          "What feed does a laying hen need?",
          "Why should you change feeds slowly?",
        ],
      ),
      tleLesson(
        "Farm Waste Management and RA 9003",
        "Handling manure and other farm waste the right way.",
        "u_ce2BRtcKI",
        `## The law
**Republic Act No. 9003**, the **Ecological Solid Waste Management Act of 2000**, requires waste to be segregated at the source, and promotes reducing, reusing, recycling and composting.

## Waste from poultry and livestock
- **Manure and urine**
- **Used litter** — rice hulls or sawdust
- **Spoiled feed**
- **Empty sacks and medicine bottles**
- **Dead animals** — buried or disposed of following local rules

## Segregation
| Group | Examples | What to do |
|---|---|---|
| Biodegradable | Manure, litter, spoiled feed | Compost |
| Recyclable | Feed sacks, clean bottles | Reuse or sell |
| Residual | Used syringes, medicine containers | Dispose of safely, as the rules require |

## Good practices
- Collect manure **daily** and keep it in a covered area.
- Compost manure before using it as fertilizer.
- **Biogas digesters** can turn pig manure into cooking gas.
- Keep waste away from wells, rivers and drainage canals.

Good waste management means less smell, fewer flies, and safer water for the community.`,
        `## Farm Waste Sorting Activity
Sort pictures or samples of farm waste into biodegradable, non-biodegradable and recyclable categories following RA 9003 guidelines.

## Waste Management Planning
In groups, create a simple plan showing how to collect, compost or recycle poultry and livestock waste safely.`,
        [
          "What does RA 9003 require?",
          "What can be done with manure?",
          "What is a biogas digester for?",
        ],
      ),
      tleLesson(
        "Products and By-Products of Poultry and Livestock",
        "What animals give us, and what else can be used.",
        "dkIznPxQPZA",
        `## Products and by-products
- **Main product** — the reason the animal is raised
- **By-product** — something useful that comes along with it

## Examples
| Animal | Main products | By-products |
|---|---|---|
| Chicken | Meat, eggs | Feathers, manure |
| Duck | Eggs, meat | Feathers, manure |
| Pig | Pork | Skin (chicharon), manure, bones |
| Goat | Meat, milk | Skin, manure |
| Cattle | Beef, milk | Hide (leather), bones, manure |
| Carabao | Milk, work | Hide, manure |

## Adding value
Raw products can be made into something worth more:
- Milk → **kesong puti**, pastillas
- Pork → **tocino**, longganisa, ham
- Eggs → **salted eggs**, balut
- Manure → **organic fertilizer**
- Hides → **bags, belts, shoes**

Using every part of the animal reduces waste and adds income.`,
        `## Product and By-Product Sorting
Sort pictures or samples of animal products into "Product" and "By-Product" categories.

## Product Identification Poster
In groups, create a poster labeling each item as a main product or by-product, and present it to the class.

## Performance Tasks
**Individual: Poultry/Livestock Housing Sketch.** Create a detailed drawing of a poultry or livestock house, labeling key features such as ventilation, flooring, feeding and watering areas, and space requirements.

**Group: Mini Model Housing Project.** In small groups, build a scale model of a poultry or livestock housing facility using simple materials. Show its layout, ventilation and functional areas, and present it to the class, explaining your design choices.`,
        [
          "What is the difference between a main product and a by-product?",
          "Give two by-products of cattle.",
          "How can a farmer add value to milk?",
        ],
      ),
    ],
    quiz: [
      q(
        "White Leghorn chickens are known for…",
        ["Pulling carts", "Producing many eggs", "Giving milk", "Their wool"],
        1,
        "White Leghorns are a laying breed.",
      ),
      q(
        "Which keeps chicks warm in their first weeks?",
        ["Nest box", "Brooder", "Feed scoop", "Ear tag"],
        1,
        "A brooder with a heat source keeps young chicks warm.",
      ),
      q(
        "Why should animal houses have good ventilation?",
        [
          "To let fresh air flow and keep animals healthy",
          "To make the feed cost less",
          "To keep the animals from sleeping",
          "To keep the floor wet",
        ],
        0,
        "Fresh air removes heat, moisture and bad gases.",
      ),
      q(
        "RA 9003 is about…",
        [
          "Fisheries",
          "Ecological solid waste management",
          "Building houses",
          "School uniforms",
        ],
        1,
        "RA 9003 is the Ecological Solid Waste Management Act of 2000.",
      ),
      q(
        "Which is a by-product of cattle?",
        ["Beef", "Milk", "Hide", "Eggs"],
        2,
        "Hide can be made into leather, on top of the main products.",
      ),
    ],
    bank: [
      q(
        "Which is the most important nutrient for animals?",
        ["Fat", "Protein", "Water", "Salt"],
        2,
        "Animals need clean water at all times.",
      ),
      q(
        "A laying hen eats…",
        ["Layer mash", "Chick starter", "Pig finisher", "Grass only"],
        0,
        "Layer mash gives hens what they need to lay eggs.",
      ),
      q(
        "A foot bath helps stop…",
        ["Rain", "Germs on shoes", "Feed waste", "Heat"],
        1,
        "It disinfects shoes before people enter the animal area.",
      ),
      q(
        "Crowding animals in a pen can…",
        [
          "Help them grow",
          "Spread disease",
          "Lower feed costs",
          "Stop all smells",
        ],
        1,
        "Crowded animals get sick and stressed more easily.",
      ),
      q(
        "Pig manure can be turned into cooking gas using…",
        ["A brooder", "A biogas digester", "A thresher", "A harrow"],
        1,
        "A biogas digester captures the gas from decomposing manure.",
      ),
    ],
  },
];

export const agricultureAndFisheryArts7: DemoSubject = {
  key: "TLE7-AFA",
  code: "TLE 7-AFA",
  name: "TLE 7 – Agriculture and Fishery Arts",
  department: TLE_DEPARTMENT,
  description:
    "Crop production and poultry and livestock — Grade 7, First Term of the three-term TLE: AFA / FCS / IA.",
  colorToken: "emerald",
  units: UNITS,
};
