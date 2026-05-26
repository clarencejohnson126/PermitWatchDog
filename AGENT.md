# Agent Guidelines — PermitWatchDog (Antigravity Handoff)

**Handoff date:** 2026-05-26
**Repository:** `github.com/clarencejohnson126/PermitWatchDog`
**Submission entity:** Rebelz AI
**Submission target:** XPRIZE Build-with-Gemini Category 3 (Small Business Services), **deadline 2026-08-17 1:00 PM PT**
**Source-of-truth artifacts in this repo:** `SPEC.md` (v0.2), `EVALS.md` (v0.2), `demo/PROJECT_PROFILE.md`

---

## 1. Mission

PermitWatchDog is an AI agent that monitors DACH Bauämter overnight and tells small construction professionals (solo Bauleiter, Bauunternehmen, Bauträger) what changed that *actually* matters for their projects — with legal-aware reasoning that distinguishes:

- Changes where **Bestandsschutz** suppresses applicability,
- Changes where an **Auflage in the existing Genehmigungsbescheid** pierces Bestandsschutz,
- Forward-pipeline Anträge that are fully exposed to current rules,
- Auslegungen of *neighboring* projects (offensive use case).

v0.1 ships in Mannheim by 2026-08-17 for the XPRIZE submission.

**Critical mindset:** PermitWatchDog is **regulatory intelligence**, not compliance enforcement. Bauträger usually don't HAVE to comply with mid-build rule changes — Bestandsschutz protects them. The product's value is *defense readiness, forward-pipeline awareness, professional liability protection, Auslegung offense, insurance documentation, and time-value of information.* Compliance is the floor; intelligence is the value. Every UI string, email, and pitch line must reflect this.

---

## 2. Hard requirements (non-negotiable; do not propose alternatives)

| Constraint | Source | Compliance check |
|------------|--------|------------------|
| ≥1 Gemini API call in production deployment | XPRIZE rules | Visible in API usage logs |
| ≥1 Google Cloud product in production | XPRIZE rules | Cloud Run satisfies |
| First repo commit dated ≥ 2026-05-19 | XPRIZE newness rule | `git log` audit before any push |
| German UI in Sie/Ihr-Form throughout | DACH market norm | E4 rubric dim 1 |
| Drafts NEVER auto-send to architects — always land in customer's Outlook drafts | SPEC §3 | E4b approval-flow gate |
| Legal-correctness floor: no alert may bypass the four-layer DACH doctrine | SPEC §5 | E4 dim 6, E4b hard threshold |
| Hosted customer data: DE region only (Cloud Run europe-west3) | Data sovereignty | E7 egress audit |
| Zero customer blueprint content in any model log / cache / third-party telemetry | DSGVO + customer trust | E7 weekly audit |
| DSGVO operational mechanics — see §7 below | DE law | `docs/DSGVO.md` checklist |

---

## 3. The locked stack (do not propose alternatives)

| Layer | Choice | Reason |
|-------|--------|--------|
| IDE / dev environment | **Antigravity 2.0** | XPRIZE Criterion 2 implicit weight; managed-agent primitives subsidize orchestration cost |
| Reasoning model — orchestration | **Gemini 2.5 Pro** | XPRIZE Gemini mandate; high-stakes decisions |
| Reasoning model — extraction | **Gemini 2.5 Flash** | Cost-optimized for high-volume filing parsing |
| Reasoning model — T4 on-prem | **Gemma 4** with LoRA on customer corpus | Apache 2 = on-prem deployable; air-gap pitch |
| Compute | **Cloud Run** europe-west3 (Frankfurt) | Auto-scale, DE region, billing fits tokenomics |
| Database | **Cloud SQL (Postgres)** europe-west3 | Project profiles, filings, alerts log |
| Object storage | **Cloud Storage** europe-west3 | Blueprints, Amtsblatt PDFs, signed sync bundles |
| Secrets | **Cloud Secret Manager** | All API keys + service accounts |
| Logging / observability | **Cloud Logging + Cloud Trace** | Native GCP; E10 audit-log evidence |
| Email (drafts) | **Outlook Graph API** | Customer keeps draft control |
| Email (transactional) | **Cloud Tasks + SendGrid** | Hosted delivery for receipts/heartbeats |
| Subscriber auth | **Firebase Auth** (email-link, passwordless) | Lowest friction for German B2B |
| Subscription billing | **Stripe Checkout + Customer Portal** | EU Reverse Charge + MwSt + GoBD-compliant exports |
| Agent protocol | **WebMCP** — provider at `mcp.permitwatchdog.com`, consumer path stub-ready | I/O '26 early-adopter signal; judge-grade |
| Frontend (portal) | **Next.js on Cloud Run** | Single-stack, DE-hosted |
| Frontend (marketing) | **Static Next.js on Cloud Run** | Same stack, separate service |

If you find yourself reaching for Vercel / AWS / OpenAI / non-Cloud-SQL Postgres / SvelteKit — stop and re-read this table. The stack is locked.

---

## 4. Target repository structure

```
PermitWatchDog/
├── README.md                    public-facing project intro
├── AGENT.md                     this file
├── SPEC.md                      product specification v0.2
├── EVALS.md                     eval contract v0.2
├── llm.txt                      published at permitwatchdog.com/llm.txt
├── demo/
│   └── PROJECT_PROFILE.md       fictional Mannheim Q5,18 demo
├── apps/
│   ├── web/                     Next.js subscriber portal
│   ├── marketing/               static marketing site
│   └── mcp-server/              WebMCP provider service
├── services/
│   ├── scraper/                 daily Bauamt scrapers (per-Gemeinde)
│   ├── parser/                  filing-extraction subagent
│   ├── crossref/                Flurstück / radius / paragraph matching
│   ├── scorer/                  relevance + Bestandsschutz reasoning
│   ├── drafter/                 addendum-draft subagent
│   ├── quality-gate/            E4b in-line scorer
│   └── notifier/                Outlook Graph + transactional dispatch
├── packages/
│   ├── scraper-sdk/             OPEN-SOURCE: per-CMS scraper templates + public-data parsers
│   ├── shared-types/            JSON schemas: project profile, filing, alert
│   └── doctrine/                DACH legal-reasoning helpers (Bestandsschutz logic)
├── evals/
│   ├── E1_scraper_completeness.py
│   ├── E2_relevance.py
│   ├── E3_delivery_time.py
│   ├── E4_draft_quality.py
│   ├── E4b_calibration.py
│   ├── E5a_high_precision.py
│   ├── E5b_bestandsschutz_suppression.py
│   ├── E6_cost.py
│   ├── E7_egress_audit.py
│   ├── E8_golden_set.py
│   ├── E9_revenue.py
│   ├── E10_ai_native_ops.py
│   ├── E11_webmcp_conformance.py
│   ├── golden_set/              125 frozen test cases (25 filings × 5 projects × 5 lifecycle stages)
│   └── ground_truth/            daily-labelled filings (Clarence-maintained)
├── infra/
│   ├── cloud-run/               service deployment manifests
│   ├── cloud-sql/               schema migrations
│   └── terraform/               IaC for the GCP project
└── docs/
    ├── DSGVO.md                 AVV templates, retention policy, subprocessor disclosure
    ├── ARCHITECTURE.md          extended tech-flow detail (mirror of permitwatchdog_tech.md)
    └── PARTNERSHIPS.md          Mannheim outreach plan + LoS chain template
```

---

## 5. The four-layer DACH legal doctrine (product DNA — hardcode it)

Every alert decision passes through this hierarchy. The `packages/doctrine/` module encodes it.

1. **Bestandsschutz** — Art. 14 GG; BVerfGE 35, 263. Already-permitted + built-per-permit work is protected from retroactive change.
2. **Vertrauensschutz** — §§ 48–49 VwVfG. Good-faith reliance on a granted Genehmigung survives most revocations.
3. **Verhältnismäßigkeitsprinzip** — Art. 20 III GG. State action must pass Geeignet → Erforderlich → Angemessen.
4. **Übergangsregelungen** — Bauordnung amendments almost always include transition clauses exempting in-progress projects.

**Exceptions that PIERCE protection — alert MUST fire:**

- **Gefahrenabwehr** (imminent danger correction)
- **Original Genehmigung was rechtswidrig** (§ 48 VwVfG Rücknahme grounds)
- **Owner files new Antrag** (Erweiterung / Umbau / Nutzungsänderung) — new rules apply to the new Antrag
- **Explicit Bescheid-Auflage** referencing a DIN/Satzung that has now changed — *this is the most common real-world piercing case; it's exactly what the demo project's Auflagen 04, 12, 17 demonstrate*
- **Explicit retroactive clause** surviving Verhältnismäßigkeit (rare)

**When in doubt: suppress is dangerous, flag-with-explanation is safe.** Better to send `MEDIUM` with a paragraph explaining *"Bestandsschutz greift voraussichtlich, aber Auflage 04 könnte greifen — bitte prüfen"* than to suppress and miss a real edge case.

---

## 6. Eval-first discipline (this is the production gate)

Every feature gets an eval before it ships. No exceptions.

- Before writing code for a new feature: identify which D-row in SPEC §6 it satisfies and which eval verifies it.
- If no D-row exists: stop. Either it's out of scope, or the spec needs an update first.
- **E4b runs on every draft.** **E8 golden-set regression runs on every model upgrade.** **E1, E3, E6, E7 run daily.**
- PRs that touch product code without touching evals are rejected.
- Add new evals only if a new D-row is added to SPEC. Spec and evals move as a pair.

---

## 7. DSGVO / GDPR mechanics (legal requirement)

Detailed plan in `docs/DSGVO.md`. Minimum v0.1 posture:

- **Auftragsverarbeitungsvertrag (AVV)** offered to every paying subscriber **before** first project-data upload (Art. 28 GDPR — required for any project-data sharing).
- **Datenschutzfolgenabschätzung (DSFA)** on file for the LoRA fine-tuning workflow (high-risk processing).
- **Datenschutzerklärung + Impressum + AGB** published before any subscriber signup goes live.
- **Right-to-erasure** mechanic: one-click in the subscriber portal. Legal SLA = 30 days; target = 7 days.
- **Default retention:** 12 months after subscription cancellation, then auto-purge. Configurable per AVV.
- **Cross-border data transfers:** none. All processing in europe-west3.
- **Subprocessor disclosure:** Google Cloud (data processor), Stripe (payment processor), Microsoft Outlook (delivery surface — drafts visible only in subscriber's own Outlook). **No US subprocessors with customer-content access.**
- **Consent UI:** cookie-banner with granular opt-in; no third-party tracking before explicit consent.

---

## 8. Decision-gate status (2026-05-26)

| Gate | Status |
|------|--------|
| 1. Legal entity | ✅ Rebelz AI |
| 2. Mannheim Bauamt URL | ✅ Confirmed (SPEC §10) |
| 3. Pricing | ✅ €29/mo T0 baseline; A/B vs €49 deferred to month 1 |
| 4. Repo URL | ✅ `github.com/clarencejohnson126/PermitWatchDog` |
| **5. Cold-acquisition channel mix** | **⚠️ OPEN — blocks D8 / E9 revenue criterion** |
| 6. DSGVO operational checklist | ⚠️ FRAMEWORK DRAFTED at `docs/DSGVO.md` (2026-05-26) — Datenschutz-Anwalt review pending (§18 open-questions list); DPO appointment by 2026-06-15 |
| 7. Ratsinformationssystem URL (Mannheim) | ⚠️ Minor-open |
| 8. Insurance provider for SLA backing | ⚠️ Open — needed before T3+ enterprise sign |
| **9. Submission video plan** | **⚠️ OPEN — start storyboarding by week 6 latest** |

Bold rows are work the agent MUST surface in early sessions — they cannot be quietly bypassed.

---

## 9. Coworker directives

1. **End every response with a concrete next action.** Not "let me know if you have questions" — propose the specific step or specific question to answer next.
2. **Verify before claiming.** Did you actually run the eval? Did the test pass? Show evidence (output, log, screenshot). Performative claims of done-ness are worse than honest "still in progress."
3. **Stack-faithful.** Don't substitute alternatives to the locked stack (§3). If you genuinely think a swap is warranted, raise it as a question with explicit trade-off — don't quietly replace.
4. **Doctrine-faithful.** Every alert-routing change respects the four-layer DACH hierarchy. Bypass logic = bug, not feature.
5. **Eval-first.** Every PR adding a feature also adds or updates an eval. PRs that touch product code without touching evals get rejected.
6. **German language for everything user-facing.** Sie/Ihr-Form. Bauwesen-Jargon. Default to formal-Sie when uncertain.
7. **Newness-rule discipline.** Never copy code from `~/Desktop/Roar Bliss App/` or any pre-2026-05-19 Rebelz folder. If you need a pattern, study it, then re-implement cleanly inside this repo.
8. **84-day urgency.** Aug 17 is fixed. Every week missed is one week less customer-acquisition time. Bias toward shipping the simplest version that satisfies the relevant D-row, not the most elegant.

---

## 10. Week 1 priorities (do these first)

1. **Scaffold the repo structure** described in §4 above. Empty stubs are fine. Structure first, code later.
2. **First commit dated ≥ 2026-05-19** — verify `git log` before pushing.
3. **Stand up `mcp.permitwatchdog.com` skeleton** — Cloud Run service exposing the 3 public WebMCP tools with placeholder responses.
4. **Mannheim Bekanntmachungen scraper** — target `mannheim.de/de/wirtschaft-entwickeln/oeffentliche-bekanntmachungen-aktuelle-planverfahren-vergaben` + Amtsblatt PDFs at `mannheim.de/de/amtsblatt-der-stadt-mannheim/amtsblatt-2026`. Daily cron, output to Cloud SQL `filings` table.
5. **Implement E1 (scraper completeness) and E3 (delivery time)** as the first two evals. The product can't ship without these green.
6. **Publish `permitwatchdog.com/llm.txt`** defining agent terms-of-use.
7. **Draft (do not send) the Mannheim Digitalisierungsbeauftragte outreach email** — review with Clarence before sending.
8. **Draft `docs/DSGVO.md`** with the §7 checklist as the table of contents.

---

## 11. Pointers to external context

- **Strategic memory** (auto-loaded in Claude Code sessions): `~/.claude/projects/-Users-clarence-Desktop-AGENTIC-ENGINEERING/memory/permitwatchdog_strategy.md`, `permitwatchdog_tech.md`, `permitwatchdog_xprize.md`, `project_permit_watchdog.md`.
- **Five Pillars of Agentic Engineering** (the meta-doctrine driving this whole project): `~/.claude/CLAUDE.md`. PermitWatchDog is Clarence's first end-to-end test of "build the system that builds the system."
- **I/O 2026 source transcripts** that informed the stack decisions: `~/Desktop/REBELZ AI AGENCY 2026/.claude/skills/google io_rebelzai_audio debate.md`, `google_io_agentic_keynote.md`, `13-roar-bliss-app/poc/google_io_developer_keynote.md`.
- **Roar Bliss App** at `~/Desktop/Roar Bliss App/` is a separate Antigravity project (motivational-audio). Read-only reference for `.antigravitycli` and `AGENT.md` patterns. **NEVER edit Roar Bliss when working on PermitWatchDog.**

---

## 12. Anti-patterns (things that have killed similar projects)

- **Vibe coding without evals.** If you can't measure correctness, you have hope, not a product.
- **Slop drafts to the architect.** One hallucinated DIN-Norm in front of a real Bauträger's architect = subscription cancelled + reputation damage. E4b exists for this reason.
- **Treating Bestandsschutz as a footnote.** It's the core legal reasoning of the product. Get it wrong and the alerts are noise, then nobody pays.
- **Over-investing in scope before revenue.** The hackathon requires real arms-length revenue by Aug 17. Acquisition starts week 1, not week 10.
- **Believing the warm pipeline counts as headline revenue.** It doesn't (XPRIZE related-party rule). Cold acquisition is non-negotiable.
- **Substituting OpenAI / non-Google for Gemini "just for one little call."** This breaks XPRIZE rule + judge optics. Full Google stack, end-to-end.

---

*End of AGENT.md. When this file changes, the agent's behavior changes. Treat updates with the same care as production-code commits.*
