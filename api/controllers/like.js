import { db } from "../connect.js";

// Pobieranie lajków
export const getLikes = (req, res) => {
    const q = "SELECT userId FROM likes WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(like => like.userId));
    });
};

// Dodawanie lajków
export const addLike = async (req, res) => {
    try {
        const { userId, postId } = req.body;

        if (!userId || !postId) {
            return res.status(400).json("Missing userId or postId.");
        }

        const q = "INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)";
        const values = [userId, postId];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been liked.");
        });
    } catch (error) {
        return res.status(500).json("Server error");
    }
};

// Usuwanie lajków
export const deleteLike = async (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).json("Missing userId or postId.");
    }

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
    db.query(q, [userId, postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been disliked.");
    });
};
