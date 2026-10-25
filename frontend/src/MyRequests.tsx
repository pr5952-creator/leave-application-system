import {useEffect,useState} from 'react'
import {balance,myLeaves,type Leave} from './api'
export default function MyRequests({email,version}:{email:string;version:number}){
 const [rows,setRows]=useState<Leave[]>([]),[remaining,setRemaining]=useState<number|null>(null),[error,setError]=useState('')
 useEffect(()=>{if(!email){setRows([]);return}let alive=true
 const load=async()=>{try{const [r,b]=await Promise.all([myLeaves(email),balance(email)]);if(alive){setRows(r);setRemaining(b.remainingDays);setError('')}}catch(e){if(alive)setError(e instanceof Error?e.message:'Could not load requests.')}}
 void load();const timer=window.setInterval(load,4000);return()=>{alive=false;window.clearInterval(timer)}
 },[email,version])
 if(!email)return <div className="card"><h2>My requests</h2><p className="muted">Enter your email above to see your requests.</p></div>
 return <section className="card"><div className="section-heading"><div><div className="eyebrow">YOUR OVERVIEW</div><h2>My requests</h2></div><div className="balance"><strong>{remaining??'—'}</strong><span>annual days left</span></div></div>
 {error&&<p className="notice error">{error}</p>}{rows.length===0&&!error?<div className="empty"><div className="empty-icon">↗</div><h3>No requests yet</h3><p>Your submitted leave applications will appear here.</p></div>:
 <div className="table-wrap"><table><thead><tr><th>Request</th><th>Leave type</th><th>Dates</th><th>Days</th><th>Status</th><th>Manager / system note</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>#{r.id}</td><td>{r.leaveType}</td><td>{r.startDate}<br/><span className="muted">to {r.endDate}</span></td><td>{r.days}</td><td><span className={`badge ${r.status}`}>{r.status.replace('_',' ')}</span></td><td>{r.statusMessage||'—'}</td></tr>)}</tbody></table></div>}
 </section>
}
