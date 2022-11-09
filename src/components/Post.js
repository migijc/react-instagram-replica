import noProfilePic from "../img/noProfilePic.png"
import {AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSmile} from "react-icons/ai"
import {useEffect, useState} from "react"
import { firestore, auth } from "./FirebaseConfig"
import {doc, collection, onSnapshot, updateDoc, arrayUnion, addDoc, getDocs} from "firebase/firestore"
import PostInteractions from "./PostInteractions"
import AddComment from "./AddComment"


export default function Post(props){
    const [newComment, setNewComment] = useState(null)
    const [commentRows, setCommentRows] = useState(1)
    const [postSnapshot, setPostSnapshot] = useState(null)
    const [docRef, setDocRef] = useState(null)
    const [postCollection, setPostCollection] = useState(null)
    const [likedByUser, setLikedByyUser] = useState(false)
    const [comments, setComments] = useState(null)
    let postID=props.postID
    let currentUsername= props.currentUsername
    
    useEffect(()=>{
        console.log("working")
        let collectionRef=collection(firestore, "users", props.opID, "posts")
        setPostCollection(collectionRef)
        let docRef=doc(collectionRef, props.postID)
        setDocRef(docRef)
        let getSnapshot= onSnapshot(docRef, snapshot=>{
            setPostSnapshot(snapshot.data())
        })
        let commentsColRef= collection(collectionRef, props.postID, "comments")
        let commentSnapshots= []
        getDocs(commentsColRef)
         .then(
            response=>{
                response.docs.forEach(doc=>{
                    console.log(doc.data())
                    commentSnapshots.push(doc.data())
                })
            }
         )
        setComments(commentSnapshots) 
    }, [])

    function handleClick(){
        let postDetails= {
            postSnapshot:postSnapshot,
            postComments: comments,
            docRef:docRef,
            postCollection:postCollection,
            currentUser:props.currentUsername,
            postID:postID
        }
        props.handlePostClick(postDetails)
    }

    if(postSnapshot){
        return (
            <div className="aPostOnFeed">
                <div className="postHeader">
                    <img src={noProfilePic} alt="Profile pic"/>
                    <p>{postSnapshot.postDetails[3]}</p>
    
                </div>
    
                <div className="postImage">
                    <img src={postSnapshot.postDetails[1]} alt="A users post"/>
                </div>
    
                <div className="postInteractions">
                    <PostInteractions docRef={docRef} class="commentAndLike" postSnapshot={postSnapshot}/>
                    <p className="postLikes">{postSnapshot.likedBy.length} likes</p>
                    <div className="commentSectionInFeed">
                        <div className="captionSection">
                            <p style={{fontWeight: "600", fontSize:"14px"}}>{postSnapshot.postDetails[3]}</p>
                            <p className="postCaption">{postSnapshot.postDetails[2]}</p>
                        </div>
                        {comments.length > 0 && <p onClick={handleClick} className="postInFeedHasComments">View all {comments.length} comments</p>}
                        <p className="howLongAgoWasPostedDisplay">"XX HOURS AGO"</p>
                        <hr className="hrForComment"/>
                        <AddComment collectionRef={postCollection} postID={postID} currentUsername={currentUsername} />
                    </div>
                </div>
            </div>
        )
    }
 
}

