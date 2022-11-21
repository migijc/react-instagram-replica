import {auth} from "./FirebaseConfig"
import {createUserWithEmailAndPassword ,onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth"
import {useState, useEffect} from "react"
import {collection, getDoc, getDocs, setDoc, doc} from "firebase/firestore"
import {firestore} from "./FirebaseConfig"
import { useNavigate } from "react-router"
import {storage} from "./FirebaseConfig"
import {ref, uploadBytes} from "firebase/storage"
import SignUpForm from "./SignUp"
import signInImg from "../img/signInImg.png"
import logoInSignIn from "../img/logoInSign.png"
import {AiFillFacebook} from "react-icons/ai"
import getTheApp from "../img/getTheApp.png"


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

    function returnToLogin(){
        setToCreateAccount(false)
    }

    return (
        <div>
            {toCreateAccount===false && <SignInForm handleEmail={handleEmail} handlePassword={handlePassword} handleSignUpClick={handleSignUpClick} handleLogin={handleLogin}/>}
            {toCreateAccount===true && <SignUpForm returnToLogin={returnToLogin}/>}
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
        <div className="signInPage">
            <img className="loginPageImg" src={signInImg}/>

            <div className="signInContainer">
                <form className="signInForm">
                    <img  className="logoInForm" src={logoInSignIn}/>
                    <input className="inputOne" onChange={props.handleEmail} placeholder="Email/Username or telephone"></input>
                    <input onChange={props.handlePassword} placeholder="Password" type="password"></input>
                    <button className="loginButton" onClick={props.handleLogin}>Log in</button>
                    <p className="or">Or</p>
                    <div className="signInWithFBContainer">
                        <AiFillFacebook className="fbLogo"/>
                        <p>Log in with Facebook</p>
                    </div>

                    <p className="forgotPassword">Forgot Password</p>
                   
                </form>

                    <div className="signUpSec">
                        <p>Don't have an account?</p>
                        <button onClick={props.handleSignUpClick} >Sign up</button>
                        {/* <button onClick={signUserOut}>Sign out</button> */}
                    </div>

                    <div className="getTheAppCon">
                <p>Get the app.</p>
                <img src={getTheApp} className="getAppImgs" alt="Redirect to get the app site"/>
            </div>

            </div>
         

       
        </div>
 
    )
}

