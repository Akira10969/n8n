export const level14 = {
  id: "level-14",
  title: "Level 14 – Webhook Security",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how to secure webhooks using HMAC signatures, timestamps, and SSL to prevent malicious actors from spoofing events.

## Prerequisites
- Level 13 (Webhook Debugging)

## Concept Explanation
Because webhook receivers must be publicly accessible on the internet, *anyone* can send an HTTP POST request to your URL. 
If an attacker discovers your URL (\`https://api.myapp.com/webhooks/billing\`), they could manually send a fake JSON payload saying \`"event": "invoice.paid", "amount": 1000\`. If your server blindly trusts this data, it will credit the attacker's account!

To prevent this, we use **HMAC (Hash-based Message Authentication Code)** signatures:
1. The provider and you share a Secret Key (e.g., \`my_super_secret\`).
2. Before sending the webhook, the provider mathematically hashes the JSON payload using that secret key, generating a unique Signature (e.g., \`x9f8b...\`).
3. They put this signature in an HTTP Header.
4. When you receive the payload, you hash it yourself using your copy of the secret key.
5. If your generated hash matches the header hash, the webhook is genuine!

## Real-World Analogy
Imagine receiving a wax-sealed letter from a King.
Anyone can write a letter and claim to be the King (spoofed JSON). But only the King possesses the royal signet ring (the Secret Key). When you see the exact wax seal stamped on the envelope (the HMAC Signature), you know with 100% certainty the King wrote it, and nobody tampered with the contents during delivery.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Stripe Payload + Secret Key] -- HMAC-SHA256 --> B(Stripe Signature: xyz...)
    B -- Sent in Header --> C{Your Server}
    
    C -- Hashes Payload with Your Secret Key --> D(Your Signature: xyz...)
    D -- Compare --> E{Do they match?}
    E -- Yes --> F[Process Webhook]
    E -- No --> G[Reject 401 Unauthorized]
\`\`\`

## Technical Deep Dive: Replay Attacks and Timestamps
Even with HMAC signatures, you are vulnerable to a **Replay Attack**. An attacker on your network intercepts a *valid* webhook request (e.g., "Credit User $10"). Because the signature is valid, the attacker simply copies the exact raw HTTP request and resends it 500 times. Your server processes it 500 times, crediting the user $5000!

To fix this, providers include a **Timestamp** in the header and factor it into the HMAC hash. Your server checks the timestamp. If the timestamp is more than 5 minutes old, your server rejects it, rendering the intercepted webhook completely useless to the attacker!

## Code Example
Verifying a signature in Node.js using the built-in \`crypto\` module:

\`\`\`javascript
const crypto = require('crypto');

function verifyWebhook(req, secretKey) {
  // 1. Get the signature from the headers
  const providerSignature = req.headers['x-provider-signature'];
  
  // 2. Hash the raw JSON body using your secret key
  const myHash = crypto
    .createHmac('sha256', secretKey)
    .update(req.rawBody) // MUST use the raw text, not parsed JSON!
    .digest('hex');
    
  // 3. Compare them safely to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(providerSignature), 
    Buffer.from(myHash)
  );
}
\`\`\`

## Common Mistakes
- **Hashing the parsed JSON:** This is the #1 mistake developers make. When Express runs \`express.json()\`, it strips out whitespace and modifies the string. If you hash the modified string, the signature will *never* match the provider's. You must hash the exact, raw textual buffer that came over the wire!

## Troubleshooting
- **Signatures never match?** Ensure you are using the correct hashing algorithm (SHA256 vs SHA1). Ensure you are using the raw HTTP body buffer, not the parsed JSON object.

## Best Practices
- **Use Provider Libraries:** Companies like Stripe provide official SDKs (e.g., \`stripe.webhooks.constructEvent\`). Always use these official SDKs to verify signatures rather than writing the cryptography code yourself.

## Hands-On Lab
*This module focuses on the concepts, but understand that security is the most critical part of webhooks. An unsecured webhook is a massive vulnerability.*

## Key Takeaways
1. Never trust incoming webhook data blindly.
2. Verify the HMAC signature to prove authenticity.
3. Validate timestamps to prevent Replay Attacks.
4. You must hash the raw textual body, not the parsed JSON object.

## What's Next
Now that your webhooks are secure, how do we make sure they survive server crashes and network outages? Next up: **Reliability**.
`,
  quiz: {
    question: "Why is it critical to hash the raw HTTP request body (as a string/buffer) rather than the parsed JSON object when verifying an HMAC signature?",
    options: [
      "Because JSON objects take too much memory to hash.",
      "Because parsing JSON changes the spacing, ordering, or formatting of the text. Hashing this modified data will result in a completely different cryptographic signature that won't match the provider's.",
      "Because cryptographic algorithms only accept binary video files.",
      "Because parsing JSON automatically decrypts the payload."
    ],
    correctAnswerIndex: 1,
    explanation: "Even a single missing space character will completely change an HMAC hash. You must hash the exact, byte-for-byte raw text that the provider sent over the network."
  }
};
