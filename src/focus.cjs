'use strict';
const services=require('./services.cjs');
class FocusMode{constructor(now=Date.now){this.now=now;this.endsAt=0;this.ids=[];}start(minutes,ids){minutes=Math.max(5,Math.min(180,Number(minutes)||25));this.ids=services.filter(s=>ids?.includes(s.id)).map(s=>s.id);if(!this.ids.length)throw new Error('Pilih setidaknya satu platform');this.endsAt=this.now()+minutes*60000;return this.status();}stop(){this.endsAt=0;this.ids=[];return this.status();}status(){return {active:this.endsAt>this.now(),endsAt:this.endsAt,ids:[...this.ids]};}silenced(id){return this.status().active&&this.ids.includes(id);}}
module.exports=FocusMode;
