'use strict';
const root=document.documentElement,themeButton=document.getElementById('theme-toggle');
// Each fresh page load starts light; the visitor can switch for this visit.
function applyTheme(theme){root.dataset.theme=theme;const dark=theme==='dark';themeButton.setAttribute('aria-pressed',String(dark));themeButton.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');document.getElementById('theme-label').textContent=dark?'Light mode':'Dark mode';document.querySelector('meta[name="theme-color"]').content=dark?'#1b2330':'#eae0d2';}
applyTheme('light');themeButton.addEventListener('click',()=>applyTheme(root.dataset.theme==='dark'?'light':'dark'));
const nav=document.getElementById('main-nav'),menuButton=document.getElementById('menu-toggle');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.querySelectorAll('a,button').forEach(el=>el.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>1050)closeMenu();});
const dialog=document.getElementById('resume-dialog');
document.querySelectorAll('[data-resume]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
document.getElementById('close-resume').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
const sections=['collections','journey','education','contact'].map(id=>document.getElementById(id));
const navLinks=[...nav.querySelectorAll('a[href^="#"]'),...document.querySelectorAll('.mobile-actions a')];let ticking=false;
function updateScroll(){const total=root.scrollHeight-window.innerHeight;document.getElementById('reading-progress').style.width=(total>0?Math.min(100,Math.max(0,scrollY/total*100)):0)+'%';let current='';sections.forEach(section=>{if(section.getBoundingClientRect().top<innerHeight*.35)current=section.id;});navLinks.forEach(link=>{const active=link.hash==='#'+current;link.classList.toggle('nav-active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});ticking=false;}
function scheduleScroll(){if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}}
window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',scheduleScroll);window.addEventListener('load',scheduleScroll);document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',scheduleScroll));
const filters=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('[data-category]')];
function filterCards(value){filters.forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});let count=0;cards.forEach(card=>{card.hidden=value!=='all'&&card.dataset.category!==value;if(!card.hidden)count++;});document.getElementById('filter-count').textContent='Showing '+count+' of '+cards.length+' collections';scheduleScroll();}
filters.forEach(button=>button.addEventListener('click',()=>filterCards(button.dataset.filter)));
function revealHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(e){return;}const card=cards.find(card=>card.id===id);if(!card)return;filterCards('all');card.classList.add('collection-highlight');requestAnimationFrame(()=>{card.scrollIntoView({block:'center',behavior:'auto'});card.focus({preventScroll:true});});setTimeout(()=>card.classList.remove('collection-highlight'),5000);}
window.addEventListener('hashchange',revealHash);window.addEventListener('load',revealHash);
const linkNotice=document.getElementById('link-notice');let noticeTimer;
function showLinkNotice(message){clearTimeout(noticeTimer);linkNotice.textContent=message;linkNotice.classList.add('visible');noticeTimer=setTimeout(()=>linkNotice.classList.remove('visible'),5000);}
document.querySelectorAll('[data-new-tab]').forEach(link=>{const email=link.getAttribute('href').startsWith('mailto:'),size=link.dataset.pdfSize;const message=size?'Opens a '+size+' PDF in a new tab. Loading depends on your internet connection.':email?'Opens your email app or a new tab.':'Opens in a new tab. Your portfolio stays here.';['mouseenter','focus','click'].forEach(event=>link.addEventListener(event,()=>showLinkNotice(message)));});
document.querySelectorAll('a[download]').forEach(link=>link.addEventListener('click',()=>showLinkNotice('Downloading the resume. Your portfolio stays here.')));
async function copyText(value,label){let copied=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);copied=true;}}catch(e){}if(!copied){const input=document.createElement('textarea');input.value=value;input.style.cssText='position:fixed;top:0;left:0;opacity:0;';document.body.append(input);input.focus();input.select();input.setSelectionRange(0,value.length);try{copied=document.execCommand('copy');}catch(e){}input.remove();}if(copied)showLinkNotice(label+' copied.');else window.prompt('Copy '+label.toLowerCase()+':',value);}
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',()=>copyText(button.dataset.copy,button.dataset.copyLabel)));
document.querySelectorAll('[data-copy-project]').forEach(button=>button.addEventListener('click',()=>{const base=location.protocol==='file:'?'https://srishti21singh.github.io/Portfolio/':location.href.split('#')[0].split('?')[0];copyText(base+'#'+button.dataset.copyProject,'Collection link');}));
const whatsappButton=document.getElementById('whatsapp-toggle'),whatsappPanel=document.getElementById('whatsapp-panel');
function closeWhatsapp(){whatsappPanel.hidden=true;whatsappButton.setAttribute('aria-expanded','false');}
whatsappButton.addEventListener('click',()=>{whatsappPanel.hidden=!whatsappPanel.hidden;whatsappButton.setAttribute('aria-expanded',String(!whatsappPanel.hidden));});document.getElementById('close-whatsapp').addEventListener('click',()=>{closeWhatsapp();whatsappButton.focus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(nav.classList.contains('is-open')){closeMenu();menuButton.focus();}if(!whatsappPanel.hidden){closeWhatsapp();whatsappButton.focus();}}});
document.getElementById('year').textContent=new Date().getFullYear();updateScroll();
