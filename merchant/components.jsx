// === Klaim Merchant Portal — shared components ===
const { useState, useRef, useEffect, useMemo } = React;
const fmt = KD.fmt, fmt2 = KD.fmt2;

// ---- Button ----
function Btn({ variant='', size='', icon, iconR, children, ...rest }) {
  return (
    <button className={`btn ${variant} ${size}`} {...rest}>
      {icon && <span className="b-ic">{icon}</span>}
      {children}
      {iconR && <span className="b-ic">{iconR}</span>}
    </button>
  );
}

// ---- Badge for campaign status ----
function StatusBadge({ status }) {
  const map = {
    live:['live','LIVE'], pending:['pending','PENDING'], scheduled:['scheduled','SCHEDULED'],
    ended:['ended','ENDED'], paused:['paused','PAUSED'], draft:['draft','DRAFT'],
  };
  const [cls,lab] = map[status] || ['soft',status];
  return <span className={`badge ${cls}`}>{status==='live' && <span className="bd" />}{lab}</span>;
}

// ---- KPI tile ----
function KPI({ label, value, icon, delta, deltaDir, sub, variant='' }) {
  return (
    <div className={`kpi ${variant}`}>
      <div className="k-top">
        <div className="k-l">{label}</div>
        {icon && <div className="k-ic">{icon}</div>}
      </div>
      <div className="k-v mono">{value}</div>
      {(delta || sub) && (
        <div className={`k-d ${deltaDir||''}`}>
          {deltaDir==='up' && <IcArrowUp size={13}/>}
          {deltaDir==='down' && <IcArrowDn size={13}/>}
          {delta}{sub && <span className="muted">{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ---- Bar chart (stacked or grouped) ----
function BarChart({ data, keys, colors, max, height=170, labels, barW }) {
  const m = max || Math.max(...data.map(d => keys.reduce((s,k)=>s+(d[k]||0),0)));
  return (
    <div className="bars" style={{height, gridTemplateColumns:`repeat(${data.length},1fr)`}}>
      {data.map((d,i)=>(
        <div className="bar-col" key={i} style={barW?{alignItems:'center'}:null}>
          {keys.map((k,ki)=>{
            const h = (d[k]/m)*100;
            return <div key={k} className="seg-b" style={{height:`${h}%`,width:barW||'100%',maxWidth:barW||'none',background:colors[ki],border: colors[ki]==='var(--lime)'||colors[ki]==='var(--pink)'?'1.5px solid var(--ink)':'none'}} />;
          })}
          <div className="lab">{labels?labels[i]:d.d}</div>
        </div>
      ))}
    </div>
  );
}

// ---- Sparkline (SVG) ----
function Spark({ data, w=120, h=40, color='var(--ink)', fill=false }) {
  const max=Math.max(...data), min=Math.min(...data);
  const rng=(max-min)||1;
  const pts=data.map((v,i)=>[ (i/(data.length-1))*w, h-4 - ((v-min)/rng)*(h-8) ]);
  const path = pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area = path+` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{display:'block'}}>
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3.4" fill={color} />
    </svg>
  );
}

// ---- Donut ----
function Donut({ segments, size=130, stroke=20, center }) {
  const r=(size-stroke)/2, c=2*Math.PI*r;
  let off=0;
  return (
    <div style={{position:'relative',width:size,height:size}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--cream-2)" strokeWidth={stroke}/>
        {segments.map((s,i)=>{
          const len=(s.v/100)*c;
          const el=<circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.c} strokeWidth={stroke}
            strokeDasharray={`${len} ${c-len}`} strokeDashoffset={-off} strokeLinecap="butt"/>;
          off+=len; return el;
        })}
      </svg>
      {center && <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>{center}</div>}
    </div>
  );
}

// ---- Toggle ----
function Toggle({ on, onChange }) {
  return <div className={`toggle ${on?'on':''}`} onClick={()=>onChange(!on)}><div className="knob"/></div>;
}

// ---- Segmented ----
function Segmented({ value, options, onChange }) {
  return (
    <div className="seg">
      {options.map(o=>{
        const val=typeof o==='string'?o:o.v, lab=typeof o==='string'?o:o.l;
        return <button key={val} className={value===val?'on':''} onClick={()=>onChange(val)}>{lab}</button>;
      })}
    </div>
  );
}

// ---- Field ----
function Field({ label, hint, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

// ---- Range row ----
function RangeRow({ label, value, display, min, max, step=1, onChange, hint }) {
  return (
    <div className="field">
      <label style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <span>{label}</span>
        <span className="display" style={{fontSize:22}}>{display}</span>
      </label>
      <input type="range" className="rng" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(+e.target.value)} />
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

// ---- Choice card ----
function Choice({ on, title, desc, onClick }) {
  return (
    <div className={`choice ${on?'on':''}`} onClick={onClick}>
      <div className="ch-radio" />
      <div><div className="ch-t">{title}</div>{desc && <div className="ch-d">{desc}</div>}</div>
    </div>
  );
}

// ---- Chip toggle ----
function Chip({ on, children, onClick }) {
  return <button className={`tag ${on?'on':''}`} onClick={onClick}>{children}{on && <span className="x"><IcCheck size={12}/></span>}</button>;
}

// ---- Modal ----
function Modal({ title, sub, onClose, children, foot, wide }) {
  useEffect(()=>{
    const h=e=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[]);
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" style={wide?{maxWidth:wide}:null} onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div><h2>{title}</h2>{sub && <div className="mh-sub">{sub}</div>}</div>
          <button className="xbtn" onClick={onClose}><IcX size={17}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </div>
  );
}

// ---- Toast (global) ----
const ToastCtx = React.createContext(()=>{});
function ToastHost({ children }) {
  const [toasts,setToasts]=useState([]);
  const push=(msg,icon)=>{
    const id=Math.random();
    setToasts(t=>[...t,{id,msg,icon}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t=>(
          <div className="toast" key={t.id}>
            <span className="t-ic">{t.icon||<IcCheck size={15}/>}</span>{t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = ()=>React.useContext(ToastCtx);

// ---- Section header for pages ----
function PageHead({ eyebrow, title, children }) {
  return (
    <div className="row spread mb24" style={{alignItems:'flex-end',flexWrap:'wrap',gap:16}}>
      <div>
        {eyebrow && <div className="tb-crumb">{eyebrow}</div>}
        <h2 className="display" style={{fontSize:30}}>{title}</h2>
      </div>
      <div className="row gap8 wrap">{children}</div>
    </div>
  );
}

// ---- Rec flag ----
function RecFlag({ children='Klaim recommends' }) {
  return <span className="rec-flag"><IcStar size={11}/>{children}</span>;
}

// ---- Avatar ----
function Av({ init, color='var(--pink)', size=34 }) {
  return <div style={{width:size,height:size,borderRadius:'50%',background:color,color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:size*0.38,flex:'none'}}>{init}</div>;
}

// ---- Live countdown to next drop ----
function useNow(){ const [,t]=useState(0); useEffect(()=>{ const iv=setInterval(()=>t(n=>n+1),1000); return ()=>clearInterval(iv); },[]); return new Date(); }
function dropParts(target){
  const ms = Math.max(0, target - new Date());
  const d = Math.floor(ms/86400000), h=Math.floor(ms/3600000)%24, m=Math.floor(ms/60000)%60, s=Math.floor(ms/1000)%60;
  return { d,h,m,s };
}
function DropCountdown({ variant='bar' }) {
  useNow();
  const drops = KD.computeDrops();
  const { d,h,m,s } = dropParts(drops.next);
  const cell = (v,l)=>(<div style={{textAlign:'center'}}><div className="display mono" style={{fontSize:variant==='bar'?26:20,lineHeight:1}}>{String(v).padStart(2,'0')}</div><div style={{fontSize:9.5,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(244,237,230,.55)',marginTop:3}}>{l}</div></div>);
  return (
    <div className="dropbar">
      <div className="row gap8" style={{alignItems:'center'}}>
        <span className="dropbar-ic"><IcGift size={18}/></span>
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--lime)'}}>Next drop · {drops.nextDay==='Mon'?'Monday':'Friday'} 09:00</div>
          <div style={{fontSize:13,fontWeight:600,color:'rgba(244,237,230,.8)',marginTop:1}}>{drops.fmtD(drops.next)} — entries close at 09:00</div>
        </div>
      </div>
      <div className="row" style={{gap:14,alignItems:'center'}}>
        {cell(d,'days')}<span className="dropsep">:</span>{cell(h,'hrs')}<span className="dropsep">:</span>{cell(m,'min')}<span className="dropsep">:</span>{cell(s,'sec')}
      </div>
    </div>
  );
}

// ---- Customer-type badge ----
function CustBadge({ type }) {
  const map = { new:['New diners','var(--lime)'], repeat:['Repeat diners','var(--pink)'], all:['All diners','var(--cream-2)'] };
  const [lab,bg] = map[type] || map.all;
  return <span className="badge" style={{background:bg,color:'var(--ink)',borderColor:'var(--ink)'}}>{lab}</span>;
}

// ---- Funnel (Seen → Clicked → Klaimed → Covers) ----
function Funnel({ stages, compact }) {
  const max = stages[0].v || 1;
  const icon = { eye:<IcEye size={15}/>, link:<IcLink size={15}/>, gift:<IcGift size={15}/>, users:<IcUsers size={15}/> };
  return (
    <div className="funnel">
      {stages.map((s,i)=>{
        const pct = (s.v/max)*100;
        const conv = i>0 ? Math.round(s.v/stages[i-1].v*100) : null;
        return (
          <div className="fn-row" key={s.k}>
            <div className="fn-lab"><span className="fn-ic">{icon[s.ic]}</span>{s.k}</div>
            <div className="fn-bar-wrap">
              <div className="fn-bar" style={{width:`${Math.max(4,pct)}%`}}><span className="fn-v mono">{s.v.toLocaleString('en-GB')}</span></div>
              {conv!==null && <span className="fn-conv">{conv}%</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  Btn, StatusBadge, KPI, BarChart, Spark, Donut, Toggle, Segmented, Field, RangeRow,
  Choice, Chip, Modal, ToastHost, useToast, PageHead, RecFlag, Av, fmt, fmt2,
  DropCountdown, CustBadge, useNow, dropParts, Funnel,
});
