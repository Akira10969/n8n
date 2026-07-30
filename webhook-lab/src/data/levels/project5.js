export const project5 = {
  id: "project-5",
  title: "Project 5 – AI Support Assistant",
  type: "theory",
  content: `
## Project Goal
Integrate AI into a webhook pipeline. You will build a system that receives a customer support ticket via webhook, sends the ticket to OpenAI to determine the sentiment (angry vs happy), and routes the ticket accordingly.

## Prerequisites
- An active n8n instance
- An OpenAI API Key (or Anthropic/Google Gemini equivalent)
- A webhook sender (e.g., Postman or a mock Helpdesk form)

## Architecture Diagram
\`\`\`mermaid
graph TD
    A[Customer Submits Ticket] -- Webhook --> B(n8n Webhook Node)
    B -- Extracts Text --> C[OpenAI 'Sentiment Analysis' Node]
    C --> D{IF: Is Customer Angry?}
    D -- Yes --> E[Alert Manager via Slack]
    D -- No --> F[Save to Database]
\`\`\`

## Step-by-Step Instructions

### Step 1: The Trigger
1. In n8n, create a **Webhook** node listening for POST requests.
2. Set it to respond immediately (Asynchronous) because AI generation can take several seconds and we don't want the webhook to timeout.
3. Send a test payload using Postman:
\`\`\`json
{
  "ticket_id": 9012,
  "customer": "Bob",
  "message": "I have been waiting for my refund for 3 weeks! Your service is terrible and I want to cancel my account!"
}
\`\`\`

### Step 2: The AI Node
1. Add an **OpenAI** node (or equivalent LLM node).
2. Authenticate with your API key.
3. Set the Resource to "Chat" and Operation to "Complete".
4. In the System Prompt, write: *"You are a sentiment analyzer. Read the user's message and reply with a single word: ANGRY, HAPPY, or NEUTRAL."*
5. For the User Message, drag the \`message\` field from the Webhook node.

### Step 3: The Routing Logic
1. Add a **Switch** node (or an IF node).
2. Drag the output of the OpenAI node into the Switch condition.
3. Create two routing paths:
   - Route 1: Value equals \`ANGRY\`
   - Route 2: Value equals \`HAPPY\`

### Step 4: The Escalation
1. Attach a **Slack** (or Discord/Email) node to the \`ANGRY\` output path.
2. Configure the message to say: *"URGENT: Bob is very angry! Ticket #9012 requires immediate manager attention."*

## Testing & Success Criteria
1. Execute the workflow and fire the angry test payload via Postman.
2. Within 5-10 seconds, you should receive the Urgent Slack notification.
3. Fire a second test payload with a happy message: *"Thanks for the great service!"*
4. Verify that the AI correctly identifies it as HAPPY and routes it down the other path, preventing the manager from being disturbed!

You have just built an AI-powered, event-driven triage system!
`
};
