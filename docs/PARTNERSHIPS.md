# Partnerships & Outreach

## Bauamt Digitalisierungsbeauftragte
When discussing the automated pipeline with Mannheim or other municipal IT departments:
- Highlight that we use **polite, static scraping** by default, adding zero runtime overhead to their servers compared to headless browsers or SPAs.
- Note that our bots identify themselves with standard HTTP headers but maintain respectful request rates.
- No JS execution is required for their standard Drupal setups (like Mannheim), which ensures extreme scalability across all 5,000 DACH Bauämter.

## TODO: Bauleitplanung Missing Filings
Investigate the `Bauleitplanung` sub-page (`/de/stadt-gestalten/planungskonzepte/bauleitplanung`) which currently returns 0 filings.
- Check deeper paths: e.g., `/aktuelle-bebauungsplaene`.
- Cross-check with Geoportal BW (`geoportal-bw.de`) for active procedures.
- Check Stadtteil-scoped sub-URLs (Almenhof, Käfertal, etc.).
