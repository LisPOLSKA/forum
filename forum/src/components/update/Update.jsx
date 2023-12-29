import { useState } from "react";
import "./update.scss"
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({setOpenUpdate, user}) => {
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
        email: user.email,
        password: user.password,
        username: user.username,
        city: user.city,
        website: user.website,
      });

    const upload = async (file) =>{
        try{
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData);
            return res.data
        }catch(err){
            console.log(err)
        }
    };

    const handleChange = (e) => {
        setTexts((prev) => ({...prev, [e.target.name]: [e.target.value]}));
    };

    const queryClient = useQueryClient()

    const mutation = useMutation((user)=>{
        return makeRequest.put("/users", user);
    },{
        onSuccess: () => {
            queryClient.invalidateQueries(["user"]);
        },
    });

    const handleClick = async (e)=>{
        e.preventDefault();
        let coverUrl;
        let profileUrl;
        
        coverUrl = cover ? await upload(cover) : user.coverPic;
        profileUrl = profile ? await upload(profile) : user.profilePic;


        mutation.mutate({...texts, coverPic: coverUrl, profilePic: profileUrl});
        setOpenUpdate(false);
    };

  return (
    <div className="update">
        <div className="wrapper">
            <h1>Zaktualizuj swój profil</h1>
            <form>
                <div className="files">
                    <label htmlFor="cover">
                        <span>Zdjęcie w tle</span>
                        <div className="imgContainer">
                            <img src={cover? URL.createObjectURL(cover) : "/upload/"+user.coverPic} alt="" />
                            <CloudUploadIcon className="icon" />
                        </div>
                    </label>
                    <input type="file" id="cover" style={{display:"none"}} onChange={e=>setCover(e.target.files[0])}/>
                    <label htmlFor="profile">
                        <span>Zdjęcie profilowe</span>
                        <div className="imgContainer">
                            <img src={profile? URL.createObjectURL(profile) : "/upload/"+user.profilePic} alt="" />
                            <CloudUploadIcon className="icon" />
                        </div>
                    </label>
                    <input type="file" id="profile" style={{display: "none"}} onChange={e=>setProfile(e.target.files[0])}/>
                </div>
                <label>Email</label>
                <input type="text" value={texts.email} name="email" onChange={handleChange}/>
                <label>Hasło</label>
                <input
                    type="text"
                    value={texts.password}
                    name="password"
                    onChange={handleChange}
                />
                <label>Nazwa użytkownika</label>
                <input type="text" name="username" value={texts.username} onChange={handleChange}/>
                <label>Kraj lub miasto</label>
                <input type="text" name="city" value={texts.city} onChange={handleChange}/>
                <label>Strona internetowa</label>
                <input type="text" name="website" value={texts.website} onChange={handleChange}/>
                <button onClick={handleClick}>Zaktualizuj</button>
            </form>
            <button className="close" onClick={()=>setOpenUpdate(false)}>Zamknij</button>
        </div>
    </div>
  );
};

export default Update;
