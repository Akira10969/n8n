export const project2 = {
  "id": "project-2",
  "title": "Project 2 - The Decoupling",
  "type": "lab",
  "briefing": {
    "recap": "The Monolith feed is disrupted, but it is attempting to crash our receiver by flooding it.",
    "incident": "ALERT: Traffic volume exceeding local receiver capacity.",
    "task": "Implement a message queue to decouple ingestion from processing.",
    "rewards": { "xp": 550, "badge": "Queue Master" }
  },
  "content": "## System Diagnostics\
**[The Void]** \"You cannot handle the flood. You will drown.\"\
\
**[Sarah]** \"It is right. If we try to process these webhooks synchronously, the receiver will crash. We need a Queue.\"\
\
## Objective\
Route incoming webhooks into an in-memory queue to decouple the ingestion.",
  "simulator": {
    "tasks": [
      {
        "command": /^npm install bull$/i,
        "instruction": "Install the Bull queue library by running npm install bull.",
        "successMessage": "[SUCCESS] Queue active. Ingestion and processing decoupled.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};