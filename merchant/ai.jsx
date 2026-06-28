// === Advanced Analytics (Klaim Pro · AI-native) ===
function mdBold(text){
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p,i)=> p.startsWith('**') ? <b key={i}>{p.slice(2,-2)}</b> : <React.Fragment key={i}>{p}</React.Fragment>);
}

const AI_ANSWERS = [
  { k:/worst|roas|offer|low/i, a:KD.aiChatSeed[0].a, chips:KD.aiChatSeed[0].chips },
  { k:/repeat|return|loyal|come back|retention/i,
    a:'Your blended repeat rate is **41%**, well above the London casual-dining benchmark of 33%. Diners acquired in **March have the strongest curve** — 44% returned by month 3. Critically, **71% of second visits carry no cashback**, so you’re not training discount-dependence. The biggest lever: a **£10-on-£50 repeat offer to your 1,840 lapsed-60d+ diners**, added to the next drop.',
    chips:['Build a win-back campaign','Show March cohort'] },
  { k:/budget|spend|forecast|cost|wallet/i,
    a:'Across live campaigns you’re spending **~£2,650 this drop** at a blended **£9.40/cover** (cashback + the flat £1.50 fee). **New Diner Welcome** will hit its £1,600 cap before Sunday — covers pause until Monday’s drop unless you add ~£400. I’d top it up; it’s your strongest acquisition engine.',
    chips:['Top up wallet','Reallocate budget'] },
  { k:/who|customer|diner|demographic|age|gender|segment|audience/i,
    a:'Your base skews **25–34 (38%)** and **female (54%)**, concentrated in **Shoreditch & Soho**. Your highest-value segment is **Young foodie pros (31%, £500+/mo, 46% repeat)**. The clearest gap: **1,840 lapsed-60d+ diners** worth ~£124 blended LTV each — a targeted win-back is your best ROI move.',
    chips:['Build a win-back campaign','Show geography'] },
  { k:/best|top|grow|opportunity|where|next/i,
    a:'Your biggest opportunity is **splitting broad offers into new + repeat**. Soho Weekend runs one £8-on-£40 offer to everyone; modelling a **£20-on-£100 new-diner** offer alongside a leaner **£8-on-£50 repeat** offer lifts acquisition ~22% at the same spend. Second: the **Marylebone lunch** market — demand up 51%, and your pending Lunch Launch is well-timed for Monday’s drop.',
    chips:['Draft new-diner offer','Approve Marylebone'] },
];
function answerFor(q){
  const hit = AI_ANSWERS.find(x=>x.k.test(q));
  return hit || { a:`Across your 4 sites you drove **2,184 covers** and **£98.4k** attributed revenue in the last 90 days at a **5.9× ROAS** — 1.7× better than the peer median. Ask me about a cohort, a demographic, an offer or a drop and I’ll go deeper.`, chips:['Who are my best customers?','Which offer has worst ROAS?'] };
}

function AdvancedAnalytics({ ctx }) {
  const { go } = ctx;
  const toast = useToast();
  const A = KD.audience;
  const [msgs, setMsgs] = useState([
    { who:'ai', text:`Hi Sean 👋 I’m your Klaim analyst. I can see all 4 Ember & Oak sites in real time. Ask me about your customers, cohorts or campaigns — or try a suggestion below.` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef();

  // benchmark filters
  const [cuisine, setCuisine] = useState('Modern European');
  const [zone, setZone] = useState('All London');
  const [brand, setBrand] = useState('');
  const bm = useMemo(()=>KD.benchmark(cuisine, zone, brand),[cuisine,zone,brand]);

  useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; },[msgs,typing]);

  function ask(q){
    if(!q.trim()) return;
    setMsgs(m=>[...m,{who:'me',text:q}]);
    setInput(''); setTyping(true);
    setTimeout(()=>{ const ans = answerFor(q); setTyping(false); setMsgs(m=>[...m,{who:'ai',text:ans.a,chips:ans.chips}]); }, 900+Math.random()*700);
  }
  const starters = ['Who are my best customers?','How is my repeat rate trending?','Where should I grow next?','Am I on budget this drop?'];
  const maxAge = Math.max(...A.age.map(a=>a.v));
  const [mode, setMode] = useState('dashboards'); // dashboards | chat

  return (
    <div className="page">
      <PageHead eyebrow="Klaim Pro · AI-native" title="Advanced Analytics">
        <div className="seg seg-lg">
          <button className={mode==='dashboards'?'on':''} onClick={()=>setMode('dashboards')}><IcGrid size={15}/> Dashboards</button>
          <button className={mode==='chat'?'on':''} onClick={()=>setMode('chat')}><IcSpark size={15}/> AI chat</button>
        </div>
        <span className="ai-pill"><IcShield size={12}/> Pro plan</span>
      </PageHead>

      {/* ===== AI chat (full page) ===== */}
      {mode==='chat' && (
      <div className="ai-card chat-full">
        <div className="row spread" style={{padding:'16px 20px',borderBottom:'1.5px solid var(--line)'}}>
          <div className="row gap8"><span className="ai-mark" style={{width:34,height:34}}><IcSpark size={18}/></span>
            <div><div style={{fontWeight:800,fontSize:15}}>Ask your data</div><div className="muted" style={{fontSize:12,fontWeight:500}}>Natural-language analytics across all sites</div></div></div>
          <span className="badge live"><span className="bd"/>LIVE DATA</span>
        </div>
        <div ref={scrollRef} className="scroll-y" style={{flex:1,minHeight:0,padding:'24px',display:'flex',flexDirection:'column',gap:14}}>
          {msgs.map((m,i)=>(
            <div key={i} className="row" style={{gap:10,alignItems:'flex-start',flexDirection: m.who==='me'?'row-reverse':'row'}}>
              {m.who==='ai'? <span className="ai-mark" style={{width:30,height:30,marginTop:2}}><IcSpark size={15}/></span> : <Av init="S" color="var(--pink)" size={30} />}
              <div style={{maxWidth:'76%'}}>
                <div style={{padding:'13px 16px',borderRadius:16,fontSize:13.5,lineHeight:1.55,fontWeight:500,
                  background: m.who==='me'?'var(--ink)':'var(--white)', color: m.who==='me'?'var(--cream)':'var(--ink)',
                  border: m.who==='me'?'none':'1.5px solid var(--ink)',
                  borderBottomRightRadius: m.who==='me'?4:16, borderBottomLeftRadius: m.who==='ai'?4:16}}>{mdBold(m.text)}</div>
                {m.chips && (
                  <div className="row gap6 wrap mt8">
                    {m.chips.map(c=><button key={c} className="tag" style={{fontSize:11.5}} onClick={()=>{ /grow|geography|cohort/i.test(c)?ask(c):c.toLowerCase().includes('campaign')||c.toLowerCase().includes('offer')||c.toLowerCase().includes('win-back')||c.toLowerCase().includes('draft')?go('builder'):c.toLowerCase().includes('budget')||c.toLowerCase().includes('top up')||c.toLowerCase().includes('wallet')?go('wallet'):c.toLowerCase().includes('approve')?go('campaigns'):ask(c); }}>{c} <IcArrowR size={11}/></button>)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && <div className="row gap10" style={{alignItems:'center'}}><span className="ai-mark" style={{width:30,height:30}}><IcSpark size={15}/></span><div className="typing"><span/><span/><span/></div></div>}
        </div>
        <div style={{padding:'14px 20px',borderTop:'1.5px solid var(--line)',background:'var(--white)'}}>
          {msgs.length<=1 && <div className="row gap6 wrap mb16">{starters.map(s=><button key={s} className="tag" onClick={()=>ask(s)}>{s}</button>)}</div>}
          <div className="row gap8">
            <input className="inp" placeholder="Ask about customers, cohorts, ROAS, budgets…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask(input)} />
            <Btn variant="solid" onClick={()=>ask(input)} icon={<IcSend size={15}/>} style={{flex:'none'}}>Ask</Btn>
          </div>
        </div>
      </div>
      )}

      {mode==='dashboards' && (<>
      {/* ===== Customer base ===== */}
      <div className="row spread mb16" style={{alignItems:'baseline',flexWrap:'wrap',gap:10}}>
        <div><h3 className="display" style={{fontSize:22}}>Know your diners</h3>
          <div className="muted" style={{fontSize:13,fontWeight:500}}>Verified demographics across your <b style={{color:'var(--ink)'}}>{A.total.toLocaleString('en-GB')}</b> reachable diners · privacy-safe &amp; aggregated</div></div>
        <span className="ai-pill"><IcUsers size={12}/> {A.reachable.toLocaleString('en-GB')} addressable now</span>
      </div>

      <div className="grid g3 mb24">
        {/* Gender */}
        <div className="card">
          <div className="card-head"><h3 style={{fontSize:16}}>Gender</h3></div>
          <div className="row" style={{justifyContent:'center',padding:'4px 0 16px'}}>
            <Donut segments={A.gender.map(g=>({v:g.v,c:g.c}))} size={140} stroke={22}
              center={<><div className="display" style={{fontSize:24}}>{A.gender[0].v}%</div><div className="muted" style={{fontSize:10,fontWeight:700}}>FEMALE</div></>} />
          </div>
          <div className="col" style={{gap:8}}>
            {A.gender.map(g=>(<div key={g.l} className="row spread"><span className="row gap6" style={{fontSize:13,fontWeight:600}}><span className="sw" style={{width:11,height:11,borderRadius:3,background:g.c,border:'1px solid var(--ink)'}}/>{g.l}</span><b className="mono">{g.v}%</b></div>))}
          </div>
        </div>

        {/* Age */}
        <div className="card">
          <div className="card-head"><h3 style={{fontSize:16}}>Age</h3><span className="muted" style={{fontSize:12,fontWeight:600}}>Peak 25–34</span></div>
          <div className="col" style={{gap:13,marginTop:4}}>
            {A.age.map(a=>(
              <div key={a.band}>
                <div className="row spread mb8"><span style={{fontWeight:600,fontSize:13}}>{a.band}</span><b className="mono" style={{fontSize:13}}>{a.v}%</b></div>
                <div className="prog" style={{height:9}}><div className="fill" style={{width:`${a.v/maxAge*100}%`,background: a.v===maxAge?'var(--lime)':'var(--ink)'}}/></div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending power */}
        <div className="card">
          <div className="card-head"><h3 style={{fontSize:16}}>Spending power</h3><span className="muted" style={{fontSize:12,fontWeight:600}}>Monthly dining</span></div>
          <div className="seg-stack mt8">
            {A.spend.map(s=><div key={s.l} title={`${s.l}: ${s.v}%`} style={{width:`${s.v}%`,background:s.c}}/>)}
          </div>
          <div className="col" style={{gap:8,marginTop:16}}>
            {A.spend.map(s=>(<div key={s.l} className="row spread"><span className="row gap6" style={{fontSize:12.5,fontWeight:600}}><span className="sw" style={{width:11,height:11,borderRadius:3,background:s.c,border:'1px solid var(--ink)'}}/>{s.l}</span><b className="mono">{s.v}%</b></div>))}
          </div>
          <div className="card cream mt16" style={{padding:12}}><div className="muted" style={{fontSize:12,fontWeight:500,lineHeight:1.45}}><b style={{color:'var(--ink)'}}>37%</b> of your base spends £500+/mo dining out — premium targeting unlocks them.</div></div>
        </div>
      </div>

      <div className="grid mb28" style={{gridTemplateColumns:'1.15fr 1fr',gap:24,alignItems:'stretch'}}>
        {/* Geography */}
        <div className="card">
          <div className="card-head"><div><h3 style={{fontSize:16}}><IcMap size={16}/> Geography</h3><div className="ch-sub">Where your diners live · share &amp; avg spend</div></div></div>
          <table className="tbl">
            <thead><tr><th>Zone</th><th className="num">Diners</th><th>Share</th><th className="num">Avg spend</th></tr></thead>
            <tbody>
              {A.geography.map(g=>(
                <tr key={g.zone}>
                  <td style={{fontWeight:700}}>{g.zone}</td>
                  <td className="num mono">{g.diners.toLocaleString('en-GB')}</td>
                  <td style={{width:140}}><div className="row gap8"><div className="prog" style={{flex:1,height:8}}><div className="fill" style={{width:`${g.share*4}%`}}/></div><span className="mono muted" style={{fontSize:11,fontWeight:700,width:30,textAlign:'right'}}>{g.share}%</span></div></td>
                  <td className="num mono" style={{fontWeight:700}}>£{g.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Segments */}
        <div className="card">
          <div className="card-head"><div><h3 style={{fontSize:16}}><IcSpark size={15}/> High-value segments</h3><div className="ch-sub">AI-clustered personas you can target directly</div></div></div>
          <div className="col" style={{gap:10}}>
            {A.segments.map(s=>(
              <div key={s.name} className="card flat" style={{padding:14,borderColor:s.repeat===0?'var(--pink)':'var(--line)'}}>
                <div className="row spread" style={{alignItems:'flex-start'}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:13.5}}>{s.name}</div>
                    <div className="muted" style={{fontSize:11.5,fontWeight:500,marginTop:2}}>{s.note}</div>
                    <div className="row gap6 mt8 wrap">
                      <span className="badge soft" style={{fontSize:10}}>{s.age}</span>
                      <span className="badge soft" style={{fontSize:10}}>{s.spend}</span>
                      {s.repeat>0 && <span className="badge soft" style={{fontSize:10}}>{s.repeat}% repeat</span>}
                    </div>
                  </div>
                  <div style={{textAlign:'right',flex:'none',paddingLeft:10}}>
                    <div className="display" style={{fontSize:22}}>{s.share}%</div>
                    <div className="muted" style={{fontSize:10,fontWeight:700}}>{s.size.toLocaleString('en-GB')}</div>
                    <button className="btn ghost sm mt8" style={{padding:'5px 10px'}} onClick={()=>{toast('Targeting '+s.name);go('builder');}}>Target <IcArrowR size={11}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Dynamic competitor benchmark ===== */}
      <div className="card mb28">
        <div className="card-head" style={{flexWrap:'wrap',gap:12}}>
          <div><h3><IcTarget size={17}/> Competitor benchmark</h3><div className="ch-sub">Anonymised — compare against a live cohort you define</div></div>
          <span className="badge soft"><IcShield size={12}/> {bm.brandNote}</span>
        </div>
        {/* filters */}
        <div className="grid g3 mb24" style={{gap:12}}>
          <Field label="Cuisine type"><select className="inp" value={cuisine} onChange={e=>setCuisine(e.target.value)}>{KD.BENCH_CUISINES.map(c=><option key={c}>{c}</option>)}</select></Field>
          <Field label="Geography"><select className="inp" value={zone} onChange={e=>setZone(e.target.value)}>{KD.BENCH_ZONES.map(z=><option key={z}>{z}</option>)}</select></Field>
          <Field label="Compare to a brand" hint="Optional — matches venues like this brand"><div className="inp-pre"><span className="pre" style={{padding:'13px 12px'}}><IcSearch size={15}/></span><input placeholder="e.g. Dishoom" value={brand} onChange={e=>setBrand(e.target.value)} /></div></Field>
        </div>
        <div className="row gap8 mb16" style={{flexWrap:'wrap'}}>
          <span className="tag on"><IcUsers size={12}/> You</span>
          <span className="tag" style={{cursor:'default'}}>Cohort: <b style={{marginLeft:4}}>{bm.label}</b></span>
        </div>
        <div className="grid g2" style={{gap:24}}>
          <BenchRow label="ROAS" you={bm.you.roas} peer={bm.peer.roas} top={bm.top.roas} unit="×" />
          <BenchRow label="Avg cashback (lower = leaner)" you={bm.you.cpc} peer={bm.peer.cpc} top={bm.top.cpc} unit="£" pre />
          <BenchRow label="Repeat rate" you={bm.you.repeat} peer={bm.peer.repeat} top={bm.top.repeat} unit="%" />
          <BenchRow label="Quiet-night uplift" you={bm.you.fillUplift} peer={bm.peer.fillUplift} top={bm.top.fillUplift} unit="%" />
        </div>
        <div className="card cream mt24" style={{padding:14}}>
          <div className="muted" style={{fontSize:12.5,fontWeight:500,lineHeight:1.5}}>📊 Against <b style={{color:'var(--ink)'}}>{bm.label}</b> you beat the peer median on ROAS and repeat. Closing to top-quartile cost/cover (£{bm.top.cpc}) would save ~£1,900/mo at your volume.</div>
        </div>
      </div>

      {/* ===== Predictive forecast ===== */}
      <div className="card ink">
        <div className="card-head"><h3 style={{color:'var(--cream)'}}><IcSpark size={17}/> Predictive forecast · next 4 drops</h3><span className="ai-pill" style={{background:'rgba(199,255,79,.16)'}}>87% confidence</span></div>
        <div className="grid g4" style={{gap:16}}>
          {[['Projected covers','1,420','▲ 12%'],['Projected revenue','£64.2k','▲ 15%'],['Forecast ROAS','5.6×','▲ 0.3×'],['Across next','4 drops','Mon + Fri ×2']].map(([k,v,d])=>(
            <div key={k}><div style={{fontSize:12,color:'rgba(244,237,230,.6)',fontWeight:600}}>{k}</div>
              <div className="display" style={{fontSize:36,color:'var(--lime)',marginTop:6}}>{v}</div>
              <div style={{fontSize:11.5,color:'rgba(244,237,230,.6)',marginTop:4,fontWeight:600}}>{d}</div></div>
          ))}
        </div>
        <div style={{marginTop:20,paddingTop:18,borderTop:'1px solid rgba(244,237,230,.16)'}}>
          <p style={{color:'rgba(244,237,230,.75)',fontSize:13,fontWeight:500,lineHeight:1.55}}>
            {mdBold('If you **approve the Marylebone Lunch Launch** for Monday’s drop and **top up £400 to New Diner Welcome**, the model projects **+14% covers** versus holding steady. The biggest risk is the King’s Cross opening offer underperforming in its first drop — I’ll alert you within 48h if covers track below forecast.')}
          </p>
        </div>
      </div>
      </>)}
    </div>
  );
}

function BenchRow({ label, you, peer, top, unit, pre }) {
  const max = Math.max(you,peer,top)*1.05;
  const bar = (v,c)=> <div className="prog" style={{flex:1,height:9}}><div className="fill" style={{width:`${v/max*100}%`,background:c}}/></div>;
  const f = v => pre? '£'+v : v+unit;
  return (
    <div>
      <div className="row spread mb8"><span style={{fontWeight:700,fontSize:13}}>{label}</span></div>
      <div className="col" style={{gap:7}}>
        <div className="row gap8"><span style={{width:60,fontSize:11,fontWeight:800,color:'var(--ink)'}}>You</span>{bar(you,'var(--ink)')}<span className="mono" style={{width:46,textAlign:'right',fontWeight:800,fontSize:12.5}}>{f(you)}</span></div>
        <div className="row gap8"><span style={{width:60,fontSize:11,fontWeight:700,color:'var(--muted)'}}>Peer med</span>{bar(peer,'var(--cream-3)')}<span className="mono muted" style={{width:46,textAlign:'right',fontWeight:700,fontSize:12.5}}>{f(peer)}</span></div>
        <div className="row gap8"><span style={{width:60,fontSize:11,fontWeight:700,color:'var(--muted)'}}>Top 25%</span>{bar(top,'var(--lime)')}<span className="mono muted" style={{width:46,textAlign:'right',fontWeight:700,fontSize:12.5}}>{f(top)}</span></div>
      </div>
    </div>
  );
}

window.AdvancedAnalytics = AdvancedAnalytics;
