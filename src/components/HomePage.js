import {auth} from "./FirebaseConfig"
import {signOut} from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {storage} from "./FirebaseConfig"
import MenuBar from "./MenuBar"
import NewPostPopUp from "./NewPostPopUp"
import MainFeed from "./MainFeed"

export default function HomePage(props){
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        setUser(props.signedIn)
    },[])

    useEffect(()=>{
        if(auth.currentUser===null){
            navigate("/")
        }
    })

    let handlePostClick=props.handlePostClick

    if(props.currentUser){
        return (
            <div id="homePage">
                {props.MenuBar}

                <div className="mainContent">
                    <MainFeed currentUsername={props.currentUser.username} handlePostClick={handlePostClick}/>
                    <button onClick={()=> signOut(auth)}>Sign out</button>
    
                </div>
            </div>
        )
    }

}