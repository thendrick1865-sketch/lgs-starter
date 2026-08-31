# LGS starter

A reusable static front door for a tiny local game shop (LGS / TCG / hobby). Clone it for a pitch. Open `index.html`. No build step.

This is a **template**. Sample copy is obviously fake: `SHOP_NAME`, `Your City, CA`, `(555) 010-0140`. It is not a live catalog, not an ads landing page, and not an agency site.

## Swap these 10 fields before a walk-in

All of them live in `config.js` as `window.SHOP`.

1. **SHOP_NAME** — the words on the glass.
2. **TAGLINE** — one line under the name.
3. **CITY** — e.g. still `Your City, CA` until you mean it.
4. **ADDRESS** — street line as it should appear on a map pin.
5. **PHONE** — shown and used as `tel:`.
6. **EMAIL** — mailto plus the FormSubmit action.
7. **HOURS** — door hours, Sun–Sat, 24h `open` / `close`. Use `null` for a closed day.
8. **DISCORD** — invite URL.
9. **FACEBOOK** — page URL. (Instagram is next to it in the same file.)
10. **MAPS_URL** — Google Maps placeholder / real pin.

Then, still in `config.js`, fill **EVENTS** (name, game, weekday, time, fee, new-player flag) so this week is not empty. Optional: **CARRY**, **NEW_PLAYERS**, **POLICY**, **PREORDER_NOTE**, **TIMEZONE**.

`TIMEZONE` defaults to `America/Los_Angeles` so the OPEN LED matches a California door. Change it if the shop is not on Pacific time.

## What the owner should feel on a phone

Hours that match the door. An OPEN / CLOSED LED. Tonight / this week as cards. A drawing of the play space (not a stock photo). Pickup / preorder at the counter. Discord and Facebook. How Friday night actually works.

## Pages

- `index.html` — home, hours, tonight, play space, what we carry, new players, buy/sell/trade, contact form.
- `events.html` — the week as cards, with LocalBusiness + Event JSON-LD.

Nav is real on both pages.

## Design notes

Ink background, brass accent, Syne + Outfit. Huge type. Cards pick up a faint pointer glow on fine pointers; `prefers-reduced-motion` turns that off.

## Form

The contact form posts to [FormSubmit](https://formsubmit.co/) using `EMAIL` from config. Confirm the address once in FormSubmit’s email handshake, or skip the form and use the mailto link.

## What this is not

A 10,000-SKU inventory. A live singles feed. Meta ads. Neon esports. A wiki.

## Files

```
config.js      shop fields (edit this)
index.html     home
events.html    this week
styles.css
effects.js     OPEN LED, events, schema, nav, glow
favicon.svg
README.md
```
