/** Unit Activities for every TLE course. */
import { a, type UnitActivity } from "./kit";

/** When a task needs a kitchen, tools or a farm, a paper option is given. */
const NO_TOOLS =
  "No materials at home? Write the steps you would follow instead.";

export const TLE: Record<string, UnitActivity> = {
  // --------------------------------------------------------- TLE 7 and 8
  "ICT: Computer Hardware Basics": a(
    "Parts of My Computer",
    "Name the main parts of a computer.",
    [
      "Look at a computer at school, home or a shop (or a picture of one).",
      "Draw it and label 5 parts: monitor, system unit, keyboard, mouse, and one more.",
      "Beside each, write if it is an input, output, storage or processing device.",
    ],
    "A photo of your labeled drawing.",
  ),
  "Home Economics: Kitchen Basics": a(
    "Kitchen Tour",
    "Know your kitchen tools and their uses.",
    [
      "List 6 tools in your kitchen (knife, chopping board, ladle …).",
      "Write what each one is used for.",
      "Write one safety rule for using a knife.",
    ],
    "Your list of 6 tools with uses, and the safety rule.",
  ),
  "Agri-Fishery Arts: Crop Production Basics": a(
    "Seed to Sprout",
    "Watch a seed start to grow.",
    [
      "Put 3 monggo seeds on wet tissue in a cup or plastic.",
      "Check them for 3 days and write what you see each day.",
      `Write what seeds need to sprout. ${NO_TOOLS}`,
    ],
    "Your 3-day notes (a photo is a bonus).",
  ),
  "Industrial Arts: Electricity Basics": a(
    "Safe Outlets",
    "Spot electrical hazards at home.",
    [
      "Walk around your home and check 3 outlets or extension cords.",
      "Write anything unsafe you see (overloaded, broken, near water) — or write 'safe'.",
      "Write 3 rules your family should follow to stay safe with electricity.",
    ],
    "Your checklist of 3 outlets and your 3 safety rules.",
  ),
  "ICT: Computer Operations": a(
    "Organize My Files",
    "Practice basic file management.",
    [
      "On a computer or phone, create a folder named 'TLE Activities'.",
      "Inside it, create 2 subfolders: 'Notes' and 'Pictures'.",
      "Take a screenshot, or write the steps you did, including how to rename a folder.",
    ],
    "A screenshot of your folders, or the steps you wrote.",
  ),
  "Home Economics: Food Safety and Sanitation": a(
    "Clean Kitchen Check",
    "Apply food safety rules at home.",
    [
      "Check your kitchen for 5 things: hand washing, clean surfaces, separate raw and cooked food, food storage, garbage.",
      "Mark each as 'OK' or 'Needs work'.",
      "Write one change your family can make to keep food safe.",
    ],
    "Your 5-item checklist and one suggested change.",
  ),
  "Agri-Fishery Arts: Plant Propagation and Planting": a(
    "Grow a Cutting",
    "Try a simple way to grow a new plant.",
    [
      "Take a stem cutting of kangkong, camote tops or san francisco and put it in water or soil.",
      "Write the date and draw or photograph it.",
      `After 3 days, write what changed. ${NO_TOOLS}`,
    ],
    "Your notes and a photo or drawing of your cutting.",
  ),
  "Industrial Arts: Basic Wiring": a(
    "Draw a Circuit",
    "Show how a simple circuit works.",
    [
      "Draw a circuit with a battery, a switch and a bulb, using circuit symbols.",
      "Label each part.",
      "Write what happens to the bulb when the switch is open and when it is closed.",
    ],
    "A photo of your labeled diagram and your answer.",
  ),

  // ------------------------------------------------------- Cookery (9–10)
  "Preparing Appetizers": a(
    "Simple Canapé",
    "Plan or make an easy appetizer.",
    [
      "Choose an easy appetizer (crackers with egg spread, fruit skewers, cucumber bites).",
      "List the ingredients and 4 steps to prepare it.",
      `Make it if you can and take a photo. ${NO_TOOLS}`,
    ],
    "Your ingredients, steps, and a photo if you made it.",
  ),
  "Preparing Egg Dishes": a(
    "Egg Three Ways",
    "Know different ways to cook eggs.",
    [
      "Write the steps for 3 egg dishes: boiled, scrambled and sunny side up.",
      "Write how long each one cooks.",
      `Cook one with an adult and take a photo. ${NO_TOOLS}`,
    ],
    "Your steps and times for 3 dishes, and a photo if you cooked.",
  ),
  "Preparing Starch and Cereal Dishes": a(
    "Perfect Rice",
    "Cook rice or a cereal dish properly.",
    [
      "Write the steps to cook rice or lugaw, including the water-to-rice ratio.",
      "List 2 signs that it is cooked well.",
      `Cook it with an adult and take a photo. ${NO_TOOLS}`,
    ],
    "Your steps, the 2 signs, and a photo if you cooked.",
  ),
  "Preparing Vegetable Dishes": a(
    "Veggie Plate",
    "Prepare vegetables to keep them healthy and colorful.",
    [
      "Pick a vegetable dish (ginisang monggo, chopsuey, pinakbet).",
      "List the vegetables and how you cut each one.",
      `Write 2 tips to keep vegetables colorful and nutritious. ${NO_TOOLS}`,
    ],
    "Your dish, cuts, and 2 tips (a photo is a bonus).",
  ),

  // ------------------------------------------------- Agri-crop (9–10 ACP)
  "Nursery Operations": a(
    "Mini Nursery Plan",
    "Plan a small seedling nursery.",
    [
      "Draw a simple nursery area: seedbed, shade, water source.",
      "List 4 materials you need.",
      "Write how often seedlings should be watered and why.",
    ],
    "A photo of your plan, your materials and your watering answer.",
  ),
  "Crop Establishment": a(
    "Planting Calendar",
    "Plan when and how to plant a crop.",
    [
      "Choose one crop (pechay, tomato, eggplant).",
      "Write the best month to plant it and the distance between plants.",
      "List 3 steps to prepare the soil before planting.",
    ],
    "Your crop, planting month, spacing and 3 steps.",
  ),
  "Crop Care and Maintenance": a(
    "Plant Doctor",
    "Check plants for problems and care for them.",
    [
      "Look at a plant at home or school.",
      "Write its condition: leaves, pests, soil, water.",
      "Suggest 2 care steps (weeding, watering, natural pest control).",
    ],
    "Your plant check and 2 care steps (a photo is a bonus).",
  ),
  "Harvest and Postharvest": a(
    "Harvest Right",
    "Know when and how to harvest and store crops.",
    [
      "Pick one vegetable or fruit.",
      "Write 2 signs it is ready to harvest.",
      "Write how to clean, sort and store it so it lasts longer.",
    ],
    "Your crop, the 2 signs, and the storage steps.",
  ),

  // ------------------------------------------- Electrical (9–10 EIM)
  "Electrical Circuits": a(
    "Series or Parallel?",
    "Compare series and parallel circuits.",
    [
      "Draw a series circuit and a parallel circuit, each with 2 bulbs.",
      "Write what happens to the other bulb if one bulb is removed, in each.",
      "Say which type your house uses, and why.",
    ],
    "Your two diagrams and your answers.",
  ),
  "Installing Wiring Devices": a(
    "Know the Devices",
    "Identify wiring devices and their uses.",
    [
      "List 5 wiring devices (switch, outlet, circuit breaker, junction box, lamp holder).",
      "Write the use of each.",
      "Write 2 safety steps before installing any device.",
    ],
    "Your 5 devices with uses and 2 safety steps.",
  ),
  "Residential Wiring": a(
    "House Wiring Plan",
    "Plan simple wiring for one room.",
    [
      "Draw the floor plan of one room in your house.",
      "Mark where the switch, outlets and light are, using electrical symbols.",
      "Write the wire size you would use for outlets and for lights.",
    ],
    "A photo of your plan and the wire sizes.",
  ),
  "Testing and Maintenance": a(
    "Tester Check",
    "Know how to test and maintain electrical lines.",
    [
      "Name 3 testing tools (test light, multimeter, megger) and what each checks.",
      "Write the steps to safely test if an outlet has power.",
      "List 2 maintenance tasks a home should do every year.",
    ],
    "Your 3 tools, test steps and 2 maintenance tasks.",
  ),

  // ------------------------------------------- Computer Programming (9–10)
  "Computer Programming Careers and Computer Ergonomics": a(
    "My Workstation",
    "Set up a healthy computer workstation.",
    [
      "Look at the computer area you use (or draw one).",
      "Check 4 things: screen at eye level, chair height, wrist position, lighting.",
      "Name one programming career you like and one skill it needs.",
    ],
    "Your 4-point check and your career with its skill.",
  ),
  "HTML Structure and HTML Editors": a(
    "My First Page",
    "Write a basic HTML page from scratch.",
    [
      "Write the basic structure: <!DOCTYPE html>, <html>, <head>, <title>, <body>.",
      "Inside the body, add your name in an <h1> and one sentence about you in a <p>.",
      "Open it in a browser or Momo's Code Quest editor and take a screenshot.",
    ],
    "Your code and a screenshot (or a photo of your handwritten code).",
  ),
  "Headings, Paragraphs, Styles and Formatting": a(
    "Format My Bio",
    "Use headings, paragraphs and formatting tags.",
    [
      "Make a page with an <h1> title and two <h2> sections: 'Hobbies' and 'Goals'.",
      "Add a paragraph under each, using <b> and <i> at least once.",
      "Add one inline style, like changing a heading's color.",
    ],
    "Your code (and a screenshot if you can).",
  ),
  "Multimedia, Lists and Tables": a(
    "Class Schedule Table",
    "Build a table and a list in HTML.",
    [
      "Create a <table> of your class schedule with 3 rows: Time, Subject, Teacher.",
      "Add an unordered list <ul> of 3 things in your bag.",
      "Add one image with <img> and an alt text.",
    ],
    "Your code (and a screenshot if you can).",
  ),
  "HTML Forms and Links": a(
    "Sign-Up Form",
    "Make a simple form with links.",
    [
      "Create a <form> with a text input for name, an email input and a submit button.",
      "Add a <label> for each input.",
      "Add one link with <a href> to your school's or DepEd's website.",
    ],
    "Your code (and a screenshot if you can).",
  ),
  "Developing a Website": a(
    "Plan My Site",
    "Plan a small website before coding.",
    [
      "Choose a topic for a 3-page website (my barangay, my hobby, our school).",
      "Draw a site map showing the 3 pages and how they link.",
      "Sketch the layout of the home page: header, menu, content, footer.",
    ],
    "A photo of your site map and home page sketch.",
  ),
  "Introduction to CSS": a(
    "Style It",
    "Use CSS to style a page.",
    [
      "Take any page you made and add a <style> block in the head.",
      "Change the body's background color, the font of h1, and the color of paragraphs.",
      "Use one class selector on an element.",
    ],
    "Your CSS code (and a screenshot if you can).",
  ),
  "CSS Spacing, Links, Lists, Tables and Animation": a(
    "Polish the Page",
    "Use spacing, link states and a simple animation.",
    [
      "Add margin and padding to a box or paragraph.",
      "Style links for :hover with a different color.",
      "Add a simple animation, like a button that changes color, using @keyframes or transition.",
    ],
    "Your CSS code (and a screenshot if you can).",
  ),
  "CSS Box Model, Box Shadow and Transform": a(
    "Profile Card",
    "Make a card using the box model, shadow and transform.",
    [
      "Make a div 'card' with width, padding, border and margin.",
      "Give it a box-shadow and rounded corners.",
      "Make it grow slightly on hover with transform: scale(1.05).",
    ],
    "Your HTML and CSS (and a screenshot if you can).",
  ),
  "Creating an Interactive Website": a(
    "Click to Reveal",
    "Add simple interactivity to a page.",
    [
      "Add a button to a page you made.",
      "When clicked, show a hidden message (with JavaScript onclick or the <details> tag).",
      "Test it and describe what happens in one sentence.",
    ],
    "Your code, plus a screenshot or your one-sentence description.",
  ),

  // ------------------------------------------------- Telecommunications
  "The Contact Center Industry": a(
    "Contact Center Map",
    "Know the contact center industry in the Philippines.",
    [
      "List 3 kinds of services a contact center provides (customer service, tech support, sales).",
      "Name one company or city in the Philippines known for contact centers.",
      "Write 2 reasons why the industry is important to Filipinos.",
    ],
    "Your 3 services, the company or city, and your 2 reasons.",
  ),
  "Call Types and Contact Center Duties": a(
    "Inbound or Outbound?",
    "Tell call types apart.",
    [
      "Write 2 examples of inbound calls and 2 of outbound calls.",
      "For one of them, list 3 duties of the agent on that call.",
      "Say which type you would prefer to handle, and why.",
    ],
    "Your 4 examples, the 3 duties, and your answer.",
  ),
  "Skills, Attributes and Services": a(
    "Agent Self-Check",
    "Reflect on the skills of a good agent.",
    [
      "List 5 skills or attributes of a good contact center agent.",
      "Rate yourself 1 to 5 on each.",
      "Pick your lowest one and write one way to improve it.",
    ],
    "Your list with ratings and your improvement plan.",
  ),
  "Phone Etiquette": a(
    "Polite Lines",
    "Practice phone etiquette with polite phrases.",
    [
      "Write a proper greeting for answering a business call.",
      "Write how to politely ask a caller to hold, and how to thank them after.",
      "Practice saying all three aloud (try Speak Up! in Games).",
    ],
    "Your three lines (a voice recording is a bonus).",
  ),
  "Contact Center Metrics": a(
    "Know the Numbers",
    "Understand common contact center metrics.",
    [
      "Write what AHT, CSAT and FCR mean.",
      "An agent took 5 calls of 4, 6, 5, 3 and 7 minutes. Compute the average handle time.",
      "Write one tip to improve CSAT.",
    ],
    "The 3 meanings, your AHT solution, and your tip.",
  ),
  "Accuracy and Fluency in Communication": a(
    "Spell It Right",
    "Use the phonetic alphabet for accuracy.",
    [
      "Spell your full name using the phonetic alphabet (A as in Alpha …).",
      "Spell your barangay's name the same way.",
      "Practice reading both aloud clearly twice.",
    ],
    "Your two phonetic spellings.",
  ),
  "Accounts and Call-Handling Procedures": a(
    "Verify the Caller",
    "Follow a verification procedure.",
    [
      "Write 3 questions an agent asks to verify a caller's identity.",
      "Write what the agent should say if the caller cannot be verified.",
      "Explain in one sentence why verification protects the customer.",
    ],
    "Your 3 questions, the polite reply, and your sentence.",
  ),
  "Performing a Call Flow": a(
    "Mini Call Script",
    "Write a complete short call flow.",
    [
      "Write a short script for a customer asking about a data promo.",
      "Include all steps: opening, probing, solution, closing.",
      "Practice reading it aloud with a partner or by yourself.",
    ],
    "Your script with the 4 steps labeled.",
  ),

  // --------------------------------------- Aquaculture & food processing (8)
  "Introduction to Aquaculture and Fisheries": a(
    "Fish Around Us",
    "Know common aquaculture species.",
    [
      "List 4 fish or seafood commonly farmed in the Philippines (bangus, tilapia, seaweed, shrimp).",
      "Write where each is usually raised: pond, cage or sea.",
      "Write one reason why aquaculture is important.",
    ],
    "Your list of 4 with places, and your reason.",
  ),
  "Fisheries Law, Species, Safety and Organic Aquaculture": a(
    "Fish Rules",
    "Know fisheries rules and safety.",
    [
      "Write 2 illegal fishing practices (dynamite, fine nets, cyanide).",
      "Write why they harm the environment.",
      "Write 2 safety practices for working near ponds or the sea.",
    ],
    "Your 2 practices, why they harm, and 2 safety tips.",
  ),
  "Aquaculture Methods and Facilities": a(
    "Design a Fish Pond",
    "Plan a simple fish pond or tank.",
    [
      "Draw a simple pond or tank with its water inlet and outlet.",
      "Label 3 facilities (screen, aerator, feeding area).",
      "Write the fish you would raise and how many.",
    ],
    "A photo of your drawing and your answers.",
  ),
  "Tools, Equipment and Fishing Gears": a(
    "Gear Guide",
    "Know fishing tools and their uses.",
    [
      "List 5 fishing tools or gears (net, hook, scoop net, basket, boat).",
      "Write the use of each.",
      "Write how to clean and store one of them.",
    ],
    "Your list of 5 with uses and the care steps.",
  ),
  "Making a Simple Hand Line": a(
    "Hand Line Steps",
    "Know how to make a simple hand line.",
    [
      "List the materials of a hand line (line, hook, sinker, float).",
      "Write the steps to assemble it, in order.",
      `Draw the finished hand line and label the parts. ${NO_TOOLS}`,
    ],
    "Your materials, steps and labeled drawing.",
  ),
  "Bait Methods and Post-Harvest Handling": a(
    "Keep It Fresh",
    "Handle fish properly after catching.",
    [
      "Write 2 kinds of bait and what fish they attract.",
      "Write 3 steps to keep fish fresh after catching (ice, shade, cleaning).",
      "Write 2 signs of fresh fish.",
    ],
    "Your baits, 3 steps, and 2 signs.",
  ),
  "Sorting, Grading and Storing Fish": a(
    "Sort the Catch",
    "Sort and grade fish by size and quality.",
    [
      "At the market or at home, look at a group of fish (or use a picture).",
      "Sort them into small, medium and large, and note the freshness of each.",
      "Write how to store each group: sell now, chill or freeze.",
    ],
    "Your sorting notes and storage plan.",
  ),
  "Introduction to Food Processing": a(
    "Processed at Home",
    "Spot processed foods at home.",
    [
      "List 5 processed foods in your home (dried fish, canned sardines, tocino …).",
      "Write the processing method used for each (drying, canning, curing, smoking).",
      "Write one benefit of processing food.",
    ],
    "Your list of 5 with methods, and one benefit.",
  ),
  "Food Processing Methods, Tools and Equipment": a(
    "Drying Plan",
    "Plan a simple food processing activity.",
    [
      "Choose one food to process (dried mango, salted egg, pickled papaya).",
      "List the tools and ingredients you need.",
      `Write the steps in order. ${NO_TOOLS}`,
    ],
    "Your food, tools, ingredients and steps.",
  ),
  "Quantification, Packaging and Labeling": a(
    "Make a Label",
    "Design a label for a processed food.",
    [
      "Choose a product (for example homemade banana chips).",
      "Draw a label with: product name, net weight, ingredients, expiry date and maker.",
      "Write the selling price per pack and how you computed it.",
    ],
    "A photo of your label and your price computation.",
  ),

  // ------------------------------------------- Beauty care & garments (8)
  "Introduction to Beauty Care and Wellness": a(
    "Wellness Routine",
    "Plan a simple daily grooming routine.",
    [
      "Write your morning grooming routine in 5 steps.",
      "List the tools or products you use.",
      "Write one healthy habit that helps your skin and hair.",
    ],
    "Your 5-step routine, tools, and healthy habit.",
  ),
  "Laws, Trends and Challenges": a(
    "Beauty Trends",
    "Look at trends and rules in beauty care.",
    [
      "Name 2 current beauty or nail care trends.",
      "Write one possible health risk of a trend.",
      "Write one rule a salon must follow to keep clients safe.",
    ],
    "Your 2 trends, the risk, and the rule.",
  ),
  "Tools, Sanitation and Safety": a(
    "Clean Tools",
    "Sanitize beauty care tools properly.",
    [
      "List 5 nail or hair care tools.",
      "Write how to clean and sanitize each.",
      "Write 2 safety rules when using sharp tools.",
    ],
    "Your 5 tools with sanitation steps, and 2 rules.",
  ),
  "Hand Spa Services": a(
    "Hand Spa Steps",
    "Know the steps of a hand spa.",
    [
      "List the materials needed for a simple hand spa.",
      "Write the steps in order (soak, scrub, massage, moisturize).",
      `Try it on your own hands if you can. ${NO_TOOLS}`,
    ],
    "Your materials and steps (a photo is a bonus).",
  ),
  "Introduction to Making Garments": a(
    "Sewing Kit",
    "Know basic sewing tools.",
    [
      "List 6 sewing tools (needle, thread, pins, tape measure, scissors, thimble).",
      "Write the use of each.",
      "Write how to thread a needle and tie a knot, in steps.",
    ],
    "Your 6 tools with uses and the steps.",
  ),
  "Pattern Drafting and Handicrafts": a(
    "Take Measurements",
    "Take body measurements for a pattern.",
    [
      "With a tape measure (or string and ruler), measure a family member's chest, waist and hip.",
      "Record the measurements in centimeters or inches.",
      "Write one tip for taking accurate measurements.",
    ],
    "Your measurements and your tip.",
  ),
  "Making Handicrafts": a(
    "Upcycled Craft",
    "Make a simple craft from recycled materials.",
    [
      "Choose recycled materials (bottles, cartons, old cloth).",
      "Make a simple useful item (pen holder, coin purse, coaster).",
      `Write the materials and steps you used. ${NO_TOOLS}`,
    ],
    "A photo of your craft, plus materials and steps.",
  ),

  // --------------------------------------------- Industrial arts (8 IA)
  "Signs and Symbols": a(
    "Symbol Hunt",
    "Read safety signs and electrical symbols.",
    [
      "Find 3 safety signs at school or in public (exit, no smoking, high voltage).",
      "Draw each and write what it means.",
      "Draw 3 electrical symbols (switch, outlet, bulb) and label them.",
    ],
    "A photo of your 3 signs and 3 symbols with labels.",
  ),
  Manuals: a(
    "Read the Manual",
    "Use a product manual to find information.",
    [
      "Find the manual of an appliance at home (or search for one online).",
      "Write 3 things it tells you: safety warnings, parts, or how to use it.",
      "Write why reading the manual first is important.",
    ],
    "The appliance, your 3 notes and your answer.",
  ),
  Consumables: a(
    "Shop Supplies",
    "Know consumable materials used in repair work.",
    [
      "List 5 consumables (electrical tape, solder, wire, screws, sandpaper).",
      "Write what each is used for.",
      "Write how to store them so they don't get wasted.",
    ],
    "Your list of 5 with uses and storage tips.",
  ),
  "Component Parts": a(
    "Inside an Appliance",
    "Name the parts of a simple appliance.",
    [
      "Choose an appliance (electric fan, flat iron, flashlight).",
      "Draw it and label 4 component parts.",
      "Write what each part does.",
    ],
    "A photo of your labeled drawing and the uses.",
  ),
  "Simple Diagnostics": a(
    "What's Wrong?",
    "Diagnose a common appliance problem.",
    [
      "Choose a problem: 'the electric fan won't turn on'.",
      "List 3 possible causes, from the simplest.",
      "Write how you would check each one safely.",
    ],
    "Your problem, 3 causes and the checks.",
  ),
  "Simple Troubleshooting": a(
    "Fix-It Steps",
    "Plan safe troubleshooting steps.",
    [
      "Pick a simple problem (a lamp that flickers, a loose plug).",
      "Write the troubleshooting steps in order, starting with unplugging.",
      "Write when you should call a technician instead.",
    ],
    "Your problem, steps, and when to call a technician.",
  ),
  "Repair Service Cost": a(
    "Price the Repair",
    "Compute the cost of a repair job.",
    [
      "Pretend you will fix an electric fan: list 2 parts and their prices.",
      "Add labor (for example ₱150) and compute the total.",
      "Write a simple receipt with the customer's name and the date.",
    ],
    "Your cost list, total and receipt.",
  ),

  // ------------------------------------------------------ Bread & pastry
  "Fundamentals of Baking Bread": a(
    "Bread Basics",
    "Know the ingredients and steps of bread.",
    [
      "List the 5 basic bread ingredients and the role of each (flour, yeast, water, salt, sugar).",
      "Write the main steps: mixing, kneading, proofing, shaping, baking.",
      `Bake pandesal with an adult if you can. ${NO_TOOLS}`,
    ],
    "Your ingredients with roles and the steps (a photo is a bonus).",
  ),
  "Pastry Products": a(
    "Pastry Plan",
    "Plan a simple pastry.",
    [
      "Choose a pastry (empanada, egg pie, cheese roll).",
      "List its ingredients and tools.",
      `Write the steps in order. ${NO_TOOLS}`,
    ],
    "Your pastry, ingredients, tools and steps.",
  ),
  "Cakes and Cake Products": a(
    "Cake Costing",
    "Plan a cake and compute its cost.",
    [
      "Choose a simple cake (chiffon, mamon, cupcake).",
      "List the ingredients with amounts and prices.",
      "Compute the total cost and the cost per slice.",
    ],
    "Your ingredients with prices and both costs.",
  ),
  "Traditional and Contemporary Petit Fours": a(
    "Mini Treats",
    "Know traditional and modern petit fours.",
    [
      "Name 2 traditional and 2 contemporary petit fours.",
      "Draw or describe how you would decorate one.",
      "Write how you would package them for selling.",
    ],
    "Your 4 examples, your decorating idea and your packaging plan.",
  ),

  // ------------------------------------------------- Events management
  "Conceptualizing an Event": a(
    "Event Idea",
    "Plan the concept of a simple school event.",
    [
      "Choose an event (class party, sports day, fundraising).",
      "Write its theme, date, place and target guests.",
      "List 3 activities for the program.",
    ],
    "Your event concept and 3 activities.",
  ),
  "Proposals, Programs and Legal Requirements": a(
    "Mini Proposal",
    "Write a short event proposal.",
    [
      "Write the event's goal in one sentence.",
      "Make a simple budget with 4 items and their costs.",
      "List 2 permits or approvals you need (principal, barangay).",
    ],
    "Your goal, budget and approvals.",
  ),
  "Managing an Event": a(
    "Event Day Checklist",
    "Prepare for the event day.",
    [
      "Make a checklist of 6 tasks for event day (setup, registration, sound, food, program, cleanup).",
      "Assign a person to each task.",
      "Write one backup plan if it rains.",
    ],
    "Your checklist with persons and your backup plan.",
  ),

  // ----------------------------------------------- Exploratory TLE 7
  "Careers, Tools and Farm Safety": a(
    "Farm Tools",
    "Know farm tools and safety.",
    [
      "List 5 farm tools (bolo, shovel, rake, sprinkler, wheelbarrow).",
      "Write the use of each.",
      "Write 2 safety rules when using farm tools.",
    ],
    "Your 5 tools with uses and 2 rules.",
  ),
  "Crop Production": a(
    "Grow a Vegetable",
    "Plan how to grow a vegetable.",
    [
      "Choose a vegetable (pechay, okra, kangkong).",
      "Write the steps from planting to harvest.",
      "Write how many days until harvest.",
    ],
    "Your vegetable, steps and days to harvest.",
  ),
  "Poultry and Livestock": a(
    "Animal Care",
    "Know the needs of farm animals.",
    [
      "Choose one animal (chicken, pig, goat).",
      "Write its needs: food, water, shelter and health care.",
      "Write one product we get from it.",
    ],
    "Your animal, its needs and one product.",
  ),
  "Hospitality and Tourism": a(
    "Welcome Guide",
    "Promote a tourist spot near you.",
    [
      "Choose a tourist spot in your town or province.",
      "Write 3 reasons tourists should visit it.",
      "Write how you would welcome and help a visitor there.",
    ],
    "Your spot, 3 reasons and your welcome.",
  ),
  "Food Preparation and Service": a(
    "Set the Table",
    "Set a table for a simple meal.",
    [
      "Draw a table setting for one person: plate, spoon, fork, glass, napkin.",
      "Label each item in the correct place.",
      "Write 2 rules of good table service.",
    ],
    "A photo of your drawing and 2 rules.",
  ),
  "Industrial Arts Services and Standards": a(
    "Shop Safety",
    "Know safety standards in a workshop.",
    [
      "List 4 personal protective equipment (PPE) items and what each protects.",
      "Write 3 workshop safety rules.",
      "Write why following standards matters.",
    ],
    "Your 4 PPE items, 3 rules and your answer.",
  ),
  "Tools, Measurement and Calculation": a(
    "Measure It",
    "Measure and compute with real objects.",
    [
      "Measure the length and width of a table or door in centimeters.",
      "Convert both to meters and inches.",
      "Compute the area in square meters.",
    ],
    "Your measurements, conversions and area.",
  ),

  // -------------------------------------------- Exploratory TLE 9
  "Wellness Massage": a(
    "Relaxing Routine",
    "Know the basics of a wellness massage.",
    [
      "Name 3 massage strokes and what each does.",
      "Write 3 times when massage should NOT be given (fever, wounds …).",
      "Write how to prepare a calm massage area.",
    ],
    "Your 3 strokes, 3 cautions and your preparation.",
  ),
  "Caregiving for Newborns, Infants and Toddlers": a(
    "Baby Care Plan",
    "Plan a day of caring for a baby.",
    [
      "Write a simple daily schedule for an infant: feeding, bath, sleep, play.",
      "List 3 safety tips for caring for babies.",
      "Write one sign that a baby needs a doctor.",
    ],
    "Your schedule, 3 tips and one sign.",
  ),
  "Processing and Selling Foods": a(
    "Snack Business",
    "Plan a small food business.",
    [
      "Choose a snack to sell (banana cue, turon, polvoron).",
      "Compute the cost of ingredients for 10 pieces and set a selling price.",
      "Write your profit and one way to attract buyers.",
    ],
    "Your snack, cost, price, profit and idea.",
  ),
  "Fruit Juices and Beverages": a(
    "Fresh Juice",
    "Prepare a healthy drink.",
    [
      "Choose a fruit drink (calamansi juice, buko juice, mango shake).",
      "List ingredients and steps.",
      `Make it if you can and take a photo. ${NO_TOOLS}`,
    ],
    "Your drink, ingredients and steps (a photo is a bonus).",
  ),
  "Kitchen Operations and Basic Culinary Preparation": a(
    "Knife Cuts",
    "Know basic knife cuts.",
    [
      "Write the names of 4 knife cuts (julienne, dice, mince, slice).",
      "Write which vegetable you would cut with each.",
      `Practice one cut with an adult and take a photo. ${NO_TOOLS}`,
    ],
    "Your 4 cuts with vegetables (a photo is a bonus).",
  ),
  "Baking and Bread": a(
    "Baking Tools",
    "Know baking tools and measurements.",
    [
      "List 5 baking tools and their uses.",
      "Write the difference between measuring dry and liquid ingredients.",
      "Write one tip for a successful bake.",
    ],
    "Your 5 tools, the difference and your tip.",
  ),

  // ------------------------------------- Food & beverage services (11)
  "Principles of Food and Beverage Operations": a(
    "Restaurant Roles",
    "Know the roles in a restaurant.",
    [
      "List 4 jobs in a restaurant (server, cook, cashier, host) and their duties.",
      "Write 2 rules of good customer service.",
      "Write one way to handle a customer complaint politely.",
    ],
    "Your 4 roles, 2 rules and your answer.",
  ),
  "Restaurant, Beverage and In-Room Service": a(
    "Take the Order",
    "Practice taking a customer's order.",
    [
      "Write a short dialogue: greeting, taking the order, repeating it back.",
      "Include one suggestion of a drink or dessert.",
      "End with a polite closing.",
    ],
    "Your dialogue.",
  ),
  "Preparing Beverages and Cashiering": a(
    "Count the Change",
    "Practice preparing a drink and giving change.",
    [
      "Write the steps to make a simple drink (iced tea, coffee).",
      "A customer orders 2 drinks at ₱45 each and pays ₱200. Compute the change.",
      "Write how to count change back to the customer politely.",
    ],
    "Your steps, the change computation and your answer.",
  ),
};
