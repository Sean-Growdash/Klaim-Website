// === Wallet / budget deposit / billing ===
function Wallet({ ctx }) {
  const w = KD.wallet;
  const toast = useToast();
  const [depo, setDepo] = useState(false);
  const [auto, setAuto] = useState(w.autoTopup);
  const [bal, setBal] = useState(w.balance);
  const [txns, setTxns] = useState(w.txns);

  function deposit(amt){
    setBal(b=>b+amt);
    setTxns(t=>[{id:'t'+Date.now(),date:'20 Jun 2026',type:'Top-up',desc:'Manual · '+w.method.label,amount:+amt,kind:'topup'},...t]);
    setDepo(false);
    toast(fmt(amt)+' added to your balance', <IcWallet size={15}/>);
  }

  const runway = Math.floor(bal / w.burnRate);

  return (
    <div className="page">
      <PageHead eyebrow="Billing · pay-per-cover" title="Wallet & budget">
        <Btn variant="ghost" icon={<IcDownload size={15}/>} onClick={()=>toast('Statement exported (CSV)')}>Export</Btn>
        <Btn variant="solid" icon={<IcPlus size={16}/>} onClick={()=>setDepo(true)}>Add funds</Btn>
      </PageHead>

      {bal < 800 && (
        <div className="card mb24" style={{borderColor:'var(--pink)',background:'#FFF0F5',padding:'16px 20px'}}>
          <div className="row gap8"><span style={{width:32,height:32,borderRadius:9,background:'var(--pink)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><IcWarn size={16}/></span>
          <div><b style={{fontSize:14}}>Low balance — covers may pause</b><div className="muted" style={{fontSize:12.5,fontWeight:500}}>Add funds to keep live campaigns running into next week’s drops.</div></div>
          <Btn variant="pink" size="sm" style={{marginLeft:'auto'}} onClick={()=>setDepo(true)}>Top up now</Btn></div>
        </div>
      )}

      <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start',marginBottom:16}}>
        {/* Balance card */}
        <div className="card ink" style={{padding:26}}>
          <div className="row spread mb16">
            <div className="tb-crumb" style={{color:'var(--lime)'}}>Available balance</div>
            <span className="badge live" style={{background:'rgba(199,255,79,.16)',color:'var(--lime)',borderColor:'transparent'}}><span className="bd" style={{background:'var(--lime)'}}/>AUTO TOP-UP {auto?'ON':'OFF'}</span>
          </div>
          <div className="display" style={{fontSize:60,color:'var(--lime)',lineHeight:.9}}>{fmt2(bal)}</div>
          <div className="row gap24 mt24" style={{paddingTop:20,borderTop:'1px solid rgba(244,237,230,.16)'}}>
            <div><div style={{fontSize:11.5,color:'rgba(244,237,230,.6)',fontWeight:600}}>Pending this week</div><div className="display" style={{fontSize:24,marginTop:4}}>{fmt(w.pending)}</div></div>
            <div><div style={{fontSize:11.5,color:'rgba(244,237,230,.6)',fontWeight:600}}>Weekly burn</div><div className="display" style={{fontSize:24,marginTop:4}}>{fmt(w.burnRate)}</div></div>
            <div><div style={{fontSize:11.5,color:'rgba(244,237,230,.6)',fontWeight:600}}>Runway</div><div className="display" style={{fontSize:24,marginTop:4,color:runway<3?'var(--pink)':'var(--lime)'}}>{runway} wks</div></div>
          </div>
          <Btn variant="lime" style={{width:'100%',justifyContent:'center',marginTop:22}} icon={<IcPlus size={16}/>} onClick={()=>setDepo(true)}>Add funds</Btn>
        </div>

        {/* Auto top-up + method */}
        <div className="col" style={{gap:16}}>
          <div className="card">
            <div className="card-head"><h3><IcRepeat size={17}/> Auto top-up</h3><Toggle on={auto} onChange={v=>{setAuto(v);toast('Auto top-up '+(v?'enabled':'disabled'));}} /></div>
            <p className="muted" style={{fontSize:13,fontWeight:500,lineHeight:1.5}}>When your balance drops below <b style={{color:'var(--ink)'}}>{fmt(w.autoThreshold)}</b>, we automatically add <b style={{color:'var(--ink)'}}>{fmt(w.autoAmount)}</b> so campaigns never pause mid-drop.</p>
            <div className="row gap8 mt16"><RecFlag>Recommended on</RecFlag></div>
          </div>
          <div className="card">
            <div className="card-head"><h3><IcCard size={17}/> Payment method</h3><button className="btn sm ghost" onClick={()=>toast('Open payment settings')}>Change</button></div>
            <div className="row gap8" style={{padding:'4px 0'}}>
              <span style={{width:42,height:30,borderRadius:6,background:'var(--ink)',color:'var(--lime)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:11}}>VISA</span>
              <div><div style={{fontWeight:700,fontSize:14}}>{w.method.label}</div><div className="muted" style={{fontSize:12}}>Expires {w.method.exp}</div></div>
            </div>
            <div className="divider"/>
            <button className="btn ghost sm" style={{width:'100%',justifyContent:'center'}} icon onClick={()=>toast('Bank transfer details copied')}><IcBank size={14}/> Pay by bank transfer instead</button>
          </div>
        </div>
      </div>

      {/* Plan / SaaS */}
      <div className="card mb24" style={{background:'linear-gradient(140deg,#fff,#fbf7ff)'}}>
        <div className="row spread wrap" style={{gap:16}}>
          <div className="row gap8"><span className="ai-mark" style={{width:38,height:38}}><IcChart size={19}/></span>
            <div><div className="row gap8"><h3 className="display" style={{fontSize:19}}>Pro analytics</h3><span className="ai-pill">CURRENT PLAN</span></div>
            <div className="muted" style={{fontSize:13,fontWeight:500,marginTop:2}}>£599/mo · billed across all 4 sites · cohort analysis, AI insights, benchmarking</div></div>
          </div>
          <div className="row gap8">
            <Btn variant="ghost" size="sm" onClick={()=>toast('Comparing plans')}>Compare plans</Btn>
            <Btn variant="ghost" size="sm" onClick={()=>toast('Manage subscription')}>Manage</Btn>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card card-pad-0">
        <div className="card-head" style={{padding:'20px 22px 14px',marginBottom:0}}><h3><IcReceipt size={17}/> Transactions &amp; invoices</h3>
          <button className="btn sm ghost" onClick={()=>toast('All invoices downloaded')}><IcDownload size={13}/> Invoices</button></div>
        <table className="tbl">
          <thead><tr><th>Date</th><th>Type</th><th>Description</th><th className="num">Amount</th></tr></thead>
          <tbody>
            {txns.map(t=>(
              <tr key={t.id}>
                <td style={{whiteSpace:'nowrap'}} className="muted">{t.date}</td>
                <td><span className="badge soft">{t.type}</span></td>
                <td>{t.desc}</td>
                <td className="num mono" style={{fontWeight:800,color: t.amount>0?'var(--ok)':'var(--ink)'}}>{t.amount>0?'+':''}{fmt2(Math.abs(t.amount)).replace('£',t.amount>0?'£':'−£')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {depo && <DepositModal onClose={()=>setDepo(false)} onDeposit={deposit} method={w.method} />}
    </div>
  );
}

function DepositModal({ onClose, onDeposit, method }) {
  const [amt, setAmt] = useState(2000);
  const presets = [500,1000,2000,5000];
  return (
    <Modal title="Add funds" sub="Top up your pay-per-cover balance. You’re only ever charged for verified covers." onClose={onClose}
      foot={<><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="lime" icon={<IcWallet size={15}/>} onClick={()=>onDeposit(amt)}>Add {fmt(amt)}</Btn></>}>
      <Field label="Amount">
        <div className="inp-pre"><span className="pre">£</span><input type="number" value={amt} onChange={e=>setAmt(+e.target.value||0)} /></div>
      </Field>
      <div className="row gap8 wrap mb24">
        {presets.map(p=><button key={p} className={`tag ${amt===p?'on':''}`} onClick={()=>setAmt(p)}>{fmt(p)}</button>)}
      </div>
      <div className="card cream" style={{padding:16}}>
        <div className="row spread mb8"><span className="muted" style={{fontWeight:600,fontSize:13}}>Paying with</span>
          <span className="row gap6" style={{fontWeight:700,fontSize:13}}><IcCard size={15}/>{method.label}</span></div>
        <div className="row spread"><span className="muted" style={{fontWeight:600,fontSize:13}}>Est. covers funded</span>
          <b className="mono">~{Math.floor(amt/9.2)} covers</b></div>
      </div>
      <div className="muted" style={{fontSize:11.5,marginTop:14,fontWeight:500,textAlign:'center'}}>Funds are held as campaign budget. Unused balance is fully refundable, any time.</div>
    </Modal>
  );
}

window.Wallet = Wallet;
