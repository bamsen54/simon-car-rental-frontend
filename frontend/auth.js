
function getAuthHeader() {
    const auth = sessionStorage.getItem("auth");
    return auth ? { "Authorization": "Basic " + auth } : {};
}


async function handleLogin(event) {
    event.preventDefault();
    
    const username   = document.getElementById("username").value;
    const password   = document.getElementById("password").value;
    const messageDiv = document.getElementById("loginMessage");
    
    const auth = btoa(username + ":" + password);
    
    try {
        const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + auth
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Invalid credentials');
        
        const user = await response.json();
        
        sessionStorage.setItem('auth', auth);
        sessionStorage.setItem('user', JSON.stringify({
            userId: user.id || user.userId,  // ← SPARA ID
            username: user.username,
            isAdmin: user.isAdmin
        }));
        
        updateNavigation();
        messageDiv.innerHTML = `<div class="message message-success">Welcome ${user.username}!</div>`;
        window.location.hash = '#me';
        
    } catch (error) {
        messageDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
    }
}

function getCurrentUser() {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user?.isAdmin === true;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}