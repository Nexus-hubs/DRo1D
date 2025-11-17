#!/usr/bin/env node

/**
 * DRo1D Performance Benchmarking Script
 * Validates performance claims and identifies bottlenecks
 */

const http = require('http');
const { performance } = require('perf_hooks');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000';
const ITERATIONS = parseInt(process.env.ITERATIONS, 10) || 100;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${colors.bold}${colors.cyan}${message}${colors.reset}`);
  log('='.repeat(60));
}

function logMetric(label, value, unit = '', status = 'neutral') {
  const statusColor = {
    good: colors.green,
    warn: colors.yellow,
    bad: colors.red,
    neutral: colors.reset
  }[status];

  console.log(`  ${label.padEnd(30)} ${statusColor}${value}${unit}${colors.reset}`);
}

/**
 * Measure time to first byte
 */
async function measureTTFB() {
  return new Promise((resolve, reject) => {
    const start = performance.now();

    http.get(SERVER_URL, res => {
      const ttfb = performance.now() - start;
      res.resume(); // Consume response
      resolve(ttfb);
    }).on('error', reject);
  });
}

/**
 * Run benchmark
 */
async function runBenchmark() {
  logHeader('DRo1D Performance Benchmark');
  log(`Server: ${SERVER_URL}`);
  log(`Iterations: ${ITERATIONS}\n`);

  try {
    // TTFB Benchmark
    logHeader('Time to First Byte (TTFB)');
    const ttfbResults = [];

    for (let i = 0; i < ITERATIONS; i++) {
      const ttfb = await measureTTFB();
      ttfbResults.push(ttfb);

      if ((i + 1) % 10 === 0) {
        process.stdout.write(`\r  Progress: ${i + 1}/${ITERATIONS}`);
      }
    }
    console.log(''); // New line

    // Calculate statistics
    const ttfbSorted = ttfbResults.sort((a, b) => a - b);
    const ttfbMin = ttfbSorted[0];
    const ttfbMax = ttfbSorted[ttfbSorted.length - 1];
    const ttfbAvg = ttfbResults.reduce((a, b) => a + b, 0) / ttfbResults.length;
    const ttfbP50 = ttfbSorted[Math.floor(ttfbSorted.length * 0.5)];
    const ttfbP95 = ttfbSorted[Math.floor(ttfbSorted.length * 0.95)];
    const ttfbP99 = ttfbSorted[Math.floor(ttfbSorted.length * 0.99)];

    logMetric('Minimum', ttfbMin.toFixed(2), 'ms', ttfbMin < 50 ? 'good' : 'warn');
    logMetric('Maximum', ttfbMax.toFixed(2), 'ms', ttfbMax < 200 ? 'good' : 'warn');
    logMetric('Average', ttfbAvg.toFixed(2), 'ms', ttfbAvg < 100 ? 'good' : 'warn');
    logMetric('P50 (Median)', ttfbP50.toFixed(2), 'ms', ttfbP50 < 100 ? 'good' : 'warn');
    logMetric('P95', ttfbP95.toFixed(2), 'ms', ttfbP95 < 150 ? 'good' : 'warn');
    logMetric('P99', ttfbP99.toFixed(2), 'ms', ttfbP99 < 200 ? 'good' : 'warn');

    // Performance Grade
    logHeader('Performance Grade');

    const grade = calculateGrade(ttfbAvg, ttfbP95);
    const gradeColor = {
      'A+': colors.green,
      A: colors.green,
      B: colors.yellow,
      C: colors.yellow,
      D: colors.red,
      F: colors.red
    }[grade];

    logMetric('Overall Grade', grade, '', grade.startsWith('A') ? 'good' : grade === 'B' ? 'warn' : 'bad');
    log('');

    // Recommendations
    logHeader('Recommendations');

    if (ttfbAvg > 100) {
      log(`  ${colors.yellow}⚠${colors.reset}  TTFB average is high. Consider:`);
      log('     - Enabling HTTP/2');
      log('     - Using a CDN');
      log('     - Optimizing server response time');
    } else {
      log(`  ${colors.green}✓${colors.reset}  TTFB performance is excellent!`);
    }

    if (ttfbP95 > 200) {
      log(`  ${colors.yellow}⚠${colors.reset}  P95 latency is high. Consider:`);
      log('     - Investigating server load');
      log('     - Implementing caching');
    } else if (ttfbP95 < 150) {
      log(`  ${colors.green}✓${colors.reset}  P95 latency is within target!`);
    }

    log('');

    // Export results
    const results = {
      timestamp: new Date().toISOString(),
      serverUrl: SERVER_URL,
      iterations: ITERATIONS,
      ttfb: {
        min: ttfbMin,
        max: ttfbMax,
        avg: ttfbAvg,
        p50: ttfbP50,
        p95: ttfbP95,
        p99: ttfbP99
      },
      grade
    };

    const fs = require('fs');
    const outputFile = 'benchmark-results.json';
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    log(`Results saved to: ${outputFile}\n`);

  } catch (error) {
    log(`\n${colors.red}Error: ${error.message}${colors.reset}`);
    log(`\nMake sure the server is running at ${SERVER_URL}\n`);
    process.exit(1);
  }
}

/**
 * Calculate performance grade
 */
function calculateGrade(avg, p95) {
  if (avg < 50 && p95 < 100) return 'A+';
  if (avg < 75 && p95 < 150) return 'A';
  if (avg < 100 && p95 < 200) return 'B';
  if (avg < 150 && p95 < 300) return 'C';
  if (avg < 200 && p95 < 400) return 'D';
  return 'F';
}

// Run benchmark
runBenchmark().catch(error => {
  console.error(error);
  process.exit(1);
});
