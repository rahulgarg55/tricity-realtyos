const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');

let activeTunnel = null;
let isReconnecting = false;

// Keep event loop alive permanently
setInterval(() => {}, 60000);

process.on('uncaughtException', (err) => {
  console.error('[Tricity RealtyOS] Uncaught exception:', err.message);
  scheduleReconnect();
});

process.on('unhandledRejection', (reason) => {
  console.error('[Tricity RealtyOS] Unhandled rejection:', reason);
  scheduleReconnect();
});

function scheduleReconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  if (activeTunnel) {
    try { activeTunnel.close(); } catch (_) {}
    activeTunnel = null;
  }
  console.log('[Tricity RealtyOS] Reconnecting tunnel in 4 seconds...');
  setTimeout(() => {
    isReconnecting = false;
    startTunnel();
  }, 4000);
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
