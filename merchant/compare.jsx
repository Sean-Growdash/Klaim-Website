// === Analytics Explorer — unified compare / trend / by-day workbench ===
const EX_METRICS = {
  covers:  { label:'Covers',        short:'Covers',   better:'high', additive:true,  fmt:v=>Math.round(v).toLocaleString('en-GB'),
             dow:[88,72,96,118,164,152,104], series:[42,51,48,63,72,69,84,91,88,102,118,131] },
  revenue: { label:'Attr. revenue', short:'Revenue',  better:'high', additive:true,  fmt:v=>fmt(v),
             dow:[4224,3456,4608,5664,7872,7296,4992], series:[1890,2295,2160,2835,3240,3105,3780,4095,3960,4590,5310,5895] },
  roas:    { label:'ROAS',          short:'ROAS',     better:'high', additive:false, fmt:v=>(+v).toFixed(1)+'×',
             dow:[5.1,5.4,5.8,6.0,5.6,5.5,5.2], series:[4.1,4.3,4.5,4.7,4.9,5.0,5.2,5.4,5.5,5.6,5.8,5.9] },
  cashback:{ label:'Cashback',      short:'Cashback', better:'low',  additive:false, fmt:v=>'£'+(+v).toFixed(2),
             dow:[6.7,7.0,7.6,8.1,7.9,7.5,7.3], series:[10.5,10,9.6,9.2,8.9,8.6,8.4,8.2,8,7.9,7.8,7.7] },
  repeat:  { label:'Repeat rate',   short:'Repeat',   better:'high', additive:false, fmt:v=>Math.round(v)+'%',
             dow:[44,40,42,39,38,41,46], series:[33,34,35,36,37,38,39,40,40,41,41,41] },
};
const STORE_COLOR = { sho:'var(--ink)', soh:'var(--pink)', mar:'var(--teal)', kgx:'var(--amber)' };
const PERIODS = { '30d':6, '90d':9, '12m':12 };

function AnalyticsExplorer({ ctx }) {
  const { allVenues, venue } = ctx;
  const [view, setView] = useState('compare');   // compare | time | dow
  const [groupBy, setGroupBy] = useState('store'); // campaign | store | matrix
  const [metric, setMetric] = useState('covers');
  const [period, setPeriod] = useState('90d');
  const [store, setStore] = useState(allVenues ? 'all' : venue.id);
  const [viz, setViz] = useState('bars');          // bars | table

  const M = EX_METRICS[metric];

  // ---- source campaigns (respect global venue switcher + local store filter) ----
  const data = useMemo(()=>{
    let cs = KD.campaigns.filter(c=>c.covers>0);
    if(!allVenues) cs = cs.filter(c=>c.venue===venue.id);
    if(store!=='all') cs = cs.filter(c=>c.venue===store);
    return cs;
  },[allVenues, venue, store]);

  const eff = c => c.covers*c.cpc;
  const campaignRows = data.map(c=>({
    id:c.id, label:c.name, store:c.venue, sub:c.venueName, cid:c.cid,
    offer:`£${KD.dinerNet(c)} on £${c.minSpend}+`, cust:c.customerType,
    covers:c.covers, revenue:c.revenue, roas:c.roas, cashback:KD.dinerNet(c), repeat:c.repeat, spent:c.spent, budget:c.budget,
    seen:c.seen, clicked:c.clicked, klaimed:c.klaimed,
  }));
  const storeRows = KD.venues.map(v=>{
    const cs = data.filter(c=>c.venue===v.id);
    if(!cs.length) return null;
    const covers=cs.reduce((s,c)=>s+c.covers,0), revenue=cs.reduce((s,c)=>s+c.revenue,0);
    const effSpend=cs.reduce((s,c)=>s+eff(c),0), budget=cs.reduce((s,c)=>s+c.budget,0), spent=cs.reduce((s,c)=>s+c.spent,0);
    return { id:v.id, label:v.short, store:v.id, sub:`${cs.length} campaign${cs.length>1?'s':''}`,
      covers, revenue, roas:+(revenue/effSpend).toFixed(1), cashback:+(effSpend/covers - KD.FEE).toFixed(2),
      repeat:Math.round(cs.reduce((s,c)=>s+c.repeat*c.covers,0)/covers), spent, budget,
      seen:cs.reduce((s,c)=>s+c.seen,0), clicked:cs.reduce((s,c)=>s+c.clicked,0), klaimed:cs.reduce((s,c)=>s+c.klaimed,0) };
  }).filter(Boolean);

  // store share (for scaling additive time/dow series when a store is picked)
  const totalCovers = KD.campaigns.filter(c=>c.covers>0).reduce((s,c)=>s+c.covers,0);
  const share = store==='all' ? 1 : (storeRows[0]? storeRows[0].covers/totalCovers : 1);
  const scale = v => M.additive ? v*share : v;

  const rows = groupBy==='store' ? storeRows : campaignRows;
  const sorted = [...rows].sort((a,b)=> M.better==='low' ? a[metric]-b[metric] : b[metric]-a[metric]);
  const maxV = Math.max(...rows.map(r=>r[metric]), 0.0001);
  const bestId = sorted[0]?.id;
  const groups = KD.venues.map(v=>({ v, items:campaignRows.filter(c=>c.store===v.id) })).filter(g=>g.items.length);

  // time series
  const sliced = M.series.slice(M.series.length - PERIODS[period]).map(scale);
  const timeLabels = period==='12m'
    ? ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'].slice(-PERIODS[period])
    : Array.from({length:PERIODS[period]},(_,i)=> i===PERIODS[period]-1?'Now':`W${i+1}`);

  const dowData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>({ d, v: scale(M.dow[i]) }));
  const storeName = store==='all' ? (allVenues?'All sites':venue.short) : KD.venues.find(v=>v.id===store)?.short;

  return (
    <div className="card mb28">
      <div className="card-head" style={{flexWrap:'wrap',gap:12}}>
        <div><h3><IcSliders size={17}/> Explore performance</h3>
          <div className="ch-sub">Pick a metric, period &amp; store — view as comparison, trend or by day</div></div>
        <Segmented value={view} options={[{v:'compare',l:'Compare'},{v:'time',l:'Over time'},{v:'dow',l:'By day'}]} onChange={setView} />
      </div>

      {/* control bar */}
      <div className="row gap8 wrap mb24" style={{alignItems:'center'}}>
        {Object.keys(EX_METRICS).map(k=>(
          <button key={k} className={`tag ${metric===k?'on':''}`} onClick={()=>setMetric(k)}>{EX_METRICS[k].label}</button>
        ))}
        <span style={{flex:1}}/>
        <select className="inp" style={{width:'auto',padding:'9px 36px 9px 13px',fontSize:13}} value={store} onChange={e=>setStore(e.target.value)}>
          <option value="all">All stores</option>
          {KD.venues.map(v=><option key={v.id} value={v.id}>{v.short}</option>)}
        </select>
        {view==='compare' && <Segmented value={groupBy} options={[{v:'campaign',l:'Campaign'},{v:'store',l:'Store'},{v:'matrix',l:'Store × campaign'}]} onChange={setGroupBy} />}
        {view==='compare' && <Segmented value={viz} options={[{v:'bars',l:'Bars'},{v:'table',l:'Table'}]} onChange={setViz} />}
        {view==='time' && <Segmented value={period} options={[{v:'30d',l:'30d'},{v:'90d',l:'90d'},{v:'12m',l:'12m'}]} onChange={setPeriod} />}
      </div>

      {/* ===== COMPARE ===== */}
      {view==='compare' && (
        groupBy==='matrix' ? <MatrixTable groups={groups} storeRows={storeRows} metric={metric} />
        : viz==='bars' ? (
          <div className="col" style={{gap:12}}>
            {sorted.map(r=>(
              <div key={r.id} className="row gap12" style={{alignItems:'center'}}>
                <div style={{width:groupBy==='store'?130:200,flex:'none',minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.label}</div>
                  <div className="muted" style={{fontSize:11,fontWeight:500}}>{r.sub}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="cmp-track"><div className="cmp-fill" style={{width:`${Math.max(6,(r[metric]/maxV)*100)}%`,background:r.id===bestId?'var(--lime)':'var(--ink)',borderColor:r.id===bestId?'var(--ink)':'transparent'}}/></div>
                </div>
                <div className="mono" style={{width:96,textAlign:'right',flex:'none',fontWeight:800,fontSize:15}}>
                  {M.fmt(r[metric])}{r.id===bestId && <span className="cmp-best">BEST</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="tbl" style={{minWidth:680}}>
              <thead><tr><th>{groupBy==='store'?'Store':'Campaign'}</th>
                {Object.keys(EX_METRICS).map(k=><th key={k} className="num" style={metric===k?{color:'var(--ink)'}:null}>{EX_METRICS[k].short}</th>)}
                <th className="num">Budget used</th></tr></thead>
              <tbody>
                {sorted.map(r=>(
                  <tr key={r.id}>
                    <td><div className="row gap8">{groupBy==='campaign' && <span style={{width:8,height:8,borderRadius:'50%',background:STORE_COLOR[r.store],flex:'none'}}/>}
                      <div><div style={{fontWeight:700}}>{r.label}</div><div className="muted" style={{fontSize:11}}>{r.sub}</div></div></div></td>
                    {Object.keys(EX_METRICS).map(k=><td key={k} className="num mono" style={{fontWeight:metric===k?800:600,background:metric===k?'rgba(199,255,79,.18)':'transparent'}}>{EX_METRICS[k].fmt(r[k])}</td>)}
                    <td className="num"><div className="row gap8" style={{justifyContent:'flex-end'}}><span className="mono" style={{fontSize:12,fontWeight:700}}>{Math.round(r.spent/r.budget*100)}%</span>
                      <div className="prog" style={{width:70,height:7}}><div className="fill" style={{width:`${Math.min(100,r.spent/r.budget*100)}%`}}/></div></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ===== OVER TIME ===== */}
      {view==='time' && (
        <div>
          <div className="row spread mb16" style={{alignItems:'baseline'}}>
            <div className="muted" style={{fontSize:13,fontWeight:600}}>{M.label} · {storeName} · last {period}</div>
            <div className="row gap16" style={{alignItems:'baseline'}}>
              <div><span className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Latest </span><b className="display" style={{fontSize:22}}>{M.fmt(sliced[sliced.length-1])}</b></div>
              <div className="display" style={{fontSize:22,color:'var(--ok)'}}>{M.better==='low'?'▼':'▲'} {Math.abs(Math.round((sliced[sliced.length-1]-sliced[0])/sliced[0]*100))}%</div>
            </div>
          </div>
          <LineChart data={sliced} labels={timeLabels} fmt={M.fmt} />
        </div>
      )}

      {/* ===== BY DAY ===== */}
      {view==='dow' && (
        <div>
          <div className="muted mb16" style={{fontSize:13,fontWeight:600}}>{M.label} by day of week · {storeName} · verified Klaim covers</div>
          <BarChart data={dowData} keys={['v']} colors={['var(--ink)']} height={200} barW={48} />
          <div className="muted" style={{fontSize:11.5,textAlign:'center',marginTop:14,fontWeight:600}}>Fri &amp; Sat lead — early-week drops add the most incremental covers</div>
        </div>
      )}
    </div>
  );
}

function MatrixTable({ groups, storeRows, metric }) {
  return (
    <div style={{overflowX:'auto'}}>
      <table className="tbl" style={{minWidth:720}}>
        <thead><tr><th>Store / campaign</th>
          {Object.keys(EX_METRICS).map(k=><th key={k} className="num" style={metric===k?{color:'var(--ink)'}:null}>{EX_METRICS[k].short}</th>)}
          <th className="num">Budget used</th></tr></thead>
        <tbody>
          {groups.map(g=>{
            const sr = storeRows.find(s=>s.id===g.v.id);
            return (
              <React.Fragment key={g.v.id}>
                <tr style={{background:'var(--cream)'}}>
                  <td><div className="row gap8"><span style={{width:10,height:10,borderRadius:3,background:STORE_COLOR[g.v.id],border:'1px solid var(--ink)',flex:'none'}}/>
                    <b style={{fontWeight:800}}>{g.v.short}</b><span className="muted" style={{fontSize:11,fontWeight:600}}>· {g.items.length} campaigns</span></div></td>
                  {Object.keys(EX_METRICS).map(k=><td key={k} className="num mono" style={{fontWeight:800,background:metric===k?'rgba(199,255,79,.18)':'transparent'}}>{sr?EX_METRICS[k].fmt(sr[k]):'—'}</td>)}
                  <td className="num mono" style={{fontWeight:800}}>{sr?Math.round(sr.spent/sr.budget*100)+'%':'—'}</td>
                </tr>
                {g.items.map(r=>(
                  <tr key={r.id}>
                    <td style={{paddingLeft:34}}><div style={{fontWeight:600,fontSize:13}}>{r.label}</div><div className="muted" style={{fontSize:11}}>{r.offer} · {KD.custLabel({customerType:r.cust})}</div></td>
                    {Object.keys(EX_METRICS).map(k=><td key={k} className="num mono" style={{background:metric===k?'rgba(199,255,79,.1)':'transparent',fontWeight:metric===k?700:500}}>{EX_METRICS[k].fmt(r[k])}</td>)}
                    <td className="num mono" style={{fontSize:12,fontWeight:700}}>{Math.round(r.spent/r.budget*100)}%</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// generic line/area chart
function LineChart({ data, labels, fmt, h=220 }) {
  const w=640, padB=28, padT=12;
  const max=Math.max(...data)*1.12, min=Math.min(...data,0);
  const rng=(max-min)||1;
  const x=i=>(i/(data.length-1))*w;
  const y=v=>(h-padB) - ((v-min)/rng)*(h-padB-padT);
  const pts=data.map((v,i)=>[x(i),y(v)]);
  const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=path+` L ${w} ${h-padB} L 0 ${h-padB} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto',display:'block'}}>
      {[0,.25,.5,.75,1].map(g=><line key={g} x1="0" x2={w} y1={padT+(h-padB-padT)*g} y2={padT+(h-padB-padT)*g} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5"/>)}
      <path d={area} fill="var(--lime)" opacity="0.18"/>
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=> (i%Math.ceil(data.length/8)===0||i===data.length-1) && <circle key={i} cx={p[0]} cy={p[1]} r={i===data.length-1?6:4} fill={i===data.length-1?'var(--lime)':'var(--ink)'} stroke={i===data.length-1?'var(--ink)':'none'} strokeWidth="2"/>)}
      {labels && labels.map((l,i)=> (i%Math.ceil(data.length/6)===0||i===data.length-1) && <text key={i} x={x(i)} y={h-8} fontSize="11" fontWeight="600" fill="rgba(47,25,107,.55)" textAnchor={i===0?'start':i===data.length-1?'end':'middle'}>{l}</text>)}
    </svg>
  );
}

window.AnalyticsExplorer = AnalyticsExplorer;
