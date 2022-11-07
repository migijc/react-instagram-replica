import { useParams} from "react-router-dom"
import AllUsersPosts from "./AllUserPosts"
import MenuBar from "./MenuBar"
import noPic from "../img/noProfilePic.png"
import { useEffect, useState } from "react"
import {getDocs, collection} from "firebase/firestore"
import { firestore } from "./FirebaseConfig"
import FollowButton from "./FollowButton"

export default function Profile(props){
    const [user, setUser] =useState(null)
    let {usernameOfProfileToVisit} = useParams()
    const allPosts= props.usersPosts
    const userID= document.querySelector("body").dataset.idtosearch
    const [numberOfPosts, setNumberOfPosts]=useState(null)

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
    
    if(user){
        return (
            <div className="profile">
                <MenuBar/>
                <div className="mainContent">
                    <div className="profileInfo">
                        <div className="profilePicInInfo">
                            <img className="profilePic"src={noPic} alt="No Profile Pic Selected"></img>
                        </div>
                        <div className="info">
                            <div className="infoHeader">
                                <p className="profileUsername">{user.username}</p>
                                <FollowButton/>
                                <p className="tempSettings">...</p>
                            </div>
                            <div className="profileContentDetails">
                                <p>{numberOfPosts} Posts</p>
                                <p>{user.followers.length} Followers</p>
                                <p>{user.following.length} Following</p>
                            </div>
                            <div className="profileNameAndBio" style={{display:"flex", flexDirection: "column", gap: ".4rem"}}>
                                <p style={{fontWeight: "900"}}>{user.fullName}</p>
                                <p>This Is a Mock BIO, Still need to implement</p>
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

 

