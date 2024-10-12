import "./post.scss";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import moment from 'moment';
import { useQuery, useQueryClient, useMutation } from "react-query";
import { makeRequest } from "../../axios";
import { useAuth } from "../../context/AuthContext"; 

const Post = ({ post }) => {
    const [commentOpen, setCommentOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const { currentUser } = useAuth();

    console.log("Rendering Post Component. Post data:", post); // Logowanie danych posta

    const { isLoading: likesLoading, data: likesData = [] } = useQuery(["likes", post.id], () => {
        console.log("Fetching likes for post ID:", post.id); // Logowanie ID posta
        return makeRequest.get("/likes?postId=" + post.id).then((res) => {
            return res.data;
        });
    });

    const queryClient = useQueryClient();

    const mutation = useMutation((liked) => {
        console.log("Mutating like status. Liked:", liked); // Logowanie statusu polubienia
        if (liked) return makeRequest.delete("/likes?postId=" + post.id);
        return makeRequest.post("/likes", { postId: post.id });
    }, {
        onSuccess: () => {
            console.log("Like mutation successful. Invalidating likes query.");
            queryClient.invalidateQueries(["likes"]);
        },
    });

    const deleteMutation = useMutation((postId) => {
        console.log("Deleting post with ID:", postId); // Logowanie ID posta do usunięcia
        return makeRequest.delete("/posts/" + postId);
    }, {
        onSuccess: () => {
            console.log("Post deletion successful. Invalidating posts query.");
            queryClient.invalidateQueries(["posts"]);
        },
    });

    const handleLike = () => {
        console.log("Handling like. Current user ID:", currentUser.uid); // Logowanie ID aktualnego użytkownika
        mutation.mutate(likesData.includes(currentUser.uid));
    };

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    };

    // Funkcja do pobierania danych użytkownika
    useEffect(() => {
        const fetchUserData = async (uid) => {
            console.log("Fetching user data for UID:", uid); // Logowanie UID użytkownika
            try {
                const response = await makeRequest.get(`/user/${uid}`);
                setUserData(response.data);
                console.log("User data fetched successfully:", response.data); // Logowanie danych użytkownika
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };        

        if (post.userId) {
            fetchUserData(post.userId);
        }
    }, [post.userId]);

    const { isLoading: cIsLoading, data: cData } = useQuery(["comments", post.id], () => {
        console.log("Fetching comments for post ID:", post.id); // Logowanie ID posta przy pobieraniu komentarzy
        return makeRequest.get("/comments?postId=" + post.id).then((res) => {
            return res.data;
        });
    });

    return (
        <div className="post">
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={userData?.photoURL || "/defaultProfile.png"} alt="User" />
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <span className="name">{userData?.displayName || "Loading..."}</span>
                            </Link>
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <div className="menuContainer">
                        <MoreHorizIcon 
                            onClick={() => {
                                setMenuOpen((prev) => !prev);
                                console.log("Menu toggled. Current state:", !menuOpen); 
                            }} 
                        />
                        {menuOpen && post.userId === currentUser.uid && (
                            <div className="menu">
                                {console.log("Menu is open. Current user ID:", currentUser.uid, "Post user ID:", post.userId)}
                                <button onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    {post.img && (
                        <img 
                            src={`/upload/${post.img}`}  // Zmiana ścieżki
                            alt="" 
                            onLoad={() => console.log("Image loaded")} 
                            onError={() => console.error("Image failed to load")} 
                        />
                    )}
                </div>
                <div className="info">
                    <div className="item">
                        {likesLoading ? (
                            "loading"
                        ) : likesData.includes(currentUser.uid) ? (
                            <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
                        ) : (
                            <FavoriteBorderOutlinedIcon onClick={handleLike} />
                        )}
                        {likesData?.length} Likes
                    </div>
                    <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                        <TextsmsOutlinedIcon />
                        {cIsLoading ? "loading" : cData.length} komentarzy
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                        Share
                    </div>
                </div>
                {commentOpen && (cIsLoading ? "loading" : <Comments data={cData} postId={post.id} />)}
            </div>
        </div>
    );
};

export default Post;
