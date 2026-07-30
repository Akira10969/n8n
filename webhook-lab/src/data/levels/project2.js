export const project2 = {
  id: "project-2",
  title: "Project 2 – GitHub Webhook",
  type: "theory",
  content: `
## Project Goal
Connect your local webhook receiver to a real-world provider (GitHub). You will configure GitHub to send a webhook to your laptop every time you push code to a repository, and you will securely verify the HMAC signature.

## Prerequisites
- Completion of Project 1 (Node.js and ngrok running)
- A GitHub account and a test repository

## Architecture Diagram
\`\`\`mermaid
graph LR
    A[You: 'git push'] --> B[GitHub Cloud]
    B -- Creates Signature --> C[HTTP POST /github]
    C -- ngrok --> D{Your Receiver}
    D -- Verifies Signature --> E[Log Event]
\`\`\`

## Step-by-Step Instructions

### Step 1: Configure GitHub
1. Go to your test repository on GitHub.
2. Click **Settings** > **Webhooks** > **Add webhook**.
3. **Payload URL**: Enter your ngrok URL with the github path (e.g., \`https://1a2b3c4d.ngrok.app/github\`).
4. **Content type**: Change this to \`application/json\`.
5. **Secret**: Enter a secret password (e.g., \`my_super_secret_123\`).
6. Select "Just the push event" and click **Add webhook**.

### Step 2: Update Your Code for Security
To verify GitHub's signature, you need the native \`crypto\` module. Replace your \`index.js\` from Project 1 with this:

\`\`\`javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

const GITHUB_SECRET = 'my_super_secret_123';

// We MUST use raw body parsing to verify the signature properly!
app.post('/github', express.raw({type: 'application/json'}), (req, res) => {
    
    // 1. Get GitHub's signature from the headers
    const signature = req.headers['x-hub-signature-256'];
    
    // 2. Generate our own signature using the raw HTTP body
    const myHash = 'sha256=' + crypto
        .createHmac('sha256', GITHUB_SECRET)
        .update(req.body)
        .digest('hex');

    // 3. Compare them
    if (signature !== myHash) {
        console.error("🚨 SECURITY ALERT: Invalid Signature!");
        return res.status(401).send("Unauthorized");
    }

    // 4. If valid, parse the JSON and process it
    const event = JSON.parse(req.body.toString());
    console.log(\`✅ Verified Push from \${event.pusher.name}\`);
    console.log(\`Commit Message: \${event.commits[0].message}\`);

    res.status(200).send("Success");
});

app.listen(3000, () => console.log('Listening on port 3000'));
\`\`\`

### Step 3: Restart and Test
Stop your Node server (\`Ctrl+C\`) and restart it (\`node index.js\`). Leave ngrok running!

Now, make a change to a file in your GitHub repository, commit it, and run \`git push\`.

## Testing & Success Criteria
1. When you push your code, check your local terminal.
2. You should see \`✅ Verified Push from [Your Name]\` printed in the console.
3. **Extra Credit**: Try changing the \`GITHUB_SECRET\` in your code to the wrong password, restart the server, and push again. You should see the \`🚨 SECURITY ALERT\` get triggered!
`
};
