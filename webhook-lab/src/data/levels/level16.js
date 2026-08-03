export const level16 = {
  "id": "level-16",
  "title": "The Severed Monolith",
  "type": "theory",
  "briefing": {
    "recap": "The mid-tier systems have stabilized, but the anomalies are no longer random. Something is actively tracing our direct API connections.",
    "incident": "URGENT: Central Database Alpha is under siege. Direct synchronous connections are being weaponized against us. The monolithic core is failing.",
    "task": "Analyze the Event-Driven Architecture (EDA) paradigm. We must decouple the remaining surviving microservices before the infection spreads through tight coupling.",
    "rewards": {
      "xp": 200,
      "badge": "None"
    }
  },
  "content": "## Communications Intercept\n**[Sarah]** \"Engineers, listen to me. Whatever this is, it's smart. It's following the synchronous API calls back to our core database. If Service A waits for Service B to respond, they are tied together. If one dies, they both die.\"\n\n**[UNIT-7]** \"ANALYSIS: Tight coupling detected in 84% of surviving systems. Recommendation: Sever all direct connections.\"\n\n**[Sarah]** \"Exactly. We need to move to an **Event-Driven Architecture (EDA)** immediately. No more waiting. Services will broadcast events into The Anomaly, and anyone who needs to listen, will listen.\"\n\n### Core Engineering Principle: Trust Boundaries\n\nMoving to EDA means opening our endpoints to the internet to receive Webhooks. Remember the golden rule of Platform Engineering: **Never trust incoming data.**\n\nWhenever data moves from an external system (like the internet or a 3rd party Webhook sender) into our internal systems, it crosses a **Trust Boundary**. A Webhook payload must be treated as malicious until cryptographically proven otherwise.\n\n## Event-Driven Architecture (EDA)\nIn a traditional monolith, if a user pays an invoice, the Billing service directly calls the Shipping service to print a label. \n\nIn **EDA**, we completely decouple them:\n1. **Producer:** The Billing service simply broadcasts an event: `invoice.paid`. It doesn't care who is listening.\n2. **Consumer:** The Shipping service listens for `invoice.paid` Webhooks. When it hears one, it validates the Trust Boundary, then prints a label.\n\nIf the Shipping service crashes, the Billing service keeps processing payments without knowing or caring. The tight coupling is severed.\n\n### The Decoupling Strategy\nBy utilizing Webhooks and events, we create a system where components are highly autonomous. In our current crisis, this is our only defense. If the infection compromises the Email Microservice, the Billing Microservice won't be dragged down with it.\n\nWe must prepare to adapt all systems to this pattern. The survival of Business Cloud OS depends on it.\n\n### Platform Engineer Insight\n**Security:** Trust Boundaries are why your Webhook Listener should live in a DMZ (Demilitarized Zone) on your network. If the Listener is compromised by a malicious payload, it shouldn't have direct access to your Core Database."

  ,
  simulator: {
    tasks: [
      {
        command: /^docker-compose\s+up\s+-d\s+rabbitmq$/i,
        instruction: 'Use the system CLI to decouple the webhook receiver from the Core DB and prevent a cascading failure.',
        hints: [
          "Spin up the new message broker using `docker-compose`.",
          "The subsystem is 'architecture'.",
          "The action is 'decouple'."
        ],
        solution: 'docker-compose up -d rabbitmq',
        successMessage: "[OK] Synchronous API links to core_db severed.\n[OK] Falling back to Event-Driven Message Bus.",
        errorMessage: "Invalid syntax. Try `docker-compose up -d rabbitmq`"
      }
    ]
  }
};
