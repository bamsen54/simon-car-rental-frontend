// cars.js

let tableView = false;

function sortCars(cars, sortBy, sortOrder) {
    if (sortBy === '' || sortOrder === '') {
        return [...cars];
    }
    
    const sorted = [...cars];
    sorted.sort((a, b) => {
        let valA, valB;
        
        if (sortBy === 'name') {
            valA = (a.name + a.model).toLowerCase();
            valB = (b.name + b.model).toLowerCase();
        } else {
            valA = a.type.toLowerCase();
            valB = b.type.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        } else {
            if (valA < valB) return 1;
            if (valA > valB) return -1;
            return 0;
        }
    });
    
    return sorted;
}

async function renderCars(sortBy, sortOrder) {
    if (tableView) {
        await renderCarsTableView(sortBy, sortOrder);
    } else {
        await renderCarsCardView(sortBy, sortOrder);
    }
}

async function renderCarsCardView(sortBy, sortOrder) {
    const container = document.getElementById('car-container');
    if (!container) return;
    
    const cars = await fetchCars();
    const availableCars = cars.filter(car => !car.booked);
    const sortedCars = sortCars(availableCars, sortBy, sortOrder);
    
    let html = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="color: var(--highlight);">Available Cars</h2>
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                <button id="toggle-cars-view" class="btn-function">Switch to Table View</button>
            </div>
        </div>
        <div style="margin-bottom: 20px; text-align: center;">
            <select id="sort-cars" class="input-field" style="width: auto;">
                <option value="">No sorting</option>
                <option value="name_asc" ${sortBy === 'name' && sortOrder === 'asc' ? 'selected' : ''}>Name (A-Z)</option>
                <option value="name_desc" ${sortBy === 'name' && sortOrder === 'desc' ? 'selected' : ''}>Name (Z-A)</option>
                <option value="type_asc" ${sortBy === 'type' && sortOrder === 'asc' ? 'selected' : ''}>Type (A-Z)</option>
                <option value="type_desc" ${sortBy === 'type' && sortOrder === 'desc' ? 'selected' : ''}>Type (Z-A)</option>
            </select>
        </div>
        <div id="cars-list">
    `;
    
    for (let i = 0; i < sortedCars.length; i++) {
        const car = sortedCars[i];
        const imagePath = getCarImagePath(car);
        
        html += `
            <div class="panel-neutral" style="margin-bottom: 1rem; padding: 1rem; display: flex; gap: 1rem; align-items: center; max-width: 600px; margin-left: auto; margin-right: auto;">
                <img src="${imagePath}" onerror="this.src='img/placeholder.png'" style="width: 80px; height: 80px; object-fit: cover;">
                <div style="flex: 1;">
                    <h3>${car.name} ${car.model}</h3>
                    <p><strong>Type:</strong> ${car.type}</p>
                    <p><strong>Price:</strong> ${car.price} SEK/day</p>
                    <p><strong>Features:</strong> ${car.feature1}, ${car.feature2}, ${car.feature3}</p>
                </div>
                <button class="btn-positive select-car" data-id="${car.id}">Select Car</button>
            </div>
        `;
    }
    
    html += `</div>`;
    container.innerHTML = html;
    
    document.getElementById('toggle-cars-view').addEventListener('click', () => {
        tableView = true;
        renderCars(sortBy, sortOrder);
    });
    
    document.getElementById('sort-cars').addEventListener('change', (e) => {
        const value = e.target.value;
        if (value === '') {
            renderCars('', '');
        } else {
            const [newSortBy, newSortOrder] = value.split('_');
            renderCars(newSortBy, newSortOrder);
        }
    });
    
    document.querySelectorAll('.select-car').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const carId = e.target.dataset.id;
            window.location.hash = `#booking?carId=${carId}`;
        });
    });
}

async function renderCarsTableView(sortBy, sortOrder) {
    const container = document.getElementById('car-container');
    if (!container) return;
    
    const cars = await fetchCars();
    const availableCars = cars.filter(car => !car.booked);
    const sortedCars = sortCars(availableCars, sortBy, sortOrder);
    
    let html = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="color: var(--highlight);">Available Cars</h2>
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                <button id="toggle-cars-view" class="btn-function">Switch to Card View</button>
            </div>
        </div>
        <div style="margin-bottom: 20px; text-align: center;">
            <select id="sort-cars" class="input-field" style="width: auto;">
                <option value="">No sorting</option>
                <option value="name_asc" ${sortBy === 'name' && sortOrder === 'asc' ? 'selected' : ''}>Name (A-Z)</option>
                <option value="name_desc" ${sortBy === 'name' && sortOrder === 'desc' ? 'selected' : ''}>Name (Z-A)</option>
                <option value="type_asc" ${sortBy === 'type' && sortOrder === 'asc' ? 'selected' : ''}>Type (A-Z)</option>
                <option value="type_desc" ${sortBy === 'type' && sortOrder === 'desc' ? 'selected' : ''}>Type (Z-A)</option>
            </select>
        </div>
        <table class="cars-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Features</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${sortedCars.map(car => `
                    <tr>
                        <td><img src="${getCarImagePath(car)}" onerror="this.src='img/placeholder.png'" style="width: 50px; height: 50px; object-fit: cover;"></td>
                        <td>${car.name} ${car.model}</td>
                        <td>${car.type}</td>
                        <td>${car.price} SEK</td>
                        <td>${car.feature1}, ${car.feature2}, ${car.feature3}</td>
                        <td><button class="btn-positive select-car" data-id="${car.id}">Select</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    
    document.getElementById('toggle-cars-view').addEventListener('click', () => {
        tableView = false;
        renderCars(sortBy, sortOrder);
    });
    
    document.getElementById('sort-cars').addEventListener('change', (e) => {
        const value = e.target.value;
        if (value === '') {
            renderCars('', '');
        } else {
            const [newSortBy, newSortOrder] = value.split('_');
            renderCars(newSortBy, newSortOrder);
        }
    });
    
    document.querySelectorAll('.select-car').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const carId = e.target.dataset.id;
            window.location.hash = `#booking?carId=${carId}`;
        });
    });
}