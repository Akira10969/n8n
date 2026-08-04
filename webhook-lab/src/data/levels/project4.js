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
**What is this concept?** A Dead Letter Queue (DLQ) is a designated storage area for events and messages that fail to process.\
**Why is it used?** It serves as an ultimate safety net to ensure that malformed or continuously failing data isn't dropped entirely, preserving it for later manual review and replay.\
**How does it work?** The primary processing queue is configured to route any message that exceeds its maximum retry threshold directly into the DLQ.\
**How do we monitor it in production?** We set alarms on the DLQ size; a non-empty DLQ requires immediate engineering investigation to determine why processing failed.\
\
## Objective\
Configure a DLQ for the main processing queue.\n\n### Before You Act: Running Node Scripts\n**What is this command?** \`node\`\n**Why is it used?** To directly execute a JavaScript file (e.g. \`node configure_dlq.js\`) using the Node.js runtime environment.\n\n> **SYSTEM ALERT:** Run the configuration script for the Dead Letter Queue. Use node to execute configure_dlq.js.",
  "simulator": {
    "tasks": [
      {
        "command": /^node configure_dlq\.js$/i,
        "instruction": "Establish the Dead Letter Queue to capture failed Webhooks.",
        "hints": [
          "What script do we need to execute to set up the fallback queue?",
          "Execute the Node.js script responsible for configuring the DLQ.",
          "Run `node configure_dlq.js`"
        ],
        "successMessage": "[SUCCESS] DLQ active. The Graveyard is secured.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};