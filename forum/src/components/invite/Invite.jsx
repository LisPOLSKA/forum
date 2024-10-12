import "./invite.scss"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

const Invite = (inviteData) => {
  const inviteDatas = inviteData.inviteData;
  const userIdd = parseInt(inviteDatas.uId);

  const queryClient = useQueryClient();

  const mutation = useMutation((action)=>{
    if(!action)   return makeRequest.delete("/relationships?userId="+ userIdd);
    return makeRequest.post("/relationships/accept", {userId: userIdd});
  },{
    onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = () => {
    mutation.mutate(true);
    console.log("follow");
  }
  const handleReject = () => {
    mutation.mutate(false);
    console.log("reject");
  }




  return (
    <>
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+inviteDatas.profilePic} alt="" />
            <div className="online"/>
            <span>{inviteDatas.username}</span>
          </div>
          <div className="buttons">
              <>
                <button onClick={handleFollow}>Zakceptuj zaprosznie</button>
                <button onClick={handleReject}>Odrzuć zaproszenie</button> 
              </>
          </div>
        </div>
    </>
  );
};

export default Invite;
