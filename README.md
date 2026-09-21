# CineShow

A movie ticket booking and cinema management platform built as a front-end academic
project, using only **HTML5** and **CSS3** — no JavaScript, no frameworks, no backend.

**Live Demo:** [Website](https://fullstack-miniproject.vercel.app/index.html)

**Repository:** https://github.com/skgpt254/CineShow-Cinema_Management-and-Booking_System

---

## Overview

CineShow replicates the core user journey of a real ticket-booking platform: browse
movies, view details, pick a cinema and showtime, select seats, add snacks, pay, and
receive a confirmed e-ticket — plus a staff-facing admin dashboard. All data is
static; the goal is a clean, fully client-side demonstration of HTML/CSS fundamentals.

## Features

- Responsive multi-page layout with a shared design system (CSS custom properties)
- Movie catalog with language, genre, and format filters
- Genuinely clickable seat map — built with `checkbox` + `:checked`, no JavaScript
- Payment method tabs using the `:has()` selector
- Real form-based checkout → payment → confirmation flow
- Cinema directory, showtimes, offers, login, and an admin dashboard
- Zero inline styles and zero comments — every style lives in one stylesheet

## Tech Stack

HTML5 · CSS3 (Flexbox, Grid, custom properties, `:checked`, `:has()`) · SVG assets

## Project Structure

```
index.html            Home
movies.html            Movie catalog + filters
movie-details.html     Synopsis, cast, trailer, reviews
cinemas.html           Cinema directory
cinema-details.html    Showtimes by cinema
offers.html            Deals & coupons
booking.html           Movie / cinema / date / showtime selection
seats.html             Seat map (CSS-only interactivity)
checkout.html          Order summary + snacks
payment.html           Payment method + demo form
success.html           E-ticket confirmation
login.html             Sign in / sign up (UI only)
admin.html             Cinema staff dashboard
css/style.css          Shared stylesheet
images/                Poster & cinema artwork (local SVGs)
```

## Team & Branches

| Member | Branch | Owns |
|---|---|---|
| Sandesh | `feature/home-admin` | Home, Admin, `style.css`, `images/` |
| Ravi Kumar | `feature/booking-seats` | Cinema Details, Movie Details, Booking, Seats |
| Rohit | `feature/catalog-offers` | Movies, Cinemas, Offers |
| Rohit Kumar | `feature/checkout-payment` | Checkout, Payment, Success, Login |

`style.css` is owned solely by Sandesh — everyone else adds a new, clearly named
class rather than inline styles.

## Workflow

`main` → `dev` → your feature branch. Work on your branch, open a PR into `dev`,
get it reviewed, and merge. Once everything is verified together on `dev`, one final
PR merges `dev` into `main`.

```bash
git switch dev && git pull origin dev
git switch feature/<your-branch> && git merge dev
# ...make changes...
git add . && git commit -m "message" && git push origin feature/<your-branch>
```

Open a Pull Request with base `dev`, compare your branch. Never push to `main` directly.

## Run Locally

No build step required — open any `.html` file directly in a browser, or use VS
Code's Live Server for auto-reload while editing.

## Notes

This is a front-end-only demo: prices, totals, and the booking ID are static example
values, and the "Pay Now" and seat-selection interactivity are achieved purely with
CSS (`:checked`, `:has()`), not JavaScript.
