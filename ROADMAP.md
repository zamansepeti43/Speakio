# Speakio — Completion Status

## ✅ A1 release candidate core

1. ✅ Listening answer integrity — rendered options are used for validation.
2. ✅ Replay protection — completed lessons do not farm full lesson XP or daily-goal progress.
3. ✅ Speaking experience — browser Speech Recognition, transcript, local 0–100 score and in-app feedback.
4. ✅ Spaced repetition foundation — wrong answers receive due timestamps and successful reviews advance 1 → 3 → 7 → 14 → 30 day intervals.
5. ✅ Daily tasks and streak hardening — local-date reset and study-day streak handling.
6. ✅ Lesson progression — stable 12-unit A1 course map.
7. ✅ Offline/PWA integrity — Service Worker caches the complete runtime and content core.
8. ✅ A1 content QA — 12 units, 48 exercises and schema/quality assertions.
9. ✅ Optional real AI teacher hook — OpenAI-compatible `/api/coach`, disabled safely when credentials are absent.
10. ✅ Progress foundation — XP, streak, completion, mistakes, voice statistics and JSON backup/restore.
11. ✅ Premium entitlement foundation — local entitlement API without making the free core dependent on payment.
12. ✅ Release QA foundation — syntax, content, PWA and API contract checks plus GitHub Actions CI.

## 🚀 Post-A1 product roadmap

These are intentionally **not prerequisites for the current A1 release candidate**:

- A2 → B1 → B2 → C1 curriculum expansion
- Cloud account + cross-device synchronization
- Production authentication and secure server-side progress
- Advanced pronunciation/phoneme scoring
- Production billing/subscription provider and server-side entitlement verification
- Rich learning analytics and mastery dashboards
- Native Android/iOS packaging and store assets
- Production-grade accessibility audit and automated browser E2E tests

## Product rule

The free/base learning loop must remain usable without a paid AI subscription. Optional AI and premium layers are additive, not blockers for the A1 core.
