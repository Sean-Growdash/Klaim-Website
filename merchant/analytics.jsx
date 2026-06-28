// === Standard analytics & insights ===
function Analytics({ ctx }) {
  const { go, role } = ctx;
  const perms = KD.ROLES[role];
  const a = KD.analytics;
  const toast = useToast();
  const [range, setRange] = useState('90d');

  return (
    <div className="page">
      <PageHead eyebrow="Insights · verified covers only" title="Analytics">
        <Segmented value={range} options={[{v:'30d',l:'30d'},{v:'90d',l:'90d'},{v:'12m',l:'12m'}]} onChange={setRange} />
        <Btn variant="ghost" icon={<IcDownload size={15}/>} onClick={()=>toast('Report exported (PDF)')}>Export</Btn>
      </PageHead>

      <div className="grid g4 mb24">
        <KPI label="Total covers" value="2,184" icon={<IcUsers size={17}/>} delta="29%" deltaDir="up" sub=" vs prev" variant="hi" />
        <KPI label="Attributed revenue" value="£98.4k" icon={<IcCash size={17}/>} delta="34%" deltaDir="up" sub=" vs prev" />
        <KPI label="Avg ROAS" value="5.9×" icon={<IcTrend size={17}/>} delta="0.7×" deltaDir="up" sub=" vs prev" />
        <KPI label="Repeat rate" value="41%" icon={<IcRepeat size={17}/>} delta="3pts" deltaDir="up" sub=" vs prev" variant="ink" />
      </div>

      {/* Unified analytics explorer (compare / over time / by day) */}
      <AnalyticsExplorer ctx={ctx} />

      {/* Full-funnel attribution + social/trading */}
      <div className="grid mb24" style={{gridTemplateColumns:'1.3fr 1fr',gap:24,alignItems:'stretch'}}>
        <div className="card">
          <div className="card-head"><div><h3><IcTarget size={16}/> Full-funnel attribution</h3><div className="ch-sub">Seen → Clicked → Klaimed → Covers · all live campaigns</div></div></div>
          <Funnel stages={KD.funnel(KD.campaigns.filter(c=>c.covers>0))} />
          <div className="row spread mt24" style={{paddingTop:16,borderTop:'1px solid var(--line)',flexWrap:'wrap',gap:12}}>
            <Stat2 k="Attributed revenue" v="£98.4k" ic={<IcCash size={16}/>} />
            <Stat2 k="Repeat rate" v="41%" ic={<IcRepeat size={16}/>} />
            <Stat2 k="Avg ROAS" v="5.9×" ic={<IcTrend size={16}/>} />
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div><h3><IcUsers size={16}/> Social &amp; trading</h3><div className="ch-sub">Network effects across your drops</div></div></div>
          {(()=>{ const cs=KD.campaigns.filter(c=>c.covers>0);
            const sum=k=>cs.reduce((s,c)=>s+(c[k]||0),0);
            return (
              <div className="col" style={{gap:14}}>
                <div className="card cream" style={{padding:14}}>
                  <div className="row gap8 mb8"><span style={{width:26,height:26,borderRadius:7,background:'var(--lime)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',border:'1.5px solid var(--ink)'}}><IcUsers size={14}/></span><b style={{fontSize:13.5}}>Squad Klaim</b></div>
                  <div className="row spread"><div><div className="display" style={{fontSize:26}}>{sum('squadCovers')}</div><div className="muted" style={{fontSize:11,fontWeight:600}}>covers in groups</div></div>
                    <div><div className="display" style={{fontSize:26}}>3.2</div><div className="muted" style={{fontSize:11,fontWeight:600}}>avg squad size</div></div>
                    <div><div className="display" style={{fontSize:26}}>+18%</div><div className="muted" style={{fontSize:11,fontWeight:600}}>bigger covers</div></div></div>
                </div>
                <div className="card cream" style={{padding:14}}>
                  <div className="row gap8 mb8"><span style={{width:26,height:26,borderRadius:7,background:'var(--ink)',color:'var(--lime)',display:'flex',alignItems:'center',justifyContent:'center'}}><IcRepeat size={14}/></span><b style={{fontSize:13.5}}>Klaim trading</b></div>
                  <div className="row spread"><div><div className="display" style={{fontSize:26}}>{sum('tradedDrops')}</div><div className="muted" style={{fontSize:11,fontWeight:600}}>drops swapped</div></div>
                    <div><div className="display" style={{fontSize:26}}>{sum('tradeCovers')}</div><div className="muted" style={{fontSize:11,fontWeight:600}}>covers via trade</div></div>
                    <div><div className="display" style={{fontSize:26}}>61%</div><div className="muted" style={{fontSize:11,fontWeight:600}}>new to venue</div></div></div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Cohort retention */}
      <div className="card mb24">
        <div className="card-head"><div><h3><IcGrid size={17}/> Cohort retention</h3><div className="ch-sub">% of each month’s new diners who returned in following months</div></div>
          {!perms.ai && <button className="ai-pill" onClick={()=>go('ai')}><IcSpark size={12}/> AI summary in Pro</button>}</div>
        <div style={{overflowX:'auto'}}>
          <table className="tbl" style={{minWidth:560}}>
            <thead><tr><th>Cohort</th><th className="num">Diners</th>{['M0','M1','M2','M3','M4','M5'].map(m=><th key={m} className="num">{m}</th>)}</tr></thead>
            <tbody>
              {a.cohorts.map(c=>(
                <tr key={c.m}>
                  <td style={{fontWeight:700}}>{c.m} 2026</td>
                  <td className="num mono">{c.size}</td>
                  {c.r.map((v,i)=>(
                    <td key={i} className="num">
                      {v>0 ? <span style={{display:'inline-block',minWidth:46,padding:'5px 0',borderRadius:8,fontWeight:800,fontSize:12,
                        background:`rgba(47,25,107,${0.06+v/130})`, color: v>55?'var(--lime)':'var(--ink)'}}>{v}%</span> : <span className="muted-2">·</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LTV + mix */}
      <div className="grid g3" style={{gap:16}}>
        <div className="card">
          <div className="card-head"><h3>Spend by visit</h3></div>
          <div className="col" style={{gap:14}}>
            {[['1st visit',a.ltv.first,60],['2nd visit',a.ltv.second,76],['3rd+ visit',a.ltv.third,88]].map(([l,v,w])=>(
              <div key={l}>
                <div className="row spread mb8"><span style={{fontWeight:600,fontSize:13}}>{l}</span><b className="display" style={{fontSize:18}}>£{v}</b></div>
                <div className="prog"><div className="fill ink" style={{width:w+'%'}}/></div>
              </div>
            ))}
          </div>
          <div className="divider"/>
          <div className="row spread"><span className="muted" style={{fontWeight:600,fontSize:13}}>Blended 90-day LTV</span><b className="display" style={{fontSize:24}}>£{a.ltv.blended}</b></div>
        </div>

        <div className="card">
          <div className="card-head"><h3>New vs returning</h3></div>
          <div className="row" style={{justifyContent:'center',padding:'8px 0 18px'}}>
            <Donut segments={a.spendMix} size={150} stroke={24}
              center={<><div className="display" style={{fontSize:30}}>{a.ltv.repeatRate}%</div><div className="muted" style={{fontSize:10.5,fontWeight:700}}>RETURN</div></>} />
          </div>
          <div className="col" style={{gap:8}}>
            {a.spendMix.map(s=>(
              <div key={s.l} className="row spread"><span className="row gap6" style={{fontSize:13,fontWeight:600}}><span className="sw" style={{width:11,height:11,borderRadius:3,background:s.c,border:'1px solid var(--ink)'}}/>{s.l}</span><b className="mono">{s.v}%</b></div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Repeat behaviour</h3></div>
          <div className="col" style={{gap:16}}>
            <Stat2 k="Avg days to return" v={a.ltv.daysToReturn+'d'} ic={<IcClock size={16}/>} />
            <Stat2 k="2nd visit un-incentivised" v="71%" ic={<IcGift size={16}/>} />
            <Stat2 k="Become regulars (4+)" v="18%" ic={<IcFlame size={16}/>} />
          </div>
          <div className="card cream mt16" style={{padding:14}}>
            <div className="muted" style={{fontSize:12.5,fontWeight:500,lineHeight:1.5}}>💡 Most second visits happen <b style={{color:'var(--ink)'}}>without</b> a cashback offer — diners discover you, then come back at full price.</div>
          </div>
        </div>
      </div>

      {/* Pro upsell for non-ai */}
      {!perms.ai && (
        <div className="card mt24" style={{background:'var(--ink)',color:'var(--cream)',textAlign:'center',padding:34}}>
          <span className="ai-pill" style={{background:'rgba(199,255,79,.16)'}}><IcSpark size={12}/> KLAIM PRO</span>
          <h3 className="display" style={{fontSize:26,color:'var(--cream)',margin:'14px 0 8px'}}>Ask your data anything</h3>
          <p style={{color:'rgba(244,237,230,.7)',maxWidth:440,margin:'0 auto 20px',fontWeight:500}}>Natural-language analytics, AI campaign suggestions, anomaly alerts &amp; anonymised competitor benchmarking.</p>
          <Btn variant="lime" onClick={()=>go('ai')}>Explore Pro insights</Btn>
        </div>
      )}
    </div>
  );
}

function Stat2({ k, v, ic }) {
  return <div className="row spread"><span className="row gap8" style={{fontSize:13,fontWeight:600,color:'var(--muted)'}}><span style={{color:'var(--ink)'}}>{ic}</span>{k}</span><b className="display" style={{fontSize:18}}>{v}</b></div>;
}

// line/area trend chart
function TrendChart({ data, h=210 }) {
  const w=620;
  const max=Math.max(...data)*1.1, min=0;
  const pts=data.map((v,i)=>[ (i/(data.length-1))*w, h-24 - (v/max)*(h-44) ]);
  const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=path+` L ${w} ${h-24} L 0 ${h-24} Z`;
  const labels=['Apr','','','May','','','Jun','','','Now','',''];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto',display:'block'}}>
      {[0,.25,.5,.75,1].map(g=><line key={g} x1="0" x2={w} y1={(h-24)*(1-g)+ g*0} y2={(h-24)*(1-g)} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5"/>)}
      <path d={area} fill="var(--lime)" opacity="0.18"/>
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=> i%3===0 && <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--ink)"/>)}
      {pts[pts.length-1] && <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="6" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2"/>}
    </svg>
  );
}

window.Analytics = Analytics;
