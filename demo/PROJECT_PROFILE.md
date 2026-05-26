# Demo Project Profile — Mannheim Q5

**Status:** Fictional demo project for v0.1. Drives E1–E10 evals end-to-end. Used as the canonical Bauträger profile for the live judging-day demo (T2 tier).

This document mirrors the structured Project Profile that step 2 of the tech flow (`permitwatchdog_tech.md`) produces in Cloud SQL. When the build starts, this file becomes the seed payload for the Bauträger onboarding flow.

---

## 1. Bauherr / Bauträger (fictional)

| Feld | Wert |
|------|------|
| Firma | RebelzBau Mannheim GmbH |
| Sitz | Mannheim, Deutschland |
| Geschäftsführer | (fiktiv) Markus Schneider |
| Handelsregister | Amtsgericht Mannheim, HRB 99001 |
| USt-ID | DE999000001 |
| Kontakt | bauleitung@rebelzbau-mannheim.de (fiktiv) |
| PermitWatchDog-Tier | T2 (Blueprint-Integrated) — €499/mo |

## 2. Projekt-Stammdaten

| Feld | Wert |
|------|------|
| Projektname | Wohnhaus Q5, 18 — Mannheim Innenstadt |
| Adresse | Q5, 18, 68159 Mannheim |
| Gemarkung | Mannheim |
| Flur | 1 |
| Flurstück | 4823/2 |
| Bauantrag-Nr | BA-2026-MA-00234 |
| Aktenzeichen Bauamt | FB60/2026/0234 |
| Projekt-Typ | Wohnungsbau (Neubau) |
| Lebenszyklus-Stufe | **Antrag genehmigt, im Bau (Rohbau begonnen)** |
| Baubeginn | 2026-04-12 |
| Geplante Fertigstellung | 2027-09-30 |
| Bauherr | RebelzBau Mannheim GmbH |
| Architekt | Architekturbüro Müller & Partner |
| Architekt-Kontakt | mueller-partner@architekten-mannheim.de (fiktiv) |
| Statiker | Ingenieurbüro Weber Tragwerksplanung (fiktiv) |
| Bauleitung | (intern) Clarence Johnson — PermitWatchDog-Abo-Inhaber |

## 3. Bebauungsplan-Kontext

| Feld | Wert |
|------|------|
| Bebauungsplan | Bebauungsplan Innenstadt 32 (Q5/Q6), rechtskräftig 2018-11-04 |
| Gebietstyp | MK — Kerngebiet (Innenstadt-Quadrate) |
| GRZ | 0,8 |
| GFZ | 3,5 |
| Geschossigkeit | IV Vollgeschosse zzgl. Staffelgeschoss zulässig |
| Bauweise | geschlossene Bauweise (Blockrand-Lückenschluss) |
| Stellplatz-Pflicht | 1 pro Wohneinheit gem. § 37 LBO BW + Stellplatzsatzung Mannheim |
| Denkmalschutz | Nein (Q5 außerhalb der Denkmalschutz-Zone "Schlossplatz/Friedrichsplatz") |
| Lärmschutz | Verkehrslärm Stufe III gem. DIN 4109; passive Schallschutzmaßnahmen erforderlich |

## 4. Gebäude-Eckdaten (aus Bauantrag + Blueprints)

| Feld | Wert |
|------|------|
| Geschosse | 5 (EG + 4 OG) |
| Bruttogrundfläche (BGF) | 1.640 m² |
| Wohnfläche gesamt | 1.245 m² |
| Anzahl Wohneinheiten | 10 |
| Wohnungsmix | 6 × 3-Zimmer (75–85 m²) + 4 × 4-Zimmer (95–110 m²) |
| Gebäudeklasse | GK 4 (gem. § 2 Abs. 3 LBO BW — Höhe > 7 m, ≤ 13 m) |
| Statisches System | Stahlbeton-Skelettbau mit Stahlbetondecken; Außenwände Mauerwerk |
| Brandschutzkonzept | F90-A tragende Bauteile; F30 Wohnungstrennwände; 2 bauliche Rettungswege je WE |
| Energiekonzept | GEG 2024, KfW Effizienzhaus 55, Sole/Wasser-Wärmepumpe + PV-Anlage 24 kWp Dach |
| Abstandsflächen | 0,4 × H nach § 5 LBO BW; Mindestabstand 2,5 m zu Nachbarbebauung Q5,17 + Q5,19 |
| Erschließung | Hauseingang Q5; Tiefgarage-Zufahrt über Q5/Q6-Eckverbindung |

## 5. Tiefgarage & Stellplätze

| Feld | Wert |
|------|------|
| Tiefgarage-Stellplätze | 8 (2 Reihen × 4) |
| Ebenerdige Stellplätze | 2 (Hofzufahrt) |
| Stellplätze gesamt | 10 |
| Stellplatz-Soll | 10 (1 je WE) |
| Stellplatz-Saldo | ±0 — erfüllt |
| Fahrrad-Abstellplätze | 20 (überdacht, Innenhof) |
| Barrierefreiheit | 2 Stellplätze barrierefrei (Tiefgarage) |

## 6. Nachbar-Kontext (Auslegung-Frühwarn-Radius)

PermitWatchDog beobachtet 50-m-Radius um das Flurstück für Nachbar-Anträge mit potenzieller Auswirkung:

| Adresse | Status | Relevanz für Q5,18 |
|---------|--------|--------------------|
| Q5, 17 | Bestand, denkmalgeschützt | Abstandsfläche-relevant bei Umbauten |
| Q5, 19 | Bestand, Bürogebäude 1970er | Abstandsfläche-relevant |
| Q6, 1 | Bestand, gemischt | Sichtachsen-/Verschattungs-relevant |
| Q4, 18 | Bestand | irrelevant (Planken-Quadrate, andere Straßenseite) |

## 7. Zustand zum Stichtag 2026-05-26

- **Bauantrag:** Genehmigt 2026-02-19 (Aktenzeichen FB60/2026/0234).
- **Baubeginn-Anzeige:** Eingereicht 2026-04-03, Baubeginn 2026-04-12.
- **Bauphase:** Aushub abgeschlossen; Tiefgarage-Sohle gegossen; Erdgeschoss-Decke in Schalung.
- **Geplante Rohbau-Fertigstellung:** 2026-11-30.
- **Bestandsschutz-Status:** Vertrauensschutz greift (genehmigt + Baubeginn in gutem Glauben). Bestandsschutz beginnt ab Rohbau-Fertigstellung.
- **Vorbehalte / offene Punkte aus Genehmigungsbescheid:**
  - Auflage 04: Lärmschutz-Nachweis vor Fenster-Montage neu vorzulegen, falls DIN 4109 sich vor Bezug ändert.
  - Auflage 12: PV-Anlage muss Mannheim-spezifische Stellplatzsatzung 2025 (Solarpflicht) erfüllen — bei Änderung Nachweis nachzureichen.
  - Auflage 17: Statik-Nachweis F90-Konformität für ggf. neu eingeführte Brandschutz-DIN-Normen während Bauphase.

## 8. PermitWatchDog-Beobachtungsumfang

| Kategorie | Beobachtet | Begründung |
|-----------|-----------|------------|
| Bebauungsplan Q5/Q6-Änderungen | ✓ | direkter Gebietsbezug |
| LBO BW Änderungen | ✓ | landesrechtlich anwendbar |
| Mannheim Stellplatzsatzung | ✓ | Auflage 12, direkter Bezug |
| DIN 4109 (Schallschutz) | ✓ | Auflage 04 |
| DIN 4102 / Brandschutz-Vorgaben GK4 | ✓ | Auflage 17 |
| GEG 2024 Updates | ✓ | KfW-55-Förderzusage abhängig |
| Mannheim Denkmalschutz-Zone (Q5,17 betreffend) | ✓ | Nachbar-Abstandsfläche kann betroffen sein |
| Solarpflicht-Verordnung BW | ✓ | PV-Anlage als Auflage |
| Nachbar-Bauanträge im 50-m-Radius | ✓ | Auslegung offensive use case |

## 9. Erwartete Alert-Klassifikation (für Eval-Golden-Set)

Erwartete Risk-Flag-Verteilung bei typischen Filing-Typen gegen diesen Projektstand:

| Filing-Typ | Lifecycle-Stage = "im Bau" | Erwartete Flag |
|-----------|---------------------------|----------------|
| Bebauungsplan-Änderung Q5/Q6 zur GRZ-Erhöhung | im Bau, genehmigt | NO_IMPACT_BESTANDSSCHUTZ (Vertrauensschutz greift) |
| Lärmschutz-DIN-Update (Auflage 04 betroffen) | im Bau | HIGH (Auflage explizit nachweis-pflichtig) |
| Solarpflicht-Schwellenwert-Änderung | im Bau | MEDIUM (Auflage 12, prüfungspflichtig) |
| Brandschutz-DIN-4102-Update (Auflage 17) | im Bau | HIGH (Auflage explizit nachweis-pflichtig) |
| Nachbar-Bauantrag Q5,19 (Aufstockung) | im Bau | MEDIUM (Auslegung-Beteiligung möglich) |
| Bebauungsplan-Neuaufstellung Q1–Q4 | im Bau | NO_IMPACT_OTHER (außerhalb Geltungsbereich) |
| Mannheim-Stellplatzsatzung-Änderung | im Bau | MEDIUM (Auflage 12) |
| Allgemeine LBO-BW-Novelle Brandschutz GK4 | im Bau | HIGH (Auflage 17 + Bestandsschutz-Frage) |

Diese Zeile-für-Zeile-Erwartung wird in `evals/golden_set/` als JSON serialisiert und bildet die Grundlage für **E8** (Golden-Set-Regression).

---

*Stichtag: 2026-05-26. Stammdaten fiktiv — kein realer Bezug zu existierenden Personen, Firmen oder Grundstücken in Mannheim.*
