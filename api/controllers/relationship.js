import { db } from "../connect.js"; // Import bazy danych

// Pobranie znajomości
export const getRelationships = (req, res) => {
    const userId = req.user.uid; // Pobranie userId z Firebase Authentication

    const q = `
        SELECT CASE 
            WHEN r.userId1 = ? THEN r.userId2 
            WHEN r.userId2 = ? THEN r.userId1 
        END AS friendId 
        FROM relationships AS r 
        WHERE status = 'accept' 
        AND (r.userId1 = ? OR r.userId2 = ?)
    `;

    db.query(q, [userId, userId, userId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship => relationship.friendId));
    });
};

// Dodanie znajomości
export const addRelationship = (req, res) => {
    const userId = req.body.userId; // ID użytkownika do dodania relacji
    const currentUserId = req.user.uid; // Pobranie userId z Firebase Authentication

    if (!userId) return res.status(400).json("User ID is required");

    const q = "INSERT INTO relationships (`userId1`, `userId2`) VALUES (?)";
    const values = [currentUserId, userId]; // Aktualny użytkownik dodaje znajomość

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Zaproszenie zostało wysłane");
    });
};

// Usunięcie znajomości
export const deleteRelationship = (req, res) => {
    const userId = req.body.userId; // ID użytkownika do usunięcia znajomości
    const currentUserId = req.user.uid; // Pobranie userId z Firebase Authentication

    if (!userId) return res.status(400).json("User ID is required");

    const q = `
        DELETE FROM relationships 
        WHERE (userId1 = ? AND userId2 = ?) OR (userId2 = ? AND userId1 = ?)
    `;

    db.query(q, [currentUserId, userId, currentUserId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Znajomość została usunięta");
    });
};

// Pobranie sugestii znajomości
export const getSuggestions = (req, res) => {
    const userId = req.user.uid; // Pobranie userId z Firebase Authentication

    // Pobieranie sugestii bez korzystania z tabeli `users`, ponieważ dane użytkowników są w Firebase
    const q = `
        SELECT DISTINCT r1.userId2 AS suggestedUserId
        FROM relationships AS r1
        JOIN relationships AS r2 ON r1.userId1 = r2.userId2
        LEFT JOIN relationships AS r ON (r1.userId2 = r.userId1 OR r1.userId2 = r.userId2)
        WHERE (r1.userId1 = ? OR r2.userId1 = ?)
        AND r.id IS NULL 
        AND r1.userId2 != ? 
        AND r1.status = 'accept'
        AND r2.status = 'accept'
    `;

    db.query(q, [userId, userId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data); // Lista sugerowanych znajomości
    });
};

// Pobranie zaproszeń
export const getInvite = (req, res) => {
    const userId = req.user.uid; // Pobranie userId z Firebase Authentication

    const q = `
        SELECT r.userId1 AS inviterId
        FROM relationships AS r
        WHERE r.userId2 = ? 
        AND r.status = 'pending'
    `;

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data); // Lista zaproszeń
    });
};

// Akceptacja znajomości
export const acceptRelationship = (req, res) => {
    const userId = req.body.userId; // ID użytkownika, który wysłał zaproszenie
    const currentUserId = req.user.uid; // Pobranie userId z Firebase Authentication

    if (!userId) return res.status(400).json("User ID is required");

    const q = `
        UPDATE relationships 
        SET status = 'accept' 
        WHERE (userId1 = ? AND userId2 = ?) 
        AND status = 'pending'
    `;

    db.query(q, [userId, currentUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Zaproszenie zostało zaakceptowane");
    });
};
