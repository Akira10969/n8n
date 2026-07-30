export const level1 = {
  id: "level-1",
  title: "Level 1 – Internet & Web Fundamentals",
  type: "theory",
  briefing: {
    incident: "A high-priority ticket just came in: A VIP customer cannot access the Acme Cloud company website. The support team is panicking.",
    task: "As the new IT Intern, your first task is to investigate the issue. But before you touch any production servers, you need to prove you understand the basics of how computers communicate over the internet.",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Learning Objectives
By the end of this level, you will understand the foundational concepts of how computers communicate over a network, setting the stage for understanding HTTP and Webhooks.

## Prerequisites
- None! This is the absolute beginning.

## Concept Explanation
The Internet is fundamentally a massive global network of cables, routers, and switches that allow computers to send data to each other. When we talk about "The Web" (World Wide Web), we are talking about a specific service that runs *on top* of the internet, allowing you to access documents (like HTML pages) via browsers.

### Client vs Server
- **Client**: Your device (laptop, phone) or a piece of software (like a web browser) that *requests* information.
- **Server**: A powerful computer living in a data center that *listens* for requests and *serves* the requested data back to the client.

### IPs and DNS
Every device on the internet has an **IP Address** (e.g., \`142.250.190.46\`), which acts like a mailing address. Because humans are bad at remembering numbers, we use **Domain Names** (e.g., \`google.com\`). The **DNS (Domain Name System)** acts as the internet's phonebook, translating the domain name into the correct IP address so your client knows where to send the request.

### TCP/IP and Ports
Data isn't sent in one massive chunk; it's broken down into small packets using **TCP/IP** (Transmission Control Protocol / Internet Protocol). To ensure the data goes to the correct application on the receiving server, we use **Ports**. 
- Port 80 is the default for unencrypted web traffic (HTTP).
- Port 443 is the default for encrypted web traffic (HTTPS).

## Real-World Analogy
Imagine sending a letter. 
- The **Client** is you, writing the letter.
- The **Domain Name** is the name of the business you are writing to.
- **DNS** is the phonebook you use to look up the business's actual street address.
- The **IP Address** is that street address.
- The **Server** is the business receiving your letter and writing one back to you.

## Visual Diagram
\`\`\`mermaid
sequenceDiagram
    participant User as Client (Browser)
    participant DNS as DNS Server
    participant Server as Web Server

    User->>DNS: What is the IP for example.com?
    DNS-->>User: It's 93.184.216.34
    User->>Server: Connect to 93.184.216.34 (Port 443)
    Server-->>User: Connection Established (SSL/TLS)
    User->>Server: Request homepage
    Server-->>User: Return HTML data
\`\`\`

## Technical Deep Dive: SSL/TLS
When you see **HTTPS** instead of HTTP, the 'S' stands for Secure. This uses SSL (Secure Sockets Layer) or its modern successor, TLS (Transport Layer Security). Before the client and server exchange any actual data, they perform a "handshake" to agree on a secret encryption key. Once encrypted, even if a hacker intercepts the data packets on the network, they will only see random gibberish.

## Code Example
While you don't typically write code to resolve DNS manually, here is how you can use your computer's terminal to see the DNS translation in action:

\`\`\`bash
# Run this in your terminal to see the IP address of google.com
ping google.com

# Output will look like:
# PING google.com (142.250.190.46): 56 data bytes
\`\`\`

## Common Mistakes
- **Confusing the Internet with the Web:** The Internet is the infrastructure (cables, routers). The Web is just one application (HTTP) that runs on it. Others include email (SMTP) and file transfer (FTP).
- **Assuming IP addresses are permanent:** Many residential IP addresses change dynamically. Servers use static IPs so DNS records don't constantly break.

## Troubleshooting
- **Website won't load?** Try pinging \`8.8.8.8\` (Google's DNS server). If that works but \`google.com\` doesn't, your local DNS resolver is likely broken, not your internet connection.

## Best Practices
- **Always use HTTPS.** Never send sensitive data (passwords, webhook payloads) over unencrypted HTTP (Port 80).
- **Use subdomains to organize infrastructure.** E.g., \`api.example.com\` for your backend and \`www.example.com\` for your frontend.

## Hands-On Lab
*No lab for this section, but try opening your terminal and typing \`ping your-favorite-website.com\` to see its IP address!*

## Key Takeaways
1. Clients request data; Servers provide data.
2. DNS translates human-readable domain names into machine-routable IP addresses.
3. Ports direct traffic to the correct application on a server (80 for HTTP, 443 for HTTPS).

## What's Next
Now that you know how computers find and connect to each other, you're ready to learn the exact language they speak when they do: **HTTP**.
`,
  quiz: {
    question: "What is the primary role of the DNS (Domain Name System)?",
    options: [
      "To encrypt data sent between a client and a server to prevent hacking.",
      "To break large files into smaller TCP/IP packets.",
      "To translate human-readable domain names into numerical IP addresses.",
      "To ensure that all traffic is routed exclusively through Port 443."
    ],
    correctAnswerIndex: 2,
    explanation: "DNS acts as the internet's phonebook. Without it, you would have to type numbers like 142.250.190.46 into your browser instead of google.com."
  }
};
