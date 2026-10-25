/**
 * TLE (Technology and Livelihood Education) for the demo school.
 *
 * TLE 7 and 8 are exploratory: one unit per strand (ICT, Home Economics,
 * Agri-Fishery Arts, Industrial Arts). TLE 9 and 10 are specialized: one
 * course per major — Computer Programming, Cookery, Agricultural Crop
 * Production, and Electrical Installation and Maintenance; TLE 9 also has
 * Telecommunications (contact center services), and TLE 8 has Agriculture
 * and Fishery Arts, Family and Consumer Science, and Industrial Arts. Every lesson
 * carries its lecture and every unit its Unit Questions.
 */
import type { DemoSubject } from "../grade10";
import { TLE7 } from "./grade7";
import { TLE8 } from "./grade8";
import { agricultureAndFisheryArts8 } from "./afa";
import { familyAndConsumerScience8 } from "./fcs";
import { industrialArts8 } from "./ia";
import { TLE9 } from "./grade9";
import { TLE10 } from "./grade10";

export const TLE_SUBJECTS: DemoSubject[] = [
  TLE7,
  TLE8,
  agricultureAndFisheryArts8,
  familyAndConsumerScience8,
  industrialArts8,
  ...TLE9,
  ...TLE10,
];
