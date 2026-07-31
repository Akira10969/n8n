export const level18 = {
  "id": "level-18",
  "title": "The Exponential Backoff",
  "type": "theory",
  "briefing": {
    "recap": "Idempotency keys are successfully blocking the replay attacks. But the network itself is becoming increasingly unstable.",
    "incident": "WARNING: High packet loss detected across Sector 4. Services are dropping connections randomly. Webhook deliveries are failing due to timeouts.",
    "task": "Learn how to handle network instability using intelligent retry mechanisms and Exponential Backoff.",
    "rewards": {
      "xp": 250,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"We're losing connections. Sector 4 just went dark for 10 seconds. Webhooks are failing to deliver. If we just retry them all immediately, we'll accidentally DDoS ourselves when the network comes back up.\"\n\n**[UNIT-7]** \"SUGGESTION: Implement Exponential Backoff algorithm for all retry mechanisms.\"\n\n## Handling Retries Intelligently\nWhen a webhook fails to deliver (e.g., the receiving server returns a `503 Service Unavailable` or times out), the sender must retry. But *how* you retry is critical.\n\n### The Thundering Herd Problem\nIf a server goes down, and 1,000 webhooks fail, and you configure them to all retry exactly 5 seconds later... you will hit the server with 1,000 simultaneous requests the moment it boots up, immediately crashing it again.\n\n### Exponential Backoff\nInstead of a fixed delay, you increase the wait time exponentially after each failure:\n- Retry 1: Wait 2 seconds\n- Retry 2: Wait 4 seconds\n- Retry 3: Wait 8 seconds\n- Retry 4: Wait 16 seconds\n\n### Jitter\nTo prevent multiple retries from syncing up (everyone waiting exactly 8 seconds), we add **Jitter**—a small amount of randomness to the delay (e.g., waiting 8.3 seconds instead of 8.0).\n\nBy implementing Exponential Backoff with Jitter, we allow struggling systems time to breathe and recover.",
  "quiz": {
    "question": "Why is 'Jitter' added to an Exponential Backoff strategy?",
    "options": [
      "To increase the payload size of the webhook.",
      "To introduce randomness so that multiple retries don't happen at the exact same millisecond and crash the server.",
      "To bypass firewall restrictions.",
      "To make the webhooks process faster."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Jitter prevents the 'Thundering Herd' problem by desynchronizing retry attempts."
  }
};
