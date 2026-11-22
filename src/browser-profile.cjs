'use strict';
// Keep the runtime's real Chromium version and platform. Only remove wrapper tokens.
function browserUserAgent(fallback, chromiumVersion) {
 if (!/^\d+\.\d+\.\d+\.\d+$/.test(chromiumVersion || '')) throw new Error('Chromium runtime version is unavailable');
 const clean=String(fallback).replace(/\s+(?:Electron|SaveHUB|savehub)\/[^\s]+/gi,'').replace(/\bChrome\/[\d.]+/, 'Chrome/'+chromiumVersion).trim();
 if(!clean.startsWith('Mozilla/5.0 ') || !clean.includes('Chrome/'+chromiumVersion)) throw new Error('Invalid browser profile');
 return clean;
}
function fitBounds(value,width,height){
 if(!value||!['x','y','width','height'].every(k=>Number.isFinite(value[k])))return null;
 const x=Math.max(0,Math.min(width,Math.round(value.x)));const y=Math.max(0,Math.min(height,Math.round(value.y)));
 return {x,y,width:Math.max(0,Math.min(width-x,Math.round(value.width))),height:Math.max(0,Math.min(height-y,Math.round(value.height)))};
}
module.exports={browserUserAgent,fitBounds};
