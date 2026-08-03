export const project3 = {
  "id": "project-3",
  "title": "Project 3 - The Phantom Signatures",
  "type": "lab",
  "briefing": {
    "recap": "The queues are holding, but The Void has begun injecting malicious payloads.",
    "incident": "SECURITY BREACH: Unauthenticated Webhooks detected in the queue.",
    "task": "Implement HMAC signature verification to block malicious payloads.",
    "rewards": { "xp": 600, "badge": "Security Seal" }
  },
  "content": "## System Diagnostics\
**[UNIT-7]** \"WARNING: 45% of incoming payloads are unauthenticated.\"\
\
**[Sarah]** \"The Void is spoofing our Webhooks. We must verify the HMAC signatures before enqueuing.\"\
\
## Objective\
Add cryptographic signature verification using the crypto library.",
  "simulator": {
    "tasks": [
      {
        "command": /^npm install crypto-js$/i,
        "instruction": "Install the crypto library using npm install crypto-js.",
        "successMessage": "[SUCCESS] Signatures verified. The Void phantom payloads are rejected.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};