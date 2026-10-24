/**
 * TLE 9 – ICT: Telecommunications (Contact Center Services), following
 * DepEd's Three-Term Budget of Work (updated April 7, 2026): one unit per
 * week or pair of weeks (1, 2, 3, 4, 5, 6, 7–8, 9–10), one lesson per
 * learning competency. Each lesson has a lecture video, a written lecture,
 * a reading built from the suggested activities, and a self-check; every
 * unit has five Unit Questions.
 */
import type { DemoLesson, DemoSubject, DemoUnit } from "../grade10";
import { q, TLE_DEPARTMENT } from "./common";

/**
 * The lecture video for each lesson (YouTube id). Each was checked to exist
 * and allow embedding, and chosen for covering the lesson’s topic.
 */
export const TELECOM_VIDEOS: Record<string, string> = {
  "The Contact Center Industry and Its Careers": "hASD-vuGNAc", // What is BPO? Call Center and Contact Centre outsourcing — Bpo Search
  "Contact Center Jargon": "UYN2HXBsPZ8", // 20 Call Center Agent Words You Should Know — Darrell FreeTalks
  "Inbound and Outbound Calls": "PWSdRBsFa5Y", // Inbound vs Outbound Calls — Global Call Forwarding
  "Duties and Responsibilities of a Contact Center Employee": "G4-E6Ihaek0", // What Does A Call Center Agent Do? — Metacom Careers
  "Skills and Attributes of a Contact Center Employee": "Uc11AqnGgoU", // Customer Service Skills You Must Know — Your Growth
  "Types of Contact Center Services": "Zqms2BKaUt0", // BPO services most commonly offered in the Philippines — HPR
  "Phone Etiquette in Handling Calls": "m7pi6OC5V8U", // Telephone Etiquette Tips for Customer Service Pros — Business Training Media
  "Common Contact Center Metrics": "eazdelhvIxs", // Average Handle Time | Managing Metrics — BenchmarkPortal
  "Accuracy and Fluency in Voice and Non-Voice Communication": "9RxD3caewEk", // Communicate Clearly in English for Customer Service — English with Kim
  "Local and International Accounts": "1rOvY7nvrfs", // BPO Account Types — JobsAvenuePH
  "Procedures in Call Handling": "jl4qyjC4bFY", // 7 Step Call Flow Strategy for Contact Centers — Myra Golden
  "Performing a Call Flow": "seQ5RRI6H4c", // Mock Call Sample Recording With Call Flow Guide — Kwestyon
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
  lecture: { videoId: TELECOM_VIDEOS[title] ?? "", lecture },
});

const UNITS: DemoUnit[] = [
  // Week 1
  {
    title: "The Contact Center Industry",
    description:
      "What contact centers do, the careers they offer, and the language used inside them.",
    lessons: [
      lesson(
        "The Contact Center Industry and Its Careers",
        "What contact centers are and the jobs they offer.",
        `## What is a contact center?
A **contact center** is a team that talks with a company's customers on its behalf — by **phone (voice)**, and by **email, chat, text and social media (non-voice)**. A **call center** handles phone calls only; a contact center handles every channel.

## The BPO industry
Many contact centers are run through **BPO (Business Process Outsourcing)**: a company hires another company to do part of its work, such as customer service. The **Philippines** is one of the world's biggest BPO locations because of its large English-speaking workforce, its customer-service culture and its skilled graduates. The industry employs well over a million Filipinos, many in Metro Manila, Cebu, Davao, Clark and Iloilo.

## Who are the people in a contact center?
- **Customer Service Representative (CSR) / Agent** — answers customers on the phone, by email or chat
- **Technical Support Representative** — helps customers fix problems with devices, internet or software
- **Sales Agent** — offers products and services to customers
- **Team Leader (TL)** — leads and coaches a team of agents
- **Quality Analyst (QA)** — listens to calls and scores them against the standards
- **Trainer** — teaches new hires the product, the process and communication skills
- **Workforce Manager** — plans schedules so there are enough agents at every hour
- **Operations Manager** — runs the whole account

## A career path
Agent → Senior agent or Subject Matter Expert (SME) → Team Leader, QA or Trainer → Operations Manager. TESDA offers **Contact Center Services NC II** for those who want a national certificate.

## Key points
Contact centers serve customers for other companies. They offer many roles, and good communication skills open the door to all of them.`,
        "CC Career Explorer: choose one contact center role, research its job description, required skills and career path, and make a short profile or infographic. My Future in Contact Centers: write a one-page reflection on which role fits your skills and interests, and why.",
        [
          "What is the difference between a call center and a contact center?",
          "What does BPO stand for?",
          "Name three roles in a contact center and what each one does.",
        ],
      ),
      lesson(
        "Contact Center Jargon",
        "The words agents use every day.",
        `## Why learn the jargon?
Every workplace has its own words. Knowing them helps you understand your trainers, team leader and teammates from the first day.

## People and places
- **Agent / CSR** — the person handling the customer
- **TL** — team leader; **SME** — subject matter expert; **QA** — quality analyst
- **Floor / production floor** — where agents take calls
- **Account / campaign** — the client company and the work done for it
- **Nesting** — the first weeks taking real calls with extra coaching after training

## Calls and tools
- **Queue** — calls or chats waiting to be answered
- **Hold** — putting the customer on hold while you check something; always ask permission first
- **Mute** — the customer can't hear you; **dead air** — silence on the line (avoid it)
- **Transfer** — sending the call to another department; **escalation** — passing an issue to a supervisor
- **Wrap-up / ACW (After-Call Work)** — notes and tasks done after the call ends
- **CRM** — the customer records system; **ticket** — a record of one customer issue
- **Spiel / script** — the set words for opening, holding and closing
- **Callback** — calling the customer back later

## Schedules
- **Shift / graveyard shift** — work hours; many accounts follow US or other foreign time zones
- **Break / lunch** — scheduled times off the phone
- **Adherence** — following your schedule exactly

## Key points
Learn the words, but with customers use plain language — they don't know the jargon.`,
        "Jargon Detective: pick 10 contact center jargons from a list, define them, and give a real-life example of how each is used. Speak Like a Pro: write a short customer-agent dialogue that uses at least 5 industry jargons correctly.",
        [
          "What is dead air, and why should it be avoided?",
          "What is the difference between a transfer and an escalation?",
          "What is done during wrap-up (ACW)?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which handles customers by phone, email, chat and social media?",
        [
          "A call center",
          "A contact center",
          "A printing shop",
          "A data center",
        ],
        1,
        "A contact center handles many channels; a call center handles phone calls only.",
      ),
      q(
        "What does BPO stand for?",
        [
          "Business Process Outsourcing",
          "Basic Phone Operation",
          "Business Product Order",
          "Billing and Payment Office",
        ],
        0,
        "BPO is Business Process Outsourcing — a company hires another company to do part of its work.",
      ),
      q(
        "Who listens to calls and scores them against the standards?",
        ["Trainer", "Quality Analyst", "Workforce Manager", "Customer"],
        1,
        "The Quality Analyst (QA) evaluates calls to make sure agents follow the standards.",
      ),
      q(
        "What is dead air?",
        [
          "A broken headset",
          "Silence on the line during a call",
          "A call from another country",
          "The break room",
        ],
        1,
        "Dead air is silence on the line; it makes customers feel ignored, so agents avoid it.",
      ),
      q(
        "Passing a customer's issue to a supervisor or higher level is called…",
        ["Escalation", "Nesting", "Adherence", "Wrap-up"],
        0,
        "An escalation sends the issue up to someone with more authority or expertise.",
      ),
    ],
  },
  // Week 2
  {
    title: "Call Types and Contact Center Duties",
    description:
      "Inbound and outbound calls, and what contact center employees do every day.",
    lessons: [
      lesson(
        "Inbound and Outbound Calls",
        "Who starts the call, and why it matters.",
        `## Inbound calls
An **inbound** call comes **in** — the **customer calls the company**.
- Examples: asking about a bill, reporting no internet, ordering a product, asking for a refund
- The agent's job is to **understand and solve** the customer's concern

## Outbound calls
An **outbound** call goes **out** — the **company calls the customer**.
- Examples: sales and telemarketing, surveys, payment reminders (collections), appointment reminders, follow-up calls
- The agent's job is to **get the customer's attention**, explain the purpose clearly and respect their time

## Comparing them
- **Who calls:** inbound — the customer; outbound — the agent
- **Customer's mood:** inbound customers want help now; outbound customers may be busy or not expecting the call
- **Skills:** inbound needs listening and problem solving; outbound needs persuasion, confidence and handling rejection

## Blended
Many accounts are **blended**: agents take inbound calls and also make outbound calls.

## Key points
Ask: **who started the call?** If the customer did, it's inbound; if the company did, it's outbound.`,
        "Call Type Classifier: read a set of call scenarios, label each one inbound or outbound, and explain your choice in one sentence.",
        [
          "A customer calls to report a lost card. Is it inbound or outbound? Why?",
          "Give two examples of outbound calls.",
          "Which skill is especially important in outbound calls?",
        ],
      ),
      lesson(
        "Duties and Responsibilities of a Contact Center Employee",
        "What agents do on every shift.",
        `## Main duties
- **Answer** calls, chats and emails promptly using the approved spiel
- **Listen** to the customer and **identify the concern**
- **Verify** the customer's identity before discussing the account
- **Give correct information** and **resolve** the issue, or route it to the right team
- **Document** every interaction accurately in the CRM or ticket
- **Follow up** on promised callbacks and pending cases
- **Escalate** issues they are not allowed to solve

## Responsibilities to the company
- Follow the **process and policies** of the account
- Meet **performance targets** (metrics)
- Keep to the **schedule** — log in on time, take breaks on time (adherence)
- Keep learning about the product through updates and coaching

## Responsibilities to the customer
- Treat every customer with **courtesy and respect**
- **Protect customer data** — never share account details with anyone who isn't verified (the Philippine **Data Privacy Act of 2012** protects personal information)
- Be **honest**: don't promise what can't be done

## Key points
A good agent solves the customer's concern correctly, records it well, protects the customer's privacy and follows the process.`,
        "Agent for a Day: list the daily tasks of a contact center agent and explain how each helps give good customer service. Role Ready: write a short scenario of an employee handling a customer concern while following proper responsibilities.",
        [
          "Why must an agent verify the customer before discussing the account?",
          "Why is documenting each call important?",
          "Which Philippine law protects customers' personal information?",
        ],
      ),
    ],
    quiz: [
      q(
        "A customer calls the bank to ask why a fee was charged. This call is…",
        ["outbound", "inbound", "blended", "escalated"],
        1,
        "The customer started the call to the company, so it is inbound.",
      ),
      q(
        "Which is an example of an outbound call?",
        [
          "A customer reporting no internet",
          "A customer asking for a refund",
          "An agent calling to remind a customer of a payment",
          "A customer ordering a pizza",
        ],
        2,
        "In an outbound call the company calls the customer, such as for a payment reminder.",
      ),
      q(
        "Before discussing an account, the agent must first…",
        [
          "verify the customer's identity",
          "transfer the call",
          "end the call",
          "offer a new product",
        ],
        0,
        "Verification protects the account so information is shared only with the right person.",
      ),
      q(
        "Why do agents document every interaction?",
        [
          "To make the call longer",
          "So the next agent knows what happened and promises are kept",
          "Because customers ask for it",
          "To avoid talking",
        ],
        1,
        "Accurate notes let anyone continue the case correctly and keep the company's promises.",
      ),
      q(
        "Following your work schedule exactly — logging in and taking breaks on time — is called…",
        ["Escalation", "Adherence", "Probing", "Nesting"],
        1,
        "Schedule adherence keeps enough agents available to answer customers at every hour.",
      ),
    ],
  },
  // Week 3
  {
    title: "Skills, Attributes and Services",
    description:
      "What makes a good contact center employee, and the services contact centers offer.",
    lessons: [
      lesson(
        "Skills and Attributes of a Contact Center Employee",
        "The skills and attitudes that make a good agent.",
        `## Communication skills
- **Good English (and Filipino for local accounts):** correct grammar, clear pronunciation, natural pace
- **Active listening:** focus on the customer, don't interrupt, and repeat back to confirm you understood
- **Clear explanation:** simple words, one step at a time

## Thinking skills
- **Problem solving:** find the real cause of the concern
- **Attention to detail:** spell names and numbers correctly, follow every step of the process
- **Product knowledge:** know what you are supporting

## Technical skills
- **Typing speed and accuracy** (about 35 words per minute or more is commonly expected)
- **Computer navigation:** using several programs at once while talking

## Attributes (attitude)
- **Empathy:** understanding how the customer feels — "I understand how frustrating that is"
- **Patience** and **composure**: staying calm with an upset customer
- **Positive attitude** and **professionalism**
- **Flexibility:** night shifts, changing processes
- **Willingness to learn** and accept coaching

## Key points
Skills can be trained; the right attitude — empathy, patience, professionalism — is what customers remember.`,
        "Skill Match Master: match contact center skills (communication, empathy, problem solving…) to the situations where they are most needed. Hire Me!: write a short self-profile of the skills you already have and the ones you want to improve.",
        [
          "What is active listening?",
          "Give an example of an empathy statement.",
          "Why is typing speed important for an agent?",
        ],
      ),
      lesson(
        "Types of Contact Center Services",
        "The kinds of work contact centers do for their clients.",
        `## Customer service
Answering questions and solving concerns about accounts, orders, bills and policies.
- Example: a telecom customer asking about a high bill

## Technical support
Helping customers fix problems with devices, internet, apps or software, step by step (troubleshooting).
- Example: guiding a customer to restart a modem
- **Tiers:** Tier 1 handles common issues; harder ones are escalated to Tier 2 or 3

## Sales and telemarketing
Offering products or upgrades, and **upselling** (a better plan) or **cross-selling** (a related product).
- Example: offering a faster internet plan

## Collections
Reminding customers of unpaid bills and arranging payments, politely and within the law.

## Other services
- **Order taking and reservations** — food delivery, hotels, airlines
- **Surveys and market research**
- **Healthcare** — appointments, insurance and claims
- **Back office** (non-voice) — data entry, email and chat support, content moderation

## Key points
Each service needs the same core skills but a different focus: solving for customer service, troubleshooting for tech support, persuading for sales.`,
        "Service Spotter: review customer scenarios and identify which service (customer support, technical support, sales…) is being used. Design a Service: choose one type of contact center service and describe how it helps customers and businesses.",
        [
          "What is the difference between customer service and technical support?",
          "What is upselling?",
          "Give one example of a back-office (non-voice) service.",
        ],
      ),
    ],
    quiz: [
      q(
        "Repeating the customer's concern back to confirm you understood is part of…",
        ["active listening", "dead air", "upselling", "escalation"],
        0,
        "Active listening includes confirming your understanding before you act.",
      ),
      q(
        '"I understand how frustrating it is to lose your connection while working." This shows…',
        ["impatience", "empathy", "selling", "verification"],
        1,
        "An empathy statement acknowledges the customer's feelings.",
      ),
      q(
        "Guiding a customer step by step to fix their modem is…",
        ["collections", "technical support", "sales", "a survey"],
        1,
        "Technical support troubleshoots problems with devices, internet and software.",
      ),
      q(
        "Offering a customer a faster, more expensive plan than the one they have is…",
        ["upselling", "escalating", "verifying", "nesting"],
        0,
        "Upselling offers a better (usually higher-priced) version of what the customer already has.",
      ),
      q(
        "Which is a non-voice (back-office) service?",
        [
          "Answering a billing call",
          "Answering customer emails and chats",
          "Telemarketing by phone",
          "Calling for a payment reminder",
        ],
        1,
        "Non-voice work uses email, chat and data tasks instead of phone calls.",
      ),
    ],
  },
  // Week 4
  {
    title: "Phone Etiquette",
    description: "Handling calls politely and professionally.",
    lessons: [
      lesson(
        "Phone Etiquette in Handling Calls",
        "Greeting, holding, transferring and closing calls properly.",
        `## Answering
- Answer promptly, within the account's standard
- Use the **opening spiel**: greeting, company, your name, offer of help
  "Good morning, thank you for calling SunTel. This is Ana. How may I help you today?"
- **Smile while you talk** — the customer can hear it in your voice

## During the call
- Use a **warm, clear, professional tone** and a moderate pace
- **Address the customer** by name with "Sir" or "Ma'am"
- Use **courteous words**: please, thank you, I apologize for the inconvenience
- **Don't interrupt**; take notes while listening
- Avoid slang, jargon and **dead air**; tell the customer what you are doing ("I'm checking your account now")

## Hold
- **Ask permission** and give a reason and time: "May I place you on hold for about two minutes while I check your bill?"
- **Thank** the customer when you return: "Thank you for holding."

## Transfer
Explain why and where you are transferring, and give the details to the next agent so the customer doesn't repeat everything.

## Closing
- **Recap** what was done, **offer further help**, and **thank** the customer:
  "Is there anything else I can help you with? Thank you for calling SunTel. Have a great day!"
- Let the customer hang up first

## Key points
Courtesy, a warm voice, and clear hold and closing spiels make every call feel professional.`,
        "Ring-Ring Ready!: write a short call script that shows a correct greeting, active listening and a polite call closing.",
        [
          "What four parts does a good opening spiel have?",
          "What must you do before placing a customer on hold?",
          "How should an agent close a call?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which is the best way to open a call?",
        [
          '"Hello? What do you want?"',
          '"Good morning, thank you for calling SunTel. This is Ana. How may I help you?"',
          '"Yes?"',
          '"Wait lang po."',
        ],
        1,
        "A proper opening spiel has a greeting, the company name, the agent's name and an offer of help.",
      ),
      q(
        "Before placing a customer on hold, the agent should…",
        [
          "just press hold",
          "ask permission and say why and how long",
          "end the call",
          "transfer the call",
        ],
        1,
        "Asking permission and giving a reason and time respects the customer.",
      ),
      q(
        "Why should agents smile while talking on the phone?",
        [
          "The customer can see them",
          "It makes the voice sound warmer and friendlier",
          "It is required by law",
          "It makes the call shorter",
        ],
        1,
        "Smiling changes the tone of voice, and customers can hear the warmth.",
      ),
      q(
        "When you come back from hold, you should first…",
        [
          "thank the customer for holding",
          "ask for their name again",
          "say nothing",
          "transfer the call",
        ],
        0,
        '"Thank you for holding" acknowledges the customer\'s patience.',
      ),
      q(
        "Which is part of a proper call closing?",
        [
          "Hanging up quickly",
          "Offering further help and thanking the customer",
          "Asking the customer to call another number",
          "Putting the customer on hold",
        ],
        1,
        "A closing offers further assistance and thanks the customer before ending the call.",
      ),
    ],
  },
  // Week 5
  {
    title: "Contact Center Metrics",
    description: "How contact center performance is measured.",
    lessons: [
      lesson(
        "Common Contact Center Metrics",
        "The numbers that show how well agents and teams perform.",
        `## Why metrics?
Contact centers handle thousands of interactions a day. **Metrics** (also called KPIs — Key Performance Indicators) show whether customers are served quickly and well.

## Common metrics
- **AHT (Average Handle Time)** — the average length of one interaction: **talk time + hold time + after-call work**
  AHT = (total talk + total hold + total ACW) ÷ number of calls
- **FCR (First Call Resolution)** — the percentage of concerns solved in the **first** contact, with no need to call back
- **CSAT (Customer Satisfaction)** — how satisfied customers are, usually from a survey after the call ("How satisfied were you, 1 to 5?")
- **NPS (Net Promoter Score)** — how likely customers are to recommend the company
- **QA score** — how well the agent followed the standards, from the quality analyst's evaluation
- **Service level** — the percentage of calls answered within a target time (for example 80% in 20 seconds)
- **Abandonment rate** — the percentage of callers who hang up before reaching an agent
- **Adherence** — how closely the agent follows the schedule

## Balancing metrics
A very short AHT is not good if the problem isn't solved — the customer calls again and FCR and CSAT fall. The goal is **quick and correct**.

## Example
An agent handled 4 calls with 6, 8, 5 and 9 minutes of total handle time: AHT = 28 ÷ 4 = **7 minutes**.

## Key points
AHT measures speed, FCR measures solving it the first time, CSAT measures how the customer feels. Good agents balance all three.`,
        "Metric Match-Up: match each metric (AHT, CSAT, FCR…) with its definition and purpose. Scoreboard Simulator: review a sample agent scorecard and explain what the metrics say about the agent's performance.",
        [
          "What three times make up AHT?",
          "What does FCR measure?",
          "Why is a very low AHT not always good?",
        ],
      ),
    ],
    quiz: [
      q(
        "AHT stands for…",
        [
          "Average Handle Time",
          "Agent Hold Total",
          "Average Hours Today",
          "Automatic Handling Tool",
        ],
        0,
        "AHT is Average Handle Time: talk time + hold time + after-call work, averaged per interaction.",
      ),
      q(
        "Which metric shows the percentage of concerns solved in the first contact?",
        ["CSAT", "FCR", "AHT", "Adherence"],
        1,
        "FCR — First Call (or Contact) Resolution — counts issues solved without a repeat call.",
      ),
      q(
        'A survey asks, "How satisfied were you with our service?" Which metric is this?',
        ["CSAT", "AHT", "Service level", "Abandonment rate"],
        0,
        "CSAT (Customer Satisfaction) comes from asking customers how satisfied they were.",
      ),
      q(
        "An agent's 4 calls took 6, 8, 5 and 9 minutes. What is the AHT?",
        ["5 minutes", "7 minutes", "8 minutes", "28 minutes"],
        1,
        "(6 + 8 + 5 + 9) ÷ 4 = 28 ÷ 4 = 7 minutes.",
      ),
      q(
        "Callers who hang up before reaching an agent are measured by the…",
        ["abandonment rate", "QA score", "CSAT", "FCR"],
        0,
        "The abandonment rate is the share of callers who give up while waiting.",
      ),
    ],
  },
  // Week 6
  {
    title: "Accuracy and Fluency in Communication",
    description:
      "Communicating clearly and correctly in voice and non-voice interactions.",
    lessons: [
      lesson(
        "Accuracy and Fluency in Voice and Non-Voice Communication",
        "Speaking and writing clearly, correctly and naturally.",
        `## Accuracy and fluency
- **Accuracy** — correct grammar, vocabulary, pronunciation and **correct information**
- **Fluency** — speaking or writing smoothly and naturally, without long pauses or fillers

## Voice (phone)
- **Pronounce** clearly; speak at a moderate pace and volume
- Avoid fillers like "uhm", "ah", "parang"
- Use **correct tenses and subject-verb agreement**: "The technician **will visit** on Monday"; "Your bill **was** sent"
- **Spell** names, emails and codes with the **phonetic alphabet**: A as in Alpha, B as in Bravo, C as in Charlie…
- **Confirm** numbers by reading them back

## Non-voice (email and chat)
- **Correct spelling, grammar and punctuation** — no text-speak ("pls", "u", "thx")
- **Short, clear paragraphs**; one idea each
- A **professional greeting and closing**: "Hi Mr. Santos," … "Best regards, Ana"
- In chat: reply promptly, use the customer's name, and avoid long blocks of text
- **Proofread** before sending

## Inbound and outbound
- **Inbound:** confirm the concern accurately before solving it
- **Outbound:** state your name, company and purpose clearly in the first seconds

## Example makeover
Poor: "ok sir wait lng ill check ur acct"
Better: "Thank you, Mr. Santos. Please allow me a moment to check your account."

## Key points
Clear, correct and natural language — spoken or written — builds the customer's trust.`,
        "Clear & Correct Challenge: write one inbound and one outbound sample interaction (call script or chat) showing clear, accurate, fluent communication. Message Makeover: rewrite a poorly written or spoken customer interaction to make it accurate, fluent and professional.",
        [
          "What is the difference between accuracy and fluency?",
          "Spell your first name using the phonetic alphabet.",
          'Rewrite this chat message professionally: "ok wait lng".',
        ],
      ),
    ],
    quiz: [
      q(
        "Speaking smoothly and naturally, without long pauses, is…",
        ["accuracy", "fluency", "escalation", "verification"],
        1,
        "Fluency is smooth, natural communication; accuracy is correctness.",
      ),
      q(
        'In the phonetic alphabet, "B" is spoken as…',
        ["Boy", "Bravo", "Baker", "Blue"],
        1,
        "The NATO phonetic alphabet uses Alpha, Bravo, Charlie… so letters aren't misheard.",
      ),
      q(
        "Which chat reply is the most professional?",
        [
          "ok wait lng",
          "pls hold on thx",
          "Thank you for waiting, Ms. Cruz. I am checking your order now.",
          "WAIT!!!",
        ],
        2,
        "A professional reply uses complete sentences, correct spelling and the customer's name.",
      ),
      q(
        "Which sentence is grammatically correct?",
        [
          "Your bill were sent yesterday.",
          "Your bill was sent yesterday.",
          "Your bill is sent yesterday.",
          "Your bill sending yesterday.",
        ],
        1,
        '"Bill" is singular and the action is past, so "was sent" is correct.',
      ),
      q(
        "Why should agents read numbers back to the customer?",
        [
          "To make the call longer",
          "To confirm the information is accurate",
          "Because it is polite only",
          "To test the customer",
        ],
        1,
        "Reading numbers back catches mistakes before they cause problems.",
      ),
    ],
  },
  // Weeks 7–8
  {
    title: "Accounts and Call-Handling Procedures",
    description:
      "Local and international accounts, and the standard procedure for handling a call.",
    lessons: [
      lesson(
        "Local and International Accounts",
        "Serving customers in the Philippines and around the world.",
        `## What is an account?
An **account** (or campaign) is the client company and the work the contact center does for it — for example, the customer service of a telecom or a bank.

## Local accounts
- Customers are **in the Philippines**
- Language: **Filipino/Taglish and English**
- Usually **daytime** shifts, Philippine holidays
- Examples: local telecoms, banks, e-wallets, delivery and online shopping apps

## International accounts
- Customers are **abroad** — the United States, Australia, the United Kingdom and others
- Language: **English**, with attention to **accent neutrality**, clear pronunciation and the customer's culture
- Often **night (graveyard) shifts** to match the customer's time zone, and foreign holidays
- Usually require stronger English skills and may pay a **night differential**
- Agents must know foreign formats: dates (MM/DD/YYYY in the US), currencies, addresses

## Comparing them
- **Customers:** local — Filipinos; international — foreign customers
- **Communication style:** local — friendly, may use Filipino; international — formal English, culture-aware
- **Requirements:** international accounts usually test English more strictly

## Key points
Whether local or international, the same call flow and courtesy apply — only the language, schedule and culture change.`,
        "Account Identifier: decide whether each sample client is a local or international account and explain why in one sentence. Global vs Local: make a comparison chart of the customers, communication style and requirements of local and international accounts.",
        [
          "Why do many international accounts work at night in the Philippines?",
          "Give two differences between local and international accounts.",
          "What is accent neutrality?",
        ],
      ),
      lesson(
        "Procedures in Call Handling",
        "The standard steps for handling any customer call.",
        `## Before the call
- Be **logged in and ready** on time, with tools open (CRM, knowledge base)
- Have a pen and paper or a notes window ready

## During the call — the standard procedure
- **Open** — greeting, company, name, offer of help
- **Verify** — confirm the customer's identity with the account's verification questions
- **Listen and acknowledge** — let the customer explain; show empathy
- **Probe** — ask questions to understand the real concern
  Open questions ("What happened when…?") and closed questions ("Is the light red or green?")
- **Resolve** — give the solution or the next steps; follow the knowledge base
- **Confirm** — check that the customer understands and is satisfied
- **Close** — offer further help, thank the customer

## Special situations
- **Hold** — ask permission, give a reason and time, thank on return
- **Transfer** — explain why and brief the receiving agent
- **Escalation** — when the customer asks for a supervisor or the issue is beyond your authority
- **Irate customer** — stay calm, don't take it personally, acknowledge feelings, focus on the solution

## After the call
**Wrap-up (ACW):** document the concern, actions taken and next steps; set callbacks.

## Key points
Following the same procedure on every call makes service consistent, quick and correct.`,
        "Call Flow Pro: make a step-by-step call flow diagram of the proper procedure for handling a customer call. Procedure in Practice: write a short call scenario that correctly follows the standard call-handling procedure.",
        [
          "Why is verification done before solving the concern?",
          "Give one open and one closed probing question.",
          "What should you do with an irate customer?",
        ],
      ),
    ],
    quiz: [
      q(
        "Customers of an international account are usually…",
        [
          "in the same barangay",
          "in other countries",
          "only company employees",
          "only students",
        ],
        1,
        "International accounts serve customers abroad, such as in the US or Australia.",
      ),
      q(
        "Why do many international accounts in the Philippines work night shifts?",
        [
          "Electricity is cheaper",
          "To match the customers' time zone",
          "Agents prefer it",
          "It is required by DepEd",
        ],
        1,
        "Night in the Philippines is daytime in places like the United States.",
      ),
      q(
        "Which step comes right after opening the call?",
        ["Closing", "Verification", "Wrap-up", "Transfer"],
        1,
        "After the greeting, the agent verifies the customer before discussing the account.",
      ),
      q(
        '"Is the light on your modem red or green?" is a…',
        [
          "closed probing question",
          "closing spiel",
          "hold spiel",
          "verification question",
        ],
        0,
        "A closed question has limited answers; it narrows down the problem.",
      ),
      q(
        "When should an agent escalate a call?",
        [
          "On every call",
          "When the issue is beyond the agent's authority or the customer asks for a supervisor",
          "When the call is short",
          "Never",
        ],
        1,
        "Escalation is for issues the agent isn't authorized to resolve, or when a supervisor is requested.",
      ),
    ],
  },
  // Weeks 9–10
  {
    title: "Performing a Call Flow",
    description:
      "Putting it all together in a complete call, with the performance tasks.",
    lessons: [
      lesson(
        "Performing a Call Flow",
        "A complete customer call from greeting to closing.",
        `## What is a call flow?
A **call flow** is the sequence of steps in a customer call, from the greeting to the closing. Following it makes every call complete and professional.

## A sample inbound call
- **Opening:** "Good afternoon, thank you for calling SunTel. This is Mark. How may I help you today?"
- **Concern:** "My internet has been slow since yesterday."
- **Empathy:** "I'm sorry to hear that. I understand how important a fast connection is. I'll be glad to help."
- **Verification:** "May I have the account name and the registered mobile number, please?"
- **Probing:** "Are all your devices slow, or only one? Have you restarted the modem?"
- **Hold (if needed):** "May I place you on hold for two minutes while I check the line?" … "Thank you for holding."
- **Resolution:** "I found an issue in your area that our technicians are fixing. It should be restored by 6 PM today. I've also refreshed your connection."
- **Confirmation:** "Is your connection faster now?"
- **Further help:** "Is there anything else I can help you with?"
- **Closing:** "Thank you for calling SunTel, Ms. Reyes. Have a great day!"
- **Wrap-up:** notes — slow internet, area outage, refreshed line, expected fix 6 PM

## Practising
Practise in pairs: one is the customer, one the agent; then switch. Record yourselves, listen back, and score the call against the steps.

## Performance tasks
- **Individual — My Contact Center Journey:** a portfolio with a jargon glossary, a career and skills reflection, examples of inbound and outbound calls, call-handling scripts, customer scenarios, and a summary comparing local and international accounts.
- **Group — Team Contact Center Challenge:** in groups of 3–4, simulate a mini contact center with agents, a supervisor and customers; perform inbound and outbound calls with proper call flow and etiquette, track key metrics, and present your workflow and results.

## Key points
Opening, empathy, verification, probing, resolution, confirmation, further help, closing — and wrap-up. Every call, every time.`,
        "Flow It Right!: make a visual or written call flow showing each step of a standard customer interaction, from greeting to call closure.",
        [
          "List the steps of a call flow in order.",
          "Where does the empathy statement come in the call flow?",
          "What will you include in your My Contact Center Journey portfolio?",
        ],
      ),
    ],
    quiz: [
      q(
        "What is a call flow?",
        [
          "The speed of the internet",
          "The sequence of steps in a call from greeting to closing",
          "A type of phone",
          "The number of calls in a day",
        ],
        1,
        "A call flow is the standard order of steps every call follows.",
      ),
      q(
        "Which is the correct order?",
        [
          "Closing, opening, resolution",
          "Opening, verification, probing, resolution, closing",
          "Probing, closing, opening",
          "Resolution, opening, verification",
        ],
        1,
        "Calls open, verify the customer, probe for the concern, resolve it, then close.",
      ),
      q(
        "\"I'm sorry to hear that. I'll be glad to help.\" is a…",
        [
          "probing question",
          "empathy statement",
          "closing spiel",
          "hold spiel",
        ],
        1,
        "It acknowledges the customer's feelings and assures help — an empathy statement.",
      ),
      q(
        "After resolving the concern, the agent should…",
        [
          "hang up immediately",
          "confirm the customer is satisfied and offer further help",
          "verify the customer again",
          "transfer the call",
        ],
        1,
        "Confirming and offering further help makes sure nothing is left unresolved.",
      ),
      q(
        "What does the agent do after the call ends?",
        [
          "Nothing",
          "Wrap-up: document the concern, actions and next steps",
          "Call the customer again immediately",
          "Delete the account",
        ],
        1,
        "Wrap-up (after-call work) records the call so the case can be followed correctly.",
      ),
    ],
  },
];

/** TLE 9 – ICT: Telecommunications (Contact Center Services). */
export const telecommunications = (grade: 9 | 10): DemoSubject => ({
  key: `TLE${grade}-TEL`,
  code: `TLE ${grade}-TEL`,
  name: `TLE ${grade} – ICT: Telecommunications`,
  department: TLE_DEPARTMENT,
  description:
    "Contact center services: performing phone etiquette in handling calls and call flow (DepEd Budget of Work, Grade 9 or 10).",
  colorToken: "teal",
  units: UNITS,
});
