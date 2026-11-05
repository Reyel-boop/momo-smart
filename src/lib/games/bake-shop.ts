/**
 * Bake Shop, the baking game: each recipe's steps are shuffled and the
 * student taps them in the right order, following the methods taught in
 * Bakery Operations 11. One level per unit, three recipes each. Scoring lives
 * here so the server can replay every tap.
 */

export type BakeRecipe = {
  id: string;
  name: string;
  emoji: string;
  steps: string[];
};

export type BakeLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  recipes: BakeRecipe[];
};

const level = (
  n: number,
  unitTitle: string,
  title: string,
  recipes: [string, string, string[]][],
): BakeLevel => ({
  id: `bake-${n}`,
  unit: n,
  unitTitle,
  title,
  recipes: recipes.map(([name, emoji, steps], i) => ({
    id: `bake-${n}.${i}`,
    name,
    emoji,
    steps,
  })),
});

export const BAKE_LEVELS: BakeLevel[] = [
  level(1, "Fundamentals of Baking Bread", "Bread Bakers", [
    [
      "Pandesal (straight dough)",
      "🍞",
      [
        "Scale the ingredients",
        "Mix and knead the dough",
        "Let the dough ferment",
        "Punch down the dough",
        "Divide and round",
        "Shape the rolls",
        "Proof the rolls",
        "Bake",
        "Cool",
      ],
    ],
    [
      "Loaf Bread (sponge dough)",
      "🍞",
      [
        "Mix some flour, water and yeast into a sponge",
        "Let the sponge ferment",
        "Mix the sponge with the other ingredients",
        "Knead the dough",
        "Shape into a loaf",
        "Proof the loaf",
        "Bake",
        "Cool",
      ],
    ],
    [
      "Milk Bread (tangzhong)",
      "🥖",
      [
        "Cook flour and milk into a paste at about 65 °C",
        "Cool the paste",
        "Mix the paste into the dough",
        "Knead the dough",
        "Let the dough ferment",
        "Shape the bread",
        "Proof the bread",
        "Bake",
      ],
    ],
  ]),
  level(2, "Pastry Products", "Pastry Chef", [
    [
      "Short-Crust Pie Shell",
      "🥧",
      [
        "Rub the fat into the flour",
        "Add cold water",
        "Chill the dough",
        "Roll out the dough",
        "Line the pie pan",
        "Dock the dough with a fork",
        "Blind bake the shell",
      ],
    ],
    [
      "Cream Puffs (choux)",
      "🧁",
      [
        "Boil the water and butter",
        "Stir in the flour",
        "Cook the paste on the stove",
        "Beat in the eggs one at a time",
        "Pipe onto a tray",
        "Bake until puffed and dry",
        "Cool, then fill with cream",
      ],
    ],
    [
      "Puff Pastry",
      "🥐",
      [
        "Wrap the butter in the dough",
        "Roll out the dough",
        "Fold it into layers",
        "Chill the dough",
        "Repeat the rolling and folding",
        "Cut into shapes",
        "Bake until golden",
      ],
    ],
  ]),
  level(3, "Cakes and Cake Products", "Cake Maker", [
    [
      "Butter Cake (creaming)",
      "🍰",
      [
        "Prepare the pan and preheat the oven",
        "Cream the butter and sugar",
        "Beat in the eggs",
        "Add the flour and milk",
        "Pour the batter into the pan",
        "Bake",
        "Cool before frosting",
      ],
    ],
    [
      "Sponge Cake",
      "🎂",
      [
        "Warm the eggs and sugar",
        "Whip to the ribbon stage",
        "Fold in the flour gently",
        "Pour the batter into the pan",
        "Bake",
        "Cool",
      ],
    ],
    [
      "Chiffon Cake",
      "🍰",
      [
        "Mix the oil, yolks and flour into a batter",
        "Whip the egg whites into a meringue",
        "Fold the meringue into the batter",
        "Pour into an ungreased tube pan",
        "Bake",
        "Turn the pan upside down to cool",
      ],
    ],
  ]),
  level(4, "Traditional and Contemporary Petit Fours", "Petit Fours", [
    [
      "Glazed Petit Fours",
      "🍬",
      [
        "Bake a thin sheet of cake",
        "Cool the cake",
        "Spread jam between the layers",
        "Chill the layered cake",
        "Cut into small shapes",
        "Coat with fondant",
        "Decorate each piece",
      ],
    ],
    [
      "Mini Fruit Tartlets",
      "🍓",
      [
        "Line the small tins with pastry",
        "Blind bake the shells",
        "Cool the shells",
        "Fill with pastry cream",
        "Top with fruit",
        "Brush with fruit glaze",
      ],
    ],
    [
      "Chocolate Truffles",
      "🍫",
      [
        "Heat the cream",
        "Pour it over the chopped chocolate",
        "Stir into a smooth ganache",
        "Chill until firm",
        "Scoop and roll into balls",
        "Coat with cocoa powder",
      ],
    ],
  ]),
];

/** Wrong taps allowed for 3 and 2 stars; anything more earns 1. */
export const BAKE_STARS = [1, 4] as const;

export function bakeStars(mistakes: number) {
  return mistakes <= BAKE_STARS[0] ? 3 : mistakes <= BAKE_STARS[1] ? 2 : 1;
}

/** Replays the taps; null unless every recipe was finished. */
export function scoreBake(
  level: BakeLevel,
  recipes: { id: string; taps: string[] }[],
) {
  let mistakes = 0;
  for (const recipe of level.recipes) {
    const taps = recipes.find((r) => r.id === recipe.id)?.taps;
    if (!taps) return null;
    let next = 0;
    for (const tap of taps) {
      if (tap === recipe.steps[next]) next++;
      else mistakes++;
    }
    if (next !== recipe.steps.length) return null;
  }
  return {
    recipes: level.recipes.length,
    mistakes,
    stars: bakeStars(mistakes),
  };
}
