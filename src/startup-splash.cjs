'use strict';
const path=require('node:path');
class StartupSplash{
 constructor({BrowserWindow,root=__dirname,onCancel=()=>{},onFailure=()=>{},onReady=()=>{},schedule=setTimeout,cancel=clearTimeout,timeout=60000}){Object.assign(this,{BrowserWindow,root,onCancel,onFailure,onReady,schedule,cancel,timeout});this.stopped=false;this.painted=false;this.rendererReady=false;this.presented=false;}
 present(){return new Promise((resolve,reject)=>{this.reject=reject;const splash=this.window=new this.BrowserWindow({width:440,height:330,resizable:false,maximizable:false,minimizable:false,frame:false,show:false,center:true,skipTaskbar:true,title:'SaveHUB — Memulai',backgroundColor:'#20242d',icon:path.join(this.root,'../assets/icon.png'),webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true,webviewTag:false}});splash.setMenu(null);splash.webContents.setWindowOpenHandler(()=>({action:'deny'}));splash.webContents.on('will-navigate',event=>event.preventDefault());splash.webContents.on('did-fail-load',(_event,code,_description,_url,mainFrame)=>{if(code!==-3&&mainFrame!==false)this.fail();});splash.once('closed',()=>{if(!this.stopped){this.dispose();this.onCancel();reject(new Error('Startup cancelled'));}});splash.once('ready-to-show',()=>{if(this.stopped)return;splash.show();this.presented=true;resolve();});this.timer=this.schedule(()=>this.fail(),this.timeout);this.timer?.unref?.();try{Promise.resolve(splash.loadFile(path.join(this.root,'splash.html'))).catch(()=>this.fail());}catch{this.fail();}});}
 attach(main){this.main=main;main.once('ready-to-show',()=>{this.painted=true;this.finish();});main.webContents.on('did-fail-load',(_event,code,_description,_url,mainFrame)=>{if(code!==-3&&mainFrame!==false)this.fail();});}
 ready(){this.rendererReady=true;this.finish();}
 finish(){if(this.stopped||!this.painted||!this.rendererReady||!this.main||this.main.isDestroyed())return;this.main.show();this.dispose();this.onReady();}
 fail(){if(this.stopped)return;const presented=this.presented;this.dispose();if(presented)this.onFailure();else this.reject?.(new Error('Startup unavailable'));}
 dispose(){if(this.stopped)return;this.stopped=true;this.cancel(this.timer);if(this.window&&!this.window.isDestroyed())this.window.destroy();}
}
module.exports=StartupSplash;
