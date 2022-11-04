import {BrowserRouter, Routes, Route} from "react-router-dom"
import LoginPage from "./LoginPage"
import HomePage from "./HomePage" 
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import UserProfile from "./UserProfile"
import NonUserProfile from "./NonUserProfile"

import { createUserWithEmailAndPassword} from "firebase/auth"
import { auth, firestore, storage } from "./FirebaseConfig"
import {setDoc, doc, getDocs, getDoc, collection} from "firebase/firestore"
import { uploadBytes, ref } from "firebase/storage"
import { useParams} from "react-router-dom"






export default function RouterSwitch(){
    const [currentUserID, setCurrentuserID] = useState(null)
    const [refreshForNewPost, setRefreshForNewPost] = useState(true)
    let IDOfProfileToVisit = useParams()
    console.log(IDOfProfileToVisit)


    
    // console.log(usersDoc)

    useEffect(()=>{
        onAuthStateChanged(auth, user=>{
            if(auth.currentUser){
                console.log("user Is Indeed Signed in")
                if(currentUserID){
                    console.log("here is the uid")
                    return
                }else{
                    console.log("userIsSigned In but stateWas not Set, now it will be")
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
                <Route path="homepage" element={<HomePage signedIn={currentUserID} />}/>
                <Route path="profile" element={<UserProfile/>}/>
                <Route path=":IDOfProfileToVisit" element={<NonUserProfile/>}/>
            </Routes>
        </BrowserRouter>
    )
}