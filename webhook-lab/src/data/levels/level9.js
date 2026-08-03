export const level9 = {
  id: "level-9",
  title: "Level 9 – Decoding the Errors",
  type: "theory",
  briefing: {
    recap: "You discovered that the external payment Webhook receiver was failing because the router configuration was maliciously altered to reject POST requests.",
    incident: "A massive influx of Webhooks from the CRM system to the Analytics Engine is failing. Dashboards across the company are going blank. The logs are showing a chaotic mix of 400 Bad Request and 502 Bad Gateway errors.",
    task: "Analyze the HTTP Status Codes to diagnose the root cause of the failures. Determine if the issue lies with the sender (CRM) or the receiver (Analytics Engine).",
    rewards: { xp: 100, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 14:22:05 UTC
**Service:** Analytics_Engine
**Status:** CASCADING FAILURE

You pull up the centralized logging dashboard. Thousands of requests are failing every minute, but they are failing for different reasons. 

\`\`\`log
[ERROR] POST /webhook/analytics -> 400 Bad Request
[ERROR] POST /webhook/analytics -> 502 Bad Gateway
[ERROR] POST /webhook/analytics -> 400 Bad Request
\`\`\`

To fix the outage, you need to understand what these numbers mean.

## Concept Explanation: HTTP Status Codes

Every HTTP response includes a 3-digit **Status Code** indicating the result of the request. They are grouped into five classes:

*   **1xx (Informational):** Request received, continuing process. (Rarely seen in daily ops).
*   **2xx (Success):** The action was successfully received, understood, and accepted. (e.g., \`200 OK\`, \`201 Created\`).
*   **3xx (Redirection):** Further action must be taken to complete the request. (e.g., \`301 Moved Permanently\`).
*   **4xx (Client Error):** The request contains bad syntax or cannot be fulfilled. **This means the sender messed up.** (e.g., \`400 Bad Request\`, \`401 Unauthorized\`, \`404 Not Found\`).
*   **5xx (Server Error):** The server failed to fulfill an apparently valid request. **This means the receiver is broken.** (e.g., \`500 Internal Server Error\`, \`502 Bad Gateway\`).

### Glossary: Listener vs. Receiver vs. Processor

Before we diagnose this, let's establish a strict mental model of what exactly is failing:

- **Listener:** The HTTP server (like Nginx or an API Gateway) that sits on the internet, keeping a port open, *waiting* for incoming connections. 
- **Receiver:** The application endpoint (like an Express route or AWS Lambda) that accepts the payload, validates it, and acknowledges receipt.
- **Processor:** The background worker or business logic that actually *does* the heavy lifting (like updating a database or sending an email) based on the payload.

### The Diagnosis

You look closer at the \`400 Bad Request\` errors. A 4xx error means the CRM system (the sender) is doing something wrong. You inspect the payload it's sending:

\`\`\`json
{
  "event_type": "user_signup",
  "payload": "{ corrupted_data_stream }",
  "timestamp": null
}
\`\`\`

The JSON payload is malformed! The rogue entity has injected a corruption script into the CRM's outbound Webhook queue. 

But what about the \`502 Bad Gateway\` errors? A 5xx error means our server (the Analytics Engine) is failing. 

You realize that the Analytics Engine's JSON parser wasn't built to handle corrupted data. When it tries to parse the malformed payload, the parsing process crashes entirely, causing the load balancer in front of it to return a \`502 Bad Gateway\` to subsequent requests while the server reboots.

You immediately push a patch to the Analytics Engine to safely try-catch JSON parsing errors and gracefully return a \`400 Bad Request\` instead of crashing. 

The 502s disappear. The servers stabilize. You've stopped the bleeding, but the rogue entity is still out there, actively modifying our systems.

> **SYSTEM ALERT:** Use curl to inspect the HTTP response headers of our receiver to see what error code it is throwing.
`

  ,
  simulator: {
    tasks: [
      {
        command: /^curl\s+-I\s+-X\s+POST\s+(http:\/\/)?10\.4\.55\.2\/webhook\/?$/i,
        instruction: "Send a HEAD/Headers-only POST request to the Webhook receiver to inspect its HTTP response codes. Use `curl -I -X POST http://10.4.55.2/webhook`",
        successMessage: "HTTP/1.1 500 Internal Server Error\nContent-Type: text/plain\n\n[SARAH]: \"A 500 error! Our receiver is crashing when it parses the payload!\"",
        errorMessage: "Invalid syntax. Try `curl -I -X POST http://10.4.55.2/webhook`"
      }
    ]
  }
};
