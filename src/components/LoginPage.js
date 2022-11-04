import {auth} from "./FirebaseConfig"
import {createUserWithEmailAndPassword ,onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth"
import {useState, useEffect} from "react"
import {collection, getDoc, getDocs, setDoc, doc} from "firebase/firestore"
import {firestore} from "./FirebaseConfig"
import { useNavigate } from "react-router"
import {storage} from "./FirebaseConfig"
import {ref, uploadBytes} from "firebase/storage"
import SignUpForm from "./SignUp"


//Main Login Page Component
export default function LoginPage(props){
    const [currentEmail, setCurrentEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [toCreateAccount, setToCreateAccount] = useState(false)
    const navigate=useNavigate()
    
    useEffect(()=>{
        if(props.signedIn !== null){
            navigate("homepage")
        }

    },[props])
    
    function handleEmail(e){
        setCurrentEmail(e.target.value)
    }

    function handlePassword(e){
        setCurrentPassword(e.target.value)
    }

    function handleLogin(e){
        e.preventDefault()
        signInWithEmailAndPassword(auth, currentEmail, currentPassword)
        .then(
            response=>{
                const user=response.user
            }
        )
    }
    
    function handleSignUpClick(e){
        e.preventDefault()
        setToCreateAccount(true)
    }

    return (
        <div>
            {toCreateAccount===false && <SignInForm handleEmail={handleEmail} handlePassword={handlePassword} handleSignUpClick={handleSignUpClick} handleLogin={handleLogin}/>}
            {toCreateAccount===true && <SignUpForm/>}
        </div>
    )
}

//signIn Compnent
function SignInForm(props){
    function signUserOut(e){
        e.preventDefault()
        signOut(auth)
    }

    return (
        <form className="signForm">
            <input onChange={props.handleEmail} placeholder="Email/Username or telephone"></input>
            <input onChange={props.handlePassword} placeholder="Password" type="password"></input>
            <button onClick={props.handleSignUpClick} >Sign up</button>
            <button onClick={signUserOut}>Sign out</button>
            <button onClick={props.handleLogin}>Log In</button>
        </form>
    )
}

