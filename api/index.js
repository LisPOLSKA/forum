import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { verifyToken } from "./firebaseAuth.js"; // Import middleware Firebase
import fs from 'fs';
import admin from 'firebase-admin'; // Dodaj import Firebase Admin
import { db } from "./firebase.js";

const app = express();

// Middleware do obsługi ciasteczek, JSON-a i nagłówków CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Umożliwienie przesyłania ciasteczek i nagłówków autoryzacji
  })
);
app.use(express.json());
app.use(cookieParser());

// Konfiguracja multer (upload plików) z obsługą dynamicznego tworzenia katalogu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "../forum/public/upload";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log("Directory created:", dir); // Loguj utworzenie katalogu
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Oddziel nazwę pliku od rozszerzenia
    const originalName = file.originalname;
    const extension = originalName.split('.').pop(); // Pobierz rozszerzenie
    const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.')); // Nazwa pliku bez rozszerzenia
    
    // Zamiana kropek w nazwie pliku na myślniki
    const safeFileName = nameWithoutExtension.replace(/\./g, '-'); // Zastąp kropki myślnikami
    
    // Generowanie pełnej nazwy pliku z rozszerzeniem
    const finalFileName = `${Date.now()}-${safeFileName}.${extension}`;
    cb(null, finalFileName); // Zwróć nazwę pliku
  },
});

const upload = multer({ storage: storage });
// Endpoint do pobierania danych użytkownika na podstawie uid
app.get('/api/user/:uid', async (req, res) => {
  const userId = req.params.uid;

  try {
      // Fetch user data from Firestore
      const userDoc = await db.collection("users").doc(userId).get();

      // Fetch user information from Firebase Authentication
      const authUser = await admin.auth().getUser(userId);
      
      const response = {
          uid: authUser.uid,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          // Include Firestore data if it exists
          ...(userDoc.exists ? userDoc.data() : {})
      };

      return res.json(response);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
});





// Endpoint do przesyłania plików (obrazów)
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  // Debugging
  if (!file) {
    console.error("No file received");
    return res.status(400).json("No file uploaded");
  }

  console.log("File received:", file); // Zobacz szczegóły pliku
  return res.status(200).json(file.filename); // Upewnij się, że zwracamy nazwę pliku
});
//app.get('/users', getAllUsers);
// Serwowanie plików statycznych (obrazów)
app.use("/upload", express.static("../forum/public/upload"));

// Trasy publiczne (np. logowanie)
app.use("/api/auth", authRoutes);

// Trasy zabezpieczone - tylko autoryzowani użytkownicy
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/posts", verifyToken, postRoutes);
app.use("/api/comments", verifyToken, commentRoutes);
app.use("/api/likes", verifyToken, likeRoutes);
app.use("/api/relationships", verifyToken, relationshipRoutes);

// Uruchomienie serwera na porcie 8800
app.listen(8800, () => {
  console.log("API working on port 8800!");
});
