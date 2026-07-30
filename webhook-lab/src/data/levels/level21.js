export const level21 = {
  id: "level-21",
  title: "Level 21 – Infra & Networking",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand the networking infrastructure required to securely and reliably receive webhooks at an enterprise scale.

## Prerequisites
- Level 20 (Popular Providers)

## Concept Explanation
When running a local development server, you just boot up Node.js on port 3000 and use ngrok. 
But in a production enterprise environment, your webhook infrastructure consists of several layers:

1. **DNS (Domain Name System)**: Maps your custom domain (e.g., \`api.myapp.com\`) to your server's IP address.
2. **CDN / WAF (Web Application Firewall)**: Services like Cloudflare sit in front of your server to block malicious DDoS attacks before they ever reach your code.
3. **Load Balancer / API Gateway**: If you receive 10,000 webhooks a second, one server will crash. A Load Balancer distributes incoming webhooks across 10 different identical servers.
4. **Reverse Proxy (Nginx / Caddy)**: Handles the SSL/TLS encryption (HTTPS), decrypts the traffic, and passes the plain HTTP data to your internal Node.js/Python code.
5. **The Application Code**: The actual Node.js or Python server running the receiver logic.

## Real-World Analogy
Think of a massive stadium hosting a concert.
- **DNS**: The billboard telling you the address of the stadium.
- **WAF**: The security guards checking bags outside to ensure no weapons get in.
- **Load Balancer**: The ticket takers distributing the massive crowd evenly across 10 different entrance gates so no single gate gets crushed.
- **The Application**: The actual seats inside where people sit down.

## Visual Diagram
\`\`\`mermaid
graph TD
    A[Internet / Stripe] -->|HTTPS POST| B(Cloudflare WAF)
    B -->|Clean Traffic| C{AWS Load Balancer}
    C -->|Routes| D[Nginx Proxy 1]
    C -->|Routes| E[Nginx Proxy 2]
    D --> F[Node.js Receiver 1]
    E --> G[Node.js Receiver 2]
\`\`\`

## Technical Deep Dive: IP Allow Lists (Whitelisting)
Because your Load Balancer is publicly accessible, attackers will try to scan it and send fake webhooks. Even though your HMAC signature check will eventually block them, your Node.js server still has to waste CPU cycles hashing the fake payloads!
To solve this, you configure your Firewall (WAF) or Nginx proxy to **only accept traffic from specific IP addresses**. 
Providers like Stripe publish a list of their official IP addresses. If traffic hits your \`/webhook\` endpoint and the IP address isn't on that list, the Firewall instantly drops the connection before it ever reaches your application code.

## Code Example
If you use Nginx as a reverse proxy, you can whitelist Stripe's IPs directly in the configuration file:

\`\`\`nginx
# /etc/nginx/nginx.conf
location /webhooks/stripe {
    # Allow Stripe's official IPs
    allow 54.187.174.169;
    allow 54.187.205.235;
    allow 54.187.216.72;
    
    # Deny everyone else!
    deny all;
    
    # Pass allowed traffic to the Node app
    proxy_pass http://localhost:3000;
}
\`\`\`

## Common Mistakes
- **Forgetting to enable HTTPS:** Webhook payloads contain highly sensitive data (names, emails, payment amounts). If you don't use HTTPS (SSL/TLS), anyone sitting on a public Wi-Fi network between the provider and your server can intercept and read the data in plain text! Most modern providers outright refuse to send webhooks to \`http://\` addresses for this reason.

## Troubleshooting
- **Webhook works locally via ngrok but fails in production?** Check your cloud provider's Security Groups (like AWS EC2). You likely forgot to open Port 443 (HTTPS) to the public internet!

## Best Practices
- **Use an API Gateway:** Instead of configuring Nginx manually, modern cloud architectures use managed API Gateways (like AWS API Gateway) to handle rate limiting, IP whitelisting, and SSL termination automatically.

## Hands-On Lab
*Think about how complex managing Linux servers, Nginx configurations, and Load Balancers can be. In the next level, we will learn how to bypass all of this infrastructure management using Serverless Functions.*

## Key Takeaways
1. Enterprise webhooks require load balancers to distribute massive traffic.
2. IP Allow Lists (Whitelisting) block hackers at the network level before they reach your code.
3. HTTPS is absolutely mandatory to encrypt sensitive webhook payloads in transit.

## What's Next
Managing load balancers is difficult and expensive. What if you could write a single function and let AWS automatically scale it from 0 to 10,000 servers instantly? Next up: **Serverless Functions**.
`,
  quiz: {
    question: "Why should you configure your Firewall or Nginx proxy to only accept traffic from a provider's official IP addresses (Whitelisting)?",
    options: [
      "To prevent the provider from sending you too many webhooks.",
      "To block hackers at the network layer. If a hacker tries to send a fake webhook, the firewall drops the connection instantly, saving your application server from wasting CPU cycles verifying invalid payloads.",
      "Because IP whitelisting automatically converts HTTP to HTTPS.",
      "Because it bypasses DNS routing, making the webhook arrive faster."
    ],
    correctAnswerIndex: 1,
    explanation: "Blocking unauthorized IPs at the firewall level is the most efficient way to protect your infrastructure. The traffic never even reaches your Node.js or Python code."
  }
};
