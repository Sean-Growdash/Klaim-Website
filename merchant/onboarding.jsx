// === Self-serve onboarding (PLG) — drop-based ===
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const steps = ['Create account','Your venue','Add your budget','First campaign','You’re live'];
  const drops = KD.computeDrops();

  // form state
  const [email,setEmail]=useState('');
  const [pwd,setPwd]=useState('');
  const [brand,setBrand]=useState('');
  const [cuisine,setCuisine]=useState('Modern European');
  const [sites,setSites]=useState('1');
  const [zone,setZone]=useState('');
  const [deposit,setDeposit]=useState(1000);
  const [funded,setFunded]=useState(false);
  const [funding,setFunding]=useState(false);
  const [cashback,setCashback]=useState(8);
  const [minSpend,setMinSpend]=useState(40);
  const [customerType,setCustomerType]=useState('all');
  const [dropDay,setDropDay]=useState(drops.nextDay);
  const [recurring,setRecurring]=useState(true);
  const [budget,setBudget]=useState(800);

  const next=()=>setStep(s=>Math.min(steps.length-1,s+1));
  const back=()=>setStep(s=>Math.max(0,s-1));

  function fund(){ setFunding(true); setTimeout(()=>{setFunding(false);setFunded(true);},1400); }

  const FEE=KD.FEE, cpc=cashback, dinerNet=+(cashback-FEE).toFixed(2);
  const covers=Math.floor(budget/cpc), aov=Math.max(minSpend+12,52), rev=Math.round(covers*aov), roas=(rev/budget).toFixed(1);

  const canNext = [
    email.includes('@') && pwd.length>=4,
    brand.trim() && zone.trim(),
    funded,
    true,
    true,
  ][step];

  return (
    <div className="onb-wrap">
      {/* LEFT brand panel */}
      <div className="onb-side">
        <div className="sb-logo" style={{fontSize:28,marginBottom:0}}><span className="mark" style={{width:42,height:42,fontSize:24}}>K</span> Klaim</div>
        <div className="onb-side-mid">
          <div className="tb-crumb" style={{color:'var(--lime)'}}>For restaurants · self-serve</div>
          <h1 className="display" style={{fontSize:46,lineHeight:.95,marginTop:14}}>Fill tables,<br/>not <span style={{background:'var(--lime)',color:'var(--ink)',padding:'0 .12em',borderRadius:12}}>feeds.</span></h1>
          <p style={{color:'rgba(244,237,230,.72)',fontSize:15,marginTop:18,maxWidth:340,fontWeight:500,lineHeight:1.5}}>Set a cashback offer, deposit a budget, and enter the next drop. You only pay when a real diner walks in and spends — flat £1.50 fee per verified cover.</p>
          <div className="col" style={{gap:14,marginTop:30}}>
            {[['5.2×','average ROAS for restaurants'],['£1.50','flat fee per verified cover'],['£0','setup · no monthly minimum']].map(([v,l])=>(
              <div key={l} className="row gap8" style={{alignItems:'baseline'}}><div className="display" style={{fontSize:30,color:'var(--lime)',minWidth:74}}>{v}</div><div style={{color:'rgba(244,237,230,.7)',fontSize:13,fontWeight:500}}>{l}</div></div>
            ))}
          </div>
        </div>
        <div className="onb-prog">
          {steps.map((s,i)=>(
            <div key={s} className={`onb-pstep ${i===step?'on':''} ${i<step?'done':''}`}>
              <span className="dot">{i<step?<IcCheck size={13}/>:i+1}</span>{s}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT form */}
      <div className="onb-main scroll-y">
        <div className="onb-card">
          {step===0 && (<>
            <h2 className="display" style={{fontSize:32}}>Create your account</h2>
            <p className="muted mb24" style={{fontWeight:500}}>Get into the next drop in minutes. No card needed to explore.</p>
            <Field label="Work email"><input className="inp" type="email" placeholder="you@restaurant.co.uk" value={email} onChange={e=>setEmail(e.target.value)} /></Field>
            <Field label="Password"><input className="inp" type="password" placeholder="Create a password" value={pwd} onChange={e=>setPwd(e.target.value)} /></Field>
            <div className="row gap8 mt8" style={{color:'var(--muted)',fontSize:12,fontWeight:500}}><IcShield size={15}/> Bank-grade security · your diners’ payments verify covers automatically</div>
          </>)}

          {step===1 && (<>
            <h2 className="display" style={{fontSize:32}}>Tell us about your venue</h2>
            <p className="muted mb24" style={{fontWeight:500}}>This shapes your audience and your ROI forecasts.</p>
            <Field label="Restaurant / brand name"><input className="inp" placeholder="e.g. Ember & Oak" value={brand} onChange={e=>setBrand(e.target.value)} /></Field>
            <div className="grid g2">
              <Field label="Cuisine">
                <select className="inp" value={cuisine} onChange={e=>setCuisine(e.target.value)}>
                  {['Modern European','Italian','Indian','Japanese','British','Small plates','Steakhouse','Café / brunch'].map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Number of sites">
                <select className="inp" value={sites} onChange={e=>setSites(e.target.value)}>
                  {['1','2–5','6–10','10+'].map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Primary location / zone" hint="We launch zone-by-zone for density. London zones 1–2 are live now.">
              <input className="inp" placeholder="e.g. Shoreditch, E1" value={zone} onChange={e=>setZone(e.target.value)} />
            </Field>
          </>)}

          {step===2 && (<>
            <h2 className="display" style={{fontSize:32}}>Add your budget</h2>
            <p className="muted mb24" style={{fontWeight:500}}>Top up your Klaim wallet. Campaigns draw from it as covers are verified — you’re only ever charged for real covers, and unused balance is fully refundable.</p>
            <Field label="Deposit amount">
              <div className="inp-pre"><span className="pre">£</span><input type="number" value={deposit} onChange={e=>{setDeposit(+e.target.value||0);setFunded(false);}} /></div>
            </Field>
            <div className="row gap8 wrap mb24">
              {[500,1000,2000,5000].map(p=><button key={p} className={`tag ${deposit===p?'on':''}`} onClick={()=>{setDeposit(p);setFunded(false);}}>{fmt(p)}</button>)}
            </div>
            <div className={`onb-bank ${funded?'linked':''}`}>
              {!funded ? (<>
                <span style={{width:52,height:52,borderRadius:14,background:funding?'var(--amber)':'var(--lime)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center'}}>{funding?<IcClock size={24}/>:<IcWallet size={24}/>}</span>
                <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15}}>{funding?'Processing payment…':`Deposit ${fmt(deposit)} to your wallet`}</div>
                  <div className="muted" style={{fontSize:12.5,fontWeight:500}}>{funding?'Securely via Stripe':`Funds ~${Math.floor(deposit/9.5)} verified covers`}</div></div>
                <Btn variant="solid" disabled={funding} onClick={fund}>{funding?'…':'Deposit'}</Btn>
              </>):(<>
                <span style={{width:52,height:52,borderRadius:14,background:'var(--lime)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center'}}><IcCheck size={26}/></span>
                <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15}}>{fmt(deposit)} added to your wallet</div><div className="muted" style={{fontSize:12.5,fontWeight:500}}>Ready to fund your first campaign</div></div>
                <span className="badge live"><span className="bd"/>FUNDED</span>
              </>)}
            </div>
            <div className="grid g3 mt24" style={{gap:10}}>
              {[['Pay per cover','Only when a diner spends',<IcCash size={18}/>],['Refundable','Withdraw unused funds',<IcRepeat size={18}/>],['No monthly min','Spend at your pace',<IcCheck size={18}/>]].map(([t,d,ic])=>(
                <div key={t} className="card cream" style={{padding:14}}><span style={{color:'var(--ink)'}}>{ic}</span><div style={{fontWeight:700,fontSize:13,marginTop:8}}>{t}</div><div className="muted" style={{fontSize:11.5,fontWeight:500}}>{d}</div></div>
              ))}
            </div>
          </>)}

          {step===3 && (<>
            <h2 className="display" style={{fontSize:32}}>Set up your first campaign</h2>
            <p className="muted mb24" style={{fontWeight:500}}>One cashback offer, running the whole drop. We’ve pre-filled Klaim’s recommended starter.</p>
            <div className="card cream" style={{padding:16,marginBottom:18}}>
              <div className="row gap8"><RecFlag>AI starter</RecFlag><span className="muted" style={{fontSize:12.5,fontWeight:600}}>Best for new venues — broad reach, strong ROI</span></div>
            </div>
            <Field label="Enter this drop">
              <div className="grid g2" style={{gap:10}}>
                <Choice on={dropDay==='Mon'} title={`Monday · ${drops.fmtD(drops.nextMon)}`} desc={`Runs to ${drops.fmtD(drops.nextFri)}`} onClick={()=>setDropDay('Mon')} />
                <Choice on={dropDay==='Fri'} title={`Friday · ${drops.fmtD(drops.nextFri)}`} desc={`Runs to ${drops.fmtD(drops.nextMon)}`} onClick={()=>setDropDay('Fri')} />
              </div>
            </Field>
            <Field label="Who can claim it?">
              <div className="grid g3" style={{gap:8}}>
                <Choice on={customerType==='all'} title="All" onClick={()=>setCustomerType('all')} />
                <Choice on={customerType==='new'} title="New" onClick={()=>setCustomerType('new')} />
                <Choice on={customerType==='repeat'} title="Repeat" onClick={()=>setCustomerType('repeat')} />
              </div>
            </Field>
            <div className="grid g2" style={{gap:16}}>
              <RangeRow label="Cashback budget" display={`£${cashback}`} value={cashback} min={3} max={25} onChange={setCashback} hint={`You fund £${cashback.toFixed(2)}/cover · diner sees £${dinerNet.toFixed(2)}`} />
              <RangeRow label="Min spend" display={`£${minSpend}`} value={minSpend} min={10} max={120} step={5} onChange={setMinSpend} hint="To qualify" />
            </div>
            <RangeRow label={recurring?'Budget cap per drop':'Budget cap'} display={fmt(budget)} value={budget} min={300} max={Math.max(800,deposit)} step={100} onChange={setBudget} hint="A hard cap — never exceeded." />
            <div className="row spread" style={{padding:'12px 14px',border:'1.5px solid var(--line)',borderRadius:12,marginTop:4,marginBottom:18}}>
              <div style={{fontWeight:700,fontSize:13}}>Repeat every {dropDay==='Mon'?'Monday':'Friday'} drop</div><Toggle on={recurring} onChange={setRecurring} />
            </div>
            <div className="card ink" style={{padding:18}}>
              <div className="row spread"><div><div style={{fontSize:11.5,color:'rgba(244,237,230,.6)',fontWeight:600}}>Projected · per drop</div>
                <div className="display" style={{fontSize:34,color:'var(--lime)',marginTop:4}}>{fmt(rev)}</div></div>
                <div className="row" style={{gap:20}}>
                  <div><div style={{fontSize:11,color:'rgba(244,237,230,.6)',fontWeight:600}}>Covers</div><div className="display" style={{fontSize:24}}>{covers}</div></div>
                  <div><div style={{fontSize:11,color:'rgba(244,237,230,.6)',fontWeight:600}}>ROAS</div><div className="display" style={{fontSize:24,color:'var(--lime)'}}>{roas}×</div></div>
                </div></div>
            </div>
          </>)}

          {step===4 && (<>
            <div style={{textAlign:'center',padding:'10px 0'}}>
              <div style={{width:84,height:84,borderRadius:24,background:'var(--lime)',border:'1.5px solid var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px'}}><IcRocket size={40}/></div>
              <h2 className="display" style={{fontSize:36}}>You’re in the drop! 🎉</h2>
              <p className="muted" style={{fontWeight:500,maxWidth:400,margin:'12px auto 0'}}>{brand||'Your venue'} enters the <b style={{color:'var(--ink)'}}>{dropDay==='Mon'?'Monday':'Friday'} drop on {drops.fmtD(dropDay==='Mon'?drops.nextMon:drops.nextFri)}</b> at 09:00. Covers start landing the moment your first Klaimer pays.</p>
              <div className="grid g3 mt32" style={{gap:10,textAlign:'left'}}>
                {[['Goes live',drops.fmtD(dropDay==='Mon'?drops.nextMon:drops.nextFri),<IcGift size={18}/>],['Diner sees',`£${dinerNet} on £${minSpend}+`,<IcCash size={18}/>],['Est. covers',covers+'/drop',<IcTarget size={18}/>]].map(([k,v,ic])=>(
                  <div key={k} className="card cream" style={{padding:14}}><span style={{color:'var(--ink)'}}>{ic}</span><div className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',marginTop:8}}>{k}</div><div className="display" style={{fontSize:18,marginTop:2}}>{v}</div></div>
                ))}
              </div>
            </div>
          </>)}

          {/* nav */}
          <div className="row spread mt32">
            {step>0 && step<4 ? <Btn variant="ghost" icon={<IcChevL size={15}/>} onClick={back}>Back</Btn> : <span/>}
            {step<4 ? <Btn variant="lime" disabled={!canNext} iconR={<IcArrowR size={15}/>} onClick={next}>{step===0?'Create account':step===3?'Enter the drop':'Continue'}</Btn>
              : <Btn variant="solid" iconR={<IcArrowR size={15}/>} onClick={onComplete} style={{margin:'0 auto'}}>Enter your dashboard</Btn>}
          </div>
        </div>
        <div className="onb-foot">Already have an account? <span className="lk" onClick={onComplete}>Sign in</span></div>
      </div>
    </div>
  );
}
window.Onboarding = Onboarding;
