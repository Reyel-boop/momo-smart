/**
 * Karinderya Rush, a TLE game: customers order Filipino dishes and the
 * student picks the right ingredients from the tray before they lose
 * patience. Scoring lives here so the server can check every plate.
 */

export type KarinderyaDish = {
  id: string;
  name: string;
  ingredients: string[];
};

export type KarinderyaLevel = {
  id: string;
  unit: number;
  unitTitle: string;
  title: string;
  dishes: KarinderyaDish[];
};

/** Seconds before a customer gives up. */
export const KARINDERYA_SECONDS = 25;
/** Tiles on the tray for each order. */
export const TRAY_SIZE = 10;
/** Right plates out of six for 1, 2 and 3 stars. */
export const KARINDERYA_STARS = [3, 5, 6] as const;

const level = (
  n: number,
  title: string,
  dishes: [string, string[]][],
): KarinderyaLevel => ({
  id: `kusina-${n}`,
  unit: n,
  unitTitle: "Karinderya",
  title,
  dishes: dishes.map(([name, ingredients], i) => ({
    id: `kusina-${n}.${i}`,
    name,
    ingredients,
  })),
});

export const KARINDERYA_LEVELS: KarinderyaLevel[] = [
  level(1, "Almusal", [
    ["Tapsilog", ["Tapa", "Sinangag", "Itlog"]],
    ["Longsilog", ["Longganisa", "Sinangag", "Itlog"]],
    ["Tocilog", ["Tocino", "Sinangag", "Itlog"]],
    ["Champorado", ["Malagkit", "Tablea", "Asukal", "Gatas"]],
    ["Arroz Caldo", ["Malagkit", "Manok", "Luya", "Bawang"]],
    ["Ginisang Corned Beef", ["Corned beef", "Bawang", "Sibuyas"]],
  ]),
  level(2, "Ulam", [
    ["Adobong Manok", ["Manok", "Toyo", "Suka", "Bawang", "Dahon ng laurel"]],
    [
      "Sinigang na Baboy",
      ["Baboy", "Sampalok", "Kamatis", "Labanos", "Kangkong"],
    ],
    ["Tinolang Manok", ["Manok", "Luya", "Sayote", "Dahon ng sili"]],
    ["Nilagang Baka", ["Baka", "Repolyo", "Patatas", "Saging na saba"]],
    ["Pinakbet", ["Bagoong", "Kalabasa", "Talong", "Okra", "Ampalaya"]],
    ["Kare-Kare", ["Buntot ng baka", "Mani", "Talong", "Bagoong"]],
  ]),
  level(3, "Merienda", [
    ["Turon", ["Saging na saba", "Langka", "Lumpia wrapper", "Asukal"]],
    ["Banana Cue", ["Saging na saba", "Asukal", "Mantika"]],
    ["Pancit Canton", ["Canton noodles", "Repolyo", "Karot", "Toyo"]],
    ["Lumpiang Shanghai", ["Giniling", "Karot", "Sibuyas", "Lumpia wrapper"]],
    ["Ginataang Bilo-Bilo", ["Gata", "Malagkit", "Saging na saba", "Langka"]],
    ["Kamote Cue", ["Kamote", "Asukal", "Mantika"]],
  ]),
  level(4, "Panghimagas", [
    ["Halo-Halo", ["Yelo", "Gatas", "Ube", "Leche flan"]],
    ["Leche Flan", ["Itlog", "Gatas", "Asukal"]],
    ["Buko Pandan", ["Buko", "Pandan", "Gulaman", "Krema"]],
    ["Mais con Yelo", ["Mais", "Yelo", "Gatas", "Asukal"]],
    ["Minatamis na Saging", ["Saging na saba", "Asukal", "Pandan"]],
    ["Maja Blanca", ["Gata", "Mais", "Asukal", "Gawgaw"]],
  ]),
];

/** The dish's ingredients plus others from the level, in a random order. */
export function trayFor(level: KarinderyaLevel, dish: KarinderyaDish) {
  const others = [...new Set(level.dishes.flatMap((d) => d.ingredients))]
    .filter((item) => !dish.ingredients.includes(item))
    .sort(() => Math.random() - 0.5)
    .slice(0, TRAY_SIZE - dish.ingredients.length);
  return [...dish.ingredients, ...others].sort(() => Math.random() - 0.5);
}

export const isRightPlate = (dish: KarinderyaDish, picks: string[]) =>
  picks.length === dish.ingredients.length &&
  dish.ingredients.every((item) => picks.includes(item));

export function karinderyaStars(right: number) {
  return KARINDERYA_STARS.filter((needed) => right >= needed).length;
}

/** Scores a shift: one plate per dish (empty when the customer left). */
export function scoreKarinderya(
  level: KarinderyaLevel,
  plates: { id: string; picks: string[] }[],
) {
  if (!level.dishes.every((dish) => plates.some((p) => p.id === dish.id)))
    return null;
  const right = level.dishes.filter((dish) =>
    isRightPlate(dish, plates.find((p) => p.id === dish.id)!.picks),
  ).length;
  return { right, total: level.dishes.length, stars: karinderyaStars(right) };
}
