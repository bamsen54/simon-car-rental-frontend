async function renderBookingReceipt() {
    const container = document.getElementById('booking-receipt-container');
    if (!container) return;
    
    try {
        const bookings = await fetchMyBookings();
        if (!bookings || bookings.length === 0) {
            container.innerHTML = '<div class="message message-warning">No bookings found</div>';
            return;
        }
        
        const booking = bookings[bookings.length - 1]; // Senaste bokningen
        const car = await fetchCarWithId(booking.carId);
        
        container.innerHTML = `
            <div class="panel-positive" style="max-width: 500px; margin: 2rem auto; text-align: center;">
                <h2 style="color: white;">✅ Booking Confirmed!</h2>
                <p style="color: white;"><strong>Car:</strong> ${car.name} ${car.model}</p>
                <p style="color: white;"><strong>From:</strong> ${booking.fromDate}</p>
                <p style="color: white;"><strong>To:</strong> ${booking.toDate}</p>
                <button id="receipt-ok" class="btn-functional" style="margin-top: 1rem;">OK</button>
            </div>
        `;
        
        document.getElementById('receipt-ok').addEventListener('click', () => {
            window.location.hash = '#cars';
        });
    } catch (error) {
        container.innerHTML = `<div class="message message-warning">Could not load booking details</div>`;
    }
}