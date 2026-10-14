import type { DataTable, Deployment, Endpoint, Entity, Environment, Finding, NetworkRule, Relationship, Repository, Requirement, Service, Snapshot, SourceReference, Team, TestExecution } from './model'

export const DEMO_NOW = '2026-10-13T08:00:00Z'

export const teams: Team[] = [
  ['team-trade', 'Trade Processing'], ['team-finance', 'Finance Platform'], ['team-reporting', 'Regulatory Reporting'],
  ['team-platform', 'Platform Operations'], ['team-quality', 'Quality Engineering'],
].map(([id, name]) => ({ id, name }))

export const environments: Environment[] = [
  { id: 'development', name: 'Development', shortName: 'DEV', description: 'Fast feedback for active development.' },
  { id: 'test', name: 'Test', shortName: 'TEST', description: 'Automated integration and contract testing.' },
  { id: 'uat', name: 'User Acceptance Test', shortName: 'UAT', description: 'Release-candidate validation with representative workflows.' },
  { id: 'preproduction', name: 'Pre-production', shortName: 'PRE', description: 'Production-like deployment rehearsal.' },
  { id: 'production', name: 'Production', shortName: 'PROD', description: 'Live regulatory reporting environment.' },
]

export const snapshots: Snapshot[] = [
  { id: 'before-rc', name: 'Before release candidate', at: '2026-10-06T08:00:00Z' },
  { id: 'previous-day', name: 'Previous day', at: '2026-10-12T08:00:00Z' },
  { id: 'current', name: 'Current demo snapshot', at: DEMO_NOW },
]

export const sources: SourceReference[] = [
  { id: 'src-git-intake', sourceType: 'Git', sourceName: 'trade-intake repository', sourceLocation: 'mock://git/trade-intake/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:48:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-validator', sourceType: 'Git', sourceName: 'trade-validator repository', sourceLocation: 'mock://git/trade-validator/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:46:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-reference', sourceType: 'Git', sourceName: 'reference-data repository', sourceLocation: 'mock://git/reference-data/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:42:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-enricher', sourceType: 'Git', sourceName: 'trade-enricher repository', sourceLocation: 'mock://git/trade-enricher/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T02:11:00Z', expectedRefreshInterval: '1 hour', freshness: 'stale' },
  { id: 'src-git-ledger', sourceType: 'Git', sourceName: 'ledger-posting repository', sourceLocation: 'mock://git/ledger-posting/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:52:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-etl', sourceType: 'Git', sourceName: 'reporting-etl repository', sourceLocation: 'mock://git/reporting-etl/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:45:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-reporting', sourceType: 'Git', sourceName: 'regulatory-reporting repository', sourceLocation: 'mock://git/regulatory-reporting/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:41:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-notification', sourceType: 'Git', sourceName: 'notification repository', sourceLocation: 'mock://git/notification/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:39:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-deploy', sourceType: 'Deployment manifests', sourceName: 'Northstar deployment inventory', sourceLocation: 'mock://deployments/northstar/current', collector: 'Deployment manifest collector', harvestedAt: '2026-10-13T07:55:00Z', expectedRefreshInterval: '15 minutes', freshness: 'current' },
  { id: 'src-openapi', sourceType: 'OpenAPI', sourceName: 'Published API contracts', sourceLocation: 'mock://contracts/openapi/catalogue', collector: 'OpenAPI collector', harvestedAt: '2026-10-13T07:30:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-db', sourceType: 'Database catalogue', sourceName: 'Northstar schema catalogue', sourceLocation: 'mock://database/catalogue/northstar', collector: 'Schema catalogue collector', harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', freshness: 'current' },
  { id: 'src-tests', sourceType: 'Executable-test output', sourceName: 'Northstar acceptance results', sourceLocation: 'mock://ci/acceptance-tests/2026-10-13', collector: 'Test evidence collector', harvestedAt: '2026-10-13T07:25:00Z', expectedRefreshInterval: '30 minutes', freshness: 'current' },
  { id: 'src-network', sourceType: 'Infrastructure-as-code', sourceName: 'Northstar network policy', sourceLocation: 'mock://iac/network/northstar.tf', collector: 'Network policy collector', harvestedAt: '2026-10-13T07:50:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-curated', sourceType: 'Curated description', sourceName: 'Northstar capability catalogue', sourceLocation: 'mock://catalogue/northstar/capabilities', collector: 'Manual stewardship', harvestedAt: '2026-10-12T15:00:00Z', expectedRefreshInterval: '30 days', freshness: 'current' },
]

const svc = (id: string, name: string, serviceType: string, ownerTeamId: string, responsibility: string, repositoryId: string, capability: string, source: string): Service => ({
  id, type: 'service', name, slug: id, serviceType, ownerTeamId, responsibility, description: responsibility, repositoryId, capability,
  tags: [serviceType.toLowerCase(), capability.toLowerCase().replaceAll(' ', '-')], sourceReferences: [source, 'src-deploy'], harvestedAt: source === 'src-git-enricher' ? '2026-10-13T02:11:00Z' : '2026-10-13T07:48:00Z', expectedRefreshInterval: '1 hour', pageUrl: `/services/${id}`,
})

export const services: Service[] = [
  svc('svc-trade-intake', 'Trade Intake', 'HTTP API service', 'team-trade', 'Receives new and amended financial transactions', 'repo-trade-intake', 'Trade capture', 'src-git-intake'),
  svc('svc-trade-validator', 'Trade Validator', 'Service', 'team-trade', 'Applies business and compliance validation', 'repo-trade-validator', 'Trade validation', 'src-git-validator'),
  svc('svc-reference-data', 'Reference Data', 'HTTP API service', 'team-finance', 'Supplies financial products, currencies and trading parties', 'repo-reference-data', 'Reference data', 'src-git-reference'),
  svc('svc-trade-enricher', 'Trade Enricher', 'Worker', 'team-trade', 'Enriches accepted trades with reference data', 'repo-trade-enricher', 'Trade enrichment', 'src-git-enricher'),
  svc('svc-ledger-posting', 'Ledger Posting', 'Service', 'team-finance', 'Creates balanced journal entries', 'repo-ledger-posting', 'Accounting', 'src-git-ledger'),
  svc('job-reporting-etl', 'Reporting Data Loader (ETL)', 'Scheduled data pipeline', 'team-reporting', 'Loads reporting records into the reporting database', 'repo-reporting-etl', 'Regulatory reporting', 'src-git-etl'),
  svc('svc-regulatory-reporting', 'Regulatory Reporting', 'HTTP API and batch service', 'team-reporting', 'Produces daily reports of money at risk', 'repo-regulatory-reporting', 'Regulatory reporting', 'src-git-reporting'),
  svc('svc-notification', 'Notification', 'Service', 'team-platform', 'Sends processing and report notifications', 'repo-notification', 'Platform communication', 'src-git-notification'),
]

const commits = ['a1f9c2d','b7e31a4','c30d92f','d2a8f11','e71bc42','f61d8a0','9ac42ef','81bd5c7']
const versionCommits:Record<string,string>={'3.7.3-dev':'4ddc611','4.2.0':'9b0f0e2','2.8.4':'a918c64','2.3.8':'7e04a22','3.1.5':'5c2b993'}
const commitFor=(version:string,fallback:string)=>versionCommits[version]??fallback
export const repositories: Repository[] = services.map((service, index) => ({ id: service.repositoryId, name: service.id.replace(/^svc-|^job-/, ''), serviceId: service.id, defaultBranch: 'main', sourceReferenceId: service.sourceReferences[0], lastCommit: commits[index] }))

const endpoint = (id: string, name: string, method: Endpoint['method'], path: string, providerId: string, consumers: string[], description: string): Endpoint => ({
  id, type: 'endpoint', name, slug: id, method, path, providerId, consumers, description, ownerTeamId: services.find(s => s.id === providerId)!.ownerTeamId,
  tags: ['api', method.toLowerCase()], sourceReferences: ['src-openapi'], harvestedAt: '2026-10-13T07:30:00Z', expectedRefreshInterval: '1 hour', pageUrl: `/apis/${id}`,
  auth: 'Mutual TLS: each calling service proves its identity', requestExample: method === 'GET' ? 'No request body' : '{ "tradeId": "TRD-DEMO-1042", "currency": "EUR" }', responseExample: '{ "status": "accepted", "evidenceId": "evt-demo-1042" }',
})

export const endpoints: Endpoint[] = [
  endpoint('api-post-trades', 'Submit trade', 'POST', '/trades', 'svc-trade-intake', ['portal-trade-entry'], 'Accept a new trade for processing.'),
  endpoint('api-put-trade', 'Amend trade', 'PUT', '/trades/{tradeId}', 'svc-trade-intake', ['portal-trade-entry'], 'Submit a corrected trade version.'),
  endpoint('api-get-trade', 'Get trade status', 'GET', '/trades/{tradeId}', 'svc-trade-intake', ['svc-notification'], 'Return processing state for one trade.'),
  endpoint('api-post-validate', 'Validate trade', 'POST', '/validation/trades', 'svc-trade-validator', ['svc-trade-intake'], 'Apply compliance and business validation.'),
  endpoint('api-get-instrument', 'Get instrument', 'GET', '/reference/instruments/{id}', 'svc-reference-data', ['svc-trade-enricher'], 'Resolve instrument reference data.'),
  endpoint('api-get-rate', 'Get exchange rate', 'GET', '/reference/rates/{pair}', 'svc-reference-data', ['svc-trade-enricher'], 'Return the applicable exchange rate.'),
  endpoint('api-get-counterparty', 'Get counterparty', 'GET', '/reference/counterparties/{id}', 'svc-reference-data', ['svc-trade-enricher'], 'Resolve counterparty data.'),
  endpoint('api-post-journal', 'Post journal', 'POST', '/journals', 'svc-ledger-posting', ['svc-trade-enricher'], 'Create a balanced journal entry.'),
  endpoint('api-get-journal', 'Get journal', 'GET', '/journals/{tradeId}', 'svc-ledger-posting', ['job-reporting-etl'], 'Retrieve journal entries for a trade.'),
  endpoint('api-post-etl', 'Run warehouse load', 'POST', '/jobs/reporting-etl/runs', 'job-reporting-etl', ['scheduler'], 'Start a reporting warehouse load.'),
  endpoint('api-get-etl', 'Get load status', 'GET', '/jobs/reporting-etl/runs/{id}', 'job-reporting-etl', ['svc-regulatory-reporting'], 'Return warehouse-load status.'),
  endpoint('api-get-exposure', 'Get exposure report', 'GET', '/reports/exposure/{date}', 'svc-regulatory-reporting', ['portal-regulatory'], 'Return the daily exposure report.'),
  endpoint('api-post-report', 'Generate report', 'POST', '/reports/exposure/runs', 'svc-regulatory-reporting', ['scheduler'], 'Generate daily regulatory exposure output.'),
  endpoint('api-post-notification', 'Send notification', 'POST', '/notifications', 'svc-notification', ['svc-regulatory-reporting', 'svc-trade-intake'], 'Send a processing or report notification.'),
]

const databaseRows = [
  ['db-trade', 'Trade Operations DB', 'Operational trade capture and validation state', 'team-trade'],
  ['db-reference', 'Reference Data DB', 'Controlled instruments, counterparties and rates', 'team-finance'],
  ['db-ledger', 'Ledger DB', 'Balanced accounting journals', 'team-finance'],
  ['db-warehouse', 'Reporting Warehouse', 'Regulatory facts and dimensions', 'team-reporting'],
] as const

export const databases: Entity[] = databaseRows.map(([id, name, description, ownerTeamId]) => ({ id, type: 'database', name, slug: id, description, ownerTeamId, tags: ['database'], sourceReferences: ['src-db'], harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', pageUrl: `/data/databases/${id}` }))

const table = (id: string, name: string, databaseId: string, purpose: string, ownerTeamId: string, readers: string[], writers: string[], columns: string[], classification = 'Confidential business data'): DataTable => ({
  id, type: 'table', name, slug: id, databaseId, description: purpose, ownerTeamId, readers, writers, columns, classification,
  lineage: writers.length ? `Derived from ${writers.map(x => services.find(s => s.id === x)?.name ?? x).join(', ')}` : 'No producing deployment mapped',
  tags: ['table', databaseId], sourceReferences: ['src-db'], harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', pageUrl: `/data/tables/${id}`,
})

export const tables: DataTable[] = [
  table('tbl-trade', 'trade', 'db-trade', 'Current accepted trade state', 'team-trade', ['svc-trade-enricher'], ['svc-trade-intake'], ['trade_id', 'version', 'product_type', 'status']),
  table('tbl-trade-event', 'trade_event', 'db-trade', 'Immutable processing events', 'team-trade', ['svc-trade-validator', 'svc-trade-enricher'], ['svc-trade-intake'], ['event_id', 'trade_id', 'event_type', 'occurred_at']),
  table('tbl-validation-error', 'validation_error', 'db-trade', 'Current validation failures', 'team-trade', ['svc-trade-intake'], ['svc-trade-validator'], ['trade_id', 'code', 'field', 'message']),
  table('tbl-validation-error-legacy', 'validation_error_legacy', 'db-trade', 'Legacy validation error archive', 'team-trade', [], [], ['trade_id', 'legacy_code', 'created_at']),
  table('tbl-instrument', 'instrument', 'db-reference', 'Tradable instrument definitions', 'team-finance', ['svc-reference-data'], ['svc-reference-data'], ['instrument_id', 'asset_class', 'currency']),
  table('tbl-counterparty', 'counterparty', 'db-reference', 'Approved counterparty reference', 'team-finance', ['svc-reference-data'], ['svc-reference-data'], ['counterparty_id', 'lei', 'status']),
  table('tbl-exchange-rate', 'exchange_rate', 'db-reference', 'Daily currency conversion rates', 'team-finance', ['svc-reference-data'], ['svc-reference-data'], ['currency_pair', 'rate', 'effective_date']),
  table('tbl-journal-entry', 'journal_entry', 'db-ledger', 'Journal headers by source trade', 'team-finance', ['job-reporting-etl'], ['svc-ledger-posting'], ['journal_id', 'trade_id', 'posting_date']),
  table('tbl-journal-line', 'journal_line', 'db-ledger', 'Debit and credit journal lines', 'team-finance', ['job-reporting-etl'], ['svc-ledger-posting'], ['journal_id', 'account', 'debit', 'credit']),
  table('tbl-fact-trade', 'fact_trade', 'db-warehouse', 'Reporting grain for accepted trades', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['trade_key', 'counterparty_key', 'amount_base']),
  table('tbl-fact-exposure', 'fact_exposure', 'db-warehouse', 'Aggregated regulatory exposure', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['report_date', 'counterparty_key', 'net_exposure']),
  table('tbl-dim-counterparty', 'dim_counterparty', 'db-warehouse', 'Reporting counterparty dimension', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['counterparty_key', 'lei', 'valid_from']),
  table('tbl-dim-instrument', 'dim_instrument', 'db-warehouse', 'Reporting instrument dimension', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['instrument_key', 'asset_class', 'currency']),
  table('tbl-load-audit', 'load_audit', 'db-warehouse', 'Warehouse load evidence and reconciliation', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['run_id', 'row_count', 'status', 'completed_at'], 'Internal operational data'),
]

export const configurationEntities: Entity[] = [
  ['cfg-cutoff','reporting.cutoff-time','Daily report completion target'], ['cfg-batch','reporting.batch-size','Warehouse load batch size'], ['cfg-provider','reference-data.provider','Reference-data provider selection'],
  ['cfg-lei','trade-validation.strict-lei','Strict LEI validation'], ['cfg-retry','etl.retry-count','Warehouse load retry limit'], ['cfg-schema','etl.warehouse-schema','Target warehouse schema'],
  ['cfg-notify','notifications.enabled','Notification delivery switch'], ['cfg-journal','journal-posting.mode','Journal posting mode'], ['cfg-retention','trade-event.retention-days','Trade event retention'], ['cfg-report-format','reporting.output-format','Regulatory report output format'],
].map(([id, name, description]) => ({ id, type: 'configuration' as const, name, slug: id, description, ownerTeamId: name.startsWith('reporting') || name.startsWith('etl') ? 'team-reporting' : 'team-platform', tags: ['configuration'], sourceReferences: ['src-deploy'], harvestedAt: '2026-10-13T07:55:00Z', expectedRefreshInterval: '15 minutes', pageUrl: `/impact/${id}` }))

export const toggleEntities: Entity[] = [
  ['toggle-new-netting','new-netting-model'], ['toggle-legacy-netting','legacy-netting-mode'], ['toggle-synthetic-reference','synthetic-reference-data'], ['toggle-strict-lei','strict-lei-validation'], ['toggle-exposure-v2','exposure-report-v2'], ['toggle-fast-reconcile','fast-reconciliation'],
].map(([id, name]) => ({ id, type: 'toggle' as const, name, slug: id, description: `Feature toggle controlling ${name.replaceAll('-', ' ')}.`, ownerTeamId: name.includes('exposure') ? 'team-reporting' : 'team-trade', tags: ['feature-toggle'], sourceReferences: ['src-deploy'], harvestedAt: '2026-10-13T07:55:00Z', expectedRefreshInterval: '15 minutes', pageUrl: `/impact/${id}` }))

const currentVersions: Record<string, Record<string, string>> = {
  'svc-trade-intake': { development:'3.7.3-dev', test:'3.7.2', uat:'3.7.2', preproduction:'3.7.2', production:'3.7.2' },
  'svc-trade-validator': { development:'4.3.0-rc1', test:'4.3.0-rc1', uat:'4.3.0-rc1', preproduction:'4.2.0', production:'4.2.0' },
  'svc-reference-data': { development:'5.1.0', test:'5.1.0', uat:'5.1.0', preproduction:'5.1.0', production:'5.1.0' },
  'svc-trade-enricher': { development:'2.9.0', test:'2.9.0', uat:'2.9.0', preproduction:'2.9.0', production:'2.8.4' },
  'svc-ledger-posting': { development:'6.4.1', test:'6.4.1', uat:'6.4.1', preproduction:'6.4.1', production:'6.4.1' },
  'job-reporting-etl': { development:'2.4.1', test:'2.4.1', uat:'2.4.1', preproduction:'2.4.1', production:'2.3.8' },
  'svc-regulatory-reporting': { development:'3.2.0-rc2', test:'3.2.0-rc2', uat:'3.2.0-rc2', preproduction:'3.2.0-rc2', production:'3.1.5' },
  'svc-notification': { development:'1.9.0', test:'1.9.0', uat:'1.9.0', preproduction:'1.9.0', production:'1.9.0' },
}

const configFor = (environmentId: string) => ({
  'reporting.cutoff-time': environmentId === 'production' ? '05:30 UTC' : '06:00 UTC',
  'reporting.batch-size': environmentId === 'production' ? '5000' : environmentId === 'uat' ? '2000' : '1000',
  'reference-data.provider': ['test','uat'].includes(environmentId) ? 'synthetic' : 'authoritative',
  'trade-validation.strict-lei': ['uat','preproduction','production'].includes(environmentId) ? 'true' : 'false',
  'etl.retry-count': environmentId === 'production' ? '5' : '3',
  'etl.warehouse-schema': 'regulatory',
  'notifications.enabled': environmentId === 'development' ? 'false' : 'true',
  'journal-posting.mode': ['preproduction','production'].includes(environmentId) ? 'committed' : 'simulation',
})
const togglesFor = (environmentId: string) => ({
  'new-netting-model': environmentId === 'uat',
  'legacy-netting-mode': ['development','test','uat'].includes(environmentId),
  'synthetic-reference-data': ['test','uat'].includes(environmentId),
  'strict-lei-validation': ['uat','preproduction','production'].includes(environmentId),
  'exposure-report-v2': ['uat','preproduction'].includes(environmentId),
  'fast-reconciliation': environmentId === 'development',
})

export const deployments: Deployment[] = []
for (const [si, service] of services.entries()) {
  for (const [ei, env] of environments.entries()) {
    const version = currentVersions[service.id][env.id]
    const previousVersion=service.id === 'job-reporting-etl' && env.id === 'uat' ? '2.3.8' : version
    const beforeVersion=service.id === 'svc-trade-enricher' ? '2.8.4' : service.id === 'job-reporting-etl' ? '2.3.8' : service.id === 'svc-regulatory-reporting' ? '3.1.5' : version
    deployments.push({ id: `dep-${service.id}-${env.id}-current`, serviceId: service.id, environmentId: env.id, snapshotId: 'current', version, commit: commitFor(version,commits[si]), deployedAt: `2026-10-${String(7 + ei).padStart(2,'0')}T${String(9 + si).padStart(2,'0')}:00:00Z`, configuration: configFor(env.id), featureToggles: togglesFor(env.id), sourceReferences: ['src-deploy'] })
    deployments.push({ id: `dep-${service.id}-${env.id}-previous-day`, serviceId: service.id, environmentId: env.id, snapshotId: 'previous-day', version: previousVersion, commit: commitFor(previousVersion,commits[si]), deployedAt: '2026-10-11T10:00:00Z', configuration: configFor(env.id), featureToggles: { ...togglesFor(env.id), 'new-netting-model': false }, sourceReferences: ['src-deploy'] })
    deployments.push({ id: `dep-${service.id}-${env.id}-before-rc`, serviceId: service.id, environmentId: env.id, snapshotId: 'before-rc', version: beforeVersion, commit: commitFor(beforeVersion,commits[si]), deployedAt: '2026-10-05T10:00:00Z', configuration: configFor(env.id), featureToggles: { ...togglesFor(env.id), 'new-netting-model': false, 'exposure-report-v2': false }, sourceReferences: ['src-deploy'] })
  }
}
deployments.push({ id: 'dep-svc-notification-preproduction-retired', serviceId: 'svc-notification', environmentId: 'preproduction', snapshotId: 'current', version: '1.8.2', commit: '7ab39d0', deployedAt: '2026-07-18T09:20:00Z', configuration: configFor('preproduction'), featureToggles: togglesFor('preproduction'), sourceReferences: ['src-deploy'], retired: true })

const centralSteps = [
  ['Submit a valid foreign-exchange transaction','The transaction is accepted','svc-trade-intake','POST /trades',['tbl-trade','tbl-trade-event']],
  ['Validate compliance fields','Compliance fields pass validation','svc-trade-validator','POST /validation/trades',['tbl-validation-error']],
  ['Enrich the trade with reference data','Instrument, counterparty and rate are resolved','svc-trade-enricher','Consume reference APIs',['tbl-instrument','tbl-counterparty','tbl-exchange-rate']],
  ['Create balanced journal entries','Debits equal credits','svc-ledger-posting','POST /journals',['tbl-journal-entry','tbl-journal-line']],
  ['Load the Reporting Warehouse','Reporting facts and dimensions are committed','job-reporting-etl','Warehouse load',['tbl-fact-trade','tbl-fact-exposure']],
  ['Confirm that the exposure report contains the trade','The trade contributes to the daily exposure','svc-regulatory-reporting','GET /reports/exposure/{date}',['tbl-fact-exposure']],
] as const

const requirementSpecs = [
  ['req-valid-fx','A valid foreign-exchange transaction is accepted','Trade capture'], ['req-invalid-lei','A transaction with an invalid Legal Entity Identifier is rejected','Trade validation'],
  ['req-idempotent','Submitting the same transaction twice does not create a duplicate','Trade capture'], ['req-enrichment','An accepted foreign-exchange transaction receives the applicable exchange rate','Trade enrichment'],
  ['req-balanced-journal','Accepted transactions create balanced accounting entries','Accounting'], ['req-exposure','Accepted foreign-exchange transactions appear in the daily exposure report','Regulatory reporting'],
  ['req-cutoff','The daily exposure report is available before its cutoff','Regulatory reporting'], ['req-correction','Corrected trades are reflected in the next report','Regulatory reporting'],
  ['req-network','Only approved network paths can reach the Reporting Warehouse','Platform controls'], ['req-no-synthetic','Production configuration contains no synthetic data providers','Platform controls'],
] as const

const simpleComponents = ['svc-trade-intake','svc-trade-validator','svc-trade-enricher','svc-ledger-posting','job-reporting-etl','svc-regulatory-reporting','svc-notification']
export const requirements: Requirement[] = requirementSpecs.map(([id,title,capability], index) => {
  const makeSteps = (offset: number) => index === 5 && offset === 0 ? centralSteps.map(([stepTitle,expected,componentId,operation,dataIds]) => ({ title: stepTitle, expected, componentId, operation, dataIds: [...dataIds] })) : [
    { title: offset === 0 ? `Exercise ${title.toLowerCase()}` : offset === 1 ? 'Exercise an alternate business condition' : 'Exercise a rejected or unavailable condition', expected: offset === 2 ? 'The condition is rejected with traceable evidence' : 'The expected business outcome is recorded', componentId: simpleComponents[(index + offset) % simpleComponents.length], operation: 'Executable scenario step', dataIds: [tables[(index + offset) % tables.length].id] },
  ]
  return { id, title, capability, narrative: `Demonstrates how Northstar records evidence that ${title.charAt(0).toLowerCase()}${title.slice(1)}.`, preconditions: ['The selected environment has a known deployment inventory', 'Test data is explicitly identified as synthetic'], ownerTeamId: index < 4 ? 'team-trade' : index < 8 ? 'team-reporting' : 'team-platform', sourceReferences: ['src-tests','src-curated'], scenarios: [
    { id: `${id}-main`, title: 'Primary business path', kind: 'main', steps: makeSteps(0) },
    { id: `${id}-alternate`, title: 'Alternate input or timing', kind: 'alternate', steps: makeSteps(1) },
    { id: `${id}-failure`, title: 'Failure or unavailable dependency', kind: 'failure', steps: makeSteps(2) },
  ] }
})

const versionContext = (env: string) => Object.fromEntries(deployments.filter(d => d.environmentId === env && d.snapshotId === 'current' && !d.retired).map(d => [d.serviceId,d.version]))
const execSteps = (status: 'passed'|'failed', environmentId: string) => centralSteps.map(([title], index) => ({ title, status: status === 'failed' && index === 4 ? 'failed' as const : index > 4 && status === 'failed' ? 'not-executed' as const : 'passed' as const, actual: status === 'failed' && index === 4 ? 'Connection to the warehouse timed out; no route was observed in harvested policy.' : index > 4 && status === 'failed' ? 'Step did not run after the warehouse-load failure.' : 'Observed result matched the recorded expectation.', componentId: centralSteps[index][2], evidenceReferenceId: 'src-tests' }))
export const executions: TestExecution[] = [
  { id:'exec-exposure-uat-current', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'uat', snapshotId:'current', status:'failed', executedAt:'2026-10-13T06:44:00Z', serviceVersions:versionContext('uat'), steps:execSteps('failed','uat'), evidenceReferences:['src-tests','src-network','src-deploy'] },
  { id:'exec-exposure-prod-current', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'production', snapshotId:'current', status:'passed', executedAt:'2026-10-13T05:12:00Z', serviceVersions:versionContext('production'), steps:execSteps('passed','production'), evidenceReferences:['src-tests','src-network','src-deploy'] },
  { id:'exec-exposure-uat-previous', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'uat', snapshotId:'previous-day', status:'passed', executedAt:'2026-10-12T06:38:00Z', serviceVersions:{...versionContext('uat'),'job-reporting-etl':'2.3.8'}, steps:execSteps('passed','uat'), evidenceReferences:['src-tests','src-deploy'] },
  { id:'exec-exposure-uat-before', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'uat', snapshotId:'before-rc', status:'passed', executedAt:'2026-10-06T06:35:00Z', serviceVersions:{...versionContext('production')}, steps:execSteps('passed','uat'), evidenceReferences:['src-tests','src-deploy'] },
  ...requirements.filter(r => r.id !== 'req-exposure').flatMap((r,index) => ['uat','production'].map((env,ei) => ({ id:`exec-${r.id}-${env}-current`, requirementId:r.id, scenarioId:`${r.id}-main`, environmentId:env, snapshotId:'current', status:(r.id === 'req-cutoff' && env === 'uat' ? 'stale' : 'passed') as TestExecution['status'], executedAt:`2026-10-${String(10 + (index % 3)).padStart(2,'0')}T0${5+ei}:20:00Z`, serviceVersions:versionContext(env), steps:[{ title:r.scenarios[0].steps[0].title, status:'passed' as const, actual:'Observed result matched the recorded expectation.', componentId:r.scenarios[0].steps[0].componentId, evidenceReferenceId:'src-tests' }], evidenceReferences:['src-tests','src-deploy'] }))),
]

const rel = (id: string, type: Relationship['type'], fromEntityId: string, toEntityId: string, description: string, evidenceKind: Relationship['evidenceKind'] = 'harvested', environmentId?: string): Relationship => ({ id,type,fromEntityId,toEntityId,description,evidenceKind,environmentId,sourceReferences:[type === 'ALLOWED_TO_CONNECT' ? 'src-network' : type === 'PROVIDES' ? 'src-openapi' : 'src-deploy'],harvestedAt:'2026-10-13T07:50:00Z' })
const callPairs = [
  ['svc-trade-intake','svc-trade-validator'],['svc-trade-intake','svc-notification'],['svc-trade-enricher','svc-reference-data'],['svc-trade-enricher','svc-ledger-posting'],['job-reporting-etl','svc-ledger-posting'],['svc-regulatory-reporting','job-reporting-etl'],['svc-regulatory-reporting','svc-notification'],
] as const
export const relationships: Relationship[] = [
  ...callPairs.map((p,i)=>rel(`rel-call-${i}`,'CALLS',p[0],p[1],`${services.find(s=>s.id===p[0])!.name} calls ${services.find(s=>s.id===p[1])!.name}.`)),
  ...endpoints.map((e,i)=>rel(`rel-provides-${i}`,'PROVIDES',e.providerId,e.id,`${services.find(s=>s.id===e.providerId)!.name} provides ${e.method} ${e.path}.`)),
  ...services.map((s,i)=>rel(`rel-repo-${i}`,'IMPLEMENTED_BY',s.id,s.repositoryId,`${s.name} is built from ${repositories[i].name}.`)),
  ...tables.flatMap((t)=>[...t.readers.map((s,i)=>rel(`rel-read-${t.id}-${i}`,'READS_FROM',s,t.id,`${services.find(x=>x.id===s)!.name} reads ${t.name}.`)),...t.writers.map((s,i)=>rel(`rel-write-${t.id}-${i}`,'WRITES_TO',s,t.id,`${services.find(x=>x.id===s)!.name} writes ${t.name}.`))]),
].slice(0,58)

export const networkRules: NetworkRule[] = [
  ['net-uat-intake-validator','svc-trade-intake','svc-trade-validator',8443,'uat','current'], ['net-uat-enricher-reference','svc-trade-enricher','svc-reference-data',8443,'uat','current'],
  ['net-uat-enricher-ledger','svc-trade-enricher','svc-ledger-posting',8443,'uat','current'], ['net-uat-etl-warehouse','job-reporting-etl','db-warehouse',5432,'uat','missing'],
  ['net-pre-etl-warehouse','job-reporting-etl','db-warehouse',5432,'preproduction','current'], ['net-prod-etl-warehouse','job-reporting-etl','db-warehouse',5432,'production','current'],
  ['net-prod-report-warehouse','svc-regulatory-reporting','db-warehouse',5432,'production','current'], ['net-pre-report-warehouse','svc-regulatory-reporting','db-warehouse',5432,'preproduction','current'],
  ['net-test-etl-warehouse','job-reporting-etl','db-warehouse',5432,'test','current'], ['net-prod-ledger-db','svc-ledger-posting','db-ledger',5432,'production','current'],
  ['net-prod-intake-db','svc-trade-intake','db-trade',5432,'production','current'], ['net-old-notify','svc-notification','retired-mail-relay',2525,'preproduction','cleanup-candidate'],
].map(([id,sourceId,destinationId,port,environmentId,state])=>({ id:String(id),sourceId:String(sourceId),destinationId:String(destinationId),port:Number(port),protocol:'TCP',environmentId:String(environmentId),action:'allow' as const,ownerTeamId:'team-platform',sourceReferenceId:'src-network',harvestedAt:'2026-10-13T07:50:00Z',state:state as NetworkRule['state'] }))

export const findings: Finding[] = [
  { id:'finding-etl-drift',type:'deployment-drift',severity:'attention',title:'The user-acceptance data loader is one release ahead',summary:'User Acceptance Test runs Reporting Data Loader 2.4.1 while Production runs 2.3.8.',affectedEntityIds:['job-reporting-etl'],applicableRoles:['developer','tester','operations'],environmentId:'uat',detectionRule:'Compare deployed versions across selected environments.',supportingFacts:['The User Acceptance Test deployment manifest reports 2.4.1.','The Production deployment manifest reports 2.3.8.'],correlatedChanges:['The user-acceptance exposure scenario last passed on 2.3.8.'],counterEvidence:['2.4.1 is running in Pre-production.'],unknowns:['Whether the version difference contributed to the failure.'],recommendedInspection:'Compare the data-loader release manifest and failed execution step.',sourceReferences:['src-deploy','src-tests'],freshness:'current',actionUrl:'/compare?left=uat&right=production' },
  { id:'finding-uat-failure',type:'execution-failure',severity:'failure',title:'The latest exposure-report scenario failed in User Acceptance Test',summary:'The run stopped while loading the reporting database at 06:44 UTC. Exposure means the amount of money at risk.',affectedEntityIds:['job-reporting-etl','svc-regulatory-reporting'],applicableRoles:['tester','developer'],environmentId:'uat',detectionRule:'Latest main-scenario execution is failed.',supportingFacts:['Steps 1–4 passed.','The reporting-database load timed out.','The final report check did not run.'],correlatedChanges:['Reporting Data Loader changed from 2.3.8 to 2.4.1.','The expected user-acceptance database route is absent.'],counterEvidence:['The same scenario passed in Production under older versions.'],unknowns:['The direct cause of the timeout.'],recommendedInspection:'Inspect route policy, data-loader deployment and execution evidence together.',sourceReferences:['src-tests','src-deploy','src-network'],freshness:'current',actionUrl:'/requirements/req-exposure' },
  { id:'finding-route',type:'network-gap',severity:'failure',title:'The expected user-acceptance database route is absent',summary:'No harvested allow rule connects the Reporting Data Loader to the database network port (TCP 5432).',affectedEntityIds:['job-reporting-etl','db-warehouse'],applicableRoles:['operations','tester','developer'],environmentId:'uat',detectionRule:'Expected deployment dependency has no matching allow rule.',supportingFacts:['The data-loader deployment definition declares a reporting-database dependency.','No matching User Acceptance Test allow rule was harvested.'],correlatedChanges:['The latest user-acceptance scenario failed during the database load.'],counterEvidence:['Matching rules exist in Pre-production and Production.'],unknowns:['Whether an unharvested or dynamic route exists.'],recommendedInspection:'Review the User Acceptance Test infrastructure plan and collector scope.',sourceReferences:['src-network','src-deploy'],freshness:'current',actionUrl:'/network' },
  { id:'finding-stale-enricher',type:'stale-source',severity:'attention',title:'Trade Enricher evidence is stale',summary:'Repository evidence is more than five hours old against an hourly expectation.',affectedEntityIds:['svc-trade-enricher'],applicableRoles:['developer','operations'],detectionRule:'Last successful harvest exceeds twice the expected interval.',supportingFacts:['Last harvest: 02:11 UTC.','Expected interval: 1 hour.'],correlatedChanges:['Trade Enricher is ahead of Production in User Acceptance Test.'],counterEvidence:['Deployment evidence is current.'],unknowns:['Whether repository changes after 02:11 are missing.'],recommendedInspection:'Check the repository collector before trusting commit-level comparisons.',sourceReferences:['src-git-enricher'],freshness:'stale',actionUrl:'/services/svc-trade-enricher' },
  { id:'finding-legacy-toggle',type:'unused-configuration',severity:'attention',title:'legacy-netting-mode has no current deployment references',summary:'This feature switch remains configured in three environments, but no current component definition refers to it. Netting means offsetting amounts.',affectedEntityIds:['toggle-legacy-netting'],applicableRoles:['operations','developer'],detectionRule:'Configuration exists while reference count across current manifests is zero.',supportingFacts:['Present in Development, Test and User Acceptance Test.','No current deployment-manifest reference was harvested.'],correlatedChanges:['new-netting-model is enabled only in User Acceptance Test.'],counterEvidence:['Historical releases referenced the legacy toggle.'],unknowns:['Whether an unharvested operational script reads it.'],recommendedInspection:'Run the relationship autopsy before removal.',sourceReferences:['src-deploy','src-git-enricher'],freshness:'current',actionUrl:'/hygiene' },
  { id:'finding-retired-notify',type:'retired-deployment',severity:'attention',title:'Pre-production retains Notification 1.8.2',summary:'A retired deployment remains beside current version 1.9.0.',affectedEntityIds:['svc-notification'],applicableRoles:['operations'],environmentId:'preproduction',detectionRule:'Deployment version is marked retired but remains present.',supportingFacts:['1.8.2 was retired on 18 July.','1.9.0 is the current deployment.'],correlatedChanges:['An old mail-relay rule still names the retired destination.'],counterEvidence:['No current request traffic is represented in this prototype.'],unknowns:['Whether rollback procedures still require the deployment.'],recommendedInspection:'Confirm rollback policy and the linked network rule before cleanup.',sourceReferences:['src-deploy','src-network'],freshness:'current',actionUrl:'/hygiene' },
]

export const allEntities: Entity[] = [...services, ...endpoints, ...databases, ...tables, ...configurationEntities, ...toggleEntities, ...repositories.map(r => ({ id:r.id,type:'repository' as const,name:r.name,slug:r.id,description:`Source repository for ${services.find(s=>s.id===r.serviceId)!.name}.`,ownerTeamId:services.find(s=>s.id===r.serviceId)!.ownerTeamId,tags:['repository'],sourceReferences:[r.sourceReferenceId],harvestedAt:sources.find(s=>s.id===r.sourceReferenceId)!.harvestedAt,expectedRefreshInterval:'1 hour',pageUrl:`/services/${r.serviceId}` }))]

export const getEntity = (id: string) => allEntities.find(entity => entity.id === id)
export const getService = (id: string) => services.find(service => service.id === id)
export const getRequirement = (id: string) => requirements.find(requirement => requirement.id === id)
export const getSource = (id: string) => sources.find(source => source.id === id)
export const teamName = (id: string) => teams.find(team => team.id === id)?.name ?? id
export const environmentName = (id: string) => environments.find(environment => environment.id === id)?.name ?? id
export const networkRulesAtSnapshot = (snapshotId: string): NetworkRule[] => networkRules.map(rule => {
  if (rule.id === 'net-uat-etl-warehouse' && snapshotId !== 'current') {
    return { ...rule, state: 'current', harvestedAt: snapshotId === 'previous-day' ? '2026-10-12T07:50:00Z' : '2026-10-06T07:50:00Z' }
  }
  return rule
})
