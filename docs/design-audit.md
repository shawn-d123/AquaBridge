# Design audit: removing the "AI-generated" look

Audit of the live site (https://aquabridge-zeta.vercel.app/prototype/) against current research on what makes sites read as AI-generated, plus usability heuristics for a transactional service. Date: 14 Nov 2026.

## How we judged it

- **Measured:** Adrian Krebs's DOM scan of 500 Show HN sites ([design slop](https://www.adriankrebs.ch/blog/design-slop/)): gradients 28%, untouched Tailwind/shadcn defaults 23.5%, three-card feature grids 20%, "distinctive default" fonts 15.8%, card accent stripes 13%, stat rows 12%, uppercase eyebrow labels ~10%, numbered 1-2-3 steps 9.4%.
- **Named patterns:** Hallmark's banned anti-patterns ("eyebrow on every section: uppercase mono-cap labels"), Impeccable, NN/g on AI prototypes ("flat and interchangeable").
- **Usability:** Nielsen's 10 heuristics, GOV.UK Design System (question pages, error messages, tags, check answers), NN/g on form labels.
- **References:** GOV.UK services, RSPCA Find a Pet, Blue Cross, Gumtree/Preloved, Monzo Help.

The consistent finding: no single element gives a site away. A stack of unchosen defaults does.

## Findings on the live site

| # | Where | What we found | Why it reads as AI / hurts use | Fix |
|---|---|---|---|---|
| 1 | Every page | Monospace UPPERCASE eyebrow labels above headings ("FREE AQUATIC REHOMING ACROSS THE UK", "HOW IT WORKS") and on every data label | Named directly as an AI tell; adds noise, harder to read | Remove eyebrows; sentence-case headings do the work. Captions only to show position ("Step 2 of 4") |
| 2 | Every page | Three typefaces: Familjen Grotesk + Atkinson Hyperlegible + IBM Plex Mono | Grotesk display + mono labels is the "developer template" pairing | One family: **Atkinson Hyperlegible Next** (accessibility-led, variable weights) |
| 3 | Every page | Grey "build notes" strip under the header (SCREEN / OWNER / TASKS / STORIES) | Dev chrome inside the product; competes with the task | GOV.UK-style **prototype banner** with a "Team notes" toggle (off by default) |
| 4 | Homepage hero | Headline with a phrase in brand colour, two buttons, three dot-bulleted reassurance points | Krebs's "one accent word" + filler bullets | Plain headline, facts in the subheading, a **search box** as the main action (RSPCA/Gumtree pattern) |
| 5 | Homepage | Two cards of numbered 1–5 steps ("How it works") | Numbered-steps tell; also duplicated on the demos page | Short prose summary per journey on the homepage; full detail moves to a **How it works** page |
| 6 | Homepage | Dark full-width "SDG 14" band in a light page | Template "impact band"; SDGs mean nothing to adopters | Calm inline notice about never releasing animals; SDG context on the How it works page |
| 7 | Cards | Coloured "specimen plate" with italic Latin name, mono kind label and a generic fish/leaf icon | Generic icon-in-a-coloured-box placeholder | Species **illustrations** in the same style as the hero aquarium |
| 8 | Everywhere | 1px border on every card, panel and box; cards inside panels; hover lift | Untouched Tailwind default look | Borders only for inputs and tables; group with space and quiet tints |
| 9 | Everywhere | Pill status chips with a coloured dot, lower-case contract values ("needs information") | AI "status pill"; machine wording | Rectangular **tags** in sentence case ("Needs information") |
| 10 | Everywhere | Internal IDs shown to users (L-1045, R-501, H-203, IC-301) | System language, not the user's (heuristic 2) | Hide IDs; show a **reference** only on the request confirmation |
| 11 | Browse | Filters as pill segmented controls above the grid | Works, but unlike real marketplaces; cramped on mobile | **Filter sidebar** (radio groups) on desktop, collapsible on mobile; clear result count |
| 12 | Listing page | Fact grid with mono labels; three bordered panels in the sidebar | Dense, dashboard-like | **Summary list** of facts, one clear action box, care needs as a plain table |
| 13 | Forms | Red asterisks for required fields; no error summary; choice "cards" | GOV.UK: mark optional instead, summarise errors at the top | "(optional)" labels, **error summary** with links, standard large radios |
| 14 | Questionnaire | Segmented progress bar + separate panel chrome | Fine, but heavy | "Step 2 of 4" caption above a question-as-heading (GOV.UK question pages) |
| 15 | Request flow | Sending a request jumps straight to My Requests with a toast | No confirmation or reference (heuristic 1) | **Confirmation page** with reference and "what happens next" |
| 16 | Compatibility | Coloured icon circles and mono labels per rule | Colour-led | Plain "Meets / Does not meet / Missing" text with the reason first |
| 17 | My Listings | Four stat tiles duplicating the tab counts | Vanity-stat row | Remove; tabs already show counts |
| 18 | Demo guide | Floating panel with "Behind the scenes" box and mono code | Dev styling | Restyled as a docked guide; plain-language "What the system does" |
| 19 | Footer | "Sprint 1 prototype" and team tools as the only links | No help, privacy or accessibility links | Real footer: How it works, Privacy, Accessibility, Contact; team tools in their own group |
| 20 | Focus | Teal focus ring close to link colour | Low distinctness | Dark 3px focus outline |

## Kept on purpose

- **Teal accent and navy text:** fits the subject, not the purple AI default. Now limited to actions and links.
- **The aquarium illustration:** a deliberate, custom piece. It now sets the style for the species illustrations.
- **Sticky action panel on listing and compatibility pages:** a standard marketplace pattern; static on mobile.
- **Range bars on the compatibility check:** real, scaled data that explains the result.

## Usability principles applied

1. Show status and what happens next on every request (heuristic 1).
2. Use the user's words: "fish", "tank", "request to adopt"; no record IDs.
3. One question per page in the questionnaire, the question is the heading, Back link at top.
4. Mark optional fields "(optional)"; no asterisks.
5. Error summary at the top plus a message by the field saying how to fix it; never clear what was typed.
6. Ineligible results (restricted species, blocked compatibility) get an explanation and next steps, not an error.
7. Visible labels, units beside number fields.
8. Check-your-answers with Change links before submitting; confirmation with a reference after.
9. Confirm destructive actions inline (withdraw, decline).
10. Never rely on colour alone; every status is text.
11. 44px touch targets, single-column forms on mobile, no hover-only controls.
12. Current page shown in the navigation; page titles match the H1.
13. Empty and no-results states always offer a next step.
