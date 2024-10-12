import admin from "./firebase.js";

// Middleware do weryfikacji tokenu Firebase ID
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Oczekujemy tokenu w nagłówku Authorization: Bearer <token>
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;  // Przypisz dane użytkownika do requestu
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
