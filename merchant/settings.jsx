// === Settings / venue profile ===
function Settings({ ctx }) {
  const { venue, allVenues } = ctx;
  const toast = useToast();
  const v = allVenues ? KD.venues[0] : venue;
  const [name,setName]=useState('Ember & Oak');
  const [cuisine,setCuisine]=useState('Modern European');
  const [aov,setAov]=useState(42);
  const [alerts,setAlerts]=useState({budget:true,covers:true,weekly:true,anomaly:true});
  const [slack,setSlack]=useState(true);

  return (
    <div className="page">
      <PageHead eyebrow="Account · brand & venues" title="Settings" />

      <div className="grid" style={{gridTemplateColumns:'200px 1fr',gap:24,alignItems:'start'}}>
        {/* left nav */}
        <div className="col" style={{gap:4,position:'sticky',top:0}}>
          {[['#brand','Brand profile',<IcStore size={16}/>],['#venues','Venues',<IcMap size={16}/>],['#alerts','Notifications',<IcBell size={16}/>],['#integ','Integrations',<IcLink size={16}/>],['#security','Security',<IcShield size={16}/>]].map(([h,l,ic])=>(
            <a key={h} href={h} className="nav-item" style={{color:'var(--ink)',background:'transparent'}}>
              <span className="ni-ic">{ic}</span>{l}
            </a>
          ))}
        </div>

        <div className="col" style={{gap:16}}>
          {/* Brand */}
          <div className="card" id="brand">
            <div className="card-head"><h3><IcStore size={17}/> Brand profile</h3></div>
            <div className="row gap16 mb24" style={{alignItems:'center'}}>
              <div style={{width:64,height:64,borderRadius:16,background:'var(--ink)',color:'var(--lime)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Bricolage Grotesque',fontWeight:800,fontSize:26,flex:'none'}}>EO</div>
              <Btn variant="ghost" size="sm">Change logo</Btn>
            </div>
            <div className="grid g2">
              <Field label="Brand name"><input className="inp" value={name} onChange={e=>setName(e.target.value)} /></Field>
              <Field label="Cuisine type">
                <select className="inp" value={cuisine} onChange={e=>setCuisine(e.target.value)}>
                  {['Modern European','Italian','Indian','Japanese','British','Small plates','Steakhouse'].map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Average cover value" hint="Used to forecast campaign ROI. Auto-refined from your real transaction data.">
              <div className="inp-pre" style={{maxWidth:200}}><span className="pre">£</span><input type="number" value={aov} onChange={e=>setAov(+e.target.value||0)} /></div>
            </Field>
            <Field label="Showcase images" hint="Dishes & venue photos shown to diners in your drop. Up to 6.">
              <div className="row gap8 wrap">
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:96,height:96,borderRadius:12,overflow:'hidden',border:'1.5px solid var(--ink)',background:`linear-gradient(135deg, ${['#E8D9C4','#D9C4E8','#C4E8D9'][i]}, var(--cream-2))`,display:'flex',alignItems:'flex-end',padding:7}}>
                    <span className="badge soft" style={{fontSize:9}}>{['Hero dish','Interior','Bar'][i]}</span>
                  </div>
                ))}
                {[0,1,2].map(i=>(
                  <button key={'a'+i} className="img-add" onClick={()=>toast('Upload image')}><IcPlus size={20}/></button>
                ))}
              </div>
            </Field>
            <Btn variant="solid" onClick={()=>toast('Brand profile saved')}>Save changes</Btn>
          </div>

          {/* Venues */}
          <div className="card" id="venues">
            <div className="card-head"><h3><IcMap size={17}/> Venues <span className="muted" style={{fontWeight:600,fontSize:13}}>· {KD.venues.length}</span></h3>
              <Btn variant="ghost" size="sm" icon={<IcPlus size={14}/>} onClick={()=>toast('Add a new venue')}>Add venue</Btn></div>
            <div className="col" style={{gap:10}}>
              {KD.venues.map((vn,idx)=>(
                <div key={vn.id} style={{padding:'12px 14px',border:'1.5px solid var(--line)',borderRadius:12}}>
                  <div className="row spread">
                    <div className="row gap8"><div style={{width:34,height:34,borderRadius:9,background:'var(--cream-2)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontFamily:'Bricolage Grotesque',fontSize:13}}>EO</div>
                      <div><div style={{fontWeight:700,fontSize:14}}>{vn.short}</div><div className="muted" style={{fontSize:12}}>{vn.zone}</div></div></div>
                    <div className="row gap8"><StatusBadge status={vn.status}/><button className="btn ghost sm" onClick={()=>toast('Editing '+vn.short)}>Edit</button></div>
                  </div>
                  <div className="row spread" style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--line)'}}>
                    <div className="row gap8"><span style={{width:26,height:26,borderRadius:7,background: idx===0?'var(--lime)':'var(--cream-2)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><IcMap size={14}/></span>
                      <div style={{fontSize:12.5,fontWeight:600}}>Google location {idx===0?<span style={{color:'var(--ok)'}}>· connected</span>:<span className="muted">· links reviews &amp; map pin</span>}</div></div>
                    {idx===0 ? <span className="badge live"><IcCheck size={11}/> LINKED</span>
                      : <button className="btn ghost sm" onClick={()=>toast('Connecting Google location…')}><IcLink size={13}/> Connect Google</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card" id="alerts">
            <div className="card-head"><h3><IcBell size={17}/> Notifications</h3></div>
            {[['budget','Budget & low-balance alerts','When a campaign is about to exhaust its cap'],
              ['covers','Daily cover summary','End-of-day recap of covers & revenue'],
              ['anomaly','AI anomaly alerts','When something needs attention (Pro)'],
              ['weekly','Weekly drop reminder','When your venue goes into a drop']].map(([k,l,d])=>(
              <div key={k} className="row spread" style={{padding:'13px 0',borderTop:'1px solid var(--line)'}}>
                <div><div style={{fontWeight:700,fontSize:13.5}}>{l}</div><div className="muted" style={{fontSize:12,fontWeight:500}}>{d}</div></div>
                <Toggle on={alerts[k]} onChange={val=>setAlerts(a=>({...a,[k]:val}))} />
              </div>
            ))}
          </div>

          {/* Integrations */}
          <div className="card" id="integ">
            <div className="card-head"><div><h3><IcLink size={17}/> Integrations</h3><div className="ch-sub">Connect your booking system — Klaim never touches your POS or till.</div></div></div>
            <div className="row spread" style={{padding:'13px 0',borderBottom:'1px solid var(--line)'}}>
              <div className="row gap8"><span style={{width:36,height:36,borderRadius:9,background:'#4A154B',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13}}>#</span>
                <div><div style={{fontWeight:700,fontSize:13.5}}>Slack</div><div className="muted" style={{fontSize:12}}>Real-time cover alerts to #front-of-house</div></div></div>
              <Toggle on={slack} onChange={setSlack} />
            </div>
            <div className="muted" style={{fontSize:10.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',padding:'14px 0 6px'}}>Booking systems</div>
            {[['OpenTable','#DA3743','connected'],['SevenRooms','#1A1A2E','off'],['Resy','#FF4F4F','off']].map(([nm,col,st])=>(
              <div key={nm} className="row spread" style={{padding:'13px 0',borderTop:'1px solid var(--line)'}}>
                <div className="row gap8"><span style={{width:36,height:36,borderRadius:9,background:col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:12}}>{nm[0]}</span>
                  <div><div style={{fontWeight:700,fontSize:13.5}}>{nm}</div><div className="muted" style={{fontSize:12}}>Sync covers against reservations &amp; no-shows</div></div></div>
                {st==='connected' ? <span className="badge live"><IcCheck size={11}/> CONNECTED</span>
                  : <Btn variant="ghost" size="sm" onClick={()=>toast('Connecting '+nm+'…')}>Connect</Btn>}
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="card" id="security">
            <div className="card-head"><h3><IcShield size={17}/> Security</h3></div>
            <div className="row spread" style={{padding:'13px 0',borderBottom:'1px solid var(--line)'}}>
              <div><div style={{fontWeight:700,fontSize:13.5}}>Two-factor authentication</div><div className="muted" style={{fontSize:12}}>Required for Owner & Finance roles</div></div>
              <span className="badge live"><IcCheck size={12}/> ON</span>
            </div>
            <div className="row spread" style={{padding:'13px 0'}}>
              <div><div style={{fontWeight:700,fontSize:13.5}}>Cover verification</div><div className="muted" style={{fontSize:12}}>Diners’ card payments are matched automatically — no POS or till integration needed</div></div>
              <span className="badge live"><span className="bd"/>ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Settings = Settings;
