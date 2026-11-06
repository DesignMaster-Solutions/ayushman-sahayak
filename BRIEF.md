# Ayushman Sahayak — brief (Code for a Billion 2026, track Health)

Goal: a free, open-source agent for the family at a hospital, or about to go to one, who holds (or
should hold) Ayushman Bharat PM-JAY cover and is being refused, asked to pay, or does not know
whether they are covered. In a few questions it tells them whether they are likely covered (and how
to confirm it officially), what the scheme says the hospital must do, how to find an empanelled
hospital, and gives a ready-to-show complaint/request text in Hindi or English plus the official
grievance route. Cheap phone, no account, no install, no Aadhaar, card or phone number asked.

Why this one: on 06/11/2026 the hub's Health track has 9 entries (#62 clean-air alerts, #49
industrial safety, #33 hospital info, #32 blood matching, #24 generic medicine prices, #22 symptom
info, #21 hospital shift notes, #10 heart risk, #5 notes). A search for Ayushman, PM-JAY, PMJAY and
"health insurance" across all 48 submissions returns zero. #28 (another track) covers PM-RAHAT
road-accident cashless treatment only: do not repeat it. The money is lost at the hospital counter:
the family pays for a covered procedure because nobody told them it is cashless, or gives up when
the card "does not work".

## Facts we may use (cite each one in the README; nothing else is a fact)

All of these are from memory on 06/11/2026. VERIFY EACH ONE in the official source (pmjay.gov.in,
nha.gov.in, beneficiary.nha.gov.in, the NHA Health Benefit Package master, NHA guidelines and
grievance redressal guidelines, cgrms.pmjay.gov.in, PIB, Lok Sabha / Rajya Sabha answers, CAG
report on PM-JAY) and cite that, not a secondary page. What cannot be found in an official source
does not go in the app.

- PM-JAY gives up to Rs 5 lakh per family per year for secondary and tertiary hospitalisation,
  cashless and paperless at empanelled public and private hospitals (VERIFY wording and amount).
- Eligibility: SECC 2011 deprivation/occupation criteria, RSBY families, state expansions; since
  October 2024 every citizen aged 70+ regardless of income (Ayushman Vay Vandana card) with an extra
  top-up for families already covered (VERIFY dates, amount and how to enrol).
- Checking eligibility / getting the card: beneficiary.nha.gov.in and the Ayushman app, CSC,
  empanelled hospital Arogya Mitra (VERIFY current paths and what ID is accepted).
- No cap on family size or age (VERIFY), pre-existing conditions covered from day one (VERIFY),
  pre-hospitalisation (3 days) and post-hospitalisation (15 days) costs incl. diagnostics and
  medicines (VERIFY numbers).
- Portability: a beneficiary can use any empanelled hospital in any state (VERIFY).
- Hospital must not charge a beneficiary for a covered package; what to do if asked to pay
  (helpline 14555 / 1800-11-4477, CGRMS grievance portal, State Health Agency) (VERIFY numbers,
  portal and the grievance timeline in the NHA grievance guidelines).
- Finding an empanelled hospital: hospitals.pmjay.gov.in or the official finder (VERIFY).
- Size and severity: NHA / PIB figures (cards created, hospital admissions authorised, amount),
  NHA/NSSO out-of-pocket expenditure share, CAG performance audit 2023 findings on beneficiaries
  charged or treatment denied (VERIFY each figure and quote word for word, save the source).

Not allowed: asking for Aadhaar, card, ration card, phone or hospital bill numbers; promising
treatment will be free or that a claim will be approved; naming an amount the person "will get
back"; any medical advice (what treatment to take); a rule without its official source; any paid
API; any tracking beyond the anonymous counter below.

## Build (same pattern as Bhugtan Sahayak, Nyaya Sahayak and Ghar Ki Hawa in ~/Backups/impressora)

- Static web app (index.html + app.js + i18n en/hi), no framework, < 100 KB, works on 3G; one
  Cloudflare Worker for the anonymous counter. Read-aloud button (Web Speech API, hi-IN, optional).
- Flow, one step per screen: where are you (before going / admitted now / discharged and paid) ->
  what happened (don't know if covered, no card, hospital says not empanelled, says card not
  working, asked to pay deposit/medicines/tests, refused admission, asked to pay after discharge)
  -> age 70+ in family? -> which state (portability, State Health Agency contact).
- Result card: what the scheme says (with source), the official check (link and menu path), what
  to say at the hospital PM-JAY desk (Arogya Mitra), what to carry, the grievance route and
  helpline, and a ready-to-show request/complaint text in Hindi and English; "Copy" and WhatsApp
  share; "Did it work?" yes/no box for the counter.
- rules.js = pure functions with `node --test` tests: every situation maps to at least one official
  check and one grievance route, "asked to pay" always shows the helpline and CGRMS, 70+ path,
  text never promises free treatment, Hindi and English keys complete. See each test fail once
  against a broken rule before trusting it (mutation check).
- /stats page and /api/stats JSON like the others (situations, requests copied/shared, "Did it
  work?", by language and day; no personal data); ?nostats for our own tests.
- Real cases (Proven impact / severity): like evidence/real-cases in Nyaya Sahayak, find court
  orders or official reports (CAG, consumer commission, High Court) where a PM-JAY beneficiary was
  charged or refused, save each source, replay them through rules.js in a test.
- README: setup, sources for every rule, how AgentFoundry was used, MIT license.

## AgentFoundry requirement (eligibility)

Build inside the AgentFoundry IDE (/Applications, login info@designmastersolutions.com, vault
`agentfoundry:dms`): open this folder in AF and run Claude Code from the AF integrated terminal
against this brief, as the other four were built. Decline the AF migration wizard. Take the AF
lock first: `cld board "AF: digitando" --files /Users/alandebortolo/Backups/impressora/.af-lock`,
release with `cld board done "AF livre"` right after typing the prompt.

## Verified on 06/11/2026 (this section wins over everything above)

Double quotes = verbatim from the saved file; single quotes = our own wording or search terms.
Each rule below was read in an official source; the text copy is in `sources/` (first line of each
file = URL fetched + date). pmjay.gov.in, nha.gov.in, beneficiary.nha.gov.in, hospitals.pmjay.gov.in
and cgrms.pmjay.gov.in did not answer from outside India (403 / timeout) and the Wayback Machine
blocked us (bot block, 06/11/2026), so there are no `wb_` files: everything comes from PIB
(press releases = written replies in Lok Sabha / Rajya Sabha, backgrounders), CAG, and one MoHFW
hospital page. Nothing outside this list may appear in the app as a rule, number, path or fee.

1. **Cover: Rs 5 lakh per family per year, secondary and tertiary hospitalisation, cashless.**
   PIB 2203007 (12/12/2025, Rajya Sabha), https://pib.gov.in/PressReleseDetailm.aspx?PRID=2203007 :
   "provides health cover of Rs. 5 lakh per family per year for secondary and tertiary care
   hospitalization to 12 crore families" (`pib_2203007_pmjay_2025c.txt`).
   PIB 2313393 (22/09/2026): "providing annual cashless hospitalisation coverage of upto Rs.5 lakh
   per family to economically vulnerable citizens" (`pib_2313393_uhc_2026-09.txt`).
   Cashless AND paperless: PIB 1738169 (23/07/2021, Lok Sabha): "AB-PMJAY is a completely cashless
   and paperless scheme." (`pib_1738169_cashless_2021.txt`); PIB 1546948 (22/09/2018, launch):
   "PMJAY will provide cashless and paperless access to services for the beneficiary at the point of
   service." (`pib_1546948_launch_2018.txt`). Public and private: PIB note 153181 (Sep 2024):
   "Beneficiaries enjoy cashless healthcare services at the point of care, eliminating the need for
   out-of-pocket payments during treatment." (`pib_note153181.txt`).
   Government hospitals: PIB 2116209 (28/03/2025, Lok Sabha): "All Government hospitals with
   in-patient services are deemed empanelled under AB-PMJAY." (`pib_2116209_update_mar2025.txt`).
   Card not required in law: PIB 1594168 (29/11/2019, Lok Sabha): "AB-PMJAY) is an entitlement-based
   scheme and there is no requirement of registration or enrolment of beneficiaries. Accordingly, no
   scheme specific card is required to avail the benefits under the scheme."
   (`pib_1594168_cards_entitlement_2019.txt`) (old; in practice card + Aadhaar e-KYC, see 3).

2. **Eligibility.**
   - SECC 2011: PIB 2116209 (28/03/2025): "identified from the Socio-Economic Caste Census (SECC) of
     2011 on the basis of 6 deprivation and 11 occupational criteria across rural and urban areas
     respectively" ... "Many of the States and Union Territories (UTs) implementing AB-PMJAY have
     further expanded the beneficiary base at their own cost under the scheme using non-SECC data
     sources (including National Food Security Act, State specific datasets)."
   - The list (PIB 2313393, 22/09/2026, `pib_2313393_uhc_2026-09.txt`): rural "one or more of the
     following six criteria": "D1 : Households having only one room with kucha walls and kucha roof;"
     "D2: Households having no adult member between 16 and 59 years of age;" "D3: Female-headed
     households having no adult male member between 16 and 59 years of age;" "D4: Households having a
     disabled member and no able-bodied adult member;" "D5: Scheduled Caste/Scheduled Tribe
     households; and" "D7: Landless households deriving a major part of their income from manual
     casual labour". Urban: "the following 11 occupational categories of workers are eligible"
     (Ragpicker; Beggar; Domestic worker; Street vendor/ Cobbler/hawker ...; Construction worker/
     Plumber/ Mason/ Labour/ Painter/ Welder/ Security guard/ Coolie ...; Sweeper/ Sanitation worker/
     Mali; Home-based worker/ Artisan/ Handicrafts worker/ Tailor; Transport worker/ Driver/
     Conductor/ ... Rickshaw puller; Shop worker/ Assistant/ Peon .../ Waiter; Electrician/ Mechanic/
     Assembler/ Repair worker; Washer-man/ Chowkidar). RSBY: "The scheme also includes families
     previously covered under the Rashtriya Swasthya Bima Yojana (RSBY)." Extra categories: BOCW
     workers, "Road accident victims covered under PM-RAHAT;", SMILE transgender persons, PM CARES
     children, NAMASTE sanitation workers, PVTGs under PM-JANMAN.
   - Automatically included (PIB 1738169, 23/07/2021): "Households without shelter",
     "Destitute/ living on alms", "Manual scavenger families", "Primitive tribal groups", "Legally
     released bonded labour".
   - ASHA/AWW/AWH: PIB 2148359 (25/07/2025, Lok Sabha): "in March 2024, the eligibility criteria were
     expanded to include 37 lakh Accredited Social Health Activists (ASHAs), Anganwadi Workers (AWWs),
     Anganwadi Helpers (AWHs), and their families." (`pib_2148359_cards_41cr_2025.txt`)
   - **Ayushman Vay Vandana (70+).** Cabinet approval 11/09/2024, PIB 2053881,
     https://pib.gov.in/PressReleseDetailm.aspx?PRID=2053881 (`pib_2053881_vayvandana_cabinet_2024.txt`):
     "health coverage to all the senior citizens aged 70 years and above irrespective of income";
     top-up wording, verbatim: "The senior citizens of the age 70 years and above belonging to families
     already covered under AB PM-JAY will get an additional top-up cover upto ₹5 lakh per year for
     themselves (which they do not have to share with the other members of the family who are below
     the age of 70 years). All other senior citizens of the age 70 years and above will get a cover
     upto ₹5 lakh per year on a family basis." CGHS etc.: "Central Government Health Scheme (CGHS),
     Ex-Servicemen Contributory Health Scheme (ECHS), Ayushman Central Armed Police Force (CAPF) may
     either choose their existing scheme or opt for AB PMJAY." Private insurance / ESI: "senior
     citizens of 70 years and above who are under private health insurance policies or Employees’
     State Insurance scheme will be eligible to avail benefits under AB PM-JAY."
     PIB backgrounder 23/09/2024 (`pib_backgrounder_2024-09_six_years.txt`, PDF line):
     "be provided exclusively for their use, separate from the rest of the family".
     Note: 'on a family basis' means 70+ couples outside PM-JAY share one Rs 5 lakh cover; say it as
     PIB says it, do not add 'per person'.
     Launch 29/10/2024: PIB 2082288 (09/12/2024, `pib_2082288_vayvandana_25lakh.txt`): "its launch by
     the Prime Minister on 29 October, 2024"; PIB 2116209: "on 29 th October 2024, the government
     expanded AB-PMJAY".
     How to enrol, PIB 2110780 (12/03/2025, Rajya Sabha, `pib_2110780_senior_helpline.txt`):
     "Enrolment can be through mobile phone application (AyushmanApp), web portal
     (beneficiary.nha.gov.in) or at a nearby empanelled hospital or Common Service Centre. The feature
     of self-registration is also available in the above-mentioned application." PIB 2082288: "For
     self-registration eligible citizens can download Ayushman app (from Google Play store) or visit
     www.beneficiary.nha.gov.in." Age proof = Aadhaar: NOT confirmed in a saved official text (the
     NHA senior-citizen FAQ PDF on nha.gov.in returned 403); do not say 'age as per Aadhaar'.

3. **Check eligibility / get the card.**
   - Ayushman App, PIB 2269699 (06/06/2026, `pib_2269699_pmjay_2026.txt`): "Available on both Android
     and iOS in 19 regional languages. Beneficiaries can:" "Verify eligibility" / "Download Ayushman
     e-cards" / "Monitor wallet balances" / "Locate empanelled hospitals" / "Raise grievances".
   - Authentication modes, PIB 2210432 (01/01/2026, `pib_2210432_pmjay_2025d.txt`): "provided
     different modes of authentication i.e. face-auth, OTP, IRIS, and fingerprint for Ayushman Card
     creation."
   - Aadhaar e-KYC is mandatory: PIB 2099542 (04/02/2025, Rajya Sabha,
     `pib_2099542_misuse_ekyc_penalties.txt`): "AB-PMJAY beneficiaries are verified through Aadhaar
     e-KYC at the time of creation of the card . Further, beneficiaries have to undergo Aadhaar
     authentication at the time of availing services." PIB 1949844 (17/08/2023,
     `pib_1949844_myths_facts_2023.txt`): "the beneficiary undergoes the process of mandatory Aadhaar
     based e-KYC".
   - CSC + Arogya Mitra: PIB 1594168 (29/11/2019): MoU with CSC "to verify AB-PMJAY beneficiaries’
     identity"; "beneficiary identification process is undertaken at all the empanelled hospitals
     including private service providers through Pradhan Mantri Arogya Mitras (PMAMs)." PIB 1781268
     (14/12/2021, Rajya Sabha, `pib_1781268_access_poor_2021.txt`): "All empanelled hospitals (public
     orprivate) have Pradhan Mantri Arogya Mitra who facilitate the beneficiary with all the necessary
     steps required to avail scheme benefits." and "The beneficiary may directly visit the empanelled
     hospital (public or private) to avail cashless treatment"
   - WhatsApp, PIB 2278994 (29/06/2026, `pib_2278994_sarathi.txt`): Ayushman Sarathi, menu items
     "Eligibility Check under PM-JAY", "Apply for Ayushman Card", "Download Ayushman Card", "Re-do
     eKYC", "Find Nearby Empanelled Hospitals", "Register, Track and Withdraw Grievances"; access:
     "by sending “Hi” on WhatsApp to +91 72908 23838".
   - Documents: only PIB 1540898 (31/07/2018, CSC MoU, `pib_1540898_csc_2018.txt`): "documents like
     Aadhaar Card, Ration Card, PAN Number and others." Old (2018); safe line for the app: 'carry
     Aadhaar; a ration card helps if you have it'. Alternate IDs without Aadhaar (Ration Card, Voter
     ID, MGNREGA card) appear only in a 2018 draft notification (PIB 1538435,
     `pib_1538435_aadhaar_2018.txt`): NOT current, do not say.
   - mera.pmjay.gov.in (PIB 1781268, 2021) is an old path: do not show; use beneficiary.nha.gov.in.

4. **No cap on family size/age; pre-existing from day one; 3 days pre / 15 days post.**
   PIB 2203007 (12/12/2025): "There is no cap on family size and all members of eligible families
   irrespective of age and gender are covered under the scheme." PIB note 153181 (Sep 2024,
   `pib_note153181.txt`): "The scheme covers up to 3 days of pre-hospitalization and 15 days of
   post-hospitalization expenses, including diagnostics and medications." and "All pre-existing
   medical conditions are covered from the very first day of enrolment". MoHFW (Dr RML Hospital page,
   https://rmlh.mohfw.gov.in/index1.aspx?lsid=2567&lev=2&lid=3620&langid=1,
   `mohfw_rmlh_pmjay_features.txt`): "It covers up to 3 days of pre-hospitalization and 15 days
   post-hospitalization expenses such as diagnostics and medicines." / "All pre–existing conditions
   are covered from day one." PIB backgrounder 17/11/2024 (`pib_backgrounder_2024-11_vayvandana.txt`):
   "PM-JAY has no cap on family size or age" and "Post-hospitalisation follow-up care up to 15 days".
   PIB 2082288: "covers all pre -existing diseases from first day itself without any waiting period."

5. **Portability.** PIB note 153181: "Beneficiaries can access cashless treatment at any empanelled
   public or private hospital across India". MoHFW RMLH: "Benefits of the scheme are portable across
   the country i.e. a beneficiary can visit any empanelled public or private hospital in India to
   avail cashless treatment." PIB 2149693 (29/07/2025, Rajya Sabha,
   `pib_2149693_vayvandana_update_2025.txt`): portability "allows eligible beneficiaries—including
   those under the Vay Vandana scheme—to access healthcare services at any of the 31,466 empanelled
   hospitals across the country, regardless of their place of residence."

6. **Hospital must not charge / deny; what to do.**
   - Package includes everything: CAG Report 11 of 2023, para 4.9, page 32
     (`cag_report11_2023_pmjay.txt`) quoting the SHA–hospital agreement: "treatment/interventions to
     PMJAY beneficiaries should be provided in a completely cashless" + "manner. After admission of a
     patient in hospital, expenditure for all diagnostic tests," + "medicines, implants, etc. is to be
     borne by the hospital since the costs for the same have been" + "included in the cumulative
     package amount." (four consecutive PDF lines).
   - Cannot deny: PIB 2243769 (23/03/2026, Lok Sabha, `pib_2243769_grievance_2026.txt`): "As per the
     empanelment guidelines under Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY),
     empanelled hospitals cannot deny treatment to eligible beneficiaries." and "beneficiaries can
     register their grievances through the Centralized Grievance Redressal Management System (CGRMS)
     or the 24×7 toll-free helpline number 14555."
   - Channels: PIB 2116209 (28/03/2025): "web-based portal Centralized Grievance Redressal Management
     System (CGRMS), Central & State call centers (14555), email, letter to State Health Agencies
     (SHAs), etc." Three tiers: "a three-tier grievance redressal system at District, State, and
     National level".
   - CGRMS URL: PIB 1984036 (08/12/2023, Lok Sabha, `pib_1984036_ortho_2023.txt`): "grievance
     redressal portal ( https://cgrms.PM-JAY.gov.in/ )" and it "is immediately assigned to respective
     State Grievance Nodal Officer designated at each SHA". PIB writes the host as "cgrms.PM-JAY.gov.in"
     (with a hyphen, which looks like a typo); the host used in the brief, cgrms.pmjay.gov.in, does
     resolve as a pmjay.gov.in subdomain (Wayback has it archived since 2018) but no official text
     we saved spells it that way. Recommendation: show 'CGRMS (Centralized Grievance Redressal
     Management System), cgrms.pmjay.gov.in' + 14555 and cite PIB 1984036 + 2243769; the portal did
     not answer from outside India, so its live menu is NOT confirmed.
   - Helplines: 14555 VERIFIED (above). 1800-110-770 = missed call for Vay Vandana: PIB 2110780: "a
     helpline number 1800-110-770 is available for the Ayushman Vay Vandana Card beneficiaries where
     they may give a missed call or beneficiary may call to 24x7 call centre (14555)". 14413 is the
     hospitals' line ("A hospitalspecific call center (14413)", PIB 2116209): do not show to families.
   - Timeline (CAG, page 76, `cag_report11_2023_pmjay.txt`; that page is letter-spaced in the text
     file, grep for the spaced form): "D G R C m o nit ors t h e gri e v a n c e d at a b as e t o e ns ur e
     t h at all gri e v a n c es ar e r es ol v e d wit hi n" + "3 0 d a ys or e arli er" (= DGRC must ensure
     all grievances resolved within 30 days or earlier); NHA-level TAT "( T A T) of 1 5 d a ys"; appeal
     "wit hi n 3 0 d a ys t o t h e hi g h er Gri e v a n c e R e dr ess al c o m mitt e e" (para 7.2.5 of the
     Grievance Redressal Guidelines). Safe app line: 'the scheme's grievance guidelines aim to resolve
     complaints within 15 to 30 days (CAG 2023)'; do not promise a date.
   - Penalties: PIB 2099547 (04/02/2025, Rajya Sabha, `pib_2099547_steps_access.txt`): "provisions for
     taking stringent action (such as de-empanelment, levying penalty on errant hospitals, suspension,
     issuance of warning letter, lodging of FIRs) are available to the State Health Authorities".
     PIB 2157879 (19/08/2025, Rajya Sabha, `pib_2157879_strengthening_2025.txt`): "A total of 3,167
     hospitals were found guilty of irregularities/violations since inception of the scheme, and
     suitable actions including de-empanelment of 1114 hospitals, levying penalty worth Rs. 122 crores
     on 1504 errant hospitals and suspension of 549 hospitals".
   - Refund: only CAG (J&K): "459 patients paid ₹ 43.27 lakh initially out of" + "their own pocket for
     which reimbursement was made to the patients after verifying the bills." NOT confirmed as a
     general rule; do not say 'the hospital must refund you' or name any amount. Keep the bill and
     receipts and mention them in the complaint = fine (no rule claimed).
   - NOT confirmed, do not say: 1800-11-4477 (no official text found; not in any PIB result);
     'hospital must refund within X days'; a CGRMS menu path.

7. **Finding an empanelled hospital.** Official finder paths found: Ayushman App "Locate empanelled
   hospitals" (PIB 2269699, 06/06/2026) and Ayushman Sarathi "Find Nearby Empanelled Hospitals" (PIB
   2278994, 29/06/2026). PIB 1575551 (25/06/2019, `pib_1575551_empanelment_2019.txt`): "The guidelines
   & list of empanelled hospitals are available on the website www.pmjay.gov.in ." Also every
   government hospital with in-patient services is deemed empanelled (item 1).
   NOT confirmed, do not say: hospitals.pmjay.gov.in (no official text names it; site unreachable).

8. **Size and severity.**
   - Latest: PIB 2313393 / note 160081 (22/09/2026, `pib_2313393_uhc_2026-09.txt`,
     `pib_note160081_en_2026-09_8years.txt`): "about 33% of India's population (over 48.51 crore
     people) already holding Ayushman cards"; "treatment worth upto Rs. 2.03 lakh crore in about 13.25
     crore hospital admissions through a network of over 38,000 empanelled public and private
     hospitals (as on August 31, 2026)"; "As on 21.09.26, more than 1.36 crore senior citizens have
     Ayushman Vay Vandana cards."
   - Parliament: PIB 2243769 (23/03/2026, Lok Sabha): "As on 28.02.2026, a total of 11.69 crore
     hospital admissions have been authorized under the scheme, including 6.74 crore admissions in
     private hospitals." and "36,229 hospitals, comprising 19,483 public and 16,746 private hospitals."
     Claim TAT: "within 15 days of claim submission for intra-state hospitals ... within 30 days of
     claim submission in case of portability claims". PIB 2148359 (25/07/2025, Lok Sabha): "Over 41
     Crore Ayushman Cards have been created".
   - Out-of-pocket (National Health Accounts): PIB 2265816 (27/05/2026, NHA 2022-23,
     `pib_2265816_nha_2022-23.txt`): "Between 2013-14 and 2022–23, the share of OOPE in THE declined
     significantly by nearly 21 percentage points, from 64.2% to 43.4%." PIB 2058791 (25/09/2024,
     `pib_2058791_nha_2021-22.txt`): "the share of Out-of-Pocket Expenditure (OOPE) in THE declined
     from 62.6% to 39.4%" (2014-15 to 2021-22). Use 43.4% (2022-23) as latest.
   - CAG Report No. 11 of 2023 (tabled 08/08/2023, https://cag.gov.in/en/audit-report/details/119060,
     PDF https://cag.gov.in/en/audit-report/download/119060, `cag_report11_2023_pmjay.txt`,
     `cag_report11_2023_details_page.txt`; audit period Sept 2018 to March 2021):
     Executive summary (para 4.9, page 32): "(13,418) beneficiaries were charged for their treatment
     in empanelled EHCPs resulting in" + "increase in out-of-pocket expenditure of beneficiaries."
     Meghalaya, para 4.9: "13,418 (69 per cent) had to pay an additional amount" + "of ₹ 12.34 crore
     at the time of discharge." Jharkhand: "36 patients of Life Care Hospital," ... "paid varying
     amounts for purchase of medicines, injections, blood, etc." NHA's reply: "NHA replied (August
     2022) that the out-of-pocket expenditure may be due to non-availability".
     Grievances (para 7.5.1 (i), page 76): "Out of 37,903 grievances, only 3,718 complaints (9.80 per
     cent) were redressed within turn-" + "around-time and 33,100 complaints (87.33 per cent) redressed
     beyond turn-around-time." Chhattisgarh: "Out of 40 grievances received, SHA Chhattisgarh had not
     redressed any grievance."
   - Denial case (official): PIB 2091572 (09/01/2025, NHRC, Hindi, `pib_2091572_nhrc_denial_case.txt`):
     NHRC took suo motu cognisance of a 72-year-old who died by suicide after Kidwai Memorial
     Institute of Oncology, Bengaluru, refused the senior-citizen cover: "अस्पताल ने उसे वरिष्ठ नागरिकों
     को दी जाने वाली योजना का लाभ देने से यह कहते हुए इनकार कर दिया कि इस संबंध में राज्य सरकार के आदेश
     अभी तक नहीं आए हैं।" (a media report taken up by NHRC; not a finding).

9. **Grievance counts in Parliament/PIB.** Only: PIB 1595202 (06/12/2019, Lok Sabha,
   `pib_1595202_assessment_2019.txt`): "So far, 346 such complaints were received at NHA
   helpline/grievance portal that were resolved with the help of concerned SHA." (complaints about
   denial of treatment). Plus CAG 37,903 (item 8). NOT FOUND: any 2024–2026 Parliament/PIB count of
   PM-JAY grievances, or of grievances about hospitals charging money (searched PIB/sansad for
   'grievances received AB-PMJAY', 'CGRMS grievances state-wise', 'hospital charged beneficiary';
   PAC Report 151 on eparlib.sansad.in timed out).

10. **Official Hindi terms** (PIB 2082304, 09/12/2024, Hindi of 2082288,
    https://pib.gov.in/PressReleseDetailm.aspx?PRID=2082304, `pib_2082304_hindi_vayvandana_25lakh.txt`):
    "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना", "आयुष्मान वय वंदना कार्ड", "आयुष्मान ऐप",
    "सूचीबद्ध अस्पताल", "टोल-फ्री नंबर 14555", "1800110770 पर मिस्ड कॉल"; top-up: "अपने लिए प्रति वर्ष 5
    लाख रुपए तक का अतिरिक्त टॉप-अप कवर मिलता है". "आयुष्मान कार्ड": PIB note 160080 (22/09/2026, Hindi,
    `pib_note160080_hindi_2026.txt`): "के पास पहले से ही आयुष्मान कार्ड हैं". Grievance terms, PIB 2116412
    (28/03/2025, Hindi of 2116209, `pib_2116412_hindi_update_mar2025.txt`): "अस्पताल योजना के पात्र
    लाभार्थियों को उपचार देने से इनकार नहीं कर सकते", "केन्द्रीयकृत शिकायत निवारण प्रबंधन प्रणाली
    (सीजीआरएमएस)", "केन्द्रीय एवं राज्य कॉल सेंटर (14555)", "राज्य स्वास्थ्य एजेंसियों", "तीन-स्तरीय शिकायत
    निवारण प्रणाली". Abbreviation in Hindi PIB: "एबी पीएम-जेएवाई".

### NOT confirmed, do not say (summary)
1800-11-4477; hospitals.pmjay.gov.in; mera.pmjay.gov.in (old); 'age as per Aadhaar'; Ration
Card/Voter ID as substitute for Aadhaar; SECC 'exclusion' criteria (not in any saved official text);
a refund rule or refund deadline; a fixed grievance resolution date; any CGRMS / beneficiary portal
menu path; 2024–2026 grievance counts.

11. **Removed from the brief's flow:** the "which state" step. No official text we saved gives a
    State Health Agency contact per State, and portability (item 5) makes the answer the same in
    every State; the app says "letter to your State Health Agency" without an address.
12. **Wording rules for the app.** Cover = "up to Rs 5 lakh per family per year" (item 1), only in
    the explanation, never in the letter. Grievance time = "the grievance guidelines aim at 15 to 30
    days (CAG 2023)", never a promised date. Never "free", "refund", "you will get"; say the package
    is meant to be cashless and the hospital "cannot deny treatment" (PIB 2243769).
