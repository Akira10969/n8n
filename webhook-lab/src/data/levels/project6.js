export const project6 = {
  id: "project-6",
  title: "Project 6 – CI/CD Deployment",
  type: "theory",
  content: `
## Project Goal
Understand how webhooks power the modern DevOps lifecycle by setting up a basic Continuous Integration / Continuous Deployment (CI/CD) trigger.

## Prerequisites
- A GitHub repository
- A cloud hosting provider (like Vercel, Netlify, or Render)

## Architecture Diagram
\`\`\`mermaid
graph LR
    A[Developer Git Push] --> B[GitHub]
    B -- Webhook 'push' event --> C[Vercel Server]
    C -- Pulls fresh code --> D[Builds Application]
    D -- Success --> E[Live on Internet]
\`\`\`

## Step-by-Step Instructions

### Step 1: Deploy Manually
1. Log into a platform like Vercel (or Netlify).
2. Click "Add New Project" and link your GitHub account.
3. Select your repository and click "Deploy". 
4. The platform will build your site and give you a public URL (e.g., \`https://my-app.vercel.app\`).

### Step 2: Inspect the Invisible Webhook
You didn't have to write a webhook receiver for this! When you linked your GitHub account, Vercel automatically registered a hidden webhook on your behalf.
1. Go to your GitHub Repository.
2. Click **Settings** > **Webhooks**.
3. You will see a webhook URL pointing to \`https://api.vercel.com/...\`. Vercel automatically configured this using the GitHub API!

### Step 3: Trigger the CI/CD Pipeline
1. Open your code locally.
2. Change a heading in your HTML or React code (e.g., \`<h1\>Hello CI/CD!\</h1\>\`).
3. Commit the change and run \`git push\`.

### Step 4: Watch the Magic
1. Instantly switch to your Vercel Dashboard.
2. You will see a new build has automatically started! 
3. GitHub fired the webhook to Vercel, Vercel verified the signature, pulled your new code, and is currently building it.

## Testing & Success Criteria
1. Wait 60 seconds for the build to finish.
2. Refresh your public website URL (\`https://my-app.vercel.app\`).
3. Your new heading should be live!

You have just witnessed how Event-Driven Architecture automates software deployment across the entire industry.
`
};
