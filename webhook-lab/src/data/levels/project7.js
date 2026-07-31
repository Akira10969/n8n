export const project7 = {
  "id": "project-7",
  "title": "Project 7 - The Core",
  "type": "lab",
  "briefing": {
    "recap": "The Void is heavily damaged and retreating to its Core.",
    "incident": "CRITICAL: Final confrontation. The Void is attempting a total system wipe.",
    "task": "Deploy the ultimate webhook architecture: Idempotent, Signed, Queued, Rate-Limited, and Highly Available.",
    "rewards": { "xp": 1000, "badge": "Architect of the Cloud" }
  },
  "content": "## System Diagnostics\
**[The Void]** \"I AM FOREVER. I AM THE ORPHANED CODE.\"\
\
**[Sarah]** \"Not anymore. Deploy the final architecture! Idempotency keys, HMAC signatures, Queues, DLQs, and Rate Limiting all in one!\"\
\
## Objective\
Run the final deployment sequence to purge The Void from MEI_Cloud_OS.",
  "simulator": {
    "tasks": [
      {
        "command": /^\\.\/deploy_final_architecture\.sh$/i,
        "instruction": "Execute the final deployment sequence using ./deploy_final_architecture.sh.",
        "successMessage": "[SUCCESS] The Void has been purged. MEI_Cloud_OS is secure. You are a true Architect.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};