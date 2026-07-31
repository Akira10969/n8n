export const project5 = {
  "id": "project-5",
  "title": "Project 5 - The Swarm",
  "type": "lab",
  "briefing": {
    "recap": "The Graveyard is secured. The Void is retaliating with a massive, localized DDoS.",
    "incident": "ALERT: Ingestion nodes are being overwhelmed.",
    "task": "Implement strict Rate Limiting on the webhook ingestion endpoints.",
    "rewards": { "xp": 700, "badge": "Shield Wall" }
  },
  "content": "## System Diagnostics\
**[UNIT-7]** \"WARNING: CPU at 99%. Rate of ingestion critical.\"\
\
**[Sarah]** \"Throttle them! We need rate limiting at the application level to survive this swarm.\"\
\
## Objective\
Implement a Token Bucket rate limiter.",
  "simulator": {
    "tasks": [
      {
        "command": /^npm install express-rate-limit$/i,
        "instruction": "Install the rate limiting package using npm install express-rate-limit.",
        "successMessage": "[SUCCESS] Rate limiting active. The Swarm is neutralized.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};