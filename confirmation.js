/* CineShow - Booking Confirmation logic
   Member: Rohit Kumar

   Reads the finalized booking that checkout.js stores in sessionStorage
   under the key "cineshowConfirmedBooking". See checkout.js for the exact
   shape produced after payment confirmation.
*/

(function () {
    "use strict";

    const CONFIRMED_KEY = "cineshowConfirmedBooking";

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
            !data.bookingId ||
            !movie.title ||
            !cinema.name ||
            !data.date ||
            !data.time ||
            !Array.isArray(data.seats) ||
            data.seats.length === 0 ||
            typeof data.total !== "number"
        ) {
            return null;
        }

        return {
            bookingId: data.bookingId,
            movie: movie,
            cinema: cinema,
            date: data.date,
            time: data.time,
            seats: data.seats,
            ticketCount: data.ticketCount,
            total: data.total,
            customer: data.customer
        };
    }

    function loadConfirmedBooking() {
        const raw = readSession(CONFIRMED_KEY);
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

    /* ---- Rendering ---- */

    function displayBooking(booking) {
        const movie = booking.movie;
        const cinema = booking.cinema;
        const ticketCount = booking.ticketCount || booking.seats.length;

        $("confBookingId").textContent = booking.bookingId;

        $("confMovie").textContent = movie.title;

        let cinemaLabel = cinema.name;
        if (cinema.location) {
            cinemaLabel += ", " + cinema.location;
        }
        $("confCinema").textContent = cinemaLabel;

        $("confScreen").textContent = cinema.screen || "\u2014";
        $("confDate").textContent = booking.date;
        $("confTime").textContent = booking.time;

        const seatWrap = $("confSeats");
        seatWrap.innerHTML = "";
        booking.seats.forEach(function (seat) {
            const chip = document.createElement("span");
            chip.className = "seat-chip";
            chip.textContent = seat;
            seatWrap.appendChild(chip);
        });

        $("confTickets").textContent =
            ticketCount + (ticketCount === 1 ? " ticket" : " tickets");

        $("confTotal").textContent = formatCurrency(booking.total);

        const customer = booking.customer;
        if (customer && customer.name) {
            $("confirmGreeting").textContent =
                "Thank you, " + customer.name.trim() + "! Your ticket has been booked.";
        }
        if (customer && customer.email && customer.email.indexOf("@") !== -1) {
            const note = $("confNote");
            note.textContent = "A confirmation has been sent to " + customer.email.trim() + ".";
            note.hidden = false;
        }
    }

    function showMissingBooking() {
        $("confirmCard").hidden = true;
        $("noBooking").hidden = false;
    }

    /* ---- Init ---- */

    function init() {
        const booking = loadConfirmedBooking();

        if (!booking) {
            showMissingBooking();
            return;
        }

        displayBooking(booking);
    }

    document.addEventListener("DOMContentLoaded", init);
})();