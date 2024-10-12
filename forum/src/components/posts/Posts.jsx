import { useQuery } from "react-query";
import { makeRequest } from "../../axios"; // Upewnij się, że to jest właściwy plik
import Post from "../post/Post";
import "./posts.scss";
import { useAuth } from "../../context/AuthContext";

const Posts = ({ userId }) => {
    console.log('userId w Posts:', userId);
    const { currentUser } = useAuth();

    // Ustal effectiveUserId w zależności od tego, czy userId jest podany
    const effectiveUserId = userId || currentUser.uid; 
    console.log("Effective userId: ", effectiveUserId);

    // Funkcja do pobierania postów
    const { isLoading, error, data } = useQuery(["posts", effectiveUserId], async () => {
        if (userId) {
            // Gdy userId jest podany, pobierz posty tylko dla tego użytkownika
            try {
                const response = await makeRequest.get(`/posts?userId=${userId}`);
                console.log("Posty dla userId:", userId, "Odpowiedź serwera:", response.data); // Logowanie odpowiedzi
                return response.data;
            } catch (err) {
                console.error("Błąd podczas pobierania postów dla userId:", err); // Logowanie błędu
                throw err; // Rzuć błąd dalej, aby useQuery mogło go obsłużyć
            }
        } else {
            // Gdy userId nie jest podany, pobierz posty od znajomych
            try {
                const response = await makeRequest.get(`/posts?friends=true`);
                console.log("Posty od znajomych. Odpowiedź serwera:", response.data); // Logowanie odpowiedzi
                return response.data;
            } catch (err) {
                console.error("Błąd podczas pobierania postów od znajomych:", err); // Logowanie błędu
                throw err; // Rzuć błąd dalej, aby useQuery mogło go obsłużyć
            }
        }
    });

    console.log("Status ładowania:", isLoading); // Logowanie statusu ładowania
    console.log("Błąd:", error); // Logowanie błędu
    console.log("Dane postów:", data); // Logowanie danych postów

    return (
        <div className="posts">
            {error
                ? "Coś poszło źle"
                : isLoading
                    ? "Loading"
                    : data.length > 0 
                    ?  // Dodaj to przed renderowaniem komponentu Post
                      data.map((post) => {
                          console.log("Renderowanie postu:", post); // Logowanie postu przed renderowaniem
                          return <Post post={post} key={post.id} />;
                      })
                    : <p>Brak postów do wyświetlenia.</p> // Informacja, gdy nie ma postów
            }
        </div>
    );
};

export default Posts;
