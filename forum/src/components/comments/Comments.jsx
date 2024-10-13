import { useContext, useState } from "react";
import "./comments.scss";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import moment from 'moment';

const Comments = ({ data, postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  console.log("Current User:", currentUser); // Debugging: log currentUser

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
            {/* Debugging: log the photoUrl */}
            {console.log("currentUser:",currentUser)} 
            {console.log("photoUrl:",currentUser.photoURL)} 
            <img src={currentUser.photoURL ? currentUser.photoURL : "/defaultProfilePic.png"} alt="" />
            <input 
                type="text" 
                placeholder="Napisz komentarz" 
                onChange={e => setDesc(e.target.value)} 
                value={desc} 
            />
            <button onClick={handleClick}>Wyślij</button>
        </div>
        {data.map(comment => (
            <div className="comment" key={comment.id}>
                {console.log(comment)}
                <img src={comment.profilePic ? `/upload/${comment.profilePic}` : "/defaultProfilePic.png"} alt="" />
                <div className="info">
                    <span>{comment.username}</span>
                    <p>{comment.desc}</p>
                </div>
                <span className="date">{moment(comment.createdAt).fromNow()}</span>
            </div>
        ))}
    </div>
  );
};

export default Comments;
