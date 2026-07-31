export const project4 = {
  "id": "project-4",
  "title": "Project 4 - The Graveyard",
  "type": "lab",
  "briefing": {
    "recap": "Phantom payloads are blocked, but legitimate payloads are failing processing.",
    "incident": "ERROR: Failed payloads are being dropped completely.",
    "task": "Implement a Dead Letter Queue (DLQ) to capture failed webhooks.",
    "rewards": { "xp": 650, "badge": "Necromancer" }
  },
  "content": "## System Diagnostics\
**[The Void]** \"The Graveyard is where we were born. You cannot control it.\"\
\
**[Sarah]** \"We need to reclaim the Graveyard. Set up a Dead Letter Queue so we can inspect and retry failed webhooks.\"\
\
## Objective\
Configure a DLQ for the main processing queue.",
  "simulator": {
    "tasks": [
      {
        "command": /^node configure_dlq\.js$/i,
        "instruction": "Run node configure_dlq.js to establish the Dead Letter Queue.",
        "successMessage": "[SUCCESS] DLQ active. The Graveyard is secured.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};