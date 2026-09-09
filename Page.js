'use client'
import {useMemo,useState} from 'react'
import {AlertTriangle,Ambulance,CarFront,Clock3,MapPin,RefreshCw,ShieldCheck,TrafficCone,TrendingUp} from 'lucide-react'

const initial=[
 {id:'A',name:'Anna Salai',vehicles:72,queue:58,wait:42,incident:'None',emergency:false},
 {id:'B',name:'Poonamallee High Rd',vehicles:25,queue:19,wait:18,incident:'None',emergency:false},
 {id:'C',name:'Mount Road',vehicles:90,queue:76,wait:65,incident:'Accident',emergency:false},
 {id:'D',name:'Inner Ring Road',vehicles:15,queue:10,wait:9,incident:'None',emergency:true},
]
function score(r){return Math.min(100,Math.round(r.vehicles*.45+r.queue*.3+r.wait*.25+(r.incident==='Accident'?18:r.incident==='Waterlogging'?12:r.incident==='Blockage'?15:0)+(r.emergency?12:0)))}
function level(s){return s>=70?'Critical':s>=45?'High':s>=25?'Medium':'Low'}
export default function Home(){
 const [roads,setRoads]=useState(initial); const [notice,setNotice]=useState('Live simulation data • updated just now')
 const enriched=useMemo(()=>roads.map(r=>({...r,score:score(r)})),[roads])
 const critical=enriched.filter(r=>r.score>=70).length
 const emergency=enriched.filter(r=>r.emergency).length
 const avgWait=Math.round(enriched.reduce((a,r)=>a+r.wait,0)/enriched.length)
 const recommendation=emergency?'Prioritize Inner Ring Road for the approaching emergency vehicle, then rebalance the junction.':'Give additional green time to the most congested approach.'
 function simulate(){setRoads(prev=>prev.map(r=>({...r,vehicles:Math.max(5,r.vehicles+Math.floor(Math.random()*21-8)),queue:Math.max(3,r.queue+Math.floor(Math.random()*15-5)),wait:Math.max(3,r.wait+Math.floor(Math.random()*12-4))})));setNotice('Simulation refreshed • traffic conditions recalculated')}
 return <main>
  <header className="top"><div className="brand"><div className="logo"><TrafficCone size={22}/></div><div><h1>Smart Traffic</h1><p>Decision Support System</p></div></div><button className="refresh" onClick={simulate}><RefreshCw size={17}/> Simulate update</button></header>
  <section className="hero"><div><span className="eyebrow">MULTI-FACTOR TRAFFIC ANALYSIS</span><h2>Traffic intelligence beyond vehicle counting.</h2><p>Analyze density, queue length, waiting time, incidents and emergency priority to recommend the next traffic-management action.</p></div><div className="status"><span></span> {notice}</div></section>
  <section className="stats">
   <Card icon={<CarFront/>} label="Vehicles monitored" value={enriched.reduce((a,r)=>a+r.vehicles,0)} sub="Across 4 approaches"/>
   <Card icon={<Clock3/>} label="Avg. waiting time" value={`${avgWait}s`} sub="Current junction average"/>
   <Card icon={<AlertTriangle/>} label="Critical roads" value={critical} sub="Need immediate review"/>
   <Card icon={<Ambulance/>} label="Emergency priority" value={emergency} sub="Active requests"/>
  </section>
  <section className="grid"><div className="panel"><div className="panelhead"><div><span className="eyebrow">JUNCTION MONITOR</span><h3>Road conditions</h3></div><span className="live">LIVE</span></div>
   <div className="roads">{enriched.map(r=><Road key={r.id} road={r}/>)}</div>
  </div>
  <div className="panel rec"><div className="panelhead"><div><span className="eyebrow">RECOMMENDATION ENGINE</span><h3>Recommended action</h3></div><ShieldCheck/></div><div className="recommend"><div className="recicon"><TrendingUp/></div><h4>{recommendation}</h4><p>The recommendation considers traffic volume, queue pressure, waiting time, incidents and emergency priority instead of relying on vehicle count alone.</p><div className="priority"><b>Priority logic</b><div><span>Traffic</span><span>Queue</span><span>Wait</span><span>Incident</span><span>Emergency</span></div></div></div></div></section>
  <section className="bottom"><div className="panel"><div className="panelhead"><div><span className="eyebrow">IMPROVEMENT METRICS</span><h3>Why this approach?</h3></div></div><div className="metrics"><Metric title="Reactive decisions" text="Moves beyond simple vehicle-count thresholds."/><Metric title="Context aware" text="Accounts for accidents, blockages and waterlogging."/><Metric title="Emergency ready" text="Can override normal priority when an emergency request is active."/></div></div><div className="map panel"><MapPin size={22}/><div><b>Junction simulation map</b><p>Interactive map integration can be added in Version 2.</p></div></div></section>
  <footer>Version 1.0 • Educational prototype • Recommendations are simulated and not connected to real traffic signals.</footer>
 </main>
}
function Card({icon,label,value,sub}){return <div className="stat"><div className="staticon">{icon}</div><div><p>{label}</p><strong>{value}</strong><small>{sub}</small></div></div>}
function Road({road:r}){let lv=level(r.score);return <div className="road"><div className="roadtop"><div className="roadname"><span className="roadid">{r.id}</span><div><b>{r.name}</b><small>{r.incident==='None'?'No incident reported':r.incident}</small></div></div><div className={'badge '+lv.toLowerCase()}>{lv}</div></div><div className="bar"><span style={{width:`${r.score}%`}}></span></div><div className="details"><span><b>{r.vehicles}</b> vehicles</span><span><b>{r.queue}</b> queue</span><span><b>{r.wait}s</b> wait</span><span>{r.emergency?<b className="em">Emergency</b>:`Score ${r.score}`}</span></div></div>}
function Metric({title,text}){return <div className="metric"><ShieldCheck size={18}/><div><b>{title}</b><p>{text}</p></div></div>}
  
