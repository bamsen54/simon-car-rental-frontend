function getAuthHeader() {
    const auth = sessionStorage.getItem("auth");
    return auth ? { "Authorization": "Basic " + auth } : {};
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const messageDiv = document.getElementById("loginMessage");
    
    const auth = btoa(username + ":" + password);
    
    try {
        const user = await login(username, password, auth);
        
        sessionStorage.setItem('auth', auth);
        sessionStorage.setItem('user', JSON.stringify({
            userId: user.id || user.userId,
            username: user.username,
            role: user.role || (user.isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'),
            isAdmin: user.isAdmin || user.role === 'ROLE_ADMIN'
        }));
        
        updateNavigation();
        messageDiv.innerHTML = '<div class="message message-success">You are logged in!</div>';
        window.location.hash = '#me';
        
    } 
    
    catch (error) {
        messageDiv.innerHTML = '<div class="message message-warning">Invalid username or password</div>';
    }
}

function getCurrentUser() {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function isAdmin() {
    const user = getCurrentUser();
    if (!user) return false;
    return user.isAdmin === true || user.role === 'ROLE_ADMIN';
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function updateNavigation() {
    const adminMenu = document.getElementById("adminMenu");
    const loginLink = document.querySelector("nav a[href='#login'], nav a[href='#logout']");
    const carsLink = document.querySelector("nav a[href='#cars']");
    const meLink = document.querySelector("nav a[href='#me']");
    const bookingsLink = document.querySelector("nav a[href='#bookings']");
    
    if (isLoggedIn()) {
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#logout";
        }
        if (adminMenu) {
            adminMenu.style.display = isAdmin() ? "block" : "none";
        }
        if (carsLink) {
            carsLink.style.display = isAdmin() ? "none" : "block";
        }
        if (meLink) {
            meLink.style.display = "block";
        }
        if (bookingsLink) {
            bookingsLink.style.display = "block";
        }
    } 
    
    else {
        if (loginLink) {
            loginLink.textContent = "Login";
            loginLink.href = "#login";
        }
        if (adminMenu) 
            adminMenu.style.display = "none";
        
        if (carsLink) 
            carsLink.style.display = "none";
        
        if (meLink) 
            meLink.style.display = "none";
        
        if (bookingsLink) 
            bookingsLink.style.display = "none";
        
    }
}