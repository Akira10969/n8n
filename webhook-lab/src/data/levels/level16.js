export const level16 = {
  id: "level-16",
  title: "Level 16 – Event-Driven Architecture",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand the fundamentals of Event-Driven Architecture (EDA) and how webhooks facilitate communication between decoupled microservices.

## Prerequisites
- Level 15 (Reliability)

## Concept Explanation
Historically, applications were built as giant "Monoliths." If the Billing module needed to tell the Shipping module that an order was paid, it just called a function in the same codebase. 
Modern applications are built using **Microservices**. The Billing API and the Shipping API might be written in different languages and hosted on different servers. How do they communicate?

**Event-Driven Architecture (EDA)** solves this. In EDA:
1. **Producer**: A service that detects an event and broadcasts it (e.g., Stripe detects a payment).
2. **Event**: A record of what happened (e.g., "Payment Success").
3. **Consumer**: A service that listens for events and reacts to them (e.g., Your Shipping API).

Webhooks are the glue in EDA. The Producer sends a webhook to the Consumer to notify them that the Event occurred. 

## Real-World Analogy
Think of a hospital. 
- **Monolith**: A doctor walks down 5 flights of stairs to tell the pharmacist to prepare medication, waits for it, and walks back up.
- **EDA**: The doctor hits a "Code Blue" button (the Event). A pager on the pharmacist's belt beeps (the Webhook). The pharmacist prepares the meds while the doctor stays with the patient. The systems are completely decoupled.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Stripe Billing Service] -- POST Webhook: Invoice Paid --> B(Webhook Gateway)
    B -- Forwards Event --> C[Shipping Microservice]
    B -- Forwards Event --> D[Email Microservice]
    B -- Forwards Event --> E[Analytics Microservice]
\`\`\`

## Technical Deep Dive: Decoupling
The primary benefit of EDA is **Decoupling**. The Producer (Stripe) knows absolutely nothing about your internal Shipping, Email, or Analytics microservices. It just yells into the void, "An invoice was paid!" Any system that cares can "subscribe" to that event via a webhook. If you decide to completely rewrite your Email Microservice in a new language, Stripe doesn't care. The architectural separation is perfect.

## Code Example
In a decoupled system, the receiver only cares about its own domain logic:

\`\`\`javascript
// Shipping Microservice Webhook Receiver
app.post('/webhooks/billing', (req, res) => {
  const event = req.body;
  
  if (event.type === 'invoice.paid') {
    // The Shipping service doesn't care how the payment happened.
    // It only cares that it's time to ship the box!
    ShippingService.generateLabel(event.customer_id);
  }
  
  res.status(200).send();
});
\`\`\`

## Common Mistakes
- **Creating tight coupling via webhooks:** If your Billing service sends a webhook payload specifically formatted for your Shipping service (e.g., containing box dimensions), they are no longer decoupled. Events should be generic (e.g., "Invoice Paid"), and the Consumer should fetch the extra details it needs.

## Troubleshooting
- **An event happened, but a service didn't react?** In EDA, you must trace the event. Did the Producer send it? Did the Gateway route it? Did the Consumer fail to parse it? Centralized logging is critical here.

## Best Practices
- **Use standard event naming conventions:** Format your events clearly, like \`resource.action\` (e.g., \`user.created\`, \`order.shipped\`).

## Hands-On Lab
*This level is purely conceptual. Think about how many decoupled systems interact when you order an Uber (Payment, Driver Routing, Push Notifications, Analytics).*

## Key Takeaways
1. Webhooks facilitate communication between separated systems (Microservices).
2. The Producer creates the event, and the Consumer reacts to it.
3. Event-Driven Architecture creates highly scalable, decoupled software.

## What's Next
If your Producer yells "Event!" 10,000 times a second, your Consumer will crash. Next, we learn how to buffer those events using **Message Queues**.
`,
  quiz: {
    question: "What is the primary architectural benefit of an Event-Driven Architecture (EDA)?",
    options: [
      "It allows all code to run on a single monolithic server.",
      "It completely decouples the Producer from the Consumers, allowing services to be built, scaled, and modified independently.",
      "It encrypts database passwords automatically.",
      "It guarantees that webhooks will never fail."
    ],
    correctAnswerIndex: 1,
    explanation: "Decoupling is the core of EDA. Stripe doesn't need to know how your email system works; it just broadcasts the event, and your email system reacts independently."
  }
};
