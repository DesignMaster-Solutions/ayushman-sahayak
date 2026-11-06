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
