const localtunnel = require('localtunnel');

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ 
      port: 3050, 
      subdomain: 'tricity-realtyos' 
    });
    
    console.log(`[Tricity RealtyOS] Public Tunnel Live at: ${tunnel.url}`);
    
    tunnel.on('close', () => {
      console.log('[Tricity RealtyOS] Tunnel closed. Reconnecting in 3s...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('[Tricity RealtyOS] Tunnel error:', err.message);
      tunnel.close();
    });
  } catch (err) {
    console.error('[Tricity RealtyOS] Failed to create tunnel:', err.message);
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();
