export type Lang = 'en'|'zh';
export type Seat = {name:string; city:string; items:string[]; caption:string};
export type Room = {a:Seat;b:Seat;template:'duo'|'receipt'|'comic';readyA:boolean;readyB:boolean;revision:number;guestJoined:boolean};
export const menu = [
 {id:'burger',name:'Classic burger',zh:'经典汉堡',price:2400,category:'food',asset:'burger'},
 {id:'fries',name:'Golden fries',zh:'金黄薯条',price:1200,category:'food',asset:'fries'},
 {id:'cola',name:'Ice-cold cola',zh:'冰爽可乐',price:900,category:'drinks',asset:'cola'},
 {id:'nuggets',name:'Chicken bites',zh:'香脆鸡块',price:1600,category:'food',asset:'nuggets'},
 {id:'icecream',name:'Vanilla swirl',zh:'香草冰淇淋',price:800,category:'sweet',asset:'icecream'},
 {id:'coffee',name:'Just a coffee',zh:'只喝咖啡',price:1100,category:'drinks',asset:'coffee'},
] as const;
export function total(s:Seat) {return s.items.reduce((sum,id)=>sum+(menu.find(m=>m.id===id)?.price??0),0);}
export function money(fen:number) {return '¥'+(fen/100).toFixed(2);}
export function demoRoom(lang:Lang='en'):Room {return {a:{name:lang==='zh'?'小麦':'Alex',city:'Shanghai',items:['coffee'],caption:lang==='zh'?'我就喝杯咖啡。':'I’m just here for coffee.'},b:{name:lang==='zh'?'小薯':'Sam',city:'Shenzhen',items:['burger','fries'],caption:lang==='zh'?'你的薯条，也是我们的薯条。':'Your fries are our fries.'},template:'duo',readyA:false,readyB:false,revision:0,guestJoined:false};}
export function suggestions(seat:Seat,lang:Lang):string[] {
 const coffee=seat.items.includes('coffee'), fries=seat.items.includes('fries'), sweet=seat.items.includes('icecream');
 if(lang==='zh') return [coffee?'我就喝杯咖啡。':fries?'这份薯条，可以商量。':sweet?'甜点是另一个话题。':'今天的计划：好好休息。',fries?'说好一人一半，我先选。':'本来有计划，直到看见菜单。','会议可以发消息，这顿饭不行。'];
 return [coffee?'I’m just here for coffee.':fries?'These fries are negotiable.':sweet?'Dessert is a separate conversation.':'My plan? A very good break.',fries?'We said fifty-fifty. I pick my half.':'I had a plan. Then I saw the menu.','This meeting could be an email. This meal couldn’t.'];
}
export function validSeat(v:unknown):v is Seat {if(!v||typeof v!=='object')return false;const s=v as Seat;return typeof s.name==='string'&&s.name.trim().length>0&&s.name.length<=24&&typeof s.city==='string'&&s.city.length<=32&&typeof s.caption==='string'&&s.caption.length<=90&&Array.isArray(s.items)&&s.items.length<=6&&new Set(s.items).size===s.items.length&&s.items.every(id=>menu.some(m=>m.id===id));}
export function yuanToFen(value:string):number {if(!/^\d+(\.\d{1,2})?$/.test(value))throw new Error('Invalid yuan amount');const [whole,decimal='']=value.split('.');const result=Number(whole)*100+Number(decimal.padEnd(2,'0'));if(!Number.isSafeInteger(result))throw new Error('Amount out of range');return result;}
export function normalizeMenu(response:{success:boolean;data?:{meals:Record<string,{name:string;currentPrice:string}>}}){if(!response.success||!response.data?.meals)throw new Error('Menu unavailable');return Object.entries(response.data.meals).map(([code,m])=>({code,name:m.name,priceFen:yuanToFen(m.currentPrice),source:'documentation-example' as const}));}
