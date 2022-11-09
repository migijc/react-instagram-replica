import {auth, firestore} from "./FirebaseConfig"
import {getDoc, collection, onSnapshot, getDocs, doc} from "firebase/firestore"
import {useState, useEffect, } from "react"
import Post from "./Post"

export default function MainFeed(props){
    const [currentUsersFollowing, setCurrentUsersFollowing] = useState(null)
    const [postsToDisplay, setPostsToDisplay] = useState([])
    


    useEffect(()=>{
        if(currentUsersFollowing){
            currentUsersFollowing.forEach(following=>{
                getPostsOfFollowing(following, setPostsToDisplay)
            })
        }
    }, [currentUsersFollowing])

    useEffect(()=>{
       ( async function getFollowing(){
            let collectionRef= collection(firestore, "users")
            let docs= await getDocs(collectionRef)
            let user
            docs=docs.docs.filter(doc=>{
                if(doc.id===auth.currentUser.uid){
                    return user=doc
                }
            })
           let docRef=user.ref
           onSnapshot(docRef, snapshot=>{
            setCurrentUsersFollowing(snapshot.data().following)
           })
        }())
    }, [])

    return (
        <div id="mainFeed">
            {postsToDisplay.map(post=>{
                return (
                <Post 
                    key={post.id} 
                    opID={post.opID} 
                    postID={post.id}
                    currentUsername={props.currentUsername}
                    handlePostClick={props.handlePostClick}
                />)
            })}
        </div>
    )
}

async function getPostsOfFollowing(uid, cb){
    let collectionRef= collection(firestore, "users", uid, "posts" )
    let docsData= await getDocs(collectionRef)
    let listOfPosts=[]
    docsData.docs.forEach(doc=>{
        if(doc.id !== "ghost"){
            let data=doc.data()
            data.id=doc.id
            data.opID=uid
            cb(prev=>{
                return [...prev, data]
            })
        }
    })
}