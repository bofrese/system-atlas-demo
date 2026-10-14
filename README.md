# System Atlas demo

This repository is a static, fictional demonstration of **System Atlas**: a way to assemble scattered software knowledge into one navigable, evidence-backed model.

The web application is an example interface for that idea. It is not a production System Atlas implementation, and Northstar—the system shown in the demo—does not exist.

## The problem

Knowledge about a software system is usually split across repositories, deployment tools, API specifications, database catalogues, network policy, test reports and people’s memories. Each source answers part of a question, but none explains the whole system.

That fragmentation makes ordinary questions expensive:

- What actually runs in each environment?
- Which business requirement exercises this service, API or table?
- What may be affected by a proposed change?
- Why did a scenario fail under these versions and settings?
- Is an apparently unused endpoint or feature toggle safe to remove?
- Where did a claim come from, and how fresh is its evidence?

The weak response is another manually maintained architecture diagram. It becomes stale and usually hides uncertainty.

## The System Atlas idea

System Atlas treats system knowledge as typed things, typed connections and evidence:

| Part | Examples in this demo |
| --- | --- |
| Things | Software components, API endpoints, databases, tables, environments and business requirements |
| Connections | Calls, reads, writes, deployments, ownership and test paths |
| Evidence | Source system, collection time, freshness, environment, snapshot and confidence |

The important distinction is between **what was observed**, **what merely correlates**, and **what remains unknown**. A missing network rule is evidence worth investigating; it is not automatically the cause of a failed test. A zero-reference feature toggle is a cleanup candidate; it is not permission to delete it.

The intended production model would harvest facts from engineering tools, preserve their provenance, connect them through stable identifiers and expose the same knowledge to people and software agents.

## The fictional example system

The demo uses **Northstar Regulatory Reporting**, a made-up trade-processing platform. Its simplified flow is:

1. A trade enters through Trade Intake.
2. Trade Validator checks it.
3. Trade Enricher adds reference data.
4. Ledger Posting creates accounting entries.
5. Reporting Data Loader (an extract-transform-load, or ETL, pipeline) loads the reporting database.
6. Regulatory Reporting produces an exposure report.

The dataset also includes workers, API contracts, databases, tables, four environments, executable requirements, deployment snapshots, network paths and evidence sources. All organisations, people, repositories, commits, results and operational data are fictional.

## What the mockup demonstrates

The interface provides several views over the same typed records:

- an overview of evidence-backed findings;
- a component dependency map;
- business requirements traced through technical steps to execution evidence;
- component, API, environment, database and table detail pages;
- environment comparison across versions, commits, configuration and network paths;
- an impact explorer that presents hypotheses rather than certainty;
- a hygiene queue for possible obsolete configuration;
- provenance drawers that show where facts came from;
- static JSON and Markdown exports for external tools and AI agents.

The role, environment and snapshot selectors change the lens over the model. They do not create separate copies of the topology.

For a guided walkthrough, choose **Start guided demo** from the overview. The three main workshop routes are also captured in [`showcase/tester.png`](showcase/tester.png), [`showcase/developer.png`](showcase/developer.png) and [`showcase/operations.png`](showcase/operations.png).

## What it does not demonstrate

- There are no live collectors or integrations.
- There is no backend, authentication or persistent user data.
- Findings are curated from fixed demo snapshots.
- Impact paths are graph-based leads for investigation, not causal proof.
- Passing scenarios are evidence under recorded conditions, not proof of correctness.
- The graph is sized for this curated estate, not production-scale rendering.

## Run locally

Requirements: Node.js and npm.

```sh
make install
make validate
make build
make preview
```

For development with hot reload:

```sh
make dev
```

Useful direct commands:

```sh
npm run check          # TypeScript and data validation
npm run validate-data  # Referential and coverage checks
npm run build          # Production bundle and knowledge exports
```

## Build and deployment

`make build` creates the upload-ready static site in `dist/`.

Upload the **contents** of `dist/` to any static web host. Assets use relative URLs and navigation uses hash routes, so the site works at a domain root or below a subpath. It makes no runtime network requests.

Machine-readable exports are generated into `dist/knowledge/` during the build.

## Data and implementation

The UI is a React and TypeScript application built with Vite. Cytoscape renders the interactive graph. The source records live in `src/data/`; the interface and machine exports are generated from the same data.

Stable IDs connect entities, deployments, requirements, executions, findings, network rules, sources and relationships. `npm run validate-data` rejects duplicate IDs, broken references, invalid routes, insufficient scenario coverage and missing required fields.

See [`DATA_MODEL.md`](DATA_MODEL.md) for record semantics and the export contract. The original product brief is in [`SYSTEM_ATLAS_SPEC.md`](SYSTEM_ATLAS_SPEC.md).
