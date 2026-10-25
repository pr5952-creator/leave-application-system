export type LeaveStatus = 'SUBMITTED'|'PENDING_APPROVAL'|'APPROVED'|'REJECTED'
export interface Leave {id:number;employeeName:string;employeeEmail:string;leaveType:string;startDate:string;endDate:string;days:number;reason?:string;status:LeaveStatus;statusMessage?:string;createdAt:string}
export interface NewLeave {employeeName:string;employeeEmail:string;leaveType:string;startDate:string;endDate:string;reason:string}
async function http<T>(url:string,init?:RequestInit):Promise<T>{
 const response=await fetch(url,{headers:{'Content-Type':'application/json'},...init})
 if(!response.ok){let message=response.statusText;try{const data=await response.json();message=data.error||message}catch{message=(await response.text())||message}throw new Error(message)}
 return response.status===204?undefined as T:response.json()
}
const q=encodeURIComponent
export const submitLeave=(body:NewLeave)=>http<Leave>('/api/leaves',{method:'POST',body:JSON.stringify(body)})
export const myLeaves=(email:string)=>http<Leave[]>(`/api/leaves?employeeEmail=${q(email)}`)
export const pendingLeaves=()=>http<Leave[]>('/api/leaves/pending')
export const balance=(email:string)=>http<{remainingDays:number}>(`/api/leaves/balance?employeeEmail=${q(email)}`)
export const decide=(id:number,approved:boolean,comment:string)=>http<void>(`/api/leaves/${id}/decision`,{method:'POST',body:JSON.stringify({approved,comment})})
