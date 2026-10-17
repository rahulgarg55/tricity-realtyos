import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 5 },   // Ramp-up: Smoke test
    { duration: "1m", target: 25 },   // Stage 1: 25 concurrent virtual users
    { duration: "1m", target: 50 },   // Stage 2: 50 concurrent virtual users
    { duration: "1m", target: 100 },  // Stage 3: 100 concurrent virtual users (peak weekend traffic)
    { duration: "30s", target: 0 },   // Cool-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<300", "p(99)<800"], // 95% of requests under 300ms
    http_req_failed: ["rate<0.01"],                 // Less than 1% errors
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:3000";

export default function () {
  // 1. Marketing Homepage (Public)
  const resHome = http.get(`${BASE_URL}/`);
  check(resHome, {
    "Home status is 200": (r) => r.status === 200,
    "Home response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(1);

  // 2. Pricing & Commercial Packages Page
  const resPricing = http.get(`${BASE_URL}/pricing`);
  check(resPricing, {
    "Pricing status is 200": (r) => r.status === 200,
  });

  sleep(1);

  // 3. Platform System Health Check API
  const resHealth = http.get(`${BASE_URL}/api/admin/health`);
  check(resHealth, {
    "Health API status is 200": (r) => r.status === 200,
    "Database is healthy": (r) => JSON.parse(r.body).status === "ok",
    "Health response time < 100ms": (r) => r.timings.duration < 100,
  });

  sleep(1);
}
