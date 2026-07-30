export const project3 = {
  id: "project-3",
  title: "Project 3 – Contact Form Automation",
  type: "theory",
  content: `
## Project Goal
Build an automated workflow using **n8n** that receives a webhook when a user submits a contact form, saves their data into a database, and sends them a welcome email. This introduces you to building async pipelines without writing backend code.

## Prerequisites
- An active n8n instance (Cloud or Local via Docker)
- A free mock email service like [Mailtrap](https://mailtrap.io) (optional, to see emails)

## Architecture Diagram
\`\`\`mermaid
graph LR
    A[Website Contact Form] -- POST Webhook --> B((n8n Webhook Node))
    B -- Extracts Data --> C[Google Sheets Node]
    C -- Success --> D[Send Email Node]
\`\`\`

## Step-by-Step Instructions

### Step 1: Create the Webhook Node
1. Open your n8n workflow canvas.
2. Click **Add first step** and search for **Webhook**.
3. Set the HTTP Method to **POST**.
4. Set the Path to \`contact-form\`.
5. Under "Respond", change the setting to **Immediately** (This makes your webhook asynchronous!).
6. Copy the "Test URL" provided by n8n.

### Step 2: Trigger the Webhook
Before you can map data, n8n needs to see what the data looks like. 
Click **Listen for Test Event**.
Open Postman, and send a POST request to the Test URL with this JSON body:
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I would like to buy your product!"
}
\`\`\`
Go back to n8n. You should see the data successfully captured in the node!

### Step 3: Add a Database Node (Google Sheets)
1. Click the \`+\` next to the Webhook node and add a **Google Sheets** node (or Airtable/PostgreSQL).
2. Authenticate your account (if using Sheets).
3. Set the Operation to **Append or Update Row**.
4. Drag and drop the \`name\` and \`email\` fields from the left side of the screen (the webhook data) into the corresponding columns for your sheet.

### Step 4: Add an Email Node
1. Click the \`+\` next to the Sheets node and add an **Email (SMTP)** node (or SendGrid).
2. Set the "To" field to the dynamic \`email\` variable from the webhook.
3. Set the "Subject" to \`Thanks for reaching out, {{ $json.name }}!\`
4. Set the "Body" to a nice welcome message.

## Testing & Success Criteria
1. Click the **Execute Workflow** button at the bottom of the screen.
2. Send another test payload via Postman.
3. Check your Google Sheet: The new row should appear instantly.
4. Check your email inbox: You should have received the automated welcome email.

You have just built a decoupled, asynchronous Event-Driven pipeline!
`
};
