'use strict';
const services=require('./services.cjs');
function runtimeOptions(value={}){return {closeToTray:value.closeToTray!==false,autoLockMinutes:Math.max(1,Math.min(120,Number(value.autoLockMinutes)||5)),lockOnHide:value.lockOnHide!==false,ramEnabled:!!value.ramEnabled,ramMinutes:Math.max(5,Math.min(120,Number(value.ramMinutes)||15)),ramExempt:services.filter(s=>(Array.isArray(value.ramExempt)?value.ramExempt:['whatsapp','telegram']).includes(s.id)).map(s=>s.id),autoCheckUpdates:value.autoCheckUpdates!==false,autoDownloadUpdates:!!value.autoDownloadUpdates};}
module.exports={runtimeOptions};
