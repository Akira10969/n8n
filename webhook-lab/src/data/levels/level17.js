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
  "content": "## Communications Intercept\n**[UNIT-7]** \"WARNING: Duplicate Webhook payloads detected on the billing endpoint. Account balance for ID #88492 has been deducted 412 times in the last 4 seconds.\"\n\n**[Sarah]** \"Shut it down! It's flooding the network with replays of the exact same event. If we don't fix this, the entire economic grid of Megacity-01 is going to collapse.\"\n\n## The Concept of Idempotency\nIn mathematics and computer science, an operation is **idempotent** if applying it multiple times has the same result as applying it exactly once.\n\nIn the context of Webhooks, you cannot trust that an event will only be sent once. Network retries, bad code, or in this case, malicious entities, might send the exact same `invoice.paid` Webhook multiple times.\n\n### How to achieve Idempotency\n1. **Idempotency Keys:** Every Webhook payload should contain a unique ID (e.g., `event_id: \"evt_9983\"`).\n2. **The Ledger:** Before your consumer processes an event, it checks a database: *\"Have I seen 'evt_9983' before?\"*\n3. **The Block:** If yes, immediately return a `200 OK` without doing anything. If no, save the ID to the database, acknowledge receipt with a `200 OK`, and then process the event **asynchronously** in the background.\n\nBy making our Webhook receivers idempotent and asynchronous, The Anomaly's replay attacks become completely useless. It can send a million duplicate signals; our system will only process the first one, and we won't get bogged down doing heavy processing while the sender waits.\n\n### Platform Engineer Insight\n**What is this concept?** Idempotency — ensuring an operation produces the same result no matter how many times it is applied.\n**Why is it used?** Networks are unreliable. Webhook senders (Stripe, GitHub) guarantee *at-least-once* delivery, meaning the same event may arrive 2, 5, or 50 times during retries. Without idempotency, a payment could be charged multiple times.\n**How does it work?** Every payload contains a unique `event_id`. Before processing, the receiver checks a persistent store (Redis, DB) for that ID. If found, it immediately returns 200 OK and does nothing. If not found, it stores the ID, acknowledges with 200 OK, then processes asynchronously.\n**How do we monitor it in production?** We track the duplicate event rate. A baseline of 1-3% duplicates is normal. A spike to 50%+ means a sender is misconfigured or an active replay attack is underway."

  ,
  simulator: {
    tasks: [
      {
        command: /^redis-cli\s+setnx\s+event_8891\s+["']processed["']$/i,
        instruction: 'Ensure the system processes the event exactly once by acquiring a distributed lock in Redis before proceeding.',
        hints: [
          "How can we atomically claim an event ID so no duplicate worker can process the same event?",
          "Redis has a special 'SET if Not eXists' command (SETNX) that returns 1 only if the key was newly created, and 0 if it already existed — making it perfect for idempotency locks.",
          "Solution: redis-cli setnx event_8891 processed"
        ],
        solution: 'redis-cli SETNX event_8891 locked',
        successMessage: "(integer) 1\n[SARAH]: \"Lock acquired. The event is processing. If a duplicate Webhook arrives, SETNX will return 0 and we can safely ignore it.\"",
        errorMessage: "Invalid syntax. Try `redis-cli setnx event_8891 \"processed\"`"
      }
    ]
  }
};
