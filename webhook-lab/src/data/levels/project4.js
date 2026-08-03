export const project4 = {
  "id": "project-4",
  "title": "Project 4 - The Graveyard",
  "type": "lab",
  "briefing": {
    "recap": "Phantom payloads are blocked, but legitimate payloads are failing processing.",
    "incident": "ERROR: Failed payloads are being dropped completely.",
    "task": "Implement a Dead Letter Queue (DLQ) to capture failed Webhooks.",
    "rewards": { "xp": 650, "badge": "Necromancer" }
  },
  "content": "## System Diagnostics\
**[The Void]** \"The Graveyard is where we were born. You cannot control it.\"\
\
**[Sarah]** \"We need to reclaim the Graveyard. Set up a Dead Letter Queue so we can inspect and retry failed Webhooks.\"\
\
### Core Engineering Principle: Observability\
To diagnose failures at scale, you need three things:\
1. **Logging:** Record every incoming payload and its response code.\
2. **Metrics:** Track the failure rate (e.g., 400s vs 500s).\
3. **DLQ (Dead Letter Queue):** A special queue where unprocessable events (like malformed JSON) are stored for manual review and replay, rather than being dropped entirely.\
\
### Platform Engineer Insight\
**Observability:** A DLQ is your ultimate safety net. If a developer accidentally deploys a bug that crashes the Business Logic processor, the DLQ catches all the Webhooks that arrived during the outage so you can manually replay them later.\
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