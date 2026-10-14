import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { HashRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { Activity, ArrowLeftRight, BookOpenCheck, Bot, Boxes, ChevronLeft, CircleGauge, Command, Database, GitCompareArrows, Menu, Network, PanelRightClose, Search, ShieldCheck, Sparkles, TestTube2, X } from 'lucide-react'
import { allEntities, deployments, environmentName, environments, getService, getSource, requirements, snapshots, sources, teams } from '../data/atlas'
import type { RoleLens } from '../data/model'
import { ApiDetailPage, ComparePage, DashboardPage, DataCataloguePage, DatabaseDetailPage, EnvironmentDetailPage, EnvironmentsPage, HygienePage, ImpactPage, MachineAccessPage, NetworkPage, NotFoundPage, PresenterPage, RequirementDetailPage, RequirementsPage, ServiceDetailPage, ServicesPage, SourcesPage, SystemMapPage, TableDetailPage } from '../pages/Pages'

type AtlasContextValue = {
  role: RoleLens; setRole: (role: RoleLens) => void
  environment: string; setEnvironment: (environment: string) => void
  snapshot: string; setSnapshot: (snapshot: string) => void
  evidence: string | null; openEvidence: (id: string) => void; closeEvidence: () => void
}
const AtlasContext = createContext<AtlasContextValue | null>(null)
export const useAtlas = () => useContext(AtlasContext)!

function useStoredState<T extends string>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => (localStorage.getItem(key) as T | null) ?? initial)
  useEffect(() => localStorage.setItem(key, value), [key, value])
  return [value, setValue] as const
}

function AtlasProvider({ children }: { children: ReactNode }) {
  const [role,setRole] = useStoredState<RoleLens>('atlas-role','all')
  const [environment,setEnvironment] = useStoredState<string>('atlas-environment','uat')
  const [snapshot,setSnapshot] = useStoredState<string>('atlas-snapshot','current')
  const [evidence,setEvidence] = useState<string|null>(null)
  const value = useMemo(() => ({ role,setRole,environment,setEnvironment,snapshot,setSnapshot,evidence,openEvidence:setEvidence,closeEvidence:()=>setEvidence(null) }), [role,environment,snapshot,evidence,setRole,setEnvironment,setSnapshot])
  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>
}

const navigation = [
  ['/', 'Overview', CircleGauge], ['/map','System map',Network], ['/requirements','Requirements',BookOpenCheck], ['/services','Services',Boxes],
  ['/environments','Environments',Activity], ['/compare?left=uat&right=production','Compare',GitCompareArrows], ['/impact/api-post-trades','Impact explorer',Sparkles],
  ['/hygiene','Hygiene',ShieldCheck], ['/data','Data catalogue',Database], ['/network','Network rules',ArrowLeftRight], ['/sources','Sources',TestTube2], ['/machine-access','Machine access',Bot],
] as const

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [query,setQuery] = useState('')
  const items = useMemo(() => [
    ...allEntities.map(entity => ({ id:entity.id,name:entity.name,description:entity.description,type:entity.type,url:entity.pageUrl })),
    ...requirements.map(req => ({ id:req.id,name:req.title,description:req.capability,type:'requirement',url:`/requirements/${req.id}` })),
    ...deployments.filter(dep=>dep.snapshotId==='current').map(dep => ({ id:dep.id,name:`${dep.version} · ${getService(dep.serviceId)?.name}`,description:`${environmentName(dep.environmentId)} deployment · commit ${dep.commit}`,type:'deployment',url:`/services/${dep.serviceId}` })),
    ...teams.map(team => ({ id:team.id,name:team.name,description:'Owning team',type:'team',url:'/services' })),
  ],[])
  const fuse = useMemo(() => new Fuse(items,{ keys:['name','description','id'],threshold:.32 }),[items])
  const results = query ? fuse.search(query).slice(0,10).map(x=>x.item) : items.filter(x=>['service','requirement'].includes(x.type)).slice(0,8)
  useEffect(() => { if (open) setQuery('') },[open])
  if (!open) return null
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <div className="command-palette" role="dialog" aria-modal="true" aria-label="Search System Atlas" onMouseDown={e=>e.stopPropagation()}>
      <div className="command-input"><Search size={18}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services, endpoints, requirements, versions…" onKeyDown={e=>{ if(e.key==='Escape') onClose(); if(e.key==='Enter'&&results[0]){navigate(results[0].url);onClose()}}}/><kbd>esc</kbd></div>
      <div className="command-results">{Object.entries(results.reduce<Record<string,typeof results>>((groups,item)=>{(groups[item.type]??=[]).push(item);return groups},{})).map(([type,group])=><section key={type}><h3>{type}</h3>{group.map(item=><button key={item.id} onClick={()=>{navigate(item.url);onClose()}}><span><strong>{item.name}</strong><small>{item.description}</small></span></button>)}</section>)}</div>
      <div className="command-footer"><span><kbd>↵</kbd> open first result</span><span>{results.length} results</span></div>
    </div>
  </div>
}

function EvidenceDrawer() {
  const { evidence,closeEvidence } = useAtlas()
  const source = evidence ? getSource(evidence) : null
  if (!evidence) return null
  return <aside className="evidence-drawer" aria-label="Evidence details">
    <div className="drawer-header"><div><span className="eyebrow">Evidence record</span><h2>{source?.sourceName ?? evidence}</h2></div><button className="icon-button" onClick={closeEvidence} aria-label="Close evidence"><X size={18}/></button></div>
    {source ? <>
      <div className={`evidence-kind ${source.sourceType === 'Curated description' ? 'curated' : 'harvested'}`}>{source.sourceType === 'Curated description' ? 'Manually curated explanation' : 'Harvested fact'}</div>
      <dl className="definition-list"><div><dt>Source system</dt><dd>{source.sourceType}</dd></div><div><dt>Location</dt><dd className="mono wrap">{source.sourceLocation}</dd></div><div><dt>Collector</dt><dd>{source.collector}</dd></div><div><dt>Harvested</dt><dd>{new Date(source.harvestedAt).toLocaleString('en-GB',{timeZone:'UTC'})} UTC</dd></div><div><dt>Expected interval</dt><dd>{source.expectedRefreshInterval}</dd></div><div><dt>Freshness</dt><dd><span className={`status ${source.freshness}`}>{source.freshness}</span></dd></div><div><dt>Stable ID</dt><dd className="mono">{source.id}</dd></div></dl>
      <div className="drawer-note"><strong>Interpretation limit</strong><p>This record describes what the fictional collector observed. It does not prove completeness outside its stated source and harvest time.</p></div>
    </> : <div className="empty-state">The referenced evidence record is unavailable.</div>}
  </aside>
}

function Shell() {
  const [navOpen,setNavOpen] = useState(true)
  const [searchOpen,setSearchOpen] = useState(false)
  const { role,setRole,environment,setEnvironment,snapshot,setSnapshot,evidence } = useAtlas()
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => { const onKey=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearchOpen(true)} }; window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey) },[])
  return <div className={`app-shell ${navOpen?'':'nav-collapsed'} ${evidence?'drawer-open':''}`}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark" aria-hidden="true"><span/><span/><span/></div>{navOpen&&<div><strong>System Atlas</strong><small>Northstar</small></div>}<button className="nav-toggle" onClick={()=>setNavOpen(x=>!x)} aria-label={navOpen?'Collapse navigation':'Expand navigation'}>{navOpen?<ChevronLeft size={17}/>:<Menu size={18}/>}</button></div>
      <nav aria-label="Primary navigation">{navigation.map(([url,label,Icon])=><NavLink key={url} to={url} end={url==='/' } className={({isActive})=>isActive||location.pathname===url.split('?')[0]?'active':''} title={navOpen?undefined:label}><Icon size={18}/>{navOpen&&<span>{label}</span>}</NavLink>)}</nav>
      <div className="sidebar-foot">{navOpen&&<><span className="demo-dot"/> <span>Fictional demonstration data</span></>}</div>
    </aside>
    <header className="topbar">
      <button className="global-search" onClick={()=>setSearchOpen(true)}><Search size={17}/><span>Search the atlas</span><kbd><Command size={12}/> K</kbd></button>
      <div className="topbar-controls">
        <label><span>Lens</span><select aria-label="Lens" value={role} onChange={e=>setRole(e.target.value as RoleLens)}><option value="all">All perspectives</option><option value="developer">Developer</option><option value="tester">Tester</option><option value="operations">Operations</option></select></label>
        <label><span>Environment</span><select aria-label="Environment" value={environment} onChange={e=>setEnvironment(e.target.value)}>{environments.map(x=><option key={x.id} value={x.id}>{x.shortName}</option>)}</select></label>
        <label><span>Snapshot</span><select aria-label="Snapshot" value={snapshot} onChange={e=>setSnapshot(e.target.value)}>{snapshots.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <button className="demo-button" onClick={()=>navigate('/presenter')}><Sparkles size={16}/> Guided demo</button>
      </div>
    </header>
    <main id="main-content">
      <Routes>
        <Route path="/" element={<DashboardPage/>}/><Route path="/map" element={<SystemMapPage/>}/>
        <Route path="/requirements" element={<RequirementsPage/>}/><Route path="/requirements/:requirementId" element={<RequirementDetailPage/>}/>
        <Route path="/services" element={<ServicesPage/>}/><Route path="/services/:serviceId" element={<ServiceDetailPage/>}/><Route path="/apis/:endpointId" element={<ApiDetailPage/>}/>
        <Route path="/environments" element={<EnvironmentsPage/>}/><Route path="/environments/:environmentId" element={<EnvironmentDetailPage/>}/><Route path="/compare" element={<ComparePage/>}/>
        <Route path="/impact/:entityId" element={<ImpactPage/>}/><Route path="/hygiene" element={<HygienePage/>}/>
        <Route path="/data" element={<DataCataloguePage/>}/><Route path="/data/databases/:databaseId" element={<DatabaseDetailPage/>}/><Route path="/data/tables/:tableId" element={<TableDetailPage/>}/>
        <Route path="/network" element={<NetworkPage/>}/><Route path="/sources" element={<SourcesPage/>}/><Route path="/machine-access" element={<MachineAccessPage/>}/><Route path="/presenter" element={<PresenterPage/>}/><Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </main>
    <EvidenceDrawer/><SearchPalette open={searchOpen} onClose={()=>setSearchOpen(false)}/>
  </div>
}

export function App() { return <HashRouter><AtlasProvider><a className="skip-link" href="#main-content">Skip to content</a><Shell/></AtlasProvider></HashRouter> }
