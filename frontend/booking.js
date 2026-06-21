async function renderBooking(carId) {
    const today = new Date().toISOString().split('T')[0];
    const car = await fetchCarWithId(carId);
    const imagePath = getCarImagePath(car);
    
    let html = `
        <h2 style="color: var(--highlight);">Booking</h2>
        <div class="panel-neutral" style="max-width: 500px; margin: 2rem auto;">
            <h3 style="text-align: center;">${car.name} ${car.model}</h3>
            <img class="booking-car-image" src="${imagePath}" onerror="this.src='img/placeholder.png'" style="object-fit: cover;">
            <form id="booking-form">
                <label>From Date:</label>
                <input type="date" id="from-date" value="${today}" readonly disabled>
                <label>To Date:</label>
                <input type="date" id="to-date" min="${today}" required>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button type="submit" class="btn-positive">Confirm Booking</button>
                    <button type="button" id="cancel-booking" class="btn-negative">Cancel</button>
                </div>
            </form>
            <div id="booking-message"></div>
        </div>
    `;
    
    const container = document.getElementById('booking-container');
    container.innerHTML = html;
    
    document.getElementById('cancel-booking').addEventListener('click', () => {
        window.location.hash = '#cars';
    });
    
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fromDate = document.getElementById('from-date').value;
        const toDate = document.getElementById('to-date').value;
        const msgDiv = document.getElementById('booking-message');
        
        if (!toDate) {
            msgDiv.innerHTML = '<div class="message message-warning">Please select a return date</div>';
            return;
        }
        
        msgDiv.innerHTML = '<div class="spinner"></div>';
        
        try {
            await createBooking(carId, fromDate, toDate);
            window.location.hash = `#booking-receipt?carId=${carId}&from=${fromDate}&to=${toDate}`;
        } catch (error) {
            msgDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
        }
    });
}

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
    } catch (error) {
        container.innerHTML = '<div class="message message-warning">Could not load car details</div>';
    }
}