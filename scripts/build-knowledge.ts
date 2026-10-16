import { mkdir, writeFile } from 'node:fs/promises'
import { allEntities, deployments, executions, findings, networkRules, relationships, requirements, snapshots, sources } from '../src/data/atlas.ts'

const out = new URL('../public/knowledge/', import.meta.url)
await mkdir(out, { recursive: true })

const records = { entities: allEntities, relationships, deployments, requirements, executions, findings, networkRules, sources, snapshots }
const resources = Object.entries(records).map(([name, data]) => ({ name, path: `${name}.json`, mediaType: 'application/json', records: data.length }))
const manifest = {
  title: 'System Atlas knowledge export',
  generatedFrom: 'Fictional Northstar bank transfer demonstration data',
  snapshot: '2026-10-13T08:00:00Z',
  warning: 'Passing executable requirements are evidence under recorded conditions, not proof of correctness.',
  deepLinkFormat: '#/{entity.pageUrl}',
  resources,
}

await Promise.all([
  ...Object.entries(records).map(([name,data]) => writeFile(new URL(`${name}.json`, out), `${JSON.stringify(data, null, 2)}\n`)),
  writeFile(new URL('manifest.json', out), `${JSON.stringify(manifest, null, 2)}\n`),
  writeFile(new URL('README.md', out), `# System Atlas knowledge export\n\nStatic fictional records for external agent demonstrations. Start with \`manifest.json\`. Every record uses stable IDs and retains source references, snapshot context and deep links where applicable.\n\nNo runtime API, credentials or real organisational data are included.\n`),
])

console.log(`Knowledge export generated with ${resources.reduce((n,r)=>n+r.records,0)} records.`)
