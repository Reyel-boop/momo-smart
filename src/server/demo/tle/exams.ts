/**
 * The course Exams for TLE – ICT: Telecommunications (Contact Center
 * Services) and Computer Programming. Each is 50 easy multiple-choice
 * questions built on Bloom's Taxonomy, from the lowest level up:
 *
 *   Remembering 1–20 · Understanding 21–34 · Applying 35–42 ·
 *   Analyzing 43–47 · Evaluating 48–50
 *
 * The words are kept short and simple on purpose, for learners who need
 * more support. Creating is left to the Unit Activities, where students make
 * something of their own.
 */
import { examKindOf } from "../../../lib/exam";
import type { QuizItem } from "../grade10-quiz";

export const BLOOM_LEVELS = [
  "Remembering",
  "Understanding",
  "Applying",
  "Analyzing",
  "Evaluating",
] as const;
export type BloomLevel = (typeof BLOOM_LEVELS)[number];

export type ExamItem = QuizItem & { level: BloomLevel };

const item = (
  level: BloomLevel,
  q: string,
  choices: [string, string, string, string],
  answer: 0 | 1 | 2 | 3,
  why: string,
): ExamItem => ({ level, q, choices, answer, why });

const R = "Remembering";
const U = "Understanding";
const AP = "Applying";
const AN = "Analyzing";
const E = "Evaluating";

const TELECOM_BASE: ExamItem[] = [
  // Remembering
  item(
    R,
    "What is a contact center?",
    [
      "A place where agents help customers by phone, chat or email",
      "A store that sells cellphones",
      "A school for teachers",
      "A clinic for sick people",
    ],
    0,
    "A contact center is where agents talk to customers and help them by phone, chat or email.",
  ),
  item(
    R,
    "What does BPO stand for?",
    [
      "Basic Phone Office",
      "Business Process Outsourcing",
      "Big Phone Operator",
      "Business Product Order",
    ],
    1,
    "BPO means Business Process Outsourcing: a company hires another company to do some of its work, like answering calls.",
  ),
  item(
    R,
    "A call that the customer makes to the company is called an…",
    ["Outbound call", "Missed call", "Inbound call", "Wrong call"],
    2,
    "Inbound means coming IN. The customer calls the company.",
  ),
  item(
    R,
    "A call that the agent makes to the customer is called an…",
    ["Inbound call", "Outbound call", "Hold call", "Free call"],
    1,
    "Outbound means going OUT. The agent calls the customer, for example to offer a product.",
  ),
  item(
    R,
    "What do we call the person who answers calls in a contact center?",
    ["Agent", "Cashier", "Driver", "Guard"],
    0,
    "The person who talks to customers in a contact center is called an agent.",
  ),
  item(
    R,
    "What does AHT mean?",
    [
      "All Help Time",
      "Agent Happy Time",
      "Answer Hold Ticket",
      "Average Handle Time",
    ],
    3,
    "AHT is Average Handle Time: how long a call takes, on average, from hello to goodbye.",
  ),
  item(
    R,
    "Which is an example of NON-VOICE work?",
    [
      "Talking to a customer on the phone",
      "Answering a customer's email or chat",
      "Calling a customer to sell a product",
      "Singing on the radio",
    ],
    1,
    "Non-voice work is done by writing, like answering emails and chats. You don't talk on the phone.",
  ),
  item(
    R,
    "What does CSAT measure?",
    [
      "How fast the agent types",
      "How many calls are missed",
      "How happy the customer is with the service",
      "How long the agent's break is",
    ],
    2,
    "CSAT means Customer Satisfaction. It shows how happy customers are with the help they got.",
  ),
  item(
    R,
    "What does it mean to put a caller on HOLD?",
    [
      "To end the call",
      "To make the caller wait for a short time",
      "To give the caller a gift",
      "To shout at the caller",
    ],
    1,
    "Hold means the caller waits a short time while the agent checks something.",
  ),
  item(
    R,
    "What is the FIRST thing an agent says when answering a call?",
    ["The closing", "The price", "The greeting", "The goodbye"],
    2,
    "Every call starts with a greeting, like “Good morning, thank you for calling.”",
  ),
  item(
    R,
    "Which one is a good skill for a contact center agent?",
    ["Being patient", "Being rude", "Being late", "Being noisy"],
    0,
    "A good agent is patient. They stay calm even when the customer is upset.",
  ),
  item(
    R,
    "To ESCALATE a call means to…",
    [
      "Drop the call",
      "Pass the call to a supervisor or a higher team",
      "Put the call on speaker",
      "Call the customer again tomorrow",
    ],
    1,
    "Escalate means passing the call to someone who can help more, like a supervisor.",
  ),

  // Understanding
  item(
    U,
    "Why should an agent smile while talking on the phone?",
    [
      "So the customer can see the agent",
      "Because the supervisor is watching",
      "Because a smile makes the voice sound friendly",
      "So the call ends faster",
    ],
    2,
    "The customer can't see you, but a smile makes your voice sound warm and friendly.",
  ),
  item(
    U,
    "Why does the agent ask for the caller's name and account number?",
    [
      "To check who the caller is and find the right account",
      "To make the call longer",
      "To tell their friends",
      "To sell the caller a new phone",
    ],
    0,
    "The agent checks (verifies) who the caller is so they can open the right account and keep it safe.",
  ),
  item(
    U,
    "What does EMPATHY mean?",
    [
      "Talking very fast",
      "Understanding how the customer feels",
      "Ending the call quickly",
      "Saying no to the customer",
    ],
    1,
    "Empathy means you understand the customer's feelings, like saying “I understand how frustrating that is.”",
  ),
  item(
    U,
    "Which sentence shows good phone manners?",
    [
      "“What do you want?”",
      "“Hurry up, I'm busy.”",
      "“Call again later.”",
      "“Thank you for calling. How may I help you?”",
    ],
    3,
    "Good phone manners are polite and helpful: thank the caller and offer help.",
  ),
  item(
    U,
    "Why should the hold time be SHORT?",
    [
      "So the customer does not feel ignored",
      "So the agent can eat",
      "So the call costs more",
      "So the customer will hang up",
    ],
    0,
    "Customers don't like waiting. A short hold shows that you care about their time.",
  ),
  item(
    U,
    "What is an INTERNATIONAL account?",
    [
      "An account for customers in your own town",
      "An account for customers from other countries",
      "An account for agents only",
      "An account with no customers",
    ],
    1,
    "International accounts serve customers from other countries, like the USA or Australia.",
  ),
  item(
    U,
    "Why should an agent speak clearly and not too fast?",
    [
      "To finish the call quickly",
      "To sound like a robot",
      "So the customer understands every word",
      "So the customer gets bored",
    ],
    2,
    "Clear, calm speaking helps the customer understand you the first time.",
  ),
  item(
    U,
    "Why do contact centers follow a CALL FLOW?",
    [
      "To make every call different",
      "So agents handle each call in the right order",
      "So agents can skip the greeting",
      "To make calls longer",
    ],
    1,
    "A call flow is a guide. It helps agents do the steps in order: greet, verify, help, close.",
  ),

  // Applying
  item(
    AP,
    "A customer is angry because their bill is wrong. What should you say FIRST?",
    [
      "“That's not my problem.”",
      "“Please call another number.”",
      "“You must have made a mistake.”",
      "“I'm sorry for the trouble. Let me help you fix this.”",
    ],
    3,
    "First, say sorry and show you want to help. This calms the customer down.",
  ),
  item(
    AP,
    "You need one minute to check the customer's record. What should you do?",
    [
      "Ask, “May I put you on hold for a minute?” and thank them after",
      "Just stop talking without saying anything",
      "End the call and call back next week",
      "Tell the customer to wait without asking",
    ],
    0,
    "Always ask before putting a caller on hold, and thank them for waiting when you come back.",
  ),
  item(
    AP,
    "The customer spoke too fast and you did not hear their phone number. What should you do?",
    [
      "Guess the number",
      "Hang up",
      "Politely ask, “Could you please repeat the number?”",
      "Ask your seatmate",
    ],
    2,
    "Never guess. Politely ask the customer to repeat it, then read it back to check.",
  ),
  item(
    AP,
    "You greeted the customer. What should you do NEXT in the call flow?",
    [
      "Say goodbye",
      "Check (verify) the customer's name and account",
      "Put the customer on hold right away",
      "Transfer the call",
    ],
    1,
    "After the greeting, you verify the customer. Then you solve the problem, then close the call.",
  ),
  item(
    AP,
    "A customer asks something that only your supervisor can answer. What should you do?",
    [
      "Make up an answer",
      "Tell the customer you don't know and hang up",
      "Ignore the question",
      "Tell the customer you will pass the call to your supervisor",
    ],
    3,
    "When you can't help, escalate politely: tell the customer you will pass the call to your supervisor.",
  ),

  // Analyzing
  item(
    AN,
    "Agent Ana solved 9 out of 10 problems. Agent Ben solved 5 out of 15. Who gave BETTER help?",
    [
      "Ana, because she solved almost every problem",
      "Ben, because he took more calls",
      "Both are the same",
      "Nobody",
    ],
    0,
    "Taking many calls is not enough. Ana solved 9 of 10 problems, so her customers got real help.",
  ),
  item(
    AN,
    "Read the call: Agent: “Good morning, thank you for calling. May I have your name?” Customer: “Liza.” Agent: “Thank you, Liza. Your internet is fixed now.” (The call ends.) What part is MISSING?",
    ["The greeting", "Asking the name", "The closing", "The problem"],
    2,
    "The agent forgot to close the call, like “Is there anything else I can help you with? Thank you for calling!”",
  ),
  item(
    AN,
    "An agent said “Wait.” and put the customer on hold for 5 minutes. What did the agent do WRONG?",
    [
      "The agent did not ask first, and the hold was too long",
      "The agent was too polite",
      "The agent spoke too slowly",
      "Nothing was wrong",
    ],
    0,
    "The agent should ask before a hold, keep it short, and thank the customer for waiting.",
  ),

  // Evaluating
  item(
    E,
    "A customer says, “I've been waiting for 30 minutes!” Which reply is BEST?",
    [
      "“Everybody waits.”",
      "“That's not my fault.”",
      "“So what?”",
      "“I'm sorry about the long wait. Thank you for your patience. How can I help?”",
    ],
    3,
    "The best reply says sorry, thanks the customer and offers help. It shows empathy.",
  ),
  item(
    E,
    "Which agent should get the “Best Agent” award?",
    [
      "Carlo: fast, but often rude to customers",
      "Dina: polite, follows the call flow and solves problems",
      "Eli: friendly, but often late for work",
      "Fe: takes long breaks and misses calls",
    ],
    1,
    "Dina is polite, follows the steps and solves problems. That is what a great agent does.",
  ),
];

const PROGRAMMING_BASE: ExamItem[] = [
  // Remembering
  item(
    R,
    "What does HTML stand for?",
    [
      "HyperText Markup Language",
      "High Tech Modern Language",
      "Home Tool Making Language",
      "Hyper Transfer Machine Language",
    ],
    0,
    "HTML means HyperText Markup Language. It is used to build web pages.",
  ),
  item(
    R,
    "What does CSS stand for?",
    [
      "Computer Style System",
      "Colorful Style Sheets",
      "Cascading Style Sheets",
      "Creative Screen Setup",
    ],
    2,
    "CSS means Cascading Style Sheets. It is used to style web pages.",
  ),
  item(
    R,
    "Which tag makes the BIGGEST heading?",
    ["<h6>", "<h1>", "<p>", "<head>"],
    1,
    "<h1> is the biggest heading. <h6> is the smallest.",
  ),
  item(
    R,
    "Which tag is used for a PARAGRAPH?",
    ["<p>", "<a>", "<br>", "<img>"],
    0,
    "<p> stands for paragraph.",
  ),
  item(
    R,
    "Which tag is used to make a LINK?",
    ["<link>", "<p>", "<li>", "<a>"],
    3,
    "The <a> tag (anchor) makes a link that you can click.",
  ),
  item(
    R,
    "Which tag shows a PICTURE on a web page?",
    ["<pic>", "<img>", "<photo>", "<table>"],
    1,
    "<img> stands for image. It shows a picture.",
  ),
  item(
    R,
    "Which one is an HTML editor (a program for writing code)?",
    ["Calculator", "Paint", "Visual Studio Code", "Camera"],
    2,
    "Visual Studio Code (and Notepad++) are editors where we type our HTML code.",
  ),
  item(
    R,
    "What does a computer programmer do?",
    [
      "Repairs cars",
      "Writes instructions (code) for computers",
      "Cooks food",
      "Sells phones",
    ],
    1,
    "A programmer writes code: step-by-step instructions that tell a computer what to do.",
  ),
  item(
    R,
    "What is computer ERGONOMICS?",
    [
      "Setting up your workplace so you are comfortable and safe",
      "A game on the computer",
      "A kind of keyboard",
      "Fixing a broken computer",
    ],
    0,
    "Ergonomics is about sitting and working in a way that keeps your body safe and comfortable.",
  ),
  item(
    R,
    "Which tag makes text BOLD?",
    ["<i>", "<u>", "<p>", "<b>"],
    3,
    "<b> makes text bold. (<i> is italic and <u> is underline.)",
  ),
  item(
    R,
    "Which tag makes a ROW in a table?",
    ["<td>", "<tr>", "<th>", "<tb>"],
    1,
    "<tr> means table row. <td> is a cell inside the row.",
  ),
  item(
    R,
    "What is the correct file name ending for a web page?",
    [".exe", ".jpg", ".html", ".mp3"],
    2,
    "Web pages are saved as .html files, like index.html.",
  ),

  // Understanding
  item(
    U,
    "Why do we use CSS?",
    [
      "To make the web page look nice, like colors and fonts",
      "To turn on the computer",
      "To print the page",
      "To delete the web page",
    ],
    0,
    "HTML builds the page; CSS makes it look nice with colors, fonts and spacing.",
  ),
  item(
    U,
    "What does the <title> tag do?",
    [
      "Makes a big heading on the page",
      "Adds a picture",
      "Shows the page name on the browser tab",
      "Makes a new paragraph",
    ],
    2,
    "The <title> is the name you see on the browser tab, not on the page itself.",
  ),
  item(
    U,
    "What does the <ul> tag make?",
    [
      "A list with numbers",
      "A list with bullets (dots)",
      "A table",
      "A link",
    ],
    1,
    "<ul> is an unordered list. It shows bullets. <ol> shows numbers.",
  ),
  item(
    U,
    "Why should you sit up straight with the screen at eye level?",
    [
      "To look cool",
      "To type faster",
      "To make the computer faster",
      "To avoid back and neck pain",
    ],
    3,
    "Good posture keeps your back, neck and eyes from getting tired and hurting.",
  ),
  item(
    U,
    "In CSS, what does PADDING do?",
    [
      "Adds space INSIDE the border, around the content",
      "Adds space OUTSIDE the border",
      "Changes the text color",
      "Deletes the border",
    ],
    0,
    "Padding is the space inside the box, between the content and the border.",
  ),
  item(
    U,
    "In CSS, what does MARGIN do?",
    [
      "Changes the font",
      "Adds space INSIDE the border",
      "Adds space OUTSIDE the border",
      "Makes the text bold",
    ],
    2,
    "Margin is the space outside the box. It pushes other things away.",
  ),
  item(
    U,
    "What does the <ol> tag make?",
    [
      "A list with bullets",
      "A list with numbers (1, 2, 3)",
      "A picture",
      "A heading",
    ],
    1,
    "<ol> is an ordered list, so the items are numbered.",
  ),
  item(
    U,
    "In <a href=\"page2.html\">Next</a>, what does href tell the browser?",
    [
      "The color of the link",
      "The size of the text",
      "Where the link will go",
      "The name of the computer",
    ],
    2,
    "href holds the address. Clicking the link opens that page.",
  ),

  // Applying
  item(
    AP,
    "You want “Welcome” as the BIGGEST heading. Which code is correct?",
    [
      "<h6>Welcome</h6>",
      "<h1>Welcome</h1>",
      "<p>Welcome</p>",
      "<a>Welcome</a>",
    ],
    1,
    "<h1> is the biggest heading, and it closes with </h1>.",
  ),
  item(
    AP,
    "You want ALL paragraphs to be red. Which CSS is correct?",
    [
      "p { color: red; }",
      "red { p: color; }",
      "p = red",
      "color { red: p; }",
    ],
    0,
    "CSS is written as selector { property: value; }. Here: p { color: red; }",
  ),
  item(
    AP,
    "You want to show the picture “cat.jpg”. Which code is correct?",
    [
      "<img link=\"cat.jpg\">",
      "<picture>cat.jpg</picture>",
      "<a>cat.jpg</a>",
      "<img src=\"cat.jpg\">",
    ],
    3,
    "The <img> tag uses src (source) to say which picture to show.",
  ),
  item(
    AP,
    "You want a link to Google. Which code is correct?",
    [
      "<a src=\"https://www.google.com\">Google</a>",
      "<link>Google</link>",
      "<a href=\"https://www.google.com\">Google</a>",
      "<p href=\"https://www.google.com\">Google</p>",
    ],
    2,
    "A link uses <a> with href for the address.",
  ),
  item(
    AP,
    "You want the page background to be yellow. Which CSS is correct?",
    [
      "body { color: yellow; }",
      "body { background-color: yellow; }",
      "yellow { body: background; }",
      "background = yellow",
    ],
    1,
    "background-color changes the background. color only changes the text.",
  ),

  // Analyzing
  item(
    AN,
    "What is WRONG with this code?  <p>Hello</h1>",
    [
      "The opening and closing tags do not match",
      "Nothing is wrong",
      "The word Hello is misspelled",
      "It needs a picture",
    ],
    0,
    "It opens with <p> but closes with </h1>. It should be <p>Hello</p>.",
  ),
  item(
    AN,
    "What will this code show?  <ol><li>Rice</li><li>Egg</li></ol>",
    [
      "• Rice  • Egg",
      "Rice Egg in a table",
      "Nothing",
      "1. Rice  2. Egg",
    ],
    3,
    "<ol> is an ordered list, so the items are numbered 1 and 2.",
  ),
  item(
    AN,
    "Look at the CSS:  h1 { color: blue; }  p { color: green; }  What color is the PARAGRAPH text?",
    ["Blue", "Green", "Black", "Red"],
    1,
    "The p rule says color: green, so paragraphs are green. Only h1 is blue.",
  ),

  // Evaluating
  item(
    E,
    "Which code is the CORRECT and complete start of a web page?",
    [
      "<body><html><head></head></html></body>",
      "<head><body></head></body>",
      "<html><head><title>My Page</title></head><body></body></html>",
      "<title><html></title></html>",
    ],
    2,
    "The order is <html>, then <head> (with the title), then <body>, and each tag is closed in the right order.",
  ),
  item(
    E,
    "Juan wants his website to be EASY TO READ. Which choice is best?",
    [
      "Yellow text on a white background",
      "Dark text on a light background with a big, clear font",
      "Very tiny text",
      "Every word in a different color",
    ],
    1,
    "Dark text on a light background with a clear font is the easiest to read.",
  ),
];

const TELECOM_MORE: ExamItem[] = [
  // Remembering
  item(
    R,
    "What is a SCRIPT in a contact center?",
    [
      "A movie about agents",
      "A written guide of what the agent should say",
      "A list of the agent's friends",
      "The agent's salary",
    ],
    1,
    "A script is a written guide. It helps agents say the right words in the right order.",
  ),
  item(
    R,
    "Who guides and helps the agents in a team?",
    ["The customer", "The guard", "The team leader or supervisor", "The driver"],
    2,
    "The team leader (supervisor) coaches the agents and helps with hard calls.",
  ),
  item(
    R,
    "What does an agent wear to talk and listen during calls?",
    ["A headset", "A helmet", "Sunglasses", "A cap"],
    0,
    "A headset has earphones and a microphone, so the agent's hands are free to type.",
  ),
  item(
    R,
    "What does FCR mean?",
    [
      "Fast Call Rate",
      "Final Customer Report",
      "Free Call Request",
      "First Call Resolution",
    ],
    3,
    "FCR is First Call Resolution: the problem is solved in the first call, so the customer doesn't need to call again.",
  ),
  item(
    R,
    "What does the QA (Quality Assurance) team do?",
    [
      "Cleans the office",
      "Listens to calls to check if agents did a good job",
      "Sells products",
      "Fixes the computers",
    ],
    1,
    "The QA team checks the quality of calls and helps agents improve.",
  ),
  item(
    R,
    "What is a QUEUE in a contact center?",
    [
      "A line of callers waiting to be answered",
      "A kind of headset",
      "A break time",
      "A customer's bill",
    ],
    0,
    "A queue is the line of callers waiting for the next free agent.",
  ),
  item(
    R,
    "Which one is a contact center SERVICE?",
    ["Planting rice", "Building houses", "Cooking food", "Technical support"],
    3,
    "Technical support (helping fix problems with devices or internet) is a contact center service. So are customer service and sales.",
  ),
  item(
    R,
    "When an agent writes a customer's problem into the system, it is called a…",
    ["Ticket", "Song", "Receipt", "Letter"],
    0,
    "A ticket is a record of the customer's problem, so the team can follow it up.",
  ),

  // Understanding
  item(
    U,
    "Why must agents keep customer information PRIVATE?",
    [
      "So they can share it later",
      "To protect the customer and keep their trust",
      "Because it is boring",
      "To make the call shorter",
    ],
    1,
    "Customer information (like account numbers) must be kept safe. Sharing it is wrong and can hurt the customer.",
  ),
  item(
    U,
    "Why do agents take NOTES during a call?",
    [
      "To draw pictures",
      "To look busy",
      "To remember the details and keep correct records",
      "To write a story",
    ],
    2,
    "Notes help the agent remember the problem and help the next agent if the customer calls again.",
  ),
  item(
    U,
    "What does a TECH SUPPORT agent do?",
    [
      "Helps customers fix problems with their devices or internet",
      "Sells food",
      "Delivers packages",
      "Teaches in a school",
    ],
    0,
    "Tech support agents guide customers step by step to fix technical problems.",
  ),
  item(
    U,
    "Why is LISTENING important for an agent?",
    [
      "So the call ends faster",
      "So the agent can talk more",
      "So the customer stops talking",
      "So the agent understands the customer's problem",
    ],
    3,
    "You can only help if you understand the problem, so listen carefully first.",
  ),
  item(
    U,
    "What is a LOCAL account?",
    [
      "An account for customers from other countries",
      "An account for customers here in the Philippines",
      "An account for supervisors only",
      "An account with no calls",
    ],
    1,
    "Local accounts serve customers in our own country.",
  ),
  item(
    U,
    "Why should agents NOT use slang like “yeah” or “nope” with customers?",
    [
      "Because slang is too long",
      "Because customers don't like English",
      "Because polite words sound professional and respectful",
      "Because slang is faster",
    ],
    2,
    "Words like “yes” and “certainly” sound professional and respectful.",
  ),

  // Applying
  item(
    AP,
    "The customer says, “Thank you, that's all.” What should you say?",
    [
      "“Thank you for calling. Have a nice day!”",
      "“Bye.”",
      "Nothing, just hang up",
      "“Why are you calling?”",
    ],
    0,
    "End every call politely: thank the customer and wish them a nice day.",
  ),
  item(
    AP,
    "The customer's name is hard to spell. What should you do?",
    [
      "Write any spelling",
      "Skip the name",
      "Call the customer by a nickname",
      "Ask them to spell it, then read it back to check",
    ],
    3,
    "Asking the customer to spell it and reading it back makes sure the record is correct.",
  ),
  item(
    AP,
    "You want to cough while the customer is talking. What should you do?",
    [
      "Cough loudly into the microphone",
      "Press MUTE first, then unmute when you are ready",
      "Hang up",
      "Tell the customer to stop talking",
    ],
    1,
    "Use the mute button so the customer doesn't hear noises, then unmute to talk again.",
  ),

  // Analyzing
  item(
    AN,
    "Which one is an OUTBOUND call?",
    [
      "A customer calls to complain",
      "A customer calls to ask a question",
      "An agent calls a customer to remind them about a payment",
      "A customer sends an email",
    ],
    2,
    "Outbound means the agent makes the call. Reminding a customer about a payment is an outbound call.",
  ),
  item(
    AN,
    "Agent Gino's calls are very short, but his customers keep calling back with the SAME problem. What does this show?",
    [
      "Gino is fast but does not really solve the problems",
      "Gino is the best agent",
      "The customers like calling",
      "The phones are broken",
    ],
    0,
    "Short calls are only good if the problem is solved. Calling back means the problem was not fixed.",
  ),

  // Evaluating
  item(
    E,
    "Which is the BEST way to close a call?",
    [
      "“Okay, bye.”",
      "“Is there anything else I can help you with? Thank you for calling, and have a great day!”",
      "Hang up without saying anything",
      "“Don't call again.”",
    ],
    1,
    "The best closing checks if the customer needs more help, thanks them and ends kindly.",
  ),
];

const PROGRAMMING_MORE: ExamItem[] = [
  // Remembering
  item(
    R,
    "Which tag makes a LINE BREAK (goes to the next line)?",
    ["<lb>", "<break>", "<br>", "<next>"],
    2,
    "<br> is a line break. It moves the text to the next line.",
  ),
  item(
    R,
    "Which tag makes text ITALIC (slanted)?",
    ["<i>", "<b>", "<u>", "<s>"],
    0,
    "<i> makes text italic.",
  ),
  item(
    R,
    "Which tag holds everything you SEE on the web page?",
    ["<head>", "<title>", "<style>", "<body>"],
    3,
    "<body> holds the content you see: headings, paragraphs, pictures and links.",
  ),
  item(
    R,
    "Which tag makes one ITEM in a list?",
    ["<item>", "<li>", "<ul>", "<td>"],
    1,
    "<li> means list item. It goes inside <ul> or <ol>.",
  ),
  item(
    R,
    "Which tag makes a TABLE?",
    ["<tab>", "<tr>", "<table>", "<list>"],
    2,
    "<table> starts a table. Inside it are rows (<tr>) and cells (<td>).",
  ),
  item(
    R,
    "Which tag makes a FORM where users can type information?",
    ["<form>", "<input>", "<box>", "<page>"],
    0,
    "<form> holds the boxes and buttons people fill in, like a sign-up form.",
  ),
  item(
    R,
    "Which tag makes a BUTTON you can click?",
    ["<click>", "<btn>", "<press>", "<button>"],
    3,
    "<button> makes a clickable button.",
  ),
  item(
    R,
    "Which CSS property changes the SIZE of the text?",
    ["text-color", "font-size", "size-text", "big"],
    1,
    "font-size changes how big the text is, like font-size: 20px;",
  ),

  // Understanding
  item(
    U,
    "Which one is a CLOSING tag?",
    ["<p>", "<h1>", "</p>", "<img>"],
    2,
    "A closing tag has a slash ( / ) before the name, like </p>.",
  ),
  item(
    U,
    "In CSS, what does BORDER do?",
    [
      "Draws a line around the box",
      "Changes the font",
      "Plays a sound",
      "Adds a picture",
    ],
    0,
    "border draws a line around an element, like border: 2px solid black;",
  ),
  item(
    U,
    "What is a WEB BROWSER?",
    [
      "A kind of keyboard",
      "A person who makes websites",
      "A tag in HTML",
      "A program that opens web pages, like Chrome",
    ],
    3,
    "A browser (Chrome, Firefox, Edge) opens and shows web pages.",
  ),
  item(
    U,
    "What does <input type=\"text\"> make?",
    [
      "A picture",
      "A box where you can type",
      "A heading",
      "A table",
    ],
    1,
    "It makes a text box, so users can type things like their name.",
  ),
  item(
    U,
    "Why should you rest your eyes and stretch every hour at the computer?",
    [
      "To keep your eyes and body from getting tired",
      "To make the computer cool down",
      "To delete your files",
      "To get more internet",
    ],
    0,
    "Short breaks help your eyes, back and hands rest. That is good ergonomics.",
  ),
  item(
    U,
    "What does a CSS TRANSITION do?",
    [
      "Deletes the page",
      "Makes text bigger forever",
      "Makes a change happen slowly and smoothly",
      "Adds a new page",
    ],
    2,
    "A transition makes changes (like a color change on hover) happen smoothly instead of suddenly.",
  ),

  // Applying
  item(
    AP,
    "You want the word “Hello” to be ITALIC. Which code is correct?",
    ["<b>Hello</b>", "<i>Hello</i>", "<u>Hello</u>", "<h1>Hello</h1>"],
    1,
    "<i>…</i> makes text italic.",
  ),
  item(
    AP,
    "You want all <h1> headings in the CENTER. Which CSS is correct?",
    [
      "h1 { color: center; }",
      "center { h1; }",
      "h1 = middle",
      "h1 { text-align: center; }",
    ],
    3,
    "text-align: center; puts the text in the middle.",
  ),
  item(
    AP,
    "You want a button that says “Send”. Which code is correct?",
    [
      "<button>Send</button>",
      "<a>Send</a>",
      "<p>Send</p>",
      "<send>button</send>",
    ],
    0,
    "<button>Send</button> makes a button with the word Send.",
  ),

  // Analyzing
  item(
    AN,
    "What will this code show?  <ul><li>Dog</li><li>Cat</li></ul>",
    [
      "1. Dog  2. Cat",
      "Dog and Cat in a table",
      "• Dog  • Cat",
      "Nothing",
    ],
    2,
    "<ul> is an unordered list, so the items have bullets (dots).",
  ),
  item(
    AN,
    "What is WRONG with this CSS?  p { color red; }",
    [
      "Nothing is wrong",
      "It needs a colon ( : ) after color",
      "p is not a real tag",
      "red is not a color",
    ],
    1,
    "It should be p { color: red; }. Every property needs a colon before its value.",
  ),

  // Evaluating
  item(
    E,
    "Which website is BEST for a school?",
    [
      "No menu, and the text is very small",
      "Flashing colors on every page",
      "Pictures that never load",
      "A clear menu, easy-to-read text and pictures of the school",
    ],
    3,
    "A good website is easy to use: a clear menu, readable text and helpful pictures.",
  ),
];

/** Lowest Bloom's level first, keeping the order within each level. */
const byLevel = (items: ExamItem[]) =>
  BLOOM_LEVELS.flatMap((level) => items.filter((i) => i.level === level));

export const TELECOM_EXAM = byLevel([...TELECOM_BASE, ...TELECOM_MORE]);
export const PROGRAMMING_EXAM = byLevel([
  ...PROGRAMMING_BASE,
  ...PROGRAMMING_MORE,
]);

/** The Exam for a course, by its code (TLE n-TEL or TLE n-CP), if it has one. */
export function examForCourse(courseCode: string): ExamItem[] | null {
  const kind = examKindOf(courseCode);
  return kind === "TEL"
    ? TELECOM_EXAM
    : kind === "CP"
      ? PROGRAMMING_EXAM
      : null;
}
