import Posts from "../../components/posts/Posts"
import Stories from "../../components/stories/Stories"
import Share from "../../components/share/share"
import "./home.scss"
import { useAuth } from "../../context/AuthContext"
import { useState, useEffect } from "react"

const Home = () => {
  const {currentUser} = useAuth();
  const [userId, setUserId] = useState(null);
    useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.uid); // Ustaw userId
    } else {
      setUserId(null); // Resetuj userId, gdy użytkownik nie jest zalogowany
    }
  }, [currentUser]);
  return (
    <div className="home">
      <Stories/>
      <Share/>
      {currentUser ? (
        <Posts />
      ) : (
        <div>Musisz być zalogowany, aby zobaczyć posty.</div>
      )}
    </div>
  )
}

export default Home