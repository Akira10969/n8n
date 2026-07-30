export const level15 = {
  id: "level-15",
  title: "Level 15 – Reliability",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how to design webhook architectures that survive server crashes, network outages, and duplicate deliveries using Retry Logic and Idempotency.

## Prerequisites
- Level 14 (Webhook Security)

## Concept Explanation
The internet is inherently unreliable. Servers crash, databases reboot, and network connections drop. If a provider sends you a webhook and your server is offline, what happens? Do you just lose that data forever?

In a robust webhook ecosystem, providers implement **Retry Logic** using **Exponential Backoff**. 
If they send a POST request and your server returns a 500 Error (or doesn't respond at all), they will try again. But instead of hammering your broken server every second, they back off exponentially:
- Retry 1: 1 minute later
- Retry 2: 2 minutes later
- Retry 3: 4 minutes later
- Retry 4: 8 minutes later... up to a maximum limit (e.g., 3 days).

## Real-World Analogy
Imagine trying to call your friend, but they don't answer.
You don't redial their number 10,000 times a second; that would crash their phone. You call them, wait 5 minutes, call again, wait 15 minutes, call again, wait an hour, call again. This gives them time to turn their phone back on or finish whatever was distracting them.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Stripe Sends Webhook] --> B{Your Server Status}
    B -- 500 Error (Crashed) --> C[Wait 1 Minute]
    C --> D[Retry Webhook]
    D -- 500 Error --> E[Wait 2 Minutes]
    E --> F[Retry Webhook]
    F -- 200 OK --> G[Success!]
\`\`\`

## Technical Deep Dive: Idempotency
Because of retry logic, your server *will* occasionally receive the exact same webhook multiple times. Sometimes, network lag causes the provider to assume you didn't receive it, even though you did, so they send it again!

Your webhook receiver must be **Idempotent**. This means processing the same webhook twice has the exact same effect as processing it once.
To do this, you store the unique Webhook Event ID in your database as soon as you process it. Whenever a new webhook arrives, you check the database. If the ID is already there, you just return a \`200 OK\` and ignore the payload.

## Code Example
Implementing Idempotency in a Node.js route:

\`\`\`javascript
app.post('/webhook', async (req, res) => {
  const eventId = req.body.id; // e.g., "evt_12345"
  
  // 1. Check if we already processed this event
  const alreadyProcessed = await db.checkIfExists(eventId);
  
  if (alreadyProcessed) {
    console.log("Duplicate webhook received, ignoring...");
    return res.status(200).send(); // Acknowledge safely
  }

  // 2. Execute business logic...
  await db.updateUserBalance(req.body.amount);
  
  // 3. Mark as processed so future duplicates are ignored
  await db.markAsProcessed(eventId);
  
  res.status(200).send();
});
\`\`\`

## Common Mistakes
- **Assuming webhooks always arrive in chronological order:** Due to retries, a "Subscription Canceled" webhook might arrive *before* the "Subscription Created" webhook. Your system must handle out-of-order events intelligently!

## Troubleshooting
- **Customers getting charged twice?** Your webhook receiver is not idempotent. You are processing duplicate webhook retries as if they were brand new events.

## Best Practices
- **Use a Dead Letter Queue (DLQ):** If a webhook fails 10 retries over 3 days, the provider gives up. A professional system provides a dashboard where developers can manually inspect these permanently failed webhooks (the "Dead Letters") and decide how to fix the data manually.

## Hands-On Lab
*No lab here, but think about your own API routes. Are they idempotent? If a user clicks the "Submit Payment" button twice because the UI lagged, will they be charged twice?*

## Key Takeaways
1. Providers use Exponential Backoff to retry failed webhooks safely.
2. Retry logic guarantees that you *will* receive duplicate webhooks.
3. Your receiver must be Idempotent to handle duplicates without corrupting your database.

## What's Next
We know how to build a reliable receiver. But what if your single server isn't enough to handle the volume? Next, we scale up to **Event-Driven Architecture**.
`,
  quiz: {
    question: "Why do webhook providers use 'Exponential Backoff' when retrying failed webhooks, rather than retrying every 1 second continuously?",
    options: [
      "To save money on AWS billing.",
      "Because retrying every 1 second would DDoS (overload) a server that is already struggling or crashing, making the outage much worse.",
      "Because webhooks are legally required to wait before retrying.",
      "Because exponential backoff automatically decrypts the payload."
    ],
    correctAnswerIndex: 1,
    explanation: "If your server is crashing under heavy load, blasting it with instantaneous retries will only ensure it stays down permanently. Backing off exponentially gives it time to recover."
  }
};
