export const level14 = {
  id: "level-14",
  title: "Level 14 – The Network Flap",
  type: "theory",
  briefing: {
    recap: "The attacker intercepted the new API key over the network. You deployed HMAC SHA-256 signatures to cryptographically guarantee the authenticity of every Webhook.",
    incident: "Unable to forge Webhooks, the rogue entity has initiated a localized Denial of Service (DoS) attack. Intermittent network partitions are causing the receiving servers to go offline randomly for 10-20 seconds at a time. Webhooks sent during these micro-outages are lost forever.",
    task: "Design a resilient Webhook delivery pipeline. Implement Retry Logic and Exponential Backoff to ensure that Webhooks are stored and re-transmitted if the receiver is temporarily unavailable.",
    rewards: { xp: 120, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 11:30:04 UTC
**Service:** MEI_Network_Mesh
**Status:** UNSTABLE

The cryptographic seals are holding, but the attacker has pivoted to a brute-force infrastructure attack. By flooding the internal network with junk traffic, they are causing our Webhook receivers to randomly drop offline for brief periods.

When the Billing Service sends a payment Webhook, it expects a \`200 OK\` response. But because the receiver is offline, the connection times out. 

Currently, the Billing Service's logic is:
*"I sent the Webhook. It timed out. Oh well, moving on to the next one."*

This is a catastrophic design flaw. We are losing critical transactional data. 

## Concept Explanation: Retry Logic & Exponential Backoff

In distributed systems, you must always assume the network is unreliable. If a Webhook fails to deliver (e.g., returns a 5xx error or times out), the sender must try again. 

However, you cannot just spam retries immediately. If the receiving server is already struggling under a DoS attack, hitting it with thousands of immediate retries will completely destroy it.

This is where **Exponential Backoff** comes in. 

Instead of retrying instantly, the sender waits for exponentially increasing amounts of time between each attempt:
- Attempt 1: Fails
- Attempt 2: Wait 2 seconds
- Attempt 3: Wait 4 seconds
- Attempt 4: Wait 8 seconds
- Attempt 5: Wait 16 seconds

This gives the receiving server time to recover, reboot, or shed load before the next wave of traffic hits.

### Building Resilience

You re-architect the Billing Service to decouple Webhook sending from the main application thread. Instead of sending Webhooks directly, the Billing Service now places the Webhook payload into a background job processor. 

The job processor attempts delivery. If the receiver is experiencing a micro-outage caused by the rogue entity, the job processor detects the timeout, applies an exponential backoff formula, and schedules a retry for the future.

You watch the dashboard as a wave of DoS traffic hits. The receivers go offline. The Webhooks fail. But this time, they aren't lost. The retries queue up, wait patiently, and as soon as the network stabilizes 12 seconds later, all the queued Webhooks are successfully delivered. 

You have thwarted the network attack. But what happens to the Webhooks that *never* succeed, even after 10 retries?

> **SYSTEM ALERT:** The network is flapping. Send a 10-count ping to verify the packet loss.

### Platform Engineer Insight
**What is this concept?** Retry Logic and Exponential Backoff.
**Why is it used?** Networks are inherently unreliable. Retries ensure data isn't lost during temporary outages, while exponential backoff prevents a thundering herd from overwhelming a recovering service.
**How does it work?** When a webhook delivery fails, instead of retrying immediately, the system waits for an exponentially increasing delay (e.g., 2s, 4s, 8s).
**How do we monitor it in production?** We track the size of our retry queues and the average number of delivery attempts per webhook. An increasing retry queue depth alerts us to a sustained downstream outage.
`,
  simulator: {
    tasks: [
      {
        command: /^ping\s+-c\s+10\s+10\.4\.88\.9$/i,
        instruction: 'Diagnose the intermittent connection by sending exactly 10 ping packets to the remote node.',
        hints: [
          "How can we diagnose intermittent packet loss to a specific IP?",
          "Use the ping command with the -c flag to send exactly 10 packets.",
          "ping -c 10 10.4.88.9"
        ],
        solution: 'ping -c 10 10.4.88.9',
        successMessage: "10 packets transmitted, 4 received, 60% packet loss, time 9014ms\n[SARAH]: \"60% packet loss! The connection is flapping. We need retries.\"",
        errorMessage: "Invalid syntax. Use `ping -c 10 10.4.88.9`"
      }
    ]
  }
};
