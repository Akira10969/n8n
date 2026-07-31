export const level22 = {
  "id": "level-22",
  "title": "The Scatter Protocol",
  "type": "theory",
  "briefing": {
    "recap": "The poisoned payloads are safely quarantined in the DLQ. But The Void is moving faster. A single node breach needs to alert the entire grid instantly.",
    "incident": "WARNING: Node 7 has fallen. We need to broadcast the lockdown signal to 50 independent security subsystems simultaneously.",
    "task": "Implement the Fan-Out architectural pattern using webhooks and Pub/Sub.",
    "rewards": {
      "xp": 350,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"We can't write 50 different API calls to notify every security subsystem. It takes too long. If Node 7 falls, the entire sector needs to lock down in milliseconds.\"\n\n**[UNIT-7]** \"SUGGESTION: Initiate Fan-Out Protocol.\"\n\n## The Fan-Out Pattern\nIn standard queuing, one message goes to one consumer. But in an emergency, we need **Publish/Subscribe (Pub/Sub)** and the **Fan-Out** pattern.\n\n1. **Publish:** The fallen node sends a single `security.breach` event to an Exchange/Topic.\n2. **Fan-Out:** The Exchange duplicates that event.\n3. **Subscribe:** 50 different security queues are bound to that Exchange. They all receive a copy of the event simultaneously.\n\nWebhooks are the ultimate Fan-Out tool. Services like Svix or AWS SNS take one incoming webhook and \"fan it out\" to hundreds of registered endpoints simultaneously. \n\nBy flipping the switch to Pub/Sub, our single distress signal will instantly trigger a lockdown across the entire Megacity-01 grid.",
  "quiz": {
    "question": "In the context of webhooks and messaging, what does 'Fan-Out' mean?",
    "options": [
      "Cooling down overheated servers.",
      "Taking a single incoming event and distributing copies of it to multiple different subscribers simultaneously.",
      "Randomly dropping events to save bandwidth.",
      "Fanning the network cables to reduce latency."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Fan-Out is the process of duplicating a single event and broadcasting it to many different consumers via Pub/Sub."
  }
};
