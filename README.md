# 🗺️ YatraMate - Vehicle Rental System Application 🎉

YatraMate is a comprehensive online vehicle rental system designed to provide a seamless experience for users to book cars and bikes, and for vendors to manage their fleet. The system supports various user roles including regular users, vendors, office staff, and administrators, each with tailored functionalities.

🌐 Live Demo: https://yatramate.vercel.app/

## ✨ Features

*   **User Authentication & Authorization:** Secure login and registration for different user roles (User, Vendor, Office Staff, Admin) using JSON Web Tokens (JWT).
*   **Vehicle Browsing & Search:** Users can browse available cars and bikes, with search and filtering options based on vehicle type, model, and location.
*   **Vehicle Details:** A detailed view of each vehicle, including specifications, pricing, high-quality images, and availability.
*   **Booking Management:** Users can easily book vehicles for specific dates, view their booking history, and manage upcoming rentals.
*   **Vendor Dashboard:** A dedicated dashboard for vendors to add, update, and manage their vehicles, view bookings for their fleet, and track their earnings.
*   **Office Staff Dashboard:** A specialized dashboard for office staff to manage vehicle pickups and returns, verify vehicle conditions, and handle customer inquiries.
*   **Admin Dashboard:** A powerful dashboard for administrators to have full control over users, vendors, vehicles, and system settings.
*   **Image Uploads:** Efficient image upload and management for vehicle images, powered by ImageKit.
*   **Responsive Design:** A user-friendly and fully responsive interface that works seamlessly across desktops, tablets, and mobile devices.

## 🚀 Technologies Used

The project is built using the MERN stack and other modern technologies to ensure a robust and scalable application.

### Frontend

*   **React.js:** A popular JavaScript library for building dynamic and interactive user interfaces.
*   **Vite:** A next-generation frontend tooling that provides a faster and leaner development experience for modern web projects.
*   **React Router DOM:** For handling client-side routing and navigation between different pages in the application.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom user interfaces without writing custom CSS.
*   **PostCSS:** A tool for transforming CSS with JavaScript plugins, used here with Tailwind CSS.
*   **ESLint:** A static code analysis tool for identifying and fixing problems in JavaScript code, ensuring code quality and consistency.

### Backend

*   **Node.js:** A JavaScript runtime environment that allows executing JavaScript code on the server-side.
*   **Express.js:** A fast, unopinionated, and minimalist web framework for Node.js, used to build the RESTful API.
*   **MongoDB:** A NoSQL database that stores data in flexible, JSON-like documents.
*   **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js, which provides a straightforward, schema-based solution to model application data.
*   **jsonwebtoken (JWT):** For generating and verifying JSON Web Tokens to secure the application's API endpoints.
*   **bcryptjs:** A library for hashing user passwords before storing them in the database.
*   **cookie-parser:** Middleware to parse `Cookie` headers and populate `req.cookies` with an object keyed by the cookie names.
*   **Multer:** A middleware for handling `multipart/form-data`, which is primarily used for uploading files.
*   **ImageKit:** A cloud-based image management and delivery service that provides an easy-to-use API for image uploads, optimization, and transformation.
*   **dotenv:** A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
*   **cors:** A Node.js middleware for enabling Cross-Origin Resource Sharing (CORS) with various options.
*   **Nodemon:** A utility that automatically restarts the Node.js application when file changes are detected.

## 📂 Folder Structure

The project is organized into two main directories: `client` for the frontend application and `server` for the backend application.

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
|
├── .gitignore              # Git ignore file for the root directory
├── LICENSE                 # Project license file
├── CONTRIBUTING.md         # Contribution guidelines
└── README.md               # Project documentation
```

## ⚙️ Installation

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (LTS version recommended)
*   **npm** (comes with Node.js) or **Yarn**
*   **MongoDB:** A running instance of MongoDB, either locally or a cloud-hosted service (e.g., MongoDB Atlas).

### Backend Setup:

1.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    In the `server` directory, create a file named `.env` and add the environment variables as specified below:
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
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A strong, random string for JWT signing.
    *   `IMAGEKIT_*`: Your ImageKit credentials for image uploads.

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:8000`.

### Frontend Setup:

1.  **Navigate to the `client` directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will run on `http://localhost:5173`.

### Alternate method:
#### Run the application using Concurrently-
1. Simply, create `.env` for backend as instructed above
2. In root directory, install concurrently by running the command 
    ```
    npm install
    ```
3. After that, run the command for installing required packages for the application
    ```
    npm run download
    ```
4. Then run the command to run the application
    ```
    npm run app
    ```
    Access the application in your browser in this link `http://localhost:5173`

## 🚀 Usage

Once both the backend and frontend servers are running:

1.  Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  Register a new user account or log in with existing credentials.
3.  Explore the vehicle listings, make bookings, or switch to a vendor/staff/admin role if you have the necessary access.

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


## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for more details on how to contribute to this project.

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🙏 Acknowledgements

We would like to express our sincere gratitude to our project guide, Professor Tanmoy Bera Sir, for his invaluable guidance and insightful ideas throughout the development of this MERN stack final year project.

---