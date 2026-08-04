export const level7 = {
  id: "level-7",
  title: "Level 7 – The First Hook",
  type: "theory",
  briefing: {
    recap: "You discovered the Fulfillment Service was polling the Inventory API 15,000 times a minute, causing a CPU spike. You halted the polling loop.",
    incident: "You successfully terminated the Fulfillment Service's polling loop. CPU usage has dropped to 45%. Now you must establish the Webhook connection so Fulfillment still receives stock updates.",
    task: "Configure the Inventory Service to push event notifications to the Fulfillment Webhook endpoint. Review the server logs to verify the connection is stable.",
    rewards: { xp: 150, badge: 'foundation-completed' }
  },
  content: `
## Deployment Log
**Operator:** Player_One
**Action:** Webhook Registration

To establish the Webhook, you register the Fulfillment Service's endpoint with the Inventory Service's event registry. We do this by sending an HTTP POST request.

In a terminal, we use the \`curl\` command to send HTTP requests. Instead of typing the entire command at once, let's break down how we construct a JSON POST request step-by-step:

1. **The Base Command**: \`curl\` is the tool we use to send network requests.
2. **The Method**: \`-X POST\` tells curl to use the HTTP POST method (by default, it uses GET).
3. **The URL**: \`http://api.mei.internal/v1/webhooks/register\` is the destination API endpoint.
4. **The Payload**: \`-d\` (data) tells curl we are attaching data. We then wrap our JSON string in single quotes: \`'{"target_url":"...","events":["..."]}'\`

When we put it all together, the final command looks like this:

\`\`\`bash
curl -X POST http://api.mei.internal/v1/webhooks/register -d '{"target_url":"https://fulfillment.mei.internal/hooks/inventory-update","events":["inventory.stock.increased"]}'
\`\`\`

This tells the Inventory Service: *"Whenever stock increases, send the payload to my Fulfillment Webhook at this URL."*

The server responds with a \`201 Created\`. The connection is established. 

## Concept Explanation: Anatomy of a Webhook

Unlike traditional APIs where you write code to make a request, a Webhook requires you to write code to *receive* a request. 

For this to work, the Fulfillment Service must be running a web server that listens for incoming HTTP POST requests on the \`/hooks/inventory-update\` route. When the Inventory Service detects a stock change, it builds an HTTP request containing the event data in JSON format, and fires it off to the \`target_url\`.

### Verifying the Fix

With the endpoint registered, it's best practice to trigger a test event to ensure the connection works. The provider API offers a \`/retry\` endpoint that replays an event for a specific webhook ID.

The registration step returned a \`webhook_id\`. We pass this ID into the URL to trigger the replay:

\`\`\`bash
curl -X POST https://api.business.local/webhooks/wh_8912384a/retry
\`\`\`

If successful, you can tail the logs of the Fulfillment Service to ensure the Webhook payload arrived correctly:

\`\`\`log
[INFO] Listening on port 8080...
[INFO] Incoming POST from 10.4.22.1 (Inventory_Service)
[INFO] Payload received: {"event": "inventory.stock.increased", "item_id": 99281, "new_stock": 50}
[INFO] Processing order fulfillment for item 99281...
\`\`\`

It worked perfectly. The CPU graph on your dashboard turns from critical red back to a healthy green. The Foundation Zone is stable.

### Platform Engineer Insight
**What is this concept?** Webhook Registration and Verification.
**Why is it used?** To dynamically inform a sender where they should dispatch payloads without hardcoding destinations into the sender's source code.
**How does it work?** A developer registers a URL endpoint with a provider's API. The provider stores this URL in a database and uses it as the destination for future HTTP POST events.
**How do we monitor it in production?** We monitor the HTTP response codes returned by the registered endpoint. Constant 4xx or 5xx responses usually result in the provider automatically disabling (blacklisting) the webhook.

## Anomalous Activity Detected

Just as you are about to close the terminal, you notice something strange in the Inventory Service's raw access logs. 

While the Fulfillment Service's polling has stopped, there is still a high volume of traffic hitting the inventory endpoints. 

\`\`\`log
[WARN] Rate limit exceeded for IP: 192.168.99.114
[WARN] Rate limit exceeded for IP: 192.168.99.114
[WARN] Rate limit exceeded for IP: 192.168.99.114
\`\`\`

You run a quick WHOIS lookup on the internal IP \`192.168.99.114\`. It doesn't belong to the Fulfillment Service. It doesn't belong to any known Business Cloud OS infrastructure service.

Someone—or something—was masking their traffic behind the Fulfillment Service's polling loop. Now that the polling has stopped, their unauthorized access is glaringly obvious. 

Before you can investigate further, your console flashes with a new alert from the Platform Operations Zone. An external integration has suddenly stopped responding entirely. 
`,
  simulator: {
    tasks: [
      {
        command: /^curl\s+-X\s+POST\s+http:\/\/api\.mei\.internal\/v1\/webhooks\/register\s+-d\s+'?\{"target_url":"https:\/\/fulfillment\.mei\.internal\/hooks\/inventory-update","events":\["inventory\.stock\.increased"\]\}'?/i,
        instruction: 'Register the new webhook listener URL with the fulfillment service by sending a POST request to the API.',
        hints: [
          "How do we construct an HTTP POST request to send JSON data to an API?",
          "Use `curl -X POST <url> -d '<json>'` to send the JSON payload to the registration endpoint.",
          "Solution: curl -X POST http://api.mei.internal/v1/webhooks/register -d '{\"target_url\":\"https://fulfillment.mei.internal/hooks/inventory-update\",\"events\":[\"inventory.stock.increased\"]}'"
        ],
        solution: 'curl -X POST http://api.mei.internal/v1/webhooks/register -d \'{"target_url":"https://fulfillment.mei.internal/hooks/inventory-update","events":["inventory.stock.increased"]}\'',
        successMessage: 'HTTP/1.1 201 Created\n{"status": "success", "webhook_id": "wh_8912384a"}',
        errorMessage: 'Invalid syntax. Ensure you use -X POST and wrap the JSON payload in single quotes after -d.'
      },
      {
        command: /^curl\s+-X\s+POST\s+https:\/\/api\.business\.local\/webhooks\/wh_8912384a\/retry/i,
        instruction: 'Trigger a test event to verify the provider successfully calls your webhook using the webhook_id you just received.',
        hints: [
          "The previous step returned a webhook_id: wh_8912384a.",
          "Use `curl -X POST` to hit the retry endpoint for that specific registered webhook ID: https://api.business.local/webhooks/<id>/retry",
          "Solution: curl -X POST https://api.business.local/webhooks/wh_8912384a/retry"
        ],
        solution: 'curl -X POST https://api.business.local/webhooks/wh_8912384a/retry',
        successMessage: '[OK] Event replayed. Fulfillment Service responded with 200 OK. Connection stable.',
        errorMessage: 'Invalid command. Try `curl -X POST https://api.business.local/webhooks/<webhook_id>/retry`'
      }
    ]
  }
};
