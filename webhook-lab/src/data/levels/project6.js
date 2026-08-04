export const project6 = {
  "id": "project-6",
  "title": "Project 6 - The Mirror",
  "type": "lab",
  "briefing": {
    "recap": "The Swarm is neutralized. We need to counter-attack.",
    "incident": "OPPORTUNITY: The Void core infrastructure is exposed.",
    "task": "Implement a Webhook Fan-Out architecture to reflect traffic back to multiple Void endpoints.",
    "rewards": { "xp": 750, "badge": "Reflector" }
  },
  "content": "## System Diagnostics\
**[Sarah]** \"We can use its own strategy against it. Set up a fan-out architecture. When we receive a payload, broadcast it to all of The Void exposed endpoints.\"\
\
**[The Void]** \"WHAT ARE YOU DOING?\"\
\
### Core Engineering Principle: Correlation IDs & Event Tracing\
When a Webhook passes through a Fan-Out architecture, it splits into dozens of parallel requests. If one fails, how do you trace it? You generate a **Correlation ID** (a unique UUID) at the Listener, and pass it in the headers to every downstream receiver. This allows you to track the exact lifecycle of the event in your logs.\
\
## Objective\
Deploy a Fan-Out pattern to distribute payloads to multiple targets.\n\n### Before You Act: Installing Node Packages\
\
You need to integrate the Fan-Out SDK to broadcast your lockdown signals. We use the Node Package Manager (NPM) for this.\
\
**Command:** `npm install`\
**Purpose:** Downloads and installs a package of code written by someone else from the public npm registry into your project's `node_modules` folder.\
\
**Important Usage:**\
- `npm install <package_name>`: Downloads the specific package and saves it as a dependency in your `package.json`.\
\
**Real-world Use Case:** Platform Engineers rely heavily on open-source libraries to avoid reinventing the wheel. If you need a Redis client, a Kafka producer, or a Webhook Fan-Out SDK (like Svix), you install it via npm.\
**Common Mistake:** Forgetting to run `npm install` after cloning a repository. The `node_modules` folder is deliberately ignored in Git, so you must always run the command to download the dependencies before your code will work!\
\
### Platform Engineer Insight\n**What is this concept?** Webhook Fan-Out is a pattern that broadcasts a single incoming event to multiple downstream receivers.\n**Why is it used?** To decouple the source of an event from its multiple consumers, allowing scalable, independent processing by different services.\n**How does it work?** An ingestion endpoint receives the webhook, generates a Correlation ID, and publishes it to a message broker (like RabbitMQ or SNS), which then routes it to multiple subscribed endpoints.\n**How do we monitor it in production?** We trace Correlation IDs across distributed logs, monitor message broker queue depth, and track delivery success/failure rates for each downstream endpoint.",
  "simulator": {
    "tasks": [
      {
        "command": /^node fanout\.js$/i,
        "instruction": "Launch the Fan-Out script to begin broadcasting payloads to multiple targets.",
        "hints": [
          "How do you execute a JavaScript file using Node.js?",
          "You need to run the Node.js runtime and pass the fan-out script as the argument.",
          "`node fanout.js`"
        ],
        "successMessage": "[SUCCESS] Fan-Out active. The Void is taking heavy damage.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};