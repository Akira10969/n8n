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
  "content": "## Communications Intercept\n**[Sarah]** \"Engineers, listen to me. Whatever this is, it's smart. It's following the synchronous API calls back to our core database. If Service A waits for Service B to respond, they are tied together. If one dies, they both die.\"\n\n**[UNIT-7]** \"ANALYSIS: Tight coupling detected in 84% of surviving systems. Recommendation: Sever all direct connections.\"\n\n**[Sarah]** \"Exactly. We need to move to an **Event-Driven Architecture (EDA)** immediately. No more waiting. Services will broadcast events into The Anomaly, and anyone who needs to listen, will listen.\"\n\n## Event-Driven Architecture (EDA)\nIn a traditional monolith, if a user pays an invoice, the Billing service directly calls the Shipping service to print a label. \n\nIn **EDA**, we completely decouple them:\n1. **Producer:** The Billing service simply broadcasts an event: `invoice.paid`. It doesn't care who is listening.\n2. **Consumer:** The Shipping service listens for `invoice.paid` webhooks. When it hears one, it prints a label.\n\nIf the Shipping service crashes, the Billing service keeps processing payments without knowing or caring. The tight coupling is severed.\n\n### The Decoupling Strategy\nBy utilizing webhooks and events, we create a system where components are highly autonomous. In our current crisis, this is our only defense. If the infection compromises the Email Microservice, the Billing Microservice won't be dragged down with it.\n\nWe must prepare to adapt all systems to this pattern. The survival of MEI_Cloud_OS depends on it."

  ,
  simulator: {
    tasks: [
      {
        command: /^mei-cli\s+service\s+decouple\s+--target\s+core_db$/i,
        instruction: "Sever the tight synchronous coupling to the Core DB to prevent a cascading failure.",
        successMessage: "[OK] Synchronous API links to core_db severed.\n[OK] Falling back to Event-Driven Message Bus.",
        errorMessage: "Invalid syntax. Try `mei-cli service decouple --target core_db`"
      }
    ]
  }
};
