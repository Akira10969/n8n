export const project4 = {
  id: "project-4",
  title: "Project 4 – Weather Alert System",
  type: "theory",
  content: `
## Project Goal
Create a scheduled automated workflow that acts as a Webhook Sender (Producer). It will poll a public weather API every morning and push a webhook event to a Discord or Slack channel if it is going to rain.

## Prerequisites
- An active n8n instance
- A free API key from [OpenWeatherMap](https://openweathermap.org/)
- A Discord or Slack workspace where you can create incoming webhooks

## Architecture Diagram
\`\`\`mermaid
graph LR
    A[Cron Job / Timer] --> B[HTTP GET Weather API]
    B --> C{IF condition: Rain?}
    C -- Yes --> D[HTTP POST Webhook to Discord]
    C -- No --> E[Do Nothing]
\`\`\`

## Step-by-Step Instructions

### Step 1: Set up the Schedule
1. In n8n, create a new workflow and add a **Schedule Trigger** node.
2. Configure it to run every day at 8:00 AM.

### Step 2: Fetch the Weather Data
1. Add an **HTTP Request** node.
2. Set the Method to **GET**.
3. Set the URL to the OpenWeatherMap API for your city (e.g., \`https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY\`).
4. Click "Execute Node" to verify it fetches the massive JSON payload of weather data.

### Step 3: Add the Logic (The IF Node)
1. Add an **IF** node.
2. For the condition, drag the \`weather[0].main\` field from the HTTP node into the IF node.
3. Set the condition to: String -> Contains -> \`Rain\`.

### Step 4: Send the Webhook to Discord
Discord allows you to generate a webhook URL for any channel.
1. In Discord, right-click a channel > Edit Channel > Integrations > Create Webhook. Copy the Webhook URL.
2. Back in n8n, attach an **HTTP Request** node to the "True" output of the IF node.
3. Set Method to **POST**.
4. Set the URL to your Discord Webhook URL.
5. Set "Send Body" to \`true\` and format it exactly how Discord requires:
\`\`\`json
{
  "content": "☔ Grab an umbrella! It is going to rain today!"
}
\`\`\`

## Testing & Success Criteria
1. To test it immediately, click the "Execute Workflow" button (ignoring the 8:00 AM schedule).
2. If it is raining in your chosen city, your phone should immediately buzz with a Discord notification.
3. (Tip: If it's sunny, temporarily change the IF condition to \`Clear\` just to verify the Discord webhook works!)

You have just built a system that generates and sends webhooks based on real-world events!
`
};
