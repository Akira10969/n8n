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
  "content": "## Communications Intercept\n**[Sarah]** \"We can't write 50 different API calls to notify every security subsystem. It takes too long. If Node 7 falls, the entire sector needs to lock down in milliseconds.\"\n\n**[UNIT-7]** \"SUGGESTION: Initiate Fan-Out Protocol.\"\n\n## The Fan-Out Pattern\nIn standard queuing, one message goes to one consumer. But in an emergency, we need **Publish/Subscribe (Pub/Sub)** and the **Fan-Out** pattern.\n\n1. **Publish:** The fallen node sends a single `security.breach` event to an Exchange/Topic.\n2. **Fan-Out:** The Exchange duplicates that event.\n3. **Subscribe:** 50 different security queues are bound to that Exchange. They all receive a copy of the event simultaneously.\n\nWebhooks are the ultimate Fan-Out tool. Services like Svix or AWS SNS take one incoming Webhook and \"fan it out\" to hundreds of registered endpoints simultaneously. \n\nBy flipping the switch to Pub/Sub, our single distress signal will instantly trigger a lockdown across the entire Megacity-01 grid.\n\n### Platform Engineer Insight\n**Real-World Context:** When Stripe retries the same payment event five times because of a network flap, idempotency prevents duplicate charges. You always check the database for the event ID before processing.",
  simulator: {
    tasks: [
      {
        command: /^grep\s+["']delivery_success["']\s+\/var\/log\/fanout\.log$/i,
        instruction: 'Analyze the delivery logs to determine how many of the scatter protocol webhooks were successfully delivered.',
        hints: [
          "You need to search the logs for a success indicator.",
          "Use 'cat /var/log/deliveries.log' to read the log.",
          "Pipe the output to 'grep' and search for '200 OK'."
        ],
        solution: 'cat /var/log/deliveries.log | grep "200 OK"',
        successMessage: "[2026-07-31 08:22:01] delivery_success: listener_401\n[2026-07-31 08:22:02] delivery_success: listener_882\n[SARAH]: \"The fan-out is working! The cure is spreading.\"",
        errorMessage: "Invalid syntax. Try `grep \"delivery_success\" /var/log/fanout.log`"
      }
    ]
  }
};
