import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCommunitySnapshot, parseSubmission, validateCommunitySnapshot } from './community.mjs';

function issue(overrides = {}) {
  const packet = overrides.packet || { version: 1, type: 'score', caseId: 'icu', nickname: '夜班员', rating: 5, comment: '程序公平很重要。', result: { caseId: 'icu', score: 90, answers: [{ points: 60, attempts: 1, hinted: false }, { points: 100, attempts: 0, hinted: false }, { points: 100, attempts: 0, hinted: false }, { points: 100, attempts: 0, hinted: false }], completedAt: '2026-09-18T00:00:00.000Z' } };
  return { state: 'open', body: `<!-- white-coat-ethics:v1 -->\n\n\`\`\`json\n${JSON.stringify(packet)}\n\`\`\``, user: { login: overrides.login || 'player-one' }, number: overrides.number || 1, html_url: `https://github.com/example/repo/issues/${overrides.number || 1}`, created_at: overrides.created_at || '2026-09-18T00:00:00.000Z', labels: overrides.labels || [] };
}

test('recomputes a valid score submission', () => {
  const parsed = parseSubmission(issue());
  assert.equal(parsed.score, 90);
  assert.equal(parsed.firstCorrectCount, 3);
  assert.equal(parsed.correctedCount, 1);
});

test('rejects inconsistent client scores', () => {
  const candidate = issue();
  candidate.body = candidate.body.replace('"score":90', '"score":100');
  assert.equal(parseSubmission(candidate), null);
});

test('keeps each account best score and uses competition ranking', () => {
  const second = issue({ number: 2, login: 'player-two', created_at: '2026-09-18T01:00:00.000Z' });
  const snapshot = buildCommunitySnapshot([issue(), second], new Date('2026-09-18T02:00:00.000Z'));
  assert.deepEqual(snapshot.cases.icu.entries.map(entry => entry.rank), [1, 1]);
  assert.equal(snapshot.cases.icu.totalPlayers, 2);
  assert.equal(validateCommunitySnapshot(snapshot), true);
});

test('closed and hidden issues are excluded', () => {
  const closed = issue();
  closed.state = 'closed';
  const hidden = issue({ number: 2, labels: [{ name: 'community-hidden' }] });
  const snapshot = buildCommunitySnapshot([closed, hidden]);
  assert.equal(snapshot.cases.icu.totalPlayers, 0);
});
