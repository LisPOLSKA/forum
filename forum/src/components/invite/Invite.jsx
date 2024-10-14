import "./invite.scss";
import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../context/AuthContext"; // Get current user from AuthContext

const Invite = ({ inviteData }) => {
  const inviterId = inviteData.inviterId; // inviterId from inviteData
  const { currentUser } = useAuth(); // Get the current user from context
  const currentUserId = currentUser.uid; // Get the current user's ID

  const queryClient = useQueryClient();

  // Fetch user data based on inviterId
  const { isLoading, data: inviterData } = useQuery(["user", inviterId], () =>
    makeRequest.get(`/user/${inviterId}`).then((res) => res.data)
  );

  // Mutation to accept or reject the relationship
  const mutation = useMutation((action) => {
    if (!action) {
      console.log(inviterId, currentUserId);
      return makeRequest.delete(`/relationships`, {
        data: {
          userId: inviterId, // Assuming inviterId is the user you want to delete
          uid: currentUserId, // This is the current user's ID
        },
      });
    }
    // Send both the inviter's ID and current user's ID when accepting
    return makeRequest.post("/relationships/accept", {
      userId: inviterId,
      currentUserId: currentUserId, // Pass the current user ID
    });
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship"]); // Refresh relationships
      queryClient.invalidateQueries(["invites"]); // Refresh invites list
    },
  });

  const handleAccept = () => {
    mutation.mutate(true); // Accept the invitation
    console.log("Invitation accepted for:", inviterId);
  };

  const handleReject = () => {
    mutation.mutate(false); // Reject the invitation
    console.log("Invitation rejected for:", inviterId);
  };

  return (
    <div className="user">
      <div className="userInfo">
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <img src={inviterData?.photoURL || "/defaultProfilePic.jpg"} alt={inviterData?.displayName} />
            <div className="online" />
            <span>{inviterData?.displayName}</span>
          </>
        )}
      </div>
      <div className="buttons">
        <>
          <button onClick={handleAccept}>Accept Invite</button>
          <button onClick={handleReject}>Reject Invite</button>
        </>
      </div>
    </div>
  );
};

export default Invite;
