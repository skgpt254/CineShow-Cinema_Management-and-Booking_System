# CineShow - Movie Ticket Booking and Cinema Management System

Repository: https://github.com/skgpt254/CineShow-Cinema_Management-and-Booking_System

---

## 3. Task Split

| Member | Branch | Files to edit | What they own |
|---|---|---|---|
| **Sandesh** (Team Lead) | `Member4_Sandesh` | `index.html`, `admin.html`, `css/style.css`, `images/` | Home page, Admin dashboard, the shared theme, and all image assets |
| **Ravi Kumar** | `Member1_Ravi` | `cinema-details.html`, `movie-details.html`, `booking.html`, `seats.html` | Cinema Details pages, Movie Details page, the booking/showtime selection page, and Seat Selection (including the checkbox trick) |
| **Rohit** | `Member2_Rohit` | `movies.html`, `cinemas.html`, `offers.html` | Movies listing (with filters), Cinemas and Offers page |
| **Rohit Kumar** | `Member3_RohitKumar` | `checkout.html`, `payment.html`, `success.html`, `login.html` | Checkout, Payment, the success/e-ticket page, and Login |

**On `css/style.css`:** this file holds the whole design system (CSS custom
properties, card styles, the seat/payment CSS tricks), so only Sandesh should edit it
directly. If your page needs one more style rule, add it at the bottom under a
comment with your name and let Sandesh know, so it doesn't get overwritten.

---

## 4. Git Workflow

Same structure as before: `main` is the final version, `dev` is where everyone's work
gets combined and tested, and each person has their own branch.

```
main
  |
  └── dev
       ├── Member1_Ravi
       ├── Member2_Rohit
       ├── Member3_RohitKumar
       └── Member4_Sandesh
```

### Sandesh - push this version and (re)create `dev`

```bash
git switch main
git pull origin main
```

Copy every file from this project into the repo folder, replacing what's there now,
then:

```bash
git add .
git commit -m "Rebuild with fixed images, original movie titles, and clickable seats"
git push origin main

git switch dev
git pull origin dev
git merge main
git push origin dev
```

(If `dev` does not exist yet, use `git switch -c dev` followed by
`git push -u origin dev` instead of the two lines above.)

### Everyone else - bring the new code into your branch

```bash
git switch Member1_Ravi
git pull origin dev
```

(swap in your own branch name for the other three people)

If Git reports a conflict, open the file, keep the correct version, then:

```bash
git add .
git commit -m "Merge latest dev into my branch"
git push origin Member1_Ravi
```

### Normal day-to-day work after that

```bash
# before starting work
git switch dev
git pull origin dev
git switch Member1_Ravi
git merge dev

# do your work, then
git add .
git commit -m "Describe what you changed"
git push origin Member1_Ravi
```

Then open a Pull Request on GitHub with **base = `dev`**, **compare = your branch**.
Get a teammate to look at it before merging. Once everyone's work is in `dev` and the
whole site has been clicked through together, Sandesh opens one final Pull Request
from `dev` into `main`.

**Golden rule:** your branch → Pull Request → `dev` → test everything together →
Pull Request → `main`. Nobody pushes to `main` directly except for today's setup.

---

## 5. How to View the Site

No build step, no server required:

- **Directly:** double-click any `.html` file to open it in a browser.
- **With Live Server:** also works, if you want auto-refresh while editing.

---

## 6. File Structure

```
index.html            - Home page (hero, genres, now showing, deals, cinemas, why CineShow)
movies.html            - Movie catalog with language/genre/format filters
movie-details.html     - Full movie page: synopsis, cast, trailer placeholder, reviews
cinemas.html           - Directory of CineShow cinema locations
cinema-details.html    - One cinema's showtimes by movie
offers.html            - Discount and coupon cards
booking.html           - Movie / cinema / date / showtime selection
seats.html             - Seat map (clickable, see Section 2)
checkout.html          - Booking summary and snack add-ons
payment.html           - Payment method selection and demo payment form
success.html           - Confirmed e-ticket page
login.html             - Sign in / sign up screen (UI only)
admin.html             - Cinema staff dashboard
css/style.css          - The one shared stylesheet, including the CSS-only interactivity
images/                - All poster and cinema artwork (SVG placeholders, no external links)
```
