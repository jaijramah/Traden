import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const port = process.env.SMOKE_PORT || '4317';
const server = spawn(process.execPath, ['scripts/dev-server.mjs'], {
  env: { ...process.env, PORT: port },
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';
server.stdout.on('data', (chunk) => { output += chunk.toString(); });
server.stderr.on('data', (chunk) => { output += chunk.toString(); });

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 5000) {
    try {
      const response = await fetch(`http://localhost:${port}/`);
      if (response.ok) return;
    } catch {
      // keep polling until the local server is ready
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Demo server did not start. Output:\n${output}`);
}

try {
  await waitForServer();
  const home = await (await fetch(`http://localhost:${port}/`)).text();
  assert.match(home, /data-demo-start/);
  assert.match(home, /id="live-demo"/);
  assert.match(home, /id="landing-analyse"/);

  const preRun = await (await fetch(`http://localhost:${port}/?demo=1`)).text();
  assert.match(preRun, /&quot;serviceMatch&quot;: &quot;Boiler service&quot;/);
  assert.match(preRun, /&quot;price&quot;: 85/);

  const testLab = await (await fetch(`http://localhost:${port}/test-lab`)).text();
  assert.match(testLab, /runTestLabDemo\(\)/);
  assert.match(testLab, /&quot;serviceMatch&quot;: &quot;Boiler service&quot;/);

  const apiResponse = await fetch(`http://localhost:${port}/api/test-lab/analyse`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ bodyText: 'Need an end of tenancy clean for a 2 bed flat in Birmingham next Thursday.' })
  });
  const api = await apiResponse.json();
  assert.equal(api.analysis.serviceMatch, 'End-of-tenancy clean');
  assert.equal(api.pricing.price, 160);
  assert.equal(api.suggestedReply.includes('£160'), true);

  console.log('demo smoke ok');
} finally {
  server.kill();
}
