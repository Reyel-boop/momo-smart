/**
 * Food and Beverage Operation, Grade 11 — a Technical-Professional elective
 * of DepEd's Strengthened Senior High School Curriculum (Hospitality and
 * Tourism), taken from its Three-Term Budget of Work. One unit per term; one
 * lesson per learning competency, each with a written lecture, the Budget of
 * Work's two activities and a self-check, and every unit with five Unit
 * Questions and five more for Live Quiz. Each term's last lesson also carries
 * that term's performance tasks. Learners are minors, so alcoholic beverages
 * are studied for service knowledge only, and practice uses non-alcoholic ones.
 */
import type { DemoSubject, DemoUnit } from "../grade10";
import { q, tleLesson, TLE_DEPARTMENT } from "./common";

const UNITS: DemoUnit[] = [
  // 1st Term
  {
    title: "Principles of Food and Beverage Operations",
    description:
      "The industry, tools and equipment, principles of service, legislation and safety, menus, and customer handling.",
    lessons: [
      tleLesson(
        "Overview of the Food and Beverage Industry",
        "History, trends and key sectors.",
        "FUuY-utseDI",
        `## What is the F&B industry?
The **food and beverage (F&B) industry** prepares and serves food and drinks to people away from home. It is a major part of hospitality and an important source of jobs.

## A short history
- **Ancient times** — inns and taverns fed travelers.
- **1700s, France** — the modern **restaurant** appeared, with menus and individual tables.
- **1900s** — **fast food** chains brought speed and standard products.
- **Philippines** — from *carinderias* and *panciterias* to home-grown chains such as Jollibee.
- **Today** — delivery apps, cloud kitchens and food tourism.

## Key sectors
- **Commercial** — restaurants, cafés, bars, hotels, fast food, catering
- **Institutional** — schools, hospitals, offices, airlines

## Types of establishments
| Type | Service |
|---|---|
| Fine dining | Full table service, formal |
| Casual dining | Relaxed table service |
| Fast casual | Order at the counter, better quality |
| Quick service | Fast, low cost |
| Café | Coffee, snacks |
| Catering | Food for events |
| Carinderia | Local, low-cost meals |

## Trends
Online ordering, healthy and plant-based food, sustainability, local ingredients and cashless payments.`,
        `## Activity 1: Industry Overview Report
Research and write a report summarizing the history, trends and key sectors of the food and beverage industry.

## Activity 2: Industry Presentation
Prepare a presentation highlighting major food and beverage establishments and their services.`,
        [
          "What is the difference between commercial and institutional F&B?",
          "Where did the modern restaurant appear?",
          "Give three current trends in the industry.",
        ],
      ),
      tleLesson(
        "Tools, Equipment and Materials in Food and Beverage Service",
        "Proper use, handling and maintenance.",
        "bO4d7V8Vcuo",
        `## Service tools and materials
- **Chinaware** — plates, bowls, cups and saucers
- **Glassware** — water goblet, highball glass, juice glass
- **Flatware** — forks, spoons
- **Cutlery** — knives
- **Holloware** — serving dishes, teapots, coffee pots
- **Linen** — tablecloths, napkins, service cloths
- **Trays** — round or rectangular

## Equipment
Tables and chairs, side stations, trolleys, chafing dishes, coffee machines, water dispensers, refrigerators, dishwashers and POS terminals.

## Proper handling
- Hold **glasses by the stem or base**, never by the rim.
- Hold **flatware by the handle**.
- Hold **plates by the edge**, with your thumb off the food area.
- Use a **tray** to carry items.
- Never use chipped or cracked items.

## Cleaning and storage
1. **Scrape** and sort the items.
2. **Wash, rinse and sanitize.**
3. **Polish** glasses and flatware with a clean, dry cloth.
4. **Store** glasses upside down on a clean rack, and stack plates by size.

## Maintenance schedule
A schedule lists each item, the cleaning task, how often it's done and who does it. Report damage at once, and keep an **inventory** of what you have.`,
        `## Activity 1: Tool Handling Practice
Demonstrate the correct use and handling of common food and beverage tools and equipment.

## Activity 2: Equipment Maintenance Simulation
Prepare a maintenance schedule, and demonstrate proper cleaning and storage procedures for equipment.`,
        [
          "What is holloware?",
          "How should a glass be held?",
          "What are the steps in cleaning service tools?",
        ],
      ),
      tleLesson(
        "Principles of Service",
        "What great food and beverage service is built on.",
        "zabfmu0Ac0A",
        `## The goal
Good service means **meeting the guest's needs** in a friendly, correct and timely way. Food fills a guest, but service brings a guest back.

## Key principles
- **Guest first** — think about what the guest needs
- **Courtesy** — greet, smile, say "please" and "thank you"
- **Timeliness** — don't keep guests waiting
- **Accuracy** — serve what was ordered, correctly
- **Consistency** — the same quality every visit
- **Cleanliness** — of the staff, tools and dining area
- **Product knowledge** — know the menu
- **Teamwork** — kitchen and service work as one

## Styles of service
- **American (plated)** — food is plated in the kitchen
- **French (guéridon)** — finished on a cart beside the table
- **Russian (platter)** — served from a platter to each guest
- **English (family)** — dishes are served at the table by a host
- **Buffet** — guests serve themselves

## The professional server
**Grooming:** clean uniform, neat hair, short nails, little perfume.

**Attitude:** calm, helpful, honest.

**Skills:** listening, carrying, order taking, selling.

## Suggestive selling
Offer what the guest may enjoy: "Would you like iced tea with that?" Suggest helpfully, and never pressure guests.`,
        `## Activity 1: Service Principles Essay
Write an essay explaining the key principles of customer service in food and beverage operations.

## Activity 2: Service Role Play
Simulate customer service scenarios demonstrating proper service techniques.`,
        [
          "Give five principles of service.",
          "What is the difference between American and Russian service?",
          "What is suggestive selling?",
        ],
      ),
      tleLesson(
        "Legislation and Safety in Food and Beverage Operation",
        "The laws and safety measures that protect guests and workers.",
        "aNGxXAbv98U",
        `## Why it matters
Unsafe food can make guests seriously ill. An unsafe workplace hurts workers. Breaking the law can close a business.

## Key laws in the Philippines
| Law | Covers |
|---|---|
| **Code on Sanitation (PD 856)** | Sanitation in food establishments |
| **Food Safety Act (RA 10611)** | Safe food from farm to plate |
| **Consumer Act (RA 7394)** | Consumer rights, honest selling |
| **Fire Code (RA 9514)** | Fire safety |
| **OSH Law (RA 11058)** | Workers' safety and health |
| **Data Privacy Act (RA 10173)** | Guests' personal data |

## Requirements
Business permits, a **sanitary permit**, **health certificates** for food handlers, a fire safety inspection certificate, and a license to sell liquor, where this applies. Selling alcohol to minors is prohibited.

## Food safety basics
- **Clean** — hands, tools, surfaces
- **Separate** — keep raw foods apart from cooked foods
- **Cook** — thoroughly
- **Chill** — keep cold foods at 5 °C or below

**Cross-contamination** is the transfer of germs from one food or surface to another.

## Workplace safety
Keep floors dry, exits clear, and extinguishers ready. Report hazards, and know your first aid.

## Food allergies
Peanuts, shellfish and milk can seriously harm allergic guests. Never guess about ingredients; always ask the kitchen.`,
        `## Activity 1: Safety and Legislation Report
Research and summarize safety protocols and legal requirements in food and beverage operations.

## Activity 2: Safety Simulation
Conduct a mock inspection of a food service area to identify compliance and safety issues.`,
        [
          "What does the Code on Sanitation cover?",
          "What is cross-contamination?",
          "What should a server do when asked about allergens?",
        ],
      ),
      tleLesson(
        "Developing a Menu for Restaurant and Room Service",
        "Planning what to offer, and how to price it.",
        "SdBclBCiYX8",
        `## What is a menu?
A **menu** lists the food and drinks offered, with their prices. It is the restaurant's main selling tool.

## Types of menus
- **À la carte** — each item priced separately
- **Table d'hôte (set menu)** — a fixed number of courses at one price
- **Cycle menu** — repeats over a set period, as in schools and hospitals
- **Du jour** — dishes of the day
- **Room service menu** — a short list of foods that travel well

## Menu courses
Appetizer → Soup → Salad → Main course → Dessert → Beverages

## Things to consider
- **Target customers** — age, tastes and budget
- **Kitchen ability** — staff skills and equipment
- **Ingredients** — availability and season
- **Balance** — color, texture and flavor
- **Cost** — good profit at a fair price
- **Dietary needs** — vegetarian, halal and allergies

## Room service menus
Offer foods that **stay hot and hold up well**, are easy to eat, and can be served fast. Show service hours and delivery charges.

## Writing and design
Use clear descriptions and sections. **Pricing:** selling price = food cost ÷ target food cost percent. A ₱60 dish at 30% sells for **₱200**.`,
        `## Activity 1: Individual Menu Draft
Create a sample menu including dishes, pricing and target customers for restaurant or room service.

## Activity 2: Menu Workshop
Collaborate in a group to refine and design a complete menu for a restaurant or hotel service.`,
        [
          "What is the difference between à la carte and table d'hôte?",
          "Give four things to consider in menu planning.",
          "What is the selling price of a ₱45 dish at 30% food cost?",
        ],
      ),
      tleLesson(
        "Effective Customer Handling",
        "Greeting, assisting and solving complaints.",
        "baCQpnxZxQQ",
        `## First impressions
Greet guests within moments of arrival, with a smile and eye contact: "Good evening, welcome to Momo's Café."

## Good communication
- **Active listening** — give full attention, and don't interrupt
- **Polite language** — "May I…", "Certainly", "My pleasure"
- **Clarify** — repeat the order back
- **Body language** — stand straight, keep your hands out of your pockets

## Taking an order
1. Greet, and offer the menu.
2. Give the guest time, and be ready with suggestions.
3. Take orders in sequence, ladies and elders first where that's the custom.
4. Ask how food should be done, and note any allergies.
5. **Repeat the order.**
6. Thank the guest.

## Handling complaints: LAST
- **L — Listen** carefully, without arguing.
- **A — Apologize** sincerely.
- **S — Solve** the problem, or get a supervisor.
- **T — Thank** the guest for telling you.

## Difficult moments
Stay calm, keep your voice low, and don't take it personally. Never argue, and never blame the kitchen. A complaint handled well can turn an unhappy guest into a loyal one.

## Special guests
Offer help to seniors, persons with disabilities and families with children, without being asked twice.`,
        `## Activity 1: Customer Interaction Role Play
Practice greeting, assisting and addressing customer complaints in a simulated scenario.

## Activity 2: Service Feedback Exercise
In groups, role-play service scenarios, and evaluate each other's performance based on customer satisfaction.

## 1st Term Performance Tasks
**Individual: Menu Development Activity.** Create a **simple menu** for either a restaurant or room service.

**Group: Customer Handling Role-Play.** In pairs or groups of three, perform a **customer service interaction** (ordering, clarifying menu items, handling minor concerns). Show proper techniques such as greeting, active listening, polite communication and accurate order-taking.`,
        [
          "What does LAST stand for?",
          "Why repeat an order back to the guest?",
          "Give two things you must never do with an angry guest.",
        ],
      ),
    ],
    quiz: [
      q(
        "A hospital canteen belongs to which sector?",
        ["Institutional", "Commercial", "Fine dining", "Cloud kitchen"],
        0,
        "Institutional food service operates in schools, hospitals and offices.",
      ),
      q(
        "How should a glass be carried?",
        [
          "By the stem or base",
          "By the rim",
          "With fingers inside",
          "Under the arm",
        ],
        0,
        "Touching the rim leaves germs where the guest drinks.",
      ),
      q(
        "Food plated in the kitchen and carried to the guest is…",
        [
          "American service",
          "French service",
          "Russian service",
          "Buffet service",
        ],
        0,
        "American, or plated, service is the most common style.",
      ),
      q(
        "Germs moving from raw chicken to a salad is…",
        [
          "Cross-contamination",
          "Suggestive selling",
          "Preservation",
          "Fermentation",
        ],
        0,
        "This is why raw and cooked foods are kept apart.",
      ),
      q(
        "In LAST, the letter A stands for…",
        ["Apologize", "Argue", "Answer", "Agree"],
        0,
        "Listen, Apologize, Solve, Thank.",
      ),
    ],
    bank: [
      q(
        "Which is holloware?",
        ["A teapot", "A napkin", "A fork", "A chair"],
        0,
        "Holloware includes serving dishes and pots.",
      ),
      q(
        "A set menu at one price is called…",
        ["Table d'hôte", "À la carte", "Du jour", "Cycle"],
        0,
        "Table d'hôte offers fixed courses at one price.",
      ),
      q(
        "A ₱30 dish at a 30% food cost sells for…",
        ["₱60", "₱90", "₱100", "₱130"],
        2,
        "₱30 ÷ 0.30 = ₱100.",
      ),
      q(
        "RA 10611 is the…",
        ["Food Safety Act", "Fire Code", "Data Privacy Act", "Consumer Act"],
        0,
        "RA 10611 covers safe food from farm to plate.",
      ),
      q(
        "A guest asks if a dish has peanuts, and you aren't sure. You should…",
        ["Check with the kitchen", "Say no", "Guess", "Change the topic"],
        0,
        "Allergies can be serious, so never guess.",
      ),
    ],
  },
  // 2nd Term
  {
    title: "Restaurant, Beverage and In-Room Service",
    description:
      "Reservations, opening and closing, serving techniques, table settings, beverage service, in-room dining, and barista basics.",
    lessons: [
      tleLesson(
        "The Reservation Process",
        "Taking a booking, from inquiry to confirmation.",
        "BasbD5QZHZg",
        `## Why reservations matter
Reservations help a restaurant plan **staff, food and tables**, and they assure guests of a seat.

## Sources of reservations
Phone, walk-in, website, app, email and social media.

## Correct sequence
1. **Greet** — "Good morning, Momo's Café. This is Ana. How may I help you?"
2. **Ask for the date and time.**
3. **Ask for the number of guests.**
4. **Check availability.**
5. **Offer alternatives** if the time is full.
6. **Get the guest's name and contact number.**
7. **Ask about special requests** — birthdays, high chairs, allergies, seating.
8. **Repeat all the details.**
9. **Explain the policy** — how long a table is held, and deposits.
10. **Thank the guest** and record the booking.

## Reservation record
| Date | Time | Name | Guests | Contact | Notes |
|---|---|---|---|---|---|
| Mar 12 | 7:00 PM | Reyes | 6 | 0917 000 0000 | Birthday cake |

## On the day
Confirm by phone or text, and prepare the table. Greet guests by name.

## Other cases
- **No-show** — the guest doesn't arrive
- **Overbooking** — too many bookings; avoid it
- **Waitlist** — guests waiting for a free table

Guest details are private; use them only for the booking.`,
        `## Activity 1: Reservation Simulation
Perform the step-by-step reservation process for a hypothetical customer.

## Activity 2: Reservation Workflow Design
In a group, create a visual flowchart showing the full reservation process, from inquiry to confirmation.`,
        [
          "Why repeat the details to the guest?",
          "What information must a reservation record have?",
          "What is a no-show?",
        ],
      ),
      tleLesson(
        "Opening and Closing Procedures",
        "Getting the outlet ready, and shutting it down right.",
        "aUKuCU89zb8",
        `## Opening procedures
**Mise en place** means having everything ready before service.

1. **Check in**, and get into a clean uniform.
2. Attend the **briefing**: the day's specials, reservations, sold-out items.
3. **Clean** the dining area, tables and chairs.
4. **Set up tables** with linen and tableware.
5. **Stock side stations** with flatware, napkins and condiments.
6. **Prepare beverages**: coffee, water, ice.
7. **Check menus** for cleanliness.
8. **Check the POS** and the cash fund.
9. **Check** lights, music and temperature.
10. **Do a final walk-through**.

## Closing procedures
1. **Finish** with the last guests politely. Never rush them.
2. **Clear and clean** tables and chairs.
3. **Restock** side stations for the next shift.
4. **Clean** the machines, and empty the bins.
5. **Sort** used linen.
6. **Store** food safely, labeled and dated.
7. **Close the POS**, and count and report sales.
8. **Log** problems for the next shift.
9. **Turn off** equipment, lights and gas.
10. **Lock up**, and check doors and windows.

## Why checklists?
Checklists make sure that nothing is forgotten, and they show who did what.`,
        `## Activity 1: Procedure Report
Write a report detailing the standard opening and closing procedures in a food and beverage operation.

## Activity 2: Opening and Closing Drill
Simulate the complete opening and closing routine for a restaurant or hotel outlet.`,
        [
          "What is a briefing for?",
          "Give five opening tasks.",
          "Why do outlets use checklists?",
        ],
      ),
      tleLesson(
        "Proper Handling and Serving Techniques",
        "Carrying and serving with skill and courtesy.",
        "jvBi294kJWU",
        `## Carrying a tray
1. Load heavy items at the **center**.
2. Lift with your legs, and balance the tray on your **palm and fingers**, at shoulder level.
3. Keep your back straight, and walk steadily.
4. Use your free hand to open doors and for balance.

## Carrying plates
Carry two or three plates, holding them by the edge. Keep your thumb off the food area.

## Rules of table service
- Serve **food from the left** of the guest, or as your outlet's standard says.
- Serve **beverages from the right**.
- Clear **from the right**.
- Serve women, elders and guests of honor first, where that's your outlet's custom.
- Serve everyone at a table at the same time.
- Hold plates so that the main item faces the guest.
- Pour water without touching the glass with the pitcher.

## Clearing
Wait until everyone has finished. A knife and fork placed together on the plate usually mean that the guest is done. Remove from the right, without stacking in front of guests.

## Etiquette
Say "Excuse me" before reaching in. Don't touch guests. Don't lean on tables. Don't eat or chew gum on the floor.

## Accidents
If you spill something, apologize, clean it at once, and call your supervisor.`,
        `## Activity 1: Serving Techniques Practice
Practice serving food and beverages using correct techniques, posture and etiquette.

## Activity 2: Service Demonstration
In groups, serve a simulated meal to classmates, demonstrating professional handling and serving standards.`,
        [
          "Where should the heaviest items go on a tray?",
          "From which side are beverages served?",
          "What does a knife and fork placed together mean?",
        ],
      ),
      tleLesson(
        "Table Settings and Presentation",
        "Laying a table correctly and attractively.",
        "UZUQGPR_b2A",
        `## Kinds of table settings
- **Basic** — a plate, fork, knife, spoon, glass and napkin
- **Informal** — adds salad fork, soup spoon or bread plate
- **Formal** — several courses of tableware, all set out in order

## Rules for a formal cover
A **cover** is the place setting for one guest.

- **Forks** go on the **left**.
- **Knives** go on the **right**, with blades facing the plate.
- **Spoons** go to the right of the knives.
- **Dessert spoon and fork** go above the plate.
- **Bread plate** goes to the upper left, with the butter knife.
- **Glasses** go at the upper right, above the knives.
- **Napkin** goes on the plate or to the left.
- Tableware is used **from the outside in**.
- Keep the bottom of the tableware about one inch from the table edge.

## Steps in table setting
1. **Clean** the table and check that it's steady.
2. **Lay the cloth**, with even sides.
3. **Place the plates**, evenly spaced.
4. **Place flatware** and glasses.
5. **Add the napkins**.
6. **Add** salt, pepper and a centerpiece.

## Themed tables
Match colors and centerpieces to the occasion: gold and white for a wedding, native placemats for a Filipino dinner. Keep centerpieces **low**, so guests can see each other.`,
        `## Activity 1: Individual Table Setup
Set up a formal table with appropriate utensils, glasses and tableware.

## Activity 2: Group Table Presentation
In groups, design and present different themed table settings for various meal types.`,
        [
          "What is a cover?",
          "On which side do forks go?",
          "Why are centerpieces kept low?",
        ],
      ),
      tleLesson(
        "Types of Beverage Services",
        "Non-alcoholic and alcoholic beverages, and how they are served.",
        "gM4vyqsAXEU",
        `## Classes of beverages
**Non-alcoholic**
- **Hot** — coffee, tea, chocolate
- **Cold** — juices, soft drinks, water, shakes, mocktails

**Alcoholic** — these contain ethanol, and are made by fermenting or distilling.
- **Fermented** — beer, wine
- **Distilled** — rum, gin, whisky
- **Philippine traditional** — tuba, lambanog, basi

Servers need this as **product knowledge**. Alcohol is for adults only: it is prohibited to sell or serve it to minors. In class, practice with non-alcoholic drinks only.

## Types of beverage service
- **Table service** — ordered and served at the table
- **Bar service** — served at the counter
- **Counter or self-service** — guests order or help themselves
- **Banquet service** — poured or passed around at events
- **Room service** — delivered to the guest room
- **Tray service** — carried around to standing guests

## Serving correctly
- Use the **right glass**, polished and clean.
- Serve **cold drinks cold** and **hot drinks hot**.
- Use a **coaster**.
- Serve from the guest's right.
- Offer refills.

## Responsible service
Staff must check IDs, refuse service to minors and to guests who are clearly drunk, and offer water or food. Guest safety comes before sales.`,
        `## Activity 1: Beverage Services Report
Research and summarize the different types of beverage services in the hospitality industry.

## Activity 2: Service Type Simulation
Demonstrate at least 2 different types of beverage service in a role-play setting, using non-alcoholic drinks.`,
        [
          "What is the difference between fermented and distilled drinks?",
          "Name four types of beverage service.",
          "When must a server refuse to serve alcohol?",
        ],
      ),
      tleLesson(
        "Pre- and Post-Service Sequence in the Restaurant",
        "What happens before, during and after the guest's meal.",
        "VgrymcKDI9M",
        `## Pre-service
Before guests arrive:
1. Clean the dining area.
2. Set the tables.
3. Stock the side stations.
4. Prepare the condiments, water and ice.
5. Check menus and the POS.
6. Attend the staff briefing.
7. Check your own grooming.

## The sequence of service
1. **Greet and seat** the guest.
2. **Present the menu** and offer water.
3. **Take the drink order.**
4. **Take the food order**, and repeat it.
5. **Send** the order to the kitchen.
6. **Serve** the courses in order.
7. **Check back** after a couple of minutes: "How is everything?"
8. **Clear** each course.
9. **Offer dessert** and coffee.
10. **Present the bill.**
11. **Settle** the payment.
12. **Thank and bid farewell**.

## Post-service
After guests leave:
1. **Clear** the table.
2. **Clean and reset** the table.
3. **Return** used items to the dishwashing area.
4. **Sort** linen.
5. **Restock** the side stations.
6. **Report** guest comments and shortages.

## Service audit
An **audit** checks the setup against a standard. Are tables level? Is flatware clean? Is the menu updated?`,
        `## Activity 1: Service Sequence Practice
Perform the full pre-service and post-service routine individually, following standard procedures.

## Activity 2: Service Audit Simulation
In groups, evaluate a simulated restaurant setup for adherence to pre- and post-service sequences.`,
        [
          "Give five pre-service tasks.",
          "When should you check back with guests?",
          "What is a service audit?",
        ],
      ),
      tleLesson(
        "In-Room Dining Service",
        "Serving guests in their hotel rooms.",
        "oXUx9tGLK3M",
        `## What is in-room dining?
**In-room dining**, or **room service**, brings food and drinks to a hotel guest's room.

## Taking the order
1. Answer the call quickly, and use the guest's name.
2. Take the order, asking about **allergies** and preferences.
3. **Repeat** the order and the room number.
4. **Give the delivery time.**
5. Thank the guest.

## Preparing
Check the order. Set the **tray or trolley** with linen, flatware, condiments and napkins. Keep hot food covered and cold food cold. Bring the bill.

## Delivery
1. Take the **service elevator**.
2. **Knock** and say "Room service."
3. **Wait** for the guest to open the door.
4. **Greet** the guest by name.
5. **Ask** where to place the tray.
6. **Set up** the tray and explain what's there.
7. **Present the bill** for signing.
8. **Ask** if anything else is needed.
9. **Leave** quickly and politely. Never stare around the room.

## Safety and professionalism
Stay near the door, keep the door open while you're inside, and never go in if something feels wrong: call your supervisor.

## Clearing
Tell the guest how trays will be collected. Pick up trays from corridors quickly, and log them.

## Feedback
Follow up by phone: "How was your meal?"`,
        `## Activity 1: Room Service Procedure Practice
Individually demonstrate delivering a meal to a guest room, ensuring proper presentation and etiquette.

## Activity 2: Room Service Role Play
In groups, simulate full in-room dining service, from order taking to delivery and guest feedback.`,
        [
          "What must you repeat when taking a room service order?",
          "What do you do on arriving at the guest's door?",
          "Why must trays be cleared from corridors quickly?",
        ],
      ),
      tleLesson(
        "Basic Coffee Knowledge",
        "Where coffee comes from, the kinds of beans, and brewing basics.",
        "5CQ7_6ChowU",
        `## A short history
Coffee is thought to have come from **Ethiopia**. It spread through Arabia and Yemen, then Europe and the world. In the Philippines, coffee was grown in **Lipa, Batangas** in the 1700s, and our country was once a leading exporter.

## From plant to cup
Planting → Harvesting cherries → Processing → Drying → Roasting → Grinding → Brewing

## Four kinds of beans
| Species | Taste | Notes |
|---|---|---|
| **Arabica** | Smooth, sweet | Grown at high elevations |
| **Robusta** | Strong, bitter | More caffeine |
| **Liberica** | Bold, smoky | Known locally as *kapeng barako* |
| **Excelsa** | Tart, fruity | Grown in small amounts |

The Philippines is one of few countries that grow all four.

## Roasts
- **Light** — bright and fruity
- **Medium** — balanced
- **Dark** — bold and smoky

## Brewing basics
Good coffee needs: fresh beans, the right **grind**, the right **ratio** (a common start is 1 g coffee to 15–17 g water), clean water, and a temperature of about **90–96 °C**.

## Philippine coffee regions
Benguet, Sagada, Batangas, Cavite, Bukidnon, Sultan Kudarat and Mt. Apo in Davao.`,
        `## Activity 1: Coffee Knowledge Report
Research and write about coffee history, types of beans and brewing basics.

## Activity 2: Coffee Presentation
Present findings on coffee types, origins and brewing methods to classmates.`,
        [
          "Name the four kinds of coffee beans.",
          "What is kapeng barako?",
          "What water temperature is best for brewing?",
        ],
      ),
      tleLesson(
        "Career Opportunities Related to Coffee",
        "The people between the coffee farm and the cup.",
        "zNn0UjnvP_s",
        `## Careers in coffee
| Career | Work | Skills |
|---|---|---|
| **Barista** | Prepares and serves coffee | Speed, skill, customer care |
| **Head barista** | Trains staff, keeps quality | Leadership |
| **Café manager** | Runs the shop | Business, people skills |
| **Coffee farmer** | Grows coffee | Crop care |
| **Roaster** | Roasts beans | Attention, taste, timing |
| **Q Grader** | Tastes and grades coffee | Trained taste, certification |
| **Green coffee buyer** | Buys beans from farms | Negotiation |
| **Coffee trainer** | Teaches baristas | Communication |
| **Equipment technician** | Repairs machines | Technical skills |
| **Café owner** | Owns the business | Finance, marketing |

## Qualifications
- **TESDA Barista NC II** is a recognized Philippine certificate.
- The **Specialty Coffee Association (SCA)** offers courses.
- Experience counts for a lot.

## Skills every coffee worker needs
Attention to detail, cleanliness, teamwork, and a love of learning.

## Business paths
A coffee cart, a small café, roasting and selling local beans, or catering events. Working with local farmers also supports communities.

## Competitions
Baristas can compete, for example in the **Philippine National Barista Championship**, and move on to international events.`,
        `## Activity 1: Career Research
Identify at least 5 coffee-related careers, and describe the required skills and qualifications.

## Activity 2: Career Panel Simulation
Role-play a career panel discussing opportunities in the coffee industry.`,
        [
          "Give five coffee-related careers.",
          "What does a Q Grader do?",
          "Which TESDA certificate is for baristas?",
        ],
      ),
      tleLesson(
        "Barista Tools, Cleaning and Maintenance",
        "Using and caring for the bar's equipment.",
        "5LEd0XoFVRg",
        `## Main equipment
- **Espresso machine** — forces hot water through ground coffee
- **Grinder** — grinds beans fresh
- **Portafilter** — the handle and basket that hold coffee
- **Tamper** — presses ground coffee evenly
- **Milk pitcher** — for steaming milk
- **Knock box** — holds used coffee pucks
- **Scale** and **timer** — measure each shot
- **Thermometer** — checks milk temperature

## Daily cleaning
- **Purge and wipe the steam wand** after every use
- **Flush the group head** between shots
- **Rinse the portafilter**
- **Backflush** at day's end: use a blind basket with water or cleaner, then rinse
- **Clean the grinder hopper and chute**
- **Wipe the drip tray and counter**
- **Sanitize** all bar tools

## Weekly and monthly
Soak portafilters and baskets. Check and replace worn gaskets, as your machine's manual says. Change the water filter, and descale when needed.

## Safety
Steam and water are very hot. Keep your hands away from the wand and group head, and turn off and unplug equipment before cleaning inside. Keep cords away from water.

## Why it matters
Old coffee oils taste bitter and sour. A clean machine makes good coffee and lasts longer.`,
        `## Activity 1: Barista Tools Practice
Demonstrate proper use and cleaning of espresso machines, grinders and accessories.

## Activity 2: Maintenance Schedule Simulation
In groups, prepare and demonstrate a routine maintenance schedule for barista equipment.

## 2nd Term Performance Tasks
**Individual: Barista Equipment Care Checklist.** Select **three barista tools or equipment** (for example grinder, espresso machine, milk frother, tampers). Demonstrate and document the **proper use**, **cleaning steps** and **basic maintenance** for each item.

**Group: Bar Station Cleaning Demonstration.** As a group, conduct a **bar station cleaning and maintenance demo**. Show correct procedures such as:
- Purging and wiping the steam wand
- Backflushing the espresso machine
- Cleaning the grinder hopper and chute
- Sanitizing all bar tools`,
        [
          "What is a tamper for?",
          "What must you do to a steam wand after every use?",
          "What is backflushing?",
        ],
      ),
    ],
    quiz: [
      q(
        "What should you do at the end of a reservation call?",
        [
          "Repeat the details and thank the guest",
          "Hang up at once",
          "Ask for a tip",
          "Cancel it",
        ],
        0,
        "Repeating prevents mistakes.",
      ),
      q(
        "Forks are placed…",
        [
          "To the left of the plate",
          "To the right of the plate",
          "On top of the plate",
          "Inside the glass",
        ],
        0,
        "Forks go on the left, and knives on the right.",
      ),
      q(
        "A server should serve alcohol to…",
        [
          "Adults only, never minors",
          "Anyone who pays",
          "Anyone with a friend",
          "Minors with snacks",
        ],
        0,
        "Selling or serving alcohol to minors is prohibited.",
      ),
      q(
        "Kapeng barako comes from which species?",
        ["Liberica", "Arabica", "Robusta", "Excelsa"],
        0,
        "Barako is the local name for Liberica coffee.",
      ),
      q(
        "After steaming milk, you should…",
        [
          "Purge and wipe the wand",
          "Leave it until closing",
          "Cover it with a towel",
          "Dip it in coffee",
        ],
        0,
        "Milk dries quickly inside the wand and spoils.",
      ),
    ],
    bank: [
      q(
        "What is a no-show?",
        [
          "A guest who doesn't arrive",
          "A closed restaurant",
          "A menu with no pictures",
          "An empty tray",
        ],
        0,
        "No-shows book tables but never come.",
      ),
      q(
        "Beverages are usually served from the guest's…",
        ["Right", "Left", "Back", "Front"],
        0,
        "Beverages go from the right, close to the glasses.",
      ),
      q(
        "Beer and wine are…",
        ["Fermented", "Distilled", "Non-alcoholic", "Brewed coffee"],
        0,
        "Beer and wine are made by fermentation.",
      ),
      q(
        "At a guest's door, room service staff should first…",
        [
          "Knock and announce themselves",
          "Open the door with a key",
          "Leave the tray outside",
          "Call the manager",
        ],
        0,
        "Staff knock, announce and wait for the guest.",
      ),
      q(
        "Which TESDA certificate is for coffee preparation?",
        ["Barista NC II", "Caregiving NC II", "Masonry NC I", "Welding NC II"],
        0,
        "TESDA offers a Barista NC II qualification.",
      ),
    ],
  },
  // 3rd Term
  {
    title: "Preparing Beverages and Cashiering",
    description:
      "Calibrating espresso, brewing, operating machines, coffee and non-coffee beverages, cashiering, control and beverage costing.",
    lessons: [
      tleLesson(
        "Calibrating Espresso and the Grinder",
        "Dialing in for a balanced shot.",
        "GuLo16kO0Ok",
        `## What is calibration?
**Calibration**, or **dialing in**, means adjusting the grinder and recipe until a shot tastes right. Baristas do it every day, since beans, humidity and temperature change.

## The three numbers
- **Dose** — the ground coffee going in, often about **18 g**
- **Yield** — the liquid coming out, often about **36 g**
- **Time** — often about **25–30 seconds**

A common starting ratio is **1 : 2**.

## Grind size
| Problem | Cause | Fix |
|---|---|---|
| Too fast (under 20 s), sour | Grind too coarse | Grind **finer** |
| Too slow (over 35 s), bitter | Grind too fine | Grind **coarser** |
| Uneven flow | Poor tamping or distribution | Level and tamp evenly |

## Steps
1. **Set the dose**, and weigh it.
2. **Distribute** and **tamp** evenly.
3. **Pull the shot**, timing it.
4. **Weigh the yield.**
5. **Taste it.**
6. **Adjust one thing at a time.**
7. **Record** your settings.

## Tasting
- **Sour** — under-extracted
- **Bitter** — over-extracted
- **Balanced** — sweet, with pleasant flavor

Purge some grounds after changing the grind, so that you test the new setting.`,
        `## Activity 1: Espresso Calibration Practice
Individually calibrate an espresso machine, and adjust grind settings to achieve optimal extraction.

## Activity 2: Group Calibration Exercise
Work in groups to calibrate multiple espresso machines, and compare results.

If your school has no espresso machine, use the lesson's chart to solve sample calibration problems.`,
        [
          "What are dose, yield and time?",
          "A shot runs in 15 seconds and tastes sour. What do you do?",
          "Why change only one thing at a time?",
        ],
      ),
      tleLesson(
        "Brewing Methods",
        "Different equipment, different cups.",
        "vQVTNscQY0c",
        `## Four things that affect brewing
Grind size, water temperature, brew time and the coffee-to-water ratio.

## Common methods
| Method | Grind | Time | Result |
|---|---|---|---|
| **Drip machine** | Medium | 4–6 min | Clean and simple |
| **French press** | Coarse | About 4 min | Full-bodied |
| **Pour over** | Medium-fine | 3–4 min | Clean and bright |
| **Moka pot** | Fine | About 5 min | Strong |
| **AeroPress** | Medium-fine | 1–2 min | Smooth and quick |
| **Cold brew** | Coarse | 12–18 hours | Smooth, low acid |
| **Espresso** | Very fine | 25–30 s | Strong, with crema |

## French press steps
1. Add coarse coffee.
2. Pour hot water, about 15 g for each gram of coffee.
3. Stir, and cover.
4. Wait about **4 minutes**.
5. Press the plunger down slowly.
6. Serve right away.

## Pour over steps
1. Rinse the paper filter.
2. Add coffee.
3. Pour a little water, and wait 30 seconds: this is the **bloom**.
4. Pour slowly in circles.

## Traditional
**Kapeng barako** is often boiled and strained, in the Filipino way.

Hot water and glass can injure, so handle them with care.`,
        `## Activity 1: Brewing Practice
Demonstrate at least 2 brewing methods (for example drip, French press) individually.

## Activity 2: Group Brewing Workshop
Prepare and present beverages using multiple brewing methods to the class.`,
        [
          "Which grind suits a French press?",
          "What is the bloom?",
          "What four things affect brewing?",
        ],
      ),
      tleLesson(
        "Operating Espresso Machines",
        "Pulling a consistent shot.",
        "A5eCDRBu5yI",
        `## Parts of the machine
- **Boiler** — heats the water
- **Group head** — where the portafilter locks in
- **Steam wand** — heats and foams milk
- **Hot water tap**
- **Pressure gauge** — espresso is brewed at about **9 bars**
- **Drip tray**

## Starting up
1. Turn on the machine, and let it warm up, usually 15–30 minutes.
2. Check the water supply and the pressure gauge.
3. Flush the group head.
4. Warm the cups.

## Pulling a shot
1. **Remove and wipe** the portafilter.
2. **Grind and dose.**
3. **Distribute** the grounds.
4. **Tamp** firmly and evenly.
5. **Flush** the group head for a moment.
6. **Lock in** the portafilter.
7. **Start the shot** right away, with the cup in place.
8. **Stop** at your target yield.
9. **Serve** at once. A good shot has **crema**, a golden foam on top.
10. **Knock out** the puck, rinse and return the portafilter.

## Consistency
Use the same dose, tamp and yield each time, and write down the recipe.

## Safety
The group head and wand are very hot. Never remove a portafilter while the shot is running, because hot water can spray.`,
        `## Activity 1: Espresso Machine Operation
Operate an espresso machine to produce a consistent shot of espresso.

## Activity 2: Espresso Team Demonstration
In groups, prepare a set of espresso shots and latte beverages following standard procedures.`,
        [
          "What pressure is espresso usually brewed at?",
          "What is crema?",
          "Why should you never remove a running portafilter?",
        ],
      ),
      tleLesson(
        "Applying the Process in Preparing Coffee",
        "Following standard recipes from order to cup.",
        "SSE-3sPJsOM",
        `## Standard recipes
A **standard recipe** states the ingredients, amounts and steps. It gives **every customer the same quality**, and it controls cost.

## Workflow behind the bar
1. **Take the order**, and write it on the cup.
2. **Grind and pull** the shot.
3. **Steam milk** while the shot runs, if you're able.
4. **Combine and finish.**
5. **Check** the drink.
6. **Call the name**, and serve with a smile.
7. **Clean** as you go.

## Sample recipes
| Drink | Espresso | Other |
|---|---|---|
| Espresso | 1 shot | — |
| Americano | 1 shot | Hot water, about 120 ml |
| Iced Americano | 2 shots | Cold water and ice |
| Iced coffee | 2 shots | Milk, syrup, ice |

## Good practices
- Warm your cups for hot drinks.
- Pre-chill glasses for iced drinks.
- Add **ice last** for iced drinks, or follow your recipe.
- Keep your bar **organized** and clean.
- Serve espresso quickly, because crema fades.

## A small coffee menu
List drink names, sizes, prices and a short description. Keep it simple, and include drinks that use similar ingredients, so that your stock stays manageable.`,
        `## Activity 1: Coffee Preparation Practice
Prepare individual coffee beverages following standard recipes.

## Activity 2: Coffee Menu Creation
As a group, design a small coffee menu, including preparation processes for each beverage.`,
        [
          "Why use a standard recipe?",
          "What is an Americano?",
          "List the workflow behind the bar.",
        ],
      ),
      tleLesson(
        "Preparing Coffee-Based Beverages",
        "Steaming milk, and making lattes, cappuccinos and mochas.",
        "05sBmuZTFyA",
        `## Steaming milk
1. Fill a cold pitcher with cold milk, up to the bottom of the spout.
2. **Purge** the wand.
3. Put the tip just **under the surface**.
4. **Stretch**: open the steam, and let in a little air, with a soft hissing sound.
5. **Texture**: lower the tip slightly, and spin the milk in a whirlpool.
6. Stop at **55–65 °C**, when the pitcher is hot to touch. Overheated milk tastes burnt.
7. **Wipe and purge** the wand.
8. **Tap and swirl** the pitcher, so that the milk looks glossy.

## Classic drinks
| Drink | Build |
|---|---|
| **Caffè latte** | Espresso, plenty of steamed milk, thin foam |
| **Cappuccino** | Espresso, steamed milk, thick foam, about equal parts |
| **Flat white** | Double espresso, thin silky milk |
| **Caffè mocha** | Espresso, chocolate, steamed milk |
| **Macchiato** | Espresso with a spoon of foam |
| **Caramel latte** | Latte with caramel syrup |

## Latte art
Pour high at first, then bring the pitcher closer to the cup so that the foam forms a heart or rosetta.

## Presentation
Wipe the rim, serve on a saucer, and turn the handle toward the guest.

## Safety
Hot milk and steam burn. Check allergies: some guests can't drink dairy, and you can offer other milks.`,
        `## Activity 1: Beverage Practice
Prepare at least 3 types of coffee-based beverages individually (for example latte, cappuccino, mocha).

## Activity 2: Beverage Service Simulation
In groups, prepare and serve coffee-based beverages for a mock café setup.`,
        [
          "At what temperature should you stop steaming milk?",
          "How does a latte differ from a cappuccino?",
          "What goes in a mocha?",
        ],
      ),
      tleLesson(
        "Preparing Non-Coffee Beverages",
        "Teas, chocolates, smoothies and mocktails.",
        "_s3limpgCTA",
        `## Tea
| Tea | Water | Time |
|---|---|---|
| Green | About 80 °C | 2–3 min |
| Black | Just off the boil | 3–5 min |
| Herbal, such as salabat | Boiling | 5–7 min |

Over-steeping makes tea bitter.

## Hot chocolate
Filipino **tsokolate** uses **tablea** melted in hot water or milk, then whisked with a *batirol* until frothy.

## Smoothies and shakes
- **Smoothie** — fruit, ice, and milk or yogurt
- **Fruit shake** — fruit, ice and syrup, such as mango shake

Blend until smooth, and serve in a chilled glass.

## Milk tea
Brew strong tea, cool it, then add milk, sugar and ice. Tapioca pearls are cooked separately.

## Mocktails
A **mocktail** is a mixed drink with no alcohol. It balances **sweet, sour and bubbly**.

*Calamansi Cooler:* 30 ml calamansi juice, 30 ml syrup, soda water, ice, mint.

## Techniques
- **Build** — pour straight into the glass
- **Shake** — shake with ice, and strain
- **Blend** — mix in a blender
- **Muddle** — crush mint or fruit

## Garnishes
Fruit slices, mint, sugar rims. Keep them fresh and clean.

Use clean ice, and handle it with a scoop, never with your hands or a glass.`,
        `## Activity 1: Non-Coffee Beverage Practice
Individually prepare at least 3 non-coffee beverages (for example tea, smoothies, mocktails).

## Activity 2: Beverage Presentation
In groups, prepare and present a range of non-coffee beverages for service.`,
        [
          "What makes tea bitter?",
          "What is a mocktail?",
          "Name four techniques for mixing drinks.",
        ],
      ),
      tleLesson(
        "Basic Cashiering, Control Procedures and Beverage Costing",
        "Handling money, keeping records and pricing drinks.",
        "LuSPpZcnsww",
        `## Basic cashiering
1. **Count** the opening fund at the start of the shift.
2. **Enter** the order in the POS.
3. **State the total** to the customer.
4. **Receive** the payment, and say the amount aloud.
5. **Count the change** back to the customer.
6. **Issue the receipt.**
7. **Thank** the customer.

## Payments
Cash, debit and credit cards, and e-wallets such as GCash and Maya.

**Discounts:** senior citizens and persons with disabilities are entitled to a **20% discount** on certain purchases, on presenting a valid ID.

## General control procedures
- **One cashier per drawer**
- **Void** only with a supervisor's approval
- **Check POS entries** against orders
- **Verify totals** at the end of a shift
- **Record** cash shorts and overs
- **Keep** all receipts

**End-of-shift:** cash in drawer should equal opening fund + cash sales.

## Beverage costing
**Cost per serving** = the total of each ingredient's cost.

| Iced coffee | Cost |
|---|---|
| Coffee | ₱15 |
| Milk | ₱10 |
| Syrup | ₱5 |
| Ice | ₱2 |
| Cup and straw | ₱6 |
| **Total** | **₱38** |

- **With 150% markup:** ₱38 + ₱57 = **₱95**
- **Beverage cost percent:** ₱38 ÷ ₱95 × 100 = **40%**
- **Gross profit per cup:** ₱95 − ₱38 = **₱57**

Portion control keeps these numbers true, so measure every ingredient.`,
        `## Activity 1: Cashiering Simulation
Perform individual cash handling, billing and basic financial control for a mock café.

## Activity 2: Group Beverage Costing Exercise
Calculate beverage costs, pricing and profitability as a group for a small food and beverage outlet.

## 3rd Term Performance Tasks
**Individual: Beverage Costing Sheet.** Choose **one beverage recipe** (for example iced coffee, lemonade, milk tea). Compute the **cost per serving** by listing ingredients, quantities, unit cost and total cost. Determine the **selling price** using a standard markup.

**Group: Cashiering and Control Simulation.** As a group, conduct a **simulated cashiering activity**. Each member rotates roles: cashier, customer or control checker. Demonstrate:
- Order-taking
- Issuing receipts
- Handling cash and change
- Recording sales
- Following basic control procedures (checking POS entries, verifying totals)`,
        [
          "What should the cash in the drawer equal at the end of a shift?",
          "A drink costs ₱30 and sells for ₱100. What is the beverage cost percent?",
          "Who may approve a void?",
        ],
      ),
    ],
    quiz: [
      q(
        "A shot runs too fast and tastes sour. You should…",
        [
          "Grind finer",
          "Grind coarser",
          "Use less coffee and water",
          "Add sugar",
        ],
        0,
        "A finer grind slows the water and extracts more.",
      ),
      q(
        "Which grind is used for a French press?",
        ["Coarse", "Very fine", "Powder", "Whole beans"],
        0,
        "Coarse grounds stay out of the cup and steep well.",
      ),
      q(
        "A good espresso has a golden foam on top called…",
        ["Crema", "Bloom", "Syrup", "Puck"],
        0,
        "Crema is a sign of a fresh, well-made shot.",
      ),
      q(
        "A drink with no alcohol is a…",
        ["Mocktail", "Cocktail", "Liqueur", "Spirit"],
        0,
        "A mocktail is a mixed drink without alcohol.",
      ),
      q(
        "A drink costs ₱25 and sells for ₱100. The beverage cost percent is…",
        ["25%", "40%", "50%", "75%"],
        0,
        "₱25 ÷ ₱100 × 100 = 25%.",
      ),
    ],
    bank: [
      q(
        "A common espresso ratio of coffee to liquid is…",
        ["1 : 2", "1 : 15", "2 : 1", "1 : 100"],
        0,
        "About 18 g in and 36 g out.",
      ),
      q(
        "Coffee brewed in cold water for many hours is…",
        ["Cold brew", "Espresso", "Moka", "Americano"],
        0,
        "Cold brew steeps for about 12 to 18 hours.",
      ),
      q(
        "Which has the most foam?",
        ["Cappuccino", "Latte", "Flat white", "Americano"],
        0,
        "A cappuccino has a thick layer of foam.",
      ),
      q(
        "Milk should be steamed to about…",
        ["55–65 °C", "20–30 °C", "90–100 °C", "120 °C"],
        0,
        "Hotter than this, milk tastes burnt.",
      ),
      q(
        "A void in the POS needs…",
        [
          "A supervisor's approval",
          "A customer's signature only",
          "No approval at all",
          "A new menu",
        ],
        0,
        "Voids are controlled to prevent mistakes and theft.",
      ),
    ],
  },
];

export const foodAndBeverageOperation11: DemoSubject = {
  key: "TLE11-FBO",
  code: "TLE 11-FBO",
  name: "Food and Beverage Operation 11",
  department: TLE_DEPARTMENT,
  description:
    "Restaurant, in-room and beverage service, barista skills and cashiering — the Grade 11 Technical-Professional elective in Hospitality and Tourism.",
  colorToken: "orange",
  units: UNITS,
};
