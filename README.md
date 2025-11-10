# 🗺️ YatraMate - Vehicle Rental System Application 🎉

YatraMate is a comprehensive online vehicle rental system designed to provide a seamless experience for users to book cars and bikes, and for vendors to manage their fleet. The system supports various user roles including regular users, vendors, office staff, and administrators, each with tailored functionalities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints (Overview)](#api-endpoints-overview)
- [Contributing](#contributing)
- [License](#license)

## Features

*   **User Authentication & Authorization:** Secure login and registration for different user roles (User, Vendor, Office Staff, Admin).
*   **Vehicle Browsing & Search:** Users can browse available cars and bikes, with search and filtering options.
*   **Vehicle Details:** Detailed view of each vehicle, including specifications, pricing, and images.
*   **Booking Management:** Users can book vehicles, view their booking history, and manage upcoming rentals.
*   **Vendor Dashboard:** Vendors can add, update, and manage their vehicles, view bookings for their fleet, and track earnings.
*   **Office Staff Dashboard:** Office staff can manage vehicle pickups and returns, and handle customer inquiries.
*   **Admin Dashboard:** Administrators have full control over users, vendors, vehicles, and system settings.
*   **Image Uploads:** Support for uploading vehicle images.
*   **Responsive Design:** User-friendly interface across various devices.

## Technologies Used

### Frontend

*   **React.js:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web projects.
*   **React Router DOM:** For declarative routing in React applications.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **PostCSS:** A tool for transforming CSS with JavaScript plugins.
*   **ESLint:** For maintaining code quality and consistency.

### Backend

*   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL database for storing application data.
*   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **bcryptjs:** For hashing passwords securely.
*   **jsonwebtoken:** For implementing JSON Web Tokens for authentication.
*   **cookie-parser:** Middleware to parse Cookie headers and populate `req.cookies`.
*   **Multer:** A middleware for handling `multipart/form-data`, primarily used for uploading files.
*   **ImageKit:** For efficient image storage and delivery.
*   **dotenv:** To load environment variables from a `.env` file.
*   **cors:** Node.js middleware for enabling Cross-Origin Resource Sharing.
*   **Nodemon:** A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Folder Structure

The project is divided into two main parts: `client` (frontend) and `server` (backend).

```
YatraMate-VehicleRentalSystem/
├── client/                 # Frontend application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable React components
│   │   ├── config/         # Configuration files (e.g., API base URL)
│   │   ├── contexts/       # React Context API for global state
│   │   ├── pages/          # Individual page components
│   │   ├── services/       # API service calls
│   │   └── utils/          # Utility functions
│   └── ...
├── server/                 # Backend application
│   ├── controllers/        # Logic for handling requests
│   ├── middleware/         # Express middleware (e.g., authentication)
│   ├── models/             # Mongoose schemas and models
│   ├── routes/             # API routes definitions
│   └── utils/              # Utility functions and error handling
│   └── ...
└── README.md               # Project documentation
└── LICENSE                 # Project license
```

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (LTS version recommended)
*   **npm** (comes with Node.js) or **Yarn**
*   **MongoDB:** A running instance of MongoDB, either locally or a cloud-hosted service (e.g., MongoDB Atlas).

### Backend Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env` file:**
    In the `server` directory, create a file named `.env` and add the following environment variables. Replace the placeholder values with your actual credentials.
    ```
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=90
    IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
    IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
    IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
    ```
    *   `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/yatra_mate` or your MongoDB Atlas URI).
    *   `JWT_SECRET`: A strong, random string for JWT signing.
    *   `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`: Your ImageKit credentials for image uploads.

4.  **Start the backend server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The server will typically run on `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application will typically run on `http://localhost:5173` (or another port if 5173 is in use).

## Usage

Once both the backend and frontend servers are running:

1.  Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  Register a new user account or log in with existing credentials.
3.  Explore the vehicle listings, make bookings, or switch to a vendor/admin role if you have the necessary access.

## API Endpoints (Overview)

The backend provides a RESTful API. Key routes include:

*   `/api/v1/auth`: User authentication (register, login, logout, forgot password, reset password).
*   `/api/v1/users`: User management (profile, update, delete).
*   `/api/v1/vehicles`: Vehicle management (add, view, update, delete vehicles).
*   `/api/v1/bookings`: Booking management (create, view, update bookings).
*   `/api/v1/vendors`: Vendor specific operations.
*   `/api/v1/admin`: Administrative operations.
*   `/api/v1/upload`: Image upload endpoints.

Refer to the backend `routes` directory for detailed endpoint definitions.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

We would like to express our sincere gratitude to our project guide, Professor Tanmoy Bera Sir, for his invaluable guidance and insightful ideas throughout the development of this MERN stack final year project.

---