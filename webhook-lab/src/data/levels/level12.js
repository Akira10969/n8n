export const level12 = {
  id: "level-12",
  title: "Level 12 – The Key Rotation",
  type: "theory",
  briefing: {
    recap: "An attacker exploited the lack of webhook authentication to forge billing payloads and grant themselves Premium Administrator access. You implemented a shared secret to block them.",
    incident: "The fraudulent account upgrades have returned. the rogue entity is bypassing your 401 Unauthorized block. Somehow, they acquired the 'super_secret_token_123' used to authenticate webhooks.",
    task: "Implement a secure API Key management strategy. You must rotate the compromised keys without taking the production systems offline, and transition away from hardcoded secrets.",
    rewards: { xp: 100, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 02:15:09 UTC
**Service:** Account_Upgrader_Service
**Status:** COMPROMISED (AGAIN)

The security token you implemented in the last mission (\`super_secret_token_123\`) worked for exactly 5 hours. Now, the attacker is sending webhooks with the correct token.

How did they get it? You check the Business Cloud OS source code repository and realize the token was hardcoded directly into the JavaScript files. 

\`\`\`javascript
// BAD PRACTICE: Hardcoded Secret
const WEBHOOK_TOKEN = "super_secret_token_123";
\`\`\`

the rogue entity likely compromised a developer's machine or found an exposed git repository. Hardcoded secrets are a massive security vulnerability.

## Concept Explanation: API Keys and Secrets Management

Instead of hardcoding passwords into source code, modern infrastructure relies on **Environment Variables** and **Secrets Management Systems** (like AWS Secrets Manager or HashiCorp Vault). 

API Keys should be treated like nuclear launch codes. 
1. They should be long, randomly generated cryptographic strings.
2. They should never be checked into version control.
3. They must be rotatable.

### The Key Rotation Operation

You cannot simply turn off the old token, or legitimate webhooks will fail while you deploy the new one. You must perform a **Key Rotation**.

1. You generate a new, secure API key: \`mei_live_9x8f7d6a5s4d3f2g1h\`.
2. You inject this key into the Account Upgrader Service via secure environment variables.
3. You update the Account Upgrader to accept *both* the old token and the new token temporarily.

\`\`\`javascript
const validTokens = [ process.env.NEW_API_KEY, process.env.LEGACY_API_KEY ];
if (!validTokens.includes(request.headers['x-api-key'])) {
    return response.status(401).send("Unauthorized");
}
\`\`\`

4. You update the Billing Service to start sending the new key.
5. Once you verify all legitimate traffic is using the new key, you remove the old compromised key from the valid list.

The fraudulent upgrades stop again. But as you monitor the logs, you realize that if the attacker can read network traffic, they can just steal the new API key as it flies across the wire. We need something mathematically unbreakable.

> **SYSTEM ALERT:** Compromise detected. Use the MEI CLI to rotate the secrets for the \`billing_webhook\` service.
`

  ,
  simulator: {
    tasks: [
      {
        command: /^mei-cli\s+secrets\s+rotate\s+--service\s+billing_webhook$/i,
        instruction: "The API keys have been compromised. Immediately rotate the secrets for the billing service.",
        successMessage: "[OK] Generating new 256-bit entropy keys...\n[OK] Keys rotated for billing_webhook. Old keys invalidated.",
        errorMessage: "Invalid syntax. Try `mei-cli secrets rotate --service billing_webhook`"
      }
    ]
  }
};
