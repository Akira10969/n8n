export const level6 = {
  id: "level-6",
  title: "Level 6 – The Polling Problem",
  type: "theory",
  briefing: {
    recap: "You successfully configured JSON payloads in the Foundation Zone. The basics are complete. Now, a live incident requires your attention.",
    incident: "CRITICAL ALERT: The Core Inventory Service is experiencing 99% CPU utilization. Memory is rapidly depleting. The service is on the verge of a cascading failure that will halt all MEI_Cloud_OS commerce operations.",
    task: "Analyze the incoming traffic to the Inventory Service. Identify the source of the load spike and propose an architectural shift from continuous API polling to an event-driven model.",
    rewards: { xp: 100, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 04:12:08 UTC
**Service:** Core\_Inventory\_API
**Status:** DEGRADED

Our monitoring tools indicate that the **Fulfillment Service** is hammering the Inventory API with over 15,000 requests per minute. 

When you intercept the traffic, you see the exact same request being made over and over:
\`\`\`http
GET /api/v1/inventory/status?item_id=99281
\`\`\`
And the response is almost always the same:
\`\`\`json
{ "status": "no_change", "stock": 0 }
\`\`\`

The Fulfillment Service is continually asking, *"Do you have stock yet? Do you have stock yet? Do you have stock yet?"* 

This is known as **API Polling**. 

## Concept Explanation: APIs vs. Webhooks

In a traditional **API Polling** model, the client must repeatedly ask the server if there is any new information. 
- **Pros:** Very simple to implement. The client controls when it receives data.
- **Cons:** Extremely inefficient. 99% of the requests result in a "no change" response, wasting CPU, memory, and network bandwidth on both sides.

### The Webhook Paradigm (Push instead of Pull)
Instead of the Fulfillment Service constantly asking if stock has updated, what if the Inventory Service just *told* the Fulfillment Service the exact moment it changed?

This is what a **Webhook** does. 

A Webhook is essentially a **Reverse API**. 
1. The Fulfillment Service provides the Inventory Service with a URL (e.g., \`https://fulfillment.mei.internal/webhook/inventory\`).
2. The Fulfillment Service stops polling and goes to sleep.
3. The moment the inventory changes, the Inventory Service sends an HTTP POST request to that URL containing the new data.

### The Architectural Decision
To save the Inventory Service from crashing, you must disable the polling loop in the Fulfillment Service and reconfigure it to listen for Webhooks instead. 

As a Lead Operations Engineer, you must recognize when synchronous polling is creating an artificial bottleneck. By shifting to an event-driven webhook model, we can reduce network traffic by over 99%.

> **SYSTEM OVERRIDE DETECTED:** While you are reading this report, a secondary spike in traffic just hit the load balancers. Proceed to the next mission immediately to implement the webhook fix before the server goes offline completely.
`,
  simulator: {
    tasks: [
      {
        command: 'ps aux | grep polling',
        instruction: 'Find the rogue polling process. Use the standard Linux command to list processes and filter for "polling".',
        successMessage: 'root      1204  99.0  2.1  fulfillment_polling_loop.sh',
        errorMessage: 'Invalid command. Try `ps aux | grep polling`'
      },
      {
        command: 'mei-cli service stop fulfillment_polling',
        instruction: 'Terminate the rogue service using the MEI Cloud OS custom CLI. Command: mei-cli service stop fulfillment_polling',
        successMessage: '[OK] Signal SIGTERM sent to fulfillment_polling... Process terminated. CPU load dropping.',
        errorMessage: 'Invalid command. Use `mei-cli service stop <service_name>`'
      }
    ]
  }
};
