/**
 * TLE 7 Family and Consumer Science — the Second Term of DepEd's Grade 7
 * Budget of Work (AFA / FCS / IA): hospitality and tourism, then food
 * preparation and service. Each lesson has a lecture video, a written
 * lecture, the Budget of Work's activities and a self-check, and every unit
 * five Unit Questions and five more for Live Quiz.
 */
import type { DemoSubject, DemoUnit } from "../grade10";
import { q, tleLesson, TLE_DEPARTMENT } from "./common";

const UNITS: DemoUnit[] = [
  {
    title: "Hospitality and Tourism",
    description:
      "Hospitality and tourism, kinds of tourism and tourists, the scope of hospitality, careers, and industry trends.",
    lessons: [
      tleLesson(
        "Differentiating Hospitality and Tourism",
        "Two industries that work hand in hand.",
        "BOS63v5LyHo",
        `## Definitions
- **Hospitality** is welcoming and caring for guests: giving them food, drink, a place to stay and a good experience.
- **Tourism** is the movement of people to places away from home, for leisure, business or other reasons, and the activities they do there.

## How they differ
| | Hospitality | Tourism |
|---|---|---|
| Focus | Serving and caring for guests | Traveling to and enjoying places |
| Examples | Hotels, restaurants, resorts | Tour operators, airlines, attractions |
| Main goal | Guest comfort and satisfaction | Moving and guiding travelers |

## How they connect
Tourists need places to eat and sleep, and hotels need travelers. Think of a trip to **Boracay**: the airline and the island-hopping tour are **tourism**; the resort and the restaurant are **hospitality**. Some services, such as a resort's guided tours, belong to **both**.

## Filipino hospitality
Filipinos are known for warmly welcoming guests. *Mabuhay!* is more than a greeting: it shows how a guest should feel, and it is one of our country's strengths in this industry.`,
        `## Hospitality vs. Tourism Concept Sort
Categorize various services and businesses into Hospitality, Tourism or Both, and explain the key reason for each choice.

## Travel Experience Breakdown
Analyze a complete travel scenario, and identify which elements belong to hospitality and which belong to tourism.`,
        [
          "What is hospitality?",
          "Give two examples of tourism businesses.",
          "How do hospitality and tourism depend on each other?",
        ],
      ),
      tleLesson(
        "Types and Forms of Tourism and Kinds of Tourists",
        "Why people travel, where they go, and who they are.",
        "Q4h_vOvJ3PY",
        `## Forms of tourism
Forms describe **where** the traveler comes from and goes.
- **Domestic** — residents traveling within their own country. *Cebuanos visiting Bohol.*
- **Inbound** — visitors coming into the country. *Koreans visiting Palawan.*
- **Outbound** — residents traveling abroad. *Filipinos visiting Japan.*

## Types of tourism
Types describe **why** people travel.
- **Ecotourism** — enjoying nature while protecting it. *Puerto Princesa Underground River*
- **Cultural** — learning about heritage. *Vigan, Banaue Rice Terraces*
- **Adventure** — active and exciting trips. *Surfing in Siargao*
- **Religious** — visiting holy places. *Visita Iglesia*
- **Medical** — traveling for treatment
- **Sports** — joining or watching games
- **Business or MICE** — meetings, incentives, conventions and exhibitions
- **Food tourism** — traveling for local dishes. *Pampanga*

## Kinds of tourists
- **Tourist** — stays at least one night
- **Excursionist** — a day visitor who doesn't stay overnight
- **Independent traveler** — plans the trip alone
- **Group or package traveler** — joins a planned tour
- **Backpacker** — travels with a low budget
- **Business traveler** — travels for work`,
        `## Tourism Types and Tourist Profiles Match-Up
Match tourism types and forms (for example eco-tourism, medical, cultural, domestic, international) with corresponding tourist profiles based on given scenarios.

## Tourist Persona Creation Workshop
Create a tourist persona, and identify the type and form of tourism it represents. Justify your choices.`,
        [
          "What is the difference between inbound and outbound tourism?",
          "Give two examples of ecotourism in the Philippines.",
          "What is an excursionist?",
        ],
      ),
      tleLesson(
        "The Scope of the Hospitality Industry",
        "The sectors that make up hospitality.",
        "5Hr4GyUcAQw",
        `## A wide industry
The hospitality industry includes every business that serves guests away from home.

## Main sectors
- **Accommodation** — hotels, resorts, inns, hostels, homestays
- **Food and beverage** — restaurants, cafés, bars, catering, canteens
- **Recreation and entertainment** — theme parks, spas, cinemas, sports clubs
- **Events** — weddings, conferences, exhibitions and festivals
- **Travel support services** — tour guides, travel agencies, transport

## Inside a hotel
A hotel has many departments working together:
- **Front office** — welcomes and checks in guests
- **Housekeeping** — keeps rooms clean
- **Food and beverage** — restaurants and room service
- **Engineering** — repairs and maintains the building
- **Security** — protects guests and property
- **Sales and marketing** — brings in customers

## Common features
Hospitality sells **experiences**. Service can't be stored for later, and it depends on the **people** giving it. That's why attitude, courtesy and teamwork matter so much.`,
        `## Hospitality Industry Sector Mapping
Create a visual map showing the different hospitality sectors (accommodation, food and beverage, recreation, events, travel support services), with brief explanations of each.

## Hospitality Services Case Walkthrough
Analyze a real or simulated hospitality establishment, and identify all the services involved and their functions.`,
        [
          "Name the five main sectors of hospitality.",
          "Which hotel department checks in guests?",
          "Why do people matter so much in hospitality?",
        ],
      ),
      tleLesson(
        "Careers and Businesses in Hotels and Tourism",
        "Jobs you can have, and businesses you can start.",
        "sCdc3wC8Yj8",
        `## Career opportunities
**Hotels and resorts:** front desk agent, room attendant, chef, waiter, bartender, concierge, hotel manager.

**Tourism:** tour guide, travel agent, flight attendant, cruise ship crew, tourism officer, event organizer.

## Skills that employers look for
- **Communication** and good manners
- **Customer service** and a warm attitude
- **Teamwork**
- **Language skills**
- **Grooming** and professionalism
- **Problem solving**

## A career path
Many managers started at the bottom. For example: trainee → waiter → captain waiter → supervisor → restaurant manager. Senior high school electives, **TESDA** National Certificates and college courses in hospitality and tourism can all help.

## Business opportunities
- **Homestay or small inn**
- **Food stall, café or catering**
- **Local tours** and travel agency
- **Souvenir shop**
- **Event styling**
- **Bike or boat rental**

## A simple business idea
Identify your **service**, your **target market** and what makes it **special**. *Example: a walking food tour of your town for visitors.*`,
        `## Hotel and Tourism Career Path Explorer
Research and present different job roles in hotels and tourism, including required skills, work settings and career progression.

## Tourism Business Idea Pitch
Propose a simple business idea related to hotels or tourism, and explain its target market and potential services.`,
        [
          "Give three careers in tourism.",
          "What skills do hospitality employers look for?",
          "Give one tourism business you could start in your town.",
        ],
      ),
      tleLesson(
        "Issues, Trends and Innovations in Hospitality and Tourism",
        "What challenges the industry, and how it is changing.",
        "GTgMPEdEUpI",
        `## Issues and challenges
- **Overtourism** — too many visitors damaging a place
- **Environmental harm** — garbage, water use and damage to reefs
- **Natural disasters** — typhoons and earthquakes stopping travel
- **Health crises** — the COVID-19 pandemic closed borders and businesses
- **Shortage of skilled workers**
- **Safety and security** concerns

Boracay was closed for about six months in 2018 for rehabilitation, showing what can happen when a destination isn't cared for.

## Trends
- **Sustainable tourism** — protecting nature and helping local people
- **Local experiences** — guests want culture, not just sightseeing
- **Wellness travel** — trips that focus on health
- **Workcations** — working while traveling
- **Food tourism**

## Innovations
- **Online booking** and travel apps
- **Contactless check-in** and QR menus
- **Cashless payments**
- **Robots and AI chatbots** for simple service
- **Virtual tours** that let guests preview a destination

## Thinking it through
For every innovation, ask: what **problem** does it solve? Does it make service **better**, or does it lose the human touch?`,
        `## Industry Trends and Challenges Analysis
Analyze recent hospitality and tourism cases or articles to identify key challenges, trends and innovations, and discuss their impacts.

## Hospitality Innovation Spotlight
Research a recent innovation in hospitality or tourism (technology, sustainability, service design), and explain the issue it aims to solve.`,
        [
          "What is overtourism?",
          "Give two trends in tourism today.",
          "How has technology changed hotel check-in?",
        ],
      ),
    ],
    quiz: [
      q(
        "A family from Davao visits Baguio. This is…",
        [
          "Inbound tourism",
          "Domestic tourism",
          "Outbound tourism",
          "Medical tourism",
        ],
        1,
        "Domestic tourism is traveling within your own country.",
      ),
      q(
        "A hotel belongs to which sector?",
        ["Accommodation", "Recreation", "Events", "Travel support"],
        0,
        "Hotels, resorts and inns are accommodation.",
      ),
      q(
        "Visiting Banaue to learn about Ifugao heritage is…",
        [
          "Sports tourism",
          "Cultural tourism",
          "Business tourism",
          "Medical tourism",
        ],
        1,
        "Cultural tourism is about heritage and ways of life.",
      ),
      q(
        "Too many visitors damaging a place is called…",
        ["Ecotourism", "Overtourism", "Hospitality", "MICE"],
        1,
        "Overtourism harms both a place and its people.",
      ),
      q(
        "A visitor who comes for the day and doesn't stay overnight is…",
        ["A backpacker", "An excursionist", "A concierge", "A host"],
        1,
        "Excursionists are day visitors.",
      ),
    ],
    bank: [
      q(
        "Which is mainly a tourism business?",
        ["Canteen", "Travel agency", "Bakery", "Laundry"],
        1,
        "A travel agency arranges trips for travelers.",
      ),
      q(
        "Which hotel department cleans rooms?",
        ["Front office", "Housekeeping", "Engineering", "Sales"],
        1,
        "Housekeeping keeps rooms and public areas clean.",
      ),
      q(
        "Koreans vacationing in Palawan are an example of…",
        ["Inbound tourism", "Domestic tourism", "Outbound tourism", "A hostel"],
        0,
        "Inbound tourism is visitors coming into the country.",
      ),
      q(
        "MICE stands for…",
        [
          "Meetings, Incentives, Conventions and Exhibitions",
          "Meals, Inns, Cafés and Events",
          "Money, Income, Costs and Expenses",
          "Managers, Interns, Chefs and Employees",
        ],
        0,
        "MICE is business-related tourism.",
      ),
      q(
        "Which is an innovation in hospitality?",
        [
          "Contactless check-in",
          "Paper logbooks",
          "Longer waiting lines",
          "Fewer room keys",
        ],
        0,
        "Contactless check-in uses technology to speed up service.",
      ),
    ],
  },
  {
    title: "Food Preparation and Service",
    description:
      "Fundamentals of food service, HACCP, tools and their care, napkin folds, food selection, and converting measurements.",
    lessons: [
      tleLesson(
        "Fundamentals of Food Preparation and Service",
        "From the kitchen to the table.",
        "ct-G4WLKpsk",
        `## Two sides of the job
- **Back of house** — the kitchen, where food is prepared
- **Front of house** — the dining area, where guests are served

## From kitchen to table
1. **Plan** the menu.
2. **Buy** and receive ingredients.
3. **Store** them correctly.
4. **Prepare** them: wash, cut and measure (*mise en place* means "everything in its place").
5. **Cook** the food.
6. **Plate** it neatly.
7. **Serve** it hot or cold, as it should be.
8. **Clear** and clean up.

## Basic food preparation techniques
Washing, peeling, cutting, mixing, boiling, steaming, frying, baking.

## Types of food service
- **Table service** — a waiter brings food to the table
- **Buffet** — guests serve themselves from a long table
- **Counter service** — guests order and pick up, as in fast food
- **Family style** — shared dishes are placed on the table

## Good practice
Wash hands, tie back hair, wear an apron, keep raw and cooked foods apart, keep hot food hot and cold food cold, and greet guests with a smile.`,
        `## Basic Food Preparation and Service Demonstration
Observe or perform a guided demonstration of basic food preparation techniques and proper food service steps, then explain their purposes.

## From Kitchen to Table Flow Activity
Sequence the steps of food preparation and service, from ingredient preparation to guest service, and discuss key standards involved.`,
        [
          "What is the difference between back of house and front of house?",
          "What does mise en place mean?",
          "Name three types of food service.",
        ],
      ),
      tleLesson(
        "The Seven Principles of HACCP",
        "A system for keeping food safe.",
        "pd6geHihHOg",
        `## What is HACCP?
**HACCP** stands for **Hazard Analysis and Critical Control Points**. It is a system for preventing food safety problems before they happen, rather than finding them after someone is sick.

## Food hazards
- **Biological** — bacteria, viruses and parasites
- **Chemical** — cleaning liquids and pesticides
- **Physical** — hair, glass, bones, stones

## The seven principles
1. **Conduct a hazard analysis** — list what can go wrong.
2. **Determine critical control points (CCPs)** — find the steps where a hazard can be stopped, such as cooking.
3. **Establish critical limits** — set the safe limit, such as a cooking temperature.
4. **Establish monitoring** — check it, for example with a thermometer.
5. **Establish corrective actions** — decide what to do if a limit isn't met.
6. **Establish verification** — confirm that the system works.
7. **Keep records** — write everything down.

## Example: cooking chicken
- **Hazard:** bacteria in raw chicken
- **CCP:** cooking
- **Critical limit:** at least 74 °C inside
- **Monitoring:** check with a food thermometer
- **Corrective action:** keep cooking until it reaches the limit
- **Records:** write the temperature on a log

## The danger zone
Bacteria grow fastest between about **5 °C and 60 °C**. Keep food out of this range as much as you can.`,
        `## HACCP Principles Identification Drill
Match each HACCP principle to its correct description and example within food preparation and service scenarios.

## HACCP in Action Scenario Analysis
Analyze common kitchen scenarios, and identify which HACCP principles are being applied or violated.`,
        [
          "What does HACCP stand for?",
          "Give the seven principles in order.",
          "What is the temperature danger zone?",
        ],
      ),
      tleLesson(
        "Tools and Equipment in Food Preparation and Service",
        "Knowing what each item in the kitchen and dining room does.",
        "UlKztvtQ-dM",
        `## Cutting tools
- **Chef's knife** — all-around chopping
- **Paring knife** — small work such as peeling
- **Cutting board** — a safe surface for cutting
- **Peeler** and **grater**

## Measuring tools
- **Measuring cups** (dry and liquid)
- **Measuring spoons**
- **Weighing scale**
- **Thermometer**

## Mixing and cooking tools
- **Mixing bowls**, **wooden spoons**, **wire whisk**, **rubber scraper**
- **Tongs** and **ladle**
- **Saucepan**, **frying pan**, **stock pot**

## Kitchen equipment
**Stove**, **oven**, **refrigerator**, **freezer**, **blender**, **microwave**.

## Service equipment
- **Flatware** — spoons, forks, knives
- **Dinnerware** — plates, bowls, cups
- **Glassware** — water glass, juice glass
- **Linen** — tablecloths and napkins
- **Serving tray** and **serving spoons**

## Choosing the right tool
The right tool is safer, faster and gives better results. Using a knife to open a can, for example, can break the blade and injure you.`,
        `## Name That Kitchen Tool!
Name each tool shown in pictures or in real life, and tell its basic use.

## Tools for the Job Match Game
Match pictures or cards of tools and equipment with the food preparation or service tasks they are used for.`,
        [
          "What is a paring knife used for?",
          "Give three items of service equipment.",
          "Why use the right tool for the job?",
        ],
      ),
      tleLesson(
        "Care and Maintenance of Tools and Equipment",
        "Cleaning, sanitizing and storing what you use.",
        "leBVt166yCc",
        `## Cleaning and sanitizing
- **Cleaning** removes dirt and food that you can see.
- **Sanitizing** reduces germs to a safe level.

A surface can look clean and still be unsafe, so you need both.

## Dishwashing steps
1. **Scrape** off leftover food.
2. **Wash** with hot water and soap.
3. **Rinse** with clean water.
4. **Sanitize** with very hot water or a food-safe sanitizer.
5. **Air-dry** on a clean rack.

## Caring for tools
- **Knives** — wash by hand, dry at once, keep sharp, store in a rack
- **Cutting boards** — wash and sanitize after each use; use separate boards for raw and cooked food
- **Pots and pans** — soak stuck food; don't scrape nonstick surfaces with metal
- **Glassware** — wash separately, and check for chips

## Caring for equipment
- **Stove and oven** — wipe spills once cool; check gas hoses
- **Refrigerator** — clean weekly; keep at 5 °C or below
- **Electric appliances** — unplug before cleaning; never put them in water

## Storing
Keep tools clean and dry. Store heavy things low, and sharp things out of the way. Report anything broken.`,
        `## Kitchen Care Demonstration
Watch a demonstration of cleaning, sanitizing and storing kitchen tools, and explain why each step is important.

## Tool Care Checklist Activity
Create a simple checklist showing how to clean, maintain and safely store different kitchen and service tools.`,
        [
          "What is the difference between cleaning and sanitizing?",
          "List the dishwashing steps.",
          "What must you do before cleaning an electric appliance?",
        ],
      ),
      tleLesson(
        "Table Napkin Folds",
        "Adding beauty to a table with a simple cloth.",
        "MiU1rgp55V4",
        `## Why fold napkins?
A folded napkin makes a table look **neat and special**, and it shows guests that care went into the meal.

## Before you fold
- **Wash your hands.**
- Use a clean, ironed, square napkin. Slightly starched cloth holds its shape.
- Fold on a clean, flat surface.
- Handle napkins as little as possible, since guests will use them on their lips.

## Simple folds
**Rectangle**
1. Lay the napkin flat.
2. Fold in half.
3. Fold in half again in the same direction.

**Triangle**
1. Lay the napkin flat, like a diamond.
2. Fold the bottom corner up to the top corner.

**Fan**
1. Fold in half into a rectangle.
2. Make small pleats back and forth, like a paper fan, up to about three-quarters of the length.
3. Fold in half, with the pleats outside.
4. Tuck the loose end behind to form a stand, and let the fan open.

## Other folds to try
Bishop's hat, lotus, standing fan, pocket and cardinal's hat.

## Placing the napkin
Put it in the **center of the place setting**, or to the **left of the forks**. Make every napkin on the table the same.`,
        `## Step-by-Step Napkin Folding Demo
Follow a guided demonstration to fold napkins into simple designs such as a rectangle, triangle or fan.

## Napkin Folding Practice Challenge
Practice folding napkins into assigned designs, and display them neatly on a table setup.`,
        [
          "Why must hands be washed before folding napkins?",
          "Give the steps of the triangle fold.",
          "Where is a napkin placed on the table?",
        ],
      ),
      tleLesson(
        "Principles of Food Selection and Preparation",
        "Choosing and preparing food that is healthy and safe.",
        "u_6nde6K1rQ",
        `## Selecting food
- **Nutrition** — does it help the body?
- **Freshness** — bright color, firm texture, fresh smell
- **Safety** — sealed packs, not expired, no dents or swelling in cans
- **Budget** — buy what is in season; it costs less
- **Variety** — eat many kinds of food

## Go, Grow and Glow
- **Go foods** give energy: rice, bread, root crops
- **Grow foods** build the body: fish, meat, eggs, beans, milk
- **Glow foods** keep us healthy: fruits and vegetables

The **Pinggang Pinoy** guide from the Food and Nutrition Research Institute shows how much of each to put on your plate. Vegetables and fruits fill about half the plate.

## Preparation do's and don'ts
| Do | Don't |
|---|---|
| Wash hands, fruits and vegetables | Wash raw chicken in the sink, which spreads germs |
| Keep raw and cooked foods apart | Use one board for both without washing it |
| Cook food thoroughly | Taste food from the spoon you stir with |
| Keep vegetables' nutrients by cooking them briefly | Overcook vegetables in a lot of water |
| Refrigerate leftovers soon | Leave cooked food out for hours |`,
        `## Healthy Plate Discussion
Create a sample meal using pictures or real ingredients, and explain how it follows principles of balanced nutrition and food variety.

## Food Preparation Do's and Don'ts
List correct and incorrect methods in preparing a simple dish, and discuss the reasons behind proper practices.`,
        [
          "What are Go, Grow and Glow foods?",
          "How do you check that canned food is safe?",
          "How much of the plate should be fruits and vegetables?",
        ],
      ),
      tleLesson(
        "Converting Units of Measurement",
        "Kitchen math for grams, liters, cups and spoons.",
        "Gb1Ry_cb8gY",
        `## Why measurements matter
Correct measurements give the same good result every time, and they stop you from wasting ingredients.

## Common equivalents
| Unit | Equals |
|---|---|
| 1 kilogram (kg) | 1,000 grams (g) |
| 1 liter (L) | 1,000 milliliters (ml) |
| 1 tablespoon (tbsp) | 3 teaspoons (tsp) or about 15 ml |
| 1 cup | 16 tbsp or about 240 ml |
| 1 pound (lb) | about 454 g |

## Converting
- **Big unit to small unit: multiply.** 2.5 kg × 1,000 = 2,500 g
- **Small unit to big unit: divide.** 750 ml ÷ 1,000 = 0.75 L

## Adjusting a recipe
**Conversion factor = servings you need ÷ servings in the recipe**

*Example:* a recipe for 4 needs 2 cups of rice. You need to serve 10.
- Factor: 10 ÷ 4 = **2.5**
- Rice: 2 × 2.5 = **5 cups**

Multiply every ingredient by the same factor.

## Measuring correctly
Level off dry ingredients with a straight edge. Read liquids at eye level.`,
        `## Measurement Conversion Relay
Work in teams to solve conversion problems (for example grams to kilograms, milliliters to liters) as fast as you can in a relay.

## Real-Life Recipe Conversion
Adjust ingredient quantities in a simple recipe by converting units to suit different servings.

## Performance Tasks
**Individual: Safe Snack Preparation.** Prepare a simple snack or dish (for example a sandwich, salad or fruit cup), applying proper hygiene, safe handling of utensils and correct preparation steps.

**Group: Table Setting and Service Activity.** In small groups, set a dining table and serve a simple meal or snack. Show safe handling of food, utensils and equipment, with proper hygiene and presentation.`,
        [
          "How many grams are in 3 kg?",
          "How many tablespoons are in 1 cup?",
          "A recipe for 5 uses 3 eggs. How many eggs for 15?",
        ],
      ),
    ],
    quiz: [
      q(
        "Mise en place means…",
        [
          "Cooking on high heat",
          "Everything in its place",
          "Cleaning the plates",
          "Serving guests first",
        ],
        1,
        "It means preparing and arranging everything before cooking.",
      ),
      q(
        "In HACCP, checking chicken with a thermometer is…",
        ["Monitoring", "Record keeping", "Hazard analysis", "Verification"],
        0,
        "Monitoring means checking that a critical limit is met.",
      ),
      q(
        "Sanitizing a cutting board…",
        [
          "Removes visible dirt only",
          "Reduces germs to a safe level",
          "Makes it sharper",
          "Is never needed",
        ],
        1,
        "Sanitizing comes after cleaning and reduces germs.",
      ),
      q(
        "Fish, eggs and beans are…",
        ["Go foods", "Grow foods", "Glow foods", "Empty foods"],
        1,
        "Grow foods build and repair the body.",
      ),
      q(
        "How many milliliters are in 2 liters?",
        ["20", "200", "2,000", "20,000"],
        2,
        "1 liter is 1,000 ml, so 2 × 1,000 = 2,000 ml.",
      ),
    ],
    bank: [
      q(
        "Bacteria grow fastest in which range?",
        ["Below 0 °C", "5 °C to 60 °C", "Above 100 °C", "Only at 0 °C"],
        1,
        "This range is called the temperature danger zone.",
      ),
      q(
        "A strand of hair in food is what kind of hazard?",
        ["Physical", "Chemical", "Biological", "Natural"],
        0,
        "Physical hazards are foreign objects in food.",
      ),
      q(
        "Which is flatware?",
        ["Plate", "Fork", "Glass", "Napkin"],
        1,
        "Flatware means spoons, forks and knives.",
      ),
      q(
        "In which position do you start the triangle fold?",
        ["Like a diamond", "Rolled up", "Already pleated", "Wet"],
        0,
        "A napkin laid as a diamond folds neatly from corner to corner.",
      ),
      q(
        "A recipe for 4 needs 2 cups of flour. How much for 8?",
        ["2 cups", "3 cups", "4 cups", "8 cups"],
        2,
        "The factor is 8 ÷ 4 = 2, so 2 × 2 = 4 cups.",
      ),
    ],
  },
];

export const familyAndConsumerScience7: DemoSubject = {
  key: "TLE7-FCS",
  code: "TLE 7-FCS",
  name: "TLE 7 – Family and Consumer Science",
  department: TLE_DEPARTMENT,
  description:
    "Hospitality, tourism, and food preparation and service — Grade 7, Second Term of the three-term TLE: AFA / FCS / IA.",
  colorToken: "rose",
  units: UNITS,
};
