/**
 * Bug Hunt, a Computer Programming game: each level is a short page of
 * HTML/CSS with three bugs. The student taps the line with a bug, then picks
 * the fix from three choices; a live preview shows the page as it gets
 * fixed. One level per unit of the course.
 *
 * Scoring lives here so the server can score a level from the taps alone.
 */

export type Bug = {
  /** The buggy line's index in `code`. */
  line: number;
  /** The correct line first, then two wrong fixes (shuffled on screen). */
  fixes: [string, string, string];
  /** Shown once fixed: what was wrong. */
  why: string;
};

export type BugLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  story: string;
  code: string[];
  bugs: Bug[];
};

const bug = (
  line: number,
  fixes: [string, string, string],
  why: string,
): Bug => ({ line, fixes, why });

export const BUG_LEVELS: BugLevel[] = [
  {
    id: "bug-1",
    unit: 1,
    unitTitle: "Boot Camp",
    title: "My First Page",
    story: "Momo typed his first web page in a hurry. Three tags are broken.",
    code: [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      "  <titel>My First Page</titel>",
      "</head>",
      "<body>",
      "  <h1>Hello, Momo!<h1>",
      "  <p>I am learning HTML.</p>",
      "  <p>Sit up straight and rest your eyes every 20 minutes!</p>",
      "<body>",
      "</html>",
    ],
    bugs: [
      bug(
        3,
        [
          "  <title>My First Page</title>",
          "  <tittle>My First Page</tittle>",
          "  <title>My First Page<title>",
        ],
        "The tag is spelled title, and its closing tag needs a slash.",
      ),
      bug(
        6,
        [
          "  <h1>Hello, Momo!</h1>",
          "  </h1>Hello, Momo!<h1>",
          "  <h1>Hello, Momo!</h2>",
        ],
        "A closing tag has a slash and the same name as its opening tag.",
      ),
      bug(
        9,
        ["</body>", "<body/>", "<end body>"],
        "The body is closed with </body>, not opened a second time.",
      ),
    ],
  },
  {
    id: "bug-2",
    unit: 2,
    unitTitle: "Page Skeleton",
    title: "Fix the Skeleton",
    story: "The Coding Club page has a crooked skeleton. Straighten it out.",
    code: [
      "<!DOCTYPE html>",
      '<html lang="en">',
      "<head>",
      '  <meta charset="UTF-8">',
      "  <title>Coding Club</title>",
      "<head>",
      "<body>",
      "  <h1>Coding Club</h1>",
      "  <!- Meetings every Friday ->",
      "  <p>Join us after class in Room 204.</p>",
      "</body>",
      "<html>",
    ],
    bugs: [
      bug(
        5,
        ["</head>", "<head/>", "</header>"],
        "The head section ends with </head>; <header> is a different tag.",
      ),
      bug(
        8,
        [
          "  <!-- Meetings every Friday -->",
          "  // Meetings every Friday",
          "  <comment>Meetings every Friday</comment>",
        ],
        "HTML comments start with <!-- and end with -->. A broken comment can hide the wrong part of the page or show up as text.",
      ),
      bug(
        11,
        ["</html>", "<html/>", "</htm>"],
        "The last line closes the whole page with </html>.",
      ),
    ],
  },
  {
    id: "bug-3",
    unit: 3,
    unitTitle: "Text Wizard",
    title: "Format the News",
    story:
      "The Campus News page is formatted wrong. Find the three formatting bugs.",
    code: [
      "<h1>Campus News</h1>",
      "<h3>Sports</h3>",
      "<p>Our team won <b>first place</b>!</p>",
      "<p>Water is H<sup>2</sup>O.</p>",
      "<p>Read the <i>rules</i> carefully.</p>",
      '<p style="color red;">Exams start on Monday.</p>',
      "<p><b><i>Very important</b></i></p>",
    ],
    bugs: [
      bug(
        3,
        [
          "<p>Water is H<sub>2</sub>O.</p>",
          "<p>Water is H<sup>2</sub>O.</p>",
          "<p>Water is H<small>2</small>O.</p>",
        ],
        "<sub> drops text below the line (H₂O); <sup> lifts it up, like x².",
      ),
      bug(
        5,
        [
          '<p style="color: red;">Exams start on Monday.</p>',
          '<p style="color=red;">Exams start on Monday.</p>',
          '<p color="red">Exams start on Monday.</p>',
        ],
        "A style is written property: value; with a colon between them.",
      ),
      bug(
        6,
        [
          "<p><b><i>Very important</i></b></p>",
          "<p><b><i>Very important</b></i></b></p>",
          "<p><b>Very important</i></p>",
        ],
        "Tags close in reverse order: the last one opened is the first one closed.",
      ),
    ],
  },
  {
    id: "bug-4",
    unit: 4,
    unitTitle: "Lists & Tables",
    title: "Table Trouble",
    story: "The canteen's snack menu and price table are a mess.",
    code: [
      "<h2>Snack Menu</h2>",
      "<ul>",
      "  <li>Banana cue</li>",
      "  <li>Turon</li>",
      "  <il>Kwek-kwek</il>",
      "</ol>",
      '<table border="1">',
      "  <tr>",
      "    <th>Item</th><th>Price</th>",
      "  </tr>",
      "  <tr>",
      "    <tr>Turon</tr><tr>₱15</tr>",
      "  </tr>",
      "</table>",
    ],
    bugs: [
      bug(
        4,
        [
          "  <li>Kwek-kwek</li>",
          "  <li>Kwek-kwek</il>",
          "  <item>Kwek-kwek</item>",
        ],
        "Each list item is an <li> (list item), opened and closed the same way.",
      ),
      bug(
        5,
        ["</ul>", "</li>", "<ul>"],
        "The list opened with <ul>, so it must close with </ul>, not </ol>.",
      ),
      bug(
        11,
        [
          "    <td>Turon</td><td>₱15</td>",
          "    <th>Turon<th>₱15",
          "    <tc>Turon</tc><tc>₱15</tc>",
        ],
        "Inside a row (<tr>), each data cell is a <td>.",
      ),
    ],
  },
  {
    id: "bug-5",
    unit: 5,
    unitTitle: "Links & Forms",
    title: "Broken Sign-Up",
    story: "Nobody can sign up for the club. Fix the link and the form.",
    code: [
      "<h2>Sign Up</h2>",
      '<a src="rules.html">Read the club rules</a>',
      '<form action="/join">',
      '  <label for="name">Name</label>',
      '  <input type="text" id="name">',
      '  <label for="pass">Password</label>',
      '  <input type="text" id="pass">',
      '  <input type="checkbox" id="ok"> I agree',
      '  <button type="submit">Join</button>',
      "<form>",
    ],
    bugs: [
      bug(
        1,
        [
          '<a href="rules.html">Read the club rules</a>',
          '<a link="rules.html">Read the club rules</a>',
          '<link href="rules.html">Read the club rules</link>',
        ],
        "A link's address goes in href. src is for images and media.",
      ),
      bug(
        6,
        [
          '  <input type="password" id="pass">',
          '  <input type="hidden" id="pass">',
          '  <input type="secret" id="pass">',
        ],
        'type="password" hides what you type as dots. A text box would show the password.',
      ),
      bug(
        9,
        ["</form>", "<form/>", "</submit>"],
        "The form is closed with </form>.",
      ),
    ],
  },
  {
    id: "bug-6",
    unit: 6,
    unitTitle: "Website Builder",
    title: "Bakery Website Wreck",
    story: "Momo Bakery's website went live with three bugs.",
    code: [
      "<header>",
      "  <h1>Momo Bakery</h1>",
      "  <nav>",
      '    <a href="#menu">Menu</a> |',
      '    <a href="contact">Contact</a>',
      "  </nav>",
      "</header>",
      '<section id="menu">',
      "  <h2>Menu</h2>",
      '  <img src="pandesal.jpg">',
      "</section>",
      '<section id="contact">',
      "  <h2>Contact</h2>",
      "  <p>Call 0917 123 4567</p>",
      "</section>",
      "<footer>© 2026 Momo Bakery<footer>",
    ],
    bugs: [
      bug(
        4,
        [
          '    <a href="#contact">Contact</a>',
          '    <a href="contact.id">Contact</a>',
          '    <a name="contact">Contact</a>',
        ],
        'To jump to a part of the same page, put # before its id: href="#contact".',
      ),
      bug(
        9,
        [
          '  <img src="pandesal.jpg" alt="Fresh pandesal">',
          '  <img src="pandesal.jpg" title>',
          '  <img alt="pandesal.jpg">',
        ],
        "Every image needs alt text. Screen readers read it, and it shows when the picture can't load.",
      ),
      bug(
        15,
        [
          "<footer>© 2026 Momo Bakery</footer>",
          "</footer>© 2026 Momo Bakery<footer>",
          "<footer>© 2026 Momo Bakery</foot>",
        ],
        "The footer closes with </footer>, like every other tag.",
      ),
    ],
  },
  {
    id: "bug-7",
    unit: 7,
    unitTitle: "CSS Academy",
    title: "Style Sheet Slip-ups",
    story: "The Daily Notes page ignores some of its styles. Find out why.",
    code: [
      "<style>",
      "  h1 {",
      "    color: navy",
      "    font-size: 32px;",
      "  }",
      "  .note {",
      "    background-color: #fff3b0;",
      "  }",
      "  #title {",
      "    text-align: middle;",
      "  }",
      "  p {",
      "    font-family: Arial, sans-serif;",
      "    color = gray;",
      "  }",
      "</style>",
      '<h1 id="title">Daily Notes</h1>',
      '<p class="note">Bring your school ID tomorrow.</p>',
    ],
    bugs: [
      bug(
        2,
        ["    color: navy;", "    color navy;", "    color: navy:"],
        "Every CSS declaration ends with a semicolon. Without it, the next line breaks too.",
      ),
      bug(
        9,
        [
          "    text-align: center;",
          "    text-align: centre;",
          "    align: center;",
        ],
        "text-align takes left, right, center or justify. There is no middle.",
      ),
      bug(
        13,
        ["    color: gray;", "    color == gray;", "    colour: gray;"],
        "CSS uses a colon, never an equals sign, between a property and its value.",
      ),
    ],
  },
  {
    id: "bug-8",
    unit: 8,
    unitTitle: "Style Master",
    title: "Selector Mix-up",
    story:
      "The Enroll button and the menu don't look right. Check the selectors.",
    code: [
      "<style>",
      "  .btn {",
      "    background: #2a78d6;",
      "    color: white;",
      "    padding: 8px 16px;",
      "  }",
      "  btn:hover {",
      "    background: #1b5fae;",
      "  }",
      "  #menu li {",
      "    list-style: none;",
      "  }",
      "  a {",
      "    text-decoration: no-underline;",
      "  }",
      "  .box { width: 200 }",
      "</style>",
      '<a class="btn" href="#">Enroll</a>',
      '<ul id="menu"><li>Home</li><li>About</li></ul>',
      '<div class="box" style="background:#e8f1fc">Box</div>',
    ],
    bugs: [
      bug(
        6,
        ["  .btn:hover {", "  #btn:hover {", "  .btn hover {"],
        "A class selector starts with a dot: .btn:hover. Without it, CSS looks for a <btn> tag.",
      ),
      bug(
        13,
        [
          "    text-decoration: none;",
          "    text-decoration: hidden;",
          "    underline: none;",
        ],
        "To remove a link's underline, use text-decoration: none.",
      ),
      bug(
        15,
        [
          "  .box { width: 200px; }",
          "  .box { width: 200 pixels; }",
          "  .box { width = 200px; }",
        ],
        "Lengths need a unit like px, %, or em. A bare 200 is ignored.",
      ),
    ],
  },
  {
    id: "bug-9",
    unit: 9,
    unitTitle: "Box Lab",
    title: "Box Model Blunders",
    story: "The student ID card is missing its border, tilt and spacing.",
    code: [
      "<style>",
      "  .card {",
      "    width: 220px;",
      "    padding: 16px;",
      "    border: 2px #2a78d6;",
      "    margin: 12px auto;",
      "    border-radius: 12px;",
      "  }",
      "  .badge {",
      "    display: inline-block;",
      "    background: gold;",
      "    transform: rotate(10);",
      "  }",
      "  .name {",
      "    padding: 10px 20px 10px 20px 5px;",
      "  }",
      "</style>",
      '<div class="card">',
      '  <span class="badge">NEW</span>',
      '  <p class="name">Momo — Grade 10</p>',
      "</div>",
    ],
    bugs: [
      bug(
        4,
        [
          "    border: 2px solid #2a78d6;",
          "    border: 2px line #2a78d6;",
          "    border-width: #2a78d6;",
        ],
        "A border needs a style (solid, dashed, dotted), or it doesn't show.",
      ),
      bug(
        11,
        [
          "    transform: rotate(10deg);",
          "    transform: rotate 10deg;",
          "    rotate: transform(10);",
        ],
        "Angles need a unit: rotate(10deg).",
      ),
      bug(
        14,
        [
          "    padding: 10px 20px;",
          "    padding: 10px, 20px;",
          "    padding: 10-20px;",
        ],
        "padding takes 1 to 4 values (top, right, bottom, left), separated by spaces.",
      ),
    ],
  },
  {
    id: "bug-10",
    unit: 10,
    unitTitle: "Final Quest",
    title: "Interactive Glitch",
    story: "The Menu button doesn't open the menu. Debug the interactive page.",
    code: [
      "<style>",
      "  .menu { display: none; }",
      "  .menu.open { display: block; animation: pop 0.3; }",
      "  @keyframes pop {",
      "    from { transform: scale(0.8); }",
      "    to { transform: scale(1); }",
      "  }",
      "</style>",
      '<button onclick="toggle()">Menu</button>',
      '<ul class="menu" id="menu"><li>Home</li><li>Games</li></ul>',
      "<script>",
      "  function toggle() {",
      '    document.getElementByID("menu").classList.toggle("open");',
      "  }",
      "<script>",
    ],
    bugs: [
      bug(
        2,
        [
          "  .menu.open { display: block; animation: pop 0.3s; }",
          "  .menu.open { display: block; animation: 0.3 pop; }",
          "  .menu.open { display: block; animate: pop 0.3s; }",
        ],
        "An animation's time needs a unit: 0.3s (seconds) or 300ms.",
      ),
      bug(
        12,
        [
          '    document.getElementById("menu").classList.toggle("open");',
          '    document.getElementById(#menu).classList.toggle("open");',
          '    document.getElement("menu").classList.toggle("open");',
        ],
        "JavaScript is case-sensitive: it's getElementById, with a small d.",
      ),
      bug(
        14,
        ["</script>", "<script/>", "</js>"],
        "The script block closes with </script>.",
      ),
    ],
  },
];

/** Stars from mistakes (wrong lines tapped plus wrong fixes picked). */
export function bugStars(mistakes: number) {
  return mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
}

/**
 * Scores a finished level from every line tapped and, per bug, the fixes
 * picked (index into `fixes`, 0 = correct). Null when a bug wasn't fixed.
 */
export function scoreBugs(level: BugLevel, taps: number[], picks: number[][]) {
  const bugLines = new Set(level.bugs.map((b) => b.line));
  const fixed = level.bugs.every(
    (b, i) => taps.includes(b.line) && picks[i]?.at(-1) === 0,
  );
  if (!fixed || picks.length !== level.bugs.length) return null;
  const wrongTaps = taps.filter((t) => !bugLines.has(t)).length;
  const wrongFixes = picks.reduce(
    (sum, p) => sum + p.filter((x) => x !== 0).length,
    0,
  );
  const mistakes = wrongTaps + wrongFixes;
  return { mistakes, stars: bugStars(mistakes) };
}
