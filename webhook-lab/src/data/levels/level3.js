export const level3 = {
  id: "level-3",
  title: "Level 3 – The Typo",
  type: "theory",
  briefing: {
    recap: "You verified the web server process crashed and Sarah rebooted it. The server is listening on Port 80 again.",
    incident: "[UNIT-7 NOC-BOT]: Incident escalated. Marketing Developers report the web server is online, but the 'Submit Lead' function is returning a 404 Not Found error.",
    task: "[SARAH - SENIOR Platform Engineer]: The server is up, but the developers say it's broken. Classic. Let's look at the exact HTTP request they are sending to the server to see who's really at fault here.",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Incident Communication Log

**Sarah (Senior Engineer):** 
"Alright, so \`curl\` isn't just a ping tool. It's a full-fledged HTTP client. 

**HTTP (Hypertext Transfer Protocol)** is the language clients and servers use to talk to each other. When a browser (or curl) connects to a server, it doesn't just say 'hello'. It sends a formatted text document called an **HTTP Request**.

Every HTTP Request needs a **Path** (like \`/index.html\` or \`/API/submit\`). It tells the server exactly *which* file or function the client wants.

The devs claim their code is perfect. Let's verify that. Use \`curl\` with the \`-v\` (verbose) flag. This will print out the exact HTTP conversation happening under the hood when you try to hit their endpoint."

> **SYSTEM ALERT:** The developers are trying to hit \`http://10.4.12.88:80/API/sumbit_lead\`. Run a verbose curl against this URL to see what is happening.

### Platform Engineer Insight
**What is this concept?** The HTTP Request/Response lifecycle — specifically the role of URL paths.
**Why is it used?** Every API request must target an exact path. A single typo in a path produces a 404 and silently breaks integrations — this is one of the most common webhook misconfiguration bugs.
**How does it work?** The client sends the full path in the HTTP Request Line (e.g. \`GET /API/submit_lead HTTP/1.1\`). The server pattern-matches it against its registered routes. No match → 404.
**How do we monitor it in production?** We track 404 error rates on API gateways. A sudden spike in 404s on a webhook endpoint usually means the sender was recently reconfigured with a wrong URL.
`,
  simulator: {
    tasks: [
      {
        command: 'curl -v http://10.4.12.88:80/API/sumbit_lead',
        instruction: 'Execute an HTTP request against the developer\'s endpoint, but enable verbose output to see the full transaction details.',
        hints: [
          "How can we see the full HTTP conversation between a client and server, not just the response?",
          "The `curl` command has a flag for verbose mode that prints the request headers, response headers, and body.",
          "Solution: curl -v http://10.4.12.88:80/API/sumbit_lead"
        ],
        solution: 'curl -v http://10.4.55.2/webhook',
        successMessage: '> GET /API/sumbit_lead HTTP/1.1\n> Host: 10.4.12.88:80\n> User-Agent: curl/7.81.0\n>\n< HTTP/1.1 404 Not Found\n< Content-Length: 42\n< \n{"error": "Endpoint /sumbit_lead not found"}\n[SARAH]: "Hah! Look at the path. They spelled it \'sumbit_lead\'. Classic developer typo."',
        errorMessage: 'Invalid syntax. Use `curl -v <URL>`'
      }
    ]
  }
};
