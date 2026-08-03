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
You must deploy a basic Express server to capture the JSON payloads.",
  "simulator": {
    "tasks": [
      {
        "command": /^node index\.js$/i,
        "instruction": "Initialize your server by running node index.js.",
        "successMessage": "[SUCCESS] Receiver initialized. The Monolith feed is disrupted.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};