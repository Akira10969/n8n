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
**Operator:** Player\_One
**Action:** Webhook Registration

To establish the Webhook, you register the Fulfillment Service's endpoint with the Inventory Service's event registry:

\`\`\`json
POST /api/v1/webhooks/register
{
  "target_url": "https://fulfillment.mei.internal/hooks/inventory-update",
  "events": ["inventory.stock.increased", "inventory.stock.depleted"]
}
\`\`\`

The server responds with a \`201 Created\`. The connection is established. 

## Concept Explanation: Anatomy of a Webhook

Unlike traditional APIs where you write code to make a request, a Webhook requires you to write code to *receive* a request. 

For this to work, the Fulfillment Service must be running a web server that listens for incoming HTTP POST requests on the \`/hooks/inventory-update\` route. When the Inventory Service detects a stock change, it builds an HTTP request containing the event data in JSON format, and fires it off to the \`target_url\`.

### Verifying the Fix
You tail the logs of the Fulfillment Service to ensure the Webhooks are arriving correctly:

\`\`\`log
[INFO] Listening on port 8080...
[INFO] Incoming POST from 10.4.22.1 (Inventory_Service)
[INFO] Payload received: {"event": "inventory.stock.increased", "item_id": 99281, "new_stock": 50}
[INFO] Processing order fulfillment for item 99281...
\`\`\`

It worked perfectly. The CPU graph on your dashboard turns from critical red back to a healthy green. The Foundation Zone is stable.

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
        command: 'curl -X POST http://api.mei.internal/v1/webhooks/register -d \'{"target_url":"https://fulfillment.mei.internal/hooks/inventory-update","events":["inventory.stock.increased"]}\'',
        instruction: 'Register the Webhook endpoint using standard curl. Use a POST request with the exact JSON payload shown in the deployment log.',
        successMessage: 'HTTP/1.1 201 Created\n{"status": "success", "webhook_id": "wh_8912384a"}',
        errorMessage: 'Invalid syntax. Example: curl -X POST http://url -d \'{"key":"value"}\''
      },
      {
        command: 'mei-cli events replay --webhook wh_8912384a',
        instruction: 'Trigger a test event using the MEI CLI to verify the connection is active.',
        successMessage: '[OK] Event replayed. Fulfillment Service responded with 200 OK. Connection stable.',
        errorMessage: 'Invalid command. Try `mei-cli events replay --webhook <webhook_id>`'
      }
    ]
  }
};
