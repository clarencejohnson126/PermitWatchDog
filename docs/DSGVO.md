# DSGVO / GDPR Compliance Framework — PermitWatchDog

**Status:** Operational framework draft, 2026-05-26.
**Owner:** Rebelz AI (Verantwortlicher gem. Art. 4 Nr. 7 DSGVO).

> ⚖️ **DISCLAIMER:** This document is an **operational framework**, NOT legally binding contract text. Every section marked ⚖️ MUST be reviewed by a German Datenschutz-Anwalt before production use. The AVV template specifically requires Anwalt sign-off.

Companion to: `AGENT.md` §7 (DSGVO mechanics), `SPEC.md` Constraints (data sovereignty + DSGVO compliance), `EVALS.md` E7 (egress audit).

---

## 1. Scope & purpose

PermitWatchDog processes personal and project data of paying subscribers (Bauleiter, Bauunternehmen, Bauträger) and their projects — which may include third-party data such as architect contacts, Statiker contacts, and Flurstück references. This document establishes the operational posture for handling that data under DSGVO / GDPR.

## 2. Verantwortlicher (Data Controller)

- **Firma:** Rebelz AI
- **Sitz:** [to be added — must appear on Impressum]
- **Vertreten durch:** Clarence Johnson (Geschäftsführer)
- **Kontakt für Datenschutz-Anfragen:** `datenschutz@permitwatchdog.com`
- **Datenschutzbeauftragter (DSB):** external DPO service to be appointed before customer #1 — see §17

## 3. Lawful bases (Art. 6 DSGVO)

| Processing | Lawful basis | Notes |
|------------|--------------|-------|
| Paying subscriber data (name, email, payment) | Art. 6(1)(b) — contract performance | Subscription agreement |
| Project data uploaded by subscriber | Art. 6(1)(b) — contract performance | Covered by AVV (Art. 28) |
| Marketing emails to prospects who opted in | Art. 6(1)(a) — consent | Double opt-in required |
| Cold outreach prospects (LinkedIn, public B2B) | Art. 6(1)(f) — legitimate interest | Balancing test documented per §3.1 |
| Aggregated/anonymized analytics | Art. 6(1)(f) — legitimate interest | No personal identifiers |
| LoRA training on customer Bauantrag corpus (T4) | Art. 6(1)(a) — explicit consent | Separate opt-in; DSFA required (§7) |

### 3.1 Legitimate-interest balancing test (cold outreach)

⚖️ Documentation required per Art. 6(1)(f):

- **Purpose:** business development for a clearly relevant B2B service to a professional audience whose contact details are publicly accessible in professional capacity (LinkedIn, Architektenkammer rolls, Handwerkskammer directories).
- **Necessity:** no less-intrusive alternative reaches the same prospects.
- **Interest balance:** prospects can opt out via one-click in first contact; no further contact after opt-out, opt-out records retained 24 months.

## 4. Categories of data processed

| Category | Sensitivity | Source | Retention |
|----------|-------------|--------|-----------|
| Subscriber identity (name, business email, company) | Standard | Self-provided at signup | Active subscription + 12 months |
| Payment info | High | Stripe (never touches our servers) | Per Stripe DPA |
| Active project metadata (address, Flurstück, Bauantrag-Nr) | Standard | Self-provided at onboarding | Active subscription + 12 months |
| Blueprints (PDF, T2+) | High (may contain third-party IP) | Customer upload | Active subscription + 30 days |
| Historical Bauanträge (T4) | High | Customer upload | Active subscription + 30 days |
| Architect contacts | Standard | Customer-provided | Active subscription + 12 months |
| Alert history + thumbs-up/down feedback | Standard | System-generated | 24 months (eval ground truth) |
| Audit logs (agent execution, access logs) | Operational | System-generated | 24 months (E10 evidence) |

## 5. Subprocessors

⚖️ Each subscriber's AVV must disclose this list. Updates require advance notice per AVV §10.

| Subprocessor | Role | Region | DPA status |
|--------------|------|--------|-----------|
| Google Cloud (Google Ireland Ltd.) | Compute, storage, DB, model API | europe-west3 (Frankfurt) | DPA signed; SCC where applicable |
| Stripe Payments Europe Ltd. | Payment processing | EU (Ireland) | DPA signed; PCI-DSS Level 1 |
| Microsoft Outlook / Graph API | Email-draft delivery | Subscriber's own tenant | No transfer — drafts live in subscriber's Outlook |
| SendGrid (Twilio Ireland Ltd.) | Transactional email | EU | DPA signed; SCC for any US fallback |
| Firebase Auth (Google Ireland Ltd.) | Subscriber authentication | EU region | DPA signed |
| Sentry (Functional Software GmbH, DE) | Error monitoring | DE | DPA signed |

**No US-based subprocessor has access to subscriber-content data.** Subprocessor additions or replacements require ≥ 30 days advance notification to subscribers per AVV §10.

## 6. Auftragsverarbeitungsvertrag (AVV) — template scaffold

⚖️ MUST be reviewed by Datenschutz-Anwalt before any subscriber signs. Template sections (standard German AVV per Art. 28 DSGVO / DSK orientation):

1. **Gegenstand des Vertrags** — scope of processing
2. **Dauer** — for the duration of the active subscription + 12-month grace period
3. **Art und Zweck** — automated regulatory-change monitoring + alert delivery
4. **Kategorien betroffener Personen** — subscriber + project participants + architect contacts
5. **Kategorien personenbezogener Daten** — per §4
6. **Weisungsbefugnis** — Verantwortlicher (subscriber) has full instruction rights; instructions documented
7. **Unterauftragsverhältnisse** — per §5; advance notification ≥ 30 days for changes
8. **Technische und organisatorische Maßnahmen (TOMs)** — per §16
9. **Mitwirkung bei Betroffenenrechten** — Rebelz AI provides tooling for subject-rights requests (Auskunft, Berichtigung, Löschung)
10. **Meldepflichten** — 24-hour notification of any processor-side incident; 72-hour-to-Aufsichtsbehörde handled by Rebelz AI
11. **Audit-Rechte** — subscriber may audit annually; remote audit acceptable; on-site by appointment
12. **Beendigung** — data returned or deleted per subscriber's choice within 30 days of contract end; deletion confirmed in writing

## 7. DSFA (Datenschutzfolgenabschätzung) — required for T4

⚖️ Required per Art. 35 DSGVO for high-risk processing.

**Trigger:** LoRA fine-tuning on customer's historical Bauantrag corpus involves:

- Personal data of architects, engineers, neighbors named in Bauanträgen
- Automated decision-making influencing legal outcomes
- High volume + sensitive context (Bauwesen + Eigentumsrecht)

**DSFA must cover:** purpose specification, necessity test, risk identification (re-identification, model leakage, drift), mitigation measures (differential privacy where feasible, output filtering, audit logs).

**Decision for v0.1 / XPRIZE:** LoRA training NOT activated. T4 tier demoed conceptually only. Full DSFA required before first T4 customer onboarded — *not* before XPRIZE submission.

## 8. Datenschutzerklärung (live privacy policy)

⚖️ Must be published at `permitwatchdog.com/datenschutz` before any subscriber signs. Must contain:

- Verantwortlicher identification + DSB contact
- Categories of data processed (§4)
- Lawful bases (§3)
- Recipients (§5 subprocessors)
- Retention periods (§4)
- Subject rights (Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch)
- Right to complain to LfDI Baden-Württemberg (or BfDI for federal matters)
- Cookie usage + consent mechanism
- Automated decision-making disclosure (Art. 22 DSGVO)

## 9. Impressum (§ 5 TMG)

⚖️ Must be published at `permitwatchdog.com/impressum`. Must contain:

- Firmenname + Rechtsform (Rebelz AI [GmbH/UG/etc. — confirm])
- Vertretungsberechtigter (Geschäftsführer)
- Anschrift (no PO box — physical address required)
- Kontaktdaten (E-Mail + Telefon)
- Handelsregister + Registernummer
- USt-ID gemäß § 27a UStG (if applicable)
- Berufsbezeichnung + verleihender Staat (if applicable)
- Aufsichtsbehörde (if applicable)

## 10. AGB (General Terms & Conditions)

⚖️ Must be published at `permitwatchdog.com/agb` before any subscription. Must address:

- Vertragsgegenstand
- Subscription pricing + terms (monthly / annual)
- Auto-renewal + cancellation (1-month notice for monthly; 3-month for annual)
- SLA + Service Credits (T3+ tiers)
- Haftungsbeschränkung capped at 12 months of subscription fees, except for grossly negligent / intentional acts (§ 309 BGB compatibility required)
- Datenschutz-Verweis auf AVV
- Anwendbares Recht: Deutsches Recht
- Gerichtsstand: Mannheim (Rebelz AI Sitz)
- Schriftform / Textform requirements per § 126b BGB
- Subprocessor change notification per §5

## 11. Cookie / TTDSG consent

- **Essential cookies only by default** — session, CSRF, authentication.
- **Analytics cookies** (Plausible or Matomo — both DSGVO-friendly) require opt-in.
- **Cookie banner:** granular consent UI, no pre-checked boxes, clear "Alle ablehnen" button.
- **Consent records** stored 12 months minimum for audit purposes.
- Compliant with TTDSG § 25 + ECJ Planet49 ruling.

## 12. Right-to-erasure mechanic (Art. 17 DSGVO)

- **One-click in subscriber portal:** "Alle meine Daten löschen."
- Confirmation email with 24-hour cooldown before purge fires.
- **Legal SLA:** 30 days from confirmation.
- **Internal target:** 7 days.
- **Backup-purge:** backups containing the data either purged within 30 days OR re-encrypted such that the data is irrecoverable.
- Audit log records the purge event (operational data, not personal data — Art. 30 DSGVO record-keeping basis).

## 13. Data retention policy

| Data | Default retention | Override |
|------|-------------------|----------|
| Active subscriber data | Subscription duration + 12 months | Custom per AVV |
| Blueprints / project files | Subscription duration + 30 days | Custom per AVV |
| Alert + feedback history | 24 months (eval ground truth) | Anonymized after 12 months on request |
| Audit logs | 24 months | Required by AGB |
| Cancelled-subscriber records | 12 months after cancellation, then auto-purge | Customer can request immediate purge |
| Cold-outreach opt-out records | 24 months | Mandatory (legitimate-interest documentation) |

## 14. Cross-border data transfers

**v0.1: NONE.** All processing in europe-west3 (Frankfurt, DE).

If/when this changes (e.g. US subprocessor introduced), SCCs (Standard Contractual Clauses, EU 2021/914) required + TIA (Transfer Impact Assessment) per Schrems II.

## 15. Incident response

- **Internal incident discovery → notification chain triggers within 4 hours.**
- **Notifiable breach to LfDI BW: within 72 hours** of awareness (Art. 33 DSGVO).
- **Notification to affected subjects:** without undue delay (Art. 34) if high risk.
- Incident-response runbook lives at `docs/incident_response.md` (to be written).
- **Drill:** tabletop exercise quarterly.

## 16. TOMs (Technische und organisatorische Maßnahmen)

⚖️ Required as AVV Anlage. Operational specifics:

**Vertraulichkeit:**
- All data encrypted at rest (Cloud SQL + Cloud Storage default-encryption with Google-managed keys; upgrade path to CMEK on customer request).
- All data encrypted in transit (TLS 1.3 minimum).
- Role-based access via Cloud IAM; least-privilege default.
- Cloud Secret Manager for all credentials; no secrets in code or env files.

**Integrität:**
- Cryptographic checksums on all signed bundles to T4 on-prem customers.
- Cloud Audit Logs configured for immutable retention.

**Verfügbarkeit:**
- Cloud SQL automated daily backups + 7-day point-in-time recovery.
- Cloud Run multi-zone (europe-west3-a/b/c).
- Disaster recovery: RTO 4h, RPO 24h.

**Belastbarkeit:**
- DDoS protection: Cloud Armor in front of all public surfaces.
- Rate limiting per IP and per authenticated subscriber.

**Prüfverfahren:**
- E7 weekly egress audit (eval framework).
- Annual penetration test (year-1 budget item).
- Quarterly access-log review.

## 17. Datenschutzbeauftragter (DPO)

DPO appointment required per § 38 BDSG when:

- ≥ 20 employees regularly processing personal data, OR
- High-risk processing per Art. 35 DSGVO (LoRA training qualifies even at <20 headcount).

**Decision for v0.1:** appoint **external DPO service** before first paying customer.
- Estimated cost: €150–400/month.
- Candidate vendors: TÜV Süd Datenschutz, DataGuard, ePrivacy GmbH.
- Selection deadline: 2026-06-15.

## 18. Open questions for Datenschutz-Anwalt review ⚖️

Before any of the above becomes operationally binding:

1. **AVV template** — full review against current DSK orientation + Rebelz' specific subprocessor mix.
2. **DSFA scope** — does the v0.1 (no LoRA) processing already trigger DSFA, or only T4? Anwalt to confirm.
3. **Subprocessor TIA** — explicit confirmation that all subprocessors qualify as EU-region for Schrems II purposes.
4. **AGB Haftungsbeschränkung** — German AGB-Recht (§§ 305 ff. BGB) limits liability caps; require Anwalt sign-off on specific phrasing.
5. **Cookie consent UI** — current draft must be reviewed against latest LfDI BW guidance + ECJ Planet49 ruling.
6. **Bauantrags-data sensitivity** — Anwalt to confirm whether the data classifies as "besondere Kategorien" under Art. 9 DSGVO for any subset (probably no, but worth confirming).
7. **Drafted-Addendum legal liability** — when our AI drafts text that an architect signs and submits, what is our liability exposure? Likely covered by AGB Haftungsbeschränkung + Berufshaftpflicht-Versicherung, but Anwalt should confirm.

## 19. Timeline (must close before customer #1)

| Item | Target date |
|------|-------------|
| External DPO appointed | 2026-06-15 |
| Datenschutzerklärung + Impressum + AGB published | 2026-06-30 |
| AVV template Anwalt-reviewed | 2026-06-30 |
| DSFA for T4 (deferred until T4 ships) | TBD |
| Incident-response runbook drafted | 2026-07-15 |
| First quarterly tabletop drill | 2026-08-01 |

---

*End of DSGVO framework. When this file changes, `AGENT.md` decision-gate row 6 changes too. Treat as operationally binding until Anwalt review completes.*
