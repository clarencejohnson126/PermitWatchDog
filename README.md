# PermitWatchDog

> Regulatory intelligence for DACH construction. Watches Bauämter overnight, warns small contractors and Bauträger when changes affect their projects, drafts the required Bauantrags-Addendum.

**Status:** v0.1 — XPRIZE Build-with-Gemini Hackathon submission scaffolding (Rebelz AI). Submission deadline **2026-08-17 1:00 PM PT**.

---

## What this is

A solo Bauleiter or small Bauunternehmen in Germany operates against a regulatory perimeter that changes constantly — Bebauungspläne, Bauordnung-Amendments, DIN-Norm updates, Bauausschuss decisions, Auslegungs-Verfahren. Large players (Strabag, Hochtief) employ floors of staff lawyers to track this. Small contractors cannot.

PermitWatchDog is an AI agent that:

- Monitors DACH Bauämter overnight (starting with Mannheim) for any published change.
- Cross-references each change against the customer's active projects.
- Applies the four-layer DACH legal doctrine — **Bestandsschutz**, **Vertrauensschutz**, **Verhältnismäßigkeit**, **Übergangsregelungen** — to suppress noise and surface only what actually matters.
- Drafts the revised Bauantrags-Addendum and lands it in the customer's Outlook drafts at 06:00 local — for review before the architect ever sees it.

**The product is regulatory intelligence, not compliance enforcement.** Compliance is the floor; intelligence is the value.

## Architecture

- **Reasoning:** Gemini 2.5 Pro/Flash (hosted) + Gemma 4 with LoRA fine-tuning (on-prem enterprise tier)
- **Orchestration:** Antigravity 2.0 — managed agents + scheduled tasks + dynamic subagents
- **Hosting:** Google Cloud Run, europe-west3 (Frankfurt) — full DE-region data sovereignty
- **Agent protocol:** WebMCP-native at `mcp.permitwatchdog.com` — first DACH civic-data provider on the new protocol
- **Data sources:** Bauamt websites + Amtsblatt PDFs + Ratsinformationssysteme + Bauausschuss-Protokolle. HTML/PDF scraping for v0.1; WebMCP ingestion path stub-ready for when Bauämter publish endpoints.

## Documentation in this repo

| File | What it contains |
|------|------------------|
| `AGENT.md` | Handoff brief for the Antigravity 2.0 agent — locked stack, repo structure, doctrine, decision-gate status |
| `SPEC.md` | Product specification v0.2 — T0–T4 pricing ladder, output shapes, definition of done |
| `EVALS.md` | Eval contract v0.2 — 12 evals (E1–E11) mapped to D1–D9 |
| `demo/PROJECT_PROFILE.md` | Fictional Mannheim Q5,18 demo Bauträger profile used to drive E1–E10 end-to-end |
| `docs/DSGVO.md` | German GDPR / DSGVO operational compliance framework |

## Pricing ladder

| Tier | Price | What the customer shares | What the customer gets |
|------|-------|--------------------------|------------------------|
| T0 | €29/mo | Gemeinde + Flurstück | Plain Bauamt-Alerts |
| T1 | €149/mo | Active project metadata | Project-aware alerts, lifecycle-aware suppression |
| T2 | €499/mo | Blueprints (PDF) | Geometry-aware analysis, drafted Addenda |
| T3 | €2–5K/mo | Workflow + timeline + cost data | Financial impact estimates, architect routing |
| T4 | €5–15K/mo + setup | Historical Bauanträge corpus | Gemma 4 LoRA-tuned, on-prem, air-gapped |

## Open-source scope

The **scraper SDK** (`packages/scraper-sdk/`) is open-sourced for community contributions of per-CMS Bauamt scrapers. The intelligence layer — relevance scoring, drafting, doctrine logic, customer data — is proprietary.

**Open infrastructure, closed intelligence.** Same pattern as Hugging Face, Supabase, Sentry.

## Status

This repository was initialized 2026-05-26 with the foundational specification documents. Implementation begins in Antigravity 2.0 against the `AGENT.md` handoff brief.

## License

Repository overall: proprietary, all rights reserved by Rebelz AI.
Scraper SDK subfolder (`packages/scraper-sdk/`): permissive license (final choice TBD — see `AGENT.md` §10).

---

Built by [Rebelz AI](mailto:clarencejohnson@hotmail.de) for the XPRIZE Build-with-Gemini Hackathon 2026.
