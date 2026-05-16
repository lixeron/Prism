# Prism 🔺

**Content goes in. A spectrum of posts comes out.**

Prism is an AI-powered content repurposing engine for creators. Paste a YouTube URL and get platform-ready social media content — X threads, LinkedIn posts, Instagram captions, and newsletter blurbs — in seconds.

## Stack

- **Backend:** Python + FastAPI
- **Frontend:** React + Vite (coming Sprint 3)
- **Database/Auth:** Supabase
- **AI:** Gemini 2.5 Flash
- **Transcription:** yt-dlp (YouTube captions)
- **Payments:** Stripe (coming Sprint 4)

## Quick Start

```bash
# Clone and setup
git clone https://github.com/lixeron/prism.git
cd prism
make setup

# Run locally
make dev

# Run tests
make test

# Docker
make docker-up
```

## Project Structure

```
prism/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Environment settings
│   ├── api/routes/          # API endpoints
│   │   ├── health.py
│   │   ├── transcribe.py
│   │   └── repurpose.py
│   ├── core/                # Business logic
│   │   ├── transcriber.py
│   │   └── repurposer.py
│   ├── services/            # External integrations
│   │   ├── youtube.py       # yt-dlp wrapper
│   │   └── ai.py            # AI provider (abstracted)
│   └── db/
│       └── supabase.py
└── tests/
```

## Development Roadmap

- [x] **Sprint 1:** Project scaffold + YouTube transcript extraction
- [ ] **Sprint 2:** AI repurposing engine + prompt tuning
- [ ] **Sprint 3:** Frontend (React) + auth
- [ ] **Sprint 4:** Stripe + usage limits + deployment
- [ ] **Sprint 5:** Beta testing + launch
