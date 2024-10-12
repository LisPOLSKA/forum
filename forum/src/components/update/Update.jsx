import { useState } from "react";
import "./update.scss";
import { useQueryClient } from "react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase functions
import { storage, db } from "../../../firebase"; // Import Firestore instance
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import { doc, setDoc } from "firebase/firestore"; // Firestore methods

const Update = ({ setOpenUpdate, user }) => {
    const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth(); // Hook from AuthContext
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
        email: user.email || "",
        password: "", // Do not prefill password for security reasons
        username: user.displayName || "", // Use displayName instead of username
        city: user.city || "",
        website: user.website || "",
    });

    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(`Field ${e.target.name} updated to:`, e.target.value); // Debugging line
    };

    const queryClient = useQueryClient();

    // Firebase file upload function
    const uploadFileToFirebase = async (file, path) => {
        if (!file) return null;
        console.log(`Uploading file to ${path}:`, file.name); // Debugging line
        try {
            const storageRef = ref(storage, `${path}/${file.name}`); // Create a storage reference
            const uploadTask = uploadBytesResumable(storageRef, file); // Upload the file
            const downloadURL = await getDownloadURL(await uploadTask); // Get the file's download URL
            console.log(`File uploaded successfully. Download URL: ${downloadURL}`); // Debugging line
            return downloadURL;
        } catch (err) {
            console.error("Error uploading file to Firebase:", err);
            return null;
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        console.log("Update button clicked"); // Debugging line
        try {
            // Upload files to Firebase and get URLs
            const coverUrl = cover ? await uploadFileToFirebase(cover, "covers") : user.coverPic || null;
            const profileUrl = profile ? await uploadFileToFirebase(profile, "profiles") : user.profilePic || null;
            console.log("Cover URL:", coverUrl); // Debugging line
            console.log("Profile URL:", profileUrl); // Debugging line

            // Prepare updated user data
            const updatedUserData = {
                coverPic: coverUrl,
                profilePic: profileUrl,
                city: texts.city || "", // Ensure city is not undefined
                website: texts.website || "", // Ensure website is not undefined
            };
            console.log("Updated user data:", updatedUserData);

            // Update Firebase Authentication details
            if (currentUser.providerData.some(provider => provider.providerId === 'google.com')) {
                // For Google users: Only update username, city, and website
                await updateUserProfile({
                    displayName: texts.username,
                    photoURL: profileUrl || currentUser.photoURL, // Update profile pic if changed
                });
                console.log("Google user profile updated."); // Debugging line
            } else {
                // For email/password users: Update email and password if provided
                if (texts.email !== currentUser.email) {
                    await updateUserEmail(texts.email); // Update email if changed
                    console.log("Email updated to:", texts.email); // Debugging line
                }
                if (texts.password) {
                    await updateUserPassword(texts.password); // Update password if provided
                    console.log("Password updated."); // Debugging line
                }
                await updateUserProfile({
                    displayName: texts.username,
                    photoURL: profileUrl || currentUser.photoURL, // Update profile pic if changed
                });
                console.log("Email/password user profile updated."); // Debugging line
            }

            // Save additional fields to Firestore (city, website, coverPic, profilePic)
            const userDocRef = doc(db, "users", currentUser.uid); // Create a reference to the user's document in Firestore
            await setDoc(userDocRef, updatedUserData, { merge: true }); // Merge with existing data
            console.log("User document updated in Firestore."); // Debugging line

            setOpenUpdate(false); // Close modal
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    };

    // Function to determine which profile picture to display
    const getProfilePic = () => {
        if (profile) {
            console.log("Using newly selected profile picture."); // Debugging line
            return URL.createObjectURL(profile); // User selected a new picture
        } else if (currentUser.photoURL) {
            console.log("Using existing profile picture from currentUser."); // Debugging line
            return currentUser.photoURL; // Show current picture from Firebase
        } else {
            console.log("Using default profile picture."); // Debugging line
            return "path/to/defaultProfilePic.jpg"; // Show default picture if none is set
        }
    };

    return (
        <div className="update">
            <div className="wrapper">
                <h1>Zaktualizuj swój profil</h1>
                <form onSubmit={handleClick}>
                    <div className="files">
                        <label htmlFor="cover">
                            <span>Zdjęcie w tle</span>
                            <div className="imgContainer">
                                <img src={cover ? URL.createObjectURL(cover) : user.coverPic} alt="cover" />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="cover"
                            style={{ display: "none" }}
                            onChange={(e) => setCover(e.target.files[0])}
                            accept="image/png, image/gif, image/jpeg"
                        />
                        <label htmlFor="profile">
                            <span>Zdjęcie profilowe</span>
                            <div className="imgContainer">
                                <img src={getProfilePic()} alt="profile" />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profile"
                            style={{ display: "none" }}
                            onChange={(e) => setProfile(e.target.files[0])}
                            accept="image/png, image/gif, image/jpeg"
                        />
                    </div>

                    {currentUser.providerData.some(provider => provider.providerId !== 'google.com') && (
                        <>
                            <label>Email</label>
                            <input 
                                type="text" 
                                value={texts.email} 
                                name="email" 
                                onChange={handleChange} 
                                placeholder={user.email || "Wprowadź nowy e-mail"} 
                            />
                            <label>Hasło</label>
                            <input
                                type="password"
                                value={texts.password}
                                name="password"
                                onChange={handleChange}
                                placeholder="Zmień hasło" // Hasło nie powinno być prefillowane
                            />
                        </>
                    )}

                    <label>Nazwa użytkownika</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={texts.username} 
                        onChange={handleChange} 
                        placeholder={user.displayName || "Wprowadź nową nazwę użytkownika"} 
                    />
                    <label>Kraj lub miasto</label>
                    <input 
                        type="text" 
                        name="city" 
                        value={texts.city} 
                        onChange={handleChange} 
                        placeholder={user.city || "Wprowadź miasto"} 
                    />
                    <label>Strona internetowa</label>
                    <input 
                        type="text" 
                        name="website" 
                        value={texts.website} 
                        onChange={handleChange} 
                        placeholder={user.website || "Wprowadź stronę internetową"} 
                    />
                    <button type="submit">Zaktualizuj</button>
                </form>
                <button className="close" onClick={() => setOpenUpdate(false)}>Zamknij</button>
            </div>
        </div>
    );
};

export default Update;
