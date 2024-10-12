/*import { getAuth } from "firebase/auth";
import { firestore } from "./../firebase"; // Załaduj swoją konfigurację Firebase

export const getUserData = async (uid) => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken(); // Użyj getIdToken do autoryzacji

    const userRef = firestore.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        throw new Error("No such user!");
    }

    return { uid, ...doc.data() }; // Zakładając, że dokument ma pole `displayName` i `photoUrl`
};*/
