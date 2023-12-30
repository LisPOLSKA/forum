import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { AuthContext } from "../../context/authContext";
import "./rightBar.scss"
import { useContext } from "react";

const RightBar = () => {
  const {currentUser} = useContext(AuthContext);
  const userId = parseInt(currentUser.id);

  const { isLoading, error, data } = useQuery(["suggestions"], () =>
    makeRequest.get("/relationships/suggestions?userId="+userId).then((res)=>{
      return res.data;
    })
  );

  const { isLoading:rIsLoading, data: relationshipData } = useQuery(["relationship"], () =>
    makeRequest.get("/relationships?followedUserId="+userId).then((res)=>{
    return res.data;
  })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(({datas: following, datas:suggestId})=>{
    if(following)   return makeRequest.delete("/relationships?userId="+ suggestId);
    return makeRequest.post("/relationships", {suggestId});
  },{
    onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = (suggestId)=>{
    mutation.mutate({datas: [relationshipData.includes(currentUser.id), suggestId]});
  };


  return (
  <div className="rightBar">
    <div className="container">
      <div className="item">
        <span>Propozycje dla ciebie</span>
        {isLoading? "loading"
        : data.map(suggestion=>( 
          <div className="user" key={suggestion.id}>
            <div className="userInfo">
              <img src={suggestion.profilePic} alt="" />
              <span>{suggestion.username}</span>
            </div>
            <div className="buttons">
            {/* {rIsLoading ? "loading" :  (<button onClick={handleFollow(suggestion.id)}>{relationshipData.includes(currentUser.id) ? "W znajomych" : "Zaproś do znajomych"}</button>)} */}
            </div>
          </div>))}
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
      <div className="item">
        <span>Znajomi Online</span>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <div className="online"/>
          <span>Lisek</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default RightBar;
