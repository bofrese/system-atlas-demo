import { useEffect, useRef, useState } from 'react'
import cytoscape, { type Core } from 'cytoscape'
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { useAtlas } from '../app/App'
import { kindColor } from '../app/kinds'
import { findings, getEntity, relationships, services } from '../data/atlas'

const category = (serviceType: string) => serviceType.includes('HTTP') ? 'HTTP service' : serviceType.includes('Worker') ? 'Worker' : serviceType.includes('pipeline') ? 'Pipeline' : 'Service'

export function SystemGraph({ focusId, compact=false, depth=1, direction='both', visibleTypes, onSelect }: { focusId?: string; compact?: boolean; depth?: number; direction?: 'upstream'|'downstream'|'both'; visibleTypes?: string[]; onSelect?: (id:string)=>void }) {
  const container = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core|null>(null)
  const [selected,setSelected] = useState(focusId ?? '')
  const { environment,snapshot } = useAtlas()
  // Findings are rule output for the latest collection only, so older snapshots show no markers.
  const marked = snapshot==='current' ? findings.filter(f=>!f.environmentId||f.environmentId===environment) : []
  const severityOf = (id:string) => marked.some(f=>f.severity==='failure'&&f.affectedEntityIds.includes(id)) ? 'failure' : marked.some(f=>f.affectedEntityIds.includes(id)) ? 'attention' : ''
  const markerKey = marked.map(f=>f.id).join()
  useEffect(()=>{
    if(!container.current) return
    const visibleServices = services.filter(s=>!visibleTypes||visibleTypes.includes(category(s.serviceType)))
    const visibleIds = new Set(visibleServices.map(s=>s.id))
    const graphRelationships = relationships.filter(r=>r.type==='CALLS' && visibleIds.has(r.fromEntityId) && visibleIds.has(r.toEntityId))
    const elements = [
      ...visibleServices.map(s=>({data:{id:s.id,label:s.name,capability:s.capability,kind:s.serviceType},classes:severityOf(s.id)})),
      ...graphRelationships.map(r=>({data:{id:r.id,source:r.fromEntityId,target:r.toEntityId,label:r.type}})),
    ]
    const cy = cytoscape({ container:container.current, elements, style:[
      {selector:'node',style:{'background-color':'#ffffff','border-color':kindColor('component'),'border-width':2,'label':'data(label)','font-family':'Inter, system-ui, sans-serif','font-size':`${compact?11:13}px`,'font-weight':'bold','color':'#172033','text-wrap':'wrap','text-max-width':`${compact?104:132}px`,'text-valign':'center','text-halign':'center','width':`${compact?118:150}px`,'height':`${compact?44:56}px`,'shape':'round-rectangle'}},
      {selector:'.failure',style:{'border-color':'#d92d20','border-width':3,'background-color':'#fff1f0'}},{selector:'.attention',style:{'border-color':'#dc8a00','border-width':3,'background-color':'#fff8eb'}},
      {selector:'edge',style:{'line-color':'#b9c4d4','target-arrow-color':'#b9c4d4','target-arrow-shape':'triangle','curve-style':'bezier','width':1.4,'arrow-scale':.8}},
      {selector:'.selected',style:{'border-width':5,'underlay-color':kindColor('component'),'underlay-opacity':.12,'underlay-padding':6}},
      {selector:'.faded',style:{'opacity':.16}}, {selector:'.path',style:{'line-color':kindColor('component'),'target-arrow-color':kindColor('component'),'width':3,'opacity':1}},
    ], layout:{name:'breadthfirst',directed:true,padding:compact?36:30,spacingFactor:compact?1.05:1.25}, minZoom:.4,maxZoom:2.2 })
    const select = (id:string) => { setSelected(id); cy.elements().removeClass('selected faded path'); const node=cy.getElementById(id); if(!node.length)return; node.addClass('selected'); let neighborhood=node;let frontier=node;for(let hop=0;hop<depth;hop++){const next=direction==='upstream'?frontier.incomers():direction==='downstream'?frontier.outgoers():frontier.incomers().union(frontier.outgoers());neighborhood=neighborhood.union(next);frontier=next.nodes() as typeof frontier}cy.elements().not(neighborhood).addClass('faded'); neighborhood.edges().addClass('path'); onSelect?.(id) }
    cy.on('tap','node',event=>select(event.target.id()))
    if(focusId) select(focusId)
    cyRef.current=cy
    return()=>{cy.destroy()}
  },[compact,depth,direction,focusId,onSelect,visibleTypes,markerKey])
  const action=(type:'in'|'out'|'fit'|'reset')=>{ const cy=cyRef.current;if(!cy)return;if(type==='in')cy.zoom({level:cy.zoom()*1.2,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});if(type==='out')cy.zoom({level:cy.zoom()*.8,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});if(type==='fit')cy.fit(undefined,24);if(type==='reset'){cy.elements().removeClass('selected faded path');cy.fit(undefined,24);setSelected('')} }
  return <div className={`graph-frame ${compact?'compact':''}`}>
    <div ref={container} className="graph-canvas" role="img" aria-label="Directed service dependency map"/>
    <div className="graph-toolbar"><button onClick={()=>action('in')} aria-label="Zoom in"><ZoomIn size={16}/></button><button onClick={()=>action('out')} aria-label="Zoom out"><ZoomOut size={16}/></button><button onClick={()=>action('fit')} aria-label="Fit graph"><Maximize2 size={16}/></button><button onClick={()=>action('reset')} aria-label="Reset graph"><RotateCcw size={16}/></button></div>
    <div className="graph-legend"><span><i className="legend-service"/> Component</span><span><i className="legend-edge"/> Calls</span>{marked.some(f=>f.severity==='failure')&&<span><i className="legend-service failure"/> Failure</span>}{marked.length>0&&<span><i className="legend-service attention"/> Finding</span>}{selected&&<strong>{getEntity(selected)?.name}</strong>}</div>
  </div>
}
