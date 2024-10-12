import "./leftBar.scss"
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useAuth();

  return( 
  <div className="leftBar">
    <div className="container">
      <div className="menu">
        <div className="user">
          <Link to={`/profile/${currentUser.uid}`} style={{textDecoration:"none", color:"inherit"}}>
            <img 
                src={currentUser?.photoURL} // URL do zdjęcia profilowego (jeśli nie ma, to default)
                alt="profilePic"
                className="profilePic"
                referrerpolicy="no-referrer"
              />
            <span>{currentUser.displayName}</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/friends`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Friends} alt="" />
            <span>Znajomi</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Groups} alt="" />
            <span>Grupy</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Watch} alt="" />
            <span>Oglądaj</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Memories} alt="" />
            <span>Wspomnienia</span>
          </Link>
        </div>
      </div>
      <hr/>
      <div className="menu">
        <span>Twoje skróty</span>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Events} alt="" />
            <span>Wydarzenia</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Gaming} alt="" />
            <span>Gry</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Gallery} alt="" />
            <span>Galeria</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Videos} alt="" />
            <span>Filmy</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Messages} alt="" />
            <span>Wiadomości</span>
          </Link>
        </div>
      </div>
      <hr />
      <div className="menu">
        <span>Inne</span>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Fund} alt="" />
            <span>Zbiórki pieniędzy</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </Link>
        </div>
        <div className="item">
          <Link to={`/`} style={{textDecoration:"none", color:"inherit"}}>
            <img src={Courses} alt="" />
            <span>Kursy</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default LeftBar;
