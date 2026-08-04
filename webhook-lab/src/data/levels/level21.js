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
  "content": "## Communications Intercept\n**[Sarah]** \"The queue just stopped draining! The consumers are choking on something.\"\n\n**[UNIT-7]** \"ANALYSIS: Poison pill detected. The adversary has injected malformed JSON payloads. The consumer attempts to parse it, throws an exception, crashes, reboots, and attempts to parse the exact same payload again. Infinite loop established.\"\n\n## Dead Letter Queues (DLQ)\nWhen a message queue encounters a \"poison pill\" (a message that consistently causes the consumer to fail), it will block all the healthy messages behind it.\n\nTo fix this, we implement a **Dead Letter Queue (DLQ)**.\n1. The consumer tries to process a message.\n2. It fails. The message is pushed back to the queue to retry.\n3. It fails again.\n4. After a set number of max retries (e.g., 5 attempts), the queue removes the message and dumps it into the **DLQ**.\n\nThe DLQ is a graveyard for bad messages. It gets the poison pills out of the main pipeline so healthy traffic can flow again. Engineers can then safely inspect the DLQ later to figure out what went wrong.\n\n### Platform Engineer Insight\n**What is this concept?** A Dead Letter Queue (DLQ) is a secondary queue where messages are routed if they cannot be processed successfully after a certain number of retries.\n**Why is it used?** To prevent \"poison pills\" (bad messages) from endlessly blocking the main processing pipeline while still preserving the message for debugging.\n**How does it work?** The message broker tracks delivery attempts. When the maximum retry count is reached, it automatically moves the message from the main queue to the DLQ.\n**How do we monitor it in production?** We set critical alerts on the DLQ depth. Any message entering a DLQ requires human investigation to fix the bug and optionally replay the message.\n\n### Before You Act: Executing Node Scripts\n**What is this command?** `npm run`\n**Why is it used?** To execute scripts defined in the `package.json` file.\n**Important Syntax:** The `--` separator is used to pass arguments down to the underlying script. For example, `npm run reconcile -- --source stripe` passes `--source stripe` directly to the reconcile script.\n\n> **SYSTEM ALERT:** Execute the reconcile script on the stripe source to fix the race condition. Use npm run reconcile."

  ,
  simulator: {
    tasks: [
      {
        command: /^npm\s+run\s+reconcile\s+--\s+--source\s+stripe$/i,
        instruction: 'Run a reconciliation sync job to fetch missed events from the stripe source provider.',
        hints: [
          "How do we trigger the script that recovers missed events from the external source?",
          "Run the reconciliation script using npm and pass the source argument for stripe.",
          "npm run reconcile -- --source stripe"
        ],
        solution: 'npm run reconcile',
        successMessage: "[OK] Querying Stripe API for events since last sync...\n[OK] 42 missing events found and written to local_db. State reconciled.",
        errorMessage: "Invalid syntax. Try `npm run reconcile -- --source stripe`"
      }
    ]
  }
};
