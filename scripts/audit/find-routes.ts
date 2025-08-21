#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

type RouteInfo = {
  file: string;
  route: string;
  componentType: 'Client' | 'Server';
};

function isClientComponent(contents: string): boolean {
  return /\"use client\"|'use client'/.test(contents);
}

function toRoute(filePath: string): string {
  const parts = filePath.split(path.sep);
  const idx = parts.indexOf('app');
  const routeParts = parts.slice(idx + 1);
  const pageIdx = routeParts.lastIndexOf('page.tsx');
  if (pageIdx >= 0) routeParts.splice(pageIdx, 1);
  // Convert Windows separators
  const route = '/' + routeParts.join('/').replace(/\\/g, '/').replace(/\/page\.tsx$/, '');
  return route.replace(/\/page\.tsx$/, '').replace(/\/index\.tsx$/, '');
}

function walk(dir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, acc);
    } else if (e.isFile() && e.name === 'page.tsx' && full.includes(path.join('[locale]', 'dashboard'))) {
      acc.push(full);
    }
  }
  return acc;
}

function main() {
  const root = path.resolve(process.cwd(), 'app');
  const files = walk(root);
  const routes: RouteInfo[] = files.map((f) => {
    const contents = fs.readFileSync(f, 'utf8');
    return {
      file: path.relative(process.cwd(), f),
      route: toRoute(f).replace(/\/page\.tsx$/, ''),
      componentType: isClientComponent(contents) ? 'Client' : 'Server',
    };
  });
  process.stdout.write(JSON.stringify(routes, null, 2));
}

main();


