# System Atlas

## Complete implementation specification for a static demonstration website

This document is intended to be handed to a fresh AI coding session. It is self-contained. The implementation agent should build the complete prototype described here without requiring access to the conversation that produced it.

## 1. Assignment

Build a polished, fully navigable demonstration website called **System Atlas**.

System Atlas demonstrates how a large software organisation could harvest facts from repositories, deployment systems, executable tests, databases, infrastructure-as-code and network configuration, then connect those facts into one human-readable system map and one machine-readable knowledge graph.

The result is an inspirational mock-up for workshops with software-development teams. It must look and behave like a credible modern product, but all data is fictional and all integrations are simulated.

The delivered site must:

- Build locally.
- Produce a `dist` directory containing only static deployable files.
- Require no backend, database, authentication, runtime API or server-side rendering.
- Work on ordinary static hosting, including hosting below a subpath.
- Contain realistic, internally consistent fictional data.
- Support free exploration and a reliable five-minute guided demonstration.
- Be useful when viewed from developer, tester and operations perspectives.
- Expose provenance and uncertainty rather than presenting guesses as facts.

Do not add a chatbot or AI assistant to the human-facing interface. External AI use is represented only through a Machine Access page and exported knowledge files.

## 2. Product proposition

Teams in complex environments spend too much time reconstructing basic system facts from scattered tools and other people:

- What is deployed in this environment?
- Which version and commit produced it?
- How does this service connect to other services and data?
- Which executable requirements exercise it?
- Under which versions and configuration did those scenarios pass?
- How does UAT differ from Production?
- What might be affected by a proposed change?
- Which old configurations, rules or deployments may no longer be needed?

System Atlas demonstrates a better model: harvest those facts automatically, preserve their provenance and connect them through stable typed relationships.

The key message for workshop participants is:

> We already possess most of this information. The missing piece is harvesting it into one connected, evidence-backed model that both humans and AI agents can navigate.

## 3. Experience principles

Every major page must answer, in this order:

1. What am I looking at?
2. What needs my attention?
3. What is connected to it?
4. What differs across environments or snapshots?
5. What evidence supports this?
6. Where can I go next?

Use progressive disclosure. Show the useful conclusion first, then allow the user to inspect technical detail and raw evidence.

The interface must distinguish:

- Harvested fact
- Inferred relationship
- Manually curated explanation
- Executable-test evidence
- Unknown or missing evidence

Never describe a passing executable requirement as proof that the system is correct. It is evidence that a particular scenario passed under recorded conditions at a particular time.

Never describe a cleanup candidate as safe to delete. Show why it was flagged and what remains unknown.

## 4. Target roles and role lenses

Add a persistent role-lens selector:

- Developer
- Tester
- Operations
- All perspectives

The role lens is not authentication and does not hide data. It changes prioritisation, suggested questions, default filters and dashboard ordering. Store the selection in the browser.

### 4.1 Developer jobs

Help a developer answer:

- What depends on this service, endpoint, event, table or configuration key?
- What might break if I change this contract?
- Which requirements exercise this component?
- Which versions are deployed in each environment?
- Where does configuration differ?
- Who consumes this API or data?
- Is this endpoint, table, feature toggle or configuration key apparently unused?
- Which repository and commit produced the deployed version?
- Which relationships are harvested and which are inferred?

Developer defaults should emphasise recently changed components, deployment drift, downstream impact, uncovered components, suspected unused artefacts and repository links.

### 4.2 Tester jobs

Help a tester answer:

- What exactly is deployed in the environment I am testing?
- How does that environment differ from Production?
- Which executable requirements cover this capability?
- What passed, failed, was skipped or has not run recently?
- Under which versions and configuration did a requirement pass?
- What changed since the last successful execution?
- Which services, endpoints and tables did the scenario exercise?
- Which test-data or synthetic providers were used?
- Which important paths have no recent executable evidence?

Tester defaults should emphasise recent executions, failed or stale scenarios, environment readiness, differences from Production, coverage by capability and changes since the last passing run.

### 4.3 Operations jobs

Help an operations person answer:

- Which environments contain outdated or inconsistent versions?
- Which harvested sources are stale?
- Which services have unclear ownership?
- Which feature toggles appear obsolete?
- Which firewall rules no longer correspond to a deployed dependency?
- Which deployments, database permissions or configuration keys may be orphaned?
- Where does an environment drift from its expected baseline?
- Which components have passed an intended retirement date?
- What could be affected if an old rule or deployment is removed?

Operations defaults should emphasise drift, stale evidence, outdated deployments, cleanup candidates, ownership gaps and expired exceptions.

## 5. Scope

### Included

- Systems, services, workers and scheduled pipelines
- REST APIs and endpoints
- Repositories, releases, versions and commits
- Environments and deployments
- Environment-specific configuration and feature toggles
- Databases, schemas, tables and important columns
- Executable requirements, scenarios, steps and executions
- Firewall and network rules
- Ownership
- Source provenance and freshness
- Typed relationships
- Full-system and local dependency graphs
- Search, filtering, comparison and historical snapshots
- Impact exploration and cleanup investigation
- Static machine-readable exports for future external AI use

### Excluded

- Live logs, traces and metrics
- Incident management
- Real system integrations
- Editing harvested data
- Real Git, CI/CD, database or infrastructure access
- Authentication and authorisation
- Embedded AI chat
- Automated deletion or remediation
- Production-grade scale, security or multi-tenancy

## 6. Fictional domain

Use a fictional financial platform called **Northstar Regulatory Reporting**.

Northstar receives trade events, validates and enriches them, creates accounting entries, loads a reporting warehouse and produces regulatory exposure reports.

Display a persistent label stating **Fictional demonstration data**.

### 6.1 Teams

- Trade Processing
- Finance Platform
- Regulatory Reporting
- Platform Operations
- Quality Engineering

### 6.2 Services and jobs

| ID | Name | Type | Owner | Responsibility |
|---|---|---|---|---|
| `svc-trade-intake` | Trade Intake | REST service | Trade Processing | Receives new and amended trades |
| `svc-trade-validator` | Trade Validator | Service | Trade Processing | Applies business and compliance validation |
| `svc-reference-data` | Reference Data | REST service | Finance Platform | Supplies instruments, currencies and counterparties |
| `svc-trade-enricher` | Trade Enricher | Worker | Trade Processing | Enriches accepted trades with reference data |
| `svc-ledger-posting` | Ledger Posting | Service | Finance Platform | Creates balanced journal entries |
| `job-reporting-etl` | Reporting ETL | Scheduled pipeline | Regulatory Reporting | Loads reporting facts and dimensions |
| `svc-regulatory-reporting` | Regulatory Reporting | REST and batch service | Regulatory Reporting | Produces daily exposure reports |
| `svc-notification` | Notification | Service | Platform Operations | Sends processing and report notifications |

### 6.3 Data stores

| Database | Important tables |
|---|---|
| Trade Operations DB | `trade`, `trade_event`, `validation_error`, `validation_error_legacy` |
| Reference Data DB | `instrument`, `counterparty`, `exchange_rate` |
| Ledger DB | `journal_entry`, `journal_line` |
| Reporting Warehouse | `fact_trade`, `fact_exposure`, `dim_counterparty`, `dim_instrument` |

Give every table a purpose, owning team, important columns, readers, writers, classification label, lineage and source reference. Use fictional schemas and values. Do not include secrets or realistic personal financial data.

### 6.4 Environments

- Development
- Test
- User Acceptance Test, displayed as UAT
- Pre-production
- Production

### 6.5 Demo snapshots

Provide three curated historical snapshots:

- Before release candidate: 6 October 2026, 08:00 UTC
- Previous day: 12 October 2026, 08:00 UTC
- Current demo snapshot: 13 October 2026, 08:00 UTC

Always label these as demo snapshots. Do not compare them to the viewer's current date.

### 6.6 Repositories and versions

Create one repository per service or job. Use internally consistent fictional commit hashes and release dates.

Current-snapshot highlights:

- Trade Intake `3.7.2` is deployed consistently from Test through Production.
- Trade Validator `4.3.0-rc1` is in UAT; Production uses `4.2.0`.
- Reference Data `5.1.0` is deployed, but Test and UAT use a synthetic-provider configuration.
- Trade Enricher `2.9.0` is in UAT and Pre-production; Production uses `2.8.4`.
- Ledger Posting `6.4.1` is deployed consistently.
- Reporting ETL `2.4.1` is in UAT and Pre-production; Production uses `2.3.8`.
- Regulatory Reporting `3.2.0-rc2` is in UAT and Pre-production; Production uses `3.1.5`.
- Notification `1.9.0` is current, but Pre-production still contains a retired `1.8.2` deployment.

### 6.7 Configuration and feature toggles

Include at least these keys:

- `reporting.cutoff-time`
- `reporting.batch-size`
- `reference-data.provider`
- `trade-validation.strict-lei`
- `etl.retry-count`
- `etl.warehouse-schema`
- `notifications.enabled`
- `journal-posting.mode`

Include these toggles:

- `new-netting-model`: enabled only in UAT
- `legacy-netting-mode`: still present in Development, Test and UAT but referenced by no current deployment manifest
- `synthetic-reference-data`: enabled in Test and UAT
- `strict-lei-validation`: enabled in UAT, Pre-production and Production
- `exposure-report-v2`: enabled in UAT and Pre-production

### 6.8 Executable requirements

Create 10 to 12 business-readable requirements, including:

- A valid FX trade is accepted.
- A trade with an invalid Legal Entity Identifier is rejected.
- Duplicate trade submission is idempotent.
- An accepted FX trade is enriched with the applicable exchange rate.
- Accepted trades create balanced journal entries.
- Accepted FX trades appear in the daily exposure report.
- The daily exposure report is available before its cutoff.
- Corrected trades are reflected in the next report.
- Only approved network paths can reach the Reporting Warehouse.
- Production configuration contains no synthetic data providers.

Create 25 to 35 scenarios across the requirements and at least three historical executions for important scenarios.

For the central scenario, use these steps:

1. Submit a valid FX trade.
2. Validate compliance fields.
3. Enrich the trade with reference data.
4. Create balanced journal entries.
5. Load the Reporting Warehouse.
6. Confirm that the exposure report contains the trade.

Each executed step links to the service, endpoint or job involved, the relevant data, the environment, deployed version and evidence record.

### 6.9 Network rules

Create 10 to 15 fictional rules. Each rule needs source, destination, port, protocol, environment, allow or deny, owner, source configuration and last-harvested time.

The central anomaly is that the UAT route from Reporting ETL to Reporting Warehouse on PostgreSQL port 5432 is absent. The corresponding route exists in Pre-production and Production.

Include an apparently orphaned rule from an older Notification deployment to a retired endpoint. Label it a cleanup candidate, not a confirmed orphan.

## 7. Connected demonstration story

The data must form one coherent story rather than a random collection of warnings.

A new netting model is being prepared for release:

- `new-netting-model` is enabled only in UAT.
- Trade Enricher and Reporting ETL are ahead of Production.
- UAT uses the synthetic Reference Data provider.
- The latest UAT execution of “Accepted FX trades appear in the daily exposure report” failed at the warehouse-load step.
- The expected UAT network route to the warehouse is absent.
- The same scenario passed in Production under older service versions and Production configuration.
- The Trade Enricher repository harvest is stale relative to its expected hourly collection interval.
- `legacy-netting-mode` remains in three non-production environments but has no references in current manifests.
- Pre-production contains a retired Notification version.

The portal must not assert that the missing route or changed ETL version caused the failed scenario. It should present them as correlated facts with provenance and unknowns.

This story supports three workshop questions:

- Tester: Why did the UAT scenario fail, and is UAT suitable for the intended test?
- Developer: What could be affected by changing the trade contract or netting logic?
- Operations: Which drift and old configuration should be reviewed?

## 8. Information model

Represent data in typed JSON or TypeScript records. At minimum support:

```text
Entity
- id
- type
- name
- slug
- description
- ownerTeamId
- tags[]
- sourceReferences[]
- harvestedAt
- expectedRefreshInterval
- pageUrl

Relationship
- id
- type
- fromEntityId
- toEntityId
- environmentId?
- snapshotId?
- description
- evidenceKind
- sourceReferences[]
- harvestedAt

Deployment
- serviceId
- environmentId
- snapshotId
- version
- commit
- deployedAt
- configuration{}
- featureToggles{}
- sourceReferences[]

Requirement
- id
- title
- capability
- narrative
- preconditions[]
- scenarios[]
- ownerTeamId

TestExecution
- id
- requirementId
- scenarioId
- environmentId
- snapshotId
- status
- executedAt
- serviceVersions{}
- steps[]
- evidenceReferences[]

SourceReference
- id
- sourceType
- sourceName
- sourceLocation
- collector
- harvestedAt
- expectedRefreshInterval

Finding
- id
- type
- severity
- title
- summary
- affectedEntityIds[]
- applicableRoles[]
- detectionRule
- supportingFactIds[]
- counterEvidence[]
- unknowns[]
- recommendedInspection
```

Use stable IDs everywhere. Relationships should include types such as:

- `CALLS`
- `PROVIDES`
- `READS_FROM`
- `WRITES_TO`
- `PUBLISHES`
- `CONSUMES`
- `DEPLOYED_IN`
- `IMPLEMENTED_BY`
- `EXERCISED_BY`
- `ALLOWED_TO_CONNECT`
- `OWNED_BY`
- `DERIVED_FROM`

## 9. Technical architecture

Use a conventional, maintainable static frontend stack:

- Vite
- React
- TypeScript
- React Router with hash-based routing so deep links work on arbitrary static hosts without rewrite rules
- Cytoscape.js for graphs
- Lucide or an equivalent coherent icon set
- Locally bundled interface and monospace fonts
- CSS variables for design tokens

Do not add a backend. Do not make runtime network requests.

All application data must be bundled at build time. Static machine-readable exports should be copied into `dist/knowledge`.

Required commands:

```text
npm install
npm run dev
npm run validate-data
npm run build
npm run preview
```

`npm run build` must create a complete `dist` directory. Configure asset paths using Vite's base URL support so the site can be hosted at a domain root or subpath.

Suggested project structure:

```text
src/
  app/
  components/
  pages/
  graphs/
  data/
    entities/
    relationships/
    deployments/
    requirements/
    executions/
    findings/
    snapshots/
  lib/
  styles/
public/
  knowledge/
scripts/
  validate-data.*
  build-search-index.*
dist/
```

Data validation must detect broken references, duplicate IDs, missing required fields and inconsistent route targets before the build succeeds.

## 10. Routes

Provide stable hash routes:

```text
/#/
/#/map
/#/requirements
/#/requirements/:requirementId
/#/services
/#/services/:serviceId
/#/apis/:endpointId
/#/environments
/#/environments/:environmentId
/#/compare?left=uat&right=production
/#/impact/:entityId
/#/hygiene
/#/data
/#/data/databases/:databaseId
/#/data/tables/:tableId
/#/network
/#/sources
/#/machine-access
/#/presenter
```

Filters, selected graph node, role lens, environment and snapshot should be shareable in the URL where practical.

## 11. Global shell

Use a three-layer desktop layout:

1. Collapsible left navigation rail
2. Main content canvas
3. Optional right-side evidence drawer

The header contains:

- System Atlas wordmark
- Global search
- Role lens
- Environment selector
- Snapshot selector
- Demo-data badge
- Guided-demo action

The evidence drawer opens without navigating away. It shows provenance, evidence kind, harvested time, source location, collector and links to related entities.

All detail pages include breadcrumbs, stable URLs, related entities, freshness and a back-to-graph action.

## 12. Page specifications

### 12.1 Dashboard

Do not lead with generic inventory counts. Lead with a “What needs attention?” area containing six evidence-backed findings:

1. UAT Reporting ETL is one release ahead of Production.
2. The latest FX exposure-report scenario failed in UAT.
3. The expected UAT warehouse route is absent.
4. Trade Enricher source evidence is stale.
5. `legacy-netting-mode` has no current manifest references.
6. Pre-production contains retired Notification `1.8.2`.

Each finding shows why it matters, applicable roles, environment, evidence source, freshness and a direct next action.

Secondary dashboard modules:

- Compact service-level system map
- Deployment matrix by environment
- Executable-requirement summary
- Recent changes
- Data freshness by source
- Three role-specific suggested journeys

Avoid decorative pie charts and oversized KPI cards.

### 12.2 Full system map

Start with a comprehensible service-level graph.

Controls:

- Node-type filters
- Relationship filters
- Environment overlay
- Snapshot selector
- Role lens
- Search and focus
- Upstream and downstream path highlight
- One-hop and two-hop expansion
- Zoom, minimap and reset
- Open selected entity
- Accessible relationship-table alternative

Cluster nodes by capability. Hide endpoints and tables until requested. Fade unrelated nodes when a path is selected. Show edge labels on hover or selection rather than all at once.

### 12.3 Requirements list

Group by business capability. Filter by environment, owner, latest result and freshness.

Statuses:

- Passed
- Failed
- Skipped
- Not executed
- Stale
- Unknown

### 12.4 Requirement detail

Show:

- Business-readable title and intent
- Capability and owner
- Preconditions
- Main scenario first
- Alternate and failure scenarios collapsed initially
- Latest evidence by environment
- Version and configuration context
- Expandable scenario steps
- Services, endpoints and data touched by each step
- Execution history
- Environment-by-scenario matrix
- Technical-path graph
- Source and freshness metadata

Each scenario step exposes expected result, actual result, component, technical operation, environment, version and evidence link.

Use language such as “Passed under these recorded conditions,” “No recent evidence,” and “Relationship inferred from configuration.”

### 12.5 Services list

Show name, type, responsibility, owner, repository, deployed environments, versions and freshness. Provide search, role-aware sorting and filters.

### 12.6 Service detail

Show:

- Responsibility and owner
- Repository and default branch
- APIs provided
- Calls made
- Events published or consumed
- Databases and tables accessed
- Requirements exercising the service
- Deployment matrix
- Configuration and toggles
- Network rules
- Local dependency graph
- Provenance

Use tabs only for peer views: Overview, Deployments, Requirements, Configuration and Dependencies.

### 12.7 API endpoint detail

Show method, path, purpose, request and response examples, authentication expectation, provider, consumers, implementing version, requirements exercising it and provenance.

### 12.8 Environment detail

Show deployed components, versions, commits, configuration summary, toggles, network-rule summary, source freshness and warnings. Provide a prominent Compare action.

### 12.9 Environment comparison

Default to UAT versus Production. Support side-by-side and “differences only” modes.

Compare:

- Missing or additional services
- Version and commit differences
- Configuration differences
- Feature-toggle differences
- Database/schema differences
- Firewall-rule differences
- Requirement-result differences
- Source-freshness differences

Do not describe Production as automatically correct or as a golden master.

### 12.10 Impact Explorer

Allow selection of a service, endpoint, event, table or configuration key.

Show:

- Immediate dependencies
- Downstream paths to a selectable depth
- Requirements touching the affected path
- Environments and deployments involved
- Owners of affected components
- Evidence type for each relationship
- Paths lacking recent executable evidence

Seed this central example:

> Changing `POST /trades` may affect four services, six executable scenarios and three warehouse tables. One downstream path has no evidence newer than 18 days.

Use “possible impact,” not certainty. Highlight the path on the graph and repeat it as a readable ordered list.

### 12.11 Hygiene and cleanup

List cleanup candidates:

- Apparently unused endpoint
- Feature toggle with no current references
- Firewall rule whose destination is no longer deployed
- Retired deployment remaining in Pre-production
- Table with no known reader or writer
- Repository with no mapped deployment
- Requirement with no recent execution
- Configuration key present in only one environment
- Entity with no current owner

Every item must show detection rule, supporting facts, uncertainty, possible blast radius, owner, last verified time and linked entities.

For the obsolete firewall-rule candidate, show a “relationship autopsy”: why it existed, what used it, when that deployment disappeared, whether anything still references the destination and which requirements previously exercised the path.

### 12.12 Data catalogue

Provide database and table pages with purpose, ownership, environments, important columns, readers, writers, access mode, lineage, requirements touching the data, local graph, classification and freshness.

### 12.13 Network page

List rules by environment with source, destination, port, protocol, allow or deny, owner, source and affected services. Filter by environment and service.

### 12.14 Sources page

Explain realistic origins of harvested facts:

- Git repository metadata
- Build manifests
- Deployment manifests
- Infrastructure-as-code
- OpenAPI specifications
- Database catalogues
- Executable-test output
- Firewall configuration
- Manually curated descriptions where automation cannot infer intent

Show each fictional collector, expected interval, last successful harvest and produced entities.

### 12.15 Machine Access page

Do not add AI chat.

Show:

- Available JSON and Markdown resources
- Stable entity IDs
- Example MCP resource names
- Deep-link format
- Provenance fields returned with results
- One static example of an external agent answer citing links back into the portal

Export the knowledge records into `dist/knowledge` with a top-level manifest.

## 13. Graph behaviour

Use typed nodes with distinct shape, icon and colour. Do not depend on colour alone.

### Full graph

- Begin at service level.
- Cluster by capability.
- Overlay environment and evidence state instead of duplicating the graph.
- Highlight upstream and downstream paths.
- Fade unrelated nodes on selection.
- Animate only meaningful transitions.

### Local ego graph

Every entity detail page includes a local graph:

- Current entity centred and visually dominant
- Inbound relationships on the left
- Outbound relationships on the right
- Data below
- Requirements and evidence above
- Stable layout to reduce cognitive load
- One-hop, two-hop and “open in full map” controls

Never display an undifferentiated hairball.

### Historical transition

Changing snapshot should visibly update versions, toggles, evidence and network edges. Use a restrained transition so the audience can see what changed.

## 14. Presenter mode

Provide a reliable five-minute guided demonstration with these chapters:

1. One system, scattered knowledge
2. Follow a business requirement into implementation
3. Compare what is actually deployed
4. Estimate the blast radius of a change
5. Find configuration that may be obsolete
6. Expose the same evidence to external AI agents

Each chapter opens the correct route, applies filters, highlights relevant controls and displays one short narrative caption. Include Back, Next, Exit and Restart. Never prevent free exploration.

Recommended sequence:

1. Open the calm service map.
2. Search for the FX exposure-report requirement.
3. Illuminate its path through services and data.
4. Open the failed UAT execution and evidence chain.
5. Compare UAT with Production.
6. Select `POST /trades` and reveal possible impact.
7. Switch to Operations and inspect a cleanup candidate.
8. Finish on Machine Access.

## 15. Evidence chains

Findings should expand into readable evidence chains, for example:

> The UAT reporting scenario failed at the warehouse-load step after Reporting ETL changed from 2.3.8 to 2.4.1, while the expected database route was absent, according to three harvested sources.

Make every clause clickable.

Divide the expanded view into:

- Confirmed facts
- Correlated changes
- Unknowns
- Suggested next inspection

This demonstrates reasoning while avoiding false certainty.

## 16. Search and navigation

Build a client-side search index covering:

- Entity names and descriptions
- Endpoint methods and paths
- Repository names
- Requirement text
- Version and commit values
- Database and table names
- Configuration keys
- Feature toggles
- Teams

Search suggestions must be grouped by type and show context. Add a keyboard-accessible command palette.

Include breadcrumbs, clear selected states, useful empty states and no dead controls. If a control appears interactive, it must work.

## 17. Provenance and freshness

Every factual item should expose:

- Source system
- Source document or file
- Collector
- Harvested timestamp
- Expected refresh interval
- Applicable environment
- Applicable snapshot
- Applicable version or commit
- Stable entity ID

Freshness states:

- Current
- Stale
- Unknown

Use relative freshness in the main UI and exact timestamps in the evidence drawer.

## 18. Visual design system

The result should feel like a serious evidence product, not a generic admin template.

### Layout

- Desktop-first and projector-friendly
- Collapsible 240-pixel navigation rail
- Twelve-column main grid
- Optional 360-pixel evidence drawer
- Maximum readable width for prose
- Full-width graph and comparison canvases
- Sticky table headers

### Colour

Use approximately:

- Navigation: `#0B1220`
- Navigation secondary: `#121C2E`
- Page background: `#F4F6F8`
- Surface: `#FFFFFF`
- Primary text: `#111827`
- Muted text: `#667085`
- Interactive teal: `#0F9E91`
- Current/passed green: `#16A34A`
- Attention amber: `#F59E0B`
- Failure red: `#E5484D`
- Inferred violet: `#7C3AED`
- Graph highlight cyan: `#22D3EE`

Use pale tinted surfaces instead of heavy borders. Reserve red for actual failures or blocked paths.

### Typography

- Inter or IBM Plex Sans for interface text
- JetBrains Mono for commits, versions, endpoints and configuration
- Bundle fonts locally
- Clear, restrained type scale
- Strong page titles, concise section headings and readable body text

### Components

- Cards with consistent 10 to 12 pixel radius
- Subtle shadows only where they clarify layering
- Compact but comfortable tables
- Status chips with icon, label and colour
- Comparison rows with clear before/after values
- Evidence drawer with structured sections
- Graph legends that remain visible
- Monospace values with copy controls

### Motion

- Transitions under 200 milliseconds
- Path-drawing animation only during guided reveals
- Smooth graph focus and fade
- Environment comparison that slides or crossfades from baseline to changed state
- Respect reduced-motion preferences

Do not use glassmorphism, 3D graphs, spinning globes, decorative moving particles, huge KPI numerals or gradients without meaning.

## 19. Interaction requirements

Include:

- Fast client-side navigation
- Persistent role, environment and snapshot selectors
- Search suggestions grouped by entity type
- Keyboard-accessible command palette
- Hover previews for linked entities
- Copy controls for commits, endpoints, table names and IDs
- Side-by-side and differences-only comparison
- Graph zoom, minimap and reset
- Path highlighting
- Shareable filtered URLs where practical
- Helpful empty states
- Visible keyboard focus
- Responsive behaviour suitable for tablets
- Accessible list or table alternatives for graphs

Core content and ordinary hyperlinks should remain readable if graph enhancement fails.

## 20. Three screenshot-quality views

Deliberately polish these views so they work in slides and workshop photographs:

### Tester view

Business scenario on the left, technical path in the centre and environment-specific evidence on the right.

### Developer view

Selected API contract surrounded by highlighted possible impact, with an untested downstream path clearly marked.

### Operations view

UAT-versus-Production drift with an evidence-backed cleanup candidate and historical snapshot control.

## 21. Content realism

Create enough data to survive unplanned exploration:

- 8 services and jobs
- 5 environments
- 8 repositories
- 12 to 16 API endpoints
- 4 databases
- 12 to 18 tables
- 10 to 12 executable requirements
- 25 to 35 scenarios
- At least 3 executions for important scenarios
- 40 to 60 typed relationships
- 10 to 15 firewall rules
- 8 to 12 configuration keys
- 5 to 8 feature toggles
- 6 evidence or freshness anomalies

All names, IDs, versions, commits, owners, timestamps and relationships must be internally consistent. Generate links only to local mock pages or clearly labelled fictional destinations; do not ship broken links to real Git hosts.

Use calm, specific language. Most of the system should appear normal. A screen full of red warnings will look artificial.

## 22. Accessibility and resilience

- Meet WCAG AA contrast targets.
- Support keyboard navigation through menus, tabs, tables, drawers and graph alternatives.
- Provide visible focus states.
- Use semantic HTML.
- Do not convey type or status with colour alone.
- Respect reduced motion.
- Provide alt text or accessible descriptions for meaningful visualisations.
- Ensure ordinary content remains usable at 1280 by 720 projector resolution.
- Avoid horizontal page scrolling except inside deliberate comparison or graph canvases.

## 23. Build phases

Implement in this order:

1. Create typed data model and validate references.
2. Seed the complete coherent dataset.
3. Build global shell, routing, search and design tokens.
4. Build dashboard and entity lists.
5. Build service, requirement, environment, data and network detail pages.
6. Add environment comparison.
7. Add full and local graphs.
8. Add Impact Explorer and Hygiene view.
9. Add evidence drawers, provenance and freshness.
10. Add historical snapshots and transitions.
11. Add Presenter mode.
12. Add Machine Access exports.
13. Polish the three screenshot-quality views.
14. Validate accessibility, links, data consistency and static deployment.

Do not spend time on sophisticated graph animation before the underlying navigation and data story work.

## 24. Definition of done

The prototype is complete only when:

- `npm run validate-data` succeeds.
- `npm run build` succeeds and produces `dist`.
- The built site works through `npm run preview` with no backend.
- It can be hosted under a subpath without broken assets or links.
- Every entity is reachable through navigation or search.
- Every graph node links to a relevant detail page.
- Every detail page links to related entities and provenance.
- The guided demo runs end to end without dead ends.
- A tester can establish what ran, where, against which versions and with what result.
- A developer can trace possible impact from a changed contract to consumers, requirements and data.
- An operations person can investigate drift and cleanup candidates with supporting evidence.
- Environment comparison exposes all seeded differences.
- Requirement pages connect business intent to technical execution evidence.
- Version and commit references are visible for every deployment.
- Provenance and freshness are consistently available.
- Historical snapshots visibly change relevant state.
- Graphs remain legible and task-oriented.
- The site clearly labels all information as fictional demonstration data.
- No claim overstates what the harvested evidence proves.
- No real secrets, financial records or personal data appear.
- No control merely pretends to work.
- The three screenshot-quality views look deliberate at laptop and projector resolutions.
- `dist/knowledge` contains a documented machine-readable export and manifest.

## 25. Required quality checks

Before delivery:

- Run the production build.
- Crawl internal routes and report broken links.
- Validate every relationship target and source reference.
- Verify that role, environment and snapshot selection persist.
- Verify hash-route deep links on the built site.
- Check the site at 1280x720, 1440x900 and a tablet viewport.
- Check keyboard navigation and reduced-motion mode.
- Inspect browser console for errors.
- Confirm that no runtime network request is needed.
- Confirm that all external-looking links are local mocks or explicitly marked fictional.
- Capture screenshots of the tester, developer and operations showcase views for review.

## 26. Final delivery

Deliver:

- Complete source code
- Lockfile
- `README.md` with setup, build and deployment instructions
- `dist` static output
- Data-model documentation
- Dataset validation command
- `dist/knowledge` exports and manifest
- Three showcase screenshots
- Short list of deliberate limitations

The README should state that the user will upload the contents of `dist` to their chosen static hosting service.
