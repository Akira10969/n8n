export const level5 = {
  id: "level-5",
  title: "Level 5 – The Malformed Payload",
  type: "theory",
  briefing: {
    recap: "You proved to the developers that they needed to use a POST request instead of a GET request. The server accepted the method, but rejected the empty body.",
    incident: "[UNIT-7 NOC-BOT]: Incident #4913. Developers attached data to their POST request, but the server is returning a 400 Bad Request: 'Invalid JSON'.",
    task: "[SARAH - SENIOR Platform Engineer]: Sigh. They are trying to send data, but they aren't formatting it correctly. Let's show them how JSON works.",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Incident Communication Log

**Sarah (Senior Engineer):** 
"When we send data to an API, we can't just send raw text or a proprietary Excel file. Both the client and the server need to agree on a universal language. 

That language is **JSON (JavaScript Object Notation)**. 

JSON is incredibly strict. It relies on key-value pairs wrapped in curly braces. Keys and text values **must** be enclosed in double quotes.

The developers tried sending this payload:
\`{ name: 'John', status: active }\`

The server rejected it because there are no double quotes around the keys or the string values! It needs to look like this:
\`{"name": "John", "status": "active"}\`

I want you to send one final curl request. Use \`-X POST\`, include the correct \`Content-Type: application/json\` header using \`-H\`, and send the properly formatted JSON payload using the \`-d\` flag."

> **SYSTEM ALERT:** Construct the final curl command. 
> Example: \`curl -X POST -H "Content-Type: application/json" -d '{"name": "John"}' http://10.4.12.88:80/api/submit_lead\`
`,
  simulator: {
    tasks: [
      {
        command: 'curl -X POST -H "Content-Type: application/json" -d \'{"name": "John"}\' http://10.4.12.88:80/api/submit_lead',
        instruction: 'Execute the POST request with the corrected JSON payload.',
        successMessage: 'HTTP/1.1 201 Created\n{"success": true, "lead_id": 9912}\n[SARAH]: "Nailed it. The lead was created successfully. Ticket closed."\n\n[UNIT-7 NOC-BOT]: ALERT. Traffic anomaly detected. While testing was underway, unauthorized internal IP 192.168.99.114 initiated 15,000 requests to the Inventory Service.',
        errorMessage: 'Invalid syntax. Ensure you are using -X POST, -H "Content-Type: application/json", and -d with valid JSON.'
      }
    ]
  }
};
