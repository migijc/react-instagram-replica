import {useEffect, useState} from "react"
import { firestore } from "./FirebaseConfig"
import {getDocs, collection} from "firebase/firestore"
import { useNavigate, useParams } from "react-router-dom"
import noProfilePic from "../img/noProfilePic.png"



export default function SearchBox(){
    const [searchValue, setSearchValue] = useState(null)
    const [possibleResults, setPossibleResults] = useState(null)
    let usersCollection= collection(firestore, "users")


    function handleSearchState(e){
        setSearchValue(e.target.value)
    }

    //caution: Search results may get out of hand since its returning all matching requests not only some
    //maybe need to find way to query only 10-15 rather than all matching results.


    useEffect(()=>{
        if(searchValue===""){
            setSearchValue(null)
        }
    })

    useEffect(()=>{
        if(searchValue===null){
            setPossibleResults(null)
        }
    })

    useEffect(()=>{
        if(searchValue){
            (async function getResults(){
                if(searchValue){
                    let possibleItems=[]
                    let docsData= await getDocs(usersCollection)
                    docsData.forEach(doc=>{
                        possibleItems.push(doc.data())
                        possibleItems[possibleItems.length-1].uid=doc.id
                    })
                    possibleItems=possibleItems.filter(item=>{
                        if(item.username.includes(searchValue)){
                            return item
                        }
                    })
                    setPossibleResults(possibleItems)
                }
            }())
        }

    }, [searchValue])


    return (
        <div id="searchBox">
            <div className="searchDiv">
                <h3 className="searchBoxTitle">Search</h3>
                <input className="menuSearchInput" onChange={handleSearchState} type="text" placeholder="Search"></input>
            </div>
            <hr className="searchBoxHR"/>
            <div className="searchValuesDiv">
                {searchValue=== null && <h4>Recent</h4>}
                {possibleResults !==null && possibleResults.map(result=>{
                     return <UserFromSearch username={result.username} fullName={result.fullName} key={result.uid} userID={result.uid} profilePic= {result.profilePictureURL}/>
                })}
            </div>

        </div>
    )
}


   function UserFromSearch(props){
    const {usernameOfProfileToVisit} = useParams()
    let navigate=useNavigate()



    function getProfileImage(){
        if(props.profilePic !== null){
            return <div className="profilePicInSearch" style={{backgroundImage: `url(${props.profilePic})`}}/>
        }
        else{
            return <div style={{backgroundImage:`url(${noProfilePic})`,}} className="noPicInSearch" alt="profilePic"/>
        }
    }
    

    return (
    <div className="aSearchReturn" onClick={()=> navigate(`../${props.username}`, {replace:true})}>
        {getProfileImage()}
            <div>
                <p style={{fontWeight:"900"}}>{props.username}</p>
                <p>{props.fullName}</p>
            </div>
        </div>
    )
}