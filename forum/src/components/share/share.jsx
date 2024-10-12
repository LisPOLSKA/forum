import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";

const Share = () => {
    const [file, setFile] = useState(null);
    const [desc, setDesc] = useState("");
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    const upload = async () => {
        if (!file) return ""; // Zwróć pusty string, gdy nie ma pliku

        try {
            const formData = new FormData();
            formData.append("file", file);
            console.log("Uploading file:", file); // Logujemy przesyłany plik
            
            const res = await makeRequest.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Upewnij się, że nagłówek jest ustawiony na multipart/form-data
                },
            });
            
            console.log("Upload response:", res.data); // Logujemy odpowiedź
            return res.data; // Zwróć odpowiedź (zakładając, że to jest nazwa pliku)
        } catch (err) {
            console.error("Error during file upload:", err); // Logowanie błędów
            return ""; // W przypadku błędu zwróć pusty string
        }
    };

    const mutation = useMutation((newPost) => {
        return makeRequest.post("/posts", newPost);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]); // Odświeżanie zapytań o posty po udanym przesłaniu
        },
    });

    const handleClick = async (e) => {
        e.preventDefault();
        let imgUrl = await upload(); // Zmiana: zawsze wykonaj upload

        // Tworzymy nowy post, imgUrl może być pustym stringiem
        mutation.mutate({ desc, img: imgUrl, userId: currentUser.uid });

        // Resetowanie stanu
        setDesc("");
        setFile(null);
    };

    return (
        <div className="share">
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img 
                            src={currentUser?.photoURL} // URL do zdjęcia profilowego (jeśli nie ma, to default)
                            alt="profilePic"
                            className="profilePic"
                            referrerPolicy="no-referrer"
                        />
                        <textarea 
                            placeholder={`Co chcesz przekazać ${currentUser.username}?`} 
                            onChange={e => setDesc(e.target.value)} 
                            value={desc} 
                        />
                    </div>
                    <div className="right">
                        {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
                    </div>
                </div>
                <hr />
                <div className="bottom">
                    <div className="left">
                        <input 
                            type="file" 
                            id="file" 
                            style={{ display: "none" }} 
                            onChange={e => setFile(e.target.files[0])} 
                            accept="image/*" 
                        />
                        <label htmlFor="file">
                            <div className="item">
                                <img src={Image} alt="" />
                                <span>Add Image</span>
                            </div>
                        </label>
                        <div className="item">
                            <img src={Map} alt="" />
                            <span>Add Place</span>
                        </div>
                        <div className="item">
                            <img src={Friend} alt="" />
                            <span>Tag Friends</span>
                        </div>
                    </div>
                    <div className="right">
                        <button onClick={handleClick}>Share</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;
