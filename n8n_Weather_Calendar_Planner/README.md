# AI-Powered Daily Planner 🚀

A full-stack productivity dashboard that intelligently combines your daily calendar events and local weather to generate highly personalized AI coaching insights using Google Gemini. Built with React and powered by an automated n8n backend workflow.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Technologies Used](#-technologies-used)
4. [Workflow Explanation](#-workflow-explanation)
5. [Folder Structure](#-folder-structure)
6. [How to Import into n8n](#-how-to-import-into-n8n)
7. [Screenshots](#-screenshots)
8. [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview
The goal of this project is to create a premium, visually stunning daily planner dashboard that doesn't just display data, but *interprets* it. By analyzing schedule density and the day's weather conditions, the application provides actionable, AI-driven productivity advice to help optimize a daily routine.

---

## ✨ Features
- **Real-Time Data Sync:** Pulls live agenda items from Google Calendar and live weather from OpenWeatherMap.
- **AI Productivity Coaching:** Gemini AI analyzes the user's free time and weather to suggest optimal work blocks or break times.
- **Resilient Fallbacks:** The n8n automation safely handles empty calendars and missing data without crashing.
- **Premium Glassmorphism UI:** A React frontend styled with deep-space mesh gradients, frosted glass panels, and satisfying hover animations.
- **CORS Bypassing:** Utilizes a Vite proxy to seamlessly connect the React frontend to the local n8n instance securely.

---

## 💻 Technologies Used
- **Frontend:** React.js, Vite, Vanilla CSS (Glassmorphism design system), Lucide React (Icons)
- **Backend / Automation:** n8n (Node-based workflow automation)
- **AI Model:** Google Gemini Flash API
- **External APIs:** Google Calendar API (OAuth2), OpenWeatherMap API

---

## 🔄 Workflow Explanation
The core logic is handled by the `workflow.json` n8n instance executing the following pipeline:
1. **Webhook (`GET /planner-data`):** Listens for requests from the React frontend.
2. **Google Calendar:** Authenticates via OAuth2 and retrieves all events scheduled for the current day.
3. **OpenWeatherMap:** Fetches real-time weather conditions for the specified city.
4. **Format Data (Code):** A JavaScript node that safely extracts valid events and weather data, handling empty calendars gracefully. It constructs the dynamic prompt string for the AI.
5. **Gemini API (HTTP Request):** Sends a POST request to Google's Generative Language API with the constructed prompt, returning a 2-sentence productivity insight.
6. **Final Output (Code):** Aggregates the calendar array, weather object, and AI insight string into a single JSON payload and returns it to the webhook caller.

---

## 📂 Folder Structure
```text
n8n_Weather_Calendar_Planner/
├── workflow.json               # Exported n8n workflow for easy import
├── dashboard/                  # React Frontend
│   ├── src/
│   │   ├── App.jsx             # Main application logic & UI
│   │   ├── App.css             # Component styling & animations
│   │   ├── index.css           # Global design system & theme variables
│   │   └── main.jsx            # React entry point
│   ├── vite.config.js          # Vite configuration & n8n CORS Proxy
│   └── package.json            # Frontend dependencies
├── screenshots/                # Images of the workflow and output
└── assets/                     # Additional project assets
```

---

## 📥 How to Import into n8n
1. Open your n8n workspace.
2. Create a new workflow.
3. Click the menu in the top right corner and select **Import from File**.
4. Select the `workflow.json` file located in this directory.
5. You will need to re-authenticate your Google Calendar node and update the OpenWeatherMap and Gemini API keys in the node parameters before executing.

---

## 📸 Screenshots

*(Replace these placeholder links with actual repository image paths after uploading)*

- **Dashboard View:** `![Dashboard UI](./screenshots/output.png)`
- **n8n Workflow Canvas:** `![n8n Workflow](./screenshots/workflow.png)`

---

## 🚀 Future Improvements
- **Multi-Day Forecasting:** Expand the timeline to show a 3-day productivity forecast.
- **Task Manager Integration:** Pull active tasks from Todoist or Notion into the AI context window.
- **Authentication:** Add a login layer to allow multiple users to connect their own Google Calendars.
- **Cloud Deployment:** Host the n8n instance on Render/Railway and deploy the React frontend to Vercel for 24/7 access.
