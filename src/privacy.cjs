'use strict';
const services=require('./services.cjs');
const defaults={enabled:false,messages:true,names:true,avatars:true,media:true,fullPage:false,revealOnHover:false,strength:9};
function normalizePrivacy(value={}){const o={};for(const k of Object.keys(defaults))o[k]=k==='strength'?Math.max(4,Math.min(20,Number(value?.strength)||9)):typeof value?.[k]==='boolean'?value[k]:defaults[k];return o;}
const targets={
 whatsapp:{roots:['#main','#pane-side'],messages:['#main .message-in .copyable-text','#main .message-out .copyable-text','[data-testid="msg-text"]','#pane-side [data-testid="cell-frame-secondary"]','#pane-side [data-testid="last-msg-status"] ~ span'],names:['#pane-side [title]','#main header [title]','[data-testid="conversation-info-header-chat-title"]'],avatars:['#pane-side img','#main header img','[data-testid="user-avatar"]'],media:['#main .message-in img','#main .message-out img','#main video','#main canvas','[data-testid="media-viewer"]']},
 telegram:{roots:['#column-center','.chatlist','.chat-list','.bubbles','.MessageList'],messages:['.message .text-content','.message .message-content','.bubble-content .message','.chatlist-chat .last-message','.Chat .last-message','.Message .text-content','.message-text'],names:['.peer-title','.chat-title','.sender-title','.ChatInfo .title','.message-title'],avatars:['.avatar img','.Avatar','.peer-avatar'],media:['.bubble-content img','.bubble-content video','.message-media','.Message img','.Message video']},
 instagram:{roots:['main','[role="main"]','[role="dialog"]'],messages:['main [dir="auto"]','[role="main"] [dir="auto"]','[role="dialog"] [dir="auto"]','[role="row"] [dir="auto"]'],names:['main header a','[role="main"] header a','[role="row"] a','[role="dialog"] header'],avatars:['img[alt*="profile"]','img[alt*="profil"]','header img','[role="row"] img'],media:['main img','main video','[role="main"] img','[role="main"] video','[role="dialog"] img','[role="dialog"] video']},
 facebook:{roots:['[role="main"]','[role="dialog"]'],messages:['[data-ad-preview="message"]','[data-ad-comet-preview="message"]','[role="row"] [dir="auto"]','[role="main"] [dir="auto"]'],names:['[role="main"] h2','[role="main"] h3','[role="dialog"] h2','[role="row"] a'],avatars:['[role="main"] image','[role="main"] img[alt]','[role="dialog"] image'],media:['[role="main"] img','[role="main"] video','[role="dialog"] img','[role="dialog"] video']},
 discord:{roots:['[data-list-id="chat-messages"]','[class*="chatContent"]'],messages:['[id^="message-content-"]','[class*="messageContent"]','[class*="embedDescription"]','[class*="activityText"]'],names:['[class*="username"]','[class*="headerText"]','[class*="nameTag"]','[class*="nameContainer"]'],avatars:['[class*="avatar"]','[class*="guildIcon"]'],media:['[class*="imageWrapper"]','[class*="embedMedia"]','[class*="attachment"]','video']},
 tiktok:{roots:['main','[role="main"]','[data-e2e="browse-video"]'],messages:['[data-e2e*="comment-level"]','[data-e2e="browse-video-desc"]','[data-e2e="video-desc"]','[data-e2e*="chat"]'],names:['[data-e2e="browse-username"]','[data-e2e="video-author-uniqueid"]','[data-e2e*="comment-username"]'],avatars:['[data-e2e*="avatar"]','img[alt*="avatar"]'],media:['main video','main img','[data-e2e="browse-video"]','[role="main"] video']},
 threads:{roots:['main','[role="main"]'],messages:['main [dir="auto"]','[role="main"] [dir="auto"]'],names:['main a[href^="/@"]','[role="main"] a[href^="/@"]'],avatars:['img[alt*="profile"]','img[alt*="profil"]'],media:['main img','main video','[role="main"] img','[role="main"] video']},
 x:{roots:['main','[data-testid="DMDrawer"]'],messages:['[data-testid="tweetText"]','[data-testid="messageEntry"]','[data-testid="DmActivityContainer"]'],names:['[data-testid="User-Name"]','[data-testid="DMConversationEntry"] [dir="ltr"]'],avatars:['[data-testid^="UserAvatar-Container-"]'],media:['[data-testid="tweetPhoto"]','[data-testid="videoPlayer"]','[data-testid="messageEntry"] img','[data-testid="messageEntry"] video']},
 reddit:{roots:['main','shreddit-app'],messages:['[slot="text-body"]','[slot="comment"]','[data-testid="comment"]','[data-testid="post-title"]','[slot="title"]'],names:['a[href*="/user/"]','[data-testid="comment_author_link"]','[slot="authorName"]'],avatars:['[slot="user-avatar"]','[data-testid="user-avatar"]','img[alt*="avatar"]'],media:['main img','main video','shreddit-post img','shreddit-post video','shreddit-player']}
};
function buildPrivacyCSS(id,input){if(!services.some(s=>s.id===id))throw new Error('Unknown service');const p=normalizePrivacy(input);if(!p.enabled)return '';const t=targets[id];const rules=[];
 function blur(selectors,hover=true){if(!selectors.length)return;const sel=':is('+selectors.join(',')+')';rules.push(sel+'{filter:blur('+p.strength+'px) !important;user-select:none !important;}');if(p.revealOnHover&&hover)rules.push(sel+':hover{filter:none !important;user-select:auto !important;}');}
 if(p.fullPage){blur(['body'],false);}else{
  for(const category of ['messages','names','avatars','media'])if(p[category])blur(t[category]);
  if(p.media)blur(['iframe']);
  // Cover the whole page when the provider's expected content root is unavailable.
  if(['messages','names','avatars','media'].some(k=>p[k]))rules.push('body:not(:has('+t.roots.join(',')+')){filter:blur('+p.strength+'px) !important;}');
 }
 return rules.join('\n');
}
class PrivacySheet {
 constructor(wc,id){this.wc=wc;this.id=id;this.key=null;this.chain=Promise.resolve();this.generation=0;}
 navigated(){this.key=null;this.generation++;}
 apply(input){const generation=this.generation;const css=buildPrivacyCSS(this.id,input);const work=async()=>{if(this.wc.isDestroyed()||generation!==this.generation)return;const previous=this.key;let next=null;
  if(css)next=await this.wc.insertCSS(css,{cssOrigin:'user'});
  if(this.wc.isDestroyed())return;
  if(generation!==this.generation){if(next)await this.wc.removeInsertedCSS(next).catch(()=>{});return;}
  this.key=next;if(previous)await this.wc.removeInsertedCSS(previous);
 };const task=this.chain.catch(()=>{}).then(work);this.chain=task;return task;}
}
module.exports={defaults,normalizePrivacy,targets,buildPrivacyCSS,PrivacySheet};
