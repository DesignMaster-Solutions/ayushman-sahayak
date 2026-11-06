# Prompt given to Claude Code inside the AgentFoundry terminal

Build Ayushman Sahayak in this folder, following BRIEF.md. The section "Verified on 06/11/2026" of
BRIEF.md is the only source of rules, paths, phone numbers and figures: where it differs from the
text above it, it wins. Never invent a rule, number, deadline, helpline, URL or menu path. Copy the
structure and style of the sibling project ../bhugtan-sahayak (read its worker.js, stats.html,
app.js counter lines with ?nostats, tests/, .assetsignore, wrangler.toml, README), but do not modify
it or any other folder outside this one. Do not deploy and do not open any issue: stop after the
last commit and push.

## Files

index.html, styles.css, app.js, rules.js, i18n.js (en + hi), worker.js, stats.html, package.json
({"name":"ayushman-sahayak","private":true,"license":"MIT","type":"module","scripts":{"test":"node --test"}}),
wrangler.toml (name "ayushman-sahayak", same account_id as ../bhugtan-sahayak, assets + Durable
Object Counter, run_worker_first ["/api/*"]), .assetsignore (same as ../bhugtan-sahayak, which
already ignores sources/, evidence/, AGENT_PROMPT.md, BRIEF.md, tests, video), .gitignore,
tests/*.test.mjs, README.md. No framework, no dependency, shipped assets under 100 KB, works on 3G.

## The app never asks for Aadhaar, card, ration card, phone, bill number or name. No free-text field.

## rules.js (pure, no DOM)

Inputs: `stage` in before | admitted | discharged;
`situation` in not_sure (do not know if we are covered) | no_card (covered, no Ayushman card yet) |
not_empanelled (hospital says it is not in the scheme) | card_not_working (card not accepted /
"blocked" / e-KYC fails) | asked_to_pay (deposit, medicines, tests, blood or implants while
admitted) | refused_admission | paid_after_discharge;
`age70` in yes | no | unsure (anyone in the family 70 or older?).

Rule facts (ids, each with the Verified item number it relies on and its official source, a short
plain sentence in en and hi): `cover` (1), `cashless` (1: cashless and paperless), `govt_deemed`
(1: all government hospitals with in-patient services are deemed empanelled), `eligibility` (2:
SECC 2011, RSBY, State expansions, ASHA/AWW/AWH), `vay_vandana` (2: all 70+ irrespective of
income; top-up for 70+ in families already covered, not shared with members below 70; others "on
a family basis"; CGHS/ECHS/CAPF choose one), `card_ekyc` (3: Aadhaar e-KYC at card creation and
Aadhaar authentication when taking services; face, OTP, iris, fingerprint), `arogya_mitra` (3:
every empanelled hospital has a Pradhan Mantri Arogya Mitra; the beneficiary may go straight to an
empanelled hospital), `no_cap` (4), `pre_existing` (4), `pre_post` (4: 3 days before, 15 days
after, incl. diagnostics and medicines), `portability` (5), `package_includes` (6: after admission
all tests, medicines, implants are borne by the hospital, CAG 2023 para 4.9), `cannot_deny` (6:
PIB 2243769), `penalties` (6: de-empanelment, penalty, suspension, FIR; PIB 2157879 figures).

Official checks (`checksFor`): Ayushman App (Android and iOS, "Verify eligibility", "Download
Ayushman e-cards", "Locate empanelled hospitals", "Raise grievances"); beneficiary.nha.gov.in
(https); Ayushman Sarathi on WhatsApp, send "Hi" to +91 72908 23838 (menu items exactly as item 3);
the Arogya Mitra (PM-JAY desk) at the empanelled hospital; a Common Service Centre. For each: name,
url (https where there is one, wa.me link for Sarathi), the exact menu words from item 3 only, and
`needs` = what THAT official channel will ask (Aadhaar e-KYC there, never in our app).

Grievance routes (`grievanceFor`): 14555 (24x7 toll free, tel: link), CGRMS
https://cgrms.pmjay.gov.in (no menu path), Ayushman App "Raise grievances", Sarathi "Register,
Track and Withdraw Grievances", letter or email to the State Health Agency (no address);
1800-110-770 missed call only when age70 is yes or unsure. Never 1800-11-4477, never 14413.

`adviceFor({stage, situation, age70})` returns {rules: [rule ids, ordered], checks: [...],
grievance: [...], sayAtDesk: key, carry: [keys], urgent: bool}. Hard rules (one test each):
- every stage x situation x age70 gives >= 2 rules, >= 1 check and >= 1 grievance route, no
  duplicates, every rule id has a Verified item and an https source;
- asked_to_pay, refused_admission, paid_after_discharge, card_not_working: grievance includes 14555
  AND CGRMS, `cannot_deny` in the rules;
- asked_to_pay: `package_includes` first; paid_after_discharge: `package_includes` and `pre_post`;
- not_empanelled: `govt_deemed` first and the App "Locate empanelled hospitals" and Sarathi "Find
  Nearby Empanelled Hospitals" in checks;
- not_sure and no_card: an eligibility check first (App "Verify eligibility" or Sarathi
  "Eligibility Check under PM-JAY"), `eligibility` in rules;
- card_not_working: `card_ekyc` and the Sarathi "Re-do eKYC" item and the Arogya Mitra;
- age70 yes: `vay_vandana` in the top 3 and 1800-110-770 in grievance; age70 no: no 1800-110-770;
- stage admitted or before with asked_to_pay / refused_admission: urgent true (say: call 14555 now,
  from the hospital);
- `portability` in every result for stage before.

`requestText(input, lang)` builds a short polite request the person shows at the PM-JAY desk or
sends as a complaint, with blank lines "______" for name, hospital, date and card or PM-JAY ID
(filled by hand, never by us), citing the scheme rule for that situation ("empanelled hospitals
cannot deny treatment to eligible beneficiaries"; "after admission all tests, medicines and
implants are part of the package") and asking the hospital to process the treatment under PM-JAY /
asking the grievance officer to look into it. It must never contain "free", "refund", "will get",
"guarantee", "मुफ्त", "मिल जाएगा", "गारंटी", "वापस", any rupee amount (₹, Rs, rupee, रुपये, lakh,
लाख), any 10- or 12-digit number, or medical advice (no drug, test or treatment named as advice).

## Screens (one step per screen, big buttons with icon + word, 360 px first)

1. Where are you (before going / admitted now / discharged). 2. What happened (7). 3. Anyone in the
family 70 or older (yes / no / not sure). Result card: "What the scheme says" (rules, each with
its source line and link), "Check officially" (checks), "Say at the PM-JAY desk" (one short line),
"What to keep" (bills, receipts, discharge summary; Aadhaar for e-KYC at the official channel),
"Complain if refused" (grievance, 14555 as a big tel: button), the ready request (Hindi or English,
toggle), "Read aloud" (speechSynthesis hi-IN / en-IN, hidden when no voice), "Copy", "Send on
WhatsApp" (wa.me/?text=). Box "Did it work?" Yes / No / Not yet. If urgent, a red bar on top:
"Call 14555 now". Footer: "Not a government service. Rules from PIB, Parliament answers and the
CAG audit, linked in the README" and "No medical advice". Never promise treatment will be free or
a claim approved. Language toggle EN / हिंदी on every screen, remembered in localStorage; ?lang=hi
works. Hindi: write it yourself in plain everyday Hindi using the official Hindi terms of Verified
item 10 (no paid API).

## Counter and /stats

worker.js like ../bhugtan-sahayak: POST /api/event {event, lang, situation?}, events: result,
copy, share, worked_yes, worked_no, worked_notyet; `situation` only on result and only one of the 7
ids; stored as total / per language / per day / per situation in one Durable Object; GET
/api/stats; nothing else stored (no stage, age or IP). app.js sends with navigator.sendBeacon and
nothing when the URL has ?nostats (same `const NOSTATS =` / `const count =` lines as
../bhugtan-sahayak so a test can run them). stats.html shows totals, by language, by day, by
situation, and "Did it work?".

## Tests (node --test), written before the code they test

The hard rules above, one test each; requestText forbidden words and numbers in both languages and
the blanks kept; no output of any rules.js function contains a 12-digit number or 1800-11-4477;
every phone number shown is one of 14555, 1800-110-770, +91 72908 23838; en and hi have exactly
the same keys and no empty string; worker counts valid events and rejects bad ones (405, 400, 404,
unknown situation); ?nostats sends nothing; real cases: evidence/real-cases/cases.json, for every
case with a situation, replay adviceFor with that situation (stage from the case, or every stage
when null; age70 every value) and assert the result has a grievance route and `cannot_deny` or
`govt_deemed`, and that every quote in the case is found word for word in its source file. After
the tests pass, do a mutation check: break one rule at a time (asked_to_pay without CGRMS; drop
package_includes; show 1800-110-770 for age70 no; let requestText say "free"; remove one hi key),
run the tests, confirm a test fails, restore. Write what you mutated and which test caught it in
README.

## README

What it does, run it (npm test, npx wrangler dev), deploy, every rule with its Verified item and
official link, the size and severity figures from item 8 (word for word, with date), real cases
(link evidence/real-cases/README.md), privacy (what is counted, nothing else), limits (the official
portals pmjay.gov.in / nha.gov.in / cgrms do not open from outside India, so rules come from PIB,
Parliament answers and CAG; the Hindi was written by an AI agent and needs a native speaker
review; no State Health Agency addresses), how it was built in AgentFoundry with Claude Code
against BRIEF.md and this prompt, MIT license. Commit after each working step with conventional
commits and push to origin main.
