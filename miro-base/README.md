# MeasureMint (Miro base scaffold)

This branch contains a fresh Miro SDK v2 app scaffold generated via `npx create-miro-app@latest` (Next.js + Web SDK + REST API).

## How to run (development)

1. Install deps

```sh
cd miro-base
npm install
```

2. Set environment variables

Copy `.env` and set your credentials from the Miro developer console:

```
MIRO_CLIENT_ID="your_client_id"
MIRO_CLIENT_SECRET="your_client_secret"
MIRO_REDIRECT_URL="http://localhost:3000/api/redirect"
```

3. Start the dev server (port 3000)

```sh
npm run dev
```

Or run Next + ngrok together (requires ngrok installed):

```sh
npm run dev:all
```

4. Update the app manifest in the Miro developer console

- Option A: Manually update URLs in `miro-base/app-manifest.yaml` to your ngrok domain and paste into the console.
- Option B: Use the helper to update manifest automatically:

```sh
# once ngrok is running, copy its HTTPS URL
npm run manifest:update -- https://<your-ngrok-domain>
```

Then paste `miro-base/app-manifest.yaml` into the Miro console and install to your team.

5. Open a Miro board and open MeasureMint from the Apps sidebar.

## Notes

- This scaffold stores auth tokens in a secure HTTP-only cookie using the official `@mirohq/miro-api` client.
- If you previously ran an Express server on port 3000, stop it before starting this app to avoid port conflicts.
- The legacy files in the repo are preserved. The new base app lives under `miro-base/`.
