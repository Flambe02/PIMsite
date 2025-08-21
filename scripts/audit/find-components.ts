#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

type ComponentRow = {
  name: string;
  file: string;
  props?: string;
  dynamicImport?: boolean;
  approxLOC?: number;
};

const IMPORT_REGEX = /import\s+([A-Za-z0-9_\{\},\s\*]+)\s+from\s+['\"]([^'\"]+)['\"];?/g;
const DYNAMIC_REGEX = /dynamic\(.*?\)/g;
const EXPORT_COMP_REGEX = /export\s+default\s+function\s+([A-Za-z0-9_]+)/;

function read(file: string): string {
  return fs.readFileSync(file, 'utf8');
}

function approxLOC(src: string): number {
  return src.split('\n').length;
}

function walk(dir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(e.name) && full.includes(path.join('[locale]', 'dashboard'))) acc.push(full);
  }
  return acc;
}

function main() {
  const root = path.resolve(process.cwd(), 'app');
  const files = walk(root);
  const rows: ComponentRow[] = [];
  for (const f of files) {
    const src = read(f);
    const rel = path.relative(process.cwd(), f);
    let m: RegExpExecArray | null;
    const dyn = DYNAMIC_REGEX.test(src);
    while ((m = IMPORT_REGEX.exec(src))) {
      const names = m[1].replace(/[\{\}\s\*]/g, ' ').split(' ').filter(Boolean);
      const from = m[2];
      for (const n of names) {
        rows.push({ name: n, file: `${rel} ← ${from}`, dynamicImport: dyn || /dynamic\(/.test(src), approxLOC: approxLOC(src) });
      }
    }
    const exp = EXPORT_COMP_REGEX.exec(src);
    if (exp) rows.push({ name: exp[1], file: rel, dynamicImport: dyn, approxLOC: approxLOC(src) });
  }
  const outPath = path.resolve(process.cwd(), 'docs/dashboard_audit/C_components-map.md');
  const md = ['| Name | File | Dynamic | LOC |', '|------|------|--------|-----|', ...rows.map(r => `| ${r.name} | ${r.file} | ${r.dynamicImport ? 'yes' : 'no'} | ${r.approxLOC || ''} |`)].join('\n');
  fs.writeFileSync(outPath, md, 'utf8');
  process.stdout.write(JSON.stringify({ outPath, rows: rows.length }, null, 2));
}

main();


