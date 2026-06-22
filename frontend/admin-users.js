let adminUsersTableView = false;

async function renderAdminUsers() {
    const container = document.getElementById('admin-users-container');
    if (!container) {
        return;
    }
    
    try {
        const users = await fetchAllUsers();
        
        if (users.length === 0) {
            container.innerHTML = '<div class="panel-neutral" style="max-width: 600px; margin: 2rem auto; text-align: center; color: var(--text-gray);">No users found.</div>';
            return;
        }
        
        let html = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="color: var(--highlight);">Admin - All Users</h2>
                <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                    <button id="toggle-admin-users" class="btn-function">
                        ${adminUsersTableView ? 'Switch to Card View' : 'Switch to Table View'}
                    </button>
                </div>
            </div>
        `;
        
        if (adminUsersTableView) {
            html += `
                <table class="cars-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Orders</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => {
                            const isAdmin = user.role === 'ROLE_ADMIN';
                            return `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.firstName || '-'}</td>
                                    <td>${user.lastName || '-'}</td>
                                    <td>${user.email || '-'}</td>
                                    <td>${user.phone || '-'}</td>
                                    <td>${isAdmin ? 'Admin' : 'User'}</td>
                                    <td>${user.noOfOrders || 0}</td>
                                    <td>
                                        <button class="btn-function edit-user" data-id="${user.id}" data-username="${user.username}" data-first="${user.firstName || ''}" data-last="${user.lastName || ''}" data-email="${user.email || ''}" data-phone="${user.phone || ''}" data-role="${isAdmin ? 'admin' : 'user'}" style="font-size: 0.7rem; padding: 4px 8px;">Edit</button>
                                        <button class="btn-negative delete-user" data-id="${user.id}" style="font-size: 0.7rem; padding: 4px 8px;">Delete</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }
        else {
            html += `<div id="admin-users-list">`;
            for (const user of users) {
                const isAdmin = user.role === 'ROLE_ADMIN';
                
                html += `
                    <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 700px; margin-left: auto; margin-right: auto; border-left: 4px solid ${isAdmin ? 'var(--highlight)' : 'var(--text-gray)'};">
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${user.username} ${isAdmin ? '⭐' : ''}</h3>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Name:</strong> ${user.firstName || '-'} ${user.lastName || '-'}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Email:</strong> ${user.email || '-'}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Phone:</strong> ${user.phone || '-'}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Role:</strong> ${isAdmin ? 'Admin' : 'User'}</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Orders:</strong> ${user.noOfOrders || 0}</p>
                            <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                                <button class="btn-function edit-user" data-id="${user.id}" data-username="${user.username}" data-first="${user.firstName || ''}" data-last="${user.lastName || ''}" data-email="${user.email || ''}" data-phone="${user.phone || ''}" data-role="${isAdmin ? 'admin' : 'user'}" style="font-size: 0.8rem;">Edit</button>
                                <button class="btn-negative delete-user" data-id="${user.id}" style="font-size: 0.8rem;">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            }
            html += `</div>`;
        }
        
        container.innerHTML = html;
        
        document.getElementById('toggle-admin-users').addEventListener('click', () => {
            adminUsersTableView = !adminUsersTableView;
            renderAdminUsers();
        });
        
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userData = {
                    id: e.target.dataset.id,
                    username: e.target.dataset.username,
                    firstName: e.target.dataset.first,
                    lastName: e.target.dataset.last,
                    email: e.target.dataset.email,
                    phone: e.target.dataset.phone,
                    role: e.target.dataset.role
                };
                showEditUserForm(userData);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.id;
                try {
                    await deleteUser(userId);
                    renderAdminUsers();
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

function showEditUserForm(userData) {
    const container = document.getElementById('admin-users-container');
    if (!container) {
        return;
    }
    
    const formHtml = `
        <form class="demo-form" id="edit-user-form">
            <h2 class="section-heading">Edit User</h2>
            
            <label>Username (cannot be changed)</label>
            <input type="text" class="input-field" value="${userData.username}" disabled style="opacity: 0.6;">
            
            <label>First Name</label>
            <input type="text" id="edit-first-name" class="input-field" value="${userData.firstName}">
            
            <label>Last Name</label>
            <input type="text" id="edit-last-name" class="input-field" value="${userData.lastName}">
            
            <label>Email</label>
            <input type="email" id="edit-email" class="input-field" value="${userData.email}">
            
            <label>Phone</label>
            <input type="tel" id="edit-phone" class="input-field" value="${userData.phone}">
            
            <label>New Password</label>
            <input type="password" id="edit-password" class="input-field" placeholder="Enter new password">
            
            <label>Confirm Password</label>
            <input type="password" id="edit-confirm-password" class="input-field" placeholder="Confirm new password">
            
            <label>Role</label>
            <select id="edit-role" class="select-field">
                <option value="user" ${userData.role === 'user' ? 'selected' : ''}>User</option>
                <option value="admin" ${userData.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
            
            <div class="btn-row">
                <button type="submit" class="btn-positive">Save</button>
                <button type="button" id="cancel-edit-user" class="btn-negative">Cancel</button>
            </div>
        </form>
        <div id="edit-user-message" style="display: block; max-width: 400px; margin: 1rem auto; text-align: center;"></div>
    `;
    
    container.innerHTML = formHtml;
    
    document.getElementById('edit-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('edit-first-name').value.trim();
        const lastName = document.getElementById('edit-last-name').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const phone = document.getElementById('edit-phone').value.trim();
        const password = document.getElementById('edit-password').value;
        const confirmPassword = document.getElementById('edit-confirm-password').value;
        const role = document.getElementById('edit-role').value;
        const msgDiv = document.getElementById('edit-user-message');
        
        if (password && password !== confirmPassword) {
            msgDiv.innerHTML = '<div class="message message-warning">Passwords do not match</div>';
            return;
        }
        
        msgDiv.innerHTML = '<div class="spinner"></div>';
        
        const updateData = {
            username: userData.username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            role: role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER'
        };
        
        if (password) {
            updateData.password = password;
        }
        
        try {
            await updateUser(userData.id, updateData);
            msgDiv.innerHTML = '<div class="message message-success">User updated successfully!</div>';
            
            const currentUser = JSON.parse(sessionStorage.getItem('user'));
            if (userData.id == currentUser.userId) {
                currentUser.role = role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER';
                currentUser.isAdmin = role === 'admin';
                sessionStorage.setItem('user', JSON.stringify(currentUser));
                updateNavigation();
            }
            
            setTimeout(() => {
                renderAdminUsers();
            }, 1000);
        }
        catch (error) {
            msgDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
        }
    });
    
    document.getElementById('cancel-edit-user').addEventListener('click', () => {
        renderAdminUsers();
    });
}