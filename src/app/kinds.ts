import { ArrowLeftRight, BookOpenCheck, Box, CircleDot, Code2, Database, GitBranch, Rocket, Server, SlidersHorizontal, Table2, ToggleRight, Users, type LucideIcon } from 'lucide-react'
import type { EntityType } from '../data/model'

// Five families keep the colour set small enough to learn. Status owns red, amber, green and grey, so no family uses them.
export type Family = 'requirement' | 'software' | 'data' | 'runtime' | 'source'
export const families: Record<Family, { label: string; color: string }> = {
  requirement: { label: 'Requirements', color: '#7c3aed' },
  software: { label: 'Software', color: '#0f766e' },
  data: { label: 'Data', color: '#1d4ed8' },
  runtime: { label: 'Runtime', color: '#a21caf' },
  source: { label: 'Sources', color: '#475569' },
}

export type Kind = 'requirement' | 'component' | 'api' | 'repository' | 'database' | 'table' | 'environment' | 'deployment' | 'configuration' | 'toggle' | 'network' | 'source' | 'team'
export const kinds: Record<Kind, { label: string; plural: string; family: Family; icon: LucideIcon }> = {
  requirement: { label: 'Requirement', plural: 'Requirements', family: 'requirement', icon: BookOpenCheck },
  component: { label: 'Component', plural: 'Components', family: 'software', icon: Box },
  api: { label: 'API', plural: 'APIs', family: 'software', icon: Code2 },
  repository: { label: 'Repository', plural: 'Repositories', family: 'software', icon: GitBranch },
  database: { label: 'Database', plural: 'Databases', family: 'data', icon: Database },
  table: { label: 'Table', plural: 'Tables', family: 'data', icon: Table2 },
  environment: { label: 'Environment', plural: 'Environments', family: 'runtime', icon: Server },
  deployment: { label: 'Deployment', plural: 'Deployments', family: 'runtime', icon: Rocket },
  configuration: { label: 'Setting', plural: 'Settings', family: 'runtime', icon: SlidersHorizontal },
  toggle: { label: 'Feature switch', plural: 'Feature switches', family: 'runtime', icon: ToggleRight },
  network: { label: 'Network rule', plural: 'Network rules', family: 'runtime', icon: ArrowLeftRight },
  source: { label: 'Source', plural: 'Sources', family: 'source', icon: CircleDot },
  team: { label: 'Team', plural: 'Teams', family: 'source', icon: Users },
}

const entityTypeKinds: Record<EntityType, Kind> = { service: 'component', endpoint: 'api', repository: 'repository', database: 'database', table: 'table', configuration: 'configuration', toggle: 'toggle', team: 'team' }
export const kindOf = (type: string): Kind => entityTypeKinds[type as EntityType] ?? (type in kinds ? type as Kind : 'source')
export const kindColor = (kind: Kind) => families[kinds[kind].family].color
