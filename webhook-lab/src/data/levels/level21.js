export const level21 = {
  "id": "level-21",
  "title": "The Graveyard",
  "type": "theory",
  "briefing": {
    "recap": "We've accepted the eventual consistency. But the queues are starting to back up. Something is jamming the processors.",
    "incident": "CRITICAL: The processing pipelines are stalling. The Void has begun injecting corrupted payloads into the queues. Our parsers are crashing when they hit them, infinitely retrying the bad data.",
    "task": "Deploy a Dead Letter Queue (DLQ) to isolate and quarantine corrupted, unprocessable events.",
    "rewards": {
      "xp": 320,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"The queue just stopped draining! The consumers are choking on something.\"\n\n**[UNIT-7]** \"ANALYSIS: Poison pill detected. The adversary has injected malformed JSON payloads. The consumer attempts to parse it, throws an exception, crashes, reboots, and attempts to parse the exact same payload again. Infinite loop established.\"\n\n## Dead Letter Queues (DLQ)\nWhen a message queue encounters a \"poison pill\" (a message that consistently causes the consumer to fail), it will block all the healthy messages behind it.\n\nTo fix this, we implement a **Dead Letter Queue (DLQ)**.\n1. The consumer tries to process a message.\n2. It fails. The message is pushed back to the queue to retry.\n3. It fails again.\n4. After a set number of max retries (e.g., 5 attempts), the queue removes the message and dumps it into the **DLQ**.\n\nThe DLQ is a graveyard for bad messages. It gets the poison pills out of the main pipeline so healthy traffic can flow again. Engineers can then safely inspect the DLQ later to figure out what went wrong.",
  "quiz": {
    "question": "What is the primary function of a Dead Letter Queue (DLQ)?",
    "options": [
      "To permanently delete all old data.",
      "To quarantine unprocessable messages so they don't block the rest of the queue.",
      "To encrypt messages before they are processed.",
      "To speed up the processing of normal messages."
    ],
    "correctAnswerIndex": 1,
    "explanation": "A DLQ isolates 'poison pill' messages that repeatedly fail, keeping the main queue flowing."
  }
};
