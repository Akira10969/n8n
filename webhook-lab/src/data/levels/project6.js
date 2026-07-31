export const project6 = {
  "id": "project-6",
  "title": "Project 6 - The Mirror",
  "type": "lab",
  "briefing": {
    "recap": "The Swarm is neutralized. We need to counter-attack.",
    "incident": "OPPORTUNITY: The Void core infrastructure is exposed.",
    "task": "Implement a webhook Fan-Out architecture to reflect traffic back to multiple Void endpoints.",
    "rewards": { "xp": 750, "badge": "Reflector" }
  },
  "content": "## System Diagnostics\
**[Sarah]** \"We can use its own strategy against it. Set up a fan-out architecture. When we receive a payload, broadcast it to all of The Void exposed endpoints.\"\
\
**[The Void]** \"WHAT ARE YOU DOING?\"\
\
## Objective\
Deploy a Fan-Out pattern to distribute payloads to multiple targets.",
  "simulator": {
    "tasks": [
      {
        "command": /^node fanout\.js$/i,
        "instruction": "Execute the Fan-Out script using node fanout.js.",
        "successMessage": "[SUCCESS] Fan-Out active. The Void is taking heavy damage.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};