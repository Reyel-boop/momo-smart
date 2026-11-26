/**
 * A second wording of every Exam question, so students sitting side by side
 * don't see the same screen. Each one asks the same thing about the same
 * topic, in other words. Its choices are listed in the same order as the
 * original's, so the correct answer is the same one; the order a student
 * sees is shuffled later (see personalizeExam in server/lib/exam.ts).
 *
 * Keyed by the original question, exactly as written in exams.ts.
 */
export type Wording = {
  q: string;
  choices: [string, string, string, string];
  /** Only when the original rationale names the original example. */
  why?: string;
};

const v = (
  original: string,
  q: string,
  choices: [string, string, string, string],
  why?: string,
): [string, Wording] => [original, { q, choices, why }];

export const EXAM_VARIANTS = new Map<string, Wording>([
  // ---------------------------------------------------------------- Telecom
  v("What is a contact center?", "Which one describes a CONTACT CENTER?", [
    "A workplace where agents help customers through calls, chats or emails",
    "A shop where people buy mobile phones",
    "A school where teachers are trained",
    "A clinic where doctors check patients",
  ]),
  v("What does BPO stand for?", "BPO is short for…", [
    "Basic Phone Office",
    "Business Process Outsourcing",
    "Big Phone Operator",
    "Business Product Order",
  ]),
  v(
    "A call that the customer makes to the company is called an…",
    "A customer calls the company for help. This is an…",
    ["Outbound call", "Missed call", "Inbound call", "Wrong call"],
  ),
  v(
    "A call that the agent makes to the customer is called an…",
    "The agent calls a customer. This is an…",
    ["Inbound call", "Outbound call", "Hold call", "Free call"],
  ),
  v(
    "What do we call the person who answers calls in a contact center?",
    "The worker in a contact center who talks to customers is called the…",
    ["Agent", "Cashier", "Driver", "Security guard"],
  ),
  v("What does AHT mean?", "AHT is short for…", [
    "All Help Time",
    "Agent Happy Time",
    "Answer Hold Ticket",
    "Average Handle Time",
  ]),
  v(
    "Which is an example of NON-VOICE work?",
    "Which task is NON-VOICE (no talking on the phone)?",
    [
      "Speaking with a caller on the phone",
      "Replying to a customer through chat or email",
      "Phoning a customer to offer a product",
      "Hosting a radio show",
    ],
  ),
  v("What does CSAT measure?", "CSAT tells us…", [
    "How quickly the agent can type",
    "How many calls were not answered",
    "How satisfied the customer is with the help they got",
    "How long the agent rests",
  ]),
  v(
    "What does it mean to put a caller on HOLD?",
    "When an agent puts a caller on HOLD, the agent…",
    [
      "Ends the call",
      "Asks the caller to wait for a little while",
      "Sends the caller a gift",
      "Yells at the caller",
    ],
  ),
  v(
    "What is the FIRST thing an agent says when answering a call?",
    "An agent picks up a call. What comes FIRST?",
    ["The closing", "The price", "The greeting", "The farewell"],
  ),
  v(
    "Which one is a good skill for a contact center agent?",
    "Which skill should a contact center agent have?",
    ["Patience", "Rudeness", "Being late", "Being loud"],
  ),
  v(
    "To ESCALATE a call means to…",
    "When an agent ESCALATES a call, the agent…",
    [
      "Cuts the call",
      "Gives the call to a supervisor or a higher team",
      "Turns on the speaker",
      "Calls the customer back the next day",
    ],
  ),
  v(
    "What is a SCRIPT in a contact center?",
    "In a contact center, a SCRIPT is…",
    [
      "A film about call center agents",
      "A written guide that tells the agent what to say",
      "A list of the agent's friends",
      "The agent's pay",
    ],
  ),
  v(
    "Who guides and helps the agents in a team?",
    "Who leads and coaches a team of agents?",
    [
      "The customer",
      "The security guard",
      "The team leader or supervisor",
      "The driver",
    ],
  ),
  v(
    "What does an agent wear to talk and listen during calls?",
    "Agents use this to hear and speak during calls:",
    ["A headset", "A helmet", "Sunglasses", "A hat"],
  ),
  v("What does FCR mean?", "FCR is short for…", [
    "Fast Call Rate",
    "Final Customer Report",
    "Free Call Request",
    "First Call Resolution",
  ]),
  v(
    "What does the QA (Quality Assurance) team do?",
    "What is the job of the QA (Quality Assurance) team?",
    [
      "They clean the office",
      "They listen to calls to see if agents did their work well",
      "They sell products",
      "They repair the computers",
    ],
  ),
  v(
    "What is a QUEUE in a contact center?",
    "In a contact center, a QUEUE is…",
    [
      "Callers lined up, waiting for an agent",
      "A type of headset",
      "The agent's break",
      "A customer's bill",
    ],
  ),
  v(
    "Which one is a contact center SERVICE?",
    "Which of these can a contact center offer?",
    ["Farming rice", "Building houses", "Cooking meals", "Technical support"],
  ),
  v(
    "When an agent writes a customer's problem into the system, it is called a…",
    "The record an agent makes of a customer's problem in the system is a…",
    ["Ticket", "Song", "Receipt", "Letter"],
  ),
  v(
    "Why should an agent smile while talking on the phone?",
    "Agents are told to smile during calls. Why?",
    [
      "So the customer can see their face",
      "Because the boss is looking",
      "Because smiling makes the voice sound warm and friendly",
      "So the call will be shorter",
    ],
  ),
  v(
    "Why does the agent ask for the caller's name and account number?",
    "The agent asks, “May I have your name and account number?” Why?",
    [
      "To make sure who is calling and open the correct account",
      "To make the call last longer",
      "To share it with friends",
      "To sell the caller a new phone",
    ],
  ),
  v("What does EMPATHY mean?", "An agent with EMPATHY…", [
    "Talks very quickly",
    "Understands how the customer feels",
    "Ends calls quickly",
    "Always says no to the customer",
  ]),
  v(
    "Which sentence shows good phone manners?",
    "Which line is POLITE on the phone?",
    [
      "“What is it?”",
      "“Make it quick, I'm busy.”",
      "“Just call back later.”",
      "“Thank you for calling. How can I help you today?”",
    ],
  ),
  v(
    "Why should the hold time be SHORT?",
    "Why should agents not keep callers on hold for long?",
    [
      "So the customer doesn't feel forgotten",
      "So the agent can have a snack",
      "So the call costs more money",
      "So the customer hangs up",
    ],
  ),
  v("What is an INTERNATIONAL account?", "An INTERNATIONAL account serves…", [
    "Customers in your own town",
    "Customers from other countries",
    "Agents only",
    "No customers at all",
  ]),
  v(
    "Why should an agent speak clearly and not too fast?",
    "Why must an agent talk clearly and at a slow, steady speed?",
    [
      "To end the call sooner",
      "To sound like a machine",
      "So the customer can understand everything",
      "So the customer feels bored",
    ],
  ),
  v(
    "Why do contact centers follow a CALL FLOW?",
    "What is the reason for having a CALL FLOW?",
    [
      "So every call is done in a different way",
      "So agents do the steps of a call in the correct order",
      "So agents can skip saying hello",
      "So calls take more time",
    ],
  ),
  v(
    "Why must agents keep customer information PRIVATE?",
    "Why must agents NOT share a customer's details?",
    [
      "So they can share it some other time",
      "To keep the customer safe and keep their trust",
      "Because the details are boring",
      "So the call is shorter",
    ],
  ),
  v(
    "Why do agents take NOTES during a call?",
    "Agents write NOTES while on a call so they can…",
    [
      "Draw pictures",
      "Pretend to be busy",
      "Remember the details and keep the records correct",
      "Write a story",
    ],
  ),
  v("What does a TECH SUPPORT agent do?", "A TECH SUPPORT agent…", [
    "Helps customers solve problems with their gadgets or internet",
    "Sells food",
    "Delivers parcels",
    "Teaches in a classroom",
  ]),
  v(
    "Why is LISTENING important for an agent?",
    "Why must an agent listen well?",
    [
      "So the call finishes sooner",
      "So the agent can talk more",
      "So the customer will be quiet",
      "So the agent knows what the customer's problem is",
    ],
  ),
  v("What is a LOCAL account?", "A LOCAL account serves…", [
    "Customers from other countries",
    "Customers here in the Philippines",
    "Supervisors only",
    "No calls at all",
  ]),
  v(
    "Why should agents NOT use slang like “yeah” or “nope” with customers?",
    "Why do agents say “yes” and “no” instead of “yeah” and “nope”?",
    [
      "Because slang words are too long",
      "Because customers don't like English",
      "Because polite words sound professional and show respect",
      "Because slang is quicker",
    ],
  ),
  v(
    "A customer is angry because their bill is wrong. What should you say FIRST?",
    "A customer is upset about a mistake on their bill. What do you say FIRST?",
    [
      "“That's not my job.”",
      "“Please call a different number.”",
      "“It's probably your mistake.”",
      "“I'm sorry about this. I'll help you fix it.”",
    ],
  ),
  v(
    "You need one minute to check the customer's record. What should you do?",
    "You must look at the customer's record for a minute. What do you do?",
    [
      "Ask, “Is it okay if I put you on hold for a minute?” and thank them when you return",
      "Go quiet without telling the customer",
      "End the call and call back next week",
      "Tell the customer to wait without asking first",
    ],
  ),
  v(
    "The customer spoke too fast and you did not hear their phone number. What should you do?",
    "You missed the customer's phone number because they said it too fast. What do you do?",
    [
      "Make a guess",
      "End the call",
      "Politely say, “Sorry, could you say the number again, please?”",
      "Ask the agent beside you",
    ],
  ),
  v(
    "You greeted the customer. What should you do NEXT in the call flow?",
    "In the call flow, what comes right AFTER the greeting?",
    [
      "Saying goodbye",
      "Verifying (checking) the customer's name and account",
      "Putting the customer on hold at once",
      "Transferring the call",
    ],
  ),
  v(
    "A customer asks something that only your supervisor can answer. What should you do?",
    "Only your supervisor knows the answer to the customer's question. What do you do?",
    [
      "Invent an answer",
      "Say you don't know and end the call",
      "Pretend you didn't hear it",
      "Tell the customer you will transfer them to your supervisor",
    ],
  ),
  v(
    "The customer says, “Thank you, that's all.” What should you say?",
    "The customer says, “That's all I need, thanks.” What is your reply?",
    [
      "“Thank you for calling. Have a great day!”",
      "“Bye.”",
      "Say nothing and hang up",
      "“Why did you call?”",
    ],
  ),
  v(
    "The customer's name is hard to spell. What should you do?",
    "You are not sure how to spell the customer's name. What do you do?",
    [
      "Type any spelling",
      "Leave the name out",
      "Use a nickname instead",
      "Ask them to spell it, then spell it back to check",
    ],
  ),
  v(
    "You want to cough while the customer is talking. What should you do?",
    "You need to cough while the customer is speaking. What should you do?",
    [
      "Cough loudly into the mic",
      "Press MUTE, cough, then unmute",
      "End the call",
      "Ask the customer to stop speaking",
    ],
  ),
  v(
    "Agent Ana solved 9 out of 10 problems. Agent Ben solved 5 out of 15. Who gave BETTER help?",
    "Agent Ana fixed 9 of her 10 cases. Agent Ben fixed 5 of his 15 cases. Who did the BETTER job helping?",
    [
      "Ana, because she fixed nearly all of her cases",
      "Ben, because he handled more calls",
      "They did the same",
      "Neither of them",
    ],
  ),
  v(
    "Read the call: Agent: “Good morning, thank you for calling. May I have your name?” Customer: “Liza.” Agent: “Thank you, Liza. Your internet is fixed now.” (The call ends.) What part is MISSING?",
    "Read the call: Agent: “Good afternoon, thanks for calling. What is your name, please?” Customer: “Mark.” Agent: “Thank you, Mark. Your account is working again.” (The call ends.) Which part did the agent FORGET?",
    ["The greeting", "Asking for the name", "The closing", "The problem"],
  ),
  v(
    "An agent said “Wait.” and put the customer on hold for 5 minutes. What did the agent do WRONG?",
    "An agent said only “Hold on.” and left the customer on hold for 5 minutes. What was the MISTAKE?",
    [
      "The agent didn't ask permission, and the hold was too long",
      "The agent was too kind",
      "The agent talked too slowly",
      "There was no mistake",
    ],
  ),
  v("Which one is an OUTBOUND call?", "Which of these is an OUTBOUND call?", [
    "A customer calls to make a complaint",
    "A customer calls with a question",
    "An agent calls a customer to remind them to pay",
    "A customer writes an email",
  ]),
  v(
    "Agent Gino's calls are very short, but his customers keep calling back with the SAME problem. What does this show?",
    "Agent Gino finishes calls quickly, but his customers call again about the SAME problem. What does this tell us?",
    [
      "Gino is quick but doesn't truly fix the problems",
      "Gino is the top agent",
      "The customers enjoy calling",
      "The phones are not working",
    ],
  ),
  v(
    "A customer says, “I've been waiting for 30 minutes!” Which reply is BEST?",
    "A customer complains, “I waited half an hour!” What is the BEST reply?",
    [
      "“Everyone has to wait.”",
      "“It's not my fault.”",
      "“So?”",
      "“I'm sorry you waited so long. Thank you for being patient. How may I help?”",
    ],
  ),
  v(
    "Which agent should get the “Best Agent” award?",
    "Who deserves the “Best Agent” award?",
    [
      "Carlo: quick, but often rude to customers",
      "Dina: polite, follows the call flow, and fixes problems",
      "Eli: friendly, but often late",
      "Fe: takes long breaks and misses calls",
    ],
  ),
  v("Which is the BEST way to close a call?", "Which closing is the BEST?", [
    "“Okay, bye.”",
    "“Is there anything else I can help you with? Thanks for calling, and have a great day!”",
    "End the call without a word",
    "“Don't call us again.”",
  ]),

  // ------------------------------------------------------------ Programming
  v("What does HTML stand for?", "HTML is short for…", [
    "HyperText Markup Language",
    "High Tech Modern Language",
    "Home Tool Making Language",
    "Hyper Transfer Machine Language",
  ]),
  v("What does CSS stand for?", "CSS is short for…", [
    "Computer Style System",
    "Colorful Style Sheets",
    "Cascading Style Sheets",
    "Creative Screen Setup",
  ]),
  v(
    "Which tag makes the BIGGEST heading?",
    "Which heading tag shows the LARGEST text?",
    ["<h5>", "<h1>", "<p>", "<head>"],
  ),
  v("Which tag is used for a PARAGRAPH?", "To write a PARAGRAPH, you use…", [
    "<p>",
    "<a>",
    "<br>",
    "<img>",
  ]),
  v(
    "Which tag is used to make a LINK?",
    "To make text you can click to go to another page, you use…",
    ["<link>", "<p>", "<ul>", "<a>"],
  ),
  v(
    "Which tag shows a PICTURE on a web page?",
    "To put an IMAGE on a web page, you use…",
    ["<picture-show>", "<img>", "<photo>", "<table>"],
  ),
  v(
    "Which one is an HTML editor (a program for writing code)?",
    "Which program can you use to WRITE your HTML code?",
    ["Calculator", "Paint", "Visual Studio Code", "Camera app"],
  ),
  v(
    "What does a computer programmer do?",
    "A computer programmer is someone who…",
    [
      "Fixes cars",
      "Writes code (instructions) that computers follow",
      "Cooks meals",
      "Sells cellphones",
    ],
  ),
  v("What is computer ERGONOMICS?", "Computer ERGONOMICS is about…", [
    "Arranging your work area so you stay comfortable and safe",
    "A computer game",
    "A type of keyboard",
    "Repairing a broken computer",
  ]),
  v(
    "Which tag makes text BOLD?",
    "To make words look thick and dark (BOLD), you use…",
    ["<i>", "<u>", "<p>", "<b>"],
  ),
  v(
    "Which tag makes a ROW in a table?",
    "In a table, which tag starts a new ROW?",
    ["<td>", "<tr>", "<th>", "<row>"],
  ),
  v(
    "What is the correct file name ending for a web page?",
    "A web page file should be saved with which ending?",
    [".exe", ".png", ".html", ".mp4"],
  ),
  v(
    "Which tag makes a LINE BREAK (goes to the next line)?",
    "Which tag moves the text down to a NEW LINE?",
    ["<line>", "<break>", "<br>", "<next>"],
  ),
  v(
    "Which tag makes text ITALIC (slanted)?",
    "To make words lean to the side (ITALIC), you use…",
    ["<i>", "<b>", "<u>", "<s>"],
  ),
  v(
    "Which tag holds everything you SEE on the web page?",
    "All the content that shows on the page goes inside…",
    ["<head>", "<title>", "<style>", "<body>"],
  ),
  v("Which tag makes one ITEM in a list?", "Each ITEM in a list goes inside…", [
    "<item>",
    "<li>",
    "<ol>",
    "<td>",
  ]),
  v("Which tag makes a TABLE?", "To start a TABLE, you use…", [
    "<tab>",
    "<tr>",
    "<table>",
    "<grid>",
  ]),
  v(
    "Which tag makes a FORM where users can type information?",
    "Which tag holds a FORM that people fill in?",
    ["<form>", "<input>", "<box>", "<page>"],
  ),
  v(
    "Which tag makes a BUTTON you can click?",
    "To add a clickable BUTTON, you use…",
    ["<click>", "<btn>", "<push>", "<button>"],
  ),
  v(
    "Which CSS property changes the SIZE of the text?",
    "Which CSS property makes text bigger or smaller?",
    ["text-color", "font-size", "text-big", "size"],
  ),
  v("Why do we use CSS?", "What is CSS used for?", [
    "To style the page, like its colors and fonts",
    "To switch on the computer",
    "To print the page",
    "To erase the web page",
  ]),
  v("What does the <title> tag do?", "The <title> tag…", [
    "Makes a large heading on the page",
    "Adds an image",
    "Puts the page's name on the browser tab",
    "Starts a new paragraph",
  ]),
  v("What does the <ul> tag make?", "The <ul> tag makes…", [
    "A numbered list",
    "A list with bullets (dots)",
    "A table",
    "A link",
  ]),
  v(
    "Why should you sit up straight with the screen at eye level?",
    "Why keep your back straight and the monitor at eye level?",
    [
      "To look good",
      "To type more quickly",
      "To make the computer run faster",
      "To keep your back and neck from hurting",
    ],
  ),
  v("In CSS, what does PADDING do?", "CSS PADDING adds…", [
    "Space INSIDE the border, around the content",
    "Space OUTSIDE the border",
    "A new text color",
    "Nothing; it removes the border",
  ]),
  v("In CSS, what does MARGIN do?", "CSS MARGIN adds…", [
    "A new font",
    "Space INSIDE the border",
    "Space OUTSIDE the border",
    "Bold text",
  ]),
  v("What does the <ol> tag make?", "The <ol> tag makes…", [
    "A list with bullets",
    "A numbered list (1, 2, 3)",
    "An image",
    "A heading",
  ]),
  v(
    'In <a href="page2.html">Next</a>, what does href tell the browser?',
    'Look at <a href="about.html">About us</a>. What does href give?',
    [
      "The link's color",
      "The text size",
      "The page the link opens",
      "The computer's name",
    ],
  ),
  v(
    "Which one is a CLOSING tag?",
    "Which of these tags CLOSES an element?",
    ["<b>", "<h2>", "</b>", "<br>"],
    "A closing tag has a slash ( / ) before the name, like </b>.",
  ),
  v("In CSS, what does BORDER do?", "CSS BORDER…", [
    "Draws a line around the box",
    "Changes the font",
    "Plays music",
    "Adds an image",
  ]),
  v("What is a WEB BROWSER?", "A WEB BROWSER is…", [
    "A type of mouse",
    "A person who builds websites",
    "An HTML tag",
    "An app that opens web pages, like Chrome",
  ]),
  v(
    'What does <input type="text"> make?',
    '<input type="text"> puts this on the page:',
    ["An image", "A box you can type in", "A heading", "A table"],
  ),
  v(
    "Why should you rest your eyes and stretch every hour at the computer?",
    "Why take a short break to rest your eyes and stretch every hour?",
    [
      "So your eyes and body don't get tired",
      "So the computer can cool off",
      "So your files are deleted",
      "So you get faster internet",
    ],
  ),
  v("What does a CSS TRANSITION do?", "A CSS TRANSITION…", [
    "Erases the page",
    "Makes text big forever",
    "Makes a change happen slowly and smoothly",
    "Opens a new page",
  ]),
  v(
    "You want “Welcome” as the BIGGEST heading. Which code is correct?",
    "Which code makes “Hello” the LARGEST heading?",
    ["<h6>Hello</h6>", "<h1>Hello</h1>", "<p>Hello</p>", "<a>Hello</a>"],
  ),
  v(
    "You want ALL paragraphs to be red. Which CSS is correct?",
    "Which CSS turns EVERY paragraph red?",
    ["p { color: red; }", "red { p: color; }", "p = red", "color { red: p; }"],
  ),
  v(
    "You want to show the picture “cat.jpg”. Which code is correct?",
    "Which code shows the image “dog.png”?",
    [
      '<img link="dog.png">',
      "<picture>dog.png</picture>",
      "<a>dog.png</a>",
      '<img src="dog.png">',
    ],
  ),
  v(
    "You want a link to Google. Which code is correct?",
    "Which code makes a link to YouTube?",
    [
      '<a src="https://www.youtube.com">YouTube</a>',
      "<link>YouTube</link>",
      '<a href="https://www.youtube.com">YouTube</a>',
      '<p href="https://www.youtube.com">YouTube</p>',
    ],
  ),
  v(
    "You want the page background to be yellow. Which CSS is correct?",
    "Which CSS makes the whole page background light blue?",
    [
      "body { color: lightblue; }",
      "body { background-color: lightblue; }",
      "lightblue { body: background; }",
      "background = lightblue",
    ],
  ),
  v(
    "You want the word “Hello” to be ITALIC. Which code is correct?",
    "Which code makes the word “Salamat” ITALIC?",
    ["<b>Salamat</b>", "<i>Salamat</i>", "<u>Salamat</u>", "<h1>Salamat</h1>"],
  ),
  v(
    "You want all <h1> headings in the CENTER. Which CSS is correct?",
    "Which CSS puts every <h2> heading in the MIDDLE?",
    [
      "h2 { color: center; }",
      "center { h2; }",
      "h2 = middle",
      "h2 { text-align: center; }",
    ],
  ),
  v(
    "You want a button that says “Send”. Which code is correct?",
    "Which code makes a button with the word “Submit”?",
    [
      "<button>Submit</button>",
      "<a>Submit</a>",
      "<p>Submit</p>",
      "<submit>button</submit>",
    ],
    "<button>Submit</button> makes a button with the word Submit.",
  ),
  v(
    "What is WRONG with this code?  <p>Hello</h1>",
    "Find the MISTAKE in this code:  <h2>Good day</p>",
    [
      "The opening tag and the closing tag are not the same",
      "There is no mistake",
      "“Good day” is spelled wrong",
      "It needs an image",
    ],
    "It opens with <h2> but closes with </p>. It should be <h2>Good day</h2>.",
  ),
  v(
    "What will this code show?  <ol><li>Rice</li><li>Egg</li></ol>",
    "What does this code show?  <ol><li>Milk</li><li>Bread</li></ol>",
    [
      "• Milk  • Bread",
      "Milk Bread in a table",
      "Nothing",
      "1. Milk  2. Bread",
    ],
  ),
  v(
    "Look at the CSS:  h1 { color: blue; }  p { color: green; }  What color is the PARAGRAPH text?",
    "Read the CSS:  h1 { color: red; }  p { color: purple; }  What color are the PARAGRAPHS?",
    ["Red", "Purple", "Black", "Blue"],
    "The p rule says color: purple, so paragraphs are purple. Only h1 is red.",
  ),
  v(
    "What will this code show?  <ul><li>Dog</li><li>Cat</li></ul>",
    "What does this code show?  <ul><li>Mango</li><li>Banana</li></ul>",
    [
      "1. Mango  2. Banana",
      "Mango and Banana in a table",
      "• Mango  • Banana",
      "Nothing",
    ],
  ),
  v(
    "What is WRONG with this CSS?  p { color red; }",
    "Find the MISTAKE in this CSS:  h1 { color blue; }",
    [
      "There is no mistake",
      "A colon ( : ) is missing after color",
      "h1 is not a real tag",
      "blue is not a color",
    ],
    "It should be h1 { color: blue; }. Every property needs a colon before its value.",
  ),
  v(
    "Which code is the CORRECT and complete start of a web page?",
    "Which one is a CORRECT, complete web page skeleton?",
    [
      "<body><html><head></head></html></body>",
      "<head><body></head></body>",
      "<html><head><title>Home</title></head><body></body></html>",
      "<title><html></title></html>",
    ],
  ),
  v(
    "Juan wants his website to be EASY TO READ. Which choice is best?",
    "Maria wants people to read her website EASILY. What should she choose?",
    [
      "Light yellow text on a white page",
      "Dark text on a light page with a large, clear font",
      "Very small text",
      "A different color for every word",
    ],
  ),
  v(
    "Which website is BEST for a school?",
    "Which design is BEST for a school website?",
    [
      "No menu and very tiny words",
      "Blinking colors on every page",
      "Images that never appear",
      "A clear menu, readable text and photos of the school",
    ],
  ),
]);
