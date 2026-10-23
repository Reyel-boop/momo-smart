import type { DemoSubject } from "../grade10";
import { q, TLE_DEPARTMENT, tleLesson } from "./common";

/** TLE 7: exploratory course, one unit per TLE strand. */
export const TLE7: DemoSubject = {
  key: "TLE7",
  code: "TLE 7",
  name: "TLE 7 – Exploratory",
  department: TLE_DEPARTMENT,
  description:
    "Exploring the four TLE strands: ICT, Home Economics, Agri-Fishery Arts and Industrial Arts.",
  colorToken: "amber",
  units: [
    {
      title: "ICT: Computer Hardware Basics",
      description:
        "Parts of a computer system and the tools used to service it.",
      lessons: [
        tleLesson(
          "Parts of a Computer System",
          "Hardware, software and peopleware.",
          "nhez4M2Xagk",
          `## The three parts of a computer system
- **Hardware** — the physical parts you can touch
- **Software** — the programs that tell the hardware what to do
- **Peopleware** — the users, technicians and programmers

## Hardware by function
- **Input devices** send data into the computer: keyboard, mouse, scanner, microphone, webcam.
- **Processing:** the **CPU (Central Processing Unit)** is the "brain" that carries out instructions. It sits on the **motherboard**, which connects every part.
- **Memory:** **RAM** holds data while the computer is on and is erased when it is turned off. **ROM** keeps the start-up instructions permanently.
- **Storage** keeps files when the power is off: **HDD**, **SSD**, flash drive.
- **Output devices** show the results: monitor, printer, speakers.
- The **power supply unit (PSU)** converts AC from the outlet into the DC the parts need.

## Software
- **System software** runs the computer: the **operating system** (Windows, Linux, macOS, Android).
- **Application software** does a job for the user: word processors, browsers, games.

## Key points
- Input → Process → Output → Storage is the **information processing cycle**.
- A computer is useless without all three: hardware, software and peopleware.`,
          "A computer system is made of hardware, software and peopleware. Hardware is grouped into input, processing, storage and output devices.",
          [
            "Give two input devices and two output devices.",
            "Why is the CPU called the brain of the computer?",
            "What is the difference between RAM and storage?",
          ],
        ),
        tleLesson(
          "Hand Tools and Safety in Computer Servicing",
          "Choosing the right tool and working safely.",
          "KfXCoyQGjlY",
          `## Tools of the computer technician
- **ESD tools:** an **anti-static wrist strap** and **anti-static mat** protect parts from electrostatic discharge.
- **Hand tools:** Phillips and flat screwdrivers, **part retriever**, **tweezers**, needle-nose pliers, flashlight.
- **Cleaning tools:** lint-free cloth, compressed air, isopropyl alcohol, brush.
- **Diagnostic tools:** **multimeter** (checks voltage and continuity), **loopback adapter**, **cable tester**.
- **Software tools:** disk management, antivirus, system diagnostics.

## Electrostatic discharge (ESD)
Static electricity from your body can destroy chips **even when you don't feel a spark**. Always wear a wrist strap, hold boards by the edges and store parts in **anti-static bags**.

## Safety rules
- **Unplug** the computer before opening it.
- Never open the **power supply** or the **monitor** — they hold dangerous voltage even when off.
- Remove watches and jewelry.
- Keep food and drinks away from the work area.
- Use the right screwdriver size so screws don't strip.
- Know where the **fire extinguisher** is (Class C for electrical fires).

## Key points
- The right tool, used correctly, prevents damage to both you and the computer.
- **OHS (Occupational Health and Safety)** practices protect the technician, the equipment and the workplace.`,
          "Technicians use hand, cleaning, ESD and diagnostic tools. Unplug before opening a computer and wear an anti-static wrist strap to prevent ESD.",
          [
            "What does an anti-static wrist strap protect against?",
            "Why should a technician never open a power supply?",
            "Name one diagnostic tool and what it checks.",
          ],
        ),
      ],
      quiz: [
        q(
          "Which part is called the brain of the computer?",
          ["RAM", "CPU", "Hard disk", "Monitor"],
          1,
          "The CPU (Central Processing Unit) carries out every instruction, so it is called the brain of the computer.",
        ),
        q(
          "Which of these is an input device?",
          ["Printer", "Speaker", "Scanner", "Monitor"],
          2,
          "A scanner sends data into the computer. Printers, speakers and monitors are output devices.",
        ),
        q(
          "What happens to the data in RAM when the computer is turned off?",
          [
            "It is saved to the CPU",
            "It is erased",
            "It is moved to ROM",
            "It stays until deleted",
          ],
          1,
          "RAM is volatile memory: it only holds data while it has power, so its contents are erased when the computer shuts down.",
        ),
        q(
          "Which tool protects computer parts from electrostatic discharge?",
          [
            "Part retriever",
            "Multimeter",
            "Anti-static wrist strap",
            "Tweezers",
          ],
          2,
          "An anti-static wrist strap grounds the technician so static electricity does not flow into and damage the chips.",
        ),
        q(
          "What should you do first before opening a computer case?",
          [
            "Remove the RAM",
            "Unplug the power cord",
            "Clean the fan",
            "Turn on the monitor",
          ],
          1,
          "Unplugging removes the source of electricity, protecting both you and the parts while you work inside.",
        ),
      ],
    },
    {
      title: "Home Economics: Kitchen Basics",
      description: "Kitchen tools and equipment and accurate measuring.",
      lessons: [
        tleLesson(
          "Kitchen Tools and Equipment",
          "Knowing and caring for what you cook with.",
          "_qYfw6QJbM0",
          `## Tools vs. equipment
- **Kitchen tools (utensils)** are small and handheld.
- **Kitchen equipment** is larger and often powered: stove, oven, refrigerator, microwave, blender.

## Common tools and their uses
- **Measuring cups and spoons** — for exact amounts
- **Chef's knife** — chopping, slicing and dicing; **paring knife** for small peeling jobs
- **Cutting board** — use separate boards for raw meat and for vegetables to avoid cross-contamination
- **Mixing bowls**, **wire whisk**, **rubber scraper** — mixing and folding
- **Ladle**, **slotted spoon**, **tongs**, **spatula** — serving and turning food
- **Colander** — draining pasta and washing vegetables
- **Grater**, **peeler**, **can opener**

## Materials of cookware
- **Stainless steel** — durable and does not react with food
- **Aluminum** — heats quickly and evenly
- **Cast iron** — holds heat well; must be oiled to prevent rust
- **Non-stick** — easy to clean; use wooden or silicone tools so the coating doesn't scratch

## Care of tools
Wash, dry and store tools right after use; keep knives sharp (a dull knife slips more easily); unplug equipment before cleaning.`,
          "Kitchen tools are small handheld utensils; kitchen equipment is larger and often powered. Each tool has a specific use and must be cleaned and stored properly.",
          [
            "What is the difference between a kitchen tool and kitchen equipment?",
            "Why should raw meat and vegetables use separate cutting boards?",
            "Why is a dull knife more dangerous than a sharp one?",
          ],
        ),
        tleLesson(
          "Measuring Ingredients",
          "Accurate measuring of dry and liquid ingredients.",
          "DInhD8x2b6c",
          `## Why measure accurately?
Recipes, especially baked goods, depend on the right **proportions**. Too much flour makes a cake dry; too little makes it collapse.

## Measuring tools
- **Dry measuring cups** — nested cups (1, ½, ⅓, ¼ cup) filled to the brim and leveled
- **Liquid measuring cup** — clear, with a spout and markings below the rim
- **Measuring spoons** — tablespoon (tbsp) and teaspoon (tsp)
- **Weighing scale** — the most accurate method

## Techniques
- **Flour:** sift, spoon lightly into the cup, then **level with a spatula**. Don't tap or pack.
- **Brown sugar:** **pack** firmly so it keeps the cup's shape when turned out.
- **White sugar:** fill and level.
- **Liquids:** set the cup on a flat surface and read at **eye level**.
- **Fats (butter, shortening):** pack into a dry cup, or use the markings on the wrapper.

## Equivalents to remember
- 3 teaspoons = 1 tablespoon
- 16 tablespoons = 1 cup
- 1 cup = 240 mL (about 250 mL in recipes)
- 1 kilogram = 1,000 grams

## Key points
Use the right cup for the ingredient: dry cups for dry, liquid cups for liquid.`,
          "Dry ingredients are spooned into dry measuring cups and leveled; liquids are measured in a clear cup read at eye level. 3 tsp = 1 tbsp and 16 tbsp = 1 cup.",
          [
            "How many teaspoons are in one tablespoon?",
            "Why do we level flour instead of packing it?",
            "How should a liquid measuring cup be read?",
          ],
        ),
      ],
      quiz: [
        q(
          "Which of these is kitchen equipment rather than a kitchen tool?",
          ["Whisk", "Ladle", "Oven", "Peeler"],
          2,
          "Equipment is large and usually powered, like an oven. Whisks, ladles and peelers are small handheld tools.",
        ),
        q(
          "Why should you use separate cutting boards for raw meat and vegetables?",
          [
            "To keep the boards sharp",
            "To prevent cross-contamination",
            "To save time",
            "Because meat is heavier",
          ],
          1,
          "Bacteria from raw meat can spread to foods eaten raw. Separate boards prevent this cross-contamination.",
        ),
        q(
          "How many teaspoons make one tablespoon?",
          ["2", "3", "4", "16"],
          1,
          "1 tablespoon = 3 teaspoons. (16 tablespoons make 1 cup.)",
        ),
        q(
          "Which ingredient should be packed firmly into the measuring cup?",
          ["Flour", "White sugar", "Brown sugar", "Salt"],
          2,
          "Brown sugar is moist and airy, so it is packed until it holds the shape of the cup. Flour is spooned in and leveled, never packed.",
        ),
        q(
          "How should you read a liquid measuring cup?",
          [
            "From above",
            "While holding it up high",
            "At eye level on a flat surface",
            "From below",
          ],
          2,
          "Reading at eye level with the cup on a flat surface avoids the error you get when looking down at the line from an angle.",
        ),
      ],
    },
    {
      title: "Agri-Fishery Arts: Crop Production Basics",
      description: "Farm tools and safe work in the farm.",
      lessons: [
        tleLesson(
          "Farm Tools and Equipment",
          "Hand tools, implements and equipment and their uses.",
          "6gOgEJj59Hw",
          `## Three groups
- **Farm tools** — light, handheld, used without animals or engines
- **Farm implements** — pulled by animals or machines (plow, harrow)
- **Farm equipment** — machines with engines (hand tractor, water pump, sprayer)

## Common farm tools
- **Bolo** — cutting grass and branches
- **Pick mattock** — digging hard soil and removing stumps
- **Crowbar** — digging holes and loosening rocks
- **Spading fork** — loosening and turning soil
- **Shovel** — moving soil, sand and manure
- **Hoe** — weeding and cultivating
- **Rake** — leveling soil and gathering trash
- **Pruning shears** — cutting small branches
- **Trowel** — transplanting seedlings
- **Sprinkler / watering can** — watering plants
- **Wheelbarrow** — carrying loads

## Implements and equipment
- **Plow** — breaks and turns the soil
- **Harrow** — breaks clods and levels the field after plowing
- **Hand tractor** — pulls the plow and harrow
- **Knapsack sprayer** — applies fertilizers and pesticides

## Care and maintenance
Clean tools after use, sharpen cutting edges, oil metal parts to prevent rust, repair broken handles and **store tools in a dry place**.`,
          "Farm tools are handheld; implements are pulled by animals or machines; equipment runs on engines. Tools must be cleaned, oiled and stored after use.",
          [
            "What is the difference between a farm tool and a farm implement?",
            "Which tool is used for transplanting seedlings?",
            "Why should metal tools be oiled before storage?",
          ],
        ),
        tleLesson(
          "Safety in Farm Operations",
          "Hazards in the farm and how to prevent accidents.",
          "Ve2-tpvY3Cc",
          `## Farm hazards
- **Physical:** sharp tools, moving machinery, heat, noise, sun exposure
- **Chemical:** pesticides, herbicides and fertilizers
- **Biological:** animal bites, insects, molds, germs in manure
- **Ergonomic:** lifting heavy loads, bending for long hours

## Personal Protective Equipment (PPE)
- **Hat** — protection from the sun
- **Gloves** — protect hands from tools and chemicals
- **Boots** — protect feet from sharp objects and snakes
- **Long sleeves and pants**
- **Mask or respirator** — when spraying chemicals
- **Goggles** — protect eyes from dust and spray

## Safe practices
- Carry sharp tools pointed **down** and away from the body.
- Read and follow the **label** on chemical containers; spray **with the wind**, never against it.
- Never eat, drink or smoke while handling chemicals; wash hands after.
- Store chemicals **locked away** from children, food and animals.
- Lift with your **legs, not your back**.
- Drink water and rest in the shade to avoid **heat stroke**.

## Key points
Most farm accidents are preventable with proper tools, PPE and safe habits.`,
          "Farm hazards are physical, chemical, biological and ergonomic. Wearing PPE and following safe practices prevents most farm accidents.",
          [
            "Give one example each of a physical and a chemical hazard in the farm.",
            "What PPE should be worn when spraying pesticides?",
            "Why should you spray with the wind and not against it?",
          ],
        ),
      ],
      quiz: [
        q(
          "Which farm tool is used to loosen and turn the soil?",
          ["Spading fork", "Pruning shears", "Sprinkler", "Wheelbarrow"],
          0,
          "A spading fork has strong tines that dig into and loosen the soil. Shears cut branches; sprinklers water; wheelbarrows carry loads.",
        ),
        q(
          "A harrow is used to…",
          [
            "cut tall grass",
            "break clods and level the soil after plowing",
            "spray pesticides",
            "dig holes for posts",
          ],
          1,
          "After plowing, the harrow breaks soil clods and levels the field so it is ready for planting.",
        ),
        q(
          "What is the best way to store metal farm tools?",
          [
            "Leave them in the field",
            "Wash, dry, oil and keep them in a dry place",
            "Soak them in water",
            "Keep them under the sun",
          ],
          1,
          "Cleaning, drying and oiling metal parts prevents rust, and a dry storage place keeps tools in good condition longer.",
        ),
        q(
          "Pesticides are an example of which kind of hazard?",
          ["Physical", "Ergonomic", "Chemical", "Biological"],
          2,
          "Pesticides are chemicals; they can poison you through the skin, mouth or lungs.",
        ),
        q(
          "When spraying chemicals, you should…",
          [
            "spray against the wind",
            "eat while working to save time",
            "wear a mask and gloves and spray with the wind",
            "store leftovers in a drink bottle",
          ],
          2,
          "PPE blocks contact with the chemical, and spraying with the wind carries the spray away from you instead of into your face.",
        ),
      ],
    },
    {
      title: "Industrial Arts: Electricity Basics",
      description: "Electrical tools, materials and safety.",
      lessons: [
        tleLesson(
          "Electrical Tools and Materials",
          "What an electrician uses and why.",
          "QSBHsWj2zqU",
          `## Electrical hand tools
- **Combination (lineman's) pliers** — cutting, gripping and twisting wires
- **Long-nose pliers** — bending wire ends into loops; reaching small spaces
- **Side-cutting pliers (diagonal cutters)** — cutting wires
- **Wire stripper** — removing insulation without nicking the wire
- **Screwdrivers** — flat and Phillips, with **insulated handles**
- **Electrician's knife** — scraping and skinning insulation
- **Hammer**, **portable electric drill**, **hacksaw**

## Measuring and testing tools
- **Multitester (multimeter)** — measures voltage, current and resistance
- **Test light** — shows whether a circuit has power
- **Steel tape / pull-push rule** — measuring lengths

## Electrical materials
- **Wires and cables** — copper conductors with insulation, sized by AWG or mm²
- **Electrical tape** — insulates splices
- **Junction box / utility box** — houses connections, switches and outlets
- **PVC conduit** — protects wires
- **Switches** — control the flow of current to a load
- **Convenience outlets** — where appliances are plugged
- **Lamp holders (receptacles)**, **circuit breakers**, **fuses**

## Key points
Choose tools with **insulated handles** and keep them clean and dry.`,
          "Electricians use pliers, wire strippers, insulated screwdrivers and testers, and install materials such as wires, switches, outlets, boxes and circuit breakers.",
          [
            "Which pliers are used to form loops at the end of a wire?",
            "What does a multitester measure?",
            "What is a junction box used for?",
          ],
        ),
        tleLesson(
          "Electrical Safety",
          "Preventing shock and fire.",
          "TMT6f3tZQSk",
          `## Why electricity is dangerous
Current flowing through the body causes **electric shock**. As little as **0.1 ampere** across the heart can be fatal. Faulty wiring also causes **fires**.

## Safety rules
- **Turn off the circuit breaker** before working on any circuit, and test that it is dead.
- Use tools with **insulated handles**; stand on a dry surface.
- **Never work with wet hands** or near water.
- Don't overload outlets with too many plugs ("octopus connections").
- Replace damaged cords and plugs right away.
- Pull the **plug**, not the cord.
- Keep appliances away from water.
- Use the correct **fuse or breaker rating**; never bypass one.

## Electrical signs
Know these: **DANGER: HIGH VOLTAGE**, **ELECTRICAL HAZARD**, and **lockout/tagout (LOTO)** tags placed on switches so no one turns them on while someone is working.

## If someone is electrocuted
- **Do not touch the victim** while they are still in contact with the source.
- **Turn off the power** at the breaker or unplug.
- If you can't, push them away using something **dry and non-conductive** (wooden stick, plastic chair).
- Call for help and give **first aid / CPR** if trained.

## Key points
Electricity gives no warning — treat every wire as live until tested.`,
          "Turn off the breaker before working, use insulated tools, keep hands dry and never overload outlets. To help an electrocuted person, cut the power first.",
          [
            "What should you do first before working on a circuit?",
            "Why is an 'octopus connection' dangerous?",
            "How do you safely help someone who is being electrocuted?",
          ],
        ),
      ],
      quiz: [
        q(
          "Which tool removes insulation from a wire without damaging the conductor?",
          ["Hacksaw", "Wire stripper", "Hammer", "Test light"],
          1,
          "A wire stripper has notches sized to the wire, so it cuts only the insulation and leaves the copper unharmed.",
        ),
        q(
          "A multitester is used to measure…",
          [
            "length of wire",
            "voltage, current and resistance",
            "weight of materials",
            "temperature of the room",
          ],
          1,
          "A multitester (multimeter) combines a voltmeter, ammeter and ohmmeter in one instrument.",
        ),
        q(
          "What is the first thing to do before repairing a circuit?",
          [
            "Wear sunglasses",
            "Switch off the circuit breaker",
            "Wet your hands for grip",
            "Call the barangay",
          ],
          1,
          "Switching off the breaker removes the current so you cannot be shocked while working.",
        ),
        q(
          "Why are 'octopus connections' dangerous?",
          [
            "They waste space",
            "They overload the outlet and can cause fire",
            "They make appliances slower",
            "They are hard to see",
          ],
          1,
          "Plugging many loads into one outlet draws more current than it is rated for, which overheats the wires and can start a fire.",
        ),
        q(
          "Someone is stuck to a live wire. What should you do first?",
          [
            "Pull them with your hands",
            "Throw water on them",
            "Turn off the power source",
            "Wait for them to let go",
          ],
          2,
          "Touching the victim makes you part of the circuit. Cutting the power first is the only safe way to help.",
        ),
      ],
    },
  ],
};
