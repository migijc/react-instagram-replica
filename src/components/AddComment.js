import {AiOutlineSmile} from "react-icons/ai"
import {useEffect, useState} from "react"
import { firestore, auth } from "./FirebaseConfig"
import {doc, collection, onSnapshot, updateDoc, arrayUnion, addDoc, getDocs} from "firebase/firestore"
import PostInteractions from "./PostInteractions"

//required props : postCollection , postID, currentUsername
export default function AddComment(props){
    const [newComment, setNewComment] = useState(null)
    const [commentRows, setCommentRows] = useState(1)


    async function handleNewCommentPost(e){
        e.preventDefault()
        let commentCollection= collection(props.collectionRef, props.postID, "comments")
        let comment={
            details: [props.currentUsername, newComment]
        }
        addDoc(commentCollection, comment)
    }

    useEffect(()=>{
        updateCommentTextareaSize(newComment, setCommentRows)
     })

    return (
        <div className="addComment">
             <form className="addComment">
                <div>
                    <AiOutlineSmile className="feedIcon"/>
                    <textarea className="commentTextarea" onChange={(e)=>{setNewComment(e.target.value)}} rows={commentRows} cols={50} type="text" placeholder="Add a comment..."></textarea>
                    <button onClick={handleNewCommentPost} className="postComment">Post</button>
                </div>
            </form>
        </div>
    )
}

function updateCommentTextareaSize(newComment, setCommentRows){
    if(newComment){
        console.log(newComment)
        if(newComment.length < 41){
            (setCommentRows(1))
        }else if(newComment.length > 41 && newComment.length < 82){
            setCommentRows(2)
        }else if(newComment.length > 82){
            setCommentRows(3)
        }else if(newComment===""){
            setCommentRows(1)
        }
    }
}