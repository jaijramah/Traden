import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const port = process.env.SMOKE_PORT || '4317';
const server = spawn(process.execPath, ['scripts/dev-server.mjs'], { env: { ...process.env, PORT: port }, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stdout.on('data', (chunk) => { output += chunk.toString(); });
server.stderr.on('data', (chunk) => { output += chunk.toString(); });

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 5000) {
    try {
      const response = await fetch(`http://localhost:${port}/`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Demo server did not start. Output:\n${output}`);
}

try {
  await waitForServer();
  const home = await (await fetch(`http://localhost:${port}/`)).text();
  assert.match(home, /Working demo MVP/);
  assert.match(home, /Start onboarding/);
  assert.match(home, /Open test lab/);

  const onboarding = await (await fetch(`http://localhost:${port}/onboarding`)).text();
  assert.match(onboarding, /Complete onboarding/);

  const testLab = await (await fetch(`http://localhost:${port}/test-lab`)).text();
  assert.match(testLab, /Run analysis/);
  assert.match(testLab, /Pipeline output/);

  const apiResponse = await fetch(`http://localhost:${port}/api/test-lab/analyse`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ bodyText: 'Need an end of tenancy clean for a 2 bed flat in Birmingham next Thursday.' })
  });
  const api = await apiResponse.json();
  assert.equal(api.analysis.serviceMatch, 'End-of-tenancy clean');
  assert.equal(api.pricing.price, 160);
  console.log('demo smoke ok');
} finally {
  server.kill();
}
