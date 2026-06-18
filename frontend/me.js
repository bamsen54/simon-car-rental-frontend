async function renderMe() {
    const container = document.getElementById('me-container');
    if (!container) return;
    
    try {
        const user = await fetchMe();
        
        let bookings;
        if (isAdmin()) {
            const allBookings = await fetchAllBookings();
            bookings = allBookings.filter(b => b.userId === user.id);
        } else {
            bookings = await fetchMyBookings();
        }
        
        const activeBookings = bookings.filter(b => b.active === true);
        const historicalBookings = bookings.filter(b => b.active === false);
        
        let html = `
            <h2 style="color: var(--highlight); text-align: center; margin-bottom: 2rem;">My Profile</h2>
            
            <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; max-width: 700px; margin-left: auto; margin-right: auto;">
                <h3 style="margin-top: 0; margin-bottom: 1rem;">Contact Information</h3>
                <form id="profile-form">
                    <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Username</label>
                    <input type="text" class="input-field" value="${user.username}" disabled style="opacity: 0.6; margin-bottom: 1rem;">
                    
                    <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">First Name</label>
                    <input type="text" id="first-name" class="input-field" value="${user.firstName || ''}" required style="margin-bottom: 1rem;">
                    
                    <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Last Name</label>
                    <input type="text" id="last-name" class="input-field" value="${user.lastName || ''}" required style="margin-bottom: 1rem;">
                    
                    <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Email</label>
                    <input type="email" id="email" class="input-field" value="${user.email || ''}" required style="margin-bottom: 1rem;">
                    
                    <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Phone</label>
                    <input type="tel" id="phone" class="input-field" value="${user.phone || ''}" style="margin-bottom: 1rem;">
                    
                    <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">New Password (leave blank to keep current)</label>
                    <input type="password" id="new-password" class="input-field" placeholder="Enter new password" style="margin-bottom: 1rem;">
                    
                    <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Confirm Password</label>
                    <input type="password" id="confirm-password" class="input-field" placeholder="Confirm new password" style="margin-bottom: 1rem;">
                    
                    <button type="submit" class="btn-positive" style="width: 100%;">Update Profile</button>
                </form>
                <div id="profile-message" style="margin-top: 1rem; text-align: center;"></div>
            </div>
            
            <h3 style="color: var(--highlight); text-align: center; margin-top: 3rem; margin-bottom: 1.5rem;">Current Bookings</h3>
        `;
        
        if (activeBookings.length === 0) {
            html += `<div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; max-width: 700px; margin-left: auto; margin-right: auto; text-align: center; color: var(--text-gray);">No active bookings.</div>`;
        } else {
            for (const booking of activeBookings) {
                const car = await fetchCarWithId(booking.carId);
                const imagePath = getCarImagePath(car);
                html += `
                    <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 700px; margin-left: auto; margin-right: auto;">
                        <img src="${imagePath}" onerror="this.src='img/placeholder.jpg'" style="width: 80px; height: 80px; object-fit: cover;">
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
            <h3 style="color: var(--highlight); text-align: center; margin-top: 3rem; margin-bottom: 1.5rem;">Historical Bookings</h3>
        `;
        
        if (historicalBookings.length === 0) {
            html += `<div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; max-width: 700px; margin-left: auto; margin-right: auto; text-align: center; color: var(--text-gray);">No historical bookings.</div>`;
        } else {
            for (const booking of historicalBookings) {
                const car = await fetchCarWithId(booking.carId);
                const imagePath = getCarImagePath(car);
                html += `
                    <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 700px; margin-left: auto; margin-right: auto;">
                        <img src="${imagePath}" onerror="this.src='img/placeholder.jpg'" style="width: 80px; height: 80px; object-fit: cover;">
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
            
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const msgDiv = document.getElementById('profile-message');
            
            if (newPassword && newPassword !== confirmPassword) {
                msgDiv.innerHTML = '<span style="color: var(--warning);">Passwords do not match</span>';
                return;
            }
            
            msgDiv.innerHTML = '<div class="spinner" style="margin: 1rem auto;"></div>';
            
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
                msgDiv.innerHTML = '<span style="color: var(--positive);">Profile updated successfully!</span>';
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } catch (error) {
                msgDiv.innerHTML = `<span style="color: var(--warning);">${error.message}</span>`;
            }
        });
        
    } catch (error) {
        console.log(error.message);
    }
}