import {auth, firestore } from "./FirebaseConfig"
import {updateDoc, collection, getDocs, getDoc, doc, arrayUnion} from "firebase/firestore"
import { useEffect, useState } from "react"


export default function FollowButton(props){
    const [buttonText, setButtonText] = useState("Follow")

    function handleClick(){
        addProfileToCurrentUsersProfile(props.accountToFollow)
        addNewFollowToAccountFollowed(props.accountToFollow)
    }

    useEffect(()=>{
        if(props.isFollowed===true){
            setButtonText("Following")
        }
    },[props.isFollowed])

    return (
        <button onClick={handleClick} className="followButton">{buttonText}</button>
    )
}


function addProfileToCurrentUsersProfile(accountToFollow){
        console.log(accountToFollow)
        let collectionRef=collection(firestore, "users")
        let docRef= doc(collectionRef, auth.currentUser.uid)
        updateDoc(docRef, {following : arrayUnion(accountToFollow)})
}

function addNewFollowToAccountFollowed(accountToFollow){
    let collectionRef= collection(firestore, "users")
    let docRef=doc(collectionRef, accountToFollow)
    updateDoc(docRef, {followers: arrayUnion(auth.currentUser.uid)})
}
