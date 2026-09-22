# Amaravathi Travel Admin

Private operations portal for Amaravathi Tours & Travel. It manages hotels, cars, service areas and experiences using a static JSON payload.

## Run locally

1. Install Node.js 22 and pnpm.
2. Run `pnpm install`.
3. Run `pnpm build`.
4. Run `pnpm start`.

Starter records live in `data/inventory.json`. Changes and uploaded images are saved in the current browser. Use **Export JSON** to make a portable backup and **Import JSON** to restore or replace the data. Production access is protected by ChatGPT sign-in and the Sites owner-only audience setting.

## Checks

- `pnpm typecheck`
- `pnpm build`

## Google Sheets sync

The production admin synchronizes inventory with Google Sheets through the Apps Script in `google-apps-script/Code.gs`. Deploy it as a Web app, then configure `GOOGLE_SHEETS_WEB_APP_URL` and the matching secret `GOOGLE_SHEETS_SYNC_TOKEN` in Sites. Browser storage remains as an offline backup.

