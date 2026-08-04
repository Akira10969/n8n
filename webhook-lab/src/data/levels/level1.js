export const level1 = {
  id: "level-1",
  title: "Level 1 – The Ping Drop",
  type: "theory",
  briefing: {
    recap: "Welcome to Business Cloud OS. You have been assigned to the Foundation Operations Zone. Your clearance level is: JUNIOR ENGINEER.",
    incident: "[UNIT-7 NOC-BOT]: Automated monitoring has detected intermittent packet loss on legacy asset 'MKT-01' (Marketing Web Server). Current uptime SLA is at risk.",
    task: "[SARAH - SENIOR Platform Engineer]: Hey, new kid. Looks like one of the old marketing servers is acting up. Probably just a dusty network cable or a routing glitch. Can you verify basic connectivity before we escalate?",
    rewards: { xp: 50, badge: 'None' }
  },
  content: `
## Incident Communication Log

**Sarah (Senior Engineer):** 
"Before we go pulling cables, we need to know if the server is completely dead or just dropping packets intermittently. 

But first, let's make sure you understand how data actually travels across the network. When you send a message over the internet, it doesn't travel as one giant block. It gets chopped up into tiny pieces called **Packets**. 

These packets travel from your machine, bounce across multiple **Routers** (called **Hops**), until they reach their destination. If a router goes offline, packets get dropped, and the message never arrives.

Whenever you need to check if a machine is alive on the network, the first tool in your belt is \`ping\`.

### Platform Engineer Insight: The Ping Lifecycle
*   **What is it?** A basic network diagnostic tool.
*   **Why is it used?** To verify if a remote host is reachable across an IP network.
*   **How does it work?** It sends ICMP Echo Request packets and waits for an ICMP Echo Reply.
*   **How do we monitor this in production?** We don't manually run ping. We use synthetic monitoring tools (like Datadog or Prometheus Blackbox Exporter) to continuously ping endpoints and trigger PagerDuty alerts if packet loss exceeds 5%. 

### The Ping Command
\`ping\` sends a tiny, specialized network packet (an ICMP Echo Request) to a target IP address. If the target is alive, it sends a reply back. It's exactly like a submarine using sonar. 

If we get replies, the server is up. If some replies take too long or get lost, we have a network flap.

I need you to open your terminal and ping the marketing server's internal IP address: \`10.4.12.88\`. Let's see what happens."

> **SYSTEM ALERT:** Terminal Simulator Unlocked. Use the terminal below to execute your first command.
`,
  simulator: {
    tasks: [
      {
        command: /^ping\s+(.*?)10\.4\.12\.88(.*)$/i,
        instruction: 'Verify if the marketing server (10.4.12.88) is alive and responding on the network.',
        hints: [
          "How does a submarine locate targets? (Sonar).",
          "We need to send an ICMP Echo Request. There is a standard 4-letter networking tool for this.",
          "Solution: Use the `ping` command followed by the IP address."
        ],
        solution: 'ping 10.4.12.88',
        successMessage: 'PING 10.4.12.88 (10.4.12.88): 56 data bytes\n64 bytes from 10.4.12.88: icmp_seq=0 ttl=64 time=42.1 ms\n64 bytes from 10.4.12.88: icmp_seq=1 ttl=64 time=45.3 ms\nRequest timeout for icmp_seq 2\n64 bytes from 10.4.12.88: icmp_seq=3 ttl=64 time=41.9 ms\n\n--- 10.4.12.88 ping statistics ---\n4 packets transmitted, 3 packets received, 25.0% packet loss\n[SARAH]: "25% packet loss? That\'s weird. Let\'s dig deeper."',
        errorMessage: 'Validation Failed. Hint: You must use the ping command followed by the exact IP address: `ping 10.4.12.88`'
      }
    ]
  }
};
