// Pure rules for Ayushman Sahayak: no DOM, no network. Every rule cites the item of "Verified on
// 06/11/2026" in BRIEF.md and an official source saved in sources/ (tests check each quote word for word).
// The app never asks for Aadhaar, card, ration card, phone, bill number or name.

export const STAGES = ['before', 'admitted', 'discharged'];
export const SITUATIONS = ['not_sure', 'no_card', 'not_empanelled', 'card_not_working', 'asked_to_pay', 'refused_admission', 'paid_after_discharge'];
export const AGE70 = ['yes', 'no', 'unsure'];

const pib = (id, file, quote) => ({ name: `PIB ${id}`, url: `https://pib.gov.in/PressReleseDetailm.aspx?PRID=${id}`, file, quote });
const NOTE153181 = 'https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=153181&ModuleId=3&reg=48&lang=2';
const note = (quote) => ({ name: 'PIB note 153181 (Sep 2024)', url: NOTE153181, file: 'pib_note153181.txt', quote });
const CAG = { name: 'CAG Report 11 of 2023, para 4.9', url: 'https://cag.gov.in/en/audit-report/download/119060' };

// Rule text lives in i18n.js as r_<id>.
export const RULES = {
  cover: { item: 1, sources: [pib(2203007, 'pib_2203007_pmjay_2025c.txt', 'provides health cover of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization')] },
  cashless: { item: 1, sources: [pib(1738169, 'pib_1738169_cashless_2021.txt', 'AB-PMJAY is a completely cashless and paperless scheme.')] },
  govt_deemed: { item: 1, sources: [pib(2116209, 'pib_2116209_update_mar2025.txt', 'All Government hospitals with in-patient services are deemed empanelled under AB-PMJAY.')] },
  eligibility: {
    item: 2,
    sources: [
      pib(2116209, 'pib_2116209_update_mar2025.txt', 'identified from the Socio-Economic Caste Census (SECC) of 2011 on the basis of 6 deprivation and 11 occupational criteria'),
      pib(2313393, 'pib_2313393_uhc_2026-09.txt', 'The scheme also includes families previously covered under the Rashtriya Swasthya Bima Yojana (RSBY).'),
      pib(2148359, 'pib_2148359_cards_41cr_2025.txt', 'in March 2024, the eligibility criteria were expanded to include 37 lakh Accredited Social Health Activists'),
    ],
  },
  vay_vandana: {
    item: 2,
    sources: [
      pib(2053881, 'pib_2053881_vayvandana_cabinet_2024.txt', 'health coverage to all the senior citizens aged 70 years and above irrespective of income'),
      pib(2053881, 'pib_2053881_vayvandana_cabinet_2024.txt', 'which they do not have to share with the other members of the family who are below the age of 70 years'),
      pib(2053881, 'pib_2053881_vayvandana_cabinet_2024.txt', 'may either choose their existing scheme or opt for AB PMJAY'),
    ],
  },
  card_ekyc: {
    item: 3,
    sources: [
      pib(2099542, 'pib_2099542_misuse_ekyc_penalties.txt', 'beneficiaries have to undergo Aadhaar authentication at the time of availing services.'),
      pib(2210432, 'pib_2210432_pmjay_2025d.txt', 'face-auth, OTP, IRIS, and fingerprint for Ayushman Card creation'),
    ],
  },
  arogya_mitra: {
    item: 3,
    sources: [
      pib(1781268, 'pib_1781268_access_poor_2021.txt', 'have Pradhan Mantri Arogya Mitra who facilitate the beneficiary with all the necessary steps required to avail scheme benefits'),
      pib(1781268, 'pib_1781268_access_poor_2021.txt', 'The beneficiary may directly visit the empanelled hospital (public or private) to avail cashless treatment'),
    ],
  },
  no_cap: { item: 4, sources: [pib(2203007, 'pib_2203007_pmjay_2025c.txt', 'There is no cap on family size and all members of eligible families irrespective of age and gender are covered under the scheme.')] },
  pre_existing: { item: 4, sources: [note('All pre-existing medical conditions are covered from the very first day of enrolment')] },
  pre_post: { item: 4, sources: [note('The scheme covers up to 3 days of pre-hospitalization and 15 days of post-hospitalization expenses, including diagnostics and medications.')] },
  portability: { item: 5, sources: [note('Beneficiaries can access cashless treatment at any empanelled public or private hospital across India')] },
  package_includes: {
    item: 6,
    sources: [{ ...CAG, file: 'cag_report11_2023_pmjay.txt', quote: 'After admission of a patient in hospital, expenditure for all diagnostic tests, medicines, implants, etc. is to be borne by the hospital since the costs for the same have been included in the cumulative package amount.' }],
  },
  cannot_deny: { item: 6, sources: [pib(2243769, 'pib_2243769_grievance_2026.txt', 'empanelled hospitals cannot deny treatment to eligible beneficiaries.')] },
  penalties: {
    item: 6,
    sources: [
      pib(2099547, 'pib_2099547_steps_access.txt', 'de-empanelment, levying penalty on errant hospitals, suspension, issuance of warning letter, lodging of FIRs'),
      pib(2157879, 'pib_2157879_strengthening_2025.txt', 'A total of 3,167 hospitals were found guilty of irregularities/violations since inception of the scheme'),
    ],
  },
};

// Official channels. menu = exact words from Verified item 3 only; needs = what THAT channel asks
// (Aadhaar e-KYC happens there, never in this app). Name and text live in i18n.js as check_<id>.
const SARATHI_URL = 'https://wa.me/917290823838?text=Hi';
export const CHECKS = {
  app: { url: null, needs: 'needs_app', source: pib(2269699).url },
  beneficiary: { url: 'https://beneficiary.nha.gov.in', needs: 'needs_beneficiary', source: pib(2110780).url },
  sarathi: { url: SARATHI_URL, phone: '+91 72908 23838', needs: 'needs_sarathi', source: pib(2278994).url },
  arogya_mitra: { url: null, needs: 'needs_arogya_mitra', source: pib(1781268).url },
  csc: { url: null, needs: 'needs_csc', source: pib(2110780).url },
};

const APP = { verify: 'Verify eligibility', ecard: 'Download Ayushman e-cards', locate: 'Locate empanelled hospitals' };
const SAR = { elig: 'Eligibility Check under PM-JAY', apply: 'Apply for Ayushman Card', download: 'Download Ayushman Card', ekyc: 'Re-do eKYC', find: 'Find Nearby Empanelled Hospitals' };

// [check id, menu items] per situation, most useful first.
const CHECK_PLAN = {
  not_sure: [['app', [APP.verify]], ['sarathi', [SAR.elig]], ['beneficiary', []], ['arogya_mitra', []], ['csc', []]],
  no_card: [['app', [APP.verify, APP.ecard]], ['sarathi', [SAR.elig, SAR.apply, SAR.download]], ['beneficiary', []], ['csc', []], ['arogya_mitra', []]],
  not_empanelled: [['app', [APP.locate]], ['sarathi', [SAR.find]]],
  card_not_working: [['arogya_mitra', []], ['sarathi', [SAR.ekyc, SAR.download]], ['app', [APP.verify]]],
  asked_to_pay: [['arogya_mitra', []], ['app', [APP.verify]], ['sarathi', [SAR.elig]]],
  refused_admission: [['arogya_mitra', []], ['app', [APP.locate]], ['sarathi', [SAR.find]]],
  paid_after_discharge: [['app', [APP.verify]], ['sarathi', [SAR.elig]], ['arogya_mitra', []]],
};

export function checksFor({ situation }) {
  return CHECK_PLAN[situation].map(([id, menu]) => ({ id, ...CHECKS[id], menu }));
}

// Grievance routes. Never 1800-11-4477 (no official text) and never 14413 (hospitals' line).
export const GRIEVANCE = {
  helpline: { tel: '14555', url: 'tel:14555', menu: [], source: pib(2243769).url },
  cgrms: { url: 'https://cgrms.pmjay.gov.in', menu: [], source: pib(1984036).url },
  app: { url: null, menu: ['Raise grievances'], source: pib(2269699).url },
  sarathi: { url: SARATHI_URL, phone: '+91 72908 23838', menu: ['Register, Track and Withdraw Grievances'], source: pib(2278994).url },
  sha: { url: null, menu: [], source: pib(2116209).url },
  vay_missed: { tel: '1800-110-770', url: 'tel:1800110770', menu: [], source: pib(2110780).url },
};

export function grievanceFor({ age70 }) {
  const ids = ['helpline', 'cgrms', 'app', 'sarathi', 'sha'];
  if (age70 === 'yes' || age70 === 'unsure') ids.splice(1, 0, 'vay_missed');
  return ids.map((id) => ({ id, ...GRIEVANCE[id] }));
}

const RULE_PLAN = {
  not_sure: ['eligibility', 'no_cap', 'cover', 'cashless', 'arogya_mitra'],
  no_card: ['eligibility', 'card_ekyc', 'arogya_mitra', 'cashless'],
  not_empanelled: ['govt_deemed', 'portability', 'arogya_mitra', 'cashless'],
  card_not_working: ['card_ekyc', 'cannot_deny', 'arogya_mitra', 'cashless', 'penalties'],
  asked_to_pay: ['package_includes', 'cannot_deny', 'cashless', 'pre_existing', 'penalties'],
  refused_admission: ['cannot_deny', 'govt_deemed', 'portability', 'arogya_mitra', 'penalties'],
  paid_after_discharge: ['package_includes', 'pre_post', 'cannot_deny', 'cashless', 'penalties'],
};

const CARRY = {
  before: ['carry_aadhaar', 'carry_ration'],
  admitted: ['carry_aadhaar', 'carry_bills', 'carry_receipts'],
  discharged: ['carry_bills', 'carry_receipts', 'carry_discharge', 'carry_aadhaar'],
};

export function adviceFor({ stage, situation, age70 }) {
  const rules = [...RULE_PLAN[situation]];
  if (age70 === 'yes') rules.splice(1, 0, 'vay_vandana');
  if (age70 === 'unsure') rules.push('vay_vandana');
  if (stage === 'before') rules.push('portability');
  if (stage === 'discharged') rules.push('pre_post');
  return {
    rules: [...new Set(rules)],
    checks: checksFor({ situation }),
    grievance: grievanceFor({ age70 }),
    sayAtDesk: `say_${situation}`,
    carry: CARRY[stage],
    urgent: (stage === 'before' || stage === 'admitted') && (situation === 'asked_to_pay' || situation === 'refused_admission'),
  };
}

// The ready request. Blanks are filled by hand, never by us. No amount, no promise, no medical advice.
const LETTER = {
  en: {
    to_desk: 'To: The PM-JAY desk (Pradhan Mantri Arogya Mitra)',
    to_griev: 'To: The grievance officer, AB-PMJAY, State Health Agency',
    blanks: ['Patient name: ______', 'Hospital: ______', 'Date: ______', 'Ayushman card or PM-JAY ID: ______'],
    subject: 'Subject: Treatment under Ayushman Bharat PM-JAY (AB-PMJAY)',
    body: {
      not_sure: 'I want to know whether our family is covered under AB-PMJAY. Please check our eligibility.',
      no_card: 'Our family is covered under AB-PMJAY but we do not have an Ayushman card yet. Please help us with the Aadhaar e-KYC.',
      not_empanelled: 'We were told this hospital is not in AB-PMJAY. Please tell us in writing whether it is empanelled.',
      card_not_working: 'We were told our Ayushman card is not accepted or is blocked, or the e-KYC does not work. Please help us with the Aadhaar authentication.',
      asked_to_pay: 'After admission we were asked to pay for ______ (deposit, medicines, tests, blood or implants).',
      refused_admission: 'The patient was not admitted under AB-PMJAY.',
      paid_after_discharge: 'At or after discharge we were asked to pay for ______ . The bills and receipts are attached.',
    },
    rule: {
      not_sure: 'The scheme says the beneficiary may go directly to an empanelled hospital and the Pradhan Mantri Arogya Mitra helps with every step (PIB 1781268).',
      no_card: 'The scheme says the Pradhan Mantri Arogya Mitra helps the beneficiary with every step (PIB 1781268).',
      not_empanelled: 'The scheme says all government hospitals with in-patient services are deemed empanelled under AB-PMJAY (PIB 2116209).',
      card_not_working: 'As per the empanelment guidelines, empanelled hospitals cannot deny treatment to eligible beneficiaries (PIB 2243769).',
      asked_to_pay: 'Under the scheme, after admission all tests, medicines and implants are part of the package (CAG Report 11 of 2023, para 4.9), and empanelled hospitals cannot deny treatment to eligible beneficiaries (PIB 2243769).',
      refused_admission: 'As per the empanelment guidelines, empanelled hospitals cannot deny treatment to eligible beneficiaries (PIB 2243769).',
      paid_after_discharge: 'Under the scheme, after admission all tests, medicines and implants are part of the package (CAG Report 11 of 2023, para 4.9).',
    },
    ask_desk: 'I request you to process the treatment under PM-JAY.',
    ask_griev: 'I request the grievance officer to look into this.',
    sign: 'Name and signature: ______',
  },
  hi: {
    to_desk: 'सेवा में: पीएम-जेएवाई डेस्क (प्रधानमंत्री आरोग्य मित्र)',
    to_griev: 'सेवा में: शिकायत अधिकारी, एबी पीएम-जेएवाई, राज्य स्वास्थ्य एजेंसी',
    blanks: ['मरीज़ का नाम: ______', 'अस्पताल: ______', 'तारीख: ______', 'आयुष्मान कार्ड या पीएम-जेएवाई आईडी: ______'],
    subject: 'विषय: आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (एबी पीएम-जेएवाई) के तहत इलाज',
    body: {
      not_sure: 'मैं जानना चाहता/चाहती हूं कि हमारा परिवार एबी पीएम-जेएवाई में शामिल है या नहीं। कृपया हमारी पात्रता जांचकर बताएं।',
      no_card: 'हमारा परिवार एबी पीएम-जेएवाई में शामिल है, पर अभी हमारा आयुष्मान कार्ड नहीं बना है। कृपया आधार ई-केवाईसी में मदद करें।',
      not_empanelled: 'हमें बताया गया कि यह अस्पताल एबी पीएम-जेएवाई में नहीं है। कृपया लिखकर बताएं कि यह सूचीबद्ध अस्पताल है या नहीं।',
      card_not_working: 'हमें बताया गया कि हमारा आयुष्मान कार्ड नहीं चल रहा या ब्लॉक है, या ई-केवाईसी नहीं हो रहा। कृपया आधार सत्यापन में मदद करें।',
      asked_to_pay: 'भर्ती के बाद हमसे ______ (जमा राशि, दवाइयां, जांच, खून या इम्प्लांट) के लिए पैसे मांगे गए।',
      refused_admission: 'मरीज़ को एबी पीएम-जेएवाई के तहत भर्ती नहीं किया गया।',
      paid_after_discharge: 'छुट्टी के समय या बाद में हमसे ______ के लिए पैसे मांगे गए। बिल और रसीदें साथ में हैं।',
    },
    rule: {
      not_sure: 'योजना के अनुसार लाभार्थी सीधे सूचीबद्ध अस्पताल जा सकते हैं और प्रधानमंत्री आरोग्य मित्र हर कदम पर मदद करते हैं (पीआईबी 1781268)।',
      no_card: 'योजना के अनुसार प्रधानमंत्री आरोग्य मित्र लाभार्थी की हर कदम पर मदद करते हैं (पीआईबी 1781268)।',
      not_empanelled: 'योजना के अनुसार भर्ती की सुविधा वाले सभी सरकारी अस्पताल एबी पीएम-जेएवाई में सूचीबद्ध माने जाते हैं (पीआईबी 2116209)।',
      card_not_working: 'सूचीबद्धता दिशानिर्देशों के अनुसार अस्पताल योजना के पात्र लाभार्थियों को उपचार देने से इनकार नहीं कर सकते (पीआईबी 2243769)।',
      asked_to_pay: 'योजना के अनुसार भर्ती के बाद सभी जांच, दवाइयां और इम्प्लांट पैकेज में शामिल हैं (सीएजी रिपोर्ट 11, 2023, पैरा 4.9), और अस्पताल योजना के पात्र लाभार्थियों को उपचार देने से इनकार नहीं कर सकते (पीआईबी 2243769)।',
      refused_admission: 'सूचीबद्धता दिशानिर्देशों के अनुसार अस्पताल योजना के पात्र लाभार्थियों को उपचार देने से इनकार नहीं कर सकते (पीआईबी 2243769)।',
      paid_after_discharge: 'योजना के अनुसार भर्ती के बाद सभी जांच, दवाइयां और इम्प्लांट पैकेज में शामिल हैं (सीएजी रिपोर्ट 11, 2023, पैरा 4.9)।',
    },
    ask_desk: 'कृपया पीएम-जेएवाई के तहत इलाज की प्रक्रिया पूरी करें।',
    ask_griev: 'शिकायत अधिकारी से अनुरोध है कि इस मामले को देखें।',
    sign: 'नाम और हस्ताक्षर: ______',
  },
};

export function requestText({ stage, situation }, lang) {
  const L = LETTER[lang] || LETTER.en;
  const complaint = situation === 'paid_after_discharge' || stage === 'discharged';
  return [
    complaint ? L.to_griev : L.to_desk,
    ...L.blanks,
    '',
    L.subject,
    '',
    L.body[situation],
    L.rule[situation],
    complaint ? L.ask_griev : L.ask_desk,
    '',
    L.sign,
  ].join('\n');
}
