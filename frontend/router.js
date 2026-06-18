const routes = {
    "#login": `
        <div class="panel-neutral" style="max-width: 400px; margin: 50px auto;">
            <h2 style="color: var(--highlight);">Login</h2>
            <form class="login-form">
                <label>Username:</label>
                <input type="text" id="username" class="input-field" required>
                <label>Password:</label>
                <input type="password" id="password" class="input-field" required>
                <button type="submit" class="btn-positive">Login</button>
            </form>
            <div id="loginMessage"></div>
        </div>
    `,

"#me": `<div id="me-container"><div class="spinner"></div></div>`,
    "#cars": `<div id="car-container"> </div>`,
    "#booking": `<div id="booking-container"><div class="spinner"></div></div>`,
    "#booking-receipt": `<div id="booking-receipt-container"><div class="spinner"></div></div>`,
    "#bookings": `<h2 style="color: var(--highlight);">Bookings</h2><p>Bookings page - coming soon</p>`, 
    "#admin/cars": `<h2 style="color: var(--highlight);">Admin Cars</h2><p>Admin cars page - coming soon</p>`,
    "#admin/users": `<h2 style="color: var(--highlight);">Admin Users</h2><p>Admin users page - coming soon</p>`,
    "#logout": `
        <div class="panel-neutral" style="max-width: 400px; margin: 50px auto; text-align: center;">
            <h2 style="color: var(--highlight);">Logout</h2>
            <p>Are you sure you want to logout?</p>
            <button id="confirmLogout" class="btn-negative">Logout</button>
            <button id="cancelLogout" class="btn-standard">Cancel</button>
        </div>
    `
};

let carsSortBy = '';
let carsSortOrder = '';

function updateNavigation() {
    const adminMenu = document.getElementById("adminMenu");
    const loginLink = document.querySelector("nav a[href='#login'], nav a[href='#logout']");
    
    if (isLoggedIn()) {
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#logout";
        }
        if (adminMenu) {
            adminMenu.style.display = isAdmin() ? "block" : "none";
        }
    } else {
        if (loginLink) {
            loginLink.textContent = "Login";
            loginLink.href = "#login";
        }
        if (adminMenu) {
            adminMenu.style.display = "none";
        }
    }
}

async function router() {
    const hash = window.location.hash || "#login";
    const app = document.getElementById("app");
    
    if (hash === '#logout') {
        app.innerHTML = routes["#logout"];
        app.onclick = function(event) {
            if (event.target.id === "confirmLogout") {
                sessionStorage.removeItem("auth");
                sessionStorage.removeItem("user");
                updateNavigation();
                app.onclick = null;
                window.location.hash = "#login";
            }
            if (event.target.id === "cancelLogout") {
                app.onclick = null;
                window.location.hash = "#cars";
            }
        };
        return;
    }

    if (hash === '#me') {
        app.innerHTML = routes['#me'];
        renderMe();
        return;
    }

    if (hash === "#cars" && !isLoggedIn()) {
        window.location.hash = "#login";
        return;
    }

    if (hash === "#cars") {
        app.innerHTML = routes["#cars"];  
        await renderCars(carsSortBy, carsSortOrder);  
        return;             
    }

    if (hash.startsWith('#booking-receipt')) {
        app.innerHTML = routes['#booking-receipt'];
        const params = new URLSearchParams(hash.split('?')[1]);
        const carId = params.get('carId');
        const fromDate = params.get('from');
        const toDate = params.get('to');
        renderBookingReceipt(carId, fromDate, toDate);
        return;
    }

    if (hash.startsWith('#booking')) {
        app.innerHTML = routes['#booking'];
        const params = new URLSearchParams(hash.split('?')[1]);
        const carId = params.get('carId');
        
        if (carId) {
            await renderBooking(carId);
        } else {
            app.innerHTML = '<p class="message message-warning">No car specified</p>';
        }
        
        return;
    }
    
    if (hash.startsWith("#admin") && !isAdmin()) {
        window.location.hash = "#cars";
        return;
    }
    
    const html = routes[hash];
    
    if (html) {
        app.innerHTML = html;
        
        if (hash === "#login") {
            const form = app.querySelector(".login-form");
            if (form) {
                form.addEventListener("submit", handleLogin);
            }
        }
    } else {
        window.location.hash = "#login";
    }
}

window.addEventListener("load", () => {
    router();
    updateNavigation();
});
window.addEventListener("hashchange", () => {
    router();
    updateNavigation();
});