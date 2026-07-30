export const level12 = {
  id: "level-12",
  title: "Level 12 – Webhook Testing",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how to simulate, test, and expose local webhook receivers using tunneling software and HTTP clients.

## Prerequisites
- Level 10 (Webhook Receiver)

## Concept Explanation
When developing a webhook receiver, you need to test it before deploying it to a production server. Testing involves two distinct challenges:
1. **Generating the Payload:** How do you mimic the JSON that Stripe or GitHub sends?
2. **Receiving the Request:** How does Stripe or GitHub reach your \`localhost:3000\` server while you are still writing the code?

### Generating Payloads
To simulate a webhook, you can use an HTTP Client like **Postman**, **Insomnia**, or **curl**. You simply copy an example JSON payload from the provider's documentation and send it to your server as a POST request.

### Receiving Requests Locally
To let external services talk to your laptop, you use **Local Tunneling**. A tunneling service runs a small background app on your computer. It gives you a public URL (e.g., \`https://xyz.ngrok.io\`). Any HTTP request that hits that public URL is securely forwarded over the internet, through the tunnel, and directly to your \`localhost\` server.

## Real-World Analogy
Local tunneling is like setting up a mail forwarding service.
Your house (localhost) is off the grid and doesn't have a recognizable address. So, you rent a PO Box in the city (\`ngrok.io\`). The sender (GitHub) drops the package off at the PO Box, and the postmaster immediately drives it straight to your secret off-grid house.

## Visual Diagram
\`\`\`mermaid
graph LR
    A[Stripe] -- POST to ngrok.io URL --> B((Ngrok Cloud Server))
    B -- Secure Tunnel --> C[Ngrok CLI on your laptop]
    C -- Forwards to Port 3000 --> D[Your Node.js Server]
\`\`\`

## Technical Deep Dive: Tunneling Security
Is it safe to expose your localhost to the public internet?
Generally, yes, if done temporarily. Tools like ngrok use secure WebSocket connections to forward traffic. The traffic is encrypted, and only the specific port you choose (e.g., 3000) is exposed. However, anyone who guesses your ngrok URL can hit your server, so you must still implement authentication (Level 14) and close the tunnel when you are done testing.

## Code Example
Simulating a webhook locally using \`curl\`:

\`\`\`bash
# 1. Start your tunneling software (exposes port 3000)
ngrok http 3000
# Ngrok outputs: Forwarding https://abc.ngrok.io -> http://localhost:3000

# 2. Tell Stripe to send webhooks to https://abc.ngrok.io/webhook

# 3. Simulate it manually using curl
curl -X POST http://localhost:3000/webhook \\
     -H "Content-Type: application/json" \\
     -d '{"type": "user.created", "id": 123}'
\`\`\`

## Common Mistakes
- **Testing with outdated payloads:** Provider APIs evolve. If you test your code using a JSON payload from a 2018 StackOverflow post, it will likely break in production because the provider has added or removed fields since then. Always use official docs.
- **Forgetting to update the URL:** Every time you restart ngrok on the free tier, your URL changes. You must remember to update it in the provider's dashboard!

## Troubleshooting
- **Ngrok says 502 Bad Gateway?** This means the traffic successfully reached your laptop, but your Node.js server isn't running, or it crashed. Ngrok has nothing to forward the traffic to!

## Best Practices
- **Use Webhook.site:** If you just want to see what a provider's payload looks like without writing *any* code, use a free service like [Webhook.site](https://webhook.site). It gives you a temporary URL that logs every incoming request to a visual dashboard.

## Hands-On Lab
*Try visiting webhook.site right now! Copy the unique URL they give you, and use your terminal to \`curl\` it. You will see the request instantly appear on the website.*

## Key Takeaways
1. You can manually simulate webhooks using tools like Postman or curl.
2. Local tunneling tools (like ngrok or localtunnel) allow external services to hit your laptop during development.
3. Always test against the most recent payload structures provided in official documentation.

## What's Next
Now you can test webhooks on your machine. But what happens when things go wrong in production? Next up: **Webhook Debugging**.
`,
  quiz: {
    question: "If your webhook receiver is running on your laptop at 'http://localhost:3000', why do you need a tool like ngrok to test it with GitHub?",
    options: [
      "Because GitHub only understands GraphQL.",
      "Because localhost is a private address. Ngrok provides a public URL that forwards traffic from the public internet directly to your laptop's local port.",
      "Because ngrok automatically generates the JSON payloads for you.",
      "Because local servers do not support POST requests."
    ],
    correctAnswerIndex: 1,
    explanation: "External services cannot route traffic to 'localhost'. Tunneling tools solve this by providing a publicly accessible proxy URL."
  }
};
