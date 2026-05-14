import fs from 'fs';
import path from 'path';

const replacements = [
  { regex: /bg-\[\#050608\]/g, replace: "bg-bg-app" },
  { regex: /bg-\[\#0b0e14\]/g, replace: "bg-bg-mobile" },
  { regex: /bg-\[\#0b0e14\]\/95/g, replace: "bg-bg-mobile/95" },
  { regex: /bg-\[\#131823\]/g, replace: "bg-bg-card" },
  { regex: /bg-\[\#1e2433\]/g, replace: "bg-bg-border" },
  { regex: /bg-\[\#1e2330\]/g, replace: "bg-bg-border" },
  { regex: /border-\[\#1e2433\]/g, replace: "border-bg-border" },
  { regex: /border-\[\#1e2330\]/g, replace: "border-bg-border" },
  { regex: /bg-\[\#1a2130\]/g, replace: "bg-bg-hover" },
  { regex: /bg-\[\#2a344a\]/g, replace: "bg-bg-chart-hover" },
  { regex: /text-white/g, replace: "text-text-primary" },
  { regex: /text-\[\#ffffff\]/g, replace: "text-text-primary" },
  { regex: /text-\[\#c1d0eb\]/g, replace: "text-text-high" },
  { regex: /text-\[\#8ca0c9\]/g, replace: "text-text-secondary" },
  { regex: /text-\[\#5e7194\]/g, replace: "text-text-muted" },
  { regex: /text-\[\#5a657e\]/g, replace: "text-text-muted" },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

// Convert
processDir(path.join(process.cwd(), 'src'));
console.log("Conversion complete");
