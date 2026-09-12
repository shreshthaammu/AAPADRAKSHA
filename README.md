<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ce74b374-a08a-4391-ab80-c164ec49a20d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Runtime Architecture

The active application uses one API server:

`React/Vite -> Node/Express (server.ts) -> persisted simulation/data layer -> trained Logistic Regression inference -> fallback risk engine`

Run only `npm run dev`. The former FastAPI route implementation under `backend/app/main.py` is retired and retained as a migration marker; starting it separately would create conflicting `/api` contracts.

External IMD, CWC, NASA, ISRO, radar, and satellite feeds are not connected in this repository. They are represented as simulated or unavailable inputs. The active model is a persisted Logistic Regression classifier trained from `data/connected/flood_history_2020_2026.csv`.
