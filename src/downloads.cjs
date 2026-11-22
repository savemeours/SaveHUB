'use strict';
const {randomUUID}=require('node:crypto');
class Downloads{
 constructor({history=[],save=()=>{},notify=()=>{},now=Date.now}){Object.assign(this,{save,notify,now});this.rows=new Map(history.slice(-200).map(row=>[row.id,{...row,live:false,canResume:false,state:['progressing','paused'].includes(row.state)?'interrupted':row.state}]));this.items=new Map();this.lastEmit=0;}
 list(){return [...this.rows.values()].reverse().map(row=>({...row}));}
 emit(force=false){if(force||this.now()-this.lastEmit>250){this.lastEmit=this.now();this.notify(this.list());}if(force)this.save([...this.rows.values()].slice(-200));}
 attach(item,meta){const id=randomUUID();const row={id,...meta,name:item.getFilename(),path:'',received:0,total:item.getTotalBytes(),state:'progressing',live:true,canResume:false,speed:0,startedAt:this.now()};this.rows.set(id,row);this.items.set(id,item);this.emit();let previousBytes=0,previousTime=this.now();
 item.on('updated',(_event,state)=>{const time=this.now(),received=item.getReceivedBytes();row.speed=Math.max(0,(received-previousBytes)*1000/Math.max(1,time-previousTime));previousBytes=received;previousTime=time;Object.assign(row,{received,live:true,canResume:item.canResume(),total:item.getTotalBytes(),state:item.isPaused()?'paused':state,path:item.getSavePath()||''});this.emit();});
 item.once('done',(_event,state)=>{Object.assign(row,{state,live:false,canResume:false,path:item.getSavePath()||'',received:item.getReceivedBytes(),speed:0});this.items.delete(id);this.emit(true);});return id;}
 control(id,action){const item=this.items.get(id),row=this.rows.get(id);if(!row)throw new Error('Unduhan tidak ditemukan');if(action==='pause'&&item){item.pause();row.state='paused';}else if(action==='resume'&&item){if(!item.canResume())throw new Error('Unduhan tidak bisa dilanjutkan');item.resume();row.state='progressing';}else if(action==='cancel'&&item)item.cancel();else if(action==='remove'&&!item)this.rows.delete(id);else throw new Error('Aksi tidak tersedia');this.emit(true);}
 hasActive(id,accountId){return [...this.rows.values()].some(r=>r.platform===id&&r.accountId===accountId&&this.items.has(r.id));}
}
module.exports=Downloads;
