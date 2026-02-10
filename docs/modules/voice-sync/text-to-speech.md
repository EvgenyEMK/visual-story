# Feature: Text-to-Speech

## Module
Voice Sync

## Overview
Text-to-Speech (TTS) converts the script text into natural-sounding voice-over audio using ElevenLabs API. This enables automatic narration of presentations without requiring users to record their own voice.

## User Stories

### US-TTS-001: Generate Voice-Over from Script
**As a** content creator  
**I want to** generate voice-over audio from my script  
**So that** my presentation has professional narration

**Acceptance Criteria:**
- [ ] One-click voice generation
- [ ] Progress indicator during generation
- [ ] Audio plays in preview immediately after generation
- [ ] Generated audio saved to project

### US-TTS-002: Select Voice
**As a** content creator  
**I want to** choose from different voice options  
**So that** I can match the voice to my brand/content

**Acceptance Criteria:**
- [ ] Voice selector dropdown
- [ ] Preview voice samples before selection
- [ ] 5 voice options minimum (varied gender, tone)
- [ ] Voice selection persists per project

### US-TTS-003: Regenerate Partial Audio
**As a** content creator  
**I want to** regenerate voice for specific slides  
**So that** I don't have to regenerate the entire presentation

**Acceptance Criteria:**
- [ ] Regenerate button per slide
- [ ] New audio seamlessly replaces old
- [ ] Maintains timing sync with other slides
- [ ] Shows which slides have generated audio

## Voice Options (MVP)

| Voice ID | Name | Gender | Tone | Best For |
|----------|------|--------|------|----------|
| `adam` | Adam | Male | Professional, calm | Business, educational |
| `rachel` | Rachel | Female | Warm, friendly | Marketing, storytelling |
| `antoni` | Antoni | Male | Energetic, young | Promotional, tech |
| `bella` | Bella | Female | Clear, authoritative | Training, corporate |
| `josh` | Josh | Male | Conversational | Casual, tutorials |

## Technical Specifications

### ElevenLabs Integration

```typescript
import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

interface TTSRequest {
  text: string;
  voiceId: string;
  modelId?: string;
}

interface TTSResponse {
  audioBuffer: Buffer;
  audioUrl: string;
  wordTimestamps: WordTimestamp[];
}

interface WordTimestamp {
  word: string;
  startTime: number; // milliseconds
  endTime: number;
}

async function generateSpeech(request: TTSRequest): Promise<TTSResponse> {
  const audio = await client.textToSpeech.convertWithTimestamps(
    request.voiceId,
    {
      text: request.text,
      model_id: request.modelId || 'eleven_turbo_v2_5',
      output_format: 'mp3_44100_128',
    }
  );
  
  // Upload to R2
  const audioUrl = await uploadToR2(audio.audio, `audio/${projectId}/${slideId}.mp3`);
  
  return {
    audioBuffer: audio.audio,
    audioUrl,
    wordTimestamps: audio.alignment.characters.map(char => ({
      word: char.character,
      startTime: char.start_time_ms,
      endTime: char.end_time_ms,
    })),
  };
}
```

### API Endpoint
```typescript
// POST /api/projects/{id}/voice
interface GenerateVoiceRequest {
  voiceId: string;
  slideIds?: string[]; // Optional: specific slides only
}

interface GenerateVoiceResponse {
  voiceConfig: VoiceConfig;
  slides: {
    slideId: string;
    audioUrl: string;
    duration: number;
  }[];
}

// Handler
export async function POST(req: Request) {
  const { projectId } = req.params;
  const { voiceId, slideIds } = await req.json();
  
  const project = await getProject(projectId);
  const slidesToProcess = slideIds 
    ? project.slides.filter(s => slideIds.includes(s.id))
    : project.slides;
  
  const results = await Promise.all(
    slidesToProcess.map(async (slide) => {
      const tts = await generateSpeech({
        text: slide.content,
        voiceId,
      });
      
      return {
        slideId: slide.id,
        audioUrl: tts.audioUrl,
        duration: tts.wordTimestamps[tts.wordTimestamps.length - 1].endTime,
        timestamps: tts.wordTimestamps,
      };
    })
  );
  
  // Save to database
  await updateVoiceConfig(projectId, {
    voiceId,
    slides: results,
  });
  
  return Response.json({ slides: results });
}
```

### Voice Preview Component
```typescript
interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelect: (voiceId: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoiceId, onSelect }) => {
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  
  const voices = [
    { id: 'adam', name: 'Adam', sample: '/samples/adam.mp3' },
    { id: 'rachel', name: 'Rachel', sample: '/samples/rachel.mp3' },
    // ...
  ];
  
  return (
    <Select value={selectedVoiceId} onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select voice" />
      </SelectTrigger>
      <SelectContent>
        {voices.map(voice => (
          <SelectItem key={voice.id} value={voice.id}>
            <div className="flex items-center gap-2">
              <span>{voice.name}</span>
              <button onClick={() => playPreview(voice.sample)}>
                🔊
              </button>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
```

## Cost Considerations

| Plan | Characters/month | Cost | Notes |
|------|------------------|------|-------|
| Free | 10,000 | $0 | Development only |
| Starter | 30,000 | $5/mo | ~30 min audio |
| Creator | 100,000 | $22/mo | ~100 min audio |
| Pro | 500,000 | $99/mo | ~500 min audio |

**Estimation**: Average project = 1,500 characters = ~1.5 min audio

**Cost per video**: ~$0.22 on Creator plan

## Dependencies
- ElevenLabs API
- Cloudflare R2 for audio storage
- Audio Timeline Sync for synchronization

## Related Features
- [Audio Timeline Sync](./audio-timeline-sync.md)
- [Multi-Language](./multi-language.md)
