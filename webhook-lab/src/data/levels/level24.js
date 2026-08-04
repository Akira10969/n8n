export const level24 = {
  "id": "level-24",
  "title": "Trust Nothing",
  "type": "theory",
  "briefing": {
    "recap": "The floodgates held. The DDoS failed. But the adversary has changed tactics. They are already inside.",
    "incident": "CRITICAL: The Billing service just received an 'invoice.paid' Webhook... but it didn't come from Stripe. The Anomaly is forging Webhooks to grant itself administrative access.",
    "task": "The final defense. Implement Cryptographic Webhook Signatures to verify the authenticity of all incoming payloads.",
    "rewards": {
      "xp": 400,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"How did that payload get through? It looked exactly like a Stripe Webhook! It bypassed the rate limiters, it bypassed the idempotency checks!\"\n\n**[UNIT-7]** \"ANALYSIS: The payload is a perfect forgery. However, it lacks cryptographic authentication.\"\n\n**[Sarah]** \"Trust nothing. Verify everything. We are turning on HMAC signatures. If a Webhook isn't cryptographically signed, it goes in the incinerator.\"\n\n### Core Engineering Principle: Payload Validation & Trust\nNever trust incoming data. Even if a Webhook has a valid HMAC signature, you must still validate the payload schema. Does `invoice_id` exist? Is it a number? A rogue entity could sign a malicious payload if they somehow compromised the sender. Always sanitize and validate before processing.\n\n## Webhook Signatures (HMAC)\nAnyone on the internet can send a POST request to `/webhooks/stripe` with a JSON body that says `\"paid\": true`. How do you know it actually came from Stripe?\n\nYou use **HMAC (Hash-based Message Authentication Code)**.\n1. You and Stripe share a **Secret Key** (e.g., `whsec_abc123`). This key is never sent over the network.\n2. When Stripe sends a Webhook, they take the JSON payload, encrypt it using the Secret Key, and put the result in an HTTP Header (e.g., `Stripe-Signature: t=123,v1=a1b2c3...`).\n3. When your server receives the Webhook, it takes the raw JSON payload, encrypts it using your copy of the Secret Key, and checks if the result matches the Header.\n\nIf even a *single comma* was changed in the JSON, or if the attacker didn't know the Secret Key, the signatures will not match.\n\nThis is the ultimate security layer. Forgery is mathematically impossible.\n\n### Platform Engineer Insight\n**What is this concept?** Cryptographic Webhook Signatures (like HMAC) authenticate the sender and verify payload integrity.\n**Why is it used?** To prevent attackers from forging webhooks or tampering with payload data in transit.\n**How does it work?** The sender hashes the payload with a shared secret key and includes it in headers. The receiver hashes the incoming payload with the same key and compares the results.\n**How do we monitor it in production?** We monitor metrics for signature validation failures, alerting on high failure rates which indicate compromised keys or active attacks.\n\n### Before You Act: Mutual TLS Authentication\n**What is this command?** `curl` with TLS flags\n**Why is it used?** To make HTTP requests that require mutual TLS (mTLS) authentication. You must provide both your client certificate and your private key to prove your identity to the server.\n**Important Flags:**\n* `--cert`: Specifies the path to your client certificate.\n* `--key`: Specifies the path to your private key.\n\n> **SYSTEM ALERT:** Authenticate with the central system using the compromised mTLS credentials. Make a curl request using client.pem and client.key.",
  simulator: {
    tasks: [
      {
        command: /^curl\s+--cert\s+client\.pem\s+--key\s+client\.key\s+https:\/\/core\.mei\.internal\/?$/i,
        instruction: 'Establish an mTLS connection and send a request to the secure webhook endpoint using your client certificate and private key.',
        hints: [
          "How do we prove our identity to a server using mutual TLS (mTLS)?",
          "Use curl with the `--cert` flag for the client certificate file (.pem) and `--key` for the private key, then provide the target HTTPS URL.",
          "Solution: curl --cert client.pem --key client.key https://core.mei.internal"
        ],
        solution: 'curl --cert client.pem --key client.key https://core.mei.internal',
        successMessage: "HTTP/1.1 200 OK\n[SARAH]: \"We're in. The core is exposed. It's time to build the ultimate weapon.\"",
        errorMessage: "Invalid syntax. Try `curl --cert client.pem --key client.key https://core.mei.internal`"
      }
    ]
  }
};
