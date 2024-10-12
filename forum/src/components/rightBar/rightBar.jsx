import { makeRequest } from "../../axios";
import { useQuery } from "react-query";
import { useAuth } from "../../context/AuthContext";
import "./rightBar.scss"
import { useContext } from "react";
import Suggest from "../suggest/Suggest";
import Invite from "../invite/Invite";

const RightBar = () => {
  const { currentUser } = useAuth();
  const userId = parseInt(currentUser.id);

  const { isLoading, error, data } = useQuery(["suggestions", userId], () =>
    makeRequest.get("/relationships/suggestions?userId="+userId).then((res)=>{
      return res.data;
    })
  );

  const { isLoading:iIsLoading, data: inviteData } = useQuery(["invite", userId], () =>
    makeRequest.get("/relationships/invite/"+userId).then((res)=>{
    return res.data;
  })
  );


  return (
  <div className="rightBar">
    <div className="container">
      <div className="item">
        <span>Propozycje dla ciebie</span>
        {isLoading? "loading"
        : data.map(suggestion=>( 
          <div className="suggest" key={suggestion.id}>
          <Suggest suggestion={suggestion}/>
          </div>
          ))}
        </div>
      <div className="item">
        <span>Ostatnie aktywności</span>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <p>
              <span>Lisek</span> changed the picture
            </p>
          </div>
          <span>1 minute ago</span>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <p>
              <span>Lisek</span> changed the picture
            </p>
          </div>
          <span>1 minute ago</span>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <p>
              <span>Lisek</span> changed the picture
            </p>
          </div>
          <span>1 minute ago</span>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <p>
              <span>Lisek</span> changed the picture
            </p>
          </div>
          <span>1 minute ago</span>
        </div>
      </div>
      <div className="item" id="invites">
        <span>Zaproszenia do znajomych</span>
        {iIsLoading? "loading" : (inviteData.map(invite=>(
          <div className="invite" key={invite.uId}>
            <Invite inviteData={invite}/>
          </div>
        )))}
      </div>
    </div>
  </div>
  );
};

export default RightBar;
