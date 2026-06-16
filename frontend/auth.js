
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
        const response = await fetch(`${API_BASE}/api/v1/cars`, {
            headers: {
                "Authorization": "Basic " + auth
            }
        });
        
        if (response.ok) {
            sessionStorage.setItem("auth", auth);
            sessionStorage.setItem("user", JSON.stringify({ 
                username: username, 
                isAdmin: username === "admin" 
            }));
            
            updateNavigation();
            messageDiv.innerHTML = `<div class="message message-success">You are logged in!</div>`;
            
            window.location.hash = "#logout";
        } else {
            messageDiv.innerHTML = `<div class="message message-warning">Invalid username or password</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="message message-warning">Login failed</div>`;
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