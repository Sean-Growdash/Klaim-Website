// === Klaim Merchant Portal — icons (Lucide-style, stroke) ===
const Ic = (p) => {
  const { d, size = 19, fill, sw = 1.85, children, ...rest } = p;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"}
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {children || <path d={d} />}
    </svg>
  );
};

const IcGrid    = (p)=><Ic {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></Ic>;
const IcRocket  = (p)=><Ic {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/></Ic>;
const IcChart   = (p)=><Ic {...p}><path d="M3 3v18h18"/><path d="M7 16l4-5 3 3 5-7"/></Ic>;
const IcSpark   = (p)=><Ic {...p}><path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4z"/><path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/><path d="M5 4l.5 1.5L7 6l-1.5.5L5 8l-.5-1.5L3 6l1.5-.5z"/></Ic>;
const IcWallet  = (p)=><Ic {...p}><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5"/><path d="M17 13h.01"/></Ic>;
const IcUsers   = (p)=><Ic {...p}><circle cx="9" cy="7" r="3.2"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0"/><path d="M16 3.5a3.2 3.2 0 0 1 0 6.5"/><path d="M21.5 21a6.5 6.5 0 0 0-5-6.3"/></Ic>;
const IcGear    = (p)=><Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Ic>;
const IcBell    = (p)=><Ic {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Ic>;
const IcPlus    = (p)=><Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>;
const IcChevD   = (p)=><Ic {...p} sw="2.2"><path d="M6 9l6 6 6-6"/></Ic>;
const IcChevR   = (p)=><Ic {...p} sw="2.2"><path d="M9 6l6 6-6 6"/></Ic>;
const IcChevL   = (p)=><Ic {...p} sw="2.2"><path d="M15 6l-6 6 6 6"/></Ic>;
const IcCheck   = (p)=><Ic {...p} sw="2.4"><path d="M20 6L9 17l-5-5"/></Ic>;
const IcX       = (p)=><Ic {...p} sw="2.2"><path d="M18 6L6 18M6 6l12 12"/></Ic>;
const IcLock    = (p)=><Ic {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Ic>;
const IcArrowUp = (p)=><Ic {...p} sw="2.4"><path d="M12 19V5M5 12l7-7 7 7"/></Ic>;
const IcArrowDn = (p)=><Ic {...p} sw="2.4"><path d="M12 5v14M5 12l7 7 7-7"/></Ic>;
const IcArrowR  = (p)=><Ic {...p} sw="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></Ic>;
const IcTarget  = (p)=><Ic {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></Ic>;
const IcCalendar= (p)=><Ic {...p}><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></Ic>;
const IcBolt    = (p)=><Ic {...p}><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z"/></Ic>;
const IcCash    = (p)=><Ic {...p}><rect x="2" y="6" width="20" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/></Ic>;
const IcReceipt = (p)=><Ic {...p}><path d="M5 3v18l2-1.2 2 1.2 2-1.2 2 1.2 2-1.2 2 1.2 1 .6V3l-1-.6-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2z"/><path d="M9 8h6M9 12h6"/></Ic>;
const IcStore   = (p)=><Ic {...p}><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9"/><path d="M3 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/></Ic>;
const IcSend    = (p)=><Ic {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></Ic>;
const IcMsg     = (p)=><Ic {...p}><path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 17 0z"/></Ic>;
const IcTrend   = (p)=><Ic {...p}><path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></Ic>;
const IcWarn    = (p)=><Ic {...p}><path d="M10.3 3.8L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></Ic>;
const IcEye     = (p)=><Ic {...p}><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></Ic>;
const IcEdit    = (p)=><Ic {...p}><path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></Ic>;
const IcTrash   = (p)=><Ic {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></Ic>;
const IcPause   = (p)=><Ic {...p}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></Ic>;
const IcPlay    = (p)=><Ic {...p}><path d="M6 4l14 8-14 8z" fill="currentColor"/></Ic>;
const IcDownload= (p)=><Ic {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></Ic>;
const IcCopy    = (p)=><Ic {...p}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Ic>;
const IcLogout  = (p)=><Ic {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></Ic>;
const IcBank    = (p)=><Ic {...p}><path d="M3 10l9-6 9 6"/><path d="M4 10v9M9 10v9M15 10v9M20 10v9M2 21h20"/></Ic>;
const IcCard    = (p)=><Ic {...p}><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></Ic>;
const IcInfo    = (p)=><Ic {...p}><circle cx="12" cy="12" r="9.5"/><path d="M12 16v-4M12 8h.01"/></Ic>;
const IcStar    = (p)=><Ic {...p}><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.6 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></Ic>;
const IcClock   = (p)=><Ic {...p}><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/></Ic>;
const IcLink    = (p)=><Ic {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></Ic>;
const IcSearch  = (p)=><Ic {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Ic>;
const IcFilter  = (p)=><Ic {...p}><path d="M22 3H2l8 9.5V19l4 2v-8.5z"/></Ic>;
const IcShield  = (p)=><Ic {...p}><path d="M12 2.5l8 3.5v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-5z"/><path d="M9 12l2 2 4-4"/></Ic>;
const IcMenu    = (p)=><Ic {...p}><path d="M3 6h18M3 12h18M3 18h18"/></Ic>;
const IcGift    = (p)=><Ic {...p}><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13"/><path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5zM12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5z"/></Ic>;
const IcRepeat  = (p)=><Ic {...p}><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></Ic>;
const IcMap     = (p)=><Ic {...p}><path d="M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></Ic>;
const IcFlame   = (p)=><Ic {...p}><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 .5-2S6 11 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12z"/></Ic>;
const IcSliders = (p)=><Ic {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></Ic>;

Object.assign(window, {
  IcGrid, IcRocket, IcChart, IcSpark, IcWallet, IcUsers, IcGear, IcBell, IcPlus,
  IcChevD, IcChevR, IcChevL, IcCheck, IcX, IcLock, IcArrowUp, IcArrowDn, IcArrowR,
  IcTarget, IcCalendar, IcBolt, IcCash, IcReceipt, IcStore, IcSend, IcMsg, IcTrend,
  IcWarn, IcEye, IcEdit, IcTrash, IcPause, IcPlay, IcDownload, IcCopy, IcLogout,
  IcBank, IcCard, IcInfo, IcStar, IcClock, IcLink, IcSearch, IcFilter, IcShield,
  IcMenu, IcGift, IcRepeat, IcMap, IcFlame, IcSliders
});
