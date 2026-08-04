export const project5 = {
  "id": "project-5",
  "title": "Project 5 - The Swarm",
  "type": "lab",
  "briefing": {
    "recap": "The Graveyard is secured. The Void is retaliating with a massive, localized DDoS.",
    "incident": "ALERT: Ingestion nodes are being overwhelmed.",
    "task": "Implement strict Rate Limiting on the Webhook ingestion endpoints.",
    "rewards": { "xp": 700, "badge": "Shield Wall" }
  },
  "content": "## System Diagnostics\
**[UNIT-7]** \"WARNING: CPU at 99%. Rate of ingestion critical.\"\
\
**[Sarah]** \"Throttle them! We need rate limiting at the application level to survive this swarm.\"\
\
## Objective\
Implement a Token Bucket rate limiter.\n\n### Platform Engineer Insight\n**What is this concept?** Rate limiting restricts the number of requests a client can make to an API within a specified time window.\n**Why is it used?** To prevent abuse, mitigate DDoS attacks, and ensure fair resource allocation across all users.\n**How does it work?** Algorithms like Token Bucket track requests per IP. If the limit is exceeded, the server returns a 429 Too Many Requests status.\n**How do we monitor it in production?** We monitor the rate of 429 responses, unique IPs being throttled, and the overall CPU/memory utilization of the API gateways.\n\n### Before You Act: Adding Rate Limiting\n**What is this command?** \`npm install express-rate-limit\`\n**Why is it used?** To install the middleware library needed to enforce rate limits on our Express API and protect it from DDoS attacks.\n\n> **SYSTEM ALERT:** Protect the server by installing the 'express-rate-limit' package. Use the appropriate npm install command.",
  "simulator": {
    "tasks": [
      {
        "command": /^npm install express-rate-limit$/i,
        "instruction": "Install the express rate limiting package to protect our endpoints.",
        "hints": [
          "What tool do we use to add new dependencies to our Node.js project?",
          "We need to install the 'express-rate-limit' package using npm.",
          "npm install express-rate-limit"
        ],
        "successMessage": "[SUCCESS] Rate limiting active. The Swarm is neutralized.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};