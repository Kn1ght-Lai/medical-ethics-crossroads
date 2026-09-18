import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPOSITORY, QUESTION_COUNTS, buildCommunitySnapshot, validateCommunitySnapshot, sameCommunityData } from './community.mjs';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publish = process.argv.includes('--publish');
const token = process.env.GITHUB_TOKEN;
if (publish && (!token || process.env.GITHUB_REPOSITORY !== REPOSITORY)) throw new Error('Publishing requires this repository\'s Actions token.');
const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'white-coat-ethics-community', ...(token ? { Authorization: `Bearer ${token}` } : {}) };

async function request(path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/${path}`, { ...options, headers: { ...headers, ...options.headers }, signal: AbortSignal.timeout(25_000) });
  if (!response.ok) {
    const error = new Error(`GitHub request failed (${response.status}); the previous snapshot is unchanged.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function openIssues() {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const issues = await request(`issues?state=open&sort=created&direction=asc&per_page=100&page=${page}`);
    if (!Array.isArray(issues)) throw new Error('Unexpected issue-list response.');
    all.push(...issues);
    if (issues.length < 100) return all;
  }
  throw new Error('Too many open issues for one bounded rebuild.');
}

for (let attempt = 0; attempt < 3; attempt += 1) {
  const issues = await openIssues();
  const snapshot = buildCommunitySnapshot(issues);
  if (!validateCommunitySnapshot(snapshot)) throw new Error('Refusing to publish an invalid snapshot.');
  let existing = null;
  let sha;
  let currentShape = false;
  const readExisting = raw => {
    currentShape = Object.keys(raw?.cases ?? {}).length === Object.keys(QUESTION_COUNTS).length;
    return validateCommunitySnapshot(raw) ? raw : null;
  };
  if (publish) {
    try {
      const file = await request('contents/community.json?ref=main');
      if (file.type !== 'file' || file.encoding !== 'base64' || typeof file.sha !== 'string') throw new Error('Unexpected snapshot response.');
      sha = file.sha;
      existing = readExisting(JSON.parse(Buffer.from(file.content, 'base64').toString('utf8')));
    } catch (error) { if (error.status !== 404) throw error; }
  } else {
    try { existing = readExisting(JSON.parse(await readFile(resolve(project, 'community.json'), 'utf8'))); } catch { /* Bootstrap locally. */ }
  }
  if (existing && currentShape && sameCommunityData(existing, snapshot)) {
    console.log(JSON.stringify({ status: 'unchanged', openIssues: issues.length, updatedAt: existing.updatedAt }));
    break;
  }
  const text = JSON.stringify(snapshot, null, 2) + '\n';
  if (!publish) {
    await writeFile(resolve(project, 'community.json'), text);
    console.log(JSON.stringify({ status: 'written', openIssues: issues.length }));
    break;
  }
  try {
    await request('contents/community.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Update public scores and comments', content: Buffer.from(text).toString('base64'), branch: 'main', ...(sha ? { sha } : {}) }) });
    console.log(JSON.stringify({ status: 'published', openIssues: issues.length }));
    break;
  } catch (error) {
    if (![409, 422].includes(error.status) || attempt === 2) throw error;
  }
}
