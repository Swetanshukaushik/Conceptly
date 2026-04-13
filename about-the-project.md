# About the Project

## Summary

Conceptly is a mobile-first educational reels app designed to help students learn NCERT curriculum topics through short-form video-style lessons, quick quizzes, and progress tracking. The goal is to provide a modern, engaging learning experience that blends structured curriculum discovery with interactive content and retention tools.

The repository is built as a monorepo with:
- `apps/mobile` for the Expo React Native mobile app
- `apps/backend` for the NestJS backend API

The mobile app should support onboarding, class and subject selection, topic discovery, reel viewing, quizzes, bookmarks, and progress tracking.

## Planned items to build

- Onboarding flow with class and subject selection
- Curriculum navigation: classes, subjects, chapters, topics
- Home feed with learning recommendations and continue learning section
- Topic detail pages
- Reel player and interactive reel experience
- Quiz screens tied to topic content
- Bookmark creation, listing, and removal
- Progress tracking and resume learning support
- Backend API to serve curriculum, feed, reels, quizzes, progress, bookmarks, and analytics
- Local development support for mock data and real backend connectivity
- Documentation for running locally and architecture

## What is implemented

- Expo mobile app structure under `apps/mobile`
- Expo Router-based navigation and route layouts
- Onboarding and selection flows in the mobile app
- Main app tabs: feed, explore, bookmarks, progress, profile
- Detail screens for topic, reel, and quiz
- Backend NestJS app under `apps/backend`
- Prisma-based database schema with local SQLite support
- Backend routes for curriculum, feed, reels, quizzes, progress, bookmarks, analytics, and health
- API client layer for mobile backend integration
- Local dev README guidance and architecture documentation files

## What is left

- polish reel media playback experience
- enrich home feed personalization and recommendation logic
- improve offline persistence for progress and bookmarks
- add analytics instrumentation in the frontend
- complete profile/settings and user preference flows
- harden error/loading states across screens
- add production-ready backend auth and user management
- migrate from local SQLite to production database if needed
- refine docs and developer setup as the app evolves
