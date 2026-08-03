export const level8 = {
  id: "level-8",
  title: "Level 8 – The Silent Drops",
  type: "theory",
  briefing: {
    recap: "You successfully deployed a Webhook to replace the polling loop. However, the server logs revealed an unknown IP address was secretly masking its traffic behind the noise.",
    incident: "Payment Webhooks from our external provider (Stripe) are failing to register in the MEI Billing System. Customers are being charged, but their accounts aren't being credited. We are losing revenue by the second.",
    task: "Investigate the Billing System's Webhook receiver. Identify why the incoming payment notifications are being rejected with 405 Method Not Allowed errors.",
    rewards: { xp: 100, badge: 'None' }
  },
  content: `
## Incident Analysis Report
**Timestamp:** 09:44:12 UTC
**Service:** Billing_Receiver_API
**Status:** OUTAGE

You open the logs for the Billing System and see a wall of red:

\`\`\`log
[ERROR] Incoming request from Stripe -> /webhooks/billing -> 405 Method Not Allowed
[ERROR] Incoming request from Stripe -> /webhooks/billing -> 405 Method Not Allowed
[ERROR] Incoming request from Stripe -> /webhooks/billing -> 405 Method Not Allowed
\`\`\`

Why would the Billing System suddenly reject valid Webhooks from our payment provider?

## Concept Explanation: HTTP Methods

When a client (or in this case, a Webhook sender) makes an HTTP request to a server, it must specify an **HTTP Method** (also known as a verb). This method tells the server what *type* of action is being requested.

The four most common methods used in REST APIs are:
- **GET**: Retrieve data (e.g., getting a user's profile). GET requests should *never* modify data.
- **POST**: Create new data or submit a payload (e.g., creating a new user, or sending a Webhook event).
- **PUT**: Update existing data completely.
- **DELETE**: Delete data.

### The Sabotage

Webhooks are almost universally sent using the **POST** method because they contain a payload (the JSON data about the event).

You check the routing configuration for the Billing System:

\`\`\`javascript
// Business Cloud OS Billing Router (Current State)
router.get('/webhooks/billing', function(req, res) {
  // Process payment...
});
\`\`\`

Someone—or something—modified the code. They changed \`router.post\` to \`router.get\`. 

Because the router is only configured to listen for \`GET\` requests, when Stripe sends a \`POST\` request containing the payment data, the web server rejects it immediately with a **405 Method Not Allowed** error. It's essentially saying, "I know this URL exists, but you aren't allowed to use POST here."

You quickly deploy a hotfix, changing the router back to \`router.post\`. The logs instantly turn green as queued payment Webhooks begin processing. 

\`\`\`log
[INFO] Incoming request from Stripe -> /webhooks/billing -> 200 OK
\`\`\`

But the mystery deepens. Configuration drift like this doesn't happen accidentally. The rogue entity is testing our defenses, probing how quickly we can identify and resolve integration failures.

> **SYSTEM ALERT:** You must inspect the live logs to find the silent failure. Run the appropriate \`tail\` command.
`

  ,
  simulator: {
    tasks: [
      {
        command: /^tail\s+-f\s+\/var\/log\/mei_webhook_receiver\.log$/i,
        instruction: "The Webhooks are failing silently. Tail the receiver log file continuously to see what is happening. Use `tail -f /var/log/mei_webhook_receiver.log`",
        successMessage: "[INFO] Listening for Webhooks...\n[ERROR] Payload rejected: Missing Content-Type application/json\n[SARAH]: \"Aha! The provider is sending plain text instead of JSON!\"",
        errorMessage: "Invalid command. Try `tail -f /var/log/mei_webhook_receiver.log`"
      }
    ]
  }
};
