import {useState, useEffect} from "react"
import {storage,} from "./FirebaseConfig"
import{getDownloadURL, ref, uploadBytes} from "firebase/storage"
import { firestore ,auth } from "./FirebaseConfig"
import {addDoc, collection, updateDoc, setDoc, doc} from "firebase/firestore"

export default function NewPostPopUp(props){
    const [imgToAdd, setImgToAdd] = useState(null)
    const [toAddDescription, setToAddDescription] = useState(false)
    const [postCaption, setPostCaption] = useState(null)
    const [nextAction, setNextAction] = useState("Next")
    const [filesOBJ, setFilesOBJ] = useState(null)

    let collectionRef=collection(firestore, "usersPosts")
    
    console.log(auth.currentUser.uid)

    function handlePreview(e){
        let thumbnailURL = URL.createObjectURL(e.target.files[0])
        setFilesOBJ(e.target.files[0])
        setImgToAdd(thumbnailURL)
    }

    function handleNextBtnClick(){
        if(nextAction==="Share"){
            let returnList=[]
            let postDir=ref(storage, `${props.UID}/posts/${filesOBJ.name}`)
            uploadBytes(postDir, filesOBJ)
            .then(response=>{
                console.log(response)
                returnList.push(response.metadata.timeCreated)
                return getDownloadURL(response.ref)
            }).then(response=>{
                returnList.push(response)
                returnList.push(postCaption)
                returnList.push(null)
                returnList.push(0)
                console.log(returnList)
                let postsCollection=collection(firestore, "users", `${props.UID}`, "posts")
                let newPostRef=doc(postsCollection)
                addDoc(postsCollection, {
                    postDetails: returnList
                })
                
            })

            return props.handleCompletion()
        }
        setToAddDescription(true)
        setNextAction("Share")
    }

    function handlePostCaption(caption){
        setPostCaption(caption)
    }


    return (
            <div id="newPostPopUp">
                <div className="newPostHeader">
                    {imgToAdd !== null && <p>{"<---"}</p>}
                    <p className="newPostAction">Create New Post</p>
                    {imgToAdd !== null && <p onClick={handleNextBtnClick}>{nextAction}</p>}
                </div>
                <hr className="newPostBreak"/>
                <div className="newPostContent">
                    {imgToAdd===null && <label htmlFor="imageToPost">Select from computer</label>}
                    {imgToAdd===null && <input id="imageToPost" type="file" onChange={handlePreview} className="selectFromComputerButton" style={{visibility:"hidden", position:"absolute"}}></input>}
                    {imgToAdd !==null && <img className="imgToAdd" src={imgToAdd} alt=" new post"></img>}
                    {toAddDescription===true && <PictureDetails handlePostCaption={handlePostCaption}/>}
                </div>

            </div>
    )
}

function PictureDetails(props){
    function handleCaptionChange(e){
        let caption= e.target.value
        props.handlePostCaption(caption)
    }

    return(
        <div className="newPostDescription">
            <div className="newPostUser">
                <div className="newPostProfilePic"/>
                <p>User_Name</p>
            </div>

            <div className="captionContainer">
                <textarea onChange={handleCaptionChange} className="postCaption" defaultValue="Write a caption..."></textarea>
            </div>

        </div>
    )
}