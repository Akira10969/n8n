export const level2 = {
  id: "level-2",
  title: "Level 2 – The Silent Server",
  type: "theory",
  briefing: {
    recap: "You confirmed the marketing server is online, but experiencing 25% packet loss. A network flap is annoying, but it shouldn't take down the entire marketing site.",
    incident: "[UNIT-7 NOC-BOT]: Uptime check failed for http://marketing.mei.internal. Connection refused.",
    task: "[SARAH - SENIOR PLATFORM ENGINEER]: Okay, so the machine is plugged in, but the web server application itself might have crashed. We need to test the application layer, not just the network layer.",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Incident Communication Log

**Sarah (Senior Engineer):** 
"A computer on the internet is like an apartment building. \`ping\` just tells you if the building is still standing. But we need to know if the *receptionist* inside the building is awake.

This is the **Client-Server Model**. 
- You (your terminal) are the **Client**. You want to look at a webpage.
- The Marketing machine is the **Server**. It runs a program (like Nginx or Apache) that listens for people asking for webpages.

Servers listen on specific 'doors' called **Ports**. Web servers almost always listen on Port 80 (for HTTP) or Port 443 (for HTTPS).

If UNIT-7 is getting a 'Connection Refused' error, it means the building is there, but the door on Port 80 is locked. The receptionist went home.

Let's test this manually. Instead of \`ping\`, I want you to act as a web client. Use the \`curl\` command to request the homepage directly."

> **SYSTEM ALERT:** Use the terminal below to make an HTTP request to the server.
`,
  simulator: {
    tasks: [
      {
        command: /^curl\s+(http:\/\/)?10\.4\.12\.88(:80)?\/?$/i,
        instruction: 'Retrieve the webpage from the marketing server (10.4.12.88) on port 80 to verify that the web service is responding.',
        successMessage: 'curl: (7) Failed to connect to 10.4.12.88 port 80: Connection refused\n[SARAH]: "Exactly as I suspected. The web process crashed. Let me reboot the Nginx service real quick..."\n[SARAH]: "Okay, try it again."',
        errorMessage: 'Validation Failed. Hint: Use `curl http://10.4.12.88:80` to make the request.'
      },
      {
        command: /^curl\s+(http:\/\/)?10\.4\.12\.88(:80)?\/?$/i,
        instruction: 'Sarah rebooted the web service. Run the same command again to verify that the webpage is now accessible.',
        successMessage: 'HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html><body><h1>MEI Marketing v1.0</h1></body></html>\n[SARAH]: "Boom. We have HTML. Good job, kid."',
        errorMessage: 'Validation Failed. Hint: Use `curl http://10.4.12.88:80` to make the request.'
      }
    ]
  }
};
