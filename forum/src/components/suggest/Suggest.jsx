import "./suggest.scss"
import { useContext } from "react";
import { AuthProvider } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

const Suggest = (suggestion) => {

    const datas = suggestion.suggestion;

    const {currentUser} = useContext(AuthProvider);
    const userId = parseInt(currentUser.id);

  const { isLoading:rIsLoading, data: relationshipData } = useQuery(["relationship"], () =>
    makeRequest.get("/relationships?followedUserId="+userId).then((res)=>{
    return res.data;
  })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation((following)=>{
    if(following)   return makeRequest.delete("/relationships?userId="+ datas.id);
    return makeRequest.post("/relationships", {userId: datas.id});
  },{
    onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = (suggestId)=>{
    mutation.mutate(relationshipData.includes(currentUser.id));
    console.log("chce zaprosic");
  };



  return(
  <>
    <div className="user">
        <div className="userInfo">
            <img src={datas.profilePic} alt="" />
            <span>{datas.username}</span>
        </div>
        <div className="buttons">
            {rIsLoading ? "loading" :  (<button onClick={handleFollow}>{relationshipData.includes(currentUser.id) ? "W znajomych" : "Zaproś do znajomych"}</button>)}
        </div>
    </div>
  </>
  );
};

export default Suggest;
