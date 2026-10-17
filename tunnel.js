const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');
const https = require('https');

let activeTunnel = null;
let isReconnecting = false;
let pingInterval = null;

process.on('uncaughtException', (err) => {
  console.error('[Tricity RealtyOS] Uncaught exception:', err.message);
  scheduleReconnect();
});

process.on('unhandledRejection', (reason) => {
  console.error('[Tricity RealtyOS] Unhandled rejection:', reason);
  scheduleReconnect();
});

function checkTunnelHealth(url) {
  if (!url || isReconnecting) return;
  const req = https.get(url, {
    headers: { 'bypass-tunnel-reminder': 'true' },
    timeout: 5000,
  }, (res) => {
    if (res.statusCode >= 400 && res.statusCode !== 404) {
      console.warn(`[Tricity RealtyOS] Tunnel health check returned HTTP ${res.statusCode}. Reconnecting...`);
      scheduleReconnect();
    }
  });

  req.on('timeout', () => {
    req.destroy();
    console.warn('[Tricity RealtyOS] Tunnel health check timed out. Reconnecting...');
    scheduleReconnect();
  });

  req.on('error', (err) => {
    console.warn('[Tricity RealtyOS] Tunnel health check failed:', err.message);
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (activeTunnel) {
    try { activeTunnel.close(); } catch (_) {}
    activeTunnel = null;
  }
  console.log('[Tricity RealtyOS] Reconnecting tunnel in 3 seconds...');
  setTimeout(() => {
    isReconnecting = false;
    startTunnel();
  }, 3000);
}

async function startTunnel() {
  try {
    console.log('[Tricity RealtyOS] Initializing localtunnel on port 3050...');
    const tunnel = await localtunnel({ 
      port: 3050, 
      subdomain: 'tricity-realtyos' 
    });
    
    activeTunnel = tunnel;
    const url = tunnel.url;
    console.log(`[Tricity RealtyOS] Public Tunnel Live at: ${url}`);
    
    fs.writeFileSync(path.join(__dirname, 'DEPLOYED_URL.txt'), `${url}\n`, 'utf8');

    // Active health-check ping every 20 seconds
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(() => {
      checkTunnelHealth(url);
    }, 20000);

    tunnel.on('close', () => {
      console.log('[Tricity RealtyOS] Tunnel socket closed.');
      scheduleReconnect();
    });

    tunnel.on('error', (err) => {
      console.error('[Tricity RealtyOS] Tunnel socket error:', err.message);
      scheduleReconnect();
    });
  } catch (err) {
    console.error('[Tricity RealtyOS] Failed to create tunnel:', err.message);
    scheduleReconnect();
  }
}

startTunnel();
