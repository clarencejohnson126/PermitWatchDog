# Scraper SDK

Open-source foundation for municipal scraper contributions. Uses `axios` and `cheerio` by default for static scraping.

## JS-Hydration Fallback
The SDK includes a Playwright FALLBACK pathway (`HttpClient.getHtmlWithPlaywright(url)`).
**DO NOT activate this for Mannheim.** Use it ONLY when a future Gemeinde genuinely requires JS execution (e.g., modern SPAs) because Playwright adds ~50× cost and ~10× latency vs static scraping and risks Chromium fingerprint detection.
