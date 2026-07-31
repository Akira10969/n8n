export const level21 = {
  "id": "level-21",
  "title": "The Graveyard",
  "type": "theory",
  "briefing": {
    "recap": "We've accepted the eventual consistency. But the queues are starting to back up. Something is jamming the processors.",
    "incident": "CRITICAL: The processing pipelines are stalling. The Anomaly has begun injecting corrupted payloads into the queues. Our parsers are crashing when they hit them, infinitely retrying the bad data.",
    "task": "Deploy a Dead Letter Queue (DLQ) to isolate and quarantine corrupted, unprocessable events.",
    "rewards": {
      "xp": 320,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"The queue just stopped draining! The consumers are choking on something.\"\n\n**[UNIT-7]** \"ANALYSIS: Poison pill detected. The adversary has injected malformed JSON payloads. The consumer attempts to parse it, throws an exception, crashes, reboots, and attempts to parse the exact same payload again. Infinite loop established.\"\n\n## Dead Letter Queues (DLQ)\nWhen a message queue encounters a \"poison pill\" (a message that consistently causes the consumer to fail), it will block all the healthy messages behind it.\n\nTo fix this, we implement a **Dead Letter Queue (DLQ)**.\n1. The consumer tries to process a message.\n2. It fails. The message is pushed back to the queue to retry.\n3. It fails again.\n4. After a set number of max retries (e.g., 5 attempts), the queue removes the message and dumps it into the **DLQ**.\n\nThe DLQ is a graveyard for bad messages. It gets the poison pills out of the main pipeline so healthy traffic can flow again. Engineers can then safely inspect the DLQ later to figure out what went wrong."

  ,
  simulator: {
    tasks: [
      {
        command: /^mei-cli\s+sync\s+run\s+--source\s+stripe\s+--target\s+local_db$/i,
        instruction: "The database has missed webhooks during the downtime. Run a reconciliation sync job to fetch missed events from the source.",
        successMessage: "[OK] Querying Stripe API for events since last sync...\n[OK] 42 missing events found and written to local_db. State reconciled.",
        errorMessage: "Invalid syntax. Try `mei-cli sync run --source stripe --target local_db`"
      }
    ]
  }
};
