/**
 * TLE 7 Industrial Arts — the Third Term of DepEd's Grade 7 Budget of Work
 * (AFA / FCS / IA): services, careers, codes and standards, tools, and
 * mensuration. Each lesson has a lecture video, a written lecture, the Budget
 * of Work's activities and a self-check, and every unit five Unit Questions
 * and five more for Live Quiz.
 */
import type { DemoSubject, DemoUnit } from "../grade10";
import { q, tleLesson, TLE_DEPARTMENT } from "./common";

const UNITS: DemoUnit[] = [
  {
    title: "Industrial Arts Services and Standards",
    description:
      "The services in industrial arts, its careers and businesses, and the codes and standards that guide the work.",
    lessons: [
      tleLesson(
        "Services in Industrial Arts",
        "The trades that build and repair the things around us.",
        "tbBo58c-_fQ",
        `## What is industrial arts?
**Industrial arts** is working with tools, materials and machines to build, install and repair things. Look around: your classroom's chairs, wires, doors and roof all came from these services.

## Main services
- **Construction** — carpentry, masonry, plumbing, tile setting, painting
- **Electrical** — installing and repairing wiring, outlets and lights
- **Electronics** — repairing radios, TVs, computers and small devices
- **Automotive and small engine** — servicing cars, motorcycles and generators
- **Metalwork and welding** — making gates, grills and frames
- **Drafting** — drawing plans for others to build from
- **Refrigeration and air conditioning** — installing and servicing cooling units

## Why these services matter
- Homes, schools and roads depend on them.
- They keep things **safe** and working.
- Repairing saves money and reduces waste.
- They provide work for many Filipino families, and skills that are needed around the world.`,
        `## Industrial Arts Service Mapping
Create a visual chart showing various services (for example carpentry, metalwork, electrical, construction and design), and briefly describe their purpose.

## Real-Life Services Exploration
Research or visit local workshops to identify and explain the types of services offered and how they impact the community.`,
        [
          "What is industrial arts?",
          "Name four services in industrial arts.",
          "How does repair work help a community?",
        ],
      ),
      tleLesson(
        "Careers and Businesses in Industrial Arts",
        "Skilled work you can do, and shops you can run.",
        "xcayT3xi3So",
        `## Careers
- **Carpenter** — builds with wood
- **Mason** — works with cement, block and tile
- **Plumber** — installs pipes
- **Electrician** — installs wiring
- **Electronics technician** — repairs devices
- **Auto mechanic** — services vehicles
- **Welder** — joins metal
- **Draftsperson** — draws plans
- **Engineer** or **architect** — after college

## Becoming skilled
- **TESDA** offers training and **National Certificates (NC)**, such as Electrical Installation and Maintenance NC II and Shielded Metal Arc Welding NC I and II.
- Senior high school offers Technical-Professional electives.
- Many skilled workers learn further on the job, as apprentices.

## Business opportunities
- **Repair shop** for appliances, cellphones or motorcycles
- **Furniture** making
- **Welding shop** for gates and grills
- **Hardware store**
- **Home services** such as electrical and plumbing repairs

## Questions to ask
What can I do well? What do people nearby need? Who are my customers? What tools and money do I need to start?`,
        `## Industrial Arts Career Web
Create a web diagram linking different Industrial Arts fields (carpentry, metalwork, electronics, drafting) to possible career paths and job roles.

## Business Idea Brainstorm
Brainstorm and present simple business ideas or services related to Industrial Arts, and explain potential customers or markets.`,
        [
          "What does a mason do?",
          "What does TESDA give to those who pass its assessments?",
          "Give two businesses in industrial arts.",
        ],
      ),
      tleLesson(
        "Codes and Standards in Industrial Arts",
        "The rules that keep work safe and of good quality.",
        "1t5HWHobQYE",
        `## Codes and standards
- A **code** is a set of rules, often a law, on how work must be done.
- A **standard** sets the quality that a product or service should meet.

They protect lives and property, and make sure that work is done right.

## Common codes in the Philippines
| Code | Covers |
|---|---|
| National Building Code (PD 1096) | Design and construction of buildings |
| Philippine Electrical Code | Safe electrical wiring |
| Fire Code (RA 9514) | Fire safety and prevention |
| National Plumbing Code | Water supply and drainage |
| Occupational Safety and Health Law (RA 11058) | Workers' safety |
| Land Transportation and Traffic Code (RA 4136) | Vehicles and drivers |

## Product standards
The **Philippine National Standards (PNS)** come from the Bureau of Philippine Standards under the Department of Trade and Industry. Look for the **PS mark** on products such as wires, cement, and steel bars.

## In the shop
- Wear proper **PPE**.
- Follow manuals and the plan.
- Never skip safety steps to save time.
- Use only materials that meet the standard.

Breaking codes can lead to accidents, fires, fines and collapsed structures.`,
        `## Industrial Arts Standards Poster
Create a poster highlighting key codes, safety rules and quality standards in different Industrial Arts fields.

## Codes in Action Scenario
Analyze sample workshop scenarios to identify whether proper codes and standards are being followed, and explain why.`,
        [
          "What is the difference between a code and a standard?",
          "Which code covers electrical wiring?",
          "What does the PS mark show?",
        ],
      ),
    ],
    quiz: [
      q(
        "Installing wiring and outlets belongs to which service?",
        ["Masonry", "Electrical", "Plumbing", "Drafting"],
        1,
        "Electrical services install and repair wiring.",
      ),
      q(
        "A person who joins metal is a…",
        ["Mason", "Welder", "Plumber", "Carpenter"],
        1,
        "Welders join metal pieces.",
      ),
      q(
        "Which law covers fire safety?",
        ["RA 9514", "RA 9003", "RA 4136", "PD 1096"],
        0,
        "RA 9514 is the Fire Code of the Philippines.",
      ),
      q(
        "A set of rules on how work must be done is a…",
        ["Code", "Tool", "Trade", "Plan"],
        0,
        "Codes are rules, often laws, for doing work safely.",
      ),
      q(
        "Which agency trains and certifies skilled workers?",
        ["TESDA", "PAGASA", "DOH", "PhilHealth"],
        0,
        "TESDA gives training and National Certificates.",
      ),
    ],
    bank: [
      q(
        "A draftsperson…",
        ["Draws plans", "Installs pipes", "Lays tiles", "Repairs engines"],
        0,
        "Drafting produces the plans that others build from.",
      ),
      q(
        "Which is a business in industrial arts?",
        ["Cellphone repair shop", "Bakery", "Fish pond", "Travel agency"],
        0,
        "Repair services are a common industrial arts business.",
      ),
      q(
        "PD 1096 is the…",
        ["National Building Code", "Fire Code", "Labor Code", "Traffic Code"],
        0,
        "PD 1096 is the National Building Code of the Philippines.",
      ),
      q(
        "A product with a PS mark…",
        [
          "Meets a Philippine standard",
          "Is imported",
          "Is always cheap",
          "Is handmade",
        ],
        0,
        "The PS mark shows that a product meets a Philippine National Standard.",
      ),
      q(
        "RA 11058 protects…",
        ["Workers' safety", "Animals", "Forests", "Consumers' data"],
        0,
        "RA 11058 is the Occupational Safety and Health Law.",
      ),
    ],
  },
  {
    title: "Tools, Measurement and Calculation",
    description:
      "Using and maintaining tools, reading measuring instruments, and performing mensuration and calculations safely.",
    lessons: [
      tleLesson(
        "Uses of Hand Tools, Power Tools and Instruments",
        "Choosing the right tool for the job.",
        "HDZc1rmefpg",
        `## Hand tools
Hand tools run on your own strength.
- **Claw hammer** — drives and pulls nails
- **Screwdriver** — turns screws (flat or Phillips)
- **Pliers** — grip, bend and cut wire
- **Hand saw** — cuts wood
- **Wrench** — turns nuts and bolts
- **Chisel** — shapes wood or metal
- **Trowel** — spreads cement

## Power tools
Power tools run on electricity or batteries.
- **Electric drill** — makes holes
- **Circular saw** — cuts wood quickly
- **Angle grinder** — cuts and smooths metal
- **Jigsaw** — cuts curves

Students use power tools only with a teacher's permission and supervision.

## Instruments
Instruments measure or test.
- **Tape measure** and **steel rule** — length
- **Try square** — right angles
- **Spirit level** — checks that something is level
- **Vernier caliper** — small, exact sizes
- **Multimeter** — voltage, current and resistance

## Equipment
Larger machines that stay in the shop: **bench vise**, **welding machine**, **air compressor**, **drill press**.`,
        `## Tool Identification and Function Drill
Examine hand tools, power tools and equipment, then name each item and explain its primary use.`,
        [
          "What is the difference between a hand tool and a power tool?",
          "What does a spirit level check?",
          "What does a multimeter measure?",
        ],
      ),
      tleLesson(
        "Maintenance of Tools and Equipment",
        "Keeping tools safe, sharp and ready.",
        "XONg-jvLnYk",
        `## Why maintain tools?
Well-kept tools are **safer**, work **better** and **last longer**. A dull blade needs more force, and that causes accidents.

## Before use
- Check for **cracks**, loose handles and worn cords.
- Report damaged tools. Don't use them.

## After use
- **Clean** off dust, oil and cement. Don't let cement harden on a trowel.
- **Dry** tools, because water causes rust.
- **Oil** metal parts lightly.
- **Sharpen** cutting edges.
- **Return** each tool to its proper place.

## Power tools
- **Unplug** before cleaning or changing bits.
- Keep cords away from water and sharp edges.
- Clean vents so that the motor doesn't overheat.

## Instruments
- Don't drop them; a small hit can make readings wrong.
- Wipe them clean and store them in their cases.
- Remove batteries from a multimeter if it won't be used for a long time.

## Storage
Use a **tool rack or tool box**. Hang saws, keep sharp edges covered, and keep the area dry. An **inventory list** shows if anything is missing.`,
        `## Tool Care and Maintenance Workshop
Demonstrate cleaning, proper storage and basic maintenance procedures for selected tools and equipment.`,
        [
          "Why is a dull blade dangerous?",
          "What must you do before cleaning a power tool?",
          "How do you prevent rust?",
        ],
      ),
      tleLesson(
        "Reading Measuring Instruments",
        "Getting correct readings from rulers, tapes, calipers and meters.",
        "aWBmrMZsknA",
        `## Two systems
- **Metric (SI)** — millimeter, centimeter, meter
- **English** — inch, foot, yard

## Key equivalents
| Unit | Equals |
|---|---|
| 1 cm | 10 mm |
| 1 m | 100 cm |
| 1 inch | 2.54 cm |
| 1 foot | 12 inches |
| 1 yard | 3 feet |

## Reading a ruler
**Metric:** each small line is **1 mm**, and ten small lines make 1 cm. A reading of 4 long lines and 3 small lines is **4.3 cm**.

**English:** an inch is usually divided into 16 parts. The lines mark 1/2, 1/4, 1/8 and 1/16 of an inch; the longer the line, the bigger the fraction.

## Reading other instruments
- **Tape measure** — hook the end on the object and pull it straight.
- **Vernier caliper** — read the main scale, then find the vernier line that lines up exactly, and add the two.
- **Multimeter** — set the dial first, then read the display and its unit.
- **Protractor** — put the center on the corner, and read the angle in degrees.

## Getting accurate readings
Look **straight at** the scale. Keep the instrument flat against the object. Measure twice, and write the **unit** with your answer.`,
        `## Measuring Instrument Observation
Examine various measuring instruments (ruler, caliper, micrometer, multimeter) and record sample readings correctly.

## Real-Life Measurement Challenge
Measure actual materials or objects using different instruments, and interpret the readings to complete simple tasks or problems.`,
        [
          "How many millimeters are in 6.5 cm?",
          "How many inches are in 3 feet?",
          "Why should you look straight at a scale?",
        ],
      ),
      tleLesson(
        "Mensuration and Calculation",
        "Measuring and computing what a project needs.",
        "B4OqGFQunio",
        `## What is mensuration?
**Mensuration** is measuring length, area and volume, then using the numbers to plan work: how much wood, paint or cement to buy.

## Formulas
| To find | Shape | Formula |
|---|---|---|
| Perimeter | Rectangle | 2 × (length + width) |
| Area | Rectangle | length × width |
| Area | Triangle | ½ × base × height |
| Area | Circle | 3.14 × radius × radius |
| Volume | Box | length × width × height |

## Worked examples
**Area:** a wall is 4 m long and 3 m high. Area = 4 × 3 = **12 m²**. If 1 liter of paint covers 6 m², you need 12 ÷ 6 = **2 liters**.

**Perimeter:** a garden is 5 m by 2 m. Fence needed = 2 × (5 + 2) = **14 m**.

**Volume:** a box is 2 m by 1 m by 0.5 m. Volume = 2 × 1 × 0.5 = **1 m³**.

**Cost:** 14 m of wire at ₱25 per meter = 14 × 25 = **₱350**.

## Good habits
- Convert to the **same unit** first.
- Show your solution and label the answer.
- Add a small extra for waste. *"Measure twice, cut once."*

## Safety while measuring
Wear PPE when handling materials. Keep the tape from snapping back. Carry steel rules and sharp-edged materials with care, and keep the work area clean.`,
        `## Measurement and Calculation Hands-On Lab
Measure the length, area, volume or angles of given materials using proper tools, while observing all safety precautions.

## Safety-Aware Mensuration Challenge
Solve practical problems by measuring objects and calculating dimensions, with correct handling of tools and PPE.

## Performance Tasks
**Individual: Personal Measurement Exercise.** Measure the length, width, height or angle of a given object using appropriate tools (ruler, tape measure or protractor). Perform the necessary calculations (area, perimeter, volume), and record the results, following proper safety precautions.

**Group: Mini Project Dimension Planning.** In small groups, plan and measure materials for a small project (for example a simple wooden shelf or toolbox). Calculate the dimensions and quantities needed, and safely handle tools and measuring instruments during the process.`,
        [
          "What is the area of a floor 5 m by 4 m?",
          "What is the perimeter of a 6 m by 2 m lot?",
          "Why should all measurements be in the same unit?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which tool turns nuts and bolts?",
        ["Chisel", "Wrench", "Hand saw", "Try square"],
        1,
        "A wrench grips and turns nuts and bolts.",
      ),
      q(
        "Before cleaning a power tool, you should…",
        ["Oil it", "Unplug it", "Wet it", "Sharpen it"],
        1,
        "Unplugging prevents shocks and accidental starts.",
      ),
      q(
        "How many centimeters are in 2 meters?",
        ["20", "200", "2,000", "12"],
        1,
        "1 m is 100 cm, so 2 m is 200 cm.",
      ),
      q(
        "The area of a rectangle is found by…",
        ["length + width", "length × width", "2 × length", "width ÷ length"],
        1,
        "Area = length × width.",
      ),
      q(
        "A wall 5 m by 2 m has an area of…",
        ["7 m²", "10 m²", "14 m²", "25 m²"],
        1,
        "5 × 2 = 10 m².",
      ),
    ],
    bank: [
      q(
        "Which instrument checks that a shelf is level?",
        ["Multimeter", "Spirit level", "Pliers", "Chisel"],
        1,
        "A spirit level's bubble shows if a surface is level.",
      ),
      q(
        "Oiling metal tools helps prevent…",
        ["Rust", "Dust", "Noise", "Sharp edges"],
        0,
        "A light coat of oil keeps out moisture.",
      ),
      q(
        "1 inch is about…",
        ["1 mm", "2.54 cm", "12 cm", "1 m"],
        1,
        "One inch equals 2.54 cm.",
      ),
      q(
        "The volume of a box 3 m × 2 m × 1 m is…",
        ["5 m³", "6 m³", "7 m³", "9 m³"],
        1,
        "3 × 2 × 1 = 6 m³.",
      ),
      q(
        "A fence around a 4 m by 3 m garden needs…",
        ["7 m", "12 m", "14 m", "24 m"],
        2,
        "2 × (4 + 3) = 14 m.",
      ),
    ],
  },
];

export const industrialArts7: DemoSubject = {
  key: "TLE7-IA",
  code: "TLE 7-IA",
  name: "TLE 7 – Industrial Arts",
  department: TLE_DEPARTMENT,
  description:
    "Industrial arts services, codes, tools, and mensuration — Grade 7, Third Term of the three-term TLE: AFA / FCS / IA.",
  colorToken: "amber",
  units: UNITS,
};
