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

const apiField = (name:string, location:'path'|'query'|'header'|'body', dataType:string, required:boolean, description:string, example?:string, constraints?:string) => ({ name, location, dataType, required, description, example, constraints })
const standardErrors = [
  { status:400, meaning:'Invalid request', when:'A field is missing or has an invalid value.' },
  { status:401, meaning:'Caller not authenticated', when:'The service identity is missing or invalid.' },
  { status:500, meaning:'Internal error', when:'The component cannot complete the request.' },
]
type EndpointDocs = Pick<Endpoint,'requestFields'|'responseFields'|'requestExample'|'responseExample'> & Partial<Pick<Endpoint,'contentType'|'idempotency'|'errorResponses'>>
const endpoint = (id: string, name: string, method: Endpoint['method'], path: string, providerId: string, consumers: string[], description: string, docs:EndpointDocs): Endpoint => ({
  id, type: 'endpoint', name, slug: id, method, path, providerId, consumers, description, ownerTeamId: services.find(s => s.id === providerId)!.ownerTeamId,
  tags: ['api', method.toLowerCase()], sourceReferences: ['src-openapi'], harvestedAt: '2026-10-13T07:30:00Z', expectedRefreshInterval: '1 hour', pageUrl: `/apis/${id}`,
  auth: 'Mutual TLS. Each calling service must prove its identity.', contentType:docs.contentType??'application/json', idempotency:docs.idempotency??(method==='GET'?'Safe and idempotent.':'Not guaranteed. Use the documented business identifier to prevent duplicates.'), errorResponses:docs.errorResponses??standardErrors, ...docs,
})

export const endpoints: Endpoint[] = [
  endpoint('api-post-trades', 'Submit trade', 'POST', '/trades', 'svc-trade-intake', ['portal-trade-entry'], 'Accept one new financial transaction for processing.', {
    requestFields:[apiField('tradeId','body','string',true,'Unique transaction identifier.','TRD-DEMO-1042','1–40 characters.'),apiField('productType','body','string',true,'Product category.','FX_FORWARD','FX_FORWARD exchanges currencies on a future date. FX_SPOT settles promptly.'),apiField('currencyPair','body','string',true,'Two ISO currency codes.','EUR/USD','Format: AAA/BBB.'),apiField('notional','body','decimal',true,'Transaction amount in the base currency.','1250000.00','Must be greater than 0.'),apiField('tradeDate','body','date',true,'Business date of the transaction.','2026-10-13','ISO 8601 date.'),apiField('counterpartyId','body','string',true,'Identifier of the other trading party.','CP-0042')],
    responseFields:[apiField('tradeId','body','string',true,'Accepted transaction identifier.','TRD-DEMO-1042'),apiField('status','body','string',true,'Initial processing state.','accepted','Value: accepted.'),apiField('evidenceId','body','string',true,'Identifier for the recorded acceptance event.','evt-demo-1042')],
    requestExample:'{\n  "tradeId": "TRD-DEMO-1042",\n  "productType": "FX_FORWARD",\n  "currencyPair": "EUR/USD",\n  "notional": 1250000.00,\n  "tradeDate": "2026-10-13",\n  "counterpartyId": "CP-0042"\n}', responseExample:'{\n  "tradeId": "TRD-DEMO-1042",\n  "status": "accepted",\n  "evidenceId": "evt-demo-1042"\n}', idempotency:'Idempotent by tradeId. A repeated identifier must not create a second transaction.'
  }),
  endpoint('api-put-trade', 'Amend trade', 'PUT', '/trades/{tradeId}', 'svc-trade-intake', ['portal-trade-entry'], 'Replace the current version of one transaction.', {
    requestFields:[apiField('tradeId','path','string',true,'Transaction to amend.','TRD-DEMO-1042'),apiField('version','body','integer',true,'Current version used for concurrency control.','3','Must equal the stored version.'),apiField('notional','body','decimal',false,'Replacement transaction amount.','1275000.00'),apiField('tradeDate','body','date',false,'Replacement business date.','2026-10-13')], responseFields:[apiField('tradeId','body','string',true,'Amended transaction identifier.','TRD-DEMO-1042'),apiField('version','body','integer',true,'New stored version.','4'),apiField('status','body','string',true,'Processing state after the amendment.','accepted')], requestExample:'{\n  "version": 3,\n  "notional": 1275000.00,\n  "tradeDate": "2026-10-13"\n}', responseExample:'{\n  "tradeId": "TRD-DEMO-1042",\n  "version": 4,\n  "status": "accepted"\n}', idempotency:'Idempotent for the same tradeId and version.'
  }),
  endpoint('api-get-trade', 'Get trade status', 'GET', '/trades/{tradeId}', 'svc-trade-intake', ['svc-notification'], 'Return the current processing state of one transaction.', {
    requestFields:[apiField('tradeId','path','string',true,'Transaction to retrieve.','TRD-DEMO-1042')], responseFields:[apiField('tradeId','body','string',true,'Transaction identifier.','TRD-DEMO-1042'),apiField('version','body','integer',true,'Current stored version.','4'),apiField('status','body','string',true,'Current processing state.','enriched','Allowed values: accepted, rejected, enriched, posted.'),apiField('updatedAt','body','date-time',true,'Time of the latest state change.','2026-10-13T06:18:42Z')], requestExample:'Path: tradeId=TRD-DEMO-1042', responseExample:'{\n  "tradeId": "TRD-DEMO-1042",\n  "version": 4,\n  "status": "enriched",\n  "updatedAt": "2026-10-13T06:18:42Z"\n}'
  }),
  endpoint('api-post-validate', 'Validate trade', 'POST', '/validation/trades', 'svc-trade-validator', ['svc-trade-intake'], 'Check one transaction against business and compliance rules.', {
    requestFields:[apiField('tradeId','body','string',true,'Transaction identifier.','TRD-DEMO-1042'),apiField('legalEntityId','body','string',true,'Legal Entity Identifier of the trading party.','5493001KJTIIGC8Y1R12','20 characters.'),apiField('productType','body','string',true,'Product category.','FX_FORWARD','FX_FORWARD exchanges currencies on a future date. FX_SPOT settles promptly.'),apiField('notional','body','decimal',true,'Transaction amount.','1250000.00')], responseFields:[apiField('valid','body','boolean',true,'States whether all checks passed.','true'),apiField('errors','body','array',true,'Validation errors. The array is empty when valid is true.','[]'),apiField('ruleSetVersion','body','string',true,'Version of the applied validation rules.','2026.10')], requestExample:'{\n  "tradeId": "TRD-DEMO-1042",\n  "legalEntityId": "5493001KJTIIGC8Y1R12",\n  "productType": "FX_FORWARD",\n  "notional": 1250000.00\n}', responseExample:'{\n  "valid": true,\n  "errors": [],\n  "ruleSetVersion": "2026.10"\n}'
  }),
  endpoint('api-get-instrument', 'Get instrument', 'GET', '/reference/instruments/{id}', 'svc-reference-data', ['svc-trade-enricher'], 'Return the controlled data for one financial product.', {
    requestFields:[apiField('id','path','string',true,'Instrument identifier.','INS-9182')], responseFields:[apiField('instrumentId','body','string',true,'Instrument identifier.','INS-9182'),apiField('assetClass','body','string',true,'High-level product class.','Foreign exchange'),apiField('currency','body','string',true,'ISO settlement currency.','EUR'),apiField('status','body','string',true,'Reference-data state.','active')], requestExample:'Path: id=INS-9182', responseExample:'{\n  "instrumentId": "INS-9182",\n  "assetClass": "Foreign exchange",\n  "currency": "EUR",\n  "status": "active"\n}'
  }),
  endpoint('api-get-rate', 'Get exchange rate', 'GET', '/reference/rates/{pair}', 'svc-reference-data', ['svc-trade-enricher'], 'Return the exchange rate for one currency pair and date.', {
    requestFields:[apiField('pair','path','string',true,'Currency pair.','EUR-USD','Format: AAA-BBB.'),apiField('date','query','date',true,'Date for the rate.','2026-10-13','ISO 8601 date.')], responseFields:[apiField('currencyPair','body','string',true,'Currency pair.','EUR/USD'),apiField('rate','body','decimal',true,'Units of quote currency for one base-currency unit.','1.0842'),apiField('effectiveDate','body','date',true,'Date on which the rate applies.','2026-10-13'),apiField('source','body','string',true,'Provider of the rate.','synthetic-demo')], requestExample:'Path: pair=EUR-USD\nQuery: date=2026-10-13', responseExample:'{\n  "currencyPair": "EUR/USD",\n  "rate": 1.0842,\n  "effectiveDate": "2026-10-13",\n  "source": "synthetic-demo"\n}'
  }),
  endpoint('api-get-counterparty', 'Get counterparty', 'GET', '/reference/counterparties/{id}', 'svc-reference-data', ['svc-trade-enricher'], 'Return the controlled data for one trading party.', {
    requestFields:[apiField('id','path','string',true,'Trading-party identifier.','CP-0042')], responseFields:[apiField('counterpartyId','body','string',true,'Trading-party identifier.','CP-0042'),apiField('legalEntityId','body','string',true,'Registered Legal Entity Identifier.','5493001KJTIIGC8Y1R12'),apiField('name','body','string',true,'Registered name.','Example Bank A/S'),apiField('status','body','string',true,'Approval state.','approved')], requestExample:'Path: id=CP-0042', responseExample:'{\n  "counterpartyId": "CP-0042",\n  "legalEntityId": "5493001KJTIIGC8Y1R12",\n  "name": "Example Bank A/S",\n  "status": "approved"\n}'
  }),
  endpoint('api-post-journal', 'Post journal', 'POST', '/journals', 'svc-ledger-posting', ['svc-trade-enricher'], 'Create balanced accounting entries for one transaction.', {
    requestFields:[apiField('tradeId','body','string',true,'Source transaction identifier.','TRD-DEMO-1042'),apiField('postingDate','body','date',true,'Accounting date.','2026-10-13'),apiField('lines','body','array',true,'Debit and credit lines.','[{"account":"1100","debit":1250000,"credit":0}]','At least two lines. Total debit must equal total credit.')], responseFields:[apiField('journalId','body','string',true,'Created journal identifier.','JRN-88014'),apiField('status','body','string',true,'Posting result.','posted'),apiField('debitTotal','body','decimal',true,'Sum of debit values.','1250000.00'),apiField('creditTotal','body','decimal',true,'Sum of credit values.','1250000.00')], requestExample:'{\n  "tradeId": "TRD-DEMO-1042",\n  "postingDate": "2026-10-13",\n  "lines": [{"account":"1100","debit":1250000,"credit":0},{"account":"2100","debit":0,"credit":1250000}]\n}', responseExample:'{\n  "journalId": "JRN-88014",\n  "status": "posted",\n  "debitTotal": 1250000.00,\n  "creditTotal": 1250000.00\n}', idempotency:'Idempotent by tradeId. One transaction can create one active journal.'
  }),
  endpoint('api-get-journal', 'Get journal', 'GET', '/journals/{tradeId}', 'svc-ledger-posting', ['job-reporting-etl'], 'Return accounting entries for one transaction.', {
    requestFields:[apiField('tradeId','path','string',true,'Source transaction identifier.','TRD-DEMO-1042')], responseFields:[apiField('journalId','body','string',true,'Journal identifier.','JRN-88014'),apiField('tradeId','body','string',true,'Source transaction identifier.','TRD-DEMO-1042'),apiField('postingDate','body','date',true,'Accounting date.','2026-10-13'),apiField('lines','body','array',true,'Debit and credit lines.','[{"account":"1100","debit":1250000,"credit":0}]')], requestExample:'Path: tradeId=TRD-DEMO-1042', responseExample:'{\n  "journalId": "JRN-88014",\n  "tradeId": "TRD-DEMO-1042",\n  "postingDate": "2026-10-13",\n  "lines": [{"account":"1100","debit":1250000,"credit":0}]\n}'
  }),
  endpoint('api-post-etl', 'Run warehouse load', 'POST', '/jobs/reporting-etl/runs', 'job-reporting-etl', ['scheduler'], 'Start one reporting-database load.', {
    requestFields:[apiField('businessDate','body','date',true,'Date to load.','2026-10-13'),apiField('mode','body','string',true,'Load mode.','incremental','Allowed values: incremental, full.'),apiField('requestedBy','body','string',true,'Scheduler or operator identity.','daily-scheduler')], responseFields:[apiField('runId','body','string',true,'Load-run identifier.','LOAD-20261013-01'),apiField('status','body','string',true,'Initial run state.','queued'),apiField('queuedAt','body','date-time',true,'Time at which the run entered the queue.','2026-10-13T06:00:02Z')], requestExample:'{\n  "businessDate": "2026-10-13",\n  "mode": "incremental",\n  "requestedBy": "daily-scheduler"\n}', responseExample:'{\n  "runId": "LOAD-20261013-01",\n  "status": "queued",\n  "queuedAt": "2026-10-13T06:00:02Z"\n}', idempotency:'One active run is allowed for each businessDate and mode.'
  }),
  endpoint('api-get-etl', 'Get load status', 'GET', '/jobs/reporting-etl/runs/{id}', 'job-reporting-etl', ['svc-regulatory-reporting'], 'Return the state of one reporting-database load.', {
    requestFields:[apiField('id','path','string',true,'Load-run identifier.','LOAD-20261013-01')], responseFields:[apiField('runId','body','string',true,'Load-run identifier.','LOAD-20261013-01'),apiField('status','body','string',true,'Current run state.','failed','Allowed values: queued, running, completed, failed.'),apiField('rowsLoaded','body','integer',true,'Number of rows committed.','0'),apiField('startedAt','body','date-time',false,'Time at which processing started.','2026-10-13T06:00:04Z'),apiField('completedAt','body','date-time',false,'Time at which processing ended.','2026-10-13T06:44:00Z'),apiField('errorCode','body','string',false,'Stable failure code.','WAREHOUSE_CONNECTION_TIMEOUT')], requestExample:'Path: id=LOAD-20261013-01', responseExample:'{\n  "runId": "LOAD-20261013-01",\n  "status": "failed",\n  "rowsLoaded": 0,\n  "startedAt": "2026-10-13T06:00:04Z",\n  "completedAt": "2026-10-13T06:44:00Z",\n  "errorCode": "WAREHOUSE_CONNECTION_TIMEOUT"\n}'
  }),
  endpoint('api-get-exposure', 'Get exposure report', 'GET', '/reports/exposure/{date}', 'svc-regulatory-reporting', ['portal-regulatory'], 'Return the report of money at risk for one date.', {
    requestFields:[apiField('date','path','date',true,'Report date.','2026-10-13'),apiField('counterpartyId','query','string',false,'Limit the report to one trading party.','CP-0042')], responseFields:[apiField('reportDate','body','date',true,'Report date.','2026-10-13'),apiField('currency','body','string',true,'Currency used for totals.','EUR'),apiField('totalExposure','body','decimal',true,'Total money at risk.','4372500.00'),apiField('positions','body','array',true,'Exposure rows by trading party and product.','[{"counterpartyId":"CP-0042","netExposure":1250000}]')], requestExample:'Path: date=2026-10-13\nQuery: counterpartyId=CP-0042', responseExample:'{\n  "reportDate": "2026-10-13",\n  "currency": "EUR",\n  "totalExposure": 4372500.00,\n  "positions": [{"counterpartyId":"CP-0042","netExposure":1250000.00}]\n}'
  }),
  endpoint('api-post-report', 'Generate report', 'POST', '/reports/exposure/runs', 'svc-regulatory-reporting', ['scheduler'], 'Start one exposure-report run.', {
    requestFields:[apiField('reportDate','body','date',true,'Date to report.','2026-10-13'),apiField('format','body','string',true,'Output format.','XBRL','Allowed values: XBRL, CSV.'),apiField('requestedBy','body','string',true,'Scheduler or operator identity.','daily-scheduler')], responseFields:[apiField('reportRunId','body','string',true,'Report-run identifier.','RPT-20261013-01'),apiField('status','body','string',true,'Initial run state.','queued'),apiField('outputUri','body','string',false,'Location of the output after completion.','mock://reports/2026-10-13/exposure.xbrl')], requestExample:'{\n  "reportDate": "2026-10-13",\n  "format": "XBRL",\n  "requestedBy": "daily-scheduler"\n}', responseExample:'{\n  "reportRunId": "RPT-20261013-01",\n  "status": "queued"\n}', idempotency:'One report run is allowed for each reportDate and format.'
  }),
  endpoint('api-post-notification', 'Send notification', 'POST', '/notifications', 'svc-notification', ['svc-regulatory-reporting', 'svc-trade-intake'], 'Send one processing or report notification.', {
    requestFields:[apiField('recipient','body','string',true,'Target address or system identifier.','ops@example.invalid'),apiField('template','body','string',true,'Message template identifier.','report-ready'),apiField('subjectId','body','string',true,'Transaction or report identifier.','RPT-20261013-01'),apiField('variables','body','object',false,'Values used by the message template.','{"reportDate":"2026-10-13"}')], responseFields:[apiField('notificationId','body','string',true,'Notification identifier.','NTF-44102'),apiField('status','body','string',true,'Delivery state.','queued')], requestExample:'{\n  "recipient": "ops@example.invalid",\n  "template": "report-ready",\n  "subjectId": "RPT-20261013-01",\n  "variables": {"reportDate":"2026-10-13"}\n}', responseExample:'{\n  "notificationId": "NTF-44102",\n  "status": "queued"\n}', idempotency:'Not guaranteed. The caller must prevent duplicate messages.'
  }),
]

const databaseRows = [
  ['db-trade', 'Trade Operations DB', 'Operational trade capture and validation state', 'team-trade'],
  ['db-reference', 'Reference Data DB', 'Controlled instruments, counterparties and rates', 'team-finance'],
  ['db-ledger', 'Ledger DB', 'Balanced accounting journals', 'team-finance'],
  ['db-warehouse', 'Reporting Warehouse', 'Reporting data organised by transaction, trading party, and financial product', 'team-reporting'],
] as const

export const databases: Entity[] = databaseRows.map(([id, name, description, ownerTeamId]) => ({ id, type: 'database', name, slug: id, description, ownerTeamId, tags: ['database'], sourceReferences: ['src-db'], harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', pageUrl: `/data/databases/${id}` }))

const columnDefinitions:Record<string,Omit<DataTable['columns'][number],'name'>> = {
  trade_id:{dataType:'varchar(40)',nullable:false,key:'Primary key',description:'Identifies one financial transaction.',example:'TRD-DEMO-1042'},
  version:{dataType:'integer',nullable:false,description:'Increases when the transaction changes.',example:'4'},
  product_type:{dataType:'varchar(30)',nullable:false,description:'Identifies the product category.',example:'FX_FORWARD'},
  status:{dataType:'varchar(20)',nullable:false,description:'Stores the current processing state.',example:'accepted'},
  event_id:{dataType:'uuid',nullable:false,key:'Primary key',description:'Identifies one processing event.',example:'7a938d8e-9d35-4cf1-93d7-77aa4c7151a1'},
  event_type:{dataType:'varchar(40)',nullable:false,description:'Identifies the recorded state change.',example:'TRADE_ACCEPTED'},
  occurred_at:{dataType:'timestamp with time zone',nullable:false,description:'Stores the time of the event.',example:'2026-10-13T06:18:42Z'},
  code:{dataType:'varchar(40)',nullable:false,description:'Stable validation error code.',example:'INVALID_LEI'},
  field:{dataType:'varchar(80)',nullable:true,description:'Identifies the input field that failed.',example:'legalEntityId'},
  message:{dataType:'varchar(500)',nullable:false,description:'Explains the validation error.',example:'Legal Entity Identifier must contain 20 characters.'},
  legacy_code:{dataType:'varchar(20)',nullable:false,description:'Stores the code used by the retired validator.',example:'E142'},
  created_at:{dataType:'timestamp with time zone',nullable:false,description:'Stores the time when the row was created.',example:'2025-04-18T09:24:12Z'},
  instrument_id:{dataType:'varchar(30)',nullable:false,key:'Primary key',description:'Identifies one financial product.',example:'INS-9182'},
  asset_class:{dataType:'varchar(30)',nullable:false,description:'Groups the financial product.',example:'Foreign exchange'},
  currency:{dataType:'char(3)',nullable:false,description:'Stores an ISO 4217 currency code.',example:'EUR'},
  counterparty_id:{dataType:'varchar(30)',nullable:false,key:'Primary key',description:'Identifies one trading party.',example:'CP-0042'},
  lei:{dataType:'char(20)',nullable:false,key:'Unique key',description:'Stores the registered Legal Entity Identifier.',example:'5493001KJTIIGC8Y1R12'},
  currency_pair:{dataType:'char(7)',nullable:false,key:'Primary key',description:'Identifies the base and quote currencies.',example:'EUR/USD'},
  rate:{dataType:'numeric(18,8)',nullable:false,description:'Stores units of quote currency for one base-currency unit.',example:'1.08420000'},
  effective_date:{dataType:'date',nullable:false,key:'Primary key',description:'Stores the date on which the rate applies.',example:'2026-10-13'},
  journal_id:{dataType:'varchar(30)',nullable:false,key:'Primary key',description:'Identifies one accounting journal.',example:'JRN-88014'},
  posting_date:{dataType:'date',nullable:false,description:'Stores the accounting date.',example:'2026-10-13'},
  account:{dataType:'varchar(20)',nullable:false,description:'Identifies one ledger account.',example:'1100'},
  debit:{dataType:'numeric(20,2)',nullable:false,description:'Stores the debit amount. Zero means that the line is not a debit.',example:'1250000.00'},
  credit:{dataType:'numeric(20,2)',nullable:false,description:'Stores the credit amount. Zero means that the line is not a credit.',example:'0.00'},
  trade_key:{dataType:'bigint',nullable:false,key:'Primary key',description:'Warehouse key for one accepted transaction.',example:'8800142'},
  counterparty_key:{dataType:'bigint',nullable:false,key:'Foreign key',description:'Links the row to dim_counterparty.',example:'42018'},
  amount_base:{dataType:'numeric(20,2)',nullable:false,description:'Stores the transaction amount in the reporting currency.',example:'1250000.00'},
  report_date:{dataType:'date',nullable:false,key:'Primary key',description:'Stores the date of the exposure report.',example:'2026-10-13'},
  net_exposure:{dataType:'numeric(20,2)',nullable:false,description:'Stores the money at risk after offsetting eligible amounts.',example:'4372500.00'},
  valid_from:{dataType:'timestamp with time zone',nullable:false,description:'Stores the time from which the dimension row is valid.',example:'2026-01-01T00:00:00Z'},
  instrument_key:{dataType:'bigint',nullable:false,key:'Primary key',description:'Warehouse key for one financial product.',example:'9182'},
  run_id:{dataType:'varchar(40)',nullable:false,key:'Primary key',description:'Identifies one warehouse load.',example:'LOAD-20261013-01'},
  row_count:{dataType:'bigint',nullable:false,description:'Stores the number of committed rows.',example:'14862'},
  completed_at:{dataType:'timestamp with time zone',nullable:true,description:'Stores the completion time. The value is null while the load runs.',example:'2026-10-13T06:31:18Z'},
}
const tableMeta:Record<string,Pick<DataTable,'grain'|'updatePattern'|'retention'|'relationships'>> = {
  'tbl-trade':{grain:'One row for the current version of each transaction.',updatePattern:'Insert on acceptance. Update on amendment or state change.',retention:'7 years after the transaction closes.',relationships:[]},
  'tbl-trade-event':{grain:'One row for each transaction state change.',updatePattern:'Append only.',retention:'7 years.',relationships:[{column:'trade_id',targetTableId:'tbl-trade',targetColumn:'trade_id',cardinality:'Many events to one transaction',description:'Each event belongs to one transaction.'}]},
  'tbl-validation-error':{grain:'One row for each active validation error.',updatePattern:'Replace errors when validation runs again.',retention:'90 days after resolution.',relationships:[{column:'trade_id',targetTableId:'tbl-trade',targetColumn:'trade_id',cardinality:'Many errors to one transaction',description:'Each error belongs to one transaction.'}]},
  'tbl-validation-error-legacy':{grain:'One row for each archived legacy error.',updatePattern:'Read-only archive.',retention:'Until the archive owner approves removal.',relationships:[{column:'trade_id',targetTableId:'tbl-trade',targetColumn:'trade_id',cardinality:'Many archived errors to one transaction',description:'The catalogue records the logical link. It does not record a database constraint.'}]},
  'tbl-instrument':{grain:'One row for each financial product.',updatePattern:'Update when controlled reference data changes.',retention:'Current row plus 7 years of audit history.',relationships:[]},
  'tbl-counterparty':{grain:'One row for each approved trading party.',updatePattern:'Update when controlled reference data changes.',retention:'Current row plus 7 years of audit history.',relationships:[]},
  'tbl-exchange-rate':{grain:'One row for each currency pair and effective date.',updatePattern:'Insert once each business day.',retention:'10 years.',relationships:[]},
  'tbl-journal-entry':{grain:'One row for each accounting journal.',updatePattern:'Insert when Ledger Posting accepts a journal.',retention:'10 years.',relationships:[]},
  'tbl-journal-line':{grain:'One row for each debit or credit line.',updatePattern:'Insert with its journal. Do not update after posting.',retention:'10 years.',relationships:[{column:'journal_id',targetTableId:'tbl-journal-entry',targetColumn:'journal_id',cardinality:'Many lines to one journal',description:'Each line belongs to one journal.'}]},
  'tbl-fact-trade':{grain:'One row for each accepted transaction and report date.',updatePattern:'Load during the daily warehouse run.',retention:'10 years.',relationships:[{column:'counterparty_key',targetTableId:'tbl-dim-counterparty',targetColumn:'counterparty_key',cardinality:'Many facts to one trading party',description:'The key identifies the reporting version of the trading party.'}]},
  'tbl-fact-exposure':{grain:'One row for each report date and trading party.',updatePattern:'Rebuild during the daily warehouse run.',retention:'10 years.',relationships:[{column:'counterparty_key',targetTableId:'tbl-dim-counterparty',targetColumn:'counterparty_key',cardinality:'Many exposure rows to one trading party',description:'The key identifies the reporting version of the trading party.'}]},
  'tbl-dim-counterparty':{grain:'One row for each reporting version of a trading party.',updatePattern:'Insert a new row when controlled data changes.',retention:'10 years after the last valid date.',relationships:[]},
  'tbl-dim-instrument':{grain:'One row for each reporting version of a financial product.',updatePattern:'Insert a new row when controlled data changes.',retention:'10 years after the last valid date.',relationships:[]},
  'tbl-load-audit':{grain:'One row for each warehouse load.',updatePattern:'Insert at start. Update at completion or failure.',retention:'2 years.',relationships:[]},
}
const table = (id: string, name: string, databaseId: string, purpose: string, ownerTeamId: string, readers: string[], writers: string[], columnNames: string[], classification = 'Confidential business data'): DataTable => ({
  id, type: 'table', name, slug: id, databaseId, description: purpose, ownerTeamId, readers, writers, columns:columnNames.map(name=>({name,...columnDefinitions[name]})), classification, ...tableMeta[id],
  lineage: writers.length ? `Derived from ${writers.map(x => services.find(s => s.id === x)?.name ?? x).join(', ')}` : 'No producing deployment mapped',
  tags: ['table', databaseId], sourceReferences: ['src-db'], harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', pageUrl: `/data/tables/${id}`,
})

export const tables: DataTable[] = [
  table('tbl-trade', 'trade', 'db-trade', 'Stores the current state of each accepted transaction', 'team-trade', ['svc-trade-enricher'], ['svc-trade-intake'], ['trade_id', 'version', 'product_type', 'status']),
  table('tbl-trade-event', 'trade_event', 'db-trade', 'Stores a permanent record of each transaction state change', 'team-trade', ['svc-trade-validator', 'svc-trade-enricher'], ['svc-trade-intake'], ['event_id', 'trade_id', 'event_type', 'occurred_at']),
  table('tbl-validation-error', 'validation_error', 'db-trade', 'Stores the current validation errors for each transaction', 'team-trade', ['svc-trade-intake'], ['svc-trade-validator'], ['trade_id', 'code', 'field', 'message']),
  table('tbl-validation-error-legacy', 'validation_error_legacy', 'db-trade', 'Stores validation errors from the retired validator', 'team-trade', [], [], ['trade_id', 'legacy_code', 'created_at']),
  table('tbl-instrument', 'instrument', 'db-reference', 'Stores the controlled definition of each financial product', 'team-finance', ['svc-reference-data'], ['svc-reference-data'], ['instrument_id', 'asset_class', 'currency']),
  table('tbl-counterparty', 'counterparty', 'db-reference', 'Stores the approved identity of each trading party', 'team-finance', ['svc-reference-data'], ['svc-reference-data'], ['counterparty_id', 'lei', 'status']),
  table('tbl-exchange-rate', 'exchange_rate', 'db-reference', 'Stores one daily conversion rate for each currency pair', 'team-finance', ['svc-reference-data'], ['svc-reference-data'], ['currency_pair', 'rate', 'effective_date']),
  table('tbl-journal-entry', 'journal_entry', 'db-ledger', 'Stores one accounting journal for each processed transaction', 'team-finance', ['job-reporting-etl'], ['svc-ledger-posting'], ['journal_id', 'trade_id', 'posting_date']),
  table('tbl-journal-line', 'journal_line', 'db-ledger', 'Stores the debit and credit lines of each journal', 'team-finance', ['job-reporting-etl'], ['svc-ledger-posting'], ['journal_id', 'account', 'debit', 'credit']),
  table('tbl-fact-trade', 'fact_trade', 'db-warehouse', 'Stores accepted transactions in the reporting format', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['trade_key', 'counterparty_key', 'amount_base']),
  table('tbl-fact-exposure', 'fact_exposure', 'db-warehouse', 'Stores the amount of money at risk for each trading party and report date', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['report_date', 'counterparty_key', 'net_exposure']),
  table('tbl-dim-counterparty', 'dim_counterparty', 'db-warehouse', 'Stores reporting versions of each trading party', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['counterparty_key', 'lei', 'valid_from']),
  table('tbl-dim-instrument', 'dim_instrument', 'db-warehouse', 'Stores reporting versions of each financial product', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['instrument_key', 'asset_class', 'currency']),
  table('tbl-load-audit', 'load_audit', 'db-warehouse', 'Stores the result and row count of each warehouse load', 'team-reporting', ['svc-regulatory-reporting'], ['job-reporting-etl'], ['run_id', 'row_count', 'status', 'completed_at'], 'Internal operational data'),
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
  ['Load the Reporting Warehouse','The reporting rows are stored in the warehouse','job-reporting-etl','Warehouse load',['tbl-fact-trade','tbl-fact-exposure']],
  ['Confirm that the exposure report contains the trade','The trade contributes to the daily exposure','svc-regulatory-reporting','GET /reports/exposure/{date}',['tbl-fact-exposure']],
] as const

const requirementSpecs = [
  ['req-valid-fx','A valid foreign-exchange transaction is accepted','Trade capture'], ['req-invalid-lei','A transaction with an invalid Legal Entity Identifier is rejected','Trade validation'],
  ['req-idempotent','Submitting the same transaction twice does not create a duplicate','Trade capture'], ['req-enrichment','An accepted foreign-exchange transaction receives the applicable exchange rate','Trade enrichment'],
  ['req-balanced-journal','Accepted transactions create balanced accounting entries','Accounting'], ['req-exposure','Accepted foreign-exchange transactions appear in the daily exposure report','Regulatory reporting'],
  ['req-cutoff','The daily exposure report is available before its cutoff','Regulatory reporting'], ['req-correction','Corrected trades are reflected in the next report','Regulatory reporting'],
  ['req-network','Only approved network paths can reach the Reporting Warehouse','Platform controls'], ['req-no-synthetic','Production configuration contains no synthetic data providers','Platform controls'],
] as const

const requirementDetails:Record<string,{acceptanceCriteria:string[];businessRisk:string}> = {
  'req-valid-fx':{acceptanceCriteria:['The system records the transaction once.','The system returns an acceptance event identifier.'],businessRisk:'A lost transaction can produce an incomplete report.'},
  'req-invalid-lei':{acceptanceCriteria:['The system rejects an invalid Legal Entity Identifier.','The result identifies the field and validation rule.'],businessRisk:'An invalid trading party can enter regulated processing.'},
  'req-idempotent':{acceptanceCriteria:['A repeated transaction identifier does not create a second transaction.','The response returns the stored transaction identifier.'],businessRisk:'A duplicate can overstate accounting and exposure.'},
  'req-enrichment':{acceptanceCriteria:['The system applies the rate for the transaction date.','The evidence identifies the rate source.'],businessRisk:'An incorrect rate can change accounting and exposure values.'},
  'req-balanced-journal':{acceptanceCriteria:['Total debit equals total credit.','The journal links to the source transaction.'],businessRisk:'An unbalanced journal can corrupt financial records.'},
  'req-exposure':{acceptanceCriteria:['An accepted transaction appears in the report for its business date.','The reported amount uses the applicable exchange rate.','The evidence links the report row to the source transaction.'],businessRisk:'A missing transaction can understate the amount of money at risk.'},
  'req-cutoff':{acceptanceCriteria:['The report is available before 06:00 UTC.','The completion time is recorded.'],businessRisk:'A late report can miss a regulatory submission window.'},
  'req-correction':{acceptanceCriteria:['The next report uses the latest accepted transaction version.','The prior value does not remain in the total.'],businessRisk:'A stale value can make the report incorrect.'},
  'req-network':{acceptanceCriteria:['Only recorded source and destination pairs can connect.','The rule identifies the environment, protocol and port.'],businessRisk:'An unapproved path can expose regulated data.'},
  'req-no-synthetic':{acceptanceCriteria:['Production uses the authoritative reference-data provider.','No enabled setting names a synthetic provider.'],businessRisk:'Synthetic data can make a live report invalid.'},
}

const simpleComponents = ['svc-trade-intake','svc-trade-validator','svc-trade-enricher','svc-ledger-posting','job-reporting-etl','svc-regulatory-reporting','svc-notification']
export const requirements: Requirement[] = requirementSpecs.map(([id,title,capability], index) => {
  const makeSteps = (offset: number) => index === 5 && offset === 0 ? centralSteps.map(([stepTitle,expected,componentId,operation,dataIds]) => ({ title: stepTitle, expected, componentId, operation, dataIds: [...dataIds] })) : [
    { title: offset === 0 ? `Exercise ${title.toLowerCase()}` : offset === 1 ? 'Exercise an alternate business condition' : 'Exercise a rejected or unavailable condition', expected: offset === 2 ? 'The condition is rejected with traceable evidence' : 'The expected business outcome is recorded', componentId: simpleComponents[(index + offset) % simpleComponents.length], operation: 'Executable scenario step', dataIds: [tables[(index + offset) % tables.length].id] },
  ]
  return { id, title, capability, narrative: `Northstar must show that ${title.charAt(0).toLowerCase()}${title.slice(1)}.`, ...requirementDetails[id], preconditions: ['The deployment inventory exists for the selected environment.','The test data is marked as synthetic.'], ownerTeamId: index < 4 ? 'team-trade' : index < 8 ? 'team-reporting' : 'team-platform', sourceReferences: ['src-tests','src-curated'], scenarios: [
    { id: `${id}-main`, title: 'Primary business path', kind: 'main', steps: makeSteps(0) },
    { id: `${id}-alternate`, title: 'Alternate input or timing', kind: 'alternate', steps: makeSteps(1) },
    { id: `${id}-failure`, title: 'Failure or unavailable dependency', kind: 'failure', steps: makeSteps(2) },
  ] }
})

const versionContext = (env: string) => Object.fromEntries(deployments.filter(d => d.environmentId === env && d.snapshotId === 'current' && !d.retired).map(d => [d.serviceId,d.version]))
const execSteps = (status: 'passed'|'failed') => centralSteps.map(([title], index) => ({ title, status: status === 'failed' && index === 4 ? 'failed' as const : index > 4 && status === 'failed' ? 'not-executed' as const : 'passed' as const, actual: status === 'failed' && index === 4 ? 'The connection attempt reached its 30-second limit. The load wrote no rows.' : index > 4 && status === 'failed' ? 'The test stopped before this step.' : 'The observed result matched the expected result.', componentId: centralSteps[index][2], evidenceReferenceId: 'src-tests', duration:index > 4 && status==='failed'?undefined:['0.8 s','1.4 s','2.1 s','0.9 s',status==='failed'?'30.0 s':'18.7 s','1.2 s'][index] }))
export const executions: TestExecution[] = [
  { id:'exec-exposure-uat-current', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'uat', snapshotId:'current', status:'failed', executedAt:'2026-10-13T06:44:00Z', runId:'AT-18427', duration:'35.2 s', trigger:'Release-candidate acceptance suite', testData:{dataset:'northstar-uat-2026-10-13','transaction ID':'TRD-DEMO-1042','business date':'2026-10-13'}, serviceVersions:versionContext('uat'), steps:execSteps('failed'), evidenceReferences:['src-tests','src-network','src-deploy'] },
  { id:'exec-exposure-prod-current', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'production', snapshotId:'current', status:'passed', executedAt:'2026-10-13T05:12:00Z', runId:'SMOKE-7712', duration:'25.1 s', trigger:'Daily production verification', testData:{dataset:'northstar-production-smoke','transaction ID':'TRD-SMOKE-7712','business date':'2026-10-13'}, serviceVersions:versionContext('production'), steps:execSteps('passed'), evidenceReferences:['src-tests','src-network','src-deploy'] },
  { id:'exec-exposure-uat-previous', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'uat', snapshotId:'previous-day', status:'passed', executedAt:'2026-10-12T06:38:00Z', runId:'AT-18391', duration:'24.7 s', trigger:'Release-candidate acceptance suite', testData:{dataset:'northstar-uat-2026-10-12','transaction ID':'TRD-DEMO-1018','business date':'2026-10-12'}, serviceVersions:{...versionContext('uat'),'job-reporting-etl':'2.3.8'}, steps:execSteps('passed'), evidenceReferences:['src-tests','src-deploy'] },
  { id:'exec-exposure-uat-before', requirementId:'req-exposure', scenarioId:'req-exposure-main', environmentId:'uat', snapshotId:'before-rc', status:'passed', executedAt:'2026-10-06T06:35:00Z', runId:'AT-18142', duration:'26.0 s', trigger:'Baseline acceptance suite', testData:{dataset:'northstar-uat-2026-10-06','transaction ID':'TRD-DEMO-0981','business date':'2026-10-06'}, serviceVersions:{...versionContext('production')}, steps:execSteps('passed'), evidenceReferences:['src-tests','src-deploy'] },
  ...requirements.filter(r => r.id !== 'req-exposure').flatMap((r,index) => ['uat','production'].map((env,ei) => ({ id:`exec-${r.id}-${env}-current`, requirementId:r.id, scenarioId:`${r.id}-main`, environmentId:env, snapshotId:'current', status:(r.id === 'req-cutoff' && env === 'uat' ? 'stale' : 'passed') as TestExecution['status'], executedAt:`2026-10-${String(10 + (index % 3)).padStart(2,'0')}T0${5+ei}:20:00Z`, runId:`AT-${18000+index*10+ei}`, duration:`${8+index}.4 s`, trigger:'Acceptance suite', testData:{dataset:`northstar-${env}-current`,case:`${r.id}-main`}, serviceVersions:versionContext(env), steps:[{ title:r.scenarios[0].steps[0].title, status:'passed' as const, actual:'The observed result matched the expected result.', componentId:r.scenarios[0].steps[0].componentId, evidenceReferenceId:'src-tests',duration:`${4+index}.2 s` }], evidenceReferences:['src-tests','src-deploy'] }))),
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
