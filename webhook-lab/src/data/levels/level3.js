export const level3 = {
  id: "level-3",
  title: "Level 3 – HTTP Methods",
  type: "theory",
  briefing: {
    incident: "You figured out what the 404 error was! Now the customer wants to upload a new profile picture to their dashboard, but the server keeps rejecting the request.",
    task: "Investigate how data is sent to a server. You need to understand HTTP verbs (GET, POST, PUT, DELETE) to fix the customer's upload feature.",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Learning Objectives
By the end of this level, you will understand the purpose of different HTTP methods (verbs) and how they dictate the action a client wants the server to perform.

## Prerequisites
- Level 2 (HTTP Fundamentals)

## Concept Explanation
An HTTP URL tells the server *where* to go, but the **HTTP Method** (also known as a Verb) tells the server *what to do* when it gets there. 

There are several standard methods used in modern web development:

1. **GET**: Retrieve data. It should never modify data on the server (it is "safe" and "read-only").
2. **POST**: Submit new data to the server to create a new resource.
3. **PUT**: Replace an existing resource entirely.
4. **PATCH**: Apply partial modifications to an existing resource.
5. **DELETE**: Remove a resource from the server.
6. **OPTIONS**: Ask the server what methods are allowed for a specific URL (used mainly for browser security/CORS).

## Real-World Analogy
Imagine you are managing a physical filing cabinet.
- **GET**: Reading a file without changing it.
- **POST**: Writing a brand-new file and shoving it into the cabinet.
- **PUT**: Taking an existing file out, shredding it, and replacing it with a completely rewritten version.
- **PATCH**: Taking a file out, crossing out one sentence, writing a new one, and putting it back.
- **DELETE**: Taking the file out and burning it.

## Technical Deep Dive: PUT vs PATCH
These two methods are often confused because they both "update" data, but they operate differently under the hood:

If a User Profile looks like this: \`{"name": "Jem", "age": 26, "city": "London"}\`

If you send a **PUT** request with \`{"name": "James"}\`, the server will overwrite the entire resource. The new profile will be \`{"name": "James"}\`. The \`age\` and \`city\` fields will be deleted!

If you send a **PATCH** request with \`{"name": "James"}\`, the server will merge the data. The new profile will be \`{"name": "James", "age": 26, "city": "London"}\`.

## Code Example
When using JavaScript's \`fetch\` API, you specify the method in the configuration object. If you don't specify a method, it defaults to **GET**.

\`\`\`javascript
// A POST Request to create a new user
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Jem",
    email: "jem@example.com"
  })
});
\`\`\`

## Common Mistakes
- **Using GET to delete or update data:** Because GET requests are cached by browsers and CDNs, triggering a state change with a GET request (e.g., \`/deleteUser?id=5\`) can result in accidental deletions when search engine bots crawl your links!
- **Sending a Body in a GET request:** While technically possible in some servers, it violates the HTTP specification. GET requests should pass data via Query Parameters, not the Body.

## Troubleshooting
- **Getting a 405 Method Not Allowed error?** This means the URL exists, but the server is not configured to accept the specific verb you used. (e.g., You tried to POST to a read-only endpoint).

## Best Practices
- **Idempotency:** A method is "idempotent" if making the same request 100 times has the same effect as making it once. GET, PUT, and DELETE should always be idempotent. (Deleting a file once deletes it. Deleting it 99 more times does nothing extra). POST is generally *not* idempotent (clicking "Checkout" 100 times creates 100 orders!).

## Mini Quiz
*(Test your knowledge below!)*

## Key Takeaways
1. **GET** reads data, **POST** creates data, **DELETE** removes data.
2. **PUT** replaces an entire object, while **PATCH** updates specific fields.
3. Never use GET to perform actions that modify data on the server.

## What's Next
Now you know how to format requests and specify actions. In the next level, we'll see how developers organize these URLs and Methods into a structured **REST API**.
`,
  quiz: {
    question: "If you have a user profile with 50 fields, and you only want to update their 'email_address' without affecting the other 49 fields, which HTTP method is best practice?",
    options: [
      "POST",
      "PUT",
      "PATCH",
      "GET"
    ],
    correctAnswerIndex: 2,
    explanation: "PATCH is specifically designed for partial modifications. Using PUT would require you to send all 50 fields back to the server, otherwise the missing 49 fields might be deleted."
  }
};
