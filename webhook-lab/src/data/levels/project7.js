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
  "content": "## System Diagnostics\n**[The Void]** \"I AM FOREVER. I AM THE ORPHANED CODE.\"\n\n**[Sarah]** \"Not anymore. Deploy the final architecture! Idempotency keys, HMAC signatures, Queues, DLQs, and Rate Limiting all in one!\"\n\n### The Complete Webhook Lifecycle\nYou must now execute the entire lifecycle to defeat The Void:\n1. **Event Occurs**\n2. **Sender**\n3. **Webhook Request**\n4. **Listener**\n5. **Receiver**\n6. **Authentication (where applicable) & Signature Verification (HMAC)**\n7. **Payload Validation**\n8. **Idempotency Check**\n9. **Queue / Asynchronous Processing**\n10. **Business Logic**\n11. **Logging**\n12. **Metrics**\n13. **Tracing & Correlation IDs**\n14. **Observability**\n\n### Learning Outcome\nBy the end of this campaign, you haven't just learned what Webhooks are. You have learned how modern webhook-driven platforms are designed, secured, automated, monitored, and maintained in production. You can now think like a Platform Engineer—able to reason through the complete lifecycle of an event, from generation to processing, monitoring, and incident resolution.\n\n## Objective\nRun the final deployment sequence to purge The Void from Business Cloud OS.\n\n### Before You Act: Executing Bash Scripts\
\
To deploy the entire architecture at once, you will run an automated shell script containing all the provisioning commands.\
\
**Command:** `./`\
**Purpose:** Tells the Linux shell to execute a file located in the *current* directory.\
\
**Important Concepts:**\
- `.`: Represents the current directory.\
- `/`: The directory separator.\
- Together, `./script.sh` means \"Execute the file named script.sh that is located right here in this folder.\"\
\
**Real-world Use Case:** Platform Engineers frequently write bash scripts to automate repetitive deployment tasks (e.g., spinning up Docker, applying database migrations, and restarting NGINX all in one go). \
**Common Mistake:** Trying to run the script by just typing `script.sh`. For security reasons, Linux does not check the current directory for executable files unless you explicitly tell it to using `./`. If you forget the `./`, Linux will say \"Command not found.\"\
\
### Platform Engineer Insight\n- **What is this concept?** Enterprise Webhook Architecture.\n- **Why is it used?** To ensure high availability, security, and reliability when processing incoming events at scale in production.\n- **How does it work?** It combines idempotency, HMAC signatures, asynchronous message queues (with DLQs), rate limiting, and comprehensive observability (metrics, logs, traces) into a single resilient pipeline.\n- **How do we monitor it in production?** Through centralized observability dashboards tracking end-to-end latency, queue depths, error rates, DLQ sizes, and correlating distributed traces across the entire event lifecycle.",
  "simulator": {
    "tasks": [
      {
        "command": /^\.\/deploy_final_architecture\.sh$/i,
        "instruction": "Execute the final automated deployment shell script located in this directory to secure the system.",
        "successMessage": "[SUCCESS] The Void has been purged. Business Cloud OS is secure. You are a true Architect.",
        "errorMessage": "Invalid command. Read the instructions carefully.",
        "hints": [
          "How do we deploy the final architecture to defeat The Void?",
          "We need to execute the final deployment shell script to complete the architecture.",
          "Run `./deploy_final_architecture.sh`"
        ]
      }
    ]
  }
};
