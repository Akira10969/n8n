export const level22 = {
  "id": "level-22",
  "title": "The Scatter Protocol",
  "type": "theory",
  "briefing": {
    "recap": "The poisoned payloads are safely quarantined in the DLQ. But The Anomaly is moving faster. A single node breach needs to alert the entire grid instantly.",
    "incident": "WARNING: Node 7 has fallen. We need to broadcast the lockdown signal to 50 independent security subsystems simultaneously.",
    "task": "Implement the Fan-Out architectural pattern using Webhooks and Pub/Sub.",
    "rewards": {
      "xp": 350,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"We can't write 50 different API calls to notify every security subsystem. It takes too long. If Node 7 falls, the entire sector needs to lock down in milliseconds.\"\n\n**[UNIT-7]** \"SUGGESTION: Initiate Fan-Out Protocol.\"\n\n## The Fan-Out Pattern\nIn standard queuing, one message goes to one consumer. But in an emergency, we need **Publish/Subscribe (Pub/Sub)** and the **Fan-Out** pattern.\n\n1. **Publish:** The fallen node sends a single `security.breach` event to an Exchange/Topic.\n2. **Fan-Out:** The Exchange duplicates that event.\n3. **Subscribe:** 50 different security queues are bound to that Exchange. They all receive a copy of the event simultaneously.\n\nWebhooks are the ultimate Fan-Out tool. Services like Svix or AWS SNS take one incoming Webhook and \"fan it out\" to hundreds of registered endpoints simultaneously. \n\nBy flipping the switch to Pub/Sub, our single distress signal will instantly trigger a lockdown across the entire Megacity-01 grid.\n\n### Platform Engineer Insight\n**What is this concept?** The Fan-Out pattern broadcasts a single message to multiple independent consumers simultaneously.\n**Why is it used?** To allow multiple distinct subsystems to react to the same event without the producer knowing about them.\n**How does it work?** A producer publishes a message to an exchange or topic. The broker duplicates the message to all bound queues or subscribed endpoints.\n**How do we monitor it in production?** We monitor the fan-out latency and track delivery success/failure rates for each downstream subscriber.\n\n### Before You Act: Filtering Logs\n**What is this command?** `grep`\n**Why is it used?** To search plain-text data sets for lines that match a regular expression. In Platform Engineering, it's the fastest way to find specific events (like 'delivery_success') in a log file.\n\n> **SYSTEM ALERT:** Scan the system logs for the successful delivery event to confirm the fan-out worked. Use grep 'delivery_success' on the fanout log.",
  simulator: {
    tasks: [
      {
        command: /^grep\s+["']delivery_success["']\s+\/var\/log\/fanout\.log$/i,
        instruction: 'Analyze the fanout delivery logs to determine how many webhooks were successfully delivered.',
        hints: [
          "How do we filter a log file to only show successful deliveries?",
          "Search the fanout log file for the specific 'delivery_success' indicator.",
          "grep 'delivery_success' /var/log/fanout.log"
        ],
        solution: "grep 'delivery_success' /var/log/fanout.log",
        successMessage: "[2026-07-31 08:22:01] delivery_success: listener_401\n[2026-07-31 08:22:02] delivery_success: listener_882\n[SARAH]: \"The fan-out is working! The cure is spreading.\"",
        errorMessage: "Invalid syntax. Try `grep \"delivery_success\" /var/log/fanout.log`"
      }
    ]
  }
};
