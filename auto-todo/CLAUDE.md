# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start          # Start dev server (scan QR with Expo Go or open in simulator)
npx expo start --ios    # Open in iOS simulator
npx expo start --android # Open in Android emulator
npx expo start --web    # Open in browser
npm run lint            # Run ESLint via expo lint
```

No test suite is configured.

## Goal of this app

The overarching goal of this app is to have a widget on a phone homescreen with todo points. Those points should be fetched from a database and should require no human input to show in this widget.

## Architecture

**Stack:** Expo Router (file-based routing) + Supabase (auth + database) + React Native

**Auth flow:** Google OAuth via `expo-web-browser` with an implicit flow. Tokens are extracted from the redirect URL fragment and passed to `supabase.auth.setSession()`. Session is persisted via `expo-sqlite/localStorage`. The root layout (`app/_layout.tsx`) handles routing on auth state changes — unauthenticated users are redirected to `/sign-in`, authenticated users to `/`.

**Supabase client:** `utils/supabase.ts` — single shared instance, `detectSessionInUrl: false` because token extraction is manual. The key and URL are inlined (publishable/anon key, safe to commit).

**Database layer:** `lib/database.ts` — plain async functions wrapping Supabase queries for the `todos` table (`id`, `user_id`, `title`, `completed`, `created_at`). Row-level security on Supabase enforces `user_id` scoping so queries don't need explicit user filtering beyond what Supabase RLS handles.

**State management:** `hooks/use-todos.ts` — fetch-on-demand hook that calls `refresh()` after every mutation (no optimistic updates). The main screen calls `refresh()` on focus via `useFocusEffect`.

**Screens:**

- `app/index.tsx` — todo list with `FlatList`, FAB to create, long-press to edit
- `app/todo-modal.tsx` — shared create/edit modal (presence of `id` param determines mode)
- `app/sign-in.tsx` — Google sign-in entry point
- `app/auth/callback.tsx` — loading spinner shown during OAuth redirect handling

**Theming:** `constants/theme.ts` exports `Colors` and `Typography` objects used directly in `StyleSheet.create()`. No dark mode — black/white only.

**Path aliases:** `@/` maps to the project root (configured in `tsconfig.json`).

## Other instructions

Only start implementing once you are 95 percent certain of the strategy, ask questions about the problem until you reach this certainty. Define what "done" means before writing any code.
Use a defensive programming style, add types.
Prefer simple solutions to complicated ones.
Prefer to solve problems without installing external libraries.
Code must be easily human readable, not overly compact or with obscure syntax.
State your assumptions clearly.
Only change what you were asked to change, do not make edits to files unrelated to what i asked for.
