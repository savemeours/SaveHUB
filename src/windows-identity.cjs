'use strict';
const fs=require('node:fs');const path=require('node:path');const {createHash}=require('node:crypto');const {execFileSync}=require('node:child_process');
const APP_ID='id.savemeours.savehub';const APP_NAME='SaveHUB';const TOAST_CLSID='{7D68C3B0-41A0-4DD1-9C4D-5E4A37741F83}';
function applyIdentity(app,platform=process.platform){app.setName(APP_NAME);if(platform==='win32'){app.setAppUserModelId(APP_ID);app.setToastActivatorCLSID?.(TOAST_CLSID);}}
function quoteArgument(value){return '"'+String(value).replace(/(\\*)"/g,'$1$1\\"').replace(/(\\+)$/,'$1$1')+'"';}
function cacheIcon(app,iconSource){const dir=path.join(app.getPath('userData'),'notification-assets');fs.mkdirSync(dir,{recursive:true});const bytes=fs.readFileSync(iconSource);const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);const icon=path.join(dir,'savehub-'+hash+'.ico');if(!fs.existsSync(icon))fs.writeFileSync(icon,bytes);return icon;}
function applyTaskbarIdentity({window,app,iconSource,platform=process.platform,executable=process.execPath,appPath,portableExecutable=process.env.PORTABLE_EXECUTABLE_FILE}){
 if(platform!=='win32')return {status:'not-windows'};
 try{const icon=cacheIcon(app,iconSource);const target=portableExecutable||executable;const args=app.isPackaged||portableExecutable?[]:[appPath||app.getAppPath()];const relaunchCommand=[target,...args].map(quoteArgument).join(' ');window.setIcon(icon);window.setAppDetails({appId:APP_ID,appIconPath:icon,appIconIndex:0,relaunchCommand,relaunchDisplayName:APP_NAME});return {status:'applied',icon,appId:APP_ID};}catch{return {status:'failed',message:'Ikon taskbar SaveHUB belum dapat diterapkan.'};}
}
function registerWindowsIdentity({app,shell,platform=process.platform,executable=process.execPath,appPath,iconSource,portableExecutable=process.env.PORTABLE_EXECUTABLE_FILE,systemRoot=process.env.SystemRoot||'C:\\Windows',runRegistry=execFileSync}){
 if(platform!=='win32')return {status:'not-windows',appId:APP_ID};
 const result={status:'registered',appId:APP_ID,name:APP_NAME,shortcut:false,registry:false};
 try{
  const icon=cacheIcon(app,iconSource);result.icon=icon;
  const key='HKCU\\Software\\Classes\\AppUserModelId\\'+APP_ID;const reg=path.win32.join(systemRoot,'System32','reg.exe');
  for(const [name,value]of [['DisplayName',APP_NAME],['IconUri',icon],['CustomActivator',TOAST_CLSID]])runRegistry(reg,['add',key,'/v',name,'/t','REG_SZ','/d',value,'/f'],{windowsHide:true,stdio:'ignore',timeout:3000,shell:false});result.registry=true;
  const programs=path.join(app.getPath('appData'),'Microsoft','Windows','Start Menu','Programs');fs.mkdirSync(programs,{recursive:true});const shortcut=path.join(programs,'SaveHUB.lnk');
  let keepInstalled=false;if(!app.isPackaged&&fs.existsSync(shortcut)&&typeof shell.readShortcutLink==='function'){try{const current=shell.readShortcutLink(shortcut);keepInstalled=current.appUserModelId===APP_ID&&path.win32.basename(current.target).toLowerCase()!=='electron.exe';}catch{}}
  if(keepInstalled){result.shortcut=true;result.keptInstalledShortcut=true;}
  else{const target=portableExecutable||executable;const args=app.isPackaged||portableExecutable?'':quoteArgument(appPath||app.getAppPath());result.shortcut=shell.writeShortcutLink(shortcut,'create',{target,args,cwd:app.isPackaged||portableExecutable?path.dirname(target):(appPath||app.getAppPath()),description:'SaveHUB — ruang kerja percakapan dan komunitas',icon,iconIndex:0,appUserModelId:APP_ID,toastActivatorClsid:TOAST_CLSID});if(!result.shortcut)throw new Error('Windows menolak pembuatan shortcut SaveHUB');}
  result.icon=icon;return result;
 }catch(error){return {...result,status:'failed',message:'Notifikasi SaveHUB belum siap. Mulai ulang aplikasi, lalu periksa izin notifikasi Windows.'};}
}
module.exports={APP_ID,APP_NAME,TOAST_CLSID,applyIdentity,quoteArgument,registerWindowsIdentity,applyTaskbarIdentity};
