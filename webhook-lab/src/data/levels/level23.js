export const level23 = {
  "id": "level-23",
  "title": "Holding the Floodgates",
  "type": "theory",
  "briefing": {
    "recap": "The Fan-Out lockdown worked. The grid is sealed. But The Anomaly is furious. It has initiated a massive, brute-force DDoS against the perimeter.",
    "incident": "ALERT: Incoming traffic has spiked by 10,000%. They are trying to overwhelm the webhook gateways with sheer volume.",
    "task": "Implement strict Rate Limiting to protect the core infrastructure from being crushed by the onslaught.",
    "rewards": {
      "xp": 380,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"The perimeter is buckling! They are hammering our webhook ingestion endpoints with millions of garbage requests. If the API gateway falls, they have direct access to the queues.\"\n\n**[UNIT-7]** \"WARNING: API Gateway CPU at 98%. Imminent failure predicted in 14 seconds.\"\n\n**[Sarah]** \"Throttle them! Turn on the rate limiters!\"\n\n## Rate Limiting\nEven with queues and decoupled architecture, you cannot allow infinite, unchecked traffic into your front door. **Rate Limiting** is the ultimate shield.\n\n### Token Bucket Algorithm\nImagine a bucket holding exactly 100 tokens. Every time a webhook comes in, it takes 1 token. \nIf the bucket is empty, the API gateway immediately rejects the request with a **HTTP 429 Too Many Requests** error.\nTokens are slowly refilled at a constant rate (e.g., 10 tokens per second).\n\nBy implementing Rate Limiting at the very edge of the network (API Gateway/Cloudflare), we drop the malicious traffic *before* it ever reaches our application logic or queues, saving our CPU and memory for legitimate events."

  ,
  simulator: {
    tasks: [
      {
        command: /^nginx\s+-s\s+reload$/i,
        instruction: "Rate limiting configuration has been written. Send the reload signal to the Nginx reverse proxy to apply the changes.",
        successMessage: "[OK] Nginx configuration reloaded. Rate limiting active at 50 req/sec.\n[UNIT-7]: Floodgates holding. The Anomaly is bottlenecked.",
        errorMessage: "Invalid syntax. Try `nginx -s reload`"
      }
    ]
  }
};
