export const level9 = {
  id: "level-9",
  title: "Level 9 – Webhook Lifecycle",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand the step-by-step chronological lifecycle of a webhook from the moment an event occurs to the final success acknowledgment.

## Prerequisites
- Level 8 (Webhook Anatomy)

## Concept Explanation
A webhook isn't just a single isolated request; it is a lifecycle consisting of multiple phases:

1. **Trigger**: An event occurs on the provider's platform (e.g., A user merges a pull request on GitHub).
2. **Payload Generation**: The provider's internal system packages the event details into a JSON payload and signs it.
3. **Dispatch**: The provider sends an HTTP POST request to your configured webhook URL.
4. **Receipt & Validation**: Your server receives the request, parses the JSON, and mathematically verifies the security signature.
5. **Acknowledgment**: Your server immediately returns a \`200 OK\` HTTP response to tell the provider, "I got it, thanks!"
6. **Processing**: Your server executes the actual business logic (e.g., updating a database, triggering a deployment).

## Real-World Analogy
Imagine a fast-food drive-thru.
1. **Trigger**: You place your order at the speaker.
2. **Payload**: The cashier types your order into the register.
3. **Dispatch**: The kitchen printer prints the ticket.
4. **Receipt**: The chef grabs the ticket.
5. **Acknowledgment**: The chef shouts "Order up!" so the cashier knows they are working on it.
6. **Processing**: The chef actually cooks the burger.

## Visual Diagram
\`\`\`mermaid
sequenceDiagram
    participant User
    participant Provider as Webhook Provider
    participant Receiver as Your Server

    User->>Provider: Action (Buy Item)
    Note over Provider: Generate Payload & Signature
    Provider->>Receiver: POST /webhook
    Note over Receiver: Verify Signature
    Receiver-->>Provider: HTTP 2xx (Acknowledge)
    Note over Receiver: Execute Database Logic
\`\`\`

## Technical Deep Dive: Acknowledgment vs Processing
The most critical rule in the webhook lifecycle is separating Step 5 (Acknowledgment) from Step 6 (Processing). 
Providers have aggressive timeout limits. Stripe, for example, expects a \`200 OK\` response within seconds. If you try to do heavy database processing *before* you return the 200 OK, Stripe will assume your server crashed, mark the webhook as failed, and retry it later, leading to duplicate orders!

## Code Example
Notice how the response is sent *before* the heavy processing happens.

\`\`\`javascript
app.post('/webhook', (req, res) => {
  // 1. Verify signature (Fast)
  const isValid = verifySignature(req);
  if (!isValid) return res.status(401).send();

  // 2. Acknowledge IMMEDIATELY (Fast)
  res.status(200).send("Webhook received");

  // 3. Process asynchronously (Slow)
  setTimeout(() => {
    generateLargePDFReport(req.body);
  }, 0);
});
\`\`\`

## Common Mistakes
- **Putting the \`res.send()\` at the very bottom of the function:** If you put the response after a slow database query, you will experience random timeout failures under heavy load.

## Troubleshooting
- **Provider says "Timeout" but your code ran successfully?** You are acknowledging too late in the lifecycle. Move your \`res.status(200)\` higher up in your route handler.

## Best Practices
- **Use Message Queues:** Instead of \`setTimeout\`, true production systems drop the payload into a Message Queue (like RabbitMQ or Redis) instantly, and let a separate background worker process it. We will cover this in Level 17!

## Hands-On Lab
*Think about how long your current API endpoints take to resolve. Any endpoint taking longer than 2 seconds is not suitable for synchronous webhook processing.*

## Key Takeaways
1. The lifecycle is: Trigger -> Generate -> Dispatch -> Acknowledge -> Process.
2. Acknowledgment (returning 200 OK) must happen as fast as possible.
3. Heavy processing should always be done asynchronously in the background.

## What's Next
Now you know *how* to receive a webhook correctly. In the next level, we will look at the tools and frameworks used to actually build a Webhook Receiver.
`,
  quiz: {
    question: "Why is it critical to separate the Acknowledgment step from the Processing step in the webhook lifecycle?",
    options: [
      "Because processing JSON data automatically corrupts HTTP responses.",
      "Because providers have strict timeout limits; if you process heavy data before acknowledging, the provider will assume failure and retry the webhook.",
      "Because webhooks must be acknowledged using a GET request, but processed using a POST request.",
      "It is not critical; you should always finish processing before acknowledging."
    ],
    correctAnswerIndex: 1,
    explanation: "If you block the HTTP response while doing a 10-second database query, the webhook provider will time out, assume your server is down, and blast you with retry attempts."
  }
};
