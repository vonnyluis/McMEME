# McDonald's MCP integration — prototype status

Reference: https://open.mcd.cn/mcp/doc (read 2026-10-14).

## Implemented now
- `lib/meme.ts`: a narrow `query-meals` response normalizer. Reads `success`, `data.meals` keyed by product code, each product's `name` and decimal-string `currentPrice`. Tags normalized records `documentation-example`.
- Tests verify integer-fen conversion and reject malformed/negative/overprecision amounts.
- The UI uses a separate synthetic six-product menu, clearly labeled DEMO. It is NOT a recording of an API session.

## Observed documentation contracts
- Section 4.2.6 query-nearby-stores: searchType=2 takes city and keyword, beType=1 means pickup, beType=5 means drive-through.
- Section 4.2.8 query-meals: `data.categories[].meals[]` reference products by code; full product records are in `data.meals`. `currentPrice` and `originalPrice` are decimal strings in yuan. `discountType` and `withOrder` can represent conditional membership offers; do not silently treat those as universally available prices.
- Section 4.2.9 query-meal-detail: `rounds`, `modification`, and `supportModify` describe supported changes. Do not invent customizations.
- Section 4.2.10 calculate-price: `data.price`, discounts and delivery prices are integer fen. Convert by 100 only for display. Pass `items[].productCode` and `quantity` and the selected store/order context.
- Section 4.2.11 create-order is a separate write operation with a payment link. This prototype has NO order route and never calls it.

## Future live path (not implemented or verified)
Each participant selects a real store -> query-meals -> query-meal-detail if needed -> calculate-price -> map selected foods to original meme illustrations. Keep user tokens server-side, scope data to each participant and retain provenance/timestamps. Verify current tools/list and schemas before integration. A live shared deployment must not expose one person's token to another.

No live MCP testing has taken place. No claim of contest eligibility is made for this offline version. Actual MCP use and the official unchanged contest declaration are still needed before submitting an entry.
