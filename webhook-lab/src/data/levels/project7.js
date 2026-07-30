export const project7 = {
  id: "project-7",
  title: "Project 7 – Webhook Gateway",
  type: "theory",
  content: `
## Project Goal
This is the ultimate capstone project. You will design and code a production-ready Webhook Gateway in Node.js that implements all the security, reliability, and asynchronous processing best practices learned in this course.

## Prerequisites
- Advanced knowledge of Node.js and Express
- A local Redis instance (for queueing and idempotency)
- Ngrok for testing

## Architecture Diagram
\`\`\`mermaid
graph TD
    A[Stripe Webhook] --> B(Express Gateway: Port 3000)
    
    subgraph Synchronous
    B --> C{Verify HMAC Signature}
    C -- Valid --> D{Check Idempotency in Redis}
    D -- Not Duplicate --> E[Push Payload to Redis Queue]
    E --> F[Return 202 Accepted]
    end
    
    subgraph Asynchronous
    G[Background Worker] -- Pulls from Queue --> H[Simulate Heavy Database Insert]
    H -- Success --> I[Mark Event Processed]
    H -- Failure --> J[Push to Dead Letter Queue]
    end
\`\`\`

## Step-by-Step Instructions

### Step 1: Initialize the Gateway
1. Create a new Node.js project.
2. Install the required dependencies: \`npm install express redis crypto\`

### Step 2: Build the Synchronous Receiver
Write an Express server that acts strictly as a gateway. It should do no heavy processing.
1. Use \`express.raw()\` to capture the raw body.
2. Verify the HMAC signature (refer to Level 14).
3. If valid, connect to your Redis database and check if the \`req.body.id\` exists.
4. If it exists, return \`200 OK\` (Duplicate).
5. If it does not exist, use \`redis.lpush('webhook_queue', rawBody)\` to drop the payload into a list.
6. Immediately return \`202 Accepted\`.

### Step 3: Build the Asynchronous Worker
In a separate file (e.g., \`worker.js\`), write a script that connects to Redis and continuously polls the queue.
1. Use \`redis.brpop('webhook_queue', 0)\` to block and wait for new events.
2. When an event pops out, parse the JSON.
3. Simulate heavy processing by using a \`setTimeout\` for 5 seconds.
4. After 5 seconds, write the event ID to a Redis Set to mark it as processed (satisfying the Idempotency check).

### Step 4: Add Fault Tolerance
1. Wrap your worker logic in a \`try/catch\` block.
2. If the simulated processing fails, catch the error and push the payload to a new Redis list called \`dead_letter_queue\`.

## Testing & Success Criteria
1. Start your gateway (\`node index.js\`) and your worker (\`node worker.js\`) in two different terminal windows.
2. Use ngrok to expose your gateway.
3. Send a valid webhook via Postman.
4. **Validation 1**: Your gateway terminal should log "202 Accepted" instantly!
5. **Validation 2**: Your worker terminal should log "Processing..." and finish 5 seconds later.
6. **Validation 3**: Send the exact same payload a second time. Your gateway should log "Duplicate ignored" and return a 200 OK without sending it to the queue.

Congratulations! You have built a robust, enterprise-grade Webhook architecture capable of handling millions of requests safely!
`
};
