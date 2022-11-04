import {auth} from "./FirebaseConfig"
import { signOut } from "firebase/auth"
import AllUsersPosts from "./AllUserPosts"
import MenuBar from "./MenuBar"
import noPic from "../img/noProfilePic.png"

export default function UserProfile(props){

    const allPosts= props.usersPosts
    
    return (
        <div className="profile">
            <MenuBar/>

            <div className="mainContent">
                <div className="profileInfo">
                    <img className="profilePic"src={noPic} alt="No Profile Pic Selected"></img>
                    <hr/>
                </div>
                <p style={{paddingBottom: "1.1rem", paddingTop:"1.1rem"}}>Posts</p>
                {/* <button onClick={()=> signOut(auth)}>Sign out</button> */}
                <AllUsersPosts allPosts={allPosts}/>
            </div>
        </div>
    )
}