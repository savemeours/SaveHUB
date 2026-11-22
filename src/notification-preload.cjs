'use strict';
const {contextBridge,ipcRenderer}=require('electron');
// Only the bounded notification channel is exposed, never arbitrary IPC or Node APIs.
contextBridge.exposeInMainWorld('__savehubNotice',{show:payload=>ipcRenderer.invoke('savehub:platform-notice',payload),clicked:callback=>{ipcRenderer.on('savehub:notice-click',(_event,id)=>callback(id));}});
contextBridge.executeInMainWorld({func:()=>{
 const host=globalThis;if(host.__savehubNoticeInstalled||!host.Notification)return;host.__savehubNoticeInstalled=true;const bridge=host.__savehubNotice,Original=host.Notification,instances=new Map();
 function event(notice,type){notice.dispatchEvent(new Event(type));if(typeof notice['on'+type]==='function')notice['on'+type](new Event(type));}
 class PlatformNotification extends EventTarget{
  constructor(title,options={}){super();if(Original.permission!=='granted')throw new DOMException('Notification permission is not granted','NotAllowedError');this.title=String(title);this.body=String(options.body||'');this.tag=String(options.tag||'');this.icon=options.icon||'';this.data=options.data;this.silent=!!options.silent;this.__id=crypto.randomUUID();instances.set(this.__id,this);if(instances.size>100)instances.delete(instances.keys().next().value);this.__delivery=bridge.show({id:this.__id,title:this.title,body:this.body,tag:this.tag,silent:this.silent}).then(result=>{if(result.shown)event(this,'show');return result;}).catch(error=>{event(this,'error');throw error;});this.__delivery.catch(()=>{});}
  close(){instances.delete(this.__id);bridge.show({action:'close',id:this.__id,tag:this.tag}).then(()=>event(this,'close')).catch(()=>{});}
  static get permission(){return Original.permission;}
  static requestPermission(callback){return Original.requestPermission().then(value=>{if(typeof callback==='function')callback(value);return value;});}
 }
 Object.defineProperty(host,'Notification',{value:PlatformNotification,configurable:true,writable:true});bridge.clicked(id=>{const notice=instances.get(id);if(notice)event(notice,'click');});
 if(host.ServiceWorkerRegistration){const proto=host.ServiceWorkerRegistration.prototype;proto.showNotification=function(title,options={}){try{const notice=new PlatformNotification(title,options);return notice.__delivery.then(()=>undefined);}catch(error){return Promise.reject(error);}};proto.getNotifications=function(options={}){return Promise.resolve([...instances.values()].filter(n=>!options.tag||n.tag===options.tag));};}
}});
