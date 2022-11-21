import { AiOutlineSmile } from "react-icons/ai"
import { useEffect, useState, useRef } from "react"
import { firestore, auth } from "./FirebaseConfig"
import { doc, collection, onSnapshot, updateDoc, arrayUnion, addDoc, getDocs } from "firebase/firestore"
import PostInteractions from "./PostInteractions"
import { ref } from "firebase/storage"

//required props : postCollection , postID, currentUsername
export default function AddComment(props) {
    const [newComment, setNewComment] = useState("")
    const [commentRows, setCommentRows] = useState(1)
    const [submitDisabled, setSubmitDisabled] = useState(true)

    async function handleNewCommentPost(e) {
        e.preventDefault()
        let commentCollection = collection(props.collectionRef, props.postID, "comments")
        console.log(commentCollection)
        let comment = {
            details: [props.currentUsername, newComment]
        }
        // commentInput.value=""
        setNewComment(null)
        await addDoc(commentCollection, comment)
        let comments= await getDocs(commentCollection)
        updateDoc(commentCollection.parent, {numOfCommentsOnPost: comments.docs.length})
    }

    useEffect(() => {
        updateCommentTextareaSize(newComment, setCommentRows)
        setSubmitDisabled(buttonDisabledState)
        if (newComment === null) {
            return (() => {
                // commentInput.value=""
                setNewComment("")
                setCommentRows(1)
            })
        }
    })

    function buttonDisabledState() {
        if (newComment === null || newComment === "") {
            return true
        }
        return false
    }

    return (
        <div className="addComment">
            <form className="addComment">
                <div>
                    <AiOutlineSmile className="feedIcon" />
                    <textarea className="commentTextarea" onChange={(e) => { setNewComment(e.target.value) }} value={newComment} rows={commentRows} cols={50} type="text" placeholder="Add a comment..."></textarea>
                    <button disabled={submitDisabled} onClick={(e) => handleNewCommentPost(e)} className="postComment">Post</button>
                </div>
            </form>
        </div>
    )
}

function updateCommentTextareaSize(newComment, setCommentRows) {
    if (newComment) {
        console.log(newComment)
        if (newComment.length < 41) {
            (setCommentRows(1))
        } else if (newComment.length > 41 && newComment.length < 82) {
            setCommentRows(2)
        } else if (newComment.length > 82) {
            setCommentRows(3)
        } else if (newComment === "") {
            setCommentRows(1)
        }
    }
}