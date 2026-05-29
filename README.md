# slide-into-action

A single-screen **"Bosses of Bangalore"** join interstitial for Tal. Its only job is to get a visitor into the WhatsApp community group with as little friction as possible — while still presenting a branded moment on desktop.

**Live:** https://mediummasala-slide-into-action.shahyashashish.workers.dev

## Behaviour

Platform is detected on load (`navigator.userAgent`) and the experience branches:

| Platform | Behaviour |
| --- | --- |
| **Android / iOS** | Redirects straight to the WhatsApp invite link on load. Android app-links / iOS universal links open the WhatsApp app natively. No interstitial. |
| **Desktop** | Shows the branded middle page: eyebrow → big lowercase brand → `BETA` badge, and a black **Join the group** button (WhatsApp glyph) that **auto-presses after 2 seconds** with a progress fill telegraphing it. The button is also clickable for an instant join. Closes with a "with love, by Tal" signoff. |

The destination is a WhatsApp group invite (`https://chat.whatsapp.com/...`).

## Configuration

All copy and the redirect live in the `CONFIG` object in [`src/routes/index.tsx`](src/routes/index.tsx). Two variants exist — `candidate` and `boss` — toggled by the `PAGE` constant:

```ts
const PAGE: "candidate" | "boss" = "candidate";
```

Each variant defines `eyebrow`, `brand`, `badge`, `buttonLabel`, and `redirectUrl`. The auto-press delay is `AUTO_PRESS_MS` (default `2000`).

## Stack

- **TanStack Start** (React, SSR) via [`@lovable.dev/vite-tanstack-config`](https://www.npmjs.com/package/@lovable.dev/vite-tanstack-config)
- **Tailwind CSS** + shadcn/ui primitives
- **Cloudflare Workers** (Nitro `cloudflare` preset) for hosting

## Develop

```bash
bun install      # or: npm install
bun dev          # or: npm run dev
```

## Deploy (Cloudflare Workers)

The Lovable Vite preset only wires its Nitro Cloudflare plugin when run inside Lovable, so this repo sets `nitro: true` in `vite.config.ts` to force it on. The build then emits a Workers bundle and `dist/server/wrangler.json`.

```bash
npm run build
npx wrangler deploy -c dist/server/wrangler.json
```

The worker is named `mediummasala-slide-into-action`.
