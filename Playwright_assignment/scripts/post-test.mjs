import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const summaryScript = path.join(projectRoot, 'scripts', 'generate-report-summary.mjs');
const pdfScript = path.join(projectRoot, 'scripts', 'generate-pdf.mjs');

const run = (script) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [script], { cwd: projectRoot, stdio: 'inherit' });
  child.on('exit', (code) => {
    if (code === 0) resolve();
    else reject(new Error(`Script exited with ${code}`));
  });
  child.on('error', reject);
});

try {
  await run(summaryScript);
  await run(pdfScript);
  console.log('Post-test report generation completed.');
} catch (error) {
  console.error('Post-test report generation failed:', error.message);
}
