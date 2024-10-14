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

    // Fetch likes for the post
    const { isLoading: likesLoading, data: likesData = [] } = useQuery(["likes", post.id], () => {
        return makeRequest.get("/likes?postId=" + post.id).then((res) => res.data);
    });

    const queryClient = useQueryClient();

    // Mutation to add or remove like
    const mutation = useMutation(({ liked, userId, postId }) => {
        if (liked) return makeRequest.delete(`/likes?postId=${postId}`);
        return makeRequest.post("/likes", { postId, userId });
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["likes"]);
        },
    });

    // Mutation to delete a post
    const deleteMutation = useMutation(({ userId, postId }) => {
        return makeRequest.delete("/likes", { data: { userId, postId } }); // Ensure to send userId and postId in the body
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["likes"]); // Refresh likes after deletion
        },
    });
    

    const handleLike = () => {
        const liked = likesData.includes(currentUser.uid);
        console.log("Liked:", liked, "Post ID:", post.id); // Debug log to check if `liked` is detected properly
        console.log("Current Likes Data:", likesData); // Log current likes data
        console.log("Current User ID:", currentUser.uid); // Log current user ID
    
        if (liked) {
            deleteMutation.mutate({
                userId: currentUser.uid,
                postId: post.id
            });
        } else {
            mutation.mutate({
                liked,
                userId: currentUser.uid,
                postId: post.id
            });
        }
    };
    
    

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    };
    const handleEdit = () => {
        console.log("spierdalaj nie ma edycji");
    }
    // Fetch user data based on userId
    useEffect(() => {
        const fetchUserData = async (uid) => {
            try {
                const response = await makeRequest.get(`/user/${uid}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };        

        if (post.userId) {
            fetchUserData(post.userId);
        }
    }, [post.userId]);

    const { isLoading: cIsLoading, data: cData } = useQuery(["comments", post.id], () => {
        return makeRequest.get("/comments?postId=" + post.id).then((res) => res.data);
    });

    return (
        <div className="post">
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={userData?.photoURL || "/defaultProfile.png"} alt="User" referrerpolicy="no-referrer"/>
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <span className="name">{userData?.displayName || "Loading..."}</span>
                            </Link>
                            {console.log(post.createdAt)}
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <div className="menuContainer">
                        <MoreHorizIcon 
                            onClick={() => setMenuOpen((prev) => !prev)} 
                            className="menuCollapse"
                        />
                        {menuOpen && post.userId === currentUser.uid && (
                            <div className="menu">
                                <button onClick={handleDelete}>Delete</button>
                                <button onClick={handleEdit} className="edit">Edit</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    {post.img && (
                        <img 
                            src={`/upload/${post.img}`}  
                            alt="" 
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
                        {cIsLoading ? "loading" : cData.length} Comments
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
