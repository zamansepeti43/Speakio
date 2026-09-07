# Speakio — Ordered Completion Backlog

This file is the execution order for taking Speakio from MVP to release-ready product. Do not reorder without an explicit product decision.

1. Listening answer integrity — fixed by using the options actually rendered on screen.
2. Replay protection — completed lessons no longer farm daily-goal progress or the full lesson XP reward.
3. Speaking experience — in-app 0–100 scoring, transcript feedback, browser speech recognition and optional AI Coach endpoint.
4. Spaced repetition — mistakes receive due timestamps and review metadata; review screen exposes what is ready now.
5. Daily tasks and streaks — daily progress resets correctly and study-day streaks advance only on real first completion.
6. Lesson progression — keep the A1 course map stable; lesson locking can be enabled later when content gating is finalized.
7. Offline/PWA integrity — runtime hardening and premium layer are included in the service-worker core cache.
8. A1 content QA — curriculum JSON remains the single source of truth; expand and validate every unit before adding higher levels.
9. Real AI teacher — optional OpenAI-compatible `/api/coach` integration with environment variables; the base app remains usable without an API key.
10. Progress and analytics — continue from XP/streak/completion into richer mastery and learning analytics.
11. Premium infrastructure — entitlement layer is present without forcing a paid dependency on the base experience.
12. Release QA — final mobile/desktop, offline, speech, content, accessibility, performance and deployment checks before store release.

## Current implementation rule

The free/base experience must remain usable without a paid AI subscription. Optional AI and premium capabilities are layered on top of the core learning loop.
