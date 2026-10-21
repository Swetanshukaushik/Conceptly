# Conceptly — Atomic clarity for everything

The first-principles visual learning platform designed to make complex concepts instantly clear through micro-reels, mental models, and interactive checkpoints.

## Run locally in VS Code

### 1. Open workspace in VS Code
Open the project root folder in VS Code. Use the integrated terminal for all commands.

### 2. Start the mobile app (Expo + Web)

Run the following command to start the mobile web preview:
```bash
cd apps/frontend
npm run web
```
Or to run Expo for iOS / Android simulator:
```bash
npm start
```

### 3. Features Implemented in Conceptly

- **Vertical TikTok-Style Reel Player:** Full-screen vertical swipe video micro-lessons powered by `@shopify/flash-list` + `expo-av`.
- **Live Checkpoints Progress Track:** A compact visual checkpoint tracker shown directly over reels displaying how many reels are watched and how many are remaining for that topic.
- **Playback Speed Switcher:** Instant speed toggle (`1x`, `1.25x`, `1.5x`, `2x`).
- **Interactive Cheat-Sheet Drawer:** Slide-up modal with key interview takeaways and bullet notes.
- **5-Minute Interview Speed Run:** One-tap curated high-yield revision queue right from the home feed.
- **Curriculum Explorer with Live Search:** Instant search across system design, DSA, frontend, PM, and exam concepts.
- **Flashcard Mode:** Interactive flip cards for rapid self-testing.
- **Checkpoint Quizzes:** End-of-reel retention checkpoints with scoring, review, and progress persistence.
- **Bottom Tabs Navigation:** Home, Explore, Saved, Progress, and Profile.
