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
  "content": "## Communications Intercept\n**[UNIT-7]** \"WARNING: Duplicate Webhook payloads detected on the billing endpoint. Account balance for ID #88492 has been deducted 412 times in the last 4 seconds.\"\n\n**[Sarah]** \"Shut it down! It's flooding the network with replays of the exact same event. If we don't fix this, the entire economic grid of Megacity-01 is going to collapse.\"\n\n## The Concept of Idempotency\nIn mathematics and computer science, an operation is **idempotent** if applying it multiple times has the same result as applying it exactly once.\n\nIn the context of Webhooks, you cannot trust that an event will only be sent once. Network retries, bad code, or in this case, malicious entities, might send the exact same `invoice.paid` Webhook multiple times.\n\n### How to achieve Idempotency\n1. **Idempotency Keys:** Every Webhook payload should contain a unique ID (e.g., `event_id: \"evt_9983\"`).\n2. **The Ledger:** Before your consumer processes an event, it checks a database: *\"Have I seen 'evt_9983' before?\"*\n3. **The Block:** If yes, immediately return a `200 OK` without doing anything. If no, save the ID to the database, acknowledge receipt with a `200 OK`, and then process the event **asynchronously** in the background.\n\nBy making our Webhook receivers idempotent and asynchronous, The Anomaly's replay attacks become completely useless. It can send a million duplicate signals; our system will only process the first one, and we won't get bogged down doing heavy processing while the sender waits."

  ,
  simulator: {
    tasks: [
      {
        command: /^redis-cli\s+setnx\s+event_8891\s+["']processed["']$/i,
        instruction: 'Ensure the system processes the event exactly once by acquiring a distributed lock in Redis before proceeding.',
        hints: [
          "You need to use the 'redis-cli' command.",
          "The command to set a key only if it doesn't exist is 'SETNX'.",
          "The key is 'event_8891' and the value can be 'locked'."
        ],
        solution: 'redis-cli SETNX event_8891 locked',
        successMessage: "(integer) 1\n[SARAH]: \"Lock acquired. The event is processing. If a duplicate Webhook arrives, SETNX will return 0 and we can safely ignore it.\"",
        errorMessage: "Invalid syntax. Try `redis-cli setnx event_8891 \"processed\"`"
      }
    ]
  }
};
