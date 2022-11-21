import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import SearchBox from "./SearchBox"
import { auth } from "./FirebaseConfig"
import { signOut } from "firebase/auth"
import {MdHomeFilled} from "react-icons/md"
import {IoMdAdd} from "react-icons/io"
import {IoSearchOutline} from "react-icons/io5"
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import noProfilePic from "../img/noProfilePic.png"
import logo from "../img/logo.png"
import {GiHamburgerMenu} from "react-icons/gi"
import NewPostPopUp from "./NewPostPopUp"
import {IoLogoInstagram} from "react-icons/io5"
import {FiSettings} from "react-icons/fi"
import {FaRegBookmark, FaFacebookMessenger} from "react-icons/fa"
import {VscMenu} from "react-icons/vsc"


export default function MenuBar(props){
    const [toSearch, setToSearch] = useState(false)
    const [classList, setClassList] = useState("menuBar")
    const [openOptions, setOpenOptions] = useState(false)
    const optionMenu= useRef(null)
    const navigate = useNavigate()

    useEffect(()=>{
        if(toSearch){
            setClassList("menuBar searchOpen")
        }else{
            setClassList("menuBar")
        }
    },[toSearch])

    function getProfileImage(){
        if(auth.currentUser.photoURL){
           return <div className="profilePicInMenu" style={{backgroundImage: `url(${auth.currentUser.photoURL})`}}/>
        }
        else{
            return <img className="picInMenu" src={noProfilePic} alt="profile Pic"/>
        }
    }

    // useEffect(()=>{
    //     document.body.addEventListener("click", ()=>{
    //         setToSearch(false)
    //         setOpenOptions(false)
    //     })
    // }, [toSearch])


    return (
        <div className={classList}>
            {toSearch===false && <img  className="logo" src={logo} alt="Page Logo"/>}
            {toSearch===true && <IoLogoInstagram className="iconLogo"/>}
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
                    <FaFacebookMessenger className="menuIcon fbMessangerIcon"/>
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
                    {getProfileImage()}
                    <p>Profile</p>
                </div>
            </li>
            <li>
                <div className="moreDiv menuDiv" onClick={()=> setOpenOptions(true)}>
                    {openOptions && <div className="options" ref={optionMenu}>
                        <div className="settingsOptionDiv optionDiv optionClick" onClick={()=> navigate("/edit")}>
                            <p className="optionClick">Settings</p>
                            <FiSettings className="optionClick"/>
                        </div>
                        <hr className="hrOneOptions optionClick"/>
                        <div className="savedOptionDiv optionDiv optionClick">
                            <p className="optionClick">Saved</p>
                            <FaRegBookmark className="optionClick"/>
                        </div>
                        <hr className="hrTwoOptions"/>
                        <div onClick={()=> signOut(auth).then(()=> navigate("/"))} className="SignOutOptionDiv optionDiv optionClick">
                            <p className="optionClick">Sign Out</p>
                            <FaRegBookmark className="optionClick"/>
                        </div>
                    </div>}
                    <VscMenu className="menuIcon hamburgerMenuIcon"/>
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

