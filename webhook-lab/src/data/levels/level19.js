export const level19 = {
  "id": "level-19",
  "title": "The Buffer Zone",
  "type": "theory",
  "briefing": {
    "recap": "Exponential backoff has stabilized our retry logic, preventing self-inflicted DDoS attacks. But the sheer volume of incoming events is overwhelming the parsers.",
    "incident": "CRITICAL: The ingestion rate has exceeded processing capacity by 400%. The Analytics service is out of memory and crashing.",
    "task": "Introduce a Message Queue architecture to decouple ingestion speed from processing speed.",
    "rewards": {
      "xp": 280,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"The Analytics service can only process 500 events a second. The Void is hammering the gateway with 5,000 events a second. The service is drowning!\"\n\n**[UNIT-7]** \"ANALYSIS: Ingestion rate exceeds processing capacity. Recommendation: Deploy an asynchronous Message Queue.\"\n\n## Message Queues (The Buffer)\nWhen building Event-Driven architectures, a Producer shouldn't send webhooks *directly* to a slow Consumer. Instead, we put a **Message Queue** (like Kafka, RabbitMQ, or AWS SQS) in the middle.\n\n1. **Ingestion:** The Producer dumps events into the Queue as fast as possible. Queues are designed to accept millions of messages per second.\n2. **Processing:** The Consumer reads from the Queue at its own pace. If it can only handle 500 events a second, it simply pulls 500 events a second.\n\n### Decoupling Time\nA queue decouples systems *in time*. If the Consumer crashes and is offline for an hour, the Producer keeps dumping events into the queue. When the Consumer reboots, it just picks up exactly where it left off. No data is lost.\n\nWe are deploying a massive RabbitMQ cluster to act as a buffer. Let the Void hammer the gateway; the queue will catch it all, and our services will process it at their own pace.",
  "quiz": {
    "question": "How does a Message Queue protect a slow Consumer?",
    "options": [
      "By automatically deleting excess messages to save space.",
      "By absorbing incoming events at high speeds and allowing the Consumer to pull them at its own manageable pace.",
      "By increasing the RAM of the Consumer automatically.",
      "By encrypting the events so they take up less memory."
    ],
    "correctAnswerIndex": 1,
    "explanation": "Queues act as shock absorbers, safely storing bursts of traffic so slow consumers don't get overwhelmed."
  }
};
