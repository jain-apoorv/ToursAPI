# ToursAPI

ToursAPI is a powerful and flexible API designed for managing and retrieving tour data with ease. This API provides comprehensive endpoints to manage all tour data and supports a variety of queries, allowing for efficient sorting, filtering, pagination, and more.

## Demonstration

Explore the API using [ToursAPI](https://documenter.getpostman.com/view/25561480/2sA3dsnZzb)

The api is hosted on [https://toursapi-apoorv.onrender.com](https://toursapi-apoorv.onrender.com)

Following endpoints can be accessed.
### Endpoints

1. **GET /api/v1/tours**
   - **Description**: Retrieves all tours.
   - **Example**: [https://toursapi-apoorv.onrender.com/api/v1/tours](https://toursapi-apoorv.onrender.com/api/v1/tours)

2. **POST /api/v1/tours**
   - **Description**: Creates a new tour.
   - **Example**:
     ```json
     {
         "name": "The Forest Quest",
         "duration": 5,
         "maxGroupSize": 25,
         "difficulty": "easy",
         "ratingsAverage": 4.7,
         "ratingsQuantity": 37,
         "price": 397,
         "summary": "Breathtaking hike through the Canadian Banff National Park",
         "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
         "imageCover": "tour-1-cover.jpg",
         "images": [
             "tour-1-1.jpg",
             "tour-1-2.jpg",
             "tour-1-3.jpg"
         ],
         "startDates": [
             "2021-04-25,10:00",
             "2021-07-20,10:00",
             "2021-10-05,10:00"
         ]
     }
     ```

3. **GET /api/v1/tours/top-5-cheap**
   - **Description**: Retrieves the top 5 cheapest tours.
   - **Example**: [https://toursapi-apoorv.onrender.com/api/v1/tours/top-5-cheap](https://toursapi-apoorv.onrender.com/api/v1/tours/top-5-cheap)

4. **GET /api/v1/tours/:id**
   - **Description**: Retrieves a specific tour by ID.
   - **Example**: [https://toursapi-apoorv.onrender.com/api/v1/tours/667d8c78700ce910ed62b706](https://toursapi-apoorv.onrender.com/api/v1/tours/667d8c78700ce910ed62b706)

5. **GET /api/v1/tours?fields=name,difficulty,ratingsAverage**
   - **Description**: Retrieves tours with selected fields only (name, difficulty, ratingsAverage).
   - **Example**: [https://toursapi-apoorv.onrender.com/api/v1/tours?fields=name,difficulty,ratingsAverage](https://toursapi-apoorv.onrender.com/api/v1/tours?fields=name,difficulty,ratingsAverage)

6. **GET /api/v1/tours?sort=-price**
   - **Description**: Retrieves tours sorted by price (descending).
   - **Example**: [https://toursapi-apoorv.onrender.com/api/v1/tours?sort=-price](https://toursapi-apoorv.onrender.com/api/v1/tours?sort=-price)

7. **GET /api/v1/tours?page=2&limit=3**
   - **Description**: Retrieves tours with pagination (page 2, limit 3 per page).
   - **Example**: [https://toursapi-apoorv.onrender.com/api/v1/tours?page=2&limit=3](https://toursapi-apoorv.onrender.com/api/v1/tours?page=2&limit=3)

8. **GET /api/v1/tours?price[gte]=1000**
   - **Description**: Retrieves tours with price greater than or equal to 1000.
   - **Example**: [https://toursapi-apoorv.onrender.com/api/v1/tours?price[gte]=1000](https://toursapi-apoorv.onrender.com/api/v1/tours?price[gte]=1000)


## Installation

To get started with ToursAPI, you need to follow these steps:

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
