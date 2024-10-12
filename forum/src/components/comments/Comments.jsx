import { useContext, useState } from "react";
import "./comments.scss"
import { AuthProvider } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import moment from 'moment';

const Comments = ({data},{postId}) => {
  const [desc, setDesc] = useState("");

  const {currentUser} = useContext(AuthProvider);

  const queryClient = useQueryClient()

  const mutation = useMutation((newComment)=>{
      return makeRequest.post("/comments", newComment);
  },{
      onSuccess: () => {
          queryClient.invalidateQueries(["comments"]);
      },
  });

  const handleClick = async (e)=>{
      e.preventDefault();
      mutation.mutate({desc, postId});
      setDesc("");
  };

  return (
    <div className="comments">
        <div className="write">
            <img src={"/upload/"+currentUser.profilePic} alt="" />
            <input type="text" placeholder="Napisz komentarz" onChange={e=>setDesc(e.target.value)} value={desc}/>
            <button onClick={handleClick}>Wyślij</button>
        </div>
        {data.map(comment=>(
            <div className="comment" key={comment.id}>
                <img src={"/upload/"+comment.profilePic} alt="" />
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
