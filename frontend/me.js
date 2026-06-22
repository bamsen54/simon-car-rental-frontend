async function renderMe() {
    const container = document.getElementById('me-container');
    if (!container) {
        return;
    }

    try {
        const user = await fetchMe();
        const bookings = await fetchMyBookings();

        const activeBookings = bookings.filter(b => b.active === true);
        const historicalBookings = bookings.filter(b => b.active === false);

        let html = `
            <h2 style="color: var(--highlight);">My Profile</h2>

            <form class="demo-form" id="profile-form">
                <label>Username (cannot be changed)</label>
                <input type="text" class="input-field" value="${user.username}" disabled style="opacity: 0.6;">

                <label>First Name</label>
                <input type="text" id="first-name" class="input-field" value="${user.firstName || ''}" required>

                <label>Last Name</label>
                <input type="text" id="last-name" class="input-field" value="${user.lastName || ''}" required>

                <label>Email</label>
                <input type="email" id="email" class="input-field" value="${user.email || ''}" required>

                <label>Phone</label>
                <input type="tel" id="phone" class="input-field" value="${user.phone || ''}">

                <label>New Password</label>
                <input type="password" id="new-password" class="input-field" placeholder="Leave blank to keep current">

                <label>Confirm Password</label>
                <input type="password" id="confirm-password" class="input-field" placeholder="Confirm new password">

                <button type="submit" class="btn-positive submit-form">Update Profile</button>
            </form>
            <div id="profile-message" style="max-width: 400px; margin: 1rem auto; text-align: center;"></div>

            <h3 style="color: var(--highlight);">Current Bookings</h3>
            <div id="active-bookings">
        `;

        if (activeBookings.length === 0) {
            html += '<p>No active bookings.</p>';
        } else {
            for (const booking of activeBookings) {
                const car = await fetchCarWithId(booking.carId);
                const imagePath = getCarImagePath(car);
                html += `
                    <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 600px; margin-left: auto; margin-right: auto;">
                        <img src="${imagePath}" onerror="this.src='img/placeholder.png'" style="width: 80px; height: 80px; object-fit: cover;">
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${car.name} ${car.model}</h3>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>From:</strong> ${booking.fromDate}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>To:</strong> ${booking.toDate}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem; color: var(--positive);"><strong>Status:</strong> Active</p>
                        </div>
                    </div>
                `;
            }
        }

        html += `
            </div>
            <h3 style="color: var(--highlight);">Historical Bookings</h3>
            <div id="historical-bookings">
        `;

        if (historicalBookings.length === 0) {
            html += '<p>No historical bookings.</p>';
        } else {
            for (const booking of historicalBookings) {
                const car = await fetchCarWithId(booking.carId);
                const imagePath = getCarImagePath(car);
                html += `
                    <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 600px; margin-left: auto; margin-right: auto;">
                        <img src="${imagePath}" onerror="this.src='img/placeholder.png'" style="width: 80px; height: 80px; object-fit: cover;">
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${car.name} ${car.model}</h3>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>From:</strong> ${booking.fromDate}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>To:</strong> ${booking.toDate}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem; color: var(--text-gray);"><strong>Status:</strong> Completed</p>
                        </div>
                    </div>
                `;
            }
        }

        html += `</div>`;
        container.innerHTML = html;

        document.getElementById('profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const msgDiv = document.getElementById('profile-message');

            if (newPassword && newPassword !== confirmPassword) {
                msgDiv.innerHTML = '<div class="message message-warning">Passwords do not match</div>';
                return;
            }

            msgDiv.innerHTML = '<div class="spinner"></div>';

            const updateData = {
                username: user.username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            };

            if (newPassword) {
                updateData.password = newPassword;
            }

            try {
                await updateUser(user.id, updateData);
                msgDiv.innerHTML = '<div class="message message-success">Profile updated successfully!</div>';
                renderMe();

            } 
            
            catch (error) {
                msgDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
            }
        });

    } catch (error) {
        console.log(error.message);
    }
}