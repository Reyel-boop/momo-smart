/**
 * TLE – ICT: Computer Programming (Grade 9 or 10), following DepEd's
 * Three-Term Budget of Work (updated April 7, 2026): one unit per week,
 * one lesson per learning competency. Lessons carry a lecture video, a
 * written lecture, a reading built from the suggested activities, and a
 * self-check; every unit has five Unit Questions.
 *
 * Code samples use ~~~ fences so they don't clash with template literals.
 */
import type { DemoLesson, DemoSubject, DemoUnit } from "../grade10";
import { q, TLE_DEPARTMENT } from "./common";
import { PROGRAMMING_BANK } from "./programming-bank";

/** `inline code` inside a lecture. */
const c = (text: string) => `\`${text}\``;

/**
 * The lecture video for each lesson (YouTube id). Each was checked to exist
 * and allow embedding, and chosen for covering the lesson’s topic.
 */
export const LESSON_VIDEOS: Record<string, string> = {
  "Trends, Careers and Skills in Computer Programming": "r3En5esTJAE", // Careers in Coding — Bite-Size Science (BEMC)
  "Computer Ergonomics": "87e1NlZF57E", // How to Set Up a Computer Workstation — TucsonOrtho
  "HTML Structure, Elements and Attributes": "vNOyRZIkC7o", // HTML Tags, Attributes and Elements — John Morris
  "Using an HTML Editor": "0Sj8ehugmhE", // HTML First Program in Notepad & VS Code — Akash Padhiyar
  "Headings, Paragraphs, Styles and Text Formatting": "ORAxXmFpJqg", // Text Formatting with HTML in 5 Minutes — Learndev
  "Embedding Multimedia Elements": "P_xH63rOqPE", // HTML Media Elements: Audio & Video — CodeLucky
  "HTML Lists": "-kXZvKxs9oA", // Learn HTML lists in 4 minutes — Bro Code
  "HTML Tables": "IHAYN1BBNEg", // Tables, rowspan and colspan — Quentin Watt Tutorials
  "HTML Forms, Input Types and Elements": "frAGrGN00OA", // HTML Forms and Inputs — Dave Gray
  "HTML Links": "81wMe4sWGVQ", // Anchor Tag, href, mail link and target — TegaFate HUB
  "Planning and Building a Website": "mtXM87QMSi8", // A Navbar with Multiple Pages — How to Web Dev
  "CSS Syntax, Selectors and Types": "uzF1Doc3cZQ", // Get started with CSS in 8 minutes — Bro Code
  "CSS Colors, Backgrounds, Fonts and Text": "Ddc-IIrIot0", // CSS Colors Tutorial for Beginners — Dave Gray
  "CSS Borders, Margins and Padding": "jLaoQzW8doI", // CSS Margin, Padding and Border Explained — SimpliCode
  "Styling Icons, Links, Lists and Tables": "sORF-Awir70", // Styling links: visited, hover, active, focus — Dave Gray
  "CSS Animation and Transition": "YszONjKpgg4", // Learn CSS Animation In 15 Minutes — Web Dev Simplified
  "The CSS Box Model": "ZaiIDH0qp1c", // CSS box model explained — Coder Coder
  "CSS Box Shadow and Transform": "qdeIy9_fbxE", // Learn CSS transformations in 9 minutes — Bro Code
  "Creating an Interactive Website": "ldPLpY2evrM", // CSS Buttons & Hover Animation — FollowAndrew
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
  lecture: { videoId: LESSON_VIDEOS[title] ?? "", lecture },
});

const UNITS: DemoUnit[] = [
  // Week 1
  {
    title: "Computer Programming Careers and Computer Ergonomics",
    description:
      "Current trends, careers and skills in programming, and working safely at the computer.",
    lessons: [
      lesson(
        "Trends, Careers and Skills in Computer Programming",
        "Where programmers work today and the skills they need.",
        `## What programmers do
A **programmer** writes instructions that a computer follows. Those instructions run websites, mobile apps, games, school systems like this one, and even machines in factories and farms.

## Current trends
- **Web and mobile development** — almost every business needs a website or an app
- **Artificial intelligence (AI)** — programs that recognise speech, images and text
- **Cloud computing** — software that runs on remote servers instead of one computer
- **Cybersecurity** — protecting systems and data from attacks
- **Data analysis** — turning large amounts of data into decisions
- **Game development** and **Internet of Things (IoT)** — smart devices that talk to each other

## Careers
- **Web developer** (front-end builds what users see; back-end builds the server side)
- **Mobile app developer**, **software engineer**, **game developer**
- **Database administrator**, **QA/software tester**, **IT support**
- **Freelancer** — Filipino developers work online for clients around the world

## Skills needed
- **Technical:** HTML, CSS, a programming language, using an editor, testing and debugging
- **Thinking:** logic, problem solving, attention to detail
- **People skills:** communication, teamwork, patience and willingness to keep learning

## Key points
Technology changes fast, so the most important programming skill is learning how to learn.`,
        "Programming Jobs Around Us: in groups, match current programming trends with possible jobs and the skills they need, then explain your choices. My Future Programmer Self: make a mini poster showing a programming trend, your career goal, and the skills you will learn.",
        [
          "Name two current trends in computer programming.",
          "What is the difference between a front-end and a back-end developer?",
          "Give one technical skill and one people skill a programmer needs.",
        ],
      ),
      lesson(
        "Computer Ergonomics",
        "Setting up a workstation that protects your health.",
        `## What is ergonomics?
**Ergonomics** is fitting the workplace to the worker. Programmers sit at a computer for hours, so a poor setup causes real health problems.

## Health risks of a poor workstation
- **Eye strain** — from glare, a screen too close, or staring without breaks
- **Back and neck pain** — from slouching or a monitor that is too low or too high
- **Carpal tunnel syndrome** and wrist pain — from bent wrists while typing
- **Stiff muscles and poor circulation** — from sitting too long without moving

## A healthy workstation
- **Monitor:** an arm's length away, top of the screen at or slightly below eye level
- **Chair:** supports the lower back; feet flat on the floor; knees at about 90°
- **Keyboard and mouse:** close to the body, wrists straight, elbows at about 90°
- **Lighting:** no glare on the screen; avoid a bright window behind or in front of it

## Healthy habits
- Follow the **20-20-20 rule**: every 20 minutes, look at something 20 feet away for 20 seconds
- Stand, stretch and walk for a few minutes every hour
- Keep cables tidy and drinks away from the computer

## Key points
Small adjustments to the chair, screen and posture prevent injuries that build up over years.`,
        "Spot the Risk! Ergonomics Detective: study a workstation picture and list the ergonomic risks, their health effects and how to correct them. Build a Healthy Workstation: act out an incorrect and a correct workstation setup and explain the improvements.",
        [
          "Where should the top of the monitor be?",
          "What is the 20-20-20 rule?",
          "What health problem can bent wrists cause?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which career builds the part of a website that users see and click?",
        [
          "Front-end web developer",
          "Database administrator",
          "Network technician",
          "Hardware technician",
        ],
        0,
        "Front-end developers build the visible part of a website — its pages, layout and buttons — using HTML, CSS and JavaScript.",
      ),
      q(
        "Which is a current trend in computer programming?",
        [
          "Typewriter repair",
          "Artificial intelligence",
          "Film photography",
          "Telegraph messaging",
        ],
        1,
        "Artificial intelligence is one of the fastest-growing areas of programming, along with web, mobile, cloud and cybersecurity.",
      ),
      q(
        "What is ergonomics?",
        [
          "A programming language",
          "Fitting the workplace to the worker",
          "A type of computer virus",
          "A way to speed up the internet",
        ],
        1,
        "Ergonomics designs the workplace — chair, desk, screen, posture — around the worker's body to prevent strain and injury.",
      ),
      q(
        "Where should the top of the monitor be?",
        [
          "Far above eye level",
          "At or slightly below eye level",
          "At knee level",
          "Behind the user",
        ],
        1,
        "With the top of the screen at or slightly below eye level, the neck stays straight and relaxed.",
      ),
      q(
        "The 20-20-20 rule helps prevent…",
        ["eye strain", "computer viruses", "slow typing", "power outages"],
        0,
        "Every 20 minutes, looking 20 feet away for 20 seconds rests the eye muscles and prevents eye strain.",
      ),
    ],
  },
  // Week 2
  {
    title: "HTML Structure and HTML Editors",
    description:
      "The structure, elements and attributes of an HTML document, and creating one with an editor.",
    lessons: [
      lesson(
        "HTML Structure, Elements and Attributes",
        "How every web page is put together.",
        `## What is HTML?
**HTML (HyperText Markup Language)** is the language of web pages. It is not a programming language that calculates — it is a **markup language** that labels each part of a page so the browser knows how to show it.

## Elements and tags
An **element** usually has an opening tag, content and a closing tag:
~~~
<p>This is a paragraph.</p>
~~~
- ${c("<p>")} is the **opening tag**, ${c("</p>")} the **closing tag** (note the slash)
- Some elements are **empty** (no content, no closing tag): ${c("<br>")}, ${c("<img>")}, ${c("<hr>")}

## Attributes
**Attributes** give extra information and are written inside the opening tag as ${c('name="value"')}:
~~~
<img src="logo.png" alt="School logo">
<a href="https://www.deped.gov.ph">DepEd</a>
~~~

## The basic structure
~~~
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello!</h1>
    <p>Welcome to my page.</p>
  </body>
</html>
~~~
- ${c("<!DOCTYPE html>")} tells the browser this is an HTML5 document
- ${c("<html>")} wraps the whole page
- ${c("<head>")} holds information about the page, such as the ${c("<title>")} shown on the browser tab
- ${c("<body>")} holds everything visible on the page

## Key points
Tags must be **nested** properly — close the inner tag before the outer one: ${c("<p><b>Hi</b></p>")}, not ${c("<p><b>Hi</p></b>")}.`,
        "Build the HTML Skeleton: arrange mixed-up HTML tags in the correct order and explain what each tag does. Fix the Broken Web Page: find and correct the syntax errors in a given HTML code, then explain each correction.",
        [
          "What is the difference between an element and an attribute?",
          "What goes inside the <head> and what goes inside the <body>?",
          "Give an example of an empty element.",
        ],
      ),
      lesson(
        "Using an HTML Editor",
        "Creating, saving and viewing an HTML file.",
        `## HTML editors
An **HTML editor** is a program for writing HTML code.
- **Text editors:** Notepad (Windows), TextEdit (Mac, in plain-text mode)
- **Code editors:** Visual Studio Code, Sublime Text, Notepad++ — they add **syntax highlighting** (colours for tags), **auto-complete** and line numbers
- **Online editors:** CodePen, W3Schools "Try it Yourself" — no installation needed

## Creating your first page
- Open the editor and type the basic HTML structure.
- **Save** the file with the ${c(".html")} extension, for example ${c("index.html")}.
- In Notepad, choose **Save as type: All Files** and **Encoding: UTF-8**, or the file is saved as ${c(".txt")}.
- Keep all files of one website in **one folder**.

## Viewing and editing
- Double-click the file to open it in a **web browser** (Chrome, Edge, Firefox).
- To change the page: edit the code, **save**, then **refresh** the browser (F5).
- Right-click a web page and choose **View page source** to see its HTML.

## Naming files
Use lowercase letters, no spaces (${c("about-us.html")}, not ${c("About Us.html")}). The home page of a website is usually named ${c("index.html")}.

## Key points
Write → save as .html → open in a browser → edit → save → refresh. That cycle is how every web page is built.`,
        "My First Web Page: use an HTML editor to create and save a simple HTML file, then open it in a web browser. Edit and Improve the Web Page: open an existing HTML file, make the required edits, save it, and refresh the browser to see the changes.",
        [
          "What file extension must an HTML file have?",
          "Name one advantage of a code editor over Notepad.",
          "After editing and saving, what must you do in the browser to see the change?",
        ],
      ),
    ],
    quiz: [
      q(
        "What does HTML stand for?",
        [
          "HyperText Markup Language",
          "High Technology Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Management Language",
        ],
        0,
        "HTML is HyperText Markup Language — it marks up the parts of a page so the browser can display them.",
      ),
      q(
        "Which part of an HTML document holds everything visible on the page?",
        ["<head>", "<title>", "<body>", "<!DOCTYPE>"],
        2,
        "The <body> contains all the content users see; the <head> holds information about the page.",
      ),
      q(
        'In <img src="logo.png">, what is src?',
        ["A tag", "An attribute", "A closing tag", "A file editor"],
        1,
        'src is an attribute: extra information written inside the opening tag as name="value".',
      ),
      q(
        "Which is a closing tag?",
        ["<p>", "</p>", "<p/>", "<close p>"],
        1,
        "A closing tag repeats the tag name with a forward slash: </p>.",
      ),
      q(
        "You edited and saved index.html. What do you do to see the change in the browser?",
        [
          "Restart the computer",
          "Refresh the page",
          "Rename the file",
          "Delete the browser",
        ],
        1,
        "The browser shows the saved version only after the page is refreshed (F5).",
      ),
    ],
  },
  // Week 3
  {
    title: "Headings, Paragraphs, Styles and Formatting",
    description:
      "Organizing text with headings and paragraphs, and formatting it.",
    lessons: [
      lesson(
        "Headings, Paragraphs, Styles and Text Formatting",
        "Organizing and formatting the text of a web page.",
        `## Headings
HTML has six levels of headings, from the most important ${c("<h1>")} to the least ${c("<h6>")}:
~~~
<h1>San Vicente National High School</h1>
<h2>Grade 10 – ST DARIA</h2>
<h3>Class Officers</h3>
~~~
Use **one** ${c("<h1>")} per page for the main title, then ${c("<h2>")} for sections. Headings help readers and search engines understand the page.

## Paragraphs and line breaks
- ${c("<p>")} makes a paragraph; the browser adds space before and after it
- ${c("<br>")} breaks the line without starting a new paragraph
- ${c("<hr>")} draws a horizontal line to separate topics
- Extra spaces and Enter keys in the code are ignored — use tags instead

## Formatting text
- ${c("<b>")} or ${c("<strong>")} — **bold** (strong also means "important")
- ${c("<i>")} or ${c("<em>")} — italic (em means "emphasised")
- ${c("<u>")} — underline, ${c("<mark>")} — highlighted
- ${c("<small>")} — smaller text, ${c("<del>")} — crossed out
- ${c("<sub>")} and ${c("<sup>")} — subscript (H₂O) and superscript (x²)

## The style attribute
The ${c("style")} attribute changes how one element looks:
~~~
<p style="color: blue; font-size: 20px;">Welcome!</p>
<h2 style="text-align: center; font-family: Arial;">News</h2>
~~~
Each style is a **property: value;** pair.

## Key points
Headings structure the page, paragraphs hold the text, and formatting tags and styles make it easier to read.`,
        "Design My Info Page: with an HTML editor, create a one-page document about a given topic using headings, paragraphs and formatted text (bold, italic, colour or size). Fix and Style the Web Page: open the provided HTML file, correct its headings, organize its paragraphs and apply proper text styles.",
        [
          "How many heading levels does HTML have, and which is the most important?",
          "What is the difference between <p> and <br>?",
          "Write a style attribute that makes text red.",
        ],
      ),
    ],
    quiz: [
      q(
        "Which tag makes the largest, most important heading?",
        ["<h6>", "<head>", "<h1>", "<header>"],
        2,
        "<h1> is the top-level heading; the levels go down to <h6>.",
      ),
      q(
        "Which tag starts a new line without starting a new paragraph?",
        ["<p>", "<br>", "<hr>", "<lb>"],
        1,
        "<br> is a line break; <p> starts a new paragraph with space around it.",
      ),
      q(
        "Which tag makes text bold and marks it as important?",
        ["<em>", "<strong>", "<small>", "<sub>"],
        1,
        "<strong> shows text in bold and tells the browser the text is important.",
      ),
      q(
        "How is H₂O written in HTML?",
        [
          "H<sup>2</sup>O",
          "H<sub>2</sub>O",
          "H<small>2</small>O",
          "H<b>2</b>O",
        ],
        1,
        "<sub> places the 2 below the line as a subscript; <sup> is for superscripts like x².",
      ),
      q(
        'What does <p style="color: green;"> do?',
        [
          "Makes the paragraph text green",
          "Makes the page background green",
          "Adds a green border",
          "Nothing — style is not allowed",
        ],
        0,
        "The style attribute sets CSS for that element; color changes the text colour.",
      ),
    ],
  },
  // Week 4
  {
    title: "Multimedia, Lists and Tables",
    description: "Embedding images, audio and video; lists; and tables.",
    lessons: [
      lesson(
        "Embedding Multimedia Elements",
        "Adding images, audio and video to a web page.",
        `## Images
~~~
<img src="images/campus.jpg" alt="Our school campus" width="400">
~~~
- ${c("src")} — the image file (path) or web address
- ${c("alt")} — text shown if the image can't load and read aloud by screen readers; always include it
- ${c("width")} / ${c("height")} — size in pixels (set one to keep the proportions)

## Audio
~~~
<audio controls>
  <source src="audio/anthem.mp3" type="audio/mpeg">
  Your browser does not support audio.
</audio>
~~~

## Video
~~~
<video width="480" controls>
  <source src="video/intro.mp4" type="video/mp4">
</video>
~~~
- ${c("controls")} shows play, pause and volume buttons
- Other attributes: ${c("autoplay")}, ${c("loop")}, ${c("muted")}, ${c("poster")} (picture shown before playing)

## Videos from YouTube
Use **Share → Embed** on YouTube and paste the ${c("<iframe>")} code it gives you.

## File paths
- **Relative path:** ${c("images/photo.jpg")} — a file inside your website's folder
- **Absolute path:** ${c("https://example.com/photo.jpg")} — a full web address
A broken image usually means the path or file name is wrong (check spelling and capital letters).

## Key points
Use common formats (JPG/PNG for images, MP3 for audio, MP4 for video), keep files small, and always give images alt text.`,
        "Add Media to My Web Page: insert at least one image and one audio or video file into a given webpage and display them correctly. Multimedia Fix and Improve: fix the broken or missing multimedia elements in a provided HTML file and embed images or videos properly.",
        [
          "Why should every image have an alt attribute?",
          "What does the controls attribute do on <video>?",
          "What is the difference between a relative and an absolute path?",
        ],
      ),
      lesson(
        "HTML Lists",
        "Ordered, unordered and description lists.",
        `## Unordered list — bullets
Use when the order does not matter:
~~~
<ul>
  <li>Keyboard</li>
  <li>Mouse</li>
  <li>Monitor</li>
</ul>
~~~

## Ordered list — numbers
Use when the order matters, such as steps:
~~~
<ol>
  <li>Open the editor</li>
  <li>Type the code</li>
  <li>Save as index.html</li>
</ol>
~~~
Attributes of ${c("<ol>")}: ${c('type="A"')} (A, B, C), ${c('type="a"')}, ${c('type="I"')} (Roman numerals), ${c('start="5"')} to begin at 5, and ${c("reversed")}.

## Description list — terms and meanings
~~~
<dl>
  <dt>HTML</dt>
  <dd>The language that structures web pages.</dd>
  <dt>CSS</dt>
  <dd>The language that styles web pages.</dd>
</dl>
~~~

## Nested lists
A list can go inside an ${c("<li>")} to make sub-items:
~~~
<ul>
  <li>Hardware
    <ul><li>CPU</li><li>RAM</li></ul>
  </li>
</ul>
~~~

## Key points
Every item goes inside ${c("<li>")}, and every ${c("<li>")} must be inside a ${c("<ul>")} or ${c("<ol>")}.`,
        "Create My List Page: make a webpage with at least one ordered and one unordered list about a given topic. Fix and Organize the Lists: correct the wrong list tags in a provided HTML file and organize the items into proper ordered or unordered lists.",
        [
          "When should you use an ordered list instead of an unordered list?",
          "What tag holds each item of a list?",
          'What does type="I" do on an ordered list?',
        ],
      ),
      lesson(
        "HTML Tables",
        "Showing information in rows and columns.",
        `## Table tags
- ${c("<table>")} — the whole table
- ${c("<tr>")} — a table **row**
- ${c("<th>")} — a **header** cell (bold and centred)
- ${c("<td>")} — a **data** cell
- ${c("<caption>")} — the table's title

## Example: a class schedule
~~~
<table border="1">
  <caption>Class Schedule</caption>
  <tr>
    <th>Time</th>
    <th>Subject</th>
  </tr>
  <tr>
    <td>7:30</td>
    <td>Mathematics</td>
  </tr>
  <tr>
    <td>8:30</td>
    <td>TLE – Computer Programming</td>
  </tr>
</table>
~~~

## Merging cells
- ${c('colspan="2"')} — a cell stretches across two **columns**
- ${c('rowspan="2"')} — a cell stretches down two **rows**

## Grouping rows
${c("<thead>")}, ${c("<tbody>")} and ${c("<tfoot>")} group the header, body and footer rows, which helps when styling long tables.

## Key points
Build tables row by row: each ${c("<tr>")} holds the cells of one row. Use tables for data such as schedules, price lists and contact lists — not for page layout.`,
        "Build My First Table: create a webpage with a table that shows a class schedule, price list or contact list. Fix and Improve the Table: fix the table structure errors in a given HTML file and improve it by adding headings or organizing the data.",
        [
          "What is the difference between <th> and <td>?",
          "Which tag makes a new row?",
          "What does colspan do?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which attribute gives an image text for screen readers and broken images?",
        ["src", "alt", "href", "title"],
        1,
        "alt describes the image; it is read aloud by screen readers and shown if the image fails to load.",
      ),
      q(
        "Which attribute shows play and pause buttons on a video?",
        ["autoplay", "loop", "controls", "poster"],
        2,
        "controls adds the player buttons — play, pause, volume and the progress bar.",
      ),
      q(
        "Which list is best for the steps of a procedure?",
        [
          "Unordered list <ul>",
          "Ordered list <ol>",
          "Description list <dl>",
          "Table <table>",
        ],
        1,
        "Steps happen in order, so a numbered ordered list fits them best.",
      ),
      q(
        "In a table, which tag makes a row?",
        ["<td>", "<th>", "<tr>", "<row>"],
        2,
        "<tr> is a table row; the cells inside it are <th> or <td>.",
      ),
      q(
        "A heading cell should stretch across 3 columns. Which attribute is used?",
        ['rowspan="3"', 'colspan="3"', 'width="3"', 'span="3"'],
        1,
        "colspan merges a cell across columns; rowspan merges it down rows.",
      ),
    ],
  },
  // Week 5
  {
    title: "HTML Forms and Links",
    description:
      "Collecting user input with forms, and linking pages, images, buttons and email.",
    lessons: [
      lesson(
        "HTML Forms, Input Types and Elements",
        "Building forms that collect information from users.",
        `## The form element
A ${c("<form>")} collects information from users, like a registration or survey form:
~~~
<form action="submit.php" method="post">
  ...
</form>
~~~
- ${c("action")} — where the data is sent
- ${c("method")} — ${c("get")} (data shows in the address bar) or ${c("post")} (hidden; use for passwords)

## Common input types
~~~
<label for="name">Full name:</label>
<input type="text" id="name" name="fullname" required>

<input type="email" name="email" placeholder="you@example.com">
<input type="password" name="pw">
<input type="number" name="age" min="12" max="20">
<input type="date" name="birthday">
~~~

## Choices
~~~
<p>Grade level:</p>
<input type="radio" name="grade" value="9"> Grade 9
<input type="radio" name="grade" value="10"> Grade 10

<input type="checkbox" name="club" value="coding"> Coding Club
<input type="checkbox" name="club" value="arts"> Arts Club
~~~
- **Radio buttons** — choose only **one** (they share the same ${c("name")})
- **Checkboxes** — choose **any number**

## Other form elements
- ${c("<select>")} with ${c("<option>")} — a drop-down list
- ${c("<textarea>")} — several lines of text, such as a message
- ${c('<button type="submit">')} or ${c('<input type="submit">')} — sends the form

## Useful attributes
${c("required")} (must be filled in), ${c("placeholder")} (hint text), ${c("value")}, ${c("maxlength")}. A ${c("<label>")} tells users what each box is for.

## Key points
Choose the input type that fits the data — it checks the entry and shows the right keyboard on phones.`,
        "Create a Simple Online Form: build a form with text input, radio buttons, checkboxes and a submit button. Fix and Improve the Form: correct the wrong form tags or input types in a provided HTML file and improve the layout.",
        [
          "When should you use radio buttons instead of checkboxes?",
          "What does the required attribute do?",
          'Why use method="post" for a password?',
        ],
      ),
      lesson(
        "HTML Links",
        "Linking text, images, buttons and email addresses.",
        `## The anchor tag
Links use the ${c("<a>")} (anchor) tag with the ${c("href")} attribute:
~~~
<a href="https://www.deped.gov.ph">Visit DepEd</a>
<a href="about.html">About Us</a>
~~~
- **External link** — a full web address
- **Internal link** — another page in your own website (relative path)

## Opening in a new tab
~~~
<a href="https://www.w3schools.com" target="_blank">W3Schools</a>
~~~

## Image as a link
Put the ${c("<img>")} inside the ${c("<a>")}:
~~~
<a href="index.html"><img src="logo.png" alt="Home"></a>
~~~

## Email and phone links
~~~
<a href="mailto:registrar@school.edu.ph">Email the registrar</a>
<a href="tel:+639171234567">Call us</a>
~~~

## Button links
~~~
<a href="enroll.html"><button>Enroll now</button></a>
~~~

## Jumping within a page
Give an element an ${c("id")}, then link to it with ${c("#")}:
~~~
<a href="#contact">Go to Contact</a>
...
<h2 id="contact">Contact</h2>
~~~

## Key points
Link text should say where it goes ("Download the schedule", not "click here"). Test every link — a broken link usually has a misspelled file name or path.`,
        "Create a Linked Web Page: make a webpage where text, an image, a button and an email address all link to the right destinations. Fix and Enhance Links: fix broken or incorrect links in a provided HTML file so every link works.",
        [
          "Which attribute holds the destination of a link?",
          "How do you make a link open in a new tab?",
          "What does mailto: do?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which input lets the user choose only ONE option from a group?",
        ["Checkbox", "Radio button", "Textarea", "Password"],
        1,
        "Radio buttons with the same name allow only one choice; checkboxes allow many.",
      ),
      q(
        "Which element makes a drop-down list?",
        ["<select>", "<textarea>", "<list>", "<dropdown>"],
        0,
        "<select> holds <option> elements and shows them as a drop-down list.",
      ),
      q(
        "Which tag creates a hyperlink?",
        ["<link>", "<a>", "<href>", "<url>"],
        1,
        "<a> (anchor) makes a hyperlink; href holds where it goes.",
      ),
      q(
        "Which href opens the user's email program to write to an address?",
        [
          'href="email:info@school.ph"',
          'href="mailto:info@school.ph"',
          'href="send:info@school.ph"',
          'href="@info@school.ph"',
        ],
        1,
        "mailto: links open the email app with the address filled in.",
      ),
      q(
        'What does target="_blank" do on a link?',
        [
          "Opens the link in a new tab",
          "Makes the link invisible",
          "Removes the underline",
          "Blocks the link",
        ],
        0,
        'target="_blank" opens the destination in a new tab or window.',
      ),
    ],
  },
  // Week 6
  {
    title: "Developing a Website",
    description:
      "Planning and building a multi-page website with the HTML learned so far.",
    lessons: [
      lesson(
        "Planning and Building a Website",
        "From a plan to a working multi-page website.",
        `## Plan before you code
- **Purpose:** what is the website for? (a school club, a small business, a portfolio)
- **Audience:** who will use it?
- **Pages:** list them — for example Home, About, Gallery, Contact
- **Sitemap:** a diagram of the pages and how they link
- **Wireframe:** a quick sketch of each page's layout (header, menu, content, footer)

## Folder structure
~~~
my-website/
  index.html
  about.html
  contact.html
  images/
    logo.png
~~~
Keep every file in one folder so relative links work.

## A navigation menu on every page
~~~
<nav>
  <a href="index.html">Home</a> |
  <a href="about.html">About</a> |
  <a href="contact.html">Contact</a>
</nav>
~~~
Copy the same menu to every page so users can move between them.

## Building and testing
- Build one page at a time, starting with ${c("index.html")}.
- Use headings, paragraphs, images, lists, tables, forms and links where they fit.
- **Test:** open every page, click every link, check every image.
- **Review:** fix errors, improve formatting, and ask a classmate to try it.

## Key points
A good website is planned, consistent (same menu and look on every page), and tested.`,
        "Plan and Build Your Website: design and create a website of at least two pages with headings, paragraphs, images, lists and links. Review and Improve Your Website: check your website for errors, improve formatting, add multimedia or links, and make sure navigation works between pages.",
        [
          "What is a sitemap?",
          "Why should all the website's files be kept in one folder?",
          "What should you test before publishing a website?",
        ],
      ),
    ],
    quiz: [
      q(
        "A diagram of a website's pages and how they connect is called a…",
        ["sitemap", "browser", "source code", "domain"],
        0,
        "A sitemap shows all the pages and the links between them before building.",
      ),
      q(
        "What is the usual file name of a website's home page?",
        ["home.txt", "index.html", "main.doc", "start.css"],
        1,
        "Web servers open index.html automatically as the home page of a folder.",
      ),
      q(
        "Why is the same navigation menu placed on every page?",
        [
          "To make the files bigger",
          "So users can move between pages easily",
          "Because browsers require it",
          "To hide the content",
        ],
        1,
        "A consistent menu lets users reach any page from any page.",
      ),
      q(
        "A quick sketch of a page's layout before coding is a…",
        ["wireframe", "virus", "server", "table"],
        0,
        "A wireframe plans where the header, menu, content and footer go.",
      ),
      q(
        "Before publishing, you should…",
        [
          "delete the images folder",
          "test every page and link",
          "remove all headings",
          "rename index.html",
        ],
        1,
        "Testing every page, link and image catches errors before users see them.",
      ),
    ],
  },
  // Week 7
  {
    title: "Introduction to CSS",
    description:
      "CSS syntax, selectors and types; colours, backgrounds, fonts and text.",
    lessons: [
      lesson(
        "CSS Syntax, Selectors and Types",
        "How CSS styles HTML.",
        `## What is CSS?
**CSS (Cascading Style Sheets)** controls how HTML looks — colours, fonts, spacing and layout. HTML gives the **structure**; CSS gives the **style**.

## Syntax
~~~
h1 {
  color: navy;
  font-size: 32px;
}
~~~
- ${c("h1")} is the **selector** (what to style)
- Inside ${c("{ }")} are **declarations**: ${c("property: value;")}

## Selectors
- **Element selector** — ${c("p { }")} styles every paragraph
- **Class selector** — ${c(".note { }")} styles every element with ${c('class="note"')}; many elements can share a class
- **ID selector** — ${c("#header { }")} styles the one element with ${c('id="header"')}
- **Group selector** — ${c("h1, h2, h3 { }")} styles several at once
- **Descendant selector** — ${c("nav a { }")} styles links inside ${c("<nav>")}

## Three ways to add CSS
- **Inline** — in the tag: ${c('<p style="color: red;">')}
- **Internal** — in a ${c("<style>")} tag inside the ${c("<head>")}
- **External** — in a separate ${c(".css")} file, linked in the ${c("<head>")}:
~~~
<link rel="stylesheet" href="style.css">
~~~
An external style sheet can style **every page** of a website at once, so it is the best choice for real websites.

## The cascade
When rules conflict, the more specific one wins (inline beats ID, ID beats class, class beats element), and among equal rules the **last one** wins.

## Key points
Selector + property + value. Use classes for reusable styles and an external file for whole websites.`,
        "Style My Web Page: use a CSS file or inline styles to change the text colour, font and background with different CSS selectors. Fix and Organize CSS: fix the syntax errors in the provided HTML and CSS files, apply the correct selectors and improve the design.",
        [
          "In p { color: red; }, which part is the selector, property and value?",
          "What is the difference between a class and an ID selector?",
          "Why is an external style sheet best for a whole website?",
        ],
      ),
      lesson(
        "CSS Colors, Backgrounds, Fonts and Text",
        "Making a page attractive and readable.",
        `## Colours
Colours can be written as:
- **Names:** ${c("red")}, ${c("navy")}, ${c("white")}
- **Hex codes:** ${c("#ff0000")} (red), ${c("#000000")} (black), ${c("#ffffff")} (white)
- **RGB:** ${c("rgb(0, 128, 0)")} (green)
~~~
p { color: #333333; }
~~~

## Backgrounds
~~~
body {
  background-color: #f4f7fb;
  background-image: url("images/pattern.png");
  background-repeat: no-repeat;
  background-size: cover;
}
~~~

## Fonts
~~~
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}
h1 { font-weight: bold; font-style: italic; }
~~~
List backup fonts after the first; ${c("sans-serif")} or ${c("serif")} comes last as the general family.

## Text
- ${c("text-align")} — ${c("left")}, ${c("center")}, ${c("right")}, ${c("justify")}
- ${c("text-decoration")} — ${c("underline")}, ${c("none")} (removes the underline of links)
- ${c("text-transform")} — ${c("uppercase")}, ${c("lowercase")}, ${c("capitalize")}
- ${c("line-height")} — space between lines; ${c("letter-spacing")} — space between letters

## Readability
Use enough **contrast** (dark text on a light background), at most two or three fonts, and a comfortable size (about 16px for body text).

## Key points
Colour, background, font and text properties turn a plain page into a clear, attractive one.`,
        "Colorful Web Makeover: use CSS to change the page's background, text colour, font style and headings for an attractive design. Style Doctor Challenge: fix the incorrect CSS rules on a provided webpage and improve its text, background and fonts for readability.",
        [
          "Write the hex code for white.",
          "Which property centres text?",
          "Why list more than one font in font-family?",
        ],
      ),
    ],
    quiz: [
      q(
        "What does CSS stand for?",
        [
          "Creative Style System",
          "Cascading Style Sheets",
          "Computer Style Syntax",
          "Colorful Sheet Styles",
        ],
        1,
        "CSS is Cascading Style Sheets — the language that styles HTML.",
      ),
      q(
        'Which selector styles every element with class="note"?',
        ["#note", ".note", "note", "*note"],
        1,
        "A dot selects a class; a hash (#) selects an id.",
      ),
      q(
        "Which way of adding CSS can style every page of a website at once?",
        [
          "Inline style",
          "Internal <style> tag",
          "External .css file",
          "A <font> tag",
        ],
        2,
        "An external style sheet is linked from every page, so one file styles the whole site.",
      ),
      q(
        "Which property changes the colour of the text?",
        ["background-color", "color", "font-color", "text-color"],
        1,
        "color sets the text colour; background-color sets the colour behind it.",
      ),
      q(
        "Which declaration removes the underline from links?",
        [
          "text-decoration: none;",
          "text-align: none;",
          "font-style: none;",
          "underline: off;",
        ],
        0,
        "text-decoration: none; removes the underline that browsers add to links.",
      ),
    ],
  },
  // Week 8
  {
    title: "CSS Spacing, Links, Lists, Tables and Animation",
    description:
      "Borders, margins and padding; styling icons, links, lists and tables; animation and transitions.",
    lessons: [
      lesson(
        "CSS Borders, Margins and Padding",
        "Spacing and outlining elements.",
        `## Borders
~~~
.card {
  border: 2px solid #1f3a8a;
  border-radius: 10px;
}
~~~
${c("border")} is width, style (${c("solid")}, ${c("dashed")}, ${c("dotted")}, ${c("double")}) and colour. ${c("border-radius")} rounds the corners.

## Padding — space inside
**Padding** is the space between the content and its border:
~~~
.card { padding: 20px; }
~~~

## Margin — space outside
**Margin** is the space outside the border, separating the element from others:
~~~
.card { margin: 16px; }
.center { margin: 0 auto; width: 600px; }
~~~
${c("margin: 0 auto")} centres a block that has a set width.

## Shorthand
- One value: all four sides — ${c("padding: 10px;")}
- Two values: top/bottom, then left/right — ${c("margin: 10px 20px;")}
- Four values go **clockwise**: top, right, bottom, left — ${c("padding: 5px 10px 15px 20px;")}
- One side only: ${c("margin-top")}, ${c("padding-left")}, ${c("border-bottom")}

## Key points
Padding is inside the border, margin is outside it. Consistent spacing makes a page look neat and organised.`,
        "Box It Up!: add borders, adjust margins and apply padding to the boxes or sections of your webpage for a neat layout. Spacing Master Challenge: fix incorrect border, margin or padding rules on a provided webpage and improve its spacing.",
        [
          "What is the difference between padding and margin?",
          "In padding: 5px 10px 15px 20px, which value is the left side?",
          "What does border-radius do?",
        ],
      ),
      lesson(
        "Styling Icons, Links, Lists and Tables",
        "Making navigation, lists and tables look polished.",
        `## Link states
~~~
a { color: #2563eb; text-decoration: none; }
a:hover { color: #1e3a8a; text-decoration: underline; }
a:visited { color: #6d28d9; }
~~~
${c(":hover")} applies while the mouse is over the link — a simple way to show it is clickable. Write the states in the order **link, visited, hover, active**.

## Icons
Icons can be emoji, small images, or an **icon font** such as Font Awesome, added with a ${c("<link>")} in the head and used like ${c('<i class="fa fa-home"></i>')}. Style them with ${c("font-size")} and ${c("color")} like text.

## Lists
~~~
ul { list-style-type: square; }
ol { list-style-type: upper-roman; }
nav ul { list-style: none; padding: 0; }
nav li { display: inline; margin-right: 12px; }
~~~
Removing the bullets and showing items inline turns a list into a **navigation menu**.

## Tables
~~~
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ccc; padding: 8px; }
th { background-color: #1f3a8a; color: white; }
tr:nth-child(even) { background-color: #f2f2f2; }
~~~
${c("border-collapse: collapse")} merges double borders into one; ${c("nth-child(even)")} gives striped rows that are easier to read.

## Key points
Hover effects, clean menus and striped tables make a page easier and more pleasant to use.`,
        "Link & Icon Adventure: add icons and links to a webpage and style them with colours, hover effects or size changes. Stylish Lists & Tables: style the lists and tables of a provided webpage with CSS borders, spacing, colours and fonts.",
        [
          "When does the :hover style apply?",
          "How do you remove the bullets from a list?",
          "What does border-collapse: collapse do?",
        ],
      ),
      lesson(
        "CSS Animation and Transition",
        "Adding smooth movement and effects.",
        `## Transitions — smooth changes
A **transition** makes a change happen gradually instead of instantly, usually on hover:
~~~
.btn {
  background-color: #2563eb;
  transition: background-color 0.3s ease;
}
.btn:hover {
  background-color: #1e3a8a;
}
~~~
Write the **property**, the **duration**, and optionally the **timing** (${c("ease")}, ${c("linear")}, ${c("ease-in-out")}).

## Animations — movement on their own
An **animation** runs by itself using ${c("@keyframes")}:
~~~
@keyframes bounce {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}
.logo {
  animation: bounce 2s infinite;
}
~~~
- ${c("animation-name")} and ${c("animation-duration")} are required
- ${c("animation-iteration-count")}: a number or ${c("infinite")}
- ${c("animation-delay")}: wait before starting

## Transition vs animation
- **Transition:** needs a trigger such as hover; goes from one state to another
- **Animation:** can start on its own, repeat, and have many steps (keyframes)

## Key points
Use motion to guide attention, not to distract — keep effects short and smooth.`,
        "Animate Your Page!: add CSS animations to text, images or buttons to create movement on your webpage. Smooth Transition Challenge: apply CSS transitions to the buttons, links or images of a provided webpage and test the hover effects.",
        [
          "What is the difference between a transition and an animation?",
          "What does @keyframes define?",
          "Write a transition that changes the background colour in 0.5 seconds.",
        ],
      ),
    ],
    quiz: [
      q(
        "Which property adds space INSIDE an element, between its content and border?",
        ["margin", "padding", "border", "spacing"],
        1,
        "Padding is inside the border; margin is the space outside it.",
      ),
      q(
        "In margin: 10px 20px 30px 40px; what is the LEFT margin?",
        ["10px", "20px", "30px", "40px"],
        3,
        "Four values go clockwise from the top: top 10px, right 20px, bottom 30px, left 40px.",
      ),
      q(
        "Which selector styles a link while the mouse is over it?",
        ["a:visited", "a:hover", "a:link", "a:over"],
        1,
        ":hover applies while the pointer is over the element.",
      ),
      q(
        "Which rule removes the bullets from a list?",
        [
          "list-style: none;",
          "bullets: off;",
          "text-decoration: none;",
          "display: none;",
        ],
        0,
        "list-style: none; removes the markers; display: none would hide the whole list.",
      ),
      q(
        "Which CSS feature defines the steps of an animation?",
        ["@keyframes", "@media", "transition", ":hover"],
        0,
        "@keyframes lists what the element looks like at each point (0%, 50%, 100%) of the animation.",
      ),
    ],
  },
  // Week 9
  {
    title: "CSS Box Model, Box Shadow and Transform",
    description:
      "The CSS box model, shadows, and moving, scaling and rotating elements.",
    lessons: [
      lesson(
        "The CSS Box Model",
        "How the browser sizes and spaces every element.",
        `## Every element is a box
The **box model** describes four layers around every element, from inside to outside:
- **Content** — the text or image
- **Padding** — space around the content
- **Border** — the line around the padding
- **Margin** — space outside the border, between boxes

## Computing the size
By default, ${c("width")} sets only the **content**:
~~~
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}
~~~
Total width on the page = 300 + 20 + 20 + 5 + 5 = **350px** (plus 10px margin on each side).

## box-sizing
~~~
* { box-sizing: border-box; }
~~~
With ${c("border-box")}, the width **includes** padding and border, so a 300px box stays 300px. Most designers use this rule.

## Block and inline
- **Block** elements (${c("<div>")}, ${c("<p>")}, ${c("<h1>")}) start on a new line and take the full width
- **Inline** elements (${c("<a>")}, ${c("<span>")}, ${c("<b>")}) stay in the line of text
- ${c("display: inline-block")} sits in a line but can have a width and height

## Inspecting boxes
Right-click → **Inspect** in the browser shows each element's content, padding, border and margin.

## Key points
Content → padding → border → margin. Understanding the box model is the key to controlling layout.`,
        "Box Model Makeover: adjust the margins, borders and padding of the boxes or sections of a webpage for a well-structured, balanced layout. Perfectly Padded Page: inspect the boxes of a provided webpage and change their box-model properties to improve spacing and alignment.",
        [
          "Name the four parts of the box model from inside to outside.",
          "A box is 200px wide with 10px padding and a 2px border. What is its total width?",
          "What does box-sizing: border-box change?",
        ],
      ),
      lesson(
        "CSS Box Shadow and Transform",
        "Adding depth and moving, scaling or rotating elements.",
        `## box-shadow
~~~
.card {
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
}
~~~
The values are: **horizontal offset**, **vertical offset**, **blur**, (optional **spread**), and **colour**.
- A soft, light shadow makes cards look raised
- ${c("inset")} puts the shadow inside the box
- Text has its own: ${c("text-shadow: 2px 2px 4px gray;")}

## transform
${c("transform")} changes an element's shape or position without moving the elements around it:
- ${c("translate(20px, 10px)")} — moves it right and down
- ${c("scale(1.2)")} — makes it 20% bigger
- ${c("rotate(45deg)")} — turns it 45 degrees
- ${c("skew(10deg)")} — slants it

## Together with transition
~~~
.photo { transition: transform 0.3s; }
.photo:hover { transform: scale(1.1) rotate(3deg); }
~~~
The photo grows and tilts smoothly when the mouse is over it.

## Key points
Shadows add depth; transforms move, resize and rotate. Combined with transitions they make a page feel interactive.`,
        "Shadow Play: add box-shadow to images, buttons or divs to create depth on your webpage. Transform It: apply scale, rotate or translate to selected elements of a provided webpage and test the effects.",
        [
          "What do the first two values of box-shadow set?",
          "Which transform function makes an element bigger?",
          "Write a hover rule that rotates an image 10 degrees.",
        ],
      ),
    ],
    quiz: [
      q(
        "What is the correct order of the box model from inside to outside?",
        [
          "Margin, border, padding, content",
          "Content, padding, border, margin",
          "Content, margin, border, padding",
          "Padding, content, margin, border",
        ],
        1,
        "Content is innermost, then padding, then the border, then the margin outside.",
      ),
      q(
        "A box has width: 200px, padding: 10px and border: 2px (default box-sizing). What is its total width?",
        ["200px", "212px", "224px", "220px"],
        2,
        "200 + 10 + 10 (padding both sides) + 2 + 2 (border both sides) = 224px.",
      ),
      q(
        "What does box-sizing: border-box do?",
        [
          "Removes the border",
          "Includes padding and border in the width",
          "Adds a shadow",
          "Hides the box",
        ],
        1,
        "With border-box, the width you set already includes padding and border.",
      ),
      q(
        "Which transform makes an element 50% larger?",
        ["rotate(1.5)", "translate(1.5)", "scale(1.5)", "skew(1.5)"],
        2,
        "scale(1.5) multiplies the element's size by 1.5.",
      ),
      q(
        "In box-shadow: 5px 5px 10px gray; what does 10px set?",
        ["The blur", "The border width", "The margin", "The font size"],
        0,
        "After the horizontal and vertical offsets comes the blur radius.",
      ),
    ],
  },
  // Week 10
  {
    title: "Creating an Interactive Website",
    description:
      "Bringing HTML and CSS together into an interactive website, with the performance tasks.",
    lessons: [
      lesson(
        "Creating an Interactive Website",
        "Making a website respond to its users.",
        `## What makes a website interactive?
An **interactive** website responds when users do something — click, hover, type or submit.
- **Links and navigation** that move between pages and sections
- **Buttons** with hover and click effects
- **Forms** that collect information
- **Multimedia** users can play
- **Hover effects, transitions and animations** that give feedback

## Interactive elements with HTML and CSS
~~~
.btn {
  padding: 10px 18px;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  transition: transform 0.2s, background 0.2s;
}
.btn:hover { background: #1e3a8a; transform: scale(1.05); }
.btn:active { transform: scale(0.97); }
input:focus { outline: 3px solid #93c5fd; }
~~~
- ${c(":hover")} — when the pointer is over it
- ${c(":active")} — while it is being clicked
- ${c(":focus")} — when a form box is selected

## Good user experience (UX)
- Make clickable things **look** clickable
- Give **feedback** for every action
- Keep the design **consistent** across pages
- Make it **readable** on phones as well as computers
- Make it **accessible**: alt text, labels on form boxes, good contrast

## Next steps
**JavaScript** adds real logic — calculators, quizzes, games. It is the next language to learn after HTML and CSS.

## Performance tasks
- **Individual — My Dream Interactive Webpage:** design and build a multi-section webpage with headings, paragraphs, lists, tables, forms, links, multimedia, CSS styling, animations and interactive elements; submit your HTML and CSS files.
- **Group — Team Web Wizards:** in groups of 3–4, plan and build a fully styled, interactive multi-section website using everything learned, then present it to the class.

## Key points
Interactivity is feedback: every hover, click and entry should show the user that the website responded.`,
        "My Interactive World: build a webpage where users can click buttons, fill in forms or interact with images and see visible changes. Interactive Website Makeover: improve your existing webpage with hover effects, clickable images, forms or styled buttons.",
        [
          "Give three features that make a website interactive.",
          "What is the difference between :hover and :focus?",
          "What will you include in your Dream Interactive Webpage?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which makes a website interactive?",
        [
          "Only plain text",
          "Buttons, forms and hover effects that respond to the user",
          "A very long page",
          "Using only black and white",
        ],
        1,
        "Interactive websites respond to what users do — clicking, hovering, typing and submitting.",
      ),
      q(
        "Which selector styles a button while it is being clicked?",
        [":hover", ":active", ":visited", ":first"],
        1,
        ":active applies during the click itself.",
      ),
      q(
        "Which selector styles a text box when the user clicks into it?",
        [":focus", ":hover", ":link", ":empty"],
        0,
        ":focus applies to the form field that is currently selected for typing.",
      ),
      q(
        "Which practice makes a website more accessible?",
        [
          "Removing alt text",
          "Using labels on form boxes",
          "Light grey text on white",
          "Very tiny fonts",
        ],
        1,
        "Labels tell all users — including screen-reader users — what each form box is for.",
      ),
      q(
        "Which language is usually learned after HTML and CSS to add logic to a website?",
        ["JavaScript", "Markdown", "PDF", "Excel"],
        0,
        "JavaScript runs in the browser and adds logic such as calculations, quizzes and games.",
      ),
    ],
  },
];

/** TLE 9 or TLE 10 – ICT: Computer Programming. */
export const computerProgramming = (grade: 9 | 10): DemoSubject => ({
  key: `TLE${grade}-CP`,
  code: `TLE ${grade}-CP`,
  name: `TLE ${grade} – ICT: Computer Programming`,
  department: TLE_DEPARTMENT,
  description:
    "Developing websites with HTML and CSS in a safe and responsible manner (DepEd Budget of Work, Grade 9 or 10).",
  colorToken: "blue",
  units: UNITS.map((unit, i) => ({ ...unit, bank: PROGRAMMING_BANK[i] })),
});
