const {test}=require('node:test');const assert=require('node:assert/strict');const {browserUserAgent,fitBounds}=require('../src/browser-profile.cjs');
test('browser identity uses actual Chromium version and keeps actual OS without wrapper tokens',()=>{
 const base='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) SaveHUB/1.0.0 Chrome/100.0.0.0 Electron/45.4.1 Safari/537.36';
 const ua=browserUserAgent(base,'154.0.8000.1');assert.match(ua,/Chrome\/154\.0\.8000\.1/);assert.match(ua,/Windows NT 10.0; Win64; x64/);assert.doesNotMatch(ua,/Electron|savehub/i);assert.match(ua,/Safari\/537\.36/);
 assert.throws(()=>browserUserAgent(base,'fake'));assert.throws(()=>browserUserAgent('invalid','154.0.8000.1'));
});
test('native content bounds remain inside the app and reject invalid inputs',()=>{
 assert.deepEqual(fitBounds({x:242,y:100,width:2000,height:3000},1280,720),{x:242,y:100,width:1038,height:620});assert.equal(fitBounds({x:NaN,y:0,width:1,height:1},1280,720),null);
});
