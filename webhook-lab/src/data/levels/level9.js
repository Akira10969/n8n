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
[ERROR] POST /Webhook/analytics -> 400 Bad Request
[ERROR] POST /Webhook/analytics -> 502 Bad Gateway
[ERROR] POST /Webhook/analytics -> 400 Bad Request
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

\`\`\`JSON
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

### Platform Engineer Insight
**What is this concept?** HTTP Status Codes and Error Handling.
**Why is it used?** To standardized communication between systems about the outcome of a request, specifically differentiating between client faults (4xx) and server faults (5xx).
**How does it work?** The server computes the result of an operation and sets the appropriate 3-digit status code in the HTTP response header. Properly written clients use this code to determine whether to retry (for transient 5xx) or fail permanently (for 4xx).
**How do we monitor it in production?** We monitor the ratio of 2xx to 4xx and 5xx responses using tools like Datadog or Prometheus. A sudden spike in 5xx errors triggers a critical PagerDuty alert to the on-call engineer, as it indicates system degradation.

### Before You Act: Fetching HTTP Headers

To see exactly what error code the receiver is throwing without downloading a massive corrupted payload, we use \`curl\`.

**Command:** \`curl\`
**Purpose:** Transfer data from or to a server.

**Important Flags:**
- \`-I\` (or \`--head\`): Fetches the HTTP headers only! It sends an HTTP HEAD request instead of GET, but you can combine it with \`-X POST\` to force a POST request while still only asking the server to return the headers.
- \`-X POST\`: Specifies the request method.

**Real-world Use Case:** When a server is crashing or returning 500s, downloading the full response body might hang your terminal or flood it with HTML. Using \`-I\` instantly tells you the Status Code (like \`502 Bad Gateway\`) so you can diagnose the routing layer.
**Common Mistake:** Forgetting to capitalize the \`-I\`. Lowercase \`-i\` includes the headers *along with* the body, which defeats the purpose of a fast, header-only diagnostic check.

**Example Syntax:**
\`\`\`bash
curl -I -X POST http://api.example.com/endpoint
\`\`\`

> **SYSTEM ALERT:** Use curl to fetch only the HTTP headers from our receiver at \`http://10.4.55.2/webhook\` via a POST request.
`,
  simulator: {
    tasks: [
      {
        command: /^curl\s+-I\s+-X\s+POST\s+(HTTP:\/\/)?10\.4\.55\.2\/Webhook\/?$/i,
        instruction: 'Send a diagnostic HTTP request to fetch only the response headers from the receiver.',
        hints: [
          "How do we use curl to retrieve only the headers of an HTTP response?",
          "You need to make a POST request but use the head or include flag to fetch just the headers.",
          "Run \`curl -I -X POST http://10.4.55.2/webhook\`"
        ],
        solution: 'curl -I -X POST http://10.4.55.2/webhook',
        successMessage: "HTTP/1.1 500 Internal Server Error\nContent-Type: text/plain\n\n[SARAH]: \"A 500 error! Our receiver is crashing when it parses the payload!\"",
        errorMessage: "Invalid syntax. Try \`curl -I -X POST http://10.4.55.2/webhook\`"
      }
    ]
  }
};
