/**
 * Speak Up! — Easy: short, everyday agent lines and four-step calls.
 */
import {
  EASY,
  POLITE,
  SORRY,
  THANK,
  call,
  need,
  read,
  step,
} from "./speak-kit";

const R = (id: string, title: string, lines: (string | [string, string])[]) =>
  read(EASY, `spk-1-r${id}`, title, lines);

export const EASY_READS = [
  R("3", "Numbers", [
    [
      "Please press one for English.",
      "Say numbers clearly and a little slower.",
    ],
    "Press two for billing concerns.",
    "Your new balance is fifty pesos.",
    "The promo is good for seven days.",
    "Our hotline is open twenty four hours.",
    "Please wait for about five minutes.",
  ]),
  R("4", "Days and Times", [
    "Our store is open from Monday to Saturday.",
    "The technician will visit on Tuesday morning.",
    "Your bill is due on the fifteenth.",
    [
      "Please call us again tomorrow afternoon.",
      "to-MOR-row: stress the middle.",
    ],
    "We close at nine in the evening.",
    "Your promo ends this Sunday.",
  ]),
  R("5", "Polite Requests", [
    "May I have your account number, please?",
    "Could you spell your last name for me?",
    "Would you like me to send you a text?",
    "Please stay on the line.",
    "Kindly check the lights on your modem.",
    "Can you hear me clearly?",
  ]),
  R("6", "Saying Sorry", [
    ["I am sorry for the trouble.", "Sound sincere: slow down on “sorry”."],
    "I apologize for the long wait.",
    "Sorry to hear about your concern.",
    "I am sorry, could you say that again?",
    "We apologize for the delay.",
    "I am sorry, the line is not clear.",
  ]),
  R("7", "Holding and Transferring", [
    "May I put you on hold for a moment?",
    "Thank you for holding.",
    "I will transfer you to our billing team.",
    "Please do not hang up.",
    "I am back on the line.",
    "Sorry for keeping you waiting.",
  ]),
  R("8", "Confirming Details", [
    "Let me repeat your number.",
    "Is that correct?",
    "Just to confirm, your name is Maria Santos.",
    "Your address is in Quezon City.",
    "I have updated your email address.",
    "Your request is now complete.",
  ]),
  R("9", "Phone Parts", [
    ["Please check your SIM card.", "SIM rhymes with “him”."],
    "Turn on your mobile data.",
    "Charge your phone battery first.",
    "Look at the signal bars at the top.",
    "Open the settings on your phone.",
    "Turn airplane mode off.",
  ]),
  R("10", "Internet Words", [
    ["Your internet speed is slow.", "Stress IN-ter-net."],
    "Please restart your router.",
    "Connect to your home Wi-Fi.",
    "The cable must be plugged in.",
    "Your connection is back to normal.",
    "Try to open a website now.",
  ]),
  R("11", "Billing Words", [
    "Your monthly bill is ready.",
    "You can pay online or in our store.",
    "We received your payment today.",
    "Your account has no balance.",
    "Please pay before the due date.",
    "Thank you for paying on time.",
  ]),
  R("12", "Load and Promos", [
    "You can buy load at any store.",
    "This promo has unlimited calls and texts.",
    "Your data promo is now active.",
    "Text the promo code to register.",
    "Your load will expire in thirty days.",
    "You have one gigabyte of data left.",
  ]),
  R("13", "Asking Questions", [
    "What seems to be the problem?",
    "When did this start?",
    "Where are you calling from?",
    "Which phone are you using?",
    "How long have you had this problem?",
    "Did you try to restart your phone?",
  ]),
  R("14", "Giving Instructions", [
    "First, turn off your phone.",
    "Next, wait for ten seconds.",
    "Then, turn your phone back on.",
    "Now, try to make a call.",
    "Please tell me what you see.",
    "Great, that fixed the problem.",
  ]),
  R("15", "Kind Words", [
    ["You are very welcome.", "Smile: it changes how your voice sounds."],
    "It was my pleasure to help you.",
    "Thank you for your patience.",
    "I understand how you feel.",
    "Do not worry, I will help you.",
    "Thank you for being our customer.",
  ]),
  R("16", "Closing the Call", [
    "Is there anything else I can do for you?",
    "Thank you for calling Momo Telco.",
    "Have a great day ahead.",
    "Take care and goodbye.",
    "Enjoy the rest of your day.",
    "We are always here to help.",
  ]),
  R("17", "Store Visits", [
    "Please bring a valid ID.",
    "Our nearest store is in the mall.",
    "You can visit us from ten to nine.",
    "Please take a number at the door.",
    "Our staff will assist you there.",
    "You may also book a visit online.",
  ]),
  R("18", "Repairs", [
    "I will report the problem now.",
    "A technician will check your line.",
    "The repair will take one day.",
    "Please keep your phone open.",
    "We will text you an update.",
    "Your line is working again.",
  ]),
  R("19", "Sounds of English", [
    ["Fine, five, fast, phone.", "“f”: top teeth on your lower lip."],
    ["Very, voice, video, visit.", "“v” is voiced: feel your lip buzz."],
    [
      "Think, thank, three, thirty.",
      "“th”: tongue lightly between your teeth.",
    ],
    "Ship, she, shop, short.",
    "Pay, pen, print, please.",
    "Bill, bank, box, busy.",
  ]),
  R("20", "My First Script", [
    "Good afternoon, thank you for calling.",
    "My name is Ana, how may I help you?",
    "Let me check that for you.",
    "Thank you for waiting.",
    "Your concern is now fixed.",
    "Have a nice day, goodbye.",
  ]),
];

const TELCO = "Momo Telco";
const FIBER = "Momo Fiber";
const C = (
  id: string,
  title: string,
  caller: string,
  setup: string,
  agent: string,
  company: string,
  middle: ReturnType<typeof step>[],
  end?: string,
) =>
  call(
    EASY,
    `spk-1-c${id}`,
    title,
    { caller, setup, agent, company },
    middle,
    end,
  );

const YES = need(
  "Say yes or agree",
  "yes",
  "sure",
  "of course",
  "you can",
  "definitely",
  "absolutely",
);

export const EASY_CALLS = [
  C("3", "Store Hours", "Mr. Cruz", "Inbound · General inquiry", "Joy", TELCO, [
    step(
      "Answer",
      "What time does your store in the mall close?",
      "Tell him the store closes at nine in the evening.",
      "Our mall store closes at nine in the evening, sir.",
      [
        need("Say the closing time: nine", "nine"),
        need("Mention the store", "store", "branch", "shop"),
      ],
    ),
    step(
      "Answer",
      "Do I need to bring anything to get a new SIM?",
      "Tell him to bring one valid ID.",
      "Yes, please bring one valid ID.",
      [need("Mention a valid ID", "id", "identification")],
    ),
  ]),
  C("4", "Data Promo", "Ate Liza", "Inbound · Prepaid", "Leo", TELCO, [
    step(
      "Answer",
      "Hi! Do you have a promo for mobile data?",
      "Say yes and tell her about the 50-peso promo with 2 gigabytes.",
      "Yes, we do! Our fifty peso promo gives you two gigabytes of data.",
      [
        YES,
        need("Mention the price: 50 pesos", "fifty"),
        need(
          "Mention the data: 2 gigabytes",
          "two gigabyte",
          "two gig",
          "two gb",
          "gigabyte",
        ),
      ],
    ),
    step(
      "Explain",
      "How do I register?",
      "Tell her to text the word DATA to 1234.",
      "Just text the word DATA to one two three four.",
      [
        need("Tell her to text", "text", "send", "message"),
        need("Say the keyword DATA", "data"),
      ],
    ),
  ]),
  C("5", "Wrong Department", "Mr. Tan", "Inbound · Wrong queue", "Ana", TELCO, [
    step(
      "Transfer",
      "I want to ask about my bill.",
      "Say you will transfer him to the billing team, and ask him to stay on the line.",
      "Sure! I will transfer you to our billing team. Please stay on the line.",
      [
        need("Say you will transfer him", "transfer", "connect", "forward"),
        need("Mention billing", "billing", "bill"),
        need("Ask him to stay on the line", "stay", "hold", "line", "wait"),
      ],
    ),
    step(
      "Confirm",
      "Okay, will it take long?",
      "Tell him it will only take about one minute.",
      "It will only take about one minute. Thank you for waiting.",
      [need("Say how long: one minute", "minute", "second", "moment", "quick")],
    ),
  ]),
  C(
    "6",
    "Bill Due Date",
    "Aling Nena",
    "Inbound · Postpaid billing",
    "Bea",
    TELCO,
    [
      step(
        "Get details",
        "When is my bill due, hija?",
        "Politely ask for her account number.",
        "I can check that for you. May I have your account number, please?",
        [POLITE, need("Ask for the account number", "account", "number")],
      ),
      step(
        "Answer",
        "It's five five six seven eight.",
        "Thank her and say the bill is due on the twentieth.",
        "Thank you. Your bill is due on the twentieth of this month.",
        [THANK, need("Say the due date: twentieth", "twentieth", "twenty")],
      ),
    ],
  ),
  C("7", "Load Not Received", "Jun", "Inbound · Prepaid", "Paolo", TELCO, [
    step(
      "Empathy",
      "I bought load an hour ago, but I didn't get it.",
      "Say sorry and that you will check it.",
      "I'm sorry about that. Let me check it for you.",
      [SORRY, need("Say you will check", "check", "look", "help")],
    ),
    step(
      "Fix",
      "Okay, thanks.",
      "Tell him the load is now added to his account.",
      "Thank you for waiting. The load is now added to your account.",
      [
        need("Mention the load", "load"),
        need(
          "Say it's added now",
          "added",
          "now",
          "received",
          "sent",
          "credited",
        ),
      ],
    ),
  ]),
  C("8", "Lost SIM Card", "Ms. Reyes", "Inbound · Postpaid", "Kim", TELCO, [
    step(
      "Empathy",
      "I lost my SIM card. What do I do?",
      "Say sorry to hear that and that you will block the old SIM.",
      "I'm sorry to hear that. I will block your old SIM right away.",
      [SORRY, need("Say you will block it", "block", "deactivate", "stop")],
    ),
    step(
      "Next step",
      "Can I get a new one?",
      "Say yes, she can get a new SIM at any store with her ID.",
      "Yes, you can get a new SIM at any of our stores. Please bring your ID.",
      [
        YES,
        need("Mention the store", "store", "branch"),
        need("Bring an ID", "id"),
      ],
    ),
  ]),
  C("9", "Wi-Fi Password", "Kuya Dan", "Inbound · Home fiber", "Leo", FIBER, [
    step(
      "Help",
      "I forgot my Wi-Fi password.",
      "Tell him the password is printed on a sticker under the modem.",
      "No problem. The password is on the sticker under your modem.",
      [
        need("Mention the sticker or label", "sticker", "label"),
        need("Mention the modem", "modem", "router"),
      ],
    ),
    step(
      "Confirm",
      "Oh, I see it now. It works!",
      "Say you are glad it works.",
      "Great! I'm glad it works now.",
      [need("Show you're glad", "glad", "great", "happy", "good")],
    ),
  ]),
  C("10", "Payment Options", "Mrs. Lopez", "Inbound · Billing", "Ana", TELCO, [
    step(
      "Answer",
      "Where can I pay my bill?",
      "Tell her she can pay online, in our app, or at any store.",
      "You can pay online, in our app, or at any of our stores.",
      [
        need("Mention online or the app", "online", "app", "website"),
        need("Mention stores", "store", "branch", "mall"),
      ],
    ),
    step(
      "Answer",
      "Is there a fee if I pay online?",
      "Tell her there is no fee.",
      "There is no fee when you pay online.",
      [need("Say there's no fee", "no fee", "free", "no charge", "no extra")],
    ),
  ]),
  C(
    "11",
    "Weak Signal at Home",
    "Mang Pedro",
    "Inbound · Prepaid",
    "Carlo",
    TELCO,
    [
      step(
        "Probing",
        "My signal is weak inside my house.",
        "Ask him if the signal is better near a window or outside.",
        "I'm sorry about that. Is the signal better near a window or outside?",
        [need("Ask about a window or outside", "window", "outside", "door")],
      ),
      step(
        "Advice",
        "Yes, it's better near the window.",
        "Tell him to stay near the window for calls, and say you will report the weak signal.",
        "Please stay near the window for your calls. I will also report the weak signal in your area.",
        [
          need("Mention the window", "window"),
          need("Say you will report it", "report", "ticket", "check"),
        ],
      ),
    ],
  ),
  C("12", "Modem Lights", "Ms. Uy", "Inbound · Home fiber", "Joy", FIBER, [
    step(
      "Probing",
      "My internet is not working.",
      "Ask her what color the lights on her modem are.",
      "I'm sorry about that. What color are the lights on your modem?",
      [
        need("Ask about the lights", "light"),
        need("Mention the modem", "modem", "router"),
      ],
    ),
    step(
      "Fix",
      "There's a red light blinking.",
      "Tell her to turn the modem off and on again.",
      "Please turn your modem off, wait a few seconds, then turn it on again.",
      [
        need(
          "Turn it off and on",
          "turn",
          "restart",
          "unplug",
          "reboot",
          "switch",
        ),
      ],
    ),
  ]),
  C(
    "13",
    "Repair Visit",
    "Mr. Santos",
    "Inbound · Home fiber",
    "Paolo",
    FIBER,
    [
      step(
        "Get details",
        "When will your technician come to my house?",
        "Politely ask for his ticket number.",
        "Let me check. May I have your ticket number, please?",
        [
          POLITE,
          need("Ask for the ticket number", "ticket", "number", "reference"),
        ],
      ),
      step(
        "Answer",
        "It's one two three nine.",
        "Thank him and say the technician will come tomorrow morning.",
        "Thank you. The technician will visit tomorrow morning.",
        [THANK, need("Say when: tomorrow morning", "tomorrow", "morning")],
      ),
    ],
  ),
  C("14", "Area Outage", "Lola Remy", "Inbound · Home fiber", "Bea", FIBER, [
    step(
      "Inform",
      "Why is there no internet in our street?",
      "Say sorry and explain there is a problem in her area that the team is fixing.",
      "I'm sorry, Lola. There is a problem in your area, and our team is fixing it now.",
      [
        SORRY,
        need("Mention her area", "area", "street", "place", "location"),
        need("Say the team is fixing it", "fix", "repair", "working"),
      ],
    ),
    step(
      "Timeframe",
      "How long will it take?",
      "Tell her it should be back in about four hours.",
      "It should be back in about four hours. Thank you for your patience.",
      [need("Give a time: four hours", "four hour", "hour")],
    ),
  ]),
  C(
    "15",
    "Roaming",
    "Ms. Lim",
    "Inbound · Postpaid",
    "Kim",
    TELCO,
    [
      step(
        "Answer",
        "I'm going to Japan next week. Can I use my phone there?",
        "Say yes and offer to turn on roaming for her.",
        "Yes, you can! I can turn on roaming for you now.",
        [YES, need("Offer to turn on roaming", "roaming")],
      ),
      step(
        "Confirm",
        "Yes, please.",
        "Tell her roaming is now active.",
        "All done! Your roaming is now active. Enjoy your trip!",
        [
          need("Mention roaming", "roaming"),
          need("Say it's active", "active", "on", "done", "ready", "turned"),
        ],
      ),
    ],
    "Thank you so much!",
  ),
  C("16", "New Line", "Mr. Garcia", "Inbound · Sales", "Leo", TELCO, [
    step(
      "Answer",
      "I want to get a new postpaid line.",
      "Say that's great and ask what plan he would like.",
      "That's great! What plan would you like, sir?",
      [
        need(
          "Sound happy to help",
          "great",
          "sure",
          "happy",
          "glad",
          "wonderful",
        ),
        need("Ask which plan", "plan"),
      ],
    ),
    step(
      "Answer",
      "The cheapest one, please.",
      "Tell him the cheapest plan is 499 pesos a month.",
      "Our lowest plan is four hundred ninety nine pesos a month.",
      [
        need(
          "Say the price: 499",
          "four hundred ninety nine",
          "four ninety nine",
        ),
        need("Say per month", "month"),
      ],
    ),
  ]),
  C(
    "17",
    "Change Address",
    "Aling Cora",
    "Inbound · Account update",
    "Ana",
    TELCO,
    [
      step(
        "Get details",
        "I moved to a new house. Can you change my address?",
        "Say yes and politely ask for her new address.",
        "Yes, of course. May I have your new address, please?",
        [YES, POLITE, need("Ask for the address", "address")],
      ),
      step(
        "Confirm",
        "It's twenty five Rizal Street, Cebu City.",
        "Thank her and confirm the address is updated.",
        "Thank you. Your address is now updated to twenty five Rizal Street, Cebu City.",
        [
          THANK,
          need("Say it's updated", "updated", "changed", "saved", "done"),
        ],
      ),
    ],
  ),
  C(
    "18",
    "Customer Says Thanks",
    "Mr. Bautista",
    "Inbound · Feedback",
    "Joy",
    TELCO,
    [
      step(
        "Respond",
        "I just want to say your technician yesterday was very helpful!",
        "Thank him for the kind words and say you will tell the team.",
        "Thank you so much, sir! I will share your kind words with our team.",
        [
          THANK,
          need("Say you will tell the team", "team", "share", "tell", "pass"),
        ],
      ),
      step(
        "Respond",
        "Please do. He was very polite.",
        "Say you are happy he had a good experience.",
        "We are so happy you had a good experience with us.",
        [need("Say you're happy", "happy", "glad", "great")],
      ),
    ],
    "That's all. Have a good day!",
  ),
  C("19", "Voicemail", "Ms. Torres", "Inbound · Prepaid", "Carlo", TELCO, [
    step(
      "Answer",
      "How do I listen to my voicemail?",
      "Tell her to call 123 from her phone.",
      "Just call one two three from your phone to hear your voicemail.",
      [
        need("Tell her to call", "call", "dial"),
        need(
          "Say the number: 123",
          "one to three",
          "one hundred twenty three",
          "one twenty three",
        ),
      ],
    ),
    step(
      "Answer",
      "Is it free?",
      "Say yes, it is free.",
      "Yes, it's free to listen to your voicemail.",
      [YES, need("Say it's free", "free", "no charge", "no fee")],
    ),
  ]),
  C(
    "20",
    "Call Back Later",
    "Mr. Ramos",
    "Outbound · Follow-up",
    "Bea",
    FIBER,
    [
      step(
        "Purpose",
        "Hello? I'm busy right now.",
        "Say sorry for the bother and offer to call back later.",
        "I'm sorry to bother you, sir. May I call you back later?",
        [
          SORRY,
          need("Offer to call back", "call back", "call you back", "later"),
        ],
      ),
      step(
        "Schedule",
        "Yes, please call me at three o'clock.",
        "Thank him and confirm you will call at three o'clock.",
        "Thank you, sir. I will call you back at three o'clock.",
        [THANK, need("Confirm the time: three", "three")],
      ),
      step(
        "Wait",
        "Okay.",
        "Ask him to keep his phone open.",
        "Please keep your phone open. Talk to you later!",
        [need("Ask him to keep the phone open", "phone", "open", "available")],
      ),
    ],
    "Okay, bye.",
  ),
];
