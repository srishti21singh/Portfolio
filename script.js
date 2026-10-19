'use strict';
const root=document.documentElement;
const themeButton=document.getElementById('theme-toggle');
const media=window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme=null;
try{savedTheme=localStorage.getItem('srishti-theme');}catch(e){}
function applyTheme(theme){root.dataset.theme=theme;const dark=theme==='dark';themeButton.setAttribute('aria-pressed',String(dark));themeButton.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');document.getElementById('theme-label').textContent=dark?'Light mode':'Dark mode';document.querySelector('meta[name="theme-color"]').content=dark?'#1b2330':'#eae0d2';}
applyTheme(savedTheme==='light'||savedTheme==='dark'?savedTheme:(media.matches?'dark':'light'));
themeButton.addEventListener('click',()=>{savedTheme=root.dataset.theme==='dark'?'light':'dark';applyTheme(savedTheme);try{localStorage.setItem('srishti-theme',savedTheme);}catch(e){}});
media.addEventListener('change',e=>{if(!savedTheme)applyTheme(e.matches?'dark':'light');});
let ticking=false;
function progress(){const total=root.scrollHeight-window.innerHeight;document.getElementById('reading-progress').style.width=(total>0?Math.min(100,Math.max(0,window.scrollY/total*100)):0)+'%';ticking=false;}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true;}},{passive:true});window.addEventListener('resize',progress);window.addEventListener('load',progress);progress();
const dialog=document.getElementById('resume-dialog');
document.querySelectorAll('[data-resume]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
document.getElementById('close-resume').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);progress();}));
const menuButton=document.getElementById('menu-toggle');const nav=document.getElementById('main-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.querySelectorAll('a,button').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();menuButton.focus();}});
window.addEventListener('resize',()=>{if(window.innerWidth>1050)closeMenu();});
document.getElementById('year').textContent=new Date().getFullYear();

// Non-blocking notices keep navigation to one click and preserve native new-tab behaviour.
const linkNotice=document.getElementById('link-notice');let noticeTimer;
function showLinkNotice(message){clearTimeout(noticeTimer);linkNotice.textContent=message;linkNotice.classList.add('visible');noticeTimer=setTimeout(()=>{linkNotice.classList.remove('visible');},4500);}
document.querySelectorAll('[data-new-tab]').forEach(link=>{
 const email=link.getAttribute('href').startsWith('mailto:');
 const message=email?'Opens your email app or a new tab.':'This link opens in a new tab. Your portfolio stays here.';
 link.addEventListener('mouseenter',()=>showLinkNotice(message));
 link.addEventListener('focus',()=>showLinkNotice(message));
 link.addEventListener('click',()=>showLinkNotice(email?'Opening your email app or a new tab…':'Opening in a new tab… Your portfolio stays here.'));
});
document.querySelectorAll('a[download]').forEach(link=>link.addEventListener('click',()=>showLinkNotice('Downloading the resume. Your portfolio stays here.')));
