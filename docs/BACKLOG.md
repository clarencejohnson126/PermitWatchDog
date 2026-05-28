# Backlog

- BACKLOG: Replace regex typo denylist with Gemini Flash self-critic positive-validation guard (Issue 2 from 2026-05-27 review)
- BACKLOG: Verify whether 'Fressgasse' is a real Mannheim street or a Gemini hallucination; if hallucination, add citation-only-from-source constraint to Drafter prompt (Issue 3 from 2026-05-27 review)
- BACKLOG: Outlook Graph OAuth refresh flow — current demo uses static access tokens that expire in ~1 hour. Production needs full OAuth with per-subscriber consent (Authorization Code Flow) plus refresh-token rotation per the Microsoft Identity Platform docs. Required before any T0 subscriber onboarding beyond Clarence's own account.
- BACKLOG: Credential rotation — after the XPRIZE submission video is recorded, rotate: Stripe test keys, Vercel access token, Outlook Graph access token. All three were transiently exposed during dev. None are in committed code but they live in conversation history.
- BACKLOG: Vercel deployment is now live at https://permit-watch-dog.vercel.app. No further manual config needed — pushes to main auto-deploy.
- BACKLOG: Outlook Graph notifier currently sends to a single recipient (NOTIFIER_TEST_RECIPIENT env var). When per-subscriber onboarding lands, the notifier must read each Project's architect_contact + subscriber_email from Cloud SQL and route accordingly.
- BACKLOG: v1.0 OAuth productionization — replace single-refresh-token-in-env with per-subscriber encrypted token storage in Cloud SQL (table: subscriber_outlook_tokens), wired into apps/web/ subscriber onboarding. Encrypt refresh tokens at rest via Cloud KMS. Required before second subscriber onboards.
