import {auth} from "./FirebaseConfig"
import {signOut} from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {storage} from "./FirebaseConfig"
import MenuBar from "./MenuBar"
import NewPostPopUp from "./NewPostPopUp"

export default function HomePage(props){
    const [user, setUser] = useState(null)
    const [toCreatePost, setToCreatePost] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        setUser(props.signedIn)
    },[])

    useEffect(()=>{
        if(auth.currentUser===null){
            navigate("/")
        }
    })

    function handleCreateClick(){
        setToCreatePost(true)
    }

    function handleNavigationToProfile(){
        navigate("/profile")
    }

    function closeNewPostPopUp(){
        setToCreatePost(false)
    }

    let  refreshPost= props.refreshAllPosts


    let setPostOnRouter=props.setPostOnRouter
    return (
        <div id="homePage">
            <MenuBar handleNewPost={handleCreateClick} currentUser={props.currentUser}/>

            {/* does not belong here */}
            {toCreatePost===true && <NewPostPopUp handleCompletion={setToCreatePost} UID={user} refreshOnNewPost={refreshPost}/>}
            <button className="closeNewPostButton" onClick={()=>setToCreatePost(false)}>X</button>
            

            <div className="mainContent">
                <button onClick={()=> signOut(auth)}>Sign out</button>
            </div>
        </div>
    )
}