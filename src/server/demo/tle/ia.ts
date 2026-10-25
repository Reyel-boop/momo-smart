/**
 * TLE 8 – Industrial Arts, following the Third Term of DepEd's Grade 8 TLE
 * (AFA / FCS / IA) Three-Term Budget of Work (updated April 7, 2026):
 * construction, electrical, electronics, and automotive and small engine
 * services — one unit per week or block of weeks (1, 2, 3, 4, 5, 6–9, 10),
 * one lesson per learning competency. Each lesson has a lecture video, a
 * written lecture, activities and a self-check; every unit has five Unit
 * Questions.
 */
import type { DemoLesson, DemoSubject, DemoUnit } from "../grade10";
import { q, TLE_DEPARTMENT } from "./common";

/**
 * The lecture video for each lesson (YouTube id). Each was checked to exist
 * and allow embedding, and chosen for covering the lesson’s topic.
 */
export const IA_VIDEOS: Record<string, string> = {
  "Signs and Symbols in Industrial Arts Services": "4i5jSMMkt6c", // Working Drawings and Signs and Symbols — eFiles2GO
  "Types of Manuals": "gE5GftFaGLg", // Manuals: Meaning, Types, Purposes & Structure — learnwithskt
  "Consumables in Industrial Arts Services": "EyaePIccrlA", // Common Materials in Construction, Electrical and Automotive Works — Teacher Aisa
  "Component Parts in Industrial Arts Services": "60v3Ni9HpPU", // Home Electrical System — eFiles2GO
  "Simple Diagnostics": "8Eq_H_NVnlg", // Diagnostic and troubleshooting in electrical and electronics — eFiles2GO
  "Performing Simple Troubleshooting": "IX2oXSqmvkk", // Testing Appliance Cord With a Meter — abrelectric
  "Repair Service Cost": "dEhabmW1oB8", // How to Calculate Labor Costs — Scoop School
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
  lecture: { videoId: IA_VIDEOS[title] ?? "", lecture },
});

const UNITS: DemoUnit[] = [
  // Week 1
  {
    title: "Signs and Symbols",
    description:
      "Signs and symbols in construction, electrical, electronics, and automotive and small engine services.",
    lessons: [
      lesson(
        "Signs and Symbols in Industrial Arts Services",
        "The pictures and marks that workers read on plans and machines.",
        `## Why signs and symbols?
Plans, diagrams and machines use **symbols** so workers everywhere understand them quickly — a symbol replaces many words.

## Safety signs (all services)
- **Red** — **prohibition** and fire equipment ("No smoking", fire extinguisher)
- **Yellow** — **caution / warning** ("High voltage", "Wet floor")
- **Blue** — **mandatory** actions ("Wear safety goggles", "Wear hard hat")
- **Green** — **safe condition** (exit, first aid)

## Construction services
On a **floor plan** (a top view of a building): walls (thick lines), **doors** (a line with a quarter-circle swing), **windows** (thin parallel lines in the wall), stairs (steps with an arrow), and **plumbing fixtures** — lavatory, water closet (toilet), shower, kitchen sink, floor drain. Dimensions are shown in meters or millimeters.

## Electrical services
On an **electrical plan**: **convenience outlet** (a circle with two lines), **switch** (S), **lighting outlet** (a circle with an X or a dot), **panelboard**, **ground**, and lines for **wires** (home runs to the panel).

## Electronics services
In **schematic diagrams**: **resistor** (zigzag), **capacitor** (two parallel lines), **diode** (triangle with a bar), **LED** (diode with arrows), **transistor**, **battery** (long and short lines), **switch**, **ground**, and **speaker**.

## Automotive and small engine services
**Dashboard warning lights**: **check engine**, **oil pressure** (oil can), **battery/charging**, **engine temperature** (thermometer), **brake** (circle with "!"), **seatbelt**, **low fuel**. Red lights mean stop safely and check now; yellow/amber means check soon.

## Key points
Learn the symbols of each service — reading them correctly prevents mistakes and accidents.`,
        "Make a symbol chart with four columns (construction, electrical, electronics, automotive). Draw at least five symbols in each with their meaning.",
        [
          "What does a blue safety sign mean?",
          "Draw the electronic symbol for a resistor and a battery.",
          "What should a driver do when the red oil-pressure light comes on?",
        ],
      ),
    ],
    quiz: [
      q(
        "A RED safety sign usually means…",
        [
          "safe condition",
          "prohibition or fire equipment",
          "mandatory action",
          "caution",
        ],
        1,
        "Red is for prohibitions (No smoking) and fire equipment.",
      ),
      q(
        "In a schematic diagram, a zigzag line stands for a…",
        ["capacitor", "resistor", "diode", "battery"],
        1,
        "The zigzag is the symbol for a resistor.",
      ),
      q(
        "On an electrical plan, the letter S stands for a…",
        ["socket", "switch", "speaker", "spark plug"],
        1,
        "S marks a switch on electrical plans.",
      ),
      q(
        "On a floor plan, a line with a quarter-circle shows a…",
        ["window", "door and its swing", "stair", "sink"],
        1,
        "The arc shows which way the door swings.",
      ),
      q(
        "A dashboard light shaped like a thermometer warns about…",
        ["low fuel", "engine temperature", "seatbelt", "headlights"],
        1,
        "The thermometer symbol is the engine temperature (overheating) warning.",
      ),
    ],
  },
  // Week 2
  {
    title: "Manuals",
    description: "The types of manuals used in industrial arts services.",
    lessons: [
      lesson(
        "Types of Manuals",
        "Reading the right guide for the job.",
        `## What is a manual?
A **manual** is a book or document from the **manufacturer** (or the company) that explains how to use, install, maintain or repair a product, step by step, with diagrams and warnings.

## Types of manuals
- **Owner's / user manual** — how to **use** the product safely; basic care; comes with appliances, gadgets and vehicles
- **Operator's manual** — how to **operate** machines and equipment (generators, tractors, power tools)
- **Installation manual** — how to **install or set up** (an air-conditioner, a water heater, a ceiling fan)
- **Service / repair manual (workshop manual)** — for **technicians**: specifications, diagnosis, disassembly and repair procedures
- **Maintenance manual** — schedules of **regular maintenance** (oil change every so many kilometers, cleaning filters)
- **Parts manual / catalogue** — exploded diagrams with **part numbers** for ordering replacements
- **Troubleshooting guide** — a table of **problems, possible causes and remedies**
- **Safety Data Sheet (SDS)** — hazards and safe handling of **chemicals** (paint thinner, solvents, refrigerants)

## Parts of a manual
Table of contents, safety warnings, specifications, diagrams, step-by-step procedures, troubleshooting chart, warranty information.

## Why use manuals?
To work **safely**, follow the **correct procedure**, use the **right parts and specifications**, avoid damage, and keep the **warranty** valid.

## Key points
Read the manual before you use, install or repair — the right manual gives the right procedure.`,
        "Bring or find (online) a manual of an appliance or tool at home. Identify its type, list its parts, and explain one procedure or safety warning in it.",
        [
          "What is the difference between an owner's manual and a service manual?",
          "What does a parts manual contain?",
          "Why should a technician follow the manual?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which manual is written for technicians who repair equipment?",
        [
          "Owner's manual",
          "Service / repair manual",
          "Sales brochure",
          "Warranty card",
        ],
        1,
        "Service manuals give technicians diagnosis and repair procedures.",
      ),
      q(
        "Exploded diagrams with part numbers are found in a…",
        ["parts manual", "user manual", "SDS", "installation manual"],
        0,
        "Parts manuals help identify and order the correct replacement parts.",
      ),
      q(
        "A document about the hazards of a chemical like paint thinner is the…",
        [
          "owner's manual",
          "Safety Data Sheet (SDS)",
          "parts catalogue",
          "receipt",
        ],
        1,
        "The SDS explains a chemical's hazards and safe handling.",
      ),
      q(
        "A table of problems, causes and remedies is a…",
        ["troubleshooting guide", "warranty", "floor plan", "parts list"],
        0,
        "Troubleshooting guides match symptoms to likely causes and fixes.",
      ),
      q(
        "Which manual tells how to set up a new air-conditioner?",
        ["Installation manual", "Parts catalogue", "SDS", "Maintenance log"],
        0,
        "Installation manuals explain how to install and set up equipment.",
      ),
    ],
  },
  // Week 3
  {
    title: "Consumables",
    description: "The consumables used in industrial arts services.",
    lessons: [
      lesson(
        "Consumables in Industrial Arts Services",
        "Materials that are used up in the work.",
        `## What are consumables?
**Consumables** are materials that are **used up** or need **regular replacement** during work — unlike **tools**, which are used again and again.

## Construction services
- **Nails, screws, bolts**, **wood glue**, **sandpaper**
- **Cement, sand, gravel**, **hollow blocks**
- **Paint, primer, thinner**, **putty**, **masking tape**
- **Welding rods** (electrodes), **cutting discs**

## Electrical services
- **Electrical tape**, **wire connectors (wire nuts)**, **cable ties**
- **Electrical wires** for connections, **fuses**
- **Staples / wire clips** for securing cables

## Electronics services
- **Solder** (tin-lead or lead-free) and **soldering flux**
- **Desoldering wick (braid)**
- **Heat-shrink tubing**
- **Isopropyl alcohol** for cleaning circuit boards

## Automotive and small engine services
- **Engine oil**, **grease**, **coolant**, **brake fluid**, **transmission fluid**
- **Filters** — oil, air and fuel filters
- **Spark plugs**, **fuses**, **wiper blades**, **gaskets**
- **Fuel** (gasoline, diesel)

## Using consumables wisely
Use the **right type and specification** (check the manual), measure to avoid waste, store them properly (paint and fluids sealed and away from heat), keep an **inventory**, and dispose of used oil and chemicals **properly** — never pour them into the ground or drains.

## Key points
Consumables are used up and replaced — choose the right ones, use them carefully and dispose of them safely.`,
        "List the consumables used in one task (for example painting a wall, splicing a wire, soldering a circuit, or changing engine oil), with the quantity and estimated cost of each.",
        [
          "What is the difference between a tool and a consumable?",
          "Give two consumables each for electronics and automotive services.",
          "How should used engine oil be disposed of?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which is a CONSUMABLE?",
        ["Hammer", "Electrical tape", "Pliers", "Multimeter"],
        1,
        "Electrical tape is used up; the others are reusable tools.",
      ),
      q(
        "Which consumable is used to join wires on a circuit board?",
        ["Solder", "Cement", "Grease", "Sandpaper"],
        0,
        "Solder melts to join components and wires electrically.",
      ),
      q(
        "Which is an automotive consumable?",
        ["Engine oil", "Screwdriver", "Jack", "Wrench"],
        0,
        "Engine oil is replaced regularly; the others are tools.",
      ),
      q(
        "Used engine oil should be…",
        [
          "poured into the canal",
          "collected and brought to a proper disposal or recycling site",
          "burned in the yard",
          "poured on plants",
        ],
        1,
        "Used oil pollutes soil and water and must be disposed of properly.",
      ),
      q(
        "Welding rods are consumables used in…",
        ["electronics", "construction / metal works", "beauty care", "cooking"],
        1,
        "Welding electrodes melt during welding in construction and metal work.",
      ),
    ],
  },
  // Week 4
  {
    title: "Component Parts",
    description: "The component parts in industrial arts services.",
    lessons: [
      lesson(
        "Component Parts in Industrial Arts Services",
        "The main parts of systems and equipment workers service.",
        `## Construction — parts of a house
**Foundation** (footings), **columns and beams**, **walls** (hollow blocks or wood), **floor**, **roof** (trusses, purlins, roofing sheets), **doors and windows**, **plumbing** (pipes, faucets, traps), **ceiling**.

## Electrical — the home electrical system
- **Service entrance** — wires from the utility (Meralco or the local cooperative)
- **kWh meter** — measures electricity used
- **Panelboard** with **circuit breakers** (or fuses) — protects each circuit
- **Branch circuits** — wires to different parts of the house
- **Convenience outlets**, **switches**, **lighting fixtures**
- **Grounding** — for safety
Parts of an **appliance**: plug, cord, switch, fuse, motor or heating element, thermostat.

## Electronics
**Power supply**, **circuit board (PCB)**, **resistors**, **capacitors**, **diodes**, **transistors**, **integrated circuits (ICs)**, **speakers**, **switches**, **connectors**.

## Automotive and small engine
- **Engine** — cylinder, **piston**, crankshaft, **valves**, **spark plug** (gasoline), **carburetor** or fuel injector
- **Fuel system** — tank, fuel line, filter
- **Ignition / electrical** — **battery**, ignition coil, alternator, starter
- **Cooling** — radiator, water pump, coolant
- **Lubrication** — oil pump, oil filter
- **Drive train** — clutch, transmission, chain or shaft
- **Brakes** and **tires**

## Why know the parts?
You can only diagnose and repair what you can **identify** — knowing each part and its job tells you where to look when something fails.

## Key points
Every system is made of parts with specific jobs — learn them to understand how the whole works.`,
        "Choose one system (a house's electrical system, an electric fan, a radio, or a motorcycle engine). Draw it and label at least eight parts with their functions.",
        [
          "What does the circuit breaker in a panelboard do?",
          "Name four parts of a small gasoline engine.",
          "Why must technicians know the component parts of what they repair?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which part measures how much electricity a house uses?",
        ["Panelboard", "kWh meter", "Switch", "Outlet"],
        1,
        "The kilowatt-hour meter measures energy consumption.",
      ),
      q(
        "What protects each branch circuit from overload?",
        ["Circuit breaker", "Light bulb", "Wall", "Spark plug"],
        0,
        "Circuit breakers trip to cut power when a circuit is overloaded or shorted.",
      ),
      q(
        "In a gasoline engine, which part ignites the fuel?",
        ["Radiator", "Spark plug", "Oil filter", "Tire"],
        1,
        "The spark plug creates the spark that ignites the fuel-air mixture.",
      ),
      q(
        "Which part keeps the engine from overheating?",
        ["Radiator", "Battery", "Carburetor", "Clutch"],
        0,
        "The radiator cools the engine coolant.",
      ),
      q(
        "Which is an electronic component?",
        ["Capacitor", "Purlin", "Footing", "Faucet"],
        0,
        "Capacitors store electric charge in electronic circuits.",
      ),
    ],
  },
  // Week 5
  {
    title: "Simple Diagnostics",
    description: "Simple diagnostics in industrial arts services.",
    lessons: [
      lesson(
        "Simple Diagnostics",
        "Finding out what is wrong before fixing it.",
        `## What is diagnosis?
**Diagnosis** is finding the **cause** of a problem by observing, asking and testing — like a doctor examining a patient before giving medicine.

## Use your senses
- **Look** — burnt parts, loose wires, leaks, cracks, broken parts
- **Listen** — unusual noises (grinding, knocking, buzzing)
- **Smell** — burning insulation, fuel leaks, overheating
- **Feel** (carefully, with power off) — too hot, loose, vibrating

## Ask questions
When did it start? What happened before? Does it fail all the time or only sometimes? Has it been repaired before?

## Diagnostic tools
- **Test light** and **voltage tester** — is there power?
- **Multimeter** — measures **voltage**, **current**, **resistance** and **continuity**
- **Tire pressure gauge**, **spark plug tester** — automotive
- **Level**, **tape measure**, **moisture meter** — construction

## Simple diagnostic approach
- **Check the simplest causes first** — is it plugged in? Is the switch on? Is the fuse or breaker OK? Is there fuel?
- **Compare** with the normal condition (the manual's specifications)
- **Isolate** — test one section at a time to narrow down the problem
- **Record** what you find

## Examples
- A lamp doesn't light → check the bulb, the switch, the plug and cord, the outlet
- A motorcycle won't start → check fuel, spark plug, battery, kill switch
- A wall has water stains → check the roof, gutters and pipes above it

## Safety
**Unplug** or switch off power before touching parts; let engines cool; wear PPE; never guess with live electricity.

## Key points
Observe, ask, test, and start with the simplest causes — a correct diagnosis saves time and money.`,
        "Given a problem scenario (a lamp that won't light, an electric fan that won't turn, a bike with a flat tire), list the possible causes and the checks you would do, from simplest to hardest.",
        [
          "What senses can be used in diagnosing a problem?",
          "What can a multimeter measure?",
          "Why should simple causes be checked first?",
        ],
      ),
    ],
    quiz: [
      q(
        "Finding the cause of a problem by observing and testing is called…",
        ["diagnosis", "decoration", "installation", "painting"],
        0,
        "Diagnosis identifies the cause before any repair.",
      ),
      q(
        "Which instrument measures voltage, resistance and continuity?",
        ["Multimeter", "Tape measure", "Level", "Hammer"],
        0,
        "A multimeter measures several electrical quantities.",
      ),
      q(
        "A lamp won't light. What should be checked FIRST?",
        [
          "Rewire the whole house",
          "Whether it is plugged in and the bulb is good",
          "Replace the panelboard",
          "Call the power company",
        ],
        1,
        "Start with the simplest causes: plug, switch, bulb.",
      ),
      q(
        "A burning smell from an appliance is noticed using the sense of…",
        ["sight", "smell", "hearing", "taste"],
        1,
        "Smell detects burning insulation or overheating.",
      ),
      q(
        "Before touching the inside parts of an appliance, you must…",
        [
          "turn it on to see it work",
          "unplug it",
          "wet your hands",
          "remove your shoes",
        ],
        1,
        "Unplugging prevents electric shock.",
      ),
    ],
  },
  // Weeks 6–9
  {
    title: "Simple Troubleshooting",
    description:
      "Performing simple troubleshooting in industrial arts services.",
    lessons: [
      lesson(
        "Performing Simple Troubleshooting",
        "A step-by-step way to find and fix problems safely.",
        `## The troubleshooting process
- **1. Identify the problem** — what exactly is wrong? (symptom)
- **2. Gather information** — ask the user, read the manual and troubleshooting guide
- **3. List possible causes** — from most likely and simplest to least likely
- **4. Test** — check each cause one at a time with the right tool
- **5. Repair or replace** the faulty part
- **6. Verify** — test that it works correctly and safely
- **7. Document** — record the problem, cause and repair

## Continuity test (multimeter)
Used to check if a wire, fuse, switch or cord is **complete (unbroken)**:
- **Unplug** the appliance
- Set the multimeter to **continuity** (beep) or **ohms (Ω)**
- Touch one probe to one end and the other probe to the other end of the conductor (for example a plug prong and the matching wire end)
- **Beep / near 0 Ω** → continuous (good); **no beep / infinite (OL)** → open (broken)
- Test each wire of a cord separately, and **flex the cord** while testing to find hidden breaks

## Sample troubleshooting chart: electric fan won't turn
- **No power** → check the outlet with another appliance; check the plug
- **Broken cord** → continuity test; replace the cord
- **Faulty switch** → continuity test of the switch; replace
- **Weak start, hums** → capacitor may be bad; blade blocked; dry bearings (clean and oil)

## Other simple troubleshooting
- **Leaking faucet** → worn washer or O-ring → replace
- **Flickering light** → loose bulb or connection → tighten (power off)
- **Small engine hard to start** → dirty spark plug → clean or replace; old fuel → replace
- **Squeaky door** → dry hinges → lubricate

## Safety
Work with power **off**; use insulated tools; keep the area dry; don't bypass fuses or breakers; ask an adult or licensed electrician for jobs beyond simple repairs.

## Key points
Identify, gather, list causes, test, repair, verify, document — one step at a time, safely.`,
        "Perform a continuity test on an extension cord or appliance cord (unplugged), and troubleshoot a simple fault given by your teacher using a troubleshooting chart (performance task).",
        [
          "List the steps of the troubleshooting process.",
          "What does a beep in a continuity test mean?",
          "Give a possible cause and remedy for a leaking faucet.",
        ],
      ),
    ],
    quiz: [
      q(
        "In a continuity test, a reading of OL (infinite) means the wire is…",
        ["complete", "open (broken)", "too hot", "new"],
        1,
        "No continuity (OL) means the path is broken.",
      ),
      q(
        "Before a continuity test on an appliance cord, you should…",
        ["plug it in", "unplug it", "wet the cord", "cut the plug"],
        1,
        "Resistance and continuity tests are done with power off.",
      ),
      q(
        "After repairing, the next step is to…",
        [
          "verify that it works correctly and safely",
          "throw away the manual",
          "skip testing",
          "sell it right away",
        ],
        0,
        "Verification confirms the repair actually solved the problem.",
      ),
      q(
        "A faucet keeps dripping. The most likely cause is…",
        [
          "a worn washer",
          "a dead battery",
          "a broken spark plug",
          "a full tank",
        ],
        0,
        "Worn washers or O-rings are the common cause of dripping faucets.",
      ),
      q(
        "Which step comes FIRST in troubleshooting?",
        ["Replace parts", "Identify the problem", "Document", "Verify"],
        1,
        "You must know exactly what is wrong before testing and repairing.",
      ),
    ],
  },
  // Week 10
  {
    title: "Repair Service Cost",
    description: "Computing the cost of repair services in industrial arts.",
    lessons: [
      lesson(
        "Repair Service Cost",
        "Pricing a repair fairly.",
        `## Parts of a repair cost
- **Materials / parts** — replacement parts and consumables used
- **Labor** — the technician's time: **hours × labor rate**
- **Overhead** — other business costs (electricity, tools wear, transportation, rent), often a percentage
- **Profit (markup)** — a fair earning for the business

**Total repair cost = materials + labor + overhead + profit**

## Example: repairing an electric fan
- New cord ₱80 + switch ₱70 = **materials ₱150**
- Labor: 2 hours × ₱100 per hour = **₱200**
- Subtotal = ₱150 + ₱200 = ₱350
- Overhead 10% of ₱350 = **₱35** → ₱385
- Profit 20% of ₱385 = **₱77**
- **Total charge = ₱462**

## Flat-rate pricing
Many shops charge a **flat rate** per job (for example a fixed fee for an oil change, plus the oil), using standard times from service manuals.

## Giving an estimate
- Diagnose first, then give the customer a **written estimate** (job order) listing parts and labor
- Get the customer's **approval** before repairing
- Give an **official receipt** and a **warranty** on the repair when possible

## Repair or replace?
If the repair cost is close to (or more than) the price of a new unit, advise the customer that **replacing** may be better.

## Key points
Materials + labor + overhead + profit — price honestly, explain the estimate, and get approval before working.`,
        "Compute the repair cost of three sample jobs (for example a fan, a faucet and a bicycle tire) and write a simple job order/estimate for one of them (performance task).",
        [
          "What are the four parts of a repair service cost?",
          "Labor is 3 hours at ₱120 per hour. How much is the labor cost?",
          "Why should the customer approve an estimate before the repair?",
        ],
      ),
    ],
    quiz: [
      q(
        "Labor cost is computed as…",
        [
          "hours worked × labor rate",
          "materials ÷ hours",
          "price of a new unit",
          "the customer's choice",
        ],
        0,
        "Labor cost = number of hours × rate per hour.",
      ),
      q(
        "Materials ₱150 and labor ₱200. What is the subtotal?",
        ["₱50", "₱350", "₱300", "₱150"],
        1,
        "₱150 + ₱200 = ₱350.",
      ),
      q(
        "What is 10% overhead on a ₱350 subtotal?",
        ["₱3.50", "₱35", "₱350", "₱10"],
        1,
        "10% of ₱350 = ₱35.",
      ),
      q(
        "Before starting a repair, the technician should give the customer…",
        [
          "a written estimate for approval",
          "nothing",
          "the old parts only",
          "a bill without explanation",
        ],
        0,
        "A written estimate lets the customer approve the work and price first.",
      ),
      q(
        "If the repair costs more than a new unit, the technician should…",
        [
          "repair it anyway without telling",
          "advise the customer that replacing may be better",
          "double the price",
          "refuse to talk",
        ],
        1,
        "Honest advice helps the customer decide between repair and replacement.",
      ),
    ],
  },
];

/** TLE 8 – Industrial Arts. */
export const industrialArts8: DemoSubject = {
  key: "TLE8-IA",
  code: "TLE 8-IA",
  name: "TLE 8 – Industrial Arts",
  department: TLE_DEPARTMENT,
  description:
    "Construction, electrical, electronics, and automotive and small engine services (DepEd Budget of Work, Grade 8, Third Term).",
  colorToken: "amber",
  units: UNITS,
};
