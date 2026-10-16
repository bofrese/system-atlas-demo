import { allEntities, deployments, endpoints, environments, executions, findings, networkRules, relationships, repositories, requirements, services, snapshots, sources, tables } from '../src/data/atlas.ts'

const errors: string[] = []
const assert = (condition: unknown, message: string) => { if (!condition) errors.push(message) }
const unique = (label: string, ids: string[]) => {
  const seen = new Set<string>()
  for (const id of ids) seen.has(id) ? errors.push(`Duplicate ${label} id: ${id}`) : seen.add(id)
}

unique('entity', allEntities.map(x => x.id))
unique('source', sources.map(x => x.id))
unique('deployment', deployments.map(x => x.id))
unique('relationship', relationships.map(x => x.id))
unique('requirement', requirements.map(x => x.id))
unique('execution', executions.map(x => x.id))
unique('finding', findings.map(x => x.id))
unique('network rule', networkRules.map(x => x.id))

const entityIds = new Set(allEntities.map(x => x.id))
const sourceIds = new Set(sources.map(x => x.id))
const environmentIds = new Set(environments.map(x => x.id))
const snapshotIds = new Set(snapshots.map(x => x.id))
const serviceIds = new Set(services.map(x => x.id))
const requirementIds = new Set(requirements.map(x => x.id))

for (const entity of allEntities) {
  assert(entity.name && entity.description && entity.pageUrl.startsWith('/'), `Entity ${entity.id} is missing a required field or route`)
  entity.sourceReferences.forEach(id => assert(sourceIds.has(id), `Entity ${entity.id} references missing source ${id}`))
}
for (const relationship of relationships) {
  assert(entityIds.has(relationship.fromEntityId), `Relationship ${relationship.id} has missing source entity ${relationship.fromEntityId}`)
  assert(entityIds.has(relationship.toEntityId), `Relationship ${relationship.id} has missing target entity ${relationship.toEntityId}`)
  relationship.sourceReferences.forEach(id => assert(sourceIds.has(id), `Relationship ${relationship.id} references missing source ${id}`))
}
for (const deployment of deployments) {
  assert(serviceIds.has(deployment.serviceId), `Deployment ${deployment.id} has missing service`)
  assert(environmentIds.has(deployment.environmentId), `Deployment ${deployment.id} has missing environment`)
  assert(snapshotIds.has(deployment.snapshotId), `Deployment ${deployment.id} has missing snapshot`)
  deployment.sourceReferences.forEach(id => assert(sourceIds.has(id), `Deployment ${deployment.id} references missing source ${id}`))
}
for (const repository of repositories) {
  assert(serviceIds.has(repository.serviceId), `Repository ${repository.id} has missing service`)
  assert(sourceIds.has(repository.sourceReferenceId), `Repository ${repository.id} has missing source`)
}
for (const endpoint of endpoints) {
  assert(endpoint.requestFields.length > 0, `Endpoint ${endpoint.id} has no documented request fields`)
  assert(endpoint.responseFields.length > 0 || endpoint.method === 'DELETE', `Endpoint ${endpoint.id} has no documented response fields`)
  unique(`request field in ${endpoint.id}`, endpoint.requestFields.map(x => `${x.location}:${x.name}`))
  unique(`response field in ${endpoint.id}`, endpoint.responseFields.map(x => `${x.location}:${x.name}`))
  for (const field of [...endpoint.requestFields, ...endpoint.responseFields]) {
    assert(Boolean(field.name && field.dataType && field.description), `Endpoint ${endpoint.id} has an incomplete field record`)
  }
  assert(endpoint.errorResponses.length > 0, `Endpoint ${endpoint.id} has no documented error responses`)
}
for (const table of tables) {
  assert(table.columns.length > 0, `Table ${table.id} has no documented columns`)
  assert(Boolean(table.grain && table.updatePattern && table.retention), `Table ${table.id} has incomplete lifecycle documentation`)
  unique(`column in ${table.id}`, table.columns.map(x => x.name))
  table.columns.forEach(column => assert(Boolean(column.name && column.dataType && column.description), `Table ${table.id} has an incomplete column record`))
  table.relationships.forEach(link => {
    const target = tables.find(x => x.id === link.targetTableId)
    assert(table.columns.some(x => x.name === link.column), `Table ${table.id} relationship uses missing column ${link.column}`)
    assert(Boolean(target), `Table ${table.id} relationship uses missing table ${link.targetTableId}`)
    assert(Boolean(target?.columns.some(x => x.name === link.targetColumn)), `Table ${table.id} relationship uses missing target column ${link.targetColumn}`)
  })
}
for (const requirement of requirements) {
  assert(requirement.scenarios.length >= 2, `Requirement ${requirement.id} needs multiple scenarios`)
  assert(requirement.acceptanceCriteria.length > 0, `Requirement ${requirement.id} has no acceptance criteria`)
  assert(Boolean(requirement.businessRisk), `Requirement ${requirement.id} has no business risk`)
  unique(`scenario in ${requirement.id}`, requirement.scenarios.map(x => x.id))
  requirement.scenarios.flatMap(x => x.steps).forEach(step => {
    assert(serviceIds.has(step.componentId), `Requirement ${requirement.id} step references missing component ${step.componentId}`)
    step.dataIds.forEach(id => assert(entityIds.has(id), `Requirement ${requirement.id} step references missing data ${id}`))
  })
}
for (const execution of executions) {
  const requirement = requirements.find(x => x.id === execution.requirementId)
  assert(requirementIds.has(execution.requirementId), `Execution ${execution.id} has missing requirement`)
  assert(Boolean(requirement?.scenarios.some(x => x.id === execution.scenarioId)), `Execution ${execution.id} has missing scenario`)
  assert(environmentIds.has(execution.environmentId), `Execution ${execution.id} has missing environment`)
  assert(snapshotIds.has(execution.snapshotId), `Execution ${execution.id} has missing snapshot`)
  assert(Boolean(execution.runId && execution.duration && execution.trigger), `Execution ${execution.id} has incomplete run context`)
  execution.evidenceReferences.forEach(id => assert(sourceIds.has(id), `Execution ${execution.id} references missing source ${id}`))
}
for (const finding of findings) {
  finding.affectedEntityIds.forEach(id => assert(entityIds.has(id), `Finding ${finding.id} references missing entity ${id}`))
  finding.sourceReferences.forEach(id => assert(sourceIds.has(id), `Finding ${finding.id} references missing source ${id}`))
  assert(finding.actionUrl.startsWith('/'), `Finding ${finding.id} has invalid route`)
}
for (const rule of networkRules) {
  assert(entityIds.has(rule.sourceId), `Network rule ${rule.id} has missing source entity`)
  assert(entityIds.has(rule.destinationId) || rule.state === 'cleanup-candidate', `Network rule ${rule.id} has missing destination entity`)
  assert(environmentIds.has(rule.environmentId), `Network rule ${rule.id} has missing environment`)
  assert(sourceIds.has(rule.sourceReferenceId), `Network rule ${rule.id} has missing source reference`)
}

assert(services.length === 8, `Expected 8 services, found ${services.length}`)
assert(environments.length === 5, `Expected 5 environments, found ${environments.length}`)
assert(repositories.length === 8, `Expected 8 repositories, found ${repositories.length}`)
assert(allEntities.filter(x => x.type === 'endpoint').length >= 12, 'Expected at least 12 endpoints')
assert(tables.length >= 12, 'Expected at least 12 tables')
assert(requirements.length >= 10, 'Expected at least 10 requirements')
assert(requirements.reduce((n,r) => n + r.scenarios.length, 0) >= 25, 'Expected at least 25 scenarios')
assert(relationships.length >= 40, `Expected at least 40 relationships, found ${relationships.length}`)
assert(networkRules.length >= 10, 'Expected at least 10 network rules')
assert(findings.length === 6, `Expected 6 headline findings, found ${findings.length}`)
assert(executions.filter(x => x.requirementId === 'req-daily-report').length >= 3, 'Central scenario needs at least three executions')

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} error(s):\n${errors.map(x => `- ${x}`).join('\n')}`)
  process.exit(1)
}

console.log(`Data valid: ${allEntities.length} entities, ${relationships.length} relationships, ${deployments.length} deployments, ${requirements.length} requirements, ${requirements.reduce((n,r)=>n+r.scenarios.length,0)} scenarios, ${executions.length} executions.`)
