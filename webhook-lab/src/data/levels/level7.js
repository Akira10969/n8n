export const level7 = {
  id: "level-7",
  title: "Level 7 – Intro to Webhooks",
  type: "visual-flow",
  content: `
## Learning Objectives
By the end of this level, you will understand what a webhook is, why it was invented, and how it differs from traditional API polling.

## Prerequisites
- Level 1-6 (HTTP, REST, and JSON)

## Concept Explanation
A **Webhook** is an automated message sent from one app to another when something happens. They are sometimes called "Reverse APIs."

### The Core Difference: Webhooks vs APIs
To truly understand webhooks, you must understand how they differ from traditional APIs:

| Feature | Standard REST API | Webhook |
|---------|-------------------|---------|
| **Direction** | Client pulls data from Server | Server pushes data to Client |
| **Trigger** | Triggered by your code | Triggered by a remote event |
| **Pacing** | You ask for updates (Polling) | You receive updates instantly |
| **Metaphor** | Asking "Are we there yet?" | The driver saying "We arrived!" |

This enables **Event-Driven Architecture**. Instead of constantly asking "Did someone buy my product?", you simply tell Shopify, "Here is my URL. Send an HTTP POST request to it the exact second a purchase is made."

## Real-World Analogy
Imagine you are waiting for an important package to arrive at the post office.
- **Polling (Standard API)**: You call the post office every 10 minutes and ask, "Is it here yet?" Most of the time they say "No." You are wasting your time and their time.
- **Webhook**: You go to the post office once, give them your phone number, and say, "Text me the second it arrives." You can now relax, and the communication only happens when the event actually occurs.

## Visual Diagram
\`\`\`mermaid
sequenceDiagram
    participant User
    participant Provider as Webhook Provider (e.g. GitHub)
    participant Receiver as Your Server

    User->>Provider: Commits Code
    Provider-->>Provider: Detects 'push' event
    Provider->>Receiver: HTTP POST (Webhook Payload JSON)
    Receiver-->>Provider: HTTP 200 OK
    Receiver-->>Receiver: Process data (e.g., Deploy code)
\`\`\`

## Technical Deep Dive: Polling vs Webhooks
While webhooks are incredibly efficient, they require you to have a server running 24/7 on the public internet, ready to receive incoming POST requests. 
Polling, on the other hand, allows you to pull data on *your* schedule. If your server is turned off for 5 hours, you can just poll the API when you turn it back on. If you miss a webhook while your server is down, that data might be lost (unless the provider has retry logic).

## Code Example
When you register a webhook with a provider (like Stripe), you are literally just giving them a URL to your server.

\`\`\`javascript
// Your server code listening for the Webhook
app.post('/stripe-webhook', (req, res) => {
  const event = req.body; // The JSON payload Stripe sent you
  
  if (event.type === 'payment_intent.succeeded') {
    console.log("Payment successful! Fulfilling order...");
  }

  // You MUST send a 200 OK back to Stripe quickly!
  res.status(200).send(); 
});
\`\`\`

## Common Mistakes
- **Using a localhost URL:** You cannot tell GitHub to send a webhook to \`http://localhost:3000\`. GitHub is on the public internet and cannot see your personal laptop. You must provide a publicly routable URL (or use a tool like ngrok).
- **Taking too long to respond:** Webhook providers expect you to respond with a \`200 OK\` almost immediately (usually within 3 seconds). If your server takes 10 seconds to process the data before responding, the provider will assume the webhook failed.

## Troubleshooting
- **Not receiving webhooks?** Check the provider's developer dashboard. They usually have a "Logs" section showing exactly what they sent and the error code your server returned.

## Best Practices
- **Respond immediately, process later:** When your server receives a webhook, immediately return \`200 OK\`, and then process the heavy data in the background (Asynchronous Processing).

## Hands-On Lab
*(See the interactive visual workflow below to understand the concept of Polling vs Webhooks!)*

## Key Takeaways
1. Webhooks push data to you when an event occurs, eliminating the need to poll.
2. Webhooks are almost universally sent as HTTP POST requests with a JSON body.
3. You must have a publicly accessible server to receive webhooks.

## What's Next
Now that you know what a webhook is conceptually, let's break down the exact anatomy of the request that the provider sends you.
`,
  quiz: {
    question: "Why are webhooks vastly more efficient than API Polling?",
    options: [
      "Because webhooks are encrypted using military-grade AES-256.",
      "Because polling requires you to constantly ask the server if an event happened (wasting bandwidth), whereas webhooks only send data when the event actually occurs.",
      "Because webhooks compress the JSON payload automatically.",
      "Because webhooks bypass the internet and use direct satellite connections."
    ],
    correctAnswerIndex: 1,
    explanation: "Polling wastes huge amounts of bandwidth and CPU cycles asking for updates when nothing has changed. Webhooks are event-driven, acting only when necessary."
  }
};
