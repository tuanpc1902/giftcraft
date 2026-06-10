Systematically analyse and fix all UI issues in the GiftCraft frontend.

## Arguments
$ARGUMENTS — optionally specify a page or component to focus on. If blank, analyse everything changed since the last commit.

## What to do

Read `frontend/CLAUDE.md` before starting — it lists all known Tailwind v4 and Next.js gotchas.

### Step 1 — Identify scope

If $ARGUMENTS specifies a file/page, focus there.  
Otherwise, run: `git diff --name-only HEAD` to find changed files, then focus on those.

### Step 2 — Check each file against this checklist

#### TypeScript issues
- [ ] No `any` types where the real type is known
- [ ] No `...spread` on a value that could be `null` — use optional chaining or guard
- [ ] `Object.entries()` cast to known key type if needed
- [ ] Props passed to `<Image>` must include `fill` OR both `width` + `height`

#### Tailwind v4 issues
- [ ] `h-4.5`, `w-4.5` — INVALID. Use `h-[18px]`, `w-[18px]`
- [ ] `bg-gradient-to-br` → `bg-linear-to-br`
- [ ] `aspect-[16/9]` is valid; `aspect-video` is also valid (same thing)
- [ ] No custom classes that don't exist in `globals.css` or Tailwind core

#### Next.js / React issues
- [ ] `<img>` → always `<Image>` from `next/image` with `fill` or explicit size
- [ ] Remote image host must be in `next.config.ts` `remotePatterns`
- [ ] `{/* eslint-disable-next-line */}` in JSX is a comment, NOT an ESLint suppressor — fix the underlying issue instead
- [ ] `useSearchParams()` needs `<Suspense>` wrapper
- [ ] `onSubmit` on a form in a Server Component → add `"use client"`
- [ ] Interactive event handlers (`onClick`, `onChange`, etc.) require `"use client"`

#### Auth / State issues
- [ ] Protected pages: `init()` called in `useEffect`
- [ ] No redirect triggered before hydration check
- [ ] Zustand `user` starts as `null` — don't assume it's set on first render
- [ ] `useEffect` dependency arrays are complete (no missing deps that cause stale closures)

#### UX issues
- [ ] Loading state shown BEFORE data fetch completes (not after)
- [ ] Empty state shown only after loading confirms no data (use `loaded` flag pattern)
- [ ] Modals/drawers close on outside click AND on Escape (at minimum, outside click)
- [ ] Buttons disabled while async action is in-flight
- [ ] Error states handled and shown to user

#### Accessibility / Form issues
- [ ] Form inputs have `<label>` associated via `htmlFor` or wrapping
- [ ] Submit buttons have `type="submit"`; reset/cancel buttons have `type="button"`
- [ ] Required fields marked with `required` attribute

### Step 3 — Fix all issues found

Apply fixes inline. For each fix, explain in one sentence what was wrong.

### Step 4 — Final check

After all fixes, re-read each edited file top-to-bottom and confirm no new issues were introduced.
