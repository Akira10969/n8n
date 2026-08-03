import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const levelsDir = path.join(__dirname, '../src/data/levels');

const replacements = [
  {
    file: 'level1.js',
    old: `instruction: 'Verify network connectivity to the marketing server (10.4.12.88) using ICMP echo requests.',`,
    new: `instruction: 'Verify if the marketing server (10.4.12.88) is alive and responding on the network.',
        hints: [
          "Think about how submarines check for targets.",
          "The command is 4 letters and starts with 'p'.",
          "You need to provide the IP address after the command."
        ],
        solution: 'ping 10.4.12.88',`
  },
  {
    file: 'level2.js',
    old: `instruction: 'Retrieve the webpage from the marketing server (10.4.12.88) on port 80 to verify that the web service is responding.',`,
    new: `instruction: 'Attempt to retrieve the webpage from the marketing server to verify the web service is responding.',
        hints: [
          "You can make HTTP requests directly from the terminal.",
          "The tool you need sounds like something you do with your hair (curl).",
          "Provide the IP address as the argument."
        ],
        solution: 'curl 10.4.12.88',`
  },
  {
    file: 'level2.js',
    old: `instruction: 'Sarah rebooted the web service. Run the same command again to verify that the webpage is now accessible.',`,
    new: `instruction: 'The service was rebooted. Attempt to fetch the webpage again to confirm it is accessible.',
        hints: [
          "Just run the exact same command you used before.",
          "Press the UP arrow to access your terminal history."
        ],
        solution: 'curl 10.4.12.88',`
  },
  {
    file: 'level3.js',
    old: `instruction: 'Execute a verbose curl request against the developer\\'s endpoint.',`,
    new: `instruction: 'Execute an HTTP request against the developer\\'s endpoint, but enable verbose output to see the full transaction details.',
        hints: [
          "You need the curl command.",
          "Check the briefing for the verbose flag.",
          "The flag is -v."
        ],
        solution: 'curl -v http://10.4.55.2/webhook',`
  },
  {
    file: 'level4.js',
    old: `instruction: 'Use curl with the -X POST flag to hit the API endpoint.',`,
    new: `instruction: 'Send an HTTP request to the API endpoint using the correct HTTP Method for creating data.',
        hints: [
          "By default, curl uses the GET method.",
          "You need to change the method to POST.",
          "Use the -X flag followed by the method name."
        ],
        solution: 'curl -X POST http://10.4.55.2/webhook',`
  },
  {
    file: 'level5.js',
    old: `instruction: 'Execute the POST request with the corrected JSON payload.',`,
    new: `instruction: 'Send the POST request again, this time attaching the required JSON payload in the request body.',
        hints: [
          "You need to send data with your request.",
          "Use the -d flag to attach data.",
          "Make sure your JSON is properly formatted with quotes."
        ],
        solution: 'curl -X POST -d \\'{"event":"test","valid":true}\\' http://10.4.55.2/webhook',`
  },
  {
    file: 'level6.js',
    old: `instruction: 'Find the rogue polling process. Use the standard Linux command to list processes and filter for "polling".',`,
    new: `instruction: 'Inspect the running processes on the server to locate the rogue polling script.',
        hints: [
          "You need to list the processes and search through them.",
          "Use the 'ps aux' command to list processes.",
          "Pipe the output to 'grep' to filter for the word 'polling'."
        ],
        solution: 'ps aux | grep polling',`
  },
  {
    file: 'level6.js',
    old: `instruction: 'Terminate the rogue service using the Business Cloud OS custom CLI. Command: mei-cli service stop fulfillment_polling',`,
    new: `instruction: 'Use the Business Cloud OS custom CLI to forcefully terminate the rogue fulfillment polling service.',
        hints: [
          "The system uses a custom CLI tool called 'mei-cli'.",
          "You need to interact with a 'service'.",
          "The action is 'stop' and the target is 'fulfillment_polling'."
        ],
        solution: 'mei-cli service stop fulfillment_polling',`
  },
  {
    file: 'level7.js',
    old: `instruction: 'Register the Webhook endpoint using standard curl. Use a POST request with the exact JSON payload shown in the deployment log.',`,
    new: `instruction: 'Construct an HTTP request to register your new webhook listener URL with the fulfillment service.',
        hints: [
          "You are making a POST request to the provider's registration endpoint.",
          "You need to send JSON data.",
          "The payload must contain a 'target_url' property pointing to your listener."
        ],
        solution: 'curl -X POST -d \\'{"target_url":"http://10.4.55.2/webhook"}\\' http://10.4.12.88/register',`
  },
  {
    file: 'level7.js',
    old: `instruction: 'Trigger a test event using the MEI CLI to verify the connection is active.',`,
    new: `instruction: 'Use the system CLI to trigger a test event and verify the provider successfully calls your webhook.',
        hints: [
          "Use the 'mei-cli' tool.",
          "The subsystem is 'webhook'.",
          "The action is 'trigger_test'."
        ],
        solution: 'mei-cli webhook trigger_test',`
  },
  {
    file: 'level8.js',
    old: 'instruction: "The Webhooks are failing silently. Tail the receiver log file continuously to see what is happening. Use `tail -f /var/log/mei_webhook_receiver.log`",',
    new: `instruction: 'Inspect the live, real-time output of the webhook receiver\\'s log file to catch the incoming events as they happen.',
        hints: [
          "You need to view the end of a file and keep watching it.",
          "The tool is 'tail'.",
          "Use the '-f' (follow) flag to watch for changes."
        ],
        solution: 'tail -f /var/log/mei_webhook_receiver.log',`
  },
  {
    file: 'level9.js',
    old: 'instruction: "Send a HEAD/Headers-only POST request to the Webhook receiver to inspect its HTTP response codes. Use `curl -I -X POST http://10.4.55.2/webhook`",',
    new: `instruction: 'Send a diagnostic HTTP request to the receiver that only returns the response headers, so we can inspect the status codes.',
        hints: [
          "You need to make a POST request but only fetch the headers.",
          "Check the curl documentation for the 'head' or 'include' flag.",
          "The flag is '-I'."
        ],
        solution: 'curl -I -X POST http://10.4.55.2/webhook',`
  },
  {
    file: 'level10.js',
    old: 'instruction: "Test the authenticated endpoint by passing the Bearer token in the headers. Use `curl -H \\"Authorization: Bearer secret_token\\" http://10.4.55.2/webhook`",',
    new: `instruction: 'Send a test payload to the secure endpoint, ensuring you include the required authentication token in the request headers.',
        hints: [
          "You need to add a custom header to your request.",
          "Use the '-H' flag.",
          "The header format is 'Authorization: Bearer <token>'."
        ],
        solution: 'curl -H "Authorization: Bearer secret_token" http://10.4.55.2/webhook',`
  },
  {
    file: 'level11.js',
    old: 'instruction: "Block the rogue subnet from sending forged Webhooks. Drop all traffic from 10.4.99.0/24 using iptables.",',
    new: `instruction: 'Configure the server\\'s firewall to block all incoming traffic from the compromised rogue subnet.',
        hints: [
          "You need to use the 'iptables' firewall utility.",
          "Append a rule to the INPUT chain (-A INPUT).",
          "Specify the source subnet (-s 10.4.99.0/24) and jump to the DROP target (-j DROP)."
        ],
        solution: 'iptables -A INPUT -s 10.4.99.0/24 -j DROP',`
  },
  {
    file: 'level12.js',
    old: 'instruction: "The API keys have been compromised. Immediately rotate the secrets for the billing service.",',
    new: `instruction: 'The API keys have been compromised. Use the system CLI to immediately rotate the secrets for the billing service.',
        hints: [
          "Use the 'mei-cli' tool.",
          "The subsystem is 'secrets'.",
          "The action is 'rotate' and the target is 'billing'."
        ],
        solution: 'mei-cli secrets rotate billing',`
  },
  {
    file: 'level13.js',
    old: 'instruction: "Manually compute the HMAC SHA-256 signature of the payload.JSON file using the secret key.",',
    new: `instruction: 'Verify the integrity of the payload by manually computing its HMAC SHA-256 signature using the shared secret key.',
        hints: [
          "Use the 'openssl' command line tool.",
          "Use the 'dgst' command with the '-sha256' algorithm.",
          "Provide the HMAC key using '-hmac secret_key' and pass the 'payload.json' file."
        ],
        solution: 'openssl dgst -sha256 -hmac secret_key payload.json',`
  },
  {
    file: 'level14.js',
    old: 'instruction: "Test network stability to the remote node. Send exactly 10 ping packets to 10.4.88.9.",',
    new: `instruction: 'Test the network stability to the remote node by sending a specific, limited number of ping packets.',
        hints: [
          "You need to use the 'ping' command.",
          "Use a flag to limit the number of packets (count).",
          "The flag is '-c 10'."
        ],
        solution: 'ping -c 10 10.4.88.9',`
  },
  {
    file: 'level15.js',
    old: 'instruction: "Inspect the Dead Letter Queue (DLQ) to see which Webhooks failed their final retry attempt.",',
    new: `instruction: 'Use the system CLI to inspect the Dead Letter Queue (DLQ) and identify the webhooks that failed their final retry.',
        hints: [
          "Use the 'mei-cli' tool.",
          "The subsystem is 'dlq'.",
          "The action is 'view'."
        ],
        solution: 'mei-cli dlq view',`
  },
  {
    file: 'level16.js',
    old: 'instruction: "Sever the tight synchronous coupling to the Core DB to prevent a cascading failure.",',
    new: `instruction: 'Use the system CLI to decouple the webhook receiver from the Core DB and prevent a cascading failure.',
        hints: [
          "Use the 'mei-cli' tool.",
          "The subsystem is 'architecture'.",
          "The action is 'decouple'."
        ],
        solution: 'mei-cli architecture decouple',`
  },
  {
    file: 'level17.js',
    old: 'instruction: "Ensure idempotency by setting a distributed lock for event_8891. Use Redis SETNX (Set if Not eXists).",',
    new: `instruction: 'Ensure the system processes the event exactly once by acquiring a distributed lock in Redis before proceeding.',
        hints: [
          "You need to use the 'redis-cli' command.",
          "The command to set a key only if it doesn't exist is 'SETNX'.",
          "The key is 'event_8891' and the value can be 'locked'."
        ],
        solution: 'redis-cli SETNX event_8891 locked',`
  },
  {
    file: 'level18.js',
    old: `instruction: "Check the backoff configuration. Pipe the config file into grep to find the 'max_retries' value.",`,
    new: `instruction: 'Inspect the system configuration file to determine the maximum number of retry attempts currently configured.',
        hints: [
          "You need to search the contents of a file.",
          "Use 'cat config.json' to output the file.",
          "Pipe the output to 'grep' and search for 'max_retries'."
        ],
        solution: 'cat config.json | grep max_retries',`
  },
  {
    file: 'level19.js',
    old: 'instruction: "Create a scalable message broker topic to buffer incoming Webhooks during traffic spikes.",',
    new: `instruction: 'Use the system CLI to create a new message broker topic to buffer the incoming webhook traffic.',
        hints: [
          "Use the 'mei-cli' tool.",
          "The subsystem is 'broker'.",
          "The action is 'create_topic'."
        ],
        solution: 'mei-cli broker create_topic',`
  },
  {
    file: 'level20.js',
    old: 'instruction: "Use jq to extract the timestamps from two out-of-order payloads to determine their true chronological sequence.",',
    new: `instruction: 'Extract the timestamp fields from the two incoming JSON payloads to determine their true chronological sequence.',
        hints: [
          "You need to parse JSON data from the terminal.",
          "Use the 'jq' tool.",
          "The filter to extract the timestamp is '.timestamp'. Pass the file 'payloads.json'."
        ],
        solution: 'jq .timestamp payloads.json',`
  },
  {
    file: 'level21.js',
    old: 'instruction: "The database has missed Webhooks during the downtime. Run a reconciliation sync job to fetch missed events from the source.",',
    new: `instruction: 'Use the system CLI to run a reconciliation sync job to fetch the missed events from the source provider.',
        hints: [
          "Use the 'mei-cli' tool.",
          "The subsystem is 'sync'.",
          "The action is 'reconcile'."
        ],
        solution: 'mei-cli sync reconcile',`
  },
  {
    file: 'level22.js',
    old: 'instruction: "The Scatter Protocol fired a Webhook to 500 listeners. Use grep to filter the logs for successful deliveries.",',
    new: `instruction: 'Analyze the delivery logs to determine how many of the scatter protocol webhooks were successfully delivered.',
        hints: [
          "You need to search the logs for a success indicator.",
          "Use 'cat /var/log/deliveries.log' to read the log.",
          "Pipe the output to 'grep' and search for '200 OK'."
        ],
        solution: 'cat /var/log/deliveries.log | grep "200 OK"',`
  },
  {
    file: 'level23.js',
    old: 'instruction: "Rate limiting configuration has been written. Send the reload signal to the Nginx reverse proxy to apply the changes.",',
    new: `instruction: 'The rate limiting configuration has been updated. Send a signal to the web server to reload its configuration gracefully.',
        hints: [
          "You need to use the 'systemctl' command.",
          "The action is 'reload'.",
          "The service name is 'nginx'."
        ],
        solution: 'systemctl reload nginx',`
  },
  {
    file: 'level24.js',
    old: 'instruction: "Bypass the Zero Trust Architecture by presenting valid mutual TLS (mTLS) certificates.",',
    new: `instruction: 'Authenticate with the secure endpoint by presenting your mutual TLS (mTLS) client certificate and private key.',
        hints: [
          "Use the 'curl' command.",
          "You need to provide the certificate using the '--cert client.crt' flag.",
          "You need to provide the key using the '--key client.key' flag."
        ],
        solution: 'curl --cert client.crt --key client.key https://10.4.55.2/webhook',`
  }
];

let changed = 0;
for (const rep of replacements) {
  const filePath = path.join(levelsDir, rep.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(rep.old)) {
      content = content.replace(rep.old, rep.new);
      fs.writeFileSync(filePath, content);
      changed++;
    } else {
      console.log('Could not find match in ' + rep.file);
    }
  }
}
console.log('Rewrote ' + changed + ' instructions.');
