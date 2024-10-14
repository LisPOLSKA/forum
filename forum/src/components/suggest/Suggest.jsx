import "./suggest.scss";
import { useAuth } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

const Suggest = ({ suggestion }) => {
    const { currentUser } = useAuth();
    const userId = currentUser.uid;

    // ID zasugerowanego znajomego
    const suggestedFriendId = suggestion.potential_friend;

    // Pobieranie relacji użytkownika
    const { isLoading: rIsLoading, data: relationshipData } = useQuery(["relationship"], () =>
        makeRequest.get(`/relationships?followedUserId=${userId}`).then(res => res.data)
    );

    // Pobieranie danych użytkownika na podstawie suggestedFriendId
    const { isLoading: userLoading, data: userData } = useQuery(["user", suggestedFriendId], () =>
        makeRequest.get(`/user/${suggestedFriendId}`).then(res => res.data)
    );

    const queryClient = useQueryClient();

    // Zaproszenie/Usunięcie znajomego
    const mutation = useMutation((following) => {
        if (following) {
            return makeRequest.delete(`/relationships?userId=${suggestedFriendId}`);
        }
        return makeRequest.post("/relationships", { userId: suggestedFriendId });
    }, {
        onSuccess: () => {
            // Odświeżenie listy znajomych i propozycji po sukcesie
            queryClient.invalidateQueries(["relationship"]);
            queryClient.invalidateQueries(["suggestions"]);
        },
    });

    const handleFollow = () => {
        const isAlreadyFriend = relationshipData?.some(friend => friend.userId2 === suggestedFriendId);
        mutation.mutate(isAlreadyFriend);
        console.log("Chcę zaprosić:", suggestedFriendId);
    };

    return (
        <div className="user">
            <div className="userInfo">
                {userLoading ? (
                    "Loading user data..."
                ) : (
                    <>
                        <Link to={`/profile/${userData.uid}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <img src={userData?.photoURL} alt={userData?.displayName} />
                        <span>{userData?.displayName}</span>
                        </Link>
                    </>
                )}
            </div>
            <div className="buttons">
                {rIsLoading || userLoading ? "Loading..." : (
                    <button onClick={handleFollow}>
                        {relationshipData?.some(friend => friend.userId2 === suggestedFriendId) ? "W znajomych" : "Zaproś do znajomych"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Suggest;
