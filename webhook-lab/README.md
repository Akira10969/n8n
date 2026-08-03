# Business Cloud OS: Webhook Lab

An interactive, story-driven, fully gamified educational web application designed to teach the fundamentals of Webhooks, APIs, and Event-Driven Architecture. Built with React and Vite, this course transforms dense technical concepts into an engaging, visual, and highly interactive gaming experience.

## 🚀 The Experience

You are a newly hired engineer at MEI, tasked with managing **Business Cloud OS**. But something has gone terribly wrong. A malicious anomaly known as **The Void** has infected the platform's core infrastructure, shutting down systems and corrupting data streams.

Guided by your NOC-BOT, **UNIT-7**, and Senior Engineer, **Sarah**, you must complete 31 missions across 7 distinct zones to rebuild the infrastructure from the ground up, master webhooks, and ultimately purge The Void from the system.

## ✨ Features

- **Gamified Learning**: Earn XP, rank up from *IT Intern* to *Solutions Architect*, and manage your system integrity (HP/Hearts) as you take knowledge-check quizzes and interactive labs.
- **31 Story-Driven Missions**: 
  - **Foundation Zone (Missions 1-5)**: Rebuild the basics of HTTP and the Internet.
  - **Infrastructure Zone (Missions 6-10)**: Understand JSON, REST APIs, and Polling vs. Webhooks.
  - **Cloud Zone (Missions 11-15)**: Master webhook payloads, events, and tunneling tools like ngrok.
  - **Security Zone (Missions 16-20)**: Secure your endpoints with HMAC signatures and authentication.
  - **Automation Zone (Missions 21-25)**: Handle retries, idempotent requests, and asynchronous workflows.
  - **Observability Zone (Missions 26-30)**: Design Event-Driven Message Queues and implement dead-letter queues.
  - **Capstone (Mission 31)**: The final confrontation with The Void to restore the system core.
- **Interactive World Map**: A visually stunning isometric world map where corrupted biomes are healed and restored as you progress.
- **Terminal Simulator**: Hands-on coding exercises and simulated deployments using a custom-built, React-based terminal emulator.
- **Advanced Audio Engine**: 
  - **Browser TTS Voice Synthesis**: Distinct AI-generated voice profiles for UNIT-7 (Male AI), Sarah (Female), and The Void (Distorted/Pitch-shifted), featuring strict gender-matching fallback logic and real-time pronunciation formatting.
  - **Dynamic Web Audio API**: Seamlessly crossfades background music, applies audio ducking during narration, and generates real-time procedural ambience and glitch effects.
  - **Local Audio Resilience**: Background tracks are completely decoupled from external CDNs, residing locally in `public/audio/`. The engine gracefully degrades to silence if an asset is missing without throwing browser exceptions.
- **Offline / Degraded Mode**: 
  - The application features an incredibly robust API architecture. If the backend server (MySQL/PHP) is offline or throws a 502 Bad Gateway, the React client intercepts the failure, dynamically generates a temporary local `OFFLINE-` Engineer ID, and seamlessly continues storing curriculum progression in `localStorage`. The System Diagnostics Boot Sequence dynamically updates its UI to reflect this Offline state.
- **Cinematic Events**: Immersive story moments, visual glitch effects for The Void, and a massive, emotional Post-Game sequence and Epilogue.
- **Premium Design**: A modern UI featuring glassmorphism aesthetics, sleek dark mode styling, custom CSS animations, and seamless micro-interactions.

## 🛠 Tech Stack

- **React 18**
- **Vite**
- **React Markdown & Remark GFM** (for rendering robust course content)
- **Vanilla CSS** (custom modern design system & cinematic animations)
- **Web Audio API & Web Speech API** (for procedural audio and voice synthesis)
- **PHP & MySQL** (for backend progress synchronization)

## 💻 Getting Started

Follow these steps to run Business Cloud OS locally on your machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- PHP & MySQL (XAMPP/MAMP or similar for the backend API)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Akira10969/n8n.git
   cd n8n/webhook-lab
   ```

2. Set up the Database:
   - Create a MySQL database and import the `backend/database.sql` file.
   - Update your database credentials inside `backend/config/config.php`.

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   *(Note: The `vite.config.js` is configured to proxy API requests to `http://localhost/n8n/webhook-lab/backend/api/`. Ensure your local PHP server is running and accessible at this path, or update the proxy settings as needed).*

5. Open your browser and navigate to the URL provided in your terminal (typically `http://localhost:5173`).

### Audio Assets
The game expects local `.mp3` background music to be placed inside the `public/audio/` directory under specific folders:
- `/public/audio/ambience/map.mp3`
- `/public/audio/briefing/briefing.mp3`
- `/public/audio/deployment/deployment.mp3`
- `/public/audio/gameplay/gameplay.mp3`
- `/public/audio/gameplay/critical.mp3`
- `/public/audio/debrief/debrief.mp3`
- `/public/audio/ending/void.mp3`

*(Note: If you do not have these files, the game's Audio Engine will gracefully degrade and play in silence, logging a warning to the console rather than crashing).*

## 🎮 How to Play

- **Explore the Map**: Click on unlocked glowing nodes to start a mission.
- **Read & Learn**: Follow the narrative and technical instructions provided by UNIT-7 and Sarah. The game is fully voice-acted via your browser's TTS engine.
- **Take Quizzes**: Answer correctly to earn XP. Incorrect answers will cost you System Integrity (Hearts). If you lose all your hearts, your system crashes and you must restart the mission!
- **Run Commands**: Use the Terminal Simulator to run deployment commands for the final Capstone projects.
- **Save the Platform**: Complete Mission 31 to unlock the epic Grand Finale and secure your title as a Certified Platform Engineer.

## ⌨️ Developer Cheats

When running the application in a non-production environment (`import.meta.env.DEV`), you can use the following keyboard shortcuts for testing and debugging:

- **Unlock Everything:** Press `Ctrl + Shift + U` to instantly unlock all 31 missions, receive infinite hearts, and gain maximum XP.
- **Hard Reset:** Press `Ctrl + Shift + R` to completely format the local database, clear your progress, and reload the game from the intro sequence.
