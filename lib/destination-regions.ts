const REGION_MAP: Record<string, string> = {
  // Europe
  AL: 'Europe', AD: 'Europe', AT: 'Europe', AX: 'Europe', BY: 'Europe', BE: 'Europe', BA: 'Europe',
  BG: 'Europe', HR: 'Europe', CY: 'Europe', CYP: 'Europe', CZ: 'Europe', DK: 'Europe', EE: 'Europe',
  FO: 'Europe', FI: 'Europe', FR: 'Europe', DE: 'Europe', GI: 'Europe', GR: 'Europe', GG: 'Europe',
  VA: 'Europe', HU: 'Europe', IS: 'Europe', IE: 'Europe', IM: 'Europe', IT: 'Europe', JE: 'Europe',
  LV: 'Europe', LI: 'Europe', LT: 'Europe', LU: 'Europe', MT: 'Europe', MD: 'Europe', MC: 'Europe',
  ME: 'Europe', NL: 'Europe', MK: 'Europe', NO: 'Europe', PL: 'Europe', PT: 'Europe', RO: 'Europe',
  RU: 'Europe', SM: 'Europe', RS: 'Europe', SK: 'Europe', SI: 'Europe', ES: 'Europe', SE: 'Europe',
  CH: 'Europe', UA: 'Europe', GB: 'Europe', UK: 'Europe', XK: 'Europe', EU: 'Europe',
  'PT-MA': 'Europe', 'CY-NC': 'Europe', 'ES-XCI': 'Europe', BALKANS: 'Europe', NORDIC: 'Europe',
  BALTICS: 'Europe', MEDITERRANEAN: 'Europe', 'GB-SCT': 'Europe', 'PT-AZ': 'Europe', IC: 'Europe',

  // Asia
  AF: 'Asia', AM: 'Asia', AZ: 'Asia', BD: 'Asia', BT: 'Asia', BN: 'Asia', KH: 'Asia', CN: 'Asia',
  GE: 'Asia', HK: 'Asia', IN: 'Asia', ID: 'Asia', JP: 'Asia', KZ: 'Asia', KP: 'Asia', KR: 'Asia',
  KG: 'Asia', LA: 'Asia', MO: 'Asia', MY: 'Asia', MV: 'Asia', MN: 'Asia', MM: 'Asia', NP: 'Asia',
  PK: 'Asia', PH: 'Asia', SG: 'Asia', LK: 'Asia', TW: 'Asia', TJ: 'Asia', TH: 'Asia', TL: 'Asia',
  TM: 'Asia', UZ: 'Asia', VN: 'Asia', APAC: 'Asia', 'CENTRAL ASIA': 'Asia', 'SOUTHEAST ASIA': 'Asia',
  CIS: 'Asia',

  // Middle East
  BH: 'Middle East', IR: 'Middle East', IQ: 'Middle East', IL: 'Middle East', JO: 'Middle East',
  KW: 'Middle East', LB: 'Middle East', OM: 'Middle East', PS: 'Middle East', QA: 'Middle East',
  SA: 'Middle East', SY: 'Middle East', TR: 'Middle East', AE: 'Middle East', YE: 'Middle East',
  MENA: 'Middle East', GULF: 'Middle East',

  // North America
  BM: 'North America', CA: 'North America', GL: 'North America', MX: 'North America',
  PM: 'North America', US: 'North America', CR: 'North America', BZ: 'North America',
  GT: 'North America', PA: 'North America', SV: 'North America', HN: 'North America', NI: 'North America',
  'US-HI': 'North America', 'AMERICAS + US + CA': 'North America', CENAM: 'North America',

  // South America
  AR: 'South America', BO: 'South America', BR: 'South America', CL: 'South America',
  CO: 'South America', EC: 'South America', FK: 'South America', GF: 'South America',
  GY: 'South America', PY: 'South America', PE: 'South America', SR: 'South America',
  UY: 'South America', VE: 'South America', LATAM: 'South America',

  // Caribbean
  AI: 'Caribbean', AG: 'Caribbean', AW: 'Caribbean', BS: 'Caribbean', BB: 'Caribbean',
  BL: 'Caribbean', BQ: 'Caribbean', KY: 'Caribbean', CU: 'Caribbean', CW: 'Caribbean',
  DM: 'Caribbean', DO: 'Caribbean', GD: 'Caribbean', GP: 'Caribbean', HT: 'Caribbean',
  JM: 'Caribbean', MQ: 'Caribbean', MS: 'Caribbean', PR: 'Caribbean', USPR: 'Caribbean', KN: 'Caribbean',
  LC: 'Caribbean', MF: 'Caribbean', VC: 'Caribbean', SX: 'Caribbean', TT: 'Caribbean',
  TC: 'Caribbean', VG: 'Caribbean', VI: 'Caribbean', AN: 'Caribbean', 'BQ-SA': 'Caribbean',
  'BQ-SE': 'Caribbean', 'BQ-BO': 'Caribbean', 'GP-MG': 'Caribbean',

  // Africa
  DZ: 'Africa', AO: 'Africa', BJ: 'Africa', BW: 'Africa', BF: 'Africa', BI: 'Africa',
  CV: 'Africa', CM: 'Africa', CF: 'Africa', TD: 'Africa', KM: 'Africa', CG: 'Africa',
  CD: 'Africa', CI: 'Africa', DJ: 'Africa', EG: 'Africa', GQ: 'Africa', ER: 'Africa',
  SZ: 'Africa', ET: 'Africa', GA: 'Africa', GM: 'Africa', GH: 'Africa', GN: 'Africa',
  GW: 'Africa', KE: 'Africa', LS: 'Africa', LR: 'Africa', LY: 'Africa', MG: 'Africa',
  MW: 'Africa', ML: 'Africa', MR: 'Africa', MU: 'Africa', YT: 'Africa', MA: 'Africa',
  MZ: 'Africa', NA: 'Africa', NE: 'Africa', NG: 'Africa', RE: 'Africa', RW: 'Africa',
  SH: 'Africa', ST: 'Africa', SN: 'Africa', SC: 'Africa', SL: 'Africa', SO: 'Africa',
  ZA: 'Africa', SS: 'Africa', SD: 'Africa', TZ: 'Africa', TG: 'Africa', TN: 'Africa',
  UG: 'Africa', ZM: 'Africa', ZW: 'Africa',

  // Oceania
  AS: 'Oceania', AU: 'Oceania', CK: 'Oceania', FJ: 'Oceania', PF: 'Oceania', GU: 'Oceania',
  KI: 'Oceania', MH: 'Oceania', FM: 'Oceania', NR: 'Oceania', NC: 'Oceania', NZ: 'Oceania',
  NU: 'Oceania', NF: 'Oceania', MP: 'Oceania', PW: 'Oceania', PG: 'Oceania', WS: 'Oceania',
  SB: 'Oceania', TK: 'Oceania', TO: 'Oceania', TV: 'Oceania', VU: 'Oceania', WF: 'Oceania',
};

export function getDestinationRegion(isoCode: string, name: string, type?: string): string {
  if (type === 'global' || /global/i.test(name)) return 'Global';
  const code = isoCode.toUpperCase().trim();
  if (REGION_MAP[code]) return REGION_MAP[code];
  if (/europe/i.test(name)) return 'Europe';
  if (/asia/i.test(name)) return 'Asia';
  if (/africa/i.test(name)) return 'Africa';
  if (/caribbean/i.test(name)) return 'Caribbean';
  if (/oceania/i.test(name)) return 'Oceania';
  if (/middle east/i.test(name)) return 'Middle East';
  if (/latin|south america/i.test(name)) return 'South America';
  if (/north america|america/i.test(name)) return 'North America';
  return 'Europe';
}
