# LGS starter

A cloneable kit for a tiny local game shop site. Not a finished brand. Not Open Tonight.

You take this to a shop, fill `config.js`, and either:

1. **New site** — clone the repo, swap the fields, restyle the tokens in `styles.css` if their room needs a different look.
2. **Rescue** — same files, dropped in place of a dead or broken shop page. Hours, this week, call, directions, contact. No catalog.

Open `index.html`. No build step.

Sample values (`Shop Name`, `Your City, CA`, `(555) 010-0140`) stay fake on purpose. Do not ship them.

## Per shop, in this order

1. Duplicate the folder / clone the repo.
2. Edit **`config.js` only** for name, city, address, phone, email, hours, events, maps, Discord/Facebook.
3. If their look is different, change the **THEME** block at the top of `styles.css`. Leave the HTML structure.
4. Confirm the FormSubmit email once. Publish (GitHub Pages is fine).

That is the whole product. Do not pre-build a stack of fake client sites.

## `config.js`

`window.SHOP`:

- **SHOP_NAME**, **TAGLINE**, **CITY**, **ADDRESS**, **PHONE**, **EMAIL**
- **HOURS** — Sun–Sat, 24h `open` / `close`. `null` = closed that day.
- **EVENTS** — name, game, weekday (0=Sun), time, fee, blurb
- **DISCORD**, **FACEBOOK**, **INSTAGRAM**, **MAPS_URL**
- Optional: **CARRY**, **NEW_PLAYERS**, **POLICY**, **PREORDER_NOTE**, **TIMEZONE** (default `America/Los_Angeles`)

The page binds those fields: open/closed, hours table, this week, call, directions, form, JSON-LD.

## Pages

- `index.html` — hours, this week, play space, carry, how nights run, buy/sell, contact
- `events.html` — the week

## Files

```
config.js      fill this per shop
styles.css     THEME tokens at the top, then layout
effects.js     hours, events, form, schema
index.html
events.html
favicon.svg
README.md
```

## What this is not

A 10,000-SKU inventory. A live singles feed. Meta ads. A locked look for every shop. Open Tonight.
