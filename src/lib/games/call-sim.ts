/**
 * Call Simulator, the Telecommunications (Contact Center Services) game: a
 * customer calls, and at each turn the student picks what the agent says.
 * Good replies raise Customer Satisfaction; slow or careless ones cost
 * handle time. Two calls per unit of the course.
 *
 * Scoring lives here so the server can score a call from the choices alone.
 */

export type CallOption = {
  text: string;
  /** 10 = best practice, 5 = acceptable, 0 = wrong. */
  points: 0 | 5 | 10;
  /** Seconds this reply adds to the handle time. */
  seconds: number;
  /** Shown after choosing: why this reply is good or bad. */
  feedback: string;
};

export type CallStep = {
  /** What the customer says (empty on the opening, where the call rings). */
  customer: string;
  /** The call-flow step or skill being practiced, e.g. "Opening". */
  skill: string;
  options: CallOption[];
};

export type CallLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  caller: string;
  /** "Inbound" or "Outbound", and the account. */
  setup: string;
  /** Target handle time in seconds (AHT goal for this call). */
  targetSeconds: number;
  steps: CallStep[];
};

const o = (
  text: string,
  points: 0 | 5 | 10,
  seconds: number,
  feedback: string,
): CallOption => ({ text, points, seconds, feedback });
const step = (
  skill: string,
  customer: string,
  options: CallOption[],
): CallStep => ({ skill, customer, options });

export const CALL_LEVELS: CallLevel[] = [
  // Unit 1: The Contact Center Industry
  {
    id: "tel-1-1",
    unit: 1,
    unitTitle: "First Day on the Floor",
    title: "Your First Call",
    caller: "Aling Rosa",
    setup: "Inbound · Telco customer service account",
    targetSeconds: 150,
    steps: [
      step("Opening", "", [
        o(
          "Hello? Who's this?",
          0,
          10,
          "Agents never answer like a personal phone. Use the account's greeting.",
        ),
        o(
          "Thank you for calling Momo Telco, this is Ana. How may I help you today?",
          10,
          10,
          "A complete opening: thank, company name, your name, and an offer to help.",
        ),
        o(
          "Momo Telco.",
          5,
          5,
          "Fast, but it sounds cold and leaves out your name and an offer to help.",
        ),
      ]),
      step(
        "Listen",
        "Hi, my load disappeared right after I bought a promo. ₱50 is gone!",
        [
          o(
            "That's impossible, the system doesn't make mistakes.",
            0,
            15,
            "Never argue or blame. Listen first and acknowledge the concern.",
          ),
          o(
            "Okay.",
            5,
            5,
            "Too short. The customer can't tell if you understood.",
          ),
          o(
            "I understand how frustrating it is to lose your load. Let me check that for you.",
            10,
            15,
            "Acknowledging the feeling, then promising action, calms the caller.",
          ),
        ],
      ),
      step("Verify", "Yes please, check it.", [
        o(
          "May I have the mobile number on the account, and for security, your full name?",
          10,
          20,
          "Always verify the account before looking at or sharing its details.",
        ),
        o(
          "Just tell me your password so I can log in.",
          0,
          15,
          "Never ask for passwords or PINs. That breaks the Data Privacy Act and company policy.",
        ),
        o(
          "What's your number?",
          5,
          10,
          "Verification needs more than the number alone; also confirm the owner.",
        ),
      ]),
      step("Resolve", "It's 0917 123 4567, Rosa Santos.", [
        o(
          "Thank you, Ms. Santos. I see the ₱50 went to the GoSURF50 promo you registered at 9:05 AM, so your data is active until Sunday.",
          10,
          30,
          "Clear and accurate: what happened, when, and what she has now.",
        ),
        o(
          "It's in the system. Bye.",
          0,
          10,
          "The customer still doesn't know where the money went. The concern is not resolved.",
        ),
        o(
          "It went to a promo, I think.",
          5,
          15,
          "Guessing ('I think') sounds unsure. Check, then state the facts.",
        ),
      ]),
      step("Closing", "Oh! So it's my data promo. Thank you.", [
        o(
          "Is there anything else I can help you with, Ms. Santos? Thank you for calling Momo Telco, have a great day!",
          10,
          15,
          "Offer further help, thank the customer, and close politely.",
        ),
        o(
          "Okay bye.",
          0,
          5,
          "An abrupt closing ruins a good call. Always offer further help and thank the customer.",
        ),
        o(
          "You're welcome.",
          5,
          5,
          "Polite, but skips the offer of further help and the branded closing.",
        ),
      ]),
    ],
  },
  {
    id: "tel-1-2",
    unit: 1,
    unitTitle: "First Day on the Floor",
    title: "Who Does What?",
    caller: "Mr. Lim",
    setup: "Inbound · Bank credit card account",
    targetSeconds: 150,
    steps: [
      step("Opening", "", [
        o(
          "Good morning, thank you for calling Momo Bank, this is Carlo. How may I help you?",
          10,
          10,
          "A full, warm opening.",
        ),
        o(
          "Yes, what do you need?",
          0,
          5,
          "Sounds annoyed. The opening sets the mood of the whole call.",
        ),
        o(
          "Momo Bank, Carlo speaking.",
          5,
          5,
          "Correct facts, but it does not offer help.",
        ),
      ]),
      step("Probe", "I want to ask about the charge on my card.", [
        o(
          "Which charge do you mean? Can you give me the date and amount?",
          10,
          15,
          "Probing questions get the details you need to help.",
        ),
        o(
          "All charges are correct, sir.",
          0,
          10,
          "You can't know that before you check.",
        ),
        o(
          "Charges are handled by billing. Bye.",
          0,
          5,
          "Never end a call without helping or transferring properly.",
        ),
      ]),
      step("Verify", "The ₱2,499 on October 20.", [
        o(
          "Before I check, may I verify the cardholder's full name and birthday?",
          10,
          20,
          "Bank accounts need verification before you discuss transactions.",
        ),
        o(
          "Let me read your whole card number back to you.",
          0,
          15,
          "Never read out full card numbers. Protect customer data.",
        ),
        o(
          "Okay, checking now.",
          5,
          10,
          "Checking without verifying first can expose someone's private data.",
        ),
      ]),
      step(
        "Escalate",
        "Benjamin Lim, March 3, 1980. I didn't make that purchase!",
        [
          o(
            "I understand, Mr. Lim. For your protection I'll block the card now and transfer you to our Fraud team, who handle disputes. Please hold for a moment.",
            10,
            25,
            "Possible fraud goes to the right team (escalation), and you explain what happens next.",
          ),
          o(
            "You probably forgot you bought it.",
            0,
            10,
            "Never accuse the customer.",
          ),
          o(
            "I can't do anything about that.",
            0,
            10,
            "Even if it isn't your task, guide the customer to the team that can help.",
          ),
        ],
      ),
      step("Closing", "Okay, thank you.", [
        o(
          "Thank you for your patience, Mr. Lim. I'm connecting you now.",
          10,
          10,
          "A courteous warm transfer.",
        ),
        o(
          "(Transfer without saying anything)",
          0,
          5,
          "A cold transfer leaves the customer confused.",
        ),
        o(
          "Hold on.",
          5,
          5,
          "Short, but at least it tells the customer what is happening.",
        ),
      ]),
    ],
  },

  // Unit 2: Call Types and Contact Center Duties
  {
    id: "tel-2-1",
    unit: 2,
    unitTitle: "Inbound & Outbound",
    title: "Outbound Reminder",
    caller: "Ms. Reyes",
    setup: "Outbound · Electric company payment reminder",
    targetSeconds: 140,
    steps: [
      step("Opening", "Hello?", [
        o(
          "Good afternoon! This is Mia from Momo Electric. May I speak with Ms. Joy Reyes?",
          10,
          10,
          "Outbound calls start by saying who you are and asking for the right person.",
        ),
        o(
          "Pay your bill.",
          0,
          5,
          "Rude, and you haven't checked who you're talking to.",
        ),
        o(
          "Is this Joy?",
          5,
          5,
          "Too casual, and it doesn't say who is calling.",
        ),
      ]),
      step("Ask permission", "Yes, this is Joy.", [
        o(
          "Thank you, Ms. Reyes. This call is about your electric account. Is this a good time to talk for 2 minutes?",
          10,
          15,
          "Asking permission respects the customer's time.",
        ),
        o(
          "You have an unpaid bill of ₱3,250.",
          0,
          10,
          "Never discuss account details before verifying it's the account holder.",
        ),
        o("I'll be quick.", 5, 5, "Better to ask if it's a good time."),
      ]),
      step("Verify", "Sure, go ahead.", [
        o(
          "To protect your account, may I confirm the account number or service address?",
          10,
          20,
          "Verify before sharing billing details.",
        ),
        o(
          "What's your mother's maiden name and bank PIN?",
          0,
          15,
          "Never ask for a PIN.",
        ),
        o(
          "You're Joy, right? Okay.",
          5,
          5,
          "Not enough. A name alone doesn't verify an account.",
        ),
      ]),
      step("Inform", "It's 45 Mabini St., Panabo.", [
        o(
          "Thank you. Your bill of ₱3,250 was due on October 15. You can pay at any payment center or through the app to avoid disconnection.",
          10,
          25,
          "Clear facts plus ways to pay.",
        ),
        o(
          "You will be disconnected tomorrow!",
          0,
          10,
          "Threatening language makes customers defensive. Inform, don't scare.",
        ),
        o(
          "You have a bill.",
          5,
          5,
          "Too vague; give the amount, due date and options.",
        ),
      ]),
      step("Closing", "Oh, I forgot. I'll pay later today.", [
        o(
          "Thank you, Ms. Reyes! Once paid, it will reflect within 24 hours. Have a nice day.",
          10,
          15,
          "Confirms next step and closes politely.",
        ),
        o("You'd better.", 0, 5, "Disrespectful."),
        o(
          "Okay, bye.",
          5,
          5,
          "Polite enough, but misses the useful information.",
        ),
      ]),
    ],
  },
  {
    id: "tel-2-2",
    unit: 2,
    unitTitle: "Inbound & Outbound",
    title: "Taking an Order",
    caller: "Kuya Jun",
    setup: "Inbound · Pizza delivery order taking",
    targetSeconds: 170,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Pizza, this is Lea. May I take your order?",
          10,
          10,
          "Greets and states the purpose of the line.",
        ),
        o("Order?", 0, 5, "Too short and unfriendly."),
        o("Momo Pizza.", 5, 5, "Correct, but cold."),
      ]),
      step("Listen", "One large Hawaiian and two Cokes.", [
        o(
          "Got it.",
          5,
          5,
          "Fine, but you will need to confirm the order later.",
        ),
        o(
          "One large Hawaiian pizza and two Cokes. Would you like regular or 1.5-liter Coke?",
          10,
          15,
          "Repeat the order and probe for missing details.",
        ),
        o(
          "Hawaiian is not good, get Pepperoni.",
          0,
          10,
          "Respect the customer's choice.",
        ),
      ]),
      step("Details", "Regular. Deliver to Purok 3, San Vicente.", [
        o(
          "Thank you. May I have a landmark and a contact number for the rider?",
          10,
          15,
          "Accurate address details prevent failed deliveries.",
        ),
        o(
          "Okay. (Write 'San Vicente' only)",
          0,
          10,
          "Missing details cause wrong deliveries and complaints.",
        ),
        o(
          "San Vicente, okay.",
          5,
          5,
          "Partly correct, but the rider will need a landmark and number.",
        ),
      ]),
      step("Confirm", "Near the barangay hall, 0918 555 0101.", [
        o(
          "Let me confirm: 1 large Hawaiian and 2 regular Cokes to Purok 3, San Vicente, near the barangay hall, 0918 555 0101. Your total is ₱689. Is that correct?",
          10,
          25,
          "Recapping the order catches mistakes before they happen.",
        ),
        o("Okay, it's coming.", 0, 5, "No confirmation and no total."),
        o(
          "Your total is ₱689.",
          5,
          10,
          "Gives the total, but doesn't confirm the order.",
        ),
      ]),
      step("Closing", "Yes, correct.", [
        o(
          "Thank you! Your order will arrive in about 30 minutes. Enjoy your meal!",
          10,
          10,
          "Sets expectations and closes warmly.",
        ),
        o("Bye.", 0, 5, "Abrupt."),
        o("Thanks.", 5, 5, "Polite but incomplete."),
      ]),
    ],
  },

  // Unit 3: Skills, Attributes and Services
  {
    id: "tel-3-1",
    unit: 3,
    unitTitle: "Skills Lab",
    title: "Active Listening",
    caller: "Lola Nena",
    setup: "Inbound · Internet provider technical support",
    targetSeconds: 200,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Fiber, this is Paolo. How can I help you today?",
          10,
          10,
          "Complete opening.",
        ),
        o("Tech support, what's broken?", 0, 5, "Rushed and unfriendly."),
        o("Hello, Momo Fiber.", 5, 5, "Okay, but incomplete."),
      ]),
      step(
        "Patience",
        "Hijo, my apo set this up and now the… the light is red, the thing with antennas…",
        [
          o(
            "Ma'am, just tell me the exact model number.",
            0,
            15,
            "Customers may not know technical words. Be patient.",
          ),
          o(
            "Take your time, Ma'am. Is the red light on the box your internet comes from, the modem?",
            10,
            20,
            "Patience and simple words help customers who aren't tech-savvy.",
          ),
          o(
            "Red light means problem.",
            5,
            10,
            "True, but it doesn't move the call forward.",
          ),
        ],
      ),
      step("Probe", "Yes, the modem. The light that says LOS is red.", [
        o(
          "Thank you, Ma'am. Did anything happen recently, like a storm or someone moving the cable?",
          10,
          20,
          "Good probing narrows down the cause.",
        ),
        o(
          "I'll send a technician next month.",
          0,
          10,
          "Too slow, and you haven't tried to solve it.",
        ),
        o(
          "LOS means loss of signal.",
          5,
          10,
          "Correct but doesn't continue troubleshooting.",
        ),
      ]),
      step("Resolve", "There was a strong wind last night.", [
        o(
          "The wind may have damaged the line outside. I've created a repair ticket, number 48213, and a technician will visit within 24 hours.",
          10,
          30,
          "Explains the likely cause, gives a ticket number and a time frame.",
        ),
        o("That's not our fault.", 0, 10, "Blaming doesn't help the customer."),
        o(
          "Please restart the modem.",
          5,
          15,
          "A fair first step, but a red LOS light usually needs a technician.",
        ),
      ]),
      step("Closing", "Salamat, hijo.", [
        o(
          "Walang anuman po, Lola. Is there anything else I can help you with? Thank you for calling Momo Fiber.",
          10,
          15,
          "Warm, respectful and complete.",
        ),
        o("Okay.", 0, 5, "Abrupt."),
        o("Bye po.", 5, 5, "Respectful but incomplete."),
      ]),
    ],
  },
  {
    id: "tel-3-2",
    unit: 3,
    unitTitle: "Skills Lab",
    title: "Know Your Product",
    caller: "Ms. Garcia",
    setup: "Inbound · Telco sales",
    targetSeconds: 160,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Telco, this is Rey. How may I help you?",
          10,
          10,
          "Complete opening.",
        ),
        o("Sales.", 0, 5, "Too short."),
        o("Hi, Rey here.", 5, 5, "Friendly but no company name."),
      ]),
      step("Probe", "I want a new plan for my small sari-sari store.", [
        o(
          "Great! How will you mostly use it — calls, data for GCash and social media, or both?",
          10,
          15,
          "Probing finds the right product for the customer's needs.",
        ),
        o(
          "Get the most expensive plan.",
          0,
          10,
          "Pushing products without knowing needs hurts trust.",
        ),
        o("We have many plans.", 5, 5, "True but unhelpful."),
      ]),
      step(
        "Product knowledge",
        "Mostly data for GCash orders, about 10 GB a month.",
        [
          o(
            "Plan 599 fits: 15 GB data plus unli calls and texts, so you have room to spare.",
            10,
            20,
            "Accurate product knowledge matched to the need.",
          ),
          o(
            "I'm not sure what plans we have.",
            0,
            10,
            "Agents must know their products.",
          ),
          o(
            "Plan 999 has 40 GB.",
            5,
            15,
            "It works, but it's more than she needs.",
          ),
        ],
      ),
      step("Objection", "Is there a contract?", [
        o(
          "Yes, it's a 24-month contract, and you'll get a free SIM and modem.",
          10,
          15,
          "Honest, complete answer.",
        ),
        o(
          "No contract at all.",
          0,
          10,
          "Giving wrong information leads to complaints later.",
        ),
        o("Just the usual.", 5, 5, "Vague; customers need clear terms."),
      ]),
      step("Closing", "Okay, I'll get it.", [
        o(
          "Wonderful! I'll send the application link by text. Thank you for choosing Momo Telco!",
          10,
          15,
          "Clear next step and a warm close.",
        ),
        o("Fine.", 0, 5, "Unenthusiastic."),
        o("Thanks.", 5, 5, "Polite but no next step."),
      ]),
    ],
  },

  // Unit 4: Phone Etiquette
  {
    id: "tel-4-1",
    unit: 4,
    unitTitle: "Phone Etiquette",
    title: "Hold, Please",
    caller: "Mr. Cruz",
    setup: "Inbound · Airline reservations",
    targetSeconds: 180,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Air, this is Bea. How may I assist you?",
          10,
          10,
          "Complete opening.",
        ),
        o("Momo Air, what?", 0, 5, "Rude."),
        o("Hello, Momo Air.", 5, 5, "Incomplete."),
      ]),
      step(
        "Listen",
        "I want to move my Davao–Manila flight from Friday to Saturday.",
        [
          o(
            "Of course, Mr. Cruz. May I have your booking reference?",
            10,
            15,
            "Acknowledge and ask for what you need.",
          ),
          o(
            "Why?",
            0,
            10,
            "The reason is not your business unless policy needs it.",
          ),
          o("Okay.", 5, 5, "Fine, but ask for the booking reference."),
        ],
      ),
      step("Hold", "It's MX7Q2P.", [
        o(
          "Thank you. May I put you on hold for about 2 minutes while I check Saturday's flights?",
          10,
          15,
          "Ask permission and say how long the hold will be.",
        ),
        o(
          "(Put on hold without saying anything)",
          0,
          10,
          "Never hold without asking. The customer thinks the call dropped.",
        ),
        o(
          "Wait.",
          5,
          5,
          "Better than silence, but ask politely and give a time.",
        ),
      ]),
      step("Return from hold", "Sure.", [
        o(
          "Thank you for holding, Mr. Cruz. Saturday has a 10:20 AM flight with seats. The change fee is ₱1,200.",
          10,
          25,
          "Thank the customer for holding, then give clear results.",
        ),
        o("Okay so, ₱1,200.", 0, 10, "No thanks and missing details."),
        o("I'm back. There's a flight.", 5, 10, "Incomplete information."),
      ]),
      step("Closing", "Okay, please book it.", [
        o(
          "Done! Your new flight is Saturday, 10:20 AM. A confirmation will be emailed. Is there anything else? Thank you for flying Momo Air!",
          10,
          20,
          "Confirms, offers more help, branded close.",
        ),
        o("Booked. Bye.", 0, 5, "Abrupt."),
        o("All set.", 5, 5, "Polite but incomplete."),
      ]),
    ],
  },
  {
    id: "tel-4-2",
    unit: 4,
    unitTitle: "Phone Etiquette",
    title: "The Irate Caller",
    caller: "Ms. Torres",
    setup: "Inbound · Online shop customer care",
    targetSeconds: 210,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Shop, this is Jay. How may I help you?",
          10,
          10,
          "Complete opening.",
        ),
        o("What now?", 0, 5, "Never sound annoyed."),
        o("Momo Shop.", 5, 5, "Incomplete."),
      ]),
      step(
        "Don't interrupt",
        "THIS IS THE THIRD TIME! My order is two weeks late and nobody helps me!",
        [
          o(
            "Ma'am, calm down!",
            0,
            10,
            "Telling an upset customer to calm down makes it worse.",
          ),
          o(
            "(Let her finish) I'm really sorry, Ms. Torres. Waiting two weeks is not okay, and I'll make sure we fix this today.",
            10,
            20,
            "Let the customer vent, apologize sincerely, and take ownership.",
          ),
          o(
            "That's the courier's fault, not ours.",
            0,
            10,
            "Blaming others doesn't solve the problem.",
          ),
        ],
      ),
      step("Empathy", "I needed it for my daughter's birthday!", [
        o(
          "I understand how important that was. Let me check exactly where your order is. May I have the order number?",
          10,
          20,
          "Empathy plus action.",
        ),
        o("Birthdays happen every year.", 0, 5, "Insensitive."),
        o("Okay, order number?", 5, 10, "Moves forward, but shows no empathy."),
      ]),
      step("Resolve", "It's MS-77812.", [
        o(
          "Thank you. The parcel was stuck at the hub. I've rushed it for delivery tomorrow and added a ₱200 voucher for the trouble.",
          10,
          30,
          "A real solution plus service recovery.",
        ),
        o("It will come eventually.", 0, 10, "No ownership and no date."),
        o(
          "I'll file a report.",
          5,
          15,
          "A step, but no clear outcome for the customer.",
        ),
      ]),
      step("Closing", "Okay… thank you for actually helping.", [
        o(
          "You're welcome, Ms. Torres. Here's my ticket number, 99012, in case you need to follow up. I'm sorry again, and happy birthday to your daughter!",
          10,
          20,
          "Gives a follow-up reference and ends warmly.",
        ),
        o("Finally, bye.", 0, 5, "Unprofessional."),
        o("No problem.", 5, 5, "Polite but brief."),
      ]),
    ],
  },

  // Unit 5: Contact Center Metrics
  {
    id: "tel-5-1",
    unit: 5,
    unitTitle: "Beat the Metrics",
    title: "First Call Resolution",
    caller: "Mr. Dela Cruz",
    setup: "Inbound · Water utility billing",
    targetSeconds: 170,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Water, this is Kim. How may I help you?",
          10,
          10,
          "Complete opening.",
        ),
        o("Water.", 0, 5, "Too short."),
        o("Hi, Momo Water.", 5, 5, "Incomplete."),
      ]),
      step("Probe", "My bill doubled this month.", [
        o(
          "I can check that for you. After verifying your account, I'll compare this month's reading with last month's.",
          10,
          20,
          "Explains what you'll do — the customer feels in good hands.",
        ),
        o(
          "Call back next week when the supervisor is in.",
          0,
          10,
          "Pushing the call away hurts FCR (First Call Resolution).",
        ),
        o("Bills go up sometimes.", 5, 10, "Doesn't investigate."),
      ]),
      step("Resolve", "Account 22-4410, Pedro Dela Cruz.", [
        o(
          "Thank you. Your usage jumped from 12 to 26 cubic meters. That usually means a leak. I've scheduled a free leak inspection for Thursday.",
          10,
          30,
          "Finds the cause and solves it in this one call — that's FCR.",
        ),
        o(
          "The bill is correct. Bye.",
          0,
          10,
          "The customer will call again, so FCR fails.",
        ),
        o("You used more water.", 5, 10, "True, but doesn't help him fix it."),
      ]),
      step("AHT", "Can you also explain each line of my bill?", [
        o(
          "Sure: basic charge ₱180, usage ₱940, and environmental fee ₱20. I'll also text you a breakdown.",
          10,
          20,
          "Answers completely but efficiently, keeping AHT reasonable.",
        ),
        o(
          "(Read the whole 3-page terms of service)",
          0,
          40,
          "Too long. It wastes time and confuses the customer.",
        ),
        o("It's all in the paper.", 5, 5, "Fast, but not helpful."),
      ]),
      step("Closing", "That's clear, thanks.", [
        o(
          "You're welcome, Mr. Dela Cruz. Anything else? Thank you for calling Momo Water.",
          10,
          10,
          "Complete close.",
        ),
        o("Bye.", 0, 5, "Abrupt."),
        o("Okay po.", 5, 5, "Polite but incomplete."),
      ]),
    ],
  },
  {
    id: "tel-5-2",
    unit: 5,
    unitTitle: "Beat the Metrics",
    title: "Customer Satisfaction",
    caller: "Ms. Bautista",
    setup: "Inbound · Bank account services",
    targetSeconds: 170,
    steps: [
      step("Opening", "", [
        o(
          "Good afternoon, thank you for calling Momo Bank, this is Ivy. How may I help you today?",
          10,
          10,
          "Complete opening.",
        ),
        o("Yes?", 0, 5, "Cold."),
        o("Momo Bank.", 5, 5, "Incomplete."),
      ]),
      step(
        "Listen",
        "I forgot my online banking password and I'm locked out.",
        [
          o(
            "Don't worry, Ms. Bautista, I can help you reset it. First I need to verify your identity.",
            10,
            15,
            "Reassure, then explain the next step.",
          ),
          o("Tell me your old password.", 0, 10, "Never ask for passwords."),
          o("That happens a lot.", 5, 5, "Friendly but doesn't move forward."),
        ],
      ),
      step("Verify", "Okay.", [
        o(
          "Please give me your full name, birthday, and the last 4 digits of your account number.",
          10,
          20,
          "Proper verification protects the customer.",
        ),
        o(
          "Just give me your full account number and ATM PIN.",
          0,
          15,
          "Never ask for a PIN.",
        ),
        o("What's your name?", 5, 10, "Not enough to verify."),
      ]),
      step("Resolve", "Liza Bautista, May 9, 1995, 4471.", [
        o(
          "Thank you, you're verified. I've sent a reset link to your registered email; it expires in 15 minutes. Would you like me to stay on the line while you open it?",
          10,
          25,
          "Solves it and offers to stay — that raises CSAT.",
        ),
        o(
          "Reset it yourself on the website.",
          0,
          10,
          "She's locked out. This doesn't help.",
        ),
        o("I sent a link.", 5, 10, "Correct, but missing useful details."),
      ]),
      step("Closing", "It worked! Thank you so much.", [
        o(
          "I'm glad I could help! You may receive a short survey about this call. Thank you for banking with Momo Bank.",
          10,
          15,
          "A friendly close; mentioning the survey connects to CSAT.",
        ),
        o("Okay.", 0, 5, "Flat."),
        o("Welcome.", 5, 5, "Polite but short."),
      ]),
    ],
  },

  // Unit 6: Accuracy and Fluency in Communication
  {
    id: "tel-6-1",
    unit: 6,
    unitTitle: "Speak Clearly",
    title: "Spell It Right",
    caller: "Mr. Ng",
    setup: "Inbound · Hotel reservations",
    targetSeconds: 180,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Hotel, this is Dan. How may I help you?",
          10,
          10,
          "Complete opening.",
        ),
        o("Hotel.", 0, 5, "Too short."),
        o("Hi!", 5, 5, "Friendly but missing details."),
      ]),
      step("Probe", "I want to book a room for two nights from November 3.", [
        o(
          "Certainly, sir. November 3 to 5, checking out on the 5th. For how many guests?",
          10,
          15,
          "Repeating dates prevents booking errors.",
        ),
        o("Okay, booked.", 0, 5, "You don't have enough details yet."),
        o("How many?", 5, 5, "Fine, but confirm the dates too."),
      ]),
      step("Accuracy", "Two guests. The name is Ng — N, G.", [
        o(
          "Thank you. That's N as in November, G as in Golf — Ng. May I have your first name?",
          10,
          20,
          "The phonetic alphabet (N as in November) prevents spelling mistakes.",
        ),
        o(
          "Eng? E-N-G?",
          0,
          10,
          "Guessing leads to errors. Confirm the spelling.",
        ),
        o("N-G, okay.", 5, 5, "Good, but phonetic spelling is more reliable."),
      ]),
      step("Confirm", "Kevin.", [
        o(
          "Let me confirm: Kevin Ng, deluxe room for 2 guests, November 3 to 5, two nights at ₱3,500 per night, total ₱7,000.",
          10,
          25,
          "Recap everything clearly so nothing is wrong.",
        ),
        o("Booked for Kevin.", 0, 5, "Missing details."),
        o("Total is ₱7,000.", 5, 10, "Only part of the recap."),
      ]),
      step("Closing", "Perfect.", [
        o(
          "Your confirmation number is H-5521. We look forward to welcoming you, Mr. Ng!",
          10,
          15,
          "Gives a reference number and a warm close.",
        ),
        o("Bye.", 0, 5, "Abrupt."),
        o("Thanks for booking.", 5, 5, "Polite but incomplete."),
      ]),
    ],
  },
  {
    id: "tel-6-2",
    unit: 6,
    unitTitle: "Speak Clearly",
    title: "Write the Ticket",
    caller: "Ms. Villanueva",
    setup: "Inbound · Appliance warranty support",
    targetSeconds: 190,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Appliances, this is Rina. How may I help you?",
          10,
          10,
          "Complete opening.",
        ),
        o("Appliances, yeah?", 0, 5, "Too casual."),
        o("Momo Appliances.", 5, 5, "Incomplete."),
      ]),
      step("Probe", "My refrigerator is not cold anymore.", [
        o(
          "I'm sorry to hear that. When did it start, and is the light inside still on?",
          10,
          15,
          "Specific probing questions.",
        ),
        o("Buy a new one.", 0, 5, "Unhelpful."),
        o("Is it plugged in?", 5, 10, "A reasonable check, but ask more."),
      ]),
      step(
        "Document",
        "Since yesterday. The light is on, but it's warm inside.",
        [
          o(
            "Thank you. (Ticket note: 'Customer reports ref not cooling since Oct 24; interior light on; unit warm. Under warranty until 2027.')",
            10,
            20,
            "A clear, complete, correctly written note helps the next agent or technician.",
          ),
          o(
            "(Ticket note: 'ref broke')",
            0,
            10,
            "Too vague. Others won't understand the problem.",
          ),
          o(
            "(Ticket note: 'Not cold since yesterday.')",
            5,
            10,
            "Partly useful, but missing key details.",
          ),
        ],
      ),
      step("Resolve", "Is it still under warranty?", [
        o(
          "Yes, your warranty is valid until March 2027, so the repair is free. A technician will call you within 48 hours to schedule a visit.",
          10,
          25,
          "Accurate information and a clear next step.",
        ),
        o("I think so, maybe.", 0, 10, "Check before you answer."),
        o("Yes.", 5, 5, "Correct but incomplete."),
      ]),
      step("Closing", "Thank you.", [
        o(
          "You're welcome! Your ticket number is W-30318. Thank you for calling Momo Appliances.",
          10,
          15,
          "Reference number plus a polite close.",
        ),
        o("Bye.", 0, 5, "Abrupt."),
        o("Okay po.", 5, 5, "Polite but incomplete."),
      ]),
    ],
  },

  // Unit 7: Accounts and Call-Handling Procedures
  {
    id: "tel-7-1",
    unit: 7,
    unitTitle: "Follow the Procedure",
    title: "Data Privacy",
    caller: "Caller who says he's 'the husband'",
    setup: "Inbound · Telco postpaid account",
    targetSeconds: 160,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Telco, this is Leo. How may I help you?",
          10,
          10,
          "Complete opening.",
        ),
        o("Who's this?", 0, 5, "Unprofessional."),
        o("Momo Telco.", 5, 5, "Incomplete."),
      ]),
      step(
        "Listen",
        "I'm the husband of Maria Lopez. Give me the list of numbers she called last month.",
        [
          o(
            "Sure, here are the numbers…",
            0,
            15,
            "Never share an account's details with someone who isn't the verified owner. This violates the Data Privacy Act of 2012.",
          ),
          o(
            "I understand, sir. Call records are private, so I can only discuss them with the account holder.",
            10,
            20,
            "Polite and firm: protect customer data.",
          ),
          o("No.", 5, 5, "Correct decision, but explain politely."),
        ],
      ),
      step("Procedure", "But I pay the bill!", [
        o(
          "I understand. Ms. Lopez can call us herself, or she can add you as an authorized person on the account. Then I'd be glad to help.",
          10,
          20,
          "Explains the proper procedure and a path forward.",
        ),
        o(
          "Fine, I'll make an exception.",
          0,
          10,
          "No exceptions to data privacy.",
        ),
        o("Rules are rules.", 5, 5, "True, but offer a solution."),
      ]),
      step("Help", "Okay. How does she add me?", [
        o(
          "She can call this hotline or visit any Momo store with a valid ID and fill out the authorization form.",
          10,
          20,
          "Accurate steps.",
        ),
        o("I don't know.", 0, 5, "Know your procedures."),
        o("She can visit a store.", 5, 10, "Partly correct."),
      ]),
      step("Closing", "Alright, thanks.", [
        o(
          "Thank you for understanding, sir. Is there anything else I can help with? Have a good day.",
          10,
          10,
          "Courteous close.",
        ),
        o("Bye.", 0, 5, "Abrupt."),
        o("Okay.", 5, 5, "Flat."),
      ]),
    ],
  },
  {
    id: "tel-7-2",
    unit: 7,
    unitTitle: "Follow the Procedure",
    title: "Escalate Correctly",
    caller: "Mr. Ramos",
    setup: "Inbound · Internet provider",
    targetSeconds: 200,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Fiber, this is Gab. How may I help you?",
          10,
          10,
          "Complete opening.",
        ),
        o("Yep?", 0, 5, "Too casual."),
        o("Momo Fiber.", 5, 5, "Incomplete."),
      ]),
      step(
        "Listen",
        "My internet has been down for 5 days. I work from home and I'm losing money!",
        [
          o(
            "I'm very sorry, Mr. Ramos. Five days is too long. Let me pull up your account and the ticket history.",
            10,
            20,
            "Empathy and ownership.",
          ),
          o("Lots of people have that problem.", 0, 10, "Doesn't help him."),
          o("Account number?", 5, 10, "Moves forward but shows no empathy."),
        ],
      ),
      step("Check", "Account 7781-02. I want to talk to a manager!", [
        o(
          "I'll do everything I can first. I see 3 tickets and the repair is overdue. Since it's past the 72-hour target, I'm escalating it to our Supervisor and the field team as urgent.",
          10,
          25,
          "Escalate when the case meets the rules (overdue SLA) — and tell the customer.",
        ),
        o("Managers are busy.", 0, 10, "Dismissive."),
        o(
          "(Transfer to manager without checking)",
          5,
          15,
          "Allowed, but check the account first so the supervisor has the facts.",
        ),
      ]),
      step("Set expectations", "When will it be fixed?", [
        o(
          "The supervisor will call you within 2 hours with a repair schedule, and I've requested a bill credit for the 5 days.",
          10,
          25,
          "Clear time frame plus service recovery.",
        ),
        o("Soon.", 0, 5, "Vague."),
        o("Today, hopefully.", 5, 10, "Don't promise what you can't confirm."),
      ]),
      step("Closing", "Okay. I'll wait for the call.", [
        o(
          "Thank you for your patience, Mr. Ramos. Your escalation number is E-6620. Have a good day.",
          10,
          15,
          "Reference number and polite close.",
        ),
        o("Bye.", 0, 5, "Abrupt."),
        o("Okay sir.", 5, 5, "Incomplete."),
      ]),
    ],
  },

  // Unit 8: Performing a Call Flow
  {
    id: "tel-8-1",
    unit: 8,
    unitTitle: "Full Call Flow",
    title: "The Complete Call",
    caller: "Ms. Aquino",
    setup: "Inbound · Telco customer service",
    targetSeconds: 220,
    steps: [
      step("Opening", "", [
        o(
          "Good morning, thank you for calling Momo Telco, this is Sam. How may I help you today?",
          10,
          10,
          "Opening: greet, company, name, offer help.",
        ),
        o("Hello?", 0, 5, "Not a proper opening."),
        o("Momo Telco, Sam.", 5, 5, "Incomplete."),
      ]),
      step("Verify", "I want to upgrade my plan.", [
        o(
          "I'd be happy to help! May I have your mobile number and full name to verify the account?",
          10,
          20,
          "Verification step.",
        ),
        o("Which plan?", 5, 10, "Probing is good, but verify first."),
        o("Upgrades cost more.", 0, 5, "Not helpful."),
      ]),
      step("Probe", "0917 888 1212, Grace Aquino.", [
        o(
          "Thank you, Ms. Aquino. What do you use most — data, calls, or both? And are you happy with your current speed?",
          10,
          20,
          "Probing finds the right upgrade.",
        ),
        o("Take Plan 1999.", 0, 10, "Recommending without knowing needs."),
        o("You're on Plan 599.", 5, 10, "A fact, but no probing."),
      ]),
      step("Resolve", "Mostly data. I run out every month.", [
        o(
          "Plan 999 gives you 40 GB instead of 15 GB, for ₱400 more a month. The upgrade starts on your next billing cycle, November 1.",
          10,
          25,
          "Matches the need, states the price difference and when it starts.",
        ),
        o("Just buy promos.", 0, 10, "Doesn't respect her request."),
        o(
          "Plan 999 has more data.",
          5,
          10,
          "Partly helpful; missing price and start date.",
        ),
      ]),
      step("Recap", "Okay, upgrade me.", [
        o(
          "Let me recap: Plan 599 to Plan 999, 40 GB, ₱999 monthly, starting November 1. Is that correct?",
          10,
          20,
          "Recap before you close prevents errors.",
        ),
        o("Done.", 0, 5, "No recap."),
        o("Upgraded to 999.", 5, 10, "Partial recap."),
      ]),
      step("Closing", "Yes, correct.", [
        o(
          "Your upgrade is confirmed. Is there anything else I can help you with? Thank you for calling Momo Telco, Ms. Aquino. Have a wonderful day!",
          10,
          15,
          "Closing: further help, thanks, branded goodbye.",
        ),
        o("Bye.", 0, 5, "Abrupt."),
        o("Thanks.", 5, 5, "Incomplete."),
      ]),
    ],
  },
  {
    id: "tel-8-2",
    unit: 8,
    unitTitle: "Full Call Flow",
    title: "Boss Call: Rush Hour",
    caller: "Mr. Santos",
    setup: "Inbound · Delivery app support — the queue is full!",
    targetSeconds: 220,
    steps: [
      step("Opening", "", [
        o(
          "Thank you for calling Momo Express, this is Kai. How may I help you?",
          10,
          10,
          "Stay professional even when the queue is long.",
        ),
        o("(Sigh) Momo Express.", 0, 5, "Customers hear your mood."),
        o("Momo Express, hi.", 5, 5, "Incomplete."),
      ]),
      step(
        "Empathy",
        "My food came cold and half of it is missing! I'm so hungry!",
        [
          o(
            "I'm really sorry, Mr. Santos. That's frustrating, especially when you're hungry. Let me fix this right away.",
            10,
            20,
            "Empathy first.",
          ),
          o("Did you check the bag properly?", 0, 10, "Sounds like blame."),
          o("Order number?", 5, 10, "Efficient but cold."),
        ],
      ),
      step("Verify", "Fine.", [
        o(
          "May I have the order number and the phone number on the account?",
          10,
          15,
          "Verify before acting.",
        ),
        o(
          "Just tell me your card number.",
          0,
          15,
          "Never ask for full card numbers.",
        ),
        o("Name?", 5, 10, "Not enough to verify."),
      ]),
      step("Resolve", "Order 55-901, 0920 333 4444.", [
        o(
          "Thank you. I see the store missed 2 items. I've refunded ₱320 to your wallet and added a ₱100 voucher for the cold food.",
          10,
          30,
          "Fair, specific solution in one call.",
        ),
        o("Order again.", 0, 10, "Doesn't fix the problem."),
        o(
          "I'll report it to the store.",
          5,
          15,
          "A step, but the customer gets nothing now.",
        ),
      ]),
      step("Recap", "Okay, that's fair.", [
        o(
          "To recap: ₱320 refund and a ₱100 voucher, both in your wallet within 1 hour.",
          10,
          15,
          "Short, clear recap.",
        ),
        o("Okay bye.", 0, 5, "No recap."),
        o("Refund done.", 5, 5, "Partial."),
      ]),
      step("Closing", "Thanks.", [
        o(
          "Thank you for your patience, Mr. Santos. Enjoy your meal next time, and thank you for using Momo Express!",
          10,
          10,
          "Warm, branded close.",
        ),
        o("Next!", 0, 5, "Never rush the customer off the line."),
        o("Bye po.", 5, 5, "Polite but incomplete."),
      ]),
    ],
  },
];

/** The score of a call from the option picked at each step. */
export function scoreCall(level: CallLevel, choices: number[]) {
  let points = 0;
  let seconds = 0;
  level.steps.forEach((s, i) => {
    const option = s.options[choices[i] ?? -1];
    points += option?.points ?? 0;
    seconds += option?.seconds ?? 0;
  });
  const max = level.steps.length * 10;
  const percent = Math.round((points / max) * 100);
  // Going far over the handle-time target costs one star.
  const overTime = seconds > level.targetSeconds * 1.25;
  const base = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0;
  const stars = Math.max(base > 0 ? 1 : 0, base - (overTime ? 1 : 0));
  return { points, max, percent, seconds, overTime, stars };
}
