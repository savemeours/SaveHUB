const {test}=require('node:test');const assert=require('node:assert/strict');const {JSDOM}=require('jsdom');const services=require('../src/services.cjs');const {normalizePrivacy,buildPrivacyCSS,targets,PrivacySheet}=require('../src/privacy.cjs');
test('privacy profiles sanitize data and generate scoped CSS for all nine platforms',()=>{
 assert.equal(normalizePrivacy({strength:999}).strength,20);assert.equal(normalizePrivacy({strength:-5}).strength,4);assert.equal(normalizePrivacy({enabled:'yes'}).enabled,false);
 for(const s of services){assert.equal(buildPrivacyCSS(s.id,{enabled:false}),'');const css=buildPrivacyCSS(s.id,{enabled:true});assert.match(css,/blur\(9px\)/);assert.doesNotMatch(css,/:hover/);assert.match(css,/body:not\(:has\(/);assert.ok(targets[s.id].messages.length);}
 assert.throws(()=>buildPrivacyCSS('invalid',{enabled:true}));
});
test('WhatsApp chat, name, avatar and media selectors match distinct sensitive regions',()=>{
 const dom=new JSDOM('<body><aside id="pane-side"><span title="Nama kontak">Ayu</span><div data-testid="cell-frame-secondary">Pesan terakhir</div><img id="avatar"></aside><main id="main"><header><span title="Nama aktif">Ayu</span></header><div class="message-in"><span class="copyable-text">Pesan privat</span><img id="media"></div><div contenteditable="true" id="composer">Draft</div></main><nav id="safe-nav">Menu</nav></body>');const doc=dom.window.document;
 for(const kind of ['messages','names','avatars','media'])assert.ok(doc.querySelectorAll(targets.whatsapp[kind].join(',')).length,kind);
 assert.equal(doc.querySelector('#composer').matches(targets.whatsapp.messages.join(',')),false);assert.equal(doc.querySelector('#safe-nav').matches(Object.values(targets.whatsapp).flat().join(',')),false);
 const css=buildPrivacyCSS('whatsapp',{enabled:true,messages:false,names:false,avatars:false,media:true,strength:12});assert.doesNotMatch(css,/#pane-side \[title\]/);assert.match(css,/#main video/);dom.window.close();
});
test('hover reveal is opt-in and whole-page blur cannot be accidentally revealed by hovering',()=>{
 assert.match(buildPrivacyCSS('discord',{enabled:true,revealOnHover:true}),/:hover\{filter:none/);
 const full=buildPrivacyCSS('reddit',{enabled:true,fullPage:true,revealOnHover:true});assert.match(full,/:is\(body\)\{filter:blur/);assert.doesNotMatch(full,/:hover/);
});
test('privacy styles are removed in order and reinserted after navigation',async()=>{
 const calls=[];let key=0;const wc={isDestroyed:()=>false,insertCSS:async css=>{calls.push(['insert',css]);return 'css'+(++key);},removeInsertedCSS:async k=>calls.push(['remove',k])};const sheet=new PrivacySheet(wc,'whatsapp');await sheet.apply({enabled:true});await sheet.apply({enabled:true,strength:12});assert.equal(calls[0][0],'insert');assert.equal(calls[1][0],'insert');assert.deepEqual(calls[2],['remove','css1']);await sheet.apply({enabled:false});assert.deepEqual(calls.at(-1),['remove','css2']);sheet.navigated();await sheet.apply({enabled:true});assert.match(calls.at(-1)[1],/blur/);
});
