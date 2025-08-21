#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

type LinkItem = {
  label?: string;
  href: string;
  locale?: 'br' | 'fr' | string;
  source: string;
};

const LINK_REGEX = /<Link[^>]*href=\{?\"([^\"]+)\"[^>]*>([\s\S]*?)<\/Link>/g;
const A_HREF_REGEX = /<a[^>]*href=\"([^\"]+)\"[^>]*>([\s\S]*?)<\/a>/g;
const ROUTER_PUSH_REGEX = /router\.push\(\s*['\"]([^'\"]+)['\"]\s*\)/g;

function inferLocale(href: string): string | undefined {
  if (/^\/br\//.test(href)) return 'br';
  if (/^\/fr\//.test(href)) return 'fr';
  return undefined;
}

function extractLabel(inner: string): string | undefined {
  const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text || undefined;
}

function scanFile(filePath: string): LinkItem[] {
  const src = fs.readFileSync(filePath, 'utf8');
  const items: LinkItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = LINK_REGEX.exec(src))) {
    const href = m[1];
    const label = extractLabel(m[2]);
    items.push({ href, label, locale: inferLocale(href), source: path.relative(process.cwd(), filePath) });
  }

  while ((m = A_HREF_REGEX.exec(src))) {
    const href = m[1];
    const label = extractLabel(m[2]);
    items.push({ href, label, locale: inferLocale(href), source: path.relative(process.cwd(), filePath) });
  }

  while ((m = ROUTER_PUSH_REGEX.exec(src))) {
    const href = m[1];
    items.push({ href, source: path.relative(process.cwd(), filePath), locale: inferLocale(href) });
  }
  return items;
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
  const all: LinkItem[] = files.flatMap(scanFile);
  const unique = Array.from(
    new Map(all.map((i) => [i.source + '|' + i.href + '|' + (i.label || ''), i])).values()
  );
  const jsonPath = path.resolve(process.cwd(), 'docs/dashboard_audit/B_links-inventory.json');
  fs.writeFileSync(jsonPath, JSON.stringify(unique, null, 2), 'utf8');

  // Also emit a human-readable markdown table
  const mdPath = path.resolve(process.cwd(), 'docs/dashboard_audit/B_links-inventory.md');
  const md = [
    '| Label | Href | Locale | Source |',
    '|-------|------|--------|--------|',
    ...unique.map(i => `| ${i.label || ''} | ${i.href} | ${i.locale || ''} | ${i.source} |`)
  ].join('\n');
  fs.writeFileSync(mdPath, md, 'utf8');
  process.stdout.write(JSON.stringify({ jsonPath, mdPath, count: unique.length }, null, 2));
}

main();


