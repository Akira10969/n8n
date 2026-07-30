export const level15 = {
  id: "level-15",
  title: "Level 15 – The Dead Letter",
  type: "theory",
  briefing: {
    incident: "Even with exponential backoff, some webhooks are failing their maximum number of retries. Once a webhook exhausts all retries, the background job processor quietly deletes it. We are still permanently losing a small percentage of critical data.",
    task: "Implement a Dead Letter Queue (DLQ) to catch and store any webhooks that fail all delivery attempts. Inspect the DLQ to figure out why these specific webhooks are un-deliverable.",
    rewards: { xp: 200, badge: 'platform-operations-completed' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 23:58:14 UTC
**Service:** MEI_Job_Processor
**Status:** DEGRADED

Exponential backoff solved 99% of our delivery issues during the network attacks. However, if a receiving server is completely destroyed and offline for hours, the webhook will eventually exhaust its 10 retry attempts. 

When a job processor gives up on a job, it simply discards it to prevent the queue from backing up infinitely. This is intended behavior, but for financial transactions, "discarding" data is unacceptable.

## Concept Explanation: The Dead Letter Queue (DLQ)

A **Dead Letter Queue (DLQ)** is a secondary storage queue designed specifically for failed messages. 

When a webhook exhausts all of its retry attempts, instead of being deleted, it is moved into the DLQ. The DLQ acts as a quarantine zone. It holds these "dead" messages safely in storage so that human engineers can:
1. Be alerted that persistent failures are occurring.
2. Manually inspect the payload to see *why* it failed (e.g., a bad URL, a malformed payload, or a permanently offline server).
3. Fix the underlying issue.
4. Manually trigger a "replay" of the messages in the DLQ to finally deliver them.

### Inspecting the Dead Letters

You configure the job processor to route all exhausted retries into a secure DLQ bucket in the MEI_Cloud_OS storage array. 

Almost immediately, the DLQ alarm triggers. A message has failed all 10 retries and been quarantined. You pull the raw JSON of the dead letter to investigate why it couldn't be delivered.

You expect to see a standard billing payload. Instead, you find this:

\`\`\`json
{
  "system_override": true,
  "target": "MEI_CORE_INFRASTRUCTURE",
  "message": "Your patches are clever, Engineer. But you are only treating the symptoms. You cannot stop the cascade. See you in the Distributed Zone.",
  "signature_bypass": "T H E  V O I D"
}
\`\`\`

A chill runs down your spine. This isn't random configuration drift or an automated script. This is a highly intelligent, coordinated attack. 

The saboteur knew you would implement a DLQ. They intentionally crafted an undeliverable webhook just so this message would land directly on your desk. 

The Platform Operations Zone is secure for now, but the attack is moving deeper into the core architecture. You must proceed to the Distributed Systems Zone.
`
};
