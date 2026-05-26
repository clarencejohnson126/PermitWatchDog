# PermitWatchDog — Evals v0.2

**Companion to:** `SPEC.md` v0.2. Every eval here maps to one row of `SPEC.md` Section 6 (Definition of Done). When the spec changes, evals change. They move as a pair.

**How to read this file:**
- Each eval has a **type** (deterministic / reference / LLM-as-judge / regression / business), a **trigger** (when it runs), a **pass criterion**, and a **how-to-run** stub.
- Evals E1, E3, E4b, E6 run on every output or every day — they're on the production critical path.
- The product ships when D1–D9 are green for 14 consecutive days against the Mannheim pilot AND the XPRIZE business metrics are met.

---

## Deterministic evals (binary, automatable, run unattended)

### E1 — Scraper completeness (maps to D1)
- **Type:** Deterministic + manual ground-truth labelling.
- **Trigger:** Daily, after 03:00 run completes.
- **What it does:** For each eval day, a human (initially Clarence) maintains a ground-truth list of filings published at Mannheim Bauamt in the prior 24h (10 min/day). The eval queries our ingestion DB and computes capture ratio.
- **Pass criterion:** `captured / ground_truth ≥ 0.98` averaged over 14-day window.
- **How to run:** `python evals/E1_scraper_completeness.py --date YYYY-MM-DD`.
- **Hardening:** post-v0.1, replace manual ground truth with a second scraper running on a different stack as adversarial check.

### E3 — Time to delivery (maps to D3)
- **Type:** Deterministic, fully automated.
- **Trigger:** Daily, on cron completion.
- **What it does:** Reads Outlook Graph API for the latest draft's `lastModifiedDateTime` per subscriber; subtracts cron-start; asserts < 06:00 local.
- **Pass criterion:** ≥ 99% of runs over 14-day rolling window.
- **How to run:** `python evals/E3_delivery_time.py --window 14`.

### E6 — Cost per user-day (maps to D6)
- **Type:** Deterministic, fully automated.
- **Trigger:** Daily, 06:30 local.
- **What it does:** Pulls Gemini API + Cloud Run + scraping-service billing; divides by active-user count per tier.
- **Pass criterion:** `daily_spend / active_users ≤ €0.50` (T0) / `≤ €5` (T2+) on 7-day rolling mean.
- **How to run:** `python evals/E6_cost.py --window 7 --tier T0`.
- **Alert behavior:** breach → Outlook draft to Clarence.

### E7 — Data sovereignty / egress audit (maps to D7)
- **Type:** Deterministic, weekly automation.
- **Trigger:** Sundays, 04:00 local.
- **What it does:** Scans Cloud Run egress logs + Gemini API request logs from prior 7 days. Greps for any of: customer blueprint filename fragments, Flurstück numbers, contractor legal names, project addresses. One match = HALT.
- **Pass criterion:** Zero matches.
- **How to run:** `python evals/E7_egress_audit.py --week YYYY-WW`.
- **Alert behavior:** match → CRITICAL Outlook draft to Clarence + freeze next day's run until ack'd.

---

## Reference-based evals (compare to ground truth from human review)

### E2 — Relevance precision (maps to D2)
- **Type:** Reference-based; ground truth = subscriber thumbs-tap.
- **Trigger:** Each alert delivered.
- **What it does:** Email/alert includes postscript `[👍 relevant / 👎 nicht relevant — bitte tippen]` with mailto-tracking links. Tap → labelled record in Google Sheet.
- **Pass criterion:** Thumbs-up rate ≥ 90% over 14-day window, min 20 labelled alerts.
- **How to run:** `python evals/E2_relevance.py --window 14`.

### E5a — Risk-flag HIGH precision (maps to D5a)
- **Type:** Reference-based; subscriber confirms in retrospect.
- **Trigger:** Each `HIGH`-flagged alert.
- **What it does:** Daily-tap mechanism also captures "was this actually HIGH in hindsight?" (asked one week later, after architect response).
- **Pass criterion:** `confirmed_high / labeled_high ≥ 0.80` over 14-day window, min 5 `HIGH` alerts.

### E5b — Bestandsschutz suppression correctness (maps to D5b — REWRITTEN in v0.2)
- **Type:** Reference-based, weekly architect/legal review of *suppressed* alerts.
- **Trigger:** Sundays, 18:00 local.
- **What it does:** Digest email lists every alert suppressed under `NO_IMPACT_BESTANDSSCHUTZ` (and `NO_IMPACT_OTHER`) in the prior 7 days. Customer or their architect reviews. Any alert that should have escaped suppression (e.g., the change actually triggers Gefahrenabwehr) gets marked.
- **Pass criterion:** `correctly_suppressed / total_suppressed ≥ 0.98` over 14-day window.
- **How to run:** `python evals/E5b_bestandsschutz_suppression.py --week YYYY-WW`.
- **Why this matters more than v0.1's E5b:** in v0.1 we only tracked "missed alerts" (false negatives). In v0.2, the Bestandsschutz layer means the suppression engine itself has correctness stakes. Wrong suppression → customer loses their early-warning advantage on the rare cases where the four-layer doctrine doesn't apply.

---

## LLM-as-judge / rubric evals

### E4 — Draft quality (architect-scored, 6 dimensions in v0.2 — UPDATED)
- **Type:** Rubric-based; ground truth = architect.
- **Trigger:** Every alert that the contractor approves and sends.
- **What it does:** Sent email includes 30-second Google Form: architect scores 6 dimensions, 1–5 each:
  1. Formal DE Bauwesen-Sprachton
  2. Sachlich korrekt in Bezug auf Projektfakten
  3. Grammatisch saubere, juristisch tragfähige Sätze
  4. Keine erfundenen Paragrafen, DIN-Normen, Bauantrag-Nummern
  5. Klare, umsetzbare Bitte an den Architekten
  6. **NEW v0.2: Respektiert Bestandsschutz / Vertrauensschutz / Übergangsregelung korrekt** — does the draft correctly identify the applicable legal stance given the project's lifecycle stage and the nature of the change?
- **Pass criterion:** Mean across all 6 dimensions ≥ 4.0/5.0 over ≥ 10 architect-scored drafts. **Dimension 6 specifically ≥ 4.0** (legal-correctness floor — see SPEC §5 Constraints).
- **How to run:** `python evals/E4_draft_quality.py --window 14`.

### E4b — Automated draft quality gate (LLM-as-judge, inline — UPDATED)
- **Type:** LLM-as-judge, runs **before** the draft lands in Outlook.
- **Trigger:** Every draft.
- **What it does:** Second Gemini 2.5 Pro call scores the same 6 dimensions as E4. If ANY dimension scores ≤ 3 (in v0.2, dimension 6 has hard threshold ≤ 4 — legal correctness is non-negotiable), the draft is **not** placed in Outlook; logged `BLOCKED_BY_E4B` with reasoning to a review queue.
- **Pass criterion:** ≤ 5% of drafts blocked over 7-day window. Monthly E4 vs E4b mean-absolute-error ≤ 1.0.
- **How to run:** Embedded in Drafting-subagent pipeline. Calibration: `python evals/E4b_calibration.py --month YYYY-MM`.
- **Why this is the most important eval in the file:** runs on every output, stands between hallucinated Paragrafen + incorrect legal stance and the architect's inbox. Without E4b you ship slop AND legal misadvice. With E4b, worst case is a *blocked* output — not a wrong one in front of a paying enterprise customer.

---

## Regression evals (run on every model upgrade / prompt change)

### E8 — Golden-set regression (maps to all of Section 6)
- **Type:** Frozen golden set.
- **Trigger:** Every model upgrade (Gemini 2.5 → 2.6 → 3.0), every prompt change to any subagent, every dependency bump. Required before any deploy.
- **What it does:** Frozen set: 25 historical Mannheim Bauamt filings × 5 synthetic but realistic active projects × 5 lifecycle-stage variants per project (= 125 test cases). Stored under `evals/golden_set/`.
- **Pass criterion:**
  - Risk-flag classification matches expected on ≥ 115/125 cases.
  - E4b automated draft quality averages ≥ 4.0 across the cases.
  - **NEW v0.2:** Bestandsschutz suppression decisions match expected on ≥ 123/125 cases (legal correctness is a near-floor).
  - Zero pipeline-level errors.
- **How to run:** `python evals/E8_golden_set.py --version vX.Y`. Output: diff report. CI gate.
- **Versioning:** golden set itself versioned. When team agrees an expected output should change, golden set gets a new tag — never silently edited.

---

## Business evals (NEW v0.2 — required for XPRIZE judging)

### E9 — Arms-length revenue & MRR (maps to D8 — NEW)
- **Type:** Business metric, automated against Stripe + CRM.
- **Trigger:** Daily, 23:00 local.
- **What it does:** Reads Stripe customer roster. For each subscriber, classifies as:
  - **Arms-length** — no pre-existing relationship with Clarence/Rebelz before May 19, 2026.
  - **Related-party** — pre-existing warm-pipeline contact, family, team member, related entity.
  Computes: total MRR (arms-length only), MRR by calendar month May/June/July/August 2026, arms-length subscriber count.
- **Pass criterion (for hackathon shippable):**
  - ≥ 50 arms-length paying subscribers by Aug 17, 2026.
  - Arms-length MRR ≥ €1,500 by Aug 17, 2026.
  - Month-over-month growth in arms-length MRR across May → August (no decline).
- **How to run:** `python evals/E9_revenue.py --month YYYY-MM`.
- **Reporting format:** matches XPRIZE deliverable schema (Total Revenue + Revenue by Month + Related-Party-Revenue disclosed separately).

### E10 — AI-native business operations (maps to D9 — NEW)
- **Type:** Operations-audit metric.
- **Trigger:** Weekly, Sundays 12:00.
- **What it does:** Computes the share of operational decisions executed by agents (logged + audited) versus by Clarence directly. Tracked across 4 operations buckets:
  - **Acquisition** — outbound email drafted, sent, follow-up scheduled
  - **Onboarding** — new-subscriber email, Gemeinde+Flurstück intake, first-alert priming
  - **Support** — inbound question parsed, response drafted, escalated only if needed
  - **Billing** — Stripe subscription event handled, invoice reconciliation, dunning
- **Pass criterion:** ≥ 80% of decisions across all 4 buckets executed by agents (with auditable agent-execution logs), for the 30 days preceding submission.
- **How to run:** `python evals/E10_ai_native_ops.py --window 30`.
- **Why this matters:** XPRIZE Criterion 2 ("Teams must run their business through AI") is one of the three equally-weighted judging dimensions. Without E10, we have no evidence to present to judges. The agent-execution logs themselves become the deliverable.

---

## Optional / scaffolding evals (v0.2 nice-to-have)

### E11 — WebMCP endpoint conformance
- **Type:** Deterministic spec compliance.
- **Trigger:** Every deploy to `mcp.permitwatchdog.com`.
- **What it does:** Runs MCP protocol conformance test against the public + authenticated tools. Verifies that Antigravity-IDE agents and Gemini agents can successfully invoke each tool and get expected response shape.
- **Pass criterion:** 100% of declared tools respond correctly within 3 seconds.
- **How to run:** `python evals/E11_webmcp_conformance.py`.
- **Why optional:** if WebMCP rollout slips, the rest of v0.1 still ships.

---

## Coverage matrix (eval → spec D-row)

| D-row | Eval(s) | Type | In production critical path? |
|-------|---------|------|------------------------------|
| D1 (scraper completeness) | E1 | deterministic + manual GT | Yes (daily) |
| D2 (relevance precision) | E2 | reference (subscriber tap) | Yes (daily) |
| D3 (time to delivery) | E3 | deterministic | Yes (daily) |
| D4 (draft quality, 6 dim) | E4, **E4b** | rubric + LLM-judge inline | E4b every draft, E4 weekly |
| D5a (HIGH precision) | E5a | reference | Yes (per HIGH alert) |
| D5b (Bestandsschutz suppression correctness) | E5b | reference (weekly digest) | Yes (weekly) |
| D6 (cost) | E6 | deterministic | Yes (daily) |
| D7 (data sovereignty) | E7 | deterministic (egress audit) | Yes (weekly) |
| **D8 (arms-length revenue)** | **E9** | **business metric** | **Yes (daily)** |
| **D9 (AI-native ops)** | **E10** | **operations audit** | **Yes (weekly)** |
| All of §6 (regression) | E8 | golden set | On every deploy |
| (WebMCP scaffolding) | E11 | spec conformance | On every WebMCP deploy |

12 evals total. Every D-row covered. Seven run on every output or every day; the rest run weekly or per-deploy.

---

## What evals do NOT cover (and that's intentional)

- **Subscriber emotional satisfaction with the AI tone.** Indirectly captured via E2 thumbs-up rate + retention metrics.
- **Whether subscribers *use* the dashboard.** That's a product analytics question (DAU / WAU / session metrics), not a correctness eval. Lives in a separate analytics layer.
- **Long-tail Bauamt formats** (image-scanned 1980s PDFs, hand-written Sitzungsprotokolle). Handled by SPEC edge cases via downgrade-with-flag, not evals.
- **The XPRIZE submission video itself.** That's an artifact, not a product. Separate review.
- **Mannheim Bauamt partnership status.** Not measurable by code; tracked in the strategy doc and the LoS deliverable.

---

*End of EVALS v0.2. Companion: `SPEC.md`.*
