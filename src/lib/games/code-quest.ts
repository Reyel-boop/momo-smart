/**
 * Code Quest, the Computer Programming game: one short HTML/CSS challenge
 * per level, three levels per unit of the course. The student types code,
 * sees it run in a live preview, and the level's checks read the preview's
 * page to decide whether the goal is met.
 *
 * Checks run in the browser against the rendered page, so this file holds
 * only plain data and small functions; the server imports it for level ids
 * and order.
 */

export type CodeCheckContext = {
  /** The preview's rendered page. */
  doc: Document;
  /** The preview's window, for computed styles. */
  win: Window;
  /** The student's code exactly as typed. */
  code: string;
};

export type CodeCheck = {
  label: string;
  test: (c: CodeCheckContext) => boolean;
};

export type CodeLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  /** One or two sentences that set the scene. */
  story: string;
  goal: string;
  starter: string;
  hint: string;
  solution: string;
  checks: CodeCheck[];
};

// ---- Helpers the checks share ----------------------------------------------

const all = (c: CodeCheckContext, selector: string) =>
  Array.from(c.doc.querySelectorAll(selector));
const one = (c: CodeCheckContext, selector: string) =>
  c.doc.querySelector(selector);
const text = (el: Element | null) =>
  (el?.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase();
const style = (c: CodeCheckContext, el: Element | null, prop: string) =>
  el ? c.win.getComputedStyle(el).getPropertyValue(prop) : "";
const px = (value: string) => parseFloat(value) || 0;
const words = (el: Element | null) => text(el).split(" ").filter(Boolean);
/** The code without comments, lower-case, for "did they write X" checks. */
const source = (c: CodeCheckContext) =>
  c.code.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

function rgb(value: string): [number, number, number, number] | null {
  const m = /rgba?\(([^)]+)\)/.exec(value);
  if (!m) return null;
  const [r = 0, g = 0, b = 0, a = 1] = m[1]!
    .split(/[ ,/]+/)
    .filter(Boolean)
    .map(Number);
  return [r, g, b, a];
}

type Hue = "red" | "blue" | "green" | "yellow" | "any";
/** Whether a computed color is roughly the named color (any shade). */
function isColor(value: string, hue: Hue) {
  const c = rgb(value);
  if (!c || c[3] === 0) return false;
  const [r, g, b] = c;
  switch (hue) {
    case "red":
      return r >= 150 && g < 110 && b < 110;
    case "blue":
      return b >= 120 && r < 110 && b > g;
    case "green":
      return g >= 100 && r < 110 && b < 110;
    case "yellow":
      return r >= 180 && g >= 160 && b < 150;
    case "any":
      return true;
  }
}

// ---- Levels -----------------------------------------------------------------

export const CODE_LEVELS: CodeLevel[] = [
  // Unit 1: Careers and Computer Ergonomics
  {
    id: "cp-1-1",
    unit: 1,
    unitTitle: "Boot Camp",
    title: "Hello, World!",
    story:
      "Every programmer's first program says hello. Your first mission is the same.",
    goal: "Make a heading <h1> that says Hello, World!",
    starter: "<!-- Type your heading between the tags -->\n<h1></h1>\n",
    hint: "Put the words between the opening <h1> and the closing </h1>.",
    solution: "<h1>Hello, World!</h1>\n",
    checks: [
      { label: "There is an <h1> heading", test: (c) => !!one(c, "h1") },
      {
        label: "The heading says Hello, World!",
        test: (c) => /hello,? world/.test(text(one(c, "h1"))),
      },
    ],
  },
  {
    id: "cp-1-2",
    unit: 1,
    unitTitle: "Boot Camp",
    title: "Dream Job",
    story: "A recruiter wants to know which programming job you want someday.",
    goal: "Write an <h1> with a programming job title (for example Web Developer), then a <p> of at least 6 words about what that job does.",
    starter: "<h1>Web Developer</h1>\n<p></p>\n",
    hint: "Write a sentence inside <p> … </p>, such as: A web developer builds websites for people.",
    solution:
      "<h1>Web Developer</h1>\n<p>A web developer builds and fixes websites for clients.</p>\n",
    checks: [
      {
        label: "There is an <h1> job title",
        test: (c) => !!text(one(c, "h1")),
      },
      { label: "There is a <p> paragraph", test: (c) => !!one(c, "p") },
      {
        label: "The paragraph has at least 6 words",
        test: (c) => words(one(c, "p")).length >= 6,
      },
    ],
  },
  {
    id: "cp-1-3",
    unit: 1,
    unitTitle: "Boot Camp",
    title: "Safe Seat Poster",
    story:
      "The computer lab needs a poster about ergonomics so nobody gets back pain.",
    goal: "Make an <h2> that contains the word Ergonomics, then at least 3 <p> tips.",
    starter: "<h2>Ergonomics Tips</h2>\n<p>Sit up straight.</p>\n",
    hint: "Add two more lines like <p>Keep your feet flat on the floor.</p>",
    solution:
      "<h2>Ergonomics Tips</h2>\n<p>Sit up straight.</p>\n<p>Keep your feet flat on the floor.</p>\n<p>Rest your eyes every 20 minutes.</p>\n",
    checks: [
      {
        label: "An <h2> mentions Ergonomics",
        test: (c) => all(c, "h2").some((h) => text(h).includes("ergonomic")),
      },
      { label: "At least 3 <p> tips", test: (c) => all(c, "p").length >= 3 },
    ],
  },

  // Unit 2: HTML Structure and HTML Editors
  {
    id: "cp-2-1",
    unit: 2,
    unitTitle: "Page Skeleton",
    title: "Build the Skeleton",
    story: "Every web page has the same bones. Build them from scratch.",
    goal: "Write <!DOCTYPE html>, then <html> with a <head> and a <body>. Put an <h1> in the body.",
    starter: "<!DOCTYPE html>\n<html>\n\n</html>\n",
    hint: "Inside <html> put <head></head> first, then <body> … </body> with your <h1> inside the body.",
    solution:
      "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>My Page</h1>\n  </body>\n</html>\n",
    checks: [
      {
        label: "Starts with <!DOCTYPE html>",
        test: (c) => /^\s*<!doctype html>/i.test(source(c)),
      },
      {
        label: "Has <html>, <head> and <body> tags",
        test: (c) =>
          /<html[\s>]/i.test(source(c)) &&
          /<head[\s>]/i.test(source(c)) &&
          /<body[\s>]/i.test(source(c)),
      },
      {
        label: "An <h1> is inside the body",
        test: (c) => !!one(c, "body h1") && !!text(one(c, "h1")),
      },
    ],
  },
  {
    id: "cp-2-2",
    unit: 2,
    unitTitle: "Page Skeleton",
    title: "Name the Tab",
    story: "The browser tab says Untitled. Give your page a real name.",
    goal: "Add a <title> in the <head> that says My First Website.",
    starter:
      "<!DOCTYPE html>\n<html>\n  <head>\n\n  </head>\n  <body>\n    <h1>Welcome!</h1>\n  </body>\n</html>\n",
    hint: "In the head, write <title>My First Website</title>.",
    solution:
      "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Website</title>\n  </head>\n  <body>\n    <h1>Welcome!</h1>\n  </body>\n</html>\n",
    checks: [
      { label: "The page has a <title>", test: (c) => !!c.doc.title.trim() },
      {
        label: "The title is My First Website",
        test: (c) => c.doc.title.trim().toLowerCase() === "my first website",
      },
      {
        label: "The title is inside <head>",
        test: (c) => !!one(c, "head title"),
      },
    ],
  },
  {
    id: "cp-2-3",
    unit: 2,
    unitTitle: "Page Skeleton",
    title: "Mailing Address",
    story:
      "The post office needs your school's address on three separate lines.",
    goal: "Write one <p> with the address on 3 lines, using <br> to break the lines.",
    starter: "<p>San Vicente National High School</p>\n",
    hint: "<br> has no closing tag. Example: <p>Line one<br>Line two<br>Line three</p>",
    solution:
      "<p>San Vicente National High School<br>San Vicente<br>Panabo City, Davao del Norte</p>\n",
    checks: [
      {
        label: "At least 2 <br> inside one paragraph",
        test: (c) =>
          all(c, "p").some((p) => p.querySelectorAll("br").length >= 2),
      },
      {
        label: "Every line has text",
        test: (c) =>
          all(c, "p").some(
            (p) =>
              p.innerHTML
                .split(/<br\s*\/?>/i)
                .filter((line) => line.replace(/<[^>]+>/g, "").trim()).length >=
              3,
          ),
      },
    ],
  },

  // Unit 3: Headings, Paragraphs, Styles and Formatting
  {
    id: "cp-3-1",
    unit: 3,
    unitTitle: "Text Wizard",
    title: "Heading Ladder",
    story: "A news site needs a main title, a section title and a sub-title.",
    goal: "Make an <h1>, then an <h2>, then an <h3>, each with text.",
    starter: "<h1>School News</h1>\n",
    hint: "Smaller headings have bigger numbers: <h2>Sports</h2> then <h3>Basketball</h3>.",
    solution: "<h1>School News</h1>\n<h2>Sports</h2>\n<h3>Basketball</h3>\n",
    checks: [
      {
        label: "<h1>, <h2> and <h3> all have text",
        test: (c) => ["h1", "h2", "h3"].every((t) => !!text(one(c, t))),
      },
      {
        label: "They are in order: h1, then h2, then h3",
        test: (c) => {
          const order = all(c, "h1, h2, h3").map((h) => h.tagName);
          const i1 = order.indexOf("H1");
          const i2 = order.indexOf("H2");
          const i3 = order.indexOf("H3");
          return i1 >= 0 && i1 < i2 && i2 < i3;
        },
      },
    ],
  },
  {
    id: "cp-3-2",
    unit: 3,
    unitTitle: "Text Wizard",
    title: "Bold Move",
    story: "Your teacher wants the important words to stand out.",
    goal: "Write a <p> that has one bold word (<strong> or <b>) and one italic word (<em> or <i>).",
    starter: "<p>Always save your work.</p>\n",
    hint: "Wrap a word: <p><strong>Always</strong> save your <em>work</em>.</p>",
    solution: "<p><strong>Always</strong> save your <em>work</em>.</p>\n",
    checks: [
      {
        label: "A bold word inside a paragraph",
        test: (c) => !!text(one(c, "p strong, p b")),
      },
      {
        label: "An italic word inside a paragraph",
        test: (c) => !!text(one(c, "p em, p i")),
      },
    ],
  },
  {
    id: "cp-3-3",
    unit: 3,
    unitTitle: "Text Wizard",
    title: "Blue and Centered",
    story: "The school colors are blue. Make the page title match.",
    goal: 'Use the style attribute to make the <h1> blue and centered: style="color: blue; text-align: center;"',
    starter: "<h1>Panther Pride</h1>\n",
    hint: 'Put the style inside the opening tag: <h1 style="color: blue; text-align: center;">',
    solution:
      '<h1 style="color: blue; text-align: center;">Panther Pride</h1>\n',
    checks: [
      {
        label: "The heading is blue",
        test: (c) => isColor(style(c, one(c, "h1"), "color"), "blue"),
      },
      {
        label: "The heading is centered",
        test: (c) => style(c, one(c, "h1"), "text-align") === "center",
      },
    ],
  },

  // Unit 4: Multimedia, Lists and Tables
  {
    id: "cp-4-1",
    unit: 4,
    unitTitle: "Lists & Tables",
    title: "Baon List",
    story: "Plan your snacks for the school field trip.",
    goal: "Make a bulleted list <ul> with at least 3 items <li>.",
    starter: "<h2>Field Trip Baon</h2>\n<ul>\n  <li>Water</li>\n</ul>\n",
    hint: "Add more lines inside the <ul>, like <li>Sandwich</li>.",
    solution:
      "<h2>Field Trip Baon</h2>\n<ul>\n  <li>Water</li>\n  <li>Sandwich</li>\n  <li>Banana</li>\n</ul>\n",
    checks: [
      { label: "There is a <ul> list", test: (c) => !!one(c, "ul") },
      {
        label: "At least 3 items with text",
        test: (c) => all(c, "ul > li").filter((li) => text(li)).length >= 3,
      },
    ],
  },
  {
    id: "cp-4-2",
    unit: 4,
    unitTitle: "Lists & Tables",
    title: "Picture Perfect",
    story:
      "Add a photo to your page. If it can't load, blind users and slow internet still need to know what it shows.",
    goal: "Add an <img> with a src and an alt text that describes the picture (at least 2 words).",
    starter: "<h2>Our School</h2>\n",
    hint: '<img src="school.jpg" alt="Our school building"> — img has no closing tag.',
    solution:
      '<h2>Our School</h2>\n<img src="school.jpg" alt="Our school building">\n',
    checks: [
      { label: "There is an <img>", test: (c) => !!one(c, "img") },
      {
        label: "The image has a src",
        test: (c) => !!one(c, "img")?.getAttribute("src")?.trim(),
      },
      {
        label: "The alt text has at least 2 words",
        test: (c) =>
          (one(c, "img")?.getAttribute("alt") ?? "").trim().split(/\s+/)
            .length >= 2,
      },
    ],
  },
  {
    id: "cp-4-3",
    unit: 4,
    unitTitle: "Lists & Tables",
    title: "Class Schedule",
    story: "Build a table of your morning classes.",
    goal: "Make a <table> with a header row of <th> cells, then at least 2 more rows of <td> cells.",
    starter:
      '<table border="1">\n  <tr>\n    <th>Time</th>\n    <th>Subject</th>\n  </tr>\n\n</table>\n',
    hint: "Each row is <tr> … </tr>. Example: <tr><td>7:30</td><td>Math</td></tr>",
    solution:
      '<table border="1">\n  <tr>\n    <th>Time</th>\n    <th>Subject</th>\n  </tr>\n  <tr>\n    <td>7:30</td>\n    <td>Math</td>\n  </tr>\n  <tr>\n    <td>8:30</td>\n    <td>TLE</td>\n  </tr>\n</table>\n',
    checks: [
      {
        label: "A header row with at least 2 <th>",
        test: (c) => all(c, "table th").length >= 2,
      },
      {
        label: "At least 2 rows of <td> cells",
        test: (c) =>
          all(c, "table tr").filter((tr) => tr.querySelector("td")).length >= 2,
      },
    ],
  },

  // Unit 5: Forms and Links
  {
    id: "cp-5-1",
    unit: 5,
    unitTitle: "Links & Forms",
    title: "Link Up",
    story: "Point your classmates to a helpful website.",
    goal: 'Make a link <a> with an href that starts with https:// and link text that is not "click here".',
    starter: "<p>Learn more at:</p>\n",
    hint: '<a href="https://www.deped.gov.ph">DepEd website</a>',
    solution:
      '<p>Learn more at:</p>\n<a href="https://www.deped.gov.ph">DepEd website</a>\n',
    checks: [
      {
        label: "A link whose href starts with https://",
        test: (c) =>
          all(c, "a").some((a) =>
            /^https:\/\/\S+\.\S+/i.test(a.getAttribute("href") ?? ""),
          ),
      },
      {
        label: "The link text describes where it goes",
        test: (c) =>
          all(c, "a").some(
            (a) =>
              text(a).length >= 3 && !/^(click )?here$|^link$/.test(text(a)),
          ),
      },
    ],
  },
  {
    id: "cp-5-2",
    unit: 5,
    unitTitle: "Links & Forms",
    title: "Sign-up Form",
    story: "The coding club needs a sign-up form.",
    goal: "Make a <form> with a <label> and a text <input> for the name, and a submit button.",
    starter: "<form>\n\n</form>\n",
    hint: '<label for="name">Name</label> <input type="text" id="name"> <button type="submit">Join</button>',
    solution:
      '<form>\n  <label for="name">Name</label>\n  <input type="text" id="name">\n  <button type="submit">Join</button>\n</form>\n',
    checks: [
      { label: "There is a <form>", test: (c) => !!one(c, "form") },
      {
        label: "A text input inside the form",
        test: (c) =>
          !!one(c, 'form input[type="text"], form input:not([type])'),
      },
      {
        label: "A <label> with text",
        test: (c) => !!text(one(c, "form label")),
      },
      {
        label: "A submit button",
        test: (c) =>
          !!one(
            c,
            'form button:not([type]), form button[type="submit"], form input[type="submit"]',
          ),
      },
    ],
  },
  {
    id: "cp-5-3",
    unit: 5,
    unitTitle: "Links & Forms",
    title: "Pick One",
    story: "Make a poll: what is your favorite subject?",
    goal: 'Make at least 3 radio buttons (<input type="radio">) that share the same name, each with a label.',
    starter:
      '<p>Favorite subject?</p>\n<label><input type="radio" name="subject"> TLE</label>\n',
    hint: "Copy the line and change the word. Every radio needs the same name so only one can be picked.",
    solution:
      '<p>Favorite subject?</p>\n<label><input type="radio" name="subject"> TLE</label>\n<label><input type="radio" name="subject"> Math</label>\n<label><input type="radio" name="subject"> Science</label>\n',
    checks: [
      {
        label: "At least 3 radio buttons",
        test: (c) => all(c, 'input[type="radio"]').length >= 3,
      },
      {
        label: "They all share the same name",
        test: (c) => {
          const names = all(c, 'input[type="radio"]').map((r) =>
            r.getAttribute("name"),
          );
          return (
            names.length >= 3 &&
            !!names[0] &&
            names.every((n) => n === names[0])
          );
        },
      },
      {
        label: "Each radio has a label",
        test: (c) =>
          all(c, 'input[type="radio"]').every(
            (r) =>
              !!r.closest("label") ||
              (!!r.id && !!one(c, `label[for="${r.id}"]`)),
          ),
      },
    ],
  },

  // Unit 6: Developing a Website
  {
    id: "cp-6-1",
    unit: 6,
    unitTitle: "Website Builder",
    title: "Menu Bar",
    story: "Visitors are lost. Give the site a navigation menu.",
    goal: "Make a <nav> with at least 3 links: Home, About and Contact.",
    starter: '<nav>\n  <a href="index.html">Home</a>\n</nav>\n',
    hint: 'Add <a href="about.html">About</a> and <a href="contact.html">Contact</a> inside the nav.',
    solution:
      '<nav>\n  <a href="index.html">Home</a>\n  <a href="about.html">About</a>\n  <a href="contact.html">Contact</a>\n</nav>\n',
    checks: [
      { label: "There is a <nav>", test: (c) => !!one(c, "nav") },
      {
        label: "At least 3 links in the nav",
        test: (c) => all(c, "nav a[href]").length >= 3,
      },
      {
        label: "Links for Home, About and Contact",
        test: (c) => {
          const t = all(c, "nav a").map(text).join(" ");
          return ["home", "about", "contact"].every((w) => t.includes(w));
        },
      },
    ],
  },
  {
    id: "cp-6-2",
    unit: 6,
    unitTitle: "Website Builder",
    title: "Page Layout",
    story: "Good websites have a top, a middle and a bottom.",
    goal: "Use <header>, <main> and <footer>, each with some text.",
    starter: "<header>\n  <h1>Coding Club</h1>\n</header>\n",
    hint: "Add <main><p>…</p></main> and <footer><p>© 2026 Coding Club</p></footer>.",
    solution:
      "<header>\n  <h1>Coding Club</h1>\n</header>\n<main>\n  <p>We meet every Friday.</p>\n</main>\n<footer>\n  <p>© 2026 Coding Club</p>\n</footer>\n",
    checks: [
      {
        label: "<header>, <main> and <footer> exist",
        test: (c) => ["header", "main", "footer"].every((t) => !!one(c, t)),
      },
      {
        label: "Each one has text",
        test: (c) =>
          ["header", "main", "footer"].every((t) => !!text(one(c, t))),
      },
      {
        label: "They are in order: header, main, footer",
        test: (c) =>
          all(c, "header, main, footer")
            .map((e) => e.tagName)
            .join() === "HEADER,MAIN,FOOTER",
      },
    ],
  },
  {
    id: "cp-6-3",
    unit: 6,
    unitTitle: "Website Builder",
    title: "Jump Link",
    story: "The page is long. Let visitors jump straight to the contact part.",
    goal: 'Make a link with href="#contact" and a section with id="contact".',
    starter:
      '<a href="">Go to Contact</a>\n<p>About us…</p>\n<section>\n  <h2>Contact</h2>\n</section>\n',
    hint: 'The link uses # plus the id: href="#contact". The target gets id="contact".',
    solution:
      '<a href="#contact">Go to Contact</a>\n<p>About us…</p>\n<section id="contact">\n  <h2>Contact</h2>\n</section>\n',
    checks: [
      {
        label: 'A link with href="#contact"',
        test: (c) => !!one(c, 'a[href="#contact"]'),
      },
      {
        label: 'An element with id="contact"',
        test: (c) => !!c.doc.getElementById("contact"),
      },
    ],
  },

  // Unit 7: Introduction to CSS
  {
    id: "cp-7-1",
    unit: 7,
    unitTitle: "CSS Academy",
    title: "First Style Sheet",
    story: "Style every paragraph at once instead of one by one.",
    goal: "Write a <style> block with a rule that makes all <p> red.",
    starter:
      "<style>\n\n</style>\n<p>First paragraph.</p>\n<p>Second paragraph.</p>\n",
    hint: "Inside <style>, write: p { color: red; }",
    solution:
      "<style>\n  p { color: red; }\n</style>\n<p>First paragraph.</p>\n<p>Second paragraph.</p>\n",
    checks: [
      { label: "There is a <style> block", test: (c) => !!one(c, "style") },
      {
        label: "Every paragraph is red",
        test: (c) =>
          all(c, "p").length >= 2 &&
          all(c, "p").every((p) => isColor(style(c, p, "color"), "red")),
      },
      {
        label: "No style attribute was used",
        test: (c) => !one(c, "p[style]"),
      },
    ],
  },
  {
    id: "cp-7-2",
    unit: 7,
    unitTitle: "CSS Academy",
    title: "Highlighter",
    story: "Make a class that works like a yellow highlighter pen.",
    goal: "Write a .highlight class with a yellow background-color and use it on a <span>.",
    starter:
      "<style>\n\n</style>\n<p>The test is on <span>Friday</span>.</p>\n",
    hint: 'CSS: .highlight { background-color: yellow; } and HTML: <span class="highlight">',
    solution:
      '<style>\n  .highlight { background-color: yellow; }\n</style>\n<p>The test is on <span class="highlight">Friday</span>.</p>\n',
    checks: [
      {
        label: 'A <span class="highlight">',
        test: (c) => !!one(c, "span.highlight"),
      },
      {
        label: "Its background is yellow",
        test: (c) =>
          isColor(style(c, one(c, ".highlight"), "background-color"), "yellow"),
      },
      {
        label: "The style comes from a class rule",
        test: (c) => /\.highlight\s*\{/.test(source(c)),
      },
    ],
  },
  {
    id: "cp-7-3",
    unit: 7,
    unitTitle: "CSS Academy",
    title: "Big Title",
    story: "The page title is too small to read from the back of the room.",
    goal: 'Give the <h1> id="title", then use #title in CSS to set font-size to 40px or more.',
    starter: "<style>\n\n</style>\n<h1>Science Fair</h1>\n",
    hint: '<h1 id="title"> and in the style: #title { font-size: 48px; }',
    solution:
      '<style>\n  #title { font-size: 48px; }\n</style>\n<h1 id="title">Science Fair</h1>\n',
    checks: [
      { label: 'The <h1> has id="title"', test: (c) => !!one(c, "h1#title") },
      {
        label: "Font size is 40px or more",
        test: (c) => px(style(c, one(c, "#title"), "font-size")) >= 40,
      },
      {
        label: "Uses the #title selector",
        test: (c) => /#title\s*\{/.test(source(c)),
      },
    ],
  },

  // Unit 8: CSS Spacing, Links, Lists, Tables and Animation
  {
    id: "cp-8-1",
    unit: 8,
    unitTitle: "Style Master",
    title: "Breathing Room",
    story: "The announcement box is cramped. Give it space and a frame.",
    goal: "Style .box with padding of at least 20px and a solid border.",
    starter:
      '<style>\n  .box {\n\n  }\n</style>\n<div class="box">No classes on Friday!</div>\n',
    hint: "Inside .box { } write: padding: 20px; border: 2px solid navy;",
    solution:
      '<style>\n  .box {\n    padding: 20px;\n    border: 2px solid navy;\n  }\n</style>\n<div class="box">No classes on Friday!</div>\n',
    checks: [
      {
        label: "Padding is at least 20px",
        test: (c) =>
          ["top", "right", "bottom", "left"].every(
            (side) => px(style(c, one(c, ".box"), `padding-${side}`)) >= 20,
          ),
      },
      {
        label: "The border is solid",
        test: (c) =>
          style(c, one(c, ".box"), "border-top-style") === "solid" &&
          px(style(c, one(c, ".box"), "border-top-width")) > 0,
      },
    ],
  },
  {
    id: "cp-8-2",
    unit: 8,
    unitTitle: "Style Master",
    title: "Pill Button",
    story: "Square buttons look old. Make a modern rounded button.",
    goal: "Style the .btn link with a background color, white text, padding and a border-radius of at least 8px.",
    starter:
      '<style>\n  .btn {\n\n  }\n</style>\n<a class="btn" href="#">Enroll now</a>\n',
    hint: "background-color: green; color: white; padding: 10px 20px; border-radius: 20px;",
    solution:
      '<style>\n  .btn {\n    background-color: green;\n    color: white;\n    padding: 10px 20px;\n    border-radius: 20px;\n    text-decoration: none;\n  }\n</style>\n<a class="btn" href="#">Enroll now</a>\n',
    checks: [
      {
        label: "It has a background color",
        test: (c) =>
          isColor(style(c, one(c, ".btn"), "background-color"), "any"),
      },
      {
        label: "The text is white",
        test: (c) => {
          const v = rgb(style(c, one(c, ".btn"), "color"));
          return !!v && v[0] > 230 && v[1] > 230 && v[2] > 230;
        },
      },
      {
        label: "It has padding",
        test: (c) => px(style(c, one(c, ".btn"), "padding-left")) > 0,
      },
      {
        label: "Corners rounded by 8px or more",
        test: (c) =>
          px(style(c, one(c, ".btn"), "border-top-left-radius")) >= 8,
      },
    ],
  },
  {
    id: "cp-8-3",
    unit: 8,
    unitTitle: "Style Master",
    title: "Hover Glow",
    story: "Buttons should react when the mouse is over them — smoothly.",
    goal: "Write a .btn:hover rule that changes the background-color, and give .btn a transition.",
    starter:
      '<style>\n  .btn {\n    background-color: navy;\n    color: white;\n    padding: 10px 20px;\n  }\n</style>\n<button class="btn">Hover me</button>\n',
    hint: "Add transition: background-color 0.3s; to .btn, then .btn:hover { background-color: orange; }",
    solution:
      '<style>\n  .btn {\n    background-color: navy;\n    color: white;\n    padding: 10px 20px;\n    transition: background-color 0.3s;\n  }\n  .btn:hover {\n    background-color: orange;\n  }\n</style>\n<button class="btn">Hover me</button>\n',
    checks: [
      {
        label: "A .btn:hover rule",
        test: (c) =>
          /\.btn:hover\s*\{[^}]*background(-color)?\s*:/.test(source(c)),
      },
      {
        label: ".btn has a transition",
        test: (c) => {
          const d = style(c, one(c, ".btn"), "transition-duration");
          return d.split(",").some((t) => parseFloat(t) > 0);
        },
      },
    ],
  },

  // Unit 9: CSS Box Model, Box Shadow and Transform
  {
    id: "cp-9-1",
    unit: 9,
    unitTitle: "Box Lab",
    title: "Floating Card",
    story: "Make the card look like it floats above the page.",
    goal: "Give .card a box-shadow and a border-radius.",
    starter:
      '<style>\n  .card {\n    padding: 16px;\n    width: 220px;\n\n  }\n</style>\n<div class="card">\n  <h3>Momo</h3>\n  <p>Grade 9</p>\n</div>\n',
    hint: "box-shadow: 0 4px 12px gray; border-radius: 12px;",
    solution:
      '<style>\n  .card {\n    padding: 16px;\n    width: 220px;\n    box-shadow: 0 4px 12px gray;\n    border-radius: 12px;\n  }\n</style>\n<div class="card">\n  <h3>Momo</h3>\n  <p>Grade 9</p>\n</div>\n',
    checks: [
      {
        label: "The card has a box-shadow",
        test: (c) => style(c, one(c, ".card"), "box-shadow") !== "none",
      },
      {
        label: "The card has rounded corners",
        test: (c) =>
          px(style(c, one(c, ".card"), "border-top-left-radius")) > 0,
      },
    ],
  },
  {
    id: "cp-9-2",
    unit: 9,
    unitTitle: "Box Lab",
    title: "Center Stage",
    story: "The box is stuck on the left. Center it on the page.",
    goal: "Give .box a width of 200px and margin: 0 auto so it sits in the middle.",
    starter:
      '<style>\n  .box {\n    background-color: lightblue;\n    padding: 10px;\n\n  }\n</style>\n<div class="box">I want to be in the middle!</div>\n',
    hint: "width: 200px; margin: 0 auto;",
    solution:
      '<style>\n  .box {\n    background-color: lightblue;\n    padding: 10px;\n    width: 200px;\n    margin: 0 auto;\n  }\n</style>\n<div class="box">I want to be in the middle!</div>\n',
    checks: [
      {
        label: "Width is 200px",
        test: (c) => Math.round(px(style(c, one(c, ".box"), "width"))) === 200,
      },
      {
        label: "It is centered (equal left and right margins)",
        test: (c) => {
          const box = one(c, ".box");
          const l = px(style(c, box, "margin-left"));
          const r = px(style(c, box, "margin-right"));
          return l > 0 && Math.abs(l - r) <= 1;
        },
      },
    ],
  },
  {
    id: "cp-9-3",
    unit: 9,
    unitTitle: "Box Lab",
    title: "Tilt It",
    story: "Make a sticker that looks stuck on at an angle.",
    goal: "Use transform: rotate(…) on .sticker to tilt it.",
    starter:
      '<style>\n  .sticker {\n    display: inline-block;\n    background-color: gold;\n    padding: 12px;\n\n  }\n</style>\n<div class="sticker">NEW!</div>\n',
    hint: "transform: rotate(-10deg);",
    solution:
      '<style>\n  .sticker {\n    display: inline-block;\n    background-color: gold;\n    padding: 12px;\n    transform: rotate(-10deg);\n  }\n</style>\n<div class="sticker">NEW!</div>\n',
    checks: [
      {
        label: "The sticker is transformed",
        test: (c) => style(c, one(c, ".sticker"), "transform") !== "none",
      },
      {
        label: "It uses rotate()",
        test: (c) => /rotate\(\s*-?\d/.test(source(c)),
      },
    ],
  },

  // Unit 10: Creating an Interactive Website
  {
    id: "cp-10-1",
    unit: 10,
    unitTitle: "Final Quest",
    title: "Button Feedback",
    story: "A good button changes when you point at it AND when you press it.",
    goal: "Write .btn:hover and .btn:active rules that each change something about the button.",
    starter:
      '<style>\n  .btn {\n    background-color: teal;\n    color: white;\n    padding: 12px 24px;\n    border: none;\n  }\n</style>\n<button class="btn">Submit</button>\n',
    hint: ".btn:hover { background-color: darkcyan; } .btn:active { transform: scale(0.95); }",
    solution:
      '<style>\n  .btn {\n    background-color: teal;\n    color: white;\n    padding: 12px 24px;\n    border: none;\n  }\n  .btn:hover { background-color: darkcyan; }\n  .btn:active { transform: scale(0.95); }\n</style>\n<button class="btn">Submit</button>\n',
    checks: [
      {
        label: "A .btn:hover rule with a style",
        test: (c) => /\.btn:hover\s*\{[^}]*:[^}]*\}/.test(source(c)),
      },
      {
        label: "A .btn:active rule with a style",
        test: (c) => /\.btn:active\s*\{[^}]*:[^}]*\}/.test(source(c)),
      },
    ],
  },
  {
    id: "cp-10-2",
    unit: 10,
    unitTitle: "Final Quest",
    title: "Profile Card",
    story: "Build a profile card for yourself, like on a social app.",
    goal: "Make a .card that has an <img>, an <h2> name, a <p> and a link or button. Give the card a border-radius and a box-shadow.",
    starter:
      '<style>\n  .card {\n    width: 240px;\n    padding: 16px;\n    text-align: center;\n  }\n</style>\n<div class="card">\n\n</div>\n',
    hint: 'Inside the card: <img src="me.png" alt="My photo"> <h2>Your Name</h2> <p>Grade 9 coder</p> <a href="#">Follow</a>. Then add box-shadow and border-radius to .card.',
    solution:
      '<style>\n  .card {\n    width: 240px;\n    padding: 16px;\n    text-align: center;\n    border-radius: 16px;\n    box-shadow: 0 4px 12px gray;\n  }\n</style>\n<div class="card">\n  <img src="me.png" alt="My photo">\n  <h2>Juan Dela Cruz</h2>\n  <p>Grade 9 coder</p>\n  <a href="#">Follow</a>\n</div>\n',
    checks: [
      {
        label: "The card has an <img>, <h2> and <p>",
        test: (c) => ["img", "h2", "p"].every((t) => !!one(c, `.card ${t}`)),
      },
      {
        label: "The card has a link or button",
        test: (c) => !!one(c, ".card a, .card button"),
      },
      {
        label: "Rounded corners and a shadow",
        test: (c) => {
          const card = one(c, ".card");
          return (
            px(style(c, card, "border-top-left-radius")) > 0 &&
            style(c, card, "box-shadow") !== "none"
          );
        },
      },
    ],
  },
  {
    id: "cp-10-3",
    unit: 10,
    unitTitle: "Final Quest",
    title: "Boss Level: Mini Homepage",
    story:
      "Put it all together: a small homepage for your section with a menu, a title, content and a footer — styled and interactive.",
    goal: "Use a <nav> with 3+ links, an <h1>, a <section> with an id, and a <footer>. In <style>, write at least 4 rules, including one :hover rule.",
    starter:
      "<!DOCTYPE html>\n<html>\n<head>\n  <title>Our Section</title>\n  <style>\n\n  </style>\n</head>\n<body>\n\n</body>\n</html>\n",
    hint: "Reuse what you built before: the menu bar (nav), the page layout (header/main/footer) and the hover button. Each CSS rule is selector { property: value; }.",
    solution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Our Section</title>\n  <style>\n    body { font-family: Arial, sans-serif; margin: 0; }\n    nav { background-color: navy; padding: 12px; }\n    nav a { color: white; margin-right: 16px; }\n    nav a:hover { color: gold; }\n    h1 { text-align: center; color: navy; }\n    footer { background-color: #eee; padding: 12px; text-align: center; }\n  </style>\n</head>\n<body>\n  <nav>\n    <a href="#home">Home</a>\n    <a href="#about">About</a>\n    <a href="#contact">Contact</a>\n  </nav>\n  <h1>Grade 9 – Our Section</h1>\n  <section id="about">\n    <p>We are the coders of Grade 9.</p>\n  </section>\n  <footer>© 2026 Our Section</footer>\n</body>\n</html>\n',
    checks: [
      {
        label: "A <nav> with at least 3 links",
        test: (c) => all(c, "nav a[href]").length >= 3,
      },
      { label: "An <h1> with text", test: (c) => !!text(one(c, "h1")) },
      {
        label: "A <section> with an id",
        test: (c) => all(c, "section").some((s) => !!s.id),
      },
      { label: "A <footer> with text", test: (c) => !!text(one(c, "footer")) },
      {
        label: "At least 4 CSS rules",
        test: (c) =>
          all(c, "style")
            .map((s) => (s.textContent ?? "").replace(/\/\*[\s\S]*?\*\//g, ""))
            .join("")
            .split("{").length -
            1 >=
          4,
      },
      {
        label: "One :hover rule",
        test: (c) => /:hover\s*\{[^}]*:/.test(source(c)),
      },
    ],
  },
];

/** Stars for a solved level: 3 on your own, 2 with the hint, 1 after seeing the answer. */
export function codeStars(usedHint: boolean, sawSolution: boolean) {
  return sawSolution ? 1 : usedHint ? 2 : 3;
}
