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
    const currentUserId = req.body.uid;

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

    // Zaktualizowane zapytanie SQL do bazy danych
    const q = `
        -- Krok 1: Znalezienie bezpośrednich znajomych użytkownika
        WITH direct_friends AS (
            SELECT 
                CASE 
                    WHEN r.userId1 = ? THEN r.userId2
                    ELSE r.userId1
                END AS friend
            FROM relationships r
            WHERE 
                (r.userId1 = ? OR r.userId2 = ?)
                AND r.status = 'accept'
        )

        -- Krok 2: Znalezienie potencjalnych znajomych (znajomych znajomych), wykluczając samego użytkownika
        SELECT DISTINCT 
            CASE 
                WHEN r.userId1 = df.friend THEN r.userId2
                ELSE r.userId1
            END AS potential_friend
        FROM direct_friends df
        JOIN relationships r ON (r.userId1 = df.friend OR r.userId2 = df.friend)
        WHERE 
            r.status = 'accept'
            AND (r.userId1 != ? AND r.userId2 != ?)
            AND NOT EXISTS (
                SELECT 1
                FROM relationships rel_check
                WHERE 
                    (
                        (rel_check.userId1 = 
                            CASE 
                                WHEN r.userId1 = df.friend THEN r.userId2
                                ELSE r.userId1
                            END
                        AND rel_check.userId2 = ?)
                        OR
                        (rel_check.userId2 = 
                            CASE 
                                WHEN r.userId1 = df.friend THEN r.userId2
                                ELSE r.userId1
                            END
                        AND rel_check.userId1 = ?)
                    )
                    AND rel_check.status IN ('pending', 'accept')
            );
    `;

    // Wykonanie zapytania w bazie danych
    db.query(q, [userId, userId, userId, userId, userId, userId, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching suggestions' });
        }

        // Zwrócenie wyników
        res.status(200).json(results);
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
    const userId = req.body.userId; // ID of the user who sent the invitation
    const currentUserId = req.user.uid; // Get the current user's ID

    if (!userId) return res.status(400).json("User ID is required");

    const q = `
        UPDATE relationships 
        SET status = 'accept' 
        WHERE (userId1 = ? AND userId2 = ?) 
           OR (userId1 = ? AND userId2 = ?)
        AND status = 'pending'
    `;

    db.query(q, [userId, currentUserId, currentUserId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Zaproszenie zostało zaakceptowane");
    });
};

