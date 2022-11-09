import {BrowserRouter, Routes, Route} from "react-router-dom"
import LoginPage from "./LoginPage"
import HomePage from "./HomePage" 
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import Profile from "./Profile"
import { auth, firestore, storage } from "./FirebaseConfig"
import {setDoc, doc, getDocs, getDoc, collection} from "firebase/firestore"
import MenuBar from "./MenuBar"
import NewPostPopUp from "./NewPostPopUp"
import OpenedPost from "./OpenedPost"

export default function RouterSwitch(){
    const [currentUserID, setCurrentuserID] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [menu, setMenu] = useState(null)
    const [toCreateNewPost, setToCreateNewPost] = useState(false)
    const [postToOpen, setPostToOpen] = useState(null)

    async function getCurrentUser(){
        const collectionRef=collection(firestore, "users")
        let allDocs= await getDocs(collectionRef)
        let user=allDocs.docs.filter(doc=>{
            if(doc.id===auth.currentUser.uid){
                return doc
            }
        })
        user=user[0].data()
        setCurrentUser(user)
    }

    function handleCreateClick(){
        setToCreateNewPost(true)
    }

    function postCompleted(){
        setToCreateNewPost(false)
    }

    function handlePostClick(postInfo){
        setPostToOpen(postInfo)
    }
    
    useEffect(()=>{
        if(currentUser){
            setMenu(<MenuBar currentUsername = {currentUser.username} handleCreateClick={handleCreateClick}/>)
        }
    }, [currentUser])

    useEffect(()=>{
        onAuthStateChanged(auth, user=>{
            if(auth.currentUser){
                getCurrentUser()
                if(currentUserID){
                    return
                }else{
                    getCurrentUser()
                    setCurrentuserID(user.uid)
                }
            }else{
                setCurrentuserID(null)
            }
        })
    }, [])


    return (
        <BrowserRouter>
                {toCreateNewPost===true && <NewPostPopUp handleCompletion={postCompleted} UID={auth.currentUser.uid} currentUsername={currentUser.username}/>}
                {toCreateNewPost=== true && <button className="closeNewPostButton" onClick={()=>setToCreateNewPost(false)}>X</button>}
                {postToOpen && <OpenedPost comments={postToOpen.postComments} docRef={postToOpen.docRef} postToOpen={postToOpen}/>}
            <Routes>
                <Route path="/" element={<LoginPage signedIn={currentUserID}/>}/>
                <Route path="homepage" element={<HomePage signedIn={currentUserID} currentUser={currentUser} MenuBar={menu} handlePostClick={handlePostClick}/>}/>
                {/* <Route path="profile" element={<UserProfile/>}/> */}
                <Route path=":usernameOfProfileToVisit" element={<Profile MenuBar={menu}/>}/>
            </Routes>
        </BrowserRouter>
    )
}