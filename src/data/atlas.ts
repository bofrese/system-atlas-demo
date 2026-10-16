import type { DataTable, Deployment, Endpoint, Entity, Environment, Finding, NetworkRule, Relationship, Repository, Requirement, Service, Snapshot, SourceReference, Team, TestExecution } from './model'

export const DEMO_NOW = '2026-10-13T08:00:00Z'

export const teams: Team[] = [
  ['team-payments', 'Payments'], ['team-accounts', 'Accounts'], ['team-reporting', 'Regulatory Reporting'],
  ['team-platform', 'Platform Operations'], ['team-quality', 'Quality Engineering'],
].map(([id, name]) => ({ id, name }))

export const environments: Environment[] = [
  { id: 'development', name: 'Development', shortName: 'DEV', description: 'Shared development cluster.' },
  { id: 'test', name: 'Test', shortName: 'TEST', description: 'Automated integration and contract tests.' },
  { id: 'uat', name: 'User Acceptance Test', shortName: 'UAT', description: 'Release candidates. Test accounts and test exchange rates.' },
  { id: 'preproduction', name: 'Pre-production', shortName: 'PRE', description: 'Copy of the production setup for release rehearsal.' },
  { id: 'production', name: 'Production', shortName: 'PROD', description: 'Live customer payments.' },
]

export const snapshots: Snapshot[] = [
  { id: 'before-rc', name: '6 Oct 08:00', at: '2026-10-06T08:00:00Z' },
  { id: 'previous-day', name: '12 Oct 08:00', at: '2026-10-12T08:00:00Z' },
  { id: 'current', name: '13 Oct 08:00 (latest)', at: DEMO_NOW },
]

export const sources: SourceReference[] = [
  { id: 'src-git-intake', sourceType: 'Git', sourceName: 'transfer-intake repository', sourceLocation: 'mock://git/transfer-intake/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:48:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-checks', sourceType: 'Git', sourceName: 'transfer-checks repository', sourceLocation: 'mock://git/transfer-checks/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:46:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-accounts', sourceType: 'Git', sourceName: 'account-directory repository', sourceLocation: 'mock://git/account-directory/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:42:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-fees', sourceType: 'Git', sourceName: 'fees-currency repository', sourceLocation: 'mock://git/fees-currency/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T02:11:00Z', expectedRefreshInterval: '1 hour', freshness: 'stale' },
  { id: 'src-git-booking', sourceType: 'Git', sourceName: 'account-booking repository', sourceLocation: 'mock://git/account-booking/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:52:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-loader', sourceType: 'Git', sourceName: 'reporting-loader repository', sourceLocation: 'mock://git/reporting-loader/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:45:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-report', sourceType: 'Git', sourceName: 'payments-report repository', sourceLocation: 'mock://git/payments-report/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:41:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-git-notification', sourceType: 'Git', sourceName: 'notification repository', sourceLocation: 'mock://git/notification/refs/main', collector: 'Repository metadata collector', harvestedAt: '2026-10-13T07:39:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-deploy', sourceType: 'Deployment manifests', sourceName: 'Northstar deployment inventory', sourceLocation: 'mock://deployments/northstar/current', collector: 'Deployment manifest collector', harvestedAt: '2026-10-13T07:55:00Z', expectedRefreshInterval: '15 minutes', freshness: 'current' },
  { id: 'src-openapi', sourceType: 'OpenAPI', sourceName: 'Published API contracts', sourceLocation: 'mock://contracts/openapi/catalogue', collector: 'OpenAPI collector', harvestedAt: '2026-10-13T07:30:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-db', sourceType: 'Database catalogue', sourceName: 'Northstar schema catalogue', sourceLocation: 'mock://database/catalogue/northstar', collector: 'Schema catalogue collector', harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', freshness: 'current' },
  { id: 'src-tests', sourceType: 'Test results', sourceName: 'Northstar acceptance results', sourceLocation: 'mock://ci/acceptance-tests/2026-10-13', collector: 'Test result collector', harvestedAt: '2026-10-13T07:25:00Z', expectedRefreshInterval: '30 minutes', freshness: 'current' },
  { id: 'src-network', sourceType: 'Infrastructure as code', sourceName: 'Northstar network policy', sourceLocation: 'mock://iac/network/northstar.tf', collector: 'Network policy collector', harvestedAt: '2026-10-13T07:50:00Z', expectedRefreshInterval: '1 hour', freshness: 'current' },
  { id: 'src-curated', sourceType: 'Requirements catalogue', sourceName: 'Northstar requirements catalogue', sourceLocation: 'mock://catalogue/northstar/requirements', collector: 'Requirements collector', harvestedAt: '2026-10-12T15:00:00Z', expectedRefreshInterval: '30 days', freshness: 'current' },
]

const svc = (id: string, name: string, serviceType: string, ownerTeamId: string, responsibility: string, repositoryId: string, capability: string, source: string): Service => ({
  id, type: 'service', name, slug: id, serviceType, ownerTeamId, responsibility, description: responsibility, repositoryId, capability,
  tags: [serviceType.toLowerCase(), capability.toLowerCase().replaceAll(' ', '-')], sourceReferences: [source, 'src-deploy'], harvestedAt: source === 'src-git-fees' ? '2026-10-13T02:11:00Z' : '2026-10-13T07:48:00Z', expectedRefreshInterval: '1 hour', pageUrl: `/services/${id}`,
})

export const services: Service[] = [
  svc('svc-transfer-intake', 'Transfer Intake', 'HTTP API service', 'team-payments', 'Receives new transfers from the mobile app and online banking', 'repo-transfer-intake', 'Transfer intake', 'src-git-intake'),
  svc('svc-transfer-checks', 'Transfer Checks', 'Service', 'team-payments', 'Checks limits, account status and fraud rules', 'repo-transfer-checks', 'Transfer checks', 'src-git-checks'),
  svc('svc-account-directory', 'Account Directory', 'HTTP API service', 'team-accounts', 'Provides accounts, fee rules and exchange rates', 'repo-account-directory', 'Account data', 'src-git-accounts'),
  svc('svc-fees-currency', 'Fees & Currency', 'Worker', 'team-payments', 'Adds the fee and converts the currency of accepted transfers', 'repo-fees-currency', 'Fees and currency', 'src-git-fees'),
  svc('svc-account-booking', 'Account Booking', 'Service', 'team-accounts', 'Takes money out of the sender account and adds it to the receiver account', 'repo-account-booking', 'Booking', 'src-git-booking'),
  svc('job-reporting-loader', 'Reporting Data Loader', 'Scheduled data pipeline', 'team-reporting', 'Loads completed transfers into the Reporting Warehouse every night', 'repo-reporting-loader', 'Regulatory reporting', 'src-git-loader'),
  svc('svc-payments-report', 'Daily Payments Report', 'HTTP API and batch service', 'team-reporting', 'Produces the daily payments report for the regulator', 'repo-payments-report', 'Regulatory reporting', 'src-git-report'),
  svc('svc-notification', 'Notification', 'Service', 'team-platform', 'Sends payment confirmations to customers', 'repo-notification', 'Customer messages', 'src-git-notification'),
]

const commits = ['a1f9c2d','b7e31a4','c30d92f','d2a8f11','e71bc42','f61d8a0','9ac42ef','81bd5c7']
const versionCommits:Record<string,string>={'3.7.3-dev':'4ddc611','4.2.0':'9b0f0e2','2.8.4':'a918c64','2.3.8':'7e04a22','3.1.5':'5c2b993'}
const commitFor=(version:string,fallback:string)=>versionCommits[version]??fallback
export const repositories: Repository[] = services.map((service, index) => ({ id: service.repositoryId, name: service.repositoryId.replace(/^repo-/, ''), serviceId: service.id, defaultBranch: 'main', sourceReferenceId: service.sourceReferences[0], lastCommit: commits[index] }))

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

const IBAN_FROM = 'NO93 8601 1117 947'
const IBAN_TO = 'NO02 1234 5678 903'

export const endpoints: Endpoint[] = [
  endpoint('api-post-transfers', 'Send transfer', 'POST', '/transfers', 'svc-transfer-intake', ['mobile-app', 'online-banking'], 'Accept one new transfer for processing.', {
    requestFields:[apiField('transferId','body','string',true,'Unique transfer identifier, created by the app.','TRF-DEMO-1042','1–40 characters.'),apiField('fromAccount','body','string',true,'Account to take the money from (IBAN).',IBAN_FROM),apiField('toAccount','body','string',true,'Account to send the money to (IBAN).',IBAN_TO),apiField('amount','body','decimal',true,'Amount to send.','250.00','Must be greater than 0.'),apiField('currency','body','string',true,'ISO 4217 currency code.','EUR','3 letters.'),apiField('message','body','string',false,'Text shown to the receiver.','Rent October','Up to 140 characters.')],
    responseFields:[apiField('transferId','body','string',true,'Accepted transfer identifier.','TRF-DEMO-1042'),apiField('status','body','string',true,'Initial processing state.','accepted','Value: accepted.'),apiField('eventId','body','string',true,'Identifier of the recorded acceptance event.','evt-demo-1042')],
    requestExample:`{\n  "transferId": "TRF-DEMO-1042",\n  "fromAccount": "${IBAN_FROM}",\n  "toAccount": "${IBAN_TO}",\n  "amount": 250.00,\n  "currency": "EUR",\n  "message": "Rent October"\n}`, responseExample:'{\n  "transferId": "TRF-DEMO-1042",\n  "status": "accepted",\n  "eventId": "evt-demo-1042"\n}', idempotency:'Idempotent by transferId. A repeated transferId must not send the money again.'
  }),
  endpoint('api-put-transfer', 'Change scheduled transfer', 'PUT', '/transfers/{transferId}', 'svc-transfer-intake', ['mobile-app', 'online-banking'], 'Replace a transfer that is scheduled for a later date.', {
    requestFields:[apiField('transferId','path','string',true,'Transfer to change.','TRF-DEMO-1042'),apiField('version','body','integer',true,'Current version, used to detect parallel changes.','3','Must equal the stored version.'),apiField('amount','body','decimal',false,'New amount.','275.00'),apiField('executionDate','body','date',false,'New date to send the money.','2026-10-14')], responseFields:[apiField('transferId','body','string',true,'Changed transfer identifier.','TRF-DEMO-1042'),apiField('version','body','integer',true,'New stored version.','4'),apiField('status','body','string',true,'Processing state after the change.','scheduled')], requestExample:'{\n  "version": 3,\n  "amount": 275.00,\n  "executionDate": "2026-10-14"\n}', responseExample:'{\n  "transferId": "TRF-DEMO-1042",\n  "version": 4,\n  "status": "scheduled"\n}', idempotency:'Idempotent for the same transferId and version.'
  }),
  endpoint('api-get-transfer', 'Get transfer status', 'GET', '/transfers/{transferId}', 'svc-transfer-intake', ['svc-notification'], 'Return the current processing state of one transfer.', {
    requestFields:[apiField('transferId','path','string',true,'Transfer to read.','TRF-DEMO-1042')], responseFields:[apiField('transferId','body','string',true,'Transfer identifier.','TRF-DEMO-1042'),apiField('version','body','integer',true,'Current stored version.','4'),apiField('status','body','string',true,'Current processing state.','booked','Allowed values: accepted, rejected, priced, booked.'),apiField('updatedAt','body','date-time',true,'Time of the latest state change.','2026-10-13T06:18:42Z')], requestExample:'Path: transferId=TRF-DEMO-1042', responseExample:'{\n  "transferId": "TRF-DEMO-1042",\n  "version": 4,\n  "status": "booked",\n  "updatedAt": "2026-10-13T06:18:42Z"\n}'
  }),
  endpoint('api-post-check', 'Check transfer', 'POST', '/checks/transfers', 'svc-transfer-checks', ['svc-transfer-intake'], 'Check one transfer against limits, account status and fraud rules.', {
    requestFields:[apiField('transferId','body','string',true,'Transfer identifier.','TRF-DEMO-1042'),apiField('fromAccount','body','string',true,'Sender account (IBAN).',IBAN_FROM),apiField('toAccount','body','string',true,'Receiver account (IBAN).',IBAN_TO),apiField('amount','body','decimal',true,'Amount to send.','250.00')], responseFields:[apiField('approved','body','boolean',true,'True when all checks passed.','true'),apiField('reasons','body','array',true,'Failed checks. Empty when approved is true.','[]'),apiField('ruleSetVersion','body','string',true,'Version of the applied check rules.','2026.10')], requestExample:`{\n  "transferId": "TRF-DEMO-1042",\n  "fromAccount": "${IBAN_FROM}",\n  "toAccount": "${IBAN_TO}",\n  "amount": 250.00\n}`, responseExample:'{\n  "approved": true,\n  "reasons": [],\n  "ruleSetVersion": "2026.10"\n}'
  }),
  endpoint('api-get-account', 'Get account', 'GET', '/accounts/{iban}', 'svc-account-directory', ['svc-fees-currency'], 'Return the status and currency of one account.', {
    requestFields:[apiField('iban','path','string',true,'Account number (IBAN).',IBAN_TO)], responseFields:[apiField('iban','body','string',true,'Account number (IBAN).',IBAN_TO),apiField('currency','body','string',true,'Account currency.','NOK'),apiField('status','body','string',true,'Account state.','open','Allowed values: open, blocked, closed.')], requestExample:`Path: iban=${IBAN_TO}`, responseExample:`{\n  "iban": "${IBAN_TO}",\n  "currency": "NOK",\n  "status": "open"\n}`
  }),
  endpoint('api-get-rate', 'Get exchange rate', 'GET', '/rates/{pair}', 'svc-account-directory', ['svc-fees-currency'], 'Return the exchange rate for one currency pair and date.', {
    requestFields:[apiField('pair','path','string',true,'Currency pair.','EUR-NOK','Format: AAA-BBB.'),apiField('date','query','date',true,'Date for the rate.','2026-10-13','ISO 8601 date.')], responseFields:[apiField('currencyPair','body','string',true,'Currency pair.','EUR/NOK'),apiField('rate','body','decimal',true,'Units of the second currency for one unit of the first.','11.6420'),apiField('effectiveDate','body','date',true,'Date on which the rate applies.','2026-10-13'),apiField('source','body','string',true,'Provider of the rate.','test-rates')], requestExample:'Path: pair=EUR-NOK\nQuery: date=2026-10-13', responseExample:'{\n  "currencyPair": "EUR/NOK",\n  "rate": 11.6420,\n  "effectiveDate": "2026-10-13",\n  "source": "test-rates"\n}'
  }),
  endpoint('api-get-fee', 'Get fee rule', 'GET', '/fees/{transferType}', 'svc-account-directory', ['svc-fees-currency'], 'Return the fee for one type of transfer.', {
    requestFields:[apiField('transferType','path','string',true,'Type of transfer.','INTERNATIONAL','Allowed values: DOMESTIC, INTERNATIONAL, INSTANT.')], responseFields:[apiField('transferType','body','string',true,'Type of transfer.','INTERNATIONAL'),apiField('fee','body','decimal',true,'Fee charged to the sender.','2.50'),apiField('currency','body','string',true,'Fee currency.','EUR'),apiField('validFrom','body','date',true,'First date the fee applies.','2026-01-01')], requestExample:'Path: transferType=INTERNATIONAL', responseExample:'{\n  "transferType": "INTERNATIONAL",\n  "fee": 2.50,\n  "currency": "EUR",\n  "validFrom": "2026-01-01"\n}'
  }),
  endpoint('api-post-booking', 'Book transfer', 'POST', '/bookings', 'svc-account-booking', ['svc-fees-currency'], 'Take money out of one account and add it to another.', {
    requestFields:[apiField('transferId','body','string',true,'Source transfer identifier.','TRF-DEMO-1042'),apiField('bookingDate','body','date',true,'Date of the booking.','2026-10-13'),apiField('lines','body','array',true,'Money out and money in, one line each.',`[{"iban":"${IBAN_FROM}","out":252.50,"in":0}]`,'At least two lines. Total out must equal total in plus fees.')], responseFields:[apiField('bookingId','body','string',true,'Created booking identifier.','BKG-88014'),apiField('status','body','string',true,'Booking result.','booked'),apiField('totalOut','body','decimal',true,'Sum of money out.','252.50'),apiField('totalIn','body','decimal',true,'Sum of money in, including the fee account.','252.50')], requestExample:`{\n  "transferId": "TRF-DEMO-1042",\n  "bookingDate": "2026-10-13",\n  "lines": [\n    {"iban":"${IBAN_FROM}","out":252.50,"in":0},\n    {"iban":"${IBAN_TO}","out":0,"in":250.00},\n    {"iban":"FEE-ACCOUNT","out":0,"in":2.50}\n  ]\n}`, responseExample:'{\n  "bookingId": "BKG-88014",\n  "status": "booked",\n  "totalOut": 252.50,\n  "totalIn": 252.50\n}', idempotency:'Idempotent by transferId. One transfer can create one active booking.'
  }),
  endpoint('api-get-booking', 'Get booking', 'GET', '/bookings/{transferId}', 'svc-account-booking', ['job-reporting-loader'], 'Return the booking lines of one transfer.', {
    requestFields:[apiField('transferId','path','string',true,'Source transfer identifier.','TRF-DEMO-1042')], responseFields:[apiField('bookingId','body','string',true,'Booking identifier.','BKG-88014'),apiField('transferId','body','string',true,'Source transfer identifier.','TRF-DEMO-1042'),apiField('bookingDate','body','date',true,'Date of the booking.','2026-10-13'),apiField('lines','body','array',true,'Money out and money in.',`[{"iban":"${IBAN_FROM}","out":252.50,"in":0}]`)], requestExample:'Path: transferId=TRF-DEMO-1042', responseExample:`{\n  "bookingId": "BKG-88014",\n  "transferId": "TRF-DEMO-1042",\n  "bookingDate": "2026-10-13",\n  "lines": [{"iban":"${IBAN_FROM}","out":252.50,"in":0}]\n}`
  }),
  endpoint('api-post-load', 'Start warehouse load', 'POST', '/jobs/reporting-loader/runs', 'job-reporting-loader', ['scheduler'], 'Start one load into the Reporting Warehouse.', {
    requestFields:[apiField('businessDate','body','date',true,'Date to load.','2026-10-13'),apiField('mode','body','string',true,'Load mode.','incremental','Allowed values: incremental, full.'),apiField('requestedBy','body','string',true,'Scheduler or operator identity.','daily-scheduler')], responseFields:[apiField('runId','body','string',true,'Load run identifier.','LOAD-20261013-01'),apiField('status','body','string',true,'Initial run state.','queued'),apiField('queuedAt','body','date-time',true,'Time the run entered the queue.','2026-10-13T06:00:02Z')], requestExample:'{\n  "businessDate": "2026-10-13",\n  "mode": "incremental",\n  "requestedBy": "daily-scheduler"\n}', responseExample:'{\n  "runId": "LOAD-20261013-01",\n  "status": "queued",\n  "queuedAt": "2026-10-13T06:00:02Z"\n}', idempotency:'One active run for each businessDate and mode.'
  }),
  endpoint('api-get-load', 'Get load status', 'GET', '/jobs/reporting-loader/runs/{id}', 'job-reporting-loader', ['svc-payments-report'], 'Return the state of one warehouse load.', {
    requestFields:[apiField('id','path','string',true,'Load run identifier.','LOAD-20261013-01')], responseFields:[apiField('runId','body','string',true,'Load run identifier.','LOAD-20261013-01'),apiField('status','body','string',true,'Current run state.','failed','Allowed values: queued, running, completed, failed.'),apiField('rowsLoaded','body','integer',true,'Number of rows written.','0'),apiField('startedAt','body','date-time',false,'Time processing started.','2026-10-13T06:00:04Z'),apiField('completedAt','body','date-time',false,'Time processing ended.','2026-10-13T06:44:00Z'),apiField('errorCode','body','string',false,'Stable failure code.','WAREHOUSE_CONNECTION_TIMEOUT')], requestExample:'Path: id=LOAD-20261013-01', responseExample:'{\n  "runId": "LOAD-20261013-01",\n  "status": "failed",\n  "rowsLoaded": 0,\n  "startedAt": "2026-10-13T06:00:04Z",\n  "completedAt": "2026-10-13T06:44:00Z",\n  "errorCode": "WAREHOUSE_CONNECTION_TIMEOUT"\n}'
  }),
  endpoint('api-get-report', 'Get daily payments report', 'GET', '/reports/daily-payments/{date}', 'svc-payments-report', ['regulator-portal'], 'Return the payments report for one date.', {
    requestFields:[apiField('date','path','date',true,'Report date.','2026-10-13'),apiField('currency','query','string',false,'Limit the report to one currency.','EUR')], responseFields:[apiField('reportDate','body','date',true,'Report date.','2026-10-13'),apiField('transferCount','body','integer',true,'Number of completed transfers.','18452'),apiField('totals','body','array',true,'Total amount for each currency.','[{"currency":"EUR","count":4210,"total":1287340.50}]')], requestExample:'Path: date=2026-10-13\nQuery: currency=EUR', responseExample:'{\n  "reportDate": "2026-10-13",\n  "transferCount": 18452,\n  "totals": [{"currency":"EUR","count":4210,"total":1287340.50}]\n}'
  }),
  endpoint('api-post-report', 'Generate report', 'POST', '/reports/daily-payments/runs', 'svc-payments-report', ['scheduler'], 'Start one daily payments report run.', {
    requestFields:[apiField('reportDate','body','date',true,'Date to report.','2026-10-13'),apiField('format','body','string',true,'Output format.','XML','Allowed values: XML, CSV.'),apiField('requestedBy','body','string',true,'Scheduler or operator identity.','daily-scheduler')], responseFields:[apiField('reportRunId','body','string',true,'Report run identifier.','RPT-20261013-01'),apiField('status','body','string',true,'Initial run state.','queued'),apiField('outputUri','body','string',false,'Location of the file after completion.','mock://reports/2026-10-13/daily-payments.xml')], requestExample:'{\n  "reportDate": "2026-10-13",\n  "format": "XML",\n  "requestedBy": "daily-scheduler"\n}', responseExample:'{\n  "reportRunId": "RPT-20261013-01",\n  "status": "queued"\n}', idempotency:'One report run for each reportDate and format.'
  }),
  endpoint('api-delete-subscription', 'Delete notification subscription', 'DELETE', '/notifications/subscriptions/{id}', 'svc-notification', [], 'Remove one notification subscription.', {
    requestFields:[apiField('id','path','string',true,'Subscription identifier.','SUB-2291')], responseFields:[], requestExample:'Path: id=SUB-2291', responseExample:'204 No Content', idempotency:'Idempotent. Deleting a removed subscription returns 204.'
  }),
  endpoint('api-post-notification', 'Send notification', 'POST', '/notifications', 'svc-notification', ['svc-payments-report', 'svc-transfer-intake'], 'Send one message to a customer or an operator.', {
    requestFields:[apiField('recipient','body','string',true,'Phone number, email address or system identifier.','+47 400 00 000'),apiField('template','body','string',true,'Message template identifier.','payment-sent'),apiField('subjectId','body','string',true,'Transfer or report identifier.','TRF-DEMO-1042'),apiField('variables','body','object',false,'Values for the message template.','{"amount":"250.00 EUR"}')], responseFields:[apiField('notificationId','body','string',true,'Notification identifier.','NTF-44102'),apiField('status','body','string',true,'Delivery state.','queued')], requestExample:'{\n  "recipient": "+47 400 00 000",\n  "template": "payment-sent",\n  "subjectId": "TRF-DEMO-1042",\n  "variables": {"amount":"250.00 EUR"}\n}', responseExample:'{\n  "notificationId": "NTF-44102",\n  "status": "queued"\n}', idempotency:'Not guaranteed. The caller must prevent duplicate messages.'
  }),
]

const databaseRows = [
  ['db-payments', 'Payments DB', 'Transfers, transfer history and check results', 'team-payments'],
  ['db-accounts', 'Accounts DB', 'Accounts, fee rules and exchange rates', 'team-accounts'],
  ['db-bookings', 'Bookings DB', 'Money taken out of and added to accounts', 'team-accounts'],
  ['db-warehouse', 'Reporting Warehouse', 'Completed transfers organised for daily reporting', 'team-reporting'],
] as const

export const databases: Entity[] = databaseRows.map(([id, name, description, ownerTeamId]) => ({ id, type: 'database', name, slug: id, description, ownerTeamId, tags: ['database'], sourceReferences: ['src-db'], harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', pageUrl: `/data/databases/${id}` }))

const columnDefinitions:Record<string,Omit<DataTable['columns'][number],'name'>> = {
  transfer_id:{dataType:'varchar(40)',nullable:false,key:'Primary key',description:'Identifies one transfer.',example:'TRF-DEMO-1042'},
  version:{dataType:'integer',nullable:false,description:'Increases when the transfer changes.',example:'4'},
  amount:{dataType:'numeric(20,2)',nullable:false,description:'Amount sent, in the transfer currency.',example:'250.00'},
  status:{dataType:'varchar(20)',nullable:false,description:'Current state.',example:'booked'},
  event_id:{dataType:'uuid',nullable:false,key:'Primary key',description:'Identifies one processing event.',example:'7a938d8e-9d35-4cf1-93d7-77aa4c7151a1'},
  event_type:{dataType:'varchar(40)',nullable:false,description:'Recorded state change.',example:'TRANSFER_ACCEPTED'},
  occurred_at:{dataType:'timestamp with time zone',nullable:false,description:'Time of the event.',example:'2026-10-13T06:18:42Z'},
  code:{dataType:'varchar(40)',nullable:false,description:'Stable check code.',example:'UNKNOWN_ACCOUNT'},
  field:{dataType:'varchar(80)',nullable:true,description:'Input field that failed the check.',example:'toAccount'},
  message:{dataType:'varchar(500)',nullable:false,description:'Check result text.',example:'The receiver account does not exist.'},
  legacy_code:{dataType:'varchar(20)',nullable:false,description:'Code used by the retired check service.',example:'E142'},
  created_at:{dataType:'timestamp with time zone',nullable:false,description:'Time the row was created.',example:'2025-04-18T09:24:12Z'},
  iban:{dataType:'varchar(34)',nullable:false,key:'Primary key',description:'Account number (IBAN).',example:IBAN_TO},
  currency:{dataType:'char(3)',nullable:false,description:'ISO 4217 currency code.',example:'EUR'},
  transfer_type:{dataType:'varchar(20)',nullable:false,key:'Primary key',description:'Type of transfer.',example:'INTERNATIONAL'},
  fee:{dataType:'numeric(10,2)',nullable:false,description:'Fee charged to the sender.',example:'2.50'},
  valid_from:{dataType:'date',nullable:false,description:'First date the row applies.',example:'2026-01-01'},
  currency_pair:{dataType:'char(7)',nullable:false,key:'Primary key',description:'First and second currency.',example:'EUR/NOK'},
  rate:{dataType:'numeric(18,8)',nullable:false,description:'Units of the second currency for one unit of the first.',example:'11.64200000'},
  effective_date:{dataType:'date',nullable:false,key:'Primary key',description:'Date the rate applies.',example:'2026-10-13'},
  booking_id:{dataType:'varchar(30)',nullable:false,key:'Primary key',description:'Identifies one booking.',example:'BKG-88014'},
  booking_date:{dataType:'date',nullable:false,description:'Date of the booking.',example:'2026-10-13'},
  amount_out:{dataType:'numeric(20,2)',nullable:false,description:'Money taken out of the account. Zero for money in.',example:'252.50'},
  amount_in:{dataType:'numeric(20,2)',nullable:false,description:'Money added to the account. Zero for money out.',example:'0.00'},
  transfer_key:{dataType:'bigint',nullable:false,key:'Primary key',description:'Warehouse key for one completed transfer.',example:'8800142'},
  account_key:{dataType:'bigint',nullable:false,key:'Foreign key',description:'Links the row to dim_account.',example:'42018'},
  amount_eur:{dataType:'numeric(20,2)',nullable:false,description:'Transfer amount in EUR.',example:'250.00'},
  report_date:{dataType:'date',nullable:false,key:'Primary key',description:'Date of the daily report.',example:'2026-10-13'},
  currency_code:{dataType:'char(3)',nullable:false,key:'Foreign key',description:'Links the row to dim_currency.',example:'EUR'},
  total_amount:{dataType:'numeric(20,2)',nullable:false,description:'Sum of completed transfers for the date and currency.',example:'1287340.50'},
  valid_from_ts:{dataType:'timestamp with time zone',nullable:false,description:'Time from which the row is valid.',example:'2026-01-01T00:00:00Z'},
  currency_name:{dataType:'varchar(40)',nullable:false,description:'Currency name.',example:'Euro'},
  minor_units:{dataType:'smallint',nullable:false,description:'Number of decimals.',example:'2'},
  run_id:{dataType:'varchar(40)',nullable:false,key:'Primary key',description:'Identifies one warehouse load.',example:'LOAD-20261013-01'},
  row_count:{dataType:'bigint',nullable:false,description:'Number of rows written.',example:'14862'},
  completed_at:{dataType:'timestamp with time zone',nullable:true,description:'Completion time. Null while the load runs.',example:'2026-10-13T06:31:18Z'},
}
const tableMeta:Record<string,Pick<DataTable,'grain'|'updatePattern'|'retention'|'relationships'>> = {
  'tbl-transfer':{grain:'One row for the current version of each transfer.',updatePattern:'Insert on acceptance. Update on change or state change.',retention:'10 years.',relationships:[]},
  'tbl-transfer-event':{grain:'One row for each transfer state change.',updatePattern:'Append only.',retention:'10 years.',relationships:[{column:'transfer_id',targetTableId:'tbl-transfer',targetColumn:'transfer_id',cardinality:'Many events to one transfer',description:'Each event belongs to one transfer.'}]},
  'tbl-check-result':{grain:'One row for each failed check.',updatePattern:'Replaced when the checks run again.',retention:'90 days after resolution.',relationships:[{column:'transfer_id',targetTableId:'tbl-transfer',targetColumn:'transfer_id',cardinality:'Many check results to one transfer',description:'Each check result belongs to one transfer.'}]},
  'tbl-check-result-legacy':{grain:'One row for each archived check result.',updatePattern:'Read-only archive.',retention:'Until the archive owner approves removal.',relationships:[{column:'transfer_id',targetTableId:'tbl-transfer',targetColumn:'transfer_id',cardinality:'Many archived results to one transfer',description:'Logical link only. No database constraint.'}]},
  'tbl-account':{grain:'One row for each account.',updatePattern:'Update when the account changes.',retention:'Current row plus 10 years of history.',relationships:[]},
  'tbl-fee-rule':{grain:'One row for each transfer type and start date.',updatePattern:'Insert when a fee changes.',retention:'10 years.',relationships:[]},
  'tbl-exchange-rate':{grain:'One row for each currency pair and date.',updatePattern:'Insert once each business day.',retention:'10 years.',relationships:[]},
  'tbl-booking':{grain:'One row for each booking.',updatePattern:'Insert when Account Booking accepts a booking.',retention:'10 years.',relationships:[]},
  'tbl-booking-line':{grain:'One row for each money-out or money-in line.',updatePattern:'Insert with its booking. Never updated.',retention:'10 years.',relationships:[{column:'booking_id',targetTableId:'tbl-booking',targetColumn:'booking_id',cardinality:'Many lines to one booking',description:'Each line belongs to one booking.'}]},
  'tbl-fact-transfer':{grain:'One row for each completed transfer.',updatePattern:'Load during the nightly warehouse run.',retention:'10 years.',relationships:[{column:'account_key',targetTableId:'tbl-dim-account',targetColumn:'account_key',cardinality:'Many transfers to one account',description:'The key identifies the reporting version of the sender account.'}]},
  'tbl-fact-daily-total':{grain:'One row for each report date and currency.',updatePattern:'Rebuilt during the nightly warehouse run.',retention:'10 years.',relationships:[{column:'currency_code',targetTableId:'tbl-dim-currency',targetColumn:'currency',cardinality:'Many daily totals to one currency',description:'Each total belongs to one currency.'}]},
  'tbl-dim-account':{grain:'One row for each reporting version of an account.',updatePattern:'Insert a new row when the account changes.',retention:'10 years after the last valid date.',relationships:[]},
  'tbl-dim-currency':{grain:'One row for each currency.',updatePattern:'Update when a currency is added.',retention:'Kept while referenced.',relationships:[]},
  'tbl-load-audit':{grain:'One row for each warehouse load.',updatePattern:'Insert at start. Update at completion or failure.',retention:'2 years.',relationships:[]},
}
const table = (id: string, name: string, databaseId: string, purpose: string, ownerTeamId: string, readers: string[], writers: string[], columnNames: string[], classification = 'Confidential customer data'): DataTable => ({
  id, type: 'table', name, slug: id, databaseId, description: purpose, ownerTeamId, readers, writers, columns:columnNames.map(name=>({name,...columnDefinitions[name]})), classification, ...tableMeta[id],
  lineage: writers.length ? `Written by ${writers.map(x => services.find(s => s.id === x)?.name ?? x).join(', ')}` : 'No writing deployment found',
  tags: ['table', databaseId], sourceReferences: ['src-db'], harvestedAt: '2026-10-13T06:00:00Z', expectedRefreshInterval: '6 hours', pageUrl: `/data/tables/${id}`,
})

export const tables: DataTable[] = [
  table('tbl-transfer', 'transfer', 'db-payments', 'Current state of each accepted transfer', 'team-payments', ['svc-fees-currency'], ['svc-transfer-intake'], ['transfer_id', 'version', 'amount', 'status']),
  table('tbl-transfer-event', 'transfer_event', 'db-payments', 'Permanent record of each transfer state change', 'team-payments', ['svc-transfer-checks', 'svc-fees-currency'], ['svc-transfer-intake'], ['event_id', 'transfer_id', 'event_type', 'occurred_at']),
  table('tbl-check-result', 'check_result', 'db-payments', 'Failed checks for each transfer', 'team-payments', ['svc-transfer-intake'], ['svc-transfer-checks'], ['transfer_id', 'code', 'field', 'message']),
  table('tbl-check-result-legacy', 'check_result_legacy', 'db-payments', 'Check results from the retired check service', 'team-payments', [], [], ['transfer_id', 'legacy_code', 'created_at']),
  table('tbl-account', 'account', 'db-accounts', 'Status and currency of each account', 'team-accounts', ['svc-account-directory'], ['svc-account-directory'], ['iban', 'currency', 'status']),
  table('tbl-fee-rule', 'fee_rule', 'db-accounts', 'Fee for each type of transfer', 'team-accounts', ['svc-account-directory'], ['svc-account-directory'], ['transfer_type', 'fee', 'valid_from']),
  table('tbl-exchange-rate', 'exchange_rate', 'db-accounts', 'Daily exchange rate for each currency pair', 'team-accounts', ['svc-account-directory'], ['svc-account-directory'], ['currency_pair', 'rate', 'effective_date'], 'Internal business data'),
  table('tbl-booking', 'booking', 'db-bookings', 'One booking for each completed transfer', 'team-accounts', ['job-reporting-loader'], ['svc-account-booking'], ['booking_id', 'transfer_id', 'booking_date']),
  table('tbl-booking-line', 'booking_line', 'db-bookings', 'Money out and money in for each booking', 'team-accounts', ['job-reporting-loader'], ['svc-account-booking'], ['booking_id', 'iban', 'amount_out', 'amount_in']),
  table('tbl-fact-transfer', 'fact_transfer', 'db-warehouse', 'Completed transfers in reporting format', 'team-reporting', ['svc-payments-report'], ['job-reporting-loader'], ['transfer_key', 'account_key', 'amount_eur']),
  table('tbl-fact-daily-total', 'fact_daily_total', 'db-warehouse', 'Total of completed transfers for each date and currency', 'team-reporting', ['svc-payments-report'], ['job-reporting-loader'], ['report_date', 'currency_code', 'total_amount']),
  table('tbl-dim-account', 'dim_account', 'db-warehouse', 'Reporting versions of each account', 'team-reporting', ['svc-payments-report'], ['job-reporting-loader'], ['account_key', 'iban', 'valid_from_ts']),
  table('tbl-dim-currency', 'dim_currency', 'db-warehouse', 'Currencies used in reports', 'team-reporting', ['svc-payments-report'], ['job-reporting-loader'], ['currency', 'currency_name', 'minor_units'], 'Internal business data'),
  table('tbl-load-audit', 'load_audit', 'db-warehouse', 'Result and row count of each warehouse load', 'team-reporting', ['svc-payments-report'], ['job-reporting-loader'], ['run_id', 'row_count', 'status', 'completed_at'], 'Internal operational data'),
]

export const configurationEntities: Entity[] = [
  ['cfg-cutoff','reporting.cutoff-time','Latest time for the daily report'], ['cfg-batch','reporting.batch-size','Rows per warehouse write'], ['cfg-rate-source','account-directory.rate-source','Exchange rate provider'],
  ['cfg-name-match','transfer-checks.strict-name-match','Receiver name must match the account'], ['cfg-retry','loader.retry-count','Warehouse load retries'], ['cfg-schema','loader.warehouse-schema','Target warehouse schema'],
  ['cfg-notify','notifications.enabled','Send customer messages'], ['cfg-booking','booking.mode','Booking mode'], ['cfg-retention','transfer-event.retention-days','Transfer event retention'], ['cfg-report-format','reporting.output-format','Daily report file format'],
].map(([id, name, description]) => ({ id, type: 'configuration' as const, name, slug: id, description, ownerTeamId: name.startsWith('reporting') || name.startsWith('loader') ? 'team-reporting' : 'team-platform', tags: ['configuration'], sourceReferences: ['src-deploy'], harvestedAt: '2026-10-13T07:55:00Z', expectedRefreshInterval: '15 minutes', pageUrl: `/impact/${id}` }))

export const toggleEntities: Entity[] = [
  ['toggle-new-fee-rules','new-fee-rules','Fee rules for 2027'], ['toggle-legacy-fee-rules','legacy-fee-rules','Fee rules before 2025'], ['toggle-test-rates','test-exchange-rates','Fixed exchange rates for tests'], ['toggle-strict-name-match','strict-name-match','Reject transfers when the receiver name does not match'], ['toggle-report-v2','daily-report-v2','New daily report layout'], ['toggle-instant-booking','instant-booking','Book transfers in real time'],
].map(([id, name, description]) => ({ id, type: 'toggle' as const, name, slug: id, description, ownerTeamId: name.includes('report') ? 'team-reporting' : 'team-payments', tags: ['feature-toggle'], sourceReferences: ['src-deploy'], harvestedAt: '2026-10-13T07:55:00Z', expectedRefreshInterval: '15 minutes', pageUrl: `/impact/${id}` }))

const currentVersions: Record<string, Record<string, string>> = {
  'svc-transfer-intake': { development:'3.7.3-dev', test:'3.7.2', uat:'3.7.2', preproduction:'3.7.2', production:'3.7.2' },
  'svc-transfer-checks': { development:'4.3.0-rc1', test:'4.3.0-rc1', uat:'4.3.0-rc1', preproduction:'4.2.0', production:'4.2.0' },
  'svc-account-directory': { development:'5.1.0', test:'5.1.0', uat:'5.1.0', preproduction:'5.1.0', production:'5.1.0' },
  'svc-fees-currency': { development:'2.9.0', test:'2.9.0', uat:'2.9.0', preproduction:'2.9.0', production:'2.8.4' },
  'svc-account-booking': { development:'6.4.1', test:'6.4.1', uat:'6.4.1', preproduction:'6.4.1', production:'6.4.1' },
  'job-reporting-loader': { development:'2.4.1', test:'2.4.1', uat:'2.4.1', preproduction:'2.4.1', production:'2.3.8' },
  'svc-payments-report': { development:'3.2.0-rc2', test:'3.2.0-rc2', uat:'3.2.0-rc2', preproduction:'3.2.0-rc2', production:'3.1.5' },
  'svc-notification': { development:'1.9.0', test:'1.9.0', uat:'1.9.0', preproduction:'1.9.0', production:'1.9.0' },
}

const configFor = (environmentId: string) => ({
  'reporting.cutoff-time': environmentId === 'production' ? '05:30 UTC' : '06:00 UTC',
  'reporting.batch-size': environmentId === 'production' ? '5000' : environmentId === 'uat' ? '2000' : '1000',
  'account-directory.rate-source': ['test','uat'].includes(environmentId) ? 'test-rates' : 'live-rates',
  'transfer-checks.strict-name-match': ['uat','preproduction','production'].includes(environmentId) ? 'true' : 'false',
  'loader.retry-count': environmentId === 'production' ? '5' : '3',
  'loader.warehouse-schema': 'regulatory',
  'notifications.enabled': environmentId === 'development' ? 'false' : 'true',
  'booking.mode': ['preproduction','production'].includes(environmentId) ? 'live' : 'simulation',
})
const togglesFor = (environmentId: string) => ({
  'new-fee-rules': environmentId === 'uat',
  'legacy-fee-rules': ['development','test','uat'].includes(environmentId),
  'test-exchange-rates': ['test','uat'].includes(environmentId),
  'strict-name-match': ['uat','preproduction','production'].includes(environmentId),
  'daily-report-v2': ['uat','preproduction'].includes(environmentId),
  'instant-booking': environmentId === 'development',
})

export const deployments: Deployment[] = []
for (const [si, service] of services.entries()) {
  for (const [ei, env] of environments.entries()) {
    const version = currentVersions[service.id][env.id]
    const previousVersion=service.id === 'job-reporting-loader' && env.id === 'uat' ? '2.3.8' : version
    const beforeVersion=service.id === 'svc-fees-currency' ? '2.8.4' : service.id === 'job-reporting-loader' ? '2.3.8' : service.id === 'svc-payments-report' ? '3.1.5' : version
    deployments.push({ id: `dep-${service.id}-${env.id}-current`, serviceId: service.id, environmentId: env.id, snapshotId: 'current', version, commit: commitFor(version,commits[si]), deployedAt: `2026-10-${String(7 + ei).padStart(2,'0')}T${String(9 + si).padStart(2,'0')}:00:00Z`, configuration: configFor(env.id), featureToggles: togglesFor(env.id), sourceReferences: ['src-deploy'] })
    deployments.push({ id: `dep-${service.id}-${env.id}-previous-day`, serviceId: service.id, environmentId: env.id, snapshotId: 'previous-day', version: previousVersion, commit: commitFor(previousVersion,commits[si]), deployedAt: '2026-10-11T10:00:00Z', configuration: configFor(env.id), featureToggles: { ...togglesFor(env.id), 'new-fee-rules': false }, sourceReferences: ['src-deploy'] })
    deployments.push({ id: `dep-${service.id}-${env.id}-before-rc`, serviceId: service.id, environmentId: env.id, snapshotId: 'before-rc', version: beforeVersion, commit: commitFor(beforeVersion,commits[si]), deployedAt: '2026-10-05T10:00:00Z', configuration: configFor(env.id), featureToggles: { ...togglesFor(env.id), 'new-fee-rules': false, 'daily-report-v2': false }, sourceReferences: ['src-deploy'] })
  }
}
deployments.push({ id: 'dep-svc-notification-preproduction-retired', serviceId: 'svc-notification', environmentId: 'preproduction', snapshotId: 'current', version: '1.8.2', commit: '7ab39d0', deployedAt: '2026-07-18T09:20:00Z', configuration: configFor('preproduction'), featureToggles: togglesFor('preproduction'), sourceReferences: ['src-deploy'], retired: true })

const centralSteps = [
  ['Send 250.00 EUR to a Norwegian account','The transfer is accepted','svc-transfer-intake','POST /transfers',['tbl-transfer','tbl-transfer-event']],
  ['Check limits and fraud rules','The transfer is approved','svc-transfer-checks','POST /checks/transfers',['tbl-check-result']],
  ['Add the fee and convert the currency','Fee 2.50 EUR and the rate of the day are applied','svc-fees-currency','GET /accounts, /fees, /rates',['tbl-account','tbl-fee-rule','tbl-exchange-rate']],
  ['Book money out and money in','Money out equals money in plus the fee','svc-account-booking','POST /bookings',['tbl-booking','tbl-booking-line']],
  ['Load the Reporting Warehouse','The transfer is stored in the warehouse','job-reporting-loader','Warehouse load',['tbl-fact-transfer','tbl-fact-daily-total']],
  ['Check that the daily payments report contains the transfer','The transfer is counted in the EUR total','svc-payments-report','GET /reports/daily-payments/{date}',['tbl-fact-daily-total']],
] as const

const requirementSpecs = [
  ['req-valid-transfer','A valid transfer is accepted','Transfer intake'], ['req-unknown-account','A transfer to an account that does not exist is rejected','Transfer checks'],
  ['req-no-double-send','Pressing Send twice does not send the money twice','Transfer intake'], ['req-exchange-rate','A transfer in another currency uses the exchange rate of that day','Fees and currency'],
  ['req-balanced-booking','Money taken from the sender equals money added to the receiver','Booking'], ['req-daily-report','Every completed transfer appears in the daily report to the regulator','Regulatory reporting'],
  ['req-cutoff','The daily report is available before 06:00 UTC','Regulatory reporting'], ['req-cancellation','A cancelled transfer is removed from the next report','Regulatory reporting'],
  ['req-network','Only approved network paths can reach the Reporting Warehouse','Platform controls'], ['req-live-rates','Production uses live exchange rates, not test rates','Platform controls'],
] as const

const requirementDetails:Record<string,{acceptanceCriteria:string[];businessRisk:string}> = {
  'req-valid-transfer':{acceptanceCriteria:['The transfer is stored once.','The response contains an event identifier.'],businessRisk:'A lost transfer means the customer\'s money does not arrive.'},
  'req-unknown-account':{acceptanceCriteria:['A transfer to an unknown account is rejected.','The result names the field and the failed check.'],businessRisk:'Money sent to a wrong account can be lost.'},
  'req-no-double-send':{acceptanceCriteria:['A repeated transferId does not create a second transfer.','The response returns the stored transfer.'],businessRisk:'The customer pays twice.'},
  'req-exchange-rate':{acceptanceCriteria:['The rate for the transfer date is used.','The booking records the rate source.'],businessRisk:'A wrong rate sends the wrong amount.'},
  'req-balanced-booking':{acceptanceCriteria:['Total money out equals total money in.','The booking links to the transfer.'],businessRisk:'Money is created or lost in the bank\'s accounts.'},
  'req-daily-report':{acceptanceCriteria:['A completed transfer appears in the report for its date.','The amount is counted in the total for its currency.','The report row links to the source transfer.'],businessRisk:'An incomplete report to the regulator is a compliance breach.'},
  'req-cutoff':{acceptanceCriteria:['The report is available before 06:00 UTC.','The completion time is recorded.'],businessRisk:'A late report misses the regulator\'s deadline.'},
  'req-cancellation':{acceptanceCriteria:['The next report does not count a cancelled transfer.','The cancellation links to the original transfer.'],businessRisk:'The report shows money that was never sent.'},
  'req-network':{acceptanceCriteria:['Only listed source and destination pairs can connect.','Each rule names the environment, protocol and port.'],businessRisk:'An open path can expose customer data.'},
  'req-live-rates':{acceptanceCriteria:['Production uses the live rate provider.','No production setting names test rates.'],businessRisk:'Customers are charged with test exchange rates.'},
}

const simpleComponents = ['svc-transfer-intake','svc-transfer-checks','svc-fees-currency','svc-account-booking','job-reporting-loader','svc-payments-report','svc-notification']
export const requirements: Requirement[] = requirementSpecs.map(([id,title,capability], index) => {
  const makeSteps = (offset: number) => index === 5 && offset === 0 ? centralSteps.map(([stepTitle,expected,componentId,operation,dataIds]) => ({ title: stepTitle, expected, componentId, operation, dataIds: [...dataIds] })) : [
    { title: offset === 0 ? title : offset === 1 ? 'Run with a different amount or time' : 'Run with an unavailable dependency', expected: offset === 2 ? 'The transfer is rejected with a recorded reason' : 'The expected result is recorded', componentId: simpleComponents[(index + offset) % simpleComponents.length], operation: 'Test step', dataIds: [tables[(index + offset) % tables.length].id] },
  ]
  return { id, title, capability, narrative: `${title}.`, ...requirementDetails[id], preconditions: ['Deployment inventory exists for the environment.','Test accounts only.'], ownerTeamId: index === 4 ? 'team-accounts' : index < 4 ? 'team-payments' : index < 8 ? 'team-reporting' : 'team-platform', sourceReferences: ['src-tests','src-curated'], scenarios: [
    { id: `${id}-main`, title: 'Main path', kind: 'main', steps: makeSteps(0) },
    { id: `${id}-alternate`, title: 'Other amount or time', kind: 'alternate', steps: makeSteps(1) },
    { id: `${id}-failure`, title: 'Dependency unavailable', kind: 'failure', steps: makeSteps(2) },
  ] }
})

const versionContext = (env: string) => Object.fromEntries(deployments.filter(d => d.environmentId === env && d.snapshotId === 'current' && !d.retired).map(d => [d.serviceId,d.version]))
const ms = (duration: string) => Math.round(parseFloat(duration) * 1000)
const clock = (at: number) => new Date(at).toISOString().slice(11, 23)
const serviceName = (id: string) => services.find(s => s.id === id)?.name ?? id
// Log lines as the test runner would write them; the failing step carries the loader's own output.
type LogStep = { title: string; status: TestExecution['steps'][number]['status']; componentId: string; operation: string; expected: string }
const stepLog = (runId: string, env: string, startAt: number, index: number, total: number, step: LogStep & { durationMs: number }) => {
  const t = (offset: number) => clock(startAt + offset)
  const head = `${t(0)} INFO  [${runId}] step ${index + 1}/${total} start: ${step.title}`
  if (step.status === 'not-executed') return [`${t(5)} WARN  [${runId}] step ${index + 1}/${total} skipped: an earlier step failed`]
  if (step.status === 'failed') return [head,
    `${t(14)} INFO  ${serviceName(step.componentId)}: POST /jobs/reporting-loader/runs {"businessDate":"2026-10-13","mode":"incremental"}`,
    `${t(262)} INFO  ${serviceName(step.componentId)}: run LOAD-20261013-01 queued`,
    `${t(301)} INFO  ${serviceName(step.componentId)}: connecting to reporting-warehouse.${env}.northstar.internal:5432`,
    `${t(step.durationMs)} ERROR ${serviceName(step.componentId)}: WAREHOUSE_CONNECTION_TIMEOUT after 30000 ms`,
    `${t(step.durationMs + 1)} INFO  ${serviceName(step.componentId)}: rows written: 0`,
    `${t(step.durationMs + 2)} ERROR [${runId}] step ${index + 1}/${total} failed. Expected: ${step.expected}`]
  return [head,
    `${t(9)} INFO  ${serviceName(step.componentId)}: ${step.operation}`,
    `${t(step.durationMs - 3)} INFO  [${runId}] check: ${step.expected}`,
    `${t(step.durationMs)} INFO  [${runId}] step ${index + 1}/${total} passed (${(step.durationMs / 1000).toFixed(1)} s)`]
}
const runLog = (runId: string, env: string, endAt: string, steps: Array<LogStep & { duration?: string }>) => {
  const durations = steps.map(x => x.duration ? ms(x.duration) : 0)
  let at = Date.parse(endAt) - durations.reduce((a, b) => a + b, 0)
  return steps.map((step, index) => { const log = stepLog(runId, env, at, index, steps.length, { ...step, durationMs: durations[index] }); at += durations[index]; return log })
}
const execSteps = (status: 'passed'|'failed', runId: string, env: string, executedAt: string) => {
  const steps = centralSteps.map(([title,expected,componentId,operation], index) => ({ title, expected, operation, componentId, status: status === 'failed' && index === 4 ? 'failed' as const : index > 4 && status === 'failed' ? 'not-executed' as const : 'passed' as const, actual: status === 'failed' && index === 4 ? 'WAREHOUSE_CONNECTION_TIMEOUT after 30 s. 0 rows written.' : index > 4 && status === 'failed' ? 'Not run. An earlier step failed.' : 'As expected.', evidenceReferenceId: 'src-tests', duration:index > 4 && status==='failed'?undefined:['0.8 s','1.4 s','2.1 s','0.9 s',status==='failed'?'30.0 s':'18.7 s','1.2 s'][index] }))
  const logs = runLog(runId, env, executedAt, steps)
  return steps.map(({ title, status, actual, componentId, evidenceReferenceId, duration }, index) => ({ title, status, actual, componentId, evidenceReferenceId, duration, log: logs[index] }))
}
export const executions: TestExecution[] = [
  { id:'exec-daily-report-uat-current', requirementId:'req-daily-report', scenarioId:'req-daily-report-main', environmentId:'uat', snapshotId:'current', status:'failed', executedAt:'2026-10-13T06:44:00Z', runId:'AT-18427', duration:'35.2 s', trigger:'Release candidate acceptance suite', testData:{dataset:'northstar-uat-2026-10-13','transfer ID':'TRF-DEMO-1042','business date':'2026-10-13'}, serviceVersions:versionContext('uat'), steps:execSteps('failed','AT-18427','uat','2026-10-13T06:44:00Z'), evidenceReferences:['src-tests','src-network','src-deploy'] },
  { id:'exec-daily-report-prod-current', requirementId:'req-daily-report', scenarioId:'req-daily-report-main', environmentId:'production', snapshotId:'current', status:'passed', executedAt:'2026-10-13T05:12:00Z', runId:'SMOKE-7712', duration:'25.1 s', trigger:'Daily production check', testData:{dataset:'northstar-production-smoke','transfer ID':'TRF-SMOKE-7712','business date':'2026-10-13'}, serviceVersions:versionContext('production'), steps:execSteps('passed','SMOKE-7712','production','2026-10-13T05:12:00Z'), evidenceReferences:['src-tests','src-network','src-deploy'] },
  { id:'exec-daily-report-uat-previous', requirementId:'req-daily-report', scenarioId:'req-daily-report-main', environmentId:'uat', snapshotId:'previous-day', status:'passed', executedAt:'2026-10-12T06:38:00Z', runId:'AT-18391', duration:'24.7 s', trigger:'Release candidate acceptance suite', testData:{dataset:'northstar-uat-2026-10-12','transfer ID':'TRF-DEMO-1018','business date':'2026-10-12'}, serviceVersions:{...versionContext('uat'),'job-reporting-loader':'2.3.8'}, steps:execSteps('passed','AT-18391','uat','2026-10-12T06:38:00Z'), evidenceReferences:['src-tests','src-deploy'] },
  { id:'exec-daily-report-uat-before', requirementId:'req-daily-report', scenarioId:'req-daily-report-main', environmentId:'uat', snapshotId:'before-rc', status:'passed', executedAt:'2026-10-06T06:35:00Z', runId:'AT-18142', duration:'26.0 s', trigger:'Baseline acceptance suite', testData:{dataset:'northstar-uat-2026-10-06','transfer ID':'TRF-DEMO-0981','business date':'2026-10-06'}, serviceVersions:{...versionContext('production')}, steps:execSteps('passed','AT-18142','uat','2026-10-06T06:35:00Z'), evidenceReferences:['src-tests','src-deploy'] },
  ...requirements.filter(r => r.id !== 'req-daily-report').flatMap((r,index) => ['uat','production'].map((env,ei) => ({ id:`exec-${r.id}-${env}-current`, requirementId:r.id, scenarioId:`${r.id}-main`, environmentId:env, snapshotId:'current', status:(r.id === 'req-cutoff' && env === 'uat' ? 'stale' : 'passed') as TestExecution['status'], executedAt:`2026-10-${String(10 + (index % 3)).padStart(2,'0')}T0${5+ei}:20:00Z`, runId:`AT-${18000+index*10+ei}`, duration:`${8+index}.4 s`, trigger:'Acceptance suite', testData:{dataset:`northstar-${env}-current`,case:`${r.id}-main`}, serviceVersions:versionContext(env), steps:[{ title:r.scenarios[0].steps[0].title, status:'passed' as const, actual:'As expected.', componentId:r.scenarios[0].steps[0].componentId, evidenceReferenceId:'src-tests',duration:`${4+index}.2 s`, log:runLog(`AT-${18000+index*10+ei}`, env, `2026-10-${String(10 + (index % 3)).padStart(2,'0')}T0${5+ei}:20:00Z`, [{ ...r.scenarios[0].steps[0], status:'passed', duration:`${4+index}.2 s` }])[0] }], evidenceReferences:['src-tests','src-deploy'] }))),
]

const rel = (id: string, type: Relationship['type'], fromEntityId: string, toEntityId: string, description: string, evidenceKind: Relationship['evidenceKind'] = 'harvested', environmentId?: string): Relationship => ({ id,type,fromEntityId,toEntityId,description,evidenceKind,environmentId,sourceReferences:[type === 'ALLOWED_TO_CONNECT' ? 'src-network' : type === 'PROVIDES' ? 'src-openapi' : 'src-deploy'],harvestedAt:'2026-10-13T07:50:00Z' })
const callPairs = [
  ['svc-transfer-intake','svc-transfer-checks'],['svc-transfer-intake','svc-notification'],['svc-fees-currency','svc-account-directory'],['svc-fees-currency','svc-account-booking'],['job-reporting-loader','svc-account-booking'],['svc-payments-report','job-reporting-loader'],['svc-payments-report','svc-notification'],
] as const
export const relationships: Relationship[] = [
  ...callPairs.map((p,i)=>rel(`rel-call-${i}`,'CALLS',p[0],p[1],`${services.find(s=>s.id===p[0])!.name} calls ${services.find(s=>s.id===p[1])!.name}.`)),
  ...endpoints.map((e,i)=>rel(`rel-provides-${i}`,'PROVIDES',e.providerId,e.id,`${services.find(s=>s.id===e.providerId)!.name} provides ${e.method} ${e.path}.`)),
  ...services.map((s,i)=>rel(`rel-repo-${i}`,'IMPLEMENTED_BY',s.id,s.repositoryId,`${s.name} is built from ${repositories[i].name}.`)),
  ...tables.flatMap((t)=>[...t.readers.map((s,i)=>rel(`rel-read-${t.id}-${i}`,'READS_FROM',s,t.id,`${services.find(x=>x.id===s)!.name} reads ${t.name}.`)),...t.writers.map((s,i)=>rel(`rel-write-${t.id}-${i}`,'WRITES_TO',s,t.id,`${services.find(x=>x.id===s)!.name} writes ${t.name}.`))]),
].slice(0,58)

export const networkRules: NetworkRule[] = [
  ['net-uat-intake-checks','svc-transfer-intake','svc-transfer-checks',8443,'uat','current'], ['net-uat-fees-directory','svc-fees-currency','svc-account-directory',8443,'uat','current'],
  ['net-uat-fees-booking','svc-fees-currency','svc-account-booking',8443,'uat','current'], ['net-uat-loader-warehouse','job-reporting-loader','db-warehouse',5432,'uat','missing'],
  ['net-pre-loader-warehouse','job-reporting-loader','db-warehouse',5432,'preproduction','current'], ['net-prod-loader-warehouse','job-reporting-loader','db-warehouse',5432,'production','current'],
  ['net-prod-report-warehouse','svc-payments-report','db-warehouse',5432,'production','current'], ['net-pre-report-warehouse','svc-payments-report','db-warehouse',5432,'preproduction','current'],
  ['net-test-loader-warehouse','job-reporting-loader','db-warehouse',5432,'test','current'], ['net-prod-booking-db','svc-account-booking','db-bookings',5432,'production','current'],
  ['net-prod-intake-db','svc-transfer-intake','db-payments',5432,'production','current'], ['net-old-notify','svc-notification','retired-sms-gateway',2525,'preproduction','cleanup-candidate'],
].map(([id,sourceId,destinationId,port,environmentId,state])=>({ id:String(id),sourceId:String(sourceId),destinationId:String(destinationId),port:Number(port),protocol:'TCP',environmentId:String(environmentId),action:'allow' as const,ownerTeamId:'team-platform',sourceReferenceId:'src-network',harvestedAt:'2026-10-13T07:50:00Z',state:state as NetworkRule['state'] }))

export const findings: Finding[] = [
  { id:'finding-loader-drift',type:'deployment-drift',severity:'attention',title:'Reporting Data Loader',summary:'UAT 2.4.1 · Production 2.3.8',affectedEntityIds:['job-reporting-loader'],applicableRoles:['developer','tester','operations'],environmentId:'uat',detectionRule:'Deployed versions differ between environments.',supportingFacts:['UAT deployment manifest: 2.4.1.','Production deployment manifest: 2.3.8.'],correlatedChanges:['The UAT daily report test last passed on 2.3.8.'],counterEvidence:['2.4.1 runs in Pre-production.'],unknowns:['Whether the version change caused the failure.'],recommendedInspection:'Compare the loader release notes with the failed test step.',sourceReferences:['src-deploy','src-tests'],freshness:'current',actionUrl:'/compare?left=uat&right=production' },
  { id:'finding-uat-failure',type:'execution-failure',severity:'failure',title:'Every completed transfer appears in the daily report to the regulator',summary:'UAT · Run AT-18427 · Failed at step 5 of 6: Load the Reporting Warehouse · 06:44 UTC',affectedEntityIds:['job-reporting-loader','svc-payments-report'],applicableRoles:['tester','developer'],environmentId:'uat',detectionRule:'Latest main-path test result is failed.',supportingFacts:['Steps 1–4 passed.','Step 5: WAREHOUSE_CONNECTION_TIMEOUT.','Step 6 did not run.'],correlatedChanges:['Reporting Data Loader changed from 2.3.8 to 2.4.1.','No UAT network rule from Reporting Data Loader to Reporting Warehouse.'],counterEvidence:['The same test passed in Production with older versions.'],unknowns:['The direct cause of the timeout.'],recommendedInspection:'Check the network rule, the loader deployment and the test log together.',sourceReferences:['src-tests','src-deploy','src-network'],freshness:'current',actionUrl:'/requirements/req-daily-report' },
  { id:'finding-route',type:'network-gap',severity:'failure',title:'Reporting Data Loader → Reporting Warehouse',summary:'UAT · TCP 5432 · No allow rule collected',affectedEntityIds:['job-reporting-loader','db-warehouse'],applicableRoles:['operations','tester','developer'],environmentId:'uat',detectionRule:'A declared dependency has no matching allow rule.',supportingFacts:['The loader deployment declares a dependency on Reporting Warehouse.','No matching UAT allow rule was collected.'],correlatedChanges:['The latest UAT daily report test failed at the warehouse load.'],counterEvidence:['Matching rules exist in Pre-production and Production.'],unknowns:['Whether a rule exists outside the collected sources.'],recommendedInspection:'Check the UAT infrastructure plan and the collector scope.',sourceReferences:['src-network','src-deploy'],freshness:'current',actionUrl:'/network' },
  { id:'finding-stale-source',type:'stale-source',severity:'attention',title:'fees-currency repository',summary:'Last collected 02:11 UTC · Expected every hour',affectedEntityIds:['svc-fees-currency'],applicableRoles:['developer','operations'],detectionRule:'Last collection is older than twice the expected interval.',supportingFacts:['Last collection: 02:11 UTC.','Expected interval: 1 hour.'],correlatedChanges:['Fees & Currency is newer in UAT than in Production.'],counterEvidence:['Deployment data is up to date.'],unknowns:['Whether commits after 02:11 are missing.'],recommendedInspection:'Check the repository collector before comparing commits.',sourceReferences:['src-git-fees'],freshness:'stale',actionUrl:'/services/svc-fees-currency' },
  { id:'finding-legacy-toggle',type:'unused-configuration',severity:'attention',title:'legacy-fee-rules',summary:'Set in 3 environments · Referenced by 0 current deployments',affectedEntityIds:['toggle-legacy-fee-rules'],applicableRoles:['operations','developer'],detectionRule:'Setting exists, but no current manifest refers to it.',supportingFacts:['Set in Development, Test and UAT.','No reference in current deployment manifests.'],correlatedChanges:['new-fee-rules is enabled only in UAT.'],counterEvidence:['Earlier releases referred to legacy-fee-rules.'],unknowns:['Whether a script outside the collected sources reads it.'],recommendedInspection:'Check impact before removal.',sourceReferences:['src-deploy','src-git-fees'],freshness:'current',actionUrl:'/hygiene' },
  { id:'finding-retired-notify',type:'retired-deployment',severity:'attention',title:'Notification 1.8.2',summary:'Pre-production · Current version 1.9.0',affectedEntityIds:['svc-notification'],applicableRoles:['operations'],environmentId:'preproduction',detectionRule:'A retired version is still deployed.',supportingFacts:['1.8.2 retired on 18 July.','1.9.0 is the current deployment.'],correlatedChanges:['A network rule still points to the retired SMS gateway.'],counterEvidence:['No traffic data is collected.'],unknowns:['Whether rollback procedures still need 1.8.2.'],recommendedInspection:'Check the rollback policy and the linked network rule before removal.',sourceReferences:['src-deploy','src-network'],freshness:'current',actionUrl:'/hygiene' },
]

export const allEntities: Entity[] = [...services, ...endpoints, ...databases, ...tables, ...configurationEntities, ...toggleEntities, ...repositories.map(r => ({ id:r.id,type:'repository' as const,name:r.name,slug:r.id,description:`Source repository for ${services.find(s=>s.id===r.serviceId)!.name}.`,ownerTeamId:services.find(s=>s.id===r.serviceId)!.ownerTeamId,tags:['repository'],sourceReferences:[r.sourceReferenceId],harvestedAt:sources.find(s=>s.id===r.sourceReferenceId)!.harvestedAt,expectedRefreshInterval:'1 hour',pageUrl:`/services/${r.serviceId}` }))]

export const getEntity = (id: string) => allEntities.find(entity => entity.id === id)
export const getService = (id: string) => services.find(service => service.id === id)
export const getRequirement = (id: string) => requirements.find(requirement => requirement.id === id)
export const getSource = (id: string) => sources.find(source => source.id === id)
export const teamName = (id: string) => teams.find(team => team.id === id)?.name ?? id
export const environmentName = (id: string) => environments.find(environment => environment.id === id)?.name ?? id
export const networkRulesAtSnapshot = (snapshotId: string): NetworkRule[] => networkRules.map(rule => {
  if (rule.id === 'net-uat-loader-warehouse' && snapshotId !== 'current') {
    return { ...rule, state: 'current', harvestedAt: snapshotId === 'previous-day' ? '2026-10-12T07:50:00Z' : '2026-10-06T07:50:00Z' }
  }
  return rule
})
