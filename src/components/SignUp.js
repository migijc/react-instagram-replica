import { useState } from "react"
import { createUserWithEmailAndPassword} from "firebase/auth"
import { auth, firestore, storage } from "./FirebaseConfig"
import {setDoc, doc, getDocs, getDoc, collection} from "firebase/firestore"
import { uploadBytes, ref } from "firebase/storage"


export default function SignUpForm(){
    const [email, setEmail] = useState("")
    const [fullName, setFullname] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function updateEmail(e){
        setEmail(e.target.value)
    }
    function updateFullName(e){
        setFullname(e.target.value)
    }
    function updateUsername(e){
        setUsername(e.target.value)
    }
    function updatePassword(e){
        setPassword(e.target.value)
    }

    async function handleSignUp(e){
        e.preventDefault()
        let createUserTask = await createUserWithEmailAndPassword(auth, email, password)
        console.log(createUserTask)
        let user=createUserTask.user
        addUserToFirestore(user.uid, username, fullName)
    }

    return(
        <form>
            <input onChange={updateEmail} type="email" placeholder="Email"></input>
            <input onChange={updateFullName} type="text" placeholder="Full Name"></input>
            <input onChange={updateUsername} type="text" placeholder="Username"></input>
            <input onChange={updatePassword} type="password" placeholder="Password"></input>
            <button onClick={handleSignUp}>Sign Up</button>
        </form>
    )
}

//helper functions
function addUserToFirestore(id, userName, fullName){
    let usersRef=collection(firestore, "users")
    setDoc(doc(firestore, "users", id), {
        fullName: `${fullName}`,
        username: `${userName}`,
        followers: [],
        following: []
    }).then(
        response=>{
            CreateUserStorage(id)
            createFirestorePostsCollection(id)
        }
    )
}

function CreateUserStorage(UID){
    let storageRoot=storage
    let newFolder= ref(storageRoot, `${UID}/posts/ghostFile`)
    uploadBytes(newFolder, "ghostFile")
}

function createFirestorePostsCollection(UID){
    let postsCollection=collection(firestore, "users", `${UID}`, "posts")
    let ghostDoc= doc(postsCollection, "ghost")
    setDoc(ghostDoc, {})

}