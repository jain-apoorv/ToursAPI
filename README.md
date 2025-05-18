# Yatra: A Full-Stack Tour Booking Application

A full-stack Tour Booking application comprising a robust **Backend API** (YatraAPI) and a responsive **React Frontend**. YatraAPI offers CRUD operations for tours, advanced querying, secure user authentication, and booking management, while the React frontend delivers an engaging user experience with map integration, guide management, and complete booking workflows.

---

## 🔧 Backend (YatraAPI)

### Core Functionality

- **CRUD Operations**: Create, read, update, delete tour records.
- **Advanced Querying**: Filtering, sorting, field selection, and pagination using query parameters.
- **Authentication & Authorization**: User signup/login with JWT, protected routes for booking and profile.
- **Booking Management**: Create, view, update, cancel bookings linked to authenticated users.

### API Endpoints

| Method | Endpoint                         | Description                                |
| ------ | -------------------------------- | ------------------------------------------ |
| **Tours**                                                    |                                            |
| GET    | `/api/v1/tours`                  | Retrieve all tours                         |
| GET    | `/api/v1/tours/:id`              | Retrieve a specific tour by ID             |
| POST   | `/api/v1/tours`                  | Create a new tour                          |
| PATCH  | `/api/v1/tours/:id`              | Update tour details                        |
| DELETE | `/api/v1/tours/:id`              | Delete a tour                              |
| GET    | `/api/v1/tours/top-5-cheap`      | Top 5 cheapest tours                       |
| GET    | `/api/v1/tours?sort=-price`      | Sort tours by price (descending)           |
| GET    | `/api/v1/tours?fields=name,duration,price` | Select specific fields           |
| GET    | `/api/v1/tours?page=2&limit=5`   | Pagination                                 |
| GET    | `/api/v1/tours?price[gte]=500`   | Filter tours with price ≥ 500              |
| **Users & Auth**                                              |                                            |
| POST   | `/api/v1/auth/signup`            | Register a new user                        |
| POST   | `/api/v1/auth/login`             | Login and receive JWT                      |
| GET    | `/api/v1/auth/logout`            | Logout user (clear token)                  |
| GET    | `/api/v1/users/me`               | Get current user profile (protected)       |
| PATCH  | `/api/v1/users/me`               | Update user data (protected)               |
| **Bookings**                                                  |                                            |
| GET    | `/api/v1/bookings`               | Retrieve all bookings (admin)              |
| GET    | `/api/v1/bookings/:id`           | Retrieve a specific booking by ID          |
| POST   | `/api/v1/bookings`               | Create a new booking (protected)           |
| PATCH  | `/api/v1/bookings/:id`           | Update booking (protected/owner)           |
| DELETE | `/api/v1/bookings/:id`           | Cancel a booking (protected/owner)         |


## Installation(backend)

To install yatraAPI locally, you need to follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. **set up the config.env file**
3. **install dependencise**
   ```bash
   npm install
4. **run the server**
   ```bash
   node server.js
