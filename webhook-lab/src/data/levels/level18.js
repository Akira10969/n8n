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
  "content": "## Communications Intercept\n**[Sarah]** \"We're losing connections. Sector 4 just went dark for 10 seconds. Webhooks are failing to deliver. If we just retry them all immediately, we'll accidentally DDoS ourselves when the network comes back up.\"\n\n**[UNIT-7]** \"SUGGESTION: Implement Exponential Backoff algorithm for all retry mechanisms.\"\n\n## Handling Retries Intelligently\nWhen a Webhook fails to deliver (e.g., the receiving server returns a `503 Service Unavailable` or times out), the sender must retry. But *how* you retry is critical.\n\n### The Thundering Herd Problem\nIf a server goes down, and 1,000 Webhooks fail, and you configure them to all retry exactly 5 seconds later... you will hit the server with 1,000 simultaneous requests the moment it boots up, immediately crashing it again.\n\n### Exponential Backoff\nInstead of a fixed delay, you increase the wait time exponentially after each failure:\n- Retry 1: Wait 2 seconds\n- Retry 2: Wait 4 seconds\n- Retry 3: Wait 8 seconds\n- Retry 4: Wait 16 seconds\n\n### Jitter\nTo prevent multiple retries from syncing up (everyone waiting exactly 8 seconds), we add **Jitter**—a small amount of randomness to the delay (e.g., waiting 8.3 seconds instead of 8.0).\n\nBy implementing Exponential Backoff with Jitter, we allow struggling systems time to breathe and recover.\n\n### Platform Engineer Insight\n**Reliability:** Exponential Backoff is built into the sender side of systems like GitHub and Stripe. If your system goes down, they will try again later. But as a Receiver, you must monitor your queue depth so you aren't overwhelmed when you come back online and receive all the delayed Webhooks at once.",
  simulator: {
    tasks: [
      {
        command: /^cat\s+\/etc\/mei\/backoff_config\.yaml\s+\|\s+grep\s+max_retries$/i,
        instruction: "Check the backoff configuration. Pipe the config file into grep to find the 'max_retries' value.",
        successMessage: "max_retries: 10\nexponential_multiplier: 2.0\n[SARAH]: \"Alright, 10 retries with an exponential backoff. That will stop the DoS loop.\"",
        errorMessage: "Invalid syntax. Try `cat /etc/mei/backoff_config.yaml | grep max_retries`"
      }
    ]
  }
};
