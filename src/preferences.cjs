'use strict';
const services=require('./services.cjs');
function normalizePreferences(value={}){value=value&&typeof value==='object'&&!Array.isArray(value)?value:{};const known=id=>services.some(s=>s.id===id);return {...value,theme:value.theme==='dark'?'dark':'light',compact:value.compact===true,restore:value.restore!==false,last:known(value.last)?value.last:'home',favorites:Array.isArray(value.favorites)?[...new Set(value.favorites.filter(known))]:[],mute:Object.fromEntries(services.map(s=>[s.id,value.mute?.[s.id]===true])),zoom:Object.fromEntries(services.map(s=>{const zoom=Number(value.zoom?.[s.id]);return [s.id,Number.isFinite(zoom)?Math.max(.5,Math.min(2,zoom)):1];}))};}
module.exports={normalizePreferences};
