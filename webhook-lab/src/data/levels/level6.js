export const level6 = {
  id: "level-6",
  title: "Level 6 – The Polling Problem",
  type: "theory",
  briefing: {
    recap: "You successfully configured JSON payloads in the Foundation Zone. The basics are complete. Now, a live incident requires your attention.",
    incident: "CRITICAL ALERT: The Core Inventory Service is experiencing 99% CPU utilization. Memory is rapidly depleting. The service is on the verge of a cascading failure that will halt all Business Cloud OS commerce operations.",
    task: "Analyze the incoming traffic to the Inventory Service. Identify the source of the load spike and propose an architectural shift from continuous API polling to an event-driven model.",
    rewards: { xp: 100, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 04:12:08 UTC
**Service:** Core_Inventory_API
**Status:** DEGRADED

Our monitoring tools indicate that the **Fulfillment Service** is hammering the Inventory API with over 15,000 requests per minute. 

When you intercept the traffic, you see the exact same request being made over and over:
\`\`\`HTTP
GET /API/v1/inventory/status?item_id=99281
\`\`\`
And the response is almost always the same:
\`\`\`JSON
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
1. The Fulfillment Service provides the Inventory Service with a URL (e.g., \`https://fulfillment.mei.internal/Webhook/inventory\`).
2. The Fulfillment Service stops polling and goes to sleep.
3. The moment the inventory changes, the Inventory Service sends an HTTP POST request to that URL containing the new data.

### The Complete Webhook Architecture Flow

To truly master Platform Engineering, you must understand the entire lifecycle of how Webhooks move data between systems. Every production Webhook system follows this pipeline:

1. **Event Occurs:** Something happens in the source system (e.g., Inventory drops to 0).
2. **Sender:** The source system packages the data into JSON.
3. **Webhook Request:** An HTTP POST request is dispatched over the internet.
4. **Listener:** An HTTP server (like Nginx) at the destination waits for the incoming connection.
5. **Receiver:** The application endpoint accepts the payload.
6. **Authentication (where applicable) & Signature Verification (HMAC):** Mathematically prove who sent the Webhook.
7. **Payload Validation:** Ensure the JSON schema is correct and safe.
8. **Idempotency Check:** Ensure this exact event hasn't been processed before.
9. **Queue / Asynchronous Processing:** Acknowledge receipt with a 2xx Status Code quickly, then push the payload to a queue.
10. **Business Logic:** A background worker picks up the payload and analyzes it.
11. **Logging:** Record the success/failure event.
12. **Metrics:** Track failure rates and system health.
13. **Tracing & Correlation IDs:** Trace the event's lifecycle across microservices.
14. **Observability:** Centralize all data so engineers can troubleshoot the system.

### Platform Engineer Insight
**Architecture:** You will see this exact architecture when integrating Shopify or Discord. The Listener and Receiver are often just an API Gateway or a reverse proxy, which immediately forwards the payload to an asynchronous queue for the Processor to handle.

*Note the difference:* The **Listener** is just the open door on the network. The **Receiver** is the clerk who takes the package. The **Processor** is the worker who opens it and does the job.

### The Architectural Decision
To save the Inventory Service from crashing, you must disable the polling loop in the Fulfillment Service and reconfigure it to listen for Webhooks instead. 

As a Lead Operations Engineer, you must recognize when synchronous polling is creating an artificial bottleneck. By shifting to an event-driven Webhook model, we can reduce network traffic by over 99%.

> **SYSTEM OVERRIDE DETECTED:** While you are reading this report, a secondary spike in traffic just hit the load balancers. Proceed to the next mission immediately to implement the Webhook fix before the server goes offline completely.

---

## Before You Act: Investigating with \`ps\` and \`grep\`

When a server's CPU spikes, you can't just guess what's running. You have to investigate. Platform Engineers use two core Linux commands together to find rogue processes:

1. **\`ps aux\`**: Lists every single running process on the server right now.
2. **\`|\` (Pipe)**: Takes the massive output of \`ps aux\` and passes it into the next command.
3. **\`grep <word>\`**: Filters the output so you only see lines containing your search word.

By running **\`ps aux | grep polling\`**, you are saying: *"Show me all processes, but only print the ones that have 'polling' in their name."*

## Understanding \`systemctl\`

Once you find the runaway service, you must kill it. **\`systemctl\`** is the command used to control **systemd** — the service manager that runs on almost every modern Linux system. It manages background services (daemons) that start on boot and keep running while the OS is live.

Common patterns:

| Command | What it does |
|---------|-------------|
| \`systemctl status <service>\` | Check if a service is running, crashed, or stopped |
| \`systemctl stop <service>\` | Send SIGTERM to gracefully shut the service down |
| \`systemctl start <service>\` | Start the service |
| \`systemctl restart <service>\` | Stop then start the service |

In production, Platform Engineers use \`systemctl stop\` when a runaway service is consuming resources and needs to be terminated cleanly before a fix is applied.

### Platform Engineer Insight
**What is this concept?** \`systemctl\` is the Linux systemd service control interface.
**Why is it used?** Every long-running background process (API servers, queue workers, monitoring agents) is managed as a systemd service. When a service misbehaves — like a polling loop pinning CPU at 99% — the first response is \`systemctl stop\` to halt it safely.
**How does it work?** systemd sends a SIGTERM signal to the process, giving it time to clean up. If it doesn't stop within the timeout, systemd sends SIGKILL to forcefully terminate it.
**How do we monitor it in production?** We watch service state in runbooks and alert on crash-loops. A service entering the \`failed\` state repeatedly is a sign of a deeper bug — not just a restart problem.
`,

  simulator: {
    tasks: [
      {
        command: 'ps aux | grep polling',
        instruction: 'Scan the running server processes to find the script that is causing the CPU spike.',
        hints: [
          "What command shows all running processes on a Linux system?",
          "Use `ps aux` to list all processes, then pipe the output through `grep` to filter for the word 'polling'.",
          "Solution: ps aux | grep polling"
        ],
        solution: 'ps aux | grep polling',
        successMessage: 'root      1204  99.0  2.1  fulfillment_polling_loop.sh\n\n[SARAH]: "There it is. PID 1204 — fulfillment_polling_loop.sh — burning 99% CPU. The service name is \'fulfillment_polling\'. Let\'s kill it."',
        errorMessage: 'Invalid command. Try `ps aux | grep polling`'
      },
      {
        command: /^systemctl\s+stop\s+fulfillment_polling(?:_loop\.sh)?/i,
        instruction: 'Use systemctl to stop the rogue polling service you just identified.',
        hints: [
          "What systemd command stops a running background service?",
          "Use `systemctl stop` followed by the service name. You found the service name in the previous step — it was shown in the grep output.",
          "Solution: systemctl stop fulfillment_polling"
        ],
        solution: 'systemctl stop fulfillment_polling',
        successMessage: '[OK] Signal SIGTERM sent to fulfillment_polling... Process terminated. CPU load dropping from 99% → 3%.\n[SARAH]: "Good. The server is breathing again. Now we need a permanent fix — no more polling."',
        errorMessage: 'Invalid command. The service name is \'fulfillment_polling\'. Try `systemctl stop fulfillment_polling`'
      }
    ]
  }
};
