import base64
import io
import json
import os
import subprocess
import time
import wave
from typing import Any, Dict, List, Optional

import google.auth
import google.auth.transport.requests
import httpx
from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

app = FastAPI(
    title="Gemini 3.8 Flash TTS Voice Studio",
    description="Enterprise Voice Studio for Gemini 3.8 Flash TTS & Flash-Lite TTS on Vertex AI / Gemini Enterprise Agent Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Reference Data: 30 Prebuilt Voices, Consent Statements, Vocal Tags, Languages
# ---------------------------------------------------------------------------

PREBUILT_VOICES = [
    {"id": "Achernar", "display_name": "Achernar", "trait": "Soft", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Gentle Narrator", "description": "Soft, intimate, and soothing vocal timbre suited for calm narration and mindfulness."},
    {"id": "Achird", "display_name": "Achird", "trait": "Friendly", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Conversational Host", "description": "Warm, approachable, and friendly voice ideal for customer support and explainers."},
    {"id": "Algenib", "display_name": "Algenib", "trait": "Gravelly", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Character / Trailer", "description": "Deep, gravelly texture with strong presence for dramatic storytelling and game characters."},
    {"id": "Algieba", "display_name": "Algieba", "trait": "Smooth", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Audiobook Narrator", "description": "Velvety, smooth delivery that flows effortlessly across long-form reading."},
    {"id": "Alnilam", "display_name": "Alnilam", "trait": "Firm", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Executive / News", "description": "Authoritative, grounded, and firm vocal projection for news and enterprise announcements."},
    {"id": "Aoede", "display_name": "Aoede", "trait": "Breezy", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Lifestyle & Podcast", "description": "Light, breezy, and natural conversational cadence with effortless charm."},
    {"id": "Autonoe", "display_name": "Autonoe", "trait": "Bright", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "E-Learning & Commercial", "description": "Crisp, bright, and articulate delivery that keeps listeners engaged."},
    {"id": "Callirrhoe", "display_name": "Callirrhoe", "trait": "Easy-going", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Casual Co-host", "description": "Relaxed, easy-going, and unhurried conversational voice."},
    {"id": "Charon", "display_name": "Charon", "trait": "Informative", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Documentary / Guide", "description": "Clear, measured, and informative voice tailored for documentaries and technical guides."},
    {"id": "Despina", "display_name": "Despina", "trait": "Smooth", "gender": "Female", "language_code": "en-US", "accent": "Multilingual", "persona": "Luxury & Editorial", "description": "Polished, smooth, and expressive voice that excels across multiple languages."},
    {"id": "Enceladus", "display_name": "Enceladus", "trait": "Breathy", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Cinematic / Intimate", "description": "Soft, breathy nuance for emotional scenes and reflective monologues."},
    {"id": "Erinome", "display_name": "Erinome", "trait": "Clear", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Voice Assistant", "description": "Crystal-clear diction and balanced prosody for interactive voice agents."},
    {"id": "Fenrir", "display_name": "Fenrir", "trait": "Excitable", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Dynamic Creator", "description": "High-energy, expressive, and excitable voice great for upbeat promos and dialogue."},
    {"id": "Gacrux", "display_name": "Gacrux", "trait": "Mature", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Seasoned Storyteller", "description": "Rich, mature resonance with wisdom and steady pacing."},
    {"id": "Iapetus", "display_name": "Iapetus", "trait": "Clear", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Instructional / IVR", "description": "Clean, neutral, and highly intelligible articulation."},
    {"id": "Kore", "display_name": "Kore", "trait": "Firm", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Flagship Assistant", "description": "Confident, composed, and responsive voice widely used for flagship agent experiences."},
    {"id": "Laomedeia", "display_name": "Laomedeia", "trait": "Upbeat", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Morning Show Host", "description": "Cheerful, upbeat, and radiant delivery with natural smile in the voice."},
    {"id": "Leda", "display_name": "Leda", "trait": "Youthful", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Young Adult / Podcast", "description": "Fresh, youthful, and relatable voice for modern dialogue and storytelling."},
    {"id": "Orus", "display_name": "Orus", "trait": "Firm", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Anchor / Narrator", "description": "Solid, dependable baritone with decisive inflection."},
    {"id": "Puck", "display_name": "Puck", "trait": "Upbeat", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Playful Companion", "description": "Lively, quick-witted, and upbeat tone perfect for banter and interactive agents."},
    {"id": "Pulcherrima", "display_name": "Pulcherrima", "trait": "Forward", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Stage / Broadcast", "description": "Bright, forward-placed vocal projection that cuts through any mix."},
    {"id": "Rasalgethi", "display_name": "Rasalgethi", "trait": "Informative", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Analyst / Educator", "description": "Articulate, thoughtful, and informative delivery for complex topics."},
    {"id": "Sadachbia", "display_name": "Sadachbia", "trait": "Lively", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Show Host", "description": "Animated, lively, and engaging voice with rich pitch variation."},
    {"id": "Sadaltager", "display_name": "Sadaltager", "trait": "Knowledgeable", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Professor / Mentor", "description": "Warm, knowledgeable, and reassuring tone for tutorials and podcasts."},
    {"id": "Schedar", "display_name": "Schedar", "trait": "Even", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Newsreader", "description": "Balanced, even-tempered, and steady cadence for objective narration."},
    {"id": "Sulafat", "display_name": "Sulafat", "trait": "Warm", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Empathic Guide", "description": "Deeply warm, comforting, and inviting vocal quality."},
    {"id": "Umbriel", "display_name": "Umbriel", "trait": "Easy-going", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Conversational Peer", "description": "Laid-back, natural, and unforced conversational delivery."},
    {"id": "Vindemiatrix", "display_name": "Vindemiatrix", "trait": "Gentle", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Storybook / Calm", "description": "Tender, gentle, and nuanced voice for bedtime stories and soft dialogue."},
    {"id": "Zephyr", "display_name": "Zephyr", "trait": "Bright", "gender": "Female", "language_code": "en-US", "accent": "American", "persona": "Modern Assistant", "description": "Sparkling, bright, and agile voice for fast-paced interactions."},
    {"id": "Zubenelgenubi", "display_name": "Zubenelgenubi", "trait": "Casual", "gender": "Male", "language_code": "en-US", "accent": "American", "persona": "Everyday Speaker", "description": "Spontaneous, casual, and authentic everyday speaking style."},
]

EXTENDED_LIBRARY_CURATED = [
    {"id": "en-US-studio-podcaster-f1", "display_name": "Maya (Studio Podcaster)", "type": "prebuilt", "language_code": "en-US", "accent": "American (West Coast)", "gender": "Female", "pitch": "Medium", "persona": "Podcaster", "description": "Warm, conversational studio podcast host with natural vocal fry and engaging rhythm."},
    {"id": "en-GB-narrator-classic-m1", "display_name": "Arthur (British Audiobook)", "type": "prebuilt", "language_code": "en-GB", "accent": "British (RP)", "gender": "Male", "pitch": "Low", "persona": "Narrator", "description": "Distinguished British literary narrator with rich baritone resonance and theatrical nuance."},
    {"id": "en-AU-conversational-f2", "display_name": "Chloe (Sydney Conversational)", "type_label": "Library", "type": "prebuilt", "language_code": "en-AU", "accent": "Australian", "gender": "Female", "pitch": "Medium-High", "persona": "Conversational Agent", "description": "Bright, friendly Australian voice ideal for travel, hospitality, and interactive assistants."},
    {"id": "es-MX-storyteller-m1", "display_name": "Mateo (Relator Latino)", "type": "prebuilt", "language_code": "es-MX", "accent": "Mexican Spanish", "gender": "Male", "pitch": "Medium", "persona": "Audiobook / Storyteller", "description": "Expressive Mexican Spanish narrator with warm emotional range."},
    {"id": "fr-FR-editorial-f1", "display_name": "Camille (Parisian Editorial)", "type": "prebuilt", "language_code": "fr-FR", "accent": "Parisian French", "gender": "Female", "pitch": "Medium", "persona": "Editorial / Documentary", "description": "Refined, articulate French voice for culture, fashion, and documentary narration."},
    {"id": "de-DE-news-m2", "display_name": "Lukas (Broadcast Anchor)", "type": "prebuilt", "language_code": "de-DE", "accent": "Standard German", "gender": "Male", "pitch": "Medium-Low", "persona": "News / Enterprise", "description": "Crisp, authoritative German broadcast voice with rock-solid pacing."},
    {"id": "ja-JP-anime-f1", "display_name": "Haruka (Expressive Character)", "type": "prebuilt", "language_code": "ja-JP", "accent": "Tokyo Japanese", "gender": "Female", "pitch": "High", "persona": "Character / Gaming", "description": "Highly expressive Japanese character voice capable of rapid emotional shifts."},
    {"id": "hi-IN-explainer-m1", "display_name": "Aarav (Bilingual Educator)", "type": "prebuilt", "language_code": "hi-IN", "accent": "Indian", "gender": "Male", "pitch": "Medium", "persona": "Educator / Podcaster", "description": "Clear, engaging Indian voice suited for Hindi and English educational content."},
    {"id": "en-IN-agent-f1", "display_name": "Priya (Enterprise Concierge)", "type": "prebuilt", "language_code": "en-IN", "accent": "Indian English", "gender": "Female", "pitch": "Medium", "persona": "Customer Support", "description": "Polished, empathetic Indian English voice for enterprise voice agents."},
    {"id": "pt-BR-podcaster-f1", "display_name": "Beatriz (São Paulo Host)", "type": "prebuilt", "language_code": "pt-BR", "accent": "Brazilian Portuguese", "gender": "Female", "pitch": "Medium", "persona": "Podcaster", "description": "Lively, musical Brazilian Portuguese voice for lifestyle and tech podcasts."},
    {"id": "ko-KR-narrator-m1", "display_name": "Joon (Seoul Documentary)", "type": "prebuilt", "language_code": "ko-KR", "accent": "Seoul Korean", "gender": "Male", "pitch": "Medium-Low", "persona": "Documentary", "description": "Calm, grounded Korean documentary and audiobook narrator."},
    {"id": "it-IT-storyteller-f1", "display_name": "Giulia (Milanese Narrator)", "type": "prebuilt", "language_code": "it-IT", "accent": "Standard Italian", "gender": "Female", "pitch": "Medium", "persona": "Storyteller", "description": "Melodic, expressive Italian voice for literature and cultural guides."},
]

CONSENT_STATEMENTS = [
    {"language": "English", "code": "en", "statement": "I am the owner of this voice and have consented to the creation of a synthetic model of my voice through the use of Google Cloud."},
    {"language": "Spanish", "code": "es", "statement": "Soy el propietario de esta voz y he consentido la creación de un modelo sintético de mi voz mediante el uso de Google Cloud."},
    {"language": "French", "code": "fr", "statement": "Je suis propriétaire de cette voix et j'ai consenti à la création d'un modèle synthétique de ma voix grâce à l'utilisation de Google Cloud."},
    {"language": "German", "code": "de", "statement": "Ich bin der Inhaber dieser Stimme und habe der Erstellung eines synthetischen Modells meiner Stimme mithilfe von Google Cloud zugestimmt."},
    {"language": "Hindi", "code": "hi", "statement": "मैं इस आवाज का स्वामी हूं और मैंने Google क्लाउड के उपयोग के माध्यम से अपनी आवाज का कृत्रिम मॉडल बनाने की सहमति दी है।"},
    {"language": "Japanese", "code": "ja", "statement": "私はこの音声の所有者であり、Google Cloud を利用して私の音声の合成モデルを作成することに同意しました。"},
    {"language": "Korean", "code": "ko", "statement": "저는 이 음성의 소유자이며, Google Cloud를 사용하여 제 음성의 합성 모델을 생성하는 데 동의했습니다."},
    {"language": "Portuguese", "code": "pt", "statement": "Eu sou o proprietário desta voz e consinto com a criação de um modelo sintético da minha voz através do uso do Google Cloud."},
    {"language": "Italian", "code": "it", "statement": "Sono il proprietario di questa voce e ho acconsentito alla creazione di un modello sintetico della mia voce tramite l'utilizzo di Google Cloud."},
    {"language": "Chinese (Mandarin)", "code": "cmn", "statement": "我是这段声音的所有者，并已同意通过 Google Cloud 创建我的声音合成模型。"},
    {"language": "Arabic", "code": "ar", "statement": "أنا صاحب هذا الصوت وقد وافقت على إنشاء نموذج اصطناعي لصوتي باستخدام خدمة جوجل كلاود."},
    {"language": "Dutch", "code": "nl", "statement": "Ik ben de eigenaar van deze stem en heb toestemming gegeven voor het creëren van een synthetisch model van mijn stem via Google Cloud."},
    {"language": "Polish", "code": "pl", "statement": "Jestem właścicielem tego głosu i wyraziłem zgodę na utworzenie syntetycznego modelu mojego głosu za pomocą Google Cloud"},
    {"language": "Turkish", "code": "tr", "statement": "Bu sesin sahibi benim ve Google Cloud kullanılarak sesimin sentetik bir modelinin oluşturulmasına izin verdim."},
    {"language": "Indonesian", "code": "id", "statement": "Saya adalah pemilik suara ini dan telah menyetujui pembuatan model sintetis suara saya melalui penggunaan Google Cloud."},
    {"language": "Vietnamese", "code": "vi", "statement": "Tôi là chủ sở hữu giọng nói này và đã đồng ý cho phép tạo ra một mô hình tổng hợp giọng nói của mình thông qua việc sử dụng Google Cloud."},
    {"language": "Tamil", "code": "ta", "statement": "இந்தக் குரலின் உரிமையாளர் நானே, மேலும் கூகிள் கிளவுடைப் பயன்படுத்தி எனது குரலின் செயற்கை மாதிரியை உருவாக்குவதற்கும் நான் ஒப்புதல் அளித்துள்ளேன்."},
    {"language": "Telugu", "code": "te", "statement": "ఈ స్వరానికి నేను యజమానిని మరియు గూగుల్ క్లౌడ్‌ను ఉపయోగించి నా స్వరం యొక్క కృత్రిమ నమూనాను రూపొందించడానికి నేను సమ్మతించాను."},
    {"language": "Bengali", "code": "bn", "statement": "আমি এই কণ্ঠস্বরের মালিক এবং গুগল ক্লাউড ব্যবহারের মাধ্যমে আমার কণ্ঠস্বরের একটি কৃত্রিম মডেল তৈরিতে সম্মতি দিয়েছি।"},
    {"language": "Marathi", "code": "mr", "statement": "मी या आवाजाचा मालक आहे आणि गूगल क्लाउडचा वापर करून माझ्या आवाजाचे कृत्रिम मॉडेल तयार करण्यास मी संमती दिली आहे."},
    {"language": "Gujarati", "code": "gu", "statement": "હું આ અવાજનો માલિક છું અને ગૂગલ ક્લાઉડના ઉપયોગ દ્વારા મારા અવાજનું સિન્થેટિક મોડેલ બનાવવા માટે સંમતિ આપી છે."},
    {"language": "Kannada", "code": "kn", "statement": "ನಾನು ಈ ಧ್ವನಿಯ ಮಾಲೀಕ ಮತ್ತು Google Cloud ಬಳಕೆಯ ಮೂಲಕ ನನ್ನ ಧ್ವನಿಯ ಸಂಶ್ಲೇಷಿತ ಮಾದರಿಯನ್ನು ರಚಿಸಲು ಸಮ್ಮತಿಸಿದ್ದೇನೆ."},
    {"language": "Malayalam", "code": "ml", "statement": "ഈ ശബ്ദത്തിന്റെ ഉടമ ഞാനാണ്, Google ക്ലൗഡ് ഉപയോഗിച്ച് എന്റെ ശബ്ദത്തിന്റെ ഒരു സിന്തറ്റിക് മോഡൽ സൃഷ്ടിക്കാൻ ഞാൻ സമ്മതം നൽകിയിട്ടുണ്ട്."},
    {"language": "Punjabi", "code": "pa", "statement": "ਮੈਂ ਇਸ ਆਵਾਜ਼ ਦਾ ਮਾਲਕ ਹਾਂ ਅਤੇ ਗੂਗਲ ਕਲਾਉਡ ਦੀ ਵਰਤੋਂ ਰਾਹੀਂ ਆਪਣੀ ਆਵਾਜ਼ ਦੇ ਇੱਕ ਸਿੰਥੈਟਿਕ ਮਾਡਲ ਨੂੰ ਬਣਾਉਣ ਲਈ ਸਹਿਮਤੀ ਦਿੱਤੀ ਹੈ।"},
    {"language": "Russian", "code": "ru", "statement": "Я являюсь владельцем этого голоса и дал согласие на создание синтетической модели моего голоса с использованием Google Cloud."},
    {"language": "Ukrainian", "code": "uk", "statement": "Я є власником цього голосу та дав згоду на створення синтетичної моделі мого голосу за допомогою Google Cloud"},
    {"language": "Swedish", "code": "sv", "statement": "Jag äger den här rösten och har samtyckt till att en syntetisk modell av min röst skapas med hjälp av Google Cloud."},
    {"language": "Thai", "code": "th", "statement": "ฉันเป็นเจ้าของเสียงนี้และได้ยินยอมให้สร้างแบบจำลองเสียงสังเคราะห์ของเสียงฉันโดยใช้ Google Cloud"},
]

REFERENCE_PASSAGE = (
    "The morning fog had just begun to lift over the harbor when the first fishing boats returned. "
    "Gulls circled overhead, calling to one another, while the smell of salt and fresh bread drifted "
    "from the bakery on the corner. It was the kind of quiet, ordinary day that people rarely remember, "
    "and yet, years later, it was the one I thought about most."
)

# ---------------------------------------------------------------------------
# Google Cloud Auth & Vertex AI Endpoint Helpers
# ---------------------------------------------------------------------------

_CACHED_PROJECT: Optional[str] = None


def get_default_project() -> str:
    global _CACHED_PROJECT
    if _CACHED_PROJECT is not None:
        return _CACHED_PROJECT
    env_proj = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("GCP_PROJECT")
    if env_proj:
        _CACHED_PROJECT = env_proj
        return env_proj
    try:
        creds, adc_project = google.auth.default()
        quota_proj = getattr(creds, "quota_project_id", None)
        if quota_proj:
            _CACHED_PROJECT = quota_proj
            return _CACHED_PROJECT
        if adc_project:
            _CACHED_PROJECT = adc_project
            return _CACHED_PROJECT
    except Exception:
        pass
    try:
        res = subprocess.run(
            ["gcloud", "config", "get-value", "project"],
            capture_output=True,
            text=True,
            timeout=2,
        )
        if res.returncode == 0 and res.stdout.strip() and res.stdout.strip() != "(unset)":
            _CACHED_PROJECT = res.stdout.strip()
            return _CACHED_PROJECT
    except Exception:
        pass
    _CACHED_PROJECT = ""
    return ""


_CACHED_TOKEN: Optional[str] = None
_CACHED_TOKEN_EXPIRY: float = 0.0


def get_access_token(explicit_token: Optional[str] = None) -> str:
    global _CACHED_TOKEN, _CACHED_TOKEN_EXPIRY
    if explicit_token and explicit_token.strip():
        return explicit_token.strip()
    env_tok = os.environ.get("VERTEX_ACCESS_TOKEN") or os.environ.get("GOOGLE_OAUTH_ACCESS_TOKEN")
    if env_tok and env_tok.strip():
        return env_tok.strip()
    now = time.time()
    if _CACHED_TOKEN and now < _CACHED_TOKEN_EXPIRY:
        return _CACHED_TOKEN
    try:
        creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
        auth_req = google.auth.transport.requests.Request()
        creds.refresh(auth_req)
        if creds.token:
            _CACHED_TOKEN = creds.token
            _CACHED_TOKEN_EXPIRY = now + 2700  # 45 minutes
            return _CACHED_TOKEN
    except Exception:
        pass
    for cmd in (
        ["gcloud", "auth", "application-default", "print-access-token"],
        ["gcloud", "auth", "print-access-token"],
    ):
        try:
            res = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=2.5,
            )
            if res.returncode == 0 and res.stdout.strip():
                _CACHED_TOKEN = res.stdout.strip()
                _CACHED_TOKEN_EXPIRY = now + 2700  # 45 minutes
                return _CACHED_TOKEN
        except Exception:
            pass
    raise HTTPException(
        status_code=401,
        detail="No Google Cloud access token found. Run `gcloud auth application-default login` or paste an Access Token in Vertex Settings.",
    )


def convert_audio_to_24k_wav(audio_bytes: bytes, max_seconds: Optional[int] = None) -> bytes:
    """Uses ffmpeg to resample any input audio (webm/ogg/wav/mp3) to 24kHz, mono, 16-bit PCM WAV."""
    duration_args = ["-t", str(max_seconds)] if max_seconds else []
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        "pipe:0",
        *duration_args,
        "-ar",
        "24000",
        "-ac",
        "1",
        "-f",
        "s16le",
        "pipe:1",
    ]
    proc = subprocess.run(cmd, input=audio_bytes, capture_output=True)
    if proc.returncode != 0:
        err_msg = proc.stderr.decode("utf-8", errors="replace")
        raise HTTPException(status_code=400, detail=f"Audio conversion failed via ffmpeg: {err_msg[:300]}")
    pcm = proc.stdout
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)
        wf.writeframes(pcm)
    return buf.getvalue()


def wrap_pcm16_in_wav(pcm_bytes: bytes, sample_rate: int = 24000) -> bytes:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_bytes)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class TurnItem(BaseModel):
    text: str
    speaker: Optional[str] = None
    style: Optional[str] = None


class SpeakerBinding(BaseModel):
    speaker: str
    voice: str


class SynthesizeRequest(BaseModel):
    project_id: Optional[str] = None
    location: str = "global"
    access_token: Optional[str] = None
    model: str = "gemini-3.8-flash-tts"
    mode: str = "single"  # "single" | "multi" | "stitch"
    voice: str = "Kore"
    turns: List[TurnItem]
    speakers: List[SpeakerBinding] = Field(default_factory=list)
    output_format: str = "AUDIO_WAV"  # AUDIO_WAV | AUDIO_L16 | AUDIO_MULAW | AUDIO_ALAW


class VoiceDesignRequest(BaseModel):
    project_id: Optional[str] = None
    location: str = "global"
    access_token: Optional[str] = None
    display_name: str
    gender: str = "female"
    language_code: str = "en-US"
    prompt_input: str
    store: bool = True


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/config")
async def get_config():
    project_id = get_default_project()
    has_token = False
    try:
        tok = get_access_token()
        has_token = bool(tok)
    except Exception:
        has_token = False

    return {
        "project_id": project_id,
        "location": "global",
        "authenticated": has_token,
        "endpoint": "https://aiplatform.googleapis.com",
        "models": [
            {
                "id": "gemini-3.8-flash-tts",
                "name": "Gemini 3.8 Flash TTS",
                "badge": "Studio Grade",
                "languages": 130,
                "description": "Highest acoustic fidelity, nuanced acting, frequent vocal-burst tags, overlapping backchannels, regional dialects, and long-form narration.",
            },
            {
                "id": "gemini-3.8-flash-lite-tts",
                "name": "Gemini 3.8 Flash-Lite TTS",
                "badge": "Low-Latency Prod",
                "languages": 101,
                "description": "Fast, cost-efficient speech generation for high-volume batch workloads, voice agent cascades, read-aloud, and everyday single-speaker speech.",
            },
        ],
        "prebuilt_voices": PREBUILT_VOICES,
        "extended_library_curated": EXTENDED_LIBRARY_CURATED,
        "consent_statements": CONSENT_STATEMENTS,
        "reference_passage": REFERENCE_PASSAGE,
    }


def build_vertex_payload(req: SynthesizeRequest, for_streaming: bool = False) -> Dict[str, Any]:
    parts = []
    for t in req.turns:
        part: Dict[str, Any] = {"text": t.text}
        meta: Dict[str, str] = {}
        if req.mode == "multi" and t.speaker:
            meta["speaker"] = t.speaker
        elif req.mode == "single" and t.speaker:
            meta["speaker"] = t.speaker
        if t.style and t.style.strip():
            meta["style"] = t.style.strip()
        if meta:
            part["speechMetadata"] = meta
        parts.append(part)

    if req.mode == "multi":
        speaker_configs = [
            {"speaker": s.speaker, "voiceConfig": {"voice": s.voice}}
            for s in req.speakers[:2]
        ]
        speech_config = {
            "multiSpeakerVoiceConfig": {
                "speakerVoiceConfigs": speaker_configs
            }
        }
    else:
        speech_config = {
            "voiceConfig": {"voice": req.voice}
        }

    gen_config: Dict[str, Any] = {
        "responseModalities": ["AUDIO"],
        "speechConfig": speech_config,
    }

    # Add responseFormat if non-default or explicitly requested
    if not for_streaming and req.output_format and req.output_format != "AUDIO_WAV":
        gen_config["responseFormat"] = [{"audio": {"mimeType": req.output_format}}]
    elif for_streaming and req.output_format and req.output_format not in ("AUDIO_WAV", "AUDIO_L16"):
        gen_config["responseFormat"] = [{"audio": {"mimeType": req.output_format}}]

    return {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": gen_config,
    }


@app.post("/api/tts/generate")
async def generate_tts(req: SynthesizeRequest):
    project_id = (req.project_id or get_default_project()).strip()
    if not project_id:
        raise HTTPException(status_code=400, detail="Google Cloud Project ID is required.")
    token = get_access_token(req.access_token)
    location = req.location or "global"
    t0 = time.time()

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    url = (
        f"https://aiplatform.googleapis.com/v1/projects/{project_id}"
        f"/locations/{location}/publishers/google/models/{req.model}:generateContent"
    )

    # Multi-turn / >2 speaker Stitch mode: synthesize each turn individually in AUDIO_L16 and concatenate!
    if req.mode == "stitch":
        speaker_map = {s.speaker: s.voice for s in req.speakers}
        pcm_segments: List[bytes] = []
        async with httpx.AsyncClient(timeout=90.0) as client:
            for idx, turn in enumerate(req.turns):
                if not turn.text.strip():
                    continue
                voice_id = speaker_map.get(turn.speaker or "", req.voice)
                part: Dict[str, Any] = {"text": turn.text}
                if turn.style and turn.style.strip():
                    part["speechMetadata"] = {"style": turn.style.strip()}
                payload = {
                    "contents": [{"role": "user", "parts": [part]}],
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "responseFormat": [{"audio": {"mimeType": "AUDIO_L16"}}],
                        "speechConfig": {"voiceConfig": {"voice": voice_id}},
                    },
                }
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code != 200:
                    raise HTTPException(
                        status_code=resp.status_code,
                        detail=f"Turn {idx + 1} failed: {resp.text}",
                    )
                data = resp.json()
                try:
                    b64 = data["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
                    raw = base64.b64decode(b64)
                    # Strip WAV header if returned despite AUDIO_L16
                    if raw[:4] == b"RIFF":
                        raw = raw[44:]
                    pcm_segments.append(raw)
                except (KeyError, IndexError) as e:
                    raise HTTPException(status_code=500, detail=f"Unexpected response structure on turn {idx + 1}: {e}")

        combined_pcm = b"".join(pcm_segments)
        wav_bytes = wrap_pcm16_in_wav(combined_pcm, 24000)
        elapsed_ms = int((time.time() - t0) * 1000)
        return {
            "audio_base64": base64.b64encode(wav_bytes).decode("utf-8"),
            "mime_type": "audio/wav",
            "requested_format": "AUDIO_WAV (Stitched L16)",
            "sample_rate": 24000,
            "byte_length": len(wav_bytes),
            "duration_seconds": round(len(combined_pcm) / (24000 * 2), 2),
            "latency_ms": elapsed_ms,
            "synthid_watermarked": True,
        }

    # Standard Single-Speaker or 2-Speaker Unary Request
    payload = build_vertex_payload(req, for_streaming=False)
    async with httpx.AsyncClient(timeout=90.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        data = resp.json()

    try:
        inline_data = data["candidates"][0]["content"]["parts"][0]["inlineData"]
        b64_audio = inline_data["data"]
        mime_type = inline_data.get("mimeType", "audio/wav")
    except (KeyError, IndexError):
        raise HTTPException(
            status_code=500,
            detail=f"No audio inlineData returned from Vertex AI: {json.dumps(data)[:400]}",
        )

    raw_bytes = base64.b64decode(b64_audio)
    elapsed_ms = int((time.time() - t0) * 1000)

    # If the user requested AUDIO_L16, browser <audio> needs a playable WAV wrapper alongside raw download
    playable_b64 = b64_audio
    duration_sec = 0.0
    if req.output_format == "AUDIO_L16" and raw_bytes[:4] != b"RIFF":
        wav_wrapped = wrap_pcm16_in_wav(raw_bytes, 24000)
        playable_b64 = base64.b64encode(wav_wrapped).decode("utf-8")
        duration_sec = round(len(raw_bytes) / (24000 * 2), 2)
    elif req.output_format == "AUDIO_WAV" or raw_bytes[:4] == b"RIFF":
        pcm_len = max(0, len(raw_bytes) - 44)
        duration_sec = round(pcm_len / (24000 * 2), 2)
    else:
        # MULAW / ALAW @ 8kHz 1-byte per sample
        duration_sec = round(len(raw_bytes) / 8000, 2)
        # Convert mulaw/alaw via ffmpeg so browser can also preview it!
        try:
            in_fmt = "mulaw" if req.output_format == "AUDIO_MULAW" else "alaw"
            proc = subprocess.run(
                ["ffmpeg", "-y", "-f", in_fmt, "-ar", "8000", "-ac", "1", "-i", "pipe:0", "-f", "wav", "pipe:1"],
                input=raw_bytes,
                capture_output=True,
            )
            if proc.returncode == 0:
                playable_b64 = base64.b64encode(proc.stdout).decode("utf-8")
        except Exception:
            pass

    return {
        "audio_base64": playable_b64,
        "raw_base64": b64_audio,
        "mime_type": mime_type,
        "requested_format": req.output_format,
        "sample_rate": 8000 if req.output_format in ("AUDIO_MULAW", "AUDIO_ALAW") else 24000,
        "byte_length": len(raw_bytes),
        "duration_seconds": duration_sec,
        "latency_ms": elapsed_ms,
        "synthid_watermarked": True,
        "usage": data.get("usageMetadata", {}),
    }


@app.post("/api/tts/stream")
async def stream_tts(req: SynthesizeRequest):
    """Streams real-time SSE chunks of raw 24kHz 16-bit mono PCM from streamGenerateContent."""
    project_id = (req.project_id or get_default_project()).strip()
    if not project_id:
        raise HTTPException(status_code=400, detail="Google Cloud Project ID is required.")
    token = get_access_token(req.access_token)
    location = req.location or "global"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    url = (
        f"https://aiplatform.googleapis.com/v1/projects/{project_id}"
        f"/locations/{location}/publishers/google/models/{req.model}:streamGenerateContent?alt=sse"
    )
    payload = build_vertex_payload(req, for_streaming=True)

    async def event_generator():
        t0 = time.time()
        chunk_index = 0
        total_bytes = 0
        ttfb_ms = None

        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream("POST", url, headers=headers, json=payload) as resp:
                if resp.status_code != 200:
                    err_body = await resp.aread()
                    err_str = err_body.decode("utf-8", errors="replace")
                    yield f"data: {json.dumps({'error': err_str, 'status': resp.status_code})}\n\n"
                    return

                async for line in resp.aiter_lines():
                    if not line or not line.startswith("data:"):
                        continue
                    data_str = line[5:].strip()
                    if not data_str or data_str == "[DONE]":
                        continue
                    try:
                        chunk_json = json.loads(data_str)
                    except Exception:
                        continue

                    candidates = chunk_json.get("candidates") or []
                    if not candidates:
                        continue
                    content = candidates[0].get("content") or {}
                    parts = content.get("parts") or []
                    for part in parts:
                        inline = part.get("inlineData") or {}
                        b64_pcm = inline.get("data")
                        if b64_pcm:
                            now_ms = int((time.time() - t0) * 1000)
                            if ttfb_ms is None:
                                ttfb_ms = now_ms
                            raw_len = (len(b64_pcm) * 3) // 4
                            total_bytes += raw_len
                            chunk_index += 1
                            event_payload = {
                                "chunk_index": chunk_index,
                                "pcm_base64": b64_pcm,
                                "byte_length": raw_len,
                                "total_bytes": total_bytes,
                                "elapsed_ms": now_ms,
                                "ttfb_ms": ttfb_ms,
                                "sample_rate": 24000,
                            }
                            yield f"data: {json.dumps(event_payload)}\n\n"

        total_ms = int((time.time() - t0) * 1000)
        yield f"data: {json.dumps({'done': True, 'total_chunks': chunk_index, 'total_bytes': total_bytes, 'total_ms': total_ms, 'ttfb_ms': ttfb_ms})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# ---------------------------------------------------------------------------
# Voices API (v1beta1): List, Get, Create Prompted, Create Replicated, Delete
# ---------------------------------------------------------------------------

@app.get("/api/voices")
async def list_voices(
    project_id: Optional[str] = Query(None),
    location: str = Query("global"),
    access_token: Optional[str] = Query(None),
    types: Optional[str] = Query(None, description="Comma-separated: prebuilt,prompted,replicated"),
    search: Optional[str] = Query(None),
    page_size: int = Query(50),
    page_token: Optional[str] = Query(None),
):
    proj = (project_id or get_default_project()).strip()
    if not proj:
        raise HTTPException(status_code=400, detail="Google Cloud Project ID is required.")
    token = get_access_token(access_token)

    url = f"https://aiplatform.googleapis.com/v1beta1/projects/{proj}/locations/{location}/voices"
    params: List[tuple] = [("pageSize", str(page_size))]
    if types:
        for t in types.split(","):
            if t.strip():
                params.append(("type", t.strip()))
    if search and search.strip():
        params.append(("search", search.strip()))
    if page_token:
        params.append(("pageToken", page_token))

    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(url, headers=headers, params=params)
        if resp.status_code != 200:
            # Return graceful fallback with curated voices + error message if API not enabled yet
            return {
                "voices": [],
                "api_error": resp.text,
                "status_code": resp.status_code,
            }
        return resp.json()


@app.get("/api/voices/{voice_id}")
async def get_voice(
    voice_id: str,
    project_id: Optional[str] = Query(None),
    location: str = Query("global"),
    access_token: Optional[str] = Query(None),
):
    proj = (project_id or get_default_project()).strip()
    if not proj:
        raise HTTPException(status_code=400, detail="Google Cloud Project ID is required.")
    token = get_access_token(access_token)

    url = f"https://aiplatform.googleapis.com/v1beta1/projects/{proj}/locations/{location}/voices/{voice_id}"
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(url, headers=headers)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        data = resp.json()

    # If sampleAudio / sample_audio is raw L16 PCM, wrap in WAV so browser can play directly
    sample_obj = data.get("sampleAudio") or data.get("sample_audio")
    if sample_obj and sample_obj.get("data"):
        mime = (sample_obj.get("mimeType") or sample_obj.get("mime_type") or "").lower()
        raw_bytes = base64.b64decode(sample_obj["data"])
        if mime.startswith("audio/l16") or raw_bytes[:4] != b"RIFF":
            wav_bytes = wrap_pcm16_in_wav(raw_bytes, 24000)
            data["playable_sample_wav_base64"] = base64.b64encode(wav_bytes).decode("utf-8")
        else:
            data["playable_sample_wav_base64"] = sample_obj["data"]

    return data


@app.post("/api/voices/design")
async def create_designed_voice(req: VoiceDesignRequest):
    proj = (req.project_id or get_default_project()).strip()
    if not proj:
        raise HTTPException(status_code=400, detail="Google Cloud Project ID is required.")
    token = get_access_token(req.access_token)

    url = f"https://aiplatform.googleapis.com/v1beta1/projects/{proj}/locations/{req.location}/voices"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    # Note: Do NOT set voice.model when store=True (per docs: fails with INVALID_ARGUMENT)
    payload = {
        "store": True,
        "voice": {
            "type": "VOICE_TYPE_PROMPTED",
            "displayName": req.display_name,
            "gender": req.gender,
            "languageCode": req.language_code,
            "prompted": {
                "input": req.prompt_input,
            },
        },
    }

    async with httpx.AsyncClient(timeout=75.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        data = resp.json()

    sample_obj = data.get("sampleAudio") or data.get("sample_audio")
    if sample_obj and sample_obj.get("data"):
        mime = (sample_obj.get("mimeType") or sample_obj.get("mime_type") or "").lower()
        raw_bytes = base64.b64decode(sample_obj["data"])
        if mime.startswith("audio/l16") or raw_bytes[:4] != b"RIFF":
            wav_bytes = wrap_pcm16_in_wav(raw_bytes, 24000)
            data["playable_sample_wav_base64"] = base64.b64encode(wav_bytes).decode("utf-8")
        else:
            data["playable_sample_wav_base64"] = sample_obj["data"]

    return data


@app.post("/api/voices/replicate")
async def create_replicated_voice(
    source_audio: UploadFile = File(...),
    consent_audio: UploadFile = File(...),
    display_name: str = Form("Replicated Speaker"),
    store: str = Form("true"),
    model: str = Form("gemini-3.8-flash-tts"),
    project_id: Optional[str] = Form(None),
    location: str = Form("global"),
    access_token: Optional[str] = Form(None),
):
    proj = (project_id or get_default_project()).strip()
    if not proj:
        raise HTTPException(status_code=400, detail="Google Cloud Project ID is required.")
    token = get_access_token(access_token)

    is_store = store.lower() in ("true", "1", "yes")

    src_raw = await source_audio.read()
    con_raw = await consent_audio.read()
    if not src_raw:
        raise HTTPException(status_code=400, detail="Reference audio (source_audio) is empty.")
    if not con_raw:
        raise HTTPException(status_code=400, detail="Consent audio (consent_audio) is empty.")

    # Convert both recordings to 24 kHz, mono, 16-bit PCM WAV (trim source_audio at 30s per Colab)
    src_wav = convert_audio_to_24k_wav(src_raw, max_seconds=30)
    con_wav = convert_audio_to_24k_wav(con_raw, max_seconds=None)

    src_b64 = base64.b64encode(src_wav).decode("utf-8")
    con_b64 = base64.b64encode(con_wav).decode("utf-8")

    voice_body: Dict[str, Any] = {
        "type": "VOICE_TYPE_REPLICATED",
        "replicated": {
            "sourceAudio": {"mimeType": "audio/wav", "data": src_b64},
            "consentAudio": {"mimeType": "audio/wav", "data": con_b64},
        },
    }

    if is_store:
        # Per docs: Don't set voice.model when store=True!
        if display_name:
            voice_body["displayName"] = display_name
    else:
        # Per docs: voice.model is REQUIRED when store=False!
        voice_body["model"] = model or "gemini-3.8-flash-tts"

    payload = {
        "store": is_store,
        "voice": voice_body,
    }

    url = f"https://aiplatform.googleapis.com/v1beta1/projects/{proj}/locations/{location}/voices"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=75.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()


@app.delete("/api/voices/{voice_id}")
async def delete_voice(
    voice_id: str,
    project_id: Optional[str] = Query(None),
    location: str = Query("global"),
    access_token: Optional[str] = Query(None),
):
    proj = (project_id or get_default_project()).strip()
    if not proj:
        raise HTTPException(status_code=400, detail="Google Cloud Project ID is required.")
    token = get_access_token(access_token)

    url = f"https://aiplatform.googleapis.com/v1beta1/projects/{proj}/locations/{location}/voices/{voice_id}"
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.delete(url, headers=headers)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return {"deleted": True, "id": voice_id}


# Mount static frontend files
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
