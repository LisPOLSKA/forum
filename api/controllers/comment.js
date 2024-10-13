import { db } from "../connect.js";
import moment from "moment";

// Pobranie komentarzy
export const getComments = (req, res) => {
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
    const { userId, desc, postId } = req.body; // Pobieranie userId z body

    if (!userId) return res.status(400).json("User ID is required."); // Sprawdzenie, czy userId jest podane
    if (!postId || !desc) return res.status(400).json("Post ID and description are required."); // Sprawdzenie innych wymaganych danych

    const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
    const values = [
        desc,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userId, // Użycie userId z body
        postId
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment has been created");
    });
};
