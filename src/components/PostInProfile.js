import { AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import {FaComments} from "react-icons/fa"
import {useEffect, useState} from "react"
import { onSnapshot, getDocs, collection } from "firebase/firestore"

export default function PostInProfile(props){
    const [postSnapshot, setPostSnapShot] = useState(null)

    useEffect(()=>{
        onSnapshot(props.post.docRef, snapshot=>{
            setPostSnapShot(snapshot.data())
        })
    },[])

    function handleClick(){
        let postDetails={
            postSnapshot: postSnapshot,
            docRef:props.post.docRef,
            postCollection: props.post.postCollectionRef,
            postID: props.post.id,
        }
        console.log(postDetails)
        props.handlePostClick(postDetails)
    }


    if(postSnapshot){
        return (
            <div key={props.post.id} className="postInProfile" style={{ backgroundImage: `url(${postSnapshot.postDetails[1]})`}} onClick={handleClick}>
                <div className="numOfLikesContainer containerInProfilePost">
                    <AiFillHeart className="heartIconInProfilePost" />
                    <p>{props.post.likedBy.length}</p>
                </div>
    
                <div className="numOfCommentsContainer containerInProfilePost">
                    <FaComments className="commentIconInProfilePost"/>
                    <p>{postSnapshot.numOfCommentsOnPost}</p>
                </div>
            </div>
        )
    }

}