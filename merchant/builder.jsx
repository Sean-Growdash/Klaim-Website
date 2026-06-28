// === Campaign builder (create + edit) — drop-based model ===
const SEGMENTS = [
  { id:'genz', label:'Gen Z explorers (22–27)' },
  { id:'young', label:'Young pros (28–34)' },
  { id:'new', label:'New to your venue' },
  { id:'lapsed', label:'Lapsed 60d+ (win-back)' },
  { id:'highspend', label:'High spenders (£600+/mo)' },
  { id:'foodie', label:'Cuisine affinity: Modern Euro' },
];

function aiDraft(venueName){
  return {
    cashback:8, minSpend:40, customerType:'all',
    segments:['genz','young','new'], radius:1.5, budget:1500, recurring:true,
    rationale:`For ${venueName}, Klaim models the strongest incremental return from an £8-on-£40 offer to all diners within 1.5km — entered into every drop so you stay top-of-feed. New-venue brands often pair this with a separate £20-on-£100 offer aimed only at new diners.`,
  };
}

function CampaignBuilder({ ctx }) {
  const { go, editing, venue, allVenues, role } = ctx;
  const toast = useToast();
  const isEdit = !!editing;
  const drops = KD.computeDrops();

  const [name, setName] = useState(editing?.name || '');
  const [venueId, setVenueId] = useState(editing ? editing.venue : (allVenues?'sho':venue.id));
  const [dropDay, setDropDay] = useState(editing?.dropDay || drops.nextDay);
  const [recurring, setRecurring] = useState(editing?.recurring ?? true);
  const [customerType, setCustomerType] = useState(editing?.customerType || 'all');
  const [cashback, setCashback] = useState(editing?.cashback || 8);
  const [minSpend, setMinSpend] = useState(editing?.minSpend || 40);
  const [aov, setAov] = useState((editing?.minSpend||40) + 12);
  const [budget, setBudget] = useState(editing?.budget || 1500);
  const [radius, setRadius] = useState(editing?.radius || 1.5);
  const [segs, setSegs] = useState(editing?.segments || ['genz','young','new']);
  const [repeat, setRepeat] = useState(editing?.repeat || 38);
  const [aiOpen, setAiOpen] = useState(!isEdit);
  const [launching, setLaunching] = useState(false);
  const [cid] = useState(editing?.cid || KD.newCid());
  const [trading, setTrading] = useState(editing?.trading ?? true);
  const [squad, setSquad] = useState(editing?.squad?.on ?? true);
  const [squadBonus, setSquadBonus] = useState(editing?.squad?.maxBonus || 3);

  const venueName = (KD.venues.find(v=>v.id===venueId)||venue).short;
  const ai = useMemo(()=>aiDraft(venueName),[venueName]);
  const toggleSeg = s => setSegs(p=> p.includes(s)? p.filter(x=>x!==s):[...p,s]);

  function applyAI(){
    setCashback(ai.cashback); setMinSpend(ai.minSpend); setCustomerType(ai.customerType);
    setSegs(ai.segments); setRadius(ai.radius); setBudget(ai.budget); setRecurring(ai.recurring);
    setAov(ai.minSpend+12); setAiOpen(false);
    toast('AI-optimised settings applied', <IcSpark size={15}/>);
  }

  // ---- Economics: you FUND `cashback` per cover; Klaim takes the flat fee out of it ----
  const FEE = KD.FEE;
  const costPerCover = cashback;                       // what the restaurant pays per cover
  const dinerNet = +(cashback - FEE).toFixed(2);       // what the diner sees in-app

  // ---- Forecast (per drop window) ----
  const coversCap = Math.floor(budget / costPerCover);
  // demand modelling: smaller for repeat-only / tight radius / few segments
  const custMult = customerType==='repeat'?0.6 : customerType==='new'?0.9 : 1;
  const demand = Math.round((90 + radius*radius*22) * (0.5+segs.length*0.12) * custMult);
  const covers = Math.min(coversCap, demand);
  const spend = covers * costPerCover;
  const revenue = covers * Math.max(aov, minSpend);
  const roas = spend>0 ? revenue/spend : 0;
  const reachBase = customerType==='repeat'? 2600 : 4200;
  const reach = Math.round((reachBase + radius*radius*2600) * (0.5+segs.length*0.12) * custMult);
  const windowLabel = drops.windowLabel(dropDay);
  const dropDate = drops.fmtD(dropDay==='Mon'?drops.nextMon:drops.nextFri);

  const valid = name.trim() && segs.length>0;

  function launch(){
    setLaunching(true);
    setTimeout(()=>{ setLaunching(false); ctx.onLaunched && ctx.onLaunched({name,isEdit}); }, 1400);
  }

  return (
    <div className="page">
      <div className="row gap8 mb16" style={{alignItems:'center'}}>
        <button className="xbtn" onClick={()=>go(isEdit?'campaigns':'dashboard')}><IcChevL size={17}/></button>
        <div className="tb-crumb">{isEdit?'Edit campaign':'New campaign'}</div>
        <span className="badge soft mono" title="Klaim campaign ID" style={{marginLeft:'auto'}}><IcReceipt size={12}/> {cid}</span>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr 360px',gap:20,alignItems:'start'}}>
        {/* LEFT: form */}
        <div className="col" style={{gap:16}}>

          {aiOpen && (
            <div className="ai-card">
              <div className="row spread" style={{alignItems:'flex-start'}}>
                <div className="row gap8" style={{alignItems:'flex-start'}}>
                  <span className="ai-mark" style={{width:32,height:32}}><IcSpark size={17}/></span>
                  <div>
                    <div className="row gap8" style={{marginBottom:4}}><strong style={{fontSize:15}}>Let Klaim AI draft this campaign</strong><RecFlag>AI suggestion</RecFlag></div>
                    <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.55,maxWidth:560,fontWeight:500}}>{ai.rationale}</p>
                  </div>
                </div>
                <button className="xbtn" onClick={()=>setAiOpen(false)}><IcX size={15}/></button>
              </div>
              <div className="row gap8 mt16" style={{paddingLeft:40}}>
                <Btn variant="solid" size="sm" icon={<IcBolt size={14}/>} onClick={applyAI}>Apply AI settings</Btn>
                <Btn variant="ghost" size="sm" onClick={()=>setAiOpen(false)}>I’ll set it up myself</Btn>
              </div>
            </div>
          )}

          {/* 1. Basics */}
          <div className="card">
            <div className="card-head"><h3><span className="num-chip">1</span> Campaign basics</h3></div>
            <Field label="Campaign name" hint="Tip: run several campaigns in one drop — e.g. a new-diner offer and a separate repeat offer.">
              <input className="inp" placeholder="e.g. New Diner Welcome" value={name} onChange={e=>setName(e.target.value)} />
            </Field>
            <Field label="Venue">
              <select className="inp" value={venueId} onChange={e=>setVenueId(e.target.value)} disabled={role==='Venue Manager'}>
                {KD.venues.map(v=><option key={v.id} value={v.id}>{v.short}</option>)}
              </select>
            </Field>
          </div>

          {/* 2. Drop & schedule */}
          <div className="card">
            <div className="card-head"><h3><span className="num-chip">2</span> Which drop?</h3>
              <span className="tag"><IcClock size={13}/> Runs the whole drop, until the next one</span></div>
            <Field label="Enter this drop" hint="Drops go live Mondays & Fridays at 09:00. Your offer runs until the next drop (or until the budget runs out).">
              <div className="grid g2" style={{gap:10}}>
                <Choice on={dropDay==='Mon'} title={`Monday drop · ${drops.fmtD(drops.nextMon)}`} desc={`Runs ${drops.windowLabel('Mon')}`} onClick={()=>setDropDay('Mon')} />
                <Choice on={dropDay==='Fri'} title={`Friday drop · ${drops.fmtD(drops.nextFri)}`} desc={`Runs ${drops.windowLabel('Fri')}`} onClick={()=>setDropDay('Fri')} />
              </div>
            </Field>
            <div className="row spread" style={{padding:'14px 16px',border:'1.5px solid var(--line)',borderRadius:12,marginTop:4}}>
              <div><div style={{fontWeight:700,fontSize:13.5}}>Repeat every {dropDay==='Mon'?'Monday':'Friday'} drop</div>
                <div className="muted" style={{fontSize:12,fontWeight:500}}>{recurring?'Auto-enters each drop until you stop it or the budget runs out.':'One-off — runs this drop only.'}</div></div>
              <Toggle on={recurring} onChange={setRecurring} />
            </div>
          </div>

          {/* 3. Offer */}
          <div className="card">
            <div className="card-head">
              <h3><span className="num-chip">3</span> Cashback offer</h3>
              {cashback!==ai.cashback && <button className="btn sm ghost" onClick={()=>{setCashback(ai.cashback);setMinSpend(ai.minSpend);}}><IcSpark size={13}/> AI suggests £{ai.cashback} on £{ai.minSpend}</button>}
            </div>
            <Field label="Who can claim it?">
              <div className="grid g3" style={{gap:10}}>
                <Choice on={customerType==='all'} title="All diners" desc="New & returning" onClick={()=>setCustomerType('all')} />
                <Choice on={customerType==='new'} title="New diners" desc="First visit to you" onClick={()=>setCustomerType('new')} />
                <Choice on={customerType==='repeat'} title="Repeat diners" desc="Bring them back" onClick={()=>setCustomerType('repeat')} />
              </div>
            </Field>
            <div className="grid g2" style={{gap:18}}>
              <RangeRow label="Cashback budget per cover" display={`£${cashback}`} value={cashback} min={3} max={30} onChange={setCashback} hint="What you fund per cover. Klaim’s fee comes out of this." />
              <RangeRow label="Minimum spend to qualify" display={`£${minSpend}`} value={minSpend} min={10} max={150} step={5} onChange={v=>{setMinSpend(v); if(aov<v) setAov(v+12);}} hint="They must spend at least this to earn it." />
            </div>
            {/* offer preview + economics */}
            <div className="card cream" style={{padding:16,marginTop:6}}>
              <div className="row spread mb16" style={{alignItems:'center'}}>
                <div className="row gap8"><span className="badge live" style={{background:'var(--lime)'}}>DINER SEES</span>
                  <b style={{fontSize:15}}>£{dinerNet} back on £{minSpend}+</b><CustBadge type={customerType} /></div>
              </div>
              <div className="row spread" style={{fontSize:13,padding:'5px 0'}}><span className="muted" style={{fontWeight:600}}>You fund per cover</span><b className="mono">£{cashback.toFixed(2)}</b></div>
              <div className="row spread" style={{fontSize:13,padding:'5px 0'}}><span className="muted" style={{fontWeight:600}}>– Klaim fee (flat, per cover)</span><b className="mono">£{FEE.toFixed(2)}</b></div>
              <div className="row spread" style={{fontSize:13,padding:'5px 0'}}><span className="muted" style={{fontWeight:600}}>= Diner receives (in-app)</span><b className="mono">£{dinerNet.toFixed(2)}</b></div>
              <div className="divider" style={{margin:'8px 0'}}/>
              <div className="row spread" style={{fontSize:14}}><b>Your cost per verified cover</b><b className="display" style={{fontSize:24}}>£{costPerCover.toFixed(2)}</b></div>
              <div className="row spread" style={{fontSize:11.5,marginTop:8,color:'var(--muted)',fontWeight:600}}>
                <span>You only pay when a diner actually spends £{minSpend}+ and the cover settles.</span>
              </div>
            </div>
          </div>

          {/* 4. Audience */}
          <div className="card">
            <div className="card-head"><h3><span className="num-chip">4</span> Audience targeting</h3>
              <span className="tag"><IcUsers size={13}/> ~{reach.toLocaleString('en-GB')} in range</span></div>
            <Field label="Diner segments" hint="Your offer is only shown to matching diners in the drop.">
              <div className="row gap8 wrap">{SEGMENTS.map(s=><Chip key={s.id} on={segs.includes(s.id)} onClick={()=>toggleSeg(s.id)}>{s.label}</Chip>)}</div>
            </Field>
            <RangeRow label="Catchment radius" display={`${radius.toFixed(1)} km`} value={radius} min={0.5} max={5} step={0.5} onChange={setRadius}
              hint={`Diners within ${radius.toFixed(1)}km of ${venueName} who match.`} />
          </div>

          {/* 5. Sharing & social */}
          <div className="card">
            <div className="card-head"><h3><span className="num-chip">5</span> Sharing &amp; social</h3>
              <span className="ai-pill"><IcUsers size={12}/> Network effects</span></div>

            <div className="row spread" style={{padding:'14px 16px',border:'1.5px solid var(--line)',borderRadius:12,marginBottom:12}}>
              <div className="row gap8" style={{alignItems:'flex-start'}}>
                <span style={{width:34,height:34,borderRadius:9,background:'var(--cream-2)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><IcRepeat size={17}/></span>
                <div><div style={{fontWeight:700,fontSize:13.5}}>Allow Klaim trading</div>
                  <div className="muted" style={{fontSize:12,fontWeight:500,maxWidth:380}}>Diners can swap this drop with friends in-app. The cashback follows the new owner — great for reach, costs you nothing extra.</div></div>
              </div>
              <Toggle on={trading} onChange={setTrading} />
            </div>

            <div className="row spread" style={{padding:'14px 16px',border:`1.5px solid ${squad?'var(--ink)':'var(--line)'}`,borderRadius:12}}>
              <div className="row gap8" style={{alignItems:'flex-start'}}>
                <span style={{width:34,height:34,borderRadius:9,background: squad?'var(--lime)':'var(--cream-2)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><IcUsers size={17}/></span>
                <div><div className="row gap8"><span style={{fontWeight:700,fontSize:13.5}}>Squad Klaim boost</span><RecFlag>Social</RecFlag></div>
                  <div className="muted" style={{fontSize:12,fontWeight:500,maxWidth:380}}>Boost each diner’s cashback when they come as a group. Drives bigger covers &amp; viral invites.</div></div>
              </div>
              <Toggle on={squad} onChange={setSquad} />
            </div>

            {squad && (
              <div className="card cream" style={{padding:16,marginTop:12}}>
                <RangeRow label="Max group boost (per diner)" display={`+£${squadBonus}`} value={squadBonus} min={1} max={8} onChange={setSquadBonus}
                  hint="Extra cashback when a full squad turns up — you fund the boost only on covers that actually arrive as a group." />
                <div className="row gap8 wrap mt8">
                  {[['Pair',`£${dinerNet}`],['Trio',`£${(dinerNet+squadBonus*0.4).toFixed(2)}`],['Squad',`£${(dinerNet+squadBonus*0.7).toFixed(2)}`],['Crew 5+',`£${(dinerNet+squadBonus).toFixed(2)}`]].map(([t,v],i)=>(
                    <div key={t} style={{flex:1,minWidth:90,textAlign:'center',padding:'10px 8px',borderRadius:10,border:'1.5px solid var(--ink)',background:i===3?'var(--lime)':'var(--white)'}}>
                      <div className="muted" style={{fontSize:10,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase'}}>{t}</div>
                      <div className="display" style={{fontSize:18,marginTop:3}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 6. Budget */}
          <div className="card">
            <div className="card-head"><h3><span className="num-chip">6</span> Budget cap</h3>
              <span className="tag"><IcWallet size={13}/> Drawn from your wallet</span></div>
            <RangeRow label={recurring?'Budget cap per drop':'Budget cap'} display={fmt(budget)} value={budget} min={300} max={10000} step={100} onChange={setBudget}
              hint={`A hard cap — Klaim never charges over it. Covers pause if it’s reached before ${recurring?'the next drop':'the drop ends'}.`} />
            <div className="card cream mt8" style={{padding:14}}>
              <div className="row spread mb8"><span className="row gap8" style={{fontWeight:700,fontSize:12.5}}><span className="ai-mark" style={{width:24,height:24}}><IcSpark size={13}/></span>Auto-forecast from your transaction data</span>
                <span className="badge live"><span className="bd"/>LIVE</span></div>
              <div className="row" style={{gap:24}}>
                <div><div className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Avg cover value</div><div className="display" style={{fontSize:22,marginTop:2}}>£{aov}</div></div>
                <div><div className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Repeat rate</div><div className="display" style={{fontSize:22,marginTop:2}}>{repeat}%</div></div>
                <div style={{flex:1,alignSelf:'center'}}><div className="muted" style={{fontSize:11.5,fontWeight:500,lineHeight:1.45}}>Modelled from verified Klaim covers at {venueName} — refreshes every drop. No input needed.</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: sticky forecast */}
        <div style={{position:'sticky',top:0}}>
          <div className="card ink" style={{padding:24}}>
            <div className="row spread mb16">
              <div className="tb-crumb" style={{color:'var(--lime)'}}>Projected · per drop</div>
              <span className="ai-pill" style={{background:'rgba(199,255,79,.16)'}}><IcSpark size={12}/> Forecast</span>
            </div>
            <div className="display" style={{fontSize:52,color:'var(--lime)',lineHeight:.9}}>{fmt(revenue)}</div>
            <div style={{color:'rgba(244,237,230,.7)',fontSize:12.5,marginTop:8,fontWeight:500}}>Attributed revenue this drop · {windowLabel}</div>

            <div className="grid g2" style={{gap:18,marginTop:24,paddingTop:22,borderTop:'1px solid rgba(244,237,230,.16)'}}>
              <Fcast k="Covers driven" v={covers.toLocaleString('en-GB')} />
              <Fcast k="ROAS" v={roas.toFixed(1)+'×'} hi />
              <Fcast k="Cashback (diner)" v={'£'+dinerNet.toFixed(2)} />
              <Fcast k="Budget used" v={fmt(spend)} />
            </div>
            {covers>=coversCap && <div className="row gap8 mt16" style={{fontSize:11.5,color:'var(--amber)',fontWeight:700}}><IcWarn size={14}/> Budget-capped — raise budget to capture more demand.</div>}

            <div style={{marginTop:20,paddingTop:18,borderTop:'1px solid rgba(244,237,230,.16)'}}>
              <div className="row spread" style={{fontSize:12,color:'rgba(244,237,230,.7)',marginBottom:8,fontWeight:600}}><span>AI confidence</span><span style={{color:'var(--lime)',fontWeight:800}}>High · 87%</span></div>
              <div className="prog" style={{background:'rgba(255,255,255,.12)',borderColor:'rgba(255,255,255,.2)'}}><div className="fill" style={{width:'87%'}}/></div>
              {recurring && <div style={{fontSize:11,color:'rgba(244,237,230,.5)',marginTop:8,fontWeight:500}}>Repeats every {dropDay==='Mon'?'Monday':'Friday'} drop until stopped</div>}
            </div>
          </div>

          <div className="card mt16" style={{padding:18}}>
            {!valid && <div className="row gap8 mb16" style={{fontSize:12,color:'var(--muted)',fontWeight:600}}><IcInfo size={15}/> Add a name &amp; at least one segment to launch.</div>}
            <Btn variant="lime" size="lg" disabled={!valid||launching} style={{width:'100%',justifyContent:'center'}} onClick={launch} icon={launching?null:<IcRocket size={17}/>}>
              {launching ? 'Submitting…' : isEdit ? 'Save changes' : `Enter ${dropDay==='Mon'?'Monday':'Friday'}’s drop`}
            </Btn>
            <button className="btn ghost sm" style={{width:'100%',justifyContent:'center',marginTop:10}} onClick={()=>{toast('Saved as draft');go('campaigns');}}>Save as draft</button>
            <div style={{fontSize:11,color:'var(--muted)',textAlign:'center',marginTop:12,fontWeight:500,lineHeight:1.5}}>
              {isEdit?'Edits to a scheduled campaign apply from the next drop.':`Goes live in the ${dropDate} drop at 09:00.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fcast({ k, v, hi }) {
  return (
    <div>
      <div style={{fontSize:12,color:'rgba(244,237,230,.6)',fontWeight:600}}>{k}</div>
      <div className="display" style={{fontSize:34,marginTop:6,color:hi?'var(--lime)':'var(--cream)'}}>{v}</div>
    </div>
  );
}

window.CampaignBuilder = CampaignBuilder;
