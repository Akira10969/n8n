export const level13 = {
  id: "level-13",
  title: "Level 13 – Webhook Debugging",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how to identify, trace, and fix common webhook delivery failures.

## Prerequisites
- Level 12 (Webhook Testing)

## Concept Explanation
Debugging a webhook can be incredibly frustrating. Because webhooks are sent asynchronously in the background, you aren't staring at a browser screen waiting for an error message. If a webhook fails in production, it fails silently in the background.

To debug effectively, you must rely on **Observability**:
1. **Provider Logs**: Most providers (Stripe, GitHub) have a dashboard showing a history of every webhook they attempted to send, including the exact JSON payload and the HTTP status code your server returned.
2. **Server Logs**: Your receiver must print incoming payloads and errors to a log file or a monitoring service (like Datadog or Sentry).
3. **Status Codes**: 
   - If they logged a \`400\`, your code rejected their payload.
   - If they logged a \`401\`, your security signature check failed.
   - If they logged a \`500\`, your code crashed.

## Real-World Analogy
Debugging webhooks without logs is like trying to fix a car engine with your eyes closed. You know the engine isn't working, but you have no idea which part failed. Adding logs is like turning the lights on and plugging in a diagnostic scanner.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Stripe Webhook Fails] --> B{Check Stripe Dashboard}
    B -->|Status 401| C[Check Signature Verification Logic]
    B -->|Status 500| D[Check Server Application Logs]
    B -->|Timeout| E[Check if Processing is Asynchronous]
    
    C --> F[Fix Issue & Resend]
    D --> F
    E --> F
\`\`\`

## Technical Deep Dive: Content-Type Validation
A very common, subtle bug occurs with the \`Content-Type\` header. 
Many developers assume all webhooks are sent as \`application/json\`. However, some older systems (like Twilio or older payment gateways) send webhooks as \`application/x-www-form-urlencoded\` (the format used by standard HTML forms). If your Express server is only configured with \`express.json()\`, it will completely ignore the urlencoded body, resulting in an empty payload and hours of confused debugging!

## Code Example
Always write robust error logging in your webhook receiver.

\`\`\`javascript
app.post('/webhook', express.json(), (req, res) => {
  try {
    // Attempt to process the payload
    const event = req.body;
    if (!event.type) throw new Error("Missing event type");
    
    // Success
    res.status(200).send();
  } catch (error) {
    // LOG THE ERROR!
    console.error(\`[Webhook Failed]: \${error.message}\`);
    console.error("Payload received:", JSON.stringify(req.body));
    
    // Return a 400 so the provider knows it was a bad request
    res.status(400).send(error.message);
  }
});
\`\`\`

## Common Mistakes
- **Testing manually vs Real traffic:** Your manual Postman test might work perfectly because you capitalized a field (\`"UserId": 5\`), but the actual provider sends lowercase (\`"userid": 5\`). Always inspect the actual payload sent by the provider.
- **Returning HTML error pages:** If your code crashes, many web frameworks default to returning a massive HTML error page. This wastes the provider's bandwidth. Configure your server to return clean JSON or plain text errors for API routes.

## Troubleshooting
- **Webhook works in staging but fails in production?** Your staging environment might have a different security secret than your production environment, causing signature verification to fail.

## Best Practices
- **Implement Idempotent Resends:** During debugging, you will often click "Resend Webhook" in the provider's dashboard. Make sure your system is idempotent (Level 15), meaning if you accidentally process a successful webhook twice while debugging, it won't duplicate data (like charging a customer twice).

## Hands-On Lab
*Next time a webhook fails, don't guess. Open the provider's dashboard, look at the HTTP status code, and check your server's exact log output for that timestamp.*

## Key Takeaways
1. Webhooks fail silently; logging is mandatory for survival.
2. The HTTP status code logged by the provider is your first clue to solving the bug.
3. Beware of differing \`Content-Type\` headers from older providers.

## What's Next
We mentioned that a 401 error means your signature verification failed. But how does that verification actually work? Next up, the most critical topic of all: **Webhook Security**.
`,
  quiz: {
    question: "If you check a provider's dashboard and see they recorded a '500 Internal Server Error' for a webhook delivery, what is the most likely cause?",
    options: [
      "The provider's internal systems crashed while generating the JSON.",
      "Your server received the request, but your code threw an unhandled exception or crashed while processing it.",
      "The internet connection between the provider and your server was completely severed.",
      "Your server was turned off entirely."
    ],
    correctAnswerIndex: 1,
    explanation: "A 500 error means your server successfully received the request, but your application logic crashed (e.g., a database connection failed or a variable was undefined)."
  }
};
