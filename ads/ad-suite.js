/* ============================================================
   KLAIM — Diner Ad Suite · render engine (vanilla JS)
   3 concepts × 4 native formats, animated + static.
   ============================================================ */

/* ---------- formats (native sizes) ---------- */
const FORMATS = [
  { id:'916', w:1080, h:1920, ratio:'9 : 16', name:'Vertical',
    plats:'TikTok · Reels · IG/FB Stories · Snapchat · YT Shorts', lay:'tall',
    pdim:'9x16', pword:'vertical', gif:'9x16' },
  { id:'45',  w:1080, h:1350, ratio:'4 : 5',  name:'Portrait',
    plats:'Instagram & Facebook feed', lay:'tall',
    pdim:'4x5', pword:'portrait', gif:null },
  { id:'11',  w:1080, h:1080, ratio:'1 : 1',  name:'Square',
    plats:'Instagram & Facebook feed', lay:'wide',
    pdim:'1x1', pword:'square', gif:null },
  { id:'169', w:1920, h:1080, ratio:'16 : 9', name:'Landscape',
    plats:'YouTube in-stream · display', lay:'wide',
    pdim:'16x9', pword:'landscape', gif:'16x9' },
];

/* ---------- concepts ---------- */
const CONCEPTS = [
  {
    id:'paid', idx:'01', theme:'t-cream',
    name:'Get paid to eat out',
    desc:'Flagship message — <b>real cash, not points.</b> Cashback lands in your actual bank account. Leads the suite.',
    eyebrow:'Real cash · not points',
    head:[{t:'Get '},{t:'paid',hl:true},{t:' to eat out.'}],
    sub:'Real cashback in actual pounds — sent straight to the bank account you already use. Not points. Not vouchers. Money.',
    foot:['Free for diners','London','GBP cashback'],
    motif:'cash',
  },
  {
    id:'drops', idx:'02', theme:'t-ink',
    name:'Twice-weekly drops',
    desc:'Builds the ritual — <b>new cashback drops every Monday & Friday at 9am.</b> Curated London spots, never the chains.',
    eyebrow:'Every Mon & Fri · 9am',
    head:[{t:'Fresh '},{t:'drops',hl:true},{t:', twice a week.'}],
    sub:'Curated London spots land in your app every Monday & Friday at 9am. Tap one, go eat, get paid.',
    foot:['Soho','Shoreditch','Borough','Marylebone & beyond'],
    motif:'countdown',
  },
  {
    id:'seconds', idx:'03', theme:'t-lime',
    name:'Cash in seconds',
    desc:'Kills the friction — <b>no codes, no QR.</b> Tap the card you already use; Open Banking fires the cash to your bank in seconds.',
    eyebrow:'No codes · no QR · no faff',
    head:[{t:'Cash in your bank in '},{t:'seconds',hl:true},{t:'.'}],
    sub:'Tap the card you already use. Open Banking does the rest — money lands before pudding does.',
    foot:['FCA-regulated Open Banking','iOS & Android'],
    motif:'tap',
  },
];

/* ---------- phone screen (mirrors Klaim app Drops home) ---------- */
function phoneScreen(){
  return `
  <div class="phone">
    <div class="notch"></div>
    <div class="screen">
      <div class="ph-sb"><span>9:41</span><span>●●● 100%</span></div>
      <div class="ph-app">
        <div class="ph-head">
          <div class="ph-eye">Friday · Drops</div>
          <div class="ph-title">45 spots, one good <span class="hl">weekend.</span></div>
          <div class="ph-cds">
            <span class="ph-cd"><span class="dot tickdot"></span>Closes in <b class="js-count">2d 14h 22m</b></span>
            <span class="ph-cd ghost"><b>45</b> live near you</span>
          </div>
        </div>
        <div class="ph-secl"><span>✦ Curated for you</span><span class="sub">Friday drop</span></div>
        <div class="ph-rail">
          <div class="ph-card ph-hero">
            <div class="ph-photo"><img class="ph-img" crossorigin="anonymous" src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&amp;fit=crop&amp;w=600&amp;q=85" alt="" /><div class="ph-tag">Top pick</div><div class="ph-match"><span class="dot"></span>96% match</div></div>
            <div class="ph-cbody">
              <div class="ph-ctop"><div><div class="ph-nm">Dishoom</div><div class="ph-meta">Shoreditch · Indian · ££</div></div><div class="ph-amt">+£18</div></div>
              <div class="ph-foot"><span>★ 4.7</span><span class="ph-fdot"></span><span>0.6 mi</span><span class="ph-fdot"></span><span>min £35</span></div>
            </div>
          </div>
          <div class="ph-card">
            <div class="ph-photo"><img class="ph-img" crossorigin="anonymous" src="https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&amp;fit=crop&amp;w=600&amp;q=85" alt="" /><div class="ph-tag">Walk-in</div><div class="ph-match"><span class="dot"></span>92%</div></div>
            <div class="ph-cbody">
              <div class="ph-ctop"><div><div class="ph-nm">Padella</div><div class="ph-meta">Borough · Italian · ££</div></div><div class="ph-amt">+£12</div></div>
              <div class="ph-foot"><span>★ 4.6</span><span class="ph-fdot"></span><span>1.2 mi</span></div>
            </div>
          </div>
        </div>
        <div class="ph-banner"><b>£6 from your weekly £40 streak.</b>One more drop locks a £5 bonus.</div>
        <div class="ph-tabs">
          <div class="ph-tab active"><div class="ic"><svg viewBox="0 0 24 24"><path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3Z"/></svg></div>Drops</div>
          <div class="ph-tab"><div class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/></svg></div>Klaims</div>
          <div class="ph-tab"><div class="ic"><svg viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg></div>Trade</div>
          <div class="ph-tab"><div class="ic"><svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7a3 3 0 0 1 0 6M21 19a5.5 5.5 0 0 0-3-5"/></svg></div>Buddies</div>
          <div class="ph-tab"><div class="ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></div>You</div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------- floating proof / motif per concept ---------- */
const APPLE = '<svg viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.8 2.4-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.4-1-2.4-3.6zM14.3 5.5c.6-.8 1.1-1.9.9-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z"/></svg>';
const PLAY  = '<svg viewBox="0 0 24 24"><path d="M4 3.5v17l9.5-8.5L4 3.5zm11.2 6.3 2.6 2.2-2.6 2.2-2.3-2.2 2.3-2.2zM6 4.8l8 4.5-1.8 1.7L6 4.8zm0 14.4 6.2-6.2L14 14.7 6 19.2z"/></svg>';

function proofs(concept, lay){
  const wide = lay==='wide';
  if(concept.motif==='cash'){
    // cycling receipts that read as "cash keeps landing"
    const receipts = [
      {ic:'🍛',c:'lime',amt:'+£18.00',sub:'Dishoom → Monzo'},
      {ic:'🍞',c:'pink',amt:'+£32.00',sub:'St. JOHN → Monzo'},
      {ic:'🍝',c:'ink', amt:'+£12.50',sub:'Padella → Starling'},
    ];
    const rPos = wide ? 'top:84px;right:-34px' : 'top:96px;right:-72px';
    const bPos = wide ? 'bottom:200px;left:-40px' : 'bottom:150px;left:-86px';
    const cyc = receipts.map((r,i)=>`
      <div class="proof cyc d${i}" style="${rPos}">
        <div class="pic ${r.c}">${r.ic}</div>
        <div class="tx"><strong class="amt">${r.amt}</strong><span>${r.sub}</span></div>
      </div>`).join('');
    const badge = `
      <div class="proof pf-b pop" style="${bPos}">
        <div class="pic ink">£</div>
        <div class="tx"><strong>£127 back</strong><span>this month, doing nothing</span></div>
      </div>`;
    return cyc + badge;
  }
  if(concept.motif==='countdown'){
    const aPos = wide ? 'top:70px;right:-34px' : 'top:78px;right:-78px';
    const bPos = wide ? 'bottom:188px;left:-40px' : 'bottom:158px;left:-84px';
    return `
      <div class="proof pf-a" style="${aPos}">
        <div class="pic lime">🟢</div>
        <div class="tx"><strong>Drop just landed</strong><span>3 new spots near you</span></div>
      </div>
      <div class="proof pf-b" style="${bPos}">
        <div class="pic pink">👥</div>
        <div class="tx"><strong>3 friends going</strong><span>Fri · St. JOHN · 19:30</span></div>
      </div>`;
  }
  // tap / seconds
  const nPos = wide ? 'top:84px;right:-36px' : 'top:90px;right:-90px';
  return `
    <div class="tap-ring tapring" style="bottom:300px;left:50%;margin-left:-48px">
      <svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10h1V6.5a1.5 1.5 0 0 1 3 0V11h1V8a1.5 1.5 0 0 1 3 0v6.5c0 3-2.2 5.5-5.5 5.5H13c-2 0-3-.7-4.2-2.2l-2.5-3.4a1.6 1.6 0 0 1 2.5-2L9 11z"/></svg>
    </div>
    <div class="banknotif bnotif" style="${nPos}">
      <div class="logo">£</div>
      <div class="tx"><div class="row1"><span>●</span> Faster Payments · now</div><strong><em>£18.00</em> received</strong></div>
    </div>`;
}

/* ---------- one ad board ---------- */
function buildBoard(concept, fmt){
  const board = document.createElement('div');
  board.className = `board f-${fmt.id} ${concept.theme} play`;
  board.dataset.concept = concept.id;
  board.dataset.fmt = fmt.id;

  const headHTML = concept.head.map(p=> p.hl ? `<span class="hl">${p.t}</span>` : p.t).join('');
  const footHTML = concept.foot.map((f,i)=> (i? '<span class="fdot"></span>':'') + `<span>${f}</span>`).join('');
  const eyebrowHTML = `<span class="ad-eyebrow"><span class="pdot tickdot"></span>${concept.eyebrow}</span>`;

  const textCol = `
    <div class="ad-col">
      <div class="ad-brand"><span class="mk">K</span><span class="nm">Klaim</span></div>
      ${eyebrowHTML}
      <h2 class="ad-head">${headHTML}</h2>
      <p class="ad-sub">${concept.sub}</p>
      <div class="ad-cta">
        <span class="cta-btn">Get the app →</span>
        <span class="store-badge">${APPLE} App Store</span>
        <span class="store-badge">${PLAY} Google Play</span>
      </div>
      <div class="ad-foot">${footHTML}</div>
    </div>`;

  const phoneCol = `
    <div class="phone-col">
      <div class="phone-stage">
        ${phoneScreen()}
        ${proofs(concept, fmt.lay)}
      </div>
    </div>`;

  const ad = document.createElement('div');
  if(fmt.lay==='tall'){
    ad.className='ad ad-tall';
    ad.innerHTML = textCol + phoneCol;
  }else{
    ad.className='ad ad-wide';
    ad.innerHTML = textCol + phoneCol;
  }
  board.appendChild(ad);
  return board;
}

/* ---------- gallery assembly ---------- */
function fitScale(fmt, maxH){
  return Math.min(maxH/fmt.h, 560/fmt.w);
}
/* ---------- asset download helper ---------- */
function triggerDownload(path, name){
  const a=document.createElement('a');
  a.href=path; a.download=name;
  document.body.appendChild(a); a.click(); a.remove();
}

/* full asset manifest (PNG × 12, GIF × 6) */
function allAssets(){
  const out=[];
  CONCEPTS.forEach((concept,ci)=>{
    FORMATS.forEach((fmt,fi)=>{
      const num=String(ci*4+fi+1).padStart(2,'0');
      out.push({path:`png/${num}_${concept.id}_${fmt.pdim}_${fmt.pword}.png`,name:`klaim_${concept.id}_${fmt.pdim}_${fmt.pword}.png`});
      if(fmt.gif) out.push({path:`gif/${concept.id}_${fmt.gif}.gif`,name:`klaim_${concept.id}_${fmt.gif}.gif`});
    });
  });
  return out;
}
async function downloadAll(btn){
  const items=allAssets();
  const lab=btn.querySelector('.lab'); const orig=lab.textContent; btn.disabled=true;
  for(let i=0;i<items.length;i++){
    lab.textContent=`Downloading ${i+1}/${items.length}…`;
    triggerDownload(items[i].path,items[i].name);
    await new Promise(r=>setTimeout(r,350));
  }
  lab.textContent='✓ Done'; setTimeout(()=>{lab.textContent=orig; btn.disabled=false;},1600);
}

function buildGallery(){
  const root = document.getElementById('gallery');
  CONCEPTS.forEach((concept,ci)=>{
    const sec = document.createElement('section');
    sec.className='concept-sec';
    sec.dataset.concept = concept.id;
    sec.innerHTML = `
      <div class="concept-head">
        <span class="concept-idx">CONCEPT ${concept.idx}</span>
        <span class="concept-name">${concept.name}</span>
      </div>
      <p class="concept-desc">${concept.desc}</p>`;
    const row = document.createElement('div');
    row.className='format-row';
    FORMATS.forEach((fmt,fi)=>{
      const frame=document.createElement('div');
      frame.className='frame';

      // asset paths for this concept × format
      const num = String(ci*4 + fi + 1).padStart(2,'0');
      const pngPath = `png/${num}_${concept.id}_${fmt.pdim}_${fmt.pword}.png`;
      const pngName = `klaim_${concept.id}_${fmt.pdim}_${fmt.pword}.png`;
      const gifPath = fmt.gif ? `gif/${concept.id}_${fmt.gif}.gif` : null;
      const gifName = fmt.gif ? `klaim_${concept.id}_${fmt.gif}.gif` : null;

      const cap=document.createElement('div');
      cap.className='frame-cap';
      cap.innerHTML = `
        <div class="ratio">${fmt.ratio} <span>${fmt.name}</span></div>
        <div class="plats">${fmt.plats}</div>
        <div class="dims">${fmt.w} × ${fmt.h}px · PNG${fmt.gif?' + GIF':''}</div>
        <div class="dl-row">
          <button class="dl dl-png" type="button">↓ PNG</button>
          ${fmt.gif?'<button class="dl dl-gif" type="button">↓ GIF</button>':''}
        </div>`;
      cap.querySelector('.dl-png').addEventListener('click',()=>triggerDownload(pngPath,pngName));
      if(fmt.gif) cap.querySelector('.dl-gif').addEventListener('click',()=>triggerDownload(gifPath,gifName));
      const scale = (fmt.lay==='tall') ? fitScale(fmt, 520) : fitScale(fmt, 320);
      const wrap=document.createElement('div');
      wrap.className='board-scale';
      wrap.style.width = (fmt.w*scale)+'px';
      wrap.style.height = (fmt.h*scale)+'px';
      const board = buildBoard(concept, fmt);
      board.style.transform = `scale(${scale})`;
      wrap.appendChild(board);
      frame.appendChild(cap);
      frame.appendChild(wrap);
      row.appendChild(frame);
    });
    sec.appendChild(row);
    root.appendChild(sec);
  });
}

/* ---------- live countdown tick (drops realism) ---------- */
let remain = 2*86400 + 14*3600 + 22*60 + 6;
function fmtCount(s){
  const d=Math.floor(s/86400); s-=d*86400;
  const h=Math.floor(s/3600);  s-=h*3600;
  const m=Math.floor(s/60);    const ss=s-m*60;
  return `${d}d ${h}h ${m}m ${String(ss).padStart(2,'0')}s`;
}
function tickCount(){
  if(window.__gif) return;
  remain = remain>0 ? remain-1 : 0;
  const t = fmtCount(remain);
  document.querySelectorAll('.js-count').forEach(el=> el.textContent = t);
}

/* ---------- controls ---------- */
function setPlay(on){
  document.querySelectorAll('.board').forEach(b=> b.classList.toggle('play', on));
  document.getElementById('btn-motion').classList.toggle('on', on);
  document.getElementById('btn-motion').querySelector('.lab').textContent = on? 'Motion: on' : 'Motion: off';
}

/* ---------- solo render (overlay one full board; used by export + ?solo=) ---------- */
function renderSolo(cid, fid, motion){
  document.getElementById('solo-stage')?.remove();
  const concept = CONCEPTS.find(c=>c.id===cid);
  const fmt = FORMATS.find(f=>f.id===fid);
  if(!concept||!fmt) return;
  const stage=document.createElement('div');
  stage.id='solo-stage';
  stage.style.cssText='position:fixed;inset:0;z-index:9999;display:block;background:#0a0612;overflow:hidden';
  const board=buildBoard(concept,fmt);
  if(!motion) board.classList.remove('play');
  const fit = Math.min((window.innerWidth-40)/fmt.w,(window.innerHeight-40)/fmt.h);
  const holder=document.createElement('div');
  holder.style.cssText=`position:absolute;left:50%;top:50%;width:${fmt.w*fit}px;height:${fmt.h*fit}px;transform:translate(-50%,-50%)`;
  board.style.position='absolute'; board.style.top='0'; board.style.left='0';
  board.style.transform=`scale(${fit})`; board.style.transformOrigin='top left';
  holder.appendChild(board);
  stage.appendChild(holder);
  document.body.appendChild(stage);
}
window.renderSolo = renderSolo;

/* ---------- GIF-export render: board at top-left, fit-by-height,
   wrapped in a #ff00ff sentinel frame so run_script can auto-crop ---------- */
function renderGif(cid, fid){
  document.getElementById('solo-stage')?.remove();
  document.getElementById('gif-stage')?.remove();
  const concept = CONCEPTS.find(c=>c.id===cid);
  const fmt = FORMATS.find(f=>f.id===fid);
  if(!concept||!fmt) return;
  const stage=document.createElement('div');
  stage.id='gif-stage';
  stage.style.cssText='position:fixed;inset:0;z-index:9999;background:#ff00ff;overflow:hidden';
  const fit = Math.min((window.innerWidth-8)/fmt.w,(window.innerHeight-8)/fmt.h);
  const bw=Math.round(fmt.w*fit), bh=Math.round(fmt.h*fit);
  // sentinel: 2px magenta border framing exactly the board
  const frame=document.createElement('div');
  frame.style.cssText=`position:absolute;left:2px;top:2px;width:${bw}px;height:${bh}px;background:#0a0612`;
  const board=buildBoard(concept,fmt);
  board.style.position='absolute'; board.style.top='0'; board.style.left='0';
  board.style.transform=`scale(${fit})`; board.style.transformOrigin='top left';
  frame.appendChild(board);
  stage.appendChild(frame);
  document.body.appendChild(stage);
  window.__gif=true;
  stage.querySelectorAll('.js-count').forEach(el=> el.textContent='2d 14h 22m 05s');
  return {bw,bh};
}
window.renderGif = renderGif;

/* deterministic frame scrub — pause every animation and offset it to time t */
function gifScrub(t){
  const sel='.pf-a,.pf-b,.cyc,.tapring,.bnotif,.tickdot,.pop';
  document.querySelectorAll('#gif-stage '+sel).forEach(el=>{
    if(el.dataset.bd===undefined){
      el.dataset.bd = parseFloat(getComputedStyle(el).animationDelay)||0;
    }
    el.style.animationPlayState='paused';
    el.style.animationDelay=(parseFloat(el.dataset.bd)-t)+'s';
  });
}
window.gifScrub = gifScrub;

/* ---------- solo export mode (?solo=conceptId-fmtId) ---------- */
function soloMode(key, motion){
  document.body.classList.add('solo');
  const [cid,fid] = key.split('-');
  document.querySelectorAll('.concept-sec').forEach(s=> s.classList.add('hidden'));
  renderSolo(cid, fid, motion);
}

/* ---------- boot ---------- */
window.addEventListener('DOMContentLoaded',()=>{
  const params = new URLSearchParams(location.search);
  const solo = params.get('solo');
  if(solo){ soloMode(solo, params.get('motion')!=='0'); setInterval(tickCount,1000); return; }
  buildGallery();
  setInterval(tickCount,1000);
  document.getElementById('btn-motion').addEventListener('click',()=>{
    const on = !document.getElementById('btn-motion').classList.contains('on');
    setPlay(on);
  });
  document.getElementById('btn-dl-all').addEventListener('click',(e)=>downloadAll(e.currentTarget));
});
