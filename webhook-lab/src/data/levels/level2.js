export const level2 = {
  id: "level-2",
  title: "Level 2 – HTTP Fundamentals",
  type: "theory",
  briefing: {
    incident: "The VIP customer's internet connection is fine, but they are getting a strange '404' error when they try to load the Acme Cloud dashboard.",
    task: "To understand what '404' means, you need to dive into the language of the web: HTTP. Learn how clients and servers speak to each other.",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Learning Objectives
Understand the anatomy of an HTTP request and response, including URLs, headers, bodies, and status codes.

## Prerequisites
- Level 1 (Internet & Web Fundamentals)

## Concept Explanation
Once your computer has found a server using DNS, it needs a common language to speak to it. **HTTP (Hypertext Transfer Protocol)** is that language. It is a strictly text-based protocol that follows a **Request / Response** lifecycle.

1. The client sends a Request.
2. The server processes it.
3. The server sends back a Response.

### Anatomy of a URL
A URL (Uniform Resource Locator) isn't just a website name; it's a specific set of instructions:
\`https://shop.com:443/products/shoes?color=red&size=10\`
- **Protocol**: \`https://\`
- **Domain**: \`shop.com\`
- **Port**: \`:443\` (usually hidden by the browser)
- **Path**: \`/products/shoes\` (The specific resource you want)
- **Query Parameters**: \`?color=red&size=10\` (Extra filters or data passed to the server)

### Headers
Both requests and responses contain **Headers**. These are key-value pairs of metadata hidden from the end-user. They tell the server things like what type of browser you are using, what language you prefer, or what format of data you expect back (e.g., HTML vs JSON).

### Request and Response Bodies
The **Body** is the actual meat of the message. 
- In a Request, the body contains the data you are sending (like a filled-out login form).
- In a Response, the body contains the data the server is giving you (like the HTML of a webpage, or a JSON payload).

## Real-World Analogy
Think of HTTP like ordering food at a drive-thru.
- **The URL Path**: Pulling up to the correct restaurant and window.
- **The Headers**: Telling the cashier "I speak English" and "I'm paying with cash."
- **The Request Body**: The actual order ("I want a burger and fries").
- **The Status Code**: The cashier saying "Got it!" (200 OK) or "We're out of burgers" (404 Not Found).
- **The Response Body**: The bag of food you receive.

## Technical Deep Dive: Status Codes
Every HTTP response includes a 3-digit status code summarizing the result. They are grouped into blocks:
- **2xx (Success)**: The request was received, understood, and accepted.
  - \`200 OK\`: Standard success.
  - \`201 Created\`: Success, and a new resource was created.
- **3xx (Redirection)**: Further action needs to be taken (like moving to a new URL).
  - \`301 Moved Permanently\`
- **4xx (Client Error)**: You messed up the request.
  - \`400 Bad Request\`: Syntax error in your request.
  - \`401 Unauthorized\`: You didn't provide login credentials.
  - \`403 Forbidden\`: You are logged in, but not allowed to view this.
  - \`404 Not Found\`: The path doesn't exist.
  - \`429 Too Many Requests\`: You are hitting the server too fast (Rate Limiting).
- **5xx (Server Error)**: The server messed up.
  - \`500 Internal Server Error\`: The server crashed while processing the request.

## Code Example
Here is what a raw HTTP Request and Response look like under the hood (this is what your browser generates invisibly):

**The Request:**
\`\`\`http
GET /products/shoes?color=red HTTP/1.1
Host: shop.com
User-Agent: Mozilla/5.0
Accept-Language: en-US
\`\`\`

**The Response:**
\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 42

{
  "product": "shoes",
  "in_stock": true
}
\`\`\`

## Common Mistakes
- **Confusing 401 and 403:** 401 means "I don't know who you are." 403 means "I know who you are, but you aren't allowed in here."
- **Putting sensitive data in Query Parameters:** Never put passwords or API keys in a URL like \`?password=123\`. URLs are often logged in plain text on servers and proxy routers!

## Troubleshooting
- **Getting a 404 Error?** Double-check the URL path. You might have a typo, or the resource was deleted.
- **Getting a 500 Error?** There is nothing you can do as a client. The server code crashed, and the server administrator needs to fix it.

## Best Practices
- **Use the correct Status Codes:** When building a server or webhook receiver, don't send a \`200 OK\` if the request actually failed. Send a \`400\` or \`500\` so the client knows something went wrong.

## Mini Quiz
*(Take the interactive quiz below!)*

## Key Takeaways
1. HTTP follows a strict Request/Response lifecycle.
2. Query parameters filter or modify requests directly in the URL.
3. Headers contain metadata; Bodies contain the actual data.
4. The first digit of a Status Code tells you the category (2=Success, 4=Your Fault, 5=Server's Fault).

## What's Next
Now you know *how* HTTP messages are structured, but how do we tell the server *what action* we want to perform? Next, we'll learn about **HTTP Methods**.
`,
  quiz: {
    question: "Why should you never place a secret password or API key in the Query Parameters of a URL?",
    options: [
      "Because query parameters are limited to 10 characters.",
      "Because URLs are frequently stored in plain-text server logs, exposing the secret to anyone with log access.",
      "Because the server will automatically respond with a 403 Forbidden error.",
      "Because it will slow down the DNS resolution process."
    ],
    correctAnswerIndex: 1,
    explanation: "URLs (including query parameters) are recorded in browser histories, proxy logs, and server access logs in plain text. Always send secrets securely in Headers or the Request Body."
  }
};
