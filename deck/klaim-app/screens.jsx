// === Sample data ===
const DROPS = [
  // Curated picks — first 6 are featured
  { id: 'dishoom', name: 'Dishoom', area: 'Shoreditch', cuisine: 'Indian', price: '££', amt: 18, min: 35, dist: 0.6, rating: 4.7, tag: 'lime', curated: 'Top pick', match: 96, slots: 12, vibe: ['Date night','Group'] },
  { id: 'padella', name: 'Padella', area: 'Borough', cuisine: 'Italian', price: '££', amt: 12, min: 24, dist: 1.2, rating: 4.6, tag: 'pink', curated: 'Walk-in friendly', match: 92, slots: 8, vibe: ['Quick','Solo'] },
  { id: 'endo', name: 'Endo at Rotunda', area: 'Holland Park', cuisine: 'Japanese', price: '££££', amt: 24, min: 80, dist: 3.4, rating: 4.9, tag: 'amber', curated: 'Splash out', match: 88, slots: 4, vibe: ['Date night'] },
  { id: 'sabor', name: 'Sabor', area: 'Mayfair', cuisine: 'Spanish', price: '£££', amt: 14, min: 40, dist: 1.8, rating: 4.5, tag: '', curated: 'Near you', match: 84, slots: 9, vibe: ['Group'] },
  { id: 'hoppers', name: 'Hoppers', area: 'Soho', cuisine: 'Sri Lankan', price: '££', amt: 9, min: 22, dist: 0.9, rating: 4.4, tag: 'lime', curated: 'You loved last time', match: 90, slots: 14 },
  { id: 'lyles', name: 'Lyle\'s', area: 'Shoreditch', cuisine: 'British', price: '£££', amt: 22, min: 60, dist: 0.7, rating: 4.8, tag: 'pink', curated: 'New for you', match: 81, slots: 6 },
  // Explore set
  { id: 'kiln', name: 'Kiln', area: 'Soho', cuisine: 'Thai', price: '££', amt: 11, min: 28, dist: 1.0, rating: 4.6, tag: '', slots: 10 },
  { id: 'rovi', name: 'Rovi', area: 'Fitzrovia', cuisine: 'Mediterranean', price: '£££', amt: 16, min: 45, dist: 1.4, rating: 4.5, tag: '', slots: 7 },
  { id: 'brat', name: 'Brat', area: 'Shoreditch', cuisine: 'British', price: '£££', amt: 20, min: 55, dist: 0.8, rating: 4.7, tag: '', slots: 5 },
  { id: 'kricket', name: 'Kricket', area: 'Soho', cuisine: 'Indian', price: '££', amt: 10, min: 26, dist: 1.1, rating: 4.5, tag: '', slots: 11 },
  { id: 'gloria', name: 'Gloria', area: 'Shoreditch', cuisine: 'Italian', price: '££', amt: 13, min: 32, dist: 0.5, rating: 4.4, tag: '', slots: 9 },
  { id: 'bao', name: 'BAO', area: 'Borough', cuisine: 'Taiwanese', price: '££', amt: 8, min: 20, dist: 1.3, rating: 4.6, tag: '', slots: 16 },
  { id: 'noble', name: 'Noble Rot', area: 'Bloomsbury', cuisine: 'European', price: '£££', amt: 17, min: 48, dist: 1.7, rating: 4.5, tag: '', slots: 6 },
  { id: 'morito', name: 'Morito', area: 'Hackney', cuisine: 'Spanish', price: '££', amt: 9, min: 25, dist: 2.1, rating: 4.4, tag: '', slots: 12 },
  { id: 'smoking', name: 'Smoking Goat', area: 'Shoreditch', cuisine: 'Thai', price: '££', amt: 12, min: 30, dist: 0.6, rating: 4.5, tag: '', slots: 8 },
  { id: 'pophams', name: 'Pophams', area: 'Islington', cuisine: 'Bakery', price: '£', amt: 6, min: 14, dist: 2.4, rating: 4.7, tag: '', slots: 20 },
  { id: 'cafe-deco', name: 'Cafe Deco', area: 'Bloomsbury', cuisine: 'European', price: '££', amt: 14, min: 35, dist: 1.6, rating: 4.6, tag: '', slots: 7 },
  { id: 'manteca', name: 'Manteca', area: 'Shoreditch', cuisine: 'Italian', price: '£££', amt: 19, min: 50, dist: 0.7, rating: 4.7, tag: '', slots: 5 },
  { id: 'akoko', name: 'Akoko', area: 'Fitzrovia', cuisine: 'West African', price: '£££', amt: 21, min: 65, dist: 1.5, rating: 4.8, tag: '', slots: 4 },
  { id: 'andina', name: 'Andina', area: 'Shoreditch', cuisine: 'Peruvian', price: '££', amt: 11, min: 28, dist: 0.8, rating: 4.4, tag: '', slots: 13 },
  { id: 'jose', name: 'José Pizarro', area: 'Bermondsey', cuisine: 'Spanish', price: '££', amt: 10, min: 26, dist: 2.2, rating: 4.5, tag: '', slots: 9 },
  { id: 'silo', name: 'Silo', area: 'Hackney Wick', cuisine: 'British', price: '£££', amt: 18, min: 50, dist: 3.1, rating: 4.6, tag: '', slots: 6 },
  { id: 'angelina', name: 'Angelina', area: 'Dalston', cuisine: 'Italian', price: '£££', amt: 16, min: 45, dist: 2.0, rating: 4.7, tag: '', slots: 5 },
  { id: 'oklava', name: 'Oklava', area: 'Shoreditch', cuisine: 'Turkish', price: '££', amt: 12, min: 30, dist: 0.7, rating: 4.5, tag: '', slots: 10 },
  { id: 'ikoyi', name: 'Ikoyi', area: 'St James\'s', cuisine: 'West African', price: '££££', amt: 28, min: 95, dist: 2.3, rating: 4.9, tag: '', slots: 3 },
  { id: 'ottolenghi', name: 'Ottolenghi', area: 'Islington', cuisine: 'Mediterranean', price: '££', amt: 11, min: 28, dist: 2.5, rating: 4.5, tag: '', slots: 11 },
  { id: 'pidgin', name: 'Pidgin', area: 'Hackney', cuisine: 'European', price: '£££', amt: 17, min: 48, dist: 2.4, rating: 4.6, tag: '', slots: 6 },
  { id: 'roka', name: 'Roka', area: 'Mayfair', cuisine: 'Japanese', price: '£££', amt: 19, min: 55, dist: 1.9, rating: 4.5, tag: '', slots: 7 },
  { id: 'jin-kichi', name: 'Jin Kichi', area: 'Hampstead', cuisine: 'Japanese', price: '££', amt: 12, min: 30, dist: 4.2, rating: 4.6, tag: '', slots: 9 },
  { id: 'westerns', name: 'Westerns Laundry', area: 'Holloway', cuisine: 'European', price: '££', amt: 13, min: 32, dist: 3.0, rating: 4.5, tag: '', slots: 8 },
  { id: 'sessions', name: 'Sessions Arts', area: 'Clerkenwell', cuisine: 'British', price: '£££', amt: 16, min: 45, dist: 1.2, rating: 4.7, tag: '', slots: 6 },
  { id: 'monohon', name: 'Monohon', area: 'Shoreditch', cuisine: 'Japanese', price: '££', amt: 9, min: 24, dist: 0.6, rating: 4.4, tag: '', slots: 14 },
  { id: 'mountain', name: 'Mountain', area: 'Soho', cuisine: 'Spanish', price: '£££', amt: 18, min: 50, dist: 1.0, rating: 4.7, tag: '', slots: 5 },
  { id: 'cafe-cecilia', name: 'Cafe Cecilia', area: 'Hackney', cuisine: 'European', price: '££', amt: 11, min: 28, dist: 2.2, rating: 4.6, tag: '', slots: 10 },
  { id: 'plates', name: 'Plates', area: 'Hoxton', cuisine: 'Plant-based', price: '£££', amt: 15, min: 42, dist: 0.9, rating: 4.5, tag: '', slots: 7 },
  { id: 'four-legs', name: 'Four Legs', area: 'Hackney', cuisine: 'British', price: '££', amt: 9, min: 24, dist: 2.3, rating: 4.4, tag: '', slots: 12 },
  { id: 'levan', name: 'Levan', area: 'Peckham', cuisine: 'European', price: '££', amt: 12, min: 30, dist: 3.5, rating: 4.5, tag: '', slots: 9 },
  { id: 'kudu', name: 'Kudu', area: 'Peckham', cuisine: 'South African', price: '£££', amt: 17, min: 48, dist: 3.6, rating: 4.6, tag: '', slots: 6 },
  { id: 'top-cuvee', name: 'Top Cuvée', area: 'Islington', cuisine: 'European', price: '££', amt: 10, min: 26, dist: 2.6, rating: 4.4, tag: '', slots: 11 },
  { id: 'singburi', name: 'Singburi', area: 'Leytonstone', cuisine: 'Thai', price: '££', amt: 8, min: 20, dist: 4.5, rating: 4.7, tag: '', slots: 13 },
  { id: 'maremma', name: 'Maremma', area: 'Brixton', cuisine: 'Italian', price: '££', amt: 11, min: 28, dist: 4.0, rating: 4.5, tag: '', slots: 9 },
  { id: 'oma', name: 'Oma', area: 'Borough', cuisine: 'Greek', price: '£££', amt: 16, min: 45, dist: 1.3, rating: 4.6, tag: '', slots: 6 },
  { id: 'humo', name: 'Humo', area: 'Mayfair', cuisine: 'Japanese', price: '££££', amt: 25, min: 85, dist: 1.8, rating: 4.8, tag: '', slots: 4 },
  { id: 'akub', name: 'Akub', area: 'Notting Hill', cuisine: 'Palestinian', price: '£££', amt: 16, min: 42, dist: 2.7, rating: 4.6, tag: '', slots: 7 },
  { id: 'planque', name: 'Planque', area: 'Haggerston', cuisine: 'European', price: '£££', amt: 17, min: 48, dist: 1.8, rating: 4.5, tag: '', slots: 6 },
];

const CUISINES = ['All','Italian','Japanese','Indian','Spanish','British','Thai','European','Mediterranean','Turkish','Taiwanese','West African','Bakery','Plant-based'];

const CUISINE_IMGS = {
  'Indian':       'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
  'Italian':      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=400&q=80',
  'Japanese':     'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
  'Spanish':      'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=400&q=80',
  'Sri Lankan':   'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
  'British':      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
  'Thai':         'https://images.unsplash.com/photo-1562802378-063ec186a863?auto=format&fit=crop&w=400&q=80',
  'Mediterranean':'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'European':     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
  'Turkish':      'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=400&q=80',
  'Taiwanese':    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
  'West African': 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=400&q=80',
  'Bakery':       'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  'Plant-based':  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
  'Greek':        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'South African':'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'Palestinian':  'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=400&q=80',
  'Peruvian':     'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?auto=format&fit=crop&w=400&q=80',
};

const RESTO_IMGS = {
  'dishoom':  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=85',
  'padella':  'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=85',
  'endo':     'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=85',
  'sabor':    'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=600&q=85',
  'hoppers':  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=85',
  'lyles':    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=85',
  'kiln':     'https://images.unsplash.com/photo-1562802378-063ec186a863?auto=format&fit=crop&w=600&q=85',
  'brat':     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=85',
  'kricket':  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=85',
  'rovi':     'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=85',
};

function getImg(d) {
  if (!d) return null;
  return RESTO_IMGS[d.id] || CUISINE_IMGS[d.cuisine] || null;
}

function getImgByName(name) {
  const d = DROPS.find(x => x.name === name);
  return d ? getImg(d) : null;
}

const FRIENDS = [
  { name: 'Maya R.', initials: 'MR', av: 'pink', when: '2h', action: 'klaimed £18 at Dishoom Shoreditch', badge: 'lime' },
  { name: 'Theo L.', initials: 'TL', av: 'lime', when: '4h', action: 'is going to Padella tonight — drop buddy?', badge: 'ink', cta: true },
  { name: 'Jules K.', initials: 'JK', av: 'ink', when: 'Yest', action: 'traded a Dishoom drop for an Endo drop', badge: 'pink' },
  { name: 'Sam W.', initials: 'SW', av: 'cream', when: '2d', action: 'unlocked the "Borough Boroughian" badge', badge: 'amber' },
];

const HISTORY = [
  { name: 'Dishoom', area: 'Shoreditch · 18 Apr', amt: 18, status: 'paid' },
  { name: 'Padella', area: 'Borough · 12 Apr', amt: 11, status: 'paid' },
  { name: 'Sabor', area: 'Mayfair · 4 Apr', amt: 14, status: 'paid' },
  { name: 'Hoppers', area: 'Soho · 28 Mar', amt: 9, status: 'paid' },
  { name: 'Lyle\'s', area: 'Shoreditch · 22 Mar', amt: 22, status: 'paid' },
];

// === Drops Pane — curated + explore ===
const SORTS = [
  { id: 'match',   lab: 'Best match' },
  { id: 'cash',    lab: 'Most cash' },
  { id: 'near',    lab: 'Nearest' },
  { id: 'min',     lab: 'Lowest min spend' },
  { id: 'rating',  lab: 'Top rated' },
];

const QUICK_FILTERS = [
  { id: 'near',      lab: 'Within 1 mi', test: d => d.dist <= 1.0 },
  { id: 'low-min',   lab: 'Min ≤ £25',   test: d => d.min <= 25 },
  { id: 'big-cash',  lab: '£15+ back',   test: d => d.amt >= 15 },
  { id: 'top',       lab: '4.6+ ★',      test: d => d.rating >= 4.6 },
  { id: 'lastfew',   lab: 'Few left',    test: d => d.slots <= 6 },
];

function DropsPane({ variant, onOpen, t }) {
  const [query, setQuery] = React.useState('');
  const [cuisine, setCuisine] = React.useState('All');
  const [sort, setSort] = React.useState('match');
  const [chips, setChips] = React.useState([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [maxDist, setMaxDist] = React.useState(5);
  const [maxMin, setMaxMin] = React.useState(100);
  const [minCash, setMinCash] = React.useState(0);

  const curated = DROPS.filter(d => d.curated);

  const explore = React.useMemo(() => {
    let list = DROPS;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.area.toLowerCase().includes(q) ||
        d.cuisine.toLowerCase().includes(q)
      );
    }
    if (cuisine !== 'All') list = list.filter(d => d.cuisine === cuisine);
    list = list.filter(d => d.dist <= maxDist && d.min <= maxMin && d.amt >= minCash);
    chips.forEach(cid => {
      const f = QUICK_FILTERS.find(x => x.id === cid);
      if (f) list = list.filter(f.test);
    });
    const sorters = {
      match:  (a,b) => (b.match||0) - (a.match||0) || b.amt - a.amt,
      cash:   (a,b) => b.amt - a.amt,
      near:   (a,b) => a.dist - b.dist,
      min:    (a,b) => a.min - b.min,
      rating: (a,b) => b.rating - a.rating,
    };
    return [...list].sort(sorters[sort]);
  }, [query, cuisine, sort, chips, maxDist, maxMin, minCash]);

  const toggleChip = (id) =>
    setChips(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const activeFilterCount =
    (cuisine !== 'All' ? 1 : 0) +
    chips.length +
    (maxDist !== 5 ? 1 : 0) +
    (maxMin !== 100 ? 1 : 0) +
    (minCash !== 0 ? 1 : 0);

  const resetFilters = () => {
    setCuisine('All'); setChips([]); setMaxDist(5); setMaxMin(100); setMinCash(0); setQuery('');
  };

  return (
    <div className="pane">
      <div className="page-h">
        <span className="eyebrow">Friday · Drops</span>
        <h1>{DROPS.length} spots, one good <span className="hl">weekend.</span></h1>
        <div style={{display:'flex',gap:8,marginTop:14,alignItems:'center',flexWrap:'wrap'}}>
          <span className="countdown"><span className="dot" /> Closes in <b>2d 14h 22m</b></span>
          <span className="countdown" style={{background:'transparent',color:'var(--ink)',border:'1.5px solid var(--ink)'}}>
            <b style={{color:'var(--ink)'}}>{DROPS.length}</b> live near you
          </span>
        </div>
      </div>

      {/* Curated rail */}
      <div className="sec-l" style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingRight:20}}>
        <span>✦ Curated for you</span>
        <span style={{letterSpacing:'.04em',textTransform:'none',fontWeight:500,fontSize:11,opacity:.7}}>
          Based on your last 30 days
        </span>
      </div>

      <div className="cur-rail">
        {curated.map((d, i) => (
          <div key={d.id} className={`cur-card ${i === 0 ? 'hero' : ''}`} onClick={() => onOpen(d)}>
            <div className="cur-photo">
              {getImg(d) && <img src={getImg(d)} alt={d.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />}
              <div className="cur-tag">{d.curated}</div>
              <div className="cur-match">
                <span className="dot" />
                {d.match}% match
              </div>
            </div>
            <div className="cur-body">
              <div className="cur-top">
                <div>
                  <div className="cur-nm">{d.name}</div>
                  <div className="cur-meta">{d.area} · {d.cuisine} · {d.price}</div>
                </div>
                <div className="cur-amt">+£{d.amt}</div>
              </div>
              <div className="cur-foot">
                <span>★ {d.rating}</span>
                <span className="cur-dot" />
                <span>{d.dist} mi</span>
                <span className="cur-dot" />
                <span>min £{d.min}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Streak nudge */}
      <div className="banner" style={{marginTop:18}}>
        <div className="body">
          <b>£6 from your weekly £40 streak.</b>
          One more drop locks an extra £5 bonus.
        </div>
      </div>

      {/* Explore — search + filters */}
      <div className="sec-l" style={{marginTop:28,display:'flex',alignItems:'center',justifyContent:'space-between',paddingRight:20}}>
        <span>Explore all drops</span>
        <span style={{letterSpacing:'.04em',textTransform:'none',fontWeight:500,fontSize:11,opacity:.7}}>
          {explore.length} of {DROPS.length}
        </span>
      </div>

      <div className="search-bar">
        <div className="search-input">
          <IcSearch size={18} />
          <input
            type="text"
            placeholder="Search restaurants, cuisines, areas…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear">
              <IcClose size={14} />
            </button>
          )}
        </div>
        <button
          className={`filter-btn ${activeFilterCount ? 'active' : ''}`}
          onClick={() => setShowFilters(true)}
          aria-label="Filters"
        >
          <FilterIcon />
          {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Cuisine scroller */}
      <div className="cuisine-rail">
        {CUISINES.map(c => (
          <button
            key={c}
            className={`cuisine-chip ${cuisine === c ? 'active' : ''}`}
            onClick={() => setCuisine(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Quick filter chips + sort */}
      <div className="quick-row">
        <div className="quick-chips">
          {QUICK_FILTERS.map(f => (
            <button
              key={f.id}
              className={`q-chip ${chips.includes(f.id) ? 'on' : ''}`}
              onClick={() => toggleChip(f.id)}
            >
              {f.lab}
            </button>
          ))}
        </div>
      </div>

      <div className="sort-row">
        <div className="sort-pills">
          {SORTS.map(s => (
            <button
              key={s.id}
              className={`sort-pill ${sort === s.id ? 'on' : ''}`}
              onClick={() => setSort(s.id)}
            >
              {s.lab}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {explore.length === 0 ? (
        <div className="empty">
          <div className="empty-glyph">○</div>
          <div className="empty-h">No drops match those filters.</div>
          <button className="btn btn-ghost" onClick={resetFilters} style={{marginTop:14,padding:'10px 18px',fontSize:13}}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="rc-stack" style={{marginTop:4}}>
          {explore.map(d => (
            <div key={d.id} className="rc-card" onClick={() => onOpen(d)}>
              <div className="left">
                <div className={`photo${getImg(d) ? ' has-img' : ''}`}>
                  {getImg(d) && <img src={getImg(d)} alt={d.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />}
                </div>
              </div>
              <div className="perf" />
              <div className="body">
                <div className="nm">{d.name}</div>
                <div style={{fontSize:12,color:'var(--muted)',fontWeight:600,marginTop:2}}>
                  {d.area} · {d.cuisine} · {d.price}
                </div>
                <div className="terms" style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
                  <span>★ {d.rating}</span>
                  <span style={{opacity:.4}}>·</span>
                  <span>{d.dist} mi</span>
                  <span style={{opacity:.4}}>·</span>
                  <span>min £{d.min}</span>
                  {d.slots <= 6 && (
                    <>
                      <span style={{opacity:.4}}>·</span>
                      <span style={{color:'var(--pink)'}}>{d.slots} left</span>
                    </>
                  )}
                </div>
              </div>
              <div className="right">
                <div className="amt">+£{d.amt}</div>
                <div className="lab">Cash back</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{height:24}} />

      {showFilters && (
        <FilterSheet
          onClose={() => setShowFilters(false)}
          maxDist={maxDist} setMaxDist={setMaxDist}
          maxMin={maxMin} setMaxMin={setMaxMin}
          minCash={minCash} setMinCash={setMinCash}
          cuisine={cuisine} setCuisine={setCuisine}
          chips={chips} toggleChip={toggleChip}
          reset={resetFilters}
          count={explore.length}
        />
      )}
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 6 L21 6" /><path d="M6 12 L18 12" /><path d="M9 18 L15 18" />
    </svg>
  );
}

function FilterSheet({ onClose, maxDist, setMaxDist, maxMin, setMaxMin, minCash, setMinCash, cuisine, setCuisine, chips, toggleChip, reset, count }) {
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-grip" />
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <h2 style={{fontSize:28,marginBottom:0}}>Filters</h2>
          <button className="btn btn-ghost" style={{padding:'8px 14px',fontSize:12}} onClick={reset}>Reset</button>
        </div>
        <p className="sub" style={{marginBottom:18}}>Narrow the {DROPS.length} live drops.</p>

        <div className="filter-block">
          <div className="filter-h">
            <span>Distance</span>
            <b>≤ {maxDist} mi</b>
          </div>
          <input type="range" min="0.5" max="5" step="0.5" value={maxDist}
            onChange={(e) => setMaxDist(parseFloat(e.target.value))} className="rng" />
        </div>

        <div className="filter-block">
          <div className="filter-h">
            <span>Max min spend</span>
            <b>£{maxMin}</b>
          </div>
          <input type="range" min="20" max="100" step="5" value={maxMin}
            onChange={(e) => setMaxMin(parseInt(e.target.value))} className="rng" />
        </div>

        <div className="filter-block">
          <div className="filter-h">
            <span>Cashback</span>
            <b>£{minCash}+</b>
          </div>
          <input type="range" min="0" max="25" step="1" value={minCash}
            onChange={(e) => setMinCash(parseInt(e.target.value))} className="rng" />
        </div>

        <div className="filter-block">
          <div className="filter-h"><span>Cuisine</span></div>
          <div className="quick-chips" style={{marginTop:10}}>
            {CUISINES.map(c => (
              <button key={c}
                className={`q-chip ${cuisine === c ? 'on' : ''}`}
                onClick={() => setCuisine(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-h"><span>Quick filters</span></div>
          <div className="quick-chips" style={{marginTop:10}}>
            {QUICK_FILTERS.map(f => (
              <button key={f.id}
                className={`q-chip ${chips.includes(f.id) ? 'on' : ''}`}
                onClick={() => toggleChip(f.id)}>{f.lab}</button>
            ))}
          </div>
        </div>

        <button className="btn btn-lime btn-block" style={{marginTop:18}} onClick={onClose}>
          Show {count} drop{count === 1 ? '' : 's'}
        </button>
      </div>
    </div>
  );
}

// === Wallet Pane ===
const PENDING = [
  { name: 'Dishoom', area: 'Shoreditch', amt: 18, min: 35, expires: 'Sun 11:59pm', daysLeft: 2, hoursLeft: 14 },
  { name: 'Endo at Rotunda', area: 'Holland Park', amt: 24, min: 80, expires: 'Sun 11:59pm', daysLeft: 2, hoursLeft: 14 },
  { name: 'Hoppers', area: 'Soho', amt: 9, min: 22, expires: 'Sat 11:59pm', daysLeft: 1, hoursLeft: 14 },
];

function WalletPane() {
  const pendingTotal = PENDING.reduce((s, p) => s + p.amt, 0);
  return (
    <div className="pane">
      <div className="page-h">
        <span className="eyebrow">Klaims</span>
        <h1>£128.40<br/>in <span className="hl">your pocket.</span></h1>
        <p className="sub">Paid straight to Monzo via Open Banking. No points. No vouchers. No expiry.</p>
        <div style={{display:'flex',gap:8,marginTop:14}}>
          <button className="btn btn-primary">Cash out</button>
          <button className="btn btn-ghost">Linked banks</button>
        </div>
      </div>

      <div className="sec-l">This month</div>
      <div className="stats">
        <div className="stat-c"><div className="v">£72</div><div className="k">Earned</div></div>
        <div className="stat-c"><div className="v">5</div><div className="k">Drops klaimed</div></div>
        <div className="stat-c"><div className="v">£14.40</div><div className="k">Avg per drop</div></div>
      </div>

      <div className="sec-l" style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingRight:20}}>
        <span>Pending · awaiting visit</span>
        <span style={{letterSpacing:'.04em',textTransform:'none',fontWeight:600,fontSize:11,opacity:.7}}>
          £{pendingTotal} unlockable
        </span>
      </div>
      <div style={{padding:'0 20px 4px',fontSize:12,color:'var(--muted)',fontWeight:500,marginBottom:10,marginTop:-4,lineHeight:1.4}}>
        You've klaimed these drops — visit the restaurant &amp; pay with a linked card to unlock cashback.
      </div>
      <div className="row-list">
        {PENDING.map((p, i) => {
          const pImg = getImgByName(p.name);
          return (
            <div key={i} className="row pending-row">
              <div className={`ph-sm photo${pImg ? ' has-img' : ''}`}>
                {pImg && <img src={pImg} alt={p.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />}
              </div>
              <div className="info">
                <div className="nm">{p.name}</div>
                <div className="det">{p.area} · min spend £{p.min}</div>
                <div className="pending-meta">
                  <span className="pending-dot" />
                  <span>Visit by {p.expires}</span>
                </div>
              </div>
              <div className="right">
                <div className="amt amt-pending">+£{p.amt}</div>
                <div className="lab" style={{color:'var(--pink)'}}>{p.daysLeft}d {p.hoursLeft}h</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sec-l">Recent klaims</div>
      <div className="row-list">
        {HISTORY.map((h, i) => {
          const hImg = getImgByName(h.name);
          return (
            <div key={i} className="row">
              <div className={`ph-sm photo${hImg ? ' has-img' : ''}`}>
                {hImg && <img src={hImg} alt={h.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />}
              </div>
              <div className="info">
                <div className="nm">{h.name}</div>
                <div className="det">{h.area}</div>
              </div>
              <div className="right">
                <div className="amt">+£{h.amt}</div>
                <div className="lab">Paid · 32s</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{height:24}} />
    </div>
  );
}

// === Trade Pane ===
function TradePane({ onOpen }) {
  return (
    <div className="pane">
      <div className="page-h">
        <span className="eyebrow">Trade</span>
        <h1>Swap a drop with <span className="hl">friends.</span></h1>
        <p className="sub">Got a drop you won't use? Trade it. Mutual swap, both sides confirm — then cashback follows the new owner.</p>
      </div>

      <div className="sec-l">Your tradeable drops</div>
      <div className="row-list">
        {DROPS.slice(0, 2).map(d => {
          const dImg = getImg(d);
          return (
            <div key={d.id} className="row">
              <div className={`ph-sm photo${dImg ? ' has-img' : ''}`}>
                {dImg && <img src={dImg} alt={d.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />}
              </div>
              <div className="info">
                <div className="nm">{d.name}</div>
                <div className="det">{d.area} · expires Sun</div>
              </div>
              <button className="btn btn-lime" style={{padding:'8px 14px',fontSize:12}}>Offer trade</button>
            </div>
          );
        })}
      </div>

      <div className="sec-l">Open offers from friends</div>
      <div className="row-list">
        <div className="row" style={{flexDirection:'column',alignItems:'stretch',gap:10,padding:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="av pink">MR</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:15}}>Maya wants to swap</div>
              <div style={{fontSize:12,color:'var(--muted)',fontWeight:500}}>2 hours ago</div>
            </div>
          </div>
          <div className="swap-vis" style={{margin:'0 -4px'}}>
            <div style={{flex:1,textAlign:'center'}}>
              <div className="ph-sm photo has-img" style={{margin:'0 auto 6px',width:64,height:64}}>
                <img src={RESTO_IMGS['endo']} alt="Endo at Rotunda" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:13}}>Endo drop</div>
              <div style={{fontSize:11,color:'var(--muted)',fontWeight:600}}>+£24</div>
            </div>
            <div className="arr"><IcSwap size={18} /></div>
            <div style={{flex:1,textAlign:'center'}}>
              <div className="ph-sm photo has-img" style={{margin:'0 auto 6px',width:64,height:64}}>
                <img src={RESTO_IMGS['padella']} alt="Padella" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div style={{fontFamily:'Bricolage Grotesque',fontWeight:700,fontSize:13}}>Your Padella</div>
              <div style={{fontSize:11,color:'var(--muted)',fontWeight:600}}>+£12</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-ghost" style={{flex:1,padding:'10px',fontSize:13}}>Decline</button>
            <button className="btn btn-lime" style={{flex:1,padding:'10px',fontSize:13}}>Accept swap</button>
          </div>
        </div>
      </div>

      <div style={{height:24}} />
    </div>
  );
}

// === Buddies Pane ===
function BuddiesPane({ onOpenGroup }) {
  return (
    <div className="pane">
      <div className="page-h">
        <span className="eyebrow">Drop Buddies</span>
        <h1>Eat together, <span className="hl">klaim together.</span></h1>
        <p className="sub">Coordinate the same drop. Group of 2+ unlocks +£5 bonus per person, paid the same way.</p>
      </div>

      {/* === REFERRAL HERO === */}
      <div className="ref-hero">
        <div className="ref-tag">
          <span className="ref-dot" /> Refer · earn together
        </div>
        <div className="ref-amounts">
          <div className="ref-amt-block">
            <div className="ref-amt">£5</div>
            <div className="ref-amt-lab">for you</div>
          </div>
          <div className="ref-plus">+</div>
          <div className="ref-amt-block">
            <div className="ref-amt">£5</div>
            <div className="ref-amt-lab">for them</div>
          </div>
        </div>
        <div className="ref-headline">
          Invite a friend.<br/>Both get <span className="ref-hl">£5</span> on their first klaim.
        </div>
        <div className="ref-fine">
          Paid to your bank the moment they complete their first restaurant transaction.
        </div>
        <div className="ref-cta-row">
          <button className="btn btn-lime" style={{flex:1,padding:'14px'}}>
            <IcShare size={18} style={{marginRight:6}} /> Share invite link
          </button>
          <button className="btn ref-copy">
            <span style={{fontFamily:'Bricolage Grotesque',fontWeight:800,fontSize:13,letterSpacing:'.04em'}}>SAM-K5</span>
          </button>
        </div>
        <div className="ref-progress">
          <div className="ref-prog-row">
            <span><b>2</b> friends invited</span>
            <span><b>1</b> klaimed · <span style={{color:'var(--lime)'}}>£5 earned</span></span>
          </div>
          <div className="ref-bar">
            <div className="ref-bar-fill" style={{width:'33%'}} />
          </div>
          <div className="ref-prog-foot">3 more invites unlock the £25 super-buddy bonus</div>
        </div>
      </div>

      <div className="banner ink" style={{marginTop:14,cursor:'pointer'}} onClick={onOpenGroup}>
        <div className="body">
          <b>Theo wants to klaim Padella tonight</b>
          Tap in for +£5 group bonus each.
        </div>
        <div className="arr"><IcChevR size={16} /></div>
      </div>

      <div className="sec-l">Your buddies' weeks</div>
      <div className="feed">
        {FRIENDS.map((f, i) => (
          <div key={i} className="feed-row">
            <div className={`av ${f.av}`}>{f.initials}</div>
            <div className="body">
              <span className="nm">{f.name}</span>
              <div className="act">{f.action}</div>
              {f.cta && (
                <div className="badges">
                  <button className="btn btn-lime" style={{padding:'6px 12px',fontSize:11}}>Join drop</button>
                  <button className="btn btn-ghost" style={{padding:'6px 12px',fontSize:11}}>Skip</button>
                </div>
              )}
            </div>
            <div className="meta">{f.when}</div>
          </div>
        ))}
      </div>

      <div className="sec-l">Find buddies</div>
      <div className="chips" style={{paddingBottom:8}}>
        <div className="b-chip"><div className="ph-xs photo" />Maya R. <span className="x">·</span> 12 drops</div>
        <div className="b-chip"><div className="ph-xs photo" />Theo L. <span className="x">·</span> 8 drops</div>
        <button className="b-chip invite-chip">
          <span className="invite-plus">+</span>
          Invite friend
          <span className="invite-pill">£5</span>
        </button>
      </div>

      <div style={{height:24}} />
    </div>
  );
}

// === Profile Pane ===
function ProfilePane({ onOpenSettings }) {
  return (
    <div className="pane">
      <div className="profile-h">
        <div className="av">SC</div>
        <div className="nm">Sam Chen</div>
        <div className="handle">@samchen · joined Mar 2026</div>
        <div className="badges">
          <span className="pill">14 drops klaimed</span>
          <span className="pill">£218 banked</span>
          <span className="pill">Borough explorer</span>
        </div>
      </div>

      <div className="sec-l">Linked banks</div>
      <div className="row-list">
        <div className="row">
          <div className="ph-sm photo" style={{background:'#FF3464',color:'#fff'}}><span style={{position:'relative',zIndex:2,fontSize:14,fontWeight:800,letterSpacing:'-.02em'}}>M</span></div>
          <div className="info">
            <div className="nm">Monzo · Personal</div>
            <div className="det">·· 4421 · primary for cashback</div>
          </div>
          <span className="pill lime">Active</span>
        </div>
        <div className="row">
          <div className="ph-sm photo" />
          <div className="info">
            <div className="nm">HSBC · Joint</div>
            <div className="det">·· 8819 · linked Jan 2026</div>
          </div>
          <span className="pill ghost">Active</span>
        </div>
        <button className="btn btn-ghost btn-block" style={{margin:'4px 0',padding:'12px'}}>+ Link another bank</button>
      </div>

      <div className="sec-l">Preferences</div>
      <div style={{display:'flex',flexDirection:'column',gap:10,padding:'0 0 8px'}}>
        <div className="toggle-row">
          <div className="info">
            <div className="nm">Drop reminders</div>
            <div className="det">Mon &amp; Fri 9:00am push</div>
          </div>
          <button className="toggle on" />
        </div>
        <div className="toggle-row">
          <div className="info">
            <div className="nm">Public drops</div>
            <div className="det">Buddies see what you klaim</div>
          </div>
          <button className="toggle on" />
        </div>
        <div className="toggle-row">
          <div className="info">
            <div className="nm">Trade requests</div>
            <div className="det">Friends only</div>
          </div>
          <button className="toggle" />
        </div>
      </div>

      <div style={{padding:'16px 20px 0'}}>
        <button className="btn btn-ghost btn-block" onClick={onOpenSettings}>Settings &amp; FAQ</button>
      </div>

      <div style={{height:24}} />
    </div>
  );
}

Object.assign(window, { DROPS, FRIENDS, HISTORY, CUISINES, CUISINE_IMGS, RESTO_IMGS, getImg, getImgByName, QUICK_FILTERS, SORTS, DropsPane, WalletPane, TradePane, BuddiesPane, ProfilePane, FilterSheet });
