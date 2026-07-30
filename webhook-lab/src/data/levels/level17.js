export const level17 = {
  id: "level-17",
  title: "Level 17 – Message Queues",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how to use Message Queues to buffer massive spikes in webhook traffic, preventing your application from crashing.

## Prerequisites
- Level 16 (Event-Driven Architecture)

## Concept Explanation
Imagine it is Black Friday. Your e-commerce store normally receives 10 "Order Placed" webhooks per minute. Suddenly, a popular influencer links your product, and you receive 10,000 webhooks per second.

If your Webhook Receiver tries to immediately insert all 10,000 orders into the database, the database will run out of memory, crash, and your entire business goes offline.

To solve this, we use a **Message Queue** (like RabbitMQ, Apache Kafka, or AWS SQS).
When a webhook arrives, the receiver does *not* talk to the database. It simply drops the JSON payload into the Queue and immediately returns a 200 OK. 
Meanwhile, a separate cluster of **Worker Servers** slowly pull payloads out of the queue, one by one, at a safe pace that the database can handle.

## Real-World Analogy
Think of a theme park roller coaster. 
If 1,000 people arrive at the ride simultaneously, they don't all dogpile onto the coaster and break it. They stand in a **Queue** (a line). The roller coaster only takes 20 people at a time. The line acts as a shock absorber for the massive spike in traffic.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[10,000 Webhooks/sec] --> B(Webhook Receiver)
    B -- Pushes to Queue --> C[[Message Queue / Kafka]]
    B -- Returns 200 OK instantly --> A
    
    C -- Pulls 100/sec --> D[Worker 1]
    C -- Pulls 100/sec --> E[Worker 2]
    
    D -- Safe DB Inserts --> F[(Database)]
    E -- Safe DB Inserts --> F
\`\`\`

## Technical Deep Dive: Kafka vs RabbitMQ
There are different types of queues depending on your architecture:
- **RabbitMQ (Message Broker)**: Great for task processing. A worker pulls a message off the queue, processes it, and tells RabbitMQ to delete it forever.
- **Apache Kafka (Event Stream)**: Great for enterprise event-driven architectures. Messages aren't deleted when read. Instead, multiple different microservices can "replay" the stream from the beginning, allowing complex analytics and event sourcing.

## Code Example
Conceptual flow using a hypothetical Queue library:

\`\`\`javascript
// 1. The Receiver: Dumb and Fast
app.post('/webhook', (req, res) => {
  // Just dump the payload into the queue and respond immediately!
  MyQueue.push("order_queue", req.body);
  res.status(200).send();
});

// --------------------------------------------- //

// 2. The Background Worker: Smart and Slow
MyQueue.listen("order_queue", async (payload) => {
  try {
    // Process the data at a safe, steady pace
    await Database.insertOrder(payload);
    console.log("Order processed successfully.");
  } catch (error) {
    console.error("DB failed, returning message to queue to retry later.");
    throw error; 
  }
});
\`\`\`

## Common Mistakes
- **Doing work in the receiver:** If you do a database lookup *before* putting the message in the queue, you defeat the entire purpose of the queue. The receiver must be as "dumb" and fast as possible.

## Troubleshooting
- **Queue backing up?** If your queue has 500,000 messages and is growing, your workers are too slow. You need to spin up more Worker servers (horizontal scaling) to process the backlog faster.

## Best Practices
- **Dead Letter Queues (DLQ):** If a worker tries to process a message 5 times and it fails every time (e.g., due to a bad JSON format), the queue should move it to a DLQ so it doesn't block the rest of the healthy messages.

## Hands-On Lab
*Think about how YouTube processes uploaded videos. Do they process the 4K video while you wait for the HTTP request to finish? No! They queue it, and show you a "Processing..." screen.*

## Key Takeaways
1. Message queues act as shock absorbers for massive traffic spikes.
2. The Webhook Receiver should just push to the queue and respond with 200 OK.
3. Background workers pull from the queue at a safe pace to protect the database.

## What's Next
We just saw how workers process tasks in the background. In the next level, we'll formalize this concept: **Async Processing**.
`,
  quiz: {
    question: "What is the primary purpose of adding a Message Queue to a webhook architecture?",
    options: [
      "To automatically translate JSON payloads into XML.",
      "To act as a shock absorber during traffic spikes, ensuring the database isn't overwhelmed by decoupling the receipt of data from the processing of data.",
      "To encrypt webhooks so hackers cannot read them.",
      "To increase the speed of the user's internet connection."
    ],
    correctAnswerIndex: 1,
    explanation: "Queues buffer incoming data. They absorb massive spikes in traffic, allowing background workers to process the data steadily without crashing your infrastructure."
  }
};
