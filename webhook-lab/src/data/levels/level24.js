export const level24 = {
  "id": "level-24",
  "title": "Trust Nothing",
  "type": "theory",
  "briefing": {
    "recap": "The floodgates held. The DDoS failed. But the adversary has changed tactics. They are already inside.",
    "incident": "CRITICAL: The Billing service just received an 'invoice.paid' webhook... but it didn't come from Stripe. The Anomaly is forging webhooks to grant itself administrative access.",
    "task": "The final defense. Implement Cryptographic Webhook Signatures to verify the authenticity of all incoming payloads.",
    "rewards": {
      "xp": 400,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"How did that payload get through? It looked exactly like a Stripe webhook! It bypassed the rate limiters, it bypassed the idempotency checks!\"\n\n**[UNIT-7]** \"ANALYSIS: The payload is a perfect forgery. However, it lacks cryptographic authentication.\"\n\n**[Sarah]** \"Trust nothing. Verify everything. We are turning on HMAC signatures. If a webhook isn't cryptographically signed, it goes in the incinerator.\"\n\n## Webhook Signatures (HMAC)\nAnyone on the internet can send a POST request to `/webhooks/stripe` with a JSON body that says `\"paid\": true`. How do you know it actually came from Stripe?\n\nYou use **HMAC (Hash-based Message Authentication Code)**.\n1. You and Stripe share a **Secret Key** (e.g., `whsec_abc123`). This key is never sent over the network.\n2. When Stripe sends a webhook, they take the JSON payload, encrypt it using the Secret Key, and put the result in an HTTP Header (e.g., `Stripe-Signature: t=123,v1=a1b2c3...`).\n3. When your server receives the webhook, it takes the raw JSON payload, encrypts it using your copy of the Secret Key, and checks if the result matches the Header.\n\nIf even a *single comma* was changed in the JSON, or if the attacker didn't know the Secret Key, the signatures will not match.\n\nThis is the ultimate security layer. Forgery is mathematically impossible."

  ,
  simulator: {
    tasks: [
      {
        command: /^curl\s+--cert\s+client\.pem\s+--key\s+client\.key\s+https:\/\/core\.mei\.internal\/?$/i,
        instruction: "Bypass the Zero Trust Architecture by presenting valid mutual TLS (mTLS) certificates.",
        successMessage: "HTTP/1.1 200 OK\n[SARAH]: \"We're in. The core is exposed. It's time to build the ultimate weapon.\"",
        errorMessage: "Invalid syntax. Try `curl --cert client.pem --key client.key https://core.mei.internal`"
      }
    ]
  }
};
