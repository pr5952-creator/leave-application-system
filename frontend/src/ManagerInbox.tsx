import {useCallback,useEffect,useState} from 'react'
import {decide,pendingLeaves,type Leave} from './api'
export default function ManagerInbox(){
 const [rows,setRows]=useState<Leave[]>([]),[comments,setComments]=useState<Record<number,string>>({}),[hidden,setHidden]=useState<number[]>([]),[busy,setBusy]=useState<number|null>(null),[error,setError]=useState('')
 const load=useCallback(()=>{pendingLeaves().then(setRows).catch(e=>setError(e instanceof Error?e.message:'Could not load inbox.'))},[])
 useEffect(()=>{void load();const timer=window.setInterval(()=>void load(),4000);return()=>window.clearInterval(timer)},[load])
 async function act(id:number,approved:boolean){setBusy(id);setError('');try{await decide(id,approved,comments[id]??'');setHidden(old=>[...old,id]);await load()}catch(e){setError(e instanceof Error?e.message:'Decision failed.')}finally{setBusy(null)}}
 const visible=rows.filter(r=>!hidden.includes(r.id))
 return <section className="card"><div className="section-heading"><div><div className="eyebrow">MANAGER WORKSPACE</div><h2>Manager inbox</h2></div><span className="count">{visible.length} pending</span></div>
 {error&&<p className="notice error">{error}</p>}{visible.length===0?<div className="empty"><div className="empty-icon">✓</div><h3>You're all caught up</h3><p>Requests waiting for approval will show up here.</p></div>:visible.map(r=><article className="request-card" key={r.id}><div className="request-top"><div><span className="request-id">REQUEST #{r.id}</span><h3>{r.employeeName}</h3><p className="muted">{r.employeeEmail}</p></div><span className="badge PENDING_APPROVAL">PENDING</span></div><div className="request-details"><span>{r.leaveType}</span><span>{r.startDate} → {r.endDate}</span><span>{r.days} working day(s)</span></div>{r.reason&&<p>{r.reason}</p>}<label>Comment<input placeholder="Optional manager comment" value={comments[r.id]??''} onChange={e=>setComments({...comments,[r.id]:e.target.value})}/></label><div className="actions"><button className="primary" disabled={busy===r.id} onClick={()=>void act(r.id,true)}>{busy===r.id?'Saving…':'Approve request'}</button><button className="reject" disabled={busy===r.id} onClick={()=>void act(r.id,false)}>Reject</button></div></article>)}
 </section>
}
