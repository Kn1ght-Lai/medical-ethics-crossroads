export const REPOSITORY = 'Kn1ght-Lai/medical-ethics-crossroads';
export const QUESTION_COUNTS = Object.freeze({ icu: 4, privacy: 4, consent: 4 });
const CASE_IDS = Object.keys(QUESTION_COUNTS);
const MARKER = '<!-- white-coat-ethics:v1 -->';

function boundedText(value, maximum) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maximum);
}

export function parseSubmission(issue) {
  if (!issue || issue.pull_request || issue.state !== 'open' || typeof issue.body !== 'string') return null;
  if (issue.body.length > 25_000 || !issue.body.includes(MARKER)) return null;
  if (issue.labels?.some(label => (typeof label === 'string' ? label : label?.name) === 'community-hidden')) return null;
  const match = issue.body.match(/<!-- white-coat-ethics:v1 -->[\s\S]*?```json\s*([\s\S]*?)\s*```/i);
  if (!match) return null;
  let packet;
  try { packet = JSON.parse(match[1]); } catch { return null; }
  if (packet?.version !== 1 || !['score', 'comment'].includes(packet.type) || !CASE_IDS.includes(packet.caseId)) return null;
  const nickname = boundedText(packet.nickname, 32);
  const comment = boundedText(packet.comment, 500);
  const rating = Number(packet.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  if (packet.type === 'comment' && !comment) return null;
  const base = {
    type: packet.type,
    caseId: packet.caseId,
    login: boundedText(issue.user?.login, 80),
    nickname,
    rating,
    comment,
    submittedAt: issue.created_at,
    issueNumber: issue.number,
    issueUrl: issue.html_url
  };
  if (!base.login || !Number.isInteger(base.issueNumber) || typeof base.issueUrl !== 'string') return null;
  if (packet.type === 'comment') return base;
  const result = packet.result;
  if (!result || result.caseId !== packet.caseId || !Array.isArray(result.answers) || result.answers.length !== QUESTION_COUNTS[packet.caseId]) return null;
  const normalizedAnswers = [];
  for (const answer of result.answers) {
    const attempts = Number(answer?.attempts);
    const points = Number(answer?.points);
    const hinted = answer?.hinted === true;
    if (!Number.isInteger(attempts) || attempts < 0 || attempts > 10) return null;
    const expected = hinted ? 30 : attempts > 0 ? 60 : 100;
    if (points !== expected) return null;
    normalizedAnswers.push({ attempts, points, hinted });
  }
  const score = Math.round(normalizedAnswers.reduce((sum, answer) => sum + answer.points, 0) / normalizedAnswers.length);
  if (Number(result.score) !== score) return null;
  const firstCorrectCount = normalizedAnswers.filter(answer => !answer.hinted && answer.attempts === 0).length;
  const hintedCount = normalizedAnswers.filter(answer => answer.hinted).length;
  const correctedCount = normalizedAnswers.length - firstCorrectCount - hintedCount;
  return { ...base, score, firstCorrectCount, correctedCount, hintedCount, totalQuestions: normalizedAnswers.length, completedAt: boundedText(result.completedAt, 40) };
}

function emptyCase() { return { totalPlayers: 0, entries: [], comments: [] }; }

export function buildCommunitySnapshot(issues, now = new Date()) {
  const parsed = issues.map(parseSubmission).filter(Boolean);
  const snapshot = {
    version: 1,
    updatedAt: now.toISOString(),
    repository: REPOSITORY,
    source: 'github-issues',
    selfReported: true,
    cases: Object.fromEntries(CASE_IDS.map(id => [id, emptyCase()]))
  };
  for (const caseId of CASE_IDS) {
    const records = parsed.filter(item => item.caseId === caseId);
    const bestByLogin = new Map();
    for (const item of records.filter(item => item.type === 'score')) {
      const key = item.login.toLowerCase();
      const previous = bestByLogin.get(key);
      if (!previous || item.score > previous.score || (item.score === previous.score && item.submittedAt > previous.submittedAt)) bestByLogin.set(key, item);
    }
    const ranked = [...bestByLogin.values()].sort((a, b) => b.score - a.score || a.submittedAt.localeCompare(b.submittedAt));
    let previousScore = null;
    let previousRank = 0;
    const entries = ranked.map((item, index) => {
      const rank = item.score === previousScore ? previousRank : index + 1;
      previousScore = item.score;
      previousRank = rank;
      return { rank, login: item.login, nickname: item.nickname, submittedAt: item.submittedAt, issueNumber: item.issueNumber, issueUrl: item.issueUrl, score: item.score, firstCorrectCount: item.firstCorrectCount, correctedCount: item.correctedCount, hintedCount: item.hintedCount, totalQuestions: item.totalQuestions, completedAt: item.completedAt };
    });
    const latestCommentByLogin = new Map();
    for (const item of records.filter(item => item.comment)) {
      const key = item.login.toLowerCase();
      const previous = latestCommentByLogin.get(key);
      if (!previous || item.submittedAt > previous.submittedAt) latestCommentByLogin.set(key, item);
    }
    const comments = [...latestCommentByLogin.values()].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 30).map(item => ({ login: item.login, nickname: item.nickname, submittedAt: item.submittedAt, issueNumber: item.issueNumber, issueUrl: item.issueUrl, body: item.comment, rating: item.rating }));
    snapshot.cases[caseId] = { totalPlayers: entries.length, entries: entries.slice(0, 100), comments };
  }
  return snapshot;
}

export function validateCommunitySnapshot(value) {
  if (!value || value.version !== 1 || value.repository !== REPOSITORY || value.source !== 'github-issues' || value.selfReported !== true) return false;
  if (!value.cases || Object.keys(value.cases).length !== CASE_IDS.length || typeof value.updatedAt !== 'string') return false;
  return CASE_IDS.every(id => {
    const item = value.cases[id];
    return item && Number.isInteger(item.totalPlayers) && Array.isArray(item.entries) && Array.isArray(item.comments) && item.entries.length <= 100 && item.comments.length <= 30;
  });
}

export function sameCommunityData(left, right) {
  if (!left || !right) return false;
  const strip = value => ({ version: value.version, repository: value.repository, source: value.source, selfReported: value.selfReported, cases: value.cases });
  return JSON.stringify(strip(left)) === JSON.stringify(strip(right));
}
