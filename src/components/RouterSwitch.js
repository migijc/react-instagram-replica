import {BrowserRouter, Routes, Route} from "react-router-dom"
import { useEffect, useState } from "react"
import { auth, firebaseApp, firestore, storage } from "./FirebaseConfig"
import {setDoc, doc, getDocs, getDoc, collection, updateDoc, onSnapshot} from "firebase/firestore"
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { onAuthStateChanged } from "firebase/auth"
import MenuBar from "./MenuBar"
import NewPostPopUp from "./NewPostPopUp"
import OpenedPost from "./OpenedPost"
import UpdateProfilePic from "./UpdateProfilePic"
import LoginPage from "./LoginPage"
import HomePage from "./HomePage" 
import Profile from "./Profile"
import EditProfile from "./EditProfile"


export default function RouterSwitch(){
    const [currentUserID, setCurrentuserID] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [menu, setMenu] = useState(null)
    const [toCreateNewPost, setToCreateNewPost] = useState(false)
    const [postToOpen, setPostToOpen] = useState(null)
    const [openUpdateProfilePic, setOpenUpdateProfilePic] =useState(false)
    const [newProfilePic, setNewProfilePic] = useState(null)
    

    async function getCurrentUser(){
        const collectionRef=collection(firestore, "users")
        let allDocs= await getDocs(collectionRef)
        let user=allDocs.docs.filter(doc=>{
            if(doc.id===auth.currentUser.uid){
                return doc
            }
        })
        
        onSnapshot(user[0].ref, snapshot=>{
            setCurrentUser(snapshot.data())
        })
        // user=user[0].data()
        // setCurrentUser(user)
    }

    function handleCreateClick(){
        setToCreateNewPost(true)
    }

    function handleProfilePicClick(boolean){
        setOpenUpdateProfilePic(boolean)
    }

    function postCompleted(){
        setToCreateNewPost(false)
    }

    function handlePostClick(postInfo){
        setPostToOpen(postInfo)
    }

    function handleNewProfilePic(newPic){
        setNewProfilePic(newPic)
    }


    useEffect(()=>{
        if(currentUser){
            auth.currentUser.photoURL=currentUser.profilePictureURL
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
                setMenu(null)
                setCurrentuserID(null)
            }
        })
    }, [])

    useEffect(()=>{
        if(newProfilePic){
            updateProfilePicTask(currentUserID, newProfilePic)
        }
    }, [newProfilePic])

    function closeAllPopUps(){
        setToCreateNewPost(false)
        setPostToOpen(null)
    }
    

    

    
    return (
        <BrowserRouter>
                {toCreateNewPost===true && <NewPostPopUp handleCompletion={postCompleted} UID={auth.currentUser.uid} currentUsername={currentUser.username}/>}
                {toCreateNewPost=== true && <button className="closePopUpsButton" onClick={closeAllPopUps}>X</button>}
                {postToOpen && <button className="closePopUpsButton" onClick={closeAllPopUps}>X</button>}

                {postToOpen && <OpenedPost postToOpen={postToOpen} currentUser={currentUser.username}/>}
                {openUpdateProfilePic===true && <UpdateProfilePic handleProfilePicClick={handleProfilePicClick} setNewProfilePic={setNewProfilePic}/>}
            <Routes>
                <Route path="/" element={<LoginPage signedIn={currentUserID}/>}/>
                <Route path="homepage" element={<HomePage signedIn={currentUserID} currentUser={currentUser} MenuBar={menu} handlePostClick={handlePostClick}/>}/>
                {auth.currentUser && <Route path=":usernameOfProfileToVisit" element={<Profile MenuBar={menu} handleProfilePicClick={handleProfilePicClick} handlePostClick={handlePostClick}/>}/>}
                {auth.currentUser && <Route path="edit" element={<EditProfile Menu={menu} user={currentUser}/>}/>}
            </Routes>
        </BrowserRouter>
    )
}

async function updateProfilePicTask(currentUserID, newProfilePic){
    let storageRef= ref(storage, `${currentUserID}/profilePicture`)
    let upload= await uploadBytes(storageRef, newProfilePic)
    let profilePicURL=await getDownloadURL(upload.ref)
    auth.currentUser.photoURL= profilePicURL
    let userColRef= collection(firestore, "users") 
    let docRef=doc(userColRef, auth.currentUser.uid)
    let updateTask=updateDoc(docRef, {profilePictureURL: profilePicURL})
}   

