export type RoleLens = 'developer' | 'tester' | 'operations' | 'all'
export type Freshness = 'current' | 'stale' | 'unknown'
export type EvidenceKind = 'harvested' | 'inferred' | 'curated' | 'executable' | 'missing'
export type EntityType = 'service' | 'endpoint' | 'repository' | 'database' | 'table' | 'configuration' | 'toggle' | 'team'
export type ExecutionStatus = 'passed' | 'failed' | 'skipped' | 'not-executed' | 'stale' | 'unknown'

export interface SourceReference {
  id: string
  sourceType: string
  sourceName: string
  sourceLocation: string
  collector: string
  harvestedAt: string
  expectedRefreshInterval: string
  freshness: Freshness
}

export interface Entity {
  id: string
  type: EntityType
  name: string
  slug: string
  description: string
  ownerTeamId: string
  tags: string[]
  sourceReferences: string[]
  harvestedAt: string
  expectedRefreshInterval: string
  pageUrl: string
  capability?: string
}

export interface Service extends Entity {
  type: 'service'
  serviceType: string
  responsibility: string
  repositoryId: string
}

export interface Endpoint extends Entity {
  type: 'endpoint'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  providerId: string
  consumers: string[]
  auth: string
  requestExample: string
  responseExample: string
}

export interface DataTable extends Entity {
  type: 'table'
  databaseId: string
  columns: string[]
  readers: string[]
  writers: string[]
  classification: string
  lineage: string
}

export interface Environment { id: string; name: string; shortName: string; description: string }
export interface Snapshot { id: string; name: string; at: string }
export interface Team { id: string; name: string }
export interface Repository { id: string; name: string; serviceId: string; defaultBranch: string; sourceReferenceId: string; lastCommit: string }

export interface Deployment {
  id: string
  serviceId: string
  environmentId: string
  snapshotId: string
  version: string
  commit: string
  deployedAt: string
  configuration: Record<string, string>
  featureToggles: Record<string, boolean>
  sourceReferences: string[]
  retired?: boolean
}

export interface Scenario {
  id: string
  title: string
  kind: 'main' | 'alternate' | 'failure'
  steps: Array<{ title: string; expected: string; componentId: string; operation: string; dataIds: string[] }>
}

export interface Requirement {
  id: string
  title: string
  capability: string
  narrative: string
  preconditions: string[]
  scenarios: Scenario[]
  ownerTeamId: string
  sourceReferences: string[]
}

export interface TestExecution {
  id: string
  requirementId: string
  scenarioId: string
  environmentId: string
  snapshotId: string
  status: ExecutionStatus
  executedAt: string
  serviceVersions: Record<string, string>
  steps: Array<{ title: string; status: ExecutionStatus; actual: string; componentId: string; evidenceReferenceId: string }>
  evidenceReferences: string[]
}

export interface Relationship {
  id: string
  type: 'CALLS' | 'PROVIDES' | 'READS_FROM' | 'WRITES_TO' | 'PUBLISHES' | 'CONSUMES' | 'DEPLOYED_IN' | 'IMPLEMENTED_BY' | 'EXERCISED_BY' | 'ALLOWED_TO_CONNECT' | 'OWNED_BY' | 'DERIVED_FROM'
  fromEntityId: string
  toEntityId: string
  environmentId?: string
  snapshotId?: string
  description: string
  evidenceKind: EvidenceKind
  sourceReferences: string[]
  harvestedAt: string
}

export interface NetworkRule {
  id: string
  sourceId: string
  destinationId: string
  port: number
  protocol: string
  environmentId: string
  action: 'allow' | 'deny'
  ownerTeamId: string
  sourceReferenceId: string
  harvestedAt: string
  state: 'current' | 'missing' | 'cleanup-candidate'
}

export interface Finding {
  id: string
  type: string
  severity: 'attention' | 'failure' | 'info'
  title: string
  summary: string
  affectedEntityIds: string[]
  applicableRoles: RoleLens[]
  environmentId?: string
  detectionRule: string
  supportingFacts: string[]
  correlatedChanges: string[]
  counterEvidence: string[]
  unknowns: string[]
  recommendedInspection: string
  sourceReferences: string[]
  freshness: Freshness
  actionUrl: string
}
