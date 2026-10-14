import {env} from 'cloudflare:workers';
import {validSeat, type Seat} from '@/lib/meme';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer'};
function reply(data:unknown,status=200){return Response.json(data,{status,headers});}
async function hash(s:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');}
function secret(){return crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');}
type Row={id:string;host_hash:string;guest_hash:string|null;invite_hash:string|null;a:string;b:string;template:string;ready_a:number;ready_b:number;revision:number;expires_at:number};
function publicRoom(r:Row){return {a:JSON.parse(r.a),b:JSON.parse(r.b),template:r.template,readyA:!!r.ready_a,readyB:!!r.ready_b,revision:r.revision,guestJoined:!!r.guest_hash};}
async function body(request:Request){const text=await request.text();if(text.length>4096)throw new Error('Request too large');return JSON.parse(text);}
function sameOrigin(r:Request){const origin=r.headers.get('origin');return !origin||origin===new URL(r.url).origin;}
export async function POST(request:Request){
 try{if(!sameOrigin(request))return reply({error:'Invalid origin'},403);const db=env.DB;if(!db)return reply({error:'Room storage unavailable. Solo demo still works.'},503);const v=await body(request);
 if(v.action==='create'){
  if(!validSeat(v.seat))return reply({error:'Invalid participant'},400);
  const id=crypto.randomUUID(),token=secret(),invite=secret(),now=Date.now();const blank:Seat={name:'Friend',city:'Shenzhen',items:[],caption:''};
  await db.prepare('INSERT INTO rooms (id,host_hash,invite_hash,a,b,created_at,expires_at) VALUES (?,?,?,?,?,?,?)').bind(id,await hash(token),await hash(invite),JSON.stringify(v.seat),JSON.stringify(blank),now,now+7*86400000).run();
  return reply({id,token,invite,seat:'a'},201);
 }
 if(v.action==='join'){
  if(typeof v.id!=='string'||typeof v.invite!=='string'||!validSeat(v.seat))return reply({error:'Invalid invitation'},400);
  const token=secret();const result=await db.prepare('UPDATE rooms SET guest_hash=?,invite_hash=NULL,b=?,revision=revision+1,ready_a=0,ready_b=0 WHERE id=? AND invite_hash=? AND guest_hash IS NULL AND expires_at>?').bind(await hash(token),JSON.stringify(v.seat),v.id,await hash(v.invite),Date.now()).run();
  if(!result.meta.changes)return reply({error:'Invitation used, expired or invalid. Ask for a new room.'},409);
  return reply({id:v.id,token,seat:'b'});
 }
 return reply({error:'Unknown action'},400);
 }catch{return reply({error:'Could not open room. Please try again.'},400);}
}
async function authorize(request:Request){const db=env.DB;if(!db)throw new Error('Storage unavailable');const id=new URL(request.url).searchParams.get('id');const token=request.headers.get('authorization')?.replace(/^Bearer /,'');if(!id||!token)return null;const r=await db.prepare('SELECT * FROM rooms WHERE id=? AND expires_at>?').bind(id,Date.now()).first<Row>();if(!r)return null;const digest=await hash(token);const seat=digest===r.host_hash?'a':digest===r.guest_hash?'b':null;return seat?{r,seat,db}:null;}
export async function GET(request:Request){try{const auth=await authorize(request);return auth?reply(publicRoom(auth.r)):reply({error:'Room expired or access denied'},403);}catch{return reply({error:'Room connection unavailable'},503);}}
export async function PATCH(request:Request){try{
 if(!sameOrigin(request))return reply({error:'Invalid origin'},403);const auth=await authorize(request);if(!auth)return reply({error:'Access denied'},403);const {r,seat,db}=auth;const v=await body(request);let result;
 if(v.action==='seat'){
  if(!validSeat(v.value))return reply({error:'Invalid selection'},400);
  result=await db.prepare(`UPDATE rooms SET ${seat}=?,ready_a=0,ready_b=0,revision=revision+1 WHERE id=? AND revision=?`).bind(JSON.stringify(v.value),r.id,v.revision).run();
 }else if(v.action==='template'){
  if(!['duo','receipt','comic'].includes(v.value))return reply({error:'Invalid template'},400);
  result=await db.prepare('UPDATE rooms SET template=?,ready_a=0,ready_b=0,revision=revision+1 WHERE id=? AND revision=?').bind(v.value,r.id,v.revision).run();
 }else if(v.action==='ready'){
  if(!r.guest_hash||!JSON.parse(r.a).items.length||!JSON.parse(r.b).items.length||!JSON.parse(r.a).caption.trim()||!JSON.parse(r.b).caption.trim())return reply({error:'Both people need a meal and caption first'},400);
  if(typeof v.value!=='boolean')return reply({error:'Invalid approval'},400);
  result=await db.prepare(`UPDATE rooms SET ready_${seat}=?,revision=revision+1 WHERE id=? AND revision=?`).bind(v.value?1:0,r.id,v.revision).run();
 }else return reply({error:'Unknown action'},400);
 if(!result.meta.changes)return reply({error:'Room changed. Please try your edit again.'},409);
 const updated=await db.prepare('SELECT * FROM rooms WHERE id=?').bind(r.id).first<Row>();return reply(publicRoom(updated!));
 }catch{return reply({error:'Could not save. Please try again.'},400);}}
