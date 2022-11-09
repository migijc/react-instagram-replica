import { useParams} from "react-router-dom"
import AllUsersPosts from "./AllUserPosts"
import MenuBar from "./MenuBar"
import noPic from "../img/noProfilePic.png"
import { useEffect, useState } from "react"
import {getDocs, collection, onSnapshot, doc} from "firebase/firestore"
import { firestore } from "./FirebaseConfig"
import FollowButton from "./FollowButton"
import { auth } from "./FirebaseConfig"

export default function Profile(props){
    const [user, setUser] =useState(null)
    let {usernameOfProfileToVisit} = useParams()
    const allPosts= props.usersPosts
    const userID= document.querySelector("body").dataset.idtosearch
    const [numberOfPosts, setNumberOfPosts]=useState(null)
    const [isCurrentUsersProfile, setIsCurrentUserProfile] =useState(false)
    const [userSnapshot, setUserSnapshot] = useState(null)
    const [isFollowed, setIsFollowed] = useState(false)



    async function getUser(){
        const collectionRef=collection(firestore, "users")
        let data= await getDocs(collectionRef)
        let id
        let user= data.docs.filter(doc=>{
            if(doc.data().username=== usernameOfProfileToVisit){
                id=doc.id
                return doc
            }
        })
        user=user[0].data()
        user.id=id
        setUser(user)
    }
    
    function getNumberOfPosts(num){
        setNumberOfPosts(num)
    }

    useEffect(()=>{
        getUser()
    }, [])

    useEffect(()=>{
        if(user){
            if(user.id===auth.currentUser.uid){
                setIsCurrentUserProfile(true)
                let collectionRef=collection(firestore, "users")
                let docRef= doc(collectionRef, user.id)
                onSnapshot(docRef, (snapshot)=>{
                    let docData =snapshot.data()
                    setUserSnapshot(docData)
                })
                return
            }
            let collectionRef=collection(firestore, "users")
            let docRef= doc(collectionRef, user.id)
            onSnapshot(docRef, (snapshot)=>{
                let docData =snapshot.data()
                setUserSnapshot(docData)
            })
        }
    },[user])

    useEffect(()=>{
        if(userSnapshot){
            if(userSnapshot.followers.includes(auth.currentUser.uid)){
                setIsFollowed(true)
            }
        }
    },[userSnapshot])

    
    if(user && userSnapshot){
        return (
            <div className="profile">
                {props.MenuBar}
                <div className="mainContent">
                    <div className="profileInfo">
                        <div className="profilePicInInfo">
                            <img className="profilePic"src={noPic} alt="No Profile Pic Selected"></img>
                        </div>
                        <div className="info">
                            <div className="infoHeader">
                                <p className="profileUsername">{user.username}</p>
                                {isCurrentUsersProfile===false && <FollowButton accountToFollow={user.id} isFollowed={isFollowed}/>}
                                {isCurrentUsersProfile===true && <button>Edit Profile</button>}
                                <p className="tempSettings">...</p>
                            </div>
                            <div className="profileContentDetails">
                                <p>{numberOfPosts} Posts</p>
                                <p>{userSnapshot.followers.length} Followers</p>
                                <p>{userSnapshot.following.length} Following</p>
                            </div>
                            <div className="profileNameAndBio" style={{display:"flex", flexDirection: "column", gap: ".4rem"}}>
                                <p style={{fontWeight: "600"}}>{user.fullName}</p>
                                <p className="mockBIO">This Is a Mock BIO, Still need to implement. This Mock implement will break at 80CH and make a new line</p>
                            </div>
                        </div>
                        <hr/>
                    </div>
                    <p style={{paddingBottom: "1.1rem", paddingTop:"1.1rem"}}>Posts</p>
                    {/* <button onClick={()=> signOut(auth)}>Sign out</button> */}
                    <AllUsersPosts allPosts={allPosts} ID={user.id} getNumberOfPosts={getNumberOfPosts}/>
                </div>
            </div>
        )
    }

}

 

