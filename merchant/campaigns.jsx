// === Campaign list (grouped by drop) + detail ===
function Campaigns({ ctx }) {
  const { go, role, allVenues, venue } = ctx;
  const perms = KD.ROLES[role];
  const toast = useToast();
  const drops = KD.computeDrops();
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [list, setList] = useState(KD.campaigns);
  const [sugOpen, setSugOpen] = useState(true);

  const venueFiltered = allVenues ? list : list.filter(c=>c.venue===venue.id);
  const counts = {
    all: venueFiltered.length,
    live: venueFiltered.filter(c=>c.status==='live').length,
    scheduled: venueFiltered.filter(c=>c.status==='scheduled').length,
    pending: venueFiltered.filter(c=>c.status==='pending').length,
    paused: venueFiltered.filter(c=>c.status==='paused').length,
    ended: venueFiltered.filter(c=>c.status==='ended').length,
    draft: venueFiltered.filter(c=>c.status==='draft').length,
  };

  function setStatus(id,status){
    setList(l=>l.map(c=>c.id===id?{...c,status}:c));
    if(detail&&detail.id===id) setDetail(d=>({...d,status}));
  }

  const card = c => <CampaignCard key={c.id} c={c} onClick={()=>setDetail(c)} />;

  const live = venueFiltered.filter(c=>c.status==='live');
  const queued = venueFiltered.filter(c=>['scheduled','pending'].includes(c.status));
  const idle = venueFiltered.filter(c=>['paused','ended','draft'].includes(c.status));

  return (
    <div className="page">
      <PageHead eyebrow={`${allVenues?'All sites':venue.short} · ${counts.all} campaigns`} title="Campaigns">
        {perms.campaigns && <Btn variant="solid" icon={<IcPlus size={16}/>} onClick={()=>go('builder')}>New campaign</Btn>}
      </PageHead>

      <DropCountdown />

      {/* filter tabs */}
      <div className="row gap8 wrap" style={{margin:'24px 0'}}>
        {[['all','All'],['live','Live'],['scheduled','Scheduled'],['pending','Pending'],['paused','Paused'],['ended','Ended'],['draft','Drafts']].map(([k,l])=>(
          (counts[k]>0 || k==='all') ?
          <button key={k} className={`tag ${filter===k?'on':''}`} onClick={()=>setFilter(k)}>{l} <span style={{opacity:.6,fontWeight:800}}>{counts[k]}</span></button>
          : null
        ))}
      </div>

      {/* AI campaign suggestions — standard feature */}
      {perms.campaigns && sugOpen && filter==='all' && (
        <div className="card mb24" style={{borderColor:'var(--ink)',background:'linear-gradient(150deg,#fff,#fbf7ff)'}}>
          <div className="card-head">
            <h3><span className="ai-mark"><IcBolt size={15}/></span> Suggested campaigns for the next drop</h3>
            <div className="row gap8"><RecFlag>Auto-generated</RecFlag><button className="xbtn" style={{width:30,height:30}} onClick={()=>setSugOpen(false)}><IcX size={14}/></button></div>
          </div>
          <div className="grid g3">
            {KD.aiSuggestions.map(s=>(
              <div key={s.id} className="card flat" style={{padding:16}}>
                <div className="row spread mb8"><span className="badge soft">{s.tag}</span><span className="tag" style={{fontSize:11}}>{s.confidence}</span></div>
                <div style={{fontWeight:800,fontSize:13.5,lineHeight:1.3,marginBottom:8}}>{s.title}</div>
                <p className="muted" style={{fontSize:12.5,lineHeight:1.5,fontWeight:500}}>{s.body}</p>
                <div className="divider" style={{margin:'14px 0'}}/>
                <div className="row spread"><span className="display" style={{fontSize:17,color:'var(--ink)'}}>{s.impact}</span>
                  <Btn variant="lime" size="sm" onClick={()=>{toast('Applying suggestion…',<IcSpark size={14}/>);setTimeout(()=>go('builder'),400);}}>Apply</Btn></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* pending approval callout */}
      {counts.pending>0 && filter==='all' && perms.billing && (
        <div className="card mb24" style={{borderColor:'var(--amber)',background:'#FFF8EC',padding:'16px 20px'}}>
          <div className="row spread">
            <div className="row gap8"><span style={{width:32,height:32,borderRadius:9,background:'var(--amber)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><IcClock size={16}/></span>
              <div><div style={{fontWeight:800,fontSize:14}}>{counts.pending} campaign{counts.pending>1?'s':''} awaiting approval before the {drops.nextDay==='Mon'?'Monday':'Friday'} drop</div>
              <div className="muted" style={{fontSize:12.5,fontWeight:500}}>Approve before 09:00 on {drops.fmtD(drops.next)} or it waits for the following drop.</div></div>
            </div>
          </div>
        </div>
      )}

      {filter==='all' ? (
        <div className="col" style={{gap:28}}>
          {live.length>0 && <DropGroup title={`Live now · ${drops.activeDay==='Mon'?'Monday':'Friday'} drop`} sub={`${live.length} campaign${live.length>1?'s':''} running this drop`} badge={<span className="badge live"><span className="bd"/>LIVE</span>} cards={live.map(card)} />}
          {queued.length>0 && <DropGroup title={`Queued · ${drops.nextDay==='Mon'?'Monday':'Friday'} drop`} sub={`Enters the ${drops.fmtD(drops.next)} drop at 09:00`} badge={<span className="badge scheduled"><IcClock size={11}/> NEXT DROP</span>} cards={queued.map(card)} />}
          {idle.length>0 && <DropGroup title="Not in a drop" sub="Paused, ended or draft" cards={idle.map(card)} />}
        </div>
      ) : (
        <div className="grid g2" style={{gap:16}}>
          {venueFiltered.filter(c=>c.status===filter).map(card)}
        </div>
      )}

      {detail && <CampaignDetail c={detail} ctx={ctx} drops={drops} onClose={()=>setDetail(null)}
        onEdit={()=>{ setDetail(null); go('builder', detail); }}
        onStatus={setStatus} toast={toast} />}
    </div>
  );
}

function DropGroup({ title, sub, badge, cards }) {
  return (
    <div>
      <div className="row gap8 mb16" style={{alignItems:'baseline'}}>
        <h3 className="display" style={{fontSize:19}}>{title}</h3>
        {badge}
        <span className="muted" style={{fontSize:12.5,fontWeight:500,marginLeft:'auto'}}>{sub}</span>
      </div>
      <div className="grid g2" style={{gap:16}}>{cards}</div>
    </div>
  );
}

function CampaignCard({ c, onClick }) {
  return (
    <div className="card" style={{cursor:'pointer'}} onClick={onClick}>
      <div className="row spread mb16" style={{alignItems:'flex-start'}}>
        <div style={{minWidth:0}}>
          <div className="row gap8 wrap" style={{marginBottom:6}}>
            <StatusBadge status={c.status}/>
            {c.recurring && <span className="badge soft"><IcRepeat size={11}/> EVERY {c.dropDay.toUpperCase()} DROP</span>}
          </div>
          <h3 className="display" style={{fontSize:21,lineHeight:1.08}}>{c.name}</h3>
          <div className="muted mono" style={{fontSize:11,fontWeight:600,marginTop:3,letterSpacing:'.02em'}}>{c.venueName} · {c.cid}</div>
        </div>
        <div style={{textAlign:'right',flex:'none'}}>
          <div className="display" style={{fontSize:30}}>{c.roas?c.roas+'×':'—'}</div>
          <div className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em'}}>ROAS</div>
        </div>
      </div>
      {/* offer chip */}
      <div className="row gap8 wrap mb16">
        <span className="badge" style={{background:'var(--lime)',color:'var(--ink)'}}>{KD.offerLabel(c)}</span>
        <CustBadge type={c.customerType} />
        {c.squad?.on && <span className="badge soft"><IcUsers size={11}/> SQUAD</span>}
        {c.trading && <span className="badge soft"><IcRepeat size={11}/> TRADE</span>}
      </div>
      <div className="row" style={{gap:20}}>
        <Mini k="Klaims" v={c.klaimed||'—'} />
        <Mini k="Covers" v={c.covers||'—'} />
        <Mini k="Revenue" v={c.revenue?fmt(c.revenue):'—'} />
        <Mini k="Cashback" v={c.covers?'£'+KD.dinerNet(c):'—'} />
        <Mini k="Repeat" v={c.repeat?c.repeat+'%':'—'} />
      </div>
      <div className="mt16">
        <div className="row spread" style={{fontSize:11.5,fontWeight:700,marginBottom:6}}>
          <span className="muted">{fmt(c.spent)} of {fmt(c.budget)} {c.recurring?'per-drop ':''}budget</span>
          <span className="muted">{Math.round(c.spent/c.budget*100)||0}%</span>
        </div>
        <div className="prog"><div className="fill" style={{width:`${Math.min(100,c.spent/c.budget*100)}%`,background: c.status==='paused'?'var(--pink)':'var(--lime)'}}/></div>
      </div>
    </div>
  );
}

function Mini({ k, v }) {
  return <div><div className="display" style={{fontSize:22}}>{v}</div><div className="muted" style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>{k}</div></div>;
}

function CampaignDetail({ c, ctx, drops, onClose, onEdit, onStatus, toast }) {
  const perms = KD.ROLES[ctx.role];
  const canEdit = perms.edit;
  const isPending = c.status==='pending';
  const editable = ['pending','scheduled','draft','live','paused'].includes(c.status);
  const dropDate = drops.fmtD(c.dropDay==='Mon'?drops.nextMon:drops.nextFri);
  const foot = (
    <>
      {c.status==='live' && canEdit && <Btn variant="ghost" icon={<IcPause size={15}/>} onClick={()=>{onStatus(c.id,'paused');toast('Campaign paused');}}>Pause</Btn>}
      {c.status==='paused' && canEdit && <Btn variant="ghost" icon={<IcPlay size={13}/>} onClick={()=>{onStatus(c.id,'live');toast('Campaign resumed',<IcPlay size={13}/>);}}>Resume</Btn>}
      {isPending && perms.billing && <Btn variant="lime" icon={<IcCheck size={15}/>} onClick={()=>{onStatus(c.id,'scheduled');toast('Approved — entering the next drop',<IcCheck size={15}/>);}}>Approve &amp; schedule</Btn>}
      {editable && canEdit && <Btn variant="solid" icon={<IcEdit size={14}/>} onClick={onEdit}>Edit campaign</Btn>}
    </>
  );
  return (
    <Modal title={c.name} sub={`${c.venueName} · ${c.cid}`} onClose={onClose} foot={foot} wide={620}>
      <div className="row gap8 wrap mb24">
        <StatusBadge status={c.status}/>
        <span className="badge" style={{background:'var(--lime)',color:'var(--ink)'}}>{KD.offerLabel(c)}</span>
        <CustBadge type={c.customerType} />
      </div>

      {/* drop schedule strip */}
      <div className="card cream mb24" style={{padding:16}}>
        <div className="grid g3" style={{gap:14}}>
          <div><div className="muted" style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Drop</div>
            <div style={{fontWeight:700,fontSize:13.5,marginTop:3}}>{c.dropDay==='Mon'?'Monday':'Friday'} · {dropDate}</div></div>
          <div><div className="muted" style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Schedule</div>
            <div style={{fontWeight:700,fontSize:13.5,marginTop:3}}>{c.recurring?`Every ${c.dropDay} drop`:'One-off'}</div></div>
          <div><div className="muted" style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Window</div>
            <div style={{fontWeight:700,fontSize:13.5,marginTop:3}}>{drops.windowLabel(c.dropDay)}</div></div>
        </div>
        {c.recurring && c.entered>0 && <div className="muted" style={{fontSize:12,fontWeight:500,marginTop:12,paddingTop:12,borderTop:'1px solid var(--line)'}}><IcRepeat size={13} style={{verticalAlign:'-2px'}}/> Has run in <b style={{color:'var(--ink)'}}>{c.entered} drops</b> · {c.audience}</div>}
      </div>

      {isPending && (
        <div className="card cream mb24" style={{padding:14,borderColor:'var(--amber)'}}>
          <div className="row gap8"><IcClock size={16}/><div style={{fontWeight:700,fontSize:13}}>{c.pendingReason||'Awaiting approval'}</div></div>
        </div>
      )}

      {c.covers>0 ? (
        <>
          <div className="grid g2 mb24" style={{gap:12}}>
            <KPI label={c.lifetime?'Covers (lifetime)':'Covers driven'} value={c.covers} variant="hi" />
            <KPI label="Attributed revenue" value={fmt(c.revenue)} />
            <KPI label="ROAS" value={c.roas+'×'} />
            <KPI label="Cashback (diner)" value={'£'+KD.dinerNet(c)} />
          </div>

          {/* full-funnel attribution */}
          <div className="card cream mb24" style={{padding:18}}>
            <div className="card-head" style={{marginBottom:14}}><h3 style={{fontSize:15}}>Full-funnel attribution</h3>
              <span className="badge soft">{Math.round(c.covers/c.seen*1000)/10}% seen → cover</span></div>
            <Funnel stages={[...KD.funnel(c), ]} />
            <div className="row spread mt16" style={{paddingTop:14,borderTop:'1px solid var(--line)'}}>
              <div><div className="muted" style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Revenue</div><div className="display" style={{fontSize:20,marginTop:2}}>{fmt(c.revenue)}</div></div>
              <div><div className="muted" style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Repeat rate</div><div className="display" style={{fontSize:20,marginTop:2}}>{c.repeat}%</div></div>
              <div><div className="muted" style={{fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>ROAS</div><div className="display" style={{fontSize:20,marginTop:2}}>{c.roas}×</div></div>
            </div>
          </div>

          {/* sharing & social attribution */}
          {(c.trading || c.squad?.on) && (
            <div className="grid g2 mb24" style={{gap:12}}>
              {c.trading && (
                <div className="card cream" style={{padding:16}}>
                  <div className="row gap8 mb8"><span style={{width:28,height:28,borderRadius:8,background:'var(--ink)',color:'var(--lime)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><IcRepeat size={15}/></span>
                    <div style={{fontWeight:800,fontSize:13.5}}>Klaim trading</div></div>
                  <div className="row spread"><div><div className="display" style={{fontSize:24}}>{c.tradedDrops}</div><div className="muted" style={{fontSize:11,fontWeight:600}}>drops swapped</div></div>
                    <div><div className="display" style={{fontSize:24}}>{c.tradeCovers}</div><div className="muted" style={{fontSize:11,fontWeight:600}}>covers via trade</div></div></div>
                </div>
              )}
              {c.squad?.on && (
                <div className="card cream" style={{padding:16,borderColor:'var(--ink)'}}>
                  <div className="row gap8 mb8"><span style={{width:28,height:28,borderRadius:8,background:'var(--lime)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none',border:'1.5px solid var(--ink)'}}><IcUsers size={15}/></span>
                    <div style={{fontWeight:800,fontSize:13.5}}>Squad Klaim</div></div>
                  <div className="row spread"><div><div className="display" style={{fontSize:24}}>{c.squadCovers}</div><div className="muted" style={{fontSize:11,fontWeight:600}}>covers in groups</div></div>
                    <div><div className="display" style={{fontSize:24}}>{c.squadAvgSize}</div><div className="muted" style={{fontSize:11,fontWeight:600}}>avg squad size</div></div></div>
                </div>
              )}
            </div>
          )}

          <div className="card cream mb24" style={{padding:18}}>
            <div className="card-head" style={{marginBottom:14}}><h3 style={{fontSize:15}}>Covers across the drop window</h3>
              <div className="leg"><span><span className="sw" style={{background:'var(--ink)'}}/>covers</span></div></div>
            <BarChart data={c.daily.map((v,i)=>({d:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],v}))} keys={['v']} colors={['var(--ink)']} height={110} />
          </div>
          <div className="grid g2" style={{gap:12}}>
            <div className="card cream" style={{padding:16}}>
              <div className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>New vs returning</div>
              {(c.newDiners+c.returningDiners)>0 ? (
              <div className="row" style={{gap:16}}>
                <Donut size={92} stroke={16} segments={[{v:c.newDiners/(c.newDiners+c.returningDiners)*100,c:'var(--ink)'},{v:c.returningDiners/(c.newDiners+c.returningDiners)*100,c:'var(--lime)'}]}
                  center={<div className="display" style={{fontSize:18}}>{Math.round(c.newDiners/(c.newDiners+c.returningDiners)*100)}%</div>} />
                <div className="col" style={{gap:10}}>
                  <div className="row gap6"><span className="sw" style={{width:11,height:11,borderRadius:3,background:'var(--ink)',border:'1px solid var(--ink)'}}/><b style={{fontSize:13}}>{c.newDiners} new</b></div>
                  <div className="row gap6"><span className="sw" style={{width:11,height:11,borderRadius:3,background:'var(--lime)',border:'1px solid var(--ink)'}}/><b style={{fontSize:13}}>{c.returningDiners} returning</b></div>
                </div>
              </div>) : <div className="muted" style={{fontSize:13,fontWeight:500}}>—</div>}
            </div>
            <div className="card cream" style={{padding:16}}>
              <div className="muted" style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>Budget used {c.recurring?'(this drop)':''}</div>
              <div className="display" style={{fontSize:28}}>{fmt(c.spent)}<span className="muted" style={{fontSize:14,fontWeight:600}}> / {fmt(c.budget)}</span></div>
              <div className="prog mt16"><div className="fill" style={{width:`${Math.min(100,c.spent/c.budget*100)}%`}}/></div>
              <div className="muted" style={{fontSize:11.5,marginTop:8,fontWeight:600}}>{fmt(c.budget-c.spent)} left in this drop’s cap</div>
            </div>
          </div>
        </>
      ) : (
        <div className="card cream" style={{padding:20}}>
          <div className="row spread mb16"><span className="muted" style={{fontWeight:600,fontSize:13}}>Diner sees</span><b className="mono">£{KD.dinerNet(c)} back on £{c.minSpend}+</b></div>
          <div className="row spread mb16"><span className="muted" style={{fontWeight:600,fontSize:13}}>You fund / cover</span><b className="mono">£{c.cashback.toFixed(2)} <span className="muted-2" style={{fontWeight:500}}>(incl. £{KD.FEE.toFixed(2)} fee)</span></b></div>
          <div className="row spread mb16"><span className="muted" style={{fontWeight:600,fontSize:13}}>Budget cap {c.recurring?'(per drop)':''}</span><b className="mono">{fmt(c.budget)}</b></div>
          <div className="row spread mb16"><span className="muted" style={{fontWeight:600,fontSize:13}}>Est. reach</span><b className="mono">{c.reach.toLocaleString('en-GB')} diners</b></div>
          <div className="row spread"><span className="muted" style={{fontWeight:600,fontSize:13}}>Projected covers</span><b className="mono">~{Math.floor(c.budget/c.cashback)}</b></div>
        </div>
      )}
    </Modal>
  );
}

window.Campaigns = Campaigns;
