import { useParams} from "react-router-dom"
import AllUsersPosts from "./AllUserPosts"
import noPic from "../img/noProfilePic.png"
import { useEffect, useState } from "react"
import {getDocs, collection, onSnapshot, doc} from "firebase/firestore"
import { firestore } from "./FirebaseConfig"
import FollowButton from "./FollowButton"
import { auth } from "./FirebaseConfig"
import { useNavigate } from "react-router-dom"
import {FiSettings} from "react-icons/fi"


export default function Profile(props){
    const [user, setUser] =useState(null)
    let {usernameOfProfileToVisit} = useParams()
    const [numberOfPosts, setNumberOfPosts]=useState(null)
    const [isCurrentUsersProfile, setIsCurrentUserProfile] =useState(false)
    const [isFollowed, setIsFollowed] = useState(false)
    const navigate=useNavigate()

    async function getUser(){
        const collectionRef=collection(firestore, "users")
        let data= await getDocs(collectionRef)
        let docRef
        let id
        let user= data.docs.filter(doc=>{
            if(doc.data().username=== usernameOfProfileToVisit){
                docRef=doc.ref
                id=doc.id
                return doc
            } 
            return null
        })
        
        onSnapshot(docRef, snapshot=>{
            user=snapshot.data()
            user.id=id
            setUser(user)
        })
    }

    useEffect(()=>{
        getUser()
    }, [usernameOfProfileToVisit])
    
 
    useEffect(()=>{
        console.log("ran")
        if(user){
            if(user.id===auth.currentUser.uid){
                setIsCurrentUserProfile(true)
            }else{
                setIsCurrentUserProfile(false)
            }


            if(user.followers.includes(auth.currentUser.uid)){
                 setIsFollowed(true)
            } else{
                setIsFollowed(false)
            }
        }
    },[user])

    //helper functions
    function handleProfilePicClick(){
        if(isCurrentUsersProfile){
            props.handleProfilePicClick(true)
        }
    }

    function getNumberOfPosts(num){
        setNumberOfPosts(num)
    }

    let handlePostClick=props.handlePostClick


    if(user){
        return (
            <div className="profile">
                {props.MenuBar}
                <div className="mainContent inProfile">
                    <div className="profileInfo">
                        <div className="profilePicInInfo">
                            {user.profilePictureURL && <div style={{backgroundImage:`url(${user.profilePictureURL})`}} className="profilePic profilePicInProfile" alt="a profile pic" onClick={handleProfilePicClick}/>}
                            {!user.profilePictureURL && <img className="profilePic"src={noPic} alt="No Profile Pic Selected" onClick={handleProfilePicClick}/>}
                        </div>
                        <div className="info">
                            <div className="infoHeader">
                                <p className="profileUsername">{user.username}</p>
                                {isCurrentUsersProfile===false && <FollowButton accountToFollow={user.id} isFollowed={isFollowed}/>}
                                {isCurrentUsersProfile===true && <button onClick={()=>navigate("/edit")} className="editProfileButton">Edit Profile</button>}
                                <FiSettings  onClick={()=>navigate("/edit")} style={{fontSize: "1.2rem"}}/>
                            </div>
                            <div className="profileContentDetails">
                                <p>{numberOfPosts} Posts</p>
                                <p>{user.followers.length} Followers</p>
                                <p>{user.following.length} Following</p>
                            </div>
                            <div className="profileNameAndBio" style={{display:"flex", flexDirection: "column", gap: ".4rem"}}>
                                <p style={{fontWeight: "600"}}>{user.fullName}</p>
                                <p className="mockBIO">{user.bio||""}</p>
                            </div>
                        </div>
                        <hr/>
                    </div>
                    <p style={{paddingBottom: "1.1rem", paddingTop:"1.1rem"}}>Posts</p>
                    <AllUsersPosts ID={user.id} getNumberOfPosts={getNumberOfPosts} handlePostClick={handlePostClick}/>
                </div>
            </div>
        )
    }

}

 

