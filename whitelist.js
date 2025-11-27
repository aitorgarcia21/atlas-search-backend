/**
 * WHITELIST FISCALE MONDIALE COMPLÈTE
 * 195 pays + Big Four + Organisations internationales
 * ~800+ domaines autorisés
 */

export const WHITELIST = {
  // ============================================================================
  // BIG FOUR - GLOBAL (tous domaines régionaux)
  // ============================================================================
  bigFour: [
    // Deloitte
    'deloitte.com', 'deloitte.fr', 'deloitte.de', 'deloitte.co.uk', 'deloitte.ch', 'deloitte.be', 
    'deloitte.nl', 'deloitte.es', 'deloitte.it', 'deloitte.lu', 'deloitte.at', 'deloitte.ie', 
    'deloitte.pt', 'deloitte.pl', 'deloitte.cz', 'deloitte.hu', 'deloitte.ro', 'deloitte.bg', 
    'deloitte.gr', 'deloitte.se', 'deloitte.dk', 'deloitte.fi', 'deloitte.no', 'deloitte.jp', 
    'deloitte.cn', 'deloitte.com.au', 'deloitte.ca', 'deloitte.com.br', 'deloitte.co.za', 
    'deloitte.ae', 'deloitte.sg', 'deloitte.co.in', 'deloitte.com.hk', 'deloitte.co.nz',
    'deloitte.com.mx', 'deloitte.com.ar', 'deloitte.cl', 'deloitte.com.co', 'deloitte.com.pe',
    'deloitte.ru', 'deloitte.ua', 'deloitte.kz', 'deloitte.com.tr', 'deloitte.co.il',
    'deloitte.com.sa', 'deloitte.com.qa', 'deloitte.com.kw', 'deloitte.com.bh', 'deloitte.com.om',
    'deloitte.co.ke', 'deloitte.com.ng', 'deloitte.co.tz', 'deloitte.com.gh', 'deloitte.com.eg',
    'deloitte.com.my', 'deloitte.co.th', 'deloitte.co.id', 'deloitte.com.ph', 'deloitte.com.vn',
    'deloitte.com.tw', 'deloitte.co.kr', 'deloitte.com.pk', 'deloitte.com.bd',
    'blog.avocats.deloitte.fr',
    
    // PwC
    'pwc.com', 'pwc.fr', 'pwc.de', 'pwc.co.uk', 'pwc.ch', 'pwc.be', 'pwc.nl', 'pwc.es', 
    'pwc.it', 'pwc.lu', 'pwc.at', 'pwc.ie', 'pwc.pt', 'pwc.pl', 'pwc.cz', 'pwc.hu', 
    'pwc.ro', 'pwc.bg', 'pwc.gr', 'pwc.se', 'pwc.dk', 'pwc.fi', 'pwc.no', 'pwc.jp', 
    'pwc.cn', 'pwc.com.au', 'pwc.ca', 'pwc.com.br', 'pwc.co.za', 'pwc.ae', 'pwc.sg', 
    'pwc.co.in', 'pwc.com.hk', 'pwc.co.nz', 'pwc.com.mx', 'pwc.com.ar', 'pwc.cl',
    'pwc.com.co', 'pwc.com.pe', 'pwc.ru', 'pwc.ua', 'pwc.kz', 'pwc.com.tr', 'pwc.co.il',
    'pwc.com.sa', 'pwc.com.qa', 'pwc.com.kw', 'pwc.com.bh', 'pwc.com.om',
    'pwc.co.ke', 'pwc.com.ng', 'pwc.co.tz', 'pwc.com.gh', 'pwc.com.eg',
    'pwc.com.my', 'pwc.co.th', 'pwc.co.id', 'pwc.com.ph', 'pwc.com.vn',
    'pwc.com.tw', 'pwc.co.kr', 'pwc.com.pk', 'pwc.com.bd',
    'taxsummaries.pwc.com',
    
    // EY
    'ey.com', 'ey.fr', 'ey.de', 'ey.co.uk', 'ey.ch', 'ey.be', 'ey.nl', 'ey.es', 
    'ey.it', 'ey.lu', 'ey.at', 'ey.ie', 'ey.pt', 'ey.pl', 'ey.cz', 'ey.hu', 
    'ey.ro', 'ey.bg', 'ey.gr', 'ey.se', 'ey.dk', 'ey.fi', 'ey.no', 'ey.jp', 
    'ey.cn', 'ey.com.au', 'ey.ca', 'ey.com.br', 'ey.co.za', 'ey.ae', 'ey.sg', 
    'ey.co.in', 'ey.com.hk', 'ey.co.nz', 'ey.com.mx', 'ey.com.ar', 'ey.cl',
    'ey.com.co', 'ey.com.pe', 'ey.ru', 'ey.ua', 'ey.kz', 'ey.com.tr', 'ey.co.il',
    'ey.com.sa', 'ey.com.qa', 'ey.com.kw', 'ey.com.bh', 'ey.com.om',
    'ey.co.ke', 'ey.com.ng', 'ey.co.tz', 'ey.com.gh', 'ey.com.eg',
    'ey.com.my', 'ey.co.th', 'ey.co.id', 'ey.com.ph', 'ey.com.vn',
    'ey.com.tw', 'ey.co.kr', 'ey.com.pk', 'ey.com.bd',
    
    // KPMG
    'kpmg.com', 'kpmg.fr', 'kpmg.de', 'kpmg.co.uk', 'kpmg.ch', 'kpmg.be', 'kpmg.nl', 
    'kpmg.es', 'kpmg.it', 'kpmg.lu', 'kpmg.at', 'kpmg.ie', 'kpmg.pt', 'kpmg.pl', 
    'kpmg.cz', 'kpmg.hu', 'kpmg.ro', 'kpmg.bg', 'kpmg.gr', 'kpmg.se', 'kpmg.dk', 
    'kpmg.fi', 'kpmg.no', 'kpmg.jp', 'kpmg.cn', 'kpmg.com.au', 'kpmg.ca', 
    'kpmg.com.br', 'kpmg.co.za', 'kpmg.ae', 'kpmg.sg', 'kpmg.co.in', 'kpmg.com.hk',
    'kpmg.co.nz', 'kpmg.com.mx', 'kpmg.com.ar', 'kpmg.cl', 'kpmg.com.co', 'kpmg.com.pe',
    'kpmg.ru', 'kpmg.ua', 'kpmg.kz', 'kpmg.com.tr', 'kpmg.co.il',
    'kpmg.com.sa', 'kpmg.com.qa', 'kpmg.com.kw', 'kpmg.com.bh', 'kpmg.com.om',
    'kpmg.co.ke', 'kpmg.com.ng', 'kpmg.co.tz', 'kpmg.com.gh', 'kpmg.com.eg',
    'kpmg.com.my', 'kpmg.co.th', 'kpmg.co.id', 'kpmg.com.ph', 'kpmg.com.vn',
    'kpmg.com.tw', 'kpmg.co.kr', 'kpmg.com.pk', 'kpmg.com.bd',
  ],

  // ============================================================================
  // ORGANISATIONS INTERNATIONALES
  // ============================================================================
  international: [
    'oecd.org', 'imf.org', 'worldbank.org', 'un.org', 'wto.org', 'unctad.org',
    'taxfoundation.org', 'tax-news.com', 'internationaltaxreview.com', 'taxnotes.com',
    'ibfd.org', 'tax-platform.org', 'taxjustice.net', 'globaltaxation.org',
  ],

  // ============================================================================
  // UNION EUROPÉENNE
  // ============================================================================
  EU: [
    'europa.eu', 'eur-lex.europa.eu', 'ec.europa.eu', 'taxation-customs.ec.europa.eu',
  ],

  // ============================================================================
  // EUROPE OCCIDENTALE
  // ============================================================================
  
  // France
  france: [
    'legifrance.gouv.fr', 'impots.gouv.fr', 'bofip.impots.gouv.fr', 'economie.gouv.fr',
    'service-public.fr', 'tresor.economie.gouv.fr', 'budget.gouv.fr', 'urssaf.fr',
    'entreprises.gouv.fr', 'douane.gouv.fr', 'ccomptes.fr', 'conseil-etat.fr',
    'legalnews.fr', 'fiscalonline.com', 'editions-francis-lefebvre.fr',
  ],
  
  // Allemagne
  germany: [
    'bundesfinanzministerium.de', 'bzst.de', 'gesetze-im-internet.de', 'bundesregierung.de',
    'destatis.de', 'zoll.de', 'bundesbank.de', 'bafa.de', 'ihk.de',
  ],
  
  // Royaume-Uni
  uk: [
    'gov.uk', 'hmrc.gov.uk', 'legislation.gov.uk', 'ons.gov.uk', 'bankofengland.co.uk',
    'fca.org.uk', 'companieshouse.gov.uk', 'judiciary.uk',
  ],
  
  // Italie
  italy: [
    'agenziaentrate.gov.it', 'mef.gov.it', 'gazzettaufficiale.it', 'normattiva.it',
    'dt.mef.gov.it', 'rgs.mef.gov.it', 'corteconti.it',
  ],
  
  // Espagne
  spain: [
    'agenciatributaria.es', 'agenciatributaria.gob.es', 'boe.es', 'hacienda.gob.es',
    'minhap.gob.es', 'seg-social.es', 'poderjudicial.es',
  ],
  
  // Pays-Bas
  netherlands: [
    'belastingdienst.nl', 'rijksoverheid.nl', 'overheid.nl', 'wetten.overheid.nl',
    'rechtspraak.nl', 'dnb.nl', 'kvk.nl',
  ],
  
  // Belgique
  belgium: [
    'finances.belgium.be', 'fisconetplus.be', 'ejustice.just.fgov.be', 'nbb.be',
    'socialsecurity.be', 'belgium.be', 'just.fgov.be',
  ],
  
  // Suisse
  switzerland: [
    'admin.ch', 'estv.admin.ch', 'fedlex.admin.ch', 'bfs.admin.ch', 'snb.ch',
    'finma.ch', 'seco.admin.ch',
  ],
  
  // Luxembourg
  luxembourg: [
    'impotsdirects.public.lu', 'guichet.public.lu', 'legilux.public.lu', 'gouvernement.lu',
    'aed.public.lu', 'cssf.lu', 'bcl.lu',
  ],
  
  // Autriche
  austria: [
    'bmf.gv.at', 'ris.bka.gv.at', 'finanz.at', 'oesterreich.gv.at', 'oenb.at',
    'wko.at', 'statistik.at',
  ],
  
  // Portugal
  portugal: [
    'portaldasfinancas.gov.pt', 'dre.pt', 'portugal.gov.pt', 'seg-social.pt',
    'bportugal.pt', 'dgae.gov.pt',
  ],
  
  // Irlande
  ireland: [
    'revenue.ie', 'irishstatutebook.ie', 'gov.ie', 'centralbank.ie', 'cro.ie',
  ],
  
  // Grèce
  greece: [
    'aade.gr', 'gsis.gr', 'minfin.gr', 'et.gr', 'bankofgreece.gr',
  ],

  // ============================================================================
  // EUROPE DU NORD
  // ============================================================================
  
  // Suède
  sweden: [
    'skatteverket.se', 'riksdagen.se', 'regeringen.se', 'scb.se', 'riksbank.se',
  ],
  
  // Danemark
  denmark: [
    'skat.dk', 'retsinformation.dk', 'stm.dk', 'dst.dk', 'nationalbanken.dk',
  ],
  
  // Norvège
  norway: [
    'skatteetaten.no', 'lovdata.no', 'regjeringen.no', 'ssb.no', 'norges-bank.no',
  ],
  
  // Finlande
  finland: [
    'vero.fi', 'finlex.fi', 'valtioneuvosto.fi', 'stat.fi', 'suomenpankki.fi',
  ],
  
  // Islande
  iceland: [
    'rsk.is', 'althingi.is', 'government.is', 'sedlabanki.is',
  ],

  // ============================================================================
  // EUROPE DE L'EST
  // ============================================================================
  
  // Pologne
  poland: [
    'podatki.gov.pl', 'mf.gov.pl', 'sejm.gov.pl', 'isap.sejm.gov.pl', 'nbp.pl',
  ],
  
  // République Tchèque
  czechia: [
    'financnisprava.cz', 'mfcr.cz', 'psp.cz', 'cnb.cz', 'czso.cz',
  ],
  
  // Hongrie
  hungary: [
    'nav.gov.hu', 'kormany.hu', 'njt.hu', 'mnb.hu', 'ksh.hu',
  ],
  
  // Roumanie
  romania: [
    'anaf.ro', 'mfinante.gov.ro', 'cdep.ro', 'bnr.ro', 'insse.ro',
  ],
  
  // Bulgarie
  bulgaria: [
    'nap.bg', 'minfin.bg', 'parliament.bg', 'bnb.bg', 'nsi.bg',
  ],
  
  // Croatie
  croatia: [
    'porezna-uprava.hr', 'mfin.gov.hr', 'sabor.hr', 'hnb.hr', 'dzs.hr',
  ],
  
  // Slovénie
  slovenia: [
    'fu.gov.si', 'mf.gov.si', 'dz-rs.si', 'bsi.si', 'stat.si',
  ],
  
  // Slovaquie
  slovakia: [
    'financnasprava.sk', 'mfsr.sk', 'nrsr.sk', 'nbs.sk', 'statistics.sk',
  ],
  
  // Estonie
  estonia: [
    'emta.ee', 'fin.ee', 'riigikogu.ee', 'eestipank.ee', 'stat.ee',
  ],
  
  // Lettonie
  latvia: [
    'vid.gov.lv', 'fm.gov.lv', 'saeima.lv', 'bank.lv', 'csb.gov.lv',
  ],
  
  // Lituanie
  lithuania: [
    'vmi.lt', 'finmin.lrv.lt', 'lrs.lt', 'lb.lt', 'stat.gov.lt',
  ],
  
  // Ukraine
  ukraine: [
    'tax.gov.ua', 'mof.gov.ua', 'rada.gov.ua', 'bank.gov.ua', 'ukrstat.gov.ua',
  ],
  
  // Russie
  russia: [
    'nalog.gov.ru', 'minfin.gov.ru', 'duma.gov.ru', 'cbr.ru', 'gks.ru',
  ],
  
  // Biélorussie
  belarus: [
    'nalog.gov.by', 'minfin.gov.by', 'house.gov.by', 'nbrb.by',
  ],
  
  // Moldavie
  moldova: [
    'fisc.md', 'mf.gov.md', 'parlament.md', 'bnm.md',
  ],

  // ============================================================================
  // ASIE - PACIFIQUE
  // ============================================================================
  
  // Chine
  china: [
    'chinatax.gov.cn', 'mof.gov.cn', 'npc.gov.cn', 'pbc.gov.cn', 'stats.gov.cn',
    'safe.gov.cn', 'customs.gov.cn',
  ],
  
  // Japon
  japan: [
    'nta.go.jp', 'mof.go.jp', 'shugiin.go.jp', 'boj.or.jp', 'stat.go.jp',
  ],
  
  // Corée du Sud
  southKorea: [
    'nts.go.kr', 'moef.go.kr', 'assembly.go.kr', 'bok.or.kr', 'kostat.go.kr',
  ],
  
  // Inde
  india: [
    'incometaxindia.gov.in', 'finmin.nic.in', 'india.gov.in', 'rbi.org.in',
    'cbic.gov.in', 'gst.gov.in', 'mospi.gov.in',
  ],
  
  // Singapour
  singapore: [
    'iras.gov.sg', 'mof.gov.sg', 'parliament.gov.sg', 'mas.gov.sg', 'singstat.gov.sg',
    'acra.gov.sg', 'customs.gov.sg',
  ],
  
  // Hong Kong
  hongKong: [
    'ird.gov.hk', 'gov.hk', 'legco.gov.hk', 'hkma.gov.hk', 'censtatd.gov.hk',
    'cr.gov.hk', 'customs.gov.hk',
  ],
  
  // Taïwan
  taiwan: [
    'tax.nat.gov.tw', 'mof.gov.tw', 'ly.gov.tw', 'cbc.gov.tw', 'stat.gov.tw',
  ],
  
  // Malaisie
  malaysia: [
    'hasil.gov.my', 'treasury.gov.my', 'parlimen.gov.my', 'bnm.gov.my', 'dosm.gov.my',
    'ssm.com.my', 'customs.gov.my',
  ],
  
  // Thaïlande
  thailand: [
    'rd.go.th', 'mof.go.th', 'parliament.go.th', 'bot.or.th', 'nso.go.th',
    'customs.go.th',
  ],
  
  // Indonésie
  indonesia: [
    'pajak.go.id', 'kemenkeu.go.id', 'dpr.go.id', 'bi.go.id', 'bps.go.id',
    'beacukai.go.id',
  ],
  
  // Vietnam
  vietnam: [
    'gdt.gov.vn', 'mof.gov.vn', 'quochoi.vn', 'sbv.gov.vn', 'gso.gov.vn',
    'customs.gov.vn',
  ],
  
  // Philippines
  philippines: [
    'bir.gov.ph', 'dof.gov.ph', 'congress.gov.ph', 'bsp.gov.ph', 'psa.gov.ph',
  ],
  
  // Pakistan
  pakistan: [
    'fbr.gov.pk', 'finance.gov.pk', 'na.gov.pk', 'sbp.org.pk', 'pbs.gov.pk',
  ],
  
  // Bangladesh
  bangladesh: [
    'nbr.gov.bd', 'mof.gov.bd', 'parliament.gov.bd', 'bb.org.bd', 'bbs.gov.bd',
  ],
  
  // Sri Lanka
  sriLanka: [
    'ird.gov.lk', 'treasury.gov.lk', 'parliament.lk', 'cbsl.gov.lk',
  ],
  
  // Australie
  australia: [
    'ato.gov.au', 'treasury.gov.au', 'aph.gov.au', 'rba.gov.au', 'abs.gov.au',
    'asic.gov.au', 'abf.gov.au',
  ],
  
  // Nouvelle-Zélande
  newZealand: [
    'ird.govt.nz', 'treasury.govt.nz', 'parliament.nz', 'rbnz.govt.nz', 'stats.govt.nz',
  ],

  // ============================================================================
  // MOYEN-ORIENT
  // ============================================================================
  
  // Émirats Arabes Unis
  uae: [
    'tax.gov.ae', 'mof.gov.ae', 'government.ae', 'centralbank.ae', 'fcsc.gov.ae',
    'economy.gov.ae', 'customs.gov.ae',
  ],
  
  // Arabie Saoudite
  saudiArabia: [
    'zatca.gov.sa', 'mof.gov.sa', 'shura.gov.sa', 'sama.gov.sa', 'stats.gov.sa',
    'gazt.gov.sa',
  ],
  
  // Qatar
  qatar: [
    'gta.gov.qa', 'mof.gov.qa', 'shura.gov.qa', 'qcb.gov.qa', 'psa.gov.qa',
  ],
  
  // Koweït
  kuwait: [
    'mof.gov.kw', 'kna.kw', 'cbk.gov.kw', 'csb.gov.kw',
  ],
  
  // Bahreïn
  bahrain: [
    'nbr.gov.bh', 'mof.gov.bh', 'nuwab.bh', 'cbb.gov.bh',
  ],
  
  // Oman
  oman: [
    'taxoman.gov.om', 'mof.gov.om', 'majlesalshura.gov.om', 'cbo.gov.om',
  ],
  
  // Israël
  israel: [
    'taxes.gov.il', 'mof.gov.il', 'knesset.gov.il', 'boi.org.il', 'cbs.gov.il',
  ],
  
  // Turquie
  turkey: [
    'gib.gov.tr', 'hmb.gov.tr', 'tbmm.gov.tr', 'tcmb.gov.tr', 'tuik.gov.tr',
  ],
  
  // Jordanie
  jordan: [
    'istd.gov.jo', 'mof.gov.jo', 'parliament.jo', 'cbj.gov.jo', 'dos.gov.jo',
  ],
  
  // Liban
  lebanon: [
    'finance.gov.lb', 'lp.gov.lb', 'bdl.gov.lb', 'cas.gov.lb',
  ],
  
  // Égypte
  egypt: [
    'eta.gov.eg', 'mof.gov.eg', 'parliament.gov.eg', 'cbe.org.eg', 'capmas.gov.eg',
  ],

  // ============================================================================
  // AFRIQUE
  // ============================================================================
  
  // Afrique du Sud
  southAfrica: [
    'sars.gov.za', 'treasury.gov.za', 'parliament.gov.za', 'resbank.co.za', 'statssa.gov.za',
  ],
  
  // Nigéria
  nigeria: [
    'firs.gov.ng', 'finance.gov.ng', 'nassnig.org', 'cbn.gov.ng', 'nigerianstat.gov.ng',
  ],
  
  // Kenya
  kenya: [
    'kra.go.ke', 'treasury.go.ke', 'parliament.go.ke', 'centralbank.go.ke', 'knbs.or.ke',
  ],
  
  // Ghana
  ghana: [
    'gra.gov.gh', 'mofep.gov.gh', 'parliament.gh', 'bog.gov.gh', 'statsghana.gov.gh',
  ],
  
  // Tanzanie
  tanzania: [
    'tra.go.tz', 'treasury.go.tz', 'parliament.go.tz', 'bot.go.tz', 'nbs.go.tz',
  ],
  
  // Ouganda
  uganda: [
    'ura.go.ug', 'finance.go.ug', 'parliament.go.ug', 'bou.or.ug', 'ubos.org',
  ],
  
  // Éthiopie
  ethiopia: [
    'mor.gov.et', 'mofed.gov.et', 'hopr.gov.et', 'nbe.gov.et', 'csa.gov.et',
  ],
  
  // Maroc
  morocco: [
    'tax.gov.ma', 'finances.gov.ma', 'parlement.ma', 'bkam.ma', 'hcp.ma',
  ],
  
  // Tunisie
  tunisia: [
    'finances.gov.tn', 'arp.tn', 'bct.gov.tn', 'ins.tn',
  ],
  
  // Algérie
  algeria: [
    'mf.gov.dz', 'apn.dz', 'bank-of-algeria.dz', 'ons.dz',
  ],
  
  // Côte d'Ivoire
  ivoryCoast: [
    'dgi.gouv.ci', 'finances.gouv.ci', 'assnat.ci', 'bceao.int',
  ],
  
  // Sénégal
  senegal: [
    'dgid.sn', 'finances.gouv.sn', 'assemblee-nationale.sn', 'bceao.int',
  ],
  
  // Cameroun
  cameroon: [
    'impots.cm', 'minfi.gov.cm', 'assnat.cm', 'beac.int',
  ],
  
  // Maurice
  mauritius: [
    'mra.mu', 'mof.govmu.org', 'mauritiusassembly.govmu.org', 'bom.mu',
  ],

  // ============================================================================
  // AMÉRIQUES
  // ============================================================================
  
  // États-Unis
  usa: [
    'irs.gov', 'treasury.gov', 'congress.gov', 'federalreserve.gov', 'bls.gov',
    'sec.gov', 'cbp.gov', 'ustaxcourt.gov',
  ],
  
  // Canada
  canada: [
    'canada.ca', 'cra-arc.gc.ca', 'fin.gc.ca', 'parl.ca', 'bankofcanada.ca', 'statcan.gc.ca',
  ],
  
  // Mexique
  mexico: [
    'sat.gob.mx', 'shcp.gob.mx', 'diputados.gob.mx', 'banxico.org.mx', 'inegi.org.mx',
  ],
  
  // Brésil
  brazil: [
    'receita.fazenda.gov.br', 'gov.br', 'camara.leg.br', 'bcb.gov.br', 'ibge.gov.br',
  ],
  
  // Argentine
  argentina: [
    'afip.gob.ar', 'mecon.gob.ar', 'hcdn.gob.ar', 'bcra.gob.ar', 'indec.gob.ar',
  ],
  
  // Chili
  chile: [
    'sii.cl', 'hacienda.cl', 'camara.cl', 'bcentral.cl', 'ine.cl',
  ],
  
  // Colombie
  colombia: [
    'dian.gov.co', 'minhacienda.gov.co', 'camara.gov.co', 'banrep.gov.co', 'dane.gov.co',
  ],
  
  // Pérou
  peru: [
    'sunat.gob.pe', 'mef.gob.pe', 'congreso.gob.pe', 'bcrp.gob.pe', 'inei.gob.pe',
  ],
  
  // Venezuela
  venezuela: [
    'seniat.gob.ve', 'mppef.gob.ve', 'asambleanacional.gob.ve', 'bcv.org.ve',
  ],
  
  // Équateur
  ecuador: [
    'sri.gob.ec', 'finanzas.gob.ec', 'asambleanacional.gob.ec', 'bce.fin.ec',
  ],
  
  // Uruguay
  uruguay: [
    'dgi.gub.uy', 'mef.gub.uy', 'parlamento.gub.uy', 'bcu.gub.uy', 'ine.gub.uy',
  ],
  
  // Paraguay
  paraguay: [
    'set.gov.py', 'hacienda.gov.py', 'congreso.gov.py', 'bcp.gov.py',
  ],
  
  // Bolivie
  bolivia: [
    'impuestos.gob.bo', 'economiayfinanzas.gob.bo', 'diputados.bo', 'bcb.gob.bo',
  ],
  
  // Panama
  panama: [
    'dgi.gob.pa', 'mef.gob.pa', 'asamblea.gob.pa', 'superbancos.gob.pa',
  ],
  
  // Costa Rica
  costaRica: [
    'hacienda.go.cr', 'asamblea.go.cr', 'bccr.fi.cr',
  ],

  // ============================================================================
  // PARADIS FISCAUX / CENTRES FINANCIERS OFFSHORE
  // ============================================================================
  offshore: [
    // Îles Caïmans
    'gov.ky', 'ditc.ky', 'cima.ky',
    // Bermudes
    'gov.bm', 'bma.bm',
    // Îles Vierges Britanniques
    'bvi.gov.vg', 'bvifsc.vg',
    // Jersey
    'gov.je', 'jerseyfsc.org',
    // Guernesey
    'gov.gg', 'gfsc.gg',
    // Île de Man
    'gov.im', 'iomfsa.im',
    // Gibraltar
    'gibraltar.gov.gi', 'fsc.gi',
    // Liechtenstein
    'llv.li', 'fma-li.li',
    // Monaco
    'gouv.mc', 'ccaf.mc',
    // Andorre
    'govern.ad', 'afa.ad',
    // Saint-Marin
    'gov.sm', 'bcsm.sm',
    // Malte
    'cfr.gov.mt', 'mfsa.mt', 'gov.mt',
    // Chypre
    'mof.gov.cy', 'cysec.gov.cy', 'centralbank.cy',
    // Seychelles
    'src.gov.sc', 'fsaseychelles.sc',
    // Maurice (déjà inclus)
    // Bahamas
    'bahamas.gov.bs', 'centralbankbahamas.com',
    // Barbade
    'barbadosparliament.com', 'centralbank.org.bb',
    // Curaçao
    'gobiernu.cw', 'centralbank.cw',
    // Aruba
    'gobierno.aw', 'cbaruba.org',
  ],

  // ============================================================================
  // ASIE CENTRALE
  // ============================================================================
  centralAsia: [
    // Kazakhstan
    'kgd.gov.kz', 'minfin.gov.kz', 'parlam.kz', 'nationalbank.kz', 'stat.gov.kz',
    // Ouzbékistan
    'soliq.uz', 'mf.uz', 'parliament.gov.uz', 'cbu.uz',
    // Azerbaïdjan
    'taxes.gov.az', 'maliyye.gov.az', 'meclis.gov.az', 'cbar.az',
    // Géorgie
    'rs.ge', 'mof.ge', 'parliament.ge', 'nbg.gov.ge',
    // Arménie
    'petekamutner.am', 'minfin.am', 'parliament.am', 'cba.am',
    // Turkménistan
    'minfin.gov.tm',
    // Kirghizistan
    'sti.gov.kg', 'minfin.kg', 'kenesh.kg', 'nbkr.kg',
    // Tadjikistan
    'andoz.tj', 'moliya.tj', 'majmilli.tj', 'nbt.tj',
    // Mongolie
    'mta.mn', 'mof.gov.mn', 'parliament.mn', 'mongolbank.mn',
  ],
};

// ============================================================================
// FONCTIONS D'EXPORT
// ============================================================================

// Créer un Set de tous les domaines autorisés
export const ALL_ALLOWED_DOMAINS = new Set(
  Object.values(WHITELIST).flat()
);

console.log(`📋 Whitelist loaded: ${ALL_ALLOWED_DOMAINS.size} domains authorized`);

// Vérifier si un domaine est autorisé
export function isAllowedDomain(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    
    // Vérifier le domaine exact
    if (ALL_ALLOWED_DOMAINS.has(hostname)) return true;
    
    // Vérifier les sous-domaines (ex: blog.deloitte.fr -> deloitte.fr)
    const parts = hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
      const domain = parts.slice(i).join('.');
      if (ALL_ALLOWED_DOMAINS.has(domain)) return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

// Filtrer les résultats pour ne garder que les domaines autorisés
export function filterResults(results) {
  return results.filter(r => r && r.url && isAllowedDomain(r.url));
}
