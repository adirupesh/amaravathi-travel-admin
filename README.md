# Amaravathi Travel Admin

Private operations portal for Amaravathi Tours & Travel. It manages hotels, cars, service areas and experiences, including cover-image uploads, pricing and publishing status.

## Run locally

1. Install Node.js 22 and pnpm.
2. Run `pnpm install`.
3. Run `pnpm build`.
4. Run `pnpm start`.

The app uses a Cloudflare D1 database named `DB` and an R2 bucket named `BUCKET`. Apply the SQL files in `drizzle/` before first use. Production access is protected by ChatGPT sign-in and the Sites owner-only audience setting.

## Checks

- `pnpm typecheck`
- `pnpm build`
