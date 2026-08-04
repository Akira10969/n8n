# Business Cloud OS: Webhook Lab

> A story-driven, fully gamified educational web application that teaches Webhooks, APIs, and Event-Driven Architecture through hands-on incident response simulations.

Built with **React + Vite**, deployed on **cPanel via GitHub Actions**.

---

## 🎮 The Experience

You are a newly hired Platform Engineer at **MEI**. Something has gone terribly wrong — a malicious entity known as **The Void** has infected the Business Cloud OS, corrupting the infrastructure and shutting down critical systems.

Guided by your NOC-BOT **UNIT-7** and Senior Engineer **Sarah**, you must complete **31 missions** across **7 zones** to rebuild the infrastructure from scratch, master webhook-first architecture, and ultimately purge The Void from the system.

---

## ✨ Features

### 🎓 Webhook-First Curriculum

The game teaches **real Platform Engineering skills** through an investigation-based learning model — not a tutorial-style "follow the steps" approach.

- **31 Story-Driven Missions** across 7 progressive zones
- **Platform Engineer Insights** in every mission — explaining What / Why / How / How to Monitor each concept in production
- **"Before You Act" Deep Dives** — detailed breakdowns of every terminal command (what it is, why it's used, important flags) before execution
- **Cognitive Hint Funnel** — a 3-step hint system that guides from *question* → *concept explanation* → *solution*, encouraging reasoning before revealing answers
- **8,940 XP** available across the full campaign
- **10 HP / Hearts** — incident-response pressure without frustration

### 🗺️ Curriculum Zones

| Zone | Missions | Topics |
|------|----------|--------|
| **Foundation** | 1–5 + Project 1 | Networking, HTTP, JSON Payloads, cURL |
| **Infrastructure** | 6–9 + Project 2 | API Polling vs Webhooks, HTTP Status Codes, Webhook Registration |
| **Cloud & Security** | 10–14 + Project 3 | Auth Headers, API Keys, HMAC Signatures, Exponential Backoff |
| **Platform Operations** | 15–18 + Project 4 | Dead Letter Queues, Tunnels, Idempotency, DLQ Management |
| **Automation** | 19–22 + Project 5 | Message Queues, Eventual Consistency, Fan-Out / Pub-Sub, Rate Limiting |
| **Observability** | 23–24 + Project 6 | Nginx Rate Limiting, mTLS, Webhook Signature Verification |
| **Capstone** | Project 7 | Full Enterprise Webhook Pipeline — the final confrontation with The Void |

### 🏆 Gamification

- **XP & Rank System** — climb from *IT Intern* to *Solutions Architect*
- **System Integrity (Hearts)** — incorrect answers cost HP; losing all hearts returns you to Mission 1
- **Badges** — milestone awards for completing each zone
- **Interactive World Map** — an isometric map where corrupted biomes visually heal as you progress
- **Cinematic Environment & NOC Dashboard** — the map dynamically reacts to platform health with fog, glitches, 'Void' overlays, and real-time dashboard metrics during incidents

### 🖥️ Terminal Simulator & Deployment

- **Custom React Terminal Emulator** — players execute real commands (validated against regex patterns), receive authentic system output, and solve live incident scenarios.
- **5-Step Deployment Sequence** — immersive "Quick Deploy" animations (Validating, Building, Deploying) that synchronize with Live Monitoring component health states.

### 🔊 Advanced Audio Engine

- **Browser TTS Voice Synthesis** — distinct AI voice profiles for UNIT-7 (robotic/male), Sarah (female), and The Void (distorted/pitch-shifted)
- **Dynamic Web Audio API** — seamless crossfading between zones, audio ducking during narration, procedural ambience and glitch effects
- **CC0 / Public Domain Audio** — all music assets use permissive licenses safe for public redistribution
- **Graceful Degradation** — if audio files are missing, the engine logs a warning and continues silently without crashing

### 🌐 Offline / Degraded Mode

If the backend PHP/MySQL server is unreachable, the app automatically generates a temporary `OFFLINE-` Engineer ID and stores all progress in `localStorage`. The boot sequence updates its UI to reflect this state transparently.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 |
| Build Tool | Vite |
| Styling | Vanilla CSS (glassmorphism dark mode design system) |
| Content Rendering | React Markdown + Remark GFM |
| Audio | Web Audio API + Web Speech API |
| Backend | PHP 8 + MySQL |
| CI/CD | GitHub Actions → FTP Deploy to cPanel |

---

## 💻 Getting Started

### Prerequisites

- **Node.js** v18+
- **Local Web Server** (XAMPP, MAMP, WAMP, or similar) with Apache + MySQL + PHP 8+

### Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/Akira10969/n8n.git
   cd n8n/webhook-lab
   npm install
   ```

2. **Start local services:**
   - Open your XAMPP/MAMP Control Panel
   - Start **Apache** (must be on port 80 to match the Vite proxy)
   - Start **MySQL**

3. **Database setup:**
   - Open phpMyAdmin (`http://localhost/phpmyadmin`)
   - Create a database named `n8n_lab`
   - Import `backend/database.sql`
   - Update credentials in `backend/config/config.php`

4. **Verify Vite proxy:**
   - Open `vite.config.js`
   - Confirm the `/backend/api` proxy target matches your Apache path (e.g., `http://localhost/n8n/webhook-lab/`)

5. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

### Audio Assets

Place `.mp3` files in `public/audio/` for background music. The engine degrades gracefully if files are absent:

```
public/audio/
├── ambience/map.mp3
├── briefing/briefing.mp3
├── deployment/deployment.mp3
├── gameplay/gameplay.mp3
├── gameplay/critical.mp3
├── debrief/debrief.mp3
└── ending/void.mp3
```

> All shipped audio uses **CC0 / Public Domain** licensing. See [`CREDITS.md`](./CREDITS.md) for full attribution.

---

## 🎮 How to Play

1. **Explore the Map** — click glowing nodes to start unlocked missions
2. **Investigate** — read the incident report and understand the business impact before acting
3. **Use Hints** — the 3-step hint funnel guides your thinking without giving the answer away immediately
4. **Run Commands** — use the Terminal Simulator to respond to the incident
5. **Earn XP & Badges** — complete missions to unlock the next zone and restore the corrupted map
6. **Save the Platform** — complete all 31 missions to trigger the Grand Finale and earn your title as a Certified Platform Engineer

---

## 🧠 What You'll Learn

By the end of Mission 31, you will be able to confidently explain and apply:

- ✅ How webhooks work end-to-end (Sender → Listener → Receiver → Queue → Processor)
- ✅ API Polling vs Event-Driven Architecture and why it matters at scale
- ✅ HTTP methods, headers, status codes (4xx vs 5xx), and payload validation
- ✅ Authentication: API Keys, Bearer Tokens, HMAC Signatures, mTLS
- ✅ Idempotency — preventing duplicate event processing
- ✅ Exponential Backoff and retry strategies
- ✅ Asynchronous processing with Message Queues (Kafka / RabbitMQ / SQS)
- ✅ Dead Letter Queues — zero-data-loss failure handling
- ✅ Rate Limiting — Token Bucket algorithm, Nginx configuration
- ✅ Fan-Out / Pub-Sub patterns for broadcasting events simultaneously
- ✅ Logging, metrics, tracing, and production observability
- ✅ How to **think through problems like a Platform Engineer**, not just follow commands

---

## ⌨️ Developer Shortcuts

Available in `DEV` mode only (`import.meta.env.DEV`):

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + U` | Unlock all 31 missions, grant infinite hearts and max XP |
| `Ctrl + Shift + R` | Hard reset — clear all progress and return to the intro sequence |

---

## 🚀 Deployment

The project deploys automatically to cPanel via **GitHub Actions** on every push to `main`:

```
Push to main
  → GitHub Actions
    → npm install + npm run build (Vite)
    → Package dist/ + backend/
    → FTP Deploy → cPanel
```

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for the full pipeline configuration.

---

## 📄 License

- **Source Code:** MIT License — see [`LICENSE`](./LICENSE)
- **Audio Assets:** CC0 / Public Domain — see [`CREDITS.md`](./CREDITS.md) for full attribution

