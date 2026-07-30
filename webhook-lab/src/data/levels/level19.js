export const level19 = {
  id: "level-19",
  title: "Level 19 – n8n Integration",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how to use no-code/low-code platforms like n8n to build complex webhook receivers and asynchronous processing pipelines without writing a single line of backend code.

## Prerequisites
- Level 18 (Async Processing)

## Concept Explanation
Building a reliable webhook receiver in Node.js or Python requires handling routing, signature verification, message queues, and error retries manually. This takes days or weeks of engineering time.

**n8n** is an open-source workflow automation tool. It provides a visual, node-based interface where you can drag and drop components to build complex integrations. 
You can drag a **Webhook Node** onto the canvas, and n8n instantly provisions a public URL for you. When a payload hits that URL, it triggers the visual workflow, moving the data sequentially through database nodes, email nodes, or even AI Agent nodes!

## Real-World Analogy
Think of n8n like a factory assembly line.
Instead of having one very smart person (a backend developer) manually carry a piece of data through the whole factory, you set up a conveyor belt with specialized robots (Nodes). The Webhook robot drops the box on the belt, the SQL robot scans it into inventory, the Mailchimp robot emails the customer, and the Slack robot notifies the team.

### The Listener vs The Receiver in n8n
In n8n, there are two distinct ways to start a workflow, which perfectly illustrates the difference between standard APIs (Polling) and Webhooks:
- **The Listener (Polling Trigger)**: A node like the "Schedule" or "IMAP Email" node. n8n actively reaches out (listens) on a schedule (e.g., every 5 minutes) asking the external service, "Is there anything new?" 
- **The Receiver (Webhook Trigger)**: The "Webhook" node. n8n does absolutely nothing. It goes to sleep and waits. When an external provider pushes an HTTP POST request to the Webhook node's URL, it *receives* the payload, instantly waking up the workflow.

## Visual Diagram
\`\`\`mermaid
graph LR
    A[Stripe Webhook] -->|HTTP POST| B(n8n Webhook Node)
    B --> C{IF Node}
    C -->|Amount > $100| D[Slack Notification Node]
    C -->|Amount < $100| E[PostgreSQL Node]
    D --> E
\`\`\`

## Technical Deep Dive: The Respond to Webhook Node
By default, n8n's Webhook node waits until the *entire* workflow finishes before it sends a \`200 OK\` back to the provider (Synchronous). If your workflow includes a slow API call or an OpenAI prompt, the provider will time out!
To fix this, n8n provides a setting (or a specific **Respond to Webhook** node) that allows you to instantly return a \`200 OK\` at the very start of the workflow, and then continue executing the rest of the nodes in the background (Asynchronous).

## Code Example
You don't write code in n8n; you configure JSON parameters! However, n8n allows you to write custom JavaScript inside a **Code Node** if you need complex data transformation.

\`\`\`javascript
// Example inside an n8n Code Node
const incomingPayload = $input.item.json.body;

// Transform the payload before sending it to the database
return {
  customer_id: incomingPayload.customer.id,
  total_cents: incomingPayload.amount * 100,
  processed_at: new Date().toISOString()
};
\`\`\`

## Common Mistakes
- **Forgetting about Webhook Security:** n8n gives you a public URL, meaning anyone can trigger your workflow. You must configure the Webhook Node's authentication settings (like Header Auth or HMAC verification) to ensure only authorized providers can start the flow.

## Troubleshooting
- **Workflow failing on specific payloads?** n8n keeps an Execution History. You can click on any failed execution and visually see exactly which node threw the error, and inspect the exact JSON data that was flowing through the wire at that exact moment.

## Best Practices
- **Use sub-workflows:** If your n8n canvas gets too cluttered with 50 nodes, you can group them into a sub-workflow. The main Webhook node triggers an "Execute Workflow" node, keeping your architecture clean and modular.

## Hands-On Lab
*n8n has a generous free tier for their cloud offering, or you can run it entirely free via Docker on your local machine. Try spinning it up and creating a Webhook Trigger!*

## Key Takeaways
1. n8n replaces manual backend coding with a visual, node-based automation pipeline.
2. You can easily switch between synchronous and asynchronous webhook responses in n8n.
3. You still need to configure authentication and signature verification within the platform.

## What's Next
Now you know how to build the ultimate receiver. Let's look at the actual services that will be sending you data. Next up: **Popular Providers**.
`,
  quiz: {
    question: "If your n8n workflow contains an AI node that takes 15 seconds to generate text, how should you configure the initial Webhook Trigger Node?",
    options: [
      "Configure it to use a GET request instead of POST.",
      "Configure it to respond immediately (Asynchronously) to the provider before the AI node starts, preventing a timeout.",
      "Configure the AI node to work faster.",
      "You cannot use AI nodes with webhooks."
    ],
    correctAnswerIndex: 1,
    explanation: "Because providers have tight timeout limits (usually ~3 seconds), you must configure n8n to acknowledge the webhook instantly, then process the heavy 15-second AI task in the background."
  }
};
