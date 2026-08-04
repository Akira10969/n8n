export const project1 = {
  "id": "project-1",
  "title": "Project 1 - The Monolith",
  "type": "lab",
  "briefing": {
    "recap": "The outer defenses have fallen. The map is corrupted. We must establish a foothold before The Void consumes everything.",
    "incident": "CRITICAL: The Void has established a massive monolithic Webhook ingestion server (The Monolith) to swallow all incoming traffic.",
    "task": "Build a local Webhook receiver to siphon traffic away from The Monolith.",
    "rewards": { "xp": 500, "badge": "Receiver Badge" }
  },
  "content": "## System Diagnostics\
**[UNIT-7]** \"WARNING: The Monolith is absorbing all Webhook payloads. It is growing in size.\"\
\
**[Sarah]** \"We need to establish our own receiver to intercept the payloads before they reach the core.\"\
\
## Objective\
Deploy a local webhook receiver server that can accept and log incoming HTTP POST payloads.\
\
### Before You Act: Running Node.js Scripts\
\
To boot up the server you just built, you must instruct the runtime engine to execute your code.\
\
**Command:** `node`\
**Purpose:** Executes JavaScript code outside of a web browser using the V8 engine.\
\
**Important Usage:**\
- `node <filename.js>`: Executes the specified file.\
\
**Real-world Use Case:** While many modern apps are launched using orchestrators like Docker or PM2, underneath the hood, they are all ultimately running `node server.js` to initialize the HTTP listener on the given port.\
**Common Mistake:** Trying to run the command without being in the correct directory. If your terminal is in `/usr/home/` but the file is in `/var/www/`, `node index.js` will throw a \"Cannot find module\" error!\
\
### Platform Engineer Insight\
**What is this concept?** A Webhook Receiver — the HTTP server endpoint that accepts incoming webhook events.\
**Why is it used?** Every webhook integration needs a running HTTP server. The receiver is the first and most critical component in the entire pipeline.\
**How does it work?** A minimal Express.js server listens on a port, accepts POST requests, and returns HTTP 200 immediately to acknowledge receipt. Heavy processing happens asynchronously.\
**How do we monitor it in production?** We track throughput, error rate, and p99 response time. A slow receiver causes the sender to time out and retry, flooding the system.",
  "simulator": {
    "tasks": [
      {
        "command": /^node index\.js$/i,
        "instruction": "Instruct the Node.js runtime to execute your server's entry point file to begin capturing payloads.",
        "hints": [
          "How do we start a Node.js application from the command line?",
          "Node.js scripts are executed directly using the `node` runtime followed by the filename.",
          "Solution: node index.js"
        ],
        "successMessage": "[SUCCESS] Receiver initialized. The Monolith feed is disrupted.",
        "errorMessage": "Invalid command. Read the instructions carefully."
      }
    ]
  }
};