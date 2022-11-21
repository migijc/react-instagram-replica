import noProfilePic from "../img/noProfilePic.png"
import {AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSmile} from "react-icons/ai"
import {useEffect, useState} from "react"
import { firestore, auth } from "./FirebaseConfig"
import {doc, collection, onSnapshot, updateDoc, arrayUnion, addDoc, getDocs} from "firebase/firestore"
import PostInteractions from "./PostInteractions"
import AddComment from "./AddComment"
import Username from "./Username"


export default function Post(props){
    const [postSnapshot, setPostSnapshot] = useState(null)
    const [postOpProfilePic, setPostOpProfilePic] = useState(null)
    let postID=props.postID
    let currentUsername= props.currentUsername
    let collectionRef=collection(firestore, "users", props.opID, "posts")
    let docRef=doc(collectionRef, postID)




    useEffect(()=>{
        let opDocument
        (async function getOPProfilePic(){
            let colRef= collection(firestore, "users")
            let getUser=await getDocs(colRef)
            getUser.docs.forEach(doc=>{
                if(doc.id===props.opID){
                    opDocument=doc.data()
                }
            })
        }()).then(
            response=>{
                setPostOpProfilePic(opDocument.profilePictureURL)
            }
        )
    }, [])

    useEffect(()=>{
        getPostSnapshot(props.opID, props.postID, setPostSnapshot, postSnapshot)
    },[])


    function handleClick(){
        let postDetails= {
            postSnapshot:postSnapshot,
            docRef:docRef,
            postCollection:collectionRef,
            postID:postID
        }
        props.handlePostClick(postDetails)
    }


    function getProfileImage(){
        if(postOpProfilePic){
            return <div className="openedPostProfilePic" style={{backgroundImage: `url(${postOpProfilePic})`}}/>
        }
        else{
            return <div style={{backgroundImage:`url(${noProfilePic})`, width:"3rem", height:"3rem", margin:"-.5rem"}} className="openedPostProfilePic" alt="profilePic"/>
        }
    }


    if(postSnapshot){
        return (
            <div className="aPostOnFeed">
                <div className="postHeader">
                    {getProfileImage()}
                    <Username username={postSnapshot.postDetails[3]} classString="usernameInPost"/>                   

    
                </div>
    
                <div className="postImage">
                    <img src={postSnapshot.postDetails[1]} alt="A users post"/>
                </div>
    
                <div className="postInteractions">
                    <PostInteractions docRef={docRef} class="commentAndLike" postSnapshot={postSnapshot}/>
                    <p className="postLikes">{postSnapshot.likedBy.length} likes</p>
                    <div className="commentSectionInFeed">
                        <div className="captionSection">
                            <Username username={postSnapshot.postDetails[3]} classString="usernameInPost"/>
                            <p className="postCaption">{postSnapshot.postDetails[2]}</p>
                        </div>
                        {postSnapshot.numOfCommentsOnPost > 0 && <p onClick={handleClick} className="postInFeedHasComments">View all {postSnapshot.numOfCommentsOnPost} comments</p>}
                        <p className="howLongAgoWasPostedDisplay">"XX HOURS AGO"</p>
                        <hr className="hrForComment"/>
                        <AddComment collectionRef={collectionRef} postID={postID} currentUsername={currentUsername} />
                    </div>
                </div>
            </div>
        )
    }
 
}


async function getPostSnapshot(opID, postID, setPostSnapshot){
    let collectionRef=collection(firestore, "users", opID, "posts")
    let docRef=doc(collectionRef, postID)
    onSnapshot(docRef, snapshot=>{
        setPostSnapshot(snapshot.data())
    })
}






