export const level17 = {
  "id": "level-17",
  "title": "Echoes in the Wire",
  "type": "theory",
  "briefing": {
    "recap": "We successfully decentralized the remaining core services. But our adversary has adapted to the new architecture.",
    "incident": "CRITICAL: The network is flooding with duplicate events. Payment confirmations are being processed 5, 10, even 50 times. The Anomaly is using replay attacks to bankrupt our resources.",
    "task": "Understand and implement Idempotency to ensure duplicate events do not result in duplicate actions.",
    "rewards": {
      "xp": 220,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[UNIT-7]** \"WARNING: Duplicate webhook payloads detected on the billing endpoint. Account balance for ID #88492 has been deducted 412 times in the last 4 seconds.\"\n\n**[Sarah]** \"Shut it down! It's flooding the network with replays of the exact same event. If we don't fix this, the entire economic grid of Megacity-01 is going to collapse.\"\n\n## The Concept of Idempotency\nIn mathematics and computer science, an operation is **idempotent** if applying it multiple times has the same result as applying it exactly once.\n\nIn the context of webhooks, you cannot trust that an event will only be sent once. Network retries, bad code, or in this case, malicious entities, might send the exact same `invoice.paid` webhook multiple times.\n\n### How to achieve Idempotency\n1. **Idempotency Keys:** Every webhook payload should contain a unique ID (e.g., `event_id: \"evt_9983\"`).\n2. **The Ledger:** Before your consumer processes an event, it checks a database: *\"Have I seen 'evt_9983' before?\"*\n3. **The Block:** If yes, immediately return a `200 OK` without doing anything. If no, process the event and save the ID to the database.\n\nBy making our webhook receivers idempotent, The Anomaly's replay attacks become completely useless. It can send a million duplicate signals; our system will only process the first one."

  ,
  simulator: {
    tasks: [
      {
        command: /^redis-cli\s+setnx\s+event_8891\s+["']processed["']$/i,
        instruction: "Ensure idempotency by setting a distributed lock for event_8891. Use Redis SETNX (Set if Not eXists).",
        successMessage: "(integer) 1\n[SARAH]: \"Lock acquired. The event is processing. If a duplicate webhook arrives, SETNX will return 0 and we can safely ignore it.\"",
        errorMessage: "Invalid syntax. Try `redis-cli setnx event_8891 \"processed\"`"
      }
    ]
  }
};
