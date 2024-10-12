import { db } from "../firebase.js";
import jwt from "jsonwebtoken";

// Function to get user data with filtering options
export const getUser = async (req, res) => {
    const userId = req.params.userId;
    let debugInfo = {};  // Zmienna do przechowywania danych debugowania

    try {
        const userDoc = await db.collection("users").doc(userId).get(); // Zmiana: dodano await

        if (!userDoc.exists) { // Zmiana: sprawdzamy, czy dokument istnieje
            debugInfo.message = "User not found in Firestore.";
            return res.status(404).json({ message: "User not found", debug: debugInfo });
        }

        const userData = userDoc.data(); // Pobierz dane użytkownika
        debugInfo.fetchedData = userData;  // Dodajemy dane użytkownika do debugowania
        debugInfo.querySnapshot = userData; // Dodaj querySnapshot do debugInfo (możesz dostosować to)

        const { password, ...info } = userData;
        return res.json({ info, userDoc, debug: debugInfo }); // Zwracamy dane i debugInfo
    } catch (error) {
        debugInfo.error = error.message;
        return res.status(500).json({ message: "Error fetching user data", debug: debugInfo });
    }
};


// Function to update user data
export const updateUser = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const userId = userInfo.id;

        try {
            // Update user data in Firestore using userId
            const userRef = db.collection("users").doc(userId);
            await userRef.update({
                username: req.body.username,
                city: req.body.city,
                website: req.body.website,
                profilePic: req.body.profilePic,
                coverPic: req.body.coverPic,
            });

            console.log(`User with ID ${userId} updated successfully`);
            return res.json("User updated successfully!");
        } catch (error) {
            console.error("Error updating user data:", error);
            return res.status(500).json("Error updating user data");
        }
    });
};