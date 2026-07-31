export const level11 = {
  id: "level-11",
  title: "Level 11 – The Imposter",
  type: "theory",
  briefing: {
    recap: "Internal microservices stopped trusting each other. You discovered and bypassed a rogue reverse proxy that was silently stripping Authorization headers in transit.",
    incident: "Hundreds of high-value user accounts have suddenly been granted 'Premium Administrator' access without payment. The system logs show these upgrades were triggered by successful billing webhooks. We are bleeding data and revenue.",
    task: "Investigate the webhook logs. Understand how an attacker is triggering legitimate system actions without making actual payments, and implement a foundational security layer.",
    rewards: { xp: 120, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 21:04:33 UTC
**Service:** Account_Upgrader_Service
**Status:** COMPROMISED

The Account Upgrader Service listens for webhooks from the Billing Service. When it receives a webhook indicating a payment was successful, it upgrades the user's account in the database.

You pull the logs for one of the fraudulent upgrades:

\`\`\`log
[INFO] Incoming POST /webhook/account-upgrade
[INFO] Payload: {"user_id": 9942, "status": "payment_success", "tier": "premium_admin"}
[INFO] Upgrading user 9942 to premium_admin...
\`\`\`

The webhook looks completely legitimate. However, when you cross-reference this with the actual Billing Service logs, the Billing Service *never sent that webhook*. 

## Concept Explanation: Webhook Authentication

Because webhooks are just HTTP requests sent to a public-facing URL (like \`/webhook/account-upgrade\`), **anyone on the internet who knows the URL can send a request to it.**

The saboteur discovered the URL for the Account Upgrader Service. They bypassed the billing system entirely and simply sent a fake HTTP POST request directly to the webhook receiver, pretending to be the Billing Service. 

Because our receiver had zero authentication in place, it blindly trusted the request and upgraded the attacker's accounts.

### Stopping the Bleeding

To stop the immediate attack, you must establish trust between the sender (Billing Service) and the receiver (Account Upgrader). The simplest form of authentication is a shared secret.

You modify the Billing Service to include a secret token in every webhook header:

\`\`\`http
POST /webhook/account-upgrade HTTP/1.1
Content-Type: application/json
X-Webhook-Token: super_secret_token_123

{"user_id": 9942, "status": "payment_success"}
\`\`\`

You then update the Account Upgrader Service to check for this token before processing any data:

\`\`\`javascript
if (request.headers['x-webhook-token'] !== 'super_secret_token_123') {
    return response.status(401).send("Unauthorized Imposter!");
}
\`\`\`

The fraudulent upgrades stop immediately. The attacker's requests are now bouncing off the 401 Unauthorized block. However, hardcoding a single token is a weak defense. It's only a matter of time before the saboteur finds another way in.

> **SYSTEM ALERT:** A rogue subnet is forging requests. Use iptables to drop all traffic from \`10.4.99.0/24\`.
`

  ,
  simulator: {
    tasks: [
      {
        command: /^iptables\s+-A\s+INPUT\s+-s\s+10\.4\.99\.0\/24\s+-j\s+DROP$/i,
        instruction: "Block the rogue subnet from sending forged webhooks. Drop all traffic from 10.4.99.0/24 using iptables.",
        successMessage: "iptables: rule added.\n[UNIT-7]: Rogue traffic dropping. Network stabilizing.\n[SARAH]: \"Good riddance. That stops the IP spoofing.\"",
        errorMessage: "Invalid command. Use `iptables -A INPUT -s 10.4.99.0/24 -j DROP`"
      }
    ]
  }
};
