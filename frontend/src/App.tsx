import { useState } from 'react'
import ApplyForm from './ApplyForm'
import MyRequests from './MyRequests'
import ManagerInbox from './ManagerInbox'
type Tab='apply'|'mine'|'manager'
export default function App(){
 const [tab,setTab]=useState<Tab>('apply')
 const [name,setName]=useState(localStorage.getItem('name')??'')
 const [email,setEmail]=useState(localStorage.getItem('email')??'')
 const [version,setVersion]=useState(0)
 const save=(key:string,value:string,setter:(v:string)=>void)=>{localStorage.setItem(key,value);setter(value)}
 return <main className="app">
  <header className="hero"><div className="eyebrow">PEOPLE • TIME OFF • WORKFLOW</div><h1>Leave Application System</h1><p>One simple place to request leave and manage approvals.</p></header>
  <section className="identity card"><div><label>Your name<input placeholder="e.g. Alex Thomas" value={name} onChange={e=>save('name',e.target.value,setName)}/></label></div><div><label>Your email<input type="email" placeholder="you@college.edu" value={email} onChange={e=>save('email',e.target.value,setEmail)}/></label></div></section>
  <nav className="tabs">{([['apply','Apply for leave'],['mine','My requests'],['manager','Manager inbox']] as [Tab,string][]).map(([key,label])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}>{label}</button>)}</nav>
  {tab==='apply'&&<ApplyForm name={name} email={email} onSubmitted={()=>{setVersion(v=>v+1);setTab('mine')}}/>}
  {tab==='mine'&&<MyRequests email={email} version={version}/>}
  {tab==='manager'&&<ManagerInbox/>}
  <footer>Leave Application System <span>•</span> React + Spring Boot + Camunda 8</footer>
 </main>
}
