# About Conceptly

## Summary

Conceptly is a first-principles visual micro-learning platform designed to make the world concept-clear with crystal-clear explanations of complex topics. Through ultra-dense short-form video reels (45–60 seconds), ASCII architecture diagrams, interactive cheat sheets, checkpoint progress tracking, and rapid quizzes, Conceptly enables learners to build deep intuition and mental models when it matters most.

The repository is built as a monorepo with:
- `apps/mobile`: Expo React Native mobile app with FlashList vertical swipe reels, interactive checkpoint tracks, and bottom tabs.
- `apps/backend`: NestJS modular API backend.

## Domains Covered

- **Tech & Software Engineering:** System Design, Distributed Systems, Algorithms & Data Structures, Frontend (React), Backend & Databases.
- **Product Management:** CIRCLES framework, Metrics, Product Sense, Behavioral.
- **Finance & Consulting:** Market Entry, Profitability Frameworks, Valuation.
- **Competitive Exams:** UPSC Civil Services, IIT JEE, NEET.
- **NCERT Curriculum:** Class 6–10 Mathematics & Science.

## Frontend Features Implemented

- **Vertical Swipe Reel Player:** Full-screen TikTok-style micro-lessons powered by `@shopify/flash-list` and `expo-av`.
- **Live Checkpoints Progress Track:** Dynamic checkpoint bar on each reel showing watched vs remaining reels for the topic.
- **Playback Speed Switcher:** 1x, 1.25x, 1.5x, 2x playback speed control for fast revisers.
- **Interactive Cheat-Sheet Drawer:** Modal overlay with key interview takeaways and bullet notes.
- **Pre-Interview 5-Minute Speed Run:** Instant curated high-yield revision queue from the home screen.
- **Search & Filter Explorer:** Instant live search across concepts, chapters, and difficulty levels.
- **Flashcard Mode:** Interactive flip cards for rapid self-testing.
- **Topic Practice Quizzes:** End-of-reel retention checkpoint with scoring, answers review, and mastery tracking.
- **Native Tabs Navigation:** Home, Explore, Saved, Progress, and Profile.
