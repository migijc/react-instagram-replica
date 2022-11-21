import AddComment from "./AddComment"
import PostInteractions from "./PostInteractions"
import { auth, firestore } from "./FirebaseConfig"
import { useEffect, useState } from "react"
import { getDocs, collection } from "firebase/firestore"
import noProfilePic from "../img/noProfilePic.png"
import Username from "./Username"

export default function OpenedPost(props){
    const [openedPostOpProfilePic, setOpenedPostOpProfilePic] = useState(null)
    const [comments, setComments] = useState(null)

    useEffect(()=>{
        getComments()
        let opDocument
        (async function getOPProfilePic(){
            let colRef= collection(firestore, "users")
            let getUser=await getDocs(colRef)
            getUser.docs.forEach(doc=>{
                if(doc.data().username===props.postToOpen.postSnapshot.postDetails[3]){
                    opDocument=doc.data()
                }
            })
        }()).then(
            response=>{
                setOpenedPostOpProfilePic(opDocument.profilePictureURL)
            }
        )
    }, [])

   

    async function getComments(){
        let commentsList=[]
        let commentsCol=collection(props.postToOpen.postCollection, props.postToOpen.postID, "comments")
        let commentDocs= await getDocs(commentsCol)
        commentDocs.forEach(doc=>{
            commentsList.push(doc.data())
        })
        console.log(commentsList)
        setComments(commentsList)
    }

    function getProfileImage(){
        if(openedPostOpProfilePic){
            return <div className="openedPostProfilePic" style={{backgroundImage: `url(${openedPostOpProfilePic})`}}/>
        }
        else{
            return <div style={{backgroundImage:`url(${noProfilePic})`, width:"3rem", height:"3rem", margin:"-.5rem"}} className="openedPostProfilePic" alt="profilePic"/>
        }
    }

    if(comments){
        return (
            <div id="openedPost">
                <div id="imageContainer">
                    <img src={props.postToOpen.postSnapshot.postDetails[1]} alt="Opened Post Pic"/>
                </div>
    
                <div id="openedPostInteractions">
                    <div id="openedPostHeader">
                        {getProfileImage()}
                        <Username username={props.postToOpen.postSnapshot.postDetails[3]} classString="opUsernameInOpenedPost"/>
                        <p>...</p>
                    </div>
                    <hr className="postHeaderHR"/>
                    <div id="opPostInfo">
                        <div className="profilePicInOpenedPost">
                            {getProfileImage()}
                        </div>
                        <div id="captionInOpenedPost">
                            <Username username={props.postToOpen.postSnapshot.postDetails[3]} classString="opUsernameInOpenedPost" forComment={props.postToOpen.postSnapshot.postDetails[2]}/>
                            {/* <p id="theCaption">{props.postToOpen.postSnapshot.postDetails[2]}</p> */}
                            <p className="timePostedAgoInOpenedPost">3h</p>
                        </div>
                    </div>
                    <div className="commentsContainerInOpenedPost">
                        {comments.map(comment=>{
                            return (
                                <Comment 
                                    commentOpUsername={comment.details[0]} 
                                    comment={comment.details[1]}
                                    key={Math.random()}
                                />
                            )
                        })}
                    </div>
                    <div className="interactWithOpenedPost">
                        <hr className="hrForInteractContainer"/>
                        <PostInteractions class="commentAndLike inOpenedPost" docRef={props.postToOpen.docRef} postSnapshot={props.postToOpen.postSnapshot}/>
                        <p className="openedPostLikes">{props.postToOpen.postSnapshot.likedBy.length} likes</p>
                        <p className="timePostedAgoInOpenedPost">3h</p>
                        <hr className="hrForComment"/>
                        <AddComment collectionRef={props.postToOpen.postCollection} postID={props.postToOpen.postID} currentUsername={props.currentUser}/>
                    </div>
    
                </div>
            </div>
        )
    }
   
}

function Comment(props){
    const [openedPostCommentProfilePic, setOpenedPostOpProfilePic] = useState(0)
    useEffect(()=>{
        let opDocument
        (async function getOPProfilePic(){
            let colRef= collection(firestore, "users")
            let getUser=await getDocs(colRef)
            getUser.docs.forEach(doc=>{
                if(doc.data().username===props.commentOpUsername){
                     opDocument=doc.data()
                     console.log(true)
                     console.log(opDocument)

                }
            })
        }()).then(
            response=>{
                setOpenedPostOpProfilePic(opDocument.profilePictureURL)
            }
        )
    }, [])

    if(openedPostCommentProfilePic !== 0){
        return (
            <div className="aCommentInOpenedPost">
                <div className="commentContent">
                   {openedPostCommentProfilePic && <div className="openedPostProfilePic" style={{backgroundImage: `url(${openedPostCommentProfilePic})`}}/>}
                  {openedPostCommentProfilePic=== null && <div className="openedPostProfilePic noPic" style={{backgroundImage: `url(${noProfilePic})`}} />}
    
                    <div className="openedPostUserAndComment">
                        <Username username={props.commentOpUsername} classString="newTest" forComment={props.comment}/>
                        {/* <p className="aCommentInOpenedPost">{props.comment}</p> */}
                    </div>
                   
                </div>
    
              <p className="timePostedAgoInOpenedPost inComment">3h</p>
    
            </div>
        )
    }
    

}