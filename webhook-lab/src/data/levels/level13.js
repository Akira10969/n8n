export const level13 = {
  id: "level-13",
  title: "Level 13 – The Cryptographic Seal",
  type: "theory",
  briefing: {
    recap: "The attacker stole the shared secret from an exposed Git repo. You executed a zero-downtime key rotation using environment variables to secure the system.",
    incident: "Your suspicions were correct. The attacker intercepted the new API key during transmission. Fraudulent account upgrades are happening again. Simple authentication is no longer sufficient; we need mathematical proof of authenticity.",
    task: "Upgrade the Webhook security architecture. Implement HMAC (Hash-based Message Authentication Code) signatures so the receiver can mathematically verify that the payload has not been tampered with and was sent by a trusted source.",
    rewards: { xp: 150, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 04:55:22 UTC
**Service:** Account_Upgrader_Service
**Status:** COMPROMISED (LEVEL 3)

the rogue entity has proven they have network-level visibility. If they can intercept the API key in transit, they can impersonate the Billing Service indefinitely. 

Sending a static password (API Key) over the network is like sending a wax-sealed envelope where anyone can copy the seal. We need a way to prove who sent the message without actually sending the password.

### The Webhook Development Lifecycle: Local Development & Staging
Building Webhooks is tricky because the sender needs a public URL, but your code is running on your \`localhost\`. In the real world, developers use tunneling tools like **ngrok** to expose their local environment to the internet. 

Once local testing passes, code is pushed to a **Staging Environment** for QA, before finally being promoted to **Production**.

## Concept Explanation: HMAC Signatures

**HMAC (Hash-based Message Authentication Code)** is the industry standard for securing Webhooks (used by Stripe, GitHub, Twilio, etc.).

Instead of sending the secret key in the request, the sender uses the secret key to mathematically "sign" the payload. 

1. **The Sender (Billing Service)** takes the JSON payload and the Secret Key, and runs them through a cryptographic hashing algorithm (like SHA-256).
2. The result is a unique, unforgeable string of characters (the signature). 
3. The sender sends the JSON payload and the signature in a header (e.g., \`X-MEI-Signature: sha256=abc123...\`), but *never sends the secret key*.

When the **Receiver (Account Upgrader)** gets the Webhook:
1. It takes the incoming JSON payload and its own copy of the Secret Key.
2. It runs the exact same hashing algorithm.
3. If the signature the receiver generates matches the signature in the header, the Webhook is **100% authentic**. 

If the attacker alters even a single comma in the JSON payload, the math changes, the signatures won't match, and the request is rejected. Because the attacker doesn't know the Secret Key, they cannot generate a valid signature for their fake payloads.

### Deploying the Cryptographic Seal

You implement the HMAC verification middleware across all Business Cloud OS Webhook receivers. 

\`\`\`javascript
const crypto = require('crypto');
const expectedSignature = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
                                .update(request.rawBody)
                                .digest('hex');

if (request.headers['x-mei-signature'] !== expectedSignature) {
    throw new Error("Mathematical Verification Failed. Dropping payload.");
}
\`\`\`

The attacker attempts to send another fake upgrade. It fails. They try to alter a legitimate payload in transit. It fails. 

You have cryptographically locked them out. But a rogue entity with this level of access won't just give up. If they can't forge the data, they will try to destroy it.

> **SYSTEM ALERT:** We must verify payload integrity. Use openssl to compute the HMAC signature.
`

  ,
  simulator: {
    tasks: [
      {
        command: /^openssl\s+dgst\s+-sha256\s+-hmac\s+["']secret["']\s+payload\.JSON$/i,
        instruction: "Manually compute the HMAC SHA-256 signature of the payload.JSON file using the secret key.",
        successMessage: "HMAC-SHA256(payload.JSON)= 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08\n[SARAH]: \"The signatures match! The cryptographic seal holds.\"",
        errorMessage: "Invalid syntax. Use `openssl dgst -sha256 -hmac \"secret\" payload.json`"
      }
    ]
  }
};
