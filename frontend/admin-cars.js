let adminCarsTableView = false;
let adminCarsSortBy = '';
let adminCarsSortOrder = '';

function sortAdminCars(cars, sortBy, sortOrder) {
    if (sortBy === '' || sortOrder === '') {
        return [...cars];
    }
    
    const sorted = [...cars];
    sorted.sort((a, b) => {
        let valA, valB;
        
        if (sortBy === 'id') {
            valA = a.id;
            valB = b.id;
        }
        else if (sortBy === 'name') {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
        }
        else if (sortBy === 'model') {
            valA = a.model.toLowerCase();
            valB = b.model.toLowerCase();
        }
        else if (sortBy === 'type') {
            valA = a.type.toLowerCase();
            valB = b.type.toLowerCase();
        }
        else if (sortBy === 'price') {
            valA = a.price;
            valB = b.price;
        }
        else if (sortBy === 'booked') {
            valA = a.booked;
            valB = b.booked;
        }
        else if (sortBy === 'features') {
            valA = (a.feature1 || '') + (a.feature2 || '') + (a.feature3 || '');
            valB = (b.feature1 || '') + (b.feature2 || '') + (b.feature3 || '');
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        else {
            return 0;
        }
        
        if (typeof valA === 'string') {
            if (sortOrder === 'asc') {
                return valA.localeCompare(valB);
            }
            else {
                return valB.localeCompare(valA);
            }
        }
        else {
            if (sortOrder === 'asc') {
                return valA - valB;
            }
            else {
                return valB - valA;
            }
        }
    });
    
    return sorted;
}

async function renderAdminCars() {
    const container = document.getElementById('admin-cars-container');
    if (!container) {
        return;
    }
    
    try {
        const cars = await fetchCars();
        const sortedCars = sortAdminCars(cars, adminCarsSortBy, adminCarsSortOrder);
        
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="color: var(--highlight);">Admin - All Cars</h2>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <select id="sort-admin-cars" class="input-field" style="width: auto;">
                        <option value="">No sorting</option>
                        <option value="id_asc" ${adminCarsSortBy === 'id' && adminCarsSortOrder === 'asc' ? 'selected' : ''}>ID (A-Z)</option>
                        <option value="id_desc" ${adminCarsSortBy === 'id' && adminCarsSortOrder === 'desc' ? 'selected' : ''}>ID (Z-A)</option>
                        <option value="name_asc" ${adminCarsSortBy === 'name' && adminCarsSortOrder === 'asc' ? 'selected' : ''}>Name (A-Z)</option>
                        <option value="name_desc" ${adminCarsSortBy === 'name' && adminCarsSortOrder === 'desc' ? 'selected' : ''}>Name (Z-A)</option>
                        <option value="model_asc" ${adminCarsSortBy === 'model' && adminCarsSortOrder === 'asc' ? 'selected' : ''}>Model (A-Z)</option>
                        <option value="model_desc" ${adminCarsSortBy === 'model' && adminCarsSortOrder === 'desc' ? 'selected' : ''}>Model (Z-A)</option>
                        <option value="type_asc" ${adminCarsSortBy === 'type' && adminCarsSortOrder === 'asc' ? 'selected' : ''}>Type (A-Z)</option>
                        <option value="type_desc" ${adminCarsSortBy === 'type' && adminCarsSortOrder === 'desc' ? 'selected' : ''}>Type (Z-A)</option>
                        <option value="price_asc" ${adminCarsSortBy === 'price' && adminCarsSortOrder === 'asc' ? 'selected' : ''}>Price (Low-High)</option>
                        <option value="price_desc" ${adminCarsSortBy === 'price' && adminCarsSortOrder === 'desc' ? 'selected' : ''}>Price (High-Low)</option>
                        <option value="booked_asc" ${adminCarsSortBy === 'booked' && adminCarsSortOrder === 'asc' ? 'selected' : ''}>Booked (No-Yes)</option>
                        <option value="booked_desc" ${adminCarsSortBy === 'booked' && adminCarsSortOrder === 'desc' ? 'selected' : ''}>Booked (Yes-No)</option>
                        <option value="features_asc" ${adminCarsSortBy === 'features' && adminCarsSortOrder === 'asc' ? 'selected' : ''}>Features (A-Z)</option>
                        <option value="features_desc" ${adminCarsSortBy === 'features' && adminCarsSortOrder === 'desc' ? 'selected' : ''}>Features (Z-A)</option>
                    </select>
                    <button id="show-add-car" class="btn-positive">Add Car</button>
                    <button id="toggle-admin-cars" class="btn-function">
                        ${adminCarsTableView ? 'Switch to Card View' : 'Switch to Table View'}
                    </button>
                </div>
            </div>
        `;
        
        html += `
            <div id="add-car-form" style="display: none; margin-bottom: 2rem;">
                <div class="panel-neutral" style="max-width: 700px; margin: 0 auto; padding: 2rem;">
                    <h3 style="color: var(--highlight); margin-bottom: 1rem;">Add New Car</h3>
                    <form id="add-car-form-element">
                        <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Name</label>
                        <input type="text" id="add-car-name" class="input-field" required style="margin-bottom: 1rem;">
                        
                        <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Model</label>
                        <input type="text" id="add-car-model" class="input-field" required style="margin-bottom: 1rem;">
                        
                        <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Type</label>
                        <input type="text" id="add-car-type" class="input-field" required style="margin-bottom: 1rem;">
                        
                        <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Price (SEK)</label>
                        <input type="number" id="add-car-price" class="input-field" required style="margin-bottom: 1rem;">
                        
                        <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Feature 1</label>
                        <input type="text" id="add-car-feature1" class="input-field" style="margin-bottom: 1rem;">
                        
                        <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Feature 2</label>
                        <input type="text" id="add-car-feature2" class="input-field" style="margin-bottom: 1rem;">
                        
                        <label style="display: block; margin-bottom: 0.25rem; color: var(--text-light);">Feature 3</label>
                        <input type="text" id="add-car-feature3" class="input-field" style="margin-bottom: 1rem;">
                        
                        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                            <button type="submit" class="btn-positive">Add Car</button>
                            <button type="button" id="cancel-add-car" class="btn-negative">Cancel</button>
                        </div>
                    </form>
                    <div id="add-car-message" style="display: block; max-width: 400px; margin: 1rem auto; text-align: center;"></div>
                </div>
            </div>
        `;
        
        if (sortedCars.length === 0) {
            html += '<div class="panel-neutral" style="max-width: 600px; margin: 2rem auto; text-align: center; color: var(--text-gray);">No cars found.</div>';
        }
        else {
            if (adminCarsTableView) {
                html += `
                    <table class="cars-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Booked</th>
                                <th>Features</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedCars.map(car => {
                                const imagePath = getCarImagePath(car);
                                return `
                                    <tr>
                                        <td><img src="${imagePath}" onerror="this.src='img/placeholder.png'" style="width: 50px; height: 50px; object-fit: cover;"></td>
                                        <td>${car.id}</td>
                                        <td>${car.name}</td>
                                        <td>${car.model}</td>
                                        <td>${car.type}</td>
                                        <td>${car.price} SEK</td>
                                        <td>${car.booked ? 'Yes' : 'No'}</td>
                                        <td>${car.feature1 || '-'}, ${car.feature2 || '-'}, ${car.feature3 || '-'}</td>
                                        <td>
                                            <button class="btn-function edit-car" data-id="${car.id}" data-name="${car.name}" data-model="${car.model}" data-type="${car.type}" data-price="${car.price}" data-booked="${car.booked}" data-feature1="${car.feature1 || ''}" data-feature2="${car.feature2 || ''}" data-feature3="${car.feature3 || ''}" style="font-size: 0.7rem; padding: 4px 8px;">Edit</button>
                                            <button class="btn-negative delete-car" data-id="${car.id}" style="font-size: 0.7rem; padding: 4px 8px;">Delete</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `;
            }
            else {
                html += `<div id="admin-cars-list">`;
                for (const car of sortedCars) {
                    const imagePath = getCarImagePath(car);
                    
                    html += `
                        <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 700px; margin-left: auto; margin-right: auto;">
                            <img src="${imagePath}" onerror="this.src='img/placeholder.png'" style="width: 80px; height: 80px; object-fit: cover;">
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${car.name} ${car.model}</h3>
                                <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>ID:</strong> ${car.id}</p>
                                <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Type:</strong> ${car.type}</p>
                                <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Price:</strong> ${car.price} SEK</p>
                                <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Booked:</strong> ${car.booked ? 'Yes' : 'No'}</p>
                                <p style="margin: 0.25rem 0; font-size: 0.95rem;"><strong>Features:</strong> ${car.feature1 || '-'}, ${car.feature2 || '-'}, ${car.feature3 || '-'}</p>
                                <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                                    <button class="btn-function edit-car" data-id="${car.id}" data-name="${car.name}" data-model="${car.model}" data-type="${car.type}" data-price="${car.price}" data-booked="${car.booked}" data-feature1="${car.feature1 || ''}" data-feature2="${car.feature2 || ''}" data-feature3="${car.feature3 || ''}" style="font-size: 0.8rem;">Edit</button>
                                    <button class="btn-negative delete-car" data-id="${car.id}" style="font-size: 0.8rem;">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
                html += `</div>`;
            }
        }
        
        container.innerHTML = html;
        
        document.getElementById('sort-admin-cars').addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === '') {
                adminCarsSortBy = '';
                adminCarsSortOrder = '';
            }
            else {
                const [sortBy, sortOrder] = value.split('_');
                adminCarsSortBy = sortBy;
                adminCarsSortOrder = sortOrder;
            }
            renderAdminCars();
        });
        
        document.getElementById('toggle-admin-cars').addEventListener('click', () => {
            adminCarsTableView = !adminCarsTableView;
            renderAdminCars();
        });
        
        document.getElementById('show-add-car').addEventListener('click', () => {
            const form = document.getElementById('add-car-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });
        
        document.getElementById('cancel-add-car').addEventListener('click', () => {
            document.getElementById('add-car-form').style.display = 'none';
        });
        
        document.getElementById('add-car-form-element').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('add-car-name').value;
            const model = document.getElementById('add-car-model').value;
            const type = document.getElementById('add-car-type').value;
            const price = parseFloat(document.getElementById('add-car-price').value);
            const feature1 = document.getElementById('add-car-feature1').value;
            const feature2 = document.getElementById('add-car-feature2').value;
            const feature3 = document.getElementById('add-car-feature3').value;
            const msgDiv = document.getElementById('add-car-message');
            
            if (!name || !model || !type || !price) {
                msgDiv.innerHTML = '<div class="message message-warning">Please fill in all required fields</div>';
                return;
            }
            
            msgDiv.innerHTML = '<div class="spinner"></div>';
            
            try {
                await addCar({
                    name,
                    model,
                    type,
                    price,
                    feature1,
                    feature2,
                    feature3,
                    booked: false
                });
                msgDiv.innerHTML = '<div class="message message-success">Car added successfully!</div>';
                setTimeout(() => {
                    renderAdminCars();
                }, 1000);
            }
            catch (error) {
                msgDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
            }
        });
        
        document.querySelectorAll('.edit-car').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carData = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    model: e.target.dataset.model,
                    type: e.target.dataset.type,
                    price: e.target.dataset.price,
                    booked: e.target.dataset.booked === 'true',
                    feature1: e.target.dataset.feature1,
                    feature2: e.target.dataset.feature2,
                    feature3: e.target.dataset.feature3
                };
                showEditCarForm(carData);
            });
        });
        
        document.querySelectorAll('.delete-car').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const carId = e.target.dataset.id;
                try {
                    await deleteCar(carId);
                    renderAdminCars();
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

function showEditCarForm(carData) {
    const container = document.getElementById('admin-cars-container');
    if (!container) {
        return;
    }
    
    const formHtml = `
        <form class="demo-form" id="edit-car-form">
            <h2 class="section-heading">Edit Car</h2>
            
            <label>Name</label>
            <input type="text" id="edit-car-name" class="input-field" value="${carData.name}" required>
            
            <label>Model</label>
            <input type="text" id="edit-car-model" class="input-field" value="${carData.model}" required>
            
            <label>Type</label>
            <input type="text" id="edit-car-type" class="input-field" value="${carData.type}" required>
            
            <label>Price (SEK)</label>
            <input type="number" id="edit-car-price" class="input-field" value="${carData.price}" required>
            
            <label>Feature 1</label>
            <input type="text" id="edit-car-feature1" class="input-field" value="${carData.feature1}">
            
            <label>Feature 2</label>
            <input type="text" id="edit-car-feature2" class="input-field" value="${carData.feature2}">
            
            <label>Feature 3</label>
            <input type="text" id="edit-car-feature3" class="input-field" value="${carData.feature3}">
            
            <div class="btn-row">
                <button type="submit" class="btn-positive">Save</button>
                <button type="button" id="cancel-edit-car" class="btn-negative">Cancel</button>
            </div>
        </form>
        <div id="edit-car-message" style="display: block; max-width: 400px; margin: 1rem auto; text-align: center;"></div>
    `;
    
    container.innerHTML = formHtml;
    
    document.getElementById('edit-car-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('edit-car-name').value;
        const model = document.getElementById('edit-car-model').value;
        const type = document.getElementById('edit-car-type').value;
        const price = parseFloat(document.getElementById('edit-car-price').value);
        const feature1 = document.getElementById('edit-car-feature1').value;
        const feature2 = document.getElementById('edit-car-feature2').value;
        const feature3 = document.getElementById('edit-car-feature3').value;
        const msgDiv = document.getElementById('edit-car-message');
        
        if (!name || !model || !type || !price) {
            msgDiv.innerHTML = '<div class="message message-warning">Please fill in all required fields</div>';
            return;
        }
        
        msgDiv.innerHTML = '<div class="spinner"></div>';
        
        try {
            await updateCar(carData.id, {
                name,
                model,
                type,
                price,
                feature1,
                feature2,
                feature3,
                booked: carData.booked
            });
            msgDiv.innerHTML = '<div class="message message-success">Car updated successfully!</div>';
            setTimeout(() => {
                renderAdminCars();
            }, 1000);
        }
        catch (error) {
            msgDiv.innerHTML = `<div class="message message-warning">${error.message}</div>`;
        }
    });
    
    document.getElementById('cancel-edit-car').addEventListener('click', () => {
        renderAdminCars();
    });
}