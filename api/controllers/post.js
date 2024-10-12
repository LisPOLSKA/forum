import moment from "moment";
import { db } from "../connect.js";

export const getPosts = (req, res) => {
    const userId = req.user.uid; // Pobierane z Firebase Authentication
    const { friends, userId: requestedUserId } = req.query; // Pobieranie zapytań

    let q;
    let values;

    if (requestedUserId) {
        // Gdy podano userId, pobierz posty tylko dla tego użytkownika
        q = `
            SELECT p.desc, p.id, p.img, p.category, p.userId
            FROM posts p
            WHERE p.userId = ?
        `;
        values = [requestedUserId];
    } else if (friends) {
        // Zapytanie do pobrania postów od znajomych
        q = `
            SELECT p.desc, p.id, p.img, p.category, p.userId
            FROM posts p
            JOIN relationships r ON (p.userId = r.userId1 OR p.userId = r.userId2)
            WHERE (r.userId1 = ? OR r.userId2 = ?)
            AND r.status = 'accept'
            AND p.userId != ?
        `;
        values = [userId, userId, userId];
    } else {
        // Gdy nie podano userId ani friends, można zwrócić wszystkie posty (lub dostosować zgodnie z wymaganiami)
        q = `
            SELECT p.desc, p.id, p.img, p.category, p.userId
            FROM posts p
            WHERE p.userId = ?
        `;
        values = [userId];
    }

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const addPost = (req, res) => {
    const userId = req.user.uid;
    const img = req.body.img;

    console.log("Image URL received in backend:", img); // Logowanie otrzymanej wartości img

    const q = "INSERT INTO posts (`desc`,`img`,`createdAt`,`userId`,`category`) VALUES (?)";
    const values = [
        req.body.desc,
        img,  // Wartość otrzymana z frontendu
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userId,
        `testowy`
    ];

    console.log("Values being inserted:", values); // Logowanie wartości przed zapytaniem SQL

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error("Error while adding post:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Post has been created");
    });
};

export const deletePost = (req, res) => {
    const userId = req.user.uid;  // Użycie Firebase userId

    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";
    db.query(q, [req.params.id, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
        return res.status(403).json("Możesz usunąć tylko swoje posty!");
    });
};
