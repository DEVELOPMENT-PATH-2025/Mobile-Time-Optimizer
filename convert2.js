import fs from 'fs';
import path from 'path';

const replacements = [
  { regex: /bg-\[\#121620\]/g, replace: "bg-bg-card" },
  { regex: /bg-\[\#1c2230\]/g, replace: "bg-bg-hover" },
  { regex: /text-\[\#8a9cc2\]/g, replace: "text-text-secondary" },
  { regex: /text-\[\#4a6bba\]/g, replace: "text-text-muted" },
  { regex: /text-\[\#8c9bab\]/g, replace: "text-text-muted" },
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
