#!/usr/bin/env node
/**
 * Update app-manifest.yaml sdkUri and redirectUris to use a provided base URL.
 * Usage:
 *   npm run manifest:update -- https://your-ngrok-domain.ngrok-free.app
 * Or with env var:
 *   NGROK_URL=https://your-ngrok-domain.ngrok-free.app npm run manifest:update
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const baseUrl = (process.env.NGROK_URL || process.argv[2] || '').trim().replace(/\/$/, '');
if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
  console.error('Please provide a valid base URL. Example:');
  console.error('  npm run manifest:update -- https://example.ngrok-free.dev');
  process.exit(1);
}

const manifestPath = path.join(__dirname, '..', 'app-manifest.yaml');

try {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const doc = yaml.load(raw);

  // Adjust fields for SDK v2 manifest
  // Point the board sidebar to the dedicated panel route
  doc.sdkUri = `${baseUrl}/panel`;
  doc.redirectUris = [`${baseUrl}/api/redirect`];

  const updated = yaml.dump(doc, { noRefs: true, lineWidth: 120 });
  fs.writeFileSync(manifestPath, updated, 'utf8');
  console.log(`Updated app-manifest.yaml to use base URL: ${baseUrl}`);
} catch (err) {
  console.error('Failed to update app-manifest.yaml:', err.message);
  process.exit(1);
}
