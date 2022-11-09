import {auth, firestore} from "./FirebaseConfig"
import {collection, getDocs} from "firebase/firestore"
import {useState,  useEffect} from "react"

export default function AllUsersPosts(props){
    const [usersPosts, setUsersPosts] =useState([])
    


    
    async function getAllPosts(){
        let postsCollectionReference= collection(firestore, "users", props.ID, "posts")
        let data=await getDocs(postsCollectionReference)
        let docs= data.docs
        let returnArray=[]
        docs.forEach(doc=>{
            returnArray.push(doc.data())
            returnArray[returnArray.length-1]["id"]= doc.id
            if(doc.id==="ghost"){
                returnArray.pop()
            }
        }) 
        setUsersPosts(returnArray)
    }

    useEffect(()=>{
        getAllPosts()
    }, [])

    useEffect(()=>{
        props.getNumberOfPosts(usersPosts.length)
    })



    

    return (
        <div className="allPostsInProfile">
            {
        usersPosts.map(post=>{
            return(
                <div key={post.id} className="mockDiv" style={{backgroundImage: `URL(${post.postDetails[1]})`}}></div>
            )
        })}
        </div>
    )
}