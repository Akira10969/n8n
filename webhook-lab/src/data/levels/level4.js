export const level4 = {
  id: "level-4",
  title: "Level 4 – REST APIs",
  type: "theory",
  briefing: {
    incident: "Acme Cloud's marketing team wants to build a new mobile app that shows live server statuses, but they don't know how to fetch the data from our backend.",
    task: "You need to explain how our backend API is structured. Master the concept of REST APIs to teach the marketing team how to consume our data.",
    rewards: { xp: 50, badge: 'badge_internet' }
  },
  content: `
## Learning Objectives
By the end of this level, you will understand what an API is, what makes an API "RESTful", and how to interact with resources using standard CRUD operations.

## Prerequisites
- Level 3 (HTTP Methods)

## Concept Explanation
An **API (Application Programming Interface)** is a set of rules that allows two pieces of software to talk to each other. When we talk about web APIs, we usually mean **REST APIs**.

REST (Representational State Transfer) is a set of architectural conventions. A REST API organizes data into **Resources** (like Users, Posts, or Orders) and uses standard HTTP methods to manipulate them. Instead of having messy URLs like \`/createNewUser\` or \`/deleteUser?id=5\`, REST uses clean URLs combined with HTTP methods:

- \`GET /users\` (Get all users)
- \`POST /users\` (Create a new user)
- \`GET /users/5\` (Get user #5)
- \`PUT /users/5\` (Update user #5)
- \`DELETE /users/5\` (Delete user #5)

This standardized mapping of Create, Read, Update, and Delete operations is known as **CRUD**.

## Real-World Analogy
Think of an API as a waiter in a restaurant.
You (the client) sit at a table with a menu. You cannot walk into the kitchen (the database) and cook the food yourself. Instead, you give your order (the Request) to the waiter (the API). The waiter takes your order to the kitchen, gets the food, and brings it back to your table (the Response).

## Visual Diagram
\`\`\`mermaid
graph LR
    A[Client App] -- Request (GET /users) --> B(API Server)
    B -- Queries Data --> C[(Database)]
    C -- Returns Data --> B
    B -- Response (JSON) --> A
\`\`\`

## Technical Deep Dive: Statelessness
One of the core rules of a REST API is that it must be **Stateless**. This means the server does not remember anything about you between requests. Every single request must contain all the information necessary for the server to fulfill it (like an authentication token). If you log in, the API doesn't keep a "session" open for you; instead, it gives you a token, and you must present that token with every subsequent request. This makes REST APIs incredibly scalable!

## Code Example
Using JavaScript to fetch a list of posts from a REST API:

\`\`\`javascript
// A simple GET request to a REST API endpoint
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => {
    console.log("Here are the posts:", data);
  });
\`\`\`

## Common Mistakes
- **Treating URLs as actions instead of resources:** A bad REST API URL looks like \`/updateOrderStatus\`. A good REST API URL looks like \`PUT /orders/123\`.
- **Ignoring HTTP status codes:** A REST API should return \`201 Created\` when a POST is successful, not just \`200 OK\`.

## Troubleshooting
- **Getting a 404 on an API call?** You might be trying to access a resource that doesn't exist (e.g., \`/users/999\` when there are only 500 users), or you misspelled the endpoint.

## Best Practices
- **Version your API:** Always include a version number in the URL (e.g., \`https://api.example.com/v1/users\`). This ensures that if you change how the API works in the future, you don't break older applications that rely on v1.

## Hands-On Lab
*Open a new tab and go to \`https://jsonplaceholder.typicode.com/users\`. You will see a raw JSON response from a real REST API!*

## Key Takeaways
1. REST APIs organize data into Resources.
2. CRUD operations map directly to HTTP methods (POST, GET, PUT, DELETE).
3. REST APIs are stateless, making them highly scalable.

## What's Next
You saw JSON mentioned multiple times in this level. In Level 5, we will dive deep into exactly what JSON is and why it's the undisputed king of data formats for APIs.
`,
  quiz: {
    question: "Which of the following URLs follows RESTful best practices for deleting a user with ID 42?",
    options: [
      "GET /users/delete/42",
      "POST /deleteUser?id=42",
      "DELETE /users/42",
      "REMOVE /users/42"
    ],
    correctAnswerIndex: 2,
    explanation: "REST APIs use standard HTTP methods and resource-based URLs. DELETE /users/42 clearly indicates the action and the specific resource being targeted."
  }
};
