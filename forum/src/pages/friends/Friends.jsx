import { useQuery } from "react-query";
import "./friends.scss";
import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { makeRequest } from "../../axios";
import Invite from "../../components/invite/Invite";
import Suggest from "../../components/suggest/Suggest";

const Friends = () => {
  const {currentUser} = useAuth();
  const userId = parseInt(currentUser.uid);

  const { isLoading:iIsLoading, data: inviteData } = useQuery(["invite", userId], () =>
    makeRequest.get("/relationships/invite/"+userId).then((res)=>{
    return res.data;
  })
  );

  const { isLoading, error, data } = useQuery(["suggestions", userId], () =>
    makeRequest.get("/relationships/suggestions?userId="+userId).then((res)=>{
      return res.data;
    })
  );

  return (
    <div className="friends">
        Invite
        <div className="invites">
          {iIsLoading? "loading" : (inviteData.map(invite=>(
            <div className="invite" key={invite.uId}>
              <Invite inviteData={invite}/>
            </div>
          )))}
        </div>
        <div className="suggestions">
          {isLoading? "loading"
          : data.map(suggestion=>( 
            <div className="suggest" key={suggestion.id}>
            <Suggest suggestion={suggestion}/>
            </div>
            ))}
        </div>
    </div>
  );
};

export default Friends;
