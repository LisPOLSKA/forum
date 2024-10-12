import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

// Pobranie komentarzy
export const getComments = (req, res) => {
    // Nie używamy już tabeli `users`, więc zapytanie zostało uproszczone
    const q = `SELECT c.*, c.userId
               FROM comments AS c 
               WHERE c.postId = ? 
               ORDER BY c.createdAt DESC`;

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

// Dodanie komentarza
export const addComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    // Użycie tokenu JWT do uwierzytelnienia użytkownika
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Firebase Authentication identyfikuje użytkownika za pomocą userInfo.uid
        const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Formatowanie daty
            userInfo.uid, // Używamy userInfo.uid, aby uzyskać userId z Firebase
            req.body.postId
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been created");
        });
    });
};
