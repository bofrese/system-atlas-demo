# UI Review: System Atlas demo, whole site
**Date:** 2026-10-16
**Scope:** All 19 routes, the search dialog and the guided demo, reviewed as a developer, tester or operations person who has never heard of System Atlas.
**Input:** Both. Screenshots at 1440x900 from `vite preview` (in `.playwright-mcp/`), then `src/app/App.tsx`, `src/pages/Pages.tsx`, `src/styles.css`.
**Tech stack:** Web, React 18, React Router (hash routes), Cytoscape graph, hand-written CSS with a few `:root` tokens, lucide icons.

## TL;DR
- The content model is good and the data is rich. The problem is that the UI does not show *what kind of thing* you are looking at, except in a tiny badge at the top of six detail pages.
- Type colours collide with status colours, with exactly the same hex values. Amber means both "database table" and "stale". Green means both "environment" and "passed". So colour cannot carry type identity today.
- Links, search results, graph nodes and lists show every object the same way (teal text plus a chevron). On the impact page, a repository, a component and a table appear in one list and look identical.
- The demo explains itself everywhere: a dark "How to read this demo" box, a "Domain shorthand" glossary and a teal reading-guide bar on almost every page. Each one is a sign that a label, a layout or a term does not work yet.
- The language has two layers of jargon: System Atlas terms (snapshot, harvested, provenance, hops, hygiene, autopsy, lens) and finance terms (exposure, netting, counterparty, LEI, notional, journal). Together they appear several hundred times in the UI and the data.
- Recommended direction: one **kind system** (five families, each with one icon, one hue and one name style) used everywhere an object appears, status colours reserved for state, and a navigation split into "questions" and "things".

## Product context
- **Vision loaded:** No. `docs/product/` does not exist. README.md and SYSTEM_ATLAS_SPEC.md were used instead.
- **Personas loaded:** No. The three roles in the UI (developer, tester, operations) and the brief in the request were used.
- **Design brief loaded:** No. This limits brand-voice judgments; findings about tone are based on the README.

## What's working
- **The model behind the screens.** Stable IDs, typed relationships and evidence links give every page real cross-links. Every component, table and API name links to its page. Keep this.
- **The requirement detail page.** "Latest result → failed at step 5 → expected vs observed per step → run context → facts / changes / unknowns" is the best page in the site. A tester can read the story top to bottom. The "Observed facts / Changes to inspect / Still unknown" split is honest and clear.
- **Honest wording about uncertainty.** "Signals are observations, not root-cause claims", "Uncertain", "Still unknown". This is the product's main idea and the UI keeps it.
- **A type badge already exists.** `EntityIdentity` in `src/pages/Pages.tsx:23` and `entityKinds` (`:15`) are the right start. The fix extends them; it does not replace them.
- **Tables are good tables.** The API field table and the column reference are complete, scannable and use monospace for code names.

## Issues found

### Critical

**1. You cannot tell what kind of thing a link, list item or search result is**
- **Lens:** 9 Consistency, 14 Whole-system alignment, 5 Gestalt (similarity).
- **Observation:** `EntityLink` (`Pages.tsx:29`) renders every target the same way: teal, semibold, chevron. The kind is known (`getEntity(id).type`) but not shown. Examples:
  - Impact page, "Recorded path from this item": `Trade Enricher`, `Reference Data`, `Ledger Posting`, `trade-enricher`, `trade`, `trade_event`. These are three components, a repository and two tables. They look identical.
  - Network policy: "Calling component" and "Destination" columns both contain teal links, but the destination can be a component or a database (`Reporting Warehouse`).
  - Search groups use model names (`SERVICE`, `TABLE`, `REPOSITORY`) as small teal text, with no icon. The rest of the UI says "Software component", not "service".
  - Graph nodes are all the same teal rounded box, although the components are HTTP services, workers and a pipeline (the page even offers type filters for these).
- **User impact:** The core action of this product is clicking from one thing to the next. Each click lands on a page whose type the user must work out from small text. After four clicks they no longer know if they are on a table, a repository or a component. This is the problem named in the request.
- **Recommended fix:** A single kind system (see the kind-system solution below) and a `KindLink` that always shows the kind icon in the kind hue in front of the name.

**2. Type colours and status colours are the same colours**
- **Lens:** 8 Signal-to-noise, 9 Consistency.
- **Observation:** Exact hex collisions in `src/styles.css`:

  | Hex | Kind meaning | Status meaning |
  |---|---|---|
  | `#9a5a05` | Database table | Retired present, Stale (amber family) |
  | `#107333` | Environment | Enabled, Passed (green family) |
  | `#1d4ed8` | API endpoint | Different |
  | `#6d28d9` | Requirement | Inferred; also the role tags on findings |
  | `#087d73` teal | Software component | Brand, every link, every primary button, every eyebrow |

  The table icon is amber on the database page but teal (top border) on the data catalogue page. The same kind has two colours.
- **User impact:** Colour is the fastest cue a person reads. Here it is ambiguous, so users learn to ignore it. A user who sees an amber table icon next to an amber "Stale" pill reads "this table has a problem".
- **Recommended fix:** Status owns red, amber, green and neutral grey, and nothing else uses them. Kinds get hues outside that set. Links and primary buttons stop using a kind hue.

### Significant

**3. The demo explains itself instead of being obvious**
- **Lens:** 2 Cognitive load, 8 Signal-to-noise.
- **Observation:** The overview starts with a dark "How to read this demo" box and a "Domain shorthand" glossary. 12 of 19 pages have a teal `ReadingGuide` bar ("Select a component to isolate…", "Read each row across…", "Start with a failed result…"). The type badge says "You are viewing" plus a sentence that defines the type.
- **User impact:** Each guide is one more block to read before the content. Experienced users skip them, so the guides do not help the people they are for. They also tell the viewer that the screen needs a manual.
- **Recommended fix:** Delete the reading guides one at a time and fix the cause that each one covers (for example, "Select a component to isolate…" becomes a visible empty state in the graph: "Click a component to see what it calls and what calls it"). Keep only the overview's one-sentence "what is this" line.

**4. Two layers of jargon**
- **Lens:** 2 Cognitive load, 9 Consistency (terminology).
- **Observation:** Counts across UI and data sources: snapshot 111, harvest 58, exposure 57, journal 47, LEI 37, regulatory 35, counterparty 31, ledger 28, estate 26, debit 19, netting 18, hygiene 15, lens 11, hop 11, autopsy 5, provenance 5, blast radius 2. The labels "View as / All perspectives", "Evidence pulse", "Hygiene · investigation queue", "The autopsy on the right" and "1 hop / 2 hops" are on primary surfaces.
- **User impact:** Non-native speakers and people outside finance need a dictionary on two levels. A tester from logistics cannot tell whether "netting" is a technical or a business concept.
- **Recommended fix:** Plain term list (below). For the finance layer, see the open question about the domain.

| Now | Plain |
|---|---|
| View as: All perspectives | Show for: Everyone / Developer / Tester / Operations |
| Snapshot: Current demo snapshot | Data from: 13 Oct 08:00 UTC |
| Harvested, harvest | Collected, found in |
| Provenance, evidence origins | Source |
| Evidence fresh / stale | Up to date / Out of date |
| 1 hop / 2 hops | 1 step / 2 steps away |
| Upstream / Downstream | Called by / Calls |
| Cleanup candidates, hygiene, autopsy | Possibly unused |
| Deployment drift | Version differences |
| Blast radius | What could be affected |
| Estate | System |
| Evidence pulse | Test results |
| Executable requirement | Requirement |
| Machine exports | Data for tools and AI |
| Exposure | Money at risk |
| Netting | Offsetting |
| Counterparty | Trading party |
| Notional | Amount |
| Journal entry / lines, ledger | Accounting entry / lines |

**5. Navigation mixes questions and things, and one group is wrong**
- **Lens:** 14 Whole-system alignment, 5 Gestalt.
- **Observation:** The sidebar groups are EXPLORE, INVESTIGATE and EVIDENCE. "Data & tables" is under EVIDENCE, but tables are things, not evidence. "Network policy" is a list of things (rules). Nav icons do not match the page badges: Environments uses `Activity` (a pulse line) in the nav and `Server` on the page; Components uses `Boxes` in the nav and `Box` on the page; Evidence sources uses `TestTube2` in the nav and `GitBranch` on the cards. There is no list page for API endpoints, so you can only reach an API from its component.
- **User impact:** The sidebar is the map of the product. When it groups by a mix of task and type, users cannot predict where something is. Icons that change between nav and page break the link between "where I clicked" and "where I am".
- **Recommended fix:** Two groups. "Questions" (task pages named as the question they answer) and "Things" (one entry per kind family, with the family icon and hue). Evidence sources and exports go to a small footer group.

  ```text
  QUESTIONS
    What needs attention?        (overview)
    Why did a test fail?         (requirements, filtered to failed)
    What is different between environments?
    What could a change affect?  (impact)
    What might be unused?        (cleanup)
  THINGS
    ◆ Requirements               violet
    ■ Components & APIs          teal
    ● Data (databases, tables)   indigo
    ▲ Environments & network     slate-blue
  SOURCES
    Where facts come from · Data for tools and AI
  ```

**6. The map does not show where the problems are**
- **Lens:** 1 Visual hierarchy, 14 Whole-system alignment.
- **Observation:** The overview has six findings and a "System flow" graph side by side. Four findings concern the Reporting Data Loader, but the loader node looks the same as every other node. The graph does not use the global environment selector. Node labels are clipped ("edger Posting", "ade Validator", "Reference Data" cut in the impact graph; "Regulatory Reporting" cut on the overview). The minimap covers the Trade Validator node on the overview and the guided demo.
- **User impact:** The request asks how things connect and play together. The map is the one place that could show it, but it is decorative. The user must connect the six cards to the map in their head.
- **Recommended fix:** Overlay status on the nodes for the selected environment (red outline for the failed step, amber dot for findings, node badge "2.4.1 ≠ prod 2.3.8"). Clicking a finding highlights its nodes. Give nodes a shape per component type. Size nodes to fit the label and hide the minimap at this graph size (8 nodes).

**7. Detail page headers stack three labels before the name, in text that is too small**
- **Lens:** 1 Visual hierarchy, 4 Typography.
- **Observation:** Each detail page shows the "You are viewing" badge (8–11px), then a teal eyebrow ("Component type · Scheduled data pipeline", 10px), then the H1. The kind appears in the badge and again in the eyebrow. Across `styles.css` there are 137 `font-size` declarations of 10px or less, and 1 at 7px.
- **User impact:** The type, which should be the strongest orientation cue after the name, is the smallest text on the page. At 8–10px it is hard to read for many users and fails reasonable minimums for body text.
- **Recommended fix:** One kind chip on the same line as the H1 (icon plus "Table", in the kind hue, 12–13px). A 4px band in the kind hue on the left of the header block. The eyebrow then holds only the context ("in Reporting Warehouse"). Set a floor of 11px for labels and 13px for running text.

**8. The same action has different names and weights**
- **Lens:** 9 Consistency.
- **Observation:** Impact analysis is "Explore impact" (solid) on a component, "Check possible impact" (solid) on an API, and "Check possible impact" (outlined) on a requirement and a table. "Guided demo" (top bar) and "Start guided demo" (overview) are two buttons for one action on the same screen.
- **User impact:** Users wonder whether the two impact buttons do different things, and the varying weight suggests the action matters more on some pages than others.
- **Recommended fix:** One label ("What could this affect?"), one style, one position on every detail page. Remove the overview's second guided-demo button.

**9. Three environment selectors and no rule for which one applies**
- **Lens:** 2 Cognitive load, 12 Design for context.
- **Observation:** The top bar has a global environment selector. Network policy has its own environment selector. Compare has left and right selectors. The global selector is cut off at 1440px ("UAT · User Acceptance T").
- **User impact:** An operations person who sets "Production" in the top bar and opens Network policy may see User Acceptance Test rules without noticing. In a real incident this produces a wrong conclusion.
- **Recommended fix:** Page selectors start from the global value and show "(from top bar)" when they match, or the global selector is disabled on pages that set their own. Widen the select or show only the short code ("UAT") with the full name in the option list.

**10. Noise on findings cards**
- **Lens:** 8 Signal-to-noise.
- **Observation:** Each of the six findings cards shows a category eyebrow, an "Evidence Fresh" pill (five of six are fresh), up to three purple role tags, an environment tag, a source chip and an "Inspect" link.
- **User impact:** Seven elements per card times six cards. The one card that is out of date does not stand out because every card has a freshness pill.
- **Recommended fix:** Show freshness only when it is not fresh. Drop role tags when the role is "All" (they only repeat the role filter). Make the whole card the link.

### Minor

**11. Duplicate content on the database page.** "Tables and recorded key relationships" and "Tables in this database" list the same five tables twice. Keep the list and move the key links next to it. Lens 8.

**12. Duplicate kind dictionaries in code.** `humanEntityType` (`Pages.tsx:12`) and `entityKinds` (`:15`) name the same kinds with different keys (`service` vs `component`, `endpoint` vs `api`). Nav icons in `App.tsx:34` are a third list. This is the root cause of the icon drift in the navigation issue. Lens 9.

**13. Layered CSS overrides.** `.entity-identity` and `.entity-link` are each defined three or four times with different font sizes; the later rule wins. Changes to the kind system will be fragile until each selector has one definition. Lens 9.

**14. URL and label disagree.** "Software components" lives at `/services`. Lens 9.

**15. Not checked:** narrow screens, keyboard flow, dark mode. Contrast was not measured.

## Solutions for critical and significant issues

### Kind system (issues 1, 2, 5, 7, 12)
- **Conservative (S/M):** Move the existing `entityKinds` into one shared module, add the missing kinds, and use its icon in `EntityLink`, search results and nav. Change the table hue so it does not collide with amber.
- **Considered (M), recommended:** Group kinds into five families. Each family has one icon shape, one hue, one name style. Status keeps red, amber, green and grey only; "Different" and "Inferred" become neutral grey with an icon.

  | Family | Kinds | Hue | Name style |
  |---|---|---|---|
  | Requirement | requirement, scenario, run | violet | sentence, sans |
  | Software | component, API endpoint, repository | teal | Title Case sans; API path in mono |
  | Data | database, table, column | indigo | snake_case in mono |
  | Runtime | environment, deployment, network rule, setting, feature switch | slate-blue | short code chip (`UAT`) or key in mono |
  | Source | evidence source, export | neutral grey | sans, with the source dot icon |

  Links and primary buttons move to a neutral ink colour so that teal means only "software". Every place an object appears (nav, header band, `KindLink`, search group, breadcrumb, graph node, list row) reads from the one module. Users learn five cues once and recognise them on every page.
- **Ambitious (L):** Add the family to every relationship as well, and draw the graph with mixed kinds (components, databases, environments) using the family shapes. The map becomes the main way to navigate.

Recommendation: the considered option. It fixes the root cause (no single source of kind identity) without a redesign. The ambitious option is worth it only if the map becomes the home page (see issue 6).

### Self-explaining demo (issue 3)
- **Conservative:** Delete the "How to read this demo" box and the glossary. Keep the reading guides.
- **Considered, recommended:** Remove reading guides page by page, and replace each with a better label, empty state or default selection.
- **Ambitious:** Remove the guided demo route and make the overview the guided entry: three role cards ("I am a tester → why did this test fail?").

### Jargon (issue 4)
- **Conservative:** Apply the plain term list to UI strings in `Pages.tsx` and `App.tsx` only.
- **Considered, recommended:** Also apply it to the data (`src/data/atlas.ts`) so findings, requirements and exports use the same words.
- **Ambitious:** Change the fictional domain to one everyone knows (for example an online shop: order intake, payment check, stock, shipping, invoice report). This removes the finance layer completely. It touches every record and the validation script.

### Navigation (issue 5)
- **Conservative:** Move "Data & tables" to the first group and align the nav icons with the page icons.
- **Considered, recommended:** "Questions / Things / Sources" as shown in the issue.
- **Ambitious:** Replace the left nav for "Things" with a persistent breadcrumb of kinds ("Requirement › Step 5 › Component › Table") that shows the click path.

### Map with problems (issue 6)
- **Conservative:** Fix label clipping and remove the minimap.
- **Considered, recommended:** Status overlay for the selected environment and finding-to-node highlighting.
- **Ambitious:** Make the overview map-first: the map fills the top, findings attach to nodes as callouts.

### Headers, actions, selectors, cards (issues 7–10)
Each has one obvious fix, listed in the action plan.

## Product alignment
- **Vision:** README promise is "one navigable, evidence-backed model". The evidence part works. "Navigable" is weak because the user loses track of kinds while navigating (issues 1, 5).
- **Personas:** Tester path (requirement detail) fits well. Operations path (compare, network) has the selector ambiguity (issue 9). Developer path (impact) suffers most from unmarked kinds (issue 1).
- **Design brief:** Not loaded; none exists.

## Action plan
| Priority | Issue | Fix | Effort |
|---|---|---|---|
| 1 | Type and status colours collide | Reserve red, amber, green, grey for status; new kind hues; links and buttons in neutral ink | S |
| 2 | Kind invisible on links, search, nav | One kind module (families), `KindLink` with icon and hue, used in search, nav, breadcrumbs, lists | M |
| 3 | Header stacks three labels in tiny text | Kind chip beside H1, kind band, eyebrow for context only, font floor 11px / 13px | S |
| 4 | Jargon | Apply the plain term list to UI strings, then data | M |
| 5 | Demo explains itself | Remove explainer box, glossary and reading guides; fix each cause | M |
| 6 | Nav mixes questions and things | Questions / Things / Sources grouping, icons from the kind module | S |
| 7 | Map shows no problems; clipped labels | Status overlay, finding highlighting, label-fit nodes, no minimap | M |
| 8 | Same action, different names | One impact action label and style; one guided-demo button | S |
| 9 | Three environment selectors | Page selectors inherit and show the global value; short code in the top bar | S |
| 10 | Noisy finding cards | Hide fresh pills and "All" role tags; whole card is the link | S |
| 11 | Duplicate tables on database page | Keep one list | S |
| 12 | CSS selectors defined several times | One definition per selector for the touched components | S |

## Implementation notes
Not implemented. Review only.

## Open questions
1. Is the finance domain deliberate (the target audience is banks), or is it only a plausible example? If it is only an example, the domain change in the jargon solution removes the biggest comprehension barrier for other audiences.
2. Is the guided demo route needed if the overview becomes role-based?
3. Should the map become the home page? This decides between the considered and the ambitious kind-system option.
