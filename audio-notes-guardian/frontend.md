# Backend Development Guidelines for AI Notes App

## 1. **Project Structure**

Organize the backend with a modular architecture for scalability and maintainability:

```
backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── services/
├── uploads/
├── app.js
└── server.js
```

- **controllers/**: Handle request logic.
- **models/**: Mongoose schemas for MongoDB.
- **routes/**: API route handlers.
- **middlewares/**: JWT auth, error handlers.
- **utils/**: Utility functions (e.g., file handlers).
- **config/**: Environment configs.
- **services/**: Business logic (e.g., audio transcription).
- **uploads/**: Temporary storage for images/audio.
- **app.js/server.js**: Entry points.

## 2. **Tech Stack**

- **Node.js** with **Express.js** (server framework)
- **MongoDB** with **Mongoose** (database)
- **JWT** (authentication)
- **Multer** (file uploads)
- **Web Speech API** (audio transcription - handled on frontend)

## 3. **API Endpoints**

### Authentication

- **POST /api/auth/signup**  
  - Request: `{ name, email, password }`
  - Response: `JWT Token`

- **POST /api/auth/login**  
  - Request: `{ email, password }`
  - Response: `JWT Token`

### Notes

- **GET /api/notes** (protected)
  - Fetch all user notes, with optional sorting.

- **POST /api/notes** (protected)
  - Create a new note.
  - Request: `{ title, content, type, image (optional) }`

- **GET /api/notes/:id** (protected)
  - Get note details.

- **PUT /api/notes/:id** (protected)
  - Edit note.

- **DELETE /api/notes/:id** (protected)
  - Delete note.

- **PATCH /api/notes/:id/favorite** (protected)
  - Toggle favorite status.

### File Uploads

- **POST /api/upload/image** (protected)
  - Multipart form data for images.

- **POST /api/upload/audio** (protected)
  - For storing audio files if needed.

## 4. **Database Schema**

### User Model
```javascript
{
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  createdAt: { type: Date, default: Date.now }
}
```

### Note Model
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  type: { type: String, enum: ['text', 'audio'] },
  isFavorite: { type: Boolean, default: false },
  image: String, // URL
  audio: String, // URL if applicable
  createdAt: { type: Date, default: Date.now }
}
```

## 5. **Authentication (JWT)**

- Generate JWT on login/signup.
- Use `Authorization: Bearer <token>` for protected routes.
- Middleware to verify token and attach user to the request.

## 6. **Error Handling**

Centralized error handler middleware:
```javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
```

## 7. **Security Considerations**

- Password hashing with bcrypt.
- JWT expiration handling.
- Input validation (e.g., using Joi or express-validator).
- Limit file upload sizes with Multer.


