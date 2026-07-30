export const project1 = {
  id: "project-1",
  title: "Project 1 – Hello Webhook",
  type: "lab",
  content: `
## Project Goal
Build and expose your very first local webhook receiver, capable of receiving a JSON payload from a public provider and printing it to your terminal.

## Prerequisites
- Node.js installed on your computer.
- A free [ngrok](https://ngrok.com/) account.
- Postman or [Webhook.site](https://webhook.site) for testing.

## Architecture Diagram
\`\`\`mermaid
graph LR
    A[Postman / Provider] -- POST /webhook --> B[Ngrok Public URL]
    B -- Tunnel --> C[Localhost:3000]
    C -- Logs to Terminal --> D>Console]
\`\`\`

## Step-by-Step Instructions

### Step 1: Initialize the Project
Open your terminal and run the following commands to create a new folder, initialize a Node project, and install the Express framework:
\`\`\`bash
mkdir hello-webhook
cd hello-webhook
npm init -y
npm install express
\`\`\`

### Step 2: Write the Receiver Code
Create a file named \`index.js\` and paste the following code. This sets up a basic web server that listens for POST requests on the \`/webhook\` route.
\`\`\`javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log("🔔 WEBHOOK RECEIVED!");
    console.log(JSON.stringify(req.body, null, 2)); // Pretty-print the JSON
    
    // Always respond quickly!
    res.status(200).send("Success");
});

app.listen(PORT, () => {
    console.log(\`Server is listening on http://localhost:\${PORT}\`);
});
\`\`\`

### Step 3: Start the Server
Run the code by typing:
\`\`\`bash
node index.js
\`\`\`
Your server is now running locally, but it cannot be reached by the outside world.

### Step 4: Expose the Server using Ngrok
Open a *second* terminal window (leave the first one running) and start ngrok:
\`\`\`bash
ngrok http 3000
\`\`\`
Ngrok will give you a public URL that looks like \`https://1a2b3c4d.ngrok.app\`.

### Step 5: Test the Webhook
Open Postman (or use \`curl\` in a third terminal). Make a POST request to your ngrok URL.
**Method:** POST
**URL:** \`https://1a2b3c4d.ngrok.app/webhook\`
**Headers:** \`Content-Type: application/json\`
**Body (Raw):**
\`\`\`json
{
  "message": "Hello Webhook World!",
  "user_id": 99
}
\`\`\`

## Testing & Success Criteria
Hit "Send" in Postman. 
1. Postman should show a \`200 OK\` status.
2. Look at your first terminal window (where your Node server is running). You should see the exact JSON payload printed out in the console!

Congratulations! You have successfully built a local receiver and tunneled it to the public internet!
`
};
