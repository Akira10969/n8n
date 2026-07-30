export const level6 = {
  id: "level-6",
  title: "Level 6 – API Authentication",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand how APIs verify who you are, the different methods of authentication, and how to securely handle credentials.

## Prerequisites
- Level 5 (JSON)

## Concept Explanation
Because REST APIs are stateless, they do not remember you. If you want to delete a user or view private billing information, the API needs proof that you are authorized to do so on *every single request*.

The most common ways to authenticate with an API include:
1. **API Keys**: A long, secret string of characters (e.g., \`sk_live_123456\`). You usually pass this in an HTTP Header.
2. **Bearer Tokens**: Similar to API keys, but usually generated dynamically upon login and passed in the \`Authorization\` header.
3. **OAuth 2.0**: A complex flow used when you want to grant a third-party app access to your data without giving them your password (e.g., "Log in with Google").
4. **JWT (JSON Web Token)**: A self-contained token that securely stores encrypted user data (like their User ID and Role) right inside the token itself.

## Real-World Analogy
Imagine trying to enter a secure office building.
- **API Key**: You have a physical master key that unlocks the door. If someone steals it, they can get in.
- **Bearer Token**: You show your ID to the front desk, and they print you a temporary visitor badge valid for 24 hours.
- **OAuth 2.0**: You bring a guest. You tell the security guard, "This person is with me, they are allowed into the lobby, but not the server room."

## Visual Diagram
\`\`\`mermaid
sequenceDiagram
    participant App as Client Application
    participant Auth as Auth Server
    participant API as Resource API

    App->>Auth: Here is my Username/Password
    Auth-->>App: Valid! Here is a JWT (Token)
    App->>API: GET /billing (Header: Authorization: Bearer <Token>)
    API-->>App: Valid Token! Here is the billing data.
\`\`\`

## Technical Deep Dive: JWT Anatomy
A JSON Web Token (JWT) looks like a long string of random gibberish: \`eyJhbGciOiJIUzI1Ni... (truncated)\`. But it is actually three Base64 encoded strings separated by dots:
1. **Header**: Contains the algorithm used to sign the token.
2. **Payload**: A JSON object containing the actual data (e.g., \`{"userId": 5}\`).
3. **Signature**: A cryptographic hash verifying that the token was created by your server and hasn't been altered by a hacker.

Because the token is cryptographically signed, the API server doesn't even need to query the database to verify it; it just mathematically checks the signature!

## Code Example
Sending an API Key or Bearer Token is usually done via the \`Authorization\` header.

\`\`\`javascript
// Fetching data using a Bearer Token
fetch('https://api.stripe.com/v1/customers', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk_test_123456789',
    'Content-Type': 'application/json'
  }
});
\`\`\`

## Common Mistakes
- **Exposing API Keys in Frontend Code:** If you put a secret API key into your React/Vue/Vanilla JS code, anyone can open their browser's Developer Tools, copy the key, and use it to delete your data or rack up massive server bills.
- **Committing API Keys to GitHub:** Bots scan public GitHub repositories 24/7. If you accidentally commit a secret key, hackers will steal it within seconds.

## Troubleshooting
- **Getting a 401 Unauthorized?** Your token is likely missing, expired, or misspelled in the header.
- **Getting a 403 Forbidden?** Your token is perfectly valid, but the user account associated with it does not have administrative permissions to perform the requested action.

## Best Practices
- **Use Environment Variables:** Store secret keys in a \`.env\` file on your backend server. Never hardcode them into your source code.
- **Rotate Keys:** If you suspect an API key was leaked, immediately invalidate (roll) it in the provider's dashboard and generate a new one.

## Hands-On Lab
*No lab for this section, but next time you log into a web app, open your Network tab in Developer Tools, click on an API request, and look for the \`Authorization\` header!*

## Key Takeaways
1. Authentication proves *who* you are; Authorization proves *what* you can do.
2. API Keys and Tokens must be sent with every request since APIs are stateless.
3. Secret keys should only ever be used on secure backend servers, never in the frontend.

## What's Next
You now have the prerequisite knowledge of the Internet, HTTP, REST, JSON, and Authentication. It is finally time to dive into the core subject: **Webhooks**.
`,
  quiz: {
    question: "If you want to securely use an API Key to charge a customer's credit card, where should the code that makes that API call live?",
    options: [
      "In the frontend React application, so it runs quickly on the user's device.",
      "In a secure backend server environment (like Node.js or Python) where the user cannot see the source code.",
      "In the query parameters of the URL.",
      "It doesn't matter, as long as you use HTTPS."
    ],
    correctAnswerIndex: 1,
    explanation: "Frontend code is fully visible to the user. Secret keys must be kept on a backend server, which acts as a secure middleman between the user and the payment API."
  }
};
