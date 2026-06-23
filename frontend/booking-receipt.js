async function renderBookingReceipt(carId, fromDate, toDate) {
    const container = document.getElementById('booking-receipt-container');
    if (!container) {
        return;
    }

    try {
        const car = await fetchCarWithId(carId);

        container.innerHTML = `
            <div class="panel-positive" style="max-width: 500px; margin: 2rem auto; text-align: center;">
                <h2 style="color: white;">✅ Booking Confirmed!</h2>
                <p style="color: white;"><strong>Car:</strong> ${car.name} ${car.model}</p>
                <p style="color: white;"><strong>From:</strong> ${fromDate}</p>
                <p style="color: white;"><strong>To:</strong> ${toDate}</p>
                <button id="receipt-ok" class="btn-standard" style="margin-top: 1rem;">OK</button>
            </div>
        `;

        document.getElementById('receipt-ok').addEventListener('click', () => {
            window.location.hash = '#cars';
        });
    }
    catch (error) {
        container.innerHTML = '<div class="message message-warning">Could not load car details</div>';
    }
}