# CineShow - Movie Ticket Booking and Cinema Management System

This is the updated, redesigned version of the project. Below you will find two things:
1. How the work is split between the four team members.
2. Step by step instructions for working on your own branch and pushing it to GitHub.

---

## 1. Task Split

Each member should only work inside their own branch, and only touch the files listed
for them. This keeps everyone's work separate and avoids merge conflicts.

| Member | Branch name | Files to edit | What to build |
|---|---|---|---|
| **Sandesh** (Leader) | `sandesh-admin-cinemas` | `admin.html`, `admin.js`, `cinemas.html`, `cinemas.js`, `cinemas.json`, `movies.json`, `style.css` | Admin page, Cinemas page, the overall theme, and the JSON data files. Also responsible for reviewing and merging everyone's pull requests. |
| **Ravi Kumar** | `ravi-home-movies` | `index.html`, `home.js`, `movies.html`, `movies.js` | Home page (with the city selection popup) and the Browse Movies page (with the genre filter). |
| **Rohit** | `rohit-details-seats` | `movie-details.html`, `details.js`, `book-seats.html`, `seats.js` | Movie Details page and the Seat Selection page. |
| **Rohit Kumar** | `rohitkumar-checkout-confirm` | `checkout.html`, `checkout.js`, `confirmation.html`, `confirmation.js` | Checkout page and the Booking Confirmation page. |

**Note on `style.css`:** only Sandesh should edit this file, since the theme is already set up.
If you need a new style for your own page, add it at the very bottom of `style.css` under a
comment with your name, for example:

```css
/* ---- Extra styles for Ravi's Movies page ---- */
```

This keeps everyone's additions easy to find and reduces the chance of two people editing
the same lines at the same time.

---

## 2. Git Workflow (Step by Step)

Everyone except Sandesh should follow these steps.

### One-time setup

```bash
git clone https://github.com/skgpt254/CineShow-Cinema_Management-and-Booking_System.git
cd CineShow-Cinema_Management-and-Booking_System
```

### Before you start working, every time

```bash
git checkout main
git pull origin main
```

This makes sure you have the latest code that Sandesh or anyone else has already merged.

### Create your branch (only the first time)

```bash
git checkout -b your-branch-name
```

For example, Ravi would run:
```bash
git checkout -b ravi-home-movies
```

### Do your work, then save it

Edit only the files assigned to you, then run:

```bash
git add .
git commit -m "Built the home and movies pages"
git push origin your-branch-name
```

If it is your first time pushing that branch, use this instead:
```bash
git push -u origin your-branch-name
```

### Open a Pull Request (PR) on GitHub

1. Open the repository on GitHub.
2. You should see a banner saying "Compare & pull request" - click it.
3. Make sure the base branch is `main` and the compare branch is your branch.
4. Click "Create pull request".
5. Let Sandesh know your PR is ready.

### Sandesh's job (as leader)

1. Go to the "Pull requests" tab on GitHub.
2. Open each PR and check the changed files.
3. If everything looks fine, click "Merge pull request".
4. If GitHub shows a conflict (two people edited the same lines), sort it out together, or ask
   for help figuring it out.

### After a merge, everyone should update again

Once Sandesh merges someone's PR into `main`, everyone else should update their own copy:

```bash
git checkout main
git pull origin main
```

Doing this regularly keeps your branch close to `main` and avoids big conflicts later.

---

## 3. How to Test the Site Locally

This site loads its data from JSON files (`movies.json`, `cinemas.json`) using JavaScript's
`fetch()`. If you simply double-click `index.html` and open it directly in the browser, the
movie list may appear blank. This is a browser security rule about loading local files, not a
bug in the code.

To test it properly, use one of these two options:

**Option A (VS Code):** Install the "Live Server" extension, then right-click `index.html`
and choose "Open with Live Server".

**Option B (Terminal):** From inside the project folder, run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## 4. What's New in This Version

- **Real poster images** for every movie, loaded from `movies.json`.
- **A city selection popup**, shown the first time someone visits, similar to how BookMyShow
  or a PVR app asks for your city. The chosen city is remembered (using `localStorage`), and
  the Home and Movies pages only show movies playing in that city. A "Change City" button in
  the city bar lets you pick a different one at any time.
- **A working genre filter** on the Movies page (click a genre chip to filter the list).
- **Clickable seats** on the Seat Selection page. Clicking a seat selects or unselects it, and
  the seat count and total price update immediately.
- **A working Checkout page.** The seats you actually picked, and their real total, carry over
  from the Seat Selection page. Adding snacks updates the total, and applying a promo code
  gives a working 10% discount.
- **A real Confirmation page.** It shows the seats and total you actually chose, along with a
  freshly generated booking ID.
- **A working search box** on the Admin page, to filter the movie list by title.
- **Cinemas page** buttons ("View Movies Here") that switch to that cinema's city and jump
  straight to the filtered Movies page.

There is still no real backend or database, exactly as discussed with our mentor. All of this
data lives in `movies.json` and `cinemas.json`, and the seat/checkout numbers are carried
between pages using the browser's own `localStorage`, not a server. This keeps the project at
the HTML, CSS, and basic JavaScript level we have actually studied so far.

---

## 5. File Structure

```
index.html          - Home page (city popup + "Now Showing")
movies.html          - Browse all movies (city + genre filters)
movie-details.html   - One movie's details (reads ?id= from the link, looks it up in movies.json)
book-seats.html      - Seat selection (click to select seats)
checkout.html        - Checkout page (snacks, payment method, promo code)
confirmation.html    - Booking confirmed page
cinemas.html         - List of cinemas (cinemas.json)
admin.html           - Cinema management / admin page (with movie search)
style.css            - One shared stylesheet used by every page
movies.json          - Movie data (acts as our "database")
cinemas.json         - Cinema data
home.js / movies.js / details.js / seats.js / checkout.js / confirmation.js / cinemas.js / admin.js
                     - each page has its own small JavaScript file
```
