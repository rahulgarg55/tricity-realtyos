/**
 * Lightweight Node-native Concurrent Load Tester
 * Simulates concurrent virtual users (VUs) and measures latency & error rates.
 */

interface LoadMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  latencies: number[];
  startTime: number;
  endTime: number;
}

async function runStage(
  baseUrl: string,
  vus: number,
  iterationsPerVU: number
): Promise<{ stage: string; vus: number; avgLatencyMs: number; p95Ms: number; errorRate: string; rps: number }> {
  const metrics: LoadMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    latencies: [],
    startTime: Date.now(),
    endTime: 0,
  };

  const endpoints = ["/api/admin/health", "/api/auth/me"];

  const vuWorker = async () => {
    for (let i = 0; i < iterationsPerVU; i++) {
      const endpoint = endpoints[i % endpoints.length];
      const start = performance.now();
      try {
        metrics.totalRequests++;
        const res = await fetch(`${baseUrl}${endpoint}`);
        const duration = performance.now() - start;
        metrics.latencies.push(duration);

        if (res.status === 200 || res.status === 401) {
          metrics.successfulRequests++;
        } else {
          metrics.failedRequests++;
        }
      } catch (e) {
        metrics.failedRequests++;
      }
    }
  };

  // Run all virtual users in parallel
  await Promise.all(Array.from({ length: vus }, () => vuWorker()));
  metrics.endTime = Date.now();

  const totalTimeSec = (metrics.endTime - metrics.startTime) / 1000;
  const sorted = metrics.latencies.sort((a, b) => a - b);
  const avg = sorted.reduce((a, b) => a + b, 0) / (sorted.length || 1);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || avg;
  const errorRate = ((metrics.failedRequests / (metrics.totalRequests || 1)) * 100).toFixed(2);
  const rps = metrics.totalRequests / (totalTimeSec || 1);

  return {
    stage: `${vus} Concurrent VUs`,
    vus,
    avgLatencyMs: Math.round(avg),
    p95Ms: Math.round(p95),
    errorRate: `${errorRate}%`,
    rps: Math.round(rps),
  };
}

async function main() {
  const port = process.env.PORT || "3000";
  const baseUrl = `http://localhost:${port}`;

  console.log(`🚀 Starting Tricity RealtyOS Load Test against ${baseUrl}...`);
  console.log("--------------------------------------------------------------------------------");

  const results = [];

  // Stage 1: Smoke test (5 VUs)
  console.log("Running Stage 1: Smoke Test (5 Virtual Users)...");
  results.push(await runStage(baseUrl, 5, 10));

  // Stage 2: 25 Virtual Users
  console.log("Running Stage 2: 25 Concurrent Virtual Users...");
  results.push(await runStage(baseUrl, 25, 10));

  // Stage 3: 50 Virtual Users
  console.log("Running Stage 3: 50 Concurrent Virtual Users...");
  results.push(await runStage(baseUrl, 50, 10));

  console.log("\n======================== LOAD TEST RESULTS ========================");
  console.table(results);
  console.log("===================================================================\n");
}

main().catch(console.error);
