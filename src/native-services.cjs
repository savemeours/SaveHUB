'use strict';
const {connection}=require('./messages.js');
const {getAccount}=require('./accounts.cjs');const policy=require('./policy.cjs');
const {normalizePrivacy,PrivacySheet}=require('./privacy.cjs');
const services=require('./services.cjs');const {fitBounds}=require('./browser-profile.cjs');
class NativeServices {
 constructor({WindowView,window,configure,userAgent,settings,notify,secure,privacyChanged=()=>{},accountChanged=()=>{},muted=()=>false,canSuspend=()=>true,now=Date.now}){Object.assign(this,{WindowView,window,configure,userAgent,settings,notify,secure,privacyChanged,accountChanged,muted,canSuspend,now});this.entries=new Map();this.active='home';this.covered=false;this.bounds=null;this.disposed=false;this.busy=new Set();this.locked=false;this.suspended=new Map();}
 selected(id){return this.settings().selectedAccounts?.[id]||'default';}
 key(id,accountId=this.selected(id)){return accountId==='default'?id:id+'::'+accountId;}
 current(id){return this.entries.get(this.key(id));}
 publish(entry){if(!this.disposed&&this.entries.get(entry.key)===entry&&this.key(entry.id)===entry.key)this.notify({...entry.state});}
 layout(){if(this.disposed)return;const [width,height]=this.window.getContentSize();const bounds=fitBounds(this.bounds,width,height);
  for(const entry of this.entries.values()){if(bounds)entry.view.setBounds(bounds);entry.view.setVisible(!!bounds&&bounds.width>0&&bounds.height>0&&entry.key===this.key(this.active)&&!this.locked&&!this.covered&&!entry.state.error&&!entry.state.privacyPending&&!(entry.state.loading&&!entry.state.hasLoaded));}}
 setLayout(value,covered){this.bounds=value;this.covered=!!covered;this.layout();}
 create(s,account=getAccount(this.settings(),s.id),url=s.url){if(!account)throw new Error('Akun tidak ditemukan');const key=this.key(s.id,account.id);const ses=this.configure(s,account.id);const view=new this.WindowView({webPreferences:{session:ses,contextIsolation:true,nodeIntegration:false,nodeIntegrationInSubFrames:false,nodeIntegrationInWorker:false,sandbox:true,webSecurity:true,webviewTag:false}});
  view.setVisible(false);this.window.contentView.addChildView(view);const wc=view.webContents;wc.setUserAgent(this.userAgent);wc.setAudioMuted(!!this.settings().mute?.[s.id]||this.muted(s.id)||this.locked);wc.setZoomFactor(this.settings().zoom?.[s.id]||1);
  const privacy=normalizePrivacy(this.settings().privacy?.[s.id]);
  const entry={id:s.id,key,account,lastUsedAt:this.now(),view,sheet:new PrivacySheet(wc,s.id),state:{id:s.id,accountId:account.id,accountName:account.name,suspended:false,focusMuted:this.muted(s.id),privacy,privateMode:privacy.enabled,privacyPending:privacy.enabled,loading:true,hasLoaded:false,error:null,url:s.url,canGoBack:false,canGoForward:false,opened:true}};this.entries.set(key,entry);this.secure(wc,s,account.id);
  wc.on('media-started-playing',()=>{entry.mediaPlaying=true;});wc.on('media-paused',()=>{entry.mediaPlaying=false;});
  const apply=()=>this.applyPrivacy(entry).catch(()=>{});
  wc.on('did-start-navigation',(_e,_url,inPlace,mainFrame)=>{if(mainFrame&&!inPlace){entry.sheet.navigated();entry.state.privacyPending=entry.state.privacy.enabled;this.layout();this.publish(entry);}});
  wc.on('dom-ready',apply);wc.on('did-finish-load',apply);
  const update=()=>{if(wc.isDestroyed()||this.entries.get(key)!==entry)return;entry.state.url=wc.getURL()||s.url;entry.state.canGoBack=wc.navigationHistory.canGoBack();entry.state.canGoForward=wc.navigationHistory.canGoForward();this.publish(entry);};
  wc.on('did-start-loading',()=>{entry.state.loading=true;entry.state.error=null;this.layout();update();});
  wc.on('did-stop-loading',()=>{entry.state.loading=false;if(!entry.state.error)entry.state.hasLoaded=true;this.layout();update();});
  wc.on('did-navigate',update);wc.on('did-navigate-in-page',update);
  wc.on('did-fail-load',(_e,code,description,_url,mainFrame)=>{if(code===-3||mainFrame===false)return;entry.state.loading=false;entry.state.error=connection(code,s.name);this.layout();this.publish(entry);});
  wc.on('render-process-gone',()=>{entry.state.loading=false;entry.state.error='Layanan berhenti. Pilih Muat ulang untuk membuka kembali.';this.layout();this.publish(entry);});
  wc.on('destroyed',()=>{if(this.entries.get(key)===entry){this.entries.delete(key);this.notify({id:s.id,accountId:account.id,opened:false});}});
  // Clear only HTTP cache on the first WhatsApp open; preserve cookies and account data.
  const prepare=s.id==='whatsapp'?ses.clearCache():Promise.resolve();
  Promise.resolve(prepare).then(()=>{if(!wc.isDestroyed()&&this.entries.get(key)===entry)return wc.loadURL(policy.https(url)?url:s.url,{userAgent:this.userAgent});}).catch(error=>{if(!wc.isDestroyed()&&this.entries.get(key)===entry){entry.state.loading=false;entry.state.error=s.name+' belum dapat dibuka. Coba hubungkan kembali.';this.layout();this.publish(entry);}});
  this.publish(entry);return entry;
 }
 async applyPrivacy(entry){if(this.disposed||entry.view.webContents.isDestroyed())return;const revision=(entry.privacyRevision||0)+1;entry.privacyRevision=revision;
  entry.state.privacyPending=true;this.layout();this.publish(entry);
  try{await entry.sheet.apply(entry.state.privacy);entry.state.privacyError=null;}
  catch(error){entry.state.privacyError='Blur gagal diterapkan. Muat ulang layanan atau nonaktifkan Private Mode.';if(entry.state.privacy.enabled){entry.state.error=entry.state.privacyError;throw error;}}
  finally{if(entry.privacyRevision===revision){entry.state.privacyPending=false;this.layout();this.publish(entry);}}
 }
 async setPrivacy(id,value){if(!services.some(s=>s.id===id))throw new Error('Platform tidak tersedia');const settings=this.settings();settings.privacy||={};const privacy=normalizePrivacy({...settings.privacy[id],...(typeof value==='boolean'?{enabled:value}:value)});settings.privacy[id]=privacy;this.privacyChanged(id,privacy);
  for(const entry of this.entries.values()){if(entry.id!==id)continue;entry.state.privacy=privacy;entry.state.privateMode=privacy.enabled;if(entry.state.error===entry.state.privacyError)entry.state.error=null;await this.applyPrivacy(entry);}
  return this.current(id)?{...this.current(id).state}:{id,opened:false,privacy,privateMode:privacy.enabled};
 }
 async switchAccount(id,accountId){if(!getAccount(this.settings(),id,accountId))throw new Error('Akun tidak ditemukan');this.settings().selectedAccounts||={};this.settings().selectedAccounts[id]=accountId;this.accountChanged();return this.select(id);}
 setLocked(value){this.locked=!!value;this.applyPolicies();this.layout();}
 applyPolicies(){for(const entry of this.entries.values()){const wc=entry.view.webContents;if(!wc.isDestroyed())wc.setAudioMuted(!!this.settings().mute?.[entry.id]||this.muted(entry.id)||this.locked);entry.state.focusMuted=this.muted(entry.id);this.publish(entry);}}

 select(id){if(this.disposed)return;if(id!=='home'&&!services.some(s=>s.id===id))throw new Error('Platform tidak tersedia');if(this.busy.has(id)||this.busy.has(this.key(id)))throw new Error('Sesi sedang diperbaiki. Coba lagi sesaat.');this.active=id;
  const key=this.key(id);let entry=this.entries.get(key);if(id!=='home'&&!entry){const saved=this.suspended.get(key);entry=this.create(services.find(s=>s.id===id),getAccount(this.settings(),id),saved?.url);this.suspended.delete(key);}if(entry)entry.lastUsedAt=this.now();this.layout();if(entry)this.publish(entry);return entry?{...entry.state}:null;}
 control(id,action,value){const entry=this.current(id);if(!entry||entry.view.webContents.isDestroyed())return;const wc=entry.view.webContents;
  if(action==='reload'){entry.state.error=null;entry.state.loading=true;wc.reloadIgnoringCache();this.layout();this.publish(entry);}
  if(action==='back'&&wc.navigationHistory.canGoBack())wc.navigationHistory.goBack();
  if(action==='forward'&&wc.navigationHistory.canGoForward())wc.navigationHistory.goForward();
  if(action==='mute')wc.setAudioMuted(!!value||this.muted(id)||this.locked);
  if(action==='zoom')wc.setZoomFactor(Math.max(.5,Math.min(2,Number(value)||1)));
 }
 async close(id,accountId=this.selected(id)){const key=this.key(id,accountId);const entry=this.entries.get(key);if(!entry)return;this.entries.delete(key);this.window.contentView.removeChildView(entry.view);
  const wc=entry.view.webContents;if(!wc.isDestroyed())await new Promise(resolve=>{wc.once('destroyed',resolve);wc.close({waitForBeforeUnload:false});});
  if(!this.disposed&&this.selected(id)===accountId)this.notify({id,accountId,opened:false});}
 async repair(id,full=false,accountId=this.selected(id)){const s=services.find(s=>s.id===id);if(!s||this.busy.has(id))return false;this.busy.add(id);
  try{await this.close(id,accountId);this.suspended.delete(this.key(id,accountId));const ses=this.configure(s,accountId);await ses.clearCache();await ses.clearStorageData(full?{}:{storages:['serviceworkers','cachestorage']});return true;}
  finally{this.busy.delete(id);if(!this.disposed&&this.active===id&&this.selected(id)===accountId)this.select(id);}}
 async suspend(id,accountId=this.selected(id)){const key=this.key(id,accountId);const entry=this.entries.get(key);if(!entry||key===this.key(this.active)||this.busy.has(key))return false;const wc=entry.view.webContents;
  if(wc.isDestroyed()||wc.isLoading?.()||wc.isCurrentlyAudible?.()||entry.mediaPlaying||!this.canSuspend(entry))return false;
  let draftTimer;try{const dirty=await Promise.race([wc.executeJavaScriptInIsolatedWorld(1201,[{code:`(()=>[...document.querySelectorAll('textarea,input:not([type]),input[type="text"],input[type="email"],input[type="password"],[contenteditable="true"]')].some(el=>(el.isContentEditable?el.textContent:el.value||'').trim().length>0))()`}]),new Promise(resolve=>{draftTimer=setTimeout(()=>resolve(true),2000);draftTimer.unref?.();})]);if(dirty)return false;}catch{return false;}finally{clearTimeout(draftTimer);}
  if(key===this.key(this.active)||this.entries.get(key)!==entry)return false;const state={...entry.state,suspended:true,loading:false,url:wc.getURL()};this.busy.add(key);
  try{await this.close(id,accountId);this.suspended.set(key,state);if(this.selected(id)===accountId)this.notify({...state});return true;}finally{this.busy.delete(key);}
 }
 async hibernateIdle({minutes=15,exempt=[]}={}){for(const entry of [...this.entries.values()])if(!exempt.includes(entry.id)&&this.now()-entry.lastUsedAt>=minutes*60000)await this.suspend(entry.id,entry.account.id);}
 async dispose(){this.disposed=true;await Promise.allSettled([...this.entries.values()].map(e=>this.close(e.id,e.account.id)));}
}
module.exports=NativeServices;
