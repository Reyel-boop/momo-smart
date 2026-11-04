/**
 * Events Management Services, Grade 11 — a Technical-Professional elective of
 * DepEd's Strengthened Senior High School Curriculum (Hospitality and
 * Tourism), taken from its Three-Term Budget of Work. One unit per term; one
 * lesson per learning competency, each with a written lecture, the Budget of
 * Work's two activities and a self-check, and every unit with five Unit
 * Questions and five more for Live Quiz. Each term's last lesson also carries
 * that term's performance tasks.
 */
import type { DemoLesson, DemoSubject, DemoUnit } from "../grade10";
import { q, TLE_DEPARTMENT } from "./common";

/**
 * The lecture video for each lesson (YouTube id). Each was checked to exist
 * and allow embedding, and chosen by its title and channel for covering the
 * lesson’s topic — Philippine Events Management lessons where there is one.
 */
export const EVENTS_VIDEOS: Record<string, string> = {
  "History and Evolution of Event Management": "SrkaT-rtM08", // History of an Event Management — Evenovative
  "Careers in Events Management": "H6Kzuh6SuEQ", // Events Manager Career — Hashtag Career Goals
  "Event Concepts and Themes": "UGVQludJ7sM", // Event Management Basics: The 5 W’s — International Institute of Live Events
  "SOAR Analysis": "d99QTRc_GKw", // SOAR Analysis Explained — EPM
  "Budget Allocation for an Event": "-bi58Y7IpeE", // How to Create an Event Budget — Savvy Social Events
  "Event Branding": "6JF6YfG_XAg", // How to Get Event Branding Right — The Sussex Sign Company
  "Preparing an Event Proposal": "9Xmq9gaKyz4", // Develop an Event Proposal, Events Management Services NC III — Teacher Dha
  "Contingency Planning": "9ASt3o1PoTg", // How to Create a 6-step Contingency Plan — Mike Clayton
  "Event Proposals and Bidding": "l0hVIH3EnlQ", // The Secret to Successfully Pitching an Idea — TED
  "Developing an Event Program": "Hhim4HtdR6Y", // How to Create a Run of Show for Your Event — vFairs
  "Venue Selection Checklist": "WvsOOC-CXNc", // Guide on Choosing a Venue for Your Event — Rowell Octavio
  "Legal and Regulatory Requirements": "yn_yuV3n5lY", // Event Planning Licenses and Permits — Business Licensing
  "Ethics in Event Management": "Ix8PkA4PGGM", // The Role of Ethics in Convention and Event Industry — Den Paul Resos
  "Checklist of Legal Documents": "GlsLmeiucUc", // Event Planning Contract Essentials — Social Tables
  "Managing Contractors": "IMm0TXBHvr4", // Manage Contractors for Indoor Events, Part 1 — Teacher Frankikay
  "Executing an Event with Contractors": "EJEqTUR3Nnk", // Manage Contractors for Indoor Events, Part 2 — Teacher Frankikay
  "Preparing an Event Portfolio": "dCxiylrtPlY", // How to Build Your Event Planning Portfolio — Event Planning
  "Managing an Event": "b3B24wl3gCQ", // Intro to Event Planning and Management — Jeff Su
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
  lecture: { videoId: EVENTS_VIDEOS[title] ?? "", lecture },
});

const UNITS: DemoUnit[] = [
  // 1st Term
  {
    title: "Conceptualizing an Event",
    description:
      "The history of events, careers in the industry, concepts and themes, SOAR analysis, budgets, and event branding.",
    lessons: [
      lesson(
        "History and Evolution of Event Management",
        "How gatherings grew into a profession.",
        `## What is event management?
**Event management** is planning, organizing and running a gathering so that it meets a goal — for the client and for the guests. An **event** is a planned gathering with a purpose, a date and an audience.

## Major milestones
- **Ancient times** — religious festivals and the **Olympic Games** of Greece (776 BC), and the public games of Rome, were already organized for huge crowds.
- **Middle Ages** — **trade fairs** and market days brought merchants and buyers together.
- **1851** — the **Great Exhibition** in London showed what a large, international exhibition could be, and world's fairs followed.
- **Late 1800s to 1900s** — railways and hotels made travel easy, so **conventions** and meetings grew, and cities began promoting themselves as places to meet.
- **1984** — the Los Angeles Olympics showed that **sponsorship** could pay for a giant event.
- **2000s** — online registration, email and **social media** changed how events are promoted and sold.
- **2020** — the COVID-19 pandemic pushed organizers to **virtual** and **hybrid** events, part in person and part online.

## Events in the Philippines
- **Fiestas** have long been our community events: a patron saint, a program, food and a whole town taking part.
- Festivals such as **Sinulog**, **Ati-Atihan**, **Panagbenga** and **Kadayawan** now draw tourists from around the world.
- The **Philippine International Convention Center (PICC)** opened in 1976 and made Manila a venue for international meetings.
- **MICE** — Meetings, Incentives, Conventions and Exhibitions — is the tourism sector that the country promotes to bring these events here.

## Trends today
Hybrid events, sustainability (less plastic and waste), personalized guest experiences, and tools such as QR check-in and event apps.`,
        `## Activity 1: Event History Report
Research and write a report on the evolution of event management, highlighting major milestones and trends.

## Activity 2: Timeline Presentation
Create a visual timeline of the development of event management practices and present it to the class.`,
        [
          "What is event management?",
          "Give three milestones in the history of events.",
          "What does MICE stand for?",
        ],
      ),
      lesson(
        "Careers in Events Management",
        "Who works in events, and the skills each role needs.",
        `## Where event professionals work
Event companies, hotels and resorts, convention centers, corporate marketing teams, government tourism offices, schools, and non-profit organizations — or in a business of their own.

## Career opportunities
- **Event coordinator** — handles the details and keeps tasks on schedule. *Skills: organization, communication*
- **Wedding and debut planner** — plans personal celebrations with families. *Skills: patience, listening, styling*
- **Corporate event planner** — runs launches, conferences and team events. *Skills: budgeting, professionalism*
- **Exhibition organizer** — sets up trade fairs and manages booths. *Skills: logistics, sales*
- **Event stylist** — designs the look of the venue. *Skills: creativity, color and layout*
- **Technical producer** — manages lights, sound and LED walls. *Skills: technical knowledge, calm under pressure*
- **Sponsorship and sales officer** — finds partners and funding. *Skills: negotiation, persuasion*
- **Event marketer** — promotes the event and sells tickets. *Skills: writing, social media, design*
- **Host or emcee** — leads the program on stage. *Skills: public speaking, quick thinking*
- **Venue or banquet manager** — runs the space and its service team. *Skills: leadership, customer service*

## Skills every role shares
- **Communication** — clear with clients, suppliers and the team
- **Organization** — lists, timelines and follow-ups
- **Problem solving** — something always changes on event day
- **Teamwork** and **time management**
- **Grace under pressure** — staying calm so guests stay calm

## How to start
Volunteer at school events, join a student committee, and build a portfolio of what you've done. **TESDA** offers an **Events Management Services NC III** assessment for those who want a national certificate.`,
        `## Activity 1: Career Research Paper
Identify at least 5 careers in event management and explain the skills required for each.

## Activity 2: Career Panel Simulation
Prepare a mock career panel discussion highlighting different roles in the event industry.`,
        [
          "Name five careers in event management.",
          "What does an event stylist do?",
          "Why is problem solving needed in every event role?",
        ],
      ),
      lesson(
        "Event Concepts and Themes",
        "The big idea behind an event, and why it matters to a proposal.",
        `## Concept and theme: what's the difference?
- **Concept** — the big idea: what the event is, who it is for, and what it should make people feel or do. It answers **why**.
- **Theme** — how the concept is expressed: the story, look and mood that guests can see and feel.

*Example:* a school's foundation day has the **concept** "honoring the people who built our school". Its **theme** is "Then and Now", with old photos, vintage decor and alumni stories.

## Start with the 5 W's
- **Why** — the purpose. Celebrate? Raise funds? Launch something?
- **Who** — the client and the audience: age, interests, number
- **What** — the type of event
- **When** — date, time, length
- **Where** — the kind of space that fits

## Why they matter in a proposal
- They give every decision a **direction**: decor, food, music, invitations and program all match.
- They help the client **picture** the event before spending money.
- They make the event **memorable** and different from others.
- They keep the team and suppliers working toward the same idea.

## What makes a good theme?
- **Fits the client's goal** and the audience
- **Fits the budget** — a beautiful theme you can't afford is a bad theme
- **Respects culture and beliefs** — never turn a sacred tradition or a people's identity into a costume
- **Can be seen** in the venue, the program, the food and the invitations
- **Is easy to say** and to remember`,
        `## Activity 1: Concept Analysis
Choose an event type and explain how a concept and theme influence the planning and execution.

## Activity 2: Theme Proposal
Develop 3 potential themes for a given event and justify their suitability to the client's goals.`,
        [
          "What is the difference between a concept and a theme?",
          "What are the 5 W's of an event?",
          "Why must a theme fit the budget?",
        ],
      ),
      lesson(
        "SOAR Analysis",
        "Strengths, Opportunities, Aspirations and Results.",
        `## What is SOAR?
**SOAR** is a planning tool that looks at what is **working** and what could be, instead of starting from problems. It helps a team build an event proposal on what it already does well.

- **S — Strengths**: What are we good at? What do we already have?
- **O — Opportunities**: What outside chances can we use?
- **A — Aspirations**: What do we hope to become or achieve?
- **R — Results**: How will we measure success?

## SOAR and SWOT
**SWOT** lists Strengths, Weaknesses, Opportunities and Threats. **SOAR** keeps the strengths and opportunities, but swaps weaknesses and threats for aspirations and results. It looks forward and gets a team excited. You still deal with risks — in your **contingency plan**.

## Sample: a school Food and Culture Fair
- **Strengths** — creative student officers; a free covered court; teachers who support us
- **Opportunities** — parents who run food businesses; the town fiesta in the same month; a barangay that wants youth activities
- **Aspirations** — to make the fair a yearly tradition and raise funds for the school library
- **Results** — 300 visitors, 15 booths, ₱10,000 raised, and at least 80% of guests rating the fair "very good"

## Tips
- Answer the questions **as a group** and write down every idea before choosing.
- Keep Results **measurable**: use numbers, not words like "many" or "successful".
- Use your SOAR in the proposal: strengths show why the client should trust you, and results show what the client will get.`,
        `## Activity 1: Individual SOAR Analysis
Prepare a SOAR (Strengths, Opportunities, Aspirations, Results) analysis for a sample event proposal.

## Activity 2: Group SOAR Discussion
Discuss and compare SOAR analyses in a group, then consolidate into one improved version.`,
        [
          "What does SOAR stand for?",
          "How is SOAR different from SWOT?",
          "Give one measurable result for a school event.",
        ],
      ),
      lesson(
        "Budget Allocation for an Event",
        "Projecting income and expenses, and setting aside a contingency.",
        `## What is an event budget?
A **budget** is a plan for the money: how much will come in, how much will go out, and where it will go. **Budget allocation** means deciding how much of the total each part of the event gets.

## Income (revenue)
Tickets or registration fees, sponsors, booth rentals, merchandise, donations, and the client's own funds.

## Expenses
- **Fixed costs** stay the same however many guests come: venue rental, sound system, stage.
- **Variable costs** change with the number of guests: food, giveaways, printed programs.
- **Contingency** is money set aside for surprises, commonly **10–15%** of the expenses.

## How to build it
1. Know the **total** the client can spend, or the income you expect.
2. **List every item** — venue, food, decor, sound, printing, prizes, transport, permits, staff.
3. Get **quotations** from at least three suppliers. Don't guess.
4. **Allocate** the money, putting the most important items first.
5. Add the **contingency**.
6. **Track** the actual spending beside the plan.

## Sample budget: a Grade 11 acquaintance party
| Item | Amount |
|---|---|
| 120 tickets × ₱100 | ₱12,000 |
| Sponsors | ₱3,000 |
| **Total income** | **₱15,000** |
| Food | ₱6,000 |
| Sound system | ₱2,500 |
| Decorations | ₱2,000 |
| Prizes | ₱1,500 |
| Printing | ₱1,000 |
| **Subtotal** | **₱13,000** |
| Contingency (10%) | ₱1,300 |
| **Total expenses** | **₱14,300** |
| **Left over** | **₱700** |

## Break-even
**Break-even** is the point where income equals expenses. If expenses are ₱14,300 and sponsors give ₱3,000, tickets must bring in ₱11,300 — at ₱100 each, that is **113 tickets**.`,
        `## Activity 1: Event Budget Worksheet
Prepare a detailed budget for a proposed event including projected expenses and revenues.

## Activity 2: Budget Presentation
Present your budget plan to a group and explain allocation decisions.`,
        [
          "What is the difference between a fixed cost and a variable cost?",
          "Why does a budget need a contingency?",
          "Expenses are ₱5,000 and tickets cost ₱50. How many tickets break even?",
        ],
      ),
      lesson(
        "Event Branding",
        "Name, logo, tagline and colors — and using them in a proposal.",
        `## What is event branding?
**Event branding** gives an event its own identity, so people recognize it and remember how it felt. A brand is more than a logo: it is everything guests see, hear and experience.

## The key elements
- **Event name** — short, easy to say, and connected to the purpose
- **Theme** — the story behind the look
- **Tagline** — one short line that sums up the event
- **Logo or symbol** — a simple mark that still reads when small
- **Color scheme** — two to four colors used everywhere
- **Typography** — one or two fonts that fit the mood
- **Voice** — how the event "talks": formal, friendly or playful

## Where branding appears
Invitations and tickets, posters and social media posts, the stage backdrop, signs and booths, ID lanyards, staff shirts, giveaways, and even the emcee's script.

## Rules for good branding
- **Be consistent.** The same name, logo and colors on everything.
- **Know your audience.** A youth fair and a retirement dinner shouldn't look alike.
- **Keep it simple.** Too many colors and fonts look messy.
- **Make it readable.** Check that text can be read from far away.
- **Use only what you may use.** Don't copy another event's logo or use photos without permission.

## Branding in a proposal
A proposal includes a **branding package**: the name, logo, theme, tagline and colors, plus a sample poster or social media layout. It lets the client see the event before it exists.

*Example:* **Hataw 2027**, a school sports fest. Tagline: *"One School. One Spirit."* Colors: blue and gold. Logo: a running figure inside a sun.`,
        `## Activity 1: Branding Concept Paper
Identify key branding elements for an event and explain their relevance in a proposal.

## Activity 2: Branding Mock Proposal
Create a mini event proposal applying the branding elements for a hypothetical client.

## 1st Term Performance Tasks
**Individual: Event Branding Draft.** Create a branding outline for a small event of your choice. Include:
- Event name
- Theme and tagline
- Logo or symbol (a sketch is allowed)
- Color scheme

**Group: Event Proposal with Branding.** As a group, prepare a simple event proposal that shows clear event branding. Include:
- Event description
- Branding package (name, logo, theme, tagline, colors)
- Sample promotional material (a poster or social media layout)`,
        [
          "List five elements of event branding.",
          "Why must branding be consistent?",
          "What goes into a branding package?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which best describes event management?",
        [
          "Planning, organizing and running a gathering to meet a goal",
          "Selling tickets to concerts and shows",
          "Decorating a venue before guests arrive",
          "Hosting the program on stage",
        ],
        0,
        "Event management covers the whole work of planning, organizing and running an event so it meets its goal.",
      ),
      q(
        "In the sample school fair, “₱10,000 raised and 300 visitors” belongs to which part of SOAR?",
        ["Strengths", "Opportunities", "Aspirations", "Results"],
        3,
        "Results are the measurable signs of success, so they are written with numbers.",
      ),
      q(
        "Which of these is a variable cost?",
        [
          "Venue rental",
          "Stage setup",
          "Food for each guest",
          "Sound system rental",
        ],
        2,
        "Food changes with the number of guests. The others stay the same however many people come.",
      ),
      q(
        "A theme is best described as…",
        [
          "The amount the client will pay",
          "The story, look and mood that express the concept",
          "The list of suppliers for the event",
          "The time the event starts and ends",
        ],
        1,
        "The concept is the big idea; the theme is how guests see and feel that idea.",
      ),
      q(
        "Why should an event use the same name, logo and colors everywhere?",
        [
          "So people recognize and remember it",
          "So the printing costs more",
          "So suppliers can skip the contract",
          "So the theme can change every week",
        ],
        0,
        "Consistent branding makes an event easy to recognize and remember.",
      ),
    ],
    bank: [
      q(
        "What does MICE stand for?",
        [
          "Meetings, Incentives, Conventions and Exhibitions",
          "Music, Invitations, Catering and Entertainment",
          "Marketing, Income, Costs and Expenses",
          "Managers, Investors, Clients and Employees",
        ],
        0,
        "MICE is the tourism sector built around business meetings and events.",
      ),
      q(
        "A hybrid event is one that…",
        [
          "Has two different themes",
          "Is held both in person and online",
          "Has two clients sharing the costs",
          "Happens on two different dates",
        ],
        1,
        "Hybrid events have guests in the venue and online at the same time.",
      ),
      q(
        "Which career mainly finds partners and funding for an event?",
        [
          "Event stylist",
          "Technical producer",
          "Sponsorship and sales officer",
          "Host or emcee",
        ],
        2,
        "Sponsorship and sales officers use negotiation to bring in partners and funds.",
      ),
      q(
        "Expenses are ₱8,000. About how much is a 10% contingency?",
        ["₱80", "₱800", "₱1,800", "₱8,000"],
        1,
        "10% of ₱8,000 is ₱800.",
      ),
      q(
        "Which tool replaces weaknesses and threats with aspirations and results?",
        ["SOAR", "SWOT", "MICE", "Run of show"],
        0,
        "SOAR keeps strengths and opportunities and looks forward to aspirations and results.",
      ),
    ],
  },
  // 2nd Term
  {
    title: "Proposals, Programs and Legal Requirements",
    description:
      "Event proposals and bidding, contingency plans, event programs, venues, legal requirements, ethics and legal documents.",
    lessons: [
      lesson(
        "Preparing an Event Proposal",
        "Turning a client's wishes into a clear written plan.",
        `## What is an event proposal?
An **event proposal** is a document that explains how you will plan and run an event for a client, and what it will cost. Its job is to win the client's **approval**.

## Start with the client's preference
Before writing, ask and listen:
- What is the **purpose** of the event?
- Who are the **guests**, and how many?
- What is the **date**, and how long will it run?
- What is the **budget**?
- What do they **like** and **dislike**? What must not happen?

A short meeting like this is called a **client brief**. Write the answers down and confirm them with the client.

## Parts of a proposal
1. **Cover page** — event name, client, your team, date
2. **Event overview** — what the event is, in one short paragraph
3. **Objectives** — what the client wants to achieve
4. **Target audience** — who will attend
5. **Concept and theme** — with your branding package
6. **Date, time and venue**
7. **Program flow** — what happens, in order
8. **Services** — food, decor, sound, photo and video
9. **Budget** — a clear breakdown of costs
10. **Timeline** — what will be done, by when
11. **Team and roles**
12. **Risks and contingency**
13. **Terms** — payment schedule, cancellation, and signatures

## Writing tips
- Write **for the client**: mention their goal, not just your ideas.
- Be **specific**. "Buffet for 100 guests" is better than "food".
- Use **pictures**: moodboards, floor plans and sample designs.
- **Proofread.** A wrong client name can lose the job.
- Offer **options** if the budget is tight, and **revise** after feedback.`,
        `## Activity 1: Individual Proposal Draft
Prepare a draft event proposal aligned with a specific client's requirements.

## Activity 2: Proposal Review Workshop
Share proposals with peers and revise based on feedback to ensure client alignment.`,
        [
          "What is a client brief?",
          "List six parts of an event proposal.",
          "Why should a proposal mention the client's goals?",
        ],
      ),
      lesson(
        "Contingency Planning",
        "Spotting what could go wrong and deciding the response in advance.",
        `## What is a contingency plan?
A **contingency plan** is your **Plan B**: what the team will do if something goes wrong. A **risk** is anything that may harm the event, its people or its budget.

## Common event risks
- **Weather** — typhoon, heavy rain, extreme heat
- **Power** — brownouts and failed equipment
- **People** — injuries, fainting, lost children, fights, a speaker who doesn't arrive
- **Suppliers** — late delivery, cancelled booking, spoiled food
- **Money** — too few tickets sold, costs that go over budget
- **Emergencies** — fire and earthquake

## Four steps to plan
1. **Identify** — list everything that could go wrong.
2. **Assess** — rate each risk: **likelihood** (1–3) × **impact** (1–3). The highest scores come first.
3. **Respond** — choose how to handle it.
4. **Assign** — name who acts, and how they will tell the team.

## Four ways to respond
- **Avoid** — change the plan. *Move an outdoor event to a covered court.*
- **Reduce** — make it less likely or less harmful. *Rent a generator; test the sound early.*
- **Transfer** — share the risk. *Buy insurance; put penalties in the supplier's contract.*
- **Accept** — keep it, and set aside money. *Minor late starts.*

## Sample risk table
| Risk | Likelihood | Impact | Score | Response | Person |
|---|---|---|---|---|---|
| Heavy rain | 3 | 3 | 9 | Reserve the gym as backup | Logistics head |
| Brownout | 2 | 3 | 6 | Rent a generator | Technical head |
| Late speaker | 2 | 2 | 4 | Have a performance ready | Program head |

## Safety comes first
Know the **exits**, the **first aid** station, the **evacuation area**, and the emergency numbers. If people are in danger, stop the event. No program is worth a life.`,
        `## Activity 1: Risk Assessment Worksheet
Identify potential risks for a sample event and develop mitigation strategies.

## Activity 2: Contingency Scenario Simulation
Conduct a mock exercise responding to a potential event crisis using the contingency plan.`,
        [
          "What is a contingency plan?",
          "How do you score a risk?",
          "Give the four ways to respond to a risk.",
        ],
      ),
      lesson(
        "Event Proposals and Bidding",
        "Competing for a client and pitching your plan.",
        `## What is bidding?
In **bidding**, several event organizers submit proposals for the same event, and the client picks one. Government agencies and big companies often require it, so that the choice is fair and open.

## How bidding works
1. **The client announces the event.** It often sends a **Request for Proposal (RFP)** that lists what it needs, the budget and the deadline.
2. **Bidders ask questions** and study the requirements.
3. **Bidders submit** a proposal and a price.
4. **Selected bidders pitch** to a panel.
5. **The panel scores** the bids against its criteria.
6. **The client awards** the event, and a contract is signed.

## What clients look for
- **Follows the requirements** — miss one, and you may be disqualified
- **A strong concept** that fits the client
- **Value for money** — not always the lowest price
- **Experience** — a portfolio and past clients
- **A realistic plan** — timeline, team and contingency

## How to pitch
- **Open with the client's goal**, not with your company.
- **Tell a story**: walk the panel through the guest's experience, from arrival to goodbye.
- **Show** the design, a floor plan and sample materials.
- **Explain the budget** simply.
- **Divide the parts** among your team and rehearse with a timer.
- **Prepare for questions**: "What if it rains?" "Why this price?"
- **End with one clear reason** to choose you.

## Play fair
Don't copy another team's idea, promise what you can't deliver, or offer a gift to influence the panel.`,
        `## Activity 1: Proposal Simulation
Create a simulated event proposal and present it as if bidding for a client's event.

## Activity 2: Group Bidding Competition
Participate in a group simulation where teams pitch proposals to a "client" panel.`,
        [
          "What is an RFP?",
          "Why is the lowest price not always the winning bid?",
          "Give three tips for a good pitch.",
        ],
      ),
      lesson(
        "Developing an Event Program",
        "Planning what happens, in what order, and for how long.",
        `## Two kinds of program
- **Program of activities** — what guests see: the printed list of parts.
- **Run of show** — what the team uses: a minute-by-minute plan with who does what, including sound, lights and cues.

## A typical program flow
1. **Registration and arrival**
2. **Opening** — prayer, national anthem, welcome
3. **Main parts** — speakers, awards, performances, activities
4. **Meal or break**
5. **Closing** — thanks and closing remarks
6. **Send-off** — photos, giveaways, exit

## How to sequence an event
- **Start strong.** Guests decide quickly if the event is worth their time.
- **Keep energy moving.** Follow a long speech with something lively.
- **Put the highlight** where most guests will still be present, usually in the middle or near the end.
- **Plan breaks** — people need food and restrooms.
- **Allow for changeovers** — moving a stage setup takes time.
- **End on time** and on a high note.

## Sample run of show
| Time | Part | In charge | Technical cue |
|---|---|---|---|
| 1:00 | Registration | Registration team | Background music |
| 1:50 | Call to order | Emcee | Music fades |
| 2:00 | Prayer and anthem | Emcee | Play anthem track |
| 2:10 | Welcome remarks | Principal | Podium mic on |
| 2:20 | Intermission number | Dance Club | Play track 3, stage lights |
| 2:30 | Main activity | Program head | Slides on screen |

## Tips
- Assign a **time, a person and a cue** to every line.
- Add a **buffer** of a few minutes; programs run late.
- Share the final copy with the emcee, technical team and suppliers.
- Rehearse the hard parts, especially **transitions**.`,
        `## Activity 1: Event Program Draft
Develop a detailed program schedule for a sample event including timings, activities, and flow.

## Activity 2: Program Flow Presentation
Present the program to a group and explain the rationale for sequencing activities.`,
        [
          "What is the difference between a program and a run of show?",
          "Why should a long speech be followed by something lively?",
          "What three things should every line of a run of show have?",
        ],
      ),
      lesson(
        "Venue Selection Checklist",
        "Choosing the right place, and what to check when you visit.",
        `## Why the venue matters
The venue affects the budget, the guests' comfort, the program and the safety of everyone. Choosing it early also protects your date, since good places get booked quickly.

## Criteria for choosing a venue
- **Capacity** — fits the guests and your layout, within the legal limit
- **Location** — easy to reach, safe, near transport
- **Cost** — rental and extras: overtime, corkage, electricity, deposits
- **Availability** — free on your date, including setup and cleanup time
- **Fit** — matches the concept and the kind of event
- **Facilities** — tables, chairs, stage, air conditioning, Wi-Fi
- **Power and sound** — enough outlets, a generator, rules on noise
- **Restrooms** — enough, clean, and near the guests
- **Parking and loading** — space for guests, plus an area for suppliers
- **Accessibility** — ramps and elevators for persons with disabilities and seniors
- **Safety** — exits, fire extinguishers, first aid, security
- **Weather plan** — a covered space if the event is outdoors
- **Rules** — food, decor, noise, and closing time

## Using the checklist
1. List **three possible venues**.
2. Make an **ocular inspection**: visit in person, at the same time of day as your event.
3. **Rate** each one on the checklist. A simple 1–5 score works.
4. Take **photos and measurements**.
5. Compare scores, then **reserve** with a written agreement.

## Sample checklist
| Criteria | Venue A | Venue B |
|---|---|---|
| Capacity for 200 guests | 5 | 3 |
| Cost within budget | 3 | 5 |
| Parking and loading | 4 | 2 |
| Emergency exits | 5 | 4 |
| **Total** | **17** | **14** |`,
        `## Activity 1: Venue Checklist Creation
Create a checklist of criteria to evaluate venues for events.

## Activity 2: Venue Assessment Simulation
Apply the checklist to a real or hypothetical venue and report findings.`,
        [
          "Give five criteria for choosing a venue.",
          "What is an ocular inspection?",
          "Why should an outdoor event have a covered space ready?",
        ],
      ),
      lesson(
        "Legal and Regulatory Requirements",
        "The permits and laws that apply to different events.",
        `## Why it matters
An event can be stopped — or the organizer fined — if it runs without the right approvals. Laws also protect guests, workers and the community. Requirements **differ by city and by event**, so always ask the local government early.

## Common requirements in the Philippines
- **Barangay clearance** — from the barangay where the event is held
- **Mayor's or special event permit** — from the city or municipal hall
- **Fire safety clearance** — from the **Bureau of Fire Protection (BFP)** under the Fire Code, for venues and temporary structures
- **Sanitary permit and health certificates** — from the local health office, for food sellers and handlers
- **Police or traffic coordination** — for road closures, parades and large crowds
- **Public assembly permit** — for gatherings in public places such as streets and plazas
- **Amusement tax or ticket rules** — from the local treasurer, for paid shows
- **Music licensing** — public performance of copyrighted music may need a license, often through **FILSCAP**

## Requirements by type of event
| Event | Usually needs |
|---|---|
| School program on campus | School approval, safety plan |
| Off-campus school activity | School approval, parents' signed consent |
| Concert with tickets | Mayor's permit, fire clearance, security, tax, music license |
| Street parade or fun run | Mayor's permit, police and traffic support, medical team |
| Food fair | Mayor's permit, sanitary permit, health certificates |
| Trade fair with sales promos | Mayor's permit, DTI permit for promos |

## Laws to know
- **Fire Code of the Philippines (RA 9514)** — fire safety
- **Data Privacy Act (RA 10173)** — protects guests' personal data, such as registration forms and photos
- **Intellectual Property Code (RA 8293)** — protects music, logos and designs
- **Accessibility Law (BP 344)** — access for persons with disabilities

## Good habits
Start early, since permits take time. Keep copies of everything, and have them ready on event day. When unsure, ask the issuing office.`,
        `## Activity 1: Legal Requirements Report
Prepare a report summarizing the legal and regulatory requirements for different event types.

## Activity 2: Compliance Scenario Exercise
Analyze a sample event for compliance with legal requirements and propose adjustments.`,
        [
          "Which office gives fire safety clearance?",
          "Why do requirements differ between events?",
          "What does the Data Privacy Act protect at an event?",
        ],
      ),
      lesson(
        "Ethics in Event Management",
        "Doing what is right for clients, guests, workers and the community.",
        `## What is ethics?
**Ethics** means doing what is right, even when no rule forces you and no one is watching. What is legal is the minimum; what is ethical often asks for more. Clients trust an event organizer with their money, their guests and their name.

## Key ethical considerations
- **Honesty and transparency** — no hidden charges, no false promises, no fake reviews or attendance numbers
- **Safety** — never cut corners on guests' or workers' safety to save money
- **Inclusivity** — welcome people of every background, ability, age and belief
- **Fair treatment of workers** — fair pay, paid on time, safe hours, no abuse
- **Fair dealing with suppliers** — keep your word and pay what you agreed
- **Confidentiality** — protect client plans and guests' personal data
- **Conflict of interest** — don't choose a supplier for personal gain
- **Respect for culture** — treat traditions and sacred symbols with care
- **Care for the environment** — reduce waste, plastic and noise
- **Respect for creative work** — credit and pay for music, photos and designs

## Common dilemmas
- A supplier offers you a **kickback** if you pick them, and the client would pay more.
- The client asks you to **pack a venue past its limit** to earn more.
- You **find an error** in your own bill that favors you.
- A sponsor's product is **not suitable** for the guests, such as alcohol at a youth event.

## How to decide
1. **State the problem** and who is affected.
2. **Check the rules**: law, contract, school or company policy.
3. **List your options** and what each one causes.
4. **Ask**: Is this fair? Is it safe? Would I be comfortable if everyone knew?
5. **Act, then tell** the people who need to know.`,
        `## Activity 1: Ethics Case Study
Analyze an event scenario and identify potential ethical issues and solutions.

## Activity 2: Ethics Debate
Participate in a group debate discussing ethical dilemmas in event management.`,
        [
          "Give five ethical considerations in event management.",
          "What is a conflict of interest?",
          "What questions can help you decide what is right?",
        ],
      ),
      lesson(
        "Checklist of Legal Documents",
        "Keeping every permit, contract and form complete and valid.",
        `## Why a checklist?
A big event can need dozens of papers from many offices. A checklist shows at a glance what is **done**, what is **missing**, and who is responsible, so nothing is discovered on event day.

## Types of documents
**Permits and clearances** — barangay clearance, mayor's or special event permit, fire safety clearance, sanitary permit, traffic or road-use permit.

**Contracts** — client contract, venue agreement, supplier contracts, sponsorship agreements, performer or speaker agreements.

**Safety documents** — safety and evacuation plan, risk assessment, insurance, medical team arrangement, security plan.

**Consent forms** — parents' consent for minors, waivers for sports activities, photo and video consent, data privacy consent on registration forms.

**Financial documents** — quotations, invoices, official receipts, tax records.

## What every contract should state
- **The parties** — who is agreeing
- **Services** — exactly what will be delivered
- **Date, time and place**
- **Price and payment schedule**, including the deposit
- **Cancellation and refund terms**
- **Force majeure** — what happens in a typhoon or other event no one can control
- **Liability** — who answers for damage or injury
- **Signatures and date**

## Sample checklist
| Document | Issued by | In charge | Deadline | Status |
|---|---|---|---|---|
| Barangay clearance | Barangay hall | Secretary | Oct 1 | Done |
| Mayor's permit | City hall | Project head | Oct 10 | Pending |
| Fire safety clearance | BFP | Logistics head | Oct 10 | Pending |
| Venue agreement | Venue | Project head | Sept 15 | Done |
| Parents' consent | Parents | Class adviser | Oct 15 | Pending |

## Validating documents
Check that the **name, date and venue** are correct, that **signatures** are complete, that nothing has **expired**, and that all **attachments** are present. Keep the originals safe, with copies on site.`,
        `## Activity 1: Legal Document List
Create a checklist of all required legal documents for a specific type of event.

## Activity 2: Document Validation Simulation
Simulate reviewing an event proposal to ensure all legal documents are complete and valid.

## 2nd Term Performance Tasks
**Individual: Ethical Event Management Reflection.** Choose one planned or hypothetical event. Identify **three ethical considerations** (for example safety, transparency, inclusivity) and explain **how you would apply them** in managing the event.

**Group: Legal Documents Checklist Development.** As a group, create a **complete checklist of legal documents** needed for organizing an event. Include items such as permits, contracts, safety documents and consent forms. Present the checklist in a **clear, organized table** or poster format.`,
        [
          "Name the five types of event documents.",
          "What does a force majeure clause cover?",
          "What should you check when validating a document?",
        ],
      ),
    ],
    quiz: [
      q(
        "What is the main job of an event proposal?",
        [
          "To list the guests by name",
          "To win the client's approval of the plan",
          "To replace the contract with suppliers",
          "To record what happened at the event",
        ],
        1,
        "A proposal shows how you will run the event and what it will cost, so the client can approve it.",
      ),
      q(
        "A risk has likelihood 2 and impact 3. What is its score?",
        ["1", "5", "6", "9"],
        2,
        "Risk score is likelihood × impact: 2 × 3 = 6.",
      ),
      q(
        "Renting a generator in case of a brownout is an example of which response?",
        ["Avoid", "Reduce", "Transfer", "Accept"],
        1,
        "A generator reduces the harm of a brownout. The risk remains, but its impact is smaller.",
      ),
      q(
        "Which office gives fire safety clearance in the Philippines?",
        [
          "Bureau of Fire Protection",
          "Department of Trade and Industry",
          "Department of Tourism",
          "Barangay health center",
        ],
        0,
        "The BFP enforces the Fire Code and inspects venues and temporary structures.",
      ),
      q(
        "A supplier offers you money to choose them, though the client would pay more. This is…",
        [
          "A contingency",
          "A kickback and a conflict of interest",
          "A normal deposit",
          "A sponsorship",
        ],
        1,
        "Taking personal gain at the client's expense is a conflict of interest, and it is unethical.",
      ),
    ],
    bank: [
      q(
        "What does a Request for Proposal (RFP) do?",
        [
          "Lists what a client needs from bidders",
          "Asks guests to confirm their attendance",
          "Gives a permit to hold the event",
          "Records the final event expenses",
        ],
        0,
        "An RFP tells bidders the client's needs, budget and deadline.",
      ),
      q(
        "Which document does the event team use minute by minute?",
        ["Invitation", "Run of show", "Client brief", "Business permit"],
        1,
        "A run of show lists each part with its time, person in charge and technical cue.",
      ),
      q(
        "What is an ocular inspection?",
        [
          "A vision test for staff",
          "A review of the budget",
          "Visiting a venue in person to check it",
          "Checking guests' tickets at the door",
        ],
        2,
        "An ocular inspection means seeing the venue yourself and rating it against your checklist.",
      ),
      q(
        "Which is needed before minors join an off-campus school activity?",
        [
          "A music license",
          "A sponsorship agreement",
          "A supplier invoice",
          "Their parents' signed consent",
        ],
        3,
        "Off-campus school activities need school approval and parents' signed consent.",
      ),
      q(
        "A force majeure clause in a contract covers…",
        [
          "Events no one can control, such as typhoons",
          "The color of the staff uniforms",
          "The order of the program",
          "The menu served to guests",
        ],
        0,
        "It says what happens when something no one can control stops the event.",
      ),
    ],
  },
  // 3rd Term
  {
    title: "Managing an Event",
    description:
      "Managing contractors, executing an event, preparing a portfolio, and running an event from preparation to evaluation.",
    lessons: [
      lesson(
        "Managing Contractors",
        "Choosing, briefing and coordinating the people who supply your event.",
        `## Who are contractors?
**Contractors** are outside companies or people hired to provide a service for the event. The organizer stays responsible for the whole event, so managing them well is a core skill.

## Key contractor roles
- **Caterer** — prepares and serves food and drinks
- **Audio-visual and lights** — sound, screens, stage lighting
- **Stylist or decorator** — stage, backdrop, flowers, table setup
- **Stage and tent supplier** — stage, tents, booths, tables and chairs
- **Photo and video team** — documents the event
- **Performers and hosts** — bands, dancers, emcee
- **Security** — guards, crowd and entry control
- **Medical team** — first aid and emergencies
- **Cleaning crew** — keeps the venue clean, and handles waste

## Hiring contractors
1. Write a **scope of work**: exactly what you need, when, and where.
2. Ask at least **three suppliers** for quotations.
3. Compare **price, quality, reliability and reviews**.
4. Sign a **contract** with the deliverables, payment terms and penalties.
5. Pay a **deposit**, as the contract states.

## Coordinating contractors
- Keep a **contractor list** with names, contact numbers and arrival times.
- Hold a **briefing** so each one knows the plan and who to call.
- Share the **floor plan** and **run of show**.
- Schedule **load-in** so suppliers don't block one another. Stage and tents first, then lights and sound, then decor, then food.
- Name **one contact person** for each contractor.

## When conflicts happen
Two suppliers may want the same space, or one may arrive late.
1. **Stay calm** and get the facts.
2. **Check** the contract and the schedule.
3. **Decide** what protects the event and guests.
4. **Talk privately**, with respect — never shout in front of guests.
5. **Write it down** for the final report.`,
        `## Activity 1: Contractor Role Analysis
Write a report describing key contractor roles and responsibilities in events.

## Activity 2: Contractor Coordination Simulation
Simulate coordinating multiple contractors for an event and resolve conflicts.`,
        [
          "Name five kinds of event contractors.",
          "What is a scope of work?",
          "Why should load-in be scheduled?",
        ],
      ),
      lesson(
        "Executing an Event with Contractors",
        "From load-in to load-out: making the plan happen.",
        `## From planning to execution
**Execution** means carrying out the plan. By now, the work should be on paper: contracts, floor plan, run of show and contingency plan.

## Before the event
- **Confirm** every contractor: date, time, deliverables
- **Hold a final meeting** with your team and walk through the program
- **Prepare the event kit**: scissors, tape, markers, extension cords, first aid, pens, printed plans, copies of permits
- **Assign radios or a group chat** so the team can reach one another

## Event day flow
1. **Call time** — the team arrives first and is briefed.
2. **Load-in (ingress)** — contractors arrive at their set times and set up.
3. **Check against the contract** — is everything that was agreed there?
4. **Technical rehearsal** — test the mic, slides, music and lights.
5. **Final walk-through** — check for safety, cleanliness and signs.
6. **Doors open** — registration and ushers are ready.
7. **Run the show** — the stage manager follows the run of show and gives cues.
8. **Close** — send off the guests with thanks.
9. **Load-out (egress)** — contractors pack up. Check for damage and clean the venue.
10. **Settle** — sign off deliverables and arrange final payments.

## Working with contractors on the day
- Meet them at the **loading area** and show them their place.
- Check **deliverables**: right number, right quality, right time.
- Keep your **contact person** close by.
- **Fix problems quickly and quietly**. Guests should never notice.
- Thank them. You will want to work together again.

## When things change
Follow your contingency plan, tell the people affected, and update the emcee. **Note the changes** for your report.`,
        `## Activity 1: Event Execution Plan
Draft a step-by-step plan to execute an event following contractor procedures.

## Activity 2: Mock Event Execution
Simulate an event execution including contractor management and workflow.`,
        [
          "What do load-in and load-out mean?",
          "What should go in an event kit?",
          "Why hold a technical rehearsal?",
        ],
      ),
      lesson(
        "Preparing an Event Portfolio",
        "Showing your work with photos, documents and results.",
        `## What is an event portfolio?
An **event portfolio** is an organized collection of proof of the events you have worked on. It shows clients and employers what you can do, and it helps win bids. It can be a printed folder or an online album.

## What to include
- **Title page and overview** — the event name, client, date, venue and number of guests
- **Objectives** — what the event set out to do
- **Your role** — exactly what you did
- **Branding elements** — logo, theme, color scheme
- **Program flow** — the program or run of show
- **Budget summary** — the planned and actual totals, if the client allows it
- **Materials** — posters, tickets, invitations, layouts, floor plans
- **Photos** — before, during and after
- **Results** — attendance, money raised, ratings
- **Testimonials** — short comments from clients or guests
- **Lessons learned** — what you would improve

## Tips for a strong portfolio
- **Choose your best work**, and don't include everything.
- **Tell a story**: the problem, what you did, the result.
- **Use clear, well-lit photos**, each with a caption.
- **Keep the design consistent**, so the portfolio itself shows your skill.
- **Update it** after each event.

## Before you share it
- **Ask permission** from the client before using their name or details.
- **Protect guests' privacy**. Get consent for photos, especially of minors.
- **Hide private details**, such as phone numbers and full budgets.
- **Credit** the photographers and team members.
- **Be honest**: only claim the work you really did.

## Presenting your portfolio
Walk the audience through **planning, execution and outcomes**. Choose one event, keep to the time limit, and be ready to explain your decisions.`,
        `## Activity 1: Portfolio Compilation
Compile photos, reports, and documentation of a sample event into a portfolio.

## Activity 2: Portfolio Presentation
Present the portfolio to a group, highlighting planning, execution, and outcomes.`,
        [
          "What is an event portfolio?",
          "List five things a portfolio should include.",
          "Why must you ask permission before sharing event photos?",
        ],
      ),
      lesson(
        "Managing an Event",
        "Bringing it all together, from preparation to evaluation.",
        `## The whole job
Managing an event brings together everything from this course. A manager leads the team through five phases, and the event only ends when the last report is done.

## The five phases
1. **Research and concept** — the client brief, goal, audience, theme and SOAR
2. **Planning** — proposal, budget, venue, program, permits and contingency plan
3. **Preparation** — contractors, promotion, ticket sales, rehearsals
4. **Execution** — load-in, the event itself, load-out
5. **Evaluation** — feedback, report, settling of accounts

## An event management plan
Put these in one file:
- **Timeline** — tasks with deadlines, counting back from the event date
- **Resources** — money, equipment, materials, venue
- **Staffing** — who does what

## Team roles
- **Event manager** — leads the team and makes the final decisions
- **Logistics** — venue, equipment, transport, setup
- **Program** — flow, speakers, performers, emcee
- **Promotions** — posters, social media, invitations, tickets
- **Finance** — budget, payments, receipts
- **Safety** — first aid, security, emergency plan

## Sample timeline for a school event
| When | Task |
|---|---|
| 8 weeks before | Set the goal, theme and budget |
| 6 weeks before | Reserve the venue, apply for approvals |
| 4 weeks before | Book contractors, begin promotion |
| 2 weeks before | Finalize the program and floor plan |
| 1 week before | Confirm everyone, hold a rehearsal |
| Event day | Load-in, run the show, load-out |
| 1 week after | Evaluate, report, thank everyone |

## Leading the team
Delegate, trust your team, and check in often. Communicate clearly, make decisions quickly, and keep calm so the team stays calm.

## Evaluating the event
- **Compare results** with your objectives: attendance, income, ratings
- **Collect feedback** from guests, client, team and contractors
- **Compare the budget**: planned against actual
- **Hold a debrief**: what worked, what didn't, what to change
- **Write a post-event report**, and **thank** everyone who helped`,
        `## Activity 1: Event Management Plan
Prepare a full management plan for a sample event including timeline, resources, and staffing.

## Activity 2: Event Simulation Exercise
Simulate managing a full event from preparation to evaluation, implementing all previous competencies.

## 3rd Term Performance Tasks
**Individual: Event Portfolio Compilation.** Choose an event (past, planned or hypothetical) and prepare a simple event portfolio containing:
- Event title and overview
- Objectives
- Branding elements (logo, theme, color scheme)
- Program flow
- Photos or mock-ups of materials (poster, ticket, layout)

**Group: Mini Event Management Simulation.** As a group, **plan and manage** a small in-class or school-based activity (for example a mini program, booth or demonstration). Your group must:
- Assign roles (manager, logistics, program, promotions)
- Prepare a short event plan
- Execute the activity during the scheduled time
- Conduct a quick evaluation after the event`,
        [
          "What are the five phases of managing an event?",
          "What three things does an event management plan cover?",
          "Why does an event need a post-event evaluation?",
        ],
      ),
    ],
    quiz: [
      q(
        "What is a scope of work?",
        [
          "A list of the guests attending",
          "The stage layout for performers",
          "A clear statement of what a contractor must deliver",
          "A record of the feedback from guests",
        ],
        2,
        "A scope of work states exactly what is needed, when and where.",
      ),
      q(
        "What is load-in?",
        [
          "Contractors arriving and setting up",
          "Guests leaving the venue",
          "Paying the final bills",
          "Printing the event tickets",
        ],
        0,
        "Load-in, or ingress, is when contractors bring in equipment and set up.",
      ),
      q(
        "Two suppliers argue over a space during setup. What should you do first?",
        [
          "Cancel both contracts",
          "Stay calm and get the facts",
          "Ask the guests to decide",
          "Let them settle it on their own",
        ],
        1,
        "Stay calm, get the facts, then check the contract and schedule before deciding.",
      ),
      q(
        "Before putting a client's event in your portfolio, you should…",
        [
          "Add more guests to the count",
          "Remove the event's name",
          "Claim all the team's work as yours",
          "Ask the client's permission",
        ],
        3,
        "Client details and guests' photos need permission before they are shared.",
      ),
      q(
        "Which phase comes last in managing an event?",
        ["Planning", "Preparation", "Execution", "Evaluation"],
        3,
        "Evaluation comes last: feedback, the report and settling accounts.",
      ),
    ],
    bank: [
      q(
        "Which contractor handles microphones, screens and stage lighting?",
        [
          "Caterer",
          "Audio-visual and lights",
          "Cleaning crew",
          "Stylist or decorator",
        ],
        1,
        "The audio-visual and lights team manages sound, screens and stage lighting.",
      ),
      q(
        "What is load-out?",
        [
          "Printing the program",
          "The opening number",
          "Packing up after the event",
          "Selling the last tickets",
        ],
        2,
        "Load-out, or egress, is when contractors pack up and the venue is cleaned.",
      ),
      q(
        "Which belongs in an event portfolio?",
        [
          "Guests' private phone numbers",
          "Photos, materials and results",
          "Other organizers' work",
          "Passwords of the team",
        ],
        1,
        "A portfolio shows your own work, with photos, materials and results.",
      ),
      q(
        "In a mini event, which role handles posters and invitations?",
        ["Logistics", "Program", "Promotions", "Finance"],
        2,
        "Promotions handles posters, social media, invitations and tickets.",
      ),
      q(
        "What is a debrief?",
        [
          "A team talk on what worked and what to change",
          "The first meeting with the client",
          "The contract signing with a supplier",
          "A short speech at the opening",
        ],
        0,
        "A debrief after the event helps the team learn and improve the next one.",
      ),
    ],
  },
];

export const eventsManagement11: DemoSubject = {
  key: "TLE11-EMS",
  code: "TLE 11-EMS",
  name: "Events Management Services 11",
  department: TLE_DEPARTMENT,
  description:
    "Conceptualizing, proposing and managing events — the Grade 11 Technical-Professional elective in Hospitality and Tourism.",
  colorToken: "rose",
  units: UNITS,
};
