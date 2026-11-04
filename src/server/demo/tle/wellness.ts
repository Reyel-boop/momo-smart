/**
 * Health and Wellness Massage — the TLE: FCS sector for Grade 9 or 10, from
 * DepEd's Budget of Work: wellness massage (weeks 1–6), then caregiving for
 * newborns, infants and toddlers (weeks 7–10). One lesson per week, each with
 * a lecture video, a written lecture, a class activity and a self-check, and
 * every unit five Unit Questions and five more for Live Quiz. Learners are
 * minors, so massage practice stays clothed, on the hands, arms and shoulders,
 * with consent and a teacher present; baby care is practiced on a doll.
 */
import type { DemoSubject, DemoUnit } from "../grade10";
import { q, tleLesson, TLE_DEPARTMENT } from "./common";

const UNITS: DemoUnit[] = [
  {
    title: "Wellness Massage",
    description:
      "The origin of wellness, health benefits of massage, workplace requirements, types of massage, pre-massage services, and safe massage steps.",
    lessons: [
      tleLesson(
        "The Origin of Wellness and Its Services",
        "How massage began, and what wellness means today.",
        "vaEDoL1M99E",
        `## What is wellness?
**Wellness** is actively caring for your whole health, not just avoiding sickness. **Massage** is the skilled use of the hands to press and rub the body's soft tissues, so as to relax and refresh a person.

## A short history
- **China** — ancient medical texts describe massage as treatment.
- **India** — **Ayurveda** used oil massage for health.
- **Egypt, Greece and Rome** — Hippocrates, the Greek physician, wrote about the benefits of rubbing the body.
- **Japan** — **shiatsu** developed from Chinese practices.
- **Sweden, 1800s** — Per Henrik Ling is linked with the movements behind **Swedish massage**, with terms later standardized by Johan Mezger.
- **Philippines** — **hilot** is our traditional healing art, passed down by *manghihilot*.

## Wellness services today
- **Massage** in spas and clinics
- **Hilot** and other traditional practices
- **Hand and foot care**
- **Facials** and body scrubs
- **Yoga, fitness and stress management**

## Training
**TESDA** offers qualifications in this field, including Massage Therapy NC II. Professionals need training, because massage done wrongly can cause harm.`,
        `## Wellness Timeline
Make a timeline showing how massage developed in at least four parts of the world, including the Philippines.

## Wellness in Our Community
List the wellness services found in your town, and who provides them.`,
        [
          "What is wellness?",
          "What is hilot?",
          "Give two ancient cultures that practiced massage.",
        ],
      ),
      tleLesson(
        "Health Benefits of Wellness Massage",
        "What massage does for the body and mind.",
        "oafVBadlgnE",
        `## Benefits for the body
- **Relaxes tight muscles** and eases soreness
- **Improves blood circulation**
- **Helps the body feel less tired**
- **Improves flexibility**

## Benefits for the mind
- **Reduces stress** and tension
- **Improves mood**
- **Helps people rest and sleep better**

## The dimensions of wellness
Wellness covers more than the body:
1. **Physical** — a healthy body
2. **Emotional** — managing feelings
3. **Intellectual** — a clear, active mind
4. **Social** — healthy relationships
5. **Spiritual** — a sense of purpose
6. **Occupational** — satisfaction in work
7. **Environmental** — healthy surroundings

Massage most directly helps the **physical** and **emotional** dimensions, and a rested person does better in the others too.

## A word of care
Massage **supports** health, but it **doesn't cure diseases**. It is no substitute for a doctor. A good provider never promises a cure.`,
        `## Benefits Chart
Make a chart with two columns, body and mind. List the benefits of wellness massage under each.

## Seven Dimensions Reflection
Choose two dimensions of wellness, and write how you can improve each one this week.`,
        [
          "Give three physical benefits of massage.",
          "Name the seven dimensions of wellness.",
          "Why should a massage provider never promise a cure?",
        ],
      ),
      tleLesson(
        "Workplace Requirements and Policies for a Wellness Facility",
        "What a clean, safe, professional wellness facility needs.",
        "aK3vIddFAHQ",
        `## Business requirements
A wellness facility needs a **mayor's permit** and a **sanitary permit** from the local government. Staff need **health certificates**, and therapists need proper **training**. Rules differ among cities, so always check with the local office.

## The facility
- **Clean rooms** with good air and lighting
- **Reception area** with client records
- **Private treatment areas** that are well kept and professional
- **Clean linen**, stored apart from used linen
- **Handwashing area** and restrooms
- **First aid kit** and **fire exits**

## Policies
A **standard operating procedure (SOP)** is a written, step-by-step way of doing a task, so that everyone does it the same way.

- **Hygiene** — wash hands before and after each client; use fresh linen for each client
- **Grooming** — clean uniform, short nails, tied hair, no strong perfume
- **Client consent** — explain the service and ask permission first
- **Privacy** — keep client records private, as the Data Privacy Act requires
- **Professional conduct** — services are for health and relaxation only; any improper request is refused and reported
- **Safety** — keep floors dry and oils capped

## Client rights
Clients may ask questions, say what they are comfortable with, and **stop the service at any time**.`,
        `## Facility Checklist
Create a checklist of requirements for a clean, safe and professional wellness facility.

## Write an SOP
In groups, write a short step-by-step SOP for preparing a treatment area before a client arrives.`,
        [
          "What is an SOP?",
          "Give four hygiene or grooming rules for therapists.",
          "What right does a client have during a service?",
        ],
      ),
      tleLesson(
        "Types of Massage",
        "Different styles and the basic strokes.",
        "XTzBTXITL54",
        `## Common types of massage
- **Swedish** — long, flowing strokes for relaxation
- **Shiatsu** — Japanese; finger pressure on set points
- **Thai** — stretching and pressure, done on a mat
- **Hilot** — Filipino; uses warm oil and the hands, often with banana leaves
- **Reflexology** — pressure on points of the feet or hands
- **Deep tissue** — slow, firm pressure on deeper muscles (for trained therapists only)
- **Sports** — for athletes' muscles
- **Aromatherapy** — uses scented oils for relaxation

## The five basic strokes
| Stroke | Name | What it is |
|---|---|---|
| Gliding | **Effleurage** | Long, smooth strokes |
| Kneading | **Petrissage** | Lifting and squeezing muscle |
| Rubbing | **Friction** | Small, deep circular rubs |
| Tapping | **Tapotement** | Quick, light tapping |
| Shaking | **Vibration** | Fast, gentle shaking |

A massage usually **starts and ends with effleurage**, because it warms the muscles and calms the client.

## Choosing a type
Think about what the client needs, and whether it is safe for them. A therapist must only do what they were trained to do.`,
        `## Massage Types Matching
Match each type of massage to its country of origin and main feature.

## Strokes Demonstration
Watch your teacher demonstrate the five strokes on a practice surface, such as a rolled towel. Name each stroke and describe it.`,
        [
          "Which massage is from the Philippines?",
          "Name the five basic strokes.",
          "Why does a massage begin with effleurage?",
        ],
      ),
      tleLesson(
        "Pre-Massage Services",
        "Everything done before the massage begins.",
        "egLA0Qu0BoA",
        `## Why pre-massage services matter
What happens before a massage keeps the client **safe and comfortable**, and helps the therapist choose the right service.

## Steps before a massage
1. **Prepare the area** — clean surfaces, fresh linen, comfortable temperature, soft lighting.
2. **Prepare yourself** — wash your hands, trim your nails, remove rings and watches, wear a clean uniform.
3. **Prepare the supplies** — towels, oil or lotion, and alcohol or sanitizer.
4. **Greet the client** — smile, and introduce yourself.
5. **Do the client consultation** — fill in a form with the client's health details.
6. **Explain the service** — what will happen and how long it will take.
7. **Get consent** — the client agrees to the service and the areas to be worked on.

## The client consultation
Ask about current **pain or injury**, **allergies**, **medical conditions**, **medicines** and what the client **wants** from the session.

## Contraindications
A **contraindication** is a condition that makes massage unsafe. Don't massage, and suggest seeing a doctor, if the client has:
- **Fever** or a contagious illness
- **Open wounds** or skin infections
- A recent **injury, fracture** or swelling
- **Blood clots** or serious heart problems

Pregnancy and long-term illnesses need a doctor's advice first.

When in doubt, **don't proceed**.`,
        `## Consultation Form
Design a simple client consultation form with the questions a therapist should ask.

## Yes or No?
Read short client stories, and decide whether massage is safe or should wait. Explain your answer.`,
        [
          "Why remove rings before a massage?",
          "What is a contraindication?",
          "Give three contraindications of massage.",
        ],
      ),
      tleLesson(
        "Steps in Providing Wellness Massage with Safety Precautions",
        "Performing a basic massage safely and respectfully.",
        "hOz4k6wBzww",
        `## Practice in school
In class, you practice a **simple hand, arm and shoulder massage**, fully clothed and with your teacher present. Partners must agree first, and either one may stop at any time. No other body area is used.

## Steps in a basic hand and arm massage
1. **Wash** your hands, and have your partner do the same.
2. **Ask permission**, and ask about pain, wounds or allergies.
3. **Apply** a little lotion to your own hands, if allowed. Check for allergies first.
4. **Effleurage** — glide from the wrist to the elbow, then back.
5. **Thumb circles** — make small circles on the palm.
6. **Fingers** — gently stroke each finger from base to tip.
7. **Petrissage** — lightly knead the forearm.
8. **Finish** with slow effleurage.
9. **Ask** how your partner feels.
10. **Clean up** and wash your hands.

## Safety precautions
- Use **light pressure**. Ask, "Is this pressure okay?"
- **Stop at once** if there is pain.
- Avoid **bones and joints**, and any wounds, rashes or bruises.
- Keep your nails short.
- Keep the floor dry; wipe spills of oil.
- Keep your back straight, and use your body weight rather than your thumbs alone.

## After the session
Offer water, change the linen, sanitize your tools and record the service. Professional practice with real clients needs training and certification.`,
        `## Wellness Massage Practice and Service Preparation Activity
Learn the origins, types and benefits of wellness massage, and perform a basic wellness massage while following proper workplace requirements and safety precautions.

Under your teacher's supervision, and with your partner's agreement, perform the hand and arm massage from this lesson. Your teacher checks your preparation, hygiene, strokes, communication and cleanup.`,
        [
          "What must you do before touching your partner's hand?",
          "What should you do if your partner feels pain?",
          "Which parts must you avoid?",
        ],
      ),
    ],
    quiz: [
      q(
        "Hilot comes from…",
        ["Japan", "Sweden", "The Philippines", "Thailand"],
        2,
        "Hilot is the traditional Filipino healing art.",
      ),
      q(
        "Which statement about massage is true?",
        [
          "It cures every disease",
          "It supports health but doesn't replace a doctor",
          "It works only on athletes",
          "It should always be painful",
        ],
        1,
        "Massage can relax and refresh, but it isn't a cure.",
      ),
      q(
        "A written, step-by-step way of doing a task is…",
        ["A permit", "An SOP", "A stroke", "A consultation"],
        1,
        "SOP stands for standard operating procedure.",
      ),
      q(
        "Long, smooth, gliding strokes are called…",
        ["Effleurage", "Tapotement", "Friction", "Vibration"],
        0,
        "Effleurage begins and ends a massage.",
      ),
      q(
        "A client has a fever. What should the therapist do?",
        [
          "Use stronger pressure",
          "Massage only the arms",
          "Don't massage, and suggest seeing a doctor",
          "Add more oil",
        ],
        2,
        "Fever is a contraindication, so massage must wait.",
      ),
    ],
    bank: [
      q(
        "Massage most directly helps which two dimensions of wellness?",
        [
          "Physical and emotional",
          "Social and occupational",
          "Spiritual and environmental",
          "Intellectual and social",
        ],
        0,
        "It relaxes the body and reduces stress.",
      ),
      q(
        "Tapotement is a…",
        ["Tapping stroke", "Kneading stroke", "Gliding stroke", "Massage oil"],
        0,
        "Tapotement is quick, light tapping.",
      ),
      q(
        "Reflexology applies pressure to points on the…",
        ["Feet or hands", "Hair", "Teeth", "Eyes"],
        0,
        "Reflexology works on the feet or hands.",
      ),
      q(
        "Who may stop a massage at any time?",
        ["Only the therapist", "Only the manager", "The client", "No one"],
        2,
        "Clients can stop a service whenever they want.",
      ),
      q(
        "What should you do before starting a service?",
        [
          "Get the client's consent",
          "Turn up the music",
          "Skip the consultation",
          "Put on more rings",
        ],
        0,
        "Explaining the service and getting consent comes first.",
      ),
    ],
  },
  {
    title: "Caregiving for Newborns, Infants and Toddlers",
    description:
      "Concepts and principles in caregiving, workplace policy, care procedures, and caring for young children without special needs.",
    lessons: [
      tleLesson(
        "Concepts and Principles in Caregiving",
        "What a caregiver does, and the values behind the work.",
        "hL2YUIUy9j0",
        `## What is caregiving?
**Caregiving** is helping people who need support with daily needs, such as children, the elderly, and those who are sick. A **caregiver** gives this help at home or in a facility.

## Stages of young children
| Stage | Age | Key needs |
|---|---|---|
| **Newborn** | First 28 days | Feeding, warmth, gentle handling, sleep |
| **Infant** | Up to 12 months | Feeding, play, safe movement, bonding |
| **Toddler** | 1 to 3 years | Safety, routines, play, learning to do things |

## Principles in caregiving
- **Safety first** — prevent falls, burns and choking
- **Respect** — treat each child and family with dignity
- **Patience and kindness** — never shake or hit a child
- **Hygiene** — clean hands, clean things
- **Consistency** — regular routines make a child feel secure
- **Confidentiality** — keep family matters private
- **Know your limits** — ask an adult or a health worker when unsure

## Qualities of a good caregiver
Caring, patient, observant, responsible, honest, calm in emergencies.

## Training
**TESDA** offers **Caregiving NC II**, and caregivers from the Philippines are valued around the world.`,
        `## Stages of Young Children
Make a chart of the newborn, infant and toddler stages, and list what each needs from a caregiver.

## The Good Caregiver
In groups, list the qualities of a good caregiver, and give a real-life example of each.`,
        [
          "What is caregiving?",
          "What are the age ranges of a newborn, infant and toddler?",
          "Why must a baby never be shaken?",
        ],
      ),
      tleLesson(
        "Workplace Policy and Procedures in Providing Care",
        "The rules that protect children, clients and caregivers.",
        "rhNjh9bVc_E",
        `## Why policies matter
Policies keep care **safe and consistent**, and they protect everyone.

## Common workplace policies
- **Hygiene** — wash your hands before and after each task
- **Infection control** — don't work when sick; clean toys and surfaces
- **Child protection** — no hitting, shouting or humiliating. Abuse must be reported. In the Philippines, **RA 7610** protects children against abuse
- **Supervision** — never leave a young child alone
- **Medicine** — give only what a parent or doctor has authorized, and record it
- **Confidentiality** — keep family information private
- **Authorized pickup** — release children only to approved adults
- **Emergency procedures** — know the exits and emergency contacts

## Daily procedures
1. **Greet** the family, and ask how the child is.
2. **Check** the child for fever, rashes or injuries.
3. **Follow** the feeding, sleep and play schedule.
4. **Record** feeding, diaper changes and sleep.
5. **Report** anything unusual to the parent or supervisor.

## Reporting incidents
If a child is hurt, **give first aid**, **call for help**, **tell the parent** and **write an incident report**.`,
        `## Policy Poster
Make a poster of five important policies in a child care setting.

## What Should You Do?
Read short workplace situations, and say which policy applies and what the caregiver should do.`,
        [
          "Give four workplace policies in caregiving.",
          "What does RA 7610 protect?",
          "What do you do when a child gets hurt?",
        ],
      ),
      tleLesson(
        "Procedures for Providing Care and Support",
        "Daily care: hygiene, feeding, sleep and play.",
        "j3cZBDQMFKM",
        `## Before any care
**Wash your hands** with soap for at least 20 seconds, prepare everything you need, and stay with the child.

## Feeding
- **Breastfeeding** is best. The Department of Health recommends **only breast milk for the first six months**, then continuing along with other food.
- If a parent uses a bottle, clean and sterilize it, and follow the parent's instructions exactly.
- **Burp** a baby after feeding.
- From about six months, soft foods are added slowly.

## Diapering
1. Prepare a clean diaper, wipes and cream.
2. Keep one hand on the baby at all times.
3. Clean from **front to back**.
4. Put on the new diaper.
5. Wash your hands and the baby's.

## Sleep
- Lay a baby on the **back** to sleep.
- Use a **firm, flat surface**.
- Keep pillows, toys and thick blankets **out of the crib**.

## Play and learning
Talking, singing, reading and simple games help the brain grow. Babies need tummy time when they are awake and watched.

## Health checks
Follow the **immunization** schedule from the health center. Watch for warning signs: high fever, trouble breathing, poor feeding, or unusual sleepiness. **Get medical help quickly** if you see these.`,
        `## Care Schedule
Create a sample daily schedule of feeding, sleep, hygiene and play for an infant.

## Sequence the Steps
Put the steps of diapering in the correct order, and explain why each step matters.`,
        [
          "How long should a baby receive only breast milk?",
          "In what position should a baby sleep?",
          "Give three warning signs that need medical help.",
        ],
      ),
      tleLesson(
        "Caring for Newborns, Infants and Toddlers",
        "Applying care procedures safely, with a practice doll.",
        "gzJ6pAD8I0o",
        `## Practice in school
Practice these skills on a **doll**, under your teacher's guidance.

## Holding a newborn
1. Wash your hands.
2. Slide one hand under the head and neck, and the other under the bottom.
3. **Always support the head**, because a newborn's neck is weak.
4. Hold the baby close to your chest.

## Bathing a baby
1. Gather everything first: basin, soap, towels, clothes.
2. Check that the room is warm.
3. Test the water with your **elbow**. It should feel warm, about 37 °C.
4. Support the head and neck at all times.
5. Wash the face first, then the body.
6. Keep the **umbilical cord stump** clean and dry.
7. Pat dry and dress the baby quickly.

**Never leave a baby alone in water, even for a moment.**

## Toddler care
- **Toilet learning** — be patient, and praise success
- **Feeding** — offer small, soft pieces; watch for choking
- **Play** — blocks, balls, picture books, songs
- **Routines** — regular meal and nap times

## A safe space
- Keep small objects, medicines and cleaners **out of reach**.
- Cover outlets, and block stairs.
- Turn pot handles inward, and keep hot drinks away.
- Watch toddlers near water at all times.`,
        `## Basic Caregiving for Young Children Activity
Learn the concepts, principles and workplace procedures in caregiving, and apply appropriate caregiving techniques for newborns, infants and toddlers without special needs.

Using a doll, demonstrate holding, bathing and diapering. Your teacher checks your hygiene, safety, gentle handling and correct steps.

## Childproof a Room
Draw a room, circle the dangers to a toddler, and write how to fix each one.`,
        [
          "Why must you support a newborn's head?",
          "How do you test bath water?",
          "Give three ways of making a home safe for toddlers.",
        ],
      ),
    ],
    quiz: [
      q(
        "A baby in the first 28 days of life is called…",
        ["A newborn", "A toddler", "A preschooler", "An adolescent"],
        0,
        "The newborn stage covers the first 28 days.",
      ),
      q(
        "If a child in care is hurt, what comes first?",
        [
          "Give first aid and call for help",
          "Finish the schedule",
          "Wait for the parent",
          "Ask the child to rest alone",
        ],
        0,
        "First help the child, then tell the parent and write a report.",
      ),
      q(
        "A baby should sleep…",
        [
          "On the stomach, on a soft pillow",
          "On the back, on a firm, flat surface",
          "On the side, with toys",
          "Sitting up",
        ],
        1,
        "Back sleeping on a firm surface is the safest.",
      ),
      q(
        "How do you test a baby's bath water?",
        [
          "With your elbow",
          "With a spoon",
          "By boiling it",
          "With your eyes only",
        ],
        0,
        "The elbow feels temperature well; the water should feel warm.",
      ),
      q(
        "Who may a caregiver release a child to?",
        [
          "Anyone who asks",
          "Only approved adults",
          "Any neighbor",
          "Other children",
        ],
        1,
        "Authorized pickup keeps children safe.",
      ),
    ],
    bank: [
      q(
        "A toddler is about…",
        [
          "1 to 3 years old",
          "8 to 10 years old",
          "5 to 6 months old",
          "6 to 8 years old",
        ],
        0,
        "The toddler stage covers ages 1 to 3.",
      ),
      q(
        "Clean a baby during diapering…",
        [
          "From front to back",
          "From back to front",
          "With hot water only",
          "Only once a day",
        ],
        0,
        "Front to back keeps germs away.",
      ),
      q(
        "Which law protects children against abuse?",
        ["RA 7610", "RA 9003", "RA 4136", "RA 9514"],
        0,
        "RA 7610 gives special protection to children.",
      ),
      q(
        "A baby's first six months of feeding should be…",
        [
          "Only breast milk",
          "Rice porridge",
          "Fruit juice",
          "Coffee with milk",
        ],
        0,
        "The DOH recommends only breast milk for the first six months.",
      ),
      q(
        "Which item is a choking risk for toddlers?",
        [
          "Small objects",
          "Large soft blocks",
          "Picture books",
          "Soft blankets for play",
        ],
        0,
        "Small objects must be kept out of a toddler's reach.",
      ),
    ],
  },
];

export const healthAndWellnessMassage: DemoSubject = {
  key: "TLE9-HWM",
  code: "TLE 9-HWM",
  name: "TLE 9–10 – FCS: Health and Wellness Massage",
  department: TLE_DEPARTMENT,
  description:
    "Wellness massage, and caregiving for newborns, infants and toddlers — a one-term TLE: FCS sector for Grade 9 or 10.",
  colorToken: "rose",
  units: UNITS,
};
