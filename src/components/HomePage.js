import {auth, firestore} from "./FirebaseConfig"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AllSuggestedUsers from "./SuggestedUser"
import MainFeed from "./MainFeed"
import noProfilePic from "../img/noProfilePic.png"
import { signOut } from "firebase/auth"
import Username from "./Username"


export default function HomePage(props){
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [currentUser, setcurrentUser] =useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        setcurrentUser(props.currentUser)
    },[])

    useEffect(()=>{
        if(auth.currentUser===null){
            navigate("/")
        }
    })


    function handleSwitchClick(){
        signOut(auth).then(()=>{
            navigate('/')
        })
        
    }
    

    let handlePostClick=props.handlePostClick

    if(props.currentUser){
        return (
            <div id="homePage">
                {props.MenuBar}
                <div className="mainContent">
                    <MainFeed currentUsername={props.currentUser.username} handlePostClick={handlePostClick}/>

                    <div className="profileAndSuggestions">
                        <div className="switchProfile">
                            {props.currentUser.profilePictureURL && <div className="profilePicInSwitchCon" style={{backgroundImage: `url(${props.currentUser.profilePictureURL})`}}></div>}
                           {props.currentUser.profilePictureURL === null && <div className="profilePicInSwitchCon noPic" style={{backgroundImage: `url(${noProfilePic})`}}></div>}
                            <div className="userInfoInSwitch">
                                <Username username={props.currentUser.username} classString="usernameInSwitch"/>
                                <p>{props.currentUser.fullName}</p>
                            </div>
                            <button className="switchAccountButton" onClick={handleSwitchClick}>Switch</button>
                        </div>
                        <h4 className="suggestionsHeader">Suggestions For You</h4>
                        <AllSuggestedUsers username={props.currentUser.username}/>
                    </div>
                </div>
            </div>
        )
    }
}
