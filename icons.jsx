// Inline-stroke iconography matching Klaim deck (1.5px stroke, ink color)
const Ic = ({ size = 22, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const IcDrop = (p) => <Ic {...p}><path d="M12 3 L18 11 A6 6 0 1 1 6 11 Z"/></Ic>;
const IcWallet = (p) => <Ic {...p}><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10 L21 10"/><circle cx="17" cy="15" r="1.2" fill="currentColor"/></Ic>;
const IcSparkle = (p) => <Ic {...p}><path d="M12 3 L13.5 9 L20 10.5 L13.5 12 L12 18 L10.5 12 L4 10.5 L10.5 9 Z"/><path d="M19 18 L19.7 19.6 L21.5 20 L19.7 20.4 L19 22 L18.3 20.4 L16.5 20 L18.3 19.6 Z"/></Ic>;
const IcUsers = (p) => <Ic {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 19 a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 19 a4 4 0 0 1 7 0"/></Ic>;
const IcUser = (p) => <Ic {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20 a7 7 0 0 1 14 0"/></Ic>;
const IcSwap = (p) => <Ic {...p}><path d="M7 7 L17 7"/><path d="M14 4 L17 7 L14 10"/><path d="M17 17 L7 17"/><path d="M10 14 L7 17 L10 20"/></Ic>;
const IcGift = (p) => <Ic {...p}><rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13 L21 13"/><path d="M12 9 L12 21"/><path d="M8 9 a2.5 2.5 0 0 1 4-3 a2.5 2.5 0 0 1 4 3"/></Ic>;
const IcClose = (p) => <Ic {...p}><path d="M6 6 L18 18"/><path d="M18 6 L6 18"/></Ic>;
const IcChevR = (p) => <Ic {...p}><path d="M9 6 L15 12 L9 18"/></Ic>;
const IcChevL = (p) => <Ic {...p}><path d="M15 6 L9 12 L15 18"/></Ic>;
const IcCheck = (p) => <Ic {...p}><path d="M5 12 L10 17 L19 7"/></Ic>;
const IcSearch = (p) => <Ic {...p}><circle cx="11" cy="11" r="6.5"/><path d="M16 16 L20 20"/></Ic>;
const IcBank = (p) => <Ic {...p}><path d="M3 10 L12 4 L21 10"/><path d="M3 10 L21 10"/><path d="M5 10 L5 18"/><path d="M10 10 L10 18"/><path d="M14 10 L14 18"/><path d="M19 10 L19 18"/><path d="M3 18 L21 18"/></Ic>;
const IcBolt = (p) => <Ic {...p}><path d="M13 3 L5 14 L11 14 L11 21 L19 10 L13 10 Z"/></Ic>;
const IcShare = (p) => <Ic {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11 L15.8 7"/><path d="M8.2 13 L15.8 17"/></Ic>;
const IcStar = (p) => <Ic {...p}><path d="M12 3 L14.5 9 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 9 Z"/></Ic>;
const IcInfo = (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11 L12 17"/><circle cx="12" cy="8" r=".9" fill="currentColor"/></Ic>;
const IcSettings = (p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M12 3 L12 5 M12 19 L12 21 M5 12 L3 12 M21 12 L19 12 M5.5 5.5 L7 7 M17 17 L18.5 18.5 M5.5 18.5 L7 17 M17 7 L18.5 5.5"/></Ic>;
const IcTimer = (p) => <Ic {...p}><circle cx="12" cy="13" r="8"/><path d="M9 3 L15 3"/><path d="M12 9 L12 13 L15 15"/></Ic>;

Object.assign(window, {
  Ic, IcDrop, IcWallet, IcSparkle, IcUsers, IcUser, IcSwap, IcGift,
  IcClose, IcChevR, IcChevL, IcCheck, IcSearch, IcBank, IcBolt, IcShare,
  IcStar, IcInfo, IcSettings, IcTimer
});
