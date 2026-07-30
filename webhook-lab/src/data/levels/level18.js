export const level18 = {
  id: "level-18",
  title: "Level 18 – Async Processing",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand the difference between synchronous and asynchronous architectures, and why async is mandatory for robust webhook handling.

## Prerequisites
- Level 17 (Message Queues)

## Concept Explanation
When a server processes a request, it can do it in one of two ways:
1. **Synchronous (Blocking)**: The server stops everything it is doing, executes the task from start to finish, and *then* returns a response to the client. The client waits the entire time.
2. **Asynchronous (Non-Blocking)**: The server immediately tells the client, "I got your request and I'll work on it!" (returning a \`202 Accepted\` or \`200 OK\`), and then hands the task off to a background process to finish later.

Because webhooks have strict timeout limits, processing heavy tasks synchronously will cause the provider to assume your server timed out, leading to massive retry loops. You must process heavy tasks asynchronously.

## Real-World Analogy
Think of ordering a custom birthday cake at a bakery.
- **Synchronous**: You place your order, and the baker makes you stand at the counter for 3 hours while they bake it.
- **Asynchronous**: You place your order, the baker gives you a receipt, and you go home. The baker bakes it in the background, and texts you (a webhook!) when it's done.

## Visual Diagram
\`\`\`mermaid
sequenceDiagram
    participant Stripe as Webhook Provider
    participant Receiver as Your Server
    participant Worker as Background Worker

    Stripe->>Receiver: POST /webhook (Heavy Task)
    Note over Receiver: Receiver is Non-Blocking
    Receiver-->>Worker: Offload Task
    Receiver-->>Stripe: HTTP 202 Accepted (Instant!)
    
    Note over Worker: Spends 30 seconds processing...
    Worker-->>Worker: Task Complete
\`\`\`

## Technical Deep Dive: HTTP 202 Accepted
We usually talk about returning a \`200 OK\` for a webhook. However, the technically correct HTTP status code for asynchronous processing is \`202 Accepted\`.
A \`202\` tells the client: *"I have accepted your request, but I have not finished processing it yet. Don't wait for me."* Most webhook providers treat \`200\`, \`201\`, and \`202\` as successful deliveries.

## Code Example
If you don't have a complex Message Queue set up, you can still perform basic asynchronous processing in Node.js by resolving the HTTP request *before* executing the heavy function.

\`\`\`javascript
app.post('/webhook', (req, res) => {
  // 1. Immediately acknowledge the webhook
  res.status(202).send("Accepted for processing");

  // 2. Execute the heavy task in the background
  // Because we already called res.send(), the HTTP connection is closed,
  // but Node.js will continue executing this function!
  generateMassivePDFReport(req.body).then(() => {
    console.log("Background task finished successfully!");
  }).catch((err) => {
    console.error("Background task failed:", err);
  });
});
\`\`\`

## Common Mistakes
- **Assuming async guarantees success:** If you respond with a 202 instantly, the provider thinks the webhook was successful. If your background task crashes 10 seconds later, the provider doesn't know! You must have robust internal error handling and retry logic in your background workers, because the provider won't retry it for you.

## Troubleshooting
- **Memory Leaks in basic async:** If you use the basic Node.js async pattern above during a massive traffic spike, you will spawn 10,000 background tasks simultaneously, crashing your server's RAM. Always use a Message Queue for high-volume async processing.

## Best Practices
- **Separate Microservices:** In enterprise systems, the server running the Webhook Receiver and the server running the Background Worker are entirely different machines. This ensures that heavy processing doesn't steal CPU resources from the receiver.

## Hands-On Lab
*This is a conceptual lesson. Review the Node.js code example above and ensure you understand how the HTTP response is sent before the PDF generation happens.*

## Key Takeaways
1. Synchronous processing blocks the client; Asynchronous processing returns immediately.
2. Webhooks requiring heavy processing must be handled asynchronously.
3. \`202 Accepted\` is the ideal status code to indicate asynchronous processing has begun.

## What's Next
Writing backend code and spinning up queues is hard work. What if you could build complex asynchronous webhook pipelines without writing a single line of code? Next up: **n8n Integration**.
`,
  quiz: {
    question: "Why might returning a `202 Accepted` and processing asynchronously be dangerous if you don't have internal error handling?",
    options: [
      "Because the provider will think the webhook failed and retry it forever.",
      "Because 202 is not a valid HTTP status code.",
      "Because you already told the provider the webhook was successful; if your background task crashes later, the provider won't know, and won't retry sending the data.",
      "Because asynchronous processing automatically deletes the JSON payload."
    ],
    correctAnswerIndex: 2,
    explanation: "When you accept the webhook immediately, you take full responsibility for it. If your background worker crashes, the data is lost unless you have your own internal retry mechanisms (like a Dead Letter Queue)."
  }
};
