import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import moment from 'moment';

const Comments = ({ data, postId }) => {
    const [desc, setDesc] = useState("");
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [commentsWithProfilePics, setCommentsWithProfilePics] = useState([]);

    console.log("Current User:", currentUser); // Debugging: log currentUser
    console.log("photoURL:", currentUser.photoURL); // Debugging: log photoURL

    // Fetch user profile pics for comments
    useEffect(() => {
        const fetchProfilePics = async () => {
            const commentsWithPics = await Promise.all(
                data.map(async (comment) => {
                    const response = await makeRequest.get(`/user/${comment.userId}`);
                    return {
                        ...comment,
                        profilePic: response.data.photoURL || "/defaultProfilePic.png", // Ensure default if no pic\
                        displayName: response.data.displayName
                    };
                })
            );
            setCommentsWithProfilePics(commentsWithPics);
        };

        if (data.length > 0) {
            fetchProfilePics();
        }
    }, [data]);

    const mutation = useMutation((newComment) => {
        return makeRequest.post("/comments", newComment);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        },
    });

    const handleClick = async (e) => {
        e.preventDefault();
        mutation.mutate({
            userId: currentUser.uid, // Użycie userId z kontekstu
            desc,
            postId
        });
        setDesc("");
    };

    return (
        <div className="comments">
            <div className="write">
                <img src={currentUser.photoURL ? currentUser.photoURL : "/defaultProfilePic.png"} alt="" />
                <input 
                    type="text" 
                    placeholder="Napisz komentarz" 
                    onChange={e => setDesc(e.target.value)} 
                    value={desc} 
                />
                <button onClick={handleClick}>Wyślij</button>
            </div>
            {commentsWithProfilePics.map(comment => (
                <div className="comment" key={comment.id}>
                    <img src={comment.profilePic} alt="" />
                    <div className="info">
                        {console.log(comment)}
                        <span>{comment.displayName || "Użytkownik"}</span>
                        <p>{comment.desc}</p>
                    </div>
                    <span className="date">{moment(comment.createdAt).fromNow()}</span>
                </div>
            ))}
        </div>
    );
};

export default Comments;
