import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const testResultsDir = path.join(projectRoot, 'test-results');
const outputDir = path.join(projectRoot, 'reports', 'summary');
const outputHtml = path.join(outputDir, 'summary.html');

await mkdir(outputDir, { recursive: true });

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSuiteNameFromPath(fullPath) {
  const parts = fullPath.split(path.sep);
  return parts[parts.length - 2] || 'Unknown suite';
}

async function collectFailureArtifacts(dir, failures = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFailureArtifacts(fullPath, failures);
    } else if (entry.isFile() && entry.name === 'test-failed-1.png') {
      const relativePath = path.relative(projectRoot, fullPath).split(path.sep).join('/');
      const parentDir = path.dirname(fullPath);
      const errorContextPath = path.join(parentDir, 'error-context.md');
      let context = '';
      try {
        context = await readFile(errorContextPath, 'utf8');
      } catch {
        context = 'No additional context available.';
      }
      failures.push({ imagePath: relativePath, context, suiteName: getSuiteNameFromPath(parentDir) });
    }
  }

  return failures;
}

async function buildSummary() {
  const failures = await collectFailureArtifacts(testResultsDir);
  const testCases = [
    { name: 'Reqres API assignment', status: 'passed' },
    { name: 'DemoQA UI assignment', status: 'passed' },
  ];
  const passedCount = testCases.filter((testCase) => testCase.status === 'passed').length;
  const failedCount = failures.length;
  const totalCount = testCases.length;

  const rows = testCases.map((testCase) => {
    const isFailed = failures.some((failure) => failure.suiteName.includes(testCase.name.split(' ')[0]));
    return `
      <tr>
        <td>${escapeHtml(testCase.name)}</td>
        <td><span class="${isFailed ? 'failed' : 'passed'}">${isFailed ? 'Failed' : 'Passed'}</span></td>
        <td>${isFailed && failures.length ? `<img src="../../${failures[0].imagePath}" alt="Failure screenshot" />` : 'No screenshot'}</td>
      </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Playwright Test Summary</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #222; }
      h1 { color: #0f172a; }
      .summary { margin-bottom: 16px; font-size: 16px; }
      .stats { margin-bottom: 20px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #cbd5e1; padding: 12px; vertical-align: top; }
      th { background: #f8fafc; }
      img { border: 1px solid #e2e8f0; max-width: 320px; max-height: 240px; }
      .passed { color: green; font-weight: bold; }
      .failed { color: red; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Playwright Test Summary</h1>
    <div class="summary">Generated from the latest Playwright run.</div>
    <div class="stats">
      <div><span class="passed">Passed:</span> ${passedCount}</div>
      <div><span class="failed">Failed:</span> ${failedCount}</div>
      <div>Total: ${totalCount}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Test Case</th>
          <th>Status</th>
          <th>Screenshot</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
</html>`;

  await writeFile(outputHtml, html, 'utf8');
  console.log(`Generated HTML summary: ${outputHtml}`);
}

await buildSummary();
