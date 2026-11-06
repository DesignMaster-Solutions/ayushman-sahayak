# Ayushman Sahayak (आयुष्मान सहायक)

A free, open-source helper for a family at a hospital, or about to go to one, that holds (or should
hold) **Ayushman Bharat PM-JAY** cover and is being **refused, asked to pay, or does not know whether
it is covered**.

In three taps (where are you, what happened, is anyone in the family 70 or older) it shows:

- **What the scheme says**, each rule with its official source and link;
- **Check officially**: the Ayushman App, beneficiary.nha.gov.in, Ayushman Sarathi on WhatsApp, the
  Pradhan Mantri Arogya Mitra (PM-JAY desk) at the hospital, a Common Service Centre, with the exact
  menu words and what that official channel will ask for;
- **Say at the PM-JAY desk**: one short line;
- **What to keep**: bills, receipts, discharge summary; Aadhaar for the e-KYC at the official channel;
- **Complain if refused**: 14555 as a big call button, CGRMS, the App, Sarathi, a letter to the State
  Health Agency, and the 70+ missed call 1800-110-770 when it applies;
- a **ready request** in Hindi or English, with blanks filled by hand, plus Read aloud, Copy and
  Send on WhatsApp; and a red **"Call 14555 now"** bar when the family is being asked to pay or
  refused before or during admission.

It **never asks for Aadhaar, card, ration card, phone or bill number, or a name**, and has no
free-text field. It never promises treatment will be free or a claim approved, names no amount
anyone will get back, and gives no medical advice.

Entry for *Code for a Billion 2026*, track **Health**.

- Static web app: `index.html`, `app.js`, `rules.js`, `i18n.js`, `styles.css`, `stats.html`. No
  framework, no dependency, no paid API, no cookies, no account. 59,927 bytes shipped in total
  (test: under 100 KB), so it loads on a cheap phone over 3G. One step per screen, big buttons with
  an icon and a word, designed for 360 px first. English and Hindi on every screen (remembered on
  the device; `?lang=hi` also works).
- `worker.js` is a tiny Cloudflare Worker that only counts anonymous events (see *Privacy*).

## Run it

Requirements: Node.js 20+ (only for the tests and `wrangler`).

```sh
npm test            # node --test: rules, request text, strings, counter, ?nostats, real cases
npx wrangler dev    # app + counter at http://localhost:8787
```

The app uses ES modules, so open it through a server, not as `file://`. Add `?nostats` to any URL
to keep test visits out of the public counter.

### Deploy (Cloudflare Workers static assets)

`wrangler.toml` deploys the folder as static assets under the Worker name `ayushman-sahayak`;
`worker.js` answers only `/api/*` (`run_worker_first`), with a SQLite-backed Durable Object
(`Counter`, migration `v1`). `.assetsignore` keeps tests, sources, evidence, docs and config out of
the upload. Both fit in the free plan.

```sh
npx wrangler login
npx wrangler deploy
```

## How it decides

`rules.js` holds pure functions with no DOM:

- `adviceFor({stage, situation, age70})` returns `{rules, checks, grievance, sayAtDesk, carry, urgent}`.
- `checksFor({situation})` returns the official checks `{id, url, menu, needs}`.
- `grievanceFor({age70})` returns the grievance routes.
- `requestText(input, lang)` builds the request, with `______` blanks for name, hospital, date and
  card or PM-JAY ID.

Hard rules, each enforced by a test in `tests/rules.test.mjs`:

- every stage x situation x age answer gives at least 2 rules, 1 official check and 1 grievance
  route, with no duplicates, and every rule has a Verified item and an https source whose quote is
  found word for word in `sources/`;
- asked to pay, refused admission, paid after discharge and card not working: 14555 and CGRMS, and
  "cannot deny treatment";
- asked to pay: "package includes" first; paid after discharge: "package includes" and the
  3 days before / 15 days after cover;
- hospital says it is not in the scheme: "government hospitals are deemed empanelled" first, plus
  App "Locate empanelled hospitals" and Sarathi "Find Nearby Empanelled Hospitals";
- not sure / no card: an eligibility check first and the eligibility rule;
- card not working: Aadhaar e-KYC rule, Sarathi "Re-do eKYC" and the Arogya Mitra;
- anyone 70+: Ayushman Vay Vandana in the top 3 and the missed call 1800-110-770; nobody 70+: that
  number is never shown;
- before or during admission and asked to pay / refused: urgent (call 14555 now, from the hospital);
- before going: portability is always shown;
- the only phone numbers anywhere are 14555, 1800-110-770 and +91 72908 23838; never 1800-11-4477
  or 14413; no output contains a 12-digit number;
- the request never says "free", "refund", "will get", "guarantee", "मुफ्त", "मिल जाएगा", "गारंटी",
  "वापस", names no amount (₹, Rs, rupee, lakh, रुपये, लाख) and no 10- or 12-digit number.

## Every rule and its source

Each rule was read in the official source on 06/11/2026; a text copy is in `sources/` (first line =
URL fetched and date). "Item n" is the numbered item of "Verified on 06/11/2026" in `BRIEF.md`.

| Rule | What the app says | Item | Official source |
|---|---|---|---|
| `cover` | Up to Rs 5 lakh per family per year for secondary and tertiary hospitalisation | 1 | PIB 2203007 (12/12/2025, Rajya Sabha), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2203007> |
| `cashless` | Completely cashless and paperless | 1 | PIB 1738169 (23/07/2021, Lok Sabha), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=1738169> |
| `govt_deemed` | All government hospitals with in-patient services are deemed empanelled | 1 | PIB 2116209 (28/03/2025, Lok Sabha), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2116209> |
| `eligibility` | SECC 2011 (6 deprivation, 11 occupational criteria), RSBY families, State expansions, ASHA/AWW/AWH since March 2024 | 2 | PIB 2116209; PIB 2313393 (22/09/2026), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2313393>; PIB 2148359 (25/07/2025), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2148359> |
| `vay_vandana` | Everyone 70+ irrespective of income; top-up for 70+ in families already covered, not shared with members below 70; others "on a family basis"; CGHS/ECHS/CAPF choose one | 2 | PIB 2053881 (11/09/2024, Cabinet), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2053881> |
| `card_ekyc` | Aadhaar e-KYC at card creation and Aadhaar authentication when taking services; face, OTP, iris, fingerprint | 3 | PIB 2099542 (04/02/2025, Rajya Sabha), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2099542>; PIB 2210432 (01/01/2026), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2210432> |
| `arogya_mitra` | Every empanelled hospital has a Pradhan Mantri Arogya Mitra; the beneficiary may go straight to an empanelled hospital | 3 | PIB 1781268 (14/12/2021, Rajya Sabha), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=1781268> |
| `no_cap` | No cap on family size; all members irrespective of age and gender | 4 | PIB 2203007 |
| `pre_existing` | Pre-existing conditions covered from the first day | 4 | PIB note 153181 (Sep 2024), <https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=153181&ModuleId=3&reg=48&lang=2> |
| `pre_post` | 3 days before and 15 days after, including diagnostics and medicines | 4 | PIB note 153181 |
| `portability` | Any empanelled public or private hospital across India | 5 | PIB note 153181 |
| `package_includes` | After admission all tests, medicines, implants are borne by the hospital (in the package amount) | 6 | CAG Report 11 of 2023, para 4.9, page 32, <https://cag.gov.in/en/audit-report/download/119060> |
| `cannot_deny` | Empanelled hospitals cannot deny treatment to eligible beneficiaries; CGRMS or 14555 | 6 | PIB 2243769 (23/03/2026, Lok Sabha), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2243769> |
| `penalties` | De-empanelment, penalty, suspension, warning letter, FIR; 3,167 hospitals found guilty | 6 | PIB 2099547 (04/02/2025), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2099547>; PIB 2157879 (19/08/2025), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2157879> |

Official checks and grievance routes:

| Channel | Shown as | Item | Source |
|---|---|---|---|
| Ayushman App (Android and iOS) | "Verify eligibility", "Download Ayushman e-cards", "Locate empanelled hospitals", "Raise grievances" | 3, 7 | PIB 2269699 (06/06/2026), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2269699> |
| beneficiary.nha.gov.in | <https://beneficiary.nha.gov.in> (no menu path: the site did not open from outside India) | 2 | PIB 2110780 (12/03/2025), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2110780> |
| Ayushman Sarathi (WhatsApp, "Hi" to +91 72908 23838) | "Eligibility Check under PM-JAY", "Apply for Ayushman Card", "Download Ayushman Card", "Re-do eKYC", "Find Nearby Empanelled Hospitals", "Register, Track and Withdraw Grievances" | 3, 7 | PIB 2278994 (29/06/2026), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=2278994> |
| Arogya Mitra / Common Service Centre | at the hospital / near you | 3 | PIB 1781268; PIB 2110780 |
| 14555, 24x7 toll free | big call button | 6 | PIB 2243769 |
| CGRMS | cgrms.pmjay.gov.in (no menu path) | 6 | PIB 1984036 (08/12/2023), <https://pib.gov.in/PressReleseDetailm.aspx?PRID=1984036>; PIB 2243769 |
| Letter or email to the State Health Agency | no address | 6, 11 | PIB 2116209 |
| 1800-110-770 missed call (Vay Vandana), only when someone is 70+ or not sure | call button | 6 | PIB 2110780 |
| Grievance time | "the grievance guidelines aim to resolve complaints within 15 to 30 days (CAG audit 2023)"; no date promised | 6 | CAG Report 11 of 2023, page 76 |

What the app deliberately does **not** say, because no official source we could read confirmed it:
1800-11-4477; hospitals.pmjay.gov.in; mera.pmjay.gov.in (old); "age as per Aadhaar"; Ration Card or
Voter ID instead of Aadhaar; SECC exclusion criteria; a refund rule or deadline; a fixed grievance
date; any CGRMS or beneficiary portal menu path; 14413 (the hospitals' line).

## Size and severity

Word for word from the official sources (BRIEF.md, Verified item 8):

- PIB 2313393 / note 160081 (22/09/2026): "about 33% of India's population (over 48.51 crore people)
  already holding Ayushman cards"; "treatment worth upto Rs. 2.03 lakh crore in about 13.25 crore
  hospital admissions through a network of over 38,000 empanelled public and private hospitals (as
  on August 31, 2026)"; "As on 21.09.26, more than 1.36 crore senior citizens have Ayushman Vay
  Vandana cards."
- PIB 2243769 (23/03/2026, Lok Sabha): "As on 28.02.2026, a total of 11.69 crore hospital admissions
  have been authorized under the scheme, including 6.74 crore admissions in private hospitals." and
  "36,229 hospitals, comprising 19,483 public and 16,746 private hospitals."
- PIB 2148359 (25/07/2025, Lok Sabha): "Over 41 Crore Ayushman Cards have been created".
- PIB 2265816 (27/05/2026, National Health Accounts 2022-23): "Between 2013-14 and 2022–23, the share
  of OOPE in THE declined significantly by nearly 21 percentage points, from 64.2% to 43.4%."
- CAG Report No. 11 of 2023 (tabled 08/08/2023, audit period Sept 2018 to March 2021), para 4.9:
  "(13,418) beneficiaries were charged for their treatment in empanelled EHCPs resulting in" ...
  "increase in out-of-pocket expenditure of beneficiaries."; Meghalaya: "13,418 (69 per cent) had to
  pay an additional amount" ... "of ₹ 12.34 crore at the time of discharge."
- CAG, para 7.5.1 (i): "Out of 37,903 grievances, only 3,718 complaints (9.80 per cent) were
  redressed within turn-" ... "around-time and 33,100 complaints (87.33 per cent) redressed beyond
  turn-around-time."
- PIB 2157879 (19/08/2025, Rajya Sabha): "A total of 3,167 hospitals were found guilty of
  irregularities/violations since inception of the scheme, and suitable actions including
  de-empanelment of 1114 hospitals, levying penalty worth Rs. 122 crores on 1504 errant hospitals and
  suspension of 549 hospitals".

## Real cases

Ten published decisions (State Consumer Commissions and High Courts, 2021 to 2026) where a PM-JAY
beneficiary was charged, told the card did not work or the hospital was not empanelled, or refused
admission: [evidence/real-cases/README.md](evidence/real-cases/README.md), facts in
`evidence/real-cases/cases.json`, texts in `evidence/real-cases/sources/`.

`tests/real-cases.test.mjs` checks that every quote in `cases.json` is word for word in its saved
decision, and replays each case with a situation through `adviceFor` (the case's stage, or every
stage when the decision does not say; every age answer): every result has a grievance route and
"cannot deny treatment" or "government hospitals are deemed empanelled".

## Tests and mutation check

`npm test` runs 57 tests (`node --test`): the hard rules above, the request text in both languages
(forbidden words and numbers, blanks kept, rule cited), phone numbers, en/hi keys identical and
non-empty, the counter Worker (valid events counted; 405, 400, 404 and unknown situation rejected;
nothing else stored), `?nostats` on the real counter lines of `app.js`, CSS `[hidden]`, shipped
size under 100 KB, and the real cases.

After the tests passed, each rule below was broken on purpose, the suite run, and the file restored
(06/11/2026). Each mutation made exactly one test fail:

| Mutation | Test that caught it |
|---|---|
| asked to pay without CGRMS | `asked_to_pay, refused_admission, paid_after_discharge, card_not_working: 14555 and CGRMS, cannot_deny` |
| drop `package_includes` from asked to pay | `asked_to_pay: package_includes first` |
| show 1800-110-770 for age70 no | `age70 no: never 1800-110-770` |
| requestText says "free of cost" | `requestText never says free, refund, will get, guarantee (en or hi), no amount, no 10- or 12-digit number` |
| remove the Hindi key `worked_thanks` | `en and hi have exactly the same keys and no empty string` |

## Privacy

The app sends one anonymous event with `navigator.sendBeacon` when a result is shown, a request is
copied or shared, or "Did it work?" is answered: `{event, lang}` and, only on `result`, which of the
7 situations was chosen. The Worker stores counts per event, per language, per day (UTC) and per
situation in one Durable Object, nothing else: no stage, no age answer, no IP, no cookie. Public
numbers: `/stats` (page) and `/api/stats` (JSON). Nothing is sent when the URL has `?nostats`.

## Limits

- pmjay.gov.in, nha.gov.in, beneficiary.nha.gov.in, hospitals.pmjay.gov.in and cgrms.pmjay.gov.in do
  not open from outside India (and the Wayback Machine blocked us), so the rules come from PIB
  (Parliament answers, press notes, backgrounders), the CAG audit and one MoHFW hospital page. The
  live menus of CGRMS and the beneficiary portal are not confirmed and not shown.
- No State Health Agency addresses: no official text we saved gives them, and portability makes the
  answer the same in every State.
- The Hindi was written by an AI agent and needs a native speaker's review.
- The app cannot see anyone's eligibility; it points to the official channels that can.
- Not a government service. No medical advice.

## How it was built

Built in the **AgentFoundry IDE** with **Claude Code** running in the AgentFoundry integrated
terminal, against `BRIEF.md` (scope and the "Verified on 06/11/2026" rules) and `AGENT_PROMPT.md`
(the single build prompt), following the structure of the sibling project Bhugtan Sahayak. Claude
Code wrote the tests first, then `rules.js`, the counter Worker, the bilingual strings, the UI and
`/stats`, ran the mutation check, and committed each working step with conventional commits.

## License

MIT, see [LICENSE](LICENSE).
