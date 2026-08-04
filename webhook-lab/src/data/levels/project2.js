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
  "content": "## System Diagnostics\n**[The Void]** \"You cannot handle the flood. You will drown.\"\n\n**[Sarah]** \"It is right. If we try to process these Webhooks synchronously, the receiver will crash. We need a Queue.\"\n\n## Objective\nRoute incoming Webhooks into an in-memory queue to decouple the ingestion.\n\n### Platform Engineer Insight\n**What is this concept?** Message Queues and Asynchronous Decoupling.\n**Why is it used?** To prevent systems from becoming overwhelmed during traffic spikes by separating the act of receiving data from processing it.\n**How does it work?** A receiver accepts incoming webhooks and immediately pushes them to a message broker (like Redis/Bull, RabbitMQ, or Kafka). It then quickly returns a 2xx success response to the sender. A separate worker process consumes events from the queue at its own pace.\n**How do we monitor it in production?** We monitor the queue depth (number of pending messages) and the age of the oldest message. If queue depth grows continually, it indicates our processing workers are too slow or are crashing.\n\n### Before You Act: Package Management\n**What is this command?** \`npm install\`\n**Why is it used?** To download and install external libraries (like \`bull\` for message queues) into your project's \`node_modules\` folder.\n\n> **SYSTEM ALERT:** The Message Queue framework requires the 'bull' package. Use the appropriate npm install command to add it to the project.",
  "simulator": {
    "tasks": [
      {
        "command": /^npm install bull$/i,
        "instruction": "Install the Bull queue library to prepare the system for decoupling.",
        "hints": [
          "How do we add new dependencies to a Node.js project?",
          "Use the Node Package Manager to install the specific library requested by the objective.",
          "Run `npm install bull`"
        ],
        "solution": "npm install bull",
        "successMessage": "[SUCCESS] Queue active. Ingestion and processing decoupled.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};