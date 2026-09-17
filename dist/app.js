function detectRepository() {
  if (!location.hostname.endsWith('.github.io')) return null;
  const owner = location.hostname.split('.')[0];
  const repo = location.pathname.split('/').filter(Boolean)[0];
  return owner && repo ? `${owner}/${repo}` : null;
}

const REPOSITORY = detectRepository() || 'Kn1ght-Lai/medical-ethics-crossroads';
const STORAGE_KEY = 'medical-ethics-crossroads-v1';
const dimensions = window.ETHICS_DIMENSIONS;
const questions = window.ETHICS_QUESTIONS;
const caseArchive = window.ETHICS_CASE_ARCHIVE;

const portraits = {
  'autonomy-care': ['并肩的倾听者', '你常从“这个人想过怎样的生活”出发，同时留意恐惧、依赖和家人关系。你的长处是不会轻易用“为你好”代替本人发言。困难在于：当一个人的选择影响家人或占用公共资源时，自由的边界并不清楚。'],
  'autonomy-duty': ['边界的立法者', '你既重视本人作主，也要求选择发生在公开、人人适用的边界内。你的长处是同时警惕别人替患者作主和随意破例。困难在于：紧急时刻，程序应该坚持到什么程度？'],
  'autonomy-utility': ['选择的现实主义者', '你愿意给个人较大的选择空间，也会认真比较伤害、好处和资源消耗。你的长处是正视现实代价。困难在于：当本人愿望和多数人的利益冲突时，不能只靠数字决定谁该牺牲。'],
  'care-duty': ['有温度的守门人', '你相信规则可以保护人，也坚持规则必须看见弱势处境。你的长处是把“能不能追责”和“有没有照顾到人”放在一起。困难在于：给个别情况多少特殊照顾，才不会让共同标准失效？'],
  'duty-utility': ['制度的工程师', '你关心一项决定能不能稳定地产生较好的结果，也能不能用同一标准检查。你的长处是清楚、可执行、能追责。困难在于：流程和数字很容易遮住无法计算的尊严、悲伤和历史不公。'],
  'care-utility': ['处境的调和者', '你会比较各种选择的后果，但不愿把人只当成统计数字。你的长处是在现实限制中保留人的处境。困难在于：对每个故事都特别体谅，可能让相似的人得到不同答案。']
};

let state = loadState();
const startScreen = document.querySelector('#startScreen');
const gameScreen = document.querySelector('#gameScreen');
const resultScreen = document.querySelector('#resultScreen');
const optionsEl = document.querySelector('#options');
const reflectionEl = document.querySelector('#reflection');
const nextButton = document.querySelector('#nextButton');
const resumeButton = document.querySelector('#resumeButton');

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.answers) && saved.answers.length <= questions.length) return saved;
  } catch (_) {}
  return { index: 0, answers: [], completed: false };
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
}

function resetState() {
  state = { index: 0, answers: [], completed: false };
  saveState();
}

function begin(resume = false) {
  if (!resume) resetState();
  startScreen.hidden = true;
  resultScreen.hidden = true;
  gameScreen.hidden = false;
  renderQuestion();
}

function renderQuestion() {
  const q = questions[state.index];
  const answered = state.answers[state.index];
  document.querySelector('#chapterLabel').textContent = q.chapter;
  document.querySelector('#progressText').textContent = `${state.index + 1} / ${questions.length}`;
  document.querySelector('#progressBar').style.width = `${((state.index + 1) / questions.length) * 100}%`;
  document.querySelector('#questionTitle').textContent = q.title;
  document.querySelector('#questionScenario').textContent = q.scenario;
  document.querySelector('#questionScenario').hidden = !q.scenario;
  document.querySelector('#questionPrompt').textContent = q.prompt;
  const badge = document.querySelector('.case-badge');
  badge.className = `case-badge ${q.type === 'direct' ? 'direct' : q.status}`;
  badge.textContent = q.type === 'direct' ? '直接质询' : q.statusLabel;
  document.querySelector('#questionKind').textContent = q.type === 'direct' ? '不带故事的原则问题' : '具体情境';
  optionsEl.innerHTML = q.options.map((option, index) => `
    <button class="option${answered === index ? ' selected' : ''}" data-index="${index}" ${answered !== undefined ? 'disabled' : ''}>
      <span class="option-key">${String.fromCharCode(65 + index)}</span>
      <span>${option[1]}</span>
    </button>`).join('');
  if (answered !== undefined) showReflection(q.options[answered][0]);
  else {
    reflectionEl.hidden = true;
    nextButton.hidden = true;
  }
  nextButton.innerHTML = state.index === questions.length - 1 ? '生成两张画像 <span aria-hidden="true">→</span>' : '继续 <span aria-hidden="true">→</span>';
  document.querySelector('#app').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showReflection(dimension) {
  const d = dimensions[dimension];
  reflectionEl.innerHTML = `<strong>这一次，你先保护了“${d.name}”</strong>${d.feedback}`;
  reflectionEl.hidden = false;
  nextButton.hidden = false;
}

function choose(index) {
  if (state.answers[state.index] !== undefined) return;
  state.answers[state.index] = index;
  saveState();
  [...optionsEl.children].forEach((item, i) => {
    item.disabled = true;
    item.classList.toggle('selected', i === index);
  });
  showReflection(questions[state.index].options[index][0]);
  nextButton.focus();
}

function selectedDimension(questionIndex) {
  const answer = state.answers[questionIndex];
  return questions[questionIndex].options[answer][0];
}

function calculateResults() {
  const counts = { autonomy: 0, duty: 0, utility: 0, care: 0 };
  questions.forEach((_, i) => { counts[selectedDimension(i)] += 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const key = [sorted[0][0], sorted[1][0]].sort().join('-');
  const portrait = portraits[key] || ['多声部的权衡者', '你的选择没有被两种倾向清楚主导。你会在不同问题里使用不同的判断方法。长处是灵活；困难在于，你需要说明自己为什么在这里改变标准。'];

  const pairs = {};
  questions.forEach((q, i) => {
    if (!q.pair) return;
    if (!pairs[q.pair]) pairs[q.pair] = {};
    pairs[q.pair][q.type] = selectedDimension(i);
  });
  const comparisons = Object.values(pairs).filter(p => p.scenario && p.direct);
  const matches = comparisons.filter(p => p.scenario === p.direct).length;
  const stability = Math.round((matches / comparisons.length) * 100);
  const sensitivity = 100 - stability;
  let refraction;
  if (stability >= 75) refraction = ['原则锚定型', '同一个伦理问题换一种说法时，你大多仍然使用同一种判断方法。稳定不等于僵化。更值得追问的是：出现什么新事实，你才愿意改变原来的原则？'];
  else if (stability >= 45) refraction = ['情境校准型', '你的原则有清楚轮廓，但看到具体的人、关系和风险后，你会重新调整各种理由的分量。这不简单等于“前后矛盾”，更像在原则和个案之间反复校准。'];
  else refraction = ['双轨回应型', '当抽象问题变成具体的人和故事时，你经常换一种判断方法。故事对你的影响很明显。可以继续想一想：让你改变的是同情、风险、对制度的信任，还是别的东西？'];

  const scenarioCounts = { autonomy: 0, duty: 0, utility: 0, care: 0 };
  const directCounts = { autonomy: 0, duty: 0, utility: 0, care: 0 };
  questions.forEach((q, i) => (q.type === 'scenario' ? scenarioCounts : directCounts)[selectedDimension(i)]++);
  const shifts = Object.keys(dimensions).map(k => ({
    key: k,
    value: Math.round((scenarioCounts[k] / 12 - directCounts[k] / 8) * 100)
  })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return { counts, sorted, portrait, stability, sensitivity, refraction, strongestShift: shifts[0], matches, totalPairs: comparisons.length };
}

function barMarkup(key, count) {
  const d = dimensions[key];
  const percent = Math.round((count / questions.length) * 100);
  return `<div class="score-row">
    <div class="score-label"><span>${d.name}<small>${d.short}</small></span><strong>${percent}%</strong></div>
    <div class="score-track"><i style="width:${percent}%; background:${d.color}"></i></div>
  </div>`;
}

function archiveMarkup() {
  return caseArchive.map(item => `<article class="archive-item">
    <div><span class="case-badge ${item.className}">${item.label}</span><small>${item.range}</small></div>
    <h4>${item.title}</h4>
    <p>${item.note}</p>
    ${item.source ? `<a href="${item.source}" target="_blank" rel="noopener">${item.sourceLabel} ↗</a>` : '<span class="no-source">没有对应的现实人物或事件</span>'}
  </article>`).join('');
}

function renderResults() {
  state.completed = true;
  saveState();
  const r = calculateResults();
  const top = dimensions[r.sorted[0][0]];
  const shift = r.strongestShift;
  const shiftText = shift.value === 0
    ? '具体故事没有明显改变你对四种判断方法的总体使用比例。'
    : `进入具体故事后，你使用“${dimensions[shift.key].name}”作为首要理由的比例${shift.value > 0 ? '增加' : '减少'}了 ${Math.abs(shift.value)} 个百分点。`;

  gameScreen.hidden = true;
  resultScreen.hidden = false;
  document.querySelector('#resultContent').innerHTML = `
    <div class="result-hero">
      <div class="eyebrow">你的伦理立场画像</div>
      <p class="result-kicker">最常出现的判断方法 · ${top.name}</p>
      <h2>${r.portrait[0]}</h2>
      <p>${r.portrait[1]}</p>
    </div>

    <div class="result-grid">
      <section class="result-panel">
        <div class="panel-heading"><span>画像 01</span><h3>你通常先保护什么</h3></div>
        ${Object.entries(r.counts).map(([key, count]) => barMarkup(key, count)).join('')}
        <p class="method-note">百分比表示：20 次选择中，你有多少次把这种理由放在第一位。它只描述倾向，不评定高低，也没有“及格线”。</p>
      </section>

      <section class="result-panel refraction-panel">
        <div class="panel-heading"><span>画像 02</span><h3>${r.refraction[0]}</h3></div>
        <div class="dial" style="--value:${r.stability}">
          <div><strong>${r.stability}%</strong><span>同一问题，判断方法不变</span></div>
        </div>
        <div class="split-stat">
          <span><strong>${r.stability}%</strong>原则延续</span>
          <span><strong>${r.sensitivity}%</strong>看到故事后改变</span>
        </div>
        <p>${r.refraction[1]}</p>
        <p class="shift-note">${shiftText}</p>
        <p class="method-note">我们比较了 ${r.totalPairs} 组题：每组实际讨论同一个问题，但一题讲具体故事，另一题直接问原则。你有 ${r.matches} 组使用了同一种首要理由。改变不扣分。</p>
      </section>
    </div>

    <section class="archive-section">
      <div class="section-heading">
        <div><span>案例透明度</span><h3>哪些是真的，哪些是设计的</h3></div>
        <p>12 道情境题中：6 道基于真实史实，2 道来自真实案例并经过压缩改写，4 道完全虚构。最后 8 道直接质询不是案例。</p>
      </div>
      <div class="archive-grid">${archiveMarkup()}</div>
      <p class="archive-caveat">为了控制游戏长度，史实都经过压缩。除明确说明外，游戏不把虚构对白说成当事人的原话。资料链接只用于核对事件背景，不表示来源机构认可本游戏或画像方法。</p>
    </section>

    <section class="feedback-section">
      <div class="feedback-copy">
        <span>带着画像继续讨论</span>
        <h3>把结果和建议留在 GitHub</h3>
        <p>你点击按钮后，网页只会在本机生成一份 GitHub 反馈草稿。你仍然需要登录、检查内容并亲自发布。网页不会读取你的 GitHub 账号，也不会自动上传答题记录。</p>
        <a class="text-link" href="https://github.com/${REPOSITORY}/issues" target="_blank" rel="noopener">查看其他玩家公开发布的反馈 ↗</a>
      </div>
      <form id="feedbackForm" class="feedback-form">
        <label>公开显示的昵称（可以不填）<input id="nickname" maxlength="40" placeholder="例如：一位夜班医生"></label>
        <label>你给这次体验几分
          <select id="rating"><option value="5">5 — 很有启发</option><option value="4">4 — 值得推荐</option><option value="3">3 — 还可以</option><option value="2">2 — 需要改进</option><option value="1">1 — 没有帮助</option></select>
        </label>
        <label>你最想继续讨论什么<textarea id="comment" rows="4" maxlength="800" placeholder="哪一道题让你犹豫？为什么？"></textarea></label>
        <label>你对游戏有什么建议<textarea id="suggestion" rows="3" maxlength="800" placeholder="可以谈题目、文字、节奏、画面或结果解释"></textarea></label>
        <button type="submit" class="primary-button">去 GitHub 检查并发布 <span aria-hidden="true">↗</span></button>
      </form>
    </section>

    <div class="result-actions">
      <button class="quiet-button" id="copyResult">复制结果摘要</button>
      <button class="quiet-button" id="restartButton">重新开始</button>
    </div>`;

  document.querySelector('#feedbackForm').addEventListener('submit', (event) => submitFeedback(event, r));
  document.querySelector('#restartButton').addEventListener('click', () => {
    resetState();
    resultScreen.hidden = true;
    startScreen.hidden = false;
    resumeButton.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.querySelector('#copyResult').addEventListener('click', async (event) => {
    const text = `临界处方｜伦理立场：${r.portrait[0]}；面对具体故事：${r.refraction[0]}（同一问题使用相同判断方法 ${r.stability}%）`;
    try {
      await navigator.clipboard.writeText(text);
      event.currentTarget.textContent = '已经复制';
    } catch (_) { event.currentTarget.textContent = text; }
  });
  document.querySelector('#app').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitFeedback(event, r) {
  event.preventDefault();
  const nickname = document.querySelector('#nickname').value.trim() || '没有填写';
  const rating = document.querySelector('#rating').value;
  const comment = document.querySelector('#comment').value.trim() || '没有填写';
  const suggestion = document.querySelector('#suggestion').value.trim() || '没有填写';
  const scoreLine = Object.entries(r.counts).map(([key, count]) => `${dimensions[key].name} ${Math.round(count / questions.length * 100)}%`).join(' / ');
  const title = `[试玩反馈] ${r.portrait[0]} · ${r.refraction[0]}`;
  const body = `## 我的结果\n\n- 伦理立场：**${r.portrait[0]}**\n- 四种判断方法：${scoreLine}\n- 面对具体故事：**${r.refraction[0]}**\n- 同一问题使用相同判断方法：${r.stability}%（${r.matches}/${r.totalPairs} 组）\n\n## 试玩反馈\n\n- 昵称：${nickname}\n- 评分：${rating}/5\n- 最想讨论的地方：${comment}\n- 对游戏的建议：${suggestion}\n\n> 以上内容由网页在本机生成，并由我检查后公开发布。`;
  const url = `https://github.com/${REPOSITORY}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  window.open(url, '_blank', 'noopener');
}

document.querySelector('#startButton').addEventListener('click', () => begin(false));
resumeButton.addEventListener('click', () => state.completed ? renderResults() : begin(true));
optionsEl.addEventListener('click', (event) => {
  const button = event.target.closest('.option');
  if (button) choose(Number(button.dataset.index));
});
nextButton.addEventListener('click', () => {
  if (state.answers[state.index] === undefined) return;
  if (state.index >= questions.length - 1) renderResults();
  else { state.index += 1; saveState(); renderQuestion(); }
});

document.querySelector('.brand').addEventListener('click', (event) => {
  event.preventDefault();
  gameScreen.hidden = true;
  resultScreen.hidden = true;
  startScreen.hidden = false;
  resumeButton.hidden = state.answers.length === 0;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (state.answers.length) {
  resumeButton.hidden = false;
  resumeButton.textContent = state.completed ? '查看上次结果' : `继续上次进度 ${Math.min(state.answers.length + 1, questions.length)}/${questions.length}`;
}
