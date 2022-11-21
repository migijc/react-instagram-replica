import { auth, firestore } from "./FirebaseConfig"
import { collection, getDocs, onSnapshot } from "firebase/firestore"
import { useState, useEffect } from "react"
import { AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import {FaComments} from "react-icons/fa"
import PostInProfile from "./PostInProfile"

export default function AllUsersPosts(props) {
    const [usersPosts, setUsersPosts] = useState(null)

    async function getAllPosts() {
        let postsCollectionReference = collection(firestore, "users", props.ID, "posts")
        let data = await getDocs(postsCollectionReference)
        let docs = data.docs
        let returnArray = []
        docs.forEach(doc => {
            returnArray.push(doc.data())
            returnArray[returnArray.length - 1]["id"] = doc.id
            returnArray[returnArray.length-1].docRef= doc.ref
            returnArray[returnArray.length-1].postCollectionRef= postsCollectionReference
            let postCommentsCollection = collection(postsCollectionReference, doc.id, "comments")
            returnArray[returnArray.length - 1].commentsCollectionReference = postCommentsCollection
            if (doc.id === "ghost") {
                returnArray.pop()
            }
        })
        setUsersPosts(returnArray)
    }

    useEffect(() => {
        getAllPosts()
    }, [props])

    useEffect(()=>{
        if(usersPosts){
            props.getNumberOfPosts(usersPosts.length)
        }
    })

    function getNumberOfComments(userPost){
        let post=usersPosts.filter(aPost=>{
            return aPost.id=userPost.id
        })
        return post.numberOfComments
    }
    
    let handlePostClick=props.handlePostClick


    if (usersPosts) {
        return (
            <div className="allPostsInProfile">
                {usersPosts.map(post => {
                    return <PostInProfile key={post.id} post={post} handlePostClick={handlePostClick}/>
                })
                }
            </div>
        )
    }
}








