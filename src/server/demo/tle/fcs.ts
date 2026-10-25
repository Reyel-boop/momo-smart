/**
 * TLE 8 – Family and Consumer Science, following the Second Term of DepEd's
 * Grade 8 TLE (AFA / FCS / IA) Three-Term Budget of Work (updated April 7,
 * 2026): beauty care and wellness, garments and handicrafts — one unit per
 * week or block of weeks (1, 2, 3, 4, 5, 6–8, 9–10), one lesson per learning
 * competency. Each lesson has a lecture video, a written lecture, activities
 * and a self-check; every unit has five Unit Questions.
 */
import type { DemoLesson, DemoSubject, DemoUnit } from "../grade10";
import { q, TLE_DEPARTMENT } from "./common";

/**
 * The lecture video for each lesson (YouTube id). Each was checked to exist
 * and allow embedding, and chosen for covering the lesson’s topic — mostly
 * Grade 8 TLE (MATATAG) lessons recorded by Filipino teachers.
 */
export const FCS_VIDEOS: Record<string, string> = {
  "Beauty Care and Wellness Services": "shSHp11Q3w8", // Concepts of Beauty Care and Wellness Services — maestrider_phine
  "Structures of the Nail, Skin and Hair": "VuFkv13ofU4", // Anatomy of the Skin, Hair and Nails — maestrider_phine
  "Careers and Businesses in Beauty Care and Wellness": "yKGHZ4sU9X0", // Career Opportunities in Beauty and Wellness — maestrider_phine
  "Legal Basis of Beauty Care and Wellness Services": "7bqfNogcsD0", // Beauty Care and Wellness: Legal Basis, Trends, and Tools — Teacher Aisa
  "Trends, Issues and Challenges": "TyxPbUsUii8", // Trends, Issues, and Challenges in Beauty Care — maestrider_phine
  "Tools, Implements, Materials and Equipment": "37lbkDLpQuQ", // Tools, Implements, Materials, Equipment — maestrider_phine
  "Sanitation and Maintenance": "g2m__LUX4V8", // Sanitation and Maintenance — maestrider_phine
  "Occupational Safety and Health in Beauty Care": "ZRDm9JaIffg", // OSH in the Beauty Care and Wellness Salon — ICF Online
  "Performing Hand Spa Services": "zWuHs9OReHY", // Hand Spa Services — Steps in Giving Hand Massage — maestrider_phine
  "Concepts in Making Garments": "7V-XewqWViM", // Introduction to Garments and its Type — maestrider_phine
  "Supplies and Materials for Making Garments": "91yFdQ8pCEE", // Supplies and Materials Used for Making Garments — maestrider_phine
  "Pattern Drafting": "2UPyYV02oWw", // Pattern Drafting, Pattern Making — maestrider_phine
  "Concepts in Making Handicrafts": "FaytWRflJVw", // TLE 7/8 Handicraft Production — Cherubim Cerdana
  "Supplies and Materials for Making Handicrafts": "85sn2oeXx4o", // Supplies and Materials Used for Making Handicrafts — maestrider_phine
  "Making a Handicraft Project": "3Lv7DAe9tcY", // Basic Principles of Handicraft in Theory and Practice — ICF Online
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
  lecture: { videoId: FCS_VIDEOS[title] ?? "", lecture },
});

const UNITS: DemoUnit[] = [
  // Week 1
  {
    title: "Introduction to Beauty Care and Wellness",
    description:
      "Beauty care and wellness services, the structures of the nail, skin and hair, and careers.",
    lessons: [
      lesson(
        "Beauty Care and Wellness Services",
        "What beauty care and wellness services are.",
        `## Beauty care
**Beauty care** services improve and maintain a person's **appearance** — hair, skin, nails and face.
- **Nail care** — manicure, pedicure, nail art
- **Hair care** — haircut, hair treatment, styling, coloring
- **Skin and face care** — facial, make-up, skin treatments
- **Hand and foot spa**

## Wellness
**Wellness** services care for the **health and well-being** of the whole person — body and mind — so people feel relaxed and refreshed.
- **Massage** (hilot, Swedish massage)
- **Spa services** — body scrubs, wraps, hand and foot spa
- **Aromatherapy**, relaxation and stress relief

## Why they matter
- Good **grooming** builds confidence and a professional image
- **Relaxation** reduces stress and improves health
- **Hygiene** — clean, healthy nails, skin and hair prevent infections
- They create **jobs and businesses** in every community

## Where services are given
Beauty salons, spas, barbershops, nail salons, hotels and resorts, cruise ships, and home service.

## Key points
Beauty care is about looking good; wellness is about feeling good — and both depend on safe, clean, skilled service.`,
        "Survey 5 people at home or school: which beauty care or wellness service do they use most and why? Present your results in a simple chart.",
        [
          "What is the difference between beauty care and wellness services?",
          "Give three examples of beauty care services.",
          "Why are beauty care and wellness services important?",
        ],
      ),
      lesson(
        "Structures of the Nail, Skin and Hair",
        "The parts beauty care workers must know.",
        `## The nail
Nails are made of **keratin**, a hard protein. Fingernails grow about **3 mm a month**.
- **Nail plate (body)** — the visible hard part
- **Free edge** — the part that extends past the finger
- **Nail bed** — the skin under the nail plate
- **Matrix** — where the nail grows; injury here affects nail growth
- **Lunula** — the half-moon at the base
- **Cuticle** and **eponychium** — skin at the base that protects the matrix
- **Hyponychium** — skin under the free edge
- **Nail walls and grooves** — skin folds on the sides

## The skin
The skin is the body's **largest organ**; it protects, feels, and controls temperature.
- **Epidermis** — outer layer; protects; makes new cells
- **Dermis** — inner layer with blood vessels, nerves, **sweat glands**, **oil (sebaceous) glands** and hair follicles
- **Subcutaneous tissue** — fat that cushions and keeps warmth

## The hair
- **Hair shaft** — the part above the skin
- **Hair root** — the part inside the **follicle**
- **Hair bulb** and **papilla** — where hair grows and gets nourishment
- **Sebaceous gland** — oils the hair; **arrector pili** muscle — makes "goosebumps"
- Layers of the shaft: **cuticle** (outer), **cortex** (gives strength and color), **medulla** (center)

## Key points
Knowing these structures helps beauty workers give safe services and spot problems — for example, never cutting the cuticle too deeply or injuring the matrix.`,
        "Draw and label the parts of the nail, a cross-section of the skin, and a hair strand. Explain the job of each part.",
        [
          "What protein are nails and hair made of?",
          "Why must the nail matrix be protected?",
          "Name the three layers of the skin.",
        ],
      ),
      lesson(
        "Careers and Businesses in Beauty Care and Wellness",
        "Jobs and businesses in the beauty and wellness industry.",
        `## Careers
- **Manicurist / pedicurist** and **nail technician**
- **Hairdresser / hairstylist** and **barber**
- **Beautician / beauty care specialist**
- **Make-up artist** — weddings, events, film and TV
- **Massage therapist** and **spa therapist**
- **Esthetician** — skin care
- **Salon or spa manager** and **receptionist**
- **Beauty product sales representative** and **trainer**
- Work abroad — salons, spas, hotels and **cruise ships** hire Filipino therapists

## Business opportunities
- **Home-service** manicure, pedicure and hand and foot spa
- **Nail salon**, **barbershop**, small **beauty parlor**
- **Mobile make-up** for events
- **Spa** and massage center
- Selling beauty products and homemade **scrubs and soaps**

## Training and certificates
TESDA offers **Beauty Care NC II** (nail, skin and hand/foot spa services), **Hairdressing NC II**, and **Massage Therapy NC II**.

## Qualities needed
Cleanliness, courtesy, patience, good communication, artistic skill, honesty and willingness to keep learning new trends.

## Key points
Beauty and wellness offer many careers and small businesses — skill, cleanliness and good service bring loyal customers.`,
        "Interview a manicurist, barber or beautician (or research online). Make a career profile: tasks, skills, training, and income opportunities.",
        [
          "Give three careers in beauty care and wellness.",
          "Which TESDA qualification covers nail care and hand spa?",
          "What qualities make a good beauty care worker?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which is a WELLNESS service?",
        ["Haircut", "Massage", "Nail polish", "Hair coloring"],
        1,
        "Wellness services such as massage care for the body and mind.",
      ),
      q(
        "Nails and hair are made of…",
        ["calcium", "keratin", "collagen", "melanin"],
        1,
        "Both nails and hair are made of keratin, a hard protein.",
      ),
      q(
        "The part of the nail where growth happens is the…",
        ["free edge", "matrix", "nail plate", "lunula"],
        1,
        "The matrix produces new nail cells; injuring it affects growth.",
      ),
      q(
        "Which layer of the skin contains sweat and oil glands?",
        ["Epidermis", "Dermis", "Nail bed", "Cuticle"],
        1,
        "The dermis holds blood vessels, nerves, glands and hair follicles.",
      ),
      q(
        "Which TESDA qualification covers nail care and hand and foot spa?",
        [
          "Beauty Care NC II",
          "Electrical Installation NC II",
          "Cookery NC II",
          "Driving NC II",
        ],
        0,
        "Beauty Care NC II covers nail care, skin care and hand and foot spa services.",
      ),
    ],
  },
  // Week 2
  {
    title: "Laws, Trends and Challenges",
    description:
      "The legal basis of beauty care and wellness services, and their trends, issues and challenges.",
    lessons: [
      lesson(
        "Legal Basis of Beauty Care and Wellness Services",
        "The laws and rules that protect workers and clients.",
        `## Why laws matter
Beauty and wellness services touch the body and use chemicals, so laws protect **clients**, **workers** and **businesses**.

## Laws and rules
- **Code on Sanitation of the Philippines (PD 856)** — beauty parlors, barbershops and massage clinics need a **sanitary permit**; workers need a **health certificate**; tools must be kept clean and sanitized
- **FDA Act of 2009 (RA 9711)** — the **Food and Drug Administration** regulates **cosmetics**; products must be notified/registered and safe
- **Consumer Act of the Philippines (RA 7394)** — protects consumers from unsafe products and deceptive sales practices
- **Occupational Safety and Health Standards Law (RA 11058)** — employers must keep workplaces safe and train workers
- **Anti-Sexual Harassment Act (RA 7877)** and **Safe Spaces Act (RA 11313)** — protect clients and workers from sexual harassment in the workplace and in public spaces; salons and spas must keep services professional and respectful
- **TESDA** training regulations — **Beauty Care NC II**, Hairdressing NC II, Massage Therapy NC II set the standards of competency
- **Business registration** — DTI or SEC registration, **mayor's/business permit**, BIR registration

## Ethics in service
Respect the client's privacy and body, ask consent before any service, explain prices honestly, and refuse services that could harm the client.

## Key points
Permits, safe products, clean tools, professional conduct and certified skills are not just good practice — they are required by law.`,
        "In groups, make a checklist of permits and rules a new nail salon in your town must follow, and the law behind each one.",
        [
          "Which agency regulates cosmetics in the Philippines?",
          "What permit does PD 856 require for beauty parlors?",
          "Why are RA 7877 and RA 11313 important in salons and spas?",
        ],
      ),
      lesson(
        "Trends, Issues and Challenges",
        "What is new in the industry, and its problems.",
        `## Trends
- **Nail art** and gel, acrylic and press-on nails
- **Natural and organic** products; **vegan** and cruelty-free cosmetics
- **Wellness and self-care** — spa days, mental-health relaxation
- **Men's grooming** — barbershops, men's skin care
- **Home-service** and booking through apps and social media
- **Social media marketing** — Facebook, TikTok, Instagram showcases
- **Korean-inspired** skin care and hair styles
- **Eco-friendly** salons — less waste, refillable products

## Issues
- **Unsanitary practices** that spread infections (fungal nail infection, warts, hepatitis from unsterilized tools)
- **Fake or unregistered** cosmetics sold online
- **Unlicensed** practitioners without training
- **Allergic reactions** and chemical burns from improper use
- **Harassment** and unprofessional conduct
- Low pay and long hours for some workers

## Challenges
- Keeping up with fast-changing **trends and technology**
- **Competition** from many salons and home-service workers
- Rising **cost** of products and rent
- Meeting **health and safety** standards
- Building **customer trust** and loyalty

## Key points
Follow trends wisely, but never trade safety, legality and professionalism for popularity.`,
        "Find one current beauty trend on social media. Present what it is, why it is popular, and any safety issue a beauty worker must watch out for.",
        [
          "Give three current trends in beauty care and wellness.",
          "What health problems can unsanitary tools cause?",
          "How can a beauty worker deal with competition?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which agency regulates cosmetics in the Philippines?",
        ["DPWH", "FDA", "PAGASA", "LTO"],
        1,
        "The Food and Drug Administration (RA 9711) regulates cosmetics.",
      ),
      q(
        "Under the Code on Sanitation (PD 856), beauty parlor workers need a…",
        [
          "driver's license",
          "health certificate",
          "passport",
          "fishing license",
        ],
        1,
        "Workers in personal-service establishments must have health certificates.",
      ),
      q(
        "Which law protects workers and clients from sexual harassment in the workplace?",
        ["RA 7877", "RA 10654", "RA 9711", "PD 856"],
        0,
        "RA 7877, the Anti-Sexual Harassment Act, together with the Safe Spaces Act (RA 11313).",
      ),
      q(
        "Which is an ISSUE in beauty care services?",
        [
          "Using sterilized tools",
          "Selling fake, unregistered cosmetics",
          "Getting TESDA certification",
          "Natural products",
        ],
        1,
        "Fake, unregistered cosmetics can harm clients and are illegal.",
      ),
      q(
        "Booking beauty services through apps and social media is a…",
        ["trend", "law", "disease", "tool"],
        0,
        "Online booking and home-service are current trends in the industry.",
      ),
    ],
  },
  // Week 3
  {
    title: "Tools, Sanitation and Safety",
    description:
      "Tools, implements, materials and equipment; sanitation and maintenance; and OSH practices.",
    lessons: [
      lesson(
        "Tools, Implements, Materials and Equipment",
        "What beauty care workers use.",
        `## Implements (small reusable tools)
- **Nail cutter / nail nipper** — trims nails and hangnails
- **Cuticle pusher** — pushes back the cuticle
- **Cuticle nipper** — trims dead skin (never living tissue)
- **Nail file / emery board** — shapes the nails (emery boards are single-use)
- **Orangewood stick** — cleans under nails, applies products (single-use)
- **Tweezers**, **scissors**, **combs and brushes**

## Materials (used up)
- **Cotton**, **tissue**, **towels**
- **Nail polish**, **base coat**, **top coat**, **polish remover (acetone)**
- **Cuticle oil / remover**, **lotion**, **hand scrub**, **hand mask**
- **Alcohol (70%)** and **disinfectant**, **soap**

## Tools and equipment
- **Finger bowl** (soaking hands), **foot basin**
- **Manicure table / tray** and **client's cushion**
- **Sterilizer or UV sanitizer cabinet**, **autoclave** in bigger salons
- **Hair dryer**, **steamer**, **paraffin wax heater**
- **Towel cabinet** and **trash bin with cover**

## Using them properly
Use each item only for its purpose, check it before use, and keep sharp implements away from the client's eyes and face.

## Key points
Know the right tool, implement, material and equipment for each task — and keep them clean.`,
        "Make a tools catalog: picture, name, classification (tool, implement, material or equipment) and use.",
        [
          "What is the difference between an implement and a material?",
          "What is a cuticle pusher used for?",
          "Which items are single-use and must be thrown away after one client?",
        ],
      ),
      lesson(
        "Sanitation and Maintenance",
        "Keeping the workplace and tools clean and safe.",
        `## Three levels of cleaning
- **Sanitation (cleaning)** — removes dirt with soap and water
- **Disinfection** — kills most germs on surfaces and implements (approved disinfectant, 70% alcohol)
- **Sterilization** — kills **all** germs, including spores (autoclave)

## Cleaning metal implements
- **Wash** with soap and water, scrubbing with a brush
- **Rinse** and **dry**
- **Disinfect** — fully immerse in an approved disinfectant for the required time (or wipe with 70% alcohol)
- **Store** in a clean, covered container or UV sanitizer cabinet

## Single-use items
Emery boards, orangewood sticks, cotton and buffers that can't be disinfected must be **thrown away** after each client.

## Workplace
- Clean the work station before and after each client
- Use **clean towels** for every client; launder used towels in hot water
- Empty trash bins regularly; keep a **covered** bin
- Keep products **closed and labeled**; store chemicals away from heat
- Wash hands **before and after** every service

## Maintenance
Check implements for rust and damage; oil hinges of nippers; sharpen or replace dull tools; check electrical equipment cords and plugs.

## Key points
Clean, disinfect, store — every tool, every client, every time. Sanitation protects clients from infections.`,
        "Demonstrate the steps in cleaning and disinfecting a set of manicure implements, then show how to store them properly.",
        [
          "What is the difference between disinfection and sterilization?",
          "List the steps in cleaning metal implements.",
          "Why must emery boards be thrown away after use?",
        ],
      ),
      lesson(
        "Occupational Safety and Health in Beauty Care",
        "Hazards in salons and spas and how to prevent them.",
        `## Hazards
- **Biological** — bacteria, viruses and fungi passed through cuts and unsanitized tools
- **Chemical** — fumes from acetone and polish, skin irritation and allergies from products, burns from hair chemicals
- **Physical** — cuts from sharp implements, burns from hot water, wax and dryers, slips on wet floors
- **Electrical** — damaged cords, wet hands on appliances
- **Ergonomic** — back, neck and wrist pain from bending and repetitive motions
- **Fire** — flammable products near heat

## Safety practices
- Wear a **clean uniform, apron and mask**; use **gloves** when handling chemicals or when there is a risk of blood
- Keep the room **well ventilated**
- **Read labels**; do a **patch test** for new products; never mix chemicals
- **Test water temperature** before soaking a client's hands or feet
- Handle sharp implements carefully; never use them on broken skin
- Keep floors **dry**; clean spills right away
- Unplug equipment after use; keep cords away from water
- Sit properly; adjust chair and table height; take short stretching breaks
- Keep a **first-aid kit** and know the emergency exits

## Contraindications
Don't give a service if the client has **open wounds, infections, swelling or skin disease** in the area — refer them to a doctor.

## Key points
Safety protects both the worker and the client: identify hazards, use PPE, and follow safe procedures.`,
        "Hazard hunt: study a picture of a salon and identify the hazards, their type, and the safety practice for each.",
        [
          "Give one example each of a biological, chemical and physical hazard in a salon.",
          "What is a patch test and why is it done?",
          "When should a beauty worker refuse to give a service?",
        ],
      ),
    ],
    quiz: [
      q(
        "Which is an IMPLEMENT?",
        ["Nail polish", "Cuticle pusher", "Cotton", "Lotion"],
        1,
        "Implements are small reusable tools; polish, cotton and lotion are materials.",
      ),
      q(
        "Which kills ALL germs, including spores?",
        ["Sanitation", "Disinfection", "Sterilization", "Rinsing"],
        2,
        "Sterilization (for example with an autoclave) kills all microorganisms.",
      ),
      q(
        "Which item must be thrown away after one client?",
        ["Metal cuticle pusher", "Emery board", "Finger bowl", "Nail nipper"],
        1,
        "Porous emery boards can't be disinfected, so they are single-use.",
      ),
      q(
        "Acetone fumes are what kind of hazard?",
        ["Biological", "Chemical", "Ergonomic", "Electrical"],
        1,
        "Fumes from acetone and other products are chemical hazards.",
      ),
      q(
        "A client has an infected wound on her hand. The worker should…",
        [
          "continue the hand spa",
          "refuse the service and refer the client to a doctor",
          "cover it with polish",
          "massage it harder",
        ],
        1,
        "Infections and open wounds are contraindications for hand spa services.",
      ),
    ],
  },
  // Week 4
  {
    title: "Hand Spa Services",
    description: "Performing a hand spa following safety precautions.",
    lessons: [
      lesson(
        "Performing Hand Spa Services",
        "A relaxing, cleansing hand treatment, step by step.",
        `## What is a hand spa?
A **hand spa** cleans, exfoliates, nourishes and relaxes the hands with soaking, scrubbing, a mask and massage.

## Preparation
- Sanitize the work station and wash your hands
- Prepare: finger bowl with **warm water** (test the temperature!), towels, hand scrub, hand mask (for example milk and oatmeal or a clay mask), lotion or cream, cotton, plastic gloves or wrap
- **Consult** the client: check the hands for **wounds, infections or allergies** (contraindications)
- Ask the client to **remove jewelry**

## Procedure
- **Sanitize** the client's hands
- **Soak** the hands in warm water for about 3–5 minutes
- **Scrub** — apply the hand scrub and rub in gentle **circular motions** to remove dead skin
- **Rinse** and pat dry
- **Mask** — apply the hand mask; wrap in plastic and a warm towel for about 10 minutes
- **Remove** the mask with a warm, damp towel
- **Massage** with lotion or cream using the basic movements:
  - **Effleurage** — light, long strokes
  - **Petrissage** — kneading
  - **Friction** — small circular rubbing
  - Finger pulls and rotations of the wrist and fingers
- **Finish** — wipe off excess lotion; offer a nail polish if requested

## After the service
Clean and sanitize tools; dispose of single-use items; record the service; thank the client and give after-care advice (drink water, avoid harsh soaps).

## Safety
Test water temperature, don't massage over wounds or swollen joints, ask about allergies to scrub or mask ingredients, and keep the area dry.

## Key points
Prepare, consult, soak, scrub, mask, massage, finish — safely and hygienically.`,
        "Perform a hand spa on a classmate following the steps, safety precautions and sanitation rules. Your teacher will rate you with a checklist (performance task).",
        [
          "Why must the water temperature be tested?",
          "List the steps of a hand spa in order.",
          "What is the difference between effleurage and petrissage?",
        ],
      ),
    ],
    quiz: [
      q(
        "What should be done FIRST before a hand spa?",
        [
          "Apply the mask",
          "Consult the client and check for contraindications",
          "Massage the hands",
          "Polish the nails",
        ],
        1,
        "Checking the hands first prevents giving a service that could harm the client.",
      ),
      q(
        "The scrub is rubbed in…",
        [
          "hard, fast strokes",
          "gentle circular motions",
          "only one direction",
          "with a nail file",
        ],
        1,
        "Gentle circular motions exfoliate without irritating the skin.",
      ),
      q(
        "Light, long massage strokes are called…",
        ["petrissage", "effleurage", "tapotement", "friction"],
        1,
        "Effleurage is light stroking; petrissage is kneading.",
      ),
      q(
        "Why should the client remove jewelry?",
        [
          "To make the hands lighter",
          "So products and massage can reach the skin and jewelry isn't damaged",
          "Because it is a law",
          "To pay for the service",
        ],
        1,
        "Removing jewelry allows proper cleaning and massage and protects the jewelry.",
      ),
      q(
        "After the service, single-use items should be…",
        [
          "kept for the next client",
          "thrown away",
          "washed and reused",
          "given to the client",
        ],
        1,
        "Single-use items are disposed of to prevent spreading infection.",
      ),
    ],
  },
  // Week 5
  {
    title: "Introduction to Making Garments",
    description:
      "Concepts in making garments, and their supplies and materials.",
    lessons: [
      lesson(
        "Concepts in Making Garments",
        "Garments, fabrics and how clothes are made.",
        `## What are garments?
**Garments** are pieces of clothing made by cutting and sewing fabric — blouses, shirts, skirts, pants, dresses, uniforms, and household items like aprons and pillowcases.

## Kinds of garments
- **By use:** casual wear, formal wear, school and work **uniforms**, sleepwear, sportswear, protective wear (aprons)
- **By who wears them:** men's, women's, children's
- **Parts of a garment:** bodice, sleeves, collar, skirt, waistband, pockets, closures (buttons, zippers)

## Fabrics
- **Natural fibers:** **cotton** (cool, absorbent), **linen**, **silk**, **wool**, and Philippine fibers **piña** and **abaca**
- **Synthetic (man-made) fibers:** **polyester**, **nylon**, **acrylic**; **rayon** is made from wood pulp
- **Woven fabric** — threads cross at right angles (cotton cloth, denim); firm
- **Knitted fabric** — interlocking loops (t-shirt material); stretchy
- **Grain** — the direction of the threads; patterns are laid along the **lengthwise grain**

## Steps in making a garment
Choose the design → take **body measurements** → draft or buy a **pattern** → prepare and lay out the fabric → **cut** → mark → **sew** → **finish** (hems, buttons) → **press**.

## Key points
Good garments come from the right fabric, accurate measurements and careful, step-by-step work.`,
        "Examine three garments at home. Identify the kind of garment, its parts, and the fabric (check the label: cotton, polyester…).",
        [
          "What is the difference between woven and knitted fabric?",
          "Give two natural and two synthetic fibers.",
          "List the steps in making a garment.",
        ],
      ),
      lesson(
        "Supplies and Materials for Making Garments",
        "The tools and supplies of sewing.",
        `## Measuring tools
- **Tape measure** — body and fabric measurements
- **Ruler / yardstick**, **L-square**, **French curve** and **hip curve** — drafting patterns

## Marking tools
- **Tailor's chalk** — marks on fabric
- **Tracing wheel** and **tracing paper (carbon)** — transfer pattern lines
- **Pencil** and **pattern paper (manila paper)**

## Cutting tools
- **Dressmaker's shears** — cutting fabric only
- **Scissors** — paper and threads
- **Pinking shears** — zigzag edges that prevent fraying
- **Seam ripper** — removes wrong stitches

## Sewing tools
- **Hand needles** and **machine needles**
- **Pins** and **pin cushion**
- **Thimble** — protects the finger
- **Sewing machine**
- **Iron and ironing board** — pressing seams

## Supplies (materials used up)
- **Fabric** and **thread** (matching color and fiber)
- **Closures** — buttons, zippers, hooks and eyes, snaps, velcro
- **Elastic**, **interfacing** (stiffens collars and cuffs), **bias tape**, lace and trims

## Care of tools
Keep shears sharp and use them only for fabric; keep pins in a cushion; oil and cover the sewing machine; store tools in a sewing box.

## Key points
Measuring, marking, cutting and sewing tools — the right supplies make sewing accurate and safe.`,
        "Make a sewing kit list with pictures: name, use and how to care for each item. Group them by measuring, marking, cutting and sewing.",
        [
          "What are pinking shears used for?",
          "Why should dressmaker's shears be used only on fabric?",
          "Give three kinds of closures.",
        ],
      ),
    ],
    quiz: [
      q(
        "Which fabric is made of interlocking loops and is stretchy?",
        ["Woven", "Knitted", "Linen", "Denim"],
        1,
        "Knitted fabric (like t-shirt material) is made of loops and stretches.",
      ),
      q(
        "Which is a NATURAL fiber?",
        ["Polyester", "Nylon", "Cotton", "Acrylic"],
        2,
        "Cotton comes from a plant; the others are synthetic.",
      ),
      q(
        "Which tool removes wrong stitches?",
        ["Thimble", "Seam ripper", "Tracing wheel", "L-square"],
        1,
        "A seam ripper cuts and removes stitches.",
      ),
      q(
        "Which tool transfers pattern lines onto fabric?",
        ["Tracing wheel", "Pin cushion", "Iron", "Thimble"],
        0,
        "A tracing wheel with tracing paper marks pattern lines on fabric.",
      ),
      q(
        "Which comes FIRST in making a garment?",
        [
          "Sewing the seams",
          "Taking body measurements",
          "Pressing",
          "Attaching buttons",
        ],
        1,
        "Accurate measurements are needed before drafting a pattern and cutting.",
      ),
    ],
  },
  // Weeks 6–8
  {
    title: "Pattern Drafting and Handicrafts",
    description:
      "Applying pattern drafting principles, and the concepts, supplies and materials of handicrafts.",
    lessons: [
      lesson(
        "Pattern Drafting",
        "Making a paper pattern from measurements.",
        `## What is pattern drafting?
**Pattern drafting** is making a **paper pattern** of a garment from **body measurements**, using drafting tools. The pattern is the guide for cutting fabric.

## Principles
- **Take accurate measurements** — over light clothing, tape measure snug but not tight; record them (for example bust, waist, hip, length)
- **Use the right tools** — ruler, **L-square** for right angles, **French curve** and **hip curve** for curved lines, pencil, **manila or pattern paper**
- **Add ease** — a little extra room so the garment is comfortable to move in
- **Add seam allowance** — usually about **1–1.5 cm** on seams and **2.5–5 cm** for hems
- **Mark the grainline** — an arrow showing how to place the pattern along the lengthwise grain
- **Label every piece** — name (front, back), size, "cut 2" or "place on fold", center front/back
- **Check and true** — compare measurements; make sure joining seams match

## Example: an apron or pillowcase pattern
- Draw a rectangle using the measurements (for example a pillowcase: pillow width + allowance, and length × 2 + hem)
- Mark the fold line, seam allowances and the hem
- Label and cut out the pattern; pin it on the fabric along the grain; cut and sew

## Safety
Handle scissors and pins carefully; keep pins in a cushion; work on a clean, flat table; keep the floor free of pins.

## Key points
Measure accurately, draft neatly, add allowances, mark grain and labels — a good pattern makes a good garment.`,
        "Draft a simple pattern (pillowcase or apron) on manila paper using your measurements, with seam allowances, grainline and labels (performance task).",
        [
          "Why is seam allowance added to a pattern?",
          "What is the L-square used for?",
          "What information should be written on each pattern piece?",
        ],
      ),
      lesson(
        "Concepts in Making Handicrafts",
        "Handmade products and the principles behind good design.",
        `## What are handicrafts?
**Handicrafts** are useful or decorative products made mainly **by hand**, with simple tools, often using **local materials**. They show a people's **culture and creativity**.

## Philippine handicrafts
- **Weaving** — banig (mats) from buri and pandan, abaca products, rattan and bamboo baskets
- **Embroidery** — calado and Lumban embroidery on piña and jusi
- **Woodcraft** — Paete wood carving
- **Pottery** and **clay** products
- **Shell craft**, **beadwork**, **coconut** crafts
- **Paper craft** and **recycled crafts** — bags, boxes, decorations from plastic, paper and cloth scraps

## Elements and principles of design
- **Elements:** line, shape, color, texture, size
- **Principles:**
  - **Balance** — even distribution of visual weight
  - **Proportion** — parts are in good size relation to each other
  - **Harmony (unity)** — all parts look like they belong together
  - **Emphasis** — a center of interest
  - **Rhythm** — repeated patterns that lead the eye

## Good handicrafts are
**Useful**, **attractive**, **well-made** (neat, durable), and made with **appropriate, affordable materials** — and they can be sold as a livelihood.

## Key points
Handicrafts combine skill, design principles and local materials to make beautiful, useful products.`,
        "Find three Philippine handicrafts (from your home or online). Identify the material, the craft technique, and one design principle each shows.",
        [
          "What are handicrafts?",
          "Give three Philippine handicrafts and their materials.",
          "What is the difference between balance and emphasis in design?",
        ],
      ),
      lesson(
        "Supplies and Materials for Making Handicrafts",
        "Natural, synthetic and recycled materials, and the tools to work them.",
        `## Natural materials
- **Plant fibers** — abaca, buri, pandan, rattan, bamboo, coconut leaves, water hyacinth
- **Wood**, **coconut shells**, **seeds**, **shells**, **clay**, **dried flowers**

## Synthetic and recycled materials
- **Plastic** (bottles, sachets, straws), **paper** (old magazines, newspapers, boxes), **cloth scraps**, **yarn**, **beads**, **wire**
- Using recycled materials reduces waste and lowers cost

## Supplies
- **Glue** (white glue, glue stick, glue gun sticks), **thread**, **yarn**, **paint**, **varnish**, **ribbons**, **lace**, **buttons**

## Tools
- **Cutting:** scissors, **cutter**, pliers, wire cutter
- **Measuring:** ruler, tape measure
- **Joining:** needles, **glue gun**, stapler
- **Shaping:** sandpaper, file, hammer
- **Cutting mat** to protect the table

## Choosing materials
Choose materials that are **available locally**, **affordable**, **durable**, suitable for the **use** of the product, and **safe**.

## Safety
Cut away from your body; keep the cutter blade retracted when not in use; be careful with the hot glue gun (burns); work in a ventilated area when painting or varnishing; clean up scraps.

## Key points
Local natural and recycled materials, the right tools and safe work habits make good handicrafts.`,
        "Collect materials (natural or recycled) available at home or in school. Classify them and suggest a handicraft product each could become.",
        [
          "Give three natural and three recycled materials for handicrafts.",
          "What safety precaution should be followed with a glue gun?",
          "Why use local and recycled materials?",
        ],
      ),
    ],
    quiz: [
      q(
        "The extra fabric added around a pattern for joining seams is the…",
        ["ease", "seam allowance", "grainline", "hem"],
        1,
        "Seam allowance is the extra margin where the seam is sewn.",
      ),
      q(
        "Which tool draws right angles in pattern drafting?",
        ["French curve", "L-square", "Tracing wheel", "Thimble"],
        1,
        "The L-square makes accurate right angles.",
      ),
      q(
        "Banig is woven from…",
        ["plastic only", "buri or pandan leaves", "wire", "metal sheets"],
        1,
        "Banig mats are traditionally woven from buri or pandan.",
      ),
      q(
        "The design principle that creates a center of interest is…",
        ["balance", "rhythm", "emphasis", "proportion"],
        2,
        "Emphasis draws the eye to the most important part of the design.",
      ),
      q(
        "Which is a RECYCLED handicraft material?",
        ["Fresh abaca", "Old magazines", "New wood", "Clay"],
        1,
        "Old magazines can be reused for paper crafts.",
      ),
    ],
  },
  // Weeks 9–10
  {
    title: "Making Handicrafts",
    description:
      "Applying the principles of making handicrafts following safety precautions.",
    lessons: [
      lesson(
        "Making a Handicraft Project",
        "From a plan to a finished product.",
        `## Plan the project
- **Choose a product** that is useful or decorative: a woven placemat, a recycled paper bag or box, a beaded keychain, a pencil holder from bottles
- Make a **design sketch** with measurements
- List the **materials, tools and steps**
- Compute the **cost** of materials

## Make it
- **Prepare** the work area and materials
- **Measure and mark** accurately
- **Cut** carefully
- **Assemble and join** — weave, sew, glue or tie
- **Finish** — trim loose ends, sand rough edges, paint or varnish, add decorations

## Apply the principles
- **Balance and proportion** — the parts fit well together
- **Harmony** — colors and materials match
- **Emphasis** — a focal point, such as a design in the center
- **Neatness and durability** — no glue marks, strong joints

## Evaluate
Check the product against a **rubric**: design, workmanship, use of materials, neatness, creativity, and time. Ask: Is it useful? Is it attractive? Would someone buy it? Compute a **selling price** (cost of materials + labor + a reasonable profit).

## Safety precautions
Use tools properly; cut away from the body; handle the glue gun with care; keep the work area clean; wash hands after using paint or varnish; put tools back in place.

## Key points
Plan, make, finish and evaluate — a handicraft made with good design and safe work can become a small business.`,
        "Make a handicraft project (from natural or recycled materials) following your plan and safety precautions. Present your product with its cost and suggested selling price (performance task).",
        [
          "What should be included in a project plan?",
          "How can you make a handicraft neat and durable?",
          "How do you compute the selling price of your product?",
        ],
      ),
    ],
    quiz: [
      q(
        "What is the FIRST step in making a handicraft project?",
        [
          "Painting",
          "Planning — choosing the product and sketching the design",
          "Selling",
          "Varnishing",
        ],
        1,
        "Planning comes first: product, sketch, materials, steps and cost.",
      ),
      q(
        "Trimming loose ends and sanding rough edges is part of…",
        ["planning", "finishing", "measuring", "selling"],
        1,
        "Finishing makes the product neat, safe and attractive.",
      ),
      q(
        "A tool used to judge the finished project against criteria is a…",
        ["rubric", "glue gun", "cutter", "sketch"],
        0,
        "A rubric lists the criteria and levels for evaluating the project.",
      ),
      q(
        "Selling price is computed from…",
        [
          "cost of materials + labor + profit",
          "only the color",
          "the size of the room",
          "the number of tools",
        ],
        0,
        "Add the costs and a reasonable profit to set the price.",
      ),
      q(
        "Which is a safe practice when using a cutter?",
        [
          "Cut toward your body",
          "Cut away from your body and retract the blade after use",
          "Leave the blade open on the table",
          "Use it as a screwdriver",
        ],
        1,
        "Cutting away from the body and retracting the blade prevent cuts.",
      ),
    ],
  },
];

/** TLE 8 – Family and Consumer Science. */
export const familyAndConsumerScience8: DemoSubject = {
  key: "TLE8-FCS",
  code: "TLE 8-FCS",
  name: "TLE 8 – Family and Consumer Science",
  department: TLE_DEPARTMENT,
  description:
    "Beauty care and wellness, hand spa, garments and handicrafts (DepEd Budget of Work, Grade 8, Second Term).",
  colorToken: "rose",
  units: UNITS,
};
