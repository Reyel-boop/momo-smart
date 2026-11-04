/**
 * TLE (Technology and Livelihood Education) for the demo school.
 *
 * TLE 7 and 8 are exploratory: one unit per strand (ICT, Home Economics,
 * Agri-Fishery Arts, Industrial Arts). TLE 9 and 10 are specialized: one
 * course per major — Computer Programming, Cookery, Agricultural Crop
 * Production, and Electrical Installation and Maintenance; TLE 9 also has
 * Telecommunications (contact center services), and TLE 8 has Agriculture
 * and Fishery Arts, Family and Consumer Science, and Industrial Arts. Grade 11
 * has Bakery Operations, Events Management Services and Food and Beverage
 * Operation, senior high Technical-Professional electives. TLE 7 also has the
 * AFA, FCS and IA courses of the three-term curriculum; Health and Wellness
 * Massage, Food and Beverage Processing and Food Preparation are one-term
 * sectors for Grade 9 or 10, so one course serves both. Every lesson
 * carries its lecture and every unit its Unit Questions.
 */
import type { DemoSubject } from "../grade10";
import { TLE7 } from "./grade7";
import { agricultureAndFisheryArts7 } from "./afa7";
import { familyAndConsumerScience7 } from "./fcs7";
import { industrialArts7 } from "./ia7";
import { TLE8 } from "./grade8";
import { agricultureAndFisheryArts8 } from "./afa";
import { familyAndConsumerScience8 } from "./fcs";
import { industrialArts8 } from "./ia";
import { TLE9 } from "./grade9";
import { TLE10 } from "./grade10";
import { bakeryOperations11 } from "./bakery";
import { eventsManagement11 } from "./events";
import { healthAndWellnessMassage } from "./wellness";
import { foodAndBeverageProcessing } from "./beverage-processing";
import { foodPreparation } from "./food-prep";
import { foodAndBeverageOperation11 } from "./fb-operation";

export const TLE_SUBJECTS: DemoSubject[] = [
  TLE7,
  agricultureAndFisheryArts7,
  familyAndConsumerScience7,
  industrialArts7,
  TLE8,
  agricultureAndFisheryArts8,
  familyAndConsumerScience8,
  industrialArts8,
  ...TLE9,
  healthAndWellnessMassage,
  foodAndBeverageProcessing,
  foodPreparation,
  ...TLE10,
  bakeryOperations11,
  eventsManagement11,
  foodAndBeverageOperation11,
];
