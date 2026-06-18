
const API_BASE = "http://localhost:8080";

// GET /api/v1/users/{userId}
async function fetchMe() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const response = await fetch(`${API_BASE}/api/v1/users/${user.userId}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return response.json();
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

// GET /api/v1/cars
async function fetchCars() {
    const response = await fetch(`${API_BASE}/api/v1/cars`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    
    if (!response.ok) 
        throw new Error("Failed to fetch cars");
    
    return response.json();
}

// GET /api/v1/cars/{carId}
async function fetchCarWithId(carId) {

    const response = await fetch(`${API_BASE}/api/v1/cars/${carId}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    
    if (!response.ok) 
        throw new Error("Failed to fetch cars");

    return response.json();
}

// POST /api/v1/bookings
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

async function returnCar(bookingId) {
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
    return response.json();
}


// GET /api/v1/bookings/{bookingId}
async function fetchBookingWithId(id) {
    const response = await fetch(`${API_BASE}/api/v1/bookings/${id}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch booking");
    return response.json();
}


//GET /api/v1/bookings/me
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

async function fetchAllBookings() {
    const response = await fetch(`${API_BASE}/api/v1/bookings`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch all bookings");
    return response.json();
}