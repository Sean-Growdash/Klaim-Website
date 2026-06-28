// === Dashboard home ===
function Dashboard({ ctx }) {
  const { go, role, allVenues, venue } = ctx;
  const perms = KD.ROLES[role];
  const [feed, setFeed] = useState(KD.feed);
  const toast = useToast();

  // live feed: prepend a fresh cover every few seconds
  useEffect(()=>{
    const iv = setInterval(()=>{
      const f = KD.genFeed(1)[0];
      f.id = 'f'+Date.now(); f.fresh = true;
      f.time = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
      setFeed(prev=>[f, ...prev].slice(0,12));
    }, 5200);
    return ()=>clearInterval(iv);
  },[]);

  const drops = KD.computeDrops();
  const live = KD.campaigns.filter(c=>c.status==='live');
  const klaims = live.reduce((s,c)=>s+c.klaimed,0);
  const covers = live.reduce((s,c)=>s+c.covers,0);
  const rev = live.reduce((s,c)=>s+c.revenue,0);
  const spend = live.reduce((s,c)=>s+c.spent,0);
  const roas = (rev/spend).toFixed(1);
  const costCover = (spend/covers);
  const queuedNext = KD.campaigns.filter(c=>['scheduled','pending'].includes(c.status) && c.dropDay===drops.nextDay).length;

  return (
    <div className="page">
      <PageHead eyebrow={allVenues? 'All sites · live overview' : venue.zone+' · live overview'} title={`Good afternoon, Sean 👋`}>
        {perms.campaigns && <Btn variant="solid" icon={<IcPlus size={16}/>} onClick={()=>go('builder')}>New campaign</Btn>}
      </PageHead>

      <DropCountdown />

      {/* KPIs */}
      <div className="grid g5" style={{margin:'28px 0',gap:18}}>
        <KPI label="Klaims this drop" value={klaims} icon={<IcGift size={17}/>} delta="35%" deltaDir="up" sub=" vs last drop" />
        <KPI label="Covers this drop" value={covers} icon={<IcUsers size={17}/>} delta="38%" deltaDir="up" sub=" vs last drop" />
        <KPI label="Attributed revenue" value={fmt(rev)} icon={<IcCash size={17}/>} delta="41%" deltaDir="up" sub=" vs last drop" />
        <KPI label="Blended ROAS" value={roas+'×'} icon={<IcTrend size={17}/>} delta="vs 1.4× Meta" deltaDir="up" />
        <KPI label="Avg cashback" value={'£'+(costCover-KD.FEE).toFixed(2)} icon={<IcCash size={17}/>} delta="diner-facing" sub=" (after £1.50 fee)" variant="ink" />
      </div>

      {/* AI anomaly strip */}
      {/* Anomaly watchtower — standard feature */}
      <div className="card mb28" style={{borderColor:'var(--ink)',background:'linear-gradient(150deg,#fff,#fbf7ff)'}}>
          <div className="card-head">
            <h3><span className="ai-mark"><IcSpark size={15}/></span> What needs your attention</h3>
            <span className="ai-pill"><IcBolt size={12}/> Watchtower</span>
          </div>
          <div className="grid g3">
            {KD.anomalies.map(a=>(
              <div key={a.id} className="card flat" style={{padding:16,borderColor: a.sev==='high'?'var(--pink)':'var(--line)'}}>
                <div className="row gap8 mb8">
                  <span style={{width:30,height:30,borderRadius:8,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',
                    background: a.sev==='high'?'var(--pink)':a.sev==='medium'?'var(--amber)':'var(--lime)', color:'var(--ink)'}}>
                    {a.icon==='warn'?<IcWarn size={15}/>:a.icon==='wallet'?<IcWallet size={15}/>:<IcTrend size={15}/>}
                  </span>
                  <div style={{fontWeight:800,fontSize:13.5,lineHeight:1.2}}>{a.title}</div>
                </div>
                <p style={{fontSize:12.5,color:'var(--muted)',lineHeight:1.5,fontWeight:500}}>{a.body}</p>
                <button className="btn sm ghost mt16" onClick={()=>{ a.action.includes('Top up')?go('wallet'):go('campaigns'); }}>
                  {a.action} <IcArrowR size={13}/>
                </button>
              </div>
            ))}
          </div>
        </div>

      <div className="dash-cols mb28">
        {/* LEFT — performance + campaigns */}
        <div className="dash-col">
          <div className="card">
            <div className="card-head">
              <div>
                <h3>Covers by day</h3>
                <div className="ch-sub">Verified Klaim covers · last 4 drops</div>
              </div>
              <div className="leg">
                <span><span className="sw" style={{background:'var(--ink)'}}/>Klaim covers</span>
              </div>
            </div>
            <BarChart data={KD.analytics.dow} keys={['klaim']} colors={['var(--ink)']} height={172} barW={46} />
            <div className="divider" />
            <div className="row spread" style={{flexWrap:'wrap',gap:16}}>
              <MiniStat k="Quiet-night uplift" v="+34%" />
              <MiniStat k="New diners" v="62%" />
              <MiniStat k="Repeat rate" v="41%" />
              <Btn variant="ghost" size="sm" onClick={()=>go('analytics')} iconR={<IcArrowR size={13}/>}>Full analytics</Btn>
            </div>
          </div>

          <div className="card card-pad-0">
            <div className="card-head" style={{padding:'20px 22px 14px',marginBottom:0}}>
              <div><h3>Campaigns this drop</h3>
                <div className="ch-sub">{live.length} live · {covers} covers · {fmt(rev)} attributed</div></div>
              <Btn variant="ghost" size="sm" onClick={()=>go('campaigns')} iconR={<IcArrowR size={13}/>}>View all</Btn>
            </div>
            <table className="tbl">
              <thead><tr><th>Campaign</th><th>Offer</th><th className="num">Covers</th><th className="num">ROAS</th><th className="num">Budget</th></tr></thead>
              <tbody>
                {KD.campaigns.filter(c=>['live','scheduled','paused'].includes(c.status)).slice(0,4).map(c=>(
                  <tr key={c.id} style={{cursor:'pointer'}} onClick={()=>go('campaigns')}>
                    <td><div className="row gap8"><StatusDot status={c.status}/><div>
                      <div style={{fontWeight:700}}>{c.name}</div>
                      <div className="muted mono" style={{fontSize:11}}>{c.cid} · {c.venueName}</div></div></div></td>
                    <td><span className="badge" style={{background:'var(--cream-2)',color:'var(--ink)',borderColor:'var(--line)',fontSize:10.5}}>£{KD.dinerNet(c)} on £{c.minSpend}+</span></td>
                    <td className="num mono" style={{fontWeight:700}}>{c.covers||'—'}</td>
                    <td className="num mono" style={{fontWeight:700}}>{c.roas?c.roas+'×':'—'}</td>
                    <td className="num" style={{minWidth:110}}>
                      <div style={{fontSize:11.5,fontWeight:700,marginBottom:5}}>{Math.round(c.spent/c.budget*100)||0}%</div>
                      <div className="prog" style={{width:96,marginLeft:'auto',height:8}}><div className="fill" style={{width:`${Math.min(100,c.spent/c.budget*100)}%`,background:c.status==='paused'?'var(--pink)':'var(--lime)'}}/></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT — live activity + schedule */}
        <div className="dash-col">
          <div className="card">
            <div className="card-head">
              <div><h3>Cover feed</h3><div className="ch-sub">Verified, settled card payments</div></div>
              <span className="badge live"><span className="bd"/>LIVE</span>
            </div>
            <div className="col scroll-y" style={{gap:10,maxHeight:392,paddingRight:4,marginRight:-4}}>
              {feed.map(f=>(
                <div className={`feed ${f.fresh?'fresh':''}`} key={f.id}>
                  <div className="f-av">{f.init}</div>
                  <div style={{minWidth:0}}>
                    <div className="f-who">{f.name}{f.visit===1 && <span className="f-new">NEW</span>}</div>
                    <div className="f-meta">{f.visit===1?'First visit':`${f.visit}${f.visit===2?'nd':f.visit===3?'rd':'th'} visit`} · {f.zone}</div>
                  </div>
                  <div>
                    <div className="f-amt">{fmt2(f.amt)}</div>
                    <div className="f-sub">{f.time} · {f.covers} {f.covers===1?'cover':'covers'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card ink">
            <div className="card-head">
              <h3 style={{color:'var(--cream)'}}><IcGift size={17}/> Upcoming drops</h3>
              <span className="badge soft" style={{background:'rgba(255,255,255,.1)',color:'var(--lime)',borderColor:'transparent'}}>Mon &amp; Fri · 09:00</span>
            </div>
            {[
              { day:'Mon', date:drops.fmtD(drops.nextMon) },
              { day:'Fri', date:drops.fmtD(drops.nextFri) },
            ].sort((a,b)=> (a.day===drops.nextDay?-1:1)).map((dr,i)=>{
              const queued = KD.campaigns.filter(c=>['scheduled','pending'].includes(c.status) && c.dropDay===dr.day);
              return (
                <div key={dr.day} className="row spread" style={{padding:'14px 0',borderTop:'1px solid rgba(244,237,230,.14)',alignItems:'flex-start'}}>
                  <div>
                    <div className="row gap8"><span style={{fontWeight:700,fontSize:13.5}}>{dr.day==='Mon'?'Monday':'Friday'} · {dr.date}</span>{i===0 && <span className="badge soft" style={{background:'var(--lime)',color:'var(--ink)',borderColor:'transparent',fontSize:9}}>NEXT</span>}</div>
                    <div style={{color:'rgba(244,237,230,.6)',fontSize:11.5,marginTop:2}}>{queued.length?queued.map(c=>c.name).join(' · '):'No campaigns queued yet'}</div>
                  </div>
                  <div style={{textAlign:'right',flex:'none',paddingLeft:12}}>
                    <div className="display" style={{fontSize:24,color:queued.length?'var(--lime)':'rgba(244,237,230,.4)'}}>{queued.length}</div>
                    <div style={{fontSize:9,fontWeight:800,color:'rgba(244,237,230,.5)',letterSpacing:'.06em'}}>QUEUED</div>
                  </div>
                </div>
              );
            })}
            {perms.campaigns && <Btn variant="lime" size="sm" style={{width:'100%',justifyContent:'center',marginTop:16}} icon={<IcPlus size={14}/>} onClick={()=>go('builder')}>Add to a drop</Btn>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ k, v }) {
  return (
    <div>
      <div className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em'}}>{k}</div>
      <div className="display" style={{fontSize:26,marginTop:4}}>{v}</div>
    </div>
  );
}

function StatusDot({ status }) {
  const c = status==='live'?'var(--lime)':status==='paused'?'var(--pink)':status==='scheduled'?'var(--amber)':'var(--cream-3)';
  return <span title={status} style={{width:9,height:9,borderRadius:'50%',background:c,border:'1.5px solid var(--ink)',flex:'none'}}/>;
}

window.Dashboard = Dashboard;
