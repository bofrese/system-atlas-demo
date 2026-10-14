# System Atlas

System Atlas is a static, fictional demonstration of an evidence-backed software knowledge map for the Northstar Regulatory Reporting platform.

## Run locally

Requirements: Node.js and npm.

```sh
make install
make validate
make build
make preview
```

Development mode:

```sh
make dev
```

## Deployment

Upload the **contents** of `dist/` to any static hosting service. Assets use relative URLs and navigation uses hash routes, so the site works at a domain root or below a subpath. It requires no backend and makes no runtime network requests.

Machine-readable exports are generated into `dist/knowledge/` during the build.

The three reviewed workshop views are captured in `showcase/tester.png`, `showcase/developer.png` and `showcase/operations.png`.

## Data model

The typed source data lives in `src/data/`. Stable IDs connect entities, deployments, requirements, executions, findings, network rules, source references and relationships. `npm run validate-data` rejects duplicate IDs, broken entity/source references, invalid route targets, insufficient scenario coverage and missing required fields. See [DATA_MODEL.md](DATA_MODEL.md) for the record semantics and export contract.

## Deliberate limitations

- All organisations, people, repositories, evidence and operational data are fictional.
- Harvesting and integrations are simulated; timestamps are fixed to the demo snapshots.
- Graphs are optimised for this curated estate, not production-scale graph rendering.
- Passing scenarios are evidence under recorded conditions, not proof of correctness.
