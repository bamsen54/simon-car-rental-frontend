let adminBookingsTableView = false;

async function renderAdminBookings() {
    const container = document.getElementById('admin-bookings-container');
    if (!container) {
        return;
    }
    
    try {
        const bookings = await fetchAllBookings();
        const users = await fetchAllUsers();
        const cars = await fetchCars();
        
        const userMap = {};
        users.forEach(u => {
            userMap[u.id] = u.username;
        });
        
        const carMap = {};
        cars.forEach(c => carMap[c.id] = c);
        
        if (bookings.length === 0) {
            container.innerHTML = '<div class="panel-neutral" style="max-width: 600px; margin: 2rem auto; text-align: center; color: var(--text-gray);">No bookings found.</div>';
            return;
        }
        
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="color: var(--highlight);">Admin - All Bookings</h2>
                <button id="toggle-admin-bookings" class="btn-function">
                    ${adminBookingsTableView ? 'Switch to Card View' : 'Switch to Table View'}
                </button>
            </div>
        `;
        
        if (adminBookingsTableView) {
            html += `
                <table class="cars-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>User</th>
                            <th>Car ID</th>
                            <th>Car</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(booking => {
                            const car = carMap[booking.carId];
                            const username = userMap[booking.userId] || `User ${booking.userId}`;
                            const imagePath = car ? getCarImagePath(car) : 'img/placeholder.png';
                            const isActive = booking.active === true;
                            return `
                                <tr>
                                    <td><img src="${imagePath}" onerror="this.src='img/placeholder.png'" style="width: 50px; height: 50px; object-fit: cover;"></td>
                                    <td>${username}</td>
                                    <td>${car ? car.id : 'Unknown'}</td>
                                    <td>${car ? car.name + ' ' + car.model : 'Unknown'}</td>
                                    <td>${booking.fromDate}</td>
                                    <td>${booking.toDate}</td>
                                    <td style="color: ${isActive ? 'var(--positive)' : 'var(--text-gray)'};">${isActive ? 'Active' : 'Inactive'}</td>
                                    <td>
                                        ${isActive ? `
                                            <button class="btn-function edit-booking" data-id="${booking.id}" data-from="${booking.fromDate}" data-to="${booking.toDate}" data-car="${booking.carId}" style="font-size: 0.7rem; padding: 4px 8px;">Edit</button>
                                            <button class="btn-positive return-booking" data-id="${booking.id}" style="font-size: 0.7rem; padding: 4px 8px;">Return</button>
                                            <button class="btn-negative delete-booking" data-id="${booking.id}" data-car="${booking.carId}" style="font-size: 0.7rem; padding: 4px 8px;">Delete</button>
                                        ` : `
                                            <button class="btn-negative delete-booking" data-id="${booking.id}" data-car="${booking.carId}" style="font-size: 0.7rem; padding: 4px 8px;">Delete</button>
                                        `}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }
        else {
            html += `<div id="admin-bookings-list">`;
            for (const booking of bookings) {
                const car = carMap[booking.carId];
                const username = userMap[booking.userId] || `User ${booking.userId}`;
                const imagePath = car ? getCarImagePath(car) : 'img/placeholder.png';
                const isActive = booking.active === true;
                
                html += `
                    <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 700px; margin-left: auto; margin-right: auto;">
                        <img src="${imagePath}" onerror="this.src='img/placeholder.png'" style="width: 80px; height: 80px; object-fit: cover;">
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${car ? car.name + ' ' + car.model : 'Unknown Car'}</h3>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Car ID:</strong> ${car ? car.id : 'Unknown'}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>User:</strong> ${username}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Period:</strong> ${booking.fromDate} – ${booking.toDate}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem; color: ${isActive ? 'var(--positive)' : 'var(--text-gray)'};">
                                <strong>Status:</strong> ${isActive ? 'Active' : 'Inactive'}
                            </p>
                            ${isActive ? `
                                <button class="btn-function edit-booking" data-id="${booking.id}" data-from="${booking.fromDate}" data-to="${booking.toDate}" data-car="${booking.carId}" style="font-size: 0.8rem; margin-top: 0.5rem;">Edit</button>
                            ` : ''}
                        </div>
                        ${isActive ? `
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <button class="btn-positive return-booking" data-id="${booking.id}" style="font-size: 0.8rem;">Return</button>
                                <button class="btn-negative delete-booking" data-id="${booking.id}" data-car="${booking.carId}" style="font-size: 0.8rem;">Delete</button>
                            </div>
                        ` : `
                            <button class="btn-negative delete-booking" data-id="${booking.id}" data-car="${booking.carId}" style="font-size: 0.8rem;">Delete</button>
                        `}
                    </div>
                `;
            }
            html += `</div>`;
        }
        
        container.innerHTML = html;
        
        document.getElementById('toggle-admin-bookings').addEventListener('click', () => {
            adminBookingsTableView = !adminBookingsTableView;
            renderAdminBookings();
        });
        
        document.querySelectorAll('.edit-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookingId = e.target.dataset.id;
                const fromDate = e.target.dataset.from;
                const toDate = e.target.dataset.to;
                const carId = e.target.dataset.car;
                showEditBookingForm(bookingId, fromDate, toDate, carId);
            });
        });
        
        document.querySelectorAll('.return-booking').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const bookingId = e.target.dataset.id;
                try {
                    await returnCar(bookingId);
                    renderAdminBookings();
                }
                catch (error) {
                    console.error(error.message);
                }
            });
        });
        
        document.querySelectorAll('.delete-booking').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const bookingId = e.target.dataset.id;
                const carId = e.target.dataset.car;
                try {
                    await deleteBooking(bookingId, carId);
                    renderAdminBookings();
                }
                catch (error) {
                    console.error(error.message);
                }
            });
        });
    }
    catch (error) {
        container.innerHTML = `<div class="panel-neutral" style="max-width: 600px; margin: 2rem auto; text-align: center; color: var(--highlight);">${error.message}</div>`;
    }
}

function showEditBookingForm(bookingId, currentFrom, currentTo, currentCarId) {
    const container = document.getElementById('admin-bookings-container');
    if (!container) {
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    fetchCars().then(cars => {
        const availableCars = cars.filter(c => c.id == currentCarId || !c.booked);
        const carOptions = availableCars.map(car => `
            <option value="${car.id}" ${car.id == currentCarId ? 'selected' : ''}>
                ${car.name} ${car.model}
            </option>
        `).join('');
        
        const formHtml = `
            <form class="demo-form" id="edit-booking-form">
                <h2 class="section-heading">Edit Booking</h2>
                
                <label>Car</label>
                <select id="edit-car-id" class="select-field">
                    ${carOptions}
                </select>
                
                <label>From Date</label>
                <input type="date" id="edit-from-date" class="input-field" value="${currentFrom}" min="${today}" required>
                
                <label>To Date</label>
                <input type="date" id="edit-to-date" class="input-field" value="${currentTo}" min="${today}" required>
                
                <div class="btn-row">
                    <button type="submit" class="btn-positive">Save</button>
                    <button type="button" id="cancel-edit" class="btn-negative">Cancel</button>
                </div>
            </form>
            <div id="edit-message" style="display: block; max-width: 400px; margin: 1rem auto; text-align: center;"></div>
        `;
        
        container.innerHTML = formHtml;
        
        document.getElementById('edit-booking-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const carId = document.getElementById('edit-car-id').value;
            const fromDate = document.getElementById('edit-from-date').value;
            const toDate = document.getElementById('edit-to-date').value;
            const msgDiv = document.getElementById('edit-message');
            
            if (!fromDate || !toDate || !carId) {
                msgDiv.innerHTML = '<div class="message message-warning">Please fill in all fields</div>';
                return;
            }
            
            if (toDate < fromDate) {
                msgDiv.innerHTML = '<div class="message message-warning">To date must be after from date</div>';
                return;
            }
            
            msgDiv.innerHTML = '<div class="spinner"></div>';
            
            try {
                await updateBooking(bookingId, { carId, fromDate, toDate });
                msgDiv.innerHTML = '<div class="message message-success">Booking updated successfully!</div>';
                setTimeout(() => {
                    renderAdminBookings();
                    renderCars(carsSortBy, carsSortOrder);
                }, 1000);
            }
            catch (error) {
                msgDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
            }
        });
        
        document.getElementById('cancel-edit').addEventListener('click', () => {
            renderAdminBookings();
        });
    }).catch(error => {
        container.innerHTML = `<div class="panel-neutral" style="max-width: 600px; margin: 2rem auto; text-align: center; color: var(--highlight);">Failed to load cars: ${error.message}</div>`;
    });
}