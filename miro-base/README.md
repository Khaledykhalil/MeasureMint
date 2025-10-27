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

3. Start the dev server on port 3000

```sh
npm start
```

4. Expose localhost with ngrok in a separate terminal

```sh
ngrok http 3000
```

5. Update the app manifest in the Miro developer console

- Use `miro-base/app-manifest.yaml`
- Update these fields to match your ngrok URL:
  - `sdkUri: https://<your-ngrok-domain>/`
  - `redirectUris: ["https://<your-ngrok-domain>/api/redirect"]`
- Save and install the app to your team

6. Open a Miro board and open MeasureMint from the Apps sidebar.

## Notes

- This scaffold stores auth tokens in a secure HTTP-only cookie using the official `@mirohq/miro-api` client.
- If you previously ran an Express server on port 3000, stop it before starting this app to avoid port conflicts.
- The legacy files in the repo are preserved. The new base app lives under `miro-base/`.
