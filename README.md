## Instructify

This project is a web application designed for educational purposes where users can take courses and watch video lectures. The platform supports three types of roles:

- **Admin**: Manages users, courses, and enrollments.
- **Instructor**: Teaches assigned courses and uploads video lectures.
- **Student**: Enrolls in courses and watches video lectures.

# Features

# Admin Features:
- Admin can log in to the platform with credentials.
- Admin can view all instructors, students, and courses.
- Admin can create new courses and assign them to instructors.
- Admin can enroll students in courses and unenroll them.
- Admin can assign or remove instructors from courses.

# Instructor Features:
- Instructors can sign up and select their role after email verification.
- Instructors can view courses assigned to them by the admin.
- Instructors can upload video lectures for students enrolled in their courses.

# Student Features:
- Students can sign up and select their role after email verification.
- Students can view all available courses and enroll in them.
- Students can watch video lectures uploaded by instructors.
- Students can unenroll from courses.

## Backend

# Routes and Role-based Access
- **Public Routes:**
    - `POST /register`: Register a new user with rate limiting.
    - `POST /login`: Log in to get an access token with rate limiting.
- **Secured Routes (Requires JWT Authentication):**
    - `PUT /apply-role`: Apply a role (Instructor, Student) to the user.
    - `POST /logout`: Logout the user.
    - `GET /current-user`: Get the details of the currently authenticated user.
    - `POST /verify`: Verify the user's email after registration.
    - `GET /get-all-courses`: Get all available courses.
- **Admin Routes (Requires JWT and Admin Role):**
    - `POST /add-course`: Create a new course.
    - `GET /get-all-students`: Get all students.
    - `GET /get-all-instructors`: Get all instructors.
    - `POST /assign-course-to-instructor`: Assign a course to an instructor.
    - `GET /get-assigned-courses`: Get all courses assigned to instructors.
- **Instructor Routes (Requires JWT and Instructor Role):**
    - `POST /upload-video`: Upload video lectures for a course.
    - `GET /get-courses`: Get all courses assigned to the instructor.
- **Student Routes (Requires JWT and Student Role):**
    - `POST /enroll/:courseId`: Enroll the student in a course.
    - `DELETE /unenroll/:courseId`: Unenroll the student from a course.
    - `GET /get-enrolled-courses`: Get all courses the student is enrolled in.
    - `GET /get-video/:videoId`: Retrieve a specific video lecture.

# Middleware
1. **Auth Middleware (`auth.middleware.js`)**
    - Verifies the JWT token sent by the client.
    - If the access token is expired, it will use the refresh token to generate a new access token.
2. **Multer Middleware (`multer.middleware.js`)**
    - Handles file uploads (video lectures) and stores them temporarily in the public folder.
    - After uploading to Cloudinary, the video is deleted from the public folder.
3. **Role Middleware (`role.middleware.js`)**
    - Ensures that users can only access the routes that match their assigned roles (Admin, Instructor, Student).

# Databas
The application uses **MongoDB** as the database, with 3 primary schemas:
- **User Schema**: Stores user information like name, username, email, role (admin, instructor, student), and status (verified/unverified) etc.
- **Video Schema**: Stores information about uploaded videos, such as title, URL, course ID, and instructor ID.
- **Course Schema**: Stores details about each course like course name, instructor(s), video lectures, and student enrollments.

# Security Features
- **Rate Limiting**: Using rate-limiting middleware to prevent brute force attacks, DoS (Denial of Service), and DDoS (Distributed Denial of Service) attacks.
- **Schema Validation**: Data is validated using [Zod](https://github.com/colinhacks/zod), ensuring that all incoming data adheres to the required structure.
- **HTTP Headers**: [Helmet](https://github.com/helmetjs/helmet) is used to set various HTTP headers for security, such as preventing XSS (Cross-site Scripting) attacks and defining a Content Security Policy (CSP).
- **Data Sanitization**: Sanitizes all incoming data to prevent NoSQL query injection and cleans up any potential malicious HTML content that might lead to script injection attacks.

# Environment Variables

```
PORT=
MONGODB_URI=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SENDER_ADDRESS=
SENDER_PASSWORD=
ADMIN_FULLNAME=
ADMIN_EMAIL=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

## Installation

# Prerequisites:
- **Node.js** (v14 or above)
- **MongoDB** (Local or Cloud-based using MongoDB Atlas)
- Docker (optional for containerization)

# Steps to Install:
1. Clone the repository:
    
    ```bash
    git clone https://github.com/0oAVIRALo0/Instructify.git
    cd Instructify
    ```
    
# Technologies Used
- **Frontend**: React.js (for the user interface)
- **Backend**: Node.js with Express.js (for the API)
- **Database**: MongoDB (for storing users, courses, and enrollments)
- **Authentication**: JWT (JSON Web Tokens) for user authentication
- **Email Verification**: NodeMailer (for sending OTPs for email verification)
- **File Upload**: Multer (for handling video lecture uploads)
- **CORS**: For enabling cross-origin requests
- **Docker**: For containerizing the application
- **Nodemon**: For automatic server restarts during development