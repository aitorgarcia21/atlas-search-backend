/**
 * WHITELIST FISCALE MONDIALE
 * Sources officielles + Big Four pour 195 pays
 */

export const WHITELIST = {
  // ============================================================================
  // BIG FOUR - GLOBAL (toujours autorisés)
  // ============================================================================
  bigFour: [
    'deloitte.com',
    'pwc.com',
    'ey.com',
    'kpmg.com',
    // Domaines régionaux Big Four
    'deloitte.fr', 'deloitte.de', 'deloitte.co.uk', 'deloitte.ch', 'deloitte.be', 'deloitte.nl', 'deloitte.es', 'deloitte.it', 'deloitte.lu', 'deloitte.at', 'deloitte.ie', 'deloitte.pt', 'deloitte.pl', 'deloitte.cz', 'deloitte.hu', 'deloitte.ro', 'deloitte.bg', 'deloitte.gr', 'deloitte.se', 'deloitte.dk', 'deloitte.fi', 'deloitte.no', 'deloitte.jp', 'deloitte.cn', 'deloitte.com.au', 'deloitte.ca', 'deloitte.com.br', 'deloitte.co.za', 'deloitte.ae', 'deloitte.sg', 'deloitte.co.in',
    'pwc.fr', 'pwc.de', 'pwc.co.uk', 'pwc.ch', 'pwc.be', 'pwc.nl', 'pwc.es', 'pwc.it', 'pwc.lu', 'pwc.at', 'pwc.ie', 'pwc.pt', 'pwc.pl', 'pwc.cz', 'pwc.hu', 'pwc.ro', 'pwc.bg', 'pwc.gr', 'pwc.se', 'pwc.dk', 'pwc.fi', 'pwc.no', 'pwc.jp', 'pwc.cn', 'pwc.com.au', 'pwc.ca', 'pwc.com.br', 'pwc.co.za', 'pwc.ae', 'pwc.sg', 'pwc.co.in',
    'ey.com', 'ey.fr', 'ey.de', 'ey.co.uk', 'ey.ch', 'ey.be', 'ey.nl', 'ey.es', 'ey.it', 'ey.lu', 'ey.at', 'ey.ie', 'ey.pt', 'ey.pl', 'ey.cz', 'ey.hu', 'ey.ro', 'ey.bg', 'ey.gr', 'ey.se', 'ey.dk', 'ey.fi', 'ey.no', 'ey.jp', 'ey.cn', 'ey.com.au', 'ey.ca', 'ey.com.br', 'ey.co.za', 'ey.ae', 'ey.sg', 'ey.co.in',
    'kpmg.fr', 'kpmg.de', 'kpmg.co.uk', 'kpmg.ch', 'kpmg.be', 'kpmg.nl', 'kpmg.es', 'kpmg.it', 'kpmg.lu', 'kpmg.at', 'kpmg.ie', 'kpmg.pt', 'kpmg.pl', 'kpmg.cz', 'kpmg.hu', 'kpmg.ro', 'kpmg.bg', 'kpmg.gr', 'kpmg.se', 'kpmg.dk', 'kpmg.fi', 'kpmg.no', 'kpmg.jp', 'kpmg.cn', 'kpmg.com.au', 'kpmg.ca', 'kpmg.com.br', 'kpmg.co.za', 'kpmg.ae', 'kpmg.sg', 'kpmg.co.in',
  ],

  // ============================================================================
  // ORGANISATIONS INTERNATIONALES
  // ============================================================================
  international: [
    'oecd.org',           // OCDE
    'imf.org',            // FMI
    'worldbank.org',      // Banque Mondiale
    'un.org',             // ONU
    'wto.org',            // OMC
    'unctad.org',         // CNUCED
    'taxfoundation.org',  // Tax Foundation
    'tax-news.com',
    'internationaltaxreview.com',
    'taxnotes.com',
    'ibfd.org',           // International Bureau of Fiscal Documentation
  ],

  // ============================================================================
  // EUROPE
  // ============================================================================
  
  // Union Européenne
  EU: [
    'europa.eu',
    'eur-lex.europa.eu',
    'ec.europa.eu',
    'taxation-customs.ec.europa.eu',
  ],

  // France
  FR: [
    'legifrance.gouv.fr',
    'impots.gouv.fr',
    'bofip.impots.gouv.fr',
    'economie.gouv.fr',
    'service-public.fr',
    'entreprises.gouv.fr',
    'urssaf.fr',
    'amf-france.org',
    'conseil-etat.fr',
    'ccomptes.fr',
  ],

  // Allemagne
  DE: [
    'bundesfinanzministerium.de',
    'bzst.de',
    'gesetze-im-internet.de',
    'bundesregierung.de',
    'destatis.de',
    'bundesbank.de',
    'bafin.de',
  ],

  // Royaume-Uni
  GB: [
    'gov.uk',
    'hmrc.gov.uk',
    'legislation.gov.uk',
    'bankofengland.co.uk',
    'fca.org.uk',
    'ons.gov.uk',
  ],

  // Italie
  IT: [
    'agenziaentrate.gov.it',
    'mef.gov.it',
    'gazzettaufficiale.it',
    'normattiva.it',
    'bancaditalia.it',
    'consob.it',
  ],

  // Espagne
  ES: [
    'agenciatributaria.es',
    'agenciatributaria.gob.es',
    'hacienda.gob.es',
    'boe.es',
    'seg-social.es',
    'bde.es',
  ],

  // Pays-Bas
  NL: [
    'belastingdienst.nl',
    'rijksoverheid.nl',
    'overheid.nl',
    'wetten.overheid.nl',
    'dnb.nl',
    'afm.nl',
  ],

  // Belgique
  BE: [
    'finances.belgium.be',
    'fisconetplus.be',
    'belgium.be',
    'ejustice.just.fgov.be',
    'nbb.be',
    'fsma.be',
  ],

  // Luxembourg
  LU: [
    'impotsdirects.public.lu',
    'acd.gouvernement.lu',
    'guichet.public.lu',
    'legilux.public.lu',
    'bcl.lu',
    'cssf.lu',
  ],

  // Suisse
  CH: [
    'estv.admin.ch',
    'admin.ch',
    'fedlex.admin.ch',
    'snb.ch',
    'finma.ch',
  ],

  // Autriche
  AT: [
    'bmf.gv.at',
    'ris.bka.gv.at',
    'oesterreich.gv.at',
    'oenb.at',
    'fma.gv.at',
  ],

  // Irlande
  IE: [
    'revenue.ie',
    'gov.ie',
    'irishstatutebook.ie',
    'centralbank.ie',
  ],

  // Portugal
  PT: [
    'portaldasfinancas.gov.pt',
    'at.gov.pt',
    'dre.pt',
    'bportugal.pt',
    'cmvm.pt',
  ],

  // Grèce
  GR: [
    'aade.gr',
    'gsis.gr',
    'minfin.gr',
    'et.gr',
    'bankofgreece.gr',
  ],

  // Pologne
  PL: [
    'podatki.gov.pl',
    'mf.gov.pl',
    'gov.pl',
    'sejm.gov.pl',
    'nbp.pl',
    'knf.gov.pl',
  ],

  // Suède
  SE: [
    'skatteverket.se',
    'government.se',
    'riksdagen.se',
    'riksbank.se',
    'fi.se',
  ],

  // Danemark
  DK: [
    'skat.dk',
    'retsinformation.dk',
    'fm.dk',
    'nationalbanken.dk',
    'finanstilsynet.dk',
  ],

  // Finlande
  FI: [
    'vero.fi',
    'finlex.fi',
    'vm.fi',
    'bof.fi',
    'finanssivalvonta.fi',
  ],

  // Norvège
  NO: [
    'skatteetaten.no',
    'regjeringen.no',
    'lovdata.no',
    'norges-bank.no',
    'finanstilsynet.no',
  ],

  // République Tchèque
  CZ: [
    'financnisprava.cz',
    'mfcr.cz',
    'zakonyprolidi.cz',
    'cnb.cz',
  ],

  // Hongrie
  HU: [
    'nav.gov.hu',
    'kormany.hu',
    'njt.hu',
    'mnb.hu',
  ],

  // Roumanie
  RO: [
    'anaf.ro',
    'mfinante.gov.ro',
    'legislatie.just.ro',
    'bnr.ro',
  ],

  // Bulgarie
  BG: [
    'nap.bg',
    'minfin.bg',
    'lex.bg',
    'bnb.bg',
  ],

  // Croatie
  HR: [
    'porezna-uprava.hr',
    'mfin.gov.hr',
    'zakon.hr',
    'hnb.hr',
  ],

  // Slovénie
  SI: [
    'fu.gov.si',
    'mf.gov.si',
    'pisrs.si',
    'bsi.si',
  ],

  // Slovaquie
  SK: [
    'financnasprava.sk',
    'mfsr.sk',
    'slov-lex.sk',
    'nbs.sk',
  ],

  // Estonie
  EE: [
    'emta.ee',
    'fin.ee',
    'riigiteataja.ee',
    'eestipank.ee',
  ],

  // Lettonie
  LV: [
    'vid.gov.lv',
    'fm.gov.lv',
    'likumi.lv',
    'bank.lv',
  ],

  // Lituanie
  LT: [
    'vmi.lt',
    'finmin.lrv.lt',
    'e-tar.lt',
    'lb.lt',
  ],

  // Chypre
  CY: [
    'mof.gov.cy',
    'tax.gov.cy',
    'cylaw.org',
    'centralbank.cy',
  ],

  // Malte
  MT: [
    'cfr.gov.mt',
    'mfin.gov.mt',
    'justiceservices.gov.mt',
    'centralbankmalta.org',
  ],

  // Islande
  IS: [
    'rsk.is',
    'government.is',
    'althingi.is',
    'cb.is',
  ],

  // Liechtenstein
  LI: [
    'stv.li',
    'regierung.li',
    'gesetze.li',
  ],

  // Monaco
  MC: [
    'gouv.mc',
    'service-public-entreprises.gouv.mc',
  ],

  // Andorre
  AD: [
    'govern.ad',
    'tributs.ad',
  ],

  // San Marino
  SM: [
    'gov.sm',
    'bcsm.sm',
  ],

  // ============================================================================
  // AMÉRIQUE DU NORD
  // ============================================================================

  // États-Unis
  US: [
    'irs.gov',
    'treasury.gov',
    'congress.gov',
    'law.cornell.edu',
    'gpo.gov',
    'sec.gov',
    'federalreserve.gov',
    'taxfoundation.org',
  ],

  // Canada
  CA: [
    'canada.ca',
    'cra-arc.gc.ca',
    'fin.gc.ca',
    'laws-lois.justice.gc.ca',
    'bankofcanada.ca',
    'osc.ca',
  ],

  // Mexique
  MX: [
    'sat.gob.mx',
    'shcp.gob.mx',
    'dof.gob.mx',
    'banxico.org.mx',
  ],

  // ============================================================================
  // AMÉRIQUE LATINE
  // ============================================================================

  // Brésil
  BR: [
    'receita.fazenda.gov.br',
    'gov.br',
    'planalto.gov.br',
    'bcb.gov.br',
    'cvm.gov.br',
  ],

  // Argentine
  AR: [
    'afip.gob.ar',
    'argentina.gob.ar',
    'infoleg.gob.ar',
    'bcra.gob.ar',
  ],

  // Chili
  CL: [
    'sii.cl',
    'hacienda.cl',
    'leychile.cl',
    'bcentral.cl',
  ],

  // Colombie
  CO: [
    'dian.gov.co',
    'minhacienda.gov.co',
    'suin-juriscol.gov.co',
    'banrep.gov.co',
  ],

  // Pérou
  PE: [
    'sunat.gob.pe',
    'mef.gob.pe',
    'leyes.congreso.gob.pe',
    'bcrp.gob.pe',
  ],

  // Venezuela
  VE: [
    'seniat.gob.ve',
    'bcv.org.ve',
  ],

  // Équateur
  EC: [
    'sri.gob.ec',
    'finanzas.gob.ec',
    'bce.fin.ec',
  ],

  // Uruguay
  UY: [
    'dgi.gub.uy',
    'mef.gub.uy',
    'bcu.gub.uy',
  ],

  // Paraguay
  PY: [
    'set.gov.py',
    'hacienda.gov.py',
    'bcp.gov.py',
  ],

  // Bolivie
  BO: [
    'impuestos.gob.bo',
    'economiayfinanzas.gob.bo',
    'bcb.gob.bo',
  ],

  // Panama
  PA: [
    'dgi.gob.pa',
    'mef.gob.pa',
    'superbancos.gob.pa',
  ],

  // Costa Rica
  CR: [
    'hacienda.go.cr',
    'pgrweb.go.cr',
    'bccr.fi.cr',
  ],

  // ============================================================================
  // ASIE-PACIFIQUE
  // ============================================================================

  // Chine
  CN: [
    'chinatax.gov.cn',
    'mof.gov.cn',
    'pbc.gov.cn',
    'csrc.gov.cn',
  ],

  // Japon
  JP: [
    'nta.go.jp',
    'mof.go.jp',
    'e-gov.go.jp',
    'boj.or.jp',
    'fsa.go.jp',
  ],

  // Corée du Sud
  KR: [
    'nts.go.kr',
    'moef.go.kr',
    'law.go.kr',
    'bok.or.kr',
    'fss.or.kr',
  ],

  // Inde
  IN: [
    'incometaxindia.gov.in',
    'gst.gov.in',
    'finmin.nic.in',
    'indiacode.nic.in',
    'rbi.org.in',
    'sebi.gov.in',
  ],

  // Australie
  AU: [
    'ato.gov.au',
    'treasury.gov.au',
    'legislation.gov.au',
    'rba.gov.au',
    'asic.gov.au',
  ],

  // Nouvelle-Zélande
  NZ: [
    'ird.govt.nz',
    'treasury.govt.nz',
    'legislation.govt.nz',
    'rbnz.govt.nz',
  ],

  // Singapour
  SG: [
    'iras.gov.sg',
    'mof.gov.sg',
    'sso.agc.gov.sg',
    'mas.gov.sg',
  ],

  // Hong Kong
  HK: [
    'ird.gov.hk',
    'fstb.gov.hk',
    'elegislation.gov.hk',
    'hkma.gov.hk',
  ],

  // Taïwan
  TW: [
    'mof.gov.tw',
    'ntbt.gov.tw',
    'law.moj.gov.tw',
    'cbc.gov.tw',
  ],

  // Malaisie
  MY: [
    'hasil.gov.my',
    'treasury.gov.my',
    'bnm.gov.my',
    'sc.com.my',
  ],

  // Thaïlande
  TH: [
    'rd.go.th',
    'mof.go.th',
    'bot.or.th',
    'sec.or.th',
  ],

  // Indonésie
  ID: [
    'pajak.go.id',
    'kemenkeu.go.id',
    'bi.go.id',
    'ojk.go.id',
  ],

  // Philippines
  PH: [
    'bir.gov.ph',
    'dof.gov.ph',
    'bsp.gov.ph',
    'sec.gov.ph',
  ],

  // Vietnam
  VN: [
    'gdt.gov.vn',
    'mof.gov.vn',
    'sbv.gov.vn',
  ],

  // Pakistan
  PK: [
    'fbr.gov.pk',
    'finance.gov.pk',
    'sbp.org.pk',
  ],

  // Bangladesh
  BD: [
    'nbr.gov.bd',
    'mof.gov.bd',
    'bb.org.bd',
  ],

  // Sri Lanka
  LK: [
    'ird.gov.lk',
    'treasury.gov.lk',
    'cbsl.gov.lk',
  ],

  // ============================================================================
  // MOYEN-ORIENT
  // ============================================================================

  // Émirats Arabes Unis
  AE: [
    'tax.gov.ae',
    'mof.gov.ae',
    'centralbank.ae',
    'sca.gov.ae',
  ],

  // Arabie Saoudite
  SA: [
    'zatca.gov.sa',
    'mof.gov.sa',
    'sama.gov.sa',
    'cma.org.sa',
  ],

  // Qatar
  QA: [
    'gta.gov.qa',
    'mof.gov.qa',
    'qcb.gov.qa',
  ],

  // Koweït
  KW: [
    'mof.gov.kw',
    'cbk.gov.kw',
  ],

  // Bahreïn
  BH: [
    'nbr.gov.bh',
    'mofne.gov.bh',
    'cbb.gov.bh',
  ],

  // Oman
  OM: [
    'taxoman.gov.om',
    'mof.gov.om',
    'cbo.gov.om',
  ],

  // Israël
  IL: [
    'taxes.gov.il',
    'mof.gov.il',
    'boi.org.il',
    'isa.gov.il',
  ],

  // Turquie
  TR: [
    'gib.gov.tr',
    'hmb.gov.tr',
    'mevzuat.gov.tr',
    'tcmb.gov.tr',
    'spk.gov.tr',
  ],

  // Jordanie
  JO: [
    'istd.gov.jo',
    'mof.gov.jo',
    'cbj.gov.jo',
  ],

  // Liban
  LB: [
    'finance.gov.lb',
    'bdl.gov.lb',
  ],

  // Égypte
  EG: [
    'eta.gov.eg',
    'mof.gov.eg',
    'cbe.org.eg',
  ],

  // ============================================================================
  // AFRIQUE
  // ============================================================================

  // Afrique du Sud
  ZA: [
    'sars.gov.za',
    'treasury.gov.za',
    'resbank.co.za',
    'fsca.co.za',
  ],

  // Nigeria
  NG: [
    'firs.gov.ng',
    'finance.gov.ng',
    'cbn.gov.ng',
  ],

  // Kenya
  KE: [
    'kra.go.ke',
    'treasury.go.ke',
    'centralbank.go.ke',
  ],

  // Ghana
  GH: [
    'gra.gov.gh',
    'mofep.gov.gh',
    'bog.gov.gh',
  ],

  // Maroc
  MA: [
    'tax.gov.ma',
    'finances.gov.ma',
    'bkam.ma',
    'ammc.ma',
  ],

  // Tunisie
  TN: [
    'finances.gov.tn',
    'bct.gov.tn',
  ],

  // Algérie
  DZ: [
    'mf.gov.dz',
    'mfdgi.gov.dz',
    'bank-of-algeria.dz',
  ],

  // Côte d'Ivoire
  CI: [
    'dgi.gouv.ci',
    'finances.gouv.ci',
    'bceao.int',
  ],

  // Sénégal
  SN: [
    'dgid.sn',
    'finances.gouv.sn',
    'bceao.int',
  ],

  // Maurice
  MU: [
    'mra.mu',
    'mof.govmu.org',
    'bom.mu',
  ],

  // Rwanda
  RW: [
    'rra.gov.rw',
    'minecofin.gov.rw',
    'bnr.rw',
  ],

  // Tanzanie
  TZ: [
    'tra.go.tz',
    'mof.go.tz',
    'bot.go.tz',
  ],

  // Ouganda
  UG: [
    'ura.go.ug',
    'finance.go.ug',
    'bou.or.ug',
  ],

  // Éthiopie
  ET: [
    'mor.gov.et',
    'mofed.gov.et',
    'nbe.gov.et',
  ],

  // ============================================================================
  // SOURCES FISCALES SPÉCIALISÉES (toujours autorisées)
  // ============================================================================
  specialized: [
    // Cabinets et experts
    'bdo.com',
    'bdo.fr',
    'bdo.global',
    'grantthornton.com',
    'grantthornton.fr',
    'mazars.com',
    'mazars.fr',
    'rsm.global',
    'bakertilly.com',
    'crowe.com',
    
    // Publications fiscales
    'lexisnexis.com',
    'lexisnexis.fr',
    'dalloz.fr',
    'editions-francis-lefebvre.fr',
    'efl.fr',
    'lamy.fr',
    'wolterskluwer.com',
    'wolterskluwer.fr',
    'tax-news.com',
    'taxnotes.com',
    'bloombergtax.com',
    'taxanalysts.org',
    
    // Ressources juridiques
    'legifrance.gouv.fr',
    'law.cornell.edu',
    'westlaw.com',
    'caselaw.findlaw.com',
    
    // Académiques
    'ssrn.com',
    'jstor.org',
    'hec.edu',
    'essec.edu',
    'dauphine.psl.eu',
  ],
};

// Flatten all domains into a single Set for fast lookup
export const ALL_ALLOWED_DOMAINS = new Set([
  ...WHITELIST.bigFour,
  ...WHITELIST.international,
  ...WHITELIST.specialized,
  ...Object.entries(WHITELIST)
    .filter(([key]) => !['bigFour', 'international', 'specialized'].includes(key))
    .flatMap(([, domains]) => domains)
]);

/**
 * Check if a URL is from an allowed domain
 */
export function isAllowedDomain(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    
    // Check exact match
    if (ALL_ALLOWED_DOMAINS.has(hostname)) return true;
    
    // Check if subdomain of allowed domain
    for (const domain of ALL_ALLOWED_DOMAINS) {
      if (hostname.endsWith('.' + domain) || hostname === domain) {
        return true;
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Filter search results to only allowed domains
 */
export function filterResults(results) {
  return results.filter(r => isAllowedDomain(r.url));
}

/**
 * Get country-specific domains
 */
export function getCountryDomains(countryCode) {
  const code = countryCode.toUpperCase();
  return WHITELIST[code] || [];
}

export default WHITELIST;
