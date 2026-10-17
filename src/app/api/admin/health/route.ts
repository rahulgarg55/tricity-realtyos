import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "HEALTHY";
  let dbLatencyMs = 0;

  try {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - t0;
  } catch (err: any) {
    dbStatus = "DEGRADED";
    console.error("Health check DB query failed:", err);
  }

  const memory = process.memoryUsage();

  return NextResponse.json({
    status: dbStatus === "HEALTHY" ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    system: {
      nodeVersion: process.version,
      memoryRssMb: Math.round(memory.rss / 1024 / 1024),
      memoryHeapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
    },
    totalResponseTimeMs: Date.now() - startTime,
  });
}
