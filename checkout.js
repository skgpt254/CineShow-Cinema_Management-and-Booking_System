/* CineShow - Checkout logic
   Member: Rohit Kumar

   Reads the pending booking that the Seat Selection page (seats.js) stores in
   sessionStorage under the key "cineshowBooking". Expected JSON shape:

   {
     movie:  { title, poster?, genre?, rating?, duration? },
     cinema: { name, location?, screen? },
     date:   "20 September 2026",
     time:   "7:30 PM",
     seats:  ["A5", "A6"],
     ticketPrice: 250  // optional, defaults to 250
   }

   For resilience "movie" and "cinema" may also simply be strings
   (interpreted as title / name).

   After the booking is confirmed, the finalized booking is stored in
   sessionStorage under "cineshowConfirmedBooking" for the Confirmation page
   (confirmation.js):

   {
     bookingId,
     movie, cinema, date, time, seats,
     ticketCount, ticketPrice, subtotal, convenienceFee, total,
     customer: { name, email, mobile },
     paymentMethod, confirmedAt
   }
*/

(function () {
    "use strict";

    const PENDING_KEY = "cineshowBooking";
    const CONFIRMED_KEY = "cineshowConfirmedBooking";
    const DEFAULT_TICKET_PRICE = 250;
    const CONVENIENCE_FEE = 40;

    let currentBooking = null;

    function $(id) {
        return document.getElementById(id);
    }

    function formatCurrency(amount) {
        return "\u20B9" + Number(amount).toLocaleString("en-IN");
    }

    function readSession(key) {
        try {
            return sessionStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function writeSession(key, value) {
        try {
            sessionStorage.setItem(key, value);
        } catch (e) {
            /* sessionStorage unavailable - ignore */
        }
    }

    function removeSession(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            /* ignore */
        }
    }

    /* ---- Booking loading ---- */

    function normalizeBooking(data) {
        let movie = data.movie;
        let cinema = data.cinema;

        if (typeof movie === "string") {
            movie = { title: movie };
        }
        if (typeof cinema === "string") {
            cinema = { name: cinema };
        }
        movie = movie || {};
        cinema = cinema || {};

        if (
            !movie.title ||
            !cinema.name ||
            !data.date ||
            !data.time ||
            !Array.isArray(data.seats) ||
            data.seats.length === 0
        ) {
            return null;
        }

        return {
            movie: movie,
            cinema: cinema,
            date: data.date,
            time: data.time,
            seats: data.seats,
            ticketPrice: data.ticketPrice
        };
    }

    function loadBookingData() {
        const raw = readSession(PENDING_KEY);
        if (!raw) {
            return null;
        }
        try {
            const data = JSON.parse(raw);
            if (!data || typeof data !== "object") {
                return null;
            }
            return normalizeBooking(data);
        } catch (e) {
            return null;
        }
    }

    /* TEST-ONLY: lets the checkout page be tested before Seat Selection
       (seats.js) is finished. Open checkout.html?mock=1 to inject a sample
       booking. Remove this when seats.js writes real booking data. */
    function mockBookingFromUrl() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has("mock")) {
            return null;
        }
        return {
            movie: {
                title: "Interstellar",
                poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=500&q=80",
                genre: "Sci-Fi, Adventure",
                rating: "8.7/10",
                duration: "2h 49m"
            },
            cinema: {
                name: "CineShow Mathura",
                location: "Mall Road, Mathura",
                screen: "Screen 2"
            },
            date: "20 September 2026",
            time: "7:30 PM",
            seats: ["A5", "A6"],
            ticketPrice: DEFAULT_TICKET_PRICE
        };
    }

    /* ---- Pricing ---- */

    function calculateTotal(booking) {
        const ticketPrice =
            Number(booking.ticketPrice) > 0
                ? Number(booking.ticketPrice)
                : DEFAULT_TICKET_PRICE;
        const ticketCount = booking.seats.length;
        const subtotal = ticketPrice * ticketCount;
        const convenienceFee = CONVENIENCE_FEE;
        const total = subtotal + convenienceFee;

        return {
            ticketPrice: ticketPrice,
            ticketCount: ticketCount,
            subtotal: subtotal,
            convenienceFee: convenienceFee,
            total: total
        };
    }

    /* ---- Rendering ---- */

    function populateSummary(booking) {
        const prices = calculateTotal(booking);
        const movie = booking.movie;
        const cinema = booking.cinema;

        const poster = $("checkoutPoster");
        if (movie.poster) {
            poster.src = movie.poster;
            poster.alt = movie.title + " poster";
            poster.hidden = false;
        } else {
            poster.hidden = true;
        }

        $("checkoutMovieTitle").textContent = movie.title;

        const metaParts = [];
        if (movie.genre) {
            metaParts.push(movie.genre);
        }
        if (movie.rating) {
            metaParts.push("Rating " + movie.rating);
        }
        const metaEl = $("checkoutMovieMeta");
        if (metaParts.length) {
            metaEl.textContent = metaParts.join(" \u2022 ");
            metaEl.hidden = false;
        } else {
            metaEl.hidden = true;
        }

        const durationEl = $("checkoutMovieDuration");
        if (movie.duration) {
            durationEl.textContent = "Duration: " + movie.duration;
            durationEl.hidden = false;
        } else {
            durationEl.hidden = true;
        }

        $("checkoutCinema").textContent = cinema.name;
        $("checkoutScreen").textContent = cinema.screen || "\u2014";
        $("checkoutDate").textContent = booking.date;
        $("checkoutTime").textContent = booking.time;

        const seatWrap = $("checkoutSeats");
        seatWrap.innerHTML = "";
        booking.seats.forEach(function (seat) {
            const chip = document.createElement("span");
            chip.className = "seat-chip";
            chip.textContent = seat;
            seatWrap.appendChild(chip);
        });

        $("checkoutTicketNote").textContent =
            prices.ticketCount + (prices.ticketCount === 1 ? " ticket" : " tickets");

        $("lblTicketPrice").textContent = formatCurrency(prices.ticketPrice);
        $("lblTicketCount").textContent = prices.ticketCount;
        $("lblSubtotal").textContent = formatCurrency(prices.subtotal);
        $("lblFee").textContent = formatCurrency(prices.convenienceFee);
        $("lblTotal").textContent = formatCurrency(prices.total);
    }

    function showMissingBooking() {
        $("checkoutForm").hidden = true;
        $("noBooking").hidden = false;
    }

    /* ---- Validation ---- */

    function setGroupError(group, message) {
        group.classList.add("invalid");
        let error = group.querySelector(".field-error");
        if (!error) {
            error = document.createElement("p");
            error.className = "field-error";
            group.appendChild(error);
        }
        error.textContent = message;
        error.classList.add("visible");
    }

    function clearGroupError(group) {
        group.classList.remove("invalid");
        const error = group.querySelector(".field-error");
        if (error) {
            error.classList.remove("visible");
        }
    }

    function validateText(field, test, message) {
        const group = field.closest(".form-group");
        if (!test(field.value.trim())) {
            setGroupError(group, message);
            return field;
        }
        return null;
    }

    function validatePayment(selectedMethod) {
        if (selectedMethod === "upi") {
            const upi = $("payUpiId");
            return validateText(upi, function (v) {
                return v.length > 0 && /^\S+@\S+$/.test(v);
            }, "Enter a valid UPI ID (e.g. name@upi).");
        }

        if (selectedMethod === "card") {
            const card = $("payCardNumber");
            const expiry = $("payCardExpiry");
            const cvv = $("payCardCvv");

            const errors = [
                validateText(card, function (v) {
                    return /^\d{16}$/.test(v.replace(/\s/g, ""));
                }, "Enter the 16-digit card number."),
                validateText(expiry, function (v) {
                    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim());
                }, "Use MM/YY format."),
                validateText(cvv, function (v) {
                    return /^\d{3,4}$/.test(v.trim());
                }, "Enter a 3 or 4 digit CVV.")
            ];

            for (let i = 0; i < errors.length; i++) {
                if (errors[i]) {
                    return errors[i];
                }
            }
            return null;
        }

        if (selectedMethod === "netbanking") {
            return validateText($("payBank"), function (v) {
                return v.length > 0;
            }, "Please choose a bank.");
        }

        return null;
    }

    function selectedPaymentMethod() {
        const checked = document.querySelector('input[name="payMethod"]:checked');
        return checked ? checked.value : "";
    }

    function validateForm() {
        const errors = [
            validateText($("payName"), function (v) {
                return v.length > 0;
            }, "Please enter your full name."),
            validateText($("payEmail"), function (v) {
                return v.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            }, "Please enter a valid email address."),
            validateText($("payMobile"), function (v) {
                return /^\d{10}$/.test(v);
            }, "Please enter a valid 10-digit mobile number."),
            validatePayment(selectedPaymentMethod())
        ];

        for (let i = 0; i < errors.length; i++) {
            if (errors[i]) {
                return errors[i];
            }
        }
        return null;
    }

    /* ---- Booking confirmation ---- */

    function generateBookingId() {
        return "CS" + Math.floor(100000 + Math.random() * 900000);
    }

    function confirmBooking() {
        const prices = calculateTotal(currentBooking);
        const method = selectedPaymentMethod();

        const booking = {
            bookingId: generateBookingId(),
            movie: currentBooking.movie,
            cinema: currentBooking.cinema,
            date: currentBooking.date,
            time: currentBooking.time,
            seats: currentBooking.seats,
            ticketCount: prices.ticketCount,
            ticketPrice: prices.ticketPrice,
            subtotal: prices.subtotal,
            convenienceFee: prices.convenienceFee,
            total: prices.total,
            customer: {
                name: $("payName").value.trim(),
                email: $("payEmail").value.trim(),
                mobile: $("payMobile").value.trim()
            },
            paymentMethod: method,
            confirmedAt: new Date().toISOString()
        };

        writeSession(CONFIRMED_KEY, JSON.stringify(booking));
        removeSession(PENDING_KEY);

        const button = $("confirmBtn");
        button.disabled = true;
        button.textContent = "Processing\u2026";

        window.location.href = "confirmation.html";
    }

    function onSubmit(event) {
        event.preventDefault();
        if (!currentBooking) {
            return;
        }

        const firstError = validateForm();
        if (firstError) {
            firstError.focus();
            return;
        }

        confirmBooking();
    }

    /* ---- Events ---- */

    function clearErrorsOnInput(event) {
        const group = event.target.closest(".form-group");
        if (group) {
            clearGroupError(group);
        }
    }

    function clearPanelErrors() {
        const panels = document.querySelectorAll(".pay-panel .form-group");
        for (let i = 0; i < panels.length; i++) {
            clearGroupError(panels[i]);
        }
    }

    function init() {
        currentBooking = loadBookingData() || mockBookingFromUrl();

        if (!currentBooking) {
            showMissingBooking();
            return;
        }

        populateSummary(currentBooking);
        $("checkoutForm").addEventListener("submit", onSubmit);
        document.addEventListener("input", clearErrorsOnInput);

        const radios = document.querySelectorAll('input[name="payMethod"]');
        for (let i = 0; i < radios.length; i++) {
            radios[i].addEventListener("change", clearPanelErrors);
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();