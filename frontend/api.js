
const API_BASE = "http://localhost:8080";

async function fetchCars() {
    const response = await fetch(`${API_BASE}/api/v1/cars`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    
    if (!response.ok) 
        throw new Error("Failed to fetch cars");
    
    return response.json();
}


async function fetchCarWithId(carId) {

    const response = await fetch(`${API_BASE}/api/v1/cars/${carId}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    
    if (!response.ok) 
        throw new Error("Failed to fetch cars");

    return response.json();
}

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

async function fetchBookingWithId(id) {
    const response = await fetch(`${API_BASE}/api/v1/bookings/${id}`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch booking");
    return response.json();
}

async function fetchMyBookings() {
    const response = await fetch(`${API_BASE}/api/v1/bookings/me`, {
        headers: getAuthHeader(),
        credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch your bookings");
    return response.json();
}