import { useEffect, useState } from "react"
import { auth, firestore, storage} from "./FirebaseConfig"
import {getDocs, updateDoc, collection, doc} from "firebase/firestore"
import noProfilePic from "../img/noProfilePic.png"

//Email & Website inputs disabled.
export default function EditProfile(props){
    const [newFullName, setNewFullName] = useState(null)
    const [newUsername, setNewUsername] = useState(null)
    const [newBio, setNewBio] = useState(null)
    const [newPhoneNumber, setNewPhoneNumber] = useState(null)
    const [current, setCurrent] = useState("editProfileCategory")
    const [user, setUser] = useState(null)
    const [oldPassword, setOldPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState(null)
    const [editsSubmitted, setEditsSubmitted] = useState(false)


    function handleChange(e, setStateFunction){
        setStateFunction(e.target.value)
        setEditsSubmitted(true)
    }

    function handleSubmitButtonState(){
        const possibleEdits=[newFullName, newUsername, newBio, newPhoneNumber]
        let checkForNull=possibleEdits.filter(edit=>{
            return edit===null
        })
        if(checkForNull.length===4){
            return true
        }
        return false
    }
    

    useEffect(()=>{
        if(user){
            setNewFullName(props.user.fullName)
            setNewUsername(props.user.username)
            setNewBio(props.user.bio)
            setNewPhoneNumber(props.user.phoneNumber)
        }
    },[user])

    useEffect(()=>{
        if(user===null){
            console.log("running")
            setUser(props.user)
        }
    })

    useEffect(()=>{
        if(newFullName===""){
            setNewFullName(props.user.fullName)
        }
        if(newUsername===""){
            setNewUsername(props.user.username)
        }
        if(newBio===""){
            setNewBio(props.user.bio)
        }
        if(newPhoneNumber===""){
            setNewPhoneNumber(props.user.phoneNumber)
        }

        if(editsSubmitted){
            return(()=>{

            })
        }
    })
    
    useEffect(()=>{
        if(user){
            if(document.body.querySelector(".selectedCategory")){
                let elementToRemoveClassFrom= document.querySelector(".selectedCategory")
             elementToRemoveClassFrom.classList.remove("selectedCategory")
            }
            let divOn = document.body.querySelector(`.${current}`)
            divOn.classList.add("selectedCategory")
        }
  
    }, [current])

    if(user){
            return (
                <div className="editProfile">
                {props.Menu}
                <div className="mainContent inEditProfile">
                        <div className="editContainer">
                            <div className="editCategories ">
                                <div onClick={()=> setCurrent("editProfileCategory")}  className="editCategory editProfileCategory selectedCategory">
                                    <p>Edit Profile</p>
                                </div>
                                <div className="editCategory editPasswordCategory" onClick={()=> setCurrent("editPasswordCategory")}>
                                    <p>Change Password</p>
                                </div>
                            </div>
                           {current==="editProfileCategory" && <EditProfileDetails 
                                user={props.user} 
                                handleChange={handleChange}
                                newFullName={newFullName}
                                newUsername={newUsername}
                                newBio={newBio} 
                                newPhoneNumber={newPhoneNumber}
                                setNewFullName={setNewFullName}
                                setNewUsername={setNewUsername}
                                setNewBio={setNewBio}
                                setNewPhoneNumber={setNewPhoneNumber}
                                handleSubmitButtonState={handleSubmitButtonState}
                                />}

                            {current==="editPasswordCategory" && <EditPassword
                                user={user}
                                handleChange={handleChange}
                                setOldPassword={setOldPassword}
                                setNewPassword={setNewPassword}
                                setNewPasswordConfirmation={setNewPasswordConfirmation}
                                handleSubmitButtonState={handleSubmitButtonState}
                                />}
                        </div>
                </div>
                </div>
            )
    }

}

//B4 potle was creating task function to update any edited fields in Edit profile > profile
function editProfileTask(newName, newUsername, newBio, newPhoneNumber){
    let usersCollection= collection(firestore, "users")
    let userRef= doc(usersCollection, auth.currentUser.uid)
    let potentialUpdates=[newName, newUsername, newBio, newPhoneNumber]
    let edits={
        "fullName": newName,
        "username": newUsername,
        "bio": newBio,
        "phoneNumber": newPhoneNumber
    }

    function updateTask(changesObject){
        updateDoc(userRef, changesObject)
    }

    updateDoc(userRef, edits)

}

function EditProfileDetails(props){

    return (
        <div className="editProfileOptions">
            <div className="editProfilePic">
                {auth.currentUser.photoURL && <div className="profilePicInEdit" style={{backgroundImage: `url(${auth.currentUser.photoURL})`}}></div>}
                {auth.currentUser.photoURL === null && <div className="profilePicInEdit noPic" style={{backgroundImage: `url(${noProfilePic})`}}></div>}

                <div className="nameAndChangePic">
                    <p className="usernameInEdit">{props.user.username}</p>
                    <p className="changePic">Change profile Photo</p>
                </div>
            </div>
        
            <div className="editFullNameDiv editInputDiv">
                <label className="labelInEdit" htmlFor="fullName">Name</label>
                <input id="fullName" className="editInput"  placeholder={props.user.fullName} onChange={(e)=>{props.handleChange(e, props.setNewFullName)}}/>
            </div>
            <div className="tipDiv">
                <p className="changeNameTip editTip">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
                <p className="changeNameTip editTip">You can only change you name twice within 14 days.</p>
            </div>
        
            <div className="editUsernameDiv editInputDiv">
                <label className="labelInEdit" htmlFor="username">Username</label>
                <input id="username" className="editInput" placeholder={props.user.username} onChange={(e)=>{props.handleChange(e, props.setNewUsername)}}/>
            </div>
            
            <div className="tipDiv">
                <p className="editTip editUsernameTip">In most cases you'll be able to change your username back to {props.user.username} for another 14 days.</p>
            </div>
        
            <div className="editWebsiteDiv editInputDiv">
                <label className="labelInEdit" htmlFor="website">Website</label>
                <input id="website" className="editInput" placeholder={"Website"} disabled={true}/>
            </div>
            <div className="tipDiv">
                <p className="editTip">Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>
            </div>
        
            <div className="editBioDiv editInputDiv">
                <label className="labelInEdit" htmlFor="bio">Bio</label>
                <textarea id="bio" className="bioTextarea" placeholder={props.user.bio} onChange={(e)=>{props.handleChange(e, props.setNewBio)}}></textarea>
            </div>
            <div className="tipDiv editPersonalInfoDiv">
                <h4 className="personalInfoHeader">Personal information</h4>
                <p className="editTip">Provide your personal information, even if the account is used for a business, a pet or something else. This wont be a part of your public profile. </p>
            </div>
        
            <div className="editEmailDiv editInputDiv">
                <label className="labelInEdit" htmlFor="email">Email</label>
                <input id="email" className="editInput" placeholder={auth.currentUser.email} disabled={true}/>
            </div>
            <div className="editPhoneNumberDiv editInputDiv">
                <label className="labelInEdit" htmlFor="phoneNumber">Phone number</label>
                <input id="phoneNumber" className="editInput" placeholder={props.user.phoneNumber || "000-000-0000"} onChange={(e)=>{props.handleChange(e, props.setNewPhoneNumber)}}/>
            </div>
            
            <div className="editProfileActions">
                <button disabled={props.handleSubmitButtonState()} className="submitEditsButton" onClick={()=> editProfileTask(props.newFullName, props.newUsername, props.newBio, props.newPhoneNumber)}>Submit</button>
                <button id="deleteProfileButton">Delete my account forever</button>
            </div>
        
        </div>
    )
}


function EditPassword(props){

    return (
        <div className="editProfileOptions">
           <div className="editProfilePic passwordChange" >
                <div className="profilePicInEdit" style={{backgroundImage: `url(${auth.currentUser.photoURL})`}}></div>
                <div className="nameAndChangePic">
                    <p className="usernameInEdit">{props.user.username}</p>
                </div>
            </div>

            <div className="editOldPasswordDiv editInputDiv">
                <label className="labelInEdit" htmlFor="oldPassword">Old password</label>
                <input id="oldPassword" className="editInput" onChange={(e)=>props.handleChange(e, props.setOldPassword)}/>
            </div>

            <div className="editFullNameDiv editInputDiv">
                <label className="labelInEdit" htmlFor="newPassword">New password</label>
                <input id="newPassword" className="editInput" onChange={(e)=>props.handleChange(e, props.setNewPassword)}/>
            </div>

            <div className="editFullNameDiv editInputDiv">
                <label className="labelInEdit" htmlFor="newPasswordConfirmation">Confirm new password</label>
                <input id="newPasswordConfirmation" className="editInput" onChange={(e)=>props.handleChange(e, props.setNewPasswordConfirmation)}/>
            </div>

            <div className="editProfileActions password">
                <button disabled={props.handleSubmitButtonState()} className="submitEditsButton" onClick={()=> alert("We are still working on this!")}>Change password</button>
                <button className="forgotPassword inEdit">Forgot password</button>
            </div>
        </div>
    )
}