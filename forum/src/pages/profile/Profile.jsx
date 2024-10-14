import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Pobieramy dane z Firebase
import Update from "../../components/update/Update";
import { makeRequest } from "../../axios";

const Profile = () => {
    const [openUpdate, setOpenUpdate] = useState(false);
    const { currentUser } = useAuth(); // Pobieramy dane zalogowanego użytkownika z Firebase
    const userId = useLocation().pathname.split("/")[2]; // Pobieramy userId z URL
    const queryClient = useQueryClient();
    
    // Stan do przechowywania danych użytkownika i stanu ładowania
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true); // Nowy stan do kontroli ładowania użytkownika

    // Hook do pobrania danych użytkownika
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await makeRequest.get(`/user/${userId}`);
                // Wstawienie coverPic, website i city
                setUser({
                    ...response.data,
                    coverPhotoURL: response.data.coverPic,
                    website: response.data.website,
                    city: response.data.city,
                });
                console.log(currentUser)
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoadingUser(false); // Zmiana stanu ładowania po pobraniu danych
            }
        };

        fetchUserData();
    }, [userId]);

    const mutation = useMutation(
        (following) => {
            if (following) {
                return makeRequest.delete("/relationships?userId=" + userId);
            }
            return makeRequest.post("/relationships", { userId });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["relationship", userId]);
            },
        }
    );

    const handleFollow = () => {
        mutation.mutate(/* Wstaw tutaj logikę dla śledzenia */);
    };

    return (
        <div className="profile">
            {loadingUser ? ( // Sprawdź, czy dane użytkownika są w trakcie ładowania
                "Ładowanie użytkownika..."
            ) : (
                user ? ( // Sprawdź, czy użytkownik został załadowany
                    <>
                        <div className="images">
                            <img
                                src={user.coverPhotoURL || "/uploads/defaultCover.png"} // URL do okładki (jeśli nie ma, to default)
                                alt="cover"
                                className="cover"
                            />
                            <img
                                src={user.photoURL || "/uploads/defaultProfile.png"} // URL do zdjęcia profilowego (jeśli nie ma, to default)
                                alt="profilePic"
                                className="profilePic"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="profileContainer">
                            <div className="uInfo">
                                <div className="left">
                                    <a href="http://facebook.com">
                                        <FacebookTwoToneIcon fontSize="large" />
                                    </a>
                                    <a href="http://instagram.com">
                                        <InstagramIcon fontSize="large" />
                                    </a>
                                    <a href="http://twitter.com">
                                        <TwitterIcon fontSize="large" />
                                    </a>
                                    <a href="http://linkedin.com">
                                        <LinkedInIcon fontSize="large" />
                                    </a>
                                    <a href="http://pinterest.com">
                                        <PinterestIcon fontSize="large" />
                                    </a>
                                </div>
                                <div className="center">
                                    <span>{user.displayName || "Nazwa użytkownika"}</span>
                                    {userId === currentUser.uid ? (
                                        <button onClick={() => setOpenUpdate(true)}>
                                            Zaktualizuj
                                        </button>
                                    ) : (
                                        <button onClick={handleFollow}>
                                            {/* Dodaj odpowiednią logikę dla śledzenia */}
                                            Śledź użytkownika
                                        </button>
                                    )}
                                </div>
                                <div className="right">
                                    <div className="info">
                                        <div className="item">
                                            <PlaceIcon />
                                            <span>{user.city || "Brak lokalizacji"}</span>
                                        </div>
                                        <div className="item">
                                            <LanguageIcon />
                                            {user.website ? (
                                                <a
                                                    href={`http://${user.website}`}
                                                    style={{ textDecoration: "none" }}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {user.website}
                                                </a>
                                            ) : (
                                                <span>{"Brak strony"}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <EmailOutlinedIcon />
                                        <MoreVertIcon />
                                    </div>
                                </div>
                            </div>
                            <Posts userId={userId} />
                        </div>
                    </>
                ) : (
                    <div>Nie znaleziono użytkownika.</div> // Komunikat, jeśli nie znaleziono użytkownika
                )
            )}
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
        </div>
    );
};

export default Profile;
