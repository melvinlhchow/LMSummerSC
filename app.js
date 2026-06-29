const FILES = {
  program: 'program.json',
  weeks: 'weeks.json',
  sessions: 'sessions.json',
  exercises: 'exercise-library.json',
  config: 'tracker-config.json'
};

const STORAGE_KEYS = {
  profile: 'lm_sc_profile_v2',
  readiness: 'lm_sc_readiness_v2',
  completion: 'lm_sc_completion_v2',
  language: 'lm_sc_language_v1'
};

const I18N = {
  en: {
    academy: 'Lee Man Youth Academy', title: 'Summer S&C Tracker', subtitle: 'U18 and U22 home strength and core program for the 2026/27 build-up.',
    squad: 'Squad', playerName: 'Player name', week: 'Week', coachOverride: 'Coach override', saveProfile: 'Save profile', resetWeek: 'Reset selected week',
    currentWeekOverview: 'Current week overview', weekOverviewSub: 'Week defaults to the current or next scheduled week.',
    readinessCheck: 'Readiness check', readinessSub: 'Light input before the first session.', saveReadiness: 'Save readiness',
    sessions: 'Sessions', sessionsSub: 'Per-block and per-exercise completion tracking.', sessionRpe: 'Session RPE', saveSession: 'Save session',
    coachingDetails: 'Coaching details', cues: 'Cues', commonMistakes: 'Common mistakes', note: 'Note',
    complete: 'Complete', partial: 'Partial', skipped: 'Skipped', notStarted: 'Not started',
    prescription: 'Prescription', equipment: 'Equipment', space: 'Space', openOnYoutube: 'Open on YouTube',
    verifiedOnly: 'Players only see videos marked Verified Exact.', pendingVideo: 'Video pending final verification.', replacementVideo: 'Video needs replacement before player release.', unavailableVideo: 'Video not available.',
    coachOverrideMsg: 'Coach override is enabled, but no embeddable exact link is stored for this exercise yet.',
    playerBlockedMsg: 'Players only see videos marked Verified Exact.',
    regression: 'Regression', progression: 'Progression', safety: 'Safety',
    weekLabel: 'Week', dateRange: 'Date range', footballContext: 'Football context', phase: 'Phase', homeFocus: 'Home S&C emphasis', sessionsCount: 'Sessions', targetDuration: 'Target duration',
    completion: 'Completion', completed: 'Completed', partialCount: 'Partial', skippedCount: 'Skipped', totalTracked: 'Total tracked',
    exerciseEntries: 'exercise entries', exercises: 'exercise(s)', completePill: 'complete',
    blockComplete: 'complete', block: 'Block', blocks: 'block(s)',
    anyPain: 'Any pain today', feelingIll: 'Feeling ill today', soreness: 'Soreness level', sleep: 'Sleep quality', equipmentAvailable: 'Available equipment',
    yes: 'Yes', no: 'No', noVideo: 'No video', small: 'Small', none: 'None',
    readinessWarn: 'Consider reducing load and informing coach or physio before continuing.',
    painReported: 'Pain reported', illnessReported: 'Illness reported', highSoreness: 'High soreness',
    optional: 'Optional', select: 'Select', off: 'Off', on: 'On'
  },
  zh: {
    academy: '理文青訓學院', title: '暑期體能訓練追蹤器', subtitle: 'U18及U22於2026/27季前準備的居家力量及核心訓練計劃。',
    squad: '球隊', playerName: '球員姓名', week: '週次', coachOverride: '教練覆核模式', saveProfile: '儲存設定', resetWeek: '重設本週',
    currentWeekOverview: '本週概覽', weekOverviewSub: '週次會預設為目前或下一個安排中的週次。',
    readinessCheck: '訓練前狀態', readinessSub: '於第一課前作簡單輸入。', saveReadiness: '儲存狀態',
    sessions: '訓練課', sessionsSub: '按組別及按動作追蹤完成情況。', sessionRpe: '課堂RPE', saveSession: '儲存課堂',
    coachingDetails: '教學細節', cues: '重點提示', commonMistakes: '常見錯誤', note: '備注',
    complete: '完成', partial: '部分完成', skipped: '跳過', notStarted: '未開始',
    prescription: '處方', equipment: '器材', space: '空間', openOnYoutube: '於YouTube開啟',
    verifiedOnly: '球員預設只會看到已確認完全匹配的影片。', pendingVideo: '影片仍待最終確認。', replacementVideo: '此影片需更換後才可向球員發放。', unavailableVideo: '影片暫不可用。',
    coachOverrideMsg: '已啟用教練覆核模式，但此動作仍未儲存可嵌入的完全匹配影片。',
    playerBlockedMsg: '球員預設只會看到已確認完全匹配的影片。',
    regression: '較易版本', progression: '進階版本', safety: '安全提示',
    weekLabel: '週次', dateRange: '日期', footballContext: '足球訓練情況', phase: '階段', homeFocus: '居家體能重點', sessionsCount: '課節', targetDuration: '目標時長',
    completion: '完成率', completed: '已完成', partialCount: '部分完成', skippedCount: '已跳過', totalTracked: '總追蹤數',
    exerciseEntries: '動作項目', exercises: '個動作', completePill: '完成',
    blockComplete: '完成', block: '組別', blocks: '個組別',
    anyPain: '今天有痛楚嗎', feelingIll: '今天有不適嗎', soreness: '酸痛程度', sleep: '睡眠質素', equipmentAvailable: '可用器材',
    yes: '有', no: '沒有', noVideo: '沒有影片', small: '小', none: '沒有',
    readinessWarn: '請考慮減量，並先通知教練或治療人員。',
    painReported: '有痛楚回報', illnessReported: '有不適回報', highSoreness: '酸痛偏高',
    optional: '可選填', select: '選擇', off: '關閉', on: '開啟'
  }
};

const state = {
  data: null,
  language: localStorage.getItem(STORAGE_KEYS.language) || 'en',
  profile: { squad: 'U18', playerName: '', weekId: '', coachOverride: false },
  readiness: {},
  completion: {}
};

const $ = (id) => document.getElementById(id);

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

async function loadData() {
  const [programData, weeks, sessions, exercises, config] = await Promise.all([
    loadJson(FILES.program), loadJson(FILES.weeks), loadJson(FILES.sessions), loadJson(FILES.exercises), loadJson(FILES.config)
  ]);
  return {
    program: programData.program,
    phases: programData.phases,
    weeks,
    weekMap: Object.fromEntries(weeks.map(w => [w.week_id, w])),
    sessions,
    sessionMap: Object.fromEntries(sessions.map(s => [s.session_id, s])),
    exercises,
    exerciseMap: Object.fromEntries(exercises.map(ex => [ex.exercise_id, ex])),
    config
  };
}

function t(key) { return I18N[state.language][key] || key; }

function loadStorage() {
  try {
    state.profile = { ...state.profile, ...(JSON.parse(localStorage.getItem(STORAGE_KEYS.profile)) || {}) };
    state.readiness = JSON.parse(localStorage.getItem(STORAGE_KEYS.readiness)) || {};
    state.completion = JSON.parse(localStorage.getItem(STORAGE_KEYS.completion)) || {};
  } catch (e) { console.warn(e); }
}

function saveProfile() { localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(state.profile)); }
function saveReadinessStore() { localStorage.setItem(STORAGE_KEYS.readiness, JSON.stringify(state.readiness)); }
function saveCompletionStore() { localStorage.setItem(STORAGE_KEYS.completion, JSON.stringify(state.completion)); }
function saveLanguage() { localStorage.setItem(STORAGE_KEYS.language, state.language); }

function identityKey() {
  const name = (state.profile.playerName || 'anonymous').trim().toLowerCase();
  return `${state.profile.squad}__${name}`;
}
function readinessKey() { return `${identityKey()}__${state.profile.weekId}`; }
function sessionKey(sessionId) { return `${identityKey()}__${state.profile.weekId}__${sessionId}`; }

function parseDate(s) { return new Date(`${s}T00:00:00`); }

function defaultWeekId() {
  const today = new Date('2026-06-29T00:00:00');
  const weeks = state.data.weeks;
  const active = weeks.find(w => today >= parseDate(w.date_start) && today <= parseDate(w.date_end));
  if (active) return active.week_id;
  const upcoming = weeks.find(w => today < parseDate(w.date_start));
  return (upcoming || weeks[0]).week_id;
}

function applyLanguage() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-Hant' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  $('playerName').placeholder = t('optional');
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === state.language));
}

function populateTopMeta() {
  $('programSeason').textContent = state.data.program.season;
  $('programDates').textContent = `${state.data.program.start_date} → ${state.data.program.end_date}`;
}

function populateControls() {
  $('squadSelect').innerHTML = state.data.program.squads.map(s => `<option value="${s}">${s}</option>`).join('');
  $('squadSelect').value = state.profile.squad;
  $('playerName').value = state.profile.playerName || '';
  $('overrideSelect').innerHTML = `<option value="false">${t('off')}</option><option value="true">${t('on')}</option>`;
  $('overrideSelect').value = String(!!state.profile.coachOverride);
  $('weekSelect').innerHTML = state.data.weeks.map(w => `<option value="${w.week_id}">${w.label} · ${w.date_start} to ${w.date_end}</option>`).join('');
  if (!state.profile.weekId || !state.data.weekMap[state.profile.weekId]) state.profile.weekId = defaultWeekId();
  $('weekSelect').value = state.profile.weekId;
}

function getCurrentWeek() { return state.data.weekMap[state.profile.weekId]; }

function getSessionState(sessionId) { return state.completion[sessionKey(sessionId)] || { exercises: {}, rpe: '', updatedAt: '' }; }
function setSessionState(sessionId, newState) { state.completion[sessionKey(sessionId)] = newState; saveCompletionStore(); }

function renderWeekOverview() {
  const week = getCurrentWeek();
  const phase = state.data.phases.find(p => p.phase_id === week.phase_id);
  $('weekOverview').innerHTML = [
    [t('weekLabel'), ( state.language==='zh' && week.label_zh ? week.label_zh : week.label )],
    [t('dateRange'), `${week.date_start} to ${week.date_end}`],
    [t('footballContext'), ( state.language==='zh' && week.football_context_zh ? week.football_context_zh : week.football_context )],
    [t('phase'), ( phase ? (state.language==='zh' && phase.name_zh ? phase.name_zh : phase.name) : week.phase_id )],
    [t('homeFocus'), ( state.language==='zh' && week.home_sc_emphasis_zh ? week.home_sc_emphasis_zh : week.home_sc_emphasis )],
    [t('sessionsCount'), `${week.home_sessions_per_week} ${t('blocks')}`],
    [t('targetDuration'), `${week.target_session_duration_min} min`]
  ].map(([label, value]) => `<div class="overview-item"><strong>${label}</strong><span>${value}</span></div>`).join('');
}

function computeWeekSummary() {
  const week = getCurrentWeek();
  let total = 0, completed = 0, partial = 0, skipped = 0, blocksComplete = 0;
  week.session_ids.forEach(sessionId => {
    const session = state.data.sessionMap[sessionId];
    const sState = getSessionState(sessionId);
    let sessionBlocksComplete = 0;
    session.blocks.forEach(block => {
      let blockDone = 0;
      block.exercise_ids.forEach(exId => {
        total += 1;
        const st = sState.exercises?.[exId]?.status;
        if (st === 'complete') { completed += 1; blockDone += 1; }
        if (st === 'partial') partial += 1;
        if (st === 'skipped') skipped += 1;
      });
      if (blockDone === block.exercise_ids.length) sessionBlocksComplete += 1;
    });
    blocksComplete += sessionBlocksComplete;
  });
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, partial, skipped, percent, blocksComplete };
}

function renderTopProgress() {
  const s = computeWeekSummary();
  $('topProgressChips').innerHTML = [
    `${s.percent}% ${t('completion').toLowerCase()}`,
    `${s.completed} ${t('completed').toLowerCase()}`,
    `${s.blocksComplete} ${t('blockComplete').toLowerCase()} ${t('blocks')}`
  ].map(text => `<span class="summary-chip">${text}</span>`).join('');
}

function renderReadinessForm() {
  const stored = state.readiness[readinessKey()] || {};
  const form = $('readinessForm');
  form.innerHTML = state.data.config.readiness_form.fields.map(field => {
    if (field.field_id === 'sleep_quality') return buildScale(field, stored, t('sleep'));
    if (field.field_id === 'soreness_level') return buildScale(field, stored, t('soreness'));
    if (field.field_id === 'pain_flag') return buildBoolean(field, stored, t('anyPain'));
    if (field.field_id === 'illness_flag') return buildBoolean(field, stored, t('feelingIll'));
    if (field.field_id === 'available_equipment') return buildMulti(field, stored, t('equipmentAvailable'));
    return '';
  }).join('');
  renderReadinessAlert(stored);
}

function buildScale(field, stored, label) {
  const opts = Array.from({length: field.max - field.min + 1}, (_, i) => field.min + i)
    .map(n => `<option value="${n}" ${String(stored[field.field_id] || '') === String(n) ? 'selected' : ''}>${n}</option>`).join('');
  return `<label><span>${label}</span><select name="${field.field_id}">${opts}</select></label>`;
}
function buildBoolean(field, stored, label) {
  const value = stored[field.field_id] === true;
  return `<label><span>${label}</span><select name="${field.field_id}"><option value="false" ${!value ? 'selected' : ''}>${t('no')}</option><option value="true" ${value ? 'selected' : ''}>${t('yes')}</option></select></label>`;
}
function buildMulti(field, stored, label) {
  const selected = stored[field.field_id] || [];
  return `<label><span>${label}</span><select name="${field.field_id}" multiple size="4">${field.options.map(opt => `<option value="${opt}" ${selected.includes(opt) ? 'selected' : ''}>${opt}</option>`).join('')}</select></label>`;
}

function collectReadinessForm() {
  const values = {};
  state.data.config.readiness_form.fields.forEach(field => {
    const el = document.querySelector(`[name="${field.field_id}"]`);
    if (!el) return;
    if (field.type === 'scale') values[field.field_id] = Number(el.value);
    if (field.type === 'boolean') values[field.field_id] = el.value === 'true';
    if (field.type === 'multi-select') values[field.field_id] = Array.from(el.selectedOptions).map(o => o.value);
  });
  return values;
}

function renderReadinessAlert(v) {
  const alert = $('readinessAlert');
  const warnings = [];
  if (v.pain_flag) warnings.push(t('painReported'));
  if (v.illness_flag) warnings.push(t('illnessReported'));
  if (v.soreness_level >= 4) warnings.push(t('highSoreness'));
  if (!warnings.length) { alert.classList.add('hidden'); alert.textContent = ''; return; }
  alert.classList.remove('hidden');
  alert.textContent = `${warnings.join(' · ')}. ${t('readinessWarn')}`;
}

function videoAllowed(exercise) {
  const allowed = state.data.config.player_visibility_rules.allowed_video_statuses || [];
  return state.profile.coachOverride || allowed.includes(exercise.video?.status);
}

function videoBadgeClass(status) {
  if (status === 'Verified Exact') return 'verified';
  if (status === 'Pending Review') return 'pending';
  if (status === 'Needs Replacement' || status === 'Rejected' || status === 'Embed Blocked') return 'blocked';
  return 'neutral';
}

function countSessionExercises(session) { return session.blocks.reduce((sum, block) => sum + block.exercise_ids.length, 0); }

function findMobility(id) {
  const found = (state.data.config.mobility_blocks || []).find(m => m.mobility_id === id);
  if (!found) return { name: id, focus: 'Mobility', u18: {}, u22: {}, equipment: [], coaching_cues: [], common_mistakes: [], regression: '', progression: '', safety_note: '', video: {status: t('noVideo')}, item_videos: [] };
  const itemsEn = found.items || [];
  const itemsZh = found.items_zh || itemsEn;
  return {
    exercise_id: found.mobility_id,
    name: found.name,
    name_zh: found.name_zh || found.name,
    type: 'mobility', focus: 'recovery',
    u18: { sets: 1, reps: itemsEn.join(' · ') }, u22: { sets: 1, reps: itemsEn.join(' · ') },
    coaching_cues: itemsEn,
    coaching_cues_zh: itemsZh,
    common_mistakes: found.common_mistakes || [],
    common_mistakes_zh: found.common_mistakes_zh || [],
    regression: found.regression || '',
    regression_zh: found.regression_zh || '',
    progression: found.progression || '',
    progression_zh: found.progression_zh || '',
    equipment: found.equipment || [],
    space_required: found.space_required || 'small',
    safety_note: found.recovery_reminders?.join(' · ') || '',
    safety_note_zh: found.recovery_reminders_zh?.join(' · ') || '',
    video: found.video || { status: t('noVideo'), watch_url: '', embed_url: '' },
    item_videos: found.item_videos || []
  };
}

function buildPrescription(squadData) {
  const parts = [];
  const isZh = state.language === 'zh';
  if (squadData.sets) parts.push(isZh ? `${squadData.sets} 組` : `${squadData.sets} set(s)`);
  if (squadData.reps) parts.push(`${squadData.reps}`);
  if (squadData.tempo) parts.push(isZh ? `節奏 ${squadData.tempo}` : `Tempo ${squadData.tempo}`);
  if (squadData.rest_seconds) parts.push(isZh ? `休息 ${squadData.rest_seconds}秒` : `Rest ${squadData.rest_seconds}s`);
  return parts.join(' · ') || '—';
}
function formatList(arr) { return !arr || !arr.length ? t('none') : arr.join(', '); }
function capitalize(v) { return v ? v.charAt(0).toUpperCase() + v.slice(1) : ''; }

function renderSessions() {
  const week = getCurrentWeek();
  const sessionTemplate = $('sessionTemplate');
  const exerciseTemplate = $('exerciseTemplate');
  const container = $('sessionsContainer');
  container.innerHTML = '';

  week.session_ids.forEach(sessionId => {
    const session = state.data.sessionMap[sessionId];
    const sessionState = getSessionState(sessionId);
    const sessionNode = sessionTemplate.content.firstElementChild.cloneNode(true);
    sessionNode.querySelector('.session-title').textContent = ( state.language==='zh' && session.name_zh ? session.name_zh : session.name );
    sessionNode.querySelector('.session-block-count').textContent = `${session.blocks.length} ${t('blocks')}`;

    const sessionComplete = Object.values(sessionState.exercises || {}).filter(v => v.status === 'complete').length;
    const totalSessionExercises = countSessionExercises(session);
    sessionNode.querySelector('.session-progress').textContent = `${sessionComplete}/${totalSessionExercises} ${t('complete').toLowerCase()}`;
    sessionNode.querySelector('.block-progress-fill').style.width = `${totalSessionExercises ? (sessionComplete / totalSessionExercises) * 100 : 0}%`;

    const blocksContainer = sessionNode.querySelector('.blocks-container');
    session.blocks.forEach(block => {
      const statuses = block.exercise_ids.map(exId => sessionState.exercises?.[exId]?.status);
      const blockComplete = statuses.filter(s => s === 'complete').length;
      const blockNode = document.createElement('section');
      blockNode.className = 'block-card';
      blockNode.innerHTML = `<div class="block-head"><h4>${block.name}</h4><span class="block-progress-chip">${blockComplete}/${block.exercise_ids.length} ${t('complete').toLowerCase()}</span></div><div class="exercise-list"></div>`;
      const exerciseList = blockNode.querySelector('.exercise-list');

      block.exercise_ids.forEach(exerciseId => {
        const exercise = state.data.exerciseMap[exerciseId] || findMobility(exerciseId);
        const node = exerciseTemplate.content.firstElementChild.cloneNode(true);
        const exState = sessionState.exercises?.[exerciseId] || { status: '', note: '' };
        const squadData = exercise[state.profile.squad.toLowerCase()] || {};

        node.querySelector('.exercise-name').textContent = ( state.language==='zh' && exercise.name_zh ? exercise.name_zh : exercise.name );
        node.querySelector('.exercise-focus').textContent = ( state.language==='zh' && exercise.focus_zh ? exercise.focus_zh : (exercise.focus || exercise.type || 'Mobility') );
        const statusLabel = exState.status ? t(exState.status) : t('notStarted');
        const exStatus = node.querySelector('.exercise-status');
        exStatus.textContent = statusLabel;
        exStatus.classList.add('neutral');
        const vBadge = node.querySelector('.video-status');
        if (state.profile.coachOverride) {
          vBadge.textContent = exercise.video?.status || t('noVideo');
          vBadge.classList.add(videoBadgeClass(exercise.video?.status));
        } else {
          vBadge.style.display = 'none';
        }

        node.querySelector('.exercise-meta').innerHTML = `
          <div class="meta-panel"><strong>${t('prescription')}</strong><div>${buildPrescription(squadData)}</div></div>
          <div class="meta-panel"><strong>${t('equipment')}</strong><div>${formatList(exercise.equipment)}</div></div>
          <div class="meta-panel"><strong>${t('space')}</strong><div>${(state.language==='zh' ? (exercise.space_required==='small'?'小空間':exercise.space_required==='medium'?'中等空間':exercise.space_required==='large'?'大空間':exercise.space_required||t('small')) : exercise.space_required || t('small'))}</div></div>
        `;

        const videoWrap = node.querySelector('.exercise-video-wrap');
        if (exercise.video && exercise.video.embed_url && videoAllowed(exercise)) {
          videoWrap.innerHTML = `<iframe class="video-frame" src="${exercise.video.embed_url}" title="${( state.language==='zh' && exercise.name_zh ? exercise.name_zh : exercise.name )}" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="muted"><a href="${exercise.video.watch_url}" target="_blank" rel="noopener noreferrer">${t('openOnYoutube')}</a></p>`;
        } else if (!exercise.item_videos || !exercise.item_videos.length) {
          let reason = t('unavailableVideo');
          if (exercise.video?.status === 'Pending Review') reason = t('pendingVideo');
          if (exercise.video?.status === 'Needs Replacement') reason = t('replacementVideo');
          const msg = state.profile.coachOverride ? t('coachOverrideMsg') : t('playerBlockedMsg');
          videoWrap.innerHTML = `<div class="video-placeholder"><div><strong>${reason}</strong><p>${msg}</p>${exercise.video?.watch_url ? `<p><a href="${exercise.video.watch_url}" target="_blank" rel="noopener noreferrer">${t('openOnYoutube')}</a></p>` : ''}</div></div>`;
        }

        
        // Mobility item_videos: show individual video per item
        if (exercise.item_videos && exercise.item_videos.length && (videoAllowed(exercise) || (exercise.video?.status === 'Verified Exact'))) {
          const ivContainer = document.createElement('div');
          ivContainer.className = 'item-videos-wrap';
          exercise.item_videos.forEach(iv => {
            const label = (state.language==='zh' && iv.label_zh) ? iv.label_zh : iv.label;
            const itemLabel = (state.language==='zh' && iv.item_zh) ? iv.item_zh : iv.item;
            const div = document.createElement('div');
            div.className = 'item-video-block';
            div.innerHTML = `<p class="item-video-label"><strong>${itemLabel}</strong></p>
              <iframe class="video-frame" src="${iv.embed_url}" title="${label}" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
              <p class="muted"><a href="${iv.watch_url}" target="_blank" rel="noopener noreferrer">${t('openOnYoutube')}: ${label}</a></p>`;
            ivContainer.appendChild(div);
          });
          videoWrap.appendChild(ivContainer);
        }

        node.querySelector('.cues-list').innerHTML = ((state.language==='zh' && exercise.coaching_cues_zh && exercise.coaching_cues_zh.length ? exercise.coaching_cues_zh : exercise.coaching_cues) || []).map(v => `<li>${v}</li>`).join('');
        node.querySelector('.mistakes-list').innerHTML = ((state.language==='zh' && exercise.common_mistakes_zh && exercise.common_mistakes_zh.length ? exercise.common_mistakes_zh : exercise.common_mistakes) || []).map(v => `<li>${v}</li>`).join('');
        node.querySelector('.regression-text').innerHTML = `<h5>${t('regression')}</h5><p>${(state.language==='zh' && exercise.regression_zh ? exercise.regression_zh : exercise.regression) || '—'}</p>`;
        node.querySelector('.progression-text').innerHTML = `<h5>${t('progression')}</h5><p>${(state.language==='zh' && exercise.progression_zh ? exercise.progression_zh : exercise.progression) || '—'}</p>`;
        node.querySelector('.safety-text').textContent = `${t('safety')}: ${(state.language==='zh' && exercise.safety_note_zh ? exercise.safety_note_zh : exercise.safety_note) || '—'}`;

        const note = node.querySelector('.exercise-note');
        note.value = exState.note || '';
        note.placeholder = `${t('optional')}`;

        node.querySelectorAll('.status-btn').forEach(btn => {
          btn.textContent = t(btn.dataset.status);
          if (btn.dataset.status === exState.status) btn.classList.add('is-active');
          btn.addEventListener('click', () => {
            const current = getSessionState(sessionId);
            current.exercises = current.exercises || {};
            current.exercises[exerciseId] = { ...(current.exercises[exerciseId] || {}), status: btn.dataset.status, note: note.value || '' };
            current.updatedAt = new Date().toISOString();
            setSessionState(sessionId, current);
            rerender();
          });
        });
        note.addEventListener('change', e => {
          const current = getSessionState(sessionId);
          current.exercises = current.exercises || {};
          current.exercises[exerciseId] = { ...(current.exercises[exerciseId] || {}), status: current.exercises[exerciseId]?.status || '', note: e.target.value || '' };
          current.updatedAt = new Date().toISOString();
          setSessionState(sessionId, current);
        });

        exerciseList.appendChild(node);
      });
      blocksContainer.appendChild(blockNode);
    });

    const rpe = sessionNode.querySelector('.session-rpe');
    rpe.innerHTML = `<option value="">${t('select')}</option>` + Array.from({length: 10}, (_, i) => `<option ${String(sessionState.rpe) === String(i+1) ? 'selected' : ''}>${i+1}</option>`).join('');
    sessionNode.querySelector('.save-session-btn').addEventListener('click', () => {
      const current = getSessionState(sessionId);
      current.rpe = rpe.value;
      current.updatedAt = new Date().toISOString();
      setSessionState(sessionId, current);
      renderTopProgress();
    });

    container.appendChild(sessionNode);
  });
}

function bindEvents() {
  $('squadSelect').addEventListener('change', e => { state.profile.squad = e.target.value; saveProfile(); rerender(); });
  $('weekSelect').addEventListener('change', e => { state.profile.weekId = e.target.value; saveProfile(); rerender(); });
  $('playerName').addEventListener('change', e => { state.profile.playerName = e.target.value.trim(); saveProfile(); rerender(); });
  $('overrideSelect').addEventListener('change', e => { state.profile.coachOverride = e.target.value === 'true'; saveProfile(); rerender(); });
  $('saveIdentityBtn').addEventListener('click', () => {
    state.profile.playerName = $('playerName').value.trim();
    state.profile.squad = $('squadSelect').value;
    state.profile.weekId = $('weekSelect').value;
    state.profile.coachOverride = $('overrideSelect').value === 'true';
    saveProfile();
    rerender();
  });
  $('resetWeekBtn').addEventListener('click', () => {
    const week = getCurrentWeek();
    week.session_ids.forEach(id => delete state.completion[sessionKey(id)]);
    delete state.readiness[readinessKey()];
    saveCompletionStore();
    saveReadinessStore();
    rerender();
  });
  $('saveReadinessBtn').addEventListener('click', () => {
    const values = collectReadinessForm();
    state.readiness[readinessKey()] = values;
    saveReadinessStore();
    renderReadinessAlert(values);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => {
    state.language = btn.dataset.lang;
    saveLanguage();
    rerender();
  }));
}

function rerender() {
  applyLanguage();
  populateControls();
  renderWeekOverview();
  renderTopProgress();
  renderReadinessForm();
  renderSessions();
}

async function init() {
  try {
    loadStorage();
    state.data = await loadData();
    if (!state.profile.weekId || !state.data.weekMap[state.profile.weekId]) state.profile.weekId = defaultWeekId();
    populateTopMeta();
    applyLanguage();
    bindEvents();
    rerender();
  } catch (error) {
    document.body.innerHTML = `<div style="max-width:720px;margin:40px auto;padding:24px;font-family:system-ui,sans-serif;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.08)"><h1>Tracker failed to load</h1><p>${error.message}</p><p>Open this prototype through a local web server, for example: <code>python -m http.server</code>.</p></div>`;
  }
}

init();
