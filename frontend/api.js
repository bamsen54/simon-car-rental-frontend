const API_BASE = "http://localhost:8080";

function getAuthHeader() {
    const auth = sessionStorage.getItem("auth");
    return auth ? { "Authorization": "Basic " + auth } : {};
}

// Any Authenticated POST /api/v1/auth/login
async function login(username, password, auth) {
    const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + auth
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return response.json();
}

// ADMIN or Principal GET /api/v1/users/{userId}
async function fetchUserWithId(userId) {
    const response = await fetch(`${API_BASE}/api/v1/users/${userId}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return response.json();
}

// ADMIN or Principal GET /api/v1/users/{userId}
async function fetchMe() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user.userId);
    return await fetchUserWithId(user.userId);
}

// POST /api/v1/users/{userId}
async function updateUser(id, userData) {
    const response = await fetch(`${API_BASE}/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(userData),
        credentials: 'include'
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
}

// GET /api/v1/users
async function fetchAllUsers() {
    const response = await fetch(`${API_BASE}/api/v1/users`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
}

// GET /api/v1/cars
async function fetchCars() {
    const response = await fetch(`${API_BASE}/api/v1/cars`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch cars");
    }
    
    return response.json();
}

// GET /api/v1/cars/{carId}
async function fetchCarWithId(carId) {
    const response = await fetch(`${API_BASE}/api/v1/cars/${carId}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch cars");
    }

    return response.json();
}

// USER POST /api/v1/bookings
async function createBooking(carId, fromDate, toDate) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    const response = await fetch(`${API_BASE}/api/v1/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            carId: carId,
            fromDate: fromDate,
            toDate: toDate,
            userId: user.userId,
            active: true
        }),
        credentials: 'include'
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Booking failed');
    }
    
    return true;
}

// ADMIN POST /api/v1/cars
async function addCar(carData) {
    const formData = new FormData();
    formData.append('name', carData.name);
    formData.append('model', carData.model);
    formData.append('type', carData.type);
    formData.append('price', carData.price);
    formData.append('feature1', carData.feature1 || '');
    formData.append('feature2', carData.feature2 || '');
    formData.append('feature3', carData.feature3 || '');
    formData.append('booked', carData.booked || false);
    
    const response = await fetch(`${API_BASE}/api/v1/cars`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add car');
    }
    return response.json();
}

// ADMIN GET /api/v1/cars/{carId}
async function updateCar(carId, carData) {
    const response = await fetch(`${API_BASE}/api/v1/cars/${carId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            id: carId,
            name: carData.name,
            model: carData.model,
            type: carData.type,
            price: carData.price,
            feature1: carData.feature1 || '',
            feature2: carData.feature2 || '',
            feature3: carData.feature3 || '',
            booked: carData.booked || false,
            image: null
        }),
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update car');
    }
    return response.json();
}

// ADMIN GET /api/v1/bookings/return/{bookingId}
async function returnCar(bookingId) {
    const booking = await fetchBookingWithId(bookingId);
    const carId = booking.carId;
    
    const response = await fetch(`${API_BASE}/api/v1/bookings/return/${bookingId}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader()
        },
        credentials: 'include'
    });
    if (response.status === 404) {
        throw new Error("Booking not found");
    }
    if (!response.ok) {
        throw new Error("Failed to return car");
    }
    
    await updateCar(carId, { booked: false });
    
    return response.json();
}
// ADMIN DELETE /api/v1/cars/{carId}
async function deleteCar(carId) {
    const response = await fetch(`${API_BASE}/api/v1/cars/${carId}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader()
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error("Failed to delete car");
    }
    return true;
}

// ADMIN or PRINCIPAL GET /api/v1/bookings/{bookingId}
async function fetchBookingWithId(id) {
    const response = await fetch(`${API_BASE}/api/v1/bookings/${id}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch booking");
    return response.json();
}

// ANY GET /api/v1/bookings/me
async function fetchMyBookings() {
    try {
        const response = await fetch(`${API_BASE}/api/v1/bookings/me`, {
            headers: getAuthHeader(),
            credentials: "include"
        });
        if (response.status === 404) {
            return [];
        }
        if (!response.ok) {
            throw new Error("Failed to fetch your bookings");
        }
        return response.json();
    } 
    catch (error) {
        console.log("fetchMyBookings error:", error.message);
        return [];
    }
}

// ADMIN GET /api/v1/bookings
async function fetchAllBookings() {
    const response = await fetch(`${API_BASE}/api/v1/bookings`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch all bookings");
    return response.json();
}



async function updateCar(carId, carData) {
    const car = await fetchCarWithId(carId);
    
    const response = await fetch(`${API_BASE}/api/v1/cars/${carId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            id: carId,
            name: car.name,
            model: car.model,
            type: car.type,
            price: car.price,
            feature1: car.feature1 || '',
            feature2: car.feature2 || '',
            feature3: car.feature3 || '',
            booked: carData.booked !== undefined ? carData.booked : car.booked,
            image: null
        }),
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update car');
    }
    return response.json();
}


async function updateBooking(bookingId, bookingData) {
    const oldBooking = await fetchBookingWithId(bookingId);
    const oldCarId = oldBooking.carId;
    const newCarId = bookingData.carId;
    
    const response = await fetch(`${API_BASE}/api/v1/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            carId: newCarId,
            fromDate: bookingData.fromDate,
            toDate: bookingData.toDate,
            active: true
        }),
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update booking');
    }
    
    if (oldCarId !== newCarId) {
        await updateCar(oldCarId, { booked: false });
        await updateCar(newCarId, { booked: true });
    }
    
    return response.json();
}

// ADMIN DELETE /api/v1/bookings/{bookingId}
async function deleteBooking(bookingId, carId) {
    const response = await fetch(`${API_BASE}/api/v1/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader()
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error("Failed to delete booking");
    }
    
    if (carId) {
        const updateResponse = await fetch(`${API_BASE}/api/v1/cars/${carId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ booked: false }),
            credentials: 'include'
        });
        if (!updateResponse.ok) {
            console.error("Failed to update car status");
        }
    }
    
    return true;
}