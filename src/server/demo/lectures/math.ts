import type { DemoLecture } from "./types";

/** Mathematics 10 lectures, keyed by lesson title (see grade10.ts). */
export const MATH_LECTURES: Record<string, DemoLecture> = {
  "Generating Patterns": {
    videoId: "btKkchZRhzI",
    lecture: `## What is a sequence?
A **sequence** is an ordered list of numbers called **terms**. We write them as a₁, a₂, a₃, … where the small number tells the position of the term. A sequence is **finite** if it ends (2, 4, 6, 8) and **infinite** if it goes on forever (2, 4, 6, 8, …).

## Finding the rule
To continue a pattern, look at how each term is related to the one before it.
- **Add or subtract the same number:** 3, 7, 11, 15, … (add 4 each time)
- **Multiply by the same number:** 2, 6, 18, 54, … (multiply by 3 each time)
- **Squares, cubes and other rules:** 1, 4, 9, 16, … are the squares 1², 2², 3², 4²

## Writing the general term
The **general term** aₙ is a formula that gives any term from its position n.
- For 3, 7, 11, 15, … the terms go up by 4, so start with 4n. When n = 1, 4n = 4, but the first term is 3, so subtract 1: **aₙ = 4n − 1**.
- Check: a₂ = 4(2) − 1 = 7 ✓ and a₁₀ = 4(10) − 1 = 39.

## Worked example
Find the next two terms and the general term of 5, 10, 17, 26, …
- Differences: 5, 7, 9 — they grow by 2, so the next differences are 11 and 13.
- Next terms: 26 + 11 = **37** and 37 + 13 = **50**.
- The terms are each one more than a perfect square: 2² + 1, 3² + 1, 4² + 1 … so **aₙ = (n + 1)² + 1**.

## Key points
- Always test your rule on at least two terms.
- A rule based on position (aₙ) lets you jump straight to the 100th term without listing the first 99.`,
  },

  "The nth Term and Arithmetic Series": {
    videoId: "_vp3ev0oRvk",
    lecture: `## Arithmetic sequences
An **arithmetic sequence** adds the same number, the **common difference d**, to get each next term. Find d by subtracting any term from the term after it: d = a₂ − a₁.

## The nth term
**aₙ = a₁ + (n − 1)d**

To reach the nth term you start at a₁ and add d exactly (n − 1) times.

**Example:** Find the 25th term of 4, 9, 14, …
- a₁ = 4, d = 5
- a₂₅ = 4 + (25 − 1)(5) = 4 + 120 = **124**

## Arithmetic means
The terms between two given terms are called **arithmetic means**.

**Example:** Insert three arithmetic means between 6 and 26.
- There are 5 terms in all, so a₁ = 6 and a₅ = 26.
- 26 = 6 + 4d, so d = 5.
- The means are **11, 16, 21**.

## Arithmetic series
An **arithmetic series** is the sum of the terms. The sum of the first n terms is
- **Sₙ = n/2 (a₁ + aₙ)** when you know the last term, or
- **Sₙ = n/2 [2a₁ + (n − 1)d]** when you don't.

**Example:** Sum of the first 30 terms of 2, 5, 8, …
- a₁ = 2, d = 3
- S₃₀ = 30/2 [2(2) + 29(3)] = 15 (4 + 87) = 15 × 91 = **1,365**

## Key points
- Check whether the differences really are constant before using these formulas.
- The young Gauss added 1 to 100 by pairing terms: 50 pairs that each make 101, so the sum is 5,050. That pairing idea is exactly where Sₙ = n/2 (a₁ + aₙ) comes from.`,
  },

  "Geometric Sequences": {
    videoId: "DVpfJC_-waw",
    lecture: `## Multiplying by a common ratio
In a **geometric sequence**, every term is the previous term multiplied by the same number, the **common ratio r**. Find r by dividing a term by the one before it: r = a₂ ÷ a₁.
- 3, 6, 12, 24, … has r = 2
- 81, 27, 9, 3, … has r = 1/3
- 5, −10, 20, −40, … has r = −2 (the signs alternate)

## The nth term
**aₙ = a₁ · rⁿ⁻¹**

**Example:** Find the 8th term of 3, 6, 12, …
- a₁ = 3, r = 2
- a₈ = 3 · 2⁷ = 3 · 128 = **384**

## Geometric means
Terms between two given terms of a geometric sequence are **geometric means**.

**Example:** Insert two geometric means between 4 and 108.
- a₁ = 4 and a₄ = 108, so 108 = 4r³, r³ = 27 and r = 3.
- The means are **12 and 36**.

## Arithmetic or geometric?
- Constant **difference** → arithmetic
- Constant **ratio** → geometric
- 2, 4, 8, 16 has ratio 2 but differences 2, 4, 8, so it is geometric, not arithmetic.

## Real-life examples
Bacteria that double every hour, a ball that bounces back to half its height, or money that earns the same percentage of interest every year all follow geometric sequences.`,
  },

  "Geometric Series": {
    videoId: "kygPMFN4baM",
    lecture: `## Finite geometric series
A **geometric series** is the sum of the terms of a geometric sequence. For the first n terms:

**Sₙ = a₁(1 − rⁿ) / (1 − r)**, where r ≠ 1

**Example:** Find the sum of the first 6 terms of 2, 6, 18, …
- a₁ = 2, r = 3, n = 6
- S₆ = 2(1 − 3⁶)/(1 − 3) = 2(1 − 729)/(−2) = 2(−728)/(−2) = **728**

## Infinite geometric series
When **|r| < 1**, the terms get smaller and smaller, and the sum approaches a fixed number:

**S = a₁ / (1 − r)**

**Example:** 8 + 4 + 2 + 1 + …
- a₁ = 8, r = 1/2
- S = 8 / (1 − 1/2) = 8 / (1/2) = **16**

If |r| ≥ 1 the terms do not shrink, so the infinite series has **no sum** (it diverges).

## Worked problem
A ball is dropped from 10 m and each bounce reaches 3/5 of the previous height. How far does it travel up and down in total?
- Down: 10 + 6 + 3.6 + … = 10 / (1 − 3/5) = 25 m
- Up: 6 + 3.6 + … = 6 / (1 − 3/5) = 15 m
- Total distance: **40 m**

## Key points
- Check |r| before using the infinite-sum formula.
- Repeating decimals are infinite geometric series: 0.333… = 0.3 + 0.03 + 0.003 + … = 0.3/(1 − 0.1) = 1/3.`,
  },

  "Dividing Polynomials": {
    videoId: "ACg3xQmxcRk",
    lecture: `## Long division
Dividing polynomials works like long division of numbers: **divide, multiply, subtract, bring down**, and repeat.

**Example:** (x² + 5x + 6) ÷ (x + 2)
- x² ÷ x = **x**. Multiply: x(x + 2) = x² + 2x. Subtract: 3x + 6.
- 3x ÷ x = **3**. Multiply: 3(x + 2) = 3x + 6. Subtract: 0.
- Quotient: **x + 3**, remainder 0.

Always write the dividend in descending powers and put **0** in for a missing term: write x³ − 8 as x³ + 0x² + 0x − 8.

## Synthetic division
When the divisor has the form **x − c**, synthetic division is a shortcut that uses only the coefficients.

**Example:** (2x³ − 3x² + 4x − 5) ÷ (x − 2), so c = 2
- Write the coefficients: 2, −3, 4, −5
- Bring down 2. Multiply by 2 → 4, add to −3 → 1.
- Multiply 1 by 2 → 2, add to 4 → 6.
- Multiply 6 by 2 → 12, add to −5 → **7**.
- Quotient: **2x² + x + 6**, remainder **7**.

## Writing the answer
Dividend = Divisor × Quotient + Remainder, so
2x³ − 3x² + 4x − 5 = (x − 2)(2x² + x + 6) + 7.

## Key points
- For a divisor x + 3, use c = −3.
- The quotient is always one degree lower than the dividend when dividing by x − c.`,
  },

  "Remainder and Factor Theorems": {
    videoId: "r1IK-urh8G4",
    lecture: `## The Remainder Theorem
When a polynomial P(x) is divided by **x − c**, the remainder is **P(c)**. You can find the remainder without dividing at all.

**Example:** Find the remainder when P(x) = x³ − 4x² + 2x + 5 is divided by x − 3.
- P(3) = 27 − 36 + 6 + 5 = **2**, so the remainder is 2.

For a divisor x + 2, use c = −2.

## The Factor Theorem
**x − c is a factor of P(x) exactly when P(c) = 0.** A remainder of zero means the division comes out even.

**Example:** Is x − 1 a factor of P(x) = x³ − 6x² + 11x − 6?
- P(1) = 1 − 6 + 11 − 6 = 0, so **yes**.
- Dividing gives x² − 5x + 6 = (x − 2)(x − 3), so P(x) = (x − 1)(x − 2)(x − 3).

## Finding an unknown coefficient
**Example:** Find k so that x + 2 is a factor of x³ + kx² − 4.
- P(−2) = −8 + 4k − 4 = 0
- 4k = 12, so **k = 3**.

## Key points
- Remainder Theorem: the remainder is P(c).
- Factor Theorem: remainder 0 ⇔ factor.
- Synthetic division gives the same remainder and also the quotient, which helps you keep factoring.`,
  },

  "Polynomial Equations": {
    videoId: "ux_fPXZRwis",
    lecture: `## Roots of a polynomial equation
A **root** is a value of x that makes P(x) = 0. A polynomial equation of degree n has **exactly n roots** when you count repeated and complex roots, so it has **at most n real roots**.

## The Rational Root Theorem
If a polynomial has integer coefficients, every rational root has the form

**± (factor of the constant term) / (factor of the leading coefficient)**

**Example:** Solve x³ − 2x² − 5x + 6 = 0.
- Possible rational roots: ±1, ±2, ±3, ±6
- Test x = 1: 1 − 2 − 5 + 6 = 0 ✓ So x − 1 is a factor.
- Synthetic division by 1 gives x² − x − 6 = (x − 3)(x + 2).
- Roots: **x = 1, 3, −2**.

## Strategy
- List the possible rational roots.
- Test them with substitution or synthetic division until one gives 0.
- Divide to get a lower-degree polynomial (the **depressed equation**).
- Factor or use the quadratic formula on what is left.

## Descartes' Rule of Signs (a helpful check)
Count the sign changes in P(x): that is the number of positive real roots, or less than it by an even number. In x³ − 2x² − 5x + 6 the signs go + − − +, which is 2 changes, so there are 2 or 0 positive roots. We found two: 1 and 3.

## Key points
- Not every possible rational root is a root; you must test.
- Each root r you find gives the factor (x − r).`,
  },

  "Graphs of Polynomial Functions": {
    videoId: "QA6FsxpI6r0",
    lecture: `## End behavior: the Leading Coefficient Test
The **degree** and the sign of the **leading coefficient** decide what the graph does at the far left and far right.
- **Even degree, positive:** up on both ends (like y = x²)
- **Even degree, negative:** down on both ends
- **Odd degree, positive:** falls left, rises right (like y = x³)
- **Odd degree, negative:** rises left, falls right

## Intercepts
- **y-intercept:** set x = 0. It is the constant term.
- **x-intercepts:** the real zeros of the polynomial. Factor to find them.

## Multiplicity
If a factor (x − r) appears k times, r is a zero of **multiplicity k**.
- **Odd multiplicity:** the graph **crosses** the x-axis at r.
- **Even multiplicity:** the graph **touches** the axis and turns back.

## Turning points
A polynomial of degree n has **at most n − 1 turning points**.

## Worked example
Sketch y = (x + 2)(x − 1)².
- Degree 3, leading coefficient +1: falls left, rises right.
- y-intercept: (2)(1) = 2.
- Zeros: −2 (crosses) and 1 (multiplicity 2, touches).
- The graph comes up from the bottom left, crosses at −2, rises through (0, 2), comes down to touch at 1, then rises to the right.

## Key points
- Read end behavior first, then mark intercepts, then connect smoothly.
- Test a point between zeros to see whether the graph is above or below the axis.`,
  },

  "Arcs and Central Angles": {
    videoId: "HmGbuGnqX6I",
    lecture: `## Parts of a circle
- **Radius:** a segment from the center to the circle
- **Chord:** a segment whose endpoints are on the circle; the **diameter** is the longest chord
- **Arc:** part of the circle between two points

## Central angles and arcs
A **central angle** has its vertex at the center. **Its measure equals the measure of its intercepted arc.** If ∠AOB = 70°, then arc AB = 70°.

## Kinds of arcs
- **Minor arc:** less than 180°, named with two letters (arc AB)
- **Semicircle:** exactly 180°
- **Major arc:** more than 180°, named with three letters (arc ACB). Its measure is 360° minus the minor arc.

**Example:** If minor arc AB = 70°, major arc ACB = 360° − 70° = **290°**.

## Arc addition
The measure of an arc made of two adjacent arcs is the sum of their measures: arc AC = arc AB + arc BC.

## Arc length
Arc measure is in degrees; **arc length** is a distance.

**Arc length = (θ / 360°) × 2πr**

**Example:** In a circle of radius 9 cm, an arc of 60° has length (60/360)(2π)(9) = **3π ≈ 9.42 cm**.

## Key points
- In the same or congruent circles, congruent central angles have congruent arcs and congruent chords.
- The central angles around a point add up to 360°.`,
  },

  "Inscribed Angles, Tangents and Secants": {
    videoId: "kDNUyH-M-14",
    lecture: `## Inscribed angles
An **inscribed angle** has its vertex on the circle and its sides are chords. **Its measure is half its intercepted arc.**
- If arc AC = 100°, the inscribed angle ∠ABC = **50°**.
- Inscribed angles that intercept the same arc are **congruent**.
- An angle inscribed in a **semicircle** is a **right angle** (half of 180°).
- Opposite angles of a quadrilateral inscribed in a circle are **supplementary**.

## Tangents
A **tangent** touches the circle at exactly one point. **A tangent is perpendicular to the radius at the point of tangency.** Two tangent segments from the same outside point are **equal in length**.

## Secants
A **secant** is a line that cuts the circle at two points.

## Angles formed by secants and tangents
- **Vertex inside the circle** (two chords): angle = ½ (sum of the intercepted arcs)
- **Vertex on the circle** (tangent and chord): angle = ½ (intercepted arc)
- **Vertex outside the circle** (two secants, two tangents, or one of each): angle = ½ (far arc − near arc)

**Example:** Two secants from an outside point intercept arcs of 110° and 30°. The angle is ½(110° − 30°) = **40°**.

## Key points
- Find where the vertex is first — inside, on, or outside — and pick the matching rule.
- Draw the radius to a tangent point; it gives you a right angle to work with.`,
  },

  "Distance and Midpoint": {
    videoId: "LF4VXFy78Nw",
    lecture: `## The distance formula
The distance between P(x₁, y₁) and Q(x₂, y₂) is

**d = √[(x₂ − x₁)² + (y₂ − y₁)²]**

It comes from the Pythagorean theorem: the horizontal and vertical changes are the legs of a right triangle and the distance is the hypotenuse.

**Example:** Distance from (1, 2) to (7, 10)
- d = √[(6)² + (8)²] = √(36 + 64) = √100 = **10**

## The midpoint formula
The midpoint of PQ is the average of the coordinates:

**M = ((x₁ + x₂)/2, (y₁ + y₂)/2)**

**Example:** Midpoint of (−4, 3) and (6, −5) is ((−4 + 6)/2, (3 − 5)/2) = **(1, −1)**.

## Proving properties with coordinates
Coordinate proofs use these formulas to show geometric facts.
- **Isosceles triangle:** show that two sides have equal length.
- **Right triangle:** show the side lengths satisfy a² + b² = c².
- **Parallelogram:** show the diagonals have the **same midpoint** (they bisect each other).

**Example:** Is A(0, 0), B(4, 0), C(4, 3) a right triangle? AB = 4, BC = 3, AC = 5, and 3² + 4² = 5², so **yes**.

## Key points
- The order of the points does not matter because the differences are squared.
- To find a missing endpoint, work the midpoint formula backwards.`,
  },

  "Equation of a Circle": {
    videoId: "JxNrdRtcZlc",
    lecture: `## Standard form
A circle is the set of points at distance r from the center (h, k). Using the distance formula:

**(x − h)² + (y − k)² = r²**

**Example:** Center (3, −2), radius 5 → (x − 3)² + (y + 2)² = **25**.
Watch the signs: y − (−2) becomes y + 2.

A circle centered at the origin is simply x² + y² = r².

## General form
Expanding the standard form gives the **general form**

**x² + y² + Dx + Ey + F = 0**

## From general to standard form: complete the square
**Example:** x² + y² − 6x + 4y − 12 = 0
- Group: (x² − 6x) + (y² + 4y) = 12
- Complete each square: add 9 and 4 to both sides.
- (x − 3)² + (y + 2)² = 25
- Center **(3, −2)**, radius **5**.

## Finding the equation from given information
- From a center and a point on the circle: the radius is the distance between them.
- From the endpoints of a diameter: the center is the midpoint and the radius is half the diameter.

**Example:** Diameter from (−1, 2) to (5, 2): center (2, 2), radius 3, so (x − 2)² + (y − 2)² = 9.

## Key points
- In standard form, r² is on the right side; take its square root to get r.
- Applications: the area a cell tower or a PAGASA warning signal covers is a circle around a center point.`,
  },

  Permutations: {
    videoId: "zKfdf6JzM4g",
    lecture: `## The fundamental counting principle
If one task can be done in m ways and a second in n ways, both can be done in **m × n** ways. With 3 shirts and 4 pants you can make 12 outfits.

## Factorial
**n! = n × (n − 1) × … × 2 × 1**, and 0! = 1. For example 5! = 120.

## Permutations: order matters
A **permutation** is an arrangement where **order matters** — first, second and third place are different.

**P(n, r) = n! / (n − r)!**

**Example:** In how many ways can 8 runners win gold, silver and bronze?
- P(8, 3) = 8 × 7 × 6 = **336**

All n objects arranged: P(n, n) = n!. Five books on a shelf: 5! = 120 ways.

## Permutations with repeated objects
**n! / (p! q! …)** where p, q, … are the counts of identical objects.

**Example:** Arrangements of the letters of BANANA: 6! / (3! 2!) = 720 / 12 = **60**.

## Circular permutations
Seating n people around a round table: **(n − 1)!**, because rotating everyone does not make a new arrangement. Six people: 5! = **120**.

## Key points
- Ask: does swapping two chosen items make a different outcome? If yes, use permutations.
- Officers (president, vice president, secretary) are a permutation; a committee is not.`,
  },

  Combinations: {
    videoId: "lXobT687m3M",
    lecture: `## Combinations: order does not matter
A **combination** is a selection where **order does not matter**. Choosing Ana, Ben and Carlo for a committee is the same as choosing Carlo, Ana and Ben.

**C(n, r) = n! / [r! (n − r)!]**

Since each group of r can be arranged r! ways, C(n, r) = P(n, r) / r!.

## Examples
**A committee of 3 from 10 students:**
- C(10, 3) = 10! / (3! 7!) = (10 × 9 × 8) / 6 = **120**

**A lotto ticket of 6 numbers from 42:**
- C(42, 6) = **5,245,786** possible tickets

**Handshakes among 12 people** (each pair shakes once):
- C(12, 2) = 66

## Combinations with conditions
**Example:** A team of 5 is chosen from 6 boys and 4 girls and must have exactly 2 girls.
- Girls: C(4, 2) = 6; boys: C(6, 3) = 20
- Total: 6 × 20 = **120** teams

## Permutation or combination?
- Positions, ranks, passwords, seating → **permutation**
- Groups, teams, committees, hands of cards → **combination**

## Key points
- C(n, r) = C(n, n − r): choosing 3 to include is the same as choosing 7 to leave out of 10.
- "And" between choices → multiply; "or" between separate cases → add.`,
  },

  "Probability of Compound Events": {
    videoId: "zPR_J0mydW8",
    lecture: `## Basic probability
**P(E) = number of favorable outcomes / number of possible outcomes**, a number from 0 (impossible) to 1 (certain).

## Union: A or B
**P(A or B) = P(A) + P(B) − P(A and B)**

We subtract P(A and B) so outcomes in both events are not counted twice.

**Example:** Draw one card from 52. P(king or heart) = 4/52 + 13/52 − 1/52 = **16/52 = 4/13**.

**Mutually exclusive** events cannot happen together, so P(A and B) = 0 and P(A or B) = P(A) + P(B). Rolling a 2 or a 5 on a die: 1/6 + 1/6 = 1/3.

## Intersection: A and B
**Independent events** do not affect each other: **P(A and B) = P(A) · P(B)**.
- Tossing heads and rolling a 6: ½ × ⅙ = **1/12**.

**Dependent events** do affect each other: **P(A and B) = P(A) · P(B | A)**.
- Drawing two aces **without replacement**: 4/52 × 3/51 = **1/221**.

## Complement
**P(not A) = 1 − P(A)**. The probability of getting at least one head in 3 tosses is 1 − P(no heads) = 1 − 1/8 = **7/8**.

## Key points
- "Or" usually means add (and subtract the overlap); "and" usually means multiply.
- Ask whether the first event changes the second — with or without replacement.`,
  },

  "Quartiles, Deciles and Percentiles": {
    videoId: "LQaC4_z3C7c",
    lecture: `## Measures of position
Measures of position tell where a value stands in an **ordered** data set.
- **Quartiles** (Q₁, Q₂, Q₃) divide the data into **4** equal parts.
- **Deciles** (D₁ … D₉) divide it into **10** parts.
- **Percentiles** (P₁ … P₉₉) divide it into **100** parts.

Q₂ = D₅ = P₅₀ = the **median**.

## Position formulas for ungrouped data
- Qₖ is at position **k(n + 1)/4**
- Dₖ is at position **k(n + 1)/10**
- Pₖ is at position **k(n + 1)/100**

If the position is not a whole number, **interpolate** between the two neighboring values.

## Worked example
Scores: 12, 15, 18, 20, 22, 25, 28, 30, 35 (n = 9)
- **Q₁:** position 1(10)/4 = 2.5 → halfway between the 2nd and 3rd values: 15 + 0.5(18 − 15) = **16.5**
- **Q₃:** position 3(10)/4 = 7.5 → between 28 and 30: **29**
- **Interquartile range:** Q₃ − Q₁ = 29 − 16.5 = **12.5**

## Interpreting results
A student at the **90th percentile** scored higher than about 90% of the class. Percentile is about **position**, not the percentage of correct answers.

## Key points
- Always arrange the data from least to greatest first.
- The interquartile range shows how spread out the middle half of the data is and is not affected by extreme values.`,
  },
};
