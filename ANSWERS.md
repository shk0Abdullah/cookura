# ANSWERS.md

## 1. How to run

```bash
pnpm install
cp .env.example .env   # then fill in UNSPLASH_ACCESS_KEY and GROQ_API_KEY
pnpm dev
```

Open http://localhost:3000. Requires Node 20+ and pnpm 9+.

## 2. Stack choice

I chose **Next.js 16 (App Router) + Tailwind CSS v4 + Groq (Llama 3.3 70B)** because:

- Next.js App Router gives server-side API routes out of the box — no separate backend needed. The `/api/recipe` route proxies both Groq and Unsplash, keeping API keys off the client.
- Tailwind v4 makes it fast to iterate on the yellow-themed recipe card with the splitter layout without touching CSS files.
- Groq's Llama 3.3 70B is fast (sub-2s responses) and free-tier friendly, which matters for a dev-weekend project.

A worse choice would have been **Create React App + a separate Express backend**. CRA is deprecated, and splitting into two servers adds deployment complexity for zero benefit here. The API routes in Next.js eliminate that entirely.

## 3. One real edge case

**Groq returning non-JSON or malformed JSON despite the structured prompt.**

File: `src/app/api/recipe/route.ts:93-97`

```ts
let recipe: RecipeResponse;
try {
  recipe = JSON.parse(groqData.choices[0].message.content);
} catch {
  throw new Error("Failed to parse recipe from Groq response");
}
```

Even though the prompt uses `response_format: { type: "json_object" }` and a strict system prompt, LLMs can still produce invalid JSON (truncated by max_tokens, missing fields, etc.). Without this try/catch, `JSON.parse` would throw an unhandled exception that crashes the route with a 500 and an unhelpful error message. The catch wraps it into a clean 500 response the client can display.

## 4. AI usage

| Tool | What I asked | What it gave |
|------|-------------|-------------|
| OpenCode (opencode) | Explored the full codebase structure, file purposes, and conventions | Complete directory tree, all component code, API patterns, and styling conventions |
| OpenCode (opencode) | "Create the recipe API route using Groq" | Full `route.ts` with system prompt, parallel Unsplash fetch, and error handling |
| OpenCode (opencode) | "Create RecipeCard with yellow bg and splitter layout" | The full component with Tailwind classes |
| OpenCode (opencode) | "Fix form causing page reload" | Suggested removing `<form>` in favor of a plain `<div>` with `type="button"` and `onKeyDown` |

**Something I changed:** The AI initially generated the SearchBar fix by keeping the `<form>` tag and relying on `e.preventDefault()`. I changed it to remove `<form>` entirely and use `type="button"` + `onKeyDown` for Enter because the original `<form>` with `preventDefault` was still causing a page reload in practice — likely due to React's event delegation not intercepting the native submit in time. Removing the form element entirely is the more reliable fix.

## 5. Honest gap

**No mobile responsiveness on the recipe card.** The splitter layout uses `w-1/2` for both halves, which breaks on narrow screens — text gets crushed and the image becomes tiny. With another day I'd add `flex-col md:flex-row` so it stacks vertically on mobile, with the image on top and recipe text below. I'd also make the ingredients/instructions sections collapsible on small screens to reduce scrolling.
