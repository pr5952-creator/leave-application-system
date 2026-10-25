import {useState} from 'react'
import {submitLeave} from './api'
interface Props{name:string;email:string;onSubmitted:()=>void}
export default function ApplyForm({name,email,onSubmitted}:Props){
 const [leaveType,setLeaveType]=useState('ANNUAL'),[startDate,setStartDate]=useState(''),[endDate,setEndDate]=useState(''),[reason,setReason]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false)
 async function submit(e:React.FormEvent){e.preventDefault();if(!name.trim()||!email.trim()){setMessage('Enter your name and email above first.');return}if(endDate<startDate){setMessage('End date must be on or after the start date.');return}
 setBusy(true);setMessage('');try{await submitLeave({employeeName:name,employeeEmail:email,leaveType,startDate,endDate,reason});onSubmitted()}catch(err){setMessage(err instanceof Error?err.message:'Could not submit request.')}finally{setBusy(false)}}
 return <form onSubmit={submit} className="card form-card"><div className="section-heading"><div><div className="eyebrow">NEW REQUEST</div><h2>Apply for leave</h2></div><span className="step-chip">01 / 03</span></div>
 <label>Leave type<select value={leaveType} onChange={e=>setLeaveType(e.target.value)}><option value="ANNUAL">Annual leave</option><option value="SICK">Sick leave</option><option value="UNPAID">Unpaid leave</option></select></label>
 <div className="two-col"><label>From<input type="date" required value={startDate} onChange={e=>setStartDate(e.target.value)}/></label><label>To<input type="date" required min={startDate} value={endDate} onChange={e=>setEndDate(e.target.value)}/></label></div>
 <label>Reason <span className="muted">(optional)</span><textarea rows={4} placeholder="Add a short note for your manager…" value={reason} onChange={e=>setReason(e.target.value)}/></label>
 {message&&<p className="notice error">{message}</p>}<button className="primary" disabled={busy}>{busy?'Submitting…':'Submit leave request →'}</button>
 </form>
}
