const services = require('./services.cjs');
function https(url) { try { const u=new URL(url); return u.protocol==='https:' && !u.username && !u.password; } catch { return false; } }
function belongs(url, domains) { if(!https(url)) return false; const h=new URL(url).hostname; return domains.some(d=>h===d || h.endsWith('.'+d)); }
function serviceForPartition(partition) { return services.find(s=>partition==='persist:savehub-'+s.id); }
function validGuest(partition,url) { const s=serviceForPartition(partition); return !!s && belongs(url,s.domains); }
module.exports={https,belongs,serviceForPartition,validGuest};
