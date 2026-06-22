async function renderRegister() {
    const container = document.getElementById('register-container');
    if (!container) {
        return;
    }
    
    const formHtml = `
        <form class="demo-form" id="register-form">
            <h2 class="section-heading">Create Account</h2>
            
            <label>Username</label>
            <input type="text" id="reg-username" class="input-field" required>
            
            <label>Password</label>
            <input type="password" id="reg-password" class="input-field" required>
            
            <label>Confirm Password</label>
            <input type="password" id="reg-confirm-password" class="input-field" required>
            
            <label>First Name</label>
            <input type="text" id="reg-first-name" class="input-field">
            
            <label>Last Name</label>
            <input type="text" id="reg-last-name" class="input-field">
            
            <label>Email</label>
            <input type="email" id="reg-email" class="input-field">
            
            <label>Phone</label>
            <input type="tel" id="reg-phone" class="input-field">
            
            <div class="btn-row">
                <button type="submit" class="btn-positive">Register</button>
                <button type="button" id="cancel-register" class="btn-negative">Cancel</button>
            </div>
        </form>
        <div id="register-message" style="max-width: 400px; margin: 1rem auto; text-align: center;"></div>
    `;
    
    container.innerHTML = formHtml;
    
    document.getElementById('cancel-register').addEventListener('click', () => {
        window.location.hash = '#login';
    });
    
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const firstName = document.getElementById('reg-first-name').value.trim();
        const lastName = document.getElementById('reg-last-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const msgDiv = document.getElementById('register-message');
        
        if (!username || !password) {
            msgDiv.innerHTML = '<div class="message message-warning">Username and password are required</div>';
            return;
        }
        
        if (password !== confirmPassword) {
            msgDiv.innerHTML = '<div class="message message-warning">Passwords do not match</div>';
            return;
        }
        
        msgDiv.innerHTML = '<div class="spinner"></div>';
        
        try {
            const response = await fetch(`${API_BASE}/api/v1/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({
                    username,
                    password,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: 'ROLE_USER'
                }),
                credentials: 'include'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }
            
            msgDiv.innerHTML = '<div class="message message-success">Account created! You can now log in.</div>';
            setTimeout(() => {
                window.location.hash = '#login';
            }, 1500);
        }
        catch (error) {
            msgDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
        }
    });
}