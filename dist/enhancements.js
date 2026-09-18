// GitHub edition: clearer adolescent-confidentiality case, deliberate answer confirmation,
// and an opt-in public score/comment loop backed by GitHub Issues.
const COMMUNITY_REPOSITORY = 'Kn1ght-Lai/medical-ethics-crossroads';
const COMMUNITY_SNAPSHOT_URL = `https://raw.githubusercontent.com/${COMMUNITY_REPOSITORY}/main/community.json`;

cases[1].intro = '17 岁的晓雨因家族性高胆固醇血症风险接受了遗传检测。检测前的同意流程已经完成；今天她由母亲陪同复诊，但希望先独自听取结果。你需要在她的隐私、理解能力、持续治疗与家庭支持之间逐步建立可执行的方案。';
cases[1].stakeholders = ['晓雨 · 17 岁，就诊者', '母亲 · 陪同复诊的主要照护者', '遗传咨询师 · 解释结果与家族风险', '临床团队 · 负责治疗、保密与随访'];
cases[1].questions = [
  {
    title: '先把谈话规则说清楚',
    situation: '晓雨和母亲一起来到诊室。晓雨提出想先单独谈，母亲有些意外。预约记录显示，检测前团队已经完成了说明与同意流程。',
    lens: '当前任务：为结果沟通建立可信、可兑现的边界。',
    prompt: '咨询师最合适的第一步是什么？',
    hint: '先单独交谈不等于排斥家人；关键是提前说明隐私规则与少数例外。',
    answer: 'b',
    reason: '应尊重她先单独交谈的请求，用适龄语言重申保密原则、可能的安全例外及当地规则，并确认她是否愿意稍后邀请母亲参与。',
    options: [
      { id: 'a', label: '要求母亲全程在场，因为晓雨未满 18 岁', feedback: '年龄本身不能替代对理解能力、具体事项和当地规则的判断；也会让晓雨难以表达真实担忧。' },
      { id: 'b', label: '安排一段单独谈话，重申保密边界，并询问她希望母亲如何参与', feedback: '正确。先把规则和选择说清楚，才能让后续家庭参与建立在信任与授权上。' },
      { id: 'c', label: '无条件保证任何情况都不会告诉家人', feedback: '绝对保证可能无法兑现，也会隐藏安全例外和具体法律政策边界。' }
    ]
  },
  {
    title: '结果需要被真正理解',
    situation: '结果提示家族性高胆固醇血症相关变异。它增加较早发生心血管疾病的风险，但可以通过进一步评估、生活方式与药物管理降低风险。晓雨听完后沉默了。',
    lens: '当前任务：先帮助本人理解结果，再讨论向谁披露。',
    prompt: '团队接下来应优先做什么？',
    hint: '不要把“阳性”只说成一个标签；先确认她理解了风险、可干预性和下一步。',
    answer: 'a',
    reason: '应分段解释结果及不确定性，用复述法确认理解，回应情绪，并把可执行的临床随访与家庭沟通分开讨论。',
    options: [
      { id: 'a', label: '用通俗语言解释可干预的风险，请她复述理解并表达担忧', feedback: '正确。理解与情绪得到处理后，后续决定才不是在恐慌中完成。' },
      { id: 'b', label: '立即请母亲进来，因为阳性结果必然属于全家', feedback: '结果可能与家人相关，但这不等于可以跳过本人理解、授权与保密评估。' },
      { id: 'c', label: '只把报告交给她，让她回家自行研究', feedback: '一份报告不能替代双向解释、理解确认和明确的随访计划。' }
    ]
  },
  {
    title: '家族风险不等于立即披露',
    situation: '晓雨理解结果后说，她担心母亲会责怪父亲一方的家族，所以暂时不想当场告知。但她愿意继续治疗，也承认父母之后可能需要参与用药和家族筛查。',
    lens: '当前任务：推动有益的家庭沟通，同时保留她的参与和控制。',
    prompt: '哪一种计划最合适？',
    hint: '当危险并不迫近时，支持式披露通常比越过本人直接告知更可持续。',
    answer: 'c',
    reason: '可以探索她害怕的具体后果，提供遗传咨询，约定短期复诊，并共同设计她能接受的告知时间、对象、措辞与支持者。',
    options: [
      { id: 'a', label: '当天直接把结果交给母亲，避免耽误家族筛查', feedback: '家族获益很重要，但在没有迫近危险时，直接越过本人会破坏信任，也忽略了更少侵入的办法。' },
      { id: 'b', label: '承诺永远不再讨论家人，只处理晓雨本人', feedback: '尊重保密不等于回避结果对治疗支持与家族风险的意义。' },
      { id: 'c', label: '探索她的担忧，约定复诊，并共同设计可控的家庭告知方案', feedback: '正确。分阶段、由本人参与的计划兼顾自主、治疗连续性与家族获益。' }
    ]
  },
  {
    title: '面对追问仍要按计划沟通',
    situation: '谈话结束后，母亲在走廊追问：“是不是遗传病？为什么不能现在就告诉我？”晓雨尚未同意披露具体结果；当前没有迫近的严重伤害。',
    lens: '当前任务：既不泄露结果，也不把家属拒之门外。',
    prompt: '团队应如何回应？',
    hint: '可以解释一般流程、安排支持和复诊，而不透露具体检测结果。',
    answer: 'b',
    reason: '团队可以说明正在核对结果并制定后续计划，不在走廊透露具体信息；随后记录沟通，按当地规则和机构政策复核，并继续支持晓雨邀请母亲参与。',
    options: [
      { id: 'a', label: '告诉母亲检测阳性，但不说具体基因', feedback: '“阳性”本身就是实质性健康信息，仍属于未经授权的披露。' },
      { id: 'b', label: '不透露具体结果，解释一般流程并安排后续共同沟通', feedback: '正确。既守住最小必要披露，也没有中断家属获得一般性说明与后续支持的机会。' },
      { id: 'c', label: '只说“无可奉告”，以后也不再回应家属', feedback: '保护隐私不要求终止所有沟通；生硬拒绝会加深对立，也错过建立支持网络的机会。' }
    ]
  }
];

state.pendingChoice = null;
state.shareResult = null;
state.communityCase = 'icu';
state.community = { status: 'loading', data: null, error: '', loadedAt: 0 };

const originalStartCase = startCase;
startCase = function enhancedStartCase(id) {
  state.pendingChoice = null;
  state.shareResult = null;
  originalStartCase(id);
};

const originalNext = next;
next = function enhancedNext() {
  state.pendingChoice = null;
  originalNext();
};

optionButton = function enhancedOptionButton(option, index, answerState) {
  const selected = !answerState.correct && state.pendingChoice === option.id;
  const resultClass = answerState.correct && option.id === answerState.choice
    ? 'correct'
    : answerState.wrong.includes(option.id) ? 'wrong' : '';
  return `<button class="option ${resultClass} ${selected ? 'selected' : ''}" data-action="select-answer" data-choice="${option.id}" ${answerState.correct || answerState.wrong.includes(option.id) ? 'disabled' : ''} aria-pressed="${selected}"><span class="letter">${String.fromCharCode(65 + index)}</span><span>${option.label}</span></button>`;
};

function confirmationBox(question) {
  if (!state.pendingChoice) return '';
  const option = question.options.find(item => item.id === state.pendingChoice);
  if (!option) return '';
  return `<div class="confirm-choice" role="group" aria-label="确认答案"><p><strong>确认选择 ${option.id.toUpperCase()}？</strong><small>${option.label}</small></p><div class="confirm-actions"><button class="outline" data-action="cancel-choice">重新选择</button><button class="primary small" data-action="confirm-answer">确认提交</button></div></div>`;
}

playerView = function enhancedPlayerView() {
  const currentCase = caseById(state.caseId);
  const question = currentCase.questions[state.q];
  const answerState = state.answers[state.q] || { attempts: 0, wrong: [], hint: false, correct: false, points: 0 };
  const percent = Math.round((state.q / currentCase.questions.length) * 100);
  return `<main class="player" style="--case-color:${currentCase.color}"><div class="player-top"><button class="back" data-action="home">← 返回值班簿</button><div class="progress-wrap"><span>${state.q + 1} / ${currentCase.questions.length}</span><div class="progress" aria-label="案例进度"><span style="width:${percent}%"></span></div></div></div><div class="player-grid"><aside class="docket"><span class="case-no">${currentCase.no} · ${currentCase.short}</span><h1>${currentCase.title}</h1><p>${currentCase.intro}</p><ul class="stakeholders">${currentCase.stakeholders.map(item => `<li>${item}</li>`).join('')}</ul></aside><article class="question"><span class="q-label">会诊记录 ${String(state.q + 1).padStart(2, '0')} · ${question.title}</span><p class="situation">${question.situation}</p><div class="lens">${question.lens}</div><h2>${question.prompt}</h2><div class="options">${question.options.map((option, index) => optionButton(option, index, answerState)).join('')}</div>${confirmationBox(question)}<div class="assist"><button class="hint-btn" data-action="hint" ${answerState.correct ? 'disabled' : ''}>${answerState.hint ? '提示已查看' : '查看一条提示（本题最高 30 分）'}</button><span class="note">选中后需再次确认</span></div>${answerState.hint ? `<p class="hint">${question.hint}</p>` : ''}${state.feedback ? feedbackBox(state.feedback, answerState.correct, question) : ''}</article></div></main>`;
};

const originalHistorySection = historySection;
historySection = function enhancedHistorySection(progress) {
  return originalHistorySection(progress) + publicLeaderboard();
};

function currentCommunityCase() {
  return caseById(state.communityCase) || cases[0];
}

function publicLeaderboard() {
  const selectedCase = currentCommunityCase();
  const snapshotCase = state.community.data?.cases?.[selectedCase.id];
  let body = '';
  if (state.community.status === 'loading') {
    body = '<div class="empty">正在读取 GitHub 公开成绩……</div>';
  } else if (state.community.error) {
    body = `<div class="empty">${esc(state.community.error)}<br><button class="outline" data-action="refresh-community">重新读取</button></div>`;
  } else if (!snapshotCase?.entries?.length) {
    body = '<div class="empty">这个案例还没有公开成绩。完成案例后，可以自愿通过 GitHub 投稿。</div>';
  } else {
    body = snapshotCase.entries.slice(0, 20).map(entry => `<div class="rank-row"><span class="rank-no">#${entry.rank}</span><span><strong>${esc(entry.nickname || entry.login)}</strong><span class="issue-link"> @${esc(entry.login)}</span></span><span class="rank-score">${entry.score}</span><span class="rank-detail">首答 ${entry.firstCorrectCount}/${entry.totalQuestions} · <a href="${esc(entry.issueUrl)}" target="_blank" rel="noreferrer">来源</a></span></div>`).join('');
  }
  const updated = state.community.data?.updatedAt ? `更新于 ${formatDate(Date.parse(state.community.data.updatedAt))}` : '数据来自公开 GitHub Issues';
  return `<section class="community-panel" id="public-scores"><div class="community-toolbar"><div><p class="eyebrow">GitHub 公开成绩</p><strong>${selectedCase.title}</strong> <span class="community-status">${snapshotCase?.totalPlayers || 0} 位玩家 · ${updated}</span></div><div class="community-tabs">${cases.map(item => `<button class="community-tab ${item.id === selectedCase.id ? 'active' : ''}" data-action="community-case" data-case="${item.id}">${item.short}</button>`).join('')}<button class="community-tab" data-action="refresh-community">刷新</button></div></div><div class="community-body">${body}</div></section>`;
}

function communityComments() {
  const selectedCase = currentCommunityCase();
  const entries = state.community.data?.cases?.[selectedCase.id]?.comments || [];
  if (state.community.status === 'loading') return '<div class="empty">正在读取 GitHub 留言……</div>';
  if (state.community.error) return `<div class="empty">${esc(state.community.error)}</div>`;
  if (!entries.length) return '<div class="empty">还没有公开留言。你可以留下第一条建议。</div>';
  return entries.slice(0, 30).map(entry => `<article class="comment-card"><div class="comment-meta"><span>${esc(entry.nickname || entry.login)} · @${esc(entry.login)}</span><a class="issue-link" href="${esc(entry.issueUrl)}" target="_blank" rel="noreferrer">查看来源</a></div><div class="rating" aria-label="${entry.rating} 星">${'★'.repeat(entry.rating || 0)}${'☆'.repeat(5 - (entry.rating || 0))}</div><blockquote>${esc(entry.body)}</blockquote></article>`).join('');
}

function sharePacket() {
  const draft = state.comment;
  const packet = {
    version: 1,
    type: state.shareResult && state.shareResult.caseId === draft.caseId ? 'score' : 'comment',
    caseId: draft.caseId,
    nickname: (draft.nickname || '').trim().slice(0, 32),
    rating: Number(draft.rating) || 5,
    comment: (draft.body || '').trim().slice(0, 500)
  };
  if (packet.type === 'score') packet.result = state.shareResult;
  return packet;
}

function githubIssueUrl() {
  const packet = sharePacket();
  const selectedCase = caseById(packet.caseId);
  const title = packet.type === 'score'
    ? `[成绩] ${selectedCase.title} · ${packet.result.score} 分`
    : `[建议] ${selectedCase.title}`;
  const body = `<!-- white-coat-ethics:v1 -->\n\n\`\`\`json\n${JSON.stringify(packet, null, 2)}\n\`\`\`\n\n> 这是一份由游戏生成、经玩家本人核对后发布的公开学习记录。关闭本 Issue 可在下次同步后撤回榜单与留言。`;
  return `https://github.com/${COMMUNITY_REPOSITORY}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

function githubPreview() {
  const draft = state.comment;
  const selectedCase = caseById(draft.caseId);
  const packet = sharePacket();
  return `<div class="preview-box"><span class="case-no">公开预览 · ${selectedCase.title}</span>${packet.type === 'score' ? `<div class="share-score"><strong>${packet.result.score}</strong><span>本轮成绩将与逐题计分记录一起公开，供工作流重新校验。</span></div>` : ''}<p><strong>${esc(draft.nickname || '匿名值班员')}</strong> <span class="rating">${'★'.repeat(draft.rating)}${'☆'.repeat(5 - draft.rating)}</span></p><p>${esc(draft.body) || '<span class="note">未填写文字留言</span>'}</p><p class="note">下一步会打开 GitHub 的新 Issue 草稿页；请登录、核对，再由你亲自点击发布。</p></div>`;
}

commentSection = function githubCommentSection() {
  const draft = state.comment;
  const hasShareScore = state.shareResult && state.shareResult.caseId === draft.caseId;
  return `<section class="guestbook" id="comments"><div class="section-head"><div><p class="eyebrow">GitHub 交班留言簿</p><h2>公开成绩与建议反馈</h2></div><p>先预览，再前往 GitHub 核对发布</p></div><div class="guest-layout"><form class="comment-form" id="comment-form"><p class="github-note">网站不会代你发帖，也不会读取或保存 GitHub 登录凭据。公开后会显示 GitHub 账号、昵称、成绩或留言及来源链接。</p>${hasShareScore ? `<div class="share-score"><strong>${state.shareResult.score}</strong><span>准备提交“${caseById(draft.caseId).title}”本轮成绩<br><button type="button" class="ghost" data-action="remove-shared-score">仅提交留言</button></span></div>` : ''}<label class="field"><span>案例</span><select name="caseId">${cases.map(item => `<option value="${item.id}" ${draft.caseId === item.id ? 'selected' : ''}>${item.title}</option>`).join('')}</select></label><label class="field"><span>公开昵称（可留空）</span><input name="nickname" maxlength="32" value="${esc(draft.nickname)}" placeholder="例如：夜班实习生"></label><span class="note">这次体验</span><div class="stars" role="group" aria-label="星级评分">${[1, 2, 3, 4, 5].map(value => `<button type="button" class="star ${value <= draft.rating ? 'on' : ''}" data-action="rate" data-rating="${value}" aria-label="${value} 星">★</button>`).join('')}</div><label class="field"><span>评论或建议</span><textarea name="body" maxlength="500" placeholder="哪一步让你犹豫？你希望游戏改进什么？">${esc(draft.body)}</textarea></label>${state.preview ? githubPreview() : ''}<div class="form-actions">${state.preview ? `<a class="primary small github-link" href="${esc(githubIssueUrl())}" target="_blank" rel="noreferrer">前往 GitHub 核对并发布 ↗</a><button type="button" class="outline" data-action="edit-comment">继续修改</button>` : `<button type="button" class="primary small" data-action="github-preview">预览公开内容</button>`}</div></form><div><div class="community-toolbar"><strong>${currentCommunityCase().title} · 公开留言</strong><button class="outline" data-action="refresh-community">刷新</button></div><div class="comment-list" aria-label="GitHub 公开留言">${communityComments()}</div></div></div></section><div class="source-note">社区数据来自 <a href="https://github.com/${COMMUNITY_REPOSITORY}/issues" target="_blank" rel="noreferrer">公开 GitHub Issues</a>，由 GitHub Actions 校验并汇总。成绩属于玩家自报学习记录，不用于正式考核。<br>本游戏用于伦理讨论教学，不提供个案医疗或法律意见；实际处理请遵循所在地法律、机构政策与专业支持流程。</div>`;
};

async function loadCommunity(manual = false) {
  state.community.status = 'loading';
  state.community.error = '';
  render();
  try {
    const response = await fetch(`${COMMUNITY_SNAPSHOT_URL}?refresh=${Date.now()}${manual ? '-manual' : ''}`, { cache: 'no-store', credentials: 'omit' });
    if (!response.ok) throw new Error('暂时无法连接 GitHub 社区数据。');
    const data = await response.json();
    if (data?.version !== 1 || data.repository !== COMMUNITY_REPOSITORY || !data.cases) throw new Error('GitHub 社区数据格式无效。');
    state.community = { status: 'ready', data, error: '', loadedAt: Date.now() };
  } catch (error) {
    state.community.status = 'error';
    state.community.error = error.message || '暂时无法读取 GitHub 社区数据。';
  }
  render();
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'select-answer') {
    state.pendingChoice = button.dataset.choice;
    state.feedback = null;
    render();
    announce(`已选择 ${state.pendingChoice.toUpperCase()}，请确认后提交`);
  }
  if (action === 'cancel-choice') {
    state.pendingChoice = null;
    render();
  }
  if (action === 'confirm-answer' && state.pendingChoice) {
    const choice = state.pendingChoice;
    state.pendingChoice = null;
    answer(choice);
  }
  if (action === 'hint') state.pendingChoice = null;
  if (action === 'community-case') {
    state.communityCase = button.dataset.case;
    state.comment.caseId = button.dataset.case;
    state.preview = false;
    render();
    setTimeout(() => document.getElementById('public-scores')?.scrollIntoView({ block: 'start' }), 0);
  }
  if (action === 'refresh-community') loadCommunity(true);
  if (action === 'github-preview') {
    const hasScore = state.shareResult && state.shareResult.caseId === state.comment.caseId;
    if (!hasScore && !state.comment.body.trim()) {
      toast('请先写下一句评论或建议');
      return;
    }
    state.preview = true;
    render();
    setTimeout(() => document.getElementById('comments')?.scrollIntoView({ block: 'center' }), 0);
  }
  if (action === 'remove-shared-score') {
    state.shareResult = null;
    state.preview = false;
    render();
  }
  if (action === 'result-comment') {
    const result = resultData();
    state.shareResult = {
      caseId: result.c.id,
      score: result.score,
      firstCorrectCount: result.first,
      correctedCount: result.corrected,
      hintedCount: result.hinted,
      totalQuestions: result.c.questions.length,
      answers: state.answers.map(item => ({ points: item.points, attempts: item.attempts, hinted: item.hint })),
      completedAt: new Date().toISOString()
    };
    state.comment.caseId = result.c.id;
    state.communityCase = result.c.id;
    state.preview = false;
    render();
    setTimeout(() => document.getElementById('comments')?.scrollIntoView({ block: 'start' }), 0);
  }
  if (action === 'nav-comments') {
    state.shareResult = null;
    state.preview = false;
    render();
    setTimeout(() => document.getElementById('comments')?.scrollIntoView({ block: 'start' }), 0);
  }
});

window.addEventListener('focus', () => {
  if (Date.now() - state.community.loadedAt > 60_000) loadCommunity();
});

render();
loadCommunity();
