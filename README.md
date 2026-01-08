## Visa form helper (Next.js + Playwright)

Simple UI to open a visa application form in a new tab and trigger a server-side Playwright script that fills the form with preset JSON data.

### Run dev server
```bash
npm run dev
```
Open http://localhost:3000.

### Flow
- Enter (or keep) the target form URL and click "Open + Fill".
- The browser opens the URL in a new tab.
- An API call to /api/fill runs Playwright headlessly on the server to fill the form using src/lib/formData.ts.

### Configuration
- Default URL and payload live in src/lib/formData.ts. Edit values to change what gets filled.

### Troubleshooting
- Pop-up blockers: allow pop-ups so the target tab can open.
- If the site structure changes, selectors in src/app/api/fill/route.ts may need updates.
