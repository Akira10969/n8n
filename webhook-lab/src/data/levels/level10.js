export const level10 = {
  id: "level-10",
  title: "Level 10 – Webhook Receiver",
  type: "lab",
  content: `
## Learning Objectives
By the end of this level, you will understand the common technologies used to build a webhook receiver and the core responsibilities that receiver must fulfill.

## Prerequisites
- Level 9 (Webhook Lifecycle)

## Concept Explanation
A **Webhook Receiver** (or Webhook Endpoint) is simply a web server that you control, configured to listen for HTTP POST requests on a specific URL path. 

Because webhooks are just HTTP requests, you can build a receiver in literally any programming language that supports web servers:
- **JavaScript/Node.js**: Using Express.js or Fastify.
- **Python**: Using Flask, FastAPI, or Django.
- **PHP**: Using Laravel or raw PHP scripts.
- **Go**: Using the standard \`net/http\` library.

Regardless of the language, the receiver's job is always the same:
1. Accept the POST request.
2. Parse the JSON body.
3. Return a 200 OK.

## Real-World Analogy
Building a webhook receiver is like hiring a receptionist for your office.
It doesn't matter if the receptionist speaks English (Node.js) or French (Python). Their job is just to sit at the front desk (the URL), accept packages from the delivery driver (the POST request), sign the receipt (200 OK), and put the package in the mailroom for the staff to open later.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Stripe Webhook] -->|POST /webhooks/stripe| B(Nginx Reverse Proxy)
    B -->|Forwards to Port 3000| C{Express.js Server}
    C -->|Returns 200 OK| A
    C -->|Saves to DB| D[(PostgreSQL)]
\`\`\`

## Technical Deep Dive: Public Accessibility
The biggest hurdle developers face when building their first webhook receiver is that **the provider cannot see your laptop**. 
If you write an Express.js server and run it on \`http://localhost:3000\`, GitHub cannot send a webhook to that address because \`localhost\` only exists on your personal network. To receive a real webhook, your code must be hosted on a public server (like AWS, Heroku, or Vercel) or you must use a tunneling tool (which we will cover in Level 12).

## Code Example
A minimal webhook receiver in Python using FastAPI:

\`\`\`python
from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/webhook")
async def receive_webhook(request: Request):
    # 1. Parse the JSON body
    payload = await request.json()
    
    # 2. Log the event
    print(f"Received event: {payload.get('type')}")
    
    # 3. FastAPI automatically returns a 200 OK for successful executions
    return {"status": "success"}
\`\`\`

## Common Mistakes
- **Forgetting to parse the body:** If you use Node.js Express, you must include the \`express.json()\` middleware, otherwise \`req.body\` will be completely undefined!
- **Changing URLs:** If you move your code to a new server and the IP address or domain changes, you must remember to update the URL in the provider's dashboard, or the webhooks will go to the old, dead address.

## Troubleshooting
- **Cannot receive webhooks locally?** Verify that your firewall isn't blocking incoming traffic, and remember that you need a public tunneling URL for external providers to reach you.

## Best Practices
- **Log Everything:** Webhooks are asynchronous and happen behind the scenes. If your receiver doesn't write incoming payloads to a log file or database, debugging failures will be nearly impossible because you have no record of what the provider actually sent.

## Hands-On Lab
*Scroll down to the Interactive Lab! In this lab, you act as the Webhook Receiver. You can configure the response code you want to send back, and simulate what happens when you accept or reject a payload.*

## Key Takeaways
1. A webhook receiver is just a standard web server listening for POST requests.
2. Receivers can be built in any programming language.
3. The receiver must be publicly accessible on the internet.

## What's Next
Now you know how to build a server to *receive* webhooks. But what if you want to build a platform (like Shopify) that *sends* webhooks to your users? We'll cover that next.
`,
  quiz: {
    question: "Why can't you configure Stripe to send webhooks directly to http://localhost:3000?",
    options: [
      "Because Stripe only supports Python servers.",
      "Because 'localhost' is a private loopback address that only exists on your local machine; Stripe's servers on the public internet cannot route traffic to it.",
      "Because localhost requires an active SSL certificate to receive POST requests.",
      "You can, you just have to use a VPN."
    ],
    correctAnswerIndex: 1,
    explanation: "External services exist on the public internet. They cannot send HTTP requests to private, non-routable IP addresses or local domains."
  }
};
