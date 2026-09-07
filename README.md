# Nicnel Plant & Equipment — Website

Corporate marketing website for **Nicnel Plant & Equipment (Pvt) Ltd**, Zimbabwe's
authorized **HD Hyundai** dealer since 1999. Live on GitHub Pages.

## The Problem This Site Solves

Nicnel sells and hires heavy earthmoving equipment across Zimbabwe and the wider
SADC region, but the company had **no web presence** that:

1. **Explains the business.** Equipment often requires technical accuracy —
   machine models (HX1000L, HX520L, HX380L), capabilities (120-ton mining
   excavator), and services (supply, heavy haulage from Durban, plant hire,
   field service). Before this site, a potential buyer had to call or hear about
   Nicnel by word of mouth.

2. **Turns visitors into leads.** Marketing sites fail when a curious visitor
   cannot reach the seller in the way the market actually uses — on **WhatsApp
   and phone**. This site turns every visit into a ready-made, pre-filled
   WhatsApp enquiry or a booked demo instead of relying on a form that gets
   ignored.

3. **Sells the range, not an abstract brand.** Zimbabwean construction, mining
   and farming buyers buy machinery, hire, and haulage. The site presents a
   browsable live fleet, port-to-site logistics, and proof of applications —
   so Nicnel is chosen before competitors are even called.

4. **Is affordable and maintainable.** The company is a small privately owned
   operation; a big CMS or server-backed website is unnecessary overhead. This
   site is **free to host** (GitHub Pages) and **self-serve to update** (see
   below) with no database or monthly fees.

## Features

- **Home, About, Services, Portfolio, Equipment** — five responsive pages.
- **Live stock page** — machine catalogue with photos, availability badges
  (Available Now / Coming In / Made to Order) and category filters.
- **Quote engine** — every machine and the contact form create a pre-filled
  WhatsApp message straight to Nicnel (with email fallback).
- **Demo booking system** — a "Book a Demo" modal (date + time + service) that
  sends a structured booking to WhatsApp; a **Calendly** live-calendar link
  appears automatically once `NICNEL_BOOKING_URL` is set in `stock.js`.
- **Self-serve stock editor** — `admin.html` lets staff add, edit, delete and
  re-label machinery without touching code.
- **Sticky mobile call bar** — Call / WhatsApp / Book Demo, always one tap away.

## Pages

| File            | Purpose                                      |
| --------------- | -------------------------------------------- |
| `index.html`    | Home, lead-capture contact form              |
| `about.html`    | Company story and values                     |
| `services.html` | Six service lines with equipment categories  |
| `portfolio.html`| Project applications with filtering          |
| `equipment.html`| Live machine stock + WhatsApp pricing        |
| `admin.html`    | Password-protected stock editor              |
| `stock.js`      | Default fleet data + render engine           |
| `booking.js`    | Booking modal + sticky mobile CTA bar        |
| `script.js`     | Navigation, animations, enquiry form         |
| `admin.js`      | Editor logic (secure login)                  |

## Self-Serve Stock Editing

1. Open `admin.html` and sign in.
2. Edit rows (status, category, model, spec, photo, note), add or delete machines.
3. Click **Save Changes** — the Equipment page updates in that browser.

> **Static-hosting limitation:** edits are stored in browser `localStorage`.
> They apply on the browser/device where they were made. To publish a change
> for all visitors, update the fleet in `stock.js` (or have your developer
> re-import it). A hosted CMS is the upgrade path for multi-device publishing.

## Security

This is a static site, so all code runs in the visitor's browser. It is hardened
with best practices, but a static page cannot be fully server-secure.

Applied today:

- **No plaintext secrets.** The admin password never appears in the repository.
  `admin.js` verifies a **salted SHA-256 digest** via the Web Crypto API with a
  timing-safe comparison.
- **Login rate limiting.** 5 failed attempts lock the login for 15 minutes.
- **Input hardening.** All user/admin-supplied text is HTML-escaped before
  rendering; image paths reject `javascript:`, `data:` and `vbscript:` schemes;
  inputs are length-capped.
- **Content Security Policy.** Every page ships a CSP meta tag restricting
  scripts, styles, fonts, images and embeds to trusted origins only.
- **Explicit limitation:** an admin page on pure static hosting can always be
  bypassed by someone who can open DevTools. For genuine protection, protect
  `admin.html` behind server-side authentication or migrate the editor to a
  hosted CMS (recommended in the sales pitch).

### Changing the admin password

1. Choose a new password and compute its salted digest, e.g. using a terminal:
   `SHA-256(password + PASS_SALT)`.
2. Replace `PASS_HASH` in `admin.js` with the new hex digest.
3. Keep `PASS_SALT` or generate a new one (and recompute the digest with it).

## Deployment

Repo: `https://github.com/noeljaywolf-create/nicnel` (branch `master`).
GitHub Pages serves from the branch root at
`https://noeljaywolf-create.github.io/nicnel/` — pushing to `master` triggers an
automatic rebuild.

```bash
git add -A
git commit -m "Describe the change"
git push origin master
```

No build step, no dependencies beyond Font Awesome + Google Fonts CDNs.

## Contact Data (source of truth)

- Head Office: 222 Mutare Road, Ruwa, Harare
- Workington: 5 Nuffield Road, Workington, Harare
- Phones: +263 242 758914 / 758916
- WhatsApp: +263 772 335 063, +263 772 342 781
- Email: nicnel@nicnel.co.zw
- Hours: Mon–Fri 07:30–16:30