export const level20 = {
  id: "level-20",
  title: "Level 20 – Popular Providers",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how different major platforms implement webhooks, and why you must read the documentation for every new integration.

## Prerequisites
- Level 1-19 

## Concept Explanation
There is **no universal standard** for webhooks. 
Every major tech company implemented webhooks slightly differently depending on their specific architectural needs when they built them.

- **Stripe**: Sends massive "fat" payloads containing every detail of the payment. Uses HMAC-SHA256 signatures with a timestamp to prevent replay attacks. Highly reliable retry logic.
- **GitHub**: Allows you to subscribe to incredibly granular events (e.g., \`pull_request.review_requested\`). Uses a \`X-Hub-Signature-256\` header.
- **Shopify**: Sends webhooks for e-commerce events (e.g., \`orders/create\`). Requires you to respond with a 200 OK within 5 seconds, or they will aggressively back off and eventually delete the webhook subscription entirely!
- **Twilio**: (Older API) Often sends SMS data as \`application/x-www-form-urlencoded\` instead of JSON. You can respond with "TwiML" (an XML format) directly in the HTTP response to trigger an immediate SMS reply.

## Real-World Analogy
Imagine traveling Europe. Every country uses different electrical outlets, speaks a different language, and has different speed limits. You can't just plug your hairdryer into a wall in the UK if you just came from France. 
Similarly, you cannot point a Stripe webhook receiver at GitHub and expect it to work. You must build specific adapters (routes) for each provider.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Internet] --> B{Your Express Server}
    
    B -- /webhooks/stripe --> C[Stripe Middleware: JSON & HMAC-SHA256]
    B -- /webhooks/github --> D[GitHub Middleware: JSON & X-Hub-Signature]
    B -- /webhooks/twilio --> E[Twilio Middleware: URL-Encoded & Custom Auth]
\`\`\`

## Technical Deep Dive: Standardizing Inbound Data
Because every provider sends differently structured JSON, enterprise systems use a **Normalization Layer**. 
When a Stripe webhook arrives with \`{"customer_name": "Jem"}\`, and a Shopify webhook arrives with \`{"buyer": {"first_name": "Jem"}}\`, the Normalization Layer maps both of those unique formats into a standardized internal object: \`{"internal_user_name": "Jem"}\`. This way, the rest of your microservices only ever have to understand your internal format, rather than having to know about Stripe or Shopify.

## Code Example
Notice how you have to handle different signature verification methods for different providers:

\`\`\`javascript
// Stripe uses their official SDK to verify
app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_SECRET);
  // ...
});

// GitHub requires you to use the standard Node Crypto library
app.post('/webhook/github', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['x-hub-signature-256'];
  const myHash = 'sha256=' + crypto.createHmac('sha256', GITHUB_SECRET).update(req.body).digest('hex');
  if (sig !== myHash) throw new Error("Invalid GitHub Signature!");
  // ...
});
\`\`\`

## Common Mistakes
- **Assuming the provider will retry forever:** Every provider has a limit. Shopify gives up after 48 hours. Stripe gives up after 3 days. If your server is broken for a week, that data is permanently lost unless you manually reconcile it via an API script.

## Troubleshooting
- **Webhook works with one provider but not another?** You likely have a global middleware (like \`express.json()\`) that is breaking the raw payload verification for a provider that requires the raw string buffer.

## Best Practices
- **Read the Docs!** Before writing a single line of code, spend 20 minutes reading the provider's specific "Webhooks" documentation page. Look for their timeout limits, retry schedules, and signature algorithms.

## Hands-On Lab
*Open a new tab and search for "Stripe Webhooks Documentation" or "GitHub Webhooks Documentation". Notice how detailed they are about their specific security implementations.*

## Key Takeaways
1. There is no universal standard for webhooks.
2. Every provider has different payload structures, security headers, and retry limits.
3. You must use different routing endpoints to handle different providers cleanly.

## What's Next
As your webhook infrastructure grows, managing all these servers and connections gets complicated. Next, we look at **Infrastructure & Networking**.
`,
  quiz: {
    question: "Why do enterprise systems often use a 'Normalization Layer' when receiving webhooks from multiple different providers (like Stripe, Shopify, and PayPal)?",
    options: [
      "Because normalization encrypts the data to comply with government regulations.",
      "To map the vastly different JSON structures from different providers into a single, standardized internal format so the rest of the backend only has to understand one format.",
      "Because normalization automatically verifies HMAC signatures for all providers simultaneously.",
      "Because it forces the providers to send XML instead of JSON."
    ],
    correctAnswerIndex: 1,
    explanation: "Normalization acts as a translator. It takes Stripe's specific language and Shopify's specific language and translates them both into your company's internal language."
  }
};
