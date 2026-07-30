export const level23 = {
  id: "level-23",
  title: "Level 23 – WebSockets vs Webhooks",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand the technical difference between Webhooks and WebSockets, and when to use each technology.

## Prerequisites
- Level 1 (Internet & Web Fundamentals)

## Concept Explanation
We know that a **Webhook** is a server sending an HTTP POST request to another server. Because it relies on standard HTTP, it requires the receiver to have a publicly routable IP address (or URL). 
But what if you want to push real-time data directly to a user's web browser or mobile phone? Web browsers don't have public URLs! Stripe cannot send an HTTP POST request to a user's Safari browser.

To solve this, we use **WebSockets**.
A WebSocket is a persistent, two-way, open connection between a Client (browser) and a Server. Instead of closing the connection after the HTTP request is finished, the WebSocket keeps the connection alive indefinitely. The server can push data down this open tube at any time, directly into the browser!

## Real-World Analogy
- **Webhook**: The postman drops a letter in your mailbox. You must have a physical, permanent address (URL).
- **WebSocket**: A phone call. You call the server and stay on the line. As long as you don't hang up, the server can talk to you instantly. It doesn't need to know your physical address, because the line is already open!

## Visual Diagram
\`\`\`mermaid
graph TD
    subgraph Webhook Flow (Server to Server)
        A[Stripe Server] -- POST Request --> B[Your Node.js Server]
    end
    
    subgraph WebSocket Flow (Server to Client)
        B -- Pushes Data down Open Socket --> C[User's Web Browser]
        B -- Pushes Data down Open Socket --> D[User's Mobile App]
    end
\`\`\`

## Technical Deep Dive: The Perfect Architecture
Webhooks and WebSockets are not competitors; they are partners. They are almost always used together to create real-time applications.

Imagine building a real-time food delivery app:
1. **Webhook**: The Restaurant's POS system sends a Webhook to your Backend Server saying "Pizza is out for delivery."
2. **WebSocket**: Your Backend Server looks up the Customer who ordered the pizza, finds their open WebSocket connection, and pushes the location data directly to their iPhone app.
3. The customer sees the car moving on the map in real-time!

## Code Example
Notice how WebSockets don't use Express routes or \`req/res\` models. They use event listeners.

\`\`\`javascript
// 1. Client (Browser) opens a WebSocket connection to the server
const socket = new WebSocket('ws://api.myapp.com');

// 2. Client listens for incoming data pushed by the server
socket.addEventListener('message', function (event) {
    console.log('Server says: ', event.data);
    // e.g., Update the UI to say "Pizza is out for delivery!"
});
\`\`\`

## Common Mistakes
- **Trying to use Webhooks for chat apps:** You cannot build a real-time chat app like Slack or Discord using webhooks to the browser. You must use WebSockets to push the messages to the clients.
- **Using WebSockets for Server-to-Server communication:** While possible, it is incredibly fragile. If the server reboots, the WebSocket connection drops, and any events that happened during the reboot are permanently lost. Webhooks with Retry Logic are far more durable for server-to-server communication.

## Troubleshooting
- **WebSocket connection dropping?** Firewalls and Proxies often kill long-running open connections if no data is sent for 60 seconds. You must implement a "Heartbeat" (sending a tiny 'ping' message every 30 seconds) to keep the WebSocket alive.

## Best Practices
- **Use Managed Services:** Scaling WebSockets across multiple servers is incredibly difficult (requires Redis Pub/Sub). For production apps, use managed WebSocket services like Pusher, Socket.io, or AWS API Gateway WebSockets.

## Hands-On Lab
*Think about your favorite web apps. Figma, Slack, Discord, and Google Docs all rely heavily on WebSockets to give you that instant, multiplayer feel!*

## Key Takeaways
1. Webhooks are for Server-to-Server communication.
2. WebSockets are for Server-to-Browser/Client communication.
3. A perfect architecture uses Webhooks to receive data from third parties, and WebSockets to push that data to the end user.

## What's Next
You have reached the end of the technical deep dives! Next, we will wrap up everything you've learned in the **Best Practices Summary**.
`,
  quiz: {
    question: "Why must you use WebSockets (instead of Webhooks) to push real-time data from your backend server to a user's web browser?",
    options: [
      "Because Webhooks are only supported in Python.",
      "Because WebSockets are encrypted, and Webhooks are not.",
      "Because web browsers do not have publicly routable IP addresses or URLs, so they cannot act as Webhook Receivers.",
      "Because WebSockets are slower, which is safer for browsers."
    ],
    correctAnswerIndex: 2,
    explanation: "Webhooks require a public URL to send the POST request to. Browsers run on private networks and cannot receive incoming HTTP POST requests."
  }
};
