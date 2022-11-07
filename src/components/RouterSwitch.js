import {BrowserRouter, Routes, Route} from "react-router-dom"
import LoginPage from "./LoginPage"
import HomePage from "./HomePage" 
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import Profile from "./Profile"
import { createUserWithEmailAndPassword} from "firebase/auth"
import { auth, firestore, storage } from "./FirebaseConfig"
import {setDoc, doc, getDocs, getDoc, collection} from "firebase/firestore"
import { uploadBytes, ref } from "firebase/storage"
import MenuBar from "./MenuBar"






export default function RouterSwitch(){
    const [currentUserID, setCurrentuserID] = useState(null)
    const [refreshForNewPost, setRefreshForNewPost] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)
    let Menu= <MenuBar/>

    async function getCurrentUser(){
        const collectionRef=collection(firestore, "users")
        let allDocs= await getDocs(collectionRef)
        let user=allDocs.docs.filter(doc=>{
            if(doc.id===auth.currentUser.uid){
                return doc
            }
        })
        user=user[0].data()
        console.log(user)
        setCurrentUser(user)
    }


    
    // console.log(usersDoc)

    useEffect(()=>{
        onAuthStateChanged(auth, user=>{
            if(auth.currentUser){
                console.log("user Is Indeed Signed in")
                getCurrentUser()
                if(currentUserID){
                    console.log("here is the uid")
                    return
                }else{
                    console.log("userIsSigned In but stateWas not Set, now it will be")
                    getCurrentUser()
                    setCurrentuserID(user.uid)
                }
            }else{
                console.log("user signed out")
                setCurrentuserID(null)
            }
        })
    }, [])


 


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage signedIn={currentUserID}/>}/>
                <Route path="homepage" element={<HomePage signedIn={currentUserID} currentUser={currentUser} MenuBar={Menu}/>}/>
                {/* <Route path="profile" element={<UserProfile/>}/> */}
                <Route path=":usernameOfProfileToVisit" element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
    )
}