import assert from 'node:assert/strict';
const root='http://127.0.0.1:5173/api/rooms';
const seat={name:'API Alex',city:'Shanghai',items:['coffee'],caption:'Just coffee.'};
async function req(method,body,session){const r=await fetch(root+(session?'?id='+session.id:''),{method,headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()};}
const host=await req('POST',{action:'create',seat});assert.equal(host.status,201);
const h=host.data;let state=await req('GET',null,h);assert.equal(state.data.a.name,'API Alex');assert.equal(state.data.guestJoined,false);
assert.equal((await req('GET',null,{...h,token:'wrong'})).status,403);
const guest=await req('POST',{action:'join',id:h.id,invite:h.invite,seat:{...seat,name:'API Sam',items:['fries'],caption:'Our fries.'}});assert.equal(guest.status,200);const g=guest.data;
assert.equal((await req('POST',{action:'join',id:h.id,invite:h.invite,seat})).status,409);
state=await req('GET',null,h);let r=state.data;
assert.equal(r.guestJoined,true);
let patch=await req('PATCH',{action:'ready',value:true,revision:r.revision},h);assert.equal(patch.status,200);r=patch.data;
patch=await req('PATCH',{action:'ready',value:true,revision:r.revision},g);assert.equal(patch.status,200);r=patch.data;assert.ok(r.readyA&&r.readyB);
patch=await req('PATCH',{action:'seat',value:{...seat,name:'API Sam',items:['fries','burger']},revision:r.revision},g);assert.equal(patch.status,200);assert.equal(patch.data.readyA,false);assert.equal(patch.data.readyB,false);assert.equal(patch.data.a.name,'API Alex');
assert.equal((await req('PATCH',{action:'template',value:'comic',revision:r.revision},h)).status,409);
r=patch.data;assert.equal((await req('PATCH',{action:'seat',value:{...seat,items:['FAKE']},revision:r.revision},h)).status,400);
patch=await req('PATCH',{action:'template',value:'receipt',revision:r.revision},h);assert.equal(patch.status,200);assert.equal(patch.data.template,'receipt');
console.log('PASS: create, two-client join/sync, unauthorized access, one-use invite, two approvals, edit invalidation, seat isolation, stale revision conflict, invalid products, template sync.');
