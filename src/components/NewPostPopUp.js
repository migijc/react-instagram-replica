import {useState, useEffect} from "react"
import {storage,} from "./FirebaseConfig"
import{getDownloadURL, ref, uploadBytes} from "firebase/storage"
import { firestore ,auth } from "./FirebaseConfig"
import {addDoc, collection, updateDoc, setDoc, doc} from "firebase/firestore"
import noProfilePic from "../img/noProfilePic.png"
import Username from "./Username"
import createImg from "../img/createDivImage.png"
import {BiArrowBack} from "react-icons/bi"

export default function NewPostPopUp(props){
    const [imgToAdd, setImgToAdd] = useState(null)
    const [toAddDescription, setToAddDescription] = useState(false)
    const [postCaption, setPostCaption] = useState(null)
    const [nextAction, setNextAction] = useState("Next")
    const [filesOBJ, setFilesOBJ] = useState(null)

    let collectionRef=collection(firestore, "usersPosts")
    

    function handlePreview(e){
        let thumbnailURL = URL.createObjectURL(e.target.files[0])
        setFilesOBJ(e.target.files[0])
        setImgToAdd(thumbnailURL)
    }


    async function handleNextBtnClick(){
        if(nextAction=== "Share"){
            let returnList = []
            let likedBy=[]
            let postDir=ref(storage, `${props.UID}/posts/${filesOBJ.name}`)
            let upload = await uploadBytes(postDir, filesOBJ)
            returnList.push(upload.metadata.timeCreated)
            let downloadURL= await getDownloadURL(upload.ref)
            returnList.push(downloadURL)
            returnList.push(postCaption)
            returnList.push(props.currentUsername)
            returnList.push(auth.currentUser.uid)
            let postsCollection=collection(firestore, "users", `${props.UID}`, "posts")
            let newPostRef= doc(postsCollection)
            let addDocTask=await addDoc(postsCollection, {
                postDetails: returnList,
                likedBy,
                numOfCommentsOnPost:0
            })
            // console.log(addDocTask)
            // let commentCollectionRef= collection(firestore, "users", props.UID, "posts", addDocTask.id, "comments")
            // let addGhostComment= setDoc(doc(commentCollectionRef, "ghost"), {
            //     details:["ghost", "a ghost comment"]
            // })
            return props.handleCompletion()
    
        }
    
        setToAddDescription(true)
         setNextAction("Share")
    }
    

    function handlePostCaption(caption){
        setPostCaption(caption)
    }

    let currentUsername=props.currentUsername

    return (
            <div id="newPostPopUp">
                <div className="newPostHeader">
                    {imgToAdd !== null && <BiArrowBack className="arrowBackIcon"/>}
                    <p className="newPostAction">Create New Post</p>
                    {imgToAdd !== null && <p className="action" onClick={handleNextBtnClick}>{nextAction}</p>}
                </div>
                <hr className="newPostBreak"/>
                <div className="newPostContent">
                    {imgToAdd===null && <div className="selectImageContainer">
                        <img className="imgInPopUp" src={createImg}/>
                        <label  className="selectImageLabel" htmlFor="imageToPost">Select from computer</label>
                        <input id="imageToPost" type="file" onChange={handlePreview} className="selectFromComputerButton" style={{visibility:"hidden", position:"absolute"}}></input>
                    </div>}
                   
                    {imgToAdd !==null && <img className="imgToAdd" src={imgToAdd} alt=" new post"></img>}
                    {toAddDescription===true && <PictureDetails handlePostCaption={handlePostCaption} currentUsername={currentUsername}/>}
                </div>

            </div>
    )
}

function PictureDetails(props){
    function handleCaptionChange(e){
        let caption= e.target.value
        props.handlePostCaption(caption)
    }

    function getProfileImage(){
        if(auth.currentUser.photoURL){
           return(
                <div className="newPostPicContainer">
                    <div className="newPostProfilePic" style={{backgroundImage: `url(${auth.currentUser.photoURL})`}}/>
                </div>
            )
        }
        else{
            return(
                <div className="newPostPicContainer">
                     <img className="newPostNoProfilePic" src={noProfilePic} alt="profile Pic"/>
                </div>
               )
            }
    }   

    return(
        <div className="newPostDescription">
            <div className="newPostUser">
                {getProfileImage()}
                <p style={{fontSize: "15px"}}>{props.currentUsername}</p>
            </div>

            <div className="captionContainer">
                <textarea onChange={handleCaptionChange} className="postCaptionInput" defaultValue="Write a caption..."></textarea>
            </div>

        </div>
    )
}


