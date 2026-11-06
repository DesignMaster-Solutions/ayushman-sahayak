# Real cases: PM-JAY families charged, refused or told the card does not work

Every case here is a real, published decision. On 6 November 2026 I searched indiankanoon.org for High Court,
Consumer Commission and Information Commission decisions where an Ayushman Bharat PM-JAY beneficiary (or the
holder of a state card merged with it) was charged money by an empanelled hospital, refused cashless treatment,
told the card did not work or that the hospital was not empanelled, or refused admission. I read each decision
in full. The text of each one is saved in `sources/`, and `cases.json` keeps the facts each decision states. A
field the decision does not state is `null`; nothing is estimated. Every quote in `cases.json` is word for word
in the saved text (after collapsing whitespace).

How the pages were fetched: that day indiankanoon.org answered every direct `curl` with HTTP 403 (a Cloudflare
challenge, `cf-mitigated: challenge`), for search and doc pages alike. Searches and decisions were therefore
fetched with `curl` through the free r.jina.ai reader (`https://r.jina.ai/https://indiankanoon.org/doc/<id>/`),
which returns the same indiankanoon page. The first line of each file in `sources/` gives the URL and says so.

## The cases

| Case | Forum, date | Scheme as the decision names it | What happened | Result |
|---|---|---|---|---|
| [Renu Gupta](https://indiankanoon.org/doc/196621810/) | Chhattisgarh State Consumer Commission, 10 May 2023 | Ayushman Card; AB-PMJAY evam Mukhyamantri Swasthya Beema Yojana | admitted on the card, then **asked for cash**: Rs 14,700; helpline 104 said it was covered | refund of Rs 14,700 plus Rs 5,000 upheld; hospital's appeal dismissed |
| [Prem Singh Chauhan](https://indiankanoon.org/doc/173353524/) | Chhattisgarh State Consumer Commission, 4 Jun 2024 | Smart Card, Ayushman Bharat - NHPM under MSBY | deposited Rs 2 lakh with the card for knee surgery, hospital kept **Rs 1,30,000**; pre-authorisation cancelled after discharge | District award of Rs 1.3 lakh set aside; **beneficiary lost** |
| [Mohit Singh Bisht](https://indiankanoon.org/doc/144950149/) | Uttarakhand HC, 22 Jul 2024 | Ayushman Card | father a card holder; son **told to buy medicines**, about Rs 50,000; DM's committee found the benefit was not given | doctor's defamation case against the son stayed |
| [Ramesh Chandra](https://indiankanoon.org/doc/115349447/) | Allahabad HC, Lucknow (DB), 31 May 2024 | Ayushman Card, AB-PMJAY | ill, every nearby private hospital said it was **not empanelled** (100-bed rule) | disposed: seen as a proxy for nursing homes |
| [Surgimed Hospital](https://indiankanoon.org/doc/120730602/) | Allahabad HC (DB), 28 Sep 2026 | AB-PMJAY (SACHIS) | **Rs 9,000 charged for blood** for a two-month-old with blood cancer, in the ICU | hospital's de-empanelment upheld |
| [Deepanshu Kumar Payasi](https://indiankanoon.org/doc/154689650/) | Madhya Pradesh HC (DB), 2 Sep 2021 | Ayushman Card, Ayushman Bharat Niramayam | COVID-19 admission; empanelled hospital **not accepting the card**, Rs 4 lakh spent | CEO of Ayushman Bharat (Niramayam) to enquire within 2 months |
| [COVID suo motu, with Ashok Dagliya](https://indiankanoon.org/doc/55512489/) | Madhya Pradesh HC (DB), 30 Apr 2021 | Ayushman Card | private hospitals **refusing to admit** cashless card holders | approved hospitals shall not refuse; State to act on complaints |
| [Bijender Tak](https://indiankanoon.org/doc/66165836/) | Punjab and Haryana HC, 28 Jul 2026 | Ayushman Bharat, Ayushman Portal | family **paid the doctor** at discharge; card taken "for paperwork" and Rs 48,000 claimed (FIR) | proprietor's anticipatory bail refused |
| [Shifa Medical Centre](https://indiankanoon.org/doc/101964985/) | J&K and Ladakh HC, Srinagar, 17 Jan 2025 | AB PM-JAY | State reports repeated complaints of **out of pocket money** taken from covered patients | interim: suspension kept in abeyance, enquiry to go on |
| [Prayank Kumar Khare](https://indiankanoon.org/doc/117340087/) | Chhattisgarh HC (DB), 31 Aug 2026 | Ayushman Card | told the **card "had been blocked"**, paid Rs 1,60,000 cash; Rs 1,50,460 also drawn from the card (FIR) | petition to quash the FIR dismissed |

## The numbers

Counted from `cases.json`.

- 10 decisions from 2021 to 2026: 2 State Consumer Commission orders (both Chhattisgarh) and 8 High Court orders
  (2 Allahabad, 2 Madhya Pradesh, 1 Chhattisgarh, 1 Uttarakhand, 1 Punjab and Haryana, 1 Jammu & Kashmir and
  Ladakh). By year: 2021: 2, 2023: 1, 2024: 3, 2025: 1, 2026: 3. 8 concern one named or identified patient; 2 (MP
  COVID suo motu, Shifa) concern patients in general, number not given.
- What happened, by the app's situations: asked to pay: 6, card not working: 2, not empanelled: 1, refused
  admission: 1. Not sure covered, no card and paid after discharge: 0.
- Where the person was when it happened: admitted: 4, before going: 2, discharged: 1, not stated: 3.
- Age 70 or over: stated in none (10 of 10 `null`).
- Money taken from the patient, where the decision states it (6 of 10): Rs 9,000 (Surgimed), Rs 14,700 (Renu
  Gupta), about Rs 50,000 (Bisht), Rs 1,30,000 (Chauhan), Rs 1,60,000 (Khare), Rs 4,00,000 (Payasi).
- Outcome for the family: money ordered back in 1 (Renu Gupta); a complaint sent for enquiry in 1 (Payasi);
  claim rejected in 1 (Chauhan); in the other 7 the family was not the party asking for money (hospital
  challenges, bail and FIR-quashing petitions, a PIL, a proxy petition).

## Limits

- Bijender Tak, Khare and Shifa rest on allegations (an FIR, the State's counsel) quoted in bail, quashing or
  interim orders, not findings. Bisht is an interim order in a defamation case.
- In Chauhan the Commission found no deficiency: the pre-authorisation was cancelled because he declined the
  second knee, and the package rate list alone did not prove excess charging.
- In Ramesh Chandra the court treated the petition as filed on behalf of nursing homes; his own refusal is the
  petition's account.
- Searched on indiankanoon.org only (about 30 searches); published orders are cases someone took to a forum, not
  a sample. Few District Commission orders are on indiankanoon, so consumer refunds are under-represented.

Search terms used (indiankanoon, 6 November 2026), among others: `"ayushman bharat" refund hospital charged`;
`"PMJAY" charged consumer`; `"ayushman card" refused treatment`; `"golden card" charged hospital`;
`"ayushman card" charged hospital doctypes:consumer`; `"ayushman" hospital charged complainant refund`;
`"ayushman card" complainant hospital deficiency`; `"PM-JAY" beneficiary charged money hospital`;
`"ayushman" "deficiency in service" hospital`; `"ayushman card holder"`; `"Atal Ayushman"`;
`"PMJAY" complainant hospital`; `"pradhan mantri jan arogya" complainant`; `"ayushman card" deposit hospital`;
`"ayushman" "not empanelled"`; `"ayushman card" "refused to admit"`; `"ayushman" "denied treatment"`;
`"ayushman card" "did not accept"`; `"PM-JAY" "out of pocket"`; `"Mukhyamantri Swasthya Bima" ayushman complainant`;
`"PMJAY" "refund" patient hospital`; `"Ayushman Vay Vandana"`; `"ayushman card" "cash"`; `Surgimed Hospital ayushman`.

Read and rejected: National Health Authority v Jyoti Rani (Punjab State Commission, 13 Aug 2024: only sets aside
an ex parte order, no facts of the charge); Kiran Tiwari (CIC, 17 Sep 2024: card never created for a Bhopal gas
survivor, no hospital involved); Dineshwar Mahto (CIC, 8 Jan 2026: RTI on card refusal sent to the wrong
authority, no facts of his own case); Ashok Kumar Mishra (Jharkhand HC PIL, 1 Jul 2024: a general submission, no
patient); Mukilan (Puducherry State Commission, 2026: negligence, not a charge or refusal); Ramasamy (Madras HC,
2023: COVID overcharging, the order does not say he was a scheme beneficiary); hospital de-empanelment, fraud and
claim-payment cases with no beneficiary charged or refused (LBS Hospital, Jash Hospital, Vivek Mishra, Maatri
Medicity, Atal Ayushman Uttarakhand fraud FIRs).
