import { useNavigate } from "react-router-dom"
import { useState } from "react"
import SearchBox from "./SearchBox"
import { auth } from "./FirebaseConfig"
import {MdHomeFilled} from "react-icons/md"
import {IoMdAdd} from "react-icons/io"
import {IoSearchOutline} from "react-icons/io5"
import {FiMessageSquare} from "react-icons/fi"
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import noProfilePic from "../img/noProfilePic.png"
import logo from "../img/logo.png"
import {GiHamburgerMenu} from "react-icons/gi"
import NewPostPopUp from "./NewPostPopUp"


export default function MenuBar(props){
    const [toSearch, setToSearch] = useState(false)
    const navigate = useNavigate()

    return (
        <div className="menuBar">
            <img  className="logo" src={logo} alt="Page Logo"/>
        <ul className="menuItems">
            <li onClick={()=> navigate("/homepage")}>
                <div className="homeDiv menuDiv">
                    <MdHomeFilled className="menuIcon"/>
                    <p>Home</p>
                </div>
            </li>
            <li>
                <div className="searchDiv, menuDiv"  onClick={()=> setToSearch(true)}>
                    <IoSearchOutline className="menuIcon"/>
                    <p>Search</p>
                </div>
            </li>
            <li>
                <div className="messageDiv menuDiv">
                    <FiMessageSquare className="menuIcon"/>
                    <p>Messages</p>
                </div>
            </li>
            <li>
                <div className="notificationsDiv menuDiv">
                    <AiOutlineHeart className="heartIcon menuIcon"/>
                    <p>Notifications</p>
                </div>
            </li>
            <li>
                <div className="createDiv menuDiv" onClick={()=> props.handleCreateClick()}>
                    <IoMdAdd className="menuIcon createIcon"/>
                    <p>Create</p>
                </div>
            </li>
            <li>
                <div className="profileDiv menuDiv" onClick={()=> navigate(`/${props.currentUsername}`)}>
                    <img className="picInMenu" src={noProfilePic} alt="profile Pic"/>
                    <p>Profile</p>
                </div>
            </li>
            <li>
                <div className="moreDiv menuDiv">
                    <GiHamburgerMenu className="menuIcon"/>
                    <p>More</p>
                </div>
            </li>
        </ul>
        {toSearch && <SearchBox className="menuIcon"/>}
    </div>
    )
}

//following functions are in homePage to handle menu items. Delete this once resolved
{/* <li onClick={handleCreateClick}>Create</li>
<li onClick={handleNavigationToProfile}>Profile</li> */}