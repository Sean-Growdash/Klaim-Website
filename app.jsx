// === Klaim app — main wrapper ===

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accentPalette": ["#C7FF4F", "#2F196B", "#FF6B9D"],
  "tab": "drops",
  "showCelebrate": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState(t.tab || 'drops');
  const [openDrop, setOpenDrop] = React.useState(null);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [openGroup, setOpenGroup] = React.useState(false);
  const [celebrateDrop, setCelebrateDrop] = React.useState(null);

  React.useEffect(() => { setTab(t.tab); }, [t.tab]);

  const dark = t.theme === 'dark';
  const lime = (t.accentPalette && t.accentPalette[0]) || '#C7FF4F';
  const ink = (t.accentPalette && t.accentPalette[1]) || '#2F196B';
  const pink = (t.accentPalette && t.accentPalette[2]) || '#FF6B9D';

  // Apply palette as CSS vars
  React.useEffect(() => {
    document.documentElement.style.setProperty('--lime', lime);
    document.documentElement.style.setProperty('--ink', ink);
    document.documentElement.style.setProperty('--pink', pink);
  }, [lime, ink, pink]);

  const handleClaim = (drop) => {
    setOpenDrop(null);
    setCelebrateDrop(drop);
  };

  const tabs = [
    { id: 'drops',   lab: 'Drops',   ic: <IcDrop /> },
    { id: 'wallet',  lab: 'Klaims',  ic: <IcWallet /> },
    { id: 'trade',   lab: 'Trade',   ic: <IcSwap /> },
    { id: 'buddies', lab: 'Buddies', ic: <IcUsers /> },
    { id: 'profile', lab: 'You',     ic: <IcUser /> },
  ];

  return (
    <>
      <div className="stage">
        {/* Side annotation */}
        <div className="stage-side" style={{textAlign:'right'}}>
          <span className="eyebrow">Klaim · pre-seed</span>
          <h1>Discover<br/>this week's <span className="lime">drops.</span></h1>
          <p>44 live restaurants, curated picks up top, full search &amp; filtering below. Tap any drop to klaim.</p>
          <ul style={{textAlign:'left'}}>
            <li>Curated rail — 6 personal picks</li>
            <li>Cuisine tabs &amp; quick chips</li>
            <li>Full filter sheet · sliders &amp; sort</li>
          </ul>
        </div>

        {/* Phone */}
        <div className="phone-wrap">
          <IOSDevice width={390} height={844} dark={dark}>
            <div className={`app ${dark ? 'dark' : ''}`}>
              {/* iOS status bar baked at top */}
              <div style={{height:78,flex:'none'}} />

              <div className="scroll">
                {tab === 'drops'   && <DropsPane onOpen={setOpenDrop} />}
                {tab === 'wallet'  && <WalletPane />}
                {tab === 'trade'   && <TradePane onOpen={setOpenDrop} />}
                {tab === 'buddies' && <BuddiesPane onOpenGroup={() => setOpenGroup(true)} />}
                {tab === 'profile' && <ProfilePane onOpenSettings={() => setOpenSettings(true)} />}
              </div>

              <div className="tabs">
                {tabs.map(tt => (
                  <button
                    key={tt.id}
                    className={`tab ${tab === tt.id ? 'active' : ''}`}
                    onClick={() => { setTab(tt.id); setTweak('tab', tt.id); }}
                  >
                    <div className="ic">{tt.ic}</div>
                    <div className="lab">{tt.lab}</div>
                  </button>
                ))}
              </div>

              {/* Modals */}
              {openDrop && <DropDetail drop={openDrop} onClose={() => setOpenDrop(null)} onClaim={handleClaim} />}
              {openSettings && <SettingsModal onClose={() => setOpenSettings(false)} />}
              {openGroup && <GroupKlaimSheet onClose={() => setOpenGroup(false)} />}
              {celebrateDrop && <CelebrateOverlay drop={celebrateDrop} onDone={() => setCelebrateDrop(null)} />}
            </div>
          </IOSDevice>

          <div className="tab-status">
            <span className="dot" /> Live · tap to interact
          </div>
        </div>
      </div>

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio
          label="Mode"
          value={t.theme}
          options={['light','dark']}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakColor
          label="Accent palette"
          value={t.accentPalette}
          options={[
            ['#C7FF4F','#2F196B','#FF6B9D'],
            ['#FFD66B','#1A1A2E','#FF6B9D'],
            ['#7BE0AD','#0F2E2A','#FFA07A'],
            ['#A0E7E5','#2A1B4A','#F8B5C8'],
          ]}
          onChange={(v) => setTweak('accentPalette', v)}
        />

        <TweakSection label="Jump to screen" />
        <TweakSelect
          label="Tab"
          value={t.tab}
          options={['drops','wallet','trade','buddies','profile']}
          onChange={(v) => setTweak('tab', v)}
        />
        <TweakButton onClick={() => { setOpenDrop(DROPS[0]); }}>Open drop detail</TweakButton>
        <TweakButton onClick={() => setOpenGroup(true)}>Open squad klaim flow</TweakButton>
        <TweakButton onClick={() => setCelebrateDrop(DROPS[0])}>Show payout celebrate</TweakButton>
        <TweakButton onClick={() => setOpenSettings(true)}>Open settings sheet</TweakButton>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
