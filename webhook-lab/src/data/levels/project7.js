export const project7 = {
  "id": "project-7",
  "title": "Project 7 - The Core",
  "type": "lab",
  "briefing": {
    "recap": "The Void is heavily damaged and retreating to its Core.",
    "incident": "CRITICAL: Final confrontation. The Void is attempting a total system wipe.",
    "task": "Deploy the ultimate Webhook architecture: Idempotent, Signed, Queued, Rate-Limited, and Highly Available.",
    "rewards": { "xp": 1000, "badge": "Architect of the Cloud" }
  },
  "content": "## System Diagnostics\
**[The Void]** \"I AM FOREVER. I AM THE ORPHANED CODE.\"\
\
**[Sarah]** \"Not anymore. Deploy the final architecture! Idempotency keys, HMAC signatures, Queues, DLQs, and Rate Limiting all in one!\"\
\
### The Complete Webhook Lifecycle\
You must now execute the entire lifecycle to defeat The Void:\
1. **Event Occurs**\
2. **Sender**\
3. **Webhook Request**\
4. **Listener**\
5. **Receiver**\
6. **Authentication (where applicable) & Signature Verification (HMAC)**\
7. **Payload Validation**\
8. **Idempotency Check**\
9. **Queue / Asynchronous Processing**\
10. **Business Logic**\
11. **Logging**\
12. **Metrics**\
13. **Tracing & Correlation IDs**\
14. **Observability**\
\
### Learning Outcome\
By the end of this campaign, you haven't just learned what Webhooks are. You have learned how modern webhook-driven platforms are designed, secured, automated, monitored, and maintained in production. You can now think like a Platform Engineer—able to reason through the complete lifecycle of an event, from generation to processing, monitoring, and incident resolution.\
\
## Objective\
Run the final deployment sequence to purge The Void from Business Cloud OS.",
  "simulator": {
    "tasks": [
      {
        "command": /^\.\/deploy_final_architecture\.sh$/i,
        "instruction": "Execute the final deployment sequence using ./deploy_final_architecture.sh.",
        "successMessage": "[SUCCESS] The Void has been purged. Business Cloud OS is secure. You are a true Architect.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};
