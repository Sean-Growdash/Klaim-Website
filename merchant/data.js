// === Klaim Merchant Portal — mock data ===
window.KD = (function(){
  const venues = [
    { id:'sho', name:'Ember & Oak · Shoreditch', short:'Shoreditch', initials:'EO', zone:'Shoreditch · E1', covers:1242, status:'live' },
    { id:'soh', name:'Ember & Oak · Soho',       short:'Soho',       initials:'EO', zone:'Soho · W1',       covers:986,  status:'live' },
    { id:'mar', name:'Ember & Oak · Marylebone',  short:'Marylebone', initials:'EO', zone:'Marylebone · W1', covers:734,  status:'live' },
    { id:'kgx', name:'Ember & Oak · King\u2019s Cross', short:'King\u2019s Cross', initials:'EO', zone:'King\u2019s Cross · N1', covers:318, status:'scheduled' },
  ];

  const brand = { name:'Ember & Oak', initials:'EO', plan:'Pro', sites:4 };

  // ---- Drops: the engine. Drops land Mon & Fri at 09:00. A campaign ships in a
  // drop and runs the WHOLE drop until the NEXT drop (Mon->Fri, Fri->Mon) unless
  // its budget runs out. You can run MULTIPLE campaigns in one drop (e.g. a £20 offer
  // for new diners + a £10 offer for repeats, or different offers per store).
  const FEE = 1.50; // flat Klaim platform fee per verified cover
  const WINDOW_DAYS = { Mon:['Mon','Tue','Wed','Thu'], Fri:['Fri','Sat','Sun'] };

  function computeDrops(){
    const now = new Date();
    const at9 = d => { const x=new Date(d); x.setHours(9,0,0,0); return x; };
    const fmtD = d => d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
    const nextOf = dow => { for(let i=0;i<14;i++){ const d=new Date(now); d.setDate(d.getDate()+i); if(d.getDay()===dow){ const t=at9(d); if(t>now) return t; } } };
    const nextMon = nextOf(1), nextFri = nextOf(5);
    const next = nextMon < nextFri ? nextMon : nextFri;
    let active=null;
    for(let i=0;i<14;i++){ const d=new Date(now); d.setDate(d.getDate()-i); if(d.getDay()===1||d.getDay()===5){ const t=at9(d); if(t<=now){ active=t; break; } } }
    return { now, next, nextMon, nextFri, active, fmtD,
      nextDay: next.getDay()===1?'Mon':'Fri',
      activeDay: active ? (active.getDay()===1?'Mon':'Fri') : 'Fri',
      windowLabel(day){ const start = day==='Mon'?nextMon:nextFri; const end=new Date(start); end.setDate(end.getDate()+ (day==='Mon'?4:3)); return `${fmtD(start)} → ${fmtD(end)}`; } };
  }

  // money: strip trailing .00 but keep .50 etc
  const gbp = n => '\u00a3' + (Number.isInteger(n) ? n : (+n).toFixed(2));
  // The restaurant FUNDS `cashback` per cover. Klaim takes the flat FEE out of it;
  // the diner sees the remainder in-app. e.g. fund £20 → £1.50 fee → diner sees £18.50.
  const dinerNet = c => +(c.cashback - FEE).toFixed(2);
  const offerLabel = c => `${gbp(dinerNet(c))} back on ${gbp(c.minSpend)}+`;
  const custLabel  = c => ({new:'New diners',repeat:'Repeat diners',all:'All diners'})[c.customerType] || 'All diners';

  // ---- Campaigns (drop-based; whole drop; one offer each; many per drop) ----
  // cid = Klaim-generated campaign ID (database key). cashback = total funded per cover.
  const campaigns = [
    // -- Two campaigns in the SAME Friday drop at Shoreditch: new vs repeat --
    { id:'c1', cid:'KLM-3F7A2', name:'New Diner Welcome', venue:'sho', venueName:'Shoreditch', status:'live',
      cashback:20, minSpend:100, customerType:'new', dropDay:'Fri', recurring:true, entered:6,
      audience:'New to venue · 3km', segments:['young','foodie','new'], radius:3,
      budget:1600, spent:1280, covers:64, revenue:7168, roas:5.6, cpc:20, repeat:0,
      newDiners:64, returningDiners:0, daily:[0,0,0,0,24,22,18], reach:12000 },
    { id:'c2', cid:'KLM-9KQ18', name:'Regulars Reward', venue:'sho', venueName:'Shoreditch', status:'live',
      cashback:10, minSpend:50, customerType:'repeat', dropDay:'Fri', recurring:true, entered:6,
      audience:'Returning diners · 5km', segments:['lapsed','highspend'], radius:5,
      budget:1200, spent:880, covers:88, revenue:5104, roas:5.8, cpc:10, repeat:100,
      newDiners:0, returningDiners:88, daily:[0,0,0,0,34,30,24], reach:3400 },
    { id:'c3', cid:'KLM-2M5D7', name:'Soho Weekend Pull', venue:'soh', venueName:'Soho', status:'live',
      cashback:8, minSpend:40, customerType:'all', dropDay:'Fri', recurring:true, entered:4,
      audience:'Foodies 22\u201334 · 1.5km', segments:['young','foodie','new'], radius:1.5,
      budget:1500, spent:896, covers:112, revenue:5824, roas:6.5, cpc:8, repeat:31,
      newDiners:78, returningDiners:34, daily:[0,0,0,0,42,38,32], reach:9800 },
    { id:'c4', cid:'KLM-6P0C3', name:'Soho Late Bar', venue:'soh', venueName:'Soho', status:'paused',
      cashback:7, minSpend:35, customerType:'all', dropDay:'Fri', recurring:true, entered:5,
      audience:'Night-out crowd · 1km', segments:['genz','young'], radius:1,
      budget:1800, spent:728, covers:104, revenue:4576, roas:6.3, cpc:7, repeat:22,
      newDiners:81, returningDiners:23, daily:[0,0,0,0,0,104,0], reach:11200 },
    // -- Scheduled & pending for the NEXT Monday drop --
    { id:'c5', cid:'KLM-8R4E1', name:'Monday Night Booster', venue:'sho', venueName:'Shoreditch', status:'scheduled',
      cashback:8, minSpend:40, customerType:'all', dropDay:'Mon', recurring:true, entered:3,
      audience:'Gen Z explorers · 1.5km', segments:['genz','new'], radius:1.5,
      budget:800, spent:0, covers:142, revenue:8520, roas:5.8, cpc:8, repeat:38,
      newDiners:88, returningDiners:54, daily:[142,0,0,0,0,0,0], reach:14200, lifetime:true },
    { id:'c6', cid:'KLM-1T9B6', name:'Marylebone Lunch Launch', venue:'mar', venueName:'Marylebone', status:'pending',
      cashback:10, minSpend:30, customerType:'new', dropDay:'Mon', recurring:false, entered:0,
      audience:'Office workers · 800m', segments:['young','highspend','new'], radius:0.8,
      budget:1200, spent:0, covers:0, revenue:0, roas:0, cpc:0, repeat:0,
      newDiners:0, returningDiners:0, daily:[0,0,0,0,0,0,0], reach:6400, pendingReason:'Awaiting budget approval from Finance' },
    // -- Ended & draft --
    { id:'c7', cid:'KLM-5W2H4', name:'King\u2019s Cross Opening Week', venue:'kgx', venueName:'King\u2019s Cross', status:'ended',
      cashback:12, minSpend:50, customerType:'all', dropDay:'Fri', recurring:false, entered:1,
      audience:'New-venue boost · 2km', segments:['genz','young','new','foodie'], radius:2,
      budget:3000, spent:2976, covers:248, revenue:13640, roas:4.6, cpc:12, repeat:21,
      newDiners:206, returningDiners:42, daily:[0,0,0,0,96,88,64], reach:18600 },
    { id:'c8', cid:'KLM-4Y6N9', name:'Sunday Roast Special', venue:'mar', venueName:'Marylebone', status:'draft',
      cashback:8, minSpend:45, customerType:'all', dropDay:'Fri', recurring:false, entered:0,
      audience:'Families & groups · 2km', segments:['young','foodie'], radius:2,
      budget:900, spent:0, covers:0, revenue:0, roas:0, cpc:0, repeat:0,
      newDiners:0, returningDiners:0, daily:[0,0,0,0,0,0,0], reach:5200 },
  ];

  // ---- Funnel + trading/squad enrichment (derived) ----
  // trade = restaurant lets diners swap this drop with friends in-app
  // squad = restaurant boosts cashback when multiple diners come together (social)
  const TRADE_ON = { c1:true, c2:true, c3:true, c4:false, c5:true, c6:true, c7:true, c8:true };
  const SQUAD_ON = { c1:true, c3:true, c5:true, c7:true };
  campaigns.forEach(c=>{
    if(c.covers>0){
      c.klaimed = Math.round(c.covers/0.72);          // claimed the drop
      c.clicked = Math.round(c.klaimed/0.17);          // opened the offer
      c.seen    = Math.round(c.clicked/0.043);         // impressions in drop
    } else { c.klaimed=0; c.clicked=0; c.seen=0; }
    c.trading = TRADE_ON[c.id] ?? true;
    c.squad   = SQUAD_ON[c.id] ? { on:true, maxBonus:3, maxSize:5 } : { on:false, maxBonus:0, maxSize:5 };
    // performance attributable to each mechanic
    c.tradedDrops = c.trading ? Math.round(c.klaimed*0.14) : 0;     // drops swapped friend→friend
    c.tradeCovers = c.trading ? Math.round(c.covers*0.11) : 0;      // covers that came via a traded drop
    c.squadCovers = c.squad.on ? Math.round(c.covers*0.34) : 0;     // covers that came as a group
    c.squadAvgSize = c.squad.on ? 3.2 : 0;
  });

  // funnel stages helper (for one campaign or an array)
  function funnel(c){
    const list = Array.isArray(c) ? c : [c];
    const sum = k => list.reduce((s,x)=>s+(x[k]||0),0);
    return [
      { k:'Seen',    v:sum('seen'),    ic:'eye'   },
      { k:'Clicked', v:sum('clicked'), ic:'link'  },
      { k:'Klaimed', v:sum('klaimed'), ic:'gift'  },
      { k:'Covers',  v:sum('covers'),  ic:'users' },
    ];
  }

  // generate a fresh Klaim campaign ID (for new campaigns)
  function newCid(){
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'; let s='';
    for(let i=0;i<5;i++) s+=chars[Math.floor(Math.random()*chars.length)];
    return 'KLM-'+s;
  }

  // ---- Live cover feed ----
  const firstNames = ['Sara','Matt','Aisha','Leo','Priya','Tom','Maya','Jack','Nina','Omar','Ella','Raj','Chloe','Ben','Yara'];
  const surn = ['R.','K.','H.','M.','D.','S.','B.','T.','P.','A.','W.','C.','L.','N.'];
  const zones = ['Marylebone','Shoreditch','Soho','Hackney','Islington','Dalston','Bethnal Green'];
  function genFeed(n){
    const out=[]; let t = 14*60+32;
    for(let i=0;i<n;i++){
      const visit = Math.random()<0.42 ? (Math.random()<0.5?2:Math.random()<0.6?3:4) : 1;
      const covers = Math.random()<0.5?2:(Math.random()<0.6?1:Math.random()<0.7?4:3);
      const amt = +(covers*(28+Math.random()*42)).toFixed(2);
      const hh=Math.floor(t/60), mm=t%60;
      out.push({
        id:'f'+i,
        name: firstNames[Math.floor(Math.random()*firstNames.length)]+' '+surn[Math.floor(Math.random()*surn.length)],
        init: firstNames[Math.floor(Math.random()*firstNames.length)][0],
        visit, covers, amt,
        zone: zones[Math.floor(Math.random()*zones.length)],
        time: String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0'),
        campaign: Math.random()<0.6?'Quiet Mondays':'Weekend Brunch',
      });
      t -= 8+Math.floor(Math.random()*26);
    }
    return out;
  }
  const feed = genFeed(9);

  // ---- Wallet ----
  const wallet = {
    balance: 4216.40,
    pending: 1284.00,
    autoTopup: true,
    autoThreshold: 500,
    autoAmount: 2000,
    lowBalance: false,
    method: { type:'card', label:'Visa ·· 4471', exp:'08/27' },
    burnRate: 412, // per week
    runwayWeeks: 10,
    txns: [
      { id:'t1', date:'20 Jun 2026', type:'Cover charge', desc:'64 covers · New Diner Welcome (Fri drop)', amount:-1376.00, kind:'spend' },
      { id:'t2', date:'20 Jun 2026', type:'Cover charge', desc:'88 covers · Regulars Reward (Fri drop)', amount:-1012.00, kind:'spend' },
      { id:'t3', date:'20 Jun 2026', type:'Top-up', desc:'Auto top-up · Visa ·· 4471', amount:+2000.00, kind:'topup' },
      { id:'t4', date:'16 Jun 2026', type:'Cover charge', desc:'112 covers · Soho Weekend Pull (Fri drop)', amount:-1064.00, kind:'spend' },
      { id:'t5', date:'13 Jun 2026', type:'Top-up', desc:'Manual · debit card', amount:+3000.00, kind:'topup' },
      { id:'t6', date:'30 May 2026', type:'Platform fee', desc:'May analytics · Pro plan', amount:-599.00, kind:'fee' },
      { id:'t7', date:'23 May 2026', type:'Cover charge', desc:'248 covers · King\u2019s Cross Opening Week', amount:-2964.00, kind:'spend' },
      { id:'t8', date:'20 May 2026', type:'Refund', desc:'6 disputed covers · auto-credited', amount:+90.00, kind:'topup' },
    ],
  };

  // ---- Team / RBAC ----
  const team = [
    { id:'u1', name:'Sean Trevaskis', email:'sean@emberandoak.co.uk', role:'Owner',     venues:'All sites', last:'Active now',   you:true,  init:'ST', av:'#FF6B9D' },
    { id:'u2', name:'Priya Nair',     email:'priya@emberandoak.co.uk', role:'Marketing', venues:'All sites', last:'2h ago',      you:false, init:'PN', av:'#C7FF4F' },
    { id:'u3', name:'Daniel Okafor',  email:'finance@emberandoak.co.uk', role:'Finance', venues:'All sites', last:'Yesterday',  you:false, init:'DO', av:'#5FD3C4' },
    { id:'u4', name:'Hannah Cole',    email:'hannah.sho@emberandoak.co.uk', role:'Venue Manager', venues:'Shoreditch', last:'3d ago', you:false, init:'HC', av:'#FFB627' },
    { id:'u5', name:'Marco Vitale',   email:'marco.soho@emberandoak.co.uk', role:'Venue Manager', venues:'Soho', last:'1w ago', you:false, init:'MV', av:'#FF6B9D' },
  ];
  const invites = [
    { id:'i1', email:'newhire@emberandoak.co.uk', role:'Marketing', sent:'2d ago' },
  ];

  // role permission matrix
  const ROLES = {
    'Owner':         { dashboard:true, campaigns:true, analytics:true, ai:true, wallet:true, team:true, settings:true, edit:true, billing:true, label:'Owner / Admin', desc:'Full access incl. billing, team & all venues' },
    'Marketing':     { dashboard:true, campaigns:true, analytics:true, ai:true, wallet:false, team:false, settings:true, edit:true, billing:false, label:'Marketing Manager', desc:'Campaigns & analytics. No billing or team admin.' },
    'Finance':       { dashboard:true, campaigns:false, analytics:true, ai:false, wallet:true, team:false, settings:false, edit:false, billing:true, label:'Finance', desc:'Budgets, wallet & invoices only.' },
    'Venue Manager': { dashboard:true, campaigns:true, analytics:true, ai:false, wallet:false, team:false, settings:false, edit:true, billing:false, label:'Venue Manager', desc:'Single-location campaigns & analytics.' },
  };

  // ---- Analytics ----
  const analytics = {
    dow: [ // covers by day of week: klaim vs walkin
      { d:'Mon', klaim:88, walkin:42 },
      { d:'Tue', klaim:72, walkin:46 },
      { d:'Wed', klaim:96, walkin:54 },
      { d:'Thu', klaim:118, walkin:64 },
      { d:'Fri', klaim:164, walkin:88 },
      { d:'Sat', klaim:152, walkin:96 },
      { d:'Sun', klaim:104, walkin:70 },
    ],
    trend: [42,51,48,63,72,69,84,91,88,102,118,131], // weekly covers
    cohorts: [ // month acquired, then retention by month
      { m:'Jan', size:210, r:[100,46,38,33,29,27] },
      { m:'Feb', size:264, r:[100,49,41,35,31,0] },
      { m:'Mar', size:312, r:[100,52,44,38,0,0] },
      { m:'Apr', size:388, r:[100,55,46,0,0,0] },
      { m:'May', size:441, r:[100,58,0,0,0,0] },
      { m:'Jun', size:512, r:[100,0,0,0,0,0] },
    ],
    ltv: { first:46, second:58, third:67, blended:124, repeatRate:41, daysToReturn:18 },
    spendMix: [ { l:'New diners', v:64, c:'var(--ink)' }, { l:'Returning', v:36, c:'var(--lime)' } ],
    topDishesNote:'Available with EPOS link (optional)',
  };

  // ---- Benchmarks (anonymised competitive) ----
  const bench = {
    you:{ roas:5.9, cpc:6.6, repeat:41, fillUplift:34 },
    peer:{ roas:4.2, cpc:8.1, repeat:33, fillUplift:21 },
    top:{ roas:7.4, cpc:5.2, repeat:48, fillUplift:46 },
    cohortLabel:'London · Modern European · £30-50 AOV · 14 venues',
  };

  // dynamic benchmark cohort by cuisine / geography / brand
  const BENCH_CUISINES = ['Modern European','Italian','Japanese','British','Small plates','Steakhouse','All cuisines'];
  const BENCH_ZONES = ['All London','Shoreditch','Soho','East London','Central','North London'];
  function benchmark(cuisine, zone, brand){
    const seed = (cuisine.length*7 + zone.length*3 + (brand?brand.length*2:0)) % 9;
    const off = (seed-4); // -4..4
    const peer = { roas:+(4.2+off*0.12).toFixed(1), cpc:+(8.1-off*0.18).toFixed(1), repeat:33+off, fillUplift:21+off };
    const top  = { roas:+(7.4+off*0.10).toFixed(1), cpc:+(5.2-off*0.10).toFixed(1), repeat:48+Math.round(off/2), fillUplift:46+Math.round(off/2) };
    const n = 9 + ((cuisine.length+zone.length)%22);
    const parts = [cuisine, zone, '£30–50 AOV'];
    const label = parts.join(' · ');
    return { you:bench.you, peer, top, n, label,
      brandNote: brand ? `Matched to ${n} venues similar to “${brand}”` : `${n} anonymised venues in this cohort` };
  }

  // ---- Customer base (Advanced Analytics) ----
  const audience = {
    total: 8420,
    reachable: 6240,
    gender: [ {l:'Female',v:54,c:'var(--ink)'}, {l:'Male',v:43,c:'var(--lime)'}, {l:'Other',v:3,c:'var(--pink)'} ],
    age: [ {band:'18–24',v:14},{band:'25–34',v:38},{band:'35–44',v:27},{band:'45–54',v:13},{band:'55+',v:8} ],
    spend: [
      {l:'£0–200 / mo',v:22,c:'var(--cream-3)'},
      {l:'£200–500 / mo',v:41,c:'var(--lime)'},
      {l:'£500–1k / mo',v:26,c:'var(--ink)'},
      {l:'£1k+ / mo',v:11,c:'var(--pink)'},
    ],
    geography: [
      {zone:'Shoreditch',diners:1840,share:22,avg:54},
      {zone:'Soho',diners:1510,share:18,avg:61},
      {zone:'Hackney',diners:1180,share:14,avg:47},
      {zone:'Islington',diners:920,share:11,avg:52},
      {zone:'Marylebone',diners:710,share:8,avg:66},
      {zone:'Dalston',diners:760,share:9,avg:44},
      {zone:'Other London',diners:1500,share:18,avg:49},
    ],
    segments: [
      {name:'Young foodie pros',size:2640,share:31,age:'25–34',spend:'£500+/mo',repeat:46,note:'Your core — discovery-led, high repeat'},
      {name:'Weekend social groups',size:1980,share:24,age:'25–44',spend:'£200–500',repeat:34,note:'Fri/Sat bookings, larger covers'},
      {name:'Local regulars',size:1520,share:18,age:'35–54',spend:'£200–500',repeat:58,note:'Within 1km · visit without offers'},
      {name:'Lapsed 60d+',size:1840,share:22,age:'Mixed',spend:'Mixed',repeat:0,note:'Win-back opportunity'},
    ],
  };

  // ---- AI ----
  const anomalies = [
    { id:'a1', sev:'high',   icon:'warn', title:'Soho Late Bar covers down 38% drop-on-drop',
      body:'Last drop fell from 58 \u2192 36 covers. Likely cause: cashback (\u00a37) now below the \u00a39 zone median for late-night. Raising to \u00a39 is projected to recover ~20 covers next drop.',
      action:'Raise cashback to \u00a39', campaign:'c4' },
    { id:'a2', sev:'medium', icon:'wallet', title:'New Diner Welcome will exhaust budget before the drop ends',
      body:'At the current burn it hits its \u00a31,600 cap by Sunday \u2014 covers will pause before Monday\u2019s drop. Add \u00a3400 to stay live through the weekend.',
      action:'Top up \u00a3400', campaign:'c1' },
    { id:'a3', sev:'low',    icon:'trend', title:'Marylebone lunch demand spiking',
      body:'Searches for Marylebone lunch up 51% in your audience. Your pending Lunch Launch is well-timed for Monday\u2019s drop \u2014 approve before the 09:00 cutoff to catch the wave.',
      action:'Review campaign', campaign:'c6' },
  ];

  const aiSuggestions = [
    { id:'s1', tag:'New offer', title:'Split Soho Weekend into new + repeat offers',
      body:'A single \u00a38 offer treats everyone the same. A \u00a320-on-\u00a3100 new-diner offer plus a leaner \u00a38-on-\u00a350 repeat offer is modelled to lift acquisition 22% at the same spend.', impact:'+22% new diners', confidence:'High' },
    { id:'s2', tag:'Cashback', title:'Lower King\u2019s Cross opening cashback \u00a312 \u2192 \u00a310',
      body:'Opening demand is now established. A \u00a32 reduction is modelled to keep 93% of covers while trimming your cashback to \u00a38.50 net.', impact:'\u2212\u00a32.00 cashback', confidence:'Medium' },
    { id:'s3', tag:'Win-back', title:'Add a lapsed-60d repeat offer to Monday\u2019s drop',
      body:'You have 1,840 diners who haven\u2019t returned in 60 days. A \u00a310-on-\u00a350 repeat offer could reactivate ~9% based on cohort behaviour.', impact:'~165 win-backs', confidence:'High' },
  ];

  const aiChatSeed = [
    { q:'Which offer has my worst ROAS and why?',
      a:'Your weakest is **Soho Late Bar** (5.2\u00d7) \u2014 and it\u2019s now paused. Among live offers, **New Diner Welcome** runs leaner at 5.2\u00d7 because the \u00a320 cashback is a deliberate acquisition cost; those diners return at full price (your repeat offers then run at 5.0\u2013 5.5\u00d7). Your best incremental return is **Monday Night Booster at 5.8\u00d7** because those covers are genuinely additive on a quiet night.',
      chips:['Show Monday detail','Draft a campaign for this'] },
  ];

  // ---- Notifications ----
  const notifications = [
    { id:'n1', icon:'warn',  title:'Budget alert', body:'New Diner Welcome may exhaust its budget before the drop ends.', time:'12m', unread:true, sev:'high' },
    { id:'n2', icon:'cash',  title:'264 covers driven this drop', body:'\u00a318.1k attributed revenue across live campaigns.', time:'1h', unread:true, sev:'ok' },
    { id:'n3', icon:'users', title:'Priya submitted a campaign', body:'Marylebone Lunch Launch sent for budget approval.', time:'3h', unread:true, sev:'info' },
    { id:'n4', icon:'star',  title:'New 5\u2605 diner note', body:'\u201cBest carbonara in Shoreditch\u201d \u2014 Sara R., 3rd visit.', time:'5h', unread:false, sev:'info' },
    { id:'n5', icon:'repeat',title:'Friday drop is live', body:'3 of your campaigns entered today\u2019s drop.', time:'1d', unread:false, sev:'info' },
  ];

  // helpers
  const fmt = (n)=> '\u00a3'+Math.round(n).toLocaleString('en-GB');
  const fmt2 = (n)=> '\u00a3'+Number(n).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});

  return { brand, venues, campaigns, feed, genFeed, wallet, team, invites, ROLES,
           analytics, bench, benchmark, BENCH_CUISINES, BENCH_ZONES, audience,
           anomalies, aiSuggestions, aiChatSeed, notifications,
           FEE, WINDOW_DAYS, computeDrops, offerLabel, custLabel, dinerNet, gbp, newCid, funnel, fmt, fmt2 };
})();
