# System Atlas data model

System Atlas uses a single typed, static dataset in `src/data/atlas.ts`. The interface, graphs, comparisons, search records, findings and files under `dist/knowledge/` are derived from it.

## Core records

- **Entity** — a stable, addressable service, endpoint, repository, database, table, configuration key, feature toggle or team-owned asset. Every entity has an ID, local page route, owner, provenance and refresh expectation.
- **Endpoint** — an API operation with authentication, content type, idempotency, request fields, response fields, error responses and examples. Each field defines its location, type, requirement state, purpose, constraints and example.
- **DataTable** — a table with purpose, row grain, update pattern, retention, classification, access paths, lineage and recorded table relationships. Each column defines its type, null rule, key role, purpose and example.
- **Relationship** — a typed edge between two entity IDs. It declares an evidence kind (`harvested`, `inferred`, `curated`, `executable` or `missing`) and its source references.
- **Deployment** — a service version and commit in one environment at one demo snapshot, including configuration and feature-toggle values.
- **Requirement and Scenario** — business-readable intent, acceptance criteria and business risk decomposed into executable paths and steps. Each step names its component, technical operation and relevant data entities.
- **TestExecution** — a scenario result under a recorded environment, snapshot, version set and evidence chain. It includes a run ID, trigger, duration, test data and observed step results. A pass is evidence under those conditions. It is not proof of correctness.
- **NetworkRule** — an environment-specific connection fact or expected-but-missing path. Historical snapshot helpers preserve changes in the UAT warehouse route.
- **Finding** — an evidence-backed attention signal with detection rule, supporting facts, correlations, counter-evidence, unknowns and recommended inspection.
- **SourceReference** — provenance for a harvested or curated statement: source type, location, collector, harvest time, interval and freshness.

## Identity and references

IDs are stable slugs such as `svc-transfer-intake`, `api-post-transfers` and `req-daily-report`. Foreign keys use those IDs rather than display names. The validation command rejects duplicate IDs and broken entity, environment, snapshot, scenario or source references.

## Snapshots

The three fixed demo snapshots are 6, 12 and 13 October 2026. Selecting a snapshot changes deployments, toggles, requirement evidence, findings and the UAT network route. These dates are part of the fictional story and are never compared with the viewer’s current date.

## Machine export

`npm run build:knowledge` writes normalized JSON collections and a manifest to `public/knowledge/`; Vite copies them to `dist/knowledge/`. External tools should begin with `manifest.json`, retain stable IDs and provenance, and link conclusions back to the relevant hash route.
