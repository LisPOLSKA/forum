import { db } from "../firebase.js";
import jwt from "jsonwebtoken";

// Function to get user data with filtering options
export const getUser = async (req, res) => {
    const userId = req.params.userId;
    let debugInfo = {};  // Variable to store debugging information

    try {
        const userDoc = await db.collection("users").doc(userId).get(); // Fetch user document

        if (userDoc.exists) { // Check if the document exists
            const userData = userDoc.data(); // Get user data
            debugInfo.fetchedData = userData;  // Add fetched data to debug info
            const { password, ...info } = userData; // Exclude password
            return res.json({ info, auth: true, debug: debugInfo }); // Return user data and auth info
        } else {
            debugInfo.message = "User not found in Firestore.";
            return res.json({ auth: true, debug: debugInfo }); // Return only auth info
        }
    } catch (error) {
        debugInfo.error = error.message;
        return res.status(500).json({ message: "Error fetching user data", debug: debugInfo }); // Handle errors
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