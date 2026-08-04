export const level20 = {
  "id": "level-20",
  "title": "Fractured Reality",
  "type": "theory",
  "briefing": {
    "recap": "The Message Queues are holding the line. Traffic is buffered. The systems haven't crashed... but something feels wrong.",
    "incident": "ANOMALY: Data across different dashboards is no longer matching. The User Database shows a balance of $50, but the Billing Dashboard shows $0. Trust is breaking down.",
    "task": "Understand Eventual Consistency and the sacrifices made when moving to asynchronous, queued architectures.",
    "rewards": {
      "xp": 300,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"I'm looking at two different monitoring screens. One says the server is online. The other says it's destroyed. Which one is lying?\"\n\n**[UNIT-7]** \"Neither is lying. They are both reporting the truth at different points in time. The delay in the message queues has introduced synchronization latency.\"\n\n## Eventual Consistency\nIn our old Monolith, if an invoice was paid, the balance updated instantly. That is called **Strong Consistency**.\n\nNow that we use Message Queues, the system is **Eventually Consistent**. \n1. The Payment service registers the payment (Balance: $50).\n2. It drops an `invoice.paid` event into the Queue.\n3. The Billing Dashboard service takes 3 seconds to pull that event from the Queue and update its own view.\n\nFor those 3 seconds, the system is fractured. If you look at the Payment service, it says $50. If you look at the Dashboard, it says $0. \n\n### The Trade-off\nWe traded perfect accuracy for massive scalability and resilience. The system *will* be consistent... eventually. We just have to wait for the queues to drain. \n\nBut in the heat of this crisis, staring at conflicting data is terrifying. Trust nothing until the queues are empty.\n\n### Platform Engineer Insight\n**What is this concept?** Eventual consistency is a theoretical guarantee that, provided no new updates are made to a given piece of data, all reads of that data will eventually return the last updated value.\n**Why is it used?** To achieve high availability and massive scalability in distributed systems without the bottleneck of distributed locks.\n**How does it work?** State changes propagate asynchronously across the system over time rather than in a single synchronous transaction.\n**How do we monitor it in production?** We monitor replication lag, event delivery latencies, and run background reconciliation jobs to alert on data drift between datastores.\n\n### Before You Act: JSON Parsing\n**What is this command?** `jq`\n**Why is it used?** It is a lightweight and flexible command-line JSON processor. It allows you to slice, filter, and extract data from JSON files easily.\n**Example:** `jq '.timestamp' file.json` will extract just the timestamp value from the JSON payload.\n\n> **SYSTEM ALERT:** We must extract the timestamps from both payloads to determine which is the older version. Use jq to query the .timestamp field from payload_A.JSON and payload_B.JSON."

  ,
  simulator: {
    tasks: [
      {
        command: /^jq\s+['"]\.timestamp['"]\s+payload_A\.JSON\s+payload_B\.JSON$/i,
        instruction: 'Extract the timestamp fields from the payloads (payload_A.json and payload_B.json) to determine their chronological sequence.',
        hints: [
          "How can we quickly parse and extract specific fields from JSON files in the terminal?",
          "Use jq to extract the '.timestamp' field from both payload files.",
          "jq '.timestamp' payload_A.json payload_B.json"
        ],
        solution: 'jq .timestamp payloads.json',
        successMessage: "\"2026-07-31T08:14:02Z\"\n\"2026-07-31T08:13:59Z\"\n[SARAH]: \"Just as I thought. Payload B was sent first, but arrived second. Never trust the arrival order!\"",
        errorMessage: "Invalid syntax. Try `jq '.timestamp' payload_A.json payload_B.json`"
      }
    ]
  }
};
