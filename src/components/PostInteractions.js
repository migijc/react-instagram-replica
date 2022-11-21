import {AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSmile} from "react-icons/ai"
import {useEffect, useState} from "react"
import { firestore, auth } from "./FirebaseConfig"
import {doc, collection, onSnapshot, updateDoc, arrayUnion, addDoc, getDocs} from "firebase/firestore"

//props required:: class and docRef
export default function PostInteractions(props){
    const [isLikedByUser, setIsLikedByUser] = useState(false)

    
    function handleLike(){
        updateDoc(props.docRef,  {likedBy: arrayUnion(auth.currentUser.uid)})
    }


    useEffect(()=>{
        if(props.postSnapshot){
            if(props.postSnapshot.likedBy.includes(auth.currentUser.uid)){
                setIsLikedByUser(true)
            }
        }
        
    },[props.postSnapshot])

    return (
        <div className={props.class}>
            {isLikedByUser===false && <AiOutlineHeart className="feedIcon" onClick={handleLike}/>}
            {isLikedByUser=== true && <AiFillHeart className="feedIcon postLikedIcon" onClick={handleLike}/>}
            <AiOutlineComment className="feedIcon"/>
        </div>
    )
}
