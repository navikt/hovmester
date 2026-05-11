#!/usr/bin/env node
/**
 * cache-bust.js — Legger til ?v=<hash> på lokale script-referanser i deck-HTML.
 *
 * Kjøres automatisk etter runtime-build via npm run build.
 * Hashen er basert på innholdet i scriptfilen, slik at nettlesere
 * invaliderer cache når runtime eller slides endres.
 */
const { createHash } = require('crypto');
const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const { join, resolve } = require('path');

const ROOT = resolve(__dirname, '..');
const RUNTIME = join(ROOT, '_shared', 'deck-stage.js');

function hashFile(file) {
  return createHash('md5')
    .update(readFileSync(file))
    .digest('hex')
    .slice(0, 8);
}

// Finn alle index.html-filer (maks 2 nivåer, ekskluder node_modules og src)
const SKIP = new Set(['node_modules', 'src', '.git', 'scripts']);

function findHtmlFiles(dir, depth = 0) {
  if (depth > 2) return [];
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...findHtmlFiles(full, depth + 1));
    } else if (entry === 'index.html') {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(ROOT);
let updated = 0;

for (const file of htmlFiles) {
  let content = readFileSync(file, 'utf8');
  let newContent = content;

  if (content.includes('deck-stage.js')) {
    const runtimeHash = hashFile(RUNTIME);
    newContent = newContent.replace(
      /(src="\.\.\/_shared\/deck-stage\.js)(\?v=[a-f0-9]*)?(")/g,
      `$1?v=${runtimeHash}$3`,
    );
  }

  if (content.includes('slides.js')) {
    const slides = join(file.replace(/index\.html$/, ''), 'slides.js');
    const slidesHash = hashFile(slides);
    newContent = newContent.replace(
      /(src="slides\.js)(\?v=[a-f0-9]*)?(")/g,
      `$1?v=${slidesHash}$3`,
    );
  }

  if (newContent !== content) {
    writeFileSync(file, newContent, 'utf8');
    updated++;
    console.log(`  ✓ ${file.replace(ROOT + '/', '')}`);
  }
}

console.log(`cache-bust: ${updated} fil(er) oppdatert`);
