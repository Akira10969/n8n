export const level4 = {
  id: "level-4",
  title: "Level 4 – The Broken Path",
  type: "theory",
  briefing: {
    recap: "You proved the developers had a typo in their URL path (`/sumbit_lead`). The ticket was closed.",
    incident: "[UNIT-7 NOC-BOT]: Developers reopened ticket #4912. Typo resolved, but endpoint /api/submit_lead is now returning 405 Method Not Allowed.",
    task: "[SARAH - SENIOR PLATFORM ENGINEER]: They fixed the spelling, but they still don't understand how our APIs are structured. Time to teach them some basic REST principles.",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Incident Communication Log

**Sarah (Senior Engineer):** 
"A URL is just an address. But in modern systems, we use **REST (Representational State Transfer)**. REST is a set of rules for how APIs should be designed.

One of the core rules of REST is that you use **HTTP Methods (Verbs)** to tell the server *what* you want to do with that address:
- **GET**: Give me data.
- **POST**: Create new data.
- **DELETE**: Delete data.

When you just type \`curl http://url\`, curl defaults to sending a **GET** request. But the developers are trying to *submit* a new lead. The server is correctly rejecting a GET request to that URL because you can't 'get' a submission. You have to 'post' it.

Show them how it's done. Use \`curl -X POST\` to force the request to use the POST method against the corrected URL."

> **SYSTEM ALERT:** The correct endpoint is \`http://10.4.12.88:80/api/submit_lead\`. Run a POST request to see if it succeeds.
`,
  simulator: {
    tasks: [
      {
        command: 'curl -X POST http://10.4.12.88:80/api/submit_lead',
        instruction: 'Use curl with the -X POST flag to hit the API endpoint.',
        successMessage: '> POST /api/submit_lead HTTP/1.1\n> Host: 10.4.12.88:80\n< HTTP/1.1 400 Bad Request\n< \n{"error": "Empty payload. Content-Type must be application/json"}\n[SARAH]: "Okay, progress! We got a 400 Bad Request instead of a 405. The server accepted the POST method, but it\'s complaining that we didn\'t send any actual data in the request body."',
        errorMessage: 'Invalid syntax. Use `curl -X POST <URL>`'
      }
    ]
  }
};
