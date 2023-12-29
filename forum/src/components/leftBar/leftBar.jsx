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
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

const LeftBar = () => {

  const {currentUser} = useContext(AuthContext);

  return( 
  <div className="leftBar">
    <div className="container">
      <div className="menu">
        <div className="user">
          <img src={"/upload/"+currentUser.profilePic} alt=""/>
          <Link to={`/profile/${currentUser.username}`} style={{textDecoration:"none", color:"inherit"}}><span>{currentUser.username}</span></Link>
        </div>
        <div className="item">
          <img src={Friends} alt="" />
          <span>Znajomi</span>
        </div>
        <div className="item">
          <img src={Groups} alt="" />
          <span>Grupy</span>
        </div>
        <div className="item">
          <img src={Market} alt="" />
          <span>Marketplace</span>
        </div>
        <div className="item">
          <img src={Watch} alt="" />
          <span>Oglądaj</span>
        </div>
        <div className="item">
          <img src={Memories} alt="" />
          <span>Wspomnienia</span>
        </div>
      </div>
      <hr/>
      <div className="menu">
        <span>Twoje skróty</span>
        <div className="item">
          <img src={Events} alt="" />
          <span>Wydarzenia</span>
        </div>
        <div className="item">
          <img src={Gaming} alt="" />
          <span>Gry</span>
        </div>
        <div className="item">
          <img src={Gallery} alt="" />
          <span>Galeria</span>
        </div>
        <div className="item">
          <img src={Videos} alt="" />
          <span>Filmy</span>
        </div>
        <div className="item">
          <img src={Messages} alt="" />
          <span>Wiadomości</span>
        </div>
      </div>
      <hr />
      <div className="menu">
        <span>Inne</span>
        <div className="item">
          <img src={Fund} alt="" />
          <span>Zbiórki pieniędzy</span>
        </div>
        <div className="item">
          <img src={Tutorials} alt="" />
          <span>Tutorials</span>
        </div>
        <div className="item">
          <img src={Courses} alt="" />
          <span>Kursy</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default LeftBar;
