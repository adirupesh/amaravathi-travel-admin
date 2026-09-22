# Amaravathi Travel Admin

Private inventory dashboard for hotels, cars, service areas and travel experiences. Inventory synchronizes with Google Sheets and is backed up in the browser.

## Run locally on Windows

### Requirements

- Windows 10 or 11
- [Node.js 22 LTS](https://nodejs.org/)
- Git and PowerShell

### 1. Download the project

```powershell
git clone https://github.com/adirupesh/amaravathi-travel-admin.git
cd amaravathi-travel-admin
```

### 2. Install packages

```powershell
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install
```

If `corepack enable` requires permission, run that command from PowerShell opened as Administrator.

### 3. Configure Google Sheets

Set these values in the same PowerShell window:

```powershell
$env:GOOGLE_SHEETS_WEB_APP_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
$env:GOOGLE_SHEETS_SYNC_TOKEN="YOUR_PRIVATE_SYNC_TOKEN"
```

Use the deployed Apps Script URL and the same private token configured in `google-apps-script/Code.gs`. Never commit the real token to Git.

You may skip these variables when testing without Google Sheets. The dashboard will use its JSON starter records and browser backup.

### 4. Start the site

```powershell
pnpm dev
```

Open the local address printed in PowerShell, normally `http://localhost:3000`.

Local development automatically uses a local administrator account. The published site still requires ChatGPT sign-in.

## Validate and build

```powershell
pnpm typecheck
pnpm build
pnpm start
```

The production-style server normally uses `http://127.0.0.1:8787`. ChatGPT authentication headers exist only on the hosted site, so use `pnpm dev` for normal local dashboard work.

## Data and synchronization

- `data/inventory.json` contains starter inventory.
- `google-apps-script/Code.gs` contains the Google Sheet web-app code.
- Browser storage provides an offline backup.
- **Export JSON** downloads a portable copy.
- **Import JSON** restores data and synchronizes it to the Sheet.

## Deploy the Google Apps Script

1. Open the target Google Sheet.
2. Choose **Extensions → Apps Script**.
3. Paste `google-apps-script/Code.gs`.
4. Set `SYNC_TOKEN` to a long private value.
5. Deploy as a Web app that executes as the owner and allows anyone to access it.
6. Configure the resulting `/exec` URL and matching token in the admin runtime.
