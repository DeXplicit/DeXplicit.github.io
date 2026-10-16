'use strict';
const data = window.DEX_DATA;
const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let previewsPaused = reducedMotion;
const previewVideos = [...document.querySelectorAll('.hero-reel video, .method-streams video')];
const inView = new WeakMap();
function loadVideo(v) { if (v.dataset.src) { v.src = v.dataset.src; delete v.dataset.src; v.load(); } }
function tryPlay(v) { loadVideo(v); const p = v.play(); if (p) p.catch(() => {}); }
const previewObserver = new IntersectionObserver(entries => entries.forEach(({target:v,isIntersecting}) => {
  inView.set(v,isIntersecting);
  if (isIntersecting && !previewsPaused) tryPlay(v); else v.pause();
}), {threshold:0.2});
previewVideos.forEach(v => { v.playbackRate = 0.5; if (reducedMotion) { v.autoplay = false; v.pause(); } previewObserver.observe(v); });
function motionLabel() { $('motion-toggle').textContent = previewsPaused ? '▶ Play previews' : 'Ⅱ Pause previews'; $('motion-toggle').setAttribute('aria-pressed',String(previewsPaused)); }
$('motion-toggle').addEventListener('click',() => { previewsPaused = !previewsPaused; motionLabel(); previewVideos.forEach(v => { if (previewsPaused) v.pause(); else if (inView.get(v)) tryPlay(v); }); });
motionLabel();
// The two comparison videos share a clock. Seeking is by original frame index.
const reference = $('rgb-reference'), prediction = $('rgb-prediction');
let selected = data.rgb[0], framing = 'crop', wantPlay = false, selectionVersion = 0;
let comparisonVisible = false;
const frameTime = () => Number.isFinite(reference.duration) ? reference.duration / 33 : 1/15;
function showPlayState() { $('rgb-play').textContent = wantPlay ? 'Ⅱ' : '▶'; $('rgb-play').setAttribute('aria-label',wantPlay ? 'Pause comparison' : 'Play comparison'); }
function pausePair() { wantPlay=false; reference.pause(); prediction.pause(); showPlayState(); }
function playPair() { wantPlay=true; reference.playbackRate=prediction.playbackRate=Number($('rgb-speed').value); if (Math.abs(prediction.currentTime-reference.currentTime)>.03) prediction.currentTime=reference.currentTime; tryPlay(reference); tryPlay(prediction); showPlayState(); }
function seekPair(frame) { const t=Math.min(Number(frame)*frameTime(),Math.max(0,(reference.duration||2.2)-.02)); reference.currentTime=t; prediction.currentTime=t; syncLabels(); }
function syncLabels() { const frame=Math.min(32,Math.max(0,Math.floor(reference.currentTime/frameTime()+.01))); $('rgb-timeline').value=frame; $('rgb-frame').textContent=String(frame).padStart(2,'0')+' / 32'; }
function setScene(scene) {
  selected=scene; selectionVersion++; const version=selectionVersion;
  reference.pause(); prediction.pause();
  const suffix=framing==='crop'?'-crop':'';
  [reference,prediction].forEach((v,i) => { const type=i?'dexplicit':'reference'; v.poster=scene.base+'/'+type+suffix+'.jpg'; v.src=scene.base+'/'+type+suffix+'.mp4'; v.load(); v.playbackRate=Number($('rgb-speed').value); });
  $('rgb-title').textContent=scene.title; $('rgb-tag').textContent=scene.tag; $('rgb-description').textContent=scene.description;
  $('rgb-source').textContent='HOT3D · Appendix '+scene.paperLabel;
  document.querySelectorAll('.scene-button').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.scene===scene.id)));
  $('rgb-timeline').value=0; $('rgb-frame').textContent='00 / 32';
  const ready=()=>{ if(version===selectionVersion && reference.readyState>=2 && prediction.readyState>=2 && wantPlay && comparisonVisible) playPair(); };
  reference.addEventListener('canplay',ready,{once:true}); prediction.addEventListener('canplay',ready,{once:true});
}
for (const scene of data.rgb) {
  const b=document.createElement('button'); b.className='scene-button'; b.dataset.scene=scene.id; b.setAttribute('aria-pressed','false'); b.setAttribute('aria-label',scene.title);
  const img=document.createElement('img'); img.src=scene.base+'/dexplicit-crop.jpg'; img.alt=''; img.loading='lazy';
  const label=document.createElement('span'); label.className='scene-label'; label.textContent=scene.title; label.appendChild(document.createElement('i'));
  b.append(img,label); b.addEventListener('click',()=>setScene(scene)); $('rgb-selector').append(b);
}
$('rgb-play').addEventListener('click',()=>wantPlay?pausePair():playPair());
$('rgb-restart').addEventListener('click',()=>{ seekPair(0); if(wantPlay) playPair(); });
$('rgb-timeline').addEventListener('input',e=>{ pausePair(); seekPair(e.target.value); });
$('rgb-speed').addEventListener('change',e=>{reference.playbackRate=prediction.playbackRate=Number(e.target.value);});
document.querySelectorAll('input[name=framing]').forEach(input=>input.addEventListener('change',()=>{framing=input.value;setScene(selected);}));
reference.addEventListener('timeupdate',()=>{ syncLabels(); if(wantPlay && Math.abs(reference.currentTime-prediction.currentTime)>.07) prediction.currentTime=reference.currentTime; });
reference.addEventListener('ended',()=>{if(wantPlay){seekPair(0);playPair();}});
reference.addEventListener('error',()=>{pausePair();$('rgb-description').textContent='This clip could not be loaded. Please open the page from its complete project folder.';});
new IntersectionObserver(entries=>{comparisonVisible=entries[0].isIntersecting;if(!comparisonVisible){reference.pause();prediction.pause();}else if(wantPlay)playPair();},{threshold:.15}).observe($('rgb-gallery'));
document.querySelectorAll('[data-select]').forEach(a=>a.addEventListener('click',()=>{const s=data.rgb.find(s=>s.id===a.dataset.select); if(s)setScene(s);}));
setScene(selected);showPlayState();
// Recorded RGB and both saved 3D views use the same 33-state clock.
const geometryVideos = [$('geometry-rgb'), $('geometry-prediction'), $('geometry-reference')];
const geometryClock = geometryVideos[0];
let geometryScene = data.geometry[0], geometryPlaying = false, geometryVersion = 0, geometryVisible = false;
let geometryDownload, geometryObjectUrls = [], geometryLoading = false;
function geometryControls(disabled) {
  ['geometry-play', 'geometry-restart', 'geometry-timeline', 'geometry-speed'].forEach(id => { $(id).disabled = disabled; });
}
async function loadGeometryMedia(s, version) {
  const controller = geometryDownload = new AbortController();
  try {
    // Complete local blobs keep frame seeking reliable when the host omits byte-range support.
    const blobs = await Promise.all(['reference-rgb', 'prediction-3d', 'reference-3d'].map(async name => {
      const response = await fetch(s.base + '/' + name + '.mp4', {signal: controller.signal});
      if (!response.ok) throw new Error('Video unavailable');
      return response.blob();
    }));
    if (version !== geometryVersion) return;
    geometryObjectUrls = blobs.map(blob => URL.createObjectURL(blob));
    geometryVideos.forEach((v, i) => { v.src = geometryObjectUrls[i]; v.load(); v.playbackRate = Number($('geometry-speed').value); });
  } catch (error) {
    if (version !== geometryVersion || error.name === 'AbortError') return;
    pauseGeometry();
    $('geometry-status').textContent = 'A comparison video could not be loaded. Select the example again to retry.';
  }
}
function geometryPlayLabel() {
  $('geometry-play').textContent = geometryPlaying ? 'Ⅱ' : '▶';
  $('geometry-play').setAttribute('aria-label', geometryPlaying ? 'Pause 3D comparison' : 'Play 3D comparison');
}
function geometryLabels() {
  const frame = Math.min(32, Math.max(0, Math.floor(geometryClock.currentTime * geometryScene.fps + .01)));
  $('geometry-timeline').value = frame;
  $('geometry-frame').textContent = String(frame).padStart(2, '0') + ' / 32';
}
function pauseGeometry() {
  geometryPlaying = false;
  geometryVideos.forEach(v => v.pause());
  geometryPlayLabel();
}
function seekGeometry(frame) {
  const time = Math.min(32, Math.max(0, Number(frame))) / geometryScene.fps;
  geometryVideos.forEach(v => { v.currentTime = time; });
  geometryLabels();
}
function resumeGeometry() {
  if (!geometryPlaying || !geometryVisible || geometryVideos.some(v => v.readyState < 3)) return;
  const version = geometryVersion;
  geometryVideos.forEach(v => {
    v.playbackRate = Number($('geometry-speed').value);
    if (Math.abs(v.currentTime - geometryClock.currentTime) > .035) v.currentTime = geometryClock.currentTime;
  });
  Promise.all(geometryVideos.map(v => v.play())).catch(error => {
    if (version === geometryVersion && error.name !== 'AbortError') {
      pauseGeometry();
      $('geometry-status').textContent = 'Playback could not start. Press play to try again.';
    }
  });
}
function playGeometry() {
  if (geometryVideos.some(v => v.error)) return;
  if (geometryClock.ended) seekGeometry(0);
  geometryPlaying = true;
  $('geometry-status').textContent = '';
  geometryPlayLabel();
  resumeGeometry();
}
function setGeometry(s) {
  pauseGeometry(); geometryVersion++; geometryScene = s;
  if (geometryDownload) geometryDownload.abort();
  geometryObjectUrls.forEach(url => URL.revokeObjectURL(url)); geometryObjectUrls = [];
  geometryLoading = true; geometryControls(true);
  $('geometry-title').textContent = s.title;
  $('geometry-dataset').textContent = s.dataset + ' / PREDICTED GEOMETRY';
  $('geometry-motion').textContent = s.motion.toFixed(1) + ' mm';
  $('geometry-error').textContent = s.error.toFixed(1) + ' mm';
  $('geometry-status').textContent = 'Loading comparison…';
  ['reference-rgb', 'prediction-3d', 'reference-3d'].forEach((name, i) => {
    const v = geometryVideos[i];
    v.poster = s.base + '/' + name + '.jpg';
    v.removeAttribute('src');
    v.load();
    v.playbackRate = Number($('geometry-speed').value);
  });
  $('geometry-timeline').value = 0; $('geometry-frame').textContent = '00 / 32';
  loadGeometryMedia(s, geometryVersion);
  document.querySelectorAll('#geometry-selector button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === s.id)));
}
for (const s of data.geometry) {
  const b = document.createElement('button'); b.textContent = s.title; b.dataset.id = s.id;
  b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => setGeometry(s)); $('geometry-selector').append(b);
}
$('geometry-play').addEventListener('click', () => geometryPlaying ? pauseGeometry() : playGeometry());
$('geometry-restart').addEventListener('click', () => { seekGeometry(0); if (geometryPlaying) resumeGeometry(); });
$('geometry-timeline').addEventListener('input', e => { pauseGeometry(); seekGeometry(e.target.value); });
$('geometry-speed').addEventListener('change', e => geometryVideos.forEach(v => { v.playbackRate = Number(e.target.value); }));
geometryClock.addEventListener('timeupdate', () => {
  geometryLabels();
  if (geometryPlaying) geometryVideos.slice(1).forEach(v => {
    if (Math.abs(v.currentTime - geometryClock.currentTime) > .04) v.currentTime = geometryClock.currentTime;
  });
});
geometryClock.addEventListener('ended', () => {
  geometryVideos.forEach(v => v.pause());
  if (geometryPlaying) { seekGeometry(0); resumeGeometry(); }
});
geometryVideos.forEach(v => {
  v.addEventListener('canplay', () => {
    if (geometryLoading && geometryVideos.every(video => video.readyState >= 3)) {
      geometryLoading = false; geometryControls(false); $('geometry-status').textContent = '';
    }
    resumeGeometry();
  });
  v.addEventListener('waiting', () => { if (geometryPlaying) geometryVideos.forEach(video => video.pause()); });
  v.addEventListener('error', () => { pauseGeometry(); $('geometry-status').textContent = 'A comparison video could not be loaded. Select the example again to retry.'; });
});
new IntersectionObserver(entries => {
  geometryVisible = entries[0].isIntersecting;
  if (!geometryVisible) pauseGeometry();
}, {threshold: .05}).observe($('geometry-viewer'));
setGeometry(geometryScene);
// Photographic backgrounds are explicitly identified as recorded references.
function setSpatial(s) {
  $('spatial-grid').replaceChildren();
  for(const [key,label] of [['reference','Reference geometry'],['pointworld','PointWorld'],['ours','DeXplicit 3D model']]) {
    const f=document.createElement('figure'),img=document.createElement('img'),cap=document.createElement('figcaption'),metric=document.createElement('span');
    img.src=s.paths[key];img.alt=label+' point overlay for '+s.title.toLowerCase();img.loading='lazy';cap.append(document.createTextNode(label));metric.textContent=key==='reference'?'State '+s.state:(key==='ours'?s.error.ours:s.error.pointworld).toFixed(1)+' mm';cap.append(metric);f.append(img,cap);$('spatial-grid').append(f);
  }
  $('spatial-caption').textContent=s.title+' · '+({'oakink2':'OakInk2','phystwin':'PhysTwin'}[s.dataset]||s.dataset)+' · Geometry over recorded RGB.';
  document.querySelectorAll('#spatial-selector button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===s.id)));
}
for(const s of data.spatial) {const b=document.createElement('button');b.textContent=s.title;b.dataset.id=s.id;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>setSpatial(s));$('spatial-selector').append(b);}setSpatial(data.spatial[2]);
for(const s of data.causal) {const f=document.createElement('figure'),v=document.createElement('video'),cap=document.createElement('figcaption'),tag=document.createElement('span');v.src=s.src;v.poster=s.poster;v.controls=true;v.loop=true;v.muted=true;v.playsInline=true;v.preload='none';v.playbackRate=.5;v.setAttribute('aria-label','Causal generated video: '+s.title);cap.textContent=s.title;tag.textContent='2 steps / block';cap.append(tag);f.append(v,cap);$('causal-grid').append(f);new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:.05}).observe(v);}
for(const [name,pw,ours] of [['HOT3D',90.47,54.34],['OakInk2',83.21,59.95],['PhysTwin',60.41,44.04]]){
  const card=document.createElement('div');card.className='benchmark';const improvement=Math.round((pw-ours)/pw*100);
  card.innerHTML=`<div class="benchmark-heading"><h3>${name}</h3><span>${improvement}% lower error</span></div><div class="bar-row" aria-label="PointWorld: ${pw} millimeters"><i class="bar baseline" style="width:${pw/100*78}%"></i><span>${pw.toFixed(2)}</span></div><div class="bar-row" aria-label="DeXplicit 3D model: ${ours} millimeters"><i class="bar ours" style="width:${ours/100*78}%"></i><span>${ours.toFixed(2)}</span></div>`;
  $('benchmark-grid').append(card);
}
// Navigation reflects the section in view, without changing browser history.
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.topbar nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}}),{rootMargin:'-20% 0px -60% 0px'});
['method','results','geometry','causal'].forEach(id=>navObserver.observe($(id)));
document.addEventListener('visibilitychange',()=>{if(document.hidden){document.querySelectorAll('video').forEach(v=>v.pause());}else{previewVideos.forEach(v=>{if(inView.get(v)&&!previewsPaused)tryPlay(v);});if(wantPlay&&comparisonVisible)playPair();}});

const methodVideos = [...document.querySelectorAll('.method-streams video')];
methodVideos[0].addEventListener('timeupdate',()=>{if(!methodVideos[0].paused)methodVideos.slice(1).forEach(v=>{if(v.readyState>=2 && Math.abs(v.currentTime-methodVideos[0].currentTime)>.1)v.currentTime=methodVideos[0].currentTime;});});
