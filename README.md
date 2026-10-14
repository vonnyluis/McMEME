<p align="center"><img src="public/brand/logo.svg" width="360" alt="McMEME" /></p>

<h1 align="center">Two trays. One inside joke.</h1>
<p align="center"><strong>Your meal. Our meme. · 一起点餐，一起造梗。</strong></p>
<p align="center">English + 简体中文 · Collaborative rooms · Original illustrations · PNG export</p>

![McMEME — English homepage](docs/mcmeme-desktop-en.png)

## Lunch becomes a shared story

One friend says “just a coffee.” The other brings burger-and-fries energy. McMEME turns that contrast into a tiny, co-authored comic: choose your food, write your line, approve together, and keep the moment.

Built for friends, couples and coworkers who want a playful ritual around a shared lunch — even when they are in different cities.

**Status: working offline-data prototype. Real McDonald’s MCP integration and contest registration are pending.**

[Hosted preview (owner-only sign-in)](https://mcmeme-studio-vonnyluis.erceiha.chatgpt.site) · [MCP integration status](MCP_INTEGRATION.md) · [Brand assets](public/brand)

## See it in action

These are real captures of the running prototype, not concept mockups. Menu and prices are demo data.

![Chinese homepage](docs/mcmeme-desktop-zh.png)
![Interactive meme studio](docs/mcmeme-studio-en.png)

<details><summary>A real exported meme — 1520 × 1380 PNG</summary>

<img src="docs/mcmeme-demo.png" width="640" alt="Exported two-person McMEME comic" />

</details>

## Try the story

1. Open the local app and choose **Try solo demo**.
2. Give seat A coffee, seat B a burger and fries.
3. Pick a suggested line or write your own; switch between The duo, The receipt and The plot twist.
4. Approve both sides and download the PNG.
5. For real collaboration, create a table and send its one-use invitation to a second browser participant. Both participants need access to the same deployment.

## Project

**Your meal. Our meme. / 一起点餐，一起造梗。**

A two-person food-meme studio with an original comic-zine identity. English and Simplified Chinese. This is an independent, token-free prototype, not an official McDonald's product or a contest submission.

## What works
- Solo playground: edit both trays, captions, and three visual formats.
- Shared rooms: invite a second participant, separate seat credentials, polling synchronization, server-side persistence in D1.
- Caption suggestions selected deterministically from an original library according to tray contents. No LLM/API key needed.
- Separate approval from each participant. Every saved content/layout change resets both approvals.
- PNG download at 1520 x 1380 with all local SVG illustrations embedded.
- Responsive layout, keyboard focus trap for dialogs, reduced-motion support.

## Demo versus real
All six menu products and prices are illustrative, synthetic fixtures. City choices are storytelling labels, not actual restaurant searches. No McDonald's credentials, live calls, ordering, payment, coupon redemption or inventory claims. The response adapter follows the public MCP documentation and is tested against an extracted example. See MCP_INTEGRATION.md.

## Local development
Node 22.13+ and npm required. On Windows use Node 24+ for the included TypeScript-stripping tests.

1. `npm run install:ci`
2. `npm run build`
3. `node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_careless_the_executioner.sql` (once per local database)
4. `npm run dev`
5. Open http://127.0.0.1:5173

If a Windows npm shim resolves incorrectly, invoke `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" run install:ci`, then `node scripts/run-framework.mjs build` or `dev` directly.

## Checks
- `node --test tests/core.test.mjs`
- `node tests/rooms.integration.mjs` (requires local preview and migrated DB)
- `node node_modules/typescript/bin/tsc --noEmit`

## Shared-room access
A room expires after 7 days. Access uses random opaque tokens; only SHA-256 hashes are stored server-side. The invite token is one-use and appears in the URL fragment. Each participant can change only their own seat; either can change format, resetting approval. Updates use optimistic revision checks. Credentials are retained in sessionStorage, so use the original tab/browser session to resume. Expiry disables access; it does not promise physical erasure of stored records.

Hosting is owner-private by default. A room invitation does not bypass the Site access policy. External friend testing needs a separately approved hosting-audience change. Local tests exercise two independent participant sessions. Before a public launch add abuse throttling, retention cleanup and review the public access policy.

## Brand
Original SVG wordmark, speech-bubble mark, six illustrated food characters and brand poster: `public/brand`. Colors: tomato #e53726, butter #ffcf32, paper #fff8e8, ink #29251f, mint #b6d8bf. Typography: Space Grotesk + DM Sans with local system fallbacks. Font download is optional; the application and PNG export do not depend on it.

## 中文
McMEME 是双人餐点表情图工作室。选餐、写台词、双方确认后导出 PNG。支持单人体验和真实双人房间。当前菜单、价格和城市均用于演示，不代表实时门店供应，不会下单或支付。文案来自原创规则库，无需大模型密钥。项目尚未接入真实麦当劳 MCP，也尚未报名比赛。

## License
Original McMEME code and artwork are MIT licensed. Bundled third-party components retain their own licenses; see THIRD_PARTY_NOTICES.md. McDonald’s names and marks remain their owners’ property.
