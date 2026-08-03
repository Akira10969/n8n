# Curriculum Dump

## level-1: Level 1 – The Ping Drop

**Type:** theory

**Briefing Task:** [SARAH - SENIOR Platform Engineer]: Hey, new kid. Looks like one of the old marketing servers is acting up. Probably just a dusty network cable or a routing glitch. Can you verify basic connectivity before we escalate?

**Content Overview:**  ## Incident Communication Log  **Sarah (Senior Engineer):**  "Before we go pulling cables, we need to know if the server is completely dead or just dropping packets intermittently.   But first, let's make sure you understand how data actually travels across the network. When you send a message over...

**Instructions:**
  1. Verify if the marketing server (10.4.12.88) is alive and responding on the network.

---

## level-2: Level 2 – The Silent Server

**Type:** theory

**Briefing Task:** [SARAH - SENIOR Platform Engineer]: Okay, so the machine is plugged in, but the web server application itself might have crashed. We need to test the application layer, not just the network layer.

**Content Overview:**  ## Incident Communication Log  **Sarah (Senior Engineer):**  "A computer on the internet is like an apartment building. `ping` just tells you if the building is still standing. But we need to know if the *receptionist* inside the building is awake.  This is the **Client-Server Model**.  - You (your...

**Instructions:**
  1. Attempt to retrieve the webpage from the marketing server to verify the web service is responding.
  2. The service was rebooted. Attempt to fetch the webpage again to confirm it is accessible.

---

## level-3: Level 3 – The Typo

**Type:** theory

**Briefing Task:** [SARAH - SENIOR Platform Engineer]: The server is up, but the developers say it's broken. Classic. Let's look at the exact HTTP request they are sending to the server to see who's really at fault here.

**Content Overview:**  ## Incident Communication Log  **Sarah (Senior Engineer):**  "Alright, so `curl` isn't just a ping tool. It's a full-fledged HTTP client.   **HTTP (Hypertext Transfer Protocol)** is the language clients and servers use to talk to each other. When a browser (or curl) connects to a server, it doesn't...

**Instructions:**
  1. Execute an HTTP request against the developer's endpoint, but enable verbose output to see the full transaction details.

---

## level-4: Level 4 – The Broken Path

**Type:** theory

**Briefing Task:** [SARAH - SENIOR Platform Engineer]: They fixed the spelling, but they still don't understand how our APIs are structured. Time to teach them some basic REST principles.

**Content Overview:**  ## Incident Communication Log  **Sarah (Senior Engineer):**  "A URL is just an address. But in modern systems, we use **REST (Representational State Transfer)**. REST is a set of rules for how APIs should be designed.  One of the core rules of REST is that you use **HTTP Methods (Verbs)** to tell t...

**Instructions:**
  1. Send an HTTP request to the API endpoint using the correct HTTP Method for creating data.

---

## level-5: Level 5 – The Malformed Payload

**Type:** theory

**Briefing Task:** [SARAH - SENIOR Platform Engineer]: Sigh. They are trying to send data, but they aren't formatting it correctly. Let's show them how JSON works.

**Content Overview:**  ## Incident Communication Log  **Sarah (Senior Engineer):**  "When we send data to an API, we can't just send raw text or a proprietary Excel file. Both the client and the server need to agree on a universal language.   That language is **JSON (JavaScript Object Notation)**.   JSON is incredibly st...

**Instructions:**
  1. Send the POST request again, this time attaching the required JSON payload in the request body.

---

## level-6: Level 6 – The Polling Problem

**Type:** theory

**Briefing Task:** Analyze the incoming traffic to the Inventory Service. Identify the source of the load spike and propose an architectural shift from continuous API polling to an event-driven model.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 04:12:08 UTC **Service:** Core_Inventory_API **Status:** DEGRADED  Our monitoring tools indicate that the **Fulfillment Service** is hammering the Inventory API with over 15,000 requests per minute.   When you intercept the traffic, you see the exact same ...

**Instructions:**
  1. Inspect the running processes on the server to locate the rogue polling script.
  2. Use the Business Cloud OS custom CLI to forcefully terminate the rogue fulfillment polling service.

---

## level-7: Level 7 – The First Hook

**Type:** theory

**Briefing Task:** Configure the Inventory Service to push event notifications to the Fulfillment Webhook endpoint. Review the server logs to verify the connection is stable.

**Content Overview:**  ## Deployment Log **Operator:** Player_One **Action:** Webhook Registration  To establish the Webhook, you register the Fulfillment Service's endpoint with the Inventory Service's event registry:  ```JSON POST /API/v1/webhooks/register {   "target_url": "https://fulfillment.mei.internal/hooks/inven...

**Instructions:**
  1. Construct an HTTP request to register your new webhook listener URL with the fulfillment service.
  2. Use the system CLI to trigger a test event and verify the provider successfully calls your webhook.

---

## level-8: Level 8 – The Silent Drops

**Type:** theory

**Briefing Task:** Investigate the Billing System's Webhook receiver. Identify why the incoming payment notifications are being rejected with 405 Method Not Allowed errors.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 09:44:12 UTC **Service:** Billing_Receiver_API **Status:** OUTAGE  You open the logs for the Billing System and see a wall of red:  ```log [ERROR] Incoming request from Stripe -> /webhooks/billing -> 405 Method Not Allowed [ERROR] Incoming request from Str...

**Instructions:**
  1. Inspect the live, real-time output of the webhook receiver's log file to catch the incoming events as they happen.

---

## level-9: Level 9 – Decoding the Errors

**Type:** theory

**Briefing Task:** Analyze the HTTP Status Codes to diagnose the root cause of the failures. Determine if the issue lies with the sender (CRM) or the receiver (Analytics Engine).

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 14:22:05 UTC **Service:** Analytics_Engine **Status:** CASCADING FAILURE  You pull up the centralized logging dashboard. Thousands of requests are failing every minute, but they are failing for different reasons.   ```log [ERROR] POST /Webhook/analytics ->...

**Instructions:**
  1. Send a diagnostic HTTP request to the receiver that only returns the response headers, so we can inspect the status codes.

---

## level-10: Level 10 – The Missing Credentials

**Type:** theory

**Briefing Task:** Inspect the raw HTTP requests traveling between the Order Service and the Authorization Service. Determine why valid requests are suddenly being rejected.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 16:03:11 UTC **Service:** Authorization_Gateway **Status:** CRITICAL  The Order Service makes API calls to the Authorization Gateway to verify user permissions before processing orders. Suddenly, every single one of these calls is failing.  You pull the lo...

**Instructions:**
  1. Send a test payload to the secure endpoint, ensuring you include the required authentication token in the request headers.

---

## level-11: Level 11 – The Imposter

**Type:** theory

**Briefing Task:** Investigate the Webhook logs. Understand how an attacker is triggering legitimate system actions without making actual payments, and implement a foundational security layer.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 21:04:33 UTC **Service:** Account_Upgrader_Service **Status:** COMPROMISED  The Account Upgrader Service listens for Webhooks from the Billing Service. When it receives a Webhook indicating a payment was successful, it upgrades the user's account in the da...

**Instructions:**
  1. Configure the server's firewall to block all incoming traffic from the compromised rogue subnet.

---

## level-12: Level 12 – The Key Rotation

**Type:** theory

**Briefing Task:** Implement a secure API Key management strategy. You must rotate the compromised keys without taking the production systems offline, and transition away from hardcoded secrets.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 02:15:09 UTC **Service:** Account_Upgrader_Service **Status:** COMPROMISED (AGAIN)  The security token you implemented in the last mission (`super_secret_token_123`) worked for exactly 5 hours. Now, the attacker is sending Webhooks with the correct token. ...

**Instructions:**
  1. The API keys have been compromised. Use the system CLI to immediately rotate the secrets for the billing service.

---

## level-13: Level 13 – The Cryptographic Seal

**Type:** theory

**Briefing Task:** Upgrade the Webhook security architecture. Implement HMAC (Hash-based Message Authentication Code) signatures so the receiver can mathematically verify that the payload has not been tampered with and was sent by a trusted source.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 04:55:22 UTC **Service:** Account_Upgrader_Service **Status:** COMPROMISED (LEVEL 3)  the rogue entity has proven they have network-level visibility. If they can intercept the API key in transit, they can impersonate the Billing Service indefinitely.   Sen...

**Instructions:**
  1. Verify the integrity of the payload by manually computing its HMAC SHA-256 signature using the shared secret key.

---

## level-14: Level 14 – The Network Flap

**Type:** theory

**Briefing Task:** Design a resilient Webhook delivery pipeline. Implement Retry Logic and Exponential Backoff to ensure that Webhooks are stored and re-transmitted if the receiver is temporarily unavailable.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 11:30:04 UTC **Service:** MEI_Network_Mesh **Status:** UNSTABLE  The cryptographic seals are holding, but the attacker has pivoted to a brute-force infrastructure attack. By flooding the internal network with junk traffic, they are causing our Webhook rece...

**Instructions:**
  1. Test the network stability to the remote node by sending a specific, limited number of ping packets.

---

## level-15: Level 15 – The Dead Letter

**Type:** theory

**Briefing Task:** Implement a Dead Letter Queue (DLQ) to catch and store any Webhooks that fail all delivery attempts. Inspect the DLQ to figure out why these specific Webhooks are un-deliverable.

**Content Overview:**  ## Incident Analysis Report **Timestamp:** 23:58:14 UTC **Service:** MEI_Job_Processor **Status:** DEGRADED  Exponential backoff solved 99% of our delivery issues during the network attacks. However, if a receiving server is completely destroyed and offline for hours, the Webhook will eventually ex...

**Instructions:**
  1. Use the system CLI to inspect the Dead Letter Queue (DLQ) and identify the webhooks that failed their final retry.

---

## level-16: The Severed Monolith

**Type:** theory

**Briefing Task:** Analyze the Event-Driven Architecture (EDA) paradigm. We must decouple the remaining surviving microservices before the infection spreads through tight coupling.

**Content Overview:** ## Communications Intercept **[Sarah]** "Engineers, listen to me. Whatever this is, it's smart. It's following the synchronous API calls back to our core database. If Service A waits for Service B to respond, they are tied together. If one dies, they both die."  **[UNIT-7]** "ANALYSIS: Tight couplin...

**Instructions:**
  1. Use the system CLI to decouple the webhook receiver from the Core DB and prevent a cascading failure.

---

## level-17: Echoes in the Wire

**Type:** theory

**Briefing Task:** Understand and implement Idempotency to ensure duplicate events do not result in duplicate actions.

**Content Overview:** ## Communications Intercept **[UNIT-7]** "WARNING: Duplicate Webhook payloads detected on the billing endpoint. Account balance for ID #88492 has been deducted 412 times in the last 4 seconds."  **[Sarah]** "Shut it down! It's flooding the network with replays of the exact same event. If we don't fi...

**Instructions:**
  1. Ensure the system processes the event exactly once by acquiring a distributed lock in Redis before proceeding.

---

## level-18: The Exponential Backoff

**Type:** theory

**Briefing Task:** Learn how to handle network instability using intelligent retry mechanisms and Exponential Backoff.

**Content Overview:** ## Communications Intercept **[Sarah]** "We're losing connections. Sector 4 just went dark for 10 seconds. Webhooks are failing to deliver. If we just retry them all immediately, we'll accidentally DDoS ourselves when the network comes back up."  **[UNIT-7]** "SUGGESTION: Implement Exponential Backo...

**Instructions:**
  1. Inspect the system configuration file to determine the maximum number of retry attempts currently configured.

---

## level-19: The Buffer Zone

**Type:** theory

**Briefing Task:** Introduce a Message Queue architecture to decouple ingestion speed from processing speed.

**Content Overview:** ## Communications Intercept **[Sarah]** "The Analytics service can only process 500 events a second. The Anomaly is hammering the gateway with 5,000 events a second. The service is drowning!"  **[UNIT-7]** "ANALYSIS: Ingestion rate exceeds processing capacity. Recommendation: Deploy an asynchronous ...

**Instructions:**
  1. Use the system CLI to create a new message broker topic to buffer the incoming webhook traffic.

---

## level-20: Fractured Reality

**Type:** theory

**Briefing Task:** Understand Eventual Consistency and the sacrifices made when moving to asynchronous, queued architectures.

**Content Overview:** ## Communications Intercept **[Sarah]** "I'm looking at two different monitoring screens. One says the server is online. The other says it's destroyed. Which one is lying?"  **[UNIT-7]** "Neither is lying. They are both reporting the truth at different points in time. The delay in the message queues...

**Instructions:**
  1. Extract the timestamp fields from the two incoming JSON payloads to determine their true chronological sequence.

---

## level-21: The Graveyard

**Type:** theory

**Briefing Task:** Deploy a Dead Letter Queue (DLQ) to isolate and quarantine corrupted, unprocessable events.

**Content Overview:** ## Communications Intercept **[Sarah]** "The queue just stopped draining! The consumers are choking on something."  **[UNIT-7]** "ANALYSIS: Poison pill detected. The adversary has injected malformed JSON payloads. The consumer attempts to parse it, throws an exception, crashes, reboots, and attempts...

**Instructions:**
  1. Use the system CLI to run a reconciliation sync job to fetch the missed events from the source provider.

---

## level-22: The Scatter Protocol

**Type:** theory

**Briefing Task:** Implement the Fan-Out architectural pattern using Webhooks and Pub/Sub.

**Content Overview:** ## Communications Intercept **[Sarah]** "We can't write 50 different API calls to notify every security subsystem. It takes too long. If Node 7 falls, the entire sector needs to lock down in milliseconds."  **[UNIT-7]** "SUGGESTION: Initiate Fan-Out Protocol."  ## The Fan-Out Pattern In standard que...

**Instructions:**
  1. Analyze the delivery logs to determine how many of the scatter protocol webhooks were successfully delivered.

---

## level-23: Holding the Floodgates

**Type:** theory

**Briefing Task:** Implement strict Rate Limiting to protect the core infrastructure from being crushed by the onslaught.

**Content Overview:** ## Communications Intercept **[Sarah]** "The perimeter is buckling! They are hammering our Webhook ingestion endpoints with millions of garbage requests. If the API gateway falls, they have direct access to the queues."  **[UNIT-7]** "WARNING: API Gateway CPU at 98%. Imminent failure predicted in 14...

**Instructions:**
  1. The rate limiting configuration has been updated. Send a signal to the web server to reload its configuration gracefully.

---

## level-24: Trust Nothing

**Type:** theory

**Briefing Task:** The final defense. Implement Cryptographic Webhook Signatures to verify the authenticity of all incoming payloads.

**Content Overview:** ## Communications Intercept **[Sarah]** "How did that payload get through? It looked exactly like a Stripe Webhook! It bypassed the rate limiters, it bypassed the idempotency checks!"  **[UNIT-7]** "ANALYSIS: The payload is a perfect forgery. However, it lacks cryptographic authentication."  **[Sara...

**Instructions:**
  1. Authenticate with the secure endpoint by presenting your mutual TLS (mTLS) client certificate and private key.

---

## project-1: Project 1 - The Monolith

**Type:** lab

**Briefing Task:** Build a local Webhook receiver to siphon traffic away from The Monolith.

**Content Overview:** ## System Diagnostics**[UNIT-7]** "WARNING: The Monolith is absorbing all Webhook payloads. It is growing in size."**[Sarah]** "We need to establish our own receiver to intercept the payloads before they reach the core."## ObjectiveYou must deploy a basic Express server to capture the JSON payloads....

**Instructions:**
  1. Initialize your server by running node index.js.

---

## project-2: Project 2 - The Decoupling

**Type:** lab

**Briefing Task:** Implement a message queue to decouple ingestion from processing.

**Content Overview:** ## System Diagnostics**[The Void]** "You cannot handle the flood. You will drown."**[Sarah]** "It is right. If we try to process these Webhooks synchronously, the receiver will crash. We need a Queue."## ObjectiveRoute incoming Webhooks into an in-memory queue to decouple the ingestion....

**Instructions:**
  1. Install the Bull queue library by running npm install bull.

---

## project-3: Project 3 - The Phantom Signatures

**Type:** lab

**Briefing Task:** Implement HMAC signature verification to block malicious payloads.

**Content Overview:** ## System Diagnostics**[UNIT-7]** "WARNING: 45% of incoming payloads are unauthenticated."**[Sarah]** "The Void is spoofing our Webhooks. We must verify the HMAC signatures before enqueuing."## ObjectiveAdd cryptographic signature verification using the crypto library....

**Instructions:**
  1. Install the crypto library using npm install crypto-js.

---

## project-4: Project 4 - The Graveyard

**Type:** lab

**Briefing Task:** Implement a Dead Letter Queue (DLQ) to capture failed Webhooks.

**Content Overview:** ## System Diagnostics**[The Void]** "The Graveyard is where we were born. You cannot control it."**[Sarah]** "We need to reclaim the Graveyard. Set up a Dead Letter Queue so we can inspect and retry failed Webhooks."### Core Engineering Principle: ObservabilityTo diagnose failures at scale, you need...

**Instructions:**
  1. Run node configure_dlq.js to establish the Dead Letter Queue.

---

## project-5: Project 5 - The Swarm

**Type:** lab

**Briefing Task:** Implement strict Rate Limiting on the Webhook ingestion endpoints.

**Content Overview:** ## System Diagnostics**[UNIT-7]** "WARNING: CPU at 99%. Rate of ingestion critical."**[Sarah]** "Throttle them! We need rate limiting at the application level to survive this swarm."## ObjectiveImplement a Token Bucket rate limiter....

**Instructions:**
  1. Install the rate limiting package using npm install express-rate-limit.

---

## project-6: Project 6 - The Mirror

**Type:** lab

**Briefing Task:** Implement a Webhook Fan-Out architecture to reflect traffic back to multiple Void endpoints.

**Content Overview:** ## System Diagnostics**[Sarah]** "We can use its own strategy against it. Set up a fan-out architecture. When we receive a payload, broadcast it to all of The Void exposed endpoints."**[The Void]** "WHAT ARE YOU DOING?"### Core Engineering Principle: Correlation IDs & Event TracingWhen a Webhook pas...

**Instructions:**
  1. Execute the Fan-Out script using node fanout.js.

---

## project-7: Project 7 - The Core

**Type:** lab

**Briefing Task:** Deploy the ultimate Webhook architecture: Idempotent, Signed, Queued, Rate-Limited, and Highly Available.

**Content Overview:** ## System Diagnostics**[The Void]** "I AM FOREVER. I AM THE ORPHANED CODE."**[Sarah]** "Not anymore. Deploy the final architecture! Idempotency keys, HMAC signatures, Queues, DLQs, and Rate Limiting all in one!"### The Complete Webhook LifecycleYou must now execute the entire lifecycle to defeat The...

**Instructions:**
  1. Execute the final deployment sequence using ./deploy_final_architecture.sh.

---

