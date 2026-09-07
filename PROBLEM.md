# Problem Statement — Nicnel Plant & Equipment Website

**Status:** Solving (v1 shipped and live) · **Owner:** Website delivery
**Document purpose:** Specify — in one place — the business problem this website
solves, what it is, why it matters, how the site addresses it, and how success is
measured.

---

## 1. Summary

> Nicnel Plant & Equipment — an authorized HD Hyundai dealer serving Zimbabwe's
> construction, mining and farming sectors for 25+ years — had **no working web
> presence**. Buyers of heavy machinery could not find, understand, or contact
> the business digitally, so high-value enquiries and demos were lost to
> word-of-mouth and competitors. This project delivers a low-cost, self-serve
> website that makes Nicnel findable, explains its genuine 120-ton capability,
> and converts visitors into WhatsApp/phone leads and booked demos.

---

## 2. The Problem

### 2.1 Business context

- Nicnel Plant & Equipment (Pvt) Ltd is a privately owned Zimbabwean company,
  founded in **1999**, an **authorized HD Hyundai dealer**.
- Product range spans from small forklifts up to the **HX1000L 120-ton mining
  excavator**, plus wheel loaders, ADTs, graders, dump trucks and skid steers.
- Services: equipment supply, **heavy haulage from Durban across the SADC
  region**, plant hire, mining & quarry solutions, farming & earthworks, and an
  on-site field service crew.
- Customers operate in construction, commercial farming, mining (platinum, gold,
  coal) and logistics — high-value, technically demanding purchases.

### 2.2 Core problem statement

**Nicnel has no web presence that (a) explains its business, (b) generates
leads, and (c) sells its product range — and the absence is not free: competitors
who appear online win the enquiries Nicnel should win.**

Before this site, a potential buyer had to:
1. Already know Nicnel (word of mouth), and
2. Pick up the phone cold — with no catalogue, no prices/availability, no proof
   of work to review first.

### 2.3 Symptoms and consequences

| Symptom | Consequence |
| --- | --- |
| No marketing site for the flagship product (machinery) | Serious buyers research online before calling; `HX1000L excavator Zimbabwe` returns no path to Nicnel |
| Prior domains unreachable (historically offline) | Lost credibility; buyers assume the business is inactive or small |
| Enquiries routed only through phone | Missed after-hours/remote buyers; no structured, follow-up-ready lead record |
| No live inventory visible | Buyers can't self-serve "is it in stock?" — more friction, more cold calls for staff |
| No demo/site-visit path | Interest that needs a physical demo has no way to schedule one |
| Content is dense (models, specs, tonnages) | Without a careful site, Nicnel looks generic instead of technically credible |

### 2.4 Root causes

1. **No digital catalogue** of machines, services, or finished applications.
2. **No lead-capture mechanism** aligned with how the market communicates
   (WhatsApp is the default in Zimbabwe; forms alone fail).
3. **No maintainer workflow** — previous options felt costly/complex for a small
   privately owned operation, so nothing was maintained.
4. **No risk appetite for expensive infrastructure** — a data centre CMS with
   monthly fees is disproportionate overhead for this business.

---

## 3. Goals (SMART)

1. Make Nicnel **findable and credible** online within week 1 (shipped and live).
2. Capture **every enquiry** as a pre-filled WhatsApp message to the real sales
   number — zero lost leads from form friction.
3. Turn "interested" visitors into **booked demos / site visits** with a
   date/time request that Nicnel confirms in hours.
4. Let Nicnel **self-serve stock updates** (add/sell/re-price machines) without
   code or cost.
5. Operate at **~$0/month** on static hosting with no database to maintain.

---

## 4. The Solution (how the site maps to the problem)

| Pain (see §2.3) | Solution in the site |
| --- | --- |
| No web presence | Five-page responsive site: Home, About, Services, Portfolio, Equipment |
| Dense technical offering | Equipment page with model names, specs (e.g. 100.2 t operating weight, 630 hp, 6.8 m³ bucket), photos, and category filters |
| Leads lost to form friction | Pre-filled WhatsApp quotes from every machine card + the contact form (email fallback kept) |
| No demo path | "Book a Demo" modal (service, machine, date, time → structured WhatsApp booking); Calendly slot ready to enable |
| No live inventory | Stock page with availability badges — Available Now / Coming In / Made to Order |
| Can't self-serve updates | `admin.html` stock editor (password-protected, secure login) |
| Perceived cost/complexity | Free static hosting (GitHub Pages), no backend, no monthly fees |

---

## 5. Scope

### In scope (v1 — shipped)
- Marketing pages: home, about, services, portfolio, equipment.
- WhatsApp quote engine and demo-booking flow.
- Self-serve stock editor (`admin.html`).
- Security hardening: hashed admin login, output escaping, Content-Security-Policy.
- Documentation (README + this document).

### Out of scope (v1)
- Server-side authentication/logged-in CMS (recommended hosted upgrade).
- Payment processing or e-commerce checkout.
- Multi-device live stock publishing (requires a hosted backend).
- Calendly live calendar until Nicnel provides its booking URL.

---

## 6. Success criteria / how we'll know it's solved

| Metric | Target |
| --- | --- |
| Enquiries to WhatsApp sales number from the site | ≥ 5 genuine enquiries / month |
| Booked demos via the booking flow | ≥ 2 / month |
| Machine price-requests from the Equipment page | ≥ 5 / month |
| Stock updates made in `admin.html` without developer help | Self-serve, confirmed by user |
| Hosting cost | $0 / month (GitHub Pages) |
| Pages load on phone on a 3G/4G connection | Fast, responsive (verified responsive layout) |

---

## 7. Non-goals (deliberately excluded to keep the site honest and simple)

- **Not** a marketplace or auction engine.
- **Not** a real-time inventory database (static by design; see note in README).
- **Not** a replacement for Nicnel's WhatsApp/phone sales process — the site
  feeds that process, it does not replace it.

---

## 8. Evidence that the problem was real

- Nicnel's previously used domains are unreachable; the business relied on
  word-of-mouth and scattered third-party directory listings.
- LinkedIn/SocialBus/SmartPages listings exist but are thin — no catalogue, no
  lead capture, no booking.
- Directory listings are inconsistent (phones, hours vary), reinforcing the need
  for a single authoritative source of contact truth (captured in the README).

---

## 9. Honest limitations

- Static hosting means **localStorage-scoped stock edits**: updates apply on the
  browser where they are made. Site-wide publishing requires editing `stock.js`.
- Client-side admin login raises the bar but cannot be made server-proof without
  a backend. Both are documented in the README and offered as the hosted upgrade
  that converts this demo into a fully hosted product.