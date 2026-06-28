// === Drop Detail Modal ===
function DropDetail({ drop, onClose, onClaim }) {
  if (!drop) return null;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-grip" />
        <div className="detail-hero">
          {(() => { const s = getImg(drop); return s ? <img src={s} alt={drop.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} /> : null; })()}
          <div className="badges">
            <span className={`pill ${drop.tag || 'lime'}`}>+£{drop.amt} cash back</span>
            <span className="pill">{drop.cuisine}</span>
          </div>
        </div>
        <div style={{padding:'18px 0 0'}}>
          <h2>{drop.name}</h2>
          <div style={{fontSize:13,color:'var(--muted)',fontWeight:500,marginTop:2}}>{drop.area} · 4.7 ★ · 0.6mi</div>

          <div className="banner" style={{margin:'18px 0 0'}}>
            <div className="body">
              <b>Spend £{drop.min}+ to klaim</b>
              Cashback paid to your Monzo within 60s of the bill.
            </div>
          </div>

          <div className="sec-l" style={{padding:0,marginTop:24}}>How it works</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div className="step-row">
              <div className="n">1</div>
              <div className="t"><b>Walk in &amp; eat.</b> No code. No voucher. No awkward chat with the waiter.</div>
            </div>
            <div className="step-row">
              <div className="n">2</div>
              <div className="t"><b>Pay with your linked card.</b> We never see your full card number — just the matching transaction.</div>
            </div>
            <div className="step-row">
              <div className="n">3</div>
              <div className="t"><b>+£{drop.amt} hits your bank in ~30s.</b> Faster Payments. Real cash. Visible in Monzo before you've left the table.</div>
            </div>
          </div>

          <div style={{display:'flex',gap:8,marginTop:20}}>
            <button className="btn btn-ghost" style={{padding:'14px'}}><IcShare size={18} /></button>
            <button className="btn btn-lime btn-block" onClick={() => onClaim(drop)}>Klaim drop · ends Sun</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Settings Modal ===
function SettingsModal({ onClose }) {
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-grip" />
        <h2>Settings &amp; FAQ</h2>
        <p className="sub">Common stuff. The full FAQ &amp; help centre lives at klaim.uk/help.</p>

        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            ['How is cashback paid?','Faster Payments via Open Banking — usually 30–60 seconds after your card transaction settles.'],
            ['Why do I link my bank?','So we can match your transaction to a Klaim drop. We use FCA-regulated providers (TrueLayer / Yapily). Read-only access.'],
            ['What happens to drops I don\'t use?','They expire Sunday 11:59pm. Trade them with friends if you can\'t make it.'],
            ['Can I get receipts?','Every klaim emails a receipt + breakdown. Or export the lot from Klaims → Statements.'],
          ].map(([q,a],i)=>(
            <div key={i} style={{border:'1.5px solid var(--ink)',borderRadius:14,padding:'14px 16px',background:'var(--white)'}}>
              <div style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:15,letterSpacing:'-.02em'}}>{q}</div>
              <div style={{fontSize:13,color:'var(--muted)',fontWeight:500,marginTop:6,lineHeight:1.5}}>{a}</div>
            </div>
          ))}
        </div>

        <button className="btn btn-ghost btn-block" style={{marginTop:18}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// === Celebration overlay (after klaim) ===
function CelebrateOverlay({ drop, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  if (!drop) return null;
  return (
    <div className="celebrate">
      <div className="lab">Cash back · paid</div>
      <div className="big">+£{drop.amt}</div>
      <h2>To your <span className="lime">Monzo.</span><br/>In 32 seconds.</h2>
      <p>Verified by Open Banking. No code needed. Receipt emailed to sam@klaim.uk.</p>
    </div>
  );
}

Object.assign(window, { DropDetail, SettingsModal, CelebrateOverlay, GroupKlaimSheet });

// === Group Klaim Sheet (Buddies banner flow) ===
function GroupKlaimSheet({ onClose }) {
  const [joined, setJoined] = React.useState(false);
  const [invited, setInvited] = React.useState([]);
  const [msg, setMsg] = React.useState('');
  const [chat, setChat] = React.useState([
    { who: 'Theo', av: 'lime', txt: "7:30 booked. cucumber martinis on me 🥒" },
    { who: 'Maya', av: 'pink', txt: "in. last train back is 11:42 fyi" },
  ]);

  const baseSquad = [
    { who: 'Theo', av: 'lime', initials: 'TL', status: 'host' },
    { who: 'Maya', av: 'pink', initials: 'MR', status: 'in' },
  ];
  const squad = joined
    ? [...baseSquad, { who: 'You', av: 'ink', initials: 'SC', status: 'in' }, ...invited.map(i => ({...i, status:'invited'}))]
    : baseSquad;
  const confirmedCount = squad.filter(s => s.status !== 'invited').length;

  const tiers = [
    { n: 2, amt: 5,  lab: 'Pair' },
    { n: 3, amt: 8,  lab: 'Trio' },
    { n: 4, amt: 12, lab: 'Squad' },
    { n: 5, amt: 15, lab: 'Crew' },
  ];
  const currentTier = [...tiers].reverse().find(t => confirmedCount >= t.n) || { amt: 0 };
  const nextTier = tiers.find(t => t.n > confirmedCount);

  const inviteable = [
    { who: 'Jules K.', av: 'ink', initials: 'JK' },
    { who: 'Sam W.', av: 'cream', initials: 'SW' },
    { who: 'Priya N.', av: 'pink', initials: 'PN' },
    { who: 'Dan F.', av: 'lime', initials: 'DF' },
  ];

  const send = () => {
    if (!msg.trim()) return;
    setChat([...chat, { who: 'You', av: 'ink', txt: msg.trim() }]);
    setMsg('');
  };

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()} style={{maxHeight:'92%'}}>
        <div className="modal-grip" />

        {/* Hero */}
        <div className="gk-hero">
          <div className="gk-tag"><span className="ref-dot" /> Squad klaim · tonight</div>
          <h2 style={{fontSize:30,marginTop:10,marginBottom:4}}>Padella, Borough.</h2>
          <div className="gk-meta">
            <span>🍝 Italian</span>
            <span className="gk-dot" />
            <span>Tonight · 7:30pm</span>
            <span className="gk-dot" />
            <span>min £24</span>
          </div>
        </div>

        {/* Bonus ladder — GAMIFIED */}
        <div className="sec-l" style={{padding:'0',marginTop:22,marginBottom:10,display:'flex',justifyContent:'space-between'}}>
          <span>Group bonus ladder</span>
          <span style={{fontWeight:700,letterSpacing:'.04em'}}>
            <span style={{color:'var(--ink)'}}>{confirmedCount}/{tiers[tiers.length-1].n} in</span>
          </span>
        </div>
        <div className="gk-ladder">
          {tiers.map((t, i) => {
            const reached = confirmedCount >= t.n;
            const next = !reached && (!tiers.slice(0,i).some(x => confirmedCount < x.n));
            return (
              <div key={t.n} className={`gk-rung ${reached ? 'on' : ''} ${next ? 'next' : ''}`}>
                <div className="gk-rung-n">{t.n}</div>
                <div className="gk-rung-info">
                  <div className="gk-rung-lab">{t.lab}</div>
                  <div className="gk-rung-amt">£{t.amt} each</div>
                </div>
                {reached && <span className="gk-check"><IcCheck size={14}/></span>}
                {next && <span className="gk-next-pill">+£{t.amt - currentTier.amt}</span>}
              </div>
            );
          })}
        </div>
        {nextTier && (
          <div className="gk-nudge">
            <b>{nextTier.n - confirmedCount} more buddy</b> unlocks <span className="gk-hl">+£{nextTier.amt - currentTier.amt}</span> for everyone.
          </div>
        )}

        {/* Squad */}
        <div className="sec-l" style={{padding:0,marginTop:18,marginBottom:10}}>The squad</div>
        <div className="gk-squad">
          {squad.map((s, i) => (
            <div key={i} className="gk-member">
              <div className={`av ${s.av}`} style={{width:48,height:48,fontSize:15,opacity: s.status==='invited' ? .5 : 1}}>{s.initials}</div>
              <div className="gk-mn">{s.who}</div>
              <div className={`gk-status ${s.status}`}>
                {s.status === 'host' && '★ host'}
                {s.status === 'in' && '✓ in'}
                {s.status === 'invited' && '… asked'}
              </div>
            </div>
          ))}
        </div>

        {/* CTA — joining flips state */}
        {!joined && (
          <div className="gk-cta-stack">
            <button className="btn btn-lime btn-block gk-tap" onClick={() => setJoined(true)}>
              Tap in · lock +£{nextTier ? nextTier.amt : currentTier.amt} bonus
            </button>
            <button className="btn btn-ghost btn-block" onClick={onClose} style={{padding:'12px'}}>
              Can't make it
            </button>
          </div>
        )}

        {joined && (
          <>
            {/* Rally more */}
            <div className="sec-l" style={{padding:0,marginTop:22,marginBottom:10}}>Rally more buddies</div>
            <div className="gk-rally">
              {inviteable.map(p => {
                const isInvited = invited.find(i => i.who === p.who);
                return (
                  <button
                    key={p.who}
                    className={`gk-rally-chip ${isInvited ? 'on' : ''}`}
                    onClick={() => setInvited(prev =>
                      isInvited ? prev.filter(i => i.who !== p.who) : [...prev, p]
                    )}
                  >
                    <div className={`av ${p.av}`} style={{width:24,height:24,fontSize:10,borderWidth:1.2}}>{p.initials}</div>
                    {p.who}
                    <span className="gk-rally-mark">{isInvited ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat */}
            <div className="sec-l" style={{padding:0,marginTop:22,marginBottom:10,display:'flex',justifyContent:'space-between'}}>
              <span>Squad chat</span>
              <span style={{fontWeight:600,letterSpacing:'.04em',opacity:.7}}>{chat.length} msgs</span>
            </div>
            <div className="gk-chat">
              {chat.map((m, i) => (
                <div key={i} className={`gk-msg ${m.who === 'You' ? 'me' : ''}`}>
                  {m.who !== 'You' && <div className={`av ${m.av}`} style={{width:28,height:28,fontSize:11,borderWidth:1.2,flex:'none'}}>{m.who[0]}</div>}
                  <div className="gk-bubble">
                    {m.who !== 'You' && <div className="gk-who">{m.who}</div>}
                    {m.txt}
                  </div>
                </div>
              ))}
            </div>
            <div className="gk-input">
              <input
                type="text"
                placeholder="Say something to the squad…"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button onClick={send} className="gk-send">Send</button>
            </div>

            {/* Confirmation footer */}
            <div className="gk-locked">
              <div className="gk-locked-l">
                <div style={{fontFamily:'Bricolage Grotesque',fontWeight:800,fontSize:22,letterSpacing:'-.03em',color:'var(--lime)'}}>
                  You're in.
                </div>
                <div style={{fontSize:12,fontWeight:500,color:'rgba(244,237,230,.7)',marginTop:2}}>
                  Bonus locks when you pay. We'll ping you 6:45pm.
                </div>
              </div>
              <div className="gk-locked-r">
                <div className="gk-locked-amt">+£{currentTier.amt}</div>
                <div className="gk-locked-lab">group bonus</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
