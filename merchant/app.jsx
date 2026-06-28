// === Klaim Merchant Portal — app shell ===
const LS_KEY = 'klaim_merchant_v1';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "accent": "lime",
  "showOnboarding": false,
  "role": "Owner"
}/*EDITMODE-END*/;

const NAV = [
  { id:'dashboard', label:'Dashboard', ic:<IcGrid size={18}/>, perm:'dashboard' },
  { id:'campaigns', label:'Campaigns', ic:<IcRocket size={18}/>, perm:'campaigns' },
  { id:'analytics', label:'Analytics', ic:<IcChart size={18}/>, perm:'analytics' },
  { id:'ai',        label:'Advanced Analytics', ic:<IcSpark size={18}/>, perm:'ai', badge:'PRO' },
  { id:'wallet',    label:'Wallet & billing', ic:<IcWallet size={18}/>, perm:'wallet' },
  { id:'team',      label:'Team', ic:<IcUsers size={18}/>, perm:'team' },
  { id:'settings',  label:'Settings', ic:<IcGear size={18}/>, perm:'settings' },
];
const TITLES = { dashboard:'Dashboard', campaigns:'Campaigns', builder:'Campaign builder', analytics:'Analytics', ai:'Advanced Analytics', wallet:'Wallet & billing', team:'Team', settings:'Settings' };

function LiveDinerCount() {
  const [n, setN] = useState(48213);
  const [bump, setBump] = useState(false);
  useEffect(()=>{
    const iv = setInterval(()=>{
      setN(v=> v + (1 + Math.floor(Math.random()*3)));
      setBump(true); setTimeout(()=>setBump(false), 480);
    }, 1100 + Math.random()*900);
    return ()=>clearInterval(iv);
  },[]);
  return (
    <div className="live-diners" title="Klaim diners live across the network">
      <span className="ld-dot" />
      <span className={`ld-num mono ${bump?'bump':''}`}>{n.toLocaleString('en-GB')}</span>
      <span className="ld-lab">Klaim diners live</span>
    </div>
  );
}

function Portal() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const persisted = (()=>{ try{ return JSON.parse(localStorage.getItem(LS_KEY))||{}; }catch(e){ return {}; } })();

  const [onboarded, setOnboarded] = useState(persisted.onboarded || false);
  const [view, setView] = useState(persisted.view || 'dashboard');
  const [editing, setEditing] = useState(null);
  const [venueId, setVenueId] = useState(persisted.venueId || 'all');
  const [venueMenu, setVenueMenu] = useState(false);
  const [acctMenu, setAcctMenu] = useState(false);
  const [notif, setNotif] = useState(false);
  const [sbOpen, setSbOpen] = useState(false);

  const role = t.role || 'Owner';
  const perms = KD.ROLES[role];
  const allVenues = venueId==='all';
  const venue = allVenues ? { id:'all', short:'All sites', name:'All sites', zone:'4 London venues' } : KD.venues.find(v=>v.id===venueId);

  // persist
  useEffect(()=>{ localStorage.setItem(LS_KEY, JSON.stringify({onboarded,view,venueId})); },[onboarded,view,venueId]);

  // apply density
  useEffect(()=>{
    document.documentElement.style.setProperty('--radius', t.density==='compact'?'12px':'18px');
  },[t.density]);

  // tweak: replay onboarding
  useEffect(()=>{ if(t.showOnboarding) setOnboarded(false); },[t.showOnboarding]);

  // if current view not permitted for role, bounce to dashboard
  useEffect(()=>{
    if(view!=='builder' && !perms[ NAV.find(n=>n.id===view)?.perm ]) setView('dashboard');
  },[role]);

  function go(target, payload){
    if(target==='builder'){ setEditing(payload||null); }
    setView(target); setSbOpen(false);
    document.querySelector('.content')?.scrollTo(0,0);
  }

  const ctx = { go, role, perms, venue, allVenues,
    editing,
    onLaunched: ({name,isEdit})=>{ go('campaigns'); window.__toast && window.__toast(`${isEdit?'Changes saved':'Campaign launched'} · ${name}`); },
  };

  if(!onboarded){
    return <Onboarding onComplete={()=>{ setOnboarded(true); setTweak('showOnboarding',false); setView('dashboard'); }} />;
  }

  const unread = KD.notifications.filter(n=>n.unread).length;

  return (
    <div className="shell">
      {/* SIDEBAR */}
      <div className={`sidebar ${sbOpen?'open':''}`}>
        <div className="sb-logo"><span className="mark">K</span><div>Klaim<div className="sub">Merchant</div></div></div>

        {/* nav */}
        <div className="sb-section">Menu</div>
        {NAV.map(n=>{
          const locked = !perms[n.perm];
          const active = view===n.id || (n.id==='campaigns' && view==='builder');
          return (
            <button key={n.id} className={`nav-item ${active?'active':''} ${locked?'locked':''}`} onClick={()=>!locked&&go(n.id)}>
              <span className="ni-ic">{n.ic}</span>{n.label}
              {locked ? <span className="ni-lock"><IcLock size={14}/></span>
                : n.badge && perms.ai ? <span className="ni-badge">{n.badge}</span>
                : n.id==='campaigns' ? <span className="ni-count">{KD.campaigns.filter(c=>['live','pending','paused'].includes(c.status)).length}</span>
                : null}
            </button>
          );
        })}

        {/* foot */}
        <div className="sb-foot">
          {perms.billing && (
            <div className="plan-chip">
              <span className="pc-ic"><IcChart size={16}/></span>
              <div><div className="pc-name">Klaim Pro</div><div className="pc-sub">£599/mo · all sites</div></div>
            </div>
          )}
          <div className="acct" onClick={()=>setAcctMenu(v=>!v)}>
            <div className="av">ST</div>
            <div style={{flex:1,minWidth:0}}><div className="an">Sean Trevaskis</div><div className="ar">{perms.label}</div></div>
            <IcChevD size={15} style={{opacity:.5}}/>
            {acctMenu && (
              <div className="acct-menu" onClick={e=>e.stopPropagation()}>
                <div className="am-head">Demo · view portal as role</div>
                {Object.keys(KD.ROLES).map(r=>(
                  <div key={r} className="am-item" onClick={()=>{setTweak('role',r);setAcctMenu(false);}}>
                    <span style={{width:18,display:'flex'}}>{role===r?<IcCheck size={15}/>:null}</span>{KD.ROLES[r].label}
                  </div>
                ))}
                <div className="am-sep"/>
                <div className="am-item" onClick={()=>{setTweak('showOnboarding',true);setAcctMenu(false);}}><IcRepeat size={15}/> Replay onboarding</div>
                <div className="am-item" onClick={()=>{go('settings');setAcctMenu(false);}}><IcGear size={15}/> Settings</div>
                <div className="am-item" style={{color:'var(--bad)'}}><IcLogout size={15}/> Sign out</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <button className="iconbtn" style={{display:'none'}} id="sb-toggle" onClick={()=>setSbOpen(v=>!v)}><IcMenu size={18}/></button>
          <LiveDinerCount />
          <div className="tb-spacer"/>
          {/* venue switcher */}
          <div className="venue-sw tb">
            <button className="venue-btn" onClick={()=>setVenueMenu(v=>!v)}>
              <span className="vlogo">{allVenues?'★':'EO'}</span>
              <span className="vmeta"><span className="vname">{venue.short}</span><span className="vsub">{allVenues?'4 venues':venue.zone}</span></span>
              <span className="vchev"><IcChevD size={16}/></span>
            </button>
            {venueMenu && (
              <div className="venue-menu">
                <div className="vm-head">Ember &amp; Oak</div>
                <div className={`venue-item all ${allVenues?'active':''}`} onClick={()=>{setVenueId('all');setVenueMenu(false);}}>
                  <span className="vlogo">★</span><div><div className="vname">All sites</div><div className="vsub">Combined view · 4 venues</div></div>
                  {allVenues && <span style={{marginLeft:'auto'}}><IcCheck size={15}/></span>}
                </div>
                {KD.venues.map(v=>(
                  <div key={v.id} className={`venue-item ${venueId===v.id?'active':''}`} onClick={()=>{setVenueId(v.id);setVenueMenu(false);}}>
                    <span className="vlogo">EO</span><div><div className="vname">{v.short}</div><div className="vsub">{v.zone}</div></div>
                    {venueId===v.id && <span style={{marginLeft:'auto'}}><IcCheck size={15}/></span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="iconbtn" onClick={()=>setNotif(v=>!v)} style={{position:'relative'}}>
            <IcBell size={18}/>{unread>0 && <span className="dot"/>}
            {notif && <NotifPanel onClose={()=>setNotif(false)} go={go} />}
          </div>
        </div>

        <div className="content scroll-y">
          {view==='dashboard' && <Dashboard ctx={ctx} />}
          {view==='campaigns' && <Campaigns ctx={ctx} />}
          {view==='builder'   && <CampaignBuilder ctx={ctx} />}
          {view==='analytics' && <Analytics ctx={ctx} />}
          {view==='ai'        && perms.ai && <AdvancedAnalytics ctx={ctx} />}
          {view==='wallet'    && perms.wallet && <Wallet ctx={ctx} />}
          {view==='team'      && perms.team && <Team ctx={ctx} />}
          {view==='settings'  && perms.settings && <Settings ctx={ctx} />}
        </div>
      </div>

      {/* click-away for menus */}
      {(venueMenu||acctMenu||notif) && <div style={{position:'fixed',inset:0,zIndex:10}} onClick={()=>{setVenueMenu(false);setAcctMenu(false);setNotif(false);}} />}

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Demo controls" />
        <TweakSelect label="View as role" value={role}
          options={Object.keys(KD.ROLES).map(r=>({value:r,label:KD.ROLES[r].label}))}
          onChange={v=>setTweak('role',v)} />
        <TweakButton label="Replay onboarding" onClick={()=>setTweak('showOnboarding',true)} />
        <TweakSection label="Appearance" />
        <TweakRadio label="Density" value={t.density} options={['compact','comfortable']} onChange={v=>setTweak('density',v)} />
      </TweaksPanel>
    </div>
  );
}

function NotifPanel({ onClose, go }) {
  const map={warn:<IcWarn size={16}/>,cash:<IcCash size={16}/>,users:<IcUsers size={16}/>,star:<IcStar size={16}/>,repeat:<IcRepeat size={16}/>};
  const col={high:'var(--pink)',ok:'var(--lime)',info:'var(--cream-2)'};
  return (
    <div className="venue-menu" style={{left:'auto',right:0,width:340,top:'calc(100% + 8px)'}} onClick={e=>e.stopPropagation()}>
      <div className="row spread" style={{padding:'8px 10px 6px'}}><div className="vm-head" style={{padding:0}}>Notifications</div><span className="lk" style={{fontSize:11}} onClick={onClose}>Mark all read</span></div>
      {KD.notifications.map(n=>(
        <div key={n.id} className="venue-item" style={{alignItems:'flex-start',cursor:'pointer'}} onClick={()=>{onClose();n.icon==='warn'?go('campaigns'):n.icon==='cash'?go('analytics'):go('dashboard');}}>
          <span style={{width:30,height:30,borderRadius:8,background:col[n.sev]||'var(--cream-2)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',marginTop:2}}>{map[n.icon]}</span>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{n.title} {n.unread && <span style={{width:7,height:7,borderRadius:'50%',background:'var(--pink)',display:'inline-block',marginLeft:4,verticalAlign:'middle'}}/>}</div>
            <div className="muted" style={{fontSize:12,fontWeight:500,lineHeight:1.4}}>{n.body}</div>
            <div className="muted-2" style={{fontSize:11,fontWeight:600,marginTop:2}}>{n.time} ago</div></div>
        </div>
      ))}
    </div>
  );
}

function Root(){
  return <ToastHost><ToastBridge/><Portal/></ToastHost>;
}
// expose toast globally for cross-component use
function ToastBridge(){ const t=useToast(); useEffect(()=>{ window.__toast=t; },[t]); return null; }

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
