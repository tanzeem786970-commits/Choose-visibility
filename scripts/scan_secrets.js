const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const patterns = [
  /VITE_OPENAI_API_KEY/gi,
  /OPENAI_API_KEY/gi,
  /STRIPE_SECRET_KEY/gi,
  /SUPABASE_SERVICE_ROLE_KEY/gi,
  /AWS_SECRET_ACCESS_KEY/gi,
  /FIREBASE_SERVICE_ACCOUNT_JSON/gi,
];

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (['node_modules', '.git'].includes(path.basename(file))) return;
      results.push(...walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk(repoRoot);
const findings = [];
for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    for (const p of patterns) {
      if (p.test(content)) {
        findings.push({ file, pattern: p.source });
      }
    }
  } catch (e) {
    // skip binaries
  }
}

if (findings.length === 0) {
  console.log('No matches found for common secret patterns.');
  process.exit(0);
}

console.log('Potential secret exposures found:');
for (const f of findings) {
  console.log(`${f.pattern} -> ${f.file}`);
}
process.exit(0);
