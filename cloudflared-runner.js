const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let child = null;
let isStopping = false;

// Infinite event loop heartbeat
setInterval(() => {}, 60000);

function startCloudflared() {
  if (isStopping) return;

  console.log('[Cloudflare Tunnel] Starting cloudflared tunnel on port 3050...');
  
  const exePath = path.join(__dirname, 'cloudflared.exe');
  child = spawn(exePath, ['tunnel', '--url', 'http://localhost:3050'], {
    windowsHide: true,
  });

  child.stdout.on('data', handleOutput);
  child.stderr.on('data', handleOutput);

  child.on('close', (code) => {
    console.log(`[Cloudflare Tunnel] Process exited with code ${code}. Restarting in 3 seconds...`);
    child = null;
    if (!isStopping) {
      setTimeout(startCloudflared, 3000);
    }
  });

  child.on('error', (err) => {
    console.error('[Cloudflare Tunnel] Process error:', err.message);
    if (!isStopping) {
      setTimeout(startCloudflared, 5000);
    }
  });
}

function handleOutput(data) {
  const text = data.toString();
  // Search for trycloudflare URL
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match) {
    const url = match[0];
    console.log(`[Cloudflare Tunnel] Live Public URL: ${url}`);
    try {
      fs.writeFileSync(path.join(__dirname, 'CLOUDFLARE_URL.txt'), `${url}\n`, 'utf8');
    } catch (_) {}
  }
}

process.on('SIGINT', () => { isStopping = true; if (child) child.kill(); process.exit(0); });
process.on('SIGTERM', () => { isStopping = true; if (child) child.kill(); process.exit(0); });

startCloudflared();
