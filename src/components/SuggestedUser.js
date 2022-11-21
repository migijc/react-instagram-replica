import { useState, useEffect } from "react"
import {auth, firestore} from "./FirebaseConfig"
import {getDocs, collection, getDoc} from "firebase/firestore"
import noProfilePic from "../img/noProfilePic.png"
import Username from "./Username"


export default function AllSuggestedUsers(props){
    const [allusers, setAllUsers] = useState(null)

    useEffect(()=>{
        (async function getSuggestedUsers(){
            let usersList=[]
            let usersCollectionRef= collection(firestore, "users")
            let userDocs= await getDocs(usersCollectionRef)
            userDocs.docs.forEach(doc=>{
                if((doc.data().followers.includes(auth.currentUser.uid)===false ) && (doc.data().username !== props.username)){
                    usersList.push(doc.data())
                }
            })
            setAllUsers(usersList.slice(0,5))
        }())
    }, [props.username])

    if(allusers){
        return (
            <div className="suggestedUsersContainer">
                {allusers.map(user=>{
                    return <SuggestedUser key={allusers.indexOf(user)} user={user}/>
                })}
            </div>
        )
    }
}


function SuggestedUser(props){
    return (
        <div className="suggestedUser">
            {props.user.profilePictureURL && <div className="suggestedProfilePic" style={{backgroundImage: `url(${props.user.profilePictureURL})`}}></div>}
            {props.user.profilePictureURL ===null && <div className="suggestedProfilePic noPic" style={{backgroundImage: `url(${noProfilePic})`}}></div>}
            <div className="suggestedUserInfo">
                <Username username={props.user.username} classString="suggestedUsername"/>
                {/* <p className="suggestedUsername">{props.user.username}</p> */}
                <p className="suggestedFollowedBy">Followed by {props.user.followers.length}</p>
            </div>
            <button className="followSuggestedButton">Follow</button>

        </div>
    )
}