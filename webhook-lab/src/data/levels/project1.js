export const project1 = {
  "id": "project-1",
  "title": "Project 1 - The Monolith",
  "type": "lab",
  "briefing": {
    "recap": "The outer defenses have fallen. The map is corrupted. We must establish a foothold before The Void consumes everything.",
    "incident": "CRITICAL: The Void has established a massive monolithic Webhook ingestion server (The Monolith) to swallow all incoming traffic.",
    "task": "Build a local Webhook receiver to siphon traffic away from The Monolith.",
    "rewards": { "xp": 500, "badge": "Receiver Badge" }
  },
  "content": "## System Diagnostics\
**[UNIT-7]** \"WARNING: The Monolith is absorbing all Webhook payloads. It is growing in size.\"\
\
**[Sarah]** \"We need to establish our own receiver to intercept the payloads before they reach the core.\"\
\
## Objective\
Deploy a local webhook receiver server that can accept and log incoming HTTP POST payloads.\
\
### Platform Engineer Insight\
**What is this concept?** A Webhook Receiver — the HTTP server endpoint that accepts incoming webhook events.\
**Why is it used?** Every webhook integration needs a running HTTP server. The receiver is the first and most critical component in the entire pipeline.\
**How does it work?** A minimal Express.js server listens on a port, accepts POST requests, and returns HTTP 200 immediately to acknowledge receipt. Heavy processing happens asynchronously.\
**How do we monitor it in production?** We track throughput, error rate, and p99 response time. A slow receiver causes the sender to time out and retry, flooding the system.",
  "simulator": {
    "tasks": [
      {
        "command": /^node index\.js$/i,
        "instruction": "Start your local webhook receiver server to begin capturing incoming payloads.",
        "hints": [
          "How do we start a Node.js application from the command line?",
          "Node.js scripts are executed directly using the `node` runtime followed by the filename.",
          "Solution: node index.js"
        ],
        "successMessage": "[SUCCESS] Receiver initialized. The Monolith feed is disrupted.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};