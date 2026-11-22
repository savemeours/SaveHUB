'use strict';
const {APP_ID}=require('./windows-identity.cjs');
function applyLinuxIdentity(app,platform=process.platform){if(platform!=='linux')return false;app.setDesktopName(APP_ID+'.desktop');return true;}
function linuxRuntimeOptions(stored,options){return {...options,closeToTray:typeof stored?.closeToTray==='boolean'?stored.closeToTray:false};}
module.exports={applyLinuxIdentity,linuxRuntimeOptions};
