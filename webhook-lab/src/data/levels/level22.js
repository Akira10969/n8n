export const level22 = {
  id: "level-22",
  title: "Level 22 – Serverless Functions",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how Serverless architecture eliminates the need for managing infrastructure when building webhook receivers, and why it is the perfect match for unpredictable webhook traffic.

## Prerequisites
- Level 21 (Infra & Networking)

## Concept Explanation
In Level 21, we saw how difficult it is to manage Load Balancers and Nginx configurations just to receive webhooks.
What if you didn't have to manage any of that?

**Serverless Functions** (like AWS Lambda, Google Cloud Functions, or Vercel) abstract the server away entirely.
You simply write a JavaScript or Python function and upload it to the cloud. You do not install an operating system. You do not configure a load balancer. You do not open ports.

The Cloud Provider generates a public URL for your function.
- If 0 webhooks arrive, the function "sleeps" and you pay $0.
- If 1 webhook arrives, the cloud provider wakes up a tiny container, runs your function for 100 milliseconds, and shuts it down. You pay $0.000001.
- If 10,000 webhooks arrive simultaneously, the cloud provider instantly spins up 10,000 identical containers, runs them all in parallel, and shuts them down.

## Real-World Analogy
Think of a traditional server like hiring a full-time receptionist. Even if nobody calls the office, you have to pay them their hourly wage just to sit there.
Serverless is like hiring a gig worker. You only pay them for the exact 3 minutes they spend answering a phone call. If 1,000 people call at once, the agency instantly sends 1,000 gig workers to answer every phone simultaneously.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Stripe Webhook Spikes] --> B{AWS API Gateway}
    B -->|Routes Event| C(AWS Lambda Instance 1)
    B -->|Routes Event| D(AWS Lambda Instance 2)
    B -->|Routes Event| E(AWS Lambda Instance 9999...)
    
    C -- Drops in Queue --> F[[Amazon SQS Queue]]
    D -- Drops in Queue --> F
    E -- Drops in Queue --> F
\`\`\`

## Technical Deep Dive: The Cold Start Problem
Serverless is perfect for webhooks, but it has one flaw: **Cold Starts**.
If your function hasn't been used in hours, the cloud provider deletes the container from RAM to save money. When a new webhook arrives, the provider has to boot up a brand new container, load Node.js, and load your code. This can take 1-3 seconds!
If the provider (like Shopify) has a strict 3-second timeout limit, a Cold Start might cause your webhook to fail on the very first attempt! (Thankfully, Shopify's automatic retry logic will hit the now-"warm" container on the second attempt and succeed).

## Code Example
Notice how there is no \`app.listen(3000)\` or Express server setup. You just write a pure function:

\`\`\`javascript
// An AWS Lambda Serverless Function
exports.handler = async (event) => {
    // The webhook payload is automatically passed in the 'event.body' object
    const payload = JSON.parse(event.body);
    
    console.log(\`Received Webhook Event: \${payload.type}\`);
    
    // Process the data...
    
    // Return an HTTP response directly from the function
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Webhook processed successfully!" })
    };
};
\`\`\`

## Common Mistakes
- **Opening Database Connections inside the function:** If you open a new PostgreSQL database connection every time the function runs, and 10,000 webhooks arrive, you will open 10,000 connections and instantly crash your database! You must use Database Connection Pooling or Message Queues when using Serverless.

## Troubleshooting
- **Cloud billing unexpectedly high?** Serverless charges by the millisecond. If your webhook receiver makes a slow 10-second external API call before finishing, you will be billed for all 10 seconds. Keep Serverless functions blazing fast.

## Best Practices
- **Combine Serverless with Queues:** The ultimate webhook architecture is an AWS API Gateway receiving the webhook, passing it to a lightweight Lambda function, which instantly drops the payload into an SQS Queue and shuts down. It costs almost nothing and can handle infinite scale.

## Hands-On Lab
*This module focuses on architecture. If you want to try serverless for free, Vercel and Netlify allow you to deploy simple Node.js webhook receivers directly from your GitHub repository in seconds.*

## Key Takeaways
1. Serverless eliminates infrastructure management (no load balancers, no Nginx).
2. It scales infinitely and automatically to handle webhook traffic spikes.
3. You only pay for the exact milliseconds your code runs.

## What's Next
Webhooks are amazing for Server-to-Server communication. But what if you want to push data directly to a user's web browser? Next up: **WebSockets vs Webhooks**.
`,
  quiz: {
    question: "Why is Serverless Architecture particularly well-suited for receiving webhooks?",
    options: [
      "Because serverless functions automatically bypass HMAC security checks.",
      "Because webhook traffic is highly unpredictable. Serverless scales instantly from 0 to 10,000 instances to handle traffic spikes, and costs $0 when idle.",
      "Because serverless functions run directly on the user's mobile phone.",
      "Because serverless prevents 'Cold Starts'."
    ],
    correctAnswerIndex: 1,
    explanation: "Webhooks are bursty. You might get 0 webhooks for a week, and then 5,000 in a minute. Serverless handles this scale perfectly without requiring you to pay for massive servers that sit idle 99% of the time."
  }
};
