import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const summaryDir = path.join(projectRoot, 'reports', 'summary');
const summaryHtml = path.join(summaryDir, 'summary.html');
const outputPdf = path.join(summaryDir, 'summary.pdf');

await fs.mkdir(summaryDir, { recursive: true });

if (await fs.stat(summaryHtml).catch(() => null)) {
  const chromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];

  let chromePath = null;
  for (const candidate of chromePaths) {
    try {
      await fs.access(candidate);
      chromePath = candidate;
      break;
    } catch {
      // ignore
    }
  }

  if (chromePath) {
    execFile(chromePath, ['--headless=new', '--disable-gpu', '--print-to-pdf=' + outputPdf, summaryHtml], (error) => {
      if (error) {
        console.error('PDF generation failed:', error.message);
      } else {
        console.log(`Generated PDF summary: ${outputPdf}`);
      }
    });
  } else {
    console.log('Chrome/Chromium not found. HTML summary generated at:', summaryHtml);
  }
} else {
  console.log('No summary HTML found. Run npm run report:summary first.');
}
