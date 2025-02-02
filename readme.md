# Audio Notes Guardian

Audio Notes Guardian is a web application that allows users to create, manage, and transcribe audio and text notes. The application is built using React, Next.js, and Vite for the frontend, and Node.js with Express for the backend.

## Features

- User authentication (signup, login, logout)
- Create, update, delete, and view notes
- Support for both text and audio notes
- Transcription of audio notes
- Mark notes as favorite
- Search and filter notes
- Upload and manage images for notes

## Technologies Used

- **Frontend**: React, Next.js, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **State Management**: React Query
- **Authentication**: JWT
- **File Upload**: Multer
- **Transcription**: Custom transcription logic (mocked for testing)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/audio-notes-guardian.git
   cd audio-notes-guardian
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the following:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the backend server:**

   ```bash
   cd backend
   npm install
   npm start
   ```

5. **Start the frontend development server:**

   ```bash
   cd ..
   npm run dev
   ```

6. **Open the application:**

   Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```
audio-notes-guardian/
├── backend/
│   ├── controllers/
│   │   ├── audioController.js
│   │   ├── noteController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── audioRoutes.js
│   │   ├── noteRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── multer.js
│   │   └── connectDB.js
│   ├── config/
│   │   └── db.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── NoteCard.tsx
│   │   ├── NoteModal.tsx
│   │   ├── RecordButton.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SignupDialog.tsx
│   │   ├── SignupForm.tsx
│   │   ├── LoginDialog.tsx
│   │   ├── LoginForm.tsx
│   │   └── ui/
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── sheet.tsx
│   │       ├── tabs.tsx
│   │       ├── toaster.tsx
│   │       └── tooltip.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   ├── hooks/
│   │   ├── useNotes.ts
│   │   ├── useTranscription.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── Favorites.tsx
│   │   ├── NotFound.tsx
│   │   ├── _app.tsx
│   │   └── _document.tsx
│   ├── services/
│   │   ├── api.ts
│   ├── types/
│   │   ├── note.ts
│   ├── utils/
│   │   ├── formatDate.ts
│   │   └── env.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite.config.ts
│   └── package.json
├── .env.local
├── next.config.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Sign up a new user
- **POST** `/api/auth/login` - Log in an existing user

### Notes

- **GET** `/api/notes` - Get all notes
- **POST** `/api/notes` - Create a new note
- **PUT** `/api/notes/:id` - Update a note
- **DELETE** `/api/notes/:id` - Delete a note
- **PATCH** `/api/notes/:id/favorite` - Toggle favorite status of a note
- **PUT** `/api/notes/:id/image` - Upload an image for a note

### Audio

- **POST** `/api/audio/record` - Record a new audio note
- **POST** `/api/audio/transcribe` - Transcribe an audio note

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)