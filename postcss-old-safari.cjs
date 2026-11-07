// @ts-nocheck -- a plain-JS PostCSS build step, not app code.
/**
 * Makes the Tailwind 4 output work on old iPhones (Safari 12, iOS 12.5.8)
 * without changing how it looks on newer browsers. It runs after Tailwind and
 * the cascade-layers step (see postcss.config.js), and:
 *
 * 1. adds plain-color fallbacks for oklch()/color-mix() colors and flattens
 *    nesting (Lightning CSS, targeting Safari 12);
 * 2. rewrites logical properties (padding-inline, margin-block, ...) to
 *    left/right/top/bottom, which is the same thing on a left-to-right site;
 * 3. gives old Safari copies of rules that use :where(), which it would
 *    otherwise drop entirely;
 * 4. stands in for flexbox `gap`, which Safari only supports from 14.1, with
 *    margins between items;
 * 5. repeats the `translate`/`scale`/`rotate` properties as `transform`.
 *
 * Steps 3 to 5 sit inside `@supports not (translate: 0)`: the `translate`
 * property arrived in Safari 14.1 together with flex gap, so only browsers
 * older than that ever apply them.
 */
const { transform } = require("lightningcss");
const postcss = require("postcss");

const OLD_ONLY = "not (translate: 0)";
const TARGETS = { safari: 12 << 16, ios_saf: 12 << 16 };

/** Splits on commas that are not inside brackets or parentheses. */
function splitTop(text) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

/** One selector with every :where(a, b) expanded into plain selectors. */
function unwrapWhere(selector) {
  const at = selector.indexOf(":where(");
  if (at === -1) return [selector];
  let depth = 0;
  let end = at + ":where".length;
  for (; end < selector.length; end++) {
    if (selector[end] === "(") depth++;
    else if (selector[end] === ")" && --depth === 0) break;
  }
  const inner = selector.slice(at + ":where(".length, end);
  const before = selector.slice(0, at);
  const after = selector.slice(end + 1);
  return splitTop(inner).flatMap((part) =>
    unwrapWhere(`${before}${part}${after}`),
  );
}

/** Logical properties as physical ones, for a left-to-right page. */
const SIDES = {
  inline: ["left", "right"],
  block: ["top", "bottom"],
};
function physical(prop, value) {
  const box = prop.match(
    /^(padding|margin|scroll-margin|scroll-padding)-(inline|block)(-start|-end)?$/,
  );
  if (box) {
    const [, kind, axis, edge] = box;
    const [a, b] = SIDES[axis];
    if (edge) return [[`${kind}-${edge === "-start" ? a : b}`, value]];
    const [first, second = first] = value.split(/\s+(?![^(]*\))/);
    return [
      [`${kind}-${a}`, first],
      [`${kind}-${b}`, second],
    ];
  }
  const inset = prop.match(/^inset-(inline|block)(-start|-end)?$/);
  if (inset) {
    const [, axis, edge] = inset;
    const [a, b] = SIDES[axis];
    if (edge) return [[edge === "-start" ? a : b, value]];
    const [first, second = first] = value.split(/\s+(?![^(]*\))/);
    return [
      [a, first],
      [b, second],
    ];
  }
  const border = prop.match(
    /^border-(inline|block)(-start|-end)?(-width|-style|-color)?$/,
  );
  if (border) {
    const [, axis, edge, part = ""] = border;
    const [a, b] = SIDES[axis];
    const sides = edge ? [edge === "-start" ? a : b] : [a, b];
    return sides.map((side) => [`border-${side}${part}`, value]);
  }
  return null;
}

/** `gap-4`, `gap-x-2`, `gap-y-1.5`: the class and which axes it sets. */
function gapClass(selector) {
  const match = selector.match(/^\.(gap(?:-([xy]))?-[\w\\.\[\]\/-]+)$/);
  if (!match) return null;
  return { cls: match[1], axis: match[2] ?? "both" };
}

const plugin = () => ({
  postcssPlugin: "momo-old-safari",
  OnceExit(root) {
    // 1. Colour fallbacks and nesting, for Safari 12.
    const lowered = transform({
      filename: "momo.css",
      code: Buffer.from(root.toString()),
      targets: TARGETS,
      errorRecovery: true,
    });
    const next = postcss.parse(lowered.code.toString());
    root.removeAll();
    root.append(next.nodes);

    const oldRules = [];
    root.walkRules((rule) => {
      // 2. Logical properties become physical ones.
      rule.each((node) => {
        if (node.type !== "decl") return;
        const sides = physical(node.prop, node.value);
        if (!sides) return;
        for (const [prop, value] of sides) {
          node.cloneBefore({ prop, value });
        }
        node.remove();
      });

      // 5. The `translate`, `scale` and `rotate` properties (Safari 14.1+)
      //    as a classic `transform`, or old Safari never moves the element:
      //    slide-in menus would stay open over the page.
      const parts = [];
      rule.each((node) => {
        if (node.type !== "decl") return;
        const value = node.value.trim();
        if (value === "none") return;
        const args = value.split(/\s+(?![^(]*\))/);
        if (node.prop === "translate")
          parts.push(`translate(${args.join(", ")})`);
        else if (node.prop === "scale") parts.push(`scale(${args.join(", ")})`);
        else if (node.prop === "rotate" && args.length === 1)
          parts.push(`rotate(${value})`);
      });
      if (parts.length > 0 && !rule.parent?.params?.includes("translate")) {
        const copy = rule.clone({ nodes: [] });
        copy.append({ prop: "transform", value: parts.join(" ") });
        oldRules.push({ rule: copy, after: rule });
      }

      // 3. Old-Safari copies of :where() rules.
      if (rule.selector.includes(":where(")) {
        const copy = rule.clone({
          selectors: rule.selectors.flatMap(unwrapWhere),
        });
        oldRules.push({ rule: copy, after: rule });
      }

      // 4. Margins standing in for flexbox gap.
      if (rule.parent?.type === "root" && rule.selectors.length === 1) {
        const gap = gapClass(rule.selector);
        if (!gap) return;
        rule.walkDecls(/^(gap|column-gap|row-gap)$/, (decl) => {
          const row = decl.prop !== "row-gap";
          const column = decl.prop !== "column-gap";
          const base = `.${gap.cls}`;
          const flexRow = [".flex", ".inline-flex"].map(
            (f) => `${base}${f}:not(.flex-col) > * + *`,
          );
          const flexCol = `${base}.flex-col > * + *`;
          const css = [
            row ? `${flexRow.join(", ")} { margin-left: ${decl.value}; }` : "",
            column ? `${flexCol} { margin-top: ${decl.value}; }` : "",
          ].join("\n");
          if (css.trim()) {
            const block = postcss.parse(css);
            block.each((r) => oldRules.push({ rule: r, after: rule }));
          }
        });
      }
    });

    for (const { rule, after } of oldRules) {
      const wrap = postcss.atRule({ name: "supports", params: OLD_ONLY });
      wrap.append(rule);
      after.after(wrap);
    }
  },
});
plugin.postcss = true;

module.exports = plugin;
