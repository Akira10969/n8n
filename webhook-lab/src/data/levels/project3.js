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
Add cryptographic signature verification using the crypto library.\
\
### Platform Engineer Insight\
**What is this concept?** Cryptographic Libraries.\
**Why is it used?** We need standardized, tested cryptographic algorithms to implement HMAC signatures securely.\
**How does it work?** The crypto-js package provides standard cryptographic functions (like SHA-256 and HMAC) to our application layer.\
**How do we monitor it in production?** We monitor application dependencies using SCA (Software Composition Analysis) tools to ensure libraries like crypto-js don't contain known vulnerabilities.\n\n### Before You Act: Installing Security Libraries\n**What is this command?** \`npm install crypto-js\`\n**Why is it used?** To install the required cryptographic library so we can compute HMAC signatures and verify Webhook authenticity.\n\n> **SYSTEM ALERT:** The cryptographic verification requires the 'crypto-js' package. Use the appropriate npm install command to add it.",
  "simulator": {
    "tasks": [
      {
        "command": /^npm install crypto-js$/i,
        "instruction": "Install the required cryptographic library to enable signature verification.",
        "hints": [
          "What package do we need to implement HMAC verification?",
          "Use the npm package manager to install the crypto-js library.",
          "npm install crypto-js"
        ],
        "successMessage": "[SUCCESS] Signatures verified. The Void phantom payloads are rejected.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};