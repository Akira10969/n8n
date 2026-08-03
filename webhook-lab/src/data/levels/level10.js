export const level10 = {
  id: "level-10",
  title: "Level 10 – The Missing Credentials",
  type: "theory",
  briefing: {
    recap: "A massive influx of malformed payloads crashed the Analytics Engine. You patched the JSON parser to safely return 400 Bad Request instead of crashing.",
    incident: "Internal microservices have stopped communicating. The Authorization Service is blanket rejecting all requests from the Order Service with \\401 Unauthorized\\ errors, bringing all transactions to a halt.",
    task: "Inspect the raw HTTP requests traveling between the Order Service and the Authorization Service. Determine why valid requests are suddenly being rejected.",
    rewards: { xp: 100, badge: 'platform-operations-started' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 16:03:11 UTC
**Service:** Authorization_Gateway
**Status:** CRITICAL

The Order Service makes API calls to the Authorization Gateway to verify user permissions before processing orders. Suddenly, every single one of these calls is failing.

You pull the logs from the Authorization Gateway:

\`\`\`log
[AUTH] Incoming request from Order_Service.
[AUTH] Missing authentication credentials.
[AUTH] Rejecting with \\401 Unauthorized\\.
\`\`\`

You know the Order Service is configured to send its credentials. You SSH into the Order Service container and intercept an outbound request to see exactly what it is sending over the wire:

\`\`\`HTTP
POST /verify HTTP/1.1
Host: auth.mei.internal
Content-Type: application/JSON
Authorization: Bearer xyz123_secure_token_999
User-Agent: MEI-Order-Service/v2.1

{"user_id": 8812}
\`\`\`

The credentials are right there in the \`Authorization\` header! Why isn't the Authorization Gateway seeing them?

## Concept Explanation: HTTP Headers

An HTTP request consists of three main parts:
1. **The Request Line:** (e.g., \`POST /verify HTTP/1.1\`)
2. **Headers:** Key-value pairs providing metadata about the request.
3. **The Body (Payload):** The actual data being sent (like JSON).

**Headers** act like the metadata on an envelope. They tell the server what format the data is in (\`Content-Type\`), what kind of client is making the request (\`User-Agent\`), and most importantly, who is making the request (\`Authorization\`).

### The Sabotage

If the Order Service is sending the header, but the Authorization Gateway isn't receiving it, something in the middle must be stripping it out.

You run a \`traceroute\` and discover that overnight, a new reverse proxy was inserted between the Order Service and the Authorization Gateway. You pull the configuration for this unknown proxy:

\`\`\`nginx
# Malicious Proxy Config
server {
    listen 80;
    location / {
        proxy_pass http://auth.mei.internal;
        proxy_set_header Authorization ""; # STRIP CREDENTIALS
    }
}
\`\`\`

The rogue entity deployed a silent proxy specifically designed to strip the 'Authorization' header in transit, causing the entire system to lock down as components could no longer trust each other. 

You bypass the malicious proxy, restoring the 'Authorization' headers, and the transactions begin flowing again. the rogue entity is no longer just causing errors; they are actively manipulating the network topology.

> **SYSTEM ALERT:** The endpoint is now secure. Prove you can access it by passing the Bearer token via curlHTTP/1.1 200 OK\n\n### Platform Engineer Insight\n**Troubleshooting:** When you see a sudden wave of '401 Unauthorized' errors from your Webhook receiver, your first step is to verify if the Sender's API keys or HMAC secrets were recently rotated and if your infrastructure was updated to match.
`,
  simulator: {
    tasks: [
      {
        command: /^curl\s+-H\s+["']Authorization:\s+Bearer\s+secret_token["']\s+(HTTP:\/\/)?10\.4\.55\.2\/Webhook\/?$/i,
        instruction: "Test the authenticated endpoint by passing the Bearer token in the headers. Use `curl -H \"Authorization: Bearer secret_token\" http://10.4.55.2/webhook`",
        successMessage: "HTTP/1.1 200 OK\n{\"status\": \"Authorized\"}\n[SARAH]: \"Perfect. The endpoint is locked down. Only those with the token can enter.\"",
        errorMessage: "Invalid syntax. Ensure you are passing the Authorization header exactly as shown."
      }
    ]
  }
};
