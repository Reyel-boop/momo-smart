/**
 * Tag Sprint, a Computer Programming speed game: a 60-second round where a
 * description appears ("the biggest heading") and the student taps the
 * matching tag, attribute or CSS property among four. Right answers in a
 * row build a combo; wrong ones cost a point. Five rounds, one per topic.
 *
 * The wrong choices are other answers from the same round, so each item is
 * just a prompt and its answer. Scoring lives here for the server.
 */

export type SprintItem = { id: string; prompt: string; answer: string };

export type SprintLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  /** What the round covers, shown before it starts. */
  topic: string;
  items: SprintItem[];
};

export const SPRINT_SECONDS = 60;
/** Net score (right minus wrong) for 1, 2 and 3 stars. */
export const SPRINT_STARS = [6, 12, 18] as const;

const pool = (id: string, pairs: [string, string][]): SprintItem[] =>
  pairs.map(([prompt, answer], i) => ({ id: `${id}.${i}`, prompt, answer }));

export const SPRINT_LEVELS: SprintLevel[] = [
  {
    id: "sprint-1",
    unit: 3,
    unitTitle: "Text Wizard",
    title: "Tag Basics",
    topic: "Page structure and text tags",
    items: pool("sprint-1", [
      ["The biggest heading", "<h1>"],
      ["The smallest heading", "<h6>"],
      ["A paragraph", "<p>"],
      ["A line break", "<br>"],
      ["Bold, important text", "<strong>"],
      ["Italic, emphasized text", "<em>"],
      ["A horizontal line", "<hr>"],
      ["The title in the browser tab", "<title>"],
      ["Holds everything you see on the page", "<body>"],
      ["Holds info about the page that isn't shown", "<head>"],
      ["Wraps the whole page", "<html>"],
      ["The 2 in H₂O", "<sub>"],
      ["The 2 in x²", "<sup>"],
      ["Highlighted text", "<mark>"],
      ["A note only coders can see", "<!-- -->"],
      ["Small side-note text", "<small>"],
      ["Underlined text", "<u>"],
      ["Text crossed out with a line", "<del>"],
      ["A long quotation", "<blockquote>"],
      ["Text that keeps all its spaces", "<pre>"],
    ]),
  },
  {
    id: "sprint-2",
    unit: 4,
    unitTitle: "Lists & Tables",
    title: "Lists, Tables & Media",
    topic: "Lists, tables, images, audio and video",
    items: pool("sprint-2", [
      ["A bulleted list", "<ul>"],
      ["A numbered list", "<ol>"],
      ["One item in a list", "<li>"],
      ["A description list", "<dl>"],
      ["A term in a description list", "<dt>"],
      ["The description of a term", "<dd>"],
      ["A table", "<table>"],
      ["A table row", "<tr>"],
      ["A table data cell", "<td>"],
      ["A table header cell", "<th>"],
      ["A table's title", "<caption>"],
      ["Show a picture", "<img>"],
      ["Play a video", "<video>"],
      ["Play a sound", "<audio>"],
      ["Show another web page inside yours", "<iframe>"],
      ["Merge cells across columns", "colspan"],
      ["Merge cells down rows", "rowspan"],
      ["An image's file location", "src"],
      ["Text shown when an image can't load", "alt"],
      ["Show play and pause buttons", "controls"],
    ]),
  },
  {
    id: "sprint-3",
    unit: 5,
    unitTitle: "Links & Forms",
    title: "Links & Forms",
    topic: "Links, forms and input types",
    items: pool("sprint-3", [
      ["A link", "<a>"],
      ["Where a link goes", "href"],
      ["Open a link in a new tab", 'target="_blank"'],
      ["A link that starts an email", "mailto:"],
      ['Jump to the part with id="top"', 'href="#top"'],
      ["A form", "<form>"],
      ["A one-line text box", '<input type="text">'],
      ["A box that hides what you type", '<input type="password">'],
      ["Pick only one of several choices", '<input type="radio">'],
      ["Tick boxes you can check", '<input type="checkbox">'],
      ["A text box for many lines", "<textarea>"],
      ["A drop-down list", "<select>"],
      ["One choice in a drop-down", "<option>"],
      ["A clickable button", "<button>"],
      ["A caption for a form field", "<label>"],
      ["Where the form's data is sent", "action"],
      ["Faint hint text in an empty box", "placeholder"],
      ["The field must be filled in", "required"],
      ["Pick a date from a calendar", '<input type="date">'],
      ["Draw a box around related fields", "<fieldset>"],
    ]),
  },
  {
    id: "sprint-4",
    unit: 7,
    unitTitle: "CSS Academy",
    title: "CSS Properties",
    topic: "CSS selectors and text styles",
    items: pool("sprint-4", [
      ["Text color", "color"],
      ["Background color", "background-color"],
      ["Text size", "font-size"],
      ["The typeface", "font-family"],
      ["Bold text in CSS", "font-weight"],
      ["Center the text", "text-align"],
      ["Remove a link's underline", "text-decoration"],
      ["Space between lines", "line-height"],
      ["ALL CAPS in CSS", "text-transform"],
      ["Select by class", ".name"],
      ["Select by id", "#name"],
      ["Select every element", "*"],
      ["Style when the mouse is over it", ":hover"],
      ["The bullets of a list", "list-style"],
      ["A picture behind the content", "background-image"],
      ["Hide an element completely", "display: none"],
      ["Make it see-through", "opacity"],
      ["Italic in CSS", "font-style"],
      ["Space between letters", "letter-spacing"],
      ["The tag for CSS inside the page", "<style>"],
    ]),
  },
  {
    id: "sprint-5",
    unit: 9,
    unitTitle: "Box Lab",
    title: "Box Model & Motion",
    topic: "Box model, layout, transforms and animation",
    items: pool("sprint-5", [
      ["Space inside the border", "padding"],
      ["Space outside the border", "margin"],
      ["The line around a box", "border"],
      ["Rounded corners", "border-radius"],
      ["A shadow under a box", "box-shadow"],
      ["Width includes padding and border", "box-sizing: border-box"],
      ["Turn an element", "transform: rotate()"],
      ["Make it bigger or smaller", "transform: scale()"],
      ["Slide it to a new spot", "transform: translate()"],
      ["A smooth change on hover", "transition"],
      ["The steps of an animation", "@keyframes"],
      ["Run an animation", "animation"],
      ["Line boxes up in a row", "display: flex"],
      ["Center a block across the page", "margin: 0 auto"],
      ["Add scrollbars when content overflows", "overflow: auto"],
      ["Which box is on top", "z-index"],
      ["Stays put while the page scrolls", "position: fixed"],
      ["Placed inside its positioned parent", "position: absolute"],
      ["Space between flex items", "gap"],
      ["How wide a box is", "width"],
    ]),
  },
];

/** Stars for a round's net score. */
export function sprintStars(net: number) {
  return SPRINT_STARS.filter((needed) => net >= needed).length;
}

/** Scores a round from every answer tapped. */
export function scoreSprint(
  level: SprintLevel,
  answers: { id: string; choice: string }[],
) {
  const byId = new Map(level.items.map((i) => [i.id, i.answer]));
  let right = 0;
  let wrong = 0;
  for (const a of answers) {
    if (byId.get(a.id) === a.choice) right++;
    else wrong++;
  }
  const net = Math.max(0, right - wrong);
  return { right, wrong, net, stars: sprintStars(net) };
}
