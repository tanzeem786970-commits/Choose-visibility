const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcPages = path.join(root, 'src', 'pages');
const srcComponents = path.join(root, 'src', 'components');

function listDirRecursive(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...listDirRecursive(full));
    } else {
      results.push(path.relative(root, full));
    }
  }
  return results;
}

function detectTechStack() {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return {
    name: pkg.name,
    dependencies: Object.keys(pkg.dependencies || {}),
    devDependencies: Object.keys(pkg.devDependencies || {}),
  };
}

function ensurePages(pages) {
  const created = [];
  if (!fs.existsSync(srcPages)) fs.mkdirSync(srcPages, { recursive: true });

  pages.forEach((p) => {
    const fileName = p.fileName;
    const filePath = path.join(srcPages, fileName);
    if (!fs.existsSync(filePath)) {
      const content = `import Navbar from '@/components/layout/Navbar';\nimport Footer from '@/components/layout/Footer';\n\nexport default function ${p.componentName}() {\n  return (\n    <div className=\"min-h-screen bg-background\">\n      <Navbar />\n      <main className=\"pt-24 pb-16 container mx-auto px-4\">\n        <h1 className=\"font-heading text-3xl font-bold\">${p.title}</h1>\n        <p className=\"text-muted-foreground mt-4\">This is the ${p.title} page.</p>\n      </main>\n      <Footer />\n    </div>\n  );\n}\n`;
      fs.writeFileSync(filePath, content, 'utf8');
      created.push(path.relative(root, filePath));
    }
  });
  return created;
}

function checkRoutes() {
  // Simple heuristic: scan for Link to= occurrences and ensure target pages exist
  const files = listDirRecursive(path.join(root, 'src'));
  const links = new Set();
  files.forEach((f) => {
    const full = path.join(root, f);
    try {
      const text = fs.readFileSync(full, 'utf8');
      const regex = /to=\{?['\"]([^'\"}]+)['\"]\}?/g;
      let m;
      while ((m = regex.exec(text)) !== null) {
        links.add(m[1]);
      }
    } catch (e) {}
  });

  const missing = [];
  links.forEach((lnk) => {
    // map common routes to page filenames
    const candidate = lnk.replace(/^\//, '');
    const candidates = [
      `src/pages/${candidate}.tsx`,
      `src/pages/${candidate.charAt(0).toUpperCase() + candidate.slice(1)}.tsx`,
      `src/pages/${candidate.replace(/-/g, '')}.tsx`,
    ];
    const exists = candidates.some((c) => fs.existsSync(path.join(root, c)));
    if (!exists && candidate !== '') missing.push(lnk);
  });
  return missing;
}

function run() {
  console.log('Running preflight checks...');

  console.log('\n1) Project structure (top-level files):');
  const top = fs.readdirSync(root).slice(0, 40);
  console.log(top.join(' | '));

  console.log('\n2) Pages under src/pages:');
  const pages = listDirRecursive(srcPages).map((p) => p.replace(/\\/g, '/'));
  pages.forEach((p) => console.log(' -', p));

  console.log('\n3) Components under src/components (top-level):');
  const comps = listDirRecursive(srcComponents).slice(0, 200).map((p) => p.replace(/\\/g, '/'));
  comps.forEach((c) => console.log(' -', c));

  console.log('\n4) Tech stack (package.json dependencies):');
  const tech = detectTechStack();
  if (tech) {
    console.log(' - dependencies:', tech.dependencies.join(', '));
    console.log(' - devDependencies:', tech.devDependencies.join(', '));
  }

  console.log('\n5) Check for referenced routes/links with missing pages:');
  const missingLinks = checkRoutes();
  if (missingLinks.length) {
    console.log(' - Missing target pages for links:', missingLinks.join(', '));
  } else {
    console.log(' - No missing link targets found.');
  }

  // Auto-create a set of common missing pages if absent
  const missingPagesToEnsure = [
    { fileName: 'Privacy.tsx', componentName: 'Privacy', title: 'Privacy Policy' },
    { fileName: 'Terms.tsx', componentName: 'Terms', title: 'Terms of Service' },
    { fileName: 'Refund.tsx', componentName: 'Refund', title: 'Refund Policy' },
    { fileName: 'Contact.tsx', componentName: 'Contact', title: 'Contact Us' },
    { fileName: 'Features.tsx', componentName: 'Features', title: 'Features' },
    { fileName: 'HowItWorks.tsx', componentName: 'HowItWorks', title: 'How It Works' },
    { fileName: 'Testimonials.tsx', componentName: 'Testimonials', title: 'Testimonials' },
    { fileName: 'FAQ.tsx', componentName: 'FAQ', title: 'FAQ' },
    { fileName: '404.tsx', componentName: 'Page404', title: 'Page Not Found' },
  ];

  const created = ensurePages(missingPagesToEnsure);
  if (created.length) {
    console.log('\nAuto-created missing page files:');
    created.forEach((c) => console.log(' -', c));
  } else {
    console.log('\nAll standard pages already exist.');
  }

  console.log('\nPreflight checks complete.');
}

run();
