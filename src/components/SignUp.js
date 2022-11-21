import { useState } from "react"
import { createUserWithEmailAndPassword} from "firebase/auth"
import { auth, firestore, storage } from "./FirebaseConfig"
import {setDoc, doc, getDocs, getDoc, collection} from "firebase/firestore"
import { uploadBytes, ref } from "firebase/storage"
import logoInSignUp from "../img/logoInSign.png"
import {AiFillFacebook} from "react-icons/ai"
import getTheApp from "../img/getTheApp.png"



export default function SignUpForm(props){
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
        <div className="signUpPage">
            <div className="signUpContainer">
                <img className="logoInSignUp" src={logoInSignUp} alt="logo in Sign up page"/>
                <p className="signUpMessage">Sign up to see photos and <br/> videos from your friends.</p>

                <div className="signUpWithFBContainer">
                        <AiFillFacebook className="fbLogo inSignUp"/>
                        <p className="loginText">Log in with Facebook</p>
                </div>

                <p className="or">Or</p>

                <form className="signUpForm">
                    <input onChange={updateEmail} type="email" placeholder="Email"></input>
                    <input onChange={updateFullName} type="text" placeholder="Full Name"></input>
                    <input onChange={updateUsername} type="text" placeholder="Username"></input>
                    <input onChange={updatePassword} type="password" placeholder="Password"></input>
                    <p className="infoDisclaimer">People who use our service may have uploaded your contact informaton to Instagram. Learn More</p>
                    <p className="infoDisclaimer onSignUp">By Signing up, you agree to our Terms , Privacy Policy and Cookies Policy .</p>
                    <button className="signUpButton" onClick={handleSignUp}>Sign Up</button>
                </form>
            </div>

            <div className="loginSec signUpSec">
                <p>Have an account?</p>
                <button onClick={props.returnToLogin} className="redirectToLoginButton">Log in</button>
            </div>

            <div className="getTheAppCon">
                <p>Get the app.</p>
                <img src={getTheApp} className="getAppImgs" alt="Redirect to get the app site"/>
            </div>

        </div>
    )
}

//helper functions
function addUserToFirestore(id, userName, fullName){
    let usersRef=collection(firestore, "users")
    setDoc(doc(firestore, "users", id), {
        fullName: `${fullName}`,
        username: `${userName}`,
        followers: [],
        following: [],
        profilePictureURL: null,
        bio: null,
        phoneNumber:null
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