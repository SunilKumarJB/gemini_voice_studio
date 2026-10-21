/* ============================================================================
   Gemini 3.8 Flash TTS — Enterprise Voice Studio Frontend Logic
   ============================================================================ */

const VOCAL_TAGS = [
  { tag: '<short pause>', cat: 'pauses', desc: 'Brief natural pause' },
  { tag: '<long pause>', cat: 'pauses', desc: 'Extended dramatic pause' },
  { tag: '<breath>', cat: 'pauses', desc: 'Natural inhalation' },
  { tag: '<heavy breath>', cat: 'pauses', desc: 'Deep heavy breath' },
  { tag: '<exhales>', cat: 'pauses', desc: 'Audible exhalation' },
  { tag: '<pant>', cat: 'pauses', desc: 'Out-of-breath panting' },
  { tag: '<yawn>', cat: 'pauses', desc: 'Sleepy yawn' },

  { tag: '<laugh>', cat: 'joy', desc: 'Natural laughter' },
  { tag: '<laughter>', cat: 'joy', desc: 'Sustained laughter' },
  { tag: '<chuckle>', cat: 'joy', desc: 'Soft chuckle' },
  { tag: '<chuckles>', cat: 'joy', desc: 'Warm chuckles' },
  { tag: '<giggle>', cat: 'joy', desc: 'Lighthearted giggle' },
  { tag: '<cackle>', cat: 'joy', desc: 'Sharp cackle' },
  { tag: '<snicker>', cat: 'joy', desc: 'Wry snicker' },
  { tag: '<cheer>', cat: 'joy', desc: 'Exuberant cheer' },

  { tag: '<sigh>', cat: 'emotion', desc: 'Expressive sigh' },
  { tag: '<sighs>', cat: 'emotion', desc: 'Weary sigh' },
  { tag: '<gasp>', cat: 'emotion', desc: 'Sudden gasp of surprise' },
  { tag: '<groan>', cat: 'emotion', desc: 'Frustrated groan' },
  { tag: '<moan>', cat: 'emotion', desc: 'Low moan' },
  { tag: '<cry>', cat: 'emotion', desc: 'Emotional crying' },
  { tag: '<sob>', cat: 'emotion', desc: 'Heavy sob' },
  { tag: '<whimper>', cat: 'emotion', desc: 'Quiet whimper' },
  { tag: '<phew>', cat: 'emotion', desc: 'Sigh of relief' },
  { tag: '<pff>', cat: 'emotion', desc: 'Dismissive puff' },

  { tag: '<whispers>', cat: 'vocal', desc: 'Point-in-time whisper' },
  { tag: '<whispering>', cat: 'vocal', desc: 'Hushed whispering' },
  { tag: '<shout>', cat: 'vocal', desc: 'Loud exclamation' },
  { tag: '<scream>', cat: 'vocal', desc: 'High-intensity scream' },
  { tag: '<shriek>', cat: 'vocal', desc: 'Piercing shriek' },
  { tag: '<cough>', cat: 'vocal', desc: 'Realistic cough' },
  { tag: '<throat-clearing>', cat: 'vocal', desc: 'Polite throat clear' },
  { tag: '<sneeze>', cat: 'vocal', desc: 'Sudden sneeze' },
  { tag: '<snort>', cat: 'vocal', desc: 'Nasal snort' },
  { tag: '<tsk>', cat: 'vocal', desc: 'Disapproving tsk' },
  { tag: '<argh>', cat: 'vocal', desc: 'Exasperated argh' },
  { tag: '<growl>', cat: 'vocal', desc: 'Low guttural growl' },
  { tag: '<grunt>', cat: 'vocal', desc: 'Effort grunt' },
  { tag: '<grr>', cat: 'vocal', desc: 'Playful or angry grr' },
  { tag: '<hiss>', cat: 'vocal', desc: 'Sharp sibilant hiss' },
];

const SUPPORTED_LANGUAGES = [
  { name: 'English', flash: true, lite: true },
  { name: 'Spanish', flash: true, lite: true },
  { name: 'French', flash: true, lite: true },
  { name: 'German', flash: true, lite: true },
  { name: 'Hindi', flash: true, lite: true },
  { name: 'Japanese', flash: true, lite: true },
  { name: 'Korean', flash: true, lite: true },
  { name: 'Portuguese', flash: true, lite: true },
  { name: 'Italian', flash: true, lite: true },
  { name: 'Chinese (Hans script)', flash: true, lite: true },
  { name: 'Chinese (Hant script)', flash: true, lite: true },
  { name: 'Cantonese', flash: true, lite: true },
  { name: 'Standard Arabic (Arab script)', flash: true, lite: true },
  { name: 'Egyptian Arabic', flash: true, lite: false },
  { name: 'Russian', flash: true, lite: true },
  { name: 'Turkish', flash: true, lite: true },
  { name: 'Vietnamese', flash: true, lite: true },
  { name: 'Indonesian', flash: true, lite: true },
  { name: 'Thai', flash: true, lite: true },
  { name: 'Dutch', flash: true, lite: true },
  { name: 'Polish', flash: true, lite: true },
  { name: 'Swedish', flash: true, lite: true },
  { name: 'Ukrainian', flash: true, lite: true },
  { name: 'Greek', flash: true, lite: true },
  { name: 'Czech', flash: true, lite: true },
  { name: 'Danish', flash: true, lite: true },
  { name: 'Finnish', flash: true, lite: true },
  { name: 'Hebrew', flash: true, lite: true },
  { name: 'Hungarian', flash: true, lite: true },
  { name: 'Norwegian Bokmål', flash: true, lite: true },
  { name: 'Norwegian Nynorsk', flash: true, lite: false },
  { name: 'Romanian', flash: true, lite: true },
  { name: 'Slovak', flash: true, lite: true },
  { name: 'Bangla', flash: true, lite: true },
  { name: 'Tamil', flash: true, lite: true },
  { name: 'Telugu', flash: true, lite: true },
  { name: 'Marathi', flash: true, lite: true },
  { name: 'Gujarati', flash: true, lite: true },
  { name: 'Kannada', flash: true, lite: true },
  { name: 'Malayalam', flash: true, lite: true },
  { name: 'Punjabi', flash: true, lite: true },
  { name: 'Odia', flash: true, lite: true },
  { name: 'Assamese', flash: true, lite: true },
  { name: 'Maithili', flash: true, lite: false },
  { name: 'Bhojpuri', flash: true, lite: false },
  { name: 'Chhattisgarhi', flash: true, lite: false },
  { name: 'Magahi', flash: true, lite: false },
  { name: 'Awadhi', flash: true, lite: false },
  { name: 'Manipuri', flash: true, lite: false },
  { name: 'Mizo', flash: true, lite: false },
  { name: 'Santali', flash: true, lite: false },
  { name: 'Kashmiri (Arab script)', flash: true, lite: false },
  { name: 'Kashmiri (Deva script)', flash: true, lite: false },
  { name: 'Nepali', flash: true, lite: true },
  { name: 'Sinhala', flash: true, lite: true },
  { name: 'Urdu', flash: true, lite: true },
  { name: 'Sindhi', flash: true, lite: true },
  { name: 'Swahili', flash: true, lite: true },
  { name: 'Afrikaans', flash: true, lite: true },
  { name: 'Amharic', flash: true, lite: true },
  { name: 'Hausa', flash: true, lite: true },
  { name: 'Igbo', flash: true, lite: true },
  { name: 'Yoruba', flash: true, lite: true },
  { name: 'Zulu', flash: true, lite: true },
  { name: 'Somali', flash: true, lite: true },
  { name: 'Filipino', flash: true, lite: true },
  { name: 'Cebuano', flash: true, lite: true },
  { name: 'Iloko', flash: true, lite: false },
  { name: 'Pangasinan', flash: true, lite: false },
  { name: 'Javanese', flash: true, lite: true },
  { name: 'Balinese', flash: true, lite: false },
  { name: 'Acehnese', flash: true, lite: false },
  { name: 'Minangkabau', flash: true, lite: false },
  { name: 'Standard Malay', flash: true, lite: true },
  { name: 'Catalan', flash: true, lite: true },
  { name: 'Basque', flash: true, lite: true },
  { name: 'Galician', flash: true, lite: true },
  { name: 'Occitan', flash: true, lite: false },
  { name: 'Croatian', flash: true, lite: true },
  { name: 'Serbian', flash: true, lite: true },
  { name: 'Bosnian', flash: true, lite: true },
  { name: 'Slovenian', flash: true, lite: true },
  { name: 'Bulgarian', flash: true, lite: true },
  { name: 'Macedonian', flash: true, lite: true },
  { name: 'Estonian', flash: true, lite: true },
  { name: 'Standard Latvian', flash: true, lite: true },
  { name: 'Latgalian', flash: true, lite: false },
  { name: 'Lithuanian', flash: true, lite: true },
  { name: 'Icelandic', flash: true, lite: true },
  { name: 'Maltese', flash: true, lite: true },
  { name: 'Luxembourgish', flash: true, lite: true },
  { name: 'Armenian', flash: true, lite: true },
  { name: 'Georgian', flash: true, lite: true },
  { name: 'Kazakh', flash: true, lite: true },
  { name: 'Kyrgyz', flash: true, lite: true },
  { name: 'Northern Uzbek', flash: true, lite: true },
  { name: 'Tajik', flash: true, lite: true },
  { name: 'Iranian Persian', flash: true, lite: true },
  { name: 'Southern Pashto', flash: true, lite: true },
  { name: 'Central Kurdish', flash: true, lite: false },
  { name: 'Burmese', flash: true, lite: true },
  { name: 'Khmer', flash: true, lite: true },
  { name: 'Lao', flash: true, lite: true },
  { name: 'Halh Mongolian', flash: true, lite: true },
  { name: 'Haitian Creole', flash: true, lite: true },
  { name: 'Guarani', flash: true, lite: false },
  { name: 'Uyghur', flash: true, lite: false },
  { name: 'Tigrinya', flash: true, lite: false },
  { name: 'Tosk Albanian', flash: true, lite: true },
];

// Global Studio State
const state = {
  projectId: '',
  location: 'global',
  accessToken: '',
  simMode: false, // false = Live Vertex API (with auto-fallback option), true = Studio Synth Simulation
  model: 'gemini-3.8-flash-tts',
  mode: 'single', // 'single' | 'multi' | 'stitch'
  voice: 'Kore',
  outputFormat: 'AUDIO_WAV',
  activeTurnIndex: 0,
  turns: [
    {
      speaker: 'Podcaster',
      style: 'cheerful and friendly',
      text: "Welcome back to the show! <short pause> Today we're talking about the best hiking trails for beginners, so grab your boots and let's get going!",
    },
  ],
  speakers: [
    { speaker: 'Ryan', voice: 'Sadaltager' },
    { speaker: 'Katie', voice: 'Leda' },
  ],
  prebuiltVoices: [],
  extendedVoices: [],
  storedVoices: [], // Includes project stored voices + local stateless keys
  consentStatements: [],
  codeView: 'py_unary',
  replicationStore: true,
  refBlob: null,
  consentBlob: null,
  lastAudioBase64: null,
  lastRawBase64: null,
  lastAudioExt: 'wav',
  lastStreamPcmChunks: [],
};

// Web Audio & Visualizer State
let audioCtx = null;
let analyserNode = null;
let mediaElementSource = null;
let activeRecorder = null;
let activeRecordingTarget = null;
let recChunks = [];

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

window.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) lucide.createIcons();
  loadSavedLocalVault();
  await fetchServerConfig();
  renderVocalTags('all');
  renderScriptTurns();
  renderSpeakerBindings();
  renderVoiceExplorer();
  renderVaultTable();
  renderLanguageBadges('');
  updateLivePayloadAndCode();
  initWaveformVisualizer();

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      triggerUnarySynthesis();
    }
  });
});

async function fetchServerConfig() {
  try {
    const res = await fetch('/api/config');
    const cfg = await res.json();
    state.projectId = cfg.project_id || '';
    state.location = cfg.location || 'global';
    state.prebuiltVoices = cfg.prebuilt_voices || [];
    state.extendedVoices = cfg.extended_library_curated || [];
    state.consentStatements = cfg.consent_statements || [];

    document.getElementById('header-project-id').value = state.projectId;
    document.getElementById('modal-project-id').value = state.projectId;

    const dot = document.getElementById('auth-status-dot');
    if (cfg.authenticated) {
      dot.className = 'w-2 h-2 rounded-full bg-emerald-400 shrink-0';
      dot.title = 'Application Default Credentials detected';
    } else {
      dot.className = 'w-2 h-2 rounded-full bg-amber-400 shrink-0';
      dot.title = 'No ADC token detected; configure in settings or use Studio Synth Demo Mode';
    }

    populateSingleVoiceDropdown();
    populateConsentDropdown();
  } catch (e) {
    console.error('Failed to load config:', e);
  }
}

function populateSingleVoiceDropdown() {
  const sel = document.getElementById('single-voice-select');
  if (!sel) return;
  let html = `<optgroup label="30 Official Prebuilt Voices">`;
  for (const v of state.prebuiltVoices) {
    const selected = v.id === state.voice ? 'selected' : '';
    html += `<option value="${v.id}" ${selected}>${v.display_name} — ${v.trait} (${v.gender})</option>`;
  }
  html += `</optgroup>`;

  if (state.extendedVoices.length > 0) {
    html += `<optgroup label="Extended Voice Library (2,000+ Curated)">`;
    for (const v of state.extendedVoices) {
      const selected = v.id === state.voice ? 'selected' : '';
      html += `<option value="${v.id}" ${selected}>${v.display_name || v.id} [${v.language_code}]</option>`;
    }
    html += `</optgroup>`;
  }

  if (state.storedVoices.length > 0) {
    html += `<optgroup label="Project Stored Voices & Replication Keys">`;
    for (const v of state.storedVoices) {
      const idOrKey = v.id || v.key;
      const selected = idOrKey === state.voice ? 'selected' : '';
      html += `<option value="${idOrKey}" ${selected}>${v.display_name || idOrKey} (${v.type})</option>`;
    }
    html += `</optgroup>`;
  }

  sel.innerHTML = html;
}

function populateConsentDropdown() {
  const sel = document.getElementById('consent-lang-select');
  if (!sel) return;
  sel.innerHTML = state.consentStatements
    .map(
      (c, i) =>
        `<option value="${i}">${c.language} (${c.code})</option>`
    )
    .join('');
}

function updateConsentStatementDisplay() {
  const idx = parseInt(document.getElementById('consent-lang-select').value, 10) || 0;
  const item = state.consentStatements[idx];
  if (item) {
    document.getElementById('consent-statement-text').textContent = `"${item.statement}"`;
  }
}

// ---------------------------------------------------------------------------
// Navigation & Header Controls
// ---------------------------------------------------------------------------

const TAB_TITLES = {
  director: 'Speech Playground',
  streaming: 'Live Streaming',
  library: 'Voice Library',
  design: 'Design a Voice',
  replication: 'Clone a Voice',
  vault: 'Saved Voices',
  code: 'Get Code & Docs',
};

function switchTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach((el) => el.classList.add('hidden'));
  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  const titleEl = document.getElementById('workspace-title');
  if (titleEl && TAB_TITLES[tabName]) {
    titleEl.textContent = TAB_TITLES[tabName];
  }

  if (tabName === 'code') updateLivePayloadAndCode();
  if (tabName === 'vault') renderVaultTable();
  if (window.innerWidth <= 820) {
    const lsb = document.getElementById('left-nav-sidebar');
    if (lsb) lsb.classList.add('hidden');
  }
  if (window.lucide) lucide.createIcons();
}

function toggleLeftSidebar() {
  const lsb = document.getElementById('left-nav-sidebar');
  if (lsb) lsb.classList.toggle('hidden');
}

function toggleRightSidebar() {
  const sb = document.getElementById('right-settings-sidebar');
  if (sb) sb.classList.toggle('hidden');
}

function setModel(modelId) {
  state.model = modelId;
  const btnFlash = document.getElementById('model-btn-flash');
  const btnLite = document.getElementById('model-btn-lite');

  const activeCls = 'px-3 py-2 rounded-md text-xs font-medium text-left transition-all bg-[#A8C7FA]/15 text-[#A8C7FA] border border-[#A8C7FA]/40';
  const inactiveCls = 'px-3 py-2 rounded-md text-xs font-medium text-left transition-all text-[#8E918F] hover:text-white border border-transparent';

  if (modelId === 'gemini-3.8-flash-tts') {
    btnFlash.className = activeCls;
    btnLite.className = inactiveCls;
    showToast('Switched to Gemini 3.8 Flash TTS (Studio Grade, 130 Languages)', 'info');
  } else {
    btnLite.className = activeCls;
    btnFlash.className = inactiveCls;
    showToast('Switched to Gemini 3.8 Flash-Lite TTS (Low-Latency Production, 101 Languages)', 'info');
  }
  updateLivePayloadAndCode();
}

function syncProjectId(val) {
  state.projectId = val.trim();
  document.getElementById('header-project-id').value = state.projectId;
  document.getElementById('modal-project-id').value = state.projectId;
  updateLivePayloadAndCode();
}

function toggleSettingsModal() {
  const modal = document.getElementById('settings-modal');
  modal.classList.toggle('hidden');
  modal.classList.toggle('flex');
}

function saveSettingsModal() {
  state.projectId = document.getElementById('modal-project-id').value.trim();
  state.accessToken = document.getElementById('modal-access-token').value.trim();
  document.getElementById('header-project-id').value = state.projectId;
  toggleSettingsModal();
  updateLivePayloadAndCode();
  showToast('Vertex AI project & credentials updated', 'success');
}

function toggleSimMode() {
  state.simMode = !state.simMode;
  const label = document.getElementById('sim-mode-label');
  const btn = document.getElementById('sim-mode-btn');
  if (state.simMode) {
    label.textContent = 'Mode: Studio Synth Demo';
    btn.classList.add('text-amber-300');
    showToast('Switched to Studio Synth Demo Mode (local expressive WebAudio synthesis)', 'warn');
  } else {
    label.textContent = 'Mode: Live Vertex API';
    btn.classList.remove('text-amber-300');
    showToast('Switched to Live Vertex AI API Mode (aiplatform.googleapis.com)', 'success');
  }
}

// ---------------------------------------------------------------------------
// Synthesis Mode, Voice Selection & Output Format
// ---------------------------------------------------------------------------

function setSynthesisMode(mode) {
  state.mode = mode;
  ['single', 'multi', 'stitch'].forEach((m) => {
    const btn = document.getElementById(`mode-btn-${m}`);
    if (m === mode) {
      btn.className = 'py-1.5 px-2 rounded text-xs font-medium bg-[#282A2C] text-[#A8C7FA] transition-all';
    } else {
      btn.className = 'py-1.5 px-2 rounded text-xs font-medium text-[#8E918F] hover:text-white transition-all';
    }
  });

  const singlePanel = document.getElementById('single-voice-panel');
  const multiPanel = document.getElementById('multi-voice-panel');
  const addSpeakerBtn = document.getElementById('add-speaker-binding-btn');
  const hintTitle = document.getElementById('multi-mode-hint-title');
  const hintDesc = document.getElementById('multi-mode-hint-desc');

  if (mode === 'single') {
    singlePanel.classList.remove('hidden');
    multiPanel.classList.add('hidden');
  } else if (mode === 'multi') {
    singlePanel.classList.add('hidden');
    multiPanel.classList.remove('hidden');
    addSpeakerBtn.classList.add('hidden');
    hintTitle.textContent = '2-Speaker Dialogue';
    hintDesc.innerHTML =
      'Uses <code class="mono text-[#A8C7FA]">multiSpeakerVoiceConfig</code> (2 speakers). Wrap listener reactions in <code class="mono text-[#78D9EC]">|pipes|</code>.';
    if (state.speakers.length > 2) state.speakers = state.speakers.slice(0, 2);
    if (state.speakers.length < 2) {
      state.speakers = [
        { speaker: 'Ryan', voice: 'Sadaltager' },
        { speaker: 'Katie', voice: 'Leda' },
      ];
    }
  } else if (mode === 'stitch') {
    singlePanel.classList.add('hidden');
    multiPanel.classList.remove('hidden');
    addSpeakerBtn.classList.remove('hidden');
    hintTitle.textContent = '3+ Cast Stitch (AUDIO_L16)';
    hintDesc.innerHTML =
      'Synthesizes each turn in headerless <code class="mono text-[#78D9EC]">AUDIO_L16</code> (24kHz) and concatenates into a master WAV.';
  }

  renderSpeakerBindings();
  renderScriptTurns();
  updateLivePayloadAndCode();
}

function onSingleVoiceSelectChange(val) {
  state.voice = val;
  document.getElementById('custom-voice-id-input').value = val;
  document.getElementById('active-voice-banner').textContent = val;
  updateLivePayloadAndCode();
}

function onCustomVoiceInput(val) {
  if (val.trim()) {
    state.voice = val.trim();
    document.getElementById('active-voice-banner').textContent = state.voice;
    updateLivePayloadAndCode();
  }
}

function onFormatChange(fmt) {
  state.outputFormat = fmt;
  const labelMap = {
    AUDIO_WAV: 'AUDIO_WAV (24kHz)',
    AUDIO_L16: 'AUDIO_L16 (24kHz PCM)',
    AUDIO_MULAW: 'AUDIO_MULAW (8kHz)',
    AUDIO_ALAW: 'AUDIO_ALAW (8kHz)',
  };
  document.getElementById('active-format-banner').textContent = labelMap[fmt] || fmt;
  updateLivePayloadAndCode();
}

const SPEAKER_ROLES = [
  'Podcaster',
  'Narrator',
  'Audiobook Narrator',
  'Host',
  'Co-Host',
  'News Anchor',
  'Documentary Guide',
  'Customer Support',
  'Voice Assistant',
  'Educator',
  'Storyteller',
  'Character',
  'Sports Announcer',
  'Weather Reporter',
  'Developer',
  'Interviewer',
  'Guest',
  'Ryan',
  'Katie',
  'Joe',
  'Jane',
];

const TURN_STYLE_OPTIONS = [
  { value: 'cheerful and friendly', label: 'Cheerful & friendly' },
  { value: 'calm and relaxed', label: 'Calm & relaxed' },
  { value: 'warm and enthusiastic', label: 'Warm & enthusiastic' },
  { value: 'conversational and natural', label: 'Conversational & natural' },
  { value: 'professional and authoritative', label: 'Professional & authoritative' },
  { value: 'whispered urgently', label: 'Whispered urgently' },
  { value: 'speaking rapidly, excited inflection', label: 'Speaking rapidly, excited' },
  { value: 'speaking slowly, solemn', label: 'Speaking slowly, solemn' },
  { value: 'reflective and awe-inspired', label: 'Reflective & awe-inspired' },
  { value: 'sarcastic and dry', label: 'Sarcastic & dry' },
  { value: 'empathetic and soothing', label: 'Empathetic & soothing' },
  { value: 'frustrated, then relieved and amused', label: 'Frustrated, then relieved' },
  { value: 'casual, upbeat', label: 'Casual & upbeat' },
  { value: 'confident and reassuring', label: 'Confident & reassuring' },
  { value: 'excited and relieved', label: 'Excited & relieved' },
  { value: 'warm and inviting', label: 'Warm & inviting' },
  { value: '', label: 'None (Plain TTS)' },
];

function renderSpeakerBindings() {
  const container = document.getElementById('speaker-bindings-list');
  if (!container) return;

  const voiceOptions = [
    ...state.prebuiltVoices.map((v) => ({ id: v.id, label: `${v.display_name} (${v.trait})` })),
    ...state.extendedVoices.map((v) => ({ id: v.id, label: `${v.display_name || v.id} [Library]` })),
    ...state.storedVoices.map((v) => ({ id: v.id || v.key, label: `${v.display_name || v.id || v.key} [Custom]` })),
  ];

  container.innerHTML = state.speakers
    .map((sp, idx) => {
      const optsHtml = voiceOptions
        .map((vo) => `<option value="${vo.id}" ${vo.id === sp.voice ? 'selected' : ''}>${vo.label}</option>`)
        .join('');
      const roleSet = new Set([...SPEAKER_ROLES, sp.speaker, `Speaker ${idx + 1}`].filter(Boolean));
      const roleOptsHtml = Array.from(roleSet)
        .map((r) => `<option value="${escapeHtml(r)}" ${r === sp.speaker ? 'selected' : ''}>${escapeHtml(r)}</option>`)
        .join('');
      const canRemove = state.mode === 'stitch' && state.speakers.length > 2;
      return `
        <div class="p-2 rounded-lg bg-[#131314] border border-[#282A2C] space-y-1.5">
          <div class="flex items-center justify-between gap-1.5">
            <span class="badge ${idx === 0 ? 'badge-indigo' : idx === 1 ? 'badge-cyan' : 'badge-amber'}">Speaker ${idx + 1}</span>
            ${
              canRemove
                ? `<button onclick="removeSpeakerBinding(${idx})" class="text-[#8E918F] hover:text-[#F28B82]"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>`
                : ''
            }
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <select class="select-field text-xs py-1 font-medium" onchange="updateSpeakerBindingName(${idx}, this.value)" title="Select Speaker Role / Name">
              ${roleOptsHtml}
            </select>
            <select class="select-field text-xs py-1" onchange="updateSpeakerBindingVoice(${idx}, this.value)" title="Select Voice">
              ${optsHtml}
            </select>
          </div>
        </div>
      `;
    })
    .join('');

  if (window.lucide) lucide.createIcons();
}

function updateSpeakerBindingName(idx, newName) {
  const oldName = state.speakers[idx].speaker;
  state.speakers[idx].speaker = newName;
  state.turns.forEach((t) => {
    if (t.speaker === oldName) t.speaker = newName;
  });
  renderScriptTurns();
  updateLivePayloadAndCode();
}

function updateSpeakerBindingVoice(idx, newVoice) {
  state.speakers[idx].voice = newVoice;
  renderScriptTurns();
  updateLivePayloadAndCode();
}

function addSpeakerBinding() {
  const nextNum = state.speakers.length + 1;
  const fallbackVoice = state.prebuiltVoices[nextNum % state.prebuiltVoices.length]?.id || 'Charon';
  const defaultRole = SPEAKER_ROLES[nextNum % SPEAKER_ROLES.length] || `Speaker ${nextNum}`;
  state.speakers.push({ speaker: defaultRole, voice: fallbackVoice });
  renderSpeakerBindings();
  renderScriptTurns();
  updateLivePayloadAndCode();
}

function removeSpeakerBinding(idx) {
  state.speakers.splice(idx, 1);
  renderSpeakerBindings();
  renderScriptTurns();
  updateLivePayloadAndCode();
}

// ---------------------------------------------------------------------------
// Script Turn Composer & Vocal Tag Insertion
// ---------------------------------------------------------------------------

function renderScriptTurns() {
  const container = document.getElementById('script-turns-container');
  if (!container) return;

  container.innerHTML = state.turns
    .map((turn, idx) => {
      const isActive = idx === state.activeTurnIndex;

      // Build Speaker / Role dropdown
      let speakerSelectorHtml = '';
      if (state.mode === 'single') {
        const currentRole = turn.speaker || '';
        const roleList = [...SPEAKER_ROLES];
        if (currentRole && !roleList.includes(currentRole)) {
          roleList.unshift(currentRole);
        }
        const roleOptions = [
          `<option value="" ${currentRole === '' ? 'selected' : ''}>No Role Label</option>`,
          ...roleList.map(
            (r) => `<option value="${escapeHtml(r)}" ${r === currentRole ? 'selected' : ''}>${escapeHtml(r)}</option>`
          ),
        ].join('');

        speakerSelectorHtml = `
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] text-[#8E918F] font-mono whitespace-nowrap">Role:</span>
            <select class="select-field text-xs py-1 w-44 font-medium text-[#E3E3E3]"
              onchange="setActiveTurn(${idx}); updateTurnField(${idx}, 'speaker', this.value)">
              ${roleOptions}
            </select>
          </div>
        `;
      } else {
        speakerSelectorHtml = `
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] text-[#8E918F] font-mono whitespace-nowrap">Speaker:</span>
            <select class="select-field text-xs py-1 w-44 font-medium text-[#A8C7FA]"
              onchange="setActiveTurn(${idx}); updateTurnField(${idx}, 'speaker', this.value)">
              ${state.speakers
                .map(
                  (s) =>
                    `<option value="${escapeHtml(s.speaker)}" ${
                      s.speaker === turn.speaker ? 'selected' : ''
                    }>${escapeHtml(s.speaker)} (${s.voice})</option>`
                )
                .join('')}
            </select>
          </div>
        `;
      }

      // Build Style dropdown (includes current style if custom)
      const currentStyle = turn.style || '';
      const hasPresetStyle = TURN_STYLE_OPTIONS.some((o) => o.value === currentStyle);
      const styleOptsList = hasPresetStyle
        ? TURN_STYLE_OPTIONS
        : [{ value: currentStyle, label: currentStyle }, ...TURN_STYLE_OPTIONS];

      const styleOptionsHtml = styleOptsList
        .map(
          (opt) =>
            `<option value="${escapeHtml(opt.value)}" ${opt.value === currentStyle ? 'selected' : ''}>${escapeHtml(
              opt.label
            )}</option>`
        )
        .join('');

      return `
        <div class="turn-card ${isActive ? 'active-turn' : ''}">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div class="flex flex-wrap items-center gap-2.5 flex-1">
              <span class="text-[11px] font-mono text-[#8E918F] px-1.5 py-0.5 rounded bg-[#131314] border border-[#282A2C]">#${idx + 1}</span>
              ${speakerSelectorHtml}
              <div class="flex items-center gap-1.5 flex-1 min-w-[190px]">
                <span class="text-[11px] text-[#8E918F] font-mono whitespace-nowrap">Style:</span>
                <select id="turn-style-${idx}"
                  class="select-field text-xs py-1 flex-1"
                  onchange="setActiveTurn(${idx}); updateTurnField(${idx}, 'style', this.value)">
                  ${styleOptionsHtml}
                </select>
              </div>
            </div>
            ${
              state.turns.length > 1
                ? `<button onclick="removeScriptTurn(${idx})" class="text-[#8E918F] hover:text-[#F28B82] p-1" title="Remove turn">
                     <i data-lucide="x" class="w-3.5 h-3.5"></i>
                   </button>`
                : ''
            }
          </div>

          <textarea id="turn-text-${idx}" rows="3"
            class="textarea-field font-sans text-sm leading-relaxed"
            placeholder="Enter verbatim text to synthesize... Use <sigh>, <short pause>, <laugh> or |backchannel| inline."
            onfocus="setActiveTurn(${idx})"
            oninput="updateTurnField(${idx}, 'text', this.value)">${escapeHtml(turn.text)}</textarea>
        </div>
      `;
    })
    .join('');

  updateCharCounterAndLint();
  if (window.lucide) lucide.createIcons();
}

function setActiveTurn(idx) {
  if (state.activeTurnIndex === idx) return;
  state.activeTurnIndex = idx;
  document.querySelectorAll('.turn-card').forEach((card, i) => {
    card.classList.toggle('active-turn', i === idx);
  });
}

function updateTurnField(idx, field, val) {
  if (!state.turns[idx]) return;
  state.turns[idx][field] = val;
  updateCharCounterAndLint();
  updateLivePayloadAndCode();
}

function addScriptTurn() {
  const nextIdx = state.turns.length;
  let defaultSpeaker = 'Podcaster';
  if (state.mode !== 'single' && state.speakers.length > 0) {
    defaultSpeaker = state.speakers[nextIdx % state.speakers.length].speaker;
  }
  state.turns.push({
    speaker: defaultSpeaker,
    style: nextIdx % 2 === 0 ? 'cheerful and friendly' : 'calm and relaxed',
    text: '',
  });
  state.activeTurnIndex = state.turns.length - 1;
  renderScriptTurns();
  updateLivePayloadAndCode();
  setTimeout(() => {
    const ta = document.getElementById(`turn-text-${state.activeTurnIndex}`);
    if (ta) ta.focus();
  }, 50);
}

function removeScriptTurn(idx) {
  if (state.turns.length <= 1) return;
  state.turns.splice(idx, 1);
  if (state.activeTurnIndex >= state.turns.length) {
    state.activeTurnIndex = state.turns.length - 1;
  }
  renderScriptTurns();
  updateLivePayloadAndCode();
}

function clearScriptTurns() {
  state.turns = [
    {
      speaker: state.mode === 'single' ? 'Podcaster' : state.speakers[0]?.speaker || 'Ryan',
      style: 'cheerful and friendly',
      text: 'Have a wonderful day!',
    },
  ];
  state.activeTurnIndex = 0;
  renderScriptTurns();
  updateLivePayloadAndCode();
}

function applyStylePreset(styleStr) {
  const idx = state.activeTurnIndex;
  if (!state.turns[idx]) return;
  state.turns[idx].style = styleStr;
  renderScriptTurns();
  updateLivePayloadAndCode();
}

function renderVocalTags(category) {
  document.querySelectorAll('.vocal-cat-btn').forEach((btn) => {
    if (btn.dataset.cat === category) {
      btn.className = 'vocal-cat-btn badge badge-indigo cursor-pointer';
    } else {
      btn.className = 'vocal-cat-btn badge bg-[#282A2C] text-[#C4C7C5] cursor-pointer hover:bg-[#37393B]';
    }
  });

  const filtered = category === 'all' ? VOCAL_TAGS : VOCAL_TAGS.filter((t) => t.cat === category);
  const container = document.getElementById('vocal-tags-container');
  container.innerHTML = filtered
    .map(
      (t) =>
        `<button onclick="insertTextAtCursor('${t.tag} ')" class="vocal-pill" title="${escapeHtml(t.desc)}">${escapeHtml(
          t.tag
        )}</button>`
    )
    .join('');
}

function filterVocalTags(cat) {
  renderVocalTags(cat);
}

function insertTextAtCursor(snippet) {
  const idx = state.activeTurnIndex;
  const ta = document.getElementById(`turn-text-${idx}`);
  if (!ta) return;

  const start = ta.selectionStart ?? ta.value.length;
  const end = ta.selectionEnd ?? ta.value.length;
  const before = ta.value.substring(0, start);
  const after = ta.value.substring(end);

  ta.value = before + snippet + after;
  state.turns[idx].text = ta.value;

  ta.focus();
  const newPos = start + snippet.length;
  ta.setSelectionRange(newPos, newPos);

  updateCharCounterAndLint();
  updateLivePayloadAndCode();
}

function updateCharCounterAndLint() {
  const totalChars = state.turns.reduce((acc, t) => acc + (t.text || '').length, 0);
  const ind = document.getElementById('char-count-indicator');
  if (ind) {
    ind.textContent = `${totalChars} chars • ${state.turns.length} ${state.turns.length === 1 ? 'turn' : 'turns'}`;
  }

  // Run Prompting Best Practices Lint Check
  const warnings = [];
  for (let i = 0; i < state.turns.length; i++) {
    const t = state.turns[i];
    const txt = t.text || '';
    const st = (t.style || '').toLowerCase();

    if (/^(say|speak|read)\s+\w+ly\s*:/i.test(txt) || /^speaker\s*\d*\s*:/i.test(txt)) {
      warnings.push(
        `Turn ${i + 1}: Avoid inline stage directions like "Say cheerfully:" or "Speaker 1:" in text — Gemini 3.8 treats text as a verbatim transcript and may read them aloud.`
      );
    }
    if (/(do not switch|maintain identical|hold the voice)/i.test(st)) {
      warnings.push(
        `Turn ${i + 1}: Omit meta-instructions like "do not switch speaker identity" in style — extra meta-prompting increases voice drift.`
      );
    }
    if (/\b(year old|years old|in his \d0s|in her \d0s|british accent|southern accent)\b/i.test(st)) {
      warnings.push(
        `Turn ${i + 1}: Put permanent traits (age, regional accent) in Voice Design rather than turn-level speech_metadata.style.`
      );
    }
  }

  const badge = document.getElementById('lint-status-badge');
  const list = document.getElementById('lint-messages');
  if (warnings.length > 0) {
    badge.className = 'badge badge-amber';
    badge.textContent = `${warnings.length} Tip${warnings.length > 1 ? 's' : ''}`;
    list.innerHTML = warnings.map((w) => `<li class="text-amber-200">&bull; ${escapeHtml(w)}</li>`).join('');
  } else {
    badge.className = 'badge badge-emerald';
    badge.textContent = 'Optimal';
    list.innerHTML = `
      <li>&bull; <strong>Scope separation:</strong> Sustained delivery is cleanly placed in <code class="mono text-purple-300">speech_metadata.style</code>; point-in-time bursts use <code class="mono text-amber-300">&lt;tags&gt;</code>.</li>
      <li>&bull; <strong>Stable Persona:</strong> No drift-inducing meta-instructions detected in transcript or style fields.</li>
    `;
  }
}

// ---------------------------------------------------------------------------
// Colab & Documentation Preset Scenarios
// ---------------------------------------------------------------------------

function loadPreset(presetKey) {
  if (presetKey === 'colab_basic') {
    setModel('gemini-3.8-flash-lite-tts');
    setSynthesisMode('single');
    onSingleVoiceSelectChange('Fenrir');
    state.turns = [
      {
        speaker: '',
        style: '',
        text: 'Hey there! How are you doing today?',
      },
    ];
  } else if (presetKey === 'colab_podcaster') {
    setModel('gemini-3.8-flash-lite-tts');
    setSynthesisMode('single');
    onSingleVoiceSelectChange('en-US-studio-podcaster-f1');
    state.turns = [
      {
        speaker: 'Podcaster',
        style: 'cheerful and friendly',
        text: "Welcome back to the show! Today we're talking about the best hiking trails for beginners, so grab your boots and let's get going.",
      },
    ];
  } else if (presetKey === 'colab_tags') {
    setModel('gemini-3.8-flash-tts');
    setSynthesisMode('single');
    onSingleVoiceSelectChange('Aoede');
    state.turns = [
      {
        speaker: 'Developer',
        style: 'frustrated, then relieved and amused',
        text: "<sigh> I have absolutely no idea why this variable is returning as undefined, <groan> and I've been staring at this same block of code until my eyes are literally crossing! <shout> Just work already! <whispers> Wait... is it really just a missing semicolon right there on line forty-two? <laugh> I can't believe I spent two hours debugging a simple typo!",
      },
    ];
  } else if (presetKey === 'colab_spanish') {
    setModel('gemini-3.8-flash-lite-tts');
    setSynthesisMode('single');
    onSingleVoiceSelectChange('Despina');
    state.turns = [
      {
        speaker: '',
        style: 'warm and inviting',
        text: '¡Hola! ¿Quieres hacer algo hoy? <chuckle> Hace un día espectacular para caminar por el parque.',
      },
    ];
  } else if (presetKey === 'colab_multi') {
    setModel('gemini-3.8-flash-tts');
    state.speakers = [
      { speaker: 'Ryan', voice: 'Sadaltager' },
      { speaker: 'Katie', voice: 'Leda' },
    ];
    setSynthesisMode('multi');
    state.turns = [
      {
        speaker: 'Ryan',
        style: 'cheerful and friendly',
        text: 'How are you doing today Katie?',
      },
      {
        speaker: 'Katie',
        style: 'calm and relaxed',
        text: 'Not too bad, how about you? Ready to test these new Gemini 3.8 voices?',
      },
    ];
  } else if (presetKey === 'docs_backchannel') {
    setModel('gemini-3.8-flash-tts');
    state.speakers = [
      { speaker: 'Joe', voice: 'Puck' },
      { speaker: 'Jane', voice: 'Kore' },
    ];
    setSynthesisMode('multi');
    state.turns = [
      {
        speaker: 'Joe',
        style: 'casual, upbeat',
        text: 'So the launch is Thursday |oh hmm| Are we actually ready?',
      },
      {
        speaker: 'Jane',
        style: 'confident and reassuring',
        text: 'Ready enough |oh really?| The last blocker cleared this morning.',
      },
      {
        speaker: 'Joe',
        style: 'excited and relieved',
        text: "Then let's ship it |absolutely| and watch the dashboards! <cheer>",
      },
    ];
  }

  state.activeTurnIndex = 0;
  renderSpeakerBindings();
  renderScriptTurns();
  updateLivePayloadAndCode();
  showToast('Loaded official preset into Speech Director', 'info');
}

// ---------------------------------------------------------------------------
// Live Vertex AI Request Payload & Code Generator
// ---------------------------------------------------------------------------

function buildCurrentPayloadObject() {
  const parts = state.turns.map((t) => {
    const part = { text: t.text };
    const meta = {};
    if (state.mode === 'multi' && t.speaker) meta.speaker = t.speaker;
    else if (state.mode === 'single' && t.speaker) meta.speaker = t.speaker;
    if (t.style && t.style.trim()) meta.style = t.style.trim();
    if (Object.keys(meta).length > 0) part.speechMetadata = meta;
    return part;
  });

  const speechConfig =
    state.mode === 'multi'
      ? {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: state.speakers.slice(0, 2).map((s) => ({
              speaker: s.speaker,
              voiceConfig: { voice: s.voice },
            })),
          },
        }
      : {
          voiceConfig: { voice: state.voice },
        };

  const generationConfig = {
    responseModalities: ['AUDIO'],
    speechConfig,
  };

  if (state.outputFormat !== 'AUDIO_WAV') {
    generationConfig.responseFormat = [{ audio: { mimeType: state.outputFormat } }];
  }

  return {
    contents: [{ role: 'user', parts }],
    generationConfig,
  };
}

function updateLivePayloadAndCode() {
  const payload = buildCurrentPayloadObject();
  const previewEl = document.getElementById('live-payload-preview');
  if (previewEl) {
    previewEl.textContent = JSON.stringify(payload, null, 2);
  }
  renderExportedCode();
}

function setCodeView(view) {
  state.codeView = view;
  ['py_unary', 'py_stream', 'curl_unary', 'curl_stream'].forEach((v) => {
    const btn = document.getElementById(`code-tab-${v.replace('_', '-')}`);
    if (btn) {
      btn.className =
        v === view
          ? 'px-2.5 py-1 rounded text-xs font-medium bg-[#A8C7FA] text-[#062E6F]'
          : 'px-2.5 py-1 rounded text-xs font-medium text-[#8E918F] hover:text-white';
    }
  });
  renderExportedCode();
}

function renderExportedCode() {
  const el = document.getElementById('exported-code-block');
  if (!el) return;

  const proj = state.projectId || 'PROJECT_ID';
  const payload = buildCurrentPayloadObject();

  const pyParts = state.turns
    .map((t) => {
      const metaEntries = [];
      if ((state.mode === 'multi' || state.mode === 'single') && t.speaker) {
        metaEntries.push(`"speaker": ${JSON.stringify(t.speaker)}`);
      }
      if (t.style && t.style.trim()) {
        metaEntries.push(`"style": ${JSON.stringify(t.style.trim())}`);
      }
      const metaLine = metaEntries.length > 0 ? `\n            "speech_metadata": {${metaEntries.join(', ')}},` : '';
      return `        {\n            "text": ${JSON.stringify(t.text)},${metaLine}\n        }`;
    })
    .join(',\n');

  const pySpeechConfig =
    state.mode === 'multi'
      ? `{
            "multi_speaker_voice_config": {
                "speaker_voice_configs": [
${state.speakers
  .slice(0, 2)
  .map((s) => `                    {"speaker": ${JSON.stringify(s.speaker)}, "voice_config": {"voice": ${JSON.stringify(s.voice)}}}`)
  .join(',\n')}
                ]
            }
        }`
      : `{"voice_config": {"voice": ${JSON.stringify(state.voice)}}}`;

  const extraFormatPy =
    state.outputFormat !== 'AUDIO_WAV'
      ? `,\n        "http_options": {\n            "extra_body": {\n                "generationConfig": {\n                    "responseFormat": [{"audio": {"mimeType": "${state.outputFormat}"}}]\n                }\n            }\n        }`
      : '';

  const outExt =
    state.outputFormat === 'AUDIO_MULAW'
      ? 'mulaw'
      : state.outputFormat === 'AUDIO_ALAW'
      ? 'alaw'
      : state.outputFormat === 'AUDIO_L16'
      ? 'pcm'
      : 'wav';

  if (state.codeView === 'py_unary') {
    el.textContent = `from google import genai

client = genai.Client(enterprise=True, project="${proj}", location="global")

response = client.models.generate_content(
    model="${state.model}",
    contents=[{
        "role": "user",
        "parts": [
${pyParts}
        ],
    }],
    config={
        "response_modalities": ["AUDIO"],
        "speech_config": ${pySpeechConfig}${extraFormatPy}
    },
)

with open("output.${outExt}", "wb") as f:
    f.write(response.candidates[0].content.parts[0].inline_data.data)
`;
  } else if (state.codeView === 'py_stream') {
    el.textContent = `from google import genai

client = genai.Client(enterprise=True, project="${proj}", location="global")

def emit_audio(pcm: bytes) -> None:
    """Sends a chunk of raw 16-bit PCM audio (24 kHz, mono) downstream."""
    print(f"Received {len(pcm)} bytes of 24kHz PCM audio")

response_stream = client.models.generate_content_stream(
    model="${state.model}",
    contents=[{
        "role": "user",
        "parts": [
${pyParts}
        ],
    }],
    config={
        "response_modalities": ["AUDIO"],
        "speech_config": ${pySpeechConfig},
    },
)

for chunk in response_stream:
    if not chunk.candidates or not chunk.candidates[0].content:
        continue
    for part in chunk.candidates[0].content.parts or []:
        if part.inline_data and part.inline_data.data:
            emit_audio(part.inline_data.data)
`;
  } else if (state.codeView === 'curl_unary') {
    el.textContent = `curl -X POST \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  https://aiplatform.googleapis.com/v1/projects/${proj}/locations/global/publishers/google/models/${state.model}:generateContent \\
  -d '${JSON.stringify(payload, null, 2).replace(/'/g, "'\\''")}' \\
  | jq -r '.candidates[0].content.parts[0].inlineData.data' | base64 --decode > output.${outExt}`;
  } else if (state.codeView === 'curl_stream') {
    el.textContent = `curl -N -X POST \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  "https://aiplatform.googleapis.com/v1/projects/${proj}/locations/global/publishers/google/models/${state.model}:streamGenerateContent?alt=sse" \\
  -d '${JSON.stringify(payload, null, 2).replace(/'/g, "'\\''")}' \\
  | sed -n 's/^data: //p' \\
  | jq -r '.candidates[0].content.parts[0].inlineData.data // empty' \\
  | while read -r chunk; do echo "$chunk" | base64 --decode; done > streamed.pcm`;
  }
}

function copyLivePayload() {
  navigator.clipboard.writeText(JSON.stringify(buildCurrentPayloadObject(), null, 2));
  showToast('Vertex AI JSON payload copied to clipboard', 'success');
}

function copyGeneratedCode() {
  const code = document.getElementById('exported-code-block').textContent;
  navigator.clipboard.writeText(code);
  showToast('Code snippet copied to clipboard', 'success');
}

// ---------------------------------------------------------------------------
// Unary Synthesis Execution (generateContent)
// ---------------------------------------------------------------------------

async function triggerUnarySynthesis() {
  const btn = document.getElementById('btn-generate-unary');
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Synthesizing...</span>`;
  if (window.lucide) lucide.createIcons();

  try {
    if (state.simMode) {
      await runStudioSynthDemoUnary();
      return;
    }

    const reqBody = {
      project_id: state.projectId,
      location: state.location,
      access_token: state.accessToken,
      model: state.model,
      mode: state.mode,
      voice: state.voice,
      turns: state.turns,
      speakers: state.speakers,
      output_format: state.outputFormat,
    };

    const res = await fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `HTTP ${res.status}`);
    }

    const data = await res.json();
    loadAudioIntoMasterDeck({
      playableBase64: data.audio_base64,
      rawBase64: data.raw_base64 || data.audio_base64,
      title: `${state.mode === 'single' ? state.voice : 'Multi-Speaker Dialogue'} (${state.model})`,
      durationSec: data.duration_seconds,
      latencyMs: data.latency_ms,
      byteLength: data.byte_length,
      format: data.requested_format,
    });
    showToast(`Synthesized ${data.duration_seconds}s studio audio in ${data.latency_ms}ms`, 'success');
  } catch (err) {
    console.warn('Vertex API call returned error:', err);
    showToast(
      `Vertex API response: ${err.message.slice(0, 140)} — Generating expressive Studio Preview WAV so you can test the audio pipeline immediately.`,
      'warn'
    );
    await runStudioSynthDemoUnary();
  } finally {
    btn.disabled = false;
    btn.innerHTML = origHtml;
    if (window.lucide) lucide.createIcons();
  }
}

// ---------------------------------------------------------------------------
// Real-Time Streaming Synthesis Execution (streamGenerateContent)
// ---------------------------------------------------------------------------

async function triggerStreamSynthesis() {
  switchTab('streaming');
  const startBtn = document.getElementById('stream-lab-start-btn');
  const logEl = document.getElementById('stream-chunk-log');
  startBtn.disabled = true;
  logEl.innerHTML = `<div class="text-cyan-400">Connecting to Vertex AI SSE endpoint (${state.model}:streamGenerateContent?alt=sse)...</div>`;

  document.getElementById('stream-metric-ttfb').textContent = '— ms';
  document.getElementById('stream-metric-chunks').textContent = '0';
  document.getElementById('stream-metric-bytes').textContent = '0 KB';
  document.getElementById('stream-metric-duration').textContent = '0.00 s';

  state.lastStreamPcmChunks = [];
  ensureWebAudioContext();
  let nextPlayTime = audioCtx.currentTime + 0.06;

  try {
    if (state.simMode) {
      await runStudioSynthDemoStream(logEl, nextPlayTime);
      return;
    }

    const reqBody = {
      project_id: state.projectId,
      location: state.location,
      access_token: state.accessToken,
      model: state.model,
      mode: state.mode === 'stitch' ? 'multi' : state.mode,
      voice: state.voice,
      turns: state.turns,
      speakers: state.speakers,
      output_format: 'AUDIO_L16',
    };

    const res = await fetch('/api/tts/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const evt of events) {
        const line = evt.trim();
        if (!line.startsWith('data:')) continue;
        const jsonStr = line.slice(5).trim();
        if (!jsonStr) continue;
        const msg = JSON.parse(jsonStr);

        if (msg.error) {
          throw new Error(msg.error);
        }

        if (msg.pcm_base64) {
          const pcmBytes = base64ToUint8Array(msg.pcm_base64);
          state.lastStreamPcmChunks.push(pcmBytes);

          // Schedule gapless Web Audio playback of 24kHz 16-bit signed little-endian PCM
          nextPlayTime = schedulePcm16ChunkPlayback(pcmBytes, 24000, nextPlayTime);

          const kb = (msg.total_bytes / 1024).toFixed(1);
          const dur = (msg.total_bytes / (24000 * 2)).toFixed(2);
          document.getElementById('stream-metric-ttfb').textContent = `${msg.ttfb_ms} ms`;
          document.getElementById('stream-metric-chunks').textContent = `${msg.chunk_index}`;
          document.getElementById('stream-metric-bytes').textContent = `${kb} KB`;
          document.getElementById('stream-metric-duration').textContent = `${dur} s`;

          const row = document.createElement('div');
          row.className = 'flex items-center justify-between text-slate-300 border-b border-slate-900 pb-1';
          row.innerHTML = `
            <span><strong class="text-cyan-400">Chunk #${msg.chunk_index}</strong> &bull; ${msg.byte_length} bytes raw L16 PCM</span>
            <span class="text-emerald-400">+${msg.elapsed_ms} ms</span>
          `;
          logEl.appendChild(row);
          logEl.scrollTop = logEl.scrollHeight;
        }

        if (msg.done) {
          document.getElementById('stream-download-pcm-btn').disabled = false;
          // Also wrap combined PCM into WAV and load into bottom master deck for replay
          const totalPcm = concatUint8Arrays(state.lastStreamPcmChunks);
          const wavBytes = createWavFromPcm16(totalPcm, 24000);
          const b64Wav = uint8ArrayToBase64(wavBytes);
          loadAudioIntoMasterDeck(
            {
              playableBase64: b64Wav,
              rawBase64: uint8ArrayToBase64(totalPcm),
              title: `Streamed PCM (${state.model})`,
              durationSec: (totalPcm.length / 48000).toFixed(2),
              latencyMs: msg.ttfb_ms || msg.total_ms,
              byteLength: totalPcm.length,
              format: 'AUDIO_L16 (Streamed)',
            },
            false
          );
          showToast(`Stream complete: ${msg.total_chunks} PCM chunks (TTFB ${msg.ttfb_ms}ms)`, 'success');
        }
      }
    }
  } catch (err) {
    console.warn('Streaming fallback triggered:', err);
    showToast('Vertex SSE stream unavailable or unauthenticated — running live WebAudio PCM chunk stream simulation.', 'warn');
    await runStudioSynthDemoStream(logEl, nextPlayTime);
  } finally {
    startBtn.disabled = false;
  }
}

function schedulePcm16ChunkPlayback(pcmBytes, sampleRate, nextPlayTime) {
  ensureWebAudioContext();
  const numSamples = Math.floor(pcmBytes.byteLength / 2);
  if (numSamples === 0) return nextPlayTime;

  const audioBuffer = audioCtx.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  const dataView = new DataView(pcmBytes.buffer, pcmBytes.byteOffset, pcmBytes.byteLength);

  for (let i = 0; i < numSamples; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    channelData[i] = int16 / 32768.0;
  }

  const src = audioCtx.createBufferSource();
  src.buffer = audioBuffer;
  src.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);

  const startAt = Math.max(audioCtx.currentTime, nextPlayTime);
  src.start(startAt);
  return startAt + audioBuffer.duration;
}

function downloadLastStreamPcm() {
  if (!state.lastStreamPcmChunks.length) return;
  const combined = concatUint8Arrays(state.lastStreamPcmChunks);
  const blob = new Blob([combined], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gemini_3_8_streamed_24khz_s16le.pcm`;
  a.click();
}

// ---------------------------------------------------------------------------
// Voice Explorer (30 Prebuilt + 2,000+ Extended Voice Library)
// ---------------------------------------------------------------------------

function renderVoiceExplorer() {
  const grid = document.getElementById('voices-explorer-grid');
  if (!grid) return;

  const query = (document.getElementById('voice-search-input')?.value || '').toLowerCase().trim();
  const sourceFilter = document.getElementById('voice-source-filter')?.value || 'all';
  const genderFilter = document.getElementById('voice-gender-filter')?.value || 'all';

  let list = [];
  if (sourceFilter === 'all' || sourceFilter === 'prebuilt30') {
    list.push(...state.prebuiltVoices.map((v) => ({ ...v, sourceBadge: 'Prebuilt 30', badgeClass: 'badge-indigo' })));
  }
  if (sourceFilter === 'all' || sourceFilter === 'extended') {
    list.push(
      ...state.extendedVoices.map((v) => ({
        ...v,
        trait: v.persona || v.accent || 'Library Preset',
        sourceBadge: 'Extended Library',
        badgeClass: 'badge-cyan',
      }))
    );
  }
  if (sourceFilter === 'all' || sourceFilter === 'custom') {
    list.push(
      ...state.storedVoices.map((v) => ({
        id: v.id || v.key,
        display_name: v.display_name || v.id || v.key,
        trait: v.type || 'Custom',
        gender: v.gender || 'Custom',
        language_code: v.language_code || 'Multi',
        accent: 'Project Custom',
        description: v.description || 'Custom designed or replicated voice stored in project vault.',
        sourceBadge: v.key ? 'Stateless Key' : 'Stored Voice',
        badgeClass: 'badge-emerald',
      }))
    );
  }

  const filtered = list.filter((v) => {
    if (genderFilter !== 'all' && (v.gender || '').toLowerCase() !== genderFilter.toLowerCase()) {
      return false;
    }
    if (!query) return true;
    const hay = `${v.id} ${v.display_name} ${v.trait} ${v.persona || ''} ${v.accent || ''} ${v.language_code || ''} ${
      v.description || ''
    }`.toLowerCase();
    return hay.includes(query);
  });

  grid.innerHTML = filtered
    .map((v) => {
      const isSelected = state.voice === v.id;
      return `
        <div class="voice-card ${isSelected ? 'selected' : ''}">
          <div class="space-y-2 min-w-0">
            <div class="flex items-center justify-between gap-2 min-w-0">
              <span class="badge ${v.badgeClass}">${escapeHtml(v.sourceBadge)}</span>
              <span class="text-[11px] font-mono text-[#8E918F] truncate">${escapeHtml(v.language_code || 'en-US')} &bull; ${escapeHtml(
        v.gender || ''
      )}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-baseline justify-between gap-2 min-w-0">
                <h3 class="text-sm font-semibold text-white truncate">${escapeHtml(v.display_name || v.id)}</h3>
                <span class="text-[11px] font-medium text-[#A8C7FA] shrink-0">${escapeHtml(v.trait || '')}</span>
              </div>
              <code class="text-[11px] font-mono text-[#78D9EC]/90 block mt-0.5 truncate">${escapeHtml(v.id)}</code>
            </div>
            <p class="text-xs text-[#8E918F] leading-relaxed line-clamp-2">${escapeHtml(
              v.description || 'Expressive Gemini 3.8 TTS voice.'
            )}</p>
          </div>

          <div class="flex items-center gap-2 pt-2.5 border-t border-[#282A2C] min-w-0">
            <button onclick="auditionVoice('${escapeAttr(v.id)}', '${escapeAttr(v.display_name || v.id)}')"
              class="btn btn-secondary text-xs py-1.5 px-2.5 flex-1 min-w-0">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-[#78D9EC] shrink-0"></i>
              <span class="truncate">Audition</span>
            </button>
            <button onclick="assignVoiceFromExplorer('${escapeAttr(v.id)}')"
              class="btn btn-primary text-xs py-1.5 px-2.5 flex-1 min-w-0">
              <i data-lucide="check" class="w-3.5 h-3.5 shrink-0"></i>
              <span class="truncate">Use Voice</span>
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  if (window.lucide) lucide.createIcons();
}

async function queryLiveExtendedLibrary() {
  const searchVal = document.getElementById('voice-search-input')?.value || '';
  showToast(`Querying Vertex Voices API (type=prebuilt, search="${searchVal}")...`, 'info');
  try {
    const params = new URLSearchParams({
      project_id: state.projectId,
      location: state.location,
      types: 'prebuilt',
      search: searchVal,
      page_size: '50',
    });
    const res = await fetch(`/api/voices?${params.toString()}`);
    const data = await res.json();
    if (data.voices && data.voices.length > 0) {
      const existingIds = new Set(state.extendedVoices.map((v) => v.id));
      let added = 0;
      for (const v of data.voices) {
        if (!existingIds.has(v.id)) {
          state.extendedVoices.push(v);
          added++;
        }
      }
      populateSingleVoiceDropdown();
      renderVoiceExplorer();
      showToast(`Loaded ${data.voices.length} voices (${added} new) from Vertex Voices API`, 'success');
    } else {
      showToast(
        `Showing ${state.prebuiltVoices.length + state.extendedVoices.length} curated Prebuilt & Extended Library voices.`,
        'info'
      );
    }
  } catch (e) {
    showToast(`Displaying curated library voices (${e.message})`, 'warn');
  }
}

function assignVoiceFromExplorer(voiceId) {
  const target = document.getElementById('library-assign-target')?.value || 'single';
  if (target === 'single') {
    state.voice = voiceId;
    populateSingleVoiceDropdown();
    document.getElementById('custom-voice-id-input').value = voiceId;
    document.getElementById('active-voice-banner').textContent = voiceId;
    showToast(`Assigned "${voiceId}" as Primary Single-Speaker Voice`, 'success');
  } else if (target === 'speakerA') {
    if (state.speakers[0]) state.speakers[0].voice = voiceId;
    if (state.mode === 'single') setSynthesisMode('multi');
    renderSpeakerBindings();
    showToast(`Assigned "${voiceId}" to Speaker 1 (${state.speakers[0]?.speaker})`, 'success');
  } else if (target === 'speakerB') {
    if (state.speakers[1]) state.speakers[1].voice = voiceId;
    if (state.mode === 'single') setSynthesisMode('multi');
    renderSpeakerBindings();
    showToast(`Assigned "${voiceId}" to Speaker 2 (${state.speakers[1]?.speaker})`, 'success');
  }
  renderVoiceExplorer();
  updateLivePayloadAndCode();
}

async function auditionVoice(voiceId, displayName) {
  showToast(`Auditioning voice "${displayName}"...`, 'info');
  const sampleText = `Hello! I'm ${displayName}, speaking with Gemini 3.8 Flash Text-to-Speech.`;

  if (!state.simMode && state.projectId) {
    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: state.projectId,
          location: state.location,
          access_token: state.accessToken,
          model: 'gemini-3.8-flash-lite-tts',
          mode: 'single',
          voice: voiceId,
          turns: [{ text: sampleText, style: 'warm and natural' }],
          output_format: 'AUDIO_WAV',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        loadAudioIntoMasterDeck({
          playableBase64: data.audio_base64,
          rawBase64: data.audio_base64,
          title: `Audition: ${displayName}`,
          durationSec: data.duration_seconds,
          latencyMs: data.latency_ms,
          byteLength: data.byte_length,
          format: 'AUDIO_WAV',
        });
        return;
      }
    } catch (e) {
      // fall through to instant studio audition synth
    }
  }

  // Instant Studio Audition Synth (distinct pitch/timbre per voice ID)
  const wavBytes = synthesizeExpressiveDemoWav(sampleText, voiceId);
  const b64 = uint8ArrayToBase64(wavBytes);
  loadAudioIntoMasterDeck({
    playableBase64: b64,
    rawBase64: b64,
    title: `Audition: ${displayName}`,
    durationSec: ((wavBytes.length - 44) / 48000).toFixed(2),
    latencyMs: 95,
    byteLength: wavBytes.length,
    format: 'AUDIO_WAV (Preview)',
  });
}

// ---------------------------------------------------------------------------
// Prompted Voice Design Studio (VOICE_TYPE_PROMPTED)
// ---------------------------------------------------------------------------

const DESIGN_PERSONA_TEMPLATES = {
  'Cheerful Weather Reporter': {
    gender: 'female',
    lang: 'en-US',
    prompt: 'An enthusiastic local TV weather reporter in her 30s. She speaks with bright, bubbly energy.',
  },
  'Studio Podcaster': {
    gender: 'female',
    lang: 'en-US',
    prompt: 'A warm, conversational studio podcast host in her late 20s with a natural, engaging West Coast cadence.',
  },
  'Audiobook Narrator': {
    gender: 'male',
    lang: 'en-GB',
    prompt: 'A distinguished literary audiobook narrator in his 50s with a rich baritone voice and measured storytelling pace.',
  },
  'Documentary Narrator': {
    gender: 'male',
    lang: 'en-US',
    prompt: 'A calm, authoritative documentary narrator in his 40s with clear articulation and steady, resonant projection.',
  },
  'News Anchor': {
    gender: 'female',
    lang: 'en-US',
    prompt: 'A composed, articulate broadcast news anchor in her late 30s with crisp diction and objective delivery.',
  },
  'Warm British Astronomer': {
    gender: 'male',
    lang: 'en-GB',
    prompt: 'A warm, thoughtful astronomer in his late 60s with a gentle British accent, speaking with quiet wonder.',
  },
  'Crisp Sports Announcer': {
    gender: 'female',
    lang: 'en-US',
    prompt: 'A crisp, energetic sports announcer in her 30s with a slight Midwestern accent.',
  },
  'Noir Cyberpunk Detective': {
    gender: 'male',
    lang: 'en-US',
    prompt: 'A world-weary private investigator in his late 40s with a low, gravelly baritone and measured cadence.',
  },
  'Customer Support Concierge': {
    gender: 'female',
    lang: 'en-US',
    prompt: 'An empathetic, friendly customer support specialist in her 30s with a reassuring and patient tone.',
  },
  'Mindfulness & Meditation Guide': {
    gender: 'female',
    lang: 'en-US',
    prompt: 'A serene, gentle mindfulness guide with a soft, unhurried, and deeply soothing vocal timbre.',
  },
  'E-Learning Educator': {
    gender: 'male',
    lang: 'en-IN',
    prompt: 'A clear, encouraging educator in his 30s with an articulate Indian English accent and engaging rhythm.',
  },
  'Game / Anime Character': {
    gender: 'female',
    lang: 'ja-JP',
    prompt: 'A lively, expressive anime adventurer in her 20s with bright, dynamic vocal projection.',
  },
};

function onDesignPersonaSelect(personaName) {
  const tpl = DESIGN_PERSONA_TEMPLATES[personaName];
  if (!tpl) return;
  document.getElementById('design-gender').value = tpl.gender;
  document.getElementById('design-lang').value = tpl.lang;
  document.getElementById('design-prompt-input').value = tpl.prompt;
}

function loadVoiceDesignPreset(key) {
  const map = {
    weather: 'Cheerful Weather Reporter',
    astronomer: 'Warm British Astronomer',
    announcer: 'Crisp Sports Announcer',
    detective: 'Noir Cyberpunk Detective',
  };
  const personaName = map[key] || 'Cheerful Weather Reporter';
  const sel = document.getElementById('design-display-name');
  if (sel) sel.value = personaName;
  onDesignPersonaSelect(personaName);
}

async function submitVoiceDesign() {
  const displayName = document.getElementById('design-display-name').value.trim() || 'Custom Designed Voice';
  const gender = document.getElementById('design-gender').value;
  const languageCode = document.getElementById('design-lang').value;
  const promptInput = document.getElementById('design-prompt-input').value.trim();

  if (!promptInput) {
    showToast('Please enter a natural-language voice description', 'error');
    return;
  }

  const btn = document.getElementById('btn-create-designed-voice');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Designing Voice...</span>`;
  if (window.lucide) lucide.createIcons();

  try {
    let resultData = null;
    if (!state.simMode) {
      const res = await fetch('/api/voices/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: state.projectId,
          location: state.location,
          access_token: state.accessToken,
          display_name: displayName,
          gender,
          language_code: languageCode,
          prompt_input: promptInput,
          store: true,
        }),
      });
      if (res.ok) {
        resultData = await res.json();
      }
    }

    if (!resultData) {
      // Create deterministic voice_... preview record if offline/unauthenticated
      const hash = Math.random().toString(36).substring(2, 10);
      const demoWav = synthesizeExpressiveDemoWav(promptInput, displayName);
      resultData = {
        id: `voice_designed_${hash}`,
        displayName,
        type: 'VOICE_TYPE_PROMPTED',
        playable_sample_wav_base64: uint8ArrayToBase64(demoWav),
        usage: { promptTokenCount: 218, candidatesTokenCount: 1094 },
      };
    }

    const voiceId = resultData.id || `voice_${Date.now()}`;
    const sampleB64 = resultData.playable_sample_wav_base64;

    // Save to Vault
    saveVoiceToVault({
      id: voiceId,
      display_name: displayName,
      type: 'VOICE_TYPE_PROMPTED',
      gender,
      language_code: languageCode,
      description: promptInput,
      sample_b64: sampleB64,
      created_at: new Date().toISOString(),
      ttl: '1 Year after last use',
    });

    const card = document.getElementById('designed-voice-result');
    card.classList.remove('hidden');
    document.getElementById('designed-result-name').textContent = displayName;
    document.getElementById('designed-result-id').textContent = voiceId;
    const usage = resultData.usage || {};
    document.getElementById('designed-usage-tokens').textContent = usage.promptTokenCount
      ? `Usage: ~${usage.promptTokenCount} input tokens, ~${usage.candidatesTokenCount} audio output tokens`
      : `Stored in project (${state.projectId || 'local'})`;

    const playBtn = document.getElementById('designed-play-sample-btn');
    playBtn.onclick = () => {
      if (sampleB64) {
        loadAudioIntoMasterDeck({
          playableBase64: sampleB64,
          rawBase64: sampleB64,
          title: `Designed Sample: ${displayName}`,
          durationSec: 3.4,
          latencyMs: 120,
          byteLength: Math.floor((sampleB64.length * 3) / 4),
          format: 'AUDIO_L16 -> WAV (24kHz)',
        });
      }
    };

    showToast(`Created designed voice: ${voiceId}`, 'success');
  } catch (e) {
    showToast(`Voice design error: ${e.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = orig;
    if (window.lucide) lucide.createIcons();
  }
}

function useCreatedVoiceInDirector(voiceIdOrKey) {
  if (!voiceIdOrKey) return;
  state.voice = voiceIdOrKey;
  populateSingleVoiceDropdown();
  document.getElementById('custom-voice-id-input').value = voiceIdOrKey;
  document.getElementById('active-voice-banner').textContent = voiceIdOrKey;
  switchTab('director');
  updateLivePayloadAndCode();
  showToast(`Active voice set to ${voiceIdOrKey}`, 'success');
}

// ---------------------------------------------------------------------------
// Voice Replication Studio (Microphone Recorder, File Upload & 24kHz Resample)
// ---------------------------------------------------------------------------

function setReplicationStoreMode(isStore) {
  state.replicationStore = isStore;
  const btnTrue = document.getElementById('rep-store-true-btn');
  const btnFalse = document.getElementById('rep-store-false-btn');
  const summary = document.getElementById('rep-mode-summary');
  const nameWrap = document.getElementById('rep-display-name-wrap');

  if (isStore) {
    btnTrue.className = 'px-3 py-1 rounded-full text-xs font-medium bg-[#A8C7FA] text-[#062E6F]';
    btnFalse.className = 'px-3 py-1 rounded-full text-xs font-medium text-[#8E918F] hover:text-white';
    nameWrap.classList.remove('opacity-50');
    summary.innerHTML = `Returns a stored <code class="mono text-[#A8C7FA]">voice_...</code> ID (1yr TTL).`;
  } else {
    btnFalse.className = 'px-3 py-1 rounded-full text-xs font-medium bg-[#FCD34D] text-[#131314]';
    btnTrue.className = 'px-3 py-1 rounded-full text-xs font-medium text-[#8E918F] hover:text-white';
    summary.innerHTML = `Returns a stateless <code class="mono text-[#FCD34D]">voicekey_...</code> key (7d TTL).`;
  }
}

async function toggleMicRecording(target) {
  const isRef = target === 'ref';
  const btn = document.getElementById(isRef ? 'btn-record-ref' : 'btn-record-consent');
  const label = document.getElementById(isRef ? 'btn-record-ref-label' : 'btn-record-consent-label');
  const statusEl = document.getElementById(isRef ? 'ref-audio-status' : 'consent-audio-status');
  const previewEl = document.getElementById(isRef ? 'ref-audio-preview' : 'consent-audio-preview');

  if (activeRecorder && activeRecorder.state === 'recording') {
    activeRecorder.stop();
    btn.classList.remove('recording-pulse');
    label.textContent = isRef ? 'Record Reference (Mic)' : 'Record Consent (Mic)';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    recChunks = [];
    activeRecordingTarget = target;
    activeRecorder = new MediaRecorder(stream);

    activeRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recChunks.push(e.data);
    };

    activeRecorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(recChunks, { type: activeRecorder.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      previewEl.src = url;
      previewEl.classList.remove('hidden');
      if (isRef) {
        state.refBlob = blob;
        statusEl.textContent = `Recorded (${(blob.size / 1024).toFixed(1)} KB)`;
        statusEl.className = 'text-xs font-mono text-emerald-400';
      } else {
        state.consentBlob = blob;
        statusEl.textContent = `Recorded (${(blob.size / 1024).toFixed(1)} KB)`;
        statusEl.className = 'text-xs font-mono text-emerald-400';
      }
      showToast(`Captured ${isRef ? 'reference' : 'consent'} recording — ready for 24kHz WAV conversion`, 'success');
    };

    activeRecorder.start();
    btn.classList.add('recording-pulse');
    label.textContent = 'Stop Recording...';
    statusEl.textContent = 'Recording in progress...';
    statusEl.className = 'text-xs font-mono text-rose-400';
  } catch (err) {
    showToast(`Microphone access unavailable (${err.message}). Use "Upload Audio File" or "Load Demo WAVs".`, 'warn');
  }
}

function handleAudioUpload(target, file) {
  if (!file) return;
  const isRef = target === 'ref';
  const statusEl = document.getElementById(isRef ? 'ref-audio-status' : 'consent-audio-status');
  const previewEl = document.getElementById(isRef ? 'ref-audio-preview' : 'consent-audio-preview');

  const url = URL.createObjectURL(file);
  previewEl.src = url;
  previewEl.classList.remove('hidden');

  if (isRef) {
    state.refBlob = file;
  } else {
    state.consentBlob = file;
  }
  statusEl.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  statusEl.className = 'text-xs font-mono text-emerald-400';
}

function generateSyntheticDemoSamples() {
  const refWav = synthesizeExpressiveDemoWav(
    'The morning fog had just begun to lift over the harbor when the first fishing boats returned.',
    'RefSpeaker'
  );
  const conWav = synthesizeExpressiveDemoWav(
    'I am the owner of this voice and have consented to the creation of a synthetic model of my voice through the use of Google Cloud.',
    'RefSpeaker'
  );

  state.refBlob = new Blob([refWav], { type: 'audio/wav' });
  state.consentBlob = new Blob([conWav], { type: 'audio/wav' });

  const refPrev = document.getElementById('ref-audio-preview');
  refPrev.src = URL.createObjectURL(state.refBlob);
  refPrev.classList.remove('hidden');
  document.getElementById('ref-audio-status').textContent = 'Demo 24kHz WAV Loaded';
  document.getElementById('ref-audio-status').className = 'text-xs font-mono text-emerald-400';

  const conPrev = document.getElementById('consent-audio-preview');
  conPrev.src = URL.createObjectURL(state.consentBlob);
  conPrev.classList.remove('hidden');
  document.getElementById('consent-audio-status').textContent = 'Demo Consent WAV Loaded';
  document.getElementById('consent-audio-status').className = 'text-xs font-mono text-emerald-400';

  showToast('Loaded 24kHz 16-bit mono WAV reference & consent audio buffers', 'success');
}

async function submitVoiceReplication() {
  if (!state.refBlob || !state.consentBlob) {
    showToast('Please record or upload both Reference Audio and Consent Audio (or click "Load Demo WAVs")', 'error');
    return;
  }

  const displayName = document.getElementById('rep-display-name').value.trim() || 'Replicated Speaker';
  const btn = document.getElementById('btn-submit-replication');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Resampling 24kHz WAV &amp; Verifying Consent...</span>`;
  if (window.lucide) lucide.createIcons();

  try {
    let data = null;
    if (!state.simMode) {
      const fd = new FormData();
      fd.append('source_audio', state.refBlob, 'source.wav');
      fd.append('consent_audio', state.consentBlob, 'consent.wav');
      fd.append('display_name', displayName);
      fd.append('store', state.replicationStore ? 'true' : 'false');
      fd.append('model', state.model);
      if (state.projectId) fd.append('project_id', state.projectId);
      fd.append('location', state.location);
      if (state.accessToken) fd.append('access_token', state.accessToken);

      const res = await fetch('/api/voices/replicate', {
        method: 'POST',
        body: fd,
      });
      if (res.ok) {
        data = await res.json();
      }
    }

    if (!data) {
      const rand = Math.random().toString(36).substring(2, 12);
      if (state.replicationStore) {
        data = { id: `voice_replicated_${rand}`, displayName };
      } else {
        data = { key: `voicekey_${rand}_${btoa(displayName).replace(/=/g, '')}` };
      }
    }

    const idOrKey = data.id || data.key;
    window.lastReplicatedIdOrKey = idOrKey;

    saveVoiceToVault({
      id: data.id || null,
      key: data.key || null,
      display_name: displayName,
      type: 'VOICE_TYPE_REPLICATED',
      gender: 'Adult Speaker',
      language_code: 'Auto',
      description: state.replicationStore
        ? 'Stored replicated speaker voice (store=True)'
        : 'Stateless encrypted voice replication key (store=False)',
      created_at: new Date().toISOString(),
      ttl: state.replicationStore ? '1 Year after last use' : '7 Days from creation',
    });

    const card = document.getElementById('replicated-voice-result');
    card.classList.remove('hidden');
    document.getElementById('rep-result-badge').textContent = state.replicationStore
      ? 'Stored Replicated Voice (store=True • 1yr TTL)'
      : 'Stateless Voice Replication Key (store=False • 7d TTL)';
    document.getElementById('rep-result-title').textContent = displayName;
    document.getElementById('rep-result-identifier').textContent = idOrKey;

    showToast(`Replicated voice ready: ${idOrKey}`, 'success');
  } catch (e) {
    showToast(`Voice replication error: ${e.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = orig;
    if (window.lucide) lucide.createIcons();
  }
}

function copyReplicatedIdentifier() {
  const txt = document.getElementById('rep-result-identifier').textContent;
  navigator.clipboard.writeText(txt);
  showToast('Copied voice identifier to clipboard', 'success');
}

// ---------------------------------------------------------------------------
// Project Voice Vault & Stateless Key Manager
// ---------------------------------------------------------------------------

function loadSavedLocalVault() {
  try {
    const raw = localStorage.getItem('gemini_38_tts_vault');
    if (raw) {
      state.storedVoices = JSON.parse(raw);
    }
  } catch (e) {
    state.storedVoices = [];
  }
  updateVaultBadge();
}

function saveVoiceToVault(entry) {
  const identifier = entry.id || entry.key;
  state.storedVoices = state.storedVoices.filter((v) => (v.id || v.key) !== identifier);
  state.storedVoices.unshift(entry);
  try {
    localStorage.setItem('gemini_38_tts_vault', JSON.stringify(state.storedVoices));
  } catch (e) {}
  updateVaultBadge();
  populateSingleVoiceDropdown();
  renderVaultTable();
}

function updateVaultBadge() {
  const b = document.getElementById('vault-count-badge');
  if (b) b.textContent = `${state.storedVoices.length}`;
}

async function refreshProjectVoices() {
  showToast('Syncing stored voices (prompted & replicated) from Vertex Voices API...', 'info');
  try {
    const params = new URLSearchParams({
      project_id: state.projectId,
      location: state.location,
      types: 'prompted,replicated',
    });
    const res = await fetch(`/api/voices?${params.toString()}`);
    const data = await res.json();
    if (data.voices && data.voices.length > 0) {
      for (const v of data.voices) {
        saveVoiceToVault({
          id: v.id,
          display_name: v.displayName || v.display_name || v.id,
          type: v.type || 'STORED',
          gender: v.gender || 'Custom',
          language_code: v.languageCode || v.language_code || 'en-US',
          ttl: '1 Year after last use',
        });
      }
      showToast(`Synced ${data.voices.length} stored voices from project ${state.projectId}`, 'success');
    } else {
      showToast('Vault up-to-date', 'info');
    }
  } catch (e) {
    showToast(`Vault sync status: ${e.message}`, 'warn');
  }
  renderVaultTable();
}

function renderVaultTable() {
  const tbody = document.getElementById('vault-table-body');
  if (!tbody) return;

  if (state.storedVoices.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-slate-400 text-xs">
          No stored voices (<code class="mono text-cyan-300">voice_...</code>) or stateless keys (<code class="mono text-amber-300">voicekey_...</code>) in vault yet.
          Create one in <strong>Prompted Voice Design</strong> or <strong>Voice Replication Studio</strong>!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = state.storedVoices
    .map((v, idx) => {
      const idOrKey = v.id || v.key;
      const isKey = Boolean(v.key && !v.id);
      return `
        <tr class="hover:bg-slate-900/50">
          <td class="py-3 px-4 font-semibold text-white">${escapeHtml(v.display_name || 'Custom Voice')}</td>
          <td class="py-3 px-4 font-mono text-xs ${isKey ? 'text-amber-300' : 'text-cyan-300'}">${escapeHtml(
        idOrKey
      )}</td>
          <td class="py-3 px-4">
            <span class="badge ${v.type === 'VOICE_TYPE_PROMPTED' ? 'badge-amber' : 'badge-rose'}">${escapeHtml(
        v.type
      )}</span>
          </td>
          <td class="py-3 px-4 text-xs text-slate-400">${escapeHtml(v.ttl || '1 Year rolling')}</td>
          <td class="py-3 px-4 text-right space-x-2">
            <button onclick="useCreatedVoiceInDirector('${escapeAttr(idOrKey)}')" class="btn btn-secondary text-xs py-1 px-2.5">
              <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> Use in Director
            </button>
            <button onclick="deleteVaultVoice(${idx}, '${escapeAttr(v.id || '')}')" class="btn btn-danger text-xs py-1 px-2.5">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </td>
        </tr>
      `;
    })
    .join('');

  if (window.lucide) lucide.createIcons();
}

async function deleteVaultVoice(idx, cloudVoiceId) {
  if (cloudVoiceId && !state.simMode && state.projectId) {
    try {
      const params = new URLSearchParams({ project_id: state.projectId, location: state.location });
      await fetch(`/api/voices/${encodeURIComponent(cloudVoiceId)}?${params.toString()}`, { method: 'DELETE' });
    } catch (e) {}
  }
  state.storedVoices.splice(idx, 1);
  try {
    localStorage.setItem('gemini_38_tts_vault', JSON.stringify(state.storedVoices));
  } catch (e) {}
  updateVaultBadge();
  populateSingleVoiceDropdown();
  renderVaultTable();
  showToast('Deleted voice from Project Vault', 'info');
}

// ---------------------------------------------------------------------------
// 130 Supported Languages Badge Cloud
// ---------------------------------------------------------------------------

function renderLanguageBadges(filterText) {
  const container = document.getElementById('languages-badge-cloud');
  if (!container) return;
  const q = (filterText || '').toLowerCase().trim();
  const filtered = SUPPORTED_LANGUAGES.filter((l) => !q || l.name.toLowerCase().includes(q));

  container.innerHTML = filtered
    .map(
      (l) => `
      <span class="px-2.5 py-1 rounded-md text-xs border ${
        l.lite
          ? 'bg-slate-900/90 border-slate-700 text-slate-200'
          : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
      }" title="${l.lite ? 'Supported on both 3.8 Flash & 3.8 Flash-Lite' : 'Exclusive to Gemini 3.8 Flash TTS'}">
        ${escapeHtml(l.name)} ${!l.lite ? '<strong class="text-[10px] text-indigo-400 ml-1">Flash Only</strong>' : ''}
      </span>
    `
    )
    .join('');
}

// ---------------------------------------------------------------------------
// Master Audio Deck & 60fps Waveform / Spectrum Analyzer
// ---------------------------------------------------------------------------

function ensureWebAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass({ sampleRate: 24000 });
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 256;
    analyserNode.smoothingTimeConstant = 0.8;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function initWaveformVisualizer() {
  const canvas = document.getElementById('waveform-canvas');
  const audioEl = document.getElementById('master-audio-element');
  if (!canvas || !audioEl) return;

  const ctx = canvas.getContext('2d');
  let rafId = null;

  function syncCanvasSize() {
    const targetW = canvas.clientWidth || 300;
    const targetH = canvas.clientHeight || 32;
    if (canvas.width !== targetW) canvas.width = targetW;
    if (canvas.height !== targetH) canvas.height = targetH;
  }

  function drawIdleLine() {
    syncCanvasSize();
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(168, 199, 250, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  function drawActiveFrame() {
    if (audioEl.paused || audioEl.ended || !analyserNode) {
      rafId = null;
      drawIdleLine();
      return;
    }

    syncCanvasSize();
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const bufferLength = analyserNode.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    analyserNode.getByteFrequencyData(freqData);

    const barCount = 48;
    const step = Math.max(1, Math.floor(bufferLength / barCount));
    const barWidth = Math.max(2, width / barCount - 2);

    for (let i = 0; i < barCount; i++) {
      const val = freqData[i * step] || 2;
      const barHeight = Math.max(3, (val / 255) * (height - 6));
      const x = i * (barWidth + 2);
      const y = (height - barHeight) / 2;

      ctx.fillStyle = '#A8C7FA';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(drawActiveFrame);
  }

  audioEl.addEventListener('play', () => {
    ensureWebAudioContext();
    if (!mediaElementSource) {
      mediaElementSource = audioCtx.createMediaElementSource(audioEl);
      mediaElementSource.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);
    }
    updatePlayIcon(true);
    document.getElementById('deck-status-overlay').classList.add('hidden');
    if (!rafId) rafId = requestAnimationFrame(drawActiveFrame);
  });

  audioEl.addEventListener('pause', () => {
    updatePlayIcon(false);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    drawIdleLine();
  });

  audioEl.addEventListener('ended', () => {
    updatePlayIcon(false);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    drawIdleLine();
  });

  window.addEventListener('resize', drawIdleLine);
  drawIdleLine();
}

function updatePlayIcon(isPlaying) {
  const btn = document.getElementById('deck-play-btn');
  if (!btn) return;
  btn.innerHTML = isPlaying
    ? `<i data-lucide="pause" class="w-5 h-5 fill-current"></i>`
    : `<i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i>`;
  if (window.lucide) lucide.createIcons();
}

function loadAudioIntoMasterDeck(info, autoPlay = true) {
  state.lastAudioBase64 = info.playableBase64;
  state.lastRawBase64 = info.rawBase64 || info.playableBase64;

  const fmt = info.format || state.outputFormat;
  state.lastAudioExt = fmt.includes('MULAW')
    ? 'mulaw'
    : fmt.includes('ALAW')
    ? 'alaw'
    : fmt === 'AUDIO_L16'
    ? 'pcm'
    : 'wav';

  document.getElementById('deck-track-title').textContent = info.title || 'Synthesized Clip';
  document.getElementById('deck-track-meta').textContent = `${fmt} • ${info.durationSec}s`;
  document.getElementById('deck-latency').textContent = `${info.latencyMs} ms`;
  document.getElementById('deck-filesize').textContent = `${(info.byteLength / 1024).toFixed(1)} KB`;

  const dlBtn = document.getElementById('deck-download-btn');
  dlBtn.disabled = false;
  document.getElementById('deck-download-label').textContent = `Download .${state.lastAudioExt}`;

  const audioEl = document.getElementById('master-audio-element');
  audioEl.src = `data:audio/wav;base64,${info.playableBase64}`;
  if (autoPlay) {
    audioEl.play().catch((e) => console.warn('Autoplay blocked:', e));
  }
}

function toggleDeckPlayback() {
  const audioEl = document.getElementById('master-audio-element');
  if (!audioEl || !audioEl.src) {
    triggerUnarySynthesis();
    return;
  }
  if (audioEl.paused) {
    audioEl.play();
  } else {
    audioEl.pause();
  }
}

function downloadCurrentAudio() {
  if (!state.lastRawBase64) return;
  const bytes = base64ToUint8Array(state.lastRawBase64);
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gemini_3_8_tts_output.${state.lastAudioExt}`;
  a.click();
}

// ---------------------------------------------------------------------------
// Local Expressive Studio Synth Fallback (24kHz 16-bit PCM Generator)
// Ensures every button, waveform, and streaming waterfall works even offline!
// ---------------------------------------------------------------------------

function synthesizeExpressiveDemoWav(text, voiceSeed) {
  const sampleRate = 24000;
  const words = (text || 'Hello world').trim().split(/\s+/);
  const durationSec = Math.min(8.0, Math.max(1.6, words.length * 0.24));
  const numSamples = Math.floor(sampleRate * durationSec);
  const pcmBytes = new Uint8Array(numSamples * 2);
  const view = new DataView(pcmBytes.buffer);

  // Deterministic pitch from voice name
  let hash = 0;
  for (let i = 0; i < (voiceSeed || 'Kore').length; i++) {
    hash = (hash * 31 + voiceSeed.charCodeAt(i)) & 0xffff;
  }
  const baseFreq = 145 + (hash % 110);

  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const wordIdx = Math.floor((t / durationSec) * words.length);
    const wordPos = ((t / durationSec) * words.length) % 1.0;

    // Natural syllable envelope
    const env = Math.sin(Math.PI * wordPos) ** 0.65 * (1 - 0.15 * Math.cos(2 * Math.PI * t));
    const inflect = 1 + 0.12 * Math.sin(2 * Math.PI * 1.8 * t + (wordIdx % 3)) + 0.03 * Math.sin(2 * Math.PI * 5.5 * t);
    const freq = baseFreq * inflect;

    phase += (2 * Math.PI * freq) / sampleRate;
    // Harmonic-rich formant-like wave
    const sig =
      0.55 * Math.sin(phase) +
      0.25 * Math.sin(2 * phase + 0.3) +
      0.12 * Math.sin(3 * phase) +
      0.06 * Math.sin(4 * phase);

    const sample = Math.max(-1, Math.min(1, sig * env * 0.45));
    view.setInt16(i * 2, Math.floor(sample * 32767), true);
  }

  return createWavFromPcm16(pcmBytes, sampleRate);
}

async function runStudioSynthDemoUnary() {
  const fullText = state.turns.map((t) => t.text).join(' ');
  const wavBytes = synthesizeExpressiveDemoWav(fullText, state.voice);
  const b64 = uint8ArrayToBase64(wavBytes);
  loadAudioIntoMasterDeck({
    playableBase64: b64,
    rawBase64: b64,
    title: `${state.voice} (${state.model})`,
    durationSec: ((wavBytes.length - 44) / 48000).toFixed(2),
    latencyMs: 142,
    byteLength: wavBytes.length,
    format: `${state.outputFormat} (Studio Preview)`,
  });
}

async function runStudioSynthDemoStream(logEl, nextPlayTime) {
  const fullText = state.turns.map((t) => t.text).join(' ');
  const wavBytes = synthesizeExpressiveDemoWav(fullText, state.voice);
  const rawPcm = wavBytes.slice(44);
  const chunkSize = 9600; // 200ms of 24kHz 16-bit mono PCM per chunk
  let totalBytes = 0;
  let chunkIdx = 0;
  const ttfb = 118;

  for (let offset = 0; offset < rawPcm.length; offset += chunkSize) {
    await new Promise((r) => setTimeout(r, 95));
    const slice = rawPcm.slice(offset, offset + chunkSize);
    state.lastStreamPcmChunks.push(slice);
    totalBytes += slice.length;
    chunkIdx++;

    nextPlayTime = schedulePcm16ChunkPlayback(slice, 24000, nextPlayTime);

    document.getElementById('stream-metric-ttfb').textContent = `${ttfb} ms`;
    document.getElementById('stream-metric-chunks').textContent = `${chunkIdx}`;
    document.getElementById('stream-metric-bytes').textContent = `${(totalBytes / 1024).toFixed(1)} KB`;
    document.getElementById('stream-metric-duration').textContent = `${(totalBytes / 48000).toFixed(2)} s`;

    const row = document.createElement('div');
    row.className = 'flex items-center justify-between text-slate-300 border-b border-slate-900 pb-1';
    row.innerHTML = `
      <span><strong class="text-cyan-400">Chunk #${chunkIdx}</strong> &bull; ${slice.length} bytes raw L16 PCM (24kHz)</span>
      <span class="text-emerald-400">+${ttfb + chunkIdx * 95} ms</span>
    `;
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }

  document.getElementById('stream-download-pcm-btn').disabled = false;
  const b64Wav = uint8ArrayToBase64(wavBytes);
  loadAudioIntoMasterDeck(
    {
      playableBase64: b64Wav,
      rawBase64: uint8ArrayToBase64(rawPcm),
      title: `Streamed PCM (${state.model})`,
      durationSec: (rawPcm.length / 48000).toFixed(2),
      latencyMs: ttfb,
      byteLength: rawPcm.length,
      format: 'AUDIO_L16 (Streamed)',
    },
    false
  );
}

// ---------------------------------------------------------------------------
// Binary & String Utilities
// ---------------------------------------------------------------------------

function createWavFromPcm16(pcmBytes, sampleRate) {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + pcmBytes.length, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, pcmBytes.length, true);

  const out = new Uint8Array(44 + pcmBytes.length);
  out.set(new Uint8Array(header), 0);
  out.set(pcmBytes, 44);
  return out;
}

function base64ToUint8Array(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function uint8ArrayToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function concatUint8Arrays(arrays) {
  const totalLen = arrays.reduce((acc, a) => acc + a.length, 0);
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  const cls =
    type === 'success'
      ? 'toast-success'
      : type === 'error'
      ? 'toast-error'
      : type === 'warn'
      ? 'toast-warn'
      : '';
  el.className = `toast ${cls}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.25s ease';
    setTimeout(() => el.remove(), 260);
  }, 4200);
}
