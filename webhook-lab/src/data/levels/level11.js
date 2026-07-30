export const level11 = {
  id: "level-11",
  title: "Level 11 – Sending Webhooks",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how applications build and dispatch webhooks to destination servers.

## Prerequisites
- Level 10 (Webhook Receiver)

## Concept Explanation
Until now, we have looked at webhooks from the perspective of the **Receiver**. But what if you are building the next Shopify and you want to **Send** webhooks to your users?

Sending a webhook is functionally identical to making an outgoing API request.
When an event occurs in your system, your backend code must:
1. Serialize the event data into a JSON string.
2. Calculate a security signature (more on this in Level 14).
3. Use an HTTP Client library to send a POST request to the URL your user provided.
4. Wait for the user's server to respond.
5. Record whether the delivery was successful (200 OK) or failed (4xx/5xx).

## Real-World Analogy
Sending a webhook is like being a delivery driver.
You (the sender) pack the box (JSON), drive to the customer's house (the URL), and knock on the door (the POST request). If they answer the door and take the package, you write "Delivered" on your clipboard (200 OK). If nobody is home, you take the package back to the truck and try again tomorrow.

## Visual Diagram
\`\`\`mermaid
graph LR
    A[Your App Database] -- Triggers Event --> B[Event Dispatcher]
    B -- Serializes JSON --> C[HTTP Client]
    C -- POST Request --> D((User's Server))
    D -- 200 OK --> C
    C -- Logs Success --> A
\`\`\`

## Technical Deep Dive: HTTP Clients
Every programming language has libraries designed to make outgoing HTTP requests.
- **JavaScript/Node.js**: \`fetch\`, \`axios\`, \`got\`
- **Python**: \`requests\`, \`httpx\`
- **Go**: \`net/http\` (Client)
- **PHP**: \`cURL\`, \`Guzzle\`

When sending a webhook, you configure these clients to use the \`POST\` method, set the \`Content-Type\` header to \`application/json\`, and attach the payload to the \`body\`.

## Code Example
Sending a webhook using JavaScript's native \`fetch\` API in a Node.js backend:

\`\`\`javascript
async function sendWebhook(userUrl, eventData) {
  try {
    const response = await fetch(userUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-My-App-Signature': 'hash123'
      },
      body: JSON.stringify(eventData)
    });

    if (response.ok) {
      console.log("Webhook delivered successfully!");
    } else {
      console.error(\`Webhook failed with status: \${response.status}\`);
      // Add to retry queue...
    }
  } catch (error) {
    console.error("Network error: Could not reach the user's server.");
  }
}
\`\`\`

## Common Mistakes
- **Not catching network errors:** If the user's server is completely offline, the HTTP client won't return a 500 status code; it will throw a fatal network exception. If you don't wrap the request in a \`try/catch\` block, your entire sending application could crash!
- **Not setting a timeout:** If the user's server hangs and never responds, your HTTP client might wait forever, consuming memory and causing a memory leak on your server.

## Troubleshooting
- **Webhook is sending but the user says the payload is empty?** You likely forgot to set the \`Content-Type: application/json\` header, so the user's server doesn't know how to parse the incoming text.

## Best Practices
- **Never block the main thread:** Sending an HTTP request takes time (sometimes hundreds of milliseconds). If a user clicks "Buy", don't make them wait for the webhook to be delivered before loading the confirmation page. Send the webhook asynchronously in the background.

## Hands-On Lab
*No lab for this section, but in a real-world scenario, you would test your sending code by pointing it at a tool like Webhook.site to verify the payload arrives correctly.*

## Key Takeaways
1. Sending a webhook is just making an outgoing HTTP POST request.
2. You must handle both HTTP error statuses (like 500) and hard network exceptions (like server offline).
3. Always set a timeout on your HTTP client so hanging user servers don't break your app.

## What's Next
Now we have both sides of the equation: Senders and Receivers. But how do we test these integrations safely on our personal laptops before deploying to production? Next up: **Webhook Testing Tools**.
`,
  quiz: {
    question: "When writing code to SEND a webhook to a user's server, why is it critical to set a Timeout limit on your HTTP client?",
    options: [
      "Because webhooks are required by law to arrive within 2 seconds.",
      "Because if the user's server hangs and never responds, your HTTP client might wait indefinitely, consuming server resources and potentially causing a memory leak.",
      "Because setting a timeout automatically encrypts the payload.",
      "Because it prevents the user from knowing your IP address."
    ],
    correctAnswerIndex: 1,
    explanation: "If you don't enforce a timeout, a slow or broken destination server can cause your sending application to hang, eventually exhausting your connection pool and crashing your server."
  }
};
