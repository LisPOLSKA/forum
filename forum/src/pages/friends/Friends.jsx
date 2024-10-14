import { useQuery } from "react-query";
import "./friends.scss";
import { useAuth } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import Invite from "../../components/invite/Invite";
import Suggest from "../../components/suggest/Suggest";

const Friends = () => {
  const { currentUser } = useAuth();
  const userId = parseInt(currentUser.uid);

  const { isLoading: invitesLoading, data: inviteData } = useQuery(
    ["invite", userId],
    () => makeRequest.get(`/relationships/invite/${userId}`).then((res) => res.data)
  );

  const { isLoading: suggestionsLoading, data: suggestionsData } = useQuery(
    ["suggestions", userId],
    () => makeRequest.get(`/relationships/suggestions?userId=${userId}`).then((res) => res.data)
  );

  return (
    <div className="friends">
      <div className="invites header">Invites</div>
      <div className="invites">
        {invitesLoading ? (
          "Loading..."
        ) : (
          inviteData.map((invite) => (
            <div className="invite" key={invite.uId}>
              <Invite inviteData={invite} />
            </div>
          ))
        )}
      </div>
      <div className="suggestions header">Suggestions</div>
      <div className="suggestions">
        {suggestionsLoading ? (
          "Loading..."
        ) : (
          suggestionsData.map((suggestion) => (
            <div className="suggest" key={suggestion.id}>
              <Suggest suggestion={suggestion} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
