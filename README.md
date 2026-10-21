# Gemini 3.8 Flash TTS — Enterprise Voice Studio (Vertex AI)

A full-featured, studio-grade Web UI & FastAPI backend for **Gemini 3.8 Flash TTS** (`gemini-3.8-flash-tts`) and **Gemini 3.8 Flash-Lite TTS** (`gemini-3.8-flash-lite-tts`) on Google Cloud Vertex AI / Gemini platform.

## Supported Capabilities

1. **Dual Model Tier Switcher**:
   - **Gemini 3.8 Flash TTS (`gemini-3.8-flash-tts`)**: Studio-grade acoustic fidelity, nuanced acting, frequent vocal-burst tags, overlapping backchannels, and **130 auto-detected languages**.
   - **Gemini 3.8 Flash-Lite TTS (`gemini-3.8-flash-lite-tts`)**: Low-latency, cost-efficient production synthesis across **101 languages**.
2. **Speech Director & Multi-Speaker Dialogue Composer**:
   - **Single-Speaker Mode**: Turn-level `speech_metadata.style` + point-in-time inline vocal tags (`<sigh>`, `<laugh>`, `<short pause>`, `<whispers>`, etc.).
   - **Native 2-Speaker Dialogue (`multiSpeakerVoiceConfig`)**: Assign any voice to 2 speakers, with support for inline listener backchannels and overlapping speech (`|oh really?|`, `|absolutely|`).
   - **Multi-Cast L16 Stitch Pipeline (3+ Speakers)**: Synthesizes each speaker's turn in headerless `AUDIO_L16` (24kHz) and concatenates them into a single master WAV.
   - **Real-time Prompting Lint Guardrails**: Alerts creators if stage directions are accidentally placed inside verbatim transcripts or if drift-inducing meta-instructions are used.
3. **Real-Time Low-Latency Streaming Lab (`streamGenerateContent?alt=sse`)**:
   - Streams headerless 16-bit signed little-endian PCM chunks (`audio/l16` at 24 kHz mono) over Server-Sent Events (SSE) and schedules gapless Web Audio API playback with live TTFB, chunk waterfall, and raw `.pcm` export.
4. **Voice Explorer (30 Prebuilt Voices + 2,000+ Extended Voice Library)**:
   - Browse and audition all 30 official prebuilt voices (`Achernar` through `Zubenelgenubi`) and search the live Vertex `v1beta1/voices` Extended Voice Library (`type=prebuilt`, `search=...`).
5. **Prompted Voice Design Studio (`VOICE_TYPE_PROMPTED`)**:
   - Create persistent custom character voices from natural-language descriptions (`store=True`), play the generated 24kHz `sample_audio`, and use the returned `voice_...` ID immediately.
6. **Voice Replication Studio (`VOICE_TYPE_REPLICATED`)**:
   - Record Reference Audio (`source_audio`, 10–30s) and Verbatim Speaker Consent Audio (`consent_audio`, with 70+ official BCP-47 language consent statements) directly from your browser microphone or upload audio files.
   - Automatically resamples recordings via `ffmpeg` to **24 kHz, mono, 16-bit PCM WAV**.
   - Supports both **Stored Replicated Voices (`store=True` -> `voice_...`, 1-year rolling TTL)** and **Stateless Voice Replication Keys (`store=False` -> `voicekey_...`, 7-day TTL)**.
7. **Output Audio Encodings (`responseFormat`)**:
   - `AUDIO_WAV` (24 kHz, 16-bit PCM WAV with RIFF header)
   - `AUDIO_L16` (24 kHz, headerless raw 16-bit PCM)
   - `AUDIO_MULAW` (8 kHz, G.711 μ-law telephony)
   - `AUDIO_ALAW` (8 kHz, G.711 A-law telephony)

## Quick Start (Local)

```bash
# Authenticate with Google Cloud
gcloud auth application-default login

# Start the Voice Studio server
python3 server.py
```

Open `http://localhost:8000` in your browser.

## Deploy to Google Cloud Run (Vertex AI Integration)

```bash
# Deploy using the automated script (auto-detects your ADC quota project or gcloud project)
./deploy.sh

# Or specify Project ID, Region, and Service Name explicitly:
./deploy.sh llm-project-52521 us-central1 gemini-voice-studio
```
